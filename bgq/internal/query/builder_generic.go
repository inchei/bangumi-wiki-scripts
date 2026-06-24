package query

import (
	"fmt"
)

// manyToManyConfig configures a generic many-to-many filter.
type manyToManyConfig struct {
	junction       string // junction table name
	alias          string // short alias for junction table (optional, defaults to full table name)
	mainAlias      string // main entity alias
	mainPK         string // primary key column on main entity (e.g. "id", "person_id")
	junctionMainFK string // FK column in junction referencing main entity (e.g. "subject_id", "person_id")
	relatedAlias   string // related entity alias
	relatedTable   string // related entity table
	relatedPK      string // primary key column on related entity (e.g. "id", "person_id", "character_id")
	relatedFK      string // FK column in junction referencing related entity (e.g. "person_id", "subject_id", "character_id")
	extraCond      string // additional junction condition (already compiled, uses junction alias)
	relatedWhere   string // conditions on related entity (already compiled, uses relatedAlias)
	relatedJoin    string // JOIN clause for related entity (empty if no conditions)
	mode           string
	countOp        string
	countVal       interface{}
}

// manyToManyFilter generates SQL for a generic many-to-many relationship filter.
// Handles none/any/all/count modes. Used by staffFilter and characterFilter.
func (b *SQLBuilder) manyToManyFilter(cfg manyToManyConfig) (string, error) {
	jc := cfg.junction
	ja := cfg.alias
	if ja == "" {
		ja = jc
	}
	ma := cfg.mainAlias
	mp := cfg.mainPK
	jmf := cfg.junctionMainFK
	extra := cfg.extraCond
	if extra == "" {
		extra = "TRUE"
	}
	relWhere := cfg.relatedWhere
	if relWhere == "" {
		relWhere = "TRUE"
	}
	relJoin := cfg.relatedJoin

	// none mode
	if cfg.mode == "none" {
		if extra == "TRUE" {
			return fmt.Sprintf("NOT EXISTS (SELECT 1 FROM %s %s WHERE %s.%s = %s.%s)",
				jc, ja, ja, jmf, ma, mp), nil
		}
		return fmt.Sprintf("NOT EXISTS (SELECT 1 FROM %s %s WHERE %s.%s = %s.%s AND %s)",
			jc, ja, ja, jmf, ma, mp, extra), nil
	}

	// Build subquery predicates
	pred := extra
	if relWhere != "TRUE" {
		if pred == "TRUE" {
			pred = relWhere
		} else {
			pred = pred + " AND " + relWhere
		}
	}

	// all mode
	if cfg.mode == "all" {
		existsExtra := extra
		if existsExtra == "" {
			existsExtra = "TRUE"
		}
		// Ensure at least one row exists
		existsClause := fmt.Sprintf("EXISTS (SELECT 1 FROM %s %s WHERE %s.%s = %s.%s AND %s)",
			jc, ja, ja, jmf, ma, mp, existsExtra)

		// Count rows matching all conditions vs total rows with extra condition
		matchCount := fmt.Sprintf("(SELECT COUNT(*) FROM %s %s %s WHERE %s.%s = %s.%s AND %s)",
			jc, ja, relJoin, ja, jmf, ma, mp, pred)
		totalCount := fmt.Sprintf("(SELECT COUNT(*) FROM %s %s WHERE %s.%s = %s.%s AND %s)",
			jc, ja, ja, jmf, ma, mp, existsExtra)

		return fmt.Sprintf("%s AND\n %s =\n %s", existsClause, matchCount, totalCount), nil
	}

	// count mode
	if cfg.mode == "count" {
		countExpr := fmt.Sprintf("(SELECT COUNT(*) FROM %s %s %s WHERE %s.%s = %s.%s AND %s)",
			jc, ja, relJoin, ja, jmf, ma, mp, pred)
		return b.buildCondition(countExpr, cfg.countOp, fmt.Sprintf("%v", cfg.countVal))
	}

	// any mode (default)
	return fmt.Sprintf("EXISTS (SELECT 1 FROM %s %s %s WHERE %s.%s = %s.%s AND %s)",
		jc, ja, relJoin, ja, jmf, ma, mp, pred), nil
}

// threeWayConfig configures a generic three-way join filter (person_characters table).
type threeWayConfig struct {
	mainAlias        string        // main entity alias ("p" or "c")
	mainFK           string        // main FK in junction ("person_id" or "character_id")
	sideAlias        string        // side entity alias ("c" or "p")
	sideTable        string        // side entity table
	sideFK           string        // side FK in junction ("character_id" or "person_id")
	sideCtx          clauseContext // context for side conditions
	typeCond         string        // type condition (already compiled)
	mode             string
	countOp          string
	countVal         interface{}
	sideWhere        string // conditions on side entity (already compiled)
	sideJoin         string // JOIN clause for side entity
	subjectMode      string
	subjectCountOp   string
	subjectCountVal  interface{}
	subjectWhere     string // conditions on related subject (already compiled)
	countDistinctCol string // column for COUNT(DISTINCT pc.X)
}

// threeWayFilter generates SQL for a three-way join filter (person_characters).
// Handles none/any/all/count modes × any/all/count subject modes.
// Used by personCharacterFilter and characterPersonFilter.
func (b *SQLBuilder) threeWayFilter(cfg threeWayConfig) (string, error) {
	ma := cfg.mainAlias
	mf := cfg.mainFK
	typeCond := cfg.typeCond
	sideWhere := cfg.sideWhere
	if sideWhere == "" {
		sideWhere = "TRUE"
	}
	sideJoin := cfg.sideJoin
	subjWhere := cfg.subjectWhere
	if subjWhere == "" {
		subjWhere = "TRUE"
	}
	hasSubjConds := subjWhere != "TRUE"
	subjMode := cfg.subjectMode
	if subjMode == "" {
		subjMode = "any"
	}

	// Build predicates
	charPred := typeCond
	if sideWhere != "TRUE" {
		if charPred == "TRUE" {
			charPred = sideWhere
		} else {
			charPred = charPred + " AND " + sideWhere
		}
	}

	// none mode
	if cfg.mode == "none" {
		if !hasSubjConds || subjMode == "any" {
			if typeCond == "TRUE" && sideWhere == "TRUE" {
				return fmt.Sprintf("NOT EXISTS (SELECT 1 FROM person_characters pc WHERE pc.%s = %s.%s)",
					mf, ma, mf), nil
			}
			return fmt.Sprintf("NOT EXISTS (SELECT 1 FROM person_characters pc %s WHERE pc.%s = %s.%s AND %s)",
				sideJoin, mf, ma, mf, charPred), nil
		}
		// subject_mode=all
		if typeCond == "TRUE" && sideWhere == "TRUE" {
			return fmt.Sprintf(
				`NOT EXISTS (
				   SELECT 1 FROM person_characters pc
				   WHERE pc.%s = %s.%s
				   AND NOT EXISTS (
				     SELECT 1 FROM person_characters pc2
				     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
				     WHERE pc2.%s = %s.%s AND pc2.%s = pc.%s
				     AND NOT (%s)
				   )
				 )`, mf, ma, mf, mf, ma, mf, cfg.sideFK, cfg.sideFK, subjWhere), nil
		}
		return fmt.Sprintf(
			`NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.%s = %s.%s AND %s
			   AND NOT EXISTS (
			     SELECT 1 FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.%s = %s.%s AND pc2.%s = pc.%s
			     AND NOT (%s)
			   )
			 )`, sideJoin, mf, ma, mf, charPred, mf, ma, mf, cfg.sideFK, cfg.sideFK, subjWhere), nil
	}

	// No subject conditions — simple flat query
	if !hasSubjConds {
		fromClause := "person_characters pc"
		if sideJoin != "" {
			fromClause = "person_characters pc " + sideJoin
		}
		cond := charPred

		if cfg.mode == "all" {
			return fmt.Sprintf(
				`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.%s = %s.%s AND %s) AND
				 (SELECT COUNT(*) FROM %s WHERE pc.%s = %s.%s AND %s) =
				 (SELECT COUNT(*) FROM person_characters pc WHERE pc.%s = %s.%s AND %s)`,
				mf, ma, mf, typeCond, fromClause, mf, ma, mf, cond, mf, ma, mf, typeCond), nil
		}
		if cfg.mode == "count" {
			countExpr := fmt.Sprintf("(SELECT COUNT(*) FROM %s WHERE pc.%s = %s.%s AND %s)",
				fromClause, mf, ma, mf, cond)
			return b.buildCondition(countExpr, cfg.countOp, fmt.Sprintf("%v", cfg.countVal))
		}
		return fmt.Sprintf("EXISTS (SELECT 1 FROM %s WHERE pc.%s = %s.%s AND %s)",
			fromClause, mf, ma, mf, cond), nil
	}

	// Has subject conditions — two-level quantifier
	// Count mode with subject conditions
	if cfg.mode == "count" {
		countExpr := fmt.Sprintf(
			"(SELECT COUNT(DISTINCT pc.%s) FROM person_characters pc %s LEFT JOIN subjects rs ON pc.subject_id = rs.id WHERE pc.%s = %s.%s AND %s AND %s)",
			cfg.countDistinctCol, sideJoin, mf, ma, mf, charPred, subjWhere)
		return b.buildCondition(countExpr, cfg.countOp, fmt.Sprintf("%v", cfg.countVal))
	}

	switch {
	case cfg.mode == "any" && subjMode == "any":
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc %s
			 LEFT JOIN subjects rs ON pc.subject_id = rs.id
			 WHERE pc.%s = %s.%s AND %s AND %s)`,
			sideJoin, mf, ma, mf, charPred, subjWhere), nil

	case cfg.mode == "any" && subjMode == "all":
		return fmt.Sprintf(
			`EXISTS (
		   SELECT 1 FROM person_characters pc %s
		   WHERE pc.%s = %s.%s AND %s
		   AND NOT EXISTS (
		     SELECT 1 FROM person_characters pc2
		     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
		     WHERE pc2.%s = %s.%s AND pc2.%s = pc.%s
		     AND NOT (%s)
		   )
		 )`, sideJoin, mf, ma, mf, charPred, mf, ma, mf, cfg.sideFK, cfg.sideFK, subjWhere), nil

	case cfg.mode == "all" && subjMode == "any":
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.%s = %s.%s AND %s) AND
			 (SELECT COUNT(*) FROM (
			   SELECT pc.%s FROM person_characters pc %s
			   LEFT JOIN subjects rs ON pc.subject_id = rs.id
			   WHERE pc.%s = %s.%s AND %s AND %s
			   GROUP BY pc.%s
			 ) t) =
			 (SELECT COUNT(DISTINCT pc.%s) FROM person_characters pc WHERE pc.%s = %s.%s AND %s)`,
			mf, ma, mf, typeCond,
			cfg.sideFK, sideJoin, mf, ma, mf, charPred, subjWhere, cfg.sideFK,
			cfg.countDistinctCol, mf, ma, mf, typeCond), nil

	case cfg.mode == "all" && subjMode == "all":
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.%s = %s.%s AND %s) AND
			 NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.%s = %s.%s AND %s
			   AND EXISTS (
			     SELECT 1 FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.%s = %s.%s AND pc2.%s = pc.%s
			     AND NOT (%s)
			   )
			 )`,
			mf, ma, mf, typeCond,
			sideJoin, mf, ma, mf, charPred,
			mf, ma, mf, cfg.sideFK, cfg.sideFK, subjWhere), nil

	case cfg.mode == "any" && subjMode == "count":
		subjCountOp := toSQLOp(cfg.subjectCountOp)
		return fmt.Sprintf(
			`EXISTS (
		   SELECT 1 FROM person_characters pc %s
		   WHERE pc.%s = %s.%s AND %s
		   AND (SELECT COUNT(*) FROM person_characters pc2
		     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
		     WHERE pc2.%s = %s.%s AND pc2.%s = pc.%s
		     AND %s) %s %v
		 )`,
			sideJoin, mf, ma, mf, charPred,
			mf, ma, mf, cfg.sideFK, cfg.sideFK,
			subjWhere, subjCountOp, cfg.subjectCountVal), nil

	case cfg.mode == "all" && subjMode == "count":
		subjCountOp := toSQLOp(cfg.subjectCountOp)
		return fmt.Sprintf(
			`EXISTS (SELECT 1 FROM person_characters pc WHERE pc.%s = %s.%s AND %s) AND
			 NOT EXISTS (
			   SELECT 1 FROM person_characters pc %s
			   WHERE pc.%s = %s.%s AND %s
			   AND NOT ((SELECT COUNT(*) FROM person_characters pc2
			     LEFT JOIN subjects rs ON pc2.subject_id = rs.id
			     WHERE pc2.%s = %s.%s AND pc2.%s = pc.%s
			     AND %s) %s %v)
			 )`,
			mf, ma, mf, typeCond,
			sideJoin, mf, ma, mf, charPred,
			mf, ma, mf, cfg.sideFK, cfg.sideFK,
			subjWhere, subjCountOp, cfg.subjectCountVal), nil
	}

	return "TRUE", nil
}

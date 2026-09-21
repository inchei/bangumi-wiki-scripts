package bgmapi

import (
	"fmt"
	"io"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"regexp"
	"strings"
	"time"
)

const (
	WikiBase   = "https://next.bgm.tv"
	LegacyBase = "https://bgm.tv"
)

var formhashRe = regexp.MustCompile(`<input[^>]*name="formhash"[^>]*value="([^"]+)"`)

type Client struct {
	HTTP *http.Client
}

func NewClient() *Client {
	return &Client{HTTP: &http.Client{Timeout: 60 * time.Second}}
}

// FetchWikiData proxies a GET to next.bgm.tv/p1/wiki/... (no auth needed for reads).
func (c *Client) FetchWikiData(path string) ([]byte, error) {
	full := path
	if !strings.HasPrefix(path, "http") {
		full = WikiBase + path
	}
	req, err := http.NewRequest(http.MethodGet, full, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "inchei/wiki-batch-together (https://github.com/inchei/bangumi-wiki-scripts)")
	resp, err := c.HTTP.Do(req)
	if err != nil {
		return nil, err
	}
	defer func() { _ = resp.Body.Close() }()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP %d: %s", resp.StatusCode, truncate(body, 200))
	}
	return body, nil
}

// ValidateCookie checks that a bgm.tv session cookie is logged in by
// fetching an edit page and extracting the formhash. Returns formhash.
func (c *Client) ValidateCookie(cookie string) (formhash string, err error) {
	jar, jerr := cookiejar.New(nil)
	if jerr != nil {
		return "", jerr
	}
	legacy, perr := url.Parse(LegacyBase)
	if perr != nil {
		return "", perr
	}
	jar.SetCookies(legacy, cookiesFromHeader(cookie, legacy))

	cl := &http.Client{Timeout: 60 * time.Second, Jar: jar}
	req, rerr := http.NewRequest(http.MethodGet, LegacyBase+"/subject/1/edit_detail", nil)
	if rerr != nil {
		return "", rerr
	}
	req.Header.Set("User-Agent", "inchei/wiki-batch-together (https://github.com/inchei/bangumi-wiki-scripts)")
	resp, derr := cl.Do(req)
	if derr != nil {
		return "", fmt.Errorf("请求 bgm.tv 失败: %w", derr)
	}
	defer func() { _ = resp.Body.Close() }()
	body, berr := io.ReadAll(resp.Body)
	if berr != nil {
		return "", berr
	}
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("HTTP %d，请确认 cookie 已登录 bgm.tv", resp.StatusCode)
	}
	m := formhashRe.FindSubmatch(body)
	if m == nil {
		return "", fmt.Errorf("无法从编辑页提取 formhash，cookie 可能已失效")
	}
	return string(m[1]), nil
}

// SubmitLegacyEdit posts the legacy edit form with the user's cookie.
// Success is detected by a redirect away from the POST url
// (same heuristic as the wikiBatch userscript).
func (c *Client) SubmitLegacyEdit(cookie, formhash, postURL string, form url.Values) error {
	jar, err := cookiejar.New(nil)
	if err != nil {
		return err
	}
	legacy, err := url.Parse(LegacyBase)
	if err != nil {
		return err
	}
	jar.SetCookies(legacy, cookiesFromHeader(cookie, legacy))

	cl := &http.Client{
		Timeout:       60 * time.Second,
		Jar:           jar,
		CheckRedirect: func(req *http.Request, via []*http.Request) error { return http.ErrUseLastResponse },
	}

	form.Set("formhash", formhash)
	req, err := http.NewRequest(http.MethodPost, postURL, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("User-Agent", "inchei/wiki-batch-together (https://github.com/inchei/bangumi-wiki-scripts)")

	resp, err := cl.Do(req)
	if err != nil {
		return fmt.Errorf("网络错误: %w", err)
	}
	defer func() { _ = resp.Body.Close() }()
	body, _ := io.ReadAll(resp.Body)

	// 3xx redirect means success in the legacy API (same heuristic as
	// the wikiBatch userscript); a 200 means we stayed on the form page.
	if resp.StatusCode >= 300 && resp.StatusCode < 400 {
		loc, lerr := url.Parse(resp.Header.Get("Location"))
		post, perr := url.Parse(postURL)
		if lerr == nil && perr == nil {
			// resolve a relative redirect against the POST url
			resolved := post.ResolveReference(loc)
			if resolved.Host == post.Host && resolved.Path == post.Path {
				return fmt.Errorf("更新失败，可能是 cookie 失效或权限不足")
			}
		}
		return nil
	}
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("HTTP %d: %s", resp.StatusCode, truncate(body, 200))
	}
	return fmt.Errorf("更新失败，可能是 cookie 失效、formhash 无效或权限不足: %s", truncate(body, 200))
}

func cookiesFromHeader(raw string, u *url.URL) []*http.Cookie {
	var out []*http.Cookie
	for _, part := range strings.Split(raw, ";") {
		kv := strings.SplitN(strings.TrimSpace(part), "=", 2)
		if len(kv) != 2 {
			continue
		}
		out = append(out, &http.Cookie{Name: kv[0], Value: kv[1]})
	}
	return out
}

func truncate(b []byte, n int) string {
	s := strings.TrimSpace(string(b))
	if len(s) > n {
		return s[:n]
	}
	return s
}

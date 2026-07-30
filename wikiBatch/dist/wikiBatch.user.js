// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      9.7
// @description  支持两种提交方式，可在设置页面选择，支持编辑Wcode、标签和系列状态
// @author       You
// @match        https://next.bgm.tv/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @license      MIT
// ==/UserScript==

"use strict";(()=>{var Ku=Object.create;var td=Object.defineProperty;var Xu=Object.getOwnPropertyDescriptor;var Zu=Object.getOwnPropertyNames;var ep=Object.getPrototypeOf,tp=Object.prototype.hasOwnProperty;var nd=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var np=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Zu(e))!tp.call(t,r)&&r!==n&&td(t,r,{get:()=>e[r],enumerable:!(i=Xu(e,r))||i.enumerable});return t};var id=(t,e,n)=>(n=t!=null?Ku(ep(t)):{},np(e||!t||!t.__esModule?td(n,"default",{value:t,enumerable:!0}):n,t));var gd=nd((Tv,md)=>{var fn=-1,Vt=1,ut=0;function co(t,e,n,i,r){if(t===e)return t?[[ut,t]]:[];if(n!=null){var o=cp(t,e,n);if(o)return o}var a=oa(t,e),l=t.substring(0,a);t=t.substring(a),e=e.substring(a),a=Xo(t,e);var f=t.substring(t.length-a);t=t.substring(0,t.length-a),e=e.substring(0,e.length-a);var u=ip(t,e);return l&&u.unshift([ut,l]),f&&u.push([ut,f]),sa(u,r),i&&sp(u),u}function ip(t,e){var n;if(!t)return[[Vt,e]];if(!e)return[[fn,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,o=i.indexOf(r);if(o!==-1)return n=[[Vt,i.substring(0,o)],[ut,r],[Vt,i.substring(o+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=fn),n;if(r.length===1)return[[fn,t],[Vt,e]];var a=op(t,e);if(a){var l=a[0],f=a[1],u=a[2],d=a[3],c=a[4],p=co(l,u),m=co(f,d);return p.concat([[ut,c]],m)}return rp(t,e)}function rp(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),o=r,a=2*r,l=new Array(a),f=new Array(a),u=0;u<a;u++)l[u]=-1,f[u]=-1;l[o+1]=0,f[o+1]=0;for(var d=n-i,c=d%2!==0,p=0,m=0,g=0,x=0,b=0;b<r;b++){for(var _=-b+p;_<=b-m;_+=2){var L=o+_,y;_===-b||_!==b&&l[L-1]<l[L+1]?y=l[L+1]:y=l[L-1]+1;for(var N=y-_;y<n&&N<i&&t.charAt(y)===e.charAt(N);)y++,N++;if(l[L]=y,y>n)m+=2;else if(N>i)p+=2;else if(c){var S=o+d-_;if(S>=0&&S<a&&f[S]!==-1){var E=n-f[S];if(y>=E)return sd(t,e,y,N)}}}for(var h=-b+g;h<=b-x;h+=2){var S=o+h,E;h===-b||h!==b&&f[S-1]<f[S+1]?E=f[S+1]:E=f[S-1]+1;for(var w=E-h;E<n&&w<i&&t.charAt(n-E-1)===e.charAt(i-w-1);)E++,w++;if(f[S]=E,E>n)x+=2;else if(w>i)g+=2;else if(!c){var L=o+d-h;if(L>=0&&L<a&&l[L]!==-1){var y=l[L],N=o+y-L;if(E=n-E,y>=E)return sd(t,e,y,N)}}}}return[[fn,t],[Vt,e]]}function sd(t,e,n,i){var r=t.substring(0,n),o=e.substring(0,i),a=t.substring(n),l=e.substring(i),f=co(r,o),u=co(a,l);return f.concat(u)}function oa(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(o,r)==e.substring(o,r)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return cd(t.charCodeAt(r-1))&&r--,r}function ad(t,e){var n=t.length,i=e.length;if(n==0||i==0)return 0;n>i?t=t.substring(n-i):n<i&&(e=e.substring(0,n));var r=Math.min(n,i);if(t==e)return r;for(var o=0,a=1;;){var l=t.substring(r-a),f=e.indexOf(l);if(f==-1)return o;a+=f,(f==0||t.substring(r-a)==e.substring(0,a))&&(o=a,a++)}}function Xo(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(t.length-r,t.length-o)==e.substring(e.length-r,e.length-o)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return ud(t.charCodeAt(t.length-r))&&r--,r}function op(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||i.length*2<n.length)return null;function r(m,g,x){for(var b=m.substring(x,x+Math.floor(m.length/4)),_=-1,L="",y,N,S,E;(_=g.indexOf(b,_+1))!==-1;){var h=oa(m.substring(x),g.substring(_)),w=Xo(m.substring(0,x),g.substring(0,_));L.length<w+h&&(L=g.substring(_-w,_)+g.substring(_,_+h),y=m.substring(0,x-w),N=m.substring(x+h),S=g.substring(0,_-w),E=g.substring(_+h))}return L.length*2>=m.length?[y,N,S,E,L]:null}var o=r(n,i,Math.ceil(n.length/4)),a=r(n,i,Math.ceil(n.length/2)),l;if(!o&&!a)return null;a?o?l=o[4].length>a[4].length?o:a:l=a:l=o;var f,u,d,c;t.length>e.length?(f=l[0],u=l[1],d=l[2],c=l[3]):(d=l[0],c=l[1],f=l[2],u=l[3]);var p=l[4];return[f,u,d,c,p]}function sp(t){for(var e=!1,n=[],i=0,r=null,o=0,a=0,l=0,f=0,u=0;o<t.length;)t[o][0]==ut?(n[i++]=o,a=f,l=u,f=0,u=0,r=t[o][1]):(t[o][0]==Vt?f+=t[o][1].length:u+=t[o][1].length,r&&r.length<=Math.max(a,l)&&r.length<=Math.max(f,u)&&(t.splice(n[i-1],0,[fn,r]),t[n[i-1]+1][0]=Vt,i--,i--,o=i>0?n[i-1]:-1,a=0,l=0,f=0,u=0,r=null,e=!0)),o++;for(e&&sa(t),dp(t),o=1;o<t.length;){if(t[o-1][0]==fn&&t[o][0]==Vt){var d=t[o-1][1],c=t[o][1],p=ad(d,c),m=ad(c,d);p>=m?(p>=d.length/2||p>=c.length/2)&&(t.splice(o,0,[ut,c.substring(0,p)]),t[o-1][1]=d.substring(0,d.length-p),t[o+1][1]=c.substring(p),o++):(m>=d.length/2||m>=c.length/2)&&(t.splice(o,0,[ut,d.substring(0,m)]),t[o-1][0]=Vt,t[o-1][1]=c.substring(0,c.length-m),t[o+1][0]=fn,t[o+1][1]=d.substring(m),o++),o++}o++}}var ld=/[^a-zA-Z0-9]/,dd=/\s/,fd=/[\r\n]/,ap=/\n\r?\n$/,lp=/^\r?\n\r?\n/;function dp(t){function e(m,g){if(!m||!g)return 6;var x=m.charAt(m.length-1),b=g.charAt(0),_=x.match(ld),L=b.match(ld),y=_&&x.match(dd),N=L&&b.match(dd),S=y&&x.match(fd),E=N&&b.match(fd),h=S&&m.match(ap),w=E&&g.match(lp);return h||w?5:S||E?4:_&&!y&&N?3:y||N?2:_||L?1:0}for(var n=1;n<t.length-1;){if(t[n-1][0]==ut&&t[n+1][0]==ut){var i=t[n-1][1],r=t[n][1],o=t[n+1][1],a=Xo(i,r);if(a){var l=r.substring(r.length-a);i=i.substring(0,i.length-a),r=l+r.substring(0,r.length-a),o=l+o}for(var f=i,u=r,d=o,c=e(i,r)+e(r,o);r.charAt(0)===o.charAt(0);){i+=r.charAt(0),r=r.substring(1)+o.charAt(0),o=o.substring(1);var p=e(i,r)+e(r,o);p>=c&&(c=p,f=i,u=r,d=o)}t[n-1][1]!=f&&(f?t[n-1][1]=f:(t.splice(n-1,1),n--),t[n][1]=u,d?t[n+1][1]=d:(t.splice(n+1,1),n--))}n++}}function sa(t,e){t.push([ut,""]);for(var n=0,i=0,r=0,o="",a="",l;n<t.length;){if(n<t.length-1&&!t[n][1]){t.splice(n,1);continue}switch(t[n][0]){case Vt:r++,a+=t[n][1],n++;break;case fn:i++,o+=t[n][1],n++;break;case ut:var f=n-r-i-1;if(e){if(f>=0&&hd(t[f][1])){var u=t[f][1].slice(-1);if(t[f][1]=t[f][1].slice(0,-1),o=u+o,a=u+a,!t[f][1]){t.splice(f,1),n--;var d=f-1;t[d]&&t[d][0]===Vt&&(r++,a=t[d][1]+a,d--),t[d]&&t[d][0]===fn&&(i++,o=t[d][1]+o,d--),f=d}}if(pd(t[n][1])){var u=t[n][1].charAt(0);t[n][1]=t[n][1].slice(1),o+=u,a+=u}}if(n<t.length-1&&!t[n][1]){t.splice(n,1);break}if(o.length>0||a.length>0){o.length>0&&a.length>0&&(l=oa(a,o),l!==0&&(f>=0?t[f][1]+=a.substring(0,l):(t.splice(0,0,[ut,a.substring(0,l)]),n++),a=a.substring(l),o=o.substring(l)),l=Xo(a,o),l!==0&&(t[n][1]=a.substring(a.length-l)+t[n][1],a=a.substring(0,a.length-l),o=o.substring(0,o.length-l)));var c=r+i;o.length===0&&a.length===0?(t.splice(n-c,c),n=n-c):o.length===0?(t.splice(n-c,c,[Vt,a]),n=n-c+1):a.length===0?(t.splice(n-c,c,[fn,o]),n=n-c+1):(t.splice(n-c,c,[fn,o],[Vt,a]),n=n-c+2)}n!==0&&t[n-1][0]===ut?(t[n-1][1]+=t[n][1],t.splice(n,1)):n++,r=0,i=0,o="",a="";break}}t[t.length-1][1]===""&&t.pop();var p=!1;for(n=1;n<t.length-1;)t[n-1][0]===ut&&t[n+1][0]===ut&&(t[n][1].substring(t[n][1].length-t[n-1][1].length)===t[n-1][1]?(t[n][1]=t[n-1][1]+t[n][1].substring(0,t[n][1].length-t[n-1][1].length),t[n+1][1]=t[n-1][1]+t[n+1][1],t.splice(n-1,1),p=!0):t[n][1].substring(0,t[n+1][1].length)==t[n+1][1]&&(t[n-1][1]+=t[n+1][1],t[n][1]=t[n][1].substring(t[n+1][1].length)+t[n+1][1],t.splice(n+1,1),p=!0)),n++;p&&sa(t,e)}function cd(t){return t>=55296&&t<=56319}function ud(t){return t>=56320&&t<=57343}function pd(t){return ud(t.charCodeAt(0))}function hd(t){return cd(t.charCodeAt(t.length-1))}function fp(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}function ra(t,e,n,i){return hd(t)||pd(i)?null:fp([[ut,t],[fn,e],[Vt,n],[ut,i]])}function cp(t,e,n){var i=typeof n=="number"?{index:n,length:0}:n.oldRange,r=typeof n=="number"?null:n.newRange,o=t.length,a=e.length;if(i.length===0&&(r===null||r.length===0)){var l=i.index,f=t.slice(0,l),u=t.slice(l),d=r?r.index:null;e:{var c=l+a-o;if(d!==null&&d!==c||c<0||c>a)break e;var p=e.slice(0,c),m=e.slice(c);if(m!==u)break e;var g=Math.min(l,c),x=f.slice(0,g),b=p.slice(0,g);if(x!==b)break e;var _=f.slice(g),L=p.slice(g);return ra(x,_,L,u)}e:{if(d!==null&&d!==l)break e;var y=l,p=e.slice(0,y),m=e.slice(y);if(p!==f)break e;var N=Math.min(o-y,a-y),S=u.slice(u.length-N),E=m.slice(m.length-N);if(S!==E)break e;var _=u.slice(0,u.length-N),L=m.slice(0,m.length-N);return ra(f,_,L,S)}}if(i.length>0&&r&&r.length===0)e:{var x=t.slice(0,i.index),S=t.slice(i.index+i.length),g=x.length,N=S.length;if(a<g+N)break e;var b=e.slice(0,g),E=e.slice(a-N);if(x!==b||S!==E)break e;var _=t.slice(g,o-N),L=e.slice(g,a-N);return ra(x,_,L,S)}return null}function Zo(t,e,n,i){return co(t,e,n,i,!0)}Zo.INSERT=Vt;Zo.DELETE=fn;Zo.EQUAL=ut;md.exports=Zo});var $u=nd((Ql,Vl)=>{((t,e)=>{typeof define=="function"&&define.amd?define([],e):typeof Vl=="object"&&typeof Ql<"u"?Vl.exports=e():t.Papa=e()})(Ql,function t(){var e=typeof self<"u"?self:typeof window<"u"?window:e!==void 0?e:{},n,i=!e.document&&!!e.postMessage,r=e.IS_PAPA_WORKER||!1,o={},a=0,l={};function f(h){return h.charCodeAt(0)===65279?h.slice(1):h}function u(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(w){var A=N(w);A.chunkSize=parseInt(A.chunkSize),w.step||w.chunk||(A.chunkSize=null),this._handle=new g(A),(this._handle.streamer=this)._config=A}.call(this,h),this.parseChunk=function(w,A){var T=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<T){let U=this._config.newline;U||(M=this._config.quoteChar||'"',U=this._handle.guessLineEndings(w,M)),w=[...w.split(U).slice(T)].join(U)}this.isFirstChunk&&E(this._config.beforeFirstChunk)&&(M=this._config.beforeFirstChunk(w))!==void 0&&(w=M),this.isFirstChunk=!1,this._halted=!1;var T=this._partialLine+w,M=(this._partialLine="",this._handle.parse(T,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(w=M.meta.cursor,T=(this._finished||(this._partialLine=T.substring(w-this._baseIndex),this._baseIndex=w),M&&M.data&&(this._rowCount+=M.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),r)e.postMessage({results:M,workerId:l.WORKER_ID,finished:T});else if(E(this._config.chunk)&&!A){if(this._config.chunk(M,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=M=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(M.data),this._completeResults.errors=this._completeResults.errors.concat(M.errors),this._completeResults.meta=M.meta),this._completed||!T||!E(this._config.complete)||M&&M.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),T||M&&M.meta.paused||this._nextChunk(),M}this._halted=!0},this._sendError=function(w){E(this._config.error)?this._config.error(w):r&&this._config.error&&e.postMessage({workerId:l.WORKER_ID,error:w,finished:!1})}}function d(h){var w;(h=h||{}).chunkSize||(h.chunkSize=l.RemoteChunkSize),u.call(this,h),this._nextChunk=i?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(A){this._input=A,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(w=new XMLHttpRequest,this._config.withCredentials&&(w.withCredentials=this._config.withCredentials),i||(w.onload=S(this._chunkLoaded,this),w.onerror=S(this._chunkError,this)),w.open(this._config.downloadRequestBody?"POST":"GET",this._input,!i),this._config.downloadRequestHeaders){var A,T=this._config.downloadRequestHeaders;for(A in T)w.setRequestHeader(A,T[A])}var M;this._config.chunkSize&&(M=this._start+this._config.chunkSize-1,w.setRequestHeader("Range","bytes="+this._start+"-"+M));try{w.send(this._config.downloadRequestBody)}catch(U){this._chunkError(U.message)}i&&w.status===0&&this._chunkError()}},this._chunkLoaded=function(){w.readyState===4&&(w.status<200||400<=w.status?this._chunkError():(this._start+=this._config.chunkSize||w.responseText.length,this._finished=!this._config.chunkSize||this._start>=(A=>(A=A.getResponseHeader("Content-Range"))!==null?parseInt(A.substring(A.lastIndexOf("/")+1)):-1)(w),this.parseChunk(w.responseText)))},this._chunkError=function(A){A=w.statusText||A,this._sendError(new Error(A))}}function c(h){(h=h||{}).chunkSize||(h.chunkSize=l.LocalChunkSize),u.call(this,h);var w,A,T=typeof FileReader<"u";this.stream=function(M){this._input=M,A=M.slice||M.webkitSlice||M.mozSlice,T?((w=new FileReader).onload=S(this._chunkLoaded,this),w.onerror=S(this._chunkError,this)):w=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var M=this._input,U=(this._config.chunkSize&&(U=Math.min(this._start+this._config.chunkSize,this._input.size),M=A.call(M,this._start,U)),w.readAsText(M,this._config.encoding));T||this._chunkLoaded({target:{result:U}})},this._chunkLoaded=function(M){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(M.target.result)},this._chunkError=function(){this._sendError(w.error)}}function p(h){var w;u.call(this,h=h||{}),this.stream=function(A){return w=A,this._nextChunk()},this._nextChunk=function(){var A,T;if(!this._finished)return A=this._config.chunkSize,w=A?(T=w.substring(0,A),w.substring(A)):(T=w,""),this._finished=!w,this.parseChunk(T)}}function m(h){u.call(this,h=h||{});var w=[],A=!0,T=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(M){this._input=M,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){T&&w.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),w.length?this.parseChunk(w.shift()):A=!0},this._streamData=S(function(M){try{w.push(typeof M=="string"?M:M.toString(this._config.encoding)),A&&(A=!1,this._checkIsFinished(),this.parseChunk(w.shift()))}catch(U){this._streamError(U)}},this),this._streamError=S(function(M){this._streamCleanUp(),this._sendError(M)},this),this._streamEnd=S(function(){this._streamCleanUp(),T=!0,this._streamData("")},this),this._streamCleanUp=S(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function g(h){var w,A,T,M,U=Math.pow(2,53),P=-U,J=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,ee=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,re=this,q=0,F=0,V=!1,j=!1,z=[],B={data:[],errors:[],meta:{}};function he(se){return h.skipEmptyLines==="greedy"?se.join("").trim()==="":se.length===1&&se[0].length===0}function ie(){if(B&&T&&(ve("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+l.DefaultDelimiter+"'"),T=!1),h.skipEmptyLines&&(B.data=B.data.filter(function(ge){return!he(ge)})),Z()){let ge=function(ke,Oe){ke=f(ke),E(h.transformHeader)&&(ke=h.transformHeader(ke,Oe)),z.push(ke)};var Ee=ge;if(B)if(Array.isArray(B.data[0])){for(var se=0;Z()&&se<B.data.length;se++)B.data[se].forEach(ge);B.data.splice(0,1)}else B.data.forEach(ge)}function te(ge,ke){for(var Oe=h.header?{}:[],Pe=0;Pe<ge.length;Pe++){var Se=Pe,Ht=ge[Pe],Ht=((Te,Je)=>(ct=>(h.dynamicTypingFunction&&h.dynamicTyping[ct]===void 0&&(h.dynamicTyping[ct]=h.dynamicTypingFunction(ct)),(h.dynamicTyping[ct]||h.dynamicTyping)===!0))(Te)?Je==="true"||Je==="TRUE"||Je!=="false"&&Je!=="FALSE"&&((ct=>{if(J.test(ct)&&(ct=parseFloat(ct),P<ct&&ct<U))return 1})(Je)?parseFloat(Je):ee.test(Je)?new Date(Je):Je===""?null:Je):Je)(Se=h.header?Pe>=z.length?"__parsed_extra":z[Pe]:Se,Ht=h.transform?h.transform(Ht,Se):Ht);Se==="__parsed_extra"?(Oe[Se]=Oe[Se]||[],Oe[Se].push(Ht)):Oe[Se]=Ht}return h.header&&(Pe>z.length?ve("FieldMismatch","TooManyFields","Too many fields: expected "+z.length+" fields but parsed "+Pe,F+ke):Pe<z.length&&ve("FieldMismatch","TooFewFields","Too few fields: expected "+z.length+" fields but parsed "+Pe,F+ke)),Oe}var xe;B&&(h.header||h.dynamicTyping||h.transform)&&(xe=1,!B.data.length||Array.isArray(B.data[0])?(B.data=B.data.map(te),xe=B.data.length):B.data=te(B.data,0),h.header&&B.meta&&(B.meta.fields=z),F+=xe)}function Z(){return h.header&&z.length===0}function ve(se,te,xe,Ee){se={type:se,code:te,message:xe},Ee!==void 0&&(se.row=Ee),B.errors.push(se)}E(h.step)&&(M=h.step,h.step=function(se){B=se,Z()?ie():(ie(),B.data.length!==0&&(q+=se.data.length,h.preview&&q>h.preview?A.abort():(B.data=B.data[0],M(B,re))))}),this.parse=function(se,te,xe){var Ee=h.quoteChar||'"',Ee=(h.newline||(h.newline=this.guessLineEndings(se,Ee)),T=!1,h.delimiter?E(h.delimiter)&&(h.delimiter=h.delimiter(se),B.meta.delimiter=h.delimiter):((Ee=((ge,ke,Oe,Pe,Se)=>{var Ht,Te,Je,ct;Se=Se||[",","	","|",";",l.RECORD_SEP,l.UNIT_SEP];for(var hr=0;hr<Se.length;hr++){for(var Un,ao=Se[hr],Bt=0,Wn=0,Et=0,Zt=(Je=void 0,new b({comments:Pe,delimiter:ao,newline:ke,preview:10}).parse(ge)),ui=0;ui<Zt.data.length;ui++)Oe&&he(Zt.data[ui])?Et++:(Un=Zt.data[ui].length,Wn+=Un,Je===void 0?Je=Un:0<Un&&(Bt+=Math.abs(Un-Je),Je=Un));0<Zt.data.length&&(Wn/=Zt.data.length-Et),(Te===void 0||Bt<=Te)&&(ct===void 0||ct<Wn)&&1.99<Wn&&(Te=Bt,Ht=ao,ct=Wn)}return{successful:!!(h.delimiter=Ht),bestDelimiter:Ht}})(se,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=Ee.bestDelimiter:(T=!0,h.delimiter=l.DefaultDelimiter),B.meta.delimiter=h.delimiter),N(h));return h.preview&&h.header&&Ee.preview++,w=se,A=new b(Ee),B=A.parse(w,te,xe),ie(),V?{meta:{paused:!0}}:B||{meta:{paused:!1}}},this.paused=function(){return V},this.pause=function(){V=!0,A.abort(),w=E(h.chunk)?"":w.substring(A.getCharIndex())},this.resume=function(){re.streamer._halted?(V=!1,re.streamer.parseChunk(w,!0)):setTimeout(re.resume,3)},this.aborted=function(){return j},this.abort=function(){j=!0,A.abort(),B.meta.aborted=!0,E(h.complete)&&h.complete(B),w=""},this.guessLineEndings=function(ge,Ee){ge=ge.substring(0,1048576);var Ee=new RegExp(x(Ee)+"([^]*?)"+x(Ee),"gm"),xe=(ge=ge.replace(Ee,"")).split("\r"),Ee=ge.split(`
`),ge=1<Ee.length&&Ee[0].length<xe[0].length;if(xe.length===1||ge)return`
`;for(var ke=0,Oe=0;Oe<xe.length;Oe++)xe[Oe][0]===`
`&&ke++;return ke>=xe.length/2?`\r
`:"\r"}}function x(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function b(h){var w=(h=h||{}).delimiter,A=h.newline,T=h.comments,M=h.step,U=h.preview,P=h.fastMode,J=null,ee=!1,re=h.quoteChar==null?'"':h.quoteChar,q=re;if(h.escapeChar!==void 0&&(q=h.escapeChar),(typeof w!="string"||-1<l.BAD_DELIMITERS.indexOf(w))&&(w=","),T===w)throw new Error("Comment character same as delimiter");T===!0?T="#":(typeof T!="string"||-1<l.BAD_DELIMITERS.indexOf(T))&&(T=!1),A!==`
`&&A!=="\r"&&A!==`\r
`&&(A=`
`);var F=0,V=!1;this.parse=function(j,z,B){if(typeof j!="string")throw new Error("Input must be a string");var he=j.length,ie=w.length,Z=A.length,ve=T.length,se=E(M),te=[],xe=[],Ee=[],ge=F=0;if(!j)return Bt();if(P||P!==!1&&j.indexOf(re)===-1){for(var ke=j.split(A),Oe=0;Oe<ke.length;Oe++){if(Ee=ke[Oe],F+=Ee.length,Oe!==ke.length-1)F+=A.length;else if(B)return Bt();if(!T||Ee.substring(0,ve)!==T){if(se){if(te=[],ct(Ee.split(w)),Wn(),V)return Bt()}else ct(Ee.split(w));if(U&&U<=Oe)return te=te.slice(0,U),Bt(!0)}}return Bt()}for(var Pe=j.indexOf(w,F),Se=j.indexOf(A,F),Ht=new RegExp(x(q)+x(re),"g"),Te=j.indexOf(re,F);;)if(j[F]===re)for(Te=F,F++;;){if((Te=j.indexOf(re,Te+1))===-1)return B||xe.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:te.length,index:F}),Un();if(Te===he-1)return Un(j.substring(F,Te).replace(Ht,re));if(re===q&&j[Te+1]===q)Te++;else if(re===q||Te===0||j[Te-1]!==q){Pe!==-1&&Pe<Te+1&&(Pe=j.indexOf(w,Te+1));var Je=hr((Se=Se!==-1&&Se<Te+1?j.indexOf(A,Te+1):Se)===-1?Pe:Math.min(Pe,Se));if(j.substr(Te+1+Je,ie)===w){Ee.push(j.substring(F,Te).replace(Ht,re)),j[F=Te+1+Je+ie]!==re&&(Te=j.indexOf(re,F)),Pe=j.indexOf(w,F),Se=j.indexOf(A,F);break}if(Je=hr(Se),j.substring(Te+1+Je,Te+1+Je+Z)===A){if(Ee.push(j.substring(F,Te).replace(Ht,re)),ao(Te+1+Je+Z),Pe=j.indexOf(w,F),Te=j.indexOf(re,F),se&&(Wn(),V))return Bt();if(U&&te.length>=U)return Bt(!0);break}xe.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:te.length,index:F}),Te++}}else if(T&&Ee.length===0&&j.substring(F,F+ve)===T){if(Se===-1)return Bt();F=Se+Z,Se=j.indexOf(A,F),Pe=j.indexOf(w,F)}else if(Pe!==-1&&(Pe<Se||Se===-1))Ee.push(j.substring(F,Pe)),F=Pe+ie,Pe=j.indexOf(w,F);else{if(Se===-1)break;if(Ee.push(j.substring(F,Se)),ao(Se+Z),se&&(Wn(),V))return Bt();if(U&&te.length>=U)return Bt(!0)}return Un();function ct(Et){te.push(Et),ge=F}function hr(Et){var Zt=0;return Zt=Et!==-1&&(Et=j.substring(Te+1,Et))&&Et.trim()===""?Et.length:Zt}function Un(Et){return B||(Et===void 0&&(Et=j.substring(F)),Ee.push(Et),F=he,ct(Ee),se&&Wn()),Bt()}function ao(Et){F=Et,ct(Ee),Ee=[],Se=j.indexOf(A,F)}function Bt(Et){if(h.header&&!z&&te.length&&!ee){var Zt=te[0],ui=Object.create(null),ia=new Set(Zt);let Zl=!1;for(let mr=0;mr<Zt.length;mr++){let zn=f(Zt[mr]);if(ui[zn=E(h.transformHeader)?h.transformHeader(zn,mr):zn]){let lo,ed=ui[zn];for(;lo=zn+"_"+ed,ed++,ia.has(lo););ia.add(lo),Zt[mr]=lo,ui[zn]++,Zl=!0,(J=J===null?{}:J)[lo]=zn}else ui[zn]=1,Zt[mr]=zn;ia.add(zn)}Zl&&console.warn("Duplicate headers found and renamed."),ee=!0}return{data:te,errors:xe,meta:{delimiter:w,linebreak:A,aborted:V,truncated:!!Et,cursor:ge+(z||0),renamedHeaders:J}}}function Wn(){M(Bt()),te=[],xe=[]}},this.abort=function(){V=!0},this.getCharIndex=function(){return F}}function _(h){var w=h.data,A=o[w.workerId],T=!1;if(w.error)A.userError(w.error,w.file);else if(w.results&&w.results.data){var M={abort:function(){T=!0,L(w.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:y,resume:y};if(E(A.userStep)){for(var U=0;U<w.results.data.length&&(A.userStep({data:w.results.data[U],errors:w.results.errors,meta:w.results.meta},M),!T);U++);delete w.results}else E(A.userChunk)&&(A.userChunk(w.results,M,w.file),delete w.results)}w.finished&&!T&&L(w.workerId,w.results)}function L(h,w){var A=o[h];E(A.userComplete)&&A.userComplete(w),A.terminate(),delete o[h]}function y(){throw new Error("Not implemented.")}function N(h){if(typeof h!="object"||h===null)return h;var w,A=Array.isArray(h)?[]:{};for(w in h)A[w]=N(h[w]);return A}function S(h,w){return function(){h.apply(w,arguments)}}function E(h){return typeof h=="function"}return l.parse=function(h,w){var A=(w=w||{}).dynamicTyping||!1;if(E(A)&&(w.dynamicTypingFunction=A,A={}),w.dynamicTyping=A,w.transform=!!E(w.transform)&&w.transform,!w.worker||!l.WORKERS_SUPPORTED)return A=null,l.NODE_STREAM_INPUT,typeof h=="string"?(h=f(h),A=new(w.download?d:p)(w)):h.readable===!0&&E(h.read)&&E(h.on)?A=new m(w):(e.File&&h instanceof File||h instanceof Object)&&(A=new c(w)),A.stream(h);(A=(()=>{var T;return!!l.WORKERS_SUPPORTED&&(T=(()=>{var M=e.URL||e.webkitURL||null,U=t.toString();return l.BLOB_URL||(l.BLOB_URL=M.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",U,")();"],{type:"text/javascript"})))})(),(T=new e.Worker(T)).onmessage=_,T.id=a++,o[T.id]=T)})()).userStep=w.step,A.userChunk=w.chunk,A.userComplete=w.complete,A.userError=w.error,w.step=E(w.step),w.chunk=E(w.chunk),w.complete=E(w.complete),w.error=E(w.error),delete w.worker,A.postMessage({input:h,config:w,workerId:A.id})},l.unparse=function(h,w){var A=!1,T=!0,M=",",U=`\r
`,P='"',J=P+P,ee=!1,re=null,q=!1,F=((()=>{if(typeof w=="object"){if(typeof w.delimiter!="string"||l.BAD_DELIMITERS.filter(function(z){return w.delimiter.indexOf(z)!==-1}).length||(M=w.delimiter),typeof w.quotes!="boolean"&&typeof w.quotes!="function"&&!Array.isArray(w.quotes)||(A=w.quotes),typeof w.skipEmptyLines!="boolean"&&typeof w.skipEmptyLines!="string"||(ee=w.skipEmptyLines),typeof w.newline=="string"&&(U=w.newline),typeof w.quoteChar=="string"&&(P=w.quoteChar,J=P+P),typeof w.header=="boolean"&&(T=w.header),Array.isArray(w.columns)){if(w.columns.length===0)throw new Error("Option columns is empty");re=w.columns}w.escapeChar!==void 0&&(J=w.escapeChar+P),w.escapeFormulae instanceof RegExp?q=w.escapeFormulae:typeof w.escapeFormulae=="boolean"&&w.escapeFormulae&&(q=/^[=+\-@\t\r].*$/)}})(),new RegExp(x(P),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return V(null,h,ee);if(typeof h[0]=="object")return V(re||Object.keys(h[0]),h,ee)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||re),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),V(h.fields||[],h.data||[],ee);throw new Error("Unable to serialize unrecognized input");function V(z,B,he){var ie="",Z=(typeof z=="string"&&(z=JSON.parse(z)),typeof B=="string"&&(B=JSON.parse(B)),Array.isArray(z)&&0<z.length),ve=!Array.isArray(B[0]);if(Z&&T){for(var se=0;se<z.length;se++)0<se&&(ie+=M),ie+=j(z[se],se);0<B.length&&(ie+=U)}for(var te=0;te<B.length;te++){var xe=(Z?z:B[te]).length,Ee=!1,ge=Z?Object.keys(B[te]).length===0:B[te].length===0;if(he&&!Z&&(Ee=he==="greedy"?B[te].join("").trim()==="":B[te].length===1&&B[te][0].length===0),he==="greedy"&&Z){for(var ke=[],Oe=0;Oe<xe;Oe++){var Pe=ve?z[Oe]:Oe;ke.push(B[te][Pe])}Ee=ke.join("").trim()===""}if(!Ee){for(var Se=0;Se<xe;Se++){0<Se&&!ge&&(ie+=M);var Ht=Z&&ve?z[Se]:Se;ie+=j(B[te][Ht],Se)}te<B.length-1&&(!he||0<xe&&!ge)&&(ie+=U)}}return ie}function j(z,B){var he,ie,Z;return z==null?"":z.constructor===Date?JSON.stringify(z).slice(1,25):(Z=!1,q&&typeof z=="string"&&q.test(z)&&(z="'"+z,Z=!0),ie=(he=z.toString()).replace(F,J),(Z=Z||A===!0||typeof A=="function"&&A(z,B)||Array.isArray(A)&&A[B]||((ve,se)=>{for(var te=0;te<se.length;te++)if(-1<ve.indexOf(se[te]))return!0;return!1})(ie,l.BAD_DELIMITERS)||-1<ie.indexOf(M)||-1<he.indexOf(P)||ie.charAt(0)===" "||ie.charAt(ie.length-1)===" ")?P+ie+P:ie)}},l.RECORD_SEP="",l.UNIT_SEP="",l.BYTE_ORDER_MARK="\uFEFF",l.BAD_DELIMITERS=["\r",`
`,'"',l.BYTE_ORDER_MARK],l.WORKERS_SUPPORTED=!i&&!!e.Worker,l.NODE_STREAM_INPUT=1,l.LocalChunkSize=10485760,l.RemoteChunkSize=5242880,l.DefaultDelimiter=",",l.Parser=b,l.ParserHandle=g,l.NetworkStreamer=d,l.FileStreamer=c,l.StringStreamer=p,l.ReadableStreamStreamer=m,e.jQuery&&((n=e.jQuery).fn.parse=function(h){var w=h.config||{},A=[];return this.each(function(U){if(!(n(this).prop("tagName").toUpperCase()==="INPUT"&&n(this).attr("type").toLowerCase()==="file"&&e.FileReader)||!this.files||this.files.length===0)return!0;for(var P=0;P<this.files.length;P++)A.push({file:this.files[P],inputElem:this,instanceConfig:n.extend({},w)})}),T(),this;function T(){if(A.length===0)E(h.complete)&&h.complete();else{var U,P,J,ee,re=A[0];if(E(h.before)){var q=h.before(re.file,re.inputElem);if(typeof q=="object"){if(q.action==="abort")return U="AbortError",P=re.file,J=re.inputElem,ee=q.reason,void(E(h.error)&&h.error({name:U},P,J,ee));if(q.action==="skip")return void M();typeof q.config=="object"&&(re.instanceConfig=n.extend(re.instanceConfig,q.config))}else if(q==="skip")return void M()}var F=re.instanceConfig.complete;re.instanceConfig.complete=function(V){E(F)&&F(V,re.file,re.inputElem),M()},l.parse(re.file,re.instanceConfig)}}function M(){A.splice(0,1),T()}}),r&&(e.onmessage=function(h){h=h.data,l.WORKER_ID===void 0&&h&&(l.WORKER_ID=h.workerId),typeof h.input=="string"?e.postMessage({workerId:l.WORKER_ID,results:l.parse(h.input,h.config),finished:!0}):(e.File&&h.input instanceof File||h.input instanceof Object)&&(h=l.parse(h.input,h.config))&&e.postMessage({workerId:l.WORKER_ID,results:h,finished:!0})}),(d.prototype=Object.create(u.prototype)).constructor=d,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,l})});var I={accessToken:GM_getValue("bgmAccessToken")||"",formhash:GM_getValue("bgmFormhash")||"",submitMethod:GM_getValue("bgmSubmitMethod")||"patch",entityType:localStorage.getItem("bgmEntityType")||"subject",csvData:JSON.parse(localStorage.getItem("bgmCsvData")||"null"),currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),totalItems:0,processing:!1,paused:!1,currentView:"setup",currentSubjectData:null,currentFieldUpdates:null,currentTagUpdates:null,currentSeriesUpdate:null,currentWcode:null,currentTags:null,currentSeries:null,currentCommitMessage:null,isCommitMessageLocked:localStorage.getItem("bgmIsCommitMessageLocked")==="true"||!1,lockedCommitMessage:localStorage.getItem("bgmLockedCommitMessage")||"",retryCount:{},currentItemId:null,previousItem:JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),diffViewMode:localStorage.getItem("bgmDiffViewMode")||"split",theme:localStorage.getItem("bgmTheme")||"system"};function Gn(){GM_setValue("bgmAccessToken",I.accessToken),GM_setValue("bgmFormhash",I.formhash),GM_setValue("bgmSubmitMethod",I.submitMethod),localStorage.setItem("bgmEntityType",I.entityType),localStorage.setItem("bgmCsvData",JSON.stringify(I.csvData)),localStorage.setItem("bgmCurrentIndex",I.currentIndex.toString()),localStorage.setItem("bgmIsCommitMessageLocked",I.isCommitMessageLocked.toString()),localStorage.setItem("bgmLockedCommitMessage",I.lockedCommitMessage),I.previousItem&&localStorage.setItem("bgmPreviousItem",JSON.stringify(I.previousItem)),localStorage.setItem("bgmDiffViewMode",I.diffViewMode),localStorage.setItem("bgmTheme",I.theme)}function Pi(t,e){let n={subject:{wikiPath:`/p1/wiki/subjects/${e}`,historyPath:`/p1/wiki/subjects/${e}/history-summary`,patchBodyKey:"subject",editPagePath:`https://bgm.tv/subject/${e}/edit`},character:{wikiPath:`/p1/wiki/characters/${e}`,historyPath:`/p1/wiki/characters/${e}/history-summary`,patchBodyKey:"character",editPagePath:`https://bgm.tv/character/${e}/edit`},person:{wikiPath:`/p1/wiki/persons/${e}`,historyPath:`/p1/wiki/persons/${e}/history-summary`,patchBodyKey:"person",editPagePath:`https://bgm.tv/person/${e}/edit`}};return n[t]||n.subject}function fo(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="block")}function ji(t,e){let n=document.getElementById("progress-text"),i=document.getElementById("progress-bar");n&&(n.textContent=`\u5904\u7406\u8FDB\u5EA6: ${t}/${e}`);let r=e>0?t/e*100:0;i&&(i.style.width=`${r}%`)}function rd(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Ui(t){let e=document.getElementById("bgm-loading-overlay"),n=document.getElementById("loading-text");n&&(n.textContent=t),e&&e.classList.add("active")}function vn(){let t=document.getElementById("bgm-loading-overlay");t&&t.classList.remove("active")}function en(t){let e=document.getElementById("bgm-status-message");e&&(e.classList.remove("show"),e.offsetWidth,e.textContent=t,e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3))}function od(){let t=document.getElementById("bgm-status-message");t&&t.classList.remove("show")}var Pd=id(gd(),1);var up={name:"stub",maxLineToIgnoreSyntax:0,setMaxLineToIgnoreSyntax:()=>{},ignoreSyntaxHighlightList:[],setIgnoreSyntaxHighlightList:()=>{},getAST:()=>({children:[]}),processAST:()=>({syntaxFileObject:{},syntaxFileLineNumber:0}),hasRegisteredCurrentLang:()=>!1,getHighlighterEngine:()=>null},gr=up;var Er;(function(t){t.None="None",t.Up="Up",t.Down="Down",t.Both="Both",t.Short="Short"})(Er||(Er={}));var ca=class{constructor(e,n,i,r,o){this.header=e,this.lines=n,this.unifiedDiffStart=i,this.unifiedDiffEnd=r,this.expansionType=o}equals(e){return this===e?!0:this.header.equals(e.header)&&this.unifiedDiffStart===e.unifiedDiffStart&&this.unifiedDiffEnd===e.unifiedDiffEnd&&this.expansionType===e.expansionType&&this.lines.length===e.lines.length&&this.lines.every((n,i)=>n.equals(e.lines[i]))}},ua=class{constructor(e,n,i,r){this.oldStartLine=e,this.oldLineCount=n,this.newStartLine=i,this.newLineCount=r}toDiffLineRepresentation(){return`@@ -${this.oldStartLine},${this.oldLineCount} +${this.newStartLine},${this.newLineCount} @@`}equals(e){return this.oldStartLine===e.oldStartLine&&this.oldLineCount===e.oldLineCount&&this.newStartLine===e.newStartLine&&this.oldStartLine===e.oldStartLine}};var In="--diff-add-content-highlight--",Nn="--diff-del-content-highlight--",et;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(et||(et={}));var yo=t=>{switch(t){case et.LF:return"\u240A";case et.CR:return"\u240D";case et.CRLF:return"\u240D\u240A";default:return""}},vd;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(vd||(vd={}));var pp=1e3;function _d(t){return t.location+t.length}function wd(t,e,n,i,r){let o=Math.min(e.length,i.length),a=r?_d(e)-1:e.location,l=r?_d(i)-1:i.location,f=r?-1:1,u=0;for(;Math.abs(u)<o&&t[a+u]===n[l+u];)u+=f;return Math.abs(u)}function is(t){return t.trim().length===0||t.length>=pp}function jd(t,e){let n=t.text,i=e.text,r=n.slice(-2),o=i.slice(-2),a=r===`\r
`?et.CRLF:r.endsWith("\r")?et.CR:r.endsWith(`
`)?et.LF:et.NULL,l=o===`\r
`?et.CRLF:o.endsWith("\r")?et.CR:o.endsWith(`
`)?et.LF:et.NULL,f=t.noTrailingNewLine!==e.noTrailingNewLine;return a===l&&!f?{addSymbol:void 0,addString:n,delSymbol:void 0,delString:i}:{addSymbol:f?t.noTrailingNewLine?et.NEWLINE:et.NORMAL:a,addString:a===et.CRLF?n.slice(0,-2):a===et.CR||a===et.LF?n.slice(0,-1):n,delSymbol:f?e.noTrailingNewLine?et.NEWLINE:et.NORMAL:l,delString:l===et.CRLF?i.slice(0,-2):l===et.CR||l===et.LF?i.slice(0,-1):i}}function hp(t,e){let n=t.text,i=e.text,{addString:r,delString:o,addSymbol:a,delSymbol:l}=jd(t,e);if(r===o&&a&&l)return{addRange:{range:{location:r.length,length:n.length-r.length},hasLineChange:!0,newLineSymbol:a},delRange:{range:{location:o.length,length:i.length-o.length},hasLineChange:!0,newLineSymbol:l}};let f={location:0,length:o.length},u={location:0,length:r.length};if(is(n)||is(i))return u.length=0,f.length=0,{addRange:{range:u},delRange:{range:f}};let d=wd(o,f,r,u,!1);f={location:f.location+d,length:f.length-d},u={location:u.location+d,length:u.length-d};let c=wd(o,f,r,u,!0);return f.length-=c,u.length-=c,{addRange:{range:u,hasLineChange:(r.slice(0,u.location)+r.slice(u.location+u.length)).trim().length>0},delRange:{range:f,hasLineChange:(o.slice(0,f.location)+o.slice(f.location+f.length)).trim().length>0}}}function mp(t,e){let{addString:n,addSymbol:i,delString:r,delSymbol:o}=jd(t,e);if(is(n)||is(r))return{addRange:{range:[],hasLineChange:!!i,newLineSymbol:i},delRange:{range:[],hasLineChange:!!o,newLineSymbol:o}};let a=(0,Pd.default)(r,n,0,!0),l=0,f=0,u=a.filter(c=>c[0]!==-1).map(c=>({type:c[0],str:c[1],startIndex:l,endIndex:l+c[1].length-1,length:(l+=c[1].length,c[1].length)})),d=a.filter(c=>c[0]!==1).map(c=>({type:c[0],str:c[1],startIndex:f,endIndex:f+c[1].length-1,length:(f+=c[1].length,c[1].length)}));return{addRange:{range:u,hasLineChange:u.some(c=>c.type===0&&c.str.trim().length>0),newLineSymbol:i},delRange:{range:d,hasLineChange:u.some(c=>c.type===0&&c.str.trim().length>0),newLineSymbol:o}}}var He;(function(t){t[t.Context=0]="Context",t[t.Add=1]="Add",t[t.Delete=2]="Delete",t[t.Hunk=3]="Hunk"})(He||(He={}));var Ot=class t{constructor(e,n,i,r,o,a=!1,l,f,u,d,c,p,m,g){this.text=e,this.type=n,this.originalLineNumber=i,this.oldLineNumber=r,this.newLineNumber=o,this.noTrailingNewLine=a,this.changes=l,this.diffChanges=f,this._diffChanges=u,this.plainTemplate=d,this.plainTemplateMode=c,this.syntaxTemplate=p,this.syntaxTemplateName=m,this.syntaxTemplateMode=g}withNoTrailingNewLine(e){return new t(this.text,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,e)}isIncludeableLine(){return this.type===He.Add||this.type===He.Delete}equals(e){return this.text===e.text&&this.type===e.type&&this.originalLineNumber===e.originalLineNumber&&this.oldLineNumber===e.oldLineNumber&&this.newLineNumber===e.newLineNumber&&this.noTrailingNewLine===e.noTrailingNewLine}clone(e){return new t(e,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,this.noTrailingNewLine)}},Ki=t=>t?t.type===He.Add||t.type===He.Delete:!1,gp=/["'&<>]/;function vp(t){let e=""+t,n=gp.exec(e);if(!n)return e;let i="",r,o,a=0;for(o=n.index;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}a!==o&&(i+=e.slice(a,o)),a=o+1,i+=r}return a!==o?i+e.slice(a,o):i}var ba=!1,os=t=>t,bd=os,xd=os;var Sr=()=>ba,Ir=t=>ba&&os!==bd?bd(t):t,_p=t=>ba&&os!==xd?xd(t):t,wp=!1,bp=()=>wp;var xp=!0,pa=()=>xp;var Nr=t=>vp(t).replace(/\n/g,"").replace(/\r/g,""),Eo=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="relative")return;let i=t.changes;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Ir:Nr,o=i.range,a=e.slice(0,o.location),l=e.slice(o.location,o.location+o.length),f=e.slice(o.location+o.length),u=l.includes(`
`),d=i.newLineSymbol,c=`<span data-range-start="${o.location}" data-range-end="${o.location+o.length}">`;c+=r(a),c+=`<span data-diff-highlight style="background-color: var(${n==="add"?In:Nn});border-radius: 0.2em;">`,c+=u?`${r(l)}<span data-newline-symbol>${yo(d)}</span>`:r(l),c+="</span>",c+=r(f),c+="</span>",t.plainTemplate=c,t.plainTemplateMode="relative"},yd=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="fast-diff")return;let i=t.diffChanges;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Ir:Nr,o="";i.range.forEach(({type:a,str:l,startIndex:f,endIndex:u},d,c)=>{let p=d===c.length-1;a===0?(o+=`<span>${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight style="background-color: var(${n==="add"?In:Nn});border-radius: 0.2em;">${yo(i.newLineSymbol)}</span>`:"",o+="</span>"):(o+=`<span data-range-start="${f}" data-range-end="${u}">`,o+=`<span data-diff-highlight style="background-color: var(${n==="add"?In:Nn});border-radius: 0.2em;">${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight>${yo(i.newLineSymbol)}</span>`:"",o+="</span></span>")}),t.plainTemplate=o,t.plainTemplateMode="fast-diff"},Ao=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="relative"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let o=e.changes;if(!o||!o.hasLineChange)return;let a=Sr()?Ir:Nr,l=o.range,f=`<span data-range-start="${l.location}" data-range-end="${l.location+l.length}">`;(r=n?.nodeList)===null||r===void 0||r.forEach(({node:u,wrapper:d})=>{var c,p,m,g,x,b;if(u.endIndex<l.location||l.location+l.length<u.startIndex)f+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(p=((c=d?.properties)===null||c===void 0?void 0:c.className)||[])===null||p===void 0?void 0:p.join(" ")}" style="${((m=d?.properties)===null||m===void 0?void 0:m.style)||""}">${a(u.value)}</span>`;else{let _=l.location-u.startIndex,L=_<0?0:_,y=u.value.slice(0,L),N=u.value.slice(L,_+l.length),S=u.value.slice(_+l.length),E=y.length||l.location===u.startIndex,h=S.length||u.endIndex===l.location+l.length-1,w=N.includes(`
`);f+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(x=((g=d?.properties)===null||g===void 0?void 0:g.className)||[])===null||x===void 0?void 0:x.join(" ")}" style="${((b=d?.properties)===null||b===void 0?void 0:b.style)||""}">${a(y)}<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-top-left-radius: ${E?"0.2em":"0"};border-bottom-left-radius: ${E?"0.2em":"0"};border-top-right-radius: ${h||w?"0.2em":"0"};border-bottom-right-radius: ${h||w?"0.2em":"0"}">${w?`${a(N)}<span data-newline-symbol>${yo(o.newLineSymbol)}</span>`:a(N)}</span>${a(S)}</span>`}}),f+="</span>",e.syntaxTemplate=f,e.syntaxTemplateMode="relative",e.syntaxTemplateName=t._getHighlighterName()},Ed=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r,o,a;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="fast-diff"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let l=e.diffChanges,f=e._diffChanges;if(!l||!l.hasLineChange)return;let u=Sr()?Ir:Nr,d="",c=((r=l?.range)===null||r===void 0?void 0:r.filter(g=>g.type!==0))||[],p=((o=f?.range)===null||o===void 0?void 0:o.filter(g=>g.type!==0))||[],m=0;(a=n?.nodeList)===null||a===void 0||a.forEach(({node:g,wrapper:x},b,_)=>{var L,y,N;d+=`<span data-start="${g.startIndex}" data-end="${g.endIndex}" class="${(y=((L=x?.properties)===null||L===void 0?void 0:L.className)||[])===null||y===void 0?void 0:y.join(" ")}" style="${((N=x?.properties)===null||N===void 0?void 0:N.style)||""}">`;let S=c[m],E=c.length===0&&p.length===0,h=b===_.length-1;for(let w=0;w<g.value.length;w++){let A=g.startIndex+w,T=g.value[w],M=w===g.value.length-1,U=h&&w===g.value.length-1;if(S)if(A<S.startIndex)d+=u(T);else if(A===S.startIndex)S.endIndex<=g.endIndex?d+=`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-radius: 0.2em;">`:d+=`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-top-left-radius: 0.2em;border-bottom-left-radius: 0.2em;">`,d+=u(T),(M||S.startIndex===S.endIndex)&&(d+="</span>"),S.endIndex===A&&(m++,S=c[m]);else if(A<S.endIndex){if(w===0){let P=S.startIndex>=g.startIndex&&S.endIndex<=g.endIndex,J=S.endIndex<=g.endIndex;d+=P?`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-radius: 0.2em;">`:J?`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`:`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});">`}d+=u(T),M&&(d+="</span>")}else A===S.endIndex&&(S.startIndex>=g.startIndex||w===0&&(d+=`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`),d+=u(T),d+="</span>",m++,S=c[m]);else d+=u(T),E&&U&&l.newLineSymbol&&(d+=`<span data-diff-highlight style="background-color: var(${i==="add"?In:Nn});border-radius: 0.2em;">`,d+=`<span data-newline-symbol>${yo(l.newLineSymbol)}</span></span>`)}d+="</span>"}),e.syntaxTemplate=d,e.syntaxTemplateMode="fast-diff",e.syntaxTemplateName=t._getHighlighterName()},xa=t=>{var e;let n="",i=Sr()?Ir:Nr;return(e=t?.nodeList)===null||e===void 0||e.forEach(({node:r,wrapper:o})=>{var a,l,f;n+=`<span data-start="${r.startIndex}" data-end="${r.endIndex}" class="${(l=((a=o?.properties)===null||a===void 0?void 0:a.className)||[])===null||l===void 0?void 0:l.join(" ")}" style="${((f=o?.properties)===null||f===void 0?void 0:f.style)||""}">${i(r.value)}</span>`}),n},ya=t=>t?(Sr()?Ir:Nr)(t):"",yp=40;function Ep(t,e){throw new Error(e)}function Ap(t){var e,n;if(t.length===0)return 0;for(let i=t.length-1;i>=0;i--){let r=t[i];for(let o=r.lines.length-1;o>=0;o--){let a=r.lines[o];if(a.type===He.Hunk)continue;let l=(e=a.newLineNumber)!==null&&e!==void 0?e:0,f=(n=a.oldLineNumber)!==null&&n!==void 0?n:0;return l>f?l:f}}return 0}function Lp(t,e,n){let i=n===null?1/0:e.oldStartLine-n.header.oldStartLine-n.header.oldLineCount;return t===0?e.oldStartLine>1&&e.newStartLine>1?Er.Up:Er.None:i<=yp?Er.Short:Er.Both}var Ud=(t,e)=>{let n=[];for(let i=0;i<t;i++)n.push(e(i));return n},Ad=t=>{let e=t.lastIndexOf(".");return t.slice(e+1)},Ld=(t,e,{diffFile:n,getAdditionRaw:i,getDeletionRaw:r,getAdditionSyntax:o,getDeletionSyntax:a})=>{if(t.length===e.length){let l=t.length;for(let f=0;f<l;f++){let u=t[f],d=e[f];if(!u.changes||!d.changes){let p=Ot.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Ot.prototype.clone.call(d,r(d.oldLineNumber)||d.text||""),{addRange:g,delRange:x}=hp(p,m);u.changes=g,d.changes=x}let c=pa();if(!bp())c&&(Eo({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),Eo({diffLine:d,rawLine:r(d.oldLineNumber)||"",operator:"del"}),Ao({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),Ao({diffFile:n,diffLine:d,syntaxLine:a(d.oldLineNumber)||null,operator:"del"}));else{let p=Ot.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Ot.prototype.clone.call(d,r(d.oldLineNumber)||d.text||""),{addRange:g,delRange:x}=mp(p,m);u.diffChanges=g,d.diffChanges=x,u._diffChanges=x,d._diffChanges=g,c&&(yd({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),yd({diffLine:d,rawLine:r(d.oldLineNumber)||"",operator:"del"}),Ed({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),Ed({diffFile:n,diffLine:d,syntaxLine:a(d.oldLineNumber)||null,operator:"del"}))}}}},kp=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,Sp=/[\u202A-\u202E]|[\u2066-\u2069]/,Wd="+",zd="-",Gd=" ",Qd="\\",Vd=`
`,Ip=new Set([Wd,zd,Gd,Qd,Vd]),ha=class{constructor(){Object.defineProperty(this,"__v_skip",{value:!0}),this.reset()}reset(){this.ls=0,this.le=-1,this.text=""}nextLine(){return this.ls=this.le+1,this.ls>=this.text.length?!1:(this.le=this.text.indexOf(`
`,this.ls),this.le===-1&&(this.le=this.text.length),this.ls!==this.le)}readLine(e){return e?this.nextLine()?this.text.substring(this.ls,this.le):null:this.nextLine()?this.text.substring(this.ls+1,this.le+1):this.text.length>this.ls?`
`:null}lineStartsWith(e){return this.text.startsWith(e,this.ls)}lineEndsWith(e){return this.text.endsWith(e,this.le)}peek(){let e=this.le+1;return e<this.text.length?this.text[e]:null}parseDiffHeader(){let e=!1;for(;this.nextLine();){if(this.lineStartsWith("Binary files ")&&this.lineEndsWith("differ"))return{isBinary:!0};if(this.lineStartsWith("---")&&(e=!0),this.lineStartsWith("+++"))return{isBinary:!1}}return null}numberFromGroup(e,n,i=null){let r=e[n];if(!r){if(!i)throw new Error(`Group ${n} missing from regexp match and no defaultValue was provided`);return i}let o=parseInt(r,10);if(isNaN(o))throw new Error(`Could not parse capture group ${n} into number: ${r}`);return o}parseHunkHeader(e){let n=kp.exec(e);if(!n)throw new Error("Invalid hunk header format");let i=this.numberFromGroup(n,1),r=this.numberFromGroup(n,2,1),o=this.numberFromGroup(n,3),a=this.numberFromGroup(n,4,1);return new ua(i,r,o,a)}parseLinePrefix(e){return e&&e.length&&Ip.has(e[0])?e[0]:null}parseHunk(e,n,i){let r=this.readLine(!0);if(!r)throw new Error("Expected hunk header but reached end of diff");let o=this.parseHunkHeader(r),a=new Array;a.push(new Ot(r,He.Hunk,1,null,null));let l,f=o.oldStartLine,u=o.newStartLine,d=e;for(;l=this.parseLinePrefix(this.peek());){let c=this.readLine(!1);if(c===null)throw new Error("Expected unified diff line but reached end of diff");if(l===Qd){if(c.length<12)throw new Error('Expected "no newline at end of file" marker to be at least 12 bytes long');let m=a.length-1,g=a[m];a[m]=g.withNoTrailingNewLine(!0);continue}d++;let p;if(l===Wd)p=new Ot(c,He.Add,d,null,u++);else if(l===zd)p=new Ot(c,He.Delete,d,f++,null);else if(l===Gd||l===Vd)p=new Ot(c,He.Context,d,f++,u++);else return Ep(l,`Unknown DiffLinePrefix: ${l}`);a.push(p)}if(a.length===1)throw new Error("Malformed diff, empty hunk");return new ca(o,a,e,e+a.length-1,Lp(n,o,i))}parse(e){this.text=e;try{let n=this.parseDiffHeader(),i=this.le,r=this.text.substring(0,i);if(!n)return{header:r,contents:"",hunks:[],isBinary:!1,maxLineNumber:0,hasHiddenBidiChars:!1};if(n.isBinary)return{header:r,contents:"",hunks:[],isBinary:!0,maxLineNumber:0,hasHiddenBidiChars:!1};let o=new Array,a=0,l=null;for(;this.peek();){let u=this.parseHunk(a,o.length,l);o.push(u),l=u,a+=u.lines.length}let f=this.text.substring(i+1,this.le).replace(/\n\\ No newline at end of file/g,"");return{header:r,contents:f,hunks:o,isBinary:n.isBinary,maxLineNumber:Ap(o),hasHiddenBidiChars:Sp.test(e)}}finally{this.reset()}}},Np=new ha;function v(t,e,n,i){if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?i:n==="a"?i.call(t):i?i.value:e.get(t)}function G(t,e,n,i,r){if(i==="m")throw new TypeError("Private method is not writable");if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return i==="a"?r.call(t,n):r?r.value=n:e.set(t,n),n}var ts,vo,Ar,ma,ga=class extends Map{constructor(){super(...arguments),ts.add(this),vo.set(this,[]),Ar.set(this,30)}get maxLength(){return v(this,Ar,"f")}setMaxLength(e){G(this,Ar,e,"f"),v(this,ts,"m",ma).call(this)}set(e,n){return v(this,Ar,"f")<=0?this:this.has(e)?this:(v(this,vo,"f").push(e),v(this,ts,"m",ma).call(this),super.set(e,n))}};vo=new WeakMap,Ar=new WeakMap,ts=new WeakSet,ma=function(){for(;v(this,vo,"f").length>v(this,Ar,"f");){let e=v(this,vo,"f").shift();e&&this.delete(e)}};var Yd,po,$p,Ei=new ga;Ei.setMaxLength(50);Ei.name="@git-diff-view/core";var aa=new Set,Lo=class t{static createInstance(e){let n=new t(e?.raw,e?.lang,e?.fileName);return n.ast=e?.ast,n.theme=e?.theme,n.rawFile=e?.rawFile||{},n.plainFile=e?.plainFile||{},n.hasDoRaw=e?.hasDoRaw,n.rawLength=e?.rawLength,n.syntaxFile=e?.syntaxFile||{},n.hasDoSyntax=e?.hasDoSyntax,n.syntaxLength=e?.syntaxLength,n.highlighterName=e?.highlighterName,n.highlighterType=e?.highlighterType,n.maxLineNumber=e?.maxLineNumber,n}constructor(e,n,i){Yd.add(this),this.raw=e,this.lang=n,this.fileName=i,po.set(this,""),this.rawFile={},this.hasDoRaw=!1,this.syntaxFile={},this.plainFile={},this.hasDoSyntax=!1,this.maxLineNumber=0,this.raw=_p(e),Object.defineProperty(this,"__v_skip",{value:!0}),this.initId()}initId(){let e="-file--"+Math.random().toString().slice(2);for(;aa.has(e);)e="-file--"+Math.random().toString().slice(2);aa.add(e),G(this,po,e,"f")}getId(){return v(this,po,"f")}clearId(){aa.delete(v(this,po,"f"))}doSyntax({registerHighlighter:e,theme:n}){if(!this.raw)return;let i=e||gr;if(this.rawLength&&this.rawLength>i.maxLineToIgnoreSyntax)return;let r=i;try{i.hasRegisteredCurrentLang(this.lang)||(r=gr)}catch{r=gr}if(this.hasDoSyntax&&r.name===this.highlighterName&&r.type===this.highlighterType&&(this.theme===n||r.type==="class")||(this.ast=r.getAST(this.raw,this.fileName,this.lang,n),this.theme=n,!this.ast))return;let{syntaxFileObject:o,syntaxFileLineNumber:a}=r.processAST(this.ast);pa()&&Object.values(o).forEach(l=>{l.template=xa(l)}),this.syntaxFile=o,this.syntaxLength=a,this.highlighterName=r.name,this.highlighterType=r.type,this.hasDoSyntax=!0}doRaw(){if(!this.raw||this.hasDoRaw)return;let n=this.raw.split(`
`);this.rawLength=n.length,this.maxLineNumber=n.length,this.rawFile={},this.plainFile={};let i=pa();for(let r=0;r<n.length;r++)this.rawFile[r+1]=r<n.length-1?n[r]+`
`:n[r],this.plainFile[r+1]={value:this.rawFile[r+1],template:i?ya(this.rawFile[r+1]):void 0};this.hasDoRaw=!0}};po=new WeakMap,Yd=new WeakSet,$p=function(){this.rawLength&&this.syntaxLength&&(this.rawLength!==this.syntaxLength&&console.warn("[@git-diff-view/core] The rawLength does not match the syntaxLength."),Object.values(this.syntaxFile).forEach(({value:e,lineNumber:n})=>{e!==this.rawFile[n]&&console.warn("[@git-diff-view/core] Content mismatch detected at line "+n+": "+e+" !== "+this.rawFile[n])}))};function vr(t,e,n,i,r){let o=t+"--0.1.7--"+n+"--"+e;r&&(o=r+"--0.1.7--"+n+"--"+e);let a=t+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e;if(r&&(a=r+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e),Ei.has(o))return Ei.get(o);if(Ei.has(a)){let f=Ei.get(a);if(f?.highlighterType==="class")return f}let l=new Lo(t,e,i);return Ei.set(o,l),l}var ss=Ei;var rs;(function(t){t[t.hunk=1]="hunk",t[t.content=2]="content",t[t.widget=3]="widget",t[t.extend=4]="extend"})(rs||(rs={}));var R;(function(t){t[t.old=1]="old",t[t.new=2]="new"})(R||(R={}));var as=t=>{let e=t.splitLineLength,n=[];return Ud(e,i=>{let r=t.getSplitLeftLine(i),o=t.getSplitRightLine(i);!r?.isHidden&&!o?.isHidden&&n.push({type:rs.content,index:i,lineNumber:i+1,splitLine:{left:r,right:o}})}),n};var Ea=t=>{let e=t.unifiedLineLength,n=[];return Ud(e,i=>{let r=t.getUnifiedLine(i);r.isHidden||n.push({type:rs.content,index:i,lineNumber:i+1,unifiedLine:r})}),n},Cp=(t,e,n)=>{let i=t.getSplitLineByLineNumber(e,n),r=t.getUnifiedLineByLineNumber(e,n);return{split:!i||i.isHidden,unified:!r||r.isHidden}},$e,Ke,Xe,ki,Si,Qn,Vn,Qi,Vi,Yi,Ji,Yn,Jn,$n,Cn,Ct,it,ot,qe,st,pi,wr,br,xr,yr,ho,Gi,mo,_o,wo,Ai,Li,ns,Rt,Wi,zi,go,hi,Jd,qd,va,Kd,Dp,_a,wa,kd,Xd,Lr,kr,bo,xo,Sd,Id,je=40;var la=new Set,qi=class t{static createInstance(e,n){var i,r,o,a,l,f;let u=new t(((i=e?.oldFile)===null||i===void 0?void 0:i.fileName)||"",((r=e?.oldFile)===null||r===void 0?void 0:r.content)||"",((o=e?.newFile)===null||o===void 0?void 0:o.fileName)||"",((a=e?.newFile)===null||a===void 0?void 0:a.content)||"",e?.hunks||[],((l=e?.oldFile)===null||l===void 0?void 0:l.fileLang)||"",((f=e?.newFile)===null||f===void 0?void 0:f.fileLang)||"");return n&&(n.isFullMerge?u._mergeFullBundle(n):u.mergeBundle(n)),u}constructor(e,n,i,r,o,a,l,f){$e.add(this),this.uuid=f,Ke.set(this,void 0),Xe.set(this,void 0),ki.set(this,void 0),Si.set(this,void 0),Qn.set(this,void 0),Vn.set(this,void 0),Qi.set(this,void 0),Vi.set(this,void 0),Yi.set(this,void 0),Ji.set(this,void 0),Yn.set(this,void 0),Jn.set(this,void 0),$n.set(this,void 0),Cn.set(this,void 0),Ct.set(this,[]),it.set(this,[]),ot.set(this,void 0),qe.set(this,[]),st.set(this,void 0),pi.set(this,[]),wr.set(this,!1),br.set(this,!1),xr.set(this,!1),yr.set(this,!1),ho.set(this,0),Gi.set(this,!1),mo.set(this,!1),_o.set(this,!1),wo.set(this,!1),Ai.set(this,void 0),Li.set(this,void 0),ns.set(this,!1),Rt.set(this,"light"),Wi.set(this,{state:!1}),zi.set(this,{state:!1}),this._version_="0.1.7",this._oldFileName="",this._oldFileContent="",this._oldFileLang="",this._newFileName="",this._newFileContent="",this._newFileLang="",this._diffList=[],this.diffLineLength=0,this.splitLineLength=0,this.unifiedLineLength=0,this.fileLineLength=0,this.additionLength=0,this.deletionLength=0,this.hasSomeLineCollapsed=!1,go.set(this,""),hi.set(this,new Map),this.getSplitLeftLine=d=>v(this,Ct,"f")[d],this.getSplitLineByLineNumber=(d,c)=>{var p,m;return c===R.old?(p=v(this,Ct,"f"))===null||p===void 0?void 0:p.find(g=>g.lineNumber===d):(m=v(this,it,"f"))===null||m===void 0?void 0:m.find(g=>g.lineNumber===d)},this.getSplitLineIndexByLineNumber=(d,c)=>{var p,m;return c===R.old?(p=v(this,Ct,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.lineNumber===d):(m=v(this,it,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.lineNumber===d)},this.getSplitRightLine=d=>v(this,it,"f")[d],this.getSplitHunkLine=d=>{var c;return(c=v(this,ot,"f"))===null||c===void 0?void 0:c[d]},this.onSplitHunkExpand=(d,c,p=!0)=>{var m,g,x;if(!this.getExpandEnabled())return;let b=(m=v(this,ot,"f"))===null||m===void 0?void 0:m[c];if(!(!b||!b.splitInfo)){if(d==="all"){for(let _=b.splitInfo.startHiddenIndex;_<b.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}b.splitInfo={...b.splitInfo,...b.hunkInfo,plainText:b.text,startHiddenIndex:b.splitInfo.endHiddenIndex}}else if(d==="down"){for(let _=b.splitInfo.startHiddenIndex;_<b.splitInfo.startHiddenIndex+je;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}b.isLast?b.splitInfo={...b.splitInfo,startHiddenIndex:b.splitInfo.startHiddenIndex+je}:b.splitInfo={...b.splitInfo,startHiddenIndex:b.splitInfo.startHiddenIndex+je,plainText:`@@ -${b.splitInfo.oldStartIndex},${b.splitInfo.oldLength} +${b.splitInfo.newStartIndex},${b.splitInfo.newLength}`}}else if(d==="down-all"){for(let _=b.splitInfo.startHiddenIndex;_<b.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}b.splitInfo={...b.splitInfo,plainText:"",startHiddenIndex:b.splitInfo.endHiddenIndex}}else if(d==="up"){if(b.isLast)return;for(let S=b.splitInfo.endHiddenIndex-je;S<b.splitInfo.endHiddenIndex;S++){let E=v(this,Ct,"f")[S],h=v(this,it,"f")[S];E?.isHidden&&(E.isHidden=!1),h?.isHidden&&(h.isHidden=!1)}let _=b.splitInfo.oldStartIndex-je,L=b.splitInfo.oldLength+je,y=b.splitInfo.newStartIndex-je,N=b.splitInfo.newLength+je;b.splitInfo={...b.splitInfo,endHiddenIndex:b.splitInfo.endHiddenIndex-je,oldStartIndex:_,oldLength:L,newStartIndex:y,newLength:N,plainText:`@@ -${_},${L} +${y},${N}`},(g=v(this,ot,"f"))===null||g===void 0||delete g[c],v(this,ot,"f")[b.splitInfo.endHiddenIndex]=b}else if(d==="up-all"){if(b.isLast)return;for(let _=b.splitInfo.startHiddenIndex;_<b.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}b.splitInfo={...b.splitInfo,plainText:"",endHiddenIndex:b.splitInfo.startHiddenIndex},(x=v(this,ot,"f"))===null||x===void 0||delete x[c],v(this,ot,"f")[b.splitInfo.endHiddenIndex]=b}p&&this.notifyAll()}},this.getUnifiedLine=d=>v(this,qe,"f")[d],this.getUnifiedLineByLineNumber=(d,c)=>{var p,m;return c===R.old?(p=v(this,qe,"f"))===null||p===void 0?void 0:p.find(g=>g.oldLineNumber===d):(m=v(this,qe,"f"))===null||m===void 0?void 0:m.find(g=>g.newLineNumber===d)},this.getUnifiedLineIndexByLineNumber=(d,c)=>{var p,m;return c===R.old?(p=v(this,qe,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.oldLineNumber===d):(m=v(this,qe,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.newLineNumber===d)},this.getUnifiedHunkLine=d=>{var c;return(c=v(this,st,"f"))===null||c===void 0?void 0:c[d]},this.onUnifiedHunkExpand=(d,c,p=!0)=>{var m,g,x,b;if(!this.getExpandEnabled())return;let _=(m=v(this,st,"f"))===null||m===void 0?void 0:m[c];if(!(!_||!_.unifiedInfo)){if(d==="all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=(g=v(this,qe,"f"))===null||g===void 0?void 0:g[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,..._.hunkInfo,plainText:_.text,startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(d==="down"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.startHiddenIndex+je;L++){let y=v(this,qe,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.isLast?_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je}:_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je,plainText:`@@ -${_.unifiedInfo.oldStartIndex},${_.unifiedInfo.oldLength} +${_.unifiedInfo.newStartIndex},${_.unifiedInfo.newLength}`}}else if(d==="down-all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=v(this,qe,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(d==="up"){if(_.isLast)return;for(let E=_.unifiedInfo.endHiddenIndex-je;E<_.unifiedInfo.endHiddenIndex;E++){let h=v(this,qe,"f")[E];h?.isHidden&&(h.isHidden=!1)}let L=_.unifiedInfo.oldStartIndex-je,y=_.unifiedInfo.oldLength+je,N=_.unifiedInfo.newStartIndex-je,S=_.unifiedInfo.newLength+je;_.unifiedInfo={..._.unifiedInfo,endHiddenIndex:_.unifiedInfo.endHiddenIndex-je,oldStartIndex:L,oldLength:y,newStartIndex:N,newLength:S,plainText:`@@ -${L},${y} +${N},${S}`},(x=v(this,st,"f"))===null||x===void 0||delete x[c],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}else if(d==="up-all"){if(_.isLast)return;for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=v(this,qe,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",endHiddenIndex:_.unifiedInfo.startHiddenIndex},(b=v(this,st,"f"))===null||b===void 0||delete b[c],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}p&&this.notifyAll()}},this.onAllExpand=d=>{this.getExpandEnabled()&&(d==="split"?(Object.keys(v(this,ot,"f")||{}).forEach(c=>{this.onSplitHunkExpand("all",+c,!1)}),v(this,Wi,"f").state=!0):(Object.keys(v(this,st,"f")||{}).forEach(c=>{this.onUnifiedHunkExpand("all",+c,!1)}),v(this,zi,"f").state=!0),this.notifyAll())},this.onAllCollapse=d=>{this.getExpandEnabled()&&(d==="split"?(Object.values(v(this,Ct,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,it,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,ot,"f")||{}).forEach(c=>{c.splitInfo&&(c.splitInfo={...c.splitInfo,oldStartIndex:c.splitInfo._oldStartIndex,oldLength:c.splitInfo._oldLength,newStartIndex:c.splitInfo._newStartIndex,newLength:c.splitInfo._newLength,startHiddenIndex:c.splitInfo._startHiddenIndex,endHiddenIndex:c.splitInfo._endHiddenIndex,plainText:c.splitInfo._plainText})}),Object.keys(v(this,ot,"f")||{}).forEach(c=>{let p=v(this,ot,"f")[c];p.splitInfo&&p.splitInfo.endHiddenIndex!==+c&&(delete v(this,ot,"f")[c],v(this,ot,"f")[p.splitInfo.endHiddenIndex]=p)}),v(this,Wi,"f").state=!1):(Object.values(v(this,qe,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,st,"f")||{}).forEach(c=>{c.unifiedInfo&&(c.unifiedInfo={...c.unifiedInfo,oldStartIndex:c.unifiedInfo._oldStartIndex,oldLength:c.unifiedInfo._oldLength,newStartIndex:c.unifiedInfo._newStartIndex,newLength:c.unifiedInfo._newLength,startHiddenIndex:c.unifiedInfo._startHiddenIndex,endHiddenIndex:c.unifiedInfo._endHiddenIndex,plainText:c.unifiedInfo._plainText})}),Object.keys(v(this,st,"f")||{}).forEach(c=>{let p=v(this,st,"f")[c];p.unifiedInfo&&p.unifiedInfo.endHiddenIndex!==+c&&(delete v(this,st,"f")[c],v(this,st,"f")[p.unifiedInfo.endHiddenIndex]=p)}),v(this,zi,"f").state=!1),this.notifyAll())},this.getOldFileContent=()=>{var d;return(d=v(this,Ke,"f"))===null||d===void 0?void 0:d.raw},this.getNewFileContent=()=>{var d;return(d=v(this,Xe,"f"))===null||d===void 0?void 0:d.raw},this.getOldPlainLine=d=>{var c;return(c=v(this,Yi,"f"))===null||c===void 0?void 0:c[d]},this.getOldSyntaxLine=d=>{var c;return(c=v(this,Yn,"f"))===null||c===void 0?void 0:c[d]},this.getNewPlainLine=d=>{var c;return(c=v(this,Ji,"f"))===null||c===void 0?void 0:c[d]},this.getNewSyntaxLine=d=>{var c;return(c=v(this,Jn,"f"))===null||c===void 0?void 0:c[d]},this.subscribe=d=>(v(this,pi,"f").push(d),()=>{G(this,pi,v(this,pi,"f").filter(c=>c!==d),"f")}),this.notifyAll=d=>{var c;G(this,ho,(c=v(this,ho,"f"),c++,c),"f"),v(this,pi,"f").forEach(p=>{d&&p.isSyncExternal||p()}),v(this,hi,"f").forEach((p,m)=>{m.notifyAll(!0)})},this.getUpdateCount=()=>v(this,ho,"f"),this.getExpandEnabled=()=>!v(this,Gi,"f")&&!v(this,mo,"f"),this.getBundle=()=>{let d=v(this,wr,"f"),c=v(this,br,"f"),p=v(this,xr,"f"),m=v(this,yr,"f"),g=v(this,Qi,"f"),x=v(this,Qn,"f"),b=v(this,Yi,"f"),_=v(this,Yn,"f"),L=v(this,$n,"f"),y=v(this,Vi,"f"),N=v(this,Vn,"f"),S=v(this,Ji,"f"),E=v(this,Jn,"f"),h=v(this,Cn,"f"),w=this.splitLineLength,A=this.unifiedLineLength,T=this.fileLineLength,M=this.additionLength,U=this.deletionLength,P=v(this,Gi,"f"),J=v(this,mo,"f"),ee=v(this,Ai,"f"),re=v(this,Li,"f"),q=this.hasSomeLineCollapsed,F=v(this,Wi,"f"),V=v(this,zi,"f"),j=v(this,Ct,"f"),z=v(this,it,"f"),B=v(this,ot,"f"),he=v(this,qe,"f"),ie=v(this,st,"f"),Z=this._version_,ve=v(this,Rt,"f");return{hasInitRaw:d,hasInitSyntax:c,hasBuildSplit:p,hasBuildUnified:m,oldFileLines:g,oldFileDiffLines:x,oldFilePlainLines:b,oldFileSyntaxLines:_,oldFilePlaceholderLines:L,newFileLines:y,newFileDiffLines:N,newFilePlainLines:S,newFileSyntaxLines:E,newFilePlaceholderLines:h,splitLineLength:w,unifiedLineLength:A,fileLineLength:T,additionLength:M,deletionLength:U,splitLeftLines:j,splitRightLines:z,splitHunkLines:B,unifiedLines:he,unifiedHunkLines:ie,highlighterName:ee,highlighterType:re,composeByDiff:P,composeByRange:J,hasSomeLineCollapsed:q,hasExpandSplitAll:F,hasExpandUnifiedAll:V,version:Z,theme:ve,isFullMerge:!1}},this.mergeBundle=(d,c=!0)=>{G(this,wr,d.hasInitRaw,"f"),G(this,br,d.hasInitSyntax,"f"),G(this,xr,d.hasBuildSplit,"f"),G(this,yr,d.hasBuildUnified,"f"),G(this,Gi,d.composeByDiff,"f"),G(this,mo,d.composeByRange,"f"),G(this,Ai,d.highlighterName,"f"),G(this,Li,d.highlighterType,"f"),G(this,Qi,d.oldFileLines,"f"),G(this,Qn,d.oldFileDiffLines,"f"),G(this,Yi,d.oldFilePlainLines,"f"),G(this,Yn,d.oldFileSyntaxLines,"f"),G(this,$n,d.oldFilePlaceholderLines,"f"),G(this,Vi,d.newFileLines,"f"),G(this,Vn,d.newFileDiffLines,"f"),G(this,Ji,d.newFilePlainLines,"f"),G(this,Jn,d.newFileSyntaxLines,"f"),G(this,Cn,d.newFilePlaceholderLines,"f"),this.splitLineLength=d.splitLineLength,this.unifiedLineLength=d.unifiedLineLength,this.fileLineLength=d.fileLineLength,this.additionLength=d.additionLength,this.deletionLength=d.deletionLength,this.hasSomeLineCollapsed=d.hasSomeLineCollapsed,G(this,Wi,d.hasExpandSplitAll,"f"),G(this,zi,d.hasExpandUnifiedAll,"f"),G(this,Ct,d.splitLeftLines,"f"),G(this,it,d.splitRightLines,"f"),G(this,ot,d.splitHunkLines,"f"),G(this,qe,d.unifiedLines,"f"),G(this,st,d.unifiedHunkLines,"f"),G(this,Rt,d.theme,"f"),G(this,_o,!0,"f"),G(this,ns,!0,"f"),c&&this.notifyAll()},this.generateInstanceFromLineNumberRange=(d,c,p=R.new)=>{if(d>=c)return this;let m=this.getSplitLineIndexByLineNumber(d,p),g=this.getSplitLineIndexByLineNumber(c,p),x=this.getUnifiedLineIndexByLineNumber(d,p),b=this.getUnifiedLineIndexByLineNumber(c,p),_=[],L=[],y=[];for(let S=m;S<=g;S++){let E=this.getSplitLeftLine(S),h=this.getSplitRightLine(S);!E?.value&&!h?.value||(_.push({...E,isHidden:!1}),L.push({...h,isHidden:!1}))}for(let S=x;S<=b;S++){let E=this.getUnifiedLine(S);E?.value&&y.push({...E,isHidden:!1})}return t.createInstance({},{...this._getFullBundle(),composeByRange:!0,splitHunkLines:{},splitLeftLines:_,splitRightLines:L,splitLineLength:_.length,unifiedHunkLines:{},unifiedLines:y,unifiedLineLength:y.length})},this._getHighlighterName=()=>v(this,Ai,"f")||"",this._getHighlighterType=()=>v(this,Li,"f")||"",this._getIsPureDiffRender=()=>v(this,Gi,"f"),this._getTheme=()=>v(this,Rt,"f"),this._getIsCloned=()=>v(this,ns,"f"),this._addClonedInstance=d=>{let c=()=>{this._notifyOthers(d),this._mergeFullBundle(d._getFullBundle(),!1)};c.isSyncExternal=!0;let p=d.subscribe(c);v(this,hi,"f").set(d,p)},this._notifyOthers=d=>{v(this,hi,"f").forEach((c,p)=>{p!==d&&p.notifyAll(!0)})},this._delClonedInstance=d=>{let c=v(this,hi,"f").get(d);c?.(),v(this,hi,"f").delete(d)},this._getFullBundle=()=>{let d=this.getBundle(),c=v(this,Ke,"f"),p=v(this,Xe,"f"),m=v(this,Si,"f"),g=v(this,ki,"f");return{...d,oldFileResult:c,newFileResult:p,diffLines:m,diffListResults:g,isFullMerge:v(this,_o,"f")?v(this,wo,"f"):!0}},this._mergeFullBundle=(d,c=!0)=>{this.mergeBundle(d,c);try{G(this,Ke,d.oldFileResult?Lo.createInstance(d.oldFileResult):null,"f"),G(this,Xe,d.newFileResult?Lo.createInstance(d.newFileResult):null,"f"),G(this,Si,d.diffLines,"f"),G(this,ki,d.diffListResults,"f"),G(this,wo,d.isFullMerge,"f")}catch{}},this._getAllListener=()=>v(this,pi,"f"),this._destroy=()=>{this.clearId(),v(this,pi,"f").splice(0,v(this,pi,"f").length),v(this,hi,"f").forEach(d=>d()),v(this,hi,"f").clear()},this.clear=()=>{this._destroy(),G(this,Ke,void 0,"f"),G(this,Xe,void 0,"f"),G(this,Si,void 0,"f"),G(this,ki,void 0,"f"),G(this,Vn,void 0,"f"),G(this,Qn,void 0,"f"),G(this,Vi,void 0,"f"),G(this,Qi,void 0,"f"),G(this,Jn,void 0,"f"),G(this,Yn,void 0,"f"),G(this,ot,void 0,"f"),G(this,Ct,[],"f"),G(this,it,[],"f"),G(this,st,void 0,"f"),G(this,qe,[],"f"),G(this,Rt,"light","f")},Object.defineProperty(this,"__v_skip",{value:!0});let u=Array.from(new Set(o));this._oldFileName=e,this._newFileName=i,this._diffList=u,this._oldFileLang=Ad(a||e||l||i)||"txt",this._newFileLang=Ad(l||i||a||e)||"txt",this._oldFileContent=n,this._newFileContent=r,this.initId()}initId(){let e="-diff--"+Math.random().toString().slice(2);for(;la.has(e);)e="-diff--"+Math.random().toString().slice(2);la.add(e),G(this,go,e,"f")}getId(){return v(this,go,"f")}clearId(){la.delete(v(this,go,"f"))}initTheme(e){G(this,Rt,e||v(this,Rt,"f")||"light","f")}initRaw(){var e;v(this,wr,"f")||(v(this,$e,"m",qd).call(this),v(this,$e,"m",va).call(this),v(this,$e,"m",Jd).call(this),v(this,$e,"m",_a).call(this),v(this,$e,"m",Kd).call(this),v(this,$e,"m",wa).call(this),G(this,wr,!0,"f"))}initSyntax({registerHighlighter:e}={}){var n,i;if(v(this,br,"f")&&(!e||e.name===v(this,Ai,"f")&&e.type===v(this,Li,"f"))){G(this,Jn,(n=v(this,Xe,"f"))===null||n===void 0?void 0:n.syntaxFile,"f"),G(this,Yn,(i=v(this,Ke,"f"))===null||i===void 0?void 0:i.syntaxFile,"f");return}v(this,$e,"m",Xd).call(this,{registerHighlighter:e}),v(this,$e,"m",_a).call(this),G(this,br,!0,"f")}init(){this.initRaw(),this.initSyntax()}buildSplitDiffLines(){var e,n,i,r,o,a;if(v(this,xr,"f"))return;let l=1,f=1,u=!0,d=1/0,c=((e=v(this,Ke,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Xe,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=c||f<=p;){let m=v(this,$e,"m",Lr).call(this,l),g=v(this,$e,"m",kr).call(this,f),x=v(this,$e,"m",bo).call(this,l),b=v(this,$e,"m",xo).call(this,f),_=Ot.prototype.isIncludeableLine.call(m||{}),L=Ot.prototype.isIncludeableLine.call(g||{}),y=v(this,it,"f").length,N=!m&&!g;if(m&&!g){if(m.newLineNumber&&m.newLineNumber>f){f++;continue}(m.newLineNumber===null||m.newLineNumber===void 0)&&f++}if(g&&!m){if(g.oldLineNumber&&g.oldLineNumber>l){l++;continue}(g.oldLineNumber===null||g.oldLineNumber===void 0)&&l++}if(!m&&!x&&!g&&!b)break;if(!m&&!g){if(!((i=v(this,$n,"f"))===null||i===void 0)&&i[l]&&(!((r=v(this,Cn,"f"))===null||r===void 0)&&r[f])){l++,f++;continue}if(!x&&(!((o=v(this,Cn,"f"))===null||o===void 0)&&o[f])){f++;continue}if(!b&&(!((a=v(this,$n,"f"))===null||a===void 0)&&a[l])){l++;continue}}if(_&&L||!_&&!L?(v(this,Ct,"f").push({lineNumber:l++,value:x,diff:m,isHidden:N,_isHidden:N}),v(this,it,"f").push({lineNumber:f++,value:b,diff:g,isHidden:N,_isHidden:N})):_?(v(this,Ct,"f").push({lineNumber:l++,value:x,diff:m,isHidden:N,_isHidden:N}),v(this,it,"f").push({})):L&&(v(this,Ct,"f").push({}),v(this,it,"f").push({lineNumber:f++,value:b,diff:g,isHidden:N,_isHidden:N})),!u&&N&&(d=y),N&&(this.hasSomeLineCollapsed=!0),u=N,m?.prevHunkLine||g?.prevHunkLine){let S=m?.prevHunkLine||g?.prevHunkLine;S&&(S.isFirst?(S.splitInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},d=1/0):Number.isFinite(d)&&(S.splitInfo={...S.hunkInfo,startHiddenIndex:d,endHiddenIndex:y,plainText:S.text,_startHiddenIndex:d,_endHiddenIndex:y,_plainText:S.text},d=1/0),G(this,ot,{...v(this,ot,"f"),[y]:S},"f"))}}if(Number.isFinite(d)){let g=new Ot("",He.Hunk,null,null,null);g.isLast=!0,g.splitInfo={startHiddenIndex:d,endHiddenIndex:v(this,it,"f").length,_startHiddenIndex:d,_endHiddenIndex:v(this,it,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},G(this,ot,{...v(this,ot,"f"),[v(this,it,"f").length]:g},"f"),d=1/0}this.splitLineLength=v(this,it,"f").length,G(this,xr,!0,"f"),this.notifyAll()}buildUnifiedDiffLines(){var e,n,i,r,o,a;if(v(this,yr,"f"))return;let l=1,f=1,u=!0,d=1/0,c=((e=v(this,Ke,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Xe,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=c||f<=p;){let m=v(this,$e,"m",bo).call(this,l),g=v(this,$e,"m",Lr).call(this,l),x=v(this,$e,"m",xo).call(this,f),b=v(this,$e,"m",kr).call(this,f),_=Ot.prototype.isIncludeableLine.call(g||{}),L=Ot.prototype.isIncludeableLine.call(b||{}),y=v(this,qe,"f").length,N=!g&&!b;if(g&&!b){if(g.newLineNumber&&g.newLineNumber>f){f++;continue}(g.newLineNumber===null||g.newLineNumber===void 0)&&f++}if(b&&!g){if(b.oldLineNumber&&b.oldLineNumber>l){l++;continue}(b.oldLineNumber===null||b.oldLineNumber===void 0)&&l++}if(!m&&!x&&!b&&!g)break;if(!g&&!b){if(!((i=v(this,$n,"f"))===null||i===void 0)&&i[l]&&(!((r=v(this,Cn,"f"))===null||r===void 0)&&r[f])){l++,f++;continue}if(!m&&(!((o=v(this,Cn,"f"))===null||o===void 0)&&o[f])){f++;continue}if(!x&&(!((a=v(this,$n,"f"))===null||a===void 0)&&a[l])){l++;continue}}if(!_&&!L?v(this,qe,"f").push({oldLineNumber:l++,newLineNumber:f++,value:x,diff:b,isHidden:N,_isHidden:N}):_?v(this,qe,"f").push({oldLineNumber:l++,value:m,diff:g,isHidden:N,_isHidden:N}):L&&v(this,qe,"f").push({newLineNumber:f++,value:x,diff:b,isHidden:N,_isHidden:N}),!u&&N&&(d=y),N&&(this.hasSomeLineCollapsed=!0),u=N,g?.prevHunkLine||b?.prevHunkLine){let S=g?.prevHunkLine||b?.prevHunkLine;S&&(S.isFirst?(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},d=1/0):Number.isFinite(d)&&(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:d,endHiddenIndex:y,plainText:S.text,_startHiddenIndex:d,_endHiddenIndex:y,_plainText:S.text},d=1/0),G(this,st,{...v(this,st,"f"),[y]:S},"f"))}}if(Number.isFinite(d)){let g=new Ot("",He.Hunk,null,null,null);g.isLast=!0,g.unifiedInfo={startHiddenIndex:d,endHiddenIndex:v(this,qe,"f").length,_startHiddenIndex:d,_endHiddenIndex:v(this,qe,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},G(this,st,{...v(this,st,"f"),[v(this,qe,"f").length]:g},"f"),d=1/0}this.unifiedLineLength=v(this,qe,"f").length,G(this,yr,!0,"f"),this.notifyAll()}get hasExpandSplitAll(){return v(this,Wi,"f").state}get hasExpandUnifiedAll(){return v(this,zi,"f").state}};Ke=new WeakMap,Xe=new WeakMap,ki=new WeakMap,Si=new WeakMap,Qn=new WeakMap,Vn=new WeakMap,Qi=new WeakMap,Vi=new WeakMap,Yi=new WeakMap,Ji=new WeakMap,Yn=new WeakMap,Jn=new WeakMap,$n=new WeakMap,Cn=new WeakMap,Ct=new WeakMap,it=new WeakMap,ot=new WeakMap,qe=new WeakMap,st=new WeakMap,pi=new WeakMap,wr=new WeakMap,br=new WeakMap,xr=new WeakMap,yr=new WeakMap,ho=new WeakMap,Gi=new WeakMap,mo=new WeakMap,_o=new WeakMap,wo=new WeakMap,Ai=new WeakMap,Li=new WeakMap,ns=new WeakMap,Rt=new WeakMap,Wi=new WeakMap,zi=new WeakMap,go=new WeakMap,hi=new WeakMap,$e=new WeakSet,Jd=function(){this._diffList&&G(this,ki,this._diffList.map(e=>Np.parse(e)),"f")},qd=function(){!this._oldFileContent&&!this._newFileContent||(this._oldFileContent&&G(this,Ke,vr(this._oldFileContent,this._oldFileLang,v(this,Rt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),this._newFileContent&&G(this,Xe,vr(this._newFileContent,this._newFileLang,v(this,Rt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"))},va=function(){var e,n,i,r,o,a,l,f;(e=v(this,Ke,"f"))===null||e===void 0||e.doRaw(),G(this,Qi,(n=v(this,Ke,"f"))===null||n===void 0?void 0:n.rawFile,"f"),G(this,Yi,(i=v(this,Ke,"f"))===null||i===void 0?void 0:i.plainFile,"f"),(r=v(this,Xe,"f"))===null||r===void 0||r.doRaw(),G(this,Vi,(o=v(this,Xe,"f"))===null||o===void 0?void 0:o.rawFile,"f"),G(this,Ji,(a=v(this,Xe,"f"))===null||a===void 0?void 0:a.plainFile,"f"),this.fileLineLength=Math.max(this.fileLineLength,((l=v(this,Ke,"f"))===null||l===void 0?void 0:l.maxLineNumber)||0,((f=v(this,Xe,"f"))===null||f===void 0?void 0:f.maxLineNumber)||0)},Kd=function(){if(this._oldFileContent&&this._newFileContent)return;let e={},n={};if(!this._oldFileContent&&!this._newFileContent){let i=1,r=1,o="",a="",l=!1;for(;r<=this.diffLineLength||i<=this.diffLineLength;){let f=r++,u=i++,d=v(this,$e,"m",Lr).call(this,f),c=v(this,$e,"m",kr).call(this,u);d?o+=d.text:(o+=`
`,e[f]=!0),c?a+=c.text:(a+=`
`,n[u]=!0),!l&&d&&c&&(l=l||d.noTrailingNewLine!==c.noTrailingNewLine)}if(!l&&o===a)return;this._oldFileContent=o,this._newFileContent=a,G(this,Ke,vr(this._oldFileContent,this._oldFileLang,v(this,Rt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),G(this,Xe,vr(this._newFileContent,this._newFileLang,v(this,Rt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"),G(this,$n,e,"f"),G(this,Cn,n,"f"),G(this,Gi,!0,"f")}else if(v(this,Ke,"f")){let i=1,r=1,o="",a=!1;for(;r<=v(this,Ke,"f").maxLineNumber;){let l=v(this,$e,"m",kr).call(this,i++),f=v(this,$e,"m",Lr).call(this,r);l?(o+=l.text,r=l.oldLineNumber?l.oldLineNumber+1:r):(f||(o+=v(this,$e,"m",bo).call(this,r)),r++),!a&&l&&f&&(a=a||l.noTrailingNewLine!==f.noTrailingNewLine)}if(!a&&o===this._oldFileContent)return;this._newFileContent=o,G(this,Xe,vr(this._newFileContent,this._newFileLang,v(this,Rt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f")}else if(v(this,Xe,"f")){let i=1,r=1,o="",a=!1;for(;r<=v(this,Xe,"f").maxLineNumber;){let l=v(this,$e,"m",Lr).call(this,i++),f=v(this,$e,"m",kr).call(this,r);l?(o+=l.text,r=l.newLineNumber?l.newLineNumber+1:r):(f||(o+=v(this,$e,"m",xo).call(this,r)),r++),!a&&f&&l&&(a=a||f.noTrailingNewLine!==l.noTrailingNewLine)}if(!a&&o===this._newFileContent)return;this._oldFileContent=o,G(this,Ke,vr(this._oldFileContent,this._oldFileLang,v(this,Rt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f")}v(this,$e,"m",va).call(this)},Dp=function(){var e,n,i,r;for(let o in v(this,Qn,"f")||{}){let a=(e=v(this,Qn,"f"))===null||e===void 0?void 0:e[o],l=(n=v(this,Yi,"f"))===null||n===void 0?void 0:n[o];if((!v(this,$n,"f")||!v(this,$n,"f")[o])&&a?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'oldFileContent' and 'diff' at line ${o}. Please verify the 'oldFileContent' is correct.`);break}}for(let o in v(this,Vn,"f")||{}){let a=(i=v(this,Vn,"f"))===null||i===void 0?void 0:i[o],l=(r=v(this,Ji,"f"))===null||r===void 0?void 0:r[o];if((!v(this,Cn,"f")||!v(this,Cn,"f")[o])&&a?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'newFileContent' and 'diff' at line ${o}. Please verify the 'newFileContent' is correct.`);break}}},_a=function(){var e;if(!(!((e=v(this,ki,"f"))===null||e===void 0)&&e.length))return;let n=d=>v(this,$e,"m",xo).call(this,d),i=d=>v(this,$e,"m",bo).call(this,d),r=d=>v(this,$e,"m",Id).call(this,d),o=d=>v(this,$e,"m",Sd).call(this,d);G(this,Si,[],"f"),this.additionLength=0,this.deletionLength=0;let a=[];v(this,ki,"f").forEach(d=>{d.hunks.forEach(p=>{let m=[],g=[];p.lines.forEach(x=>{x.type===He.Add?(m.push(x),this.additionLength++):x.type===He.Delete?(g.push(x),this.deletionLength++):(Ld(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o}),m=[],g=[]),a.push(x)}),Ld(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o})})});let l=null;G(this,Si,a.map((d,c)=>{var p;let m=d;if(m.index=c,m.isFirst=c===0,m.type===He.Hunk){let g=(p=m.text.split("@@"))===null||p===void 0?void 0:p[1].split(" ").filter(Boolean),x=g?.[0]||"",b=g?.[1]||"",[_,L]=x.split(","),[y,N]=b.split(",");m.hunkInfo={oldStartIndex:-Number(_),oldLength:Number(L),newStartIndex:+Number(y),newLength:Number(N),_oldStartIndex:-Number(_),_oldLength:Number(L),_newStartIndex:+Number(y),_newLength:Number(N)},l=m}else if(m.type===He.Context){let g=d;l&&(g.prevHunkLine=l,l=null)}else l=null;return m}),"f"),G(this,Qn,{},"f"),G(this,Vn,{},"f");let f=-1,u=-1;v(this,Si,"f").forEach(d=>{d.oldLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,d.oldLineNumber),v(this,Qn,"f")[d.oldLineNumber]=d),d.newLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,d.newLineNumber),v(this,Vn,"f")[d.newLineNumber]=d)})},wa=function(){var e,n,i,r,o,a;G(this,Ai,((e=v(this,Ke,"f"))===null||e===void 0?void 0:e.highlighterName)||((n=v(this,Xe,"f"))===null||n===void 0?void 0:n.highlighterName)||v(this,Ai,"f"),"f"),G(this,Li,((i=v(this,Ke,"f"))===null||i===void 0?void 0:i.highlighterType)||((r=v(this,Xe,"f"))===null||r===void 0?void 0:r.highlighterType)||v(this,Li,"f"),"f"),!((o=v(this,Ke,"f"))===null||o===void 0)&&o.highlighterName&&G(this,Yn,v(this,Ke,"f").syntaxFile,"f"),!((a=v(this,Xe,"f"))===null||a===void 0)&&a.highlighterName&&G(this,Jn,v(this,Xe,"f").syntaxFile,"f")},kd=function({registerHighlighter:e}){var n,i,r,o;(n=v(this,Ke,"f"))===null||n===void 0||n.doSyntax({registerHighlighter:e,theme:v(this,Rt,"f")}),G(this,Yn,(i=v(this,Ke,"f"))===null||i===void 0?void 0:i.syntaxFile,"f"),(r=v(this,Xe,"f"))===null||r===void 0||r.doSyntax({registerHighlighter:e,theme:v(this,Rt,"f")}),G(this,Jn,(o=v(this,Xe,"f"))===null||o===void 0?void 0:o.syntaxFile,"f")},Xd=function({registerHighlighter:e}={}){v(this,_o,"f")&&!v(this,wo,"f")||(v(this,$e,"m",kd).call(this,{registerHighlighter:e}),v(this,$e,"m",wa).call(this))},Lr=function(e){var n;if(e)return(n=v(this,Qn,"f"))===null||n===void 0?void 0:n[e]},kr=function(e){var n;if(e)return(n=v(this,Vn,"f"))===null||n===void 0?void 0:n[e]},bo=function(e){var n;return(n=v(this,Qi,"f"))===null||n===void 0?void 0:n[e]},xo=function(e){var n;return(n=v(this,Vi,"f"))===null||n===void 0?void 0:n[e]},Sd=function(e){var n;return(n=v(this,Yn,"f"))===null||n===void 0?void 0:n[e]},Id=function(e){var n;return(n=v(this,Jn,"f"))===null||n===void 0?void 0:n[e]};var Zd="diff-multi-select-active";function Nd(t){if(!t)return null;let e=t.querySelector("span[data-line-num]");if(!e)return null;let n=e.getAttribute("data-line-num"),i=parseInt(n??"",10);return n!==i.toString()||isNaN(i)?null:i}function Tp(t){if(!t)return null;let e=t.closest("[data-side]");return e?e.getAttribute("data-side"):null}function $d(t){if(!t)return null;let e=t.closest(".diff-line-num");if(!e)return null;let n=e.querySelector("span[data-line-old-num]"),i=e.querySelector("span[data-line-new-num]"),r=n?.getAttribute("data-line-old-num"),o=i?.getAttribute("data-line-new-num"),a=r?parseInt(r,10):void 0,l=o?parseInt(o,10):void 0;return a===void 0&&l===void 0?null:{old:a,new:l}}function Cd(t,e=!1){var n,i,r,o;if(!t)return null;let a=null;if(!e||t.closest(".diff-add-widget-wrapper")){let l=t.closest(".diff-line-new-content"),f=t.closest(".diff-line-old-content");l&&(a=(i=(n=l.parentElement)===null||n===void 0?void 0:n.querySelector(".diff-line-new-num"))!==null&&i!==void 0?i:null),f&&(a=(o=(r=f.parentElement)===null||r===void 0?void 0:r.querySelector(".diff-line-old-num"))!==null&&o!==void 0?o:null)}return a||(a=t.closest(".diff-line-new-num")||t.closest(".diff-line-old-num")),a}function ls(t){let e=Math.min(t.startLineNumber,t.endLineNumber),n=Math.max(t.startLineNumber,t.endLineNumber);return{...t,startLineNumber:e,endLineNumber:n}}var ef=t=>{let e=[];return t.new&&t.new.length&&e.push({side:"new",startLineNumber:Math.min(...t.new),endLineNumber:Math.max(...t.new)}),t.old&&t.old.length&&e.push({side:"old",startLineNumber:Math.min(...t.old),endLineNumber:Math.max(...t.old)}),e},Fp=(t,e,n,i)=>{Bp(e,n).forEach(o=>{var a,l;if(!o.isHide&&o.index){let f=t.filter(u=>u.getAttribute("data-line")===o.index.toString());if(f.length===2)if(o.isContext)f.forEach(u=>u.querySelectorAll("td").forEach(d=>d.classList.add(i)));else{let u=f.find(d=>d.getAttribute("data-side")===n.side);u?.querySelectorAll("td").forEach(d=>d.classList.add(i))}else o.isContext?(a=f[0])===null||a===void 0||a.querySelectorAll("td").forEach(u=>u.classList.add(i)):(l=f[0])===null||l===void 0||l.querySelectorAll(`td[data-side="${n.side}"]`).forEach(u=>u.classList.add(i))}})};function Mp(t,e,n,i={old:[],new:[]},r=Zd){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(c=>{var p;return((p=c.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),f=ef(i),d=(e?f.concat(e):f).map(ls);l.forEach(c=>{c.querySelectorAll("td").forEach(m=>m.classList.remove(r))}),d.forEach(c=>{c&&n&&Fp(l,n,c,r)})}function Hp(t,e,n,i={old:[],new:[]},r=Zd){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(c=>{var p;return((p=c.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),f=ef(i),d=(e?f.concat(e):f).map(ls);l.forEach(c=>{let p=c.querySelector(".diff-line-num"),m=c.querySelector(".diff-line-content");if(!p||!m)return;p.classList.remove(r),m.classList.remove(r);let g=p.querySelector("span[data-line-old-num]"),x=p.querySelector("span[data-line-new-num]"),b=g?.getAttribute("data-line-old-num"),_=x?.getAttribute("data-line-new-num"),L=b?parseInt(b,10):void 0,y=_?parseInt(_,10):void 0;d.some(N=>N.side==="old"&&L&&L>=N.startLineNumber&&L<=N.endLineNumber||N.side==="new"&&y&&y>=N.startLineNumber&&y<=N.endLineNumber)&&(p.classList.add(r),m.classList.add(r))})}function Bp(t,e){var n;let i=ls(e),r=[],{side:o,startLineNumber:a,endLineNumber:l}=i,f=o==="old"?R.old:R.new;for(let u=a;u<=l;u++){let d=t.getSplitLineByLineNumber(u,f),c=t.getSplitLineIndexByLineNumber(u,f);if(d&&d.lineNumber!==void 0){let p=(n=d.diff)===null||n===void 0?void 0:n.type;r.push({index:c+1,lineNumber:d.lineNumber,value:d.value,isHide:Cp(t,u,f).split,isDelete:p===He.Delete,isAdd:p===He.Add,isContext:p===He.Context||p===void 0})}}return r}var Sn,_r,es,pt,Fe,da,fa,Rp,Dd,Td,Op,Fd,Md,Hd,Bd,Rd,uo,Od;_r=new WeakMap,es=new WeakMap,pt=new WeakMap,Fe=new WeakMap,da=new WeakMap,fa=new WeakMap,Rp=new WeakMap,Dd=new WeakMap,Td=new WeakMap,Sn=new WeakSet,Op=function(){var e;if(!v(this,_r,"f")||v(this,fa,"f"))return;let n=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Md).call(this,o):v(this,Sn,"m",Fd).call(this,o)},i=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Bd).call(this,o):v(this,Sn,"m",Hd).call(this,o)},r=()=>{v(this,Sn,"m",Rd).call(this)};G(this,fa,{mousedown:n,mouseover:i,mouseup:r},"f"),v(this,_r,"f").addEventListener("mousedown",n),v(this,_r,"f").addEventListener("mouseover",i),document.addEventListener("mouseup",r),G(this,Dd,((e=v(this,es,"f"))===null||e===void 0?void 0:e.subscribe(()=>v(this,Td,"f").call(this)))||(()=>{}),"f")},Fd=function(e){let n=Cd(e.target,!0);if(!n)return;let i=Nd(n);if(i===null)return;let r=Tp(n);if(!r)return;v(this,Fe,"f").isSelecting=!0,v(this,Fe,"f").startInfo={lineNumber:i,side:r};let o={side:r,startLineNumber:i,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let a=v(this,pt,"f").scopeToHunk(o);a&&(o=a)}v(this,Fe,"f").currentRange=o,v(this,Sn,"m",uo).call(this),v(this,pt,"f").onSelectionChange(o,{...v(this,Fe,"f")})},Md=function(e){var n;let i=$d(e.target);if(!i)return;let r=(n=i.new)!==null&&n!==void 0?n:i.old;if(r===void 0)return;let o=i.new!==void 0?"new":"old";v(this,Fe,"f").isSelecting=!0,v(this,Fe,"f").startInfo={lineNumber:r,side:o};let a={side:o,startLineNumber:r,endLineNumber:r};if(v(this,pt,"f").scopeToHunk){let l=v(this,pt,"f").scopeToHunk(a);l&&(a=l)}v(this,Fe,"f").currentRange=a,v(this,Sn,"m",uo).call(this),v(this,pt,"f").onSelectionChange(a,{...v(this,Fe,"f")})},Hd=function(e){if(!v(this,Fe,"f").isSelecting||!v(this,Fe,"f").startInfo)return;let n=Cd(e.target);if(!n)return;let i=Nd(n);if(i===null)return;let r={side:v(this,Fe,"f").startInfo.side,startLineNumber:v(this,Fe,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Fe,"f").currentRange=r,v(this,Sn,"m",uo).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Fe,"f")})},Bd=function(e){if(!v(this,Fe,"f").isSelecting||!v(this,Fe,"f").startInfo)return;let n=$d(e.target);if(!n)return;let i=n[v(this,Fe,"f").startInfo.side];if(i===void 0)return;let r={side:v(this,Fe,"f").startInfo.side,startLineNumber:v(this,Fe,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Fe,"f").currentRange=r,v(this,Sn,"m",uo).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Fe,"f")})},Rd=function(){if(!v(this,Fe,"f").isSelecting||!v(this,Fe,"f").currentRange){v(this,Sn,"m",Od).call(this);return}let e=ls(v(this,Fe,"f").currentRange);v(this,Fe,"f").currentRange=e,v(this,Fe,"f").isSelecting=!1;let n=this.getSelectionResult();v(this,pt,"f").onSelectionComplete(n)},uo=function(){v(this,pt,"f").isUnifiedMode?Hp(v(this,_r,"f"),v(this,Fe,"f").currentRange,v(this,es,"f"),v(this,da,"f"),v(this,pt,"f").selectedClassName):Mp(v(this,_r,"f"),v(this,Fe,"f").currentRange,v(this,es,"f"),v(this,da,"f"),v(this,pt,"f").selectedClassName)},Od=function(){G(this,Fe,{isSelecting:!1,startInfo:null,currentRange:null},"f")};var ko=class{diff(e,n,i={}){let r;typeof i=="function"?(r=i,i={}):"callback"in i&&(r=i.callback);let o=this.castInput(e,i),a=this.castInput(n,i),l=this.removeEmpty(this.tokenize(o,i)),f=this.removeEmpty(this.tokenize(a,i));return this.diffWithOptionsObj(l,f,i,r)}diffWithOptionsObj(e,n,i,r){var o;let a=L=>{if(L=this.postProcess(L,i),r){setTimeout(function(){r(L)},0);return}else return L},l=n.length,f=e.length,u=1,d=l+f;i.maxEditLength!=null&&(d=Math.min(d,i.maxEditLength));let c=(o=i.timeout)!==null&&o!==void 0?o:1/0,p=Date.now()+c,m=[{oldPos:-1,lastComponent:void 0}],g=this.extractCommon(m[0],n,e,0,i);if(m[0].oldPos+1>=f&&g+1>=l)return a(this.buildValues(m[0].lastComponent,n,e));let x=-1/0,b=1/0,_=()=>{for(let L=Math.max(x,-u);L<=Math.min(b,u);L+=2){let y,N=m[L-1],S=m[L+1];N&&(m[L-1]=void 0);let E=!1;if(S){let w=S.oldPos-L;E=S&&0<=w&&w<l}let h=N&&N.oldPos+1<f;if(!E&&!h){m[L]=void 0;continue}if(!h||E&&N.oldPos<S.oldPos?y=this.addToPath(S,!0,!1,0,i):y=this.addToPath(N,!1,!0,1,i),g=this.extractCommon(y,n,e,L,i),y.oldPos+1>=f&&g+1>=l)return a(this.buildValues(y.lastComponent,n,e))||!0;m[L]=y,y.oldPos+1>=f&&(b=Math.min(b,L-1)),g+1>=l&&(x=Math.max(x,L+1))}u++};if(r)(function L(){setTimeout(function(){if(u>d||Date.now()>p)return r(void 0);_()||L()},0)})();else for(;u<=d&&Date.now()<=p;){let L=_();if(L)return L}}addToPath(e,n,i,r,o){let a=e.lastComponent;return a&&!o.oneChangePerToken&&a.added===n&&a.removed===i?{oldPos:e.oldPos+r,lastComponent:{count:a.count+1,added:n,removed:i,previousComponent:a.previousComponent}}:{oldPos:e.oldPos+r,lastComponent:{count:1,added:n,removed:i,previousComponent:a}}}extractCommon(e,n,i,r,o){let a=n.length,l=i.length,f=e.oldPos,u=f-r,d=0;for(;u+1<a&&f+1<l&&this.equals(i[f+1],n[u+1],o);)u++,f++,d++,o.oneChangePerToken&&(e.lastComponent={count:1,previousComponent:e.lastComponent,added:!1,removed:!1});return d&&!o.oneChangePerToken&&(e.lastComponent={count:d,previousComponent:e.lastComponent,added:!1,removed:!1}),e.oldPos=f,u}equals(e,n,i){return i.comparator?i.comparator(e,n):e===n||!!i.ignoreCase&&e.toLowerCase()===n.toLowerCase()}removeEmpty(e){let n=[];for(let i=0;i<e.length;i++)e[i]&&n.push(e[i]);return n}castInput(e,n){return e}tokenize(e,n){return Array.from(e)}join(e){return e.join("")}postProcess(e,n){return e}get useLongestToken(){return!1}buildValues(e,n,i){let r=[],o;for(;e;)r.push(e),o=e.previousComponent,delete e.previousComponent,e=o;r.reverse();let a=r.length,l=0,f=0,u=0;for(;l<a;l++){let d=r[l];if(d.removed)d.value=this.join(i.slice(u,u+d.count)),u+=d.count;else{if(!d.added&&this.useLongestToken){let c=n.slice(f,f+d.count);c=c.map(function(p,m){let g=i[u+m];return g.length>p.length?g:p}),d.value=this.join(c)}else d.value=this.join(n.slice(f,f+d.count));f+=d.count,d.added||(u+=d.count)}}return r}};var Aa=class extends ko{constructor(){super(...arguments),this.tokenize=jp}equals(e,n,i){return i.ignoreWhitespace?((!i.newlineIsToken||!e.includes(`
`))&&(e=e.trim()),(!i.newlineIsToken||!n.includes(`
`))&&(n=n.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith(`
`)&&(e=e.slice(0,-1)),n.endsWith(`
`)&&(n=n.slice(0,-1))),super.equals(e,n,i)}},Pp=new Aa;function La(t,e,n){return Pp.diff(t,e,n)}function jp(t,e){e.stripTrailingCr&&(t=t.replace(/\r\n/g,`
`));let n=[],i=t.split(/(\n|\r\n)/);i[i.length-1]||i.pop();for(let r=0;r<i.length;r++){let o=i[r];r%2&&!e.newlineIsToken?n[n.length-1]+=o:n.push(o)}return n}var tf={includeIndex:!0,includeUnderline:!0,includeFileHeaders:!0};function ka(t,e,n,i,r,o,a){let l;a?typeof a=="function"?l={callback:a}:l=a:l={},typeof l.context>"u"&&(l.context=4);let f=l.context;if(l.newlineIsToken)throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(l.callback){let{callback:d}=l;La(n,i,Object.assign(Object.assign({},l),{callback:c=>{let p=u(c);d(p)}}))}else return u(La(n,i,l));function u(d){if(!d)return;d.push({value:"",lines:[]});function c(L){return L.map(function(y){return" "+y})}let p=[],m=0,g=0,x=[],b=1,_=1;for(let L=0;L<d.length;L++){let y=d[L],N=y.lines||Up(y.value);if(y.lines=N,y.added||y.removed){if(!m){let S=d[L-1];m=b,g=_,S&&(x=f>0?c(S.lines.slice(-f)):[],m-=x.length,g-=x.length)}for(let S of N)x.push((y.added?"+":"-")+S);y.added?_+=N.length:b+=N.length}else{if(m)if(N.length<=f*2&&L<d.length-2)for(let S of c(N))x.push(S);else{let S=Math.min(N.length,f);for(let h of c(N.slice(0,S)))x.push(h);let E={oldStart:m,oldLines:b-m+S,newStart:g,newLines:_-g+S,lines:x};p.push(E),m=0,g=0,x=[]}b+=N.length,_+=N.length}}for(let L of p)for(let y=0;y<L.lines.length;y++)L.lines[y].endsWith(`
`)?L.lines[y]=L.lines[y].slice(0,-1):(L.lines.splice(y+1,0,"\\ No newline at end of file"),y++);return{oldFileName:t,newFileName:e,oldHeader:r,newHeader:o,hunks:p}}}function ds(t,e){if(e||(e=tf),Array.isArray(t)){if(t.length>1&&!e.includeFileHeaders)throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");return t.map(i=>ds(i,e)).join(`
`)}let n=[];e.includeIndex&&t.oldFileName==t.newFileName&&n.push("Index: "+t.oldFileName),e.includeUnderline&&n.push("==================================================================="),e.includeFileHeaders&&(n.push("--- "+t.oldFileName+(typeof t.oldHeader>"u"?"":"	"+t.oldHeader)),n.push("+++ "+t.newFileName+(typeof t.newHeader>"u"?"":"	"+t.newHeader)));for(let i=0;i<t.hunks.length;i++){let r=t.hunks[i];r.oldLines===0&&(r.oldStart-=1),r.newLines===0&&(r.newStart-=1),n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@");for(let o of r.lines)n.push(o)}return n.join(`
`)+`
`}function Sa(t,e,n,i,r,o,a){if(typeof a=="function"&&(a={callback:a}),a?.callback){let{callback:l}=a;ka(t,e,n,i,r,o,Object.assign(Object.assign({},a),{callback:f=>{l(f?ds(f,a.headerOptions):void 0)}}))}else{let l=ka(t,e,n,i,r,o,a);return l?ds(l,a?.headerOptions):void 0}}function Up(t){let e=t.endsWith(`
`),n=t.split(`
`).map(i=>i+`
`);return e?n.pop():n.push(n.pop().slice(0,-1)),n}ss.name="@git-diff-view/file";function nf(t,e,n,i,r,o,a,l){let f=Sa(t,n,e,i,"","",a);return new qi(t,e,n,i,[f],r,o,l)}var $r;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})($r||($r={}));var Pt;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(Pt||(Pt={}));typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var qn={};var Ue=Symbol("uninitialized"),tn=Symbol("filename");var fs="http://www.w3.org/1999/xhtml",So="http://www.w3.org/2000/svg",Ia="http://www.w3.org/1998/Math/MathML";var rf=globalThis.process?.env?.NODE_ENV,H=rf&&!rf.toLowerCase().startsWith("prod");var mi=Array.isArray,of=Array.prototype.indexOf,Ii=Array.prototype.includes,Cr=Array.from,Na=Object.keys,jt=Object.defineProperty,cn=Object.getOwnPropertyDescriptor,$a=Object.getOwnPropertyDescriptors,Ca=Object.prototype,sf=Array.prototype,Dr=Object.getPrototypeOf,Da=Object.isExtensible;var ht=()=>{};function cs(t){for(var e=0;e<t.length;e++)t[e]()}function us(){var t,e,n=new Promise((i,r)=>{t=i,e=r});return{promise:n,resolve:t,reject:e}}var Yt=Symbol("$state"),ps=Symbol("legacy props"),af=Symbol(""),hs=Symbol("proxy path"),ms=Symbol("attributes"),Io=Symbol("class"),No=Symbol("style"),$o=Symbol("text");var Ta=Symbol("hmr anchor"),gi=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Fa=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Tr=3,un=8;function lf(t){if(H){let e=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${t}"
https://svelte.dev/e/invariant_violation`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invariant_violation")}function Fr(t){if(H){let e=new Error(`lifecycle_outside_component
\`${t}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function ff(){if(H){let t=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function cf(){if(H){let t=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/derived_references_self")}function Ma(t,e,n){if(H){let i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${t} and ${e}`:`Keyed each block has duplicate key at indexes ${t} and ${e}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function uf(t,e,n){if(H){let i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${t} was \`${e}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_volatile")}function pf(t){if(H){let e=new Error(`effect_in_teardown
\`${t}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function hf(){if(H){let t=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function mf(t){if(H){let e=new Error(`effect_orphan
\`${t}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_orphan")}function gf(){if(H){let t=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function vf(){if(H){let t=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydration_failed")}function _f(){if(H){let t=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invalid_snippet")}function wf(t){if(H){let e=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${t}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function bf(t){if(H){let e=new Error(`rune_outside_svelte
The \`${t}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function xf(){if(H){let t=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/set_context_after_init")}function yf(){if(H){let t=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function Ef(){if(H){let t=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Af(){if(H){let t=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Lf(){if(H){let t=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Kn="font-weight: bold",Xn="font-weight: normal";function kf(t){H?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${t}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Kn,Xn):console.warn("https://svelte.dev/e/await_reactivity_loss")}function Sf(t,e){H?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${t}\` (${e}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,Kn,Xn):console.warn("https://svelte.dev/e/await_waterfall")}function If(){H?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,Kn,Xn):console.warn("https://svelte.dev/e/derived_inert")}function Nf(t,e,n){H?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${t}\` attribute on \`${e}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Kn,Xn):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function $f(t){H?console.warn(`%c[svelte] hydration_html_changed
%c${t?`The value of an \`{@html ...}\` block ${t} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,Kn,Xn):console.warn("https://svelte.dev/e/hydration_html_changed")}function Ni(t){H?console.warn(`%c[svelte] hydration_mismatch
%c${t?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${t}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,Kn,Xn):console.warn("https://svelte.dev/e/hydration_mismatch")}function Cf(){H?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Kn,Xn):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function gs(t){H?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${t}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Kn,Xn):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function Df(){H?console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Kn,Xn):console.warn("https://svelte.dev/e/state_proxy_unmount")}function Tf(){H?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Kn,Xn):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var le=!1;function mt(t){le=t}var _e;function Me(t){if(t===null)throw Ni(),qn;return _e=t}function At(){return Me(Lt(_e))}function $(t){if(le){if(Lt(_e)!==null)throw Ni(),qn;_e=t}}function Xi(t=1){if(le){for(var e=t,n=_e;e--;)n=Lt(n);_e=n}}function Zn(t=!0){for(var e=0,n=_e;;){if(n.nodeType===un){var i=n.data;if(i==="]"){if(e===0)return n;e-=1}else(i==="["||i==="[!"||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(e+=1)}var r=Lt(n);t&&n.remove(),n=r}}function Do(t){if(!t||t.nodeType!==un)throw Ni(),qn;return t.data}function vs(t){return t===this.v}function Ha(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function _s(t){return!Ha(t,this.v)}var gt=!1,vi=!1,Dn=!1;function Ff(){vi=!0}var To=null;function Ut(t,e){return t.label=e,bs(t.v,e),t}function bs(t,e){return t?.[hs]?.(e),t}function Tn(t){let e=new Error,n=Gp();return n.length===0?null:(n.unshift(`
`),jt(e,"stack",{value:n.join(`
`)}),jt(e,"name",{value:t}),e)}function Gp(){let t=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let e=new Error().stack;if(Error.stackTraceLimit=t,!e)return[];let n=e.split(`
`),i=[];for(let r=0;r<n.length;r++){let o=n[r],a=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||i.push(o)}}return i}function Hf(t,e){if(!H)throw new Error("invariant(...) was not guarded by if (DEV)");t||lf(e)}var Ae=null;function _i(t){Ae=t}var Fn=null;function Br(t){Fn=t}var pn=null;function xs(t){pn=t}function Ve(t){return Bf("getContext").get(t)}function Ye(t,e){let n=Bf("setContext");if(gt){var i=ae.f,r=!me&&(i&32)!==0&&!Ae.i;r||xf()}return n.set(t,e),e}function de(t,e=!1,n){Ae={p:Ae,i:!1,c:null,e:null,s:t,x:null,r:ae,l:vi&&!e?{s:null,u:null,$:[]}:null},H&&(Ae.function=n,pn=n)}function fe(t){var e=Ae,n=e.e;if(n!==null){e.e=null;for(var i of n)Ba(i)}return t!==void 0&&(e.x=t),e.i=!0,Ae=e.p,H&&(pn=Ae?.function??null),t??{}}function ei(){return!vi||Ae!==null&&Ae.l===null}function Bf(t){return Ae===null&&Fr(t),Ae.c??=new Map(Qp(Ae)||void 0)}function Qp(t){let e=t.p;for(;e!==null;){let n=e.c;if(n!==null)return n;e=e.p}return null}var Zi=[];function Rf(){var t=Zi;Zi=[],cs(t)}function kt(t){if(Zi.length===0&&!er){var e=Zi;queueMicrotask(()=>{e===Zi&&Rf()})}Zi.push(t)}function Of(){for(;Zi.length>0;)Rf()}var Ra=new WeakMap;function ys(t){var e=ae;if(e===null)return me.f|=8388608,t;if(H&&t instanceof Error&&!Ra.has(t)&&Ra.set(t,Vp(t,e)),(e.f&32768)===0&&(e.f&4)===0)throw H&&!e.parent&&t instanceof Error&&Pf(t),t;Hn(t,e)}function Hn(t,e){if(!(e!==null&&(e.f&16384)!==0)){for(;e!==null;){if((e.f&128)!==0){if((e.f&32768)===0)throw t;try{e.b.error(t);return}catch(n){t=n}}e=e.parent}throw H&&t instanceof Error&&Pf(t),t}}function Vp(t,e){let n=cn(t,"message");if(!(n&&!n.configurable)){for(var i=Mo?"  ":"	",r=`
${i}in ${e.fn?.name||"<unknown>"}`,o=e.ctx;o!==null;)r+=`
${i}in ${o.function?.[tn].split("/").pop()}`,o=o.p;return{message:t.message+`
${r}
`,stack:t.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function Pf(t){let e=Ra.get(t);e&&(jt(t,"message",{value:e.message}),jt(t,"stack",{value:e.stack}))}var Yp=-7169;function Be(t,e){t.f=t.f&Yp|e}function Rr(t){(t.f&512)!==0||t.deps===null?Be(t,1024):Be(t,4096)}function jf(t){if(t!==null)for(let e of t)(e.f&2)===0||(e.f&65536)===0||(e.f^=65536,jf(e.deps))}function Es(t,e,n){(t.f&2048)!==0?e.add(t):(t.f&4096)!==0&&n.add(t),jf(t.deps),Be(t,1024)}var Uf=!1;function ti(t){var e=me,n=ae;bt(null),xt(null);try{return t()}finally{bt(e),xt(n)}}function zf(t){let e=0,n=Qt(0),i;return H&&Ut(n,"createSubscriber version"),()=>{$i()&&(s(n),Jt(()=>(e===0&&(i=Ze(()=>t(()=>rr(n)))),e+=1,()=>{kt(()=>{e-=1,e===0&&(i?.(),i=void 0,rr(n))})})))}}var Kp=589824;function Pa(t,e,n,i){new Oa(t,e,n,i)}var Oa=class{parent;is_pending=!1;transform_error;#e;#t=le?_e:null;#n;#l;#o;#s=null;#i=null;#a=null;#r=null;#h=0;#f=0;#c=!1;#u=new Set;#g=new Set;#d=null;#w=zf(()=>(this.#d=Qt(this.#h),H&&Ut(this.#d,"$effect.pending()"),()=>{this.#d=null}));constructor(e,n,i,r){this.#e=e,this.#n=n,this.#l=o=>{var a=ae;a.b=this,a.f|=128,i(o)},this.parent=ae.b,this.transform_error=r??this.parent?.transform_error??(o=>o),this.#o=sn(()=>{if(le){let o=this.#t;At();let a=o.data==="[!";if(o.data.startsWith("[?")){let f=JSON.parse(o.data.slice("[?".length));this.#b(f)}else a?this.#y():this.#v()}else this.#x()},Kp),le&&(this.#e=_e)}#v(){try{this.#s=dt(()=>this.#l(this.#e))}catch(e){this.error(e)}}#b(e){let n=this.#n.failed;n&&(this.#a=dt(()=>{n(this.#e,()=>e,()=>()=>{})}))}#y(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#i=dt(()=>e(this.#e)),kt(()=>{var n=this.#r=document.createDocumentFragment(),i=yt();n.append(i),this.#s=this.#_(()=>dt(()=>this.#l(i))),this.#f===0&&(this.#e.before(n),this.#r=null,ni(this.#i,()=>{this.#i=null}),this.#p(we))}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#h=0,this.#s=dt(()=>{this.#l(this.#e)}),this.#f>0){var e=this.#r=document.createDocumentFragment();Or(this.#s,e);let n=this.#n.pending;this.#i=dt(()=>n(this.#e))}else this.#p(we)}catch(n){this.error(n)}}#p(e){this.is_pending=!1,e.transfer_effects(this.#u,this.#g)}defer_effect(e){Es(e,this.#u,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#_(e){var n=ae,i=me,r=Ae;xt(this.#o),bt(this.#o),_i(this.#o.ctx);try{return hn.ensure(),e()}catch(o){return ys(o),null}finally{xt(n),bt(i),_i(r)}}#m(e,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#m(e,n);return}this.#f+=e,this.#f===0&&(this.#p(n),this.#i&&ni(this.#i,()=>{this.#i=null}),this.#r&&(this.#e.before(this.#r),this.#r=null))}update_pending_count(e,n){this.#m(e,n),this.#h+=e,!(!this.#d||this.#c)&&(this.#c=!0,kt(()=>{this.#c=!1,this.#d&&Bn(this.#d,this.#h)}))}get_effect_pending(){return this.#w(),s(this.#d)}error(e){if(!this.#n.onerror&&!this.#n.failed)throw e;we?.is_fork?(this.#s&&we.skip_effect(this.#s),this.#i&&we.skip_effect(this.#i),this.#a&&we.skip_effect(this.#a),we.oncommit(()=>{this.#E(e)})):this.#E(e)}#E(e){this.#s&&(tt(this.#s),this.#s=null),this.#i&&(tt(this.#i),this.#i=null),this.#a&&(tt(this.#a),this.#a=null),le&&(Me(this.#t),Xi(),Me(Zn()));var n=this.#n.onerror;let i=this.#n.failed;var r=!1,o=!1;let a=()=>{if(r){Tf();return}r=!0,o&&Lf(),this.#a!==null&&ni(this.#a,()=>{this.#a=null}),this.#_(()=>{this.#x()})},l=f=>{try{o=!0,n?.(f,a),o=!1}catch(u){Hn(u,this.#o&&this.#o.parent)}i&&(this.#a=this.#_(()=>{try{return dt(()=>{var u=ae;u.b=this,u.f|=128,i(this.#e,()=>f,()=>a)})}catch(u){return Hn(u,this.#o.parent),null}}))};kt(()=>{var f;try{f=this.transform_error(e)}catch(u){Hn(u,this.#o&&this.#o.parent);return}f!==null&&typeof f=="object"&&typeof f.then=="function"?f.then(l,u=>Hn(u,this.#o&&this.#o.parent)):l(f)})}};function As(t,e,n,i){let r=ei()?jr:Ur;var o=t.filter(m=>!m.settled),a=e.map(r);if(H&&a.forEach((m,g)=>{m.label=e[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,(x,b)=>b)}),n.length===0&&o.length===0){i(a);return}var l=ae,f=Qf(),u=o.length===1?o[0].promise:o.length>1?Promise.all(o.map(m=>m.promise)):null;function d(m){if((l.f&16384)===0){f();try{i([...a,...m])}catch(g){Hn(g,l)}Pr()}}var c=ja();if(n.length===0){u.then(()=>d([])).finally(c);return}function p(){Promise.all(n.map(m=>Wa(m))).then(d).catch(m=>Hn(m,l)).finally(c)}u?u.then(()=>{f(),p(),Pr()}):p()}function Qf(){var t=ae,e=me,n=Ae,i=we;if(H)var r=Fn;return function(a=!0){xt(t),bt(e),_i(n),a&&(t.f&16384)===0&&(i?.activate(),i?.apply()),H&&(Ua(null),Br(r))}}function Pr(t=!0){xt(null),bt(null),_i(null),t&&we?.deactivate(),H&&(Ua(null),Br(null))}function ja(){var t=ae,e=t.b,n=we,i=!!e?.is_rendered();return e?.update_pending_count(1,n),n.increment(i,t),()=>{e?.update_pending_count(-1,n),n.decrement(i,t)}}var an=null;function Ua(t){an=t}var Bo=new Set;function jr(t){var e=2050;ae!==null&&(ae.f|=524288);let n={ctx:Ae,deps:null,effects:null,equals:vs,f:e,fn:t,reactions:null,rv:0,v:Ue,wv:0,parent:ae,ac:null};return H&&Dn&&(n.created=Tn("created at")),n}var Wr=Symbol("obsolete");function Wa(t,e,n){let i=ae;i===null&&ff();var r=void 0,o=Qt(Ue);H&&(o.label=e??t.toString());var a=!me,l=new Set;return Jf(()=>{var f=ae;H&&(an={effect:f,effect_deps:new Set,warned:!1});var u=us();r=u.promise;try{Promise.resolve(t()).then(u.resolve,m=>{m!==gi&&u.reject(m)}).finally(Pr)}catch(m){u.reject(m),Pr()}if(H){if(an){if(f.deps!==null)for(let m=0;m<qt;m+=1)an.effect_deps.add(f.deps[m]);if(St!==null)for(let m=0;m<St.length;m+=1)an.effect_deps.add(St[m])}an=null}var d=we;if(a){if((f.f&32768)!==0)var c=ja();if(i.b?.is_rendered())d.async_deriveds.get(f)?.reject(Wr);else for(let m of l.values())m.reject(Wr);l.add(u),d.async_deriveds.set(f,u)}let p=(m,g=void 0)=>{H&&(an=null),c?.(),l.delete(u),g!==Wr&&(d.activate(),g?(o.f|=8388608,Bn(o,g)):((o.f&8388608)!==0&&(o.f^=8388608),H&&n!==void 0&&!o.equals(m)&&(Bo.add(o),setTimeout(()=>{Bo.has(o)&&(f.f&16384)===0&&(Sf(o.label,n),Bo.delete(o))})),Bn(o,m)),d.deactivate())};u.promise.then(p,m=>p(null,m||"unknown"))}),zt(()=>{for(let f of l)f.reject(Wr)}),H&&(o.f|=4194304),new Promise(f=>{function u(d){function c(){d===r?f(o):u(r)}d.then(c,c)}u(r)})}function k(t){let e=jr(t);return gt||Ss(e),e}function Ur(t){let e=jr(t);return e.equals=_s,e}function Vf(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)tt(e[n])}}var za=[];function Ro(t){var e,n=ae,i=t.parent;if(!bn&&i!==null&&t.v!==Ue&&(i.f&24576)!==0)return If(),t.v;if(xt(i),H){let r=or;Ls(new Set);try{Ii.call(za,t)&&cf(),za.push(t),t.f&=-65537,Vf(t),e=ks(t)}finally{xt(n),Ls(r),za.pop()}}else try{t.f&=-65537,Vf(t),e=ks(t)}finally{xt(n)}return e}function Ga(t){var e=Ro(t);if(!t.equals(e)&&(t.wv=zr(),(!we?.is_fork||t.deps===null)&&(we!==null?(we.capture(t,e,!0),Ci?.capture(t,e,!0)):t.v=e,t.deps===null))){Be(t,1024);return}bn||(It!==null?($i()||we?.is_fork)&&It.set(t,e):Rr(t))}function Yf(t){if(t.effects!==null)for(let e of t.effects)(e.teardown||e.ac)&&(e.teardown?.(),e.ac!==null&&ti(()=>{e.ac.abort(gi),e.ac=null}),e.fn!==null&&(e.teardown=ht),sr(e,0),Oo(e))}function Qa(t){if(t.effects!==null)for(let e of t.effects)e.teardown&&e.fn!==null&&ii(e)}var Is=null,Gr=null,we=null,Ci=null,It=null,Ja=null,er=!1,Va=!1,ar=null,Po=null,qf=0,Ya=new Set,eh=1,hn=class t{id=eh++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#l=new Set;#o=new Set;#s=0;#i=new Map;#a=null;#r=[];#h=[];#f=new Set;#c=new Set;#u=new Map;#g=new Set;is_fork=!1;#d=!1;constructor(){Gr===null?Is=Gr=this:(Gr.#n=this,this.#t=Gr),Gr=this}#w(){if(this.is_fork)return!0;for(let i of this.#i.keys()){for(var e=i,n=!1;e.parent!==null;){if(this.#u.has(e)){n=!0;break}e=e.parent}if(!n)return!0}return!1}skip_effect(e){this.#u.has(e)||this.#u.set(e,{d:[],m:[]}),this.#g.delete(e)}unskip_effect(e,n=i=>this.schedule(i)){var i=this.#u.get(e);if(i){this.#u.delete(e);for(var r of i.d)Be(r,2048),n(r);for(r of i.m)Be(r,4096),n(r)}this.#g.add(e)}#v(){if(this.#e=!0,qf++>1e3&&(this.#m(),th()),H)for(let f of this.current.keys())Ya.add(f);for(let f of this.#f)this.#c.delete(f),Be(f,2048),this.schedule(f);for(let f of this.#c)Be(f,4096),this.schedule(f);let e=this.#r;this.#r=[],this.apply();var n=ar=[],i=[],r=Po=[];for(let f of e)try{this.#b(f,n,i)}catch(u){throw ec(f),this.#w()||this.discard(),u}if(we=null,r.length>0){var o=t.ensure();for(let f of r)o.schedule(f)}if(ar=null,Po=null,this.#w()){this.#p(i),this.#p(n);for(let[f,u]of this.#u)Zf(f,u);r.length>0&&we.#v();return}let a=this.#y();if(a){this.#p(i),this.#p(n),a.#x(this);return}this.#f.clear(),this.#c.clear();for(let f of this.#l)f(this);this.#l.clear(),Ci=this,Kf(i),Kf(n),Ci=null,this.#a?.resolve();var l=we;if(this.#s===0&&(this.#r.length===0||l!==null)&&(this.#m(),gt&&(this.#_(),we=l)),this.#r.length>0)if(l!==null){let f=l;f.#r.push(...this.#r.filter(u=>!f.#r.includes(u)))}else l=this;l!==null&&l.#v()}#b(e,n,i){e.f^=1024;for(var r=e.first;r!==null;){var o=r.f,a=(o&96)!==0,l=a&&(o&1024)!==0,f=l||(o&8192)!==0||this.#u.has(r);if(!f&&r.fn!==null){a?r.f^=1024:(o&4)!==0?n.push(r):gt&&(o&16777224)!==0?i.push(r):Di(r)&&((o&16)!==0&&this.#c.add(r),ii(r));var u=r.first;if(u!==null){r=u;continue}}for(;r!==null;){var d=r.next;if(d!==null){r=d;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[n,[,i]]of this.current)if(e.current.has(n)&&!i)return e}e=e.#t}return null}#x(e){for(let[i,r]of e.current)!this.previous.has(i)&&e.previous.has(i)&&this.previous.set(i,e.previous.get(i)),this.current.set(i,r);for(let[i,r]of e.async_deriveds){let o=this.async_deriveds.get(i);o&&r.promise.then(o.resolve).catch(o.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#f,e.#c);let n=i=>{var r=i.reactions;if(r!==null&&!((i.f&2)!==0&&(i.f&6144)===0))for(let l of r){var o=l.f;if((o&2)!==0)n(l);else{var a=l;o&4194320&&!this.async_deriveds.has(a)&&(this.#c.delete(a),Be(a,2048),this.schedule(a))}}};for(let i of this.current.keys())n(i);this.oncommit(()=>e.discard()),e.#m(),we=this,this.#v()}#p(e){for(var n=0;n<e.length;n+=1)Es(e[n],this.#f,this.#c)}capture(e,n,i=!1){e.v!==Ue&&!this.previous.has(e)&&this.previous.set(e,e.v),(e.f&8388608)===0&&(this.current.set(e,[n,i]),It?.set(e,n)),this.is_fork||(e.v=n)}activate(){we=this}deactivate(){we=null,It=null}flush(){try{H&&Ya.clear(),Va=!0,we=this,this.#v()}finally{if(qf=0,Ja=null,ar=null,Po=null,Va=!1,we=null,It=null,xi.clear(),H)for(let e of Ya)e.updated=null}}discard(){for(let e of this.#o)e(this);this.#o.clear();for(let e of this.async_deriveds.values())e.reject(Wr);this.#m(),this.#a?.resolve()}register_created_effect(e){this.#h.push(e)}#_(){for(let c=Is;c!==null;c=c.#n){var e=c.id<this.id,n=[];for(let[p,[m,g]]of this.current){if(c.current.has(p)){var i=c.current.get(p)[0];if(e&&m!==i)c.current.set(p,[m,g]);else continue}n.push(p)}if(e)for(let[p,m]of this.async_deriveds){let g=c.async_deriveds.get(p);g&&m.promise.then(g.resolve).catch(g.reject)}var r=[...c.current.keys()].filter(p=>!c.current.get(p)[1]);if(!(!c.#e||r.length===0)){var o=r.filter(p=>!this.current.has(p));if(o.length===0)e&&c.discard();else if(n.length>0){if(H&&!c.#d&&Hf(c.#r.length===0,"Batch has scheduled roots"),e)for(let p of this.#g)c.unskip_effect(p,m=>{(m.f&4194320)!==0?c.schedule(m):c.#p([m])});c.activate();var a=new Set,l=new Map;for(var f of n)Xf(f,o,a,l);l=new Map;var u=[...c.current].filter(([p,m])=>{let g=this.current.get(p);return g?g[0]!==m[0]||g[1]!==m[1]:!0}).map(([p])=>p);if(u.length>0)for(let p of this.#h)(p.f&155648)===0&&qa(p,u,l)&&((p.f&4194320)!==0?(Be(p,2048),c.schedule(p)):c.#f.add(p));if(c.#r.length>0&&!c.#d){c.apply();for(var d of c.#r)c.#b(d,[],[]);c.#r=[]}c.deactivate()}}}}increment(e,n){if(this.#s+=1,e){let i=this.#i.get(n)??0;this.#i.set(n,i+1)}}decrement(e,n){if(this.#s-=1,e){let i=this.#i.get(n)??0;i===1?this.#i.delete(n):this.#i.set(n,i-1)}this.#d||(this.#d=!0,kt(()=>{this.#d=!1,this.linked&&this.flush()}))}transfer_effects(e,n){for(let i of e)this.#f.add(i);for(let i of n)this.#c.add(i);e.clear(),n.clear()}oncommit(e){this.#l.add(e)}ondiscard(e){this.#o.add(e)}settled(){return(this.#a??=us()).promise}static ensure(){if(we===null){let e=we=new t;!Va&&!er&&kt(()=>{e.#e||e.flush()})}return we}apply(){if(!gt||!this.is_fork&&this.#t===null&&this.#n===null){It=null;return}It=new Map;for(let[n,[i]]of this.current)It.set(n,i);for(let n=Is;n!==null;n=n.#n)if(!(n===this||n.is_fork)){var e=!1;if(n.id<this.id){for(let[i,[,r]]of n.current)if(!r&&this.current.has(i)){e=!0;break}}if(!e)for(let[i,r]of n.previous)It.has(i)||It.set(i,r)}}schedule(e){if(Ja=e,e.b?.is_pending&&(e.f&16777228)!==0&&(e.f&32768)===0){e.b.defer_effect(e);return}for(var n=e;n.parent!==null;){n=n.parent;var i=n.f;if(ar!==null&&n===ae&&(gt||(me===null||(me.f&2)===0)&&!Uf))return;if((i&96)!==0){if((i&1024)===0)return;n.f^=1024}}this.#r.push(n)}#m(){if(this.linked){var e=this.#t,n=this.#n;e===null?Is=n:e.#n=n,n===null?Gr=e:n.#t=e,this.linked=!1}}};function Qr(t){var e=er;er=!0;try{var n;for(t&&(we!==null&&!we.is_fork&&we.flush(),n=t());;){if(Of(),we===null)return n;we.flush()}}finally{er=e}}function th(){if(H){var t=new Map;for(let n of we.current.keys())for(let[i,r]of n.updated??[]){var e=t.get(i);e||(e={error:r.error,count:0},t.set(i,e)),e.count+=r.count}for(let n of t.values())n.error&&console.error(n.error)}try{gf()}catch(n){H&&jt(n,"stack",{value:""}),Hn(n,Ja)}}var xn=null;function Kf(t){var e=t.length;if(e!==0){for(var n=0;n<e;){var i=t[n++];if((i.f&24576)===0&&Di(i)&&(xn=new Set,ii(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&Ka(i),xn?.size>0)){xi.clear();for(let r of xn){if((r.f&24576)!==0)continue;let o=[r],a=r.parent;for(;a!==null;)xn.has(a)&&(xn.delete(a),o.push(a)),a=a.parent;for(let l=o.length-1;l>=0;l--){let f=o[l];(f.f&24576)===0&&ii(f)}}xn.clear()}}xn=null}}function Xf(t,e,n,i){if(!n.has(t)&&(n.add(t),t.reactions!==null))for(let r of t.reactions){let o=r.f;(o&2)!==0?Xf(r,e,n,i):(o&4194320)!==0&&(o&2048)===0&&qa(r,e,i)&&(Be(r,2048),jo(r))}}function qa(t,e,n){let i=n.get(t);if(i!==void 0)return i;if(t.deps!==null)for(let r of t.deps){if(Ii.call(e,r))return!0;if((r.f&2)!==0&&qa(r,e,n))return n.set(r,!0),!0}return n.set(t,!1),!1}function jo(t){we.schedule(t)}function Zf(t,e){if(!((t.f&32)!==0&&(t.f&1024)!==0)){(t.f&2048)!==0?e.d.push(t):(t.f&4096)!==0&&e.m.push(t),Be(t,1024);for(var n=t.first;n!==null;)Zf(n,e),n=n.next}}function ec(t){Be(t,1024);for(var e=t.first;e!==null;)ec(e),e=e.next}var or=new Set,xi=new Map;function Ls(t){or=t}var Xa=!1;function nc(){Xa=!0}function Qt(t,e){var n={f:0,v:t,reactions:null,equals:vs,rv:0,wv:0};return H&&Dn&&(n.created=e??Tn("created at"),n.updated=null,n.set_during_effect=!1,n.trace=null),n}function ce(t,e){let n=Qt(t,e);return Ss(n),n}function tr(t,e=!1,n=!0){let i=Qt(t);return e||(i.equals=_s),vi&&n&&Ae!==null&&Ae.l!==null&&(Ae.l.s??=[]).push(i),i}function oe(t,e,n=!1){me!==null&&(!Kt||(me.f&131072)!==0)&&ei()&&(me.f&4325394)!==0&&(Rn===null||!Rn.has(t))&&Af();let i=n?Le(e):e;return H&&bs(i,t.label),Bn(t,i,Po)}function Bn(t,e,n=null){if(!t.equals(e)){xi.set(t,bn?e:t.v);var i=hn.ensure();if(i.capture(t,e),H){if(Dn||ae!==null){t.updated??=new Map;let r=(t.updated.get("")?.count??0)+1;if(t.updated.set("",{error:null,count:r}),Dn||r>5){let o=Tn("updated at");if(o!==null){let a=t.updated.get(o.stack);a||(a={error:o,count:0},t.updated.set(o.stack,a)),a.count++}}}ae!==null&&(t.set_during_effect=!0)}if((t.f&2)!==0){let r=t;(t.f&2048)!==0&&Ro(r),It===null&&Rr(r)}t.wv=zr(),ic(t,2048,n),ei()&&ae!==null&&(ae.f&1024)!==0&&(ae.f&96)===0&&(mn===null?rc([t]):mn.push(t)),!i.is_fork&&or.size>0&&!Xa&&$s()}return e}function $s(){Xa=!1;for(let t of or){(t.f&1024)!==0&&Be(t,4096);let e;try{e=Di(t)}catch{e=!0}e&&ii(t)}or.clear()}function rr(t){oe(t,t.v+1)}function ic(t,e,n){var i=t.reactions;if(i!==null)for(var r=ei(),o=i.length,a=0;a<o;a++){var l=i[a],f=l.f;if(!(!r&&l===ae)){var u=(f&2048)===0;if(u&&Be(l,e),(f&131072)!==0)or.add(l);else if((f&2)!==0){var d=l;It?.delete(d),(f&65536)===0&&(f&512&&(ae===null||(ae.f&2097152)===0)&&(l.f|=65536),ic(d,4096,n))}else if(u){var c=l;(f&16)!==0&&xn!==null&&xn.add(c),n!==null?n.push(c):jo(c)}}}}var ih=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Le(t){if(typeof t!="object"||t===null||Yt in t)return t;let e=Dr(t);if(e!==Ca&&e!==sf)return t;var n=new Map,i=mi(t),r=ce(0),o=H&&Dn?Tn("created at"):null,a=Ti,l=c=>{if(Ti===a)return c();var p=me,m=Ti;bt(null),Za(a);var g=c();return bt(p),Za(m),g};i&&(n.set("length",ce(t.length,o)),H&&(t=oh(t)));var f="";let u=!1;function d(c){if(!u){u=!0,f=c,Ut(r,`${f} version`);for(let[p,m]of n)Ut(m,dr(f,p));u=!1}}return new Proxy(t,{defineProperty(c,p,m){(!("value"in m)||m.configurable===!1||m.enumerable===!1||m.writable===!1)&&yf();var g=n.get(p);return g===void 0?l(()=>{var x=ce(m.value,o);return n.set(p,x),H&&typeof p=="string"&&Ut(x,dr(f,p)),x}):oe(g,m.value,!0),!0},deleteProperty(c,p){var m=n.get(p);if(m===void 0){if(p in c){let g=l(()=>ce(Ue,o));n.set(p,g),rr(r),H&&Ut(g,dr(f,p))}}else oe(m,Ue),rr(r);return!0},get(c,p,m){if(p===Yt)return t;if(H&&p===hs)return d;var g=n.get(p),x=p in c;if(g===void 0&&(!x||cn(c,p)?.writable)&&(g=l(()=>{var _=Le(x?c[p]:Ue),L=ce(_,o);return H&&Ut(L,dr(f,p)),L}),n.set(p,g)),g!==void 0){var b=s(g);return b===Ue?void 0:b}return Reflect.get(c,p,m)},getOwnPropertyDescriptor(c,p){var m=Reflect.getOwnPropertyDescriptor(c,p);if(m&&"value"in m){var g=n.get(p);g&&(m.value=s(g))}else if(m===void 0){var x=n.get(p),b=x?.v;if(x!==void 0&&b!==Ue)return{enumerable:!0,configurable:!0,value:b,writable:!0}}return m},has(c,p){if(p===Yt)return!0;var m=n.get(p),g=m!==void 0&&m.v!==Ue||Reflect.has(c,p);if(m!==void 0||ae!==null&&(!g||cn(c,p)?.writable)){m===void 0&&(m=l(()=>{var b=g?Le(c[p]):Ue,_=ce(b,o);return H&&Ut(_,dr(f,p)),_}),n.set(p,m));var x=s(m);if(x===Ue)return!1}return g},set(c,p,m,g){var x=n.get(p),b=p in c;if(i&&p==="length")for(var _=m;_<x.v;_+=1){var L=n.get(_+"");L!==void 0?oe(L,Ue):_ in c&&(L=l(()=>ce(Ue,o)),n.set(_+"",L),H&&Ut(L,dr(f,_)))}if(x===void 0)(!b||cn(c,p)?.writable)&&(x=l(()=>ce(void 0,o)),H&&Ut(x,dr(f,p)),oe(x,Le(m)),n.set(p,x));else{b=x.v!==Ue;var y=l(()=>Le(m));oe(x,y)}var N=Reflect.getOwnPropertyDescriptor(c,p);if(N?.set&&N.set.call(g,m),!b){if(i&&typeof p=="string"){var S=n.get("length"),E=Number(p);Number.isInteger(E)&&E>=S.v&&oe(S,E+1)}rr(r)}return!0},ownKeys(c){s(r);var p=Reflect.ownKeys(c).filter(x=>{var b=n.get(x);return b===void 0||b.v!==Ue});for(var[m,g]of n)g.v!==Ue&&!(m in c)&&p.push(m);return p},setPrototypeOf(){Ef()}})}function dr(t,e){return typeof e=="symbol"?`${t}[Symbol(${e.description??""})]`:ih.test(e)?`${t}.${e}`:/^\d+$/.test(e)?`${t}[${e}]`:`${t}['${e}']`}function Cs(t){try{if(t!==null&&typeof t=="object"&&Yt in t)return t[Yt]}catch{}return t}var rh=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function oh(t){return new Proxy(t,{get(e,n,i){var r=Reflect.get(e,n,i);return rh.has(n)?function(...o){nc();var a=r.apply(this,o);return $s(),a}:r}})}function oc(){let t=Array.prototype,e=Array.__svelte_cleanup;e&&e();let{indexOf:n,lastIndexOf:i,includes:r}=t;t.indexOf=function(o,a){let l=n.call(this,o,a);if(l===-1){for(let f=a??0;f<this.length;f+=1)if(Cs(this[f])===o){gs("array.indexOf(...)");break}}return l},t.lastIndexOf=function(o,a){let l=i.call(this,o,a??this.length-1);if(l===-1){for(let f=0;f<=(a??this.length-1);f+=1)if(Cs(this[f])===o){gs("array.lastIndexOf(...)");break}}return l},t.includes=function(o,a){let l=r.call(this,o,a);if(!l){for(let f=0;f<this.length;f+=1)if(Cs(this[f])===o){gs("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{t.indexOf=n,t.lastIndexOf=i,t.includes=r}}var el,sc,Mo,ac,lc;function Ds(){if(el===void 0){el=window,sc=document,Mo=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;ac=cn(e,"firstChild").get,lc=cn(e,"nextSibling").get,Da(t)&&(t[Io]=void 0,t[ms]=null,t[No]=void 0,t.__e=void 0),Da(n)&&(n[$o]=void 0),H&&(t.__svelte_meta=null,oc())}}function yt(t=""){return document.createTextNode(t)}function Qe(t){return ac.call(t)}function Lt(t){return lc.call(t)}function C(t,e){if(!le)return Qe(t);var n=Qe(_e);if(n===null)n=_e.appendChild(yt());else if(e&&n.nodeType!==Tr){var i=yt();return n?.before(i),Me(i),i}return e&&Fs(n),Me(n),n}function ne(t,e=!1){if(!le){var n=Qe(t);return n instanceof Comment&&n.data===""?Lt(n):n}if(e){if(_e?.nodeType!==Tr){var i=yt();return _e?.before(i),Me(i),i}Fs(_e)}return _e}function K(t,e=1,n=!1){let i=le?_e:t;for(var r;e--;)r=i,i=Lt(i);if(!le)return i;if(n){if(i?.nodeType!==Tr){var o=yt();return i===null?r?.after(o):i.before(o),Me(o),o}Fs(i)}return Me(i),i}function Ho(t){t.textContent=""}function Ts(){if(!gt||xn!==null)return!1;var t=ae.f;return(t&32768)!==0}function ri(t,e,n){return e==null||e===fs?n?document.createElement(t,{is:n}):document.createElement(t):n?document.createElementNS(e,t,{is:n}):document.createElementNS(e,t)}function Fs(t){if(t.nodeValue.length<65536)return;let e=t.nextSibling;for(;e!==null&&e.nodeType===Tr;)e.remove(),t.nodeValue+=e.nodeValue,e=t.nextSibling}function fc(t){ae===null&&(me===null&&mf(t),hf()),bn&&pf(t)}function ah(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function On(t,e){var n=ae;if(H)for(;n!==null&&(n.f&131072)!==0;)n=n.parent;n!==null&&(n.f&8192)!==0&&(t|=8192);var i={ctx:Ae,deps:null,nodes:null,f:t|2048|512,first:null,fn:e,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};H&&(i.component_function=pn),we?.register_created_effect(i);var r=i;if((t&4)!==0)ar!==null?ar.push(i):hn.ensure().schedule(i);else if(e!==null){try{ii(i)}catch(a){throw tt(i),a}r.deps===null&&r.teardown===null&&r.nodes===null&&r.first===r.last&&(r.f&524288)===0&&(r=r.first,(t&16)!==0&&(t&65536)!==0&&r!==null&&(r.f|=65536))}if(r!==null&&(r.parent=n,n!==null&&ah(r,n),me!==null&&(me.f&2)!==0&&(t&64)===0)){var o=me;(o.effects??=[]).push(r)}return i}function $i(){return me!==null&&!Kt}function zt(t){let e=On(8,null);return Be(e,1024),e.teardown=t,e}function ye(t){fc("$effect"),H&&jt(t,"name",{value:"$effect"});var e=ae.f,n=!me&&(e&32)!==0&&Ae!==null&&!Ae.i;if(n){var i=Ae;(i.e??=[]).push(t)}else return Ba(t)}function Ba(t){return On(1048580,t)}function nl(t){hn.ensure();let e=On(524352,t);return()=>{tt(e)}}function cc(t){hn.ensure();let e=On(524352,t);return(n={})=>new Promise(i=>{n.outro?ni(e,()=>{tt(e),i(void 0)}):(tt(e),i(void 0))})}function yn(t){return On(4,t)}function Jf(t){return On(4718592,t)}function Jt(t,e=0){return On(8|e,t)}function X(t,e=[],n=[],i=[]){As(i,e,n,r=>{On(8,()=>{t(...r.map(s))})})}function sn(t,e=0){var n=On(16|e,t);return H&&(n.dev_stack=Fn),n}function il(t,e=0){var n=On(16777216|e,t);return H&&(n.dev_stack=Fn),n}function dt(t){return On(524320,t)}function rl(t){var e=t.teardown;if(e!==null){let n=bn,i=me;tl(!0),bt(null);try{e.call(null)}finally{tl(n),bt(i)}}}function Oo(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){let r=n.ac;r!==null&&ti(()=>{r.abort(gi)});var i=n.next;(n.f&64)!==0?n.parent=null:tt(n,e),n=i}}function uc(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&32)===0&&tt(e),e=n}}function tt(t,e=!0){var n=!1;(e||(t.f&262144)!==0)&&t.nodes!==null&&t.nodes.end!==null&&(ol(t.nodes.start,t.nodes.end),n=!0),t.f|=33554432,Oo(t,e&&!n),sr(t,0);var i=t.nodes&&t.nodes.t;if(i!==null)for(let o of i)o.stop();rl(t),t.f^=33554432,t.f|=16384;var r=t.parent;r!==null&&r.first!==null&&Ka(t),H&&(t.component_function=null),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes=t.ac=t.b=null}function ol(t,e){for(;t!==null;){var n=t===e?null:Lt(t);t.remove(),t=n}}function Ka(t){var e=t.parent,n=t.prev,i=t.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),e!==null&&(e.first===t&&(e.first=i),e.last===t&&(e.last=n))}function ni(t,e,n=!0){var i=[];pc(t,i,!0);var r=()=>{n&&tt(t),e&&e()},o=i.length;if(o>0){var a=()=>--o||r();for(var l of i)l.out(a)}else r()}function pc(t,e,n){if((t.f&8192)===0){t.f^=8192;var i=t.nodes&&t.nodes.t;if(i!==null)for(let l of i)(l.is_global||n)&&e.push(l);for(var r=t.first;r!==null;){var o=r.next;if((r.f&64)===0){var a=(r.f&65536)!==0||(r.f&32)!==0&&(t.f&16)!==0;pc(r,e,a?n:!1)}r=o}}}function Yr(t){hc(t,!0)}function hc(t,e){if((t.f&8192)!==0){t.f^=8192,(t.f&1024)===0&&(Be(t,2048),hn.ensure().schedule(t));for(var n=t.first;n!==null;){var i=n.next,r=(n.f&65536)!==0||(n.f&32)!==0;hc(n,r?e:!1),n=i}var o=t.nodes&&t.nodes.t;if(o!==null)for(let a of o)(a.is_global||e)&&a.in()}}function Or(t,e){if(t.nodes)for(var n=t.nodes.start,i=t.nodes.end;n!==null;){var r=n===i?null:Lt(n);e.append(n),n=r}}var mc=null;var Ms=!1,bn=!1;function tl(t){bn=t}var me=null,Kt=!1;function bt(t){me=t}var ae=null;function xt(t){ae=t}var Rn=null;function Ss(t){me!==null&&(!gt||(me.f&2)!==0)&&(Rn??=new Set).add(t)}var St=null,qt=0,mn=null;function rc(t){mn=t}var gc=1,fr=0,Ti=fr;function Za(t){Ti=t}function zr(){return++gc}function Di(t){var e=t.f;if((e&2048)!==0)return!0;if(e&2&&(t.f&=-65537),(e&4096)!==0){for(var n=t.deps,i=n.length,r=0;r<i;r++){var o=n[r];if(Di(o)&&Ga(o),o.wv>t.wv)return!0}(e&512)!==0&&It===null&&Be(t,1024)}return!1}function vc(t,e,n=!0){var i=t.reactions;if(i!==null&&!(!gt&&Rn!==null&&Rn.has(t)))for(var r=0;r<i.length;r++){var o=i[r];(o.f&2)!==0?vc(o,e,!1):e===o&&(n?Be(o,2048):(o.f&1024)!==0&&Be(o,4096),jo(o))}}function ks(t){var e=St,n=qt,i=mn,r=me,o=Rn,a=Ae,l=Kt,f=Ti,u=t.f;St=null,qt=0,mn=null,me=(u&96)===0?t:null,Rn=null,_i(t.ctx),Kt=!1,Ti=++fr,t.ac!==null&&(ti(()=>{t.ac.abort(gi)}),t.ac=null);try{t.f|=2097152;var d=t.fn,c=d();t.f|=32768;var p=t.deps,m=we?.is_fork;if(St!==null){var g;if(m||sr(t,qt),p!==null&&qt>0)for(p.length=qt+St.length,g=0;g<St.length;g++)p[qt+g]=St[g];else t.deps=p=St;if($i()&&(t.f&512)!==0)for(g=qt;g<p.length;g++)(p[g].reactions??=[]).push(t)}else!m&&p!==null&&qt<p.length&&(sr(t,qt),p.length=qt);if(ei()&&mn!==null&&!Kt&&p!==null&&(t.f&6146)===0)for(g=0;g<mn.length;g++)vc(mn[g],t);if(r!==null&&r!==t){if(fr++,r.deps!==null)for(let x=0;x<n;x+=1)r.deps[x].rv=fr;if(e!==null)for(let x of e)x.rv=fr;mn!==null&&(i===null?i=mn:i.push(...mn))}return(t.f&8388608)!==0&&(t.f^=8388608),c}catch(x){return ys(x)}finally{t.f^=2097152,St=e,qt=n,mn=i,me=r,Rn=o,_i(a),Kt=l,Ti=f}}function lh(t,e){let n=e.reactions;if(n!==null){var i=of.call(n,t);if(i!==-1){var r=n.length-1;r===0?n=e.reactions=null:(n[i]=n[r],n.pop())}}if(n===null&&(e.f&2)!==0&&(St===null||!Ii.call(St,e))){var o=e;(o.f&512)!==0&&(o.f^=512,o.f&=-65537),o.v!==Ue&&Rr(o),o.ac!==null&&ti(()=>{o.ac.abort(gi),o.ac=null,Be(o,2048)}),Yf(o),sr(o,0)}}function sr(t,e){var n=t.deps;if(n!==null)for(var i=e;i<n.length;i++)lh(t,n[i])}function ii(t){var e=t.f;if((e&16384)===0){Be(t,1024);var n=ae,i=Ms;if(ae=t,Ms=(e&96)===0,H){var r=pn;xs(t.component_function);var o=Fn;Br(t.dev_stack??Fn)}try{(e&16777232)!==0?uc(t):Oo(t),rl(t);var a=ks(t);if(t.teardown=typeof a=="function"?a:null,t.wv=gc,H&&Dn&&(t.f&2048)!==0&&t.deps!==null)for(var l of t.deps)l.set_during_effect&&(l.wv=zr(),l.set_during_effect=!1)}finally{Ms=i,ae=n,H&&(xs(r),Br(o))}}}function s(t){var e=t.f,n=(e&2)!==0;if(mc?.add(t),me!==null&&!Kt){var i=ae!==null&&(ae.f&16384)!==0;if(!i&&(Rn===null||!Rn.has(t))){var r=me.deps;if((me.f&2097152)!==0)t.rv<fr&&(t.rv=fr,St===null&&r!==null&&r[qt]===t?qt++:St===null?St=[t]:St.push(t));else{me.deps??=[],Ii.call(me.deps,t)||me.deps.push(t);var o=t.reactions;o===null?t.reactions=[me]:Ii.call(o,me)||o.push(me)}}}if(H){if(!Kt&&an&&we===null&&Ci===null&&!an.warned&&(an.effect.f&2097152)===0&&!an.effect_deps.has(t)){an.warned=!0,kf(t.label);var a=Tn("traced at");a&&console.warn(a)}if(Bo.delete(t),Dn&&!Kt&&To!==null&&me!==null&&To.reaction===me){if(t.trace)t.trace();else if(a=Tn("traced at"),a){var l=To.entries.get(t);l===void 0&&(l={traces:[]},To.entries.set(t,l));var f=l.traces[l.traces.length-1];a.stack!==f?.stack&&l.traces.push(a)}}}if(bn&&xi.has(t))return xi.get(t);if(n){var u=t;if(bn){var d=u.v;return((u.f&1024)===0&&u.reactions!==null||wc(u))&&(d=Ro(u)),xi.set(u,d),d}var c=(u.f&512)===0&&!Kt&&me!==null&&(Ms||(me.f&512)!==0),p=(u.f&32768)===0;Di(u)&&(c&&(u.f|=512),Ga(u)),c&&!p&&(Qa(u),_c(u))}if(It?.has(t))return It.get(t);if((t.f&8388608)!==0)throw t.v;return t.v}function _c(t){if(t.f|=512,t.deps!==null)for(let e of t.deps)(e.reactions??=[]).push(t),(e.f&2)!==0&&(e.f&512)===0&&(Qa(e),_c(e))}function wc(t){if(t.v===Ue)return!0;if(t.deps===null)return!1;for(let e of t.deps)if(xi.has(e)||(e.f&2)!==0&&wc(e))return!0;return!1}function Ze(t){var e=Kt;try{return Kt=!0,t()}finally{Kt=e}}var Uo=Symbol("events"),sl=new Set,Hs=new Set;function be(t,e,n){(e[Uo]??={})[t]=n}function rt(t){for(var e=0;e<t.length;e++)sl.add(t[e]);for(var n of Hs)n(t)}var bc=null;function al(t){var e=this,n=e.ownerDocument,i=t.type,r=t.composedPath?.()||[],o=r[0]||t.target;bc=t;var a=0,l=bc===t&&t[Uo];if(l){var f=r.indexOf(l);if(f!==-1&&(e===document||e===window)){t[Uo]=e;return}var u=r.indexOf(e);if(u===-1)return;f<=u&&(a=f)}if(o=r[a]||t.target,o!==e){jt(t,"currentTarget",{configurable:!0,get(){return o||n}});var d=me,c=ae;bt(null),xt(null);try{for(var p,m=[];o!==null&&o!==e;){try{var g=o[Uo]?.[i];g!=null&&(!o.disabled||t.target===o)&&g.call(o,t)}catch(x){p?m.push(x):p=x}if(t.cancelBubble)break;a++,o=a<r.length?r[a]:null}if(p){for(let x of m)queueMicrotask(()=>{throw x});throw p}}finally{t[Uo]=e,delete t.currentTarget,bt(d),xt(c)}}}var dh=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:t=>t});function xc(t){return dh?.createHTML(t)??t}function Bs(t){var e=ri("template");return e.innerHTML=xc(t.replaceAll("<!>","<!---->")),e.content}function Ft(t,e){var n=ae;n.nodes===null&&(n.nodes={start:t,end:e,a:null,t:null})}function O(t,e){var n=(e&1)!==0,i=(e&2)!==0,r,o=!t.startsWith("<!>");return()=>{if(le)return Ft(_e,null),_e;r===void 0&&(r=Bs(o?t:"<!>"+t),n||(r=Qe(r)));var a=i||Mo?document.importNode(r,!0):r.cloneNode(!0);if(n){var l=Qe(a),f=a.lastChild;Ft(l,f)}else Ft(a,a);return a}}function ph(t,e,n="svg"){var i=!t.startsWith("<!>"),r=(e&1)!==0,o=`<${n}>${i?t:"<!>"+t}</${n}>`,a;return()=>{if(le)return Ft(_e,null),_e;if(!a){var l=Bs(o),f=Qe(l);if(r)for(a=document.createDocumentFragment();Qe(f);)a.appendChild(Qe(f));else a=Qe(f)}var u=a.cloneNode(!0);if(r){var d=Qe(u),c=u.lastChild;Ft(d,c)}else Ft(u,u);return u}}function yi(t,e){return ph(t,e,"svg")}function pe(){if(le)return Ft(_e,null),_e;var t=document.createDocumentFragment(),e=document.createComment(""),n=yt();return t.append(e,n),Ft(e,n),t}function D(t,e){if(le){var n=ae;((n.f&32768)===0||n.nodes.end===null)&&(n.nodes.end=_e),At();return}t!==null&&t.before(e)}var hh=/\r/g;function Ec(t){t=t.replace(hh,"");let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return(e>>>0).toString(36)}var mh=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var Gy=[...mh,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var gh=["touchstart","touchmove"];function Ac(t){return gh.includes(t)}var vh=["$state","$state.raw","$derived","$derived.by"],Qy=[...vh,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];function Rs(t){return t?.replace(/\//g,"/\u200B")}var ll=!0;function Ce(t,e){var n=e==null?"":typeof e=="object"?`${e}`:e;n!==(t[$o]??=t.nodeValue)&&(t[$o]=n,t.nodeValue=`${n}`)}function Jr(t,e){return Lc(t,e)}function fl(t,e){Ds(),e.intro=e.intro??!1;let n=e.target,i=le,r=_e;try{for(var o=Qe(n);o&&(o.nodeType!==un||o.data!=="[");)o=Lt(o);if(!o)throw qn;mt(!0),Me(o);let a=Lc(t,{...e,anchor:o});return mt(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==qn&&console.warn("Failed to hydrate: ",a),e.recover===!1&&vf(),Ds(),Ho(n),mt(!1),Jr(t,e)}finally{mt(i),Me(r)}}var Os=new Map;function Lc(t,{target:e,anchor:n,props:i={},events:r,context:o,intro:a=!0,transformError:l}){Ds();var f=void 0,u=cc(()=>{var d=n??e.appendChild(yt());Pa(d,{pending:()=>{}},m=>{de({});var g=Ae;if(o&&(g.c=o),r&&(i.$$events=r),le&&Ft(m,null),ll=a,f=t(m,i)||{},ll=!0,le&&(ae.nodes.end=_e,_e===null||_e.nodeType!==un||_e.data!=="]"))throw Ni(),qn;fe()},l);var c=new Set,p=m=>{for(var g=0;g<m.length;g++){var x=m[g];if(!c.has(x)){c.add(x);var b=Ac(x);for(let y of[e,document]){var _=Os.get(y);_===void 0&&(_=new Map,Os.set(y,_));var L=_.get(x);L===void 0?(y.addEventListener(x,al,{passive:b}),_.set(x,1)):_.set(x,L+1)}}}};return p(Cr(sl)),Hs.add(p),()=>{for(var m of c)for(let b of[e,document]){var g=Os.get(b),x=g.get(m);--x==0?(b.removeEventListener(m,al),g.delete(m),g.size===0&&Os.delete(b)):g.set(m,x)}Hs.delete(p),d!==n&&d.parentNode?.removeChild(d)}});return dl.set(f,u),f}var dl=new WeakMap;function Wo(t,e){let n=dl.get(t);return n?(dl.delete(t),n(e)):(H&&(Yt in t?Df():Cf()),Promise.resolve())}var oi=class{anchor;#e=new Map;#t=new Map;#n=new Map;#l=new Set;#o=!0;constructor(e,n=!0){this.anchor=e,this.#o=n}#s=e=>{if(this.#e.has(e)){var n=this.#e.get(e),i=this.#t.get(n);if(i)Yr(i),this.#l.delete(n);else{var r=this.#n.get(n);r&&(Yr(r.effect),this.#t.set(n,r.effect),this.#n.delete(n),H&&(r.fragment.lastChild[Ta]=this.anchor),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),i=r.effect)}for(let[o,a]of this.#e){if(this.#e.delete(o),o===e)break;let l=this.#n.get(a);l&&(tt(l.effect),this.#n.delete(a))}for(let[o,a]of this.#t){if(o===n||this.#l.has(o))continue;let l=()=>{if(Array.from(this.#e.values()).includes(o)){var u=document.createDocumentFragment();Or(a,u),u.append(yt()),this.#n.set(o,{effect:a,fragment:u})}else tt(a);this.#l.delete(o),this.#t.delete(o)};this.#o||!i?(this.#l.add(o),ni(a,l,!1)):l()}}};#i=e=>{this.#e.delete(e);let n=Array.from(this.#e.values());for(let[i,r]of this.#n)n.includes(i)||(tt(r.effect),this.#n.delete(i))};ensure(e,n){var i=we,r=Ts();if(n&&!this.#t.has(e)&&!this.#n.has(e))if(r){var o=document.createDocumentFragment(),a=yt();o.append(a),this.#n.set(e,{effect:dt(()=>n(a)),fragment:o})}else this.#t.set(e,dt(()=>n(this.anchor)));if(this.#e.set(i,e),r){for(let[l,f]of this.#t)l===e?i.unskip_effect(f):i.skip_effect(f);for(let[l,f]of this.#n)l===e?i.unskip_effect(f.effect):i.skip_effect(f.effect);i.oncommit(this.#s),i.ondiscard(this.#i)}else le&&(this.anchor=_e),this.#s(i)}};function Mt(t,e,...n){var i=new oi(t);sn(()=>{let r=e()??null;H&&r==null&&_f(),i.ensure(r,r&&(o=>r(o,...n)))},65536)}if(H){let t=function(e){if(!(e in globalThis)){let n;Object.defineProperty(globalThis,e,{configurable:!0,get:()=>{if(n!==void 0)return n;bf(e)},set:i=>{n=i}})}};t("$state"),t("$effect"),t("$derived"),t("$inspect"),t("$props"),t("$bindable")}function bh(t){Ae===null&&Fr("onMount"),vi&&Ae.l!==null?xh(Ae).m.push(t):ye(()=>{let e=Ze(t);if(typeof e=="function")return e})}function ze(t){Ae===null&&Fr("onDestroy"),bh(()=>()=>Ze(t))}function xh(t){var e=t.l;return e.u??={a:[],b:[],m:[]}}function Y(t,e,n=!1){var i;le&&(i=_e,At());var r=new oi(t),o=n?65536:0;function a(l,f){if(le){var u=Do(i);if(l!==parseInt(u.substring(1))){var d=Zn();Me(d),r.anchor=d,mt(!1),r.ensure(l,f),mt(!0);return}}r.ensure(l,f)}sn(()=>{var l=!1;e((f,u=0)=>{l=!0,a(u,f)}),l||a(-1,null)},o)}function ai(t,e){return e}function Nh(t,e,n){for(var i=[],r=e.length,o,a=e.length,l=0;l<r;l++){let c=e[l];ni(c,()=>{if(o){if(o.pending.delete(c),o.done.add(c),o.pending.size===0){var p=t.outrogroups;cl(t,Cr(o.done)),p.delete(o),p.size===0&&(t.outrogroups=null)}}else a-=1},!1)}if(a===0){var f=i.length===0&&n!==null;if(f){var u=n,d=u.parentNode;Ho(d),d.append(u),t.items.clear()}cl(t,e,!f)}else o={pending:new Set(e),done:new Set},(t.outrogroups??=new Set).add(o)}function cl(t,e,n=!0){var i;if(t.pending.size>0){i=new Set;for(let a of t.pending.values())for(let l of a)i.add(t.items.get(l).e)}for(var r=0;r<e.length;r++){var o=e[r];if(i?.has(o)){o.f|=33554432;let a=document.createDocumentFragment();Or(o,a)}else tt(e[r],n)}}var Ic;function li(t,e,n,i,r,o=null){var a=t,l=new Map,f=(e&4)!==0;if(f){var u=t;a=le?Me(Qe(u)):u.appendChild(yt())}le&&At();var d=null,c=Ur(()=>{var y=n();return mi(y)?y:y==null?[]:Cr(y)});H&&Ut(c,"{#each ...}");var p,m=new Map,g=!0;function x(y){(L.effect.f&16384)===0&&(L.pending.delete(y),L.fallback=d,$h(L,p,a,e,i),d!==null&&(p.length===0?(d.f&33554432)===0?Yr(d):(d.f^=33554432,Go(d,null,a)):ni(d,()=>{d=null})))}function b(y){L.pending.delete(y)}var _=sn(()=>{p=s(c);var y=p.length;let N=!1;if(le){var S=Do(a)==="[!";S!==(y===0)&&(a=Zn(),Me(a),mt(!1),N=!0)}for(var E=new Set,h=we,w=Ts(),A=0;A<y;A+=1){le&&_e.nodeType===un&&_e.data==="]"&&(a=_e,N=!0,mt(!1));var T=p[A],M=i(T,A);if(H){var U=i(T,A);M!==U&&uf(String(A),String(M),String(U))}var P=g?null:l.get(M);P?(P.v&&Bn(P.v,T),P.i&&Bn(P.i,A),w&&h.unskip_effect(P.e)):(P=Ch(l,g?a:Ic??=yt(),T,M,A,r,e,n),g||(P.e.f|=33554432),l.set(M,P)),E.add(M)}if(y===0&&o&&!d&&(g?d=dt(()=>o(a)):(d=dt(()=>o(Ic??=yt())),d.f|=33554432)),y>E.size&&(H?Dh(p,i):Ma("","","")),le&&y>0&&Me(Zn()),!g)if(m.set(h,E),w){for(let[J,ee]of l)E.has(J)||h.skip_effect(ee.e);h.oncommit(x),h.ondiscard(b)}else x(h);N&&mt(!0),s(c)}),L={effect:_,flags:e,items:l,pending:m,outrogroups:null,fallback:d};g=!1,le&&(a=_e)}function zo(t){for(;t!==null&&(t.f&32)===0;)t=t.next;return t}function $h(t,e,n,i,r){var o=(i&8)!==0,a=e.length,l=t.items,f=zo(t.effect.first),u,d=null,c,p=[],m=[],g,x,b,_;if(o)for(_=0;_<a;_+=1)g=e[_],x=r(g,_),b=l.get(x).e,(b.f&33554432)===0&&(b.nodes?.a?.measure(),(c??=new Set).add(b));for(_=0;_<a;_+=1){if(g=e[_],x=r(g,_),b=l.get(x).e,t.outrogroups!==null)for(let T of t.outrogroups)T.pending.delete(b),T.done.delete(b);if((b.f&8192)!==0&&(Yr(b),o&&(b.nodes?.a?.unfix(),(c??=new Set).delete(b))),(b.f&33554432)!==0)if(b.f^=33554432,b===f)Go(b,null,n);else{var L=d?d.next:f;b===t.effect.last&&(t.effect.last=b.prev),b.prev&&(b.prev.next=b.next),b.next&&(b.next.prev=b.prev),Fi(t,d,b),Fi(t,b,L),Go(b,L,n),d=b,p=[],m=[],f=zo(d.next);continue}if(b!==f){if(u!==void 0&&u.has(b)){if(p.length<m.length){var y=m[0],N;d=y.prev;var S=p[0],E=p[p.length-1];for(N=0;N<p.length;N+=1)Go(p[N],y,n);for(N=0;N<m.length;N+=1)u.delete(m[N]);Fi(t,S.prev,E.next),Fi(t,d,S),Fi(t,E,y),f=y,d=E,_-=1,p=[],m=[]}else u.delete(b),Go(b,f,n),Fi(t,b.prev,b.next),Fi(t,b,d===null?t.effect.first:d.next),Fi(t,d,b),d=b;continue}for(p=[],m=[];f!==null&&f!==b;)(u??=new Set).add(f),m.push(f),f=zo(f.next);if(f===null)continue}(b.f&33554432)===0&&p.push(b),d=b,f=zo(b.next)}if(t.outrogroups!==null){for(let T of t.outrogroups)T.pending.size===0&&(cl(t,Cr(T.done)),t.outrogroups?.delete(T));t.outrogroups.size===0&&(t.outrogroups=null)}if(f!==null||u!==void 0){var h=[];if(u!==void 0)for(b of u)(b.f&8192)===0&&h.push(b);for(;f!==null;)(f.f&8192)===0&&f!==t.fallback&&h.push(f),f=zo(f.next);var w=h.length;if(w>0){var A=(i&4)!==0&&a===0?n:null;if(o){for(_=0;_<w;_+=1)h[_].nodes?.a?.measure();for(_=0;_<w;_+=1)h[_].nodes?.a?.fix()}Nh(t,h,A)}}o&&kt(()=>{if(c!==void 0)for(b of c)b.nodes?.a?.apply()})}function Ch(t,e,n,i,r,o,a,l){var f=(a&1)!==0?(a&16)===0?tr(n,!1,!1):Qt(n):null,u=(a&2)!==0?Qt(r):null;return H&&f&&(f.trace=()=>{l()[u?.v??r]}),{v:f,i:u,e:dt(()=>(o(e,f??n,u??r,l),()=>{t.delete(i)}))}}function Go(t,e,n){if(t.nodes)for(var i=t.nodes.start,r=t.nodes.end,o=e&&(e.f&33554432)===0?e.nodes.start:n;i!==null;){var a=Lt(i);if(o.before(i),i===r)return;i=a}}function Fi(t,e,n){e===null?t.effect.first=n:e.next=n,n===null?t.effect.last=e:n.prev=e}function Dh(t,e){let n=new Map,i=t.length;for(let r=0;r<i;r++){let o=e(t[r],r);if(n.has(o)){let a=String(n.get(o)),l=String(r),f=String(o);f.startsWith("[object ")&&(f=null),Ma(a,l,f)}n.set(o,r)}}function Th(t,e,n){if(!e||e===Ec(String(n??"")))return;let i,r=t.__svelte_meta?.loc;r?i=`near ${r.file}:${r.line}:${r.column}`:pn?.[tn]&&(i=`in ${pn[tn]}`),$f(Rs(i))}function cr(t,e,n=!1,i=!1,r=!1,o=!1){var a=t,l="";if(n){var f=t;le&&(a=Me(Qe(f)))}X(()=>{var u=ae;if(l===(l=e()??"")){le&&At();return}if(n&&!le){u.nodes=null,f.innerHTML=l,l!==""&&Ft(Qe(f),f.lastChild);return}if(u.nodes!==null&&(ol(u.nodes.start,u.nodes.end),u.nodes=null),l!==""){if(le){for(var d=_e.data,c=At(),p=c;c!==null&&(c.nodeType!==un||c.data!=="");)p=c,c=Lt(c);if(c===null)throw Ni(),qn;H&&!o&&Th(c.parentNode,d,l),Ft(_e,p),a=Me(c);return}var m=i?So:r?Ia:void 0,g=ri(i?"svg":r?"math":"template",m);g.innerHTML=l;var x=i||r?g:g.content;if(Ft(Qe(x),x.lastChild),i||r)for(;Qe(x);)a.before(Qe(x));else a.before(x)}})}function lt(t,e){var n=void 0,i;il(()=>{n!==(n=e())&&(i&&(tt(i),i=null),n&&(i=dt(()=>{yn(()=>n(t))})))})}function Cc(t){var e,n,i="";if(typeof t=="string"||typeof t=="number")i+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=Cc(t[e]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}function Dc(){for(var t,e,n=0,i="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=Cc(t))&&(i&&(i+=" "),i+=e);return i}function ln(t){return typeof t=="object"?Dc(t):t??""}var Tc=[...` 	
\r\f\xA0\v\uFEFF`];function Mc(t,e,n){var i=t==null?"":""+t;if(e&&(i=i?i+" "+e:e),n){for(var r of Object.keys(n))if(n[r])i=i?i+" "+r:r;else if(i.length)for(var o=r.length,a=0;(a=i.indexOf(r,a))>=0;){var l=a+o;(a===0||Tc.includes(i[a-1]))&&(l===i.length||Tc.includes(i[l]))?i=(a===0?"":i.substring(0,a))+i.substring(l+1):a=l}}return i===""?null:i}function Fc(t,e=!1){var n=e?" !important;":";",i="";for(var r of Object.keys(t)){var o=t[r];o!=null&&o!==""&&(i+=" "+r+": "+o+n)}return i}function ul(t){return t[0]!=="-"||t[1]!=="-"?t.toLowerCase():t}function Hc(t,e){if(e){var n="",i,r;if(Array.isArray(e)?(i=e[0],r=e[1]):i=e,t){t=String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var o=!1,a=0,l=!1,f=[];i&&f.push(...Object.keys(i).map(ul)),r&&f.push(...Object.keys(r).map(ul));var u=0,d=-1;let x=t.length;for(var c=0;c<x;c++){var p=t[c];if(l?p==="/"&&t[c-1]==="*"&&(l=!1):o?o===p&&(o=!1):p==="/"&&t[c+1]==="*"?l=!0:p==='"'||p==="'"?o=p:p==="("?a++:p===")"&&a--,!l&&o===!1&&a===0){if(p===":"&&d===-1)d=c;else if(p===";"||c===x-1){if(d!==-1){var m=ul(t.substring(u,d).trim());if(!f.includes(m)){p!==";"&&c++;var g=t.substring(u,c).trim();n+=" "+g+";"}}u=c+1,d=-1}}}}return i&&(n+=Fc(i)),r&&(n+=Fc(r,!0)),n=n.trim(),n===""?null:n}return t==null?null:String(t)}function Ie(t,e,n,i,r,o){var a=t[Io];if(le||a!==n||a===void 0){var l=Mc(n,i,o);(!le||l!==t.getAttribute("class"))&&(l==null?t.removeAttribute("class"):e?t.className=l:t.setAttribute("class",l)),t[Io]=n}else if(o&&r!==o)for(var f in o){var u=!!o[f];(r==null||u!==!!r[f])&&t.classList.toggle(f,u)}return o}function pl(t,e={},n,i){for(var r in n){var o=n[r];e[r]!==o&&(n[r]==null?t.style.removeProperty(r):t.style.setProperty(r,o,i))}}function Q(t,e,n,i){var r=t[No];if(le||r!==e){var o=Hc(e,i);(!le||o!==t.getAttribute("style"))&&(o==null?t.removeAttribute("style"):t.style.cssText=o),t[No]=e}else i&&(Array.isArray(i)?(pl(t,n?.[0],i[0]),pl(t,n?.[1],i[1],"important")):pl(t,n,i));return i}var jh=Symbol("is custom element"),Uh=Symbol("is html"),Wh=Fa?"link":"LINK";function W(t,e,n,i){var r=zh(t);if(le&&(r[e]=t.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&t.nodeName===Wh)){i||Qh(t,e,n??"");return}r[e]!==(r[e]=n)&&(e==="loading"&&(t[af]=n),n==null?t.removeAttribute(e):typeof n!="string"&&Gh(t).includes(e)?t[e]=n:t.setAttribute(e,n))}function zh(t){return t[ms]??={[jh]:t.nodeName.includes("-"),[Uh]:t.namespaceURI===fs}}var Bc=new Map;function Gh(t){var e=t.getAttribute("is")||t.nodeName,n=Bc.get(e);if(n)return n;Bc.set(e,n=[]);for(var i,r=t,o=Element.prototype;o!==r;){i=$a(r);for(var a in i)i[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&n.push(a);r=Dr(r)}return n}function Qh(t,e,n){H&&(e==="srcset"&&Vh(t,n)||hl(t.getAttribute(e)??"",n)||Nf(e,t.outerHTML.replace(t.innerHTML,t.innerHTML&&"..."),String(n)))}function hl(t,e){return t===e?!0:new URL(t,document.baseURI).href===new URL(e,document.baseURI).href}function Rc(t){return t.split(",").map(e=>e.trim().split(" ").filter(Boolean))}function Vh(t,e){var n=Rc(t.srcset),i=Rc(e);return i.length===n.length&&i.every(([r,o],a)=>o===n[a][1]&&(hl(n[a][0],r)||hl(r,n[a][0])))}var Jh={get(t,e){if(!t.exclude.has(e))return t.props[e]},set(t,e){return H&&wf(`${t.name}.${String(e)}`),!1},getOwnPropertyDescriptor(t,e){if(!t.exclude.has(e)&&e in t.props)return{enumerable:!0,configurable:!0,value:t.props[e]}},has(t,e){return t.exclude.has(e)?!1:e in t.props},ownKeys(t){return Reflect.ownKeys(t.props).filter(e=>!t.exclude.has(e))}};function ue(t,e,n){return new Proxy(H?{props:t,exclude:e,name:n}:{props:t,exclude:e},Jh)}function Oc(t){return new gl(t)}var gl=class{#e;#t;constructor(e){var n=new Map,i=(o,a)=>{var l=tr(a,!1,!1);return n.set(o,l),l};let r=new Proxy({...e.props||{},$$events:{}},{get(o,a){return s(n.get(a)??i(a,Reflect.get(o,a)))},has(o,a){return a===ps?!0:(s(n.get(a)??i(a,Reflect.get(o,a))),Reflect.has(o,a))},set(o,a,l){return oe(n.get(a)??i(a,l),l),Reflect.set(o,a,l)}});this.#t=(e.hydrate?fl:Jr)(e.component,{target:e.target,anchor:e.anchor,props:r,context:e.context,intro:e.intro??!1,recover:e.recover,transformError:e.transformError}),!gt&&(!e?.props?.$$host||e.sync===!1)&&Qr(),this.#e=r.$$events;for(let o of Object.keys(this.#t))o==="$set"||o==="$destroy"||o==="$on"||jt(this,o,{get(){return this.#t[o]},set(a){this.#t[o]=a},enumerable:!0});this.#t.$set=o=>{Object.assign(r,o)},this.#t.$destroy=()=>{Wo(this.#t)}}$set(e){this.#t.$set(e)}$on(e,n){this.#e[e]=this.#e[e]||[];let i=(...r)=>n.call(this,...r);return this.#e[e].push(i),()=>{this.#e[e]=this.#e[e].filter(r=>r!==i)}}$destroy(){this.#t.$destroy()}};var im;typeof HTMLElement=="function"&&(im=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(t,e,n){super(),this.$$ctor=t,this.$$s=e,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(t,e,n){if(this.$$l[t]=this.$$l[t]||[],this.$$l[t].push(e),this.$$c){let i=this.$$c.$on(t,e);this.$$l_u.set(e,i)}super.addEventListener(t,e,n)}removeEventListener(t,e,n){if(super.removeEventListener(t,e,n),this.$$c){let i=this.$$l_u.get(e);i&&(i(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let t=function(i){return r=>{let o=ri("slot");i!=="default"&&(o.name=i),D(r,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let e={},n=rm(this);for(let i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=t(i),e.default=!0):e[i]=t(i));for(let i of this.attributes){let r=this.$$g_p(i.name);r in this.$$d||(this.$$d[r]=vl(r,i.value,this.$$p_d,"toProp"))}for(let i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Oc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=nl(()=>{Jt(()=>{this.$$r=!0;for(let i of Na(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];let r=vl(i,this.$$d[i],this.$$p_d,"toAttribute");r==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,r)}this.$$r=!1})});for(let i in this.$$l)for(let r of this.$$l[i]){let o=this.$$c.$on(i,r);this.$$l_u.set(r,o)}this.$$l={}}}attributeChangedCallback(t,e,n){this.$$r||(t=this.$$g_p(t),this.$$d[t]=vl(t,n,this.$$p_d,"toProp"),this.$$c?.$set({[t]:this.$$d[t]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(t){return Na(this.$$p_d).find(e=>this.$$p_d[e].attribute===t||!this.$$p_d[e].attribute&&e.toLowerCase()===t)||t}});function vl(t,e,n,i){let r=n[t]?.type;if(e=r==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(r){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(r){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function rm(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var nt="--diff-font-size--",De="--diff-aside-width--";var di=()=>{let t=ce(!1);return ye(()=>{oe(t,!0)}),()=>s(t)};var Pc=Symbol("fontSize");function jc(t){Ye(Pc,()=>t.diffViewFontSize||14)}function qr(){return Ve(Pc)}var Uc=Symbol("enableWrap");function Wc(t){Ye(Uc,()=>t.diffViewWrap)}function En(){return Ve(Uc)}var zc=Symbol("renderWidget");function Gc(t){Ye(zc,()=>t.renderWidgetLine)}function Kr(){return Ve(zc)}var Qc=Symbol("id");function Vc(t){Ye(Qc,t)}function js(){return Ve(Qc)}var Yc=Symbol("dom");function Jc(t){Ye(Yc,t)}function Us(){return Ve(Yc)}var qc=Symbol("extend");function Kc(t){Ye(qc,()=>t.extendData)}function Xr(){return Ve(qc)}var Xc=Symbol("widget");function Zc(t){Ye(Xc,()=>t)}function An(){return Ve(Xc)}var eu=Symbol("renderExtendLine");function tu(t){Ye(eu,()=>t.renderExtendLine)}function Zr(){return Ve(eu)}var nu=Symbol("onAddWidgetClick");function iu(t){Ye(nu,()=>t.onAddWidgetClick)}function eo(){return Ve(nu)}var ru=Symbol("enableHighlight");function ou(t){Ye(ru,()=>t.diffViewHighlight)}function to(){return Ve(ru)}var su=Symbol("enableAddWidget");function au(t){Ye(su,()=>t.diffViewAddWidget)}function no(){return Ve(su)}var lu=Symbol("mode");function du(t){Ye(lu,()=>t.diffViewMode||Pt.Split)}function Ws(){return Ve(lu)}var _l=null,om=(t,e)=>`${t.fontFamily}-${t.fontStyle}-${t.fontSize}-${e}`,sm=(t,e)=>om(t,"0".repeat(e.length)),bl=class{#e="";#t={};#n(){return _l=_l||document.createElement("canvas").getContext("2d"),_l}measure(e,n){let i=sm(n||{},e);if(this.#t[i])return this.#t[i];let r=this.#n();if(n){let a=`${n.fontFamily}-${n.fontStyle}-${n.fontSize}`;this.#e!==a&&(this.#e=a,r.font=`${n.fontStyle||""} ${n.fontSize||""} ${n.fontFamily||""}`)}else r.font="";return r.measureText(e).width}},wl=null,fu=()=>(wl=wl||new bl,wl);var io=({text:t,font:e})=>{let n=k(di()),i=parseInt(e().fontSize||"14"),r=6;r+=i>10?(i-10)*.6:0;let o=ce(r*t().length);return ye(()=>{s(n)&&oe(o,fu().measure(t()||"",e()),!0)}),()=>s(o)};var Ln=()=>{window.getSelection()?.removeAllRanges()},cu=(t,e)=>{let n=function(i){i===null||i.target===null||(i.target===t?(e.scrollTop=t.scrollTop,e.scrollLeft=t.scrollLeft):(t.scrollTop=e.scrollTop,t.scrollLeft=e.scrollLeft))};return t.onscroll||(t.onscroll=n),e.onscroll||(e.onscroll=n),()=>{t.onscroll=null,e.onscroll=null}},zs=t=>{if(t){let e=t.getRootNode();return e instanceof ShadowRoot?e:t.ownerDocument}return document},ro=t=>{if(t){if(typeof t.closest=="function")return t.closest('[data-component="git-diff-view"]')?.querySelector?.(".diff-view-wrapper")?.getAttribute?.("id");{let e=t;for(;e;){if(e.getAttribute&&e.getAttribute("data-component")==="git-diff-view")return e.querySelector(".diff-view-wrapper")?.getAttribute("id");e=e.parentElement}}}};var xl="--diff-add-content--",yl="--diff-del-content--",gn="--diff-border--",El="--diff-add-lineNumber--",Al="--diff-del-lineNumber--",Ll="--diff-plain-content--",Gs="--diff-expand-content--",ft="--diff-plain-lineNumber-color--",ur="--diff-expand-lineNumber-color--",kl="--diff-plain-lineNumber--",am="--diff-expand-lineNumber--",dn="--diff-hunk-content--",Pn="--diff-hunk-content-color--",jn="--diff-hunk-lineNumber--";var Qs="--diff-add-widget--",Vs="--diff-add-widget-color--",Xt="--diff-empty-content--",Qo=(t,e,n)=>t?`var(${xl})`:e?`var(${yl})`:n?`var(${Ll})`:`var(${Gs})`,Vo=(t,e,n)=>t?`var(${El})`:e?`var(${Al})`:n?`var(${kl})`:`var(${am})`;var lm=new Set(["$$slots","$$events","$$legacy"]),dm=O('<div><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Mi(t,e){de(e,!0);let n=ue(e,lm);var i=dm(),r=C(i);$(i),X(()=>{W(i,"data-add-widget",R[e.side]),Ie(i,1,"diff-add-widget-wrapper invisible select-none transition-transform hover:scale-110 group-hover:visible"+(e.className?" "+e.className:"")),Q(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),Q(r,`
			color: var(${Vs});
			background-color: var(${Qs});
    `)}),be("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),D(t,i),fe()}rt(["mousedown"]);Ff();var fm=yi('<svg aria-label="No newline at end of file" role="img" viewBox="0 0 16 16" version="1.1" fill="currentColor"><path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>');function Yo(t){var e=fm();D(t,e)}var cm=new Set(["$$slots","$$events","$$legacy"]),um=O('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),pm=O('<span class="diff-line-content-raw"><span data-template=""></span><!></span>'),uu=O('<span class="diff-line-content-raw"> </span>'),hm=O('<span class="diff-line-content-raw"><span data-template=""></span></span>');function Jo(t,e){de(e,!0);let n=ue(e,cm);e.diffLine?.changes?.hasLineChange?e.diffLine?.plainTemplate&&typeof Eo=="function"&&Eo({diffLine:e.diffLine,rawLine:e.rawLine,operator:e.operator||"add"}):e.plainLine&&!e.plainLine?.template&&(e.plainLine.template=ya(e.plainLine.value));var r=pe(),o=ne(r);{var a=u=>{var d=pe(),c=ne(d);{var p=g=>{var x=pm(),b=C(x);cr(b,()=>e.diffLine.plainTemplate,!0),$(b);var _=K(b);{var L=y=>{var N=um(),S=C(N);Yo(S,{}),$(N),X(()=>{Ie(N,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),Q(N,`
						width: var(${nt});
						height: var(${nt})
					`)}),D(y,N)};Y(_,y=>{e.diffLine.changes.newLineSymbol===$r.NEWLINE&&y(L)})}$(x),D(g,x)},m=g=>{var x=uu(),b=C(x,!0);$(x),X(()=>Ce(b,e.rawLine)),D(g,x)};Y(c,g=>{e.diffLine?.plainTemplate?g(p):g(m,-1)})}D(u,d)},l=u=>{var d=hm(),c=C(d);cr(c,()=>e.plainLine.template,!0),$(c),$(d),D(u,d)},f=u=>{var d=uu(),c=C(d,!0);$(d),X(()=>Ce(c,e.rawLine)),D(u,d)};Y(o,u=>{e.diffLine?.changes?.hasLineChange?u(a):e.plainLine?.template?u(l,1):u(f,-1)})}D(t,r),fe()}var mm=new Set(["$$slots","$$events","$$legacy"]),gm=O('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),vm=O('<span class="diff-line-syntax-raw"><span data-template=""></span><!></span>'),pu=O("<span> </span>"),hu=O('<span class="diff-line-syntax-raw"></span>'),_m=O('<span class="diff-line-syntax-raw"><span data-template=""></span></span>');function Sl(t,e){de(e,!0);let n=ue(e,mm);e.diffLine?.changes?.hasLineChange?e.syntaxLine&&e.diffLine&&!e.diffLine?.syntaxTemplate&&typeof Ao=="function"&&Ao({diffFile:e.diffFile,diffLine:e.diffLine,syntaxLine:e.syntaxLine,operator:e.operator||"add"}):e.syntaxLine&&!e.syntaxLine.template&&(e.syntaxLine.template=xa(e.syntaxLine));var r=pe(),o=ne(r);{var a=d=>{Jo(d,{get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get operator(){return e.operator},get enableWrap(){return e.enableWrap}})},l=d=>{var c=pe(),p=ne(c);{var m=x=>{var b=vm(),_=C(b);cr(_,()=>e.diffLine.syntaxTemplate,!0),$(_);var L=K(_);{var y=N=>{var S=gm(),E=C(S);Yo(E,{}),$(S),X(()=>{Ie(S,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),Q(S,`
                width: var(${nt});
                height: var(${nt});
              `)}),D(N,S)};Y(L,N=>{e.diffLine.changes.newLineSymbol===$r.NEWLINE&&N(y)})}$(b),D(x,b)},g=x=>{var b=hu();li(b,21,()=>e.syntaxLine.nodeList,ai,(_,L)=>{let y=()=>s(L).node,N=()=>s(L).wrapper;var S=pu(),E=C(S,!0);$(S),X(h=>{W(S,"data-start",y().startIndex),W(S,"data-end",y().endIndex),Ie(S,1,h),Q(S,N()?.properties?.style),Ce(E,y().value)},[()=>ln(N()?.properties?.className?.join(" "))]),D(_,S)}),$(b),D(x,b)};Y(p,x=>{e.diffLine?.syntaxTemplate?x(m):x(g,-1)})}D(d,c)},f=d=>{var c=_m(),p=C(c);cr(p,()=>e.syntaxLine.template,!0),$(p),$(c),D(d,c)},u=d=>{var c=hu();li(c,21,()=>e.syntaxLine.nodeList,ai,(p,m)=>{let g=()=>s(m).node,x=()=>s(m).wrapper;var b=pu(),_=C(b,!0);$(b),X(L=>{W(b,"data-start",g().startIndex),W(b,"data-end",g().endIndex),Ie(b,1,L),Q(b,x()?.properties?.style),Ce(_,g().value)},[()=>ln(x()?.properties?.className?.join(" "))]),D(p,b)}),$(c),D(d,c)};Y(o,d=>{e.syntaxLine?e.diffLine?.changes?.hasLineChange?d(l,1):e.syntaxLine.template?d(f,2):d(u,-1):d(a)})}D(t,r),fe()}var wm=new Set(["$$slots","$$events","$$legacy"]),bm=O('<div class="diff-line-content-item pl-[2.0em]"><span class="diff-line-content-operator ml-[-1.5em] inline-block w-[1.5em] select-none indent-[0.2em]"> </span> <!></div>');function fi(t,e){de(e,!0);let n=ue(e,wm),i=k(()=>e.diffLine?.type===He.Add),r=k(()=>e.diffLine?.type===He.Delete),o=k(()=>e.syntaxLine&&e.syntaxLine?.nodeList?.length>150);var a=bm(),l=C(a),f=C(l,!0);$(l);var u=K(l,2);{var d=p=>{{let m=k(()=>s(i)?"add":s(r)?"del":void 0);Sl(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffFile(){return e.diffFile},get diffLine(){return e.diffLine},get syntaxLine(){return e.syntaxLine},get enableWrap(){return e.enableWrap}})}},c=p=>{{let m=k(()=>s(i)?"add":s(r)?"del":void 0);Jo(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get plainLine(){return e.plainLine},get enableWrap(){return e.enableWrap}})}};Y(u,p=>{e.enableHighlight&&e.syntaxLine&&!s(o)?p(d):p(c,-1)})}$(a),X(()=>{Q(a,`
		white-space: ${e.enableWrap?"pre-wrap":"pre"};
		word-break: ${e.enableWrap?"break-all":"initial"}
	`),W(l,"data-operator",s(i)?"+":s(r)?"-":void 0),Ce(f,s(i)?"+":s(r)?"-":" ")}),D(t,a),fe()}var xm=new Set(["$$slots","$$events","$$legacy"]),ym=O('<td class="diff-line-old-num group relative w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-old-content group relative pr-[10px] align-top"><!> <!></td>',1),Em=O('<td class="diff-line-old-placeholder select-none"><span>&ensp;</span></td>'),Am=O('<td class="diff-line-new-num group relative w-[1%] min-w-[40px] select-none border-l-[1px] pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-new-content group relative pr-[10px] align-top"><!> <!></td>',1),Lm=O('<td class="diff-line-new-placeholder select-none border-l-[1px]"><span>&ensp;</span></td>'),km=O('<tr class="diff-line"><!><!></tr>');function Il(t,e){de(e,!0);let n=ue(e,xm),i=k(An()),r=k(no()),o=k(to()),a=k(eo()),l=k(()=>e.diffFile.getSplitLeftLine(e.index)),f=k(()=>e.diffFile.getSplitRightLine(e.index)),u=()=>e.diffFile.getOldSyntaxLine(s(l)?.lineNumber||0),d=()=>e.diffFile.getNewSyntaxLine(s(f)?.lineNumber||0),c=()=>e.diffFile.getOldPlainLine(s(l)?.lineNumber||0),p=()=>e.diffFile.getNewPlainLine(s(f)?.lineNumber||0),m=ce(Le(u())),g=ce(Le(d())),x=ce(Le(c())),b=ce(Le(p())),_=k(()=>!!s(l)?.diff||!!s(f)?.diff),L=k(()=>Ki(s(l)?.diff)||Ki(s(f)?.diff)),y=k(()=>s(l)?.isHidden&&s(f)?.isHidden),N=()=>s(l)?.diff?.type===He.Delete,S=()=>s(f)?.diff?.type===He.Add,E=()=>{oe(m,u(),!0),oe(g,d(),!0),oe(x,c(),!0),oe(b,p(),!0)},h={current:()=>{}};ye(()=>{h.current(),E(),h.current=e.diffFile.subscribe(E)}),ze(()=>h.current());let w=(U,P)=>{s(i).side=P,s(i).lineNumber=U};var A=pe(),T=ne(A);{var M=U=>{var P=km(),J=C(P);{var ee=j=>{var z=ym(),B=ne(z),he=C(B);{var ie=ge=>{{let ke=k(()=>s(l)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:w})}};Y(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Z=K(he,2),ve=C(Z,!0);$(Z),$(B);var se=K(B,2),te=C(se);{var xe=ge=>{{let ke=k(()=>s(l)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:w})}};Y(te,ge=>{s(_)&&s(r)&&ge(xe)})}var Ee=K(te,2);{let ge=k(()=>s(l)?.value||""),ke=k(()=>s(l)?.diff),Oe=k(()=>!!s(o));fi(Ee,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(x)},get syntaxLine(){return s(m)},get enableHighlight(){return s(Oe)}})}$(se),X((ge,ke)=>{Q(B,ge),W(B,"data-side",R[R.old]),W(Z,"data-line-num",s(l)?.lineNumber),Q(Z,`opacity: ${s(L)?void 0:.5} `),Ce(ve,s(l)?.lineNumber),Q(se,ke),W(se,"data-side",R[R.old])},[()=>`
					background-color: ${Vo(!1,N(),s(_))};
					color: var(${s(_)?ft:ur})
				`,()=>` background-color: ${Qo(!1,N(),s(_))} `]),D(j,z)},re=j=>{var z=Em();W(z,"colspan",2),X(()=>Q(z,`background-color: var(${Xt}) `)),D(j,z)};Y(J,j=>{s(l)?.lineNumber?j(ee):j(re,-1)})}var q=K(J);{var F=j=>{var z=Am(),B=ne(z),he=C(B);{var ie=ge=>{{let ke=k(()=>s(f)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:w})}};Y(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Z=K(he,2),ve=C(Z,!0);$(Z),$(B);var se=K(B,2),te=C(se);{var xe=ge=>{{let ke=k(()=>s(f)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:w})}};Y(te,ge=>{s(_)&&s(r)&&ge(xe)})}var Ee=K(te,2);{let ge=k(()=>s(f)?.value||""),ke=k(()=>s(f)?.diff),Oe=k(()=>!!s(o));fi(Ee,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(b)},get syntaxLine(){return s(g)},get enableHighlight(){return s(Oe)}})}$(se),X((ge,ke)=>{Q(B,ge),W(B,"data-side",R[R.new]),W(Z,"data-line-num",s(f)?.lineNumber),Q(Z,` opacity: ${s(L)?void 0:.5} `),Ce(ve,s(f)?.lineNumber),Q(se,ke),W(se,"data-side",R[R.new])},[()=>`
					background-color: ${Vo(S(),!1,s(_))};
					color: var(${s(_)?ft:ur});
					border-left-color: var(${gn});
					border-left-style: solid
				`,()=>`background-color: ${Qo(S(),!1,s(_))} `]),D(j,z)},V=j=>{var z=Lm();W(z,"colspan",2),X(()=>Q(z,`
					background-color: var(${Xt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(j,z)};Y(q,j=>{s(f)?.lineNumber?j(F):j(V,-1)})}$(P),X(()=>{W(P,"data-line",e.lineNumber),W(P,"data-state",s(_)?"diff":"plain")}),D(U,P)};Y(T,U=>{s(y)||U(M)})}D(t,A),fe()}var Sm=new Set(["$$slots","$$events","$$legacy"]),Im=O('<td class="diff-line-extend-old-content p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),Nm=O('<td class="diff-line-extend-old-placeholder select-none p-0"></td>'),$m=O('<td class="diff-line-extend-new-content border-l-[1px] p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),Cm=O('<td class="diff-line-extend-new-placeholder select-none border-l-[1px] p-0"></td>'),Dm=O('<tr data-state="extend" class="diff-line diff-line-extend"><!><!></tr>');function Nl(t,e){de(e,!0);let n=ue(e,Sm),i=k(Xr()),r=k(Zr()),o=k(()=>e.diffFile.getSplitLeftLine(e.index)),a=k(()=>e.diffFile.getSplitRightLine(e.index)),l=k(()=>e.diffFile.getExpandEnabled()),f=k(()=>s(i)?.oldFile?.[s(o)?.lineNumber||""]),u=k(()=>s(i)?.newFile?.[s(a)?.lineNumber||""]),d=k(()=>!!((s(f)||s(u))&&(!s(o)?.isHidden&&!s(a)?.isHidden||s(l))&&s(r)));var c=pe(),p=ne(c);{var m=g=>{var x=Dm(),b=C(x);{var _=E=>{var h=Im();W(h,"colspan",2);var w=C(h),A=C(w);Mt(A,()=>s(r),()=>({diffFile:e.diffFile,side:R.old,lineNumber:s(o)?.lineNumber||0,data:s(f)?.data,onUpdate:e.diffFile.notifyAll})),$(w),$(h),D(E,h)},L=E=>{var h=Nm();W(h,"colspan",2),X(()=>Q(h,`background-color: var(${Xt})`)),D(E,h)};Y(b,E=>{s(r)&&s(f)?E(_):E(L,-1)})}var y=K(b);{var N=E=>{var h=$m();W(h,"colspan",2);var w=C(h),A=C(w);Mt(A,()=>s(r),()=>({diffFile:e.diffFile,side:R.new,lineNumber:s(a)?.lineNumber||0,data:s(u)?.data,onUpdate:e.diffFile.notifyAll})),$(w),$(h),X(()=>Q(h,`border-left-color: var(${gn}); border-left-style: solid `)),D(E,h)},S=E=>{var h=Cm();W(h,"colspan",2),X(()=>Q(h,`
					background-color: var(${Xt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(E,h)};Y(y,E=>{s(r)&&s(u)?E(N):E(S,-1)})}$(x),X(()=>W(x,"data-line",`${e.lineNumber}-extend`)),D(g,x)};Y(p,g=>{s(d)&&g(m)})}D(t,c),fe()}var Tm=new Set(["$$slots","$$events","$$legacy"]),Fm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M7.823 1.677 4.927 4.573A.25.25 0 0 0 5.104 5H7.25v3.236a.75.75 0 1 0 1.5 0V5h2.146a.25.25 0 0 0 .177-.427L8.177 1.677a.25.25 0 0 0-.354 0ZM13.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-3.75.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM7.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM4 11.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM1.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"></path></svg>');function Nt(t,e){de(e,!0);let n=ue(e,Tm);var i=Fm();X(()=>Ie(i,0,ln(e.className))),D(t,i),fe()}var Mm=new Set(["$$slots","$$events","$$legacy"]),Hm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177 14.323 2.896-2.896a.25.25 0 0 0-.177-.427H8.75V7.764a.75.75 0 1 0-1.5 0V11H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0ZM2.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM8.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function $t(t,e){de(e,!0);let n=ue(e,Mm);var i=Hm();X(()=>Ie(i,0,ln(e.className))),D(t,i),fe()}var Bm=new Set(["$$slots","$$events","$$legacy"]),Rm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function kn(t,e){de(e,!0);let n=ue(e,Bm);var i=Rm();X(()=>Ie(i,0,ln(e.className))),D(t,i),fe()}var Om=new Set(["$$slots","$$events","$$legacy"]),Pm=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),jm=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Um=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Wm=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),zm=O('<div class="min-h-[28px]">&ensp;</div>'),Gm=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function $l(t,e){de(e,!0);let n=ue(e,Om),i=k(()=>e.diffFile.getSplitHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)?.splitInfo),a=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},l=ce(Le(a())),f=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(f())),d=k(()=>{let _=s(i);return _&&_.isFirst}),c=k(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=k(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,f(),!0),oe(l,a(),!0)};_(),m.current=e.diffFile.subscribe(_)}),ze(()=>m.current());var g=pe(),x=ne(g);{var b=_=>{var L=Gm(),y=C(L),N=C(y);{var S=T=>{var M=pe(),U=ne(M);{var P=q=>{var F=Pm(),V=C(F);Nt(V,{className:"fill-current"}),$(F),be("click",F,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(q,F)},J=q=>{var F=jm(),V=C(F);$t(V,{className:"fill-current"}),$(F),be("click",F,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(q,F)},ee=q=>{var F=Um(),V=C(F);kn(V,{className:"fill-current"}),$(F),be("click",F,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(q,F)},re=q=>{var F=Wm(),V=ne(F),j=C(V);$t(j,{className:"fill-current"}),$(V);var z=K(V,2),B=C(z);Nt(B,{className:"fill-current"}),$(z),be("click",V,()=>e.diffFile.onSplitHunkExpand("down",e.index)),be("click",z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(q,F)};Y(U,q=>{s(d)?q(P):s(p)?q(J,1):s(l)?q(ee,2):q(re,-1)})}D(T,M)},E=T=>{var M=zm();D(T,M)};Y(N,T=>{s(o)?T(S):T(E,-1)})}$(y);var h=K(y);W(h,"colspan",3);var w=C(h),A=C(w,!0);$(w),$(h),$(L),X(()=>{W(L,"data-line",`${e.lineNumber}-hunk`),Q(y,`
				background-color: var(${jn});
				color: var(${ft})
			`),Q(h,`background-color: var(${dn})`),Q(w,`
					color: var(${Pn})
				`),Ce(A,s(i)?.splitInfo?.plainText||s(i)?.text)}),D(_,L)};Y(x,_=>{(s(u)||s(c))&&_(b)})}D(t,g),fe()}rt(["click"]);var Qm=new Set(["$$slots","$$events","$$legacy"]),mu=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),gu=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),vu=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),_u=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),wu=O('<div class="min-h-[28px]">&ensp;</div>'),Vm=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td><td class="diff-line-hunk-action relative z-[1] w-[1%] min-w-[40px] select-none border-l-[1px] p-[1px]"><!></td><td class="diff-line-hunk-content relative pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Cl(t,e){de(e,!0);let n=ue(e,Qm),i=k(()=>e.diffFile.getSplitHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)?.splitInfo),a=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},l=ce(Le(a())),f=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(f())),d=k(()=>{let _=s(i);return _&&_.isFirst}),c=k(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=k(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,f(),!0),oe(l,a(),!0)};_(),m.current=e.diffFile.subscribe(_)}),ze(()=>m.current());var g=pe(),x=ne(g);{var b=_=>{var L=Vm(),y=C(L),N=C(y);{var S=q=>{var F=pe(),V=ne(F);{var j=ie=>{var Z=mu(),ve=C(Z);Nt(ve,{className:"fill-current"}),$(Z),be("click",Z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)},z=ie=>{var Z=gu(),ve=C(Z);$t(ve,{className:"fill-current"}),$(Z),be("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(ie,Z)},B=ie=>{var Z=vu(),ve=C(Z);kn(ve,{className:"fill-current"}),$(Z),be("click",Z,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(ie,Z)},he=ie=>{var Z=_u(),ve=ne(Z),se=C(ve);$t(se,{className:"fill-current"}),$(ve);var te=K(ve,2),xe=C(te);Nt(xe,{className:"fill-current"}),$(te),be("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),be("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)};Y(V,ie=>{s(d)?ie(j):s(p)?ie(z,1):s(l)?ie(B,2):ie(he,-1)})}D(q,F)},E=q=>{var F=wu();D(q,F)};Y(N,q=>{s(o)?q(S):q(E,-1)})}$(y);var h=K(y),w=C(h),A=C(w,!0);$(w),$(h);var T=K(h),M=C(T);{var U=q=>{var F=pe(),V=ne(F);{var j=ie=>{var Z=mu(),ve=C(Z);Nt(ve,{className:"fill-current"}),$(Z),be("click",Z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)},z=ie=>{var Z=gu(),ve=C(Z);$t(ve,{className:"fill-current"}),$(Z),be("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(ie,Z)},B=ie=>{var Z=vu(),ve=C(Z);kn(ve,{className:"fill-current"}),$(Z),be("click",Z,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(ie,Z)},he=ie=>{var Z=_u(),ve=ne(Z),se=C(ve);$t(se,{className:"fill-current"}),$(ve);var te=K(ve,2),xe=C(te);Nt(xe,{className:"fill-current"}),$(te),be("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),be("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)};Y(V,ie=>{s(d)?ie(j):s(p)?ie(z,1):s(l)?ie(B,2):ie(he,-1)})}D(q,F)},P=q=>{var F=wu();D(q,F)};Y(M,q=>{s(o)?q(U):q(P,-1)})}$(T);var J=K(T),ee=C(J),re=C(ee,!0);$(ee),$(J),$(L),X(()=>{W(L,"data-line",`${e.lineNumber}-hunk`),Q(y,`
				background-color: var(${jn});
				color: var(${ft})
			`),Q(h,`background-color: var(${dn})`),Q(w,`
					color: var(${Pn})
				`),Ce(A,s(i)?.splitInfo?.plainText||s(i)?.text),Q(T,`
				background-color: var(${jn});
				color: var(${ft});
				border-left-color: var(${gn});
				border-left-style: solid
			`),Q(J,`background-color: var(${dn})`),Q(ee,`
					color: var(${Pn})
				`),Ce(re,s(i)?.splitInfo?.plainText||s(i)?.text)}),D(_,L)};Y(x,_=>{(s(u)||s(c))&&_(b)})}D(t,g),fe()}rt(["click"]);var Ym=new Set(["$$slots","$$events","$$legacy"]);function Ys(t,e){de(e,!0);let n=ue(e,Ym),i=k(Ws());var r=pe(),o=ne(r);{var a=f=>{$l(f,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=f=>{Cl(f,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};Y(o,f=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?f(a):f(l,-1)})}D(t,r),fe()}var Jm=new Set(["$$slots","$$events","$$legacy"]),qm=O('<td class="diff-line-widget-old-content p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Km=O('<td class="diff-line-widget-old-placeholder select-none p-0"></td>'),Xm=O('<td class="diff-line-widget-new-content border-l-[1px] p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Zm=O('<td class="diff-line-widget-new-placeholder select-none border-l-[1px] p-0"></td>'),eg=O('<tr data-state="widget" class="diff-line diff-line-widget"><!><!></tr>');function Dl(t,e){de(e,!0);let n=ue(e,Jm),i=k(Kr()),r=k(An()),o=k(()=>e.diffFile.getSplitLeftLine(e.index)),a=k(()=>e.diffFile.getSplitRightLine(e.index)),l=k(()=>s(o)?.lineNumber&&s(r)?.side===R.old&&s(r)?.lineNumber===s(o)?.lineNumber),f=k(()=>s(a)?.lineNumber&&s(r)?.side===R.new&&s(r)?.lineNumber===s(a)?.lineNumber),u=k(()=>(!!s(l)||!!s(f))&&!s(o)?.isHidden&&!s(a)?.isHidden&&!!s(i)),d=()=>{s(r).side=void 0,s(r).lineNumber=void 0};var c=pe(),p=ne(c);{var m=g=>{var x=eg(),b=C(x);{var _=E=>{var h=qm();W(h,"colspan",2);var w=C(h),A=C(w);Mt(A,()=>s(i),()=>({diffFile:e.diffFile,side:R.old,lineNumber:s(o)?.lineNumber||0,onClose:d})),$(w),$(h),D(E,h)},L=E=>{var h=Km();W(h,"colspan",2),X(()=>Q(h,`background-color: var(${Xt})`)),D(E,h)};Y(b,E=>{s(l)&&s(i)?E(_):E(L,-1)})}var y=K(b);{var N=E=>{var h=Xm();W(h,"colspan",2);var w=C(h),A=C(w);Mt(A,()=>s(i)??ht,()=>({diffFile:e.diffFile,side:R.new,lineNumber:s(a)?.lineNumber||0,onClose:d})),$(w),$(h),X(()=>Q(h,`border-left-color: var(${gn}); border-left-style: solid `)),D(E,h)},S=E=>{var h=Zm();W(h,"colspan",2),X(()=>Q(h,`
					background-color: var(${Xt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(E,h)};Y(y,E=>{s(f)&&s(i)?E(N):E(S,-1)})}$(x),X(()=>W(x,"data-line",`${e.lineNumber}-widget`)),D(g,x)};Y(p,g=>{s(u)&&g(m)})}D(t,c),fe()}var tg=new Set(["$$slots","$$events","$$legacy"]),ng=O("<!> <!> <!> <!>",1),ig=O('<div class="split-diff-view split-diff-view-warp w-full"><div class="diff-table-wrapper w-full"><style data-select-style=""></style> <table class="diff-table w-full table-fixed border-collapse border-spacing-0"><colgroup><col class="diff-table-old-num-col"/><col class="diff-table-old-content-col"/><col class="diff-table-new-num-col"/><col class="diff-table-new-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">old line number</th><th scope="col">old line content</th><th scope="col">new line number</th><th scope="col">new line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Tl(t,e){de(e,!0);let n=ue(e,tg),i=()=>as(e.diffFile),r=ce(Le(i())),o={current:void 0},a=ce(void 0),l=k(()=>Math.max(e.diffFile.splitLineLength,e.diffFile.fileLineLength).toString()),f=k(qr()),u=k(()=>({fontSize:`${s(f)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),d={current:()=>{}};ye(()=>{d.current();let A=()=>oe(r,i(),!0);A(),d.current=e.diffFile.subscribe(A)}),ze(()=>d.current());let c=A=>{let T=s(a);if(T)if(A){let M=A===R.old?R.new:R.old;T.textContent=`#diff-root${e.diffFile.getId()} [data-side="${R[M]}"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="extend"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="hunk"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="widget"] {user-select: none}`}else T.textContent=""},p=A=>{let T=A.target;if(T&&T instanceof HTMLElement&&T.nodeName==="BUTTON"){Ln();return}let M=ro(T);if(!(M&&M!==`diff-root${e.diffFile.getId()}`))for(;T&&T instanceof HTMLElement;){let U=T.getAttribute("data-state"),P=T.getAttribute("data-side");if(P&&o.current!==R[P]&&(o.current=R[P],c(R[P]),Ln()),U)if(U==="extend"||U==="hunk"||U==="widget"){o.current!==void 0&&(o.current=void 0,c(void 0),Ln());return}else return;T=T.parentElement}},m=k(io({text:()=>s(l),font:()=>s(u)})),g=k(()=>Math.max(40,s(m)+25));var x=ig(),b=C(x),_=C(b);lt(_,()=>A=>oe(a,A,!0));var L=K(_,2),y=C(L),N=C(y),S=K(N,2);Xi(),$(y);var E=K(y,2),h=C(E);li(h,17,()=>s(r),ai,(A,T)=>{var M=ng(),U=ne(M);Ys(U,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}});var P=K(U,2);Il(P,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}});var J=K(P,2);Dl(J,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}});var ee=K(J,2);Nl(ee,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}}),D(A,M)});var w=K(h);Ys(w,{get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),$(E),$(L),$(b),$(x),X((A,T,M)=>{Q(b,A),W(N,"width",T),W(S,"width",M)},[()=>`
			${De}: ${Math.round(s(g))}px;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`,()=>Math.round(s(g)),()=>Math.round(s(g))]),be("mousedown",E,p),D(t,x),fe()}rt(["mousedown"]);var rg=new Set(["$$slots","$$events","$$legacy"]),og=O("<td><!> <span> </span></td> <td><!></td>",1),sg=O("<td><span>&ensp;</span></td>"),ag=O("<tr><!></tr>");function Fl(t,e){de(e,!0);let n=ue(e,rg),i=k(An()),r=k(no()),o=k(to()),a=k(eo()),l=k(()=>e.side===R.old?e.diffFile.getSplitLeftLine(e.index):e.diffFile.getSplitRightLine(e.index)),f=k(()=>!!s(l)?.diff),u=k(()=>Ki(s(l)?.diff)),d=k(()=>s(l)?.isHidden),c=k(()=>!!s(l)?.lineNumber),p=()=>e.side===R.old?e.diffFile.getOldSyntaxLine(s(l)?.lineNumber||0):e.diffFile.getNewSyntaxLine(s(l)?.lineNumber||0),m=()=>e.side===R.old?e.diffFile.getOldPlainLine(s(l)?.lineNumber||0):e.diffFile.getNewPlainLine(s(l)?.lineNumber||0),g=ce(Le(p())),x=ce(Le(m())),b=()=>{oe(g,p(),!0),oe(x,m(),!0)},_={current:()=>{}};ye(()=>{_.current(),b(),_.current=e.diffFile.subscribe(b)}),ze(()=>_.current());let L=(w,A)=>{s(i).side=A,s(i).lineNumber=w},y=()=>s(l)?.diff?.type===He.Add,N=()=>s(l)?.diff?.type===He.Delete;var S=pe(),E=ne(S);{var h=w=>{var A=ag(),T=C(A);{var M=P=>{var J=og(),ee=ne(J),re=C(ee);{var q=B=>{{let he=k(()=>s(l)?.lineNumber||0);Mi(B,{get index(){return e.index},get lineNumber(){return s(he)},get side(){return e.side},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:L})}};Y(re,B=>{s(f)&&s(r)&&B(q)})}var F=K(re,2),V=C(F,!0);$(F),$(ee);var j=K(ee,2),z=C(j);{let B=k(()=>s(l)?.value||""),he=k(()=>s(l)?.diff),ie=k(()=>!!s(o));fi(z,{enableWrap:!1,get diffFile(){return e.diffFile},get rawLine(){return s(B)},get diffLine(){return s(he)},get plainLine(){return s(x)},get syntaxLine(){return s(g)},get enableHighlight(){return s(ie)}})}$(j),X((B,he)=>{Ie(ee,1,`diff-line-${R[e.side]}-num sticky left-0 z-[1] w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top`),Q(ee,B),W(F,"data-line-num",s(l)?.lineNumber),Q(F,` opacity: ${s(u)?void 0:.5} `),Ce(V,s(l)?.lineNumber),Ie(j,1,`diff-line-${R[e.side]}-content pr-[10px] align-top`),Q(j,he)},[()=>`
					background-color: ${Vo(y(),N(),s(f))};
					color: var(${s(f)?ft:ur});
					width: var(${De});
					min-width: var(${De});
					max-width: var(${De})
				`,()=>` background-color: ${Qo(y(),N(),s(f))} `]),D(P,J)},U=P=>{var J=sg();W(J,"colspan",2),X(()=>{Ie(J,1,`diff-line-${R[e.side]}-placeholder select-none`),Q(J,`background-color: var(${Xt}) `)}),D(P,J)};Y(T,P=>{s(c)?P(M):P(U,-1)})}$(A),X(()=>{W(A,"data-line",e.lineNumber),W(A,"data-state",s(f)||!s(c)?"diff":"plain"),W(A,"data-side",R[e.side]),Ie(A,1,"diff-line"+(s(c)?" group":""))}),D(w,A)};Y(E,w=>{s(d)||w(h)})}D(t,S),fe()}var Hi=({selector:t,enable:e})=>{let n=k(js()),i=k(Us()),r=k(di()),o=ce(0),a={current:()=>{}},l=()=>{if(s(r)&&e()){let d=zs(s(i)).querySelector(`#diff-root${s(n)}`)?.querySelector(t());if(!d)return;let c=d,p=()=>{let x=d?.getBoundingClientRect();oe(o,x?.width??0,!0)};p();let m=()=>{c?.__observeCallback?.delete(p),c?.__observeCallback?.size===0&&(c.__observeInstance?.disconnect(),c.removeAttribute("data-observe"),delete c.__observeCallback,delete c.__observeInstance)};if(c.__observeCallback){c.__observeCallback.add(p),a.current=()=>m();return}c.__observeCallback=new Set,c.__observeCallback.add(p);let g=new ResizeObserver(()=>c?.__observeCallback?.forEach(x=>x()));c.__observeInstance=g,g.observe(c),c.setAttribute("data-observe","height"),a.current=()=>m()}};return ye(()=>(l(),()=>a.current?.())),()=>s(o)};var Bi=({selector:t,wrapper:e,side:n,enable:i})=>{let r=k(js()),o=k(Us()),a=k(di()),l={current:()=>{}},f=()=>{if(s(a)&&i()){let u=()=>{},c=zs(s(o)).querySelector(`#diff-root${s(r)}`),p=Array.from(c?.querySelectorAll(t())||[]),m=e()?Array.from(c?.querySelectorAll(e())||[]):p;if(p.length===2&&m.length===2){let g=p[0],x=p[1],b=m[0],_=m[1],L=g.getAttribute("data-side")===n()?g:x,y=L,N=()=>{g.style.height="auto",x.style.height="auto";let h=g.getBoundingClientRect(),w=x.getBoundingClientRect(),A=Math.max(h.height,w.height);b.style.height=A+"px",_.style.height=A+"px",b.setAttribute("data-sync-height",String(A)),_.setAttribute("data-sync-height",String(A))};N();let S=()=>{y.__observeCallback?.delete(N),y.__observeCallback?.size===0&&(y.__observeInstance?.disconnect(),L.removeAttribute("data-observe"),delete y.__observeCallback,delete y.__observeInstance)};if(y.__observeCallback){y.__observeCallback.add(N),u=S;return}y.__observeCallback=new Set,y.__observeCallback.add(N);let E=new ResizeObserver(()=>y.__observeCallback?.forEach(h=>h()));y.__observeInstance=E,E.observe(L),L.setAttribute("data-observe","height"),u=S}l.current=u}};ye(()=>(f(),()=>l.current?.()))};var lg=new Set(["$$slots","$$events","$$legacy"]),dg=O('<td><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!></div></td>'),fg=O("<td><div></div></td>"),cg=O('<tr data-state="extend" class="diff-line diff-line-extend"><!></tr>');function Ml(t,e){de(e,!0);let n=ue(e,lg),i=ce(null),r=k(Xr()),o=k(Zr()),a=k(()=>`div[data-line="${e.lineNumber}-extend-content"]`),l=k(()=>`tr[data-line="${e.lineNumber}-extend"]`),f=k(()=>e.side===R.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),u=k(()=>e.diffFile.getSplitLeftLine(e.index)),d=k(()=>e.diffFile.getSplitRightLine(e.index)),c=k(()=>e.diffFile.getExpandEnabled()),p=k(()=>s(r)?.oldFile?.[s(u)?.lineNumber||""]),m=k(()=>s(r)?.newFile?.[s(d)?.lineNumber||""]),g=k(()=>e.side===R.old?s(u):s(d)),x=k(()=>s(g)?.isHidden),b=k(()=>e.side===R.old?s(p):s(m)),_=k(()=>e.side===R.old?s(u)?.lineNumber:s(d)?.lineNumber),L=k(()=>!!((s(p)||s(m))&&(!s(x)||s(c))&&s(o))),y=k(()=>(e.side===R.old?!!s(p):!!s(m))&&s(L)),N=k(()=>R[s(b)?e.side:e.side===R.new?R.old:R.new]);Bi({selector:()=>s(a),wrapper:()=>s(l),side:()=>s(N),enable:()=>!!(s(L)&&s(i))});let S=k(Hi({selector:()=>s(f),enable:()=>!!(s(y)&&s(i))}));var E=pe(),h=ne(E);{var w=A=>{var T=cg(),M=C(T);{var U=J=>{var ee=dg();W(ee,"colspan",2);var re=C(ee),q=C(re);{var F=V=>{var j=pe(),z=ne(j);Mt(z,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(_)||0,data:s(b)?.data,onUpdate:e.diffFile.notifyAll})),D(V,j)};Y(q,V=>{s(S)>0&&V(F)})}$(re),$(ee),X(()=>{Ie(ee,1,`diff-line-extend-${R[e.side]}-content p-0`),W(re,"data-line",`${e.lineNumber}-extend-content`),W(re,"data-side",R[e.side]),Q(re,` width: ${s(S)}px `)}),D(J,ee)},P=J=>{var ee=fg();W(ee,"colspan",2);var re=C(ee);$(ee),X(()=>{Ie(ee,1,`diff-line-extend-${R[e.side]}-placeholder select-none p-0`),Q(ee,` background-color: var(${Xt})`),W(re,"data-line",`${e.lineNumber}-extend-content`),W(re,"data-side",R[e.side])}),D(J,ee)};Y(M,J=>{s(o)&&s(b)?J(U):J(P,-1)})}$(T),lt(T,()=>J=>oe(i,J,!0)),X(()=>{W(T,"data-line",`${e.lineNumber}-extend`),W(T,"data-side",R[e.side])}),D(A,T)};Y(h,A=>{s(L)&&A(w)})}D(t,E),fe()}var ug=new Set(["$$slots","$$events","$$legacy"]),pg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),hg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),mg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),gg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),vg=O('<div class="min-h-[28px]">&ensp;</div>'),_g=O('<td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td> <td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td>',1),wg=O('<td class="diff-line-hunk-placeholder select-none"><div class="min-h-[28px]">&ensp;</div></td>'),bg=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><!></tr>');function Hl(t,e){de(e,!0);let n=ue(e,ug),i=ce(null),r=k(()=>e.diffFile.getSplitHunkLine(e.index)),o=k(()=>e.diffFile.getExpandEnabled()),a=k(()=>s(o)&&s(r)?.splitInfo),l=k(()=>`tr[data-line="${e.lineNumber}-hunk"]`),f=k(()=>e.side===R.old),u=()=>{let E=s(r);return E&&E.splitInfo&&E.splitInfo.endHiddenIndex-E.splitInfo.startHiddenIndex<je},d=ce(Le(u())),c=()=>{let E=s(r);return E&&E.splitInfo&&E.splitInfo.startHiddenIndex<E.splitInfo.endHiddenIndex},p=ce(Le(c())),m=k(()=>{let E=s(r);return E&&E.isFirst}),g=k(()=>{let E=s(r);return E&&e.diffFile._getIsPureDiffRender()&&!E.splitInfo}),x=k(()=>{let E=s(r);return E&&E.isLast}),b={current:()=>{}};ye(()=>{b.current();let E=()=>{oe(p,c(),!0),oe(d,u(),!0)};E(),b.current=e.diffFile.subscribe(E)}),ze(()=>b.current());let _=k(()=>R[R.old]),L=k(()=>e.side===R.new&&(!!s(p)||s(g)));Bi({selector:()=>s(l),wrapper:()=>s(l),side:()=>s(_),enable:()=>!!(s(L)&&s(i))});var y=pe(),N=ne(y);{var S=E=>{var h=bg(),w=C(h);{var A=M=>{var U=_g(),P=ne(U),J=C(P);{var ee=j=>{var z=pe(),B=ne(z);{var he=se=>{var te=pg(),xe=C(te);Nt(xe,{className:"fill-current"}),$(te),be("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(se,te)},ie=se=>{var te=hg(),xe=C(te);$t(xe,{className:"fill-current"}),$(te),be("click",te,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(se,te)},Z=se=>{var te=mg(),xe=C(te);kn(xe,{className:"fill-current"}),$(te),be("click",te,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(se,te)},ve=se=>{var te=gg(),xe=ne(te),Ee=C(xe);$t(Ee,{className:"fill-current"}),$(xe);var ge=K(xe,2),ke=C(ge);Nt(ke,{className:"fill-current"}),$(ge),be("click",xe,()=>e.diffFile.onSplitHunkExpand("down",e.index)),be("click",ge,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(se,te)};Y(B,se=>{s(m)?se(he):s(x)?se(ie,1):s(d)?se(Z,2):se(ve,-1)})}D(j,z)},re=j=>{var z=vg();D(j,z)};Y(J,j=>{s(a)?j(ee):j(re,-1)})}$(P);var q=K(P,2),F=C(q),V=C(F,!0);$(F),$(q),X(()=>{Q(P,`
					background-color: var(${jn});
					color: var(${ft});
					width: var(${De});
					min-width: var(${De});
					max-width: var(${De});
				`),Q(q,`background-color: var(${dn})`),Q(F,`
						color: var(${Pn})
					`),Ce(V,s(r)?.splitInfo?.plainText||s(r)?.text)}),D(M,U)},T=M=>{var U=wg();W(U,"colspan",2),X(()=>Q(U,`background-color: var(${dn})`)),D(M,U)};Y(w,M=>{s(f)?M(A):M(T,-1)})}$(h),lt(h,()=>M=>oe(i,M,!0)),X(()=>{W(h,"data-line",`${e.lineNumber}-hunk`),W(h,"data-side",R[e.side]),Q(h,`background-color: var(${dn})`)}),D(E,h)};Y(N,E=>{(s(p)||s(g))&&E(S)})}D(t,y),fe()}rt(["click"]);var xg=new Set(["$$slots","$$events","$$legacy"]),yg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Eg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Ag=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Lg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),kg=O('<div class="min-h-[28px]">&ensp;</div>'),Sg=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Bl(t,e){de(e,!0);let n=ue(e,xg),i=ce(null),r=k(()=>e.diffFile.getSplitHunkLine(e.index)),o=k(()=>e.diffFile.getExpandEnabled()),a=k(()=>s(o)&&s(r)?.splitInfo),l=k(()=>`tr[data-line="${e.lineNumber}-hunk"]`),f=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.endHiddenIndex-S.splitInfo.startHiddenIndex<je},u=ce(Le(f())),d=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.startHiddenIndex<S.splitInfo.endHiddenIndex},c=ce(Le(d())),p=k(()=>{let S=s(r);return S&&S.isFirst}),m=k(()=>{let S=s(r);return S&&e.diffFile._getIsPureDiffRender()&&!S.splitInfo}),g=k(()=>{let S=s(r);return S&&S.isLast}),x=k(()=>R[R.old]),b=k(()=>e.side===R.new&&(!!s(c)||s(m))),_={current:()=>{}};ye(()=>{_.current();let S=()=>{oe(c,d(),!0),oe(u,f(),!0)};S(),_.current=e.diffFile.subscribe(S)}),ze(()=>_.current()),Bi({selector:()=>s(l),wrapper:()=>s(l),side:()=>s(x),enable:()=>!!(s(b)&&s(i))});var L=pe(),y=ne(L);{var N=S=>{var E=Sg(),h=C(E),w=C(h);{var A=J=>{var ee=pe(),re=ne(ee);{var q=z=>{var B=yg(),he=C(B);Nt(he,{className:"fill-current"}),$(B),be("click",B,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(z,B)},F=z=>{var B=Eg(),he=C(B);$t(he,{className:"fill-current"}),$(B),be("click",B,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(z,B)},V=z=>{var B=Ag(),he=C(B);kn(he,{className:"fill-current"}),$(B),be("click",B,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(z,B)},j=z=>{var B=Lg(),he=ne(B),ie=C(he);$t(ie,{className:"fill-current"}),$(he);var Z=K(he,2),ve=C(Z);Nt(ve,{className:"fill-current"}),$(Z),be("click",he,()=>e.diffFile.onSplitHunkExpand("down",e.index)),be("click",Z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(z,B)};Y(re,z=>{s(p)?z(q):s(g)?z(F,1):s(u)?z(V,2):z(j,-1)})}D(J,ee)},T=J=>{var ee=kg();D(J,ee)};Y(w,J=>{s(a)?J(A):J(T,-1)})}$(h);var M=K(h),U=C(M),P=C(U,!0);$(U),$(M),$(E),lt(E,()=>J=>oe(i,J,!0)),X(()=>{W(E,"data-line",`${e.lineNumber}-hunk`),W(E,"data-side",R[e.side]),Q(E,`background-color: var(${dn})`),Q(h,`
				background-color: var(${jn});
				color: var(${ft});
				width: var(${De});
				min-width: var(${De});
				max-width: var(${De})
			`),Q(M,`background-color: var(${dn})`),Q(U,`
					color: var(${Pn})
				`),Ce(P,s(r)?.splitInfo?.plainText||s(r)?.text)}),D(S,E)};Y(y,S=>{(s(c)||s(m))&&S(N)})}D(t,L),fe()}rt(["click"]);var Ig=new Set(["$$slots","$$events","$$legacy"]);function Js(t,e){de(e,!0);let n=ue(e,Ig),i=k(Ws());var r=pe(),o=ne(r);{var a=f=>{Hl(f,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=f=>{Bl(f,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};Y(o,f=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?f(a):f(l,-1)})}D(t,r),fe()}var Ng=new Set(["$$slots","$$events","$$legacy"]),$g=O('<td><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!></div></td>'),Cg=O("<td><div></div></td>"),Dg=O('<tr data-state="widget" class="diff-line diff-line-widget"><!></tr>');function Rl(t,e){de(e,!0);let n=ue(e,Ng),i=ce(null),r=k(Kr()),o=k(An()),a=k(()=>e.diffFile.getSplitLeftLine(e.index)),l=k(()=>e.diffFile.getSplitRightLine(e.index)),f=k(()=>!!s(a)?.lineNumber&&s(o)?.side===R.old&&s(o)?.lineNumber===s(a)?.lineNumber),u=k(()=>!!s(l)?.lineNumber&&s(o)?.side===R.new&&s(o)?.lineNumber===s(l)?.lineNumber),d=k(()=>e.side===R.old?s(a):s(l)),c=k(()=>s(d)?.isHidden),p=k(()=>`div[data-line="${e.lineNumber}-widget-content"]`),m=k(()=>`tr[data-line="${e.lineNumber}-widget"]`),g=k(()=>e.side===R.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),x=k(()=>e.side===R.old?s(f):s(u)),b=k(()=>R[s(x)?e.side:e.side===R.old?R.new:R.old]),_=k(()=>(!!s(f)||!!s(u))&&!s(c)&&!!s(r)),L=k(()=>s(x)&&!!s(_)),y=()=>{s(o).side=void 0,s(o).lineNumber=void 0};Bi({selector:()=>s(p),wrapper:()=>s(m),side:()=>s(b),enable:()=>!!(s(_)&&s(i))});let N=k(Hi({selector:()=>s(g),enable:()=>!!(s(L)&&s(i))}));var S=pe(),E=ne(S);{var h=w=>{var A=Dg(),T=C(A);{var M=P=>{var J=$g();W(J,"colspan",2);var ee=C(J),re=C(ee);{var q=F=>{var V=pe(),j=ne(V);Mt(j,()=>s(r),()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(d)?.lineNumber||0,onClose:y})),D(F,V)};Y(re,F=>{s(N)>0&&F(q)})}$(ee),$(J),X(()=>{Ie(J,1,`diff-line-widget-${R[e.side]}-content p-0`),W(ee,"data-line",`${e.lineNumber}-widget-content`),W(ee,"data-side",R[e.side]),Q(ee,` width: ${s(N)}px `)}),D(P,J)},U=P=>{var J=Cg();W(J,"colspan",2);var ee=C(J);$(J),X(()=>{Ie(J,1,`diff-line-widget-${R[e.side]}-placeholder select-none p-0`),Q(J,`background-color: var(${Xt})`),W(ee,"data-line",`${e.lineNumber}-widget-content`),W(ee,"data-side",R[e.side])}),D(P,J)};Y(T,P=>{s(x)?P(M):P(U,-1)})}$(A),lt(A,()=>P=>oe(i,P,!0)),X(()=>{W(A,"data-line",`${e.lineNumber}-widget`),W(A,"data-side",R[e.side])}),D(w,A)};Y(E,w=>{s(_)&&w(h)})}D(t,S),fe()}var Tg=new Set(["$$slots","$$events","$$legacy"]),Fg=O("<!> <!> <!> <!>",1),Mg=O('<table><colgroup><col/><col/></colgroup><thead class="hidden"><tr><th scope="col"> </th><th scope="col"> </th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table>');function qs(t,e){de(e,!0);let n=ue(e,Tg),i=k(()=>e.side===R.new?"new-diff-table":"old-diff-table"),r=()=>as(e.diffFile),o=ce(Le(r())),a={current:()=>{}},l=e.selectState;ye(()=>{a.current();let E=()=>oe(o,r(),!0);E(),a.current=e.diffFile.subscribe(E)}),ze(()=>a.current());let f=E=>{let h=E.target;if(h&&h?.nodeName==="BUTTON"){Ln();return}let w=ro(h);if(!(w&&w!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let A=h.getAttribute("data-state");if(A){A==="extend"||A==="hunk"||A==="widget"?l.current!==void 0&&(l.current=void 0,e.onSelect?.(void 0),Ln()):l.current!==e.side&&(l.current=n.side,e.onSelect?.(e.side),Ln());return}h=h.parentElement}};var u=Mg(),d=C(u),c=C(d),p=K(c);$(d);var m=K(d),g=C(m),x=C(g),b=C(x);$(x);var _=K(x),L=C(_);$(_),$(g),$(m);var y=K(m),N=C(y);li(N,17,()=>s(o),ai,(E,h)=>{var w=Fg(),A=ne(w);Js(A,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var T=K(A,2);Fl(T,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=K(T,2);Rl(M,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var U=K(M,2);Ml(U,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),D(E,w)});var S=K(N);Js(S,{get side(){return e.side},get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),$(y),$(u),X(()=>{Ie(u,1,`${s(i)} w-full border-collapse border-spacing-0`),W(u,"data-mode",R[e.side]),Ie(c,1,`diff-table-${R[e.side]}-num-col`),Ie(p,1,`diff-table-${R[e.side]}-content-col`),Ce(b,`${R[e.side]??""} line number`),Ce(L,`${R[e.side]??""} line content`)}),be("mousedown",y,f),D(t,u),fe()}rt(["mousedown"]);var Hg=new Set(["$$slots","$$events","$$legacy"]),Bg=O('<div class="split-diff-view split-diff-view-normal flex w-full basis-[50%]"><style data-select-style=""></style> <div class="old-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div> <div class="diff-split-line w-[1.5px]"></div> <div class="new-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div></div>');function Ol(t,e){de(e,!0);let n=ue(e,Hg),i=k(di()),r=ce(void 0),o=ce(void 0),a=ce(null),l=k(()=>Math.max(e.diffFile.fileLineLength,e.diffFile.splitLineLength).toString()),f={current:()=>{}},u={current:void 0};ye(()=>{if(f.current(),!s(i))return;let w=s(r),A=s(o);!w||!A||(f.current=cu(w,A))}),ze(()=>f.current());let c=w=>{let A=s(a);A&&(w?A.textContent=`#${b()} [data-state="extend"] {user-select: none} 
#${b()} [data-state="hunk"] {user-select: none} 
#${b()} [data-state="widget"] {user-select: none}`:A.textContent="")},p=k(qr()),m=k(()=>({fontSize:`${s(p)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),g=k(io({text:()=>s(l),font:()=>s(m)})),x=k(()=>Math.max(40,s(g)+25)),b=()=>`diff-split-view-${e.diffFile.getId()}`;var _=Bg(),L=C(_);lt(L,()=>w=>oe(a,w,!0));var y=K(L,2),N=C(y);qs(N,{get side(){return R.old},get diffFile(){return e.diffFile},onSelect:c,get selectState(){return u}}),$(y),lt(y,()=>w=>{oe(r,w,!0)});var S=K(y,2),E=K(S,2),h=C(E);qs(h,{get side(){return R.new},get diffFile(){return e.diffFile},onSelect:c,get selectState(){return u}}),$(E),lt(E,()=>w=>{oe(o,w,!0)}),$(_),X((w,A)=>{Q(y,w),Q(S,`background-color: var(${gn})`),Q(E,A)},[()=>`
      ${De}: ${Math.round(s(x))}px;
      overscroll-behavior-x: none;
      font-family: Menlo, Consolas, monospace;
      font-size: var(${nt});
    `,()=>`
			${De}: ${Math.round(s(x))}px;
			overscroll-behavior-x: none;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`]),D(t,_),fe()}var Rg=new Set(["$$slots","$$events","$$legacy"]);function Pl(t,e){de(e,!0);let n=ue(e,Rg),i=k(En());var r=pe(),o=ne(r);{var a=f=>{Tl(f,{get diffFile(){return e.diffFile}})},l=f=>{Ol(f,{get diffFile(){return e.diffFile}})};Y(o,f=>{s(i)?f(a):f(l,-1)})}D(t,r),fe()}var Og=new Set(["$$slots","$$events","$$legacy"]),Pg=O('<div class="diff-add-widget-wrapper invisible absolute left-[100%] translate-x-[-50%] select-none transition-transform hover:scale-110 group-hover:visible"><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function qo(t,e){de(e,!0);let n=ue(e,Og);var i=Pg(),r=C(i);$(i),X(()=>{W(i,"data-add-widget",R[e.side]),Q(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),Q(r,`
			color: var(${Vs});
			background-color: var(${Qs});
		`)}),be("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),D(t,i),fe()}rt(["mousedown"]);var jg=new Set(["$$slots","$$events","$$legacy"]),Ug=O('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"></span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),Wg=O('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"></span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),zg=O("<!> <!>",1),Gg=O('<tr class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex opacity-[0.5]"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>');function jl(t,e){de(e,!0);let n=ue(e,jg),i=k(()=>e.diffFile.getUnifiedLine(e.index)),r=k(En()),o=k(An()),a=k(eo()),l=k(to()),f=k(no()),u=k(()=>s(i)?.isHidden),d=k(()=>Ki(s(i)?.diff)),c=()=>s(i)?.newLineNumber?e.diffFile.getNewSyntaxLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldSyntaxLine(s(i)?.oldLineNumber||0):void 0,p=ce(Le(c())),m=()=>s(i)?.newLineNumber?e.diffFile.getNewPlainLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldPlainLine(s(i)?.oldLineNumber||0):void 0,g=ce(Le(m())),x={current:()=>{}};ye(()=>{x?.current?.();let N=()=>{oe(p,c(),!0),oe(g,m(),!0)};N(),x.current=e.diffFile.subscribe(N)}),ze(()=>x.current());let b=(N,S)=>{s(o).side=S,s(o).lineNumber=N};var _=pe(),L=ne(_);{var y=N=>{var S=pe(),E=ne(S);{var h=A=>{let T=(q,F=ht)=>{var V=Ug(),j=C(V),z=C(j);{var B=te=>{{let xe=k(()=>F().index-1);qo(te,{get index(){return s(xe)},get lineNumber(){return F().lineNumber},get diffFile(){return F().diffFile},get side(){return R.old},get onWidgetClick(){return F().onAddWidgetClick},get onOpenAddWidget(){return F().onOpenAddWidget}})}};Y(z,te=>{F().enableAddWidget&&te(B)})}var he=K(z,2),ie=C(he),Z=C(ie,!0);$(ie),Xi(4),$(he),$(j);var ve=K(j),se=C(ve);fi(se,{get enableWrap(){return F().enableWrap},get diffFile(){return F().diffFile},get enableHighlight(){return F().enableHighlight},get rawLine(){return F().rawLine},get diffLine(){return F().diffLine},get plainLine(){return F().plainLine},get syntaxLine(){return F().syntaxLine}}),$(ve),$(V),X(()=>{W(V,"data-line",F().index),Q(j,`
          color: var(${ft});
          background-color: var(${Al});
          width: calc(calc(var(${De}) + 5px) * 2);
          max-width: calc(calc(var(${De}) + 5px) * 2);
          min-width: calc(calc(var(${De}) + 5px) * 2);
        `),W(ie,"data-line-old-num",F().lineNumber),Ce(Z,F().lineNumber),Q(ve,`background-color: var(${yl}) `)}),D(q,V)},M=(q,F=ht)=>{var V=Wg(),j=C(V),z=C(j);{var B=te=>{{let xe=k(()=>F().index-1);qo(te,{get index(){return s(xe)},get lineNumber(){return F().lineNumber},get diffFile(){return F().diffFile},get side(){return R.new},get onWidgetClick(){return F().onAddWidgetClick},get onOpenAddWidget(){return F().onOpenAddWidget}})}};Y(z,te=>{F().enableAddWidget&&te(B)})}var he=K(z,2),ie=K(C(he),4),Z=C(ie,!0);$(ie),$(he),$(j);var ve=K(j),se=C(ve);fi(se,{get enableWrap(){return F().enableWrap},get diffFile(){return F().diffFile},get enableHighlight(){return F().enableHighlight},get rawLine(){return F().rawLine},get diffLine(){return F().diffLine},get plainLine(){return F().plainLine},get syntaxLine(){return F().syntaxLine}}),$(ve),$(V),X(()=>{W(V,"data-line",F().index),Q(j,`
          color: var(${ft});
          background-color: var(${El});
          width: calc(calc(var(${De}) + 5px) * 2);
          max-width: calc(calc(var(${De}) + 5px) * 2);
          min-width: calc(calc(var(${De}) + 5px) * 2);
        `),W(ie,"data-line-new-num",F().lineNumber),Ce(Z,F().lineNumber),Q(ve,` background-color: var(${xl}) `)}),D(q,V)};var U=zg(),P=ne(U);{var J=q=>{T(q,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(l),enableAddWidget:s(f),lineNumber:s(i).oldLineNumber||0,onOpenAddWidget:b,onAddWidgetClick:s(a)}))};Y(P,q=>{s(i).oldLineNumber&&q(J)})}var ee=K(P,2);{var re=q=>{M(q,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(l),enableAddWidget:s(f),lineNumber:s(i).newLineNumber||0,onOpenAddWidget:b,onAddWidgetClick:s(a)}))};Y(ee,q=>{s(i).newLineNumber&&q(re)})}D(A,U)},w=A=>{var T=Gg(),M=C(T),U=C(M);{var P=z=>{{let B=k(()=>s(i)?.newLineNumber||0);qo(z,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return s(B)},get side(){return R.new},onOpenAddWidget:b,get onWidgetClick(){return s(a)}})}};Y(U,z=>{s(f)&&s(i)?.diff&&z(P)})}var J=K(U,2),ee=C(J),re=C(ee,!0);$(ee);var q=K(ee,4),F=C(q,!0);$(q),$(J),$(M);var V=K(M),j=C(V);{let z=k(()=>!!s(r)),B=k(()=>!!s(l)),he=k(()=>s(i)?.value||""),ie=k(()=>s(i)?.diff);fi(j,{get enableWrap(){return s(z)},get diffFile(){return e.diffFile},get enableHighlight(){return s(B)},get rawLine(){return s(he)},get diffLine(){return s(ie)},get plainLine(){return s(g)},get syntaxLine(){return s(p)}})}$(V),$(T),X(()=>{W(T,"data-line",e.lineNumber),W(T,"data-state",s(i)?.diff?"diff":"plain"),Q(M,`
					color: var(${s(i)?.diff?ft:ur});
					background-color: ${s(i)?.diff?`var(${kl})`:`var(${Gs})`};
					width: calc(calc(var(${De}) + 5px) * 2);
					max-width: calc(calc(var(${De}) + 5px) * 2);
					min-width: calc(calc(var(${De}) + 5px) * 2;
				`),W(ee,"data-line-old-num",s(i)?.oldLineNumber||0),Ce(re,s(i)?.oldLineNumber||0),W(q,"data-line-new-num",s(i)?.newLineNumber||0),Ce(F,s(i)?.newLineNumber||0),Q(V,`
					background-color: ${s(i)?.diff?`var(${Ll})`:`var(${Gs})`}
				`)}),D(A,T)};Y(E,A=>{s(d)?A(h):A(w,-1)})}D(N,S)};Y(L,N=>{s(u)||N(y)})}D(t,_),fe()}var Qg=new Set(["$$slots","$$events","$$legacy"]),Vg=O('<tr data-state="extend" class="diff-line diff-line-extend"><td class="diff-line-extend-content p-0 align-top"><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Ul(t,e){de(e,!0);let n=ue(e,Qg),i=k(Xr()),r=k(En()),o=k(Zr()),a=k(()=>e.diffFile.getUnifiedLine(e.index)),l=k(()=>s(i)?.oldFile?.[s(a)?.oldLineNumber||-1]),f=k(()=>s(i)?.newFile?.[s(a)?.newLineNumber||-1]),u=k(()=>s(a).isHidden),d=k(()=>!!((s(l)||s(f))&&s(u)&&s(o))),c=k(Hi({selector:()=>".unified-diff-table-wrapper",enable:()=>s(d)}));var p=pe(),m=ne(p);{var g=x=>{var b=Vg(),_=C(b);W(_,"colspan",2);var L=C(_),y=C(L);{var N=h=>{var w=pe(),A=ne(w);Mt(A,()=>s(o),()=>({diffFile:e.diffFile,side:R.old,data:s(l)?.data,lineNumber:s(a)?.oldLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),D(h,w)};Y(y,h=>{(s(r)||s(c)>0)&&s(l)&&s(o)&&h(N)})}var S=K(y,2);{var E=h=>{var w=pe(),A=ne(w);Mt(A,()=>s(o),()=>({diffFile:e.diffFile,side:R.new,data:s(f)?.data,lineNumber:s(a)?.newLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),D(h,w)};Y(S,h=>{(s(r)||s(c)>0)&&s(f)&&s(o)&&h(E)})}$(L),$(_),$(b),X(()=>{W(b,"data-line",`${e.lineNumber}-extend`),Q(L,`width: ${s(c)}px `)}),D(x,b)};Y(m,x=>{s(d)&&x(g)})}D(t,p),fe()}var Yg=new Set(["$$slots","$$events","$$legacy"]),Jg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),qg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Kg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Xg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Zg=O('<div class="min-h-[28px]">&ensp;</div>'),ev=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[100px] select-none"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Ks(t,e){de(e,!0);let n=ue(e,Yg),i=k(()=>e.diffFile.getUnifiedHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)&&s(i).unifiedInfo),a=k(En()),l=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.startHiddenIndex<s(i).unifiedInfo.endHiddenIndex,f=ce(Le(l())),u=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.endHiddenIndex-s(i).unifiedInfo.startHiddenIndex<je,d=ce(Le(u())),c=k(()=>s(i)&&s(i).isFirst),p=k(()=>s(i)&&s(i).isLast),m=k(()=>s(i)&&e.diffFile._getIsPureDiffRender()&&!s(i).unifiedInfo),g={current:()=>{}};ye(()=>{g?.current?.();let L=()=>{oe(f,l(),!0),oe(d,u(),!0)};L(),g.current=e.diffFile.subscribe(L)}),ze(()=>g.current());var x=pe(),b=ne(x);{var _=L=>{var y=ev(),N=C(y),S=C(N);{var E=M=>{var U=pe(),P=ne(U);{var J=F=>{var V=Jg(),j=C(V);Nt(j,{className:"fill-current"}),$(V),be("click",V,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),D(F,V)},ee=F=>{var V=qg(),j=C(V);$t(j,{className:"fill-current"}),$(V),be("click",V,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),D(F,V)},re=F=>{var V=Kg(),j=C(V);kn(j,{className:"fill-current"}),$(V),be("click",V,()=>e.diffFile.onUnifiedHunkExpand("all",e.index)),D(F,V)},q=F=>{var V=Xg(),j=ne(V),z=C(j);$t(z,{className:"fill-current"}),$(j);var B=K(j,2),he=C(B);Nt(he,{className:"fill-current"}),$(B),be("click",j,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),be("click",B,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),D(F,V)};Y(P,F=>{s(c)?F(J):s(p)?F(ee,1):s(d)?F(re,2):F(q,-1)})}D(M,U)},h=M=>{var U=Zg();D(M,U)};Y(S,M=>{s(o)?M(E):M(h,-1)})}$(N);var w=K(N),A=C(w),T=C(A,!0);$(A),$(w),$(y),X(()=>{W(y,"data-line",`${e.lineNumber}-hunk`),Q(N,`
				background-color: var(${jn});
				color: var(${ft});
				width: calc(calc(var(${De}) + 5px) * 2);
				max-width: calc(calc(var(${De}) + 5px) * 2);
				min-width: calc(calc(var(${De}) + 5px) * 2);
			`),Q(w,` background-color: var(${dn}) `),Q(A,`
					white-space: ${s(a)?"pre-wrap":"pre"};
					word-break: ${s(a)?"break-all":"initial"};
					color: var(${Pn});
				`),Ce(T,s(i)?.unifiedInfo?.plainText||s(i)?.text)}),D(L,y)};Y(b,L=>{(s(f)||s(m))&&L(_)})}D(t,x),fe()}rt(["click"]);var tv=new Set(["$$slots","$$events","$$legacy"]),nv=O('<tr data-state="widget" class="diff-line diff-line-widget"><td class="diff-line-widget-content p-0"><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Wl(t,e){de(e,!0);let n=ue(e,tv),i=k(An()),r=k(En()),o=k(Kr()),a=k(()=>e.diffFile.getUnifiedLine(e.index)),l=k(()=>s(a)?.oldLineNumber&&s(i)?.side===R.old&&s(i)?.lineNumber===s(a)?.oldLineNumber),f=k(()=>s(a)?.newLineNumber&&s(i)?.side===R.new&&s(i)?.lineNumber===s(a)?.newLineNumber),u=k(()=>s(a)?.isHidden),d=k(()=>!!((s(l)||s(f))&&!s(u)&&s(o))),c=()=>{s(i).side=void 0,s(i).lineNumber=void 0},p=k(Hi({selector:()=>".unified-diff-table-wrapper",enable:()=>s(d)}));var m=pe(),g=ne(m);{var x=b=>{var _=nv(),L=C(_);W(L,"colspan",2);var y=C(L),N=C(y);{var S=w=>{var A=pe(),T=ne(A);Mt(T,()=>s(o),()=>({diffFile:e.diffFile,side:R.old,lineNumber:s(a)?.oldLineNumber||0,onClose:c})),D(w,A)};Y(N,w=>{(s(r)||s(p)>0)&&s(l)&&w(S)})}var E=K(N,2);{var h=w=>{var A=pe(),T=ne(A);Mt(T,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:R.new,lineNumber:s(a)?.newLineNumber||0,onClose:c})),D(w,A)};Y(E,w=>{(s(r)||s(p)>0)&&s(f)&&w(h)})}$(y),$(L),$(_),X(()=>{W(_,"data-line",`${e.lineNumber}-widget`),Q(y,`width: ${s(p)}px`)}),D(b,_)};Y(g,b=>{s(d)&&b(x)})}D(t,m),fe()}var iv=new Set(["$$slots","$$events","$$legacy"]),rv=O("<!> <!> <!> <!>",1),ov=O('<div><style data-select-style=""></style> <div class="unified-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><table><colgroup><col class="unified-diff-table-num-col"/><col class="unified-diff-table-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">line number</th><th scope="col">line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function zl(t,e){de(e,!0);let n=ue(e,iv),i=ce(Le(Ea(e.diffFile))),r=ce(Le(e.diffFile.unifiedLineLength.toString())),o=ce(null),a=k(qr()),l=k(En()),f={current:()=>{}},u={current:void 0},d=()=>{let E=e.diffFile;oe(i,Ea(E),!0),oe(r,E.unifiedLineLength.toString(),!0)};ye(()=>{f.current?.(),d(),f.current=e.diffFile.subscribe(d)}),ze(()=>f.current());let c=E=>{let h=E.target;if(!s(o))return;if(h&&h?.nodeName==="BUTTON"){Ln();return}let w=ro(h);if(!(w&&w!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let A=h.getAttribute("data-state");if(A){A==="extend"||A==="hunk"||A==="widget"?u.current!==!1&&(u.current=!1,s(o).innerHTML="",Ln()):u.current!==!0&&(u.current=!0,s(o).innerHTML=`#${w} [data-state="extend"] {user-select: none} 
#${w} [data-state="hunk"] {user-select: none} 
#${w} [data-state="widget"] {user-select: none}`,Ln());return}h=h.parentElement}},p=k(()=>({fontSize:s(a)+"px",fontFamily:"Menlo, Consolas, monospace"})),m=k(io({text:()=>s(r),font:()=>s(p)})),g=k(()=>Math.max(40,s(m)+10));var x=ov(),b=C(x);lt(b,()=>E=>oe(o,E,!0));var _=K(b,2),L=C(_),y=K(C(L),2),N=C(y);li(N,17,()=>s(i),ai,(E,h)=>{var w=rv(),A=ne(w);Ks(A,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var T=K(A,2);jl(T,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=K(T,2);Wl(M,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var U=K(M,2);Ul(U,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),D(E,w)});var S=K(N);Ks(S,{get index(){return e.diffFile.unifiedLineLength},get lineNumber(){return e.diffFile.unifiedLineLength},get diffFile(){return e.diffFile}}),$(y),$(L),$(_),$(x),X(E=>{Ie(x,1,`unified-diff-view ${s(l)?"unified-diff-view-wrap":"unified-diff-view-normal"} w-full`),Q(_,E),Ie(L,1,`unified-diff-table w-full border-collapse border-spacing-0 ${s(l)?"table-fixed":""}`)},[()=>`${De}: ${Math.round(s(g))}px; font-family: Menlo, Consolas, monospace; font-size: var(${nt})`]),be("mousedown",y,c),D(t,x),fe()}rt(["mousedown"]);var sv=new Set(["$$slots","$$events","$$legacy"]),av=O('<div class="diff-tailwindcss-wrapper" data-component="git-diff-view"><div class="diff-style-root"><div><!></div></div></div>');function Xs(t,e){de(e,!0);let n=ue(e,sv),i={current:null},o=k(()=>{if(i.current?.clear?.(),e.diffFile){let E=qi.createInstance({});return E._mergeFullBundle(e.diffFile._getFullBundle()),i.current=E,E}else if(e.data){let E=e.data,h=new qi(E.oldFile?.fileName||"",E.oldFile?.content||"",E.newFile?.fileName||"",E.newFile?.content||"",E.hunks||[],E.oldFile?.fileLang||"",E.newFile?.fileLang||"");return i.current=h,h}return null});ye(()=>{e.onDiffFileCreated?.(s(o))});let l=k(()=>s(o)?.getId?.()),f=Le({side:e.initialWidgetState?.side,lineNumber:e.initialWidgetState?.lineNumber}),u=ce(null),d=k(()=>e.diffViewHighlight??!0),c=k(()=>e.diffViewTheme);ye(()=>{f.side=e.initialWidgetState?.side,f.lineNumber=e.initialWidgetState?.lineNumber}),ye(()=>{(e.data||e.diffFile)&&(f.side=void 0,f.lineNumber=void 0)});let p={current:()=>{}},m=k(di());ye(()=>{p?.current?.(),!(!s(m)||!s(o)||!e.diffFile)&&(e.diffFile._addClonedInstance(s(o)),p.current=()=>e.diffFile?._delClonedInstance(s(o)))}),ze(()=>p.current()),ye(()=>{!s(o)||!s(m)||(s(o).initTheme(s(c)),s(o).initRaw(),s(o).buildSplitDiffLines(),s(o).buildUnifiedDiffLines())}),ye(()=>{if(!(!s(o)||!s(m))&&(s(c),s(d))){let E=e.registerHighlighter;E?(E.name!==s(o)._getHighlighterName()||E.type!==s(o)._getHighlighterType()||E.type!=="class")&&(s(o).initSyntax({registerHighlighter:E}),s(o).notifyAll()):(!s(o)._getIsCloned()&&s(o)._getHighlighterName()!==gr.name||s(o)._getHighlighterType()!=="class")&&(s(o).initSyntax(),s(o).notifyAll())}});let _={current:()=>{}};ye(()=>{if(_?.current?.(),!s(m)||!s(o)||!s(u))return;s(c);let E=()=>{s(u)?.setAttribute("data-theme",s(o)._getTheme()||"light"),s(u)?.setAttribute("data-highlighter",s(o)._getHighlighterName())};E(),_.current=s(o).subscribe(E)}),ze(()=>_.current()),jc(n),Wc(n),Gc(n),tu(n),iu(n),ou(n),au(n),du(n),Zc(f),Kc(n),Vc(()=>s(o)?.getId()||""),Jc(()=>s(u));var y=pe(),N=ne(y);{var S=E=>{var h=av(),w=C(h),A=C(w),T=C(A);{var M=P=>{Pl(P,{get diffFile(){return s(o)}})},U=P=>{zl(P,{get diffFile(){return s(o)}})};Y(T,P=>{!e.diffViewMode||e.diffViewMode&Pt.Split?P(M):P(U,-1)})}$(A),$(w),$(h),lt(h,()=>P=>oe(u,P,!0)),X((P,J)=>{W(h,"data-theme",P),W(h,"data-highlighter",J),Q(w,`${nt}:${e.diffViewFontSize||14}px`),W(A,"id",s(m)?`diff-root${s(l)}`:void 0),Ie(A,1,"diff-view-wrapper"+(e.class?` ${e.class}`:"")),Q(A,e.style)},[()=>s(o)?._getTheme()||"light",()=>s(o)?._getHighlighterName()]),D(E,h)};Y(N,E=>{s(o)&&E(S)})}D(t,y),fe()}ss.name="@git-diff-view/svelte";function bu(t){let e=/[.*+?^${}()|[\]\\]/g;return t.replace(e,"\\$&")}function xu(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function yu(t){if(!t)return!1;let e=Date.now()-1440*60*1e3;return t*1e3>e}function pr(){let t=I;t.currentSubjectData=null,t.currentItemId=null,t.currentWcode=null,t.currentTags=null,t.currentSeries=null,t.currentCommitMessage=null,t.currentFieldUpdates=null,t.currentTagUpdates=null,t.currentSeriesUpdate=null}var Eu={Album:["\u4E2D\u6587\u540D","\u522B\u540D","\u827A\u672F\u5BB6","\u4F5C\u66F2","\u7F16\u66F2","\u4F5C\u8BCD","\u5382\u724C","\u53D1\u552E\u65E5\u671F","\u4EF7\u683C","\u7248\u672C\u7279\u6027","\u64AD\u653E\u65F6\u957F","\u5F55\u97F3","\u789F\u7247\u6570\u91CF","\u94FE\u63A5"],Anime:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u5E74\u5EA6","\u7247\u957F","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","\u5176\u4ED6","Copyright"],Book:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u63D2\u56FE","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u9875\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],BookSeries:["\u4E2D\u6587\u540D","\u522B\u540D","\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u5F00\u59CB","\u7ED3\u675F","\u518C\u6570","\u8BDD\u6570","\u539F\u4F5C","\u94FE\u63A5","\u5176\u4ED6"],Crt:["\u7B80\u4F53\u4E2D\u6587\u540D","\u522B\u540D","\u6027\u522B","\u751F\u65E5","\u8840\u578B","\u8EAB\u9AD8","\u4F53\u91CD","BWH","\u5F15\u7528\u6765\u6E90"],Game:["\u4E2D\u6587\u540D","\u522B\u540D","\u5E73\u53F0","\u6E38\u620F\u7C7B\u578B","\u6E38\u620F\u5F15\u64CE","\u6E38\u73A9\u4EBA\u6570","\u53D1\u884C\u65E5\u671F","\u552E\u4EF7","\u5F00\u53D1","\u53D1\u884C","\u5267\u672C","\u7A0B\u5E8F","website","\u94FE\u63A5"],Manga:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u4F5C\u753B","\u811A\u672C","\u539F\u4F5C","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u518C\u6570","\u9875\u6570","\u8BDD\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],Movie:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u5E74\u5EA6","\u7247\u957F","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","\u5176\u4ED6","Copyright"],Novel:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u63D2\u56FE","\u51FA\u7248\u793E","\u4EF7\u683C","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u518C\u6570","\u9875\u6570","\u8BDD\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],OVA:["\u4E2D\u6587\u540D","\u522B\u540D","\u8BDD\u6570","\u53D1\u552E\u65E5","\u5B98\u65B9\u7F51\u7AD9","\u5F00\u59CB","\u7ED3\u675F","\u94FE\u63A5","\u5176\u4ED6"],PhotoBook:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u6444\u5F71","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u9875\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],TV:["\u4E2D\u6587\u540D","\u522B\u540D","\u96C6\u6570","\u5B63\u6570","\u653E\u9001\u661F\u671F","\u5F00\u59CB","\u7ED3\u675F","\u4E3B\u6F14","\u5BFC\u6F14","\u97F3\u4E50","\u539F\u4F5C","\u5236\u4F5C","\u7C7B\u578B","\u56FD\u5BB6/\u5730\u533A","\u8BED\u8A00","\u6BCF\u96C6\u957F","\u5728\u7EBF\u64AD\u653E\u5E73\u53F0","\u7535\u89C6\u7F51","\u7535\u89C6\u53F0","\u9891\u9053","\u89C6\u9891\u5236\u5F0F","\u97F3\u9891\u5236\u5F0F","\u9996\u64AD\u56FD\u5BB6","\u9996\u64AD\u5730\u533A","\u53F0\u6E7E\u540D\u79F0","\u6E2F\u6FB3\u540D\u79F0","\u9A6C\u65B0\u540D\u79F0","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","imdb_id","tvdb_id"],TVAnime:["\u4E2D\u6587\u540D","\u522B\u540D","\u8BDD\u6570","\u653E\u9001\u5F00\u59CB","\u653E\u9001\u661F\u671F","\u5B98\u65B9\u7F51\u7AD9","\u5728\u7EBF\u64AD\u653E\u5E73\u53F0","\u64AD\u653E\u7535\u89C6\u53F0","\u5176\u4ED6\u7535\u89C6\u53F0","\u64AD\u653E\u7ED3\u675F","\u5BFC\u6F14","\u97F3\u4E50","\u94FE\u63A5","\u5176\u4ED6","Copyright"],doujinBook:["\u4F5C\u8005","\u539F\u4F5C","CP","\u8BED\u8A00","\u9875\u6570","\u5C3A\u5BF8","\u4EF7\u683C","\u53D1\u552E\u65E5"],doujinGame:["\u522B\u540D","\u5F00\u53D1\u8005","\u539F\u4F5C","\u5E73\u53F0","\u6E38\u620F\u7C7B\u578B","\u6E38\u620F\u5F15\u64CE","\u6E38\u73A9\u4EBA\u6570","\u8BED\u8A00","\u4EF7\u683C","\u53D1\u552E\u65E5"],doujinMusic:["\u827A\u672F\u5BB6","\u539F\u4F5C","\u8BED\u8A00","\u7248\u672C\u7279\u6027","\u789F\u7247\u6570\u91CF","\u64AD\u653E\u65F6\u957F","\u4EF7\u683C","\u53D1\u552E\u65E5"],realMovie:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u65E5","\u7247\u957F","\u7C7B\u578B","\u56FD\u5BB6/\u5730\u533A","\u8BED\u8A00","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","imdb_id","tmdb_id","tvdb_id"]},Au={Album:"Album","animanga/Anime":"Anime","animanga/Book":"Book","animanga/BookSeries":"BookSeries",Crt:"Crt",Game:"Game","animanga/Manga":"Manga","animanga/Movie":"Movie","animanga/Novel":"Novel","animanga/OVA":"OVA","Book/PhotoBook":"PhotoBook","real/Television":"TV","animanga/TVAnime":"TVAnime","doujin/Book":"doujinBook","doujin/Game":"doujinGame","doujin/Album":"doujinMusic","real/Movie":"realMovie"};function lv(){return I.theme==="dark"?"dark":I.theme==="light"?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function dv(){return I.entityType||"subject"}function Gl(){if(!I.currentSubjectData)return!1;let t=dv(),n=document.getElementById("static-wcode-input").value.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=(I.currentSubjectData.infobox||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),o=n!==r;if(t==="subject"){let l=document.getElementById("static-tags-input").value.split(" ").filter(m=>m),f=document.getElementById("static-series-checkbox").checked,u=I.currentSubjectData.metaTags||[],d=I.currentSubjectData.series||!1,c=!xu(l,u);return o||c||f!==d}return o}function Ri(){let t=document.querySelector("#static-buttons-container button#process-confirm-update");if(!t)return;Gl()?(t.textContent="\u786E\u8BA4\u66F4\u65B0",t.disabled=!1):(t.textContent="\u786E\u8BA4\u66F4\u65B0\uFF08\u65E0\u5B9E\u8D28\u4FEE\u6539\uFF09",t.disabled=!1)}function oo(t,e,n,i){let r=Object.keys(t||{}),o=[];return r.length&&o.push(`\u66F4\u65B0${r.join("\u3001")}`),(i==="subject"||!i)&&(e?.add.length&&o.push(`\u6DFB\u52A0\u6807\u7B7E${e.add.join("\u3001")}`),e?.remove.length&&o.push(`\u5220\u9664\u6807\u7B7E${e.remove.join("\u3001")}`),n?.hasUpdate&&o.push(n.newValue?"\u6807\u8BB0\u4E3A\u7CFB\u5217":"\u53D6\u6D88\u7CFB\u5217\u6807\u8BB0")),o.filter(a=>a).join("\uFF1B")||"\u66F4\u65B0\u6761\u76EE\u4FE1\u606F"}function Ko(t,e,n){try{let i=(t||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),r=(e||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),l=nf("\u7F16\u8F91\u524D",i,"\u7F16\u8F91\u540E",r,"text","text",{context:1});l.init(),l.buildSplitDiffLines();let f=document.getElementById(n);if(!f)return;let u=f._diffViewInstance;u&&Wo(u),f.innerHTML="";let d=Jr(Xs,{target:f,props:{diffFile:l,diffViewMode:I.diffViewMode==="unified"?Pt.Unified:Pt.Split,diffViewFontSize:13,diffViewTheme:lv(),diffViewHighlight:!0,diffViewWrap:!0}});f._diffViewInstance=d,n==="static-content-diff-container"&&setTimeout(()=>{let p=document.getElementById("static-wcode-input");p&&(p.style.height="")},0);let c=document.getElementById("diff-error");c&&(c.style.display="none")}catch(i){console.error("Diff generation error:",i);let r=document.getElementById("diff-error");r&&(r.textContent=`\u5DEE\u5F02\u663E\u793A\u9519\u8BEF: ${i.message}`,r.style.display="block")}}function Zs(t,e,n){let i=t.join(" "),r=e.join(" ");Ko(i,r,n)}function Lu(t,e){let n={};return Object.keys(t).forEach(i=>{if(!["id","tags","series","type"].includes(i.toLowerCase())){let r=t[i];r!==void 0&&(n[i]=r)}}),n}function ku(t,e){if(I.entityType!=="subject")return{add:[],remove:[]};let i=(t.tags||"").split(" ").filter(a=>a),r=[],o=[];return i.forEach(a=>{a.startsWith("-")?o.push(a.slice(1)):r.push(a)}),{add:r,remove:o}}function Su(t,e){if(I.entityType!=="subject")return{hasUpdate:!1};if(t.series===void 0||t.series===null||t.series==="")return{hasUpdate:!1};let n=t.series.trim().toLowerCase(),i=n==="true"||n==="1"||n==="yes";return{hasUpdate:i!==e,newValue:i}}function fv(t){let e=t.match(/{{Infobox\s+(.+?)$/m);return e&&Au[e[1]]||null}function cv(t,e,n){for(let i=1;i<t.length;i++){let r=t[i].match(/^\|([^|=]+?)\s*=/);if(r&&e.indexOf(r[1])>n)return i}return t.length-1}function Iu(t,e){let n=fv(t),i=n?Eu[n]:null,r=t,o=[];if(Object.entries(e).forEach(([a,l])=>{l=l.replaceAll("\\n",`
`);let f=new RegExp(`\\|${bu(a)}\\s*=.*`,"i");f.test(r)?r=r.replace(f,`|${a}= ${l}`):o.push({field:a,value:l,fieldIdx:i?i.indexOf(a):-1})}),o.length>0){i&&o.sort((l,f)=>l.fieldIdx===-1&&f.fieldIdx===-1?0:l.fieldIdx===-1?1:f.fieldIdx===-1?-1:l.fieldIdx-f.fieldIdx);let a=r.split(`
`);for(let l=o.length-1;l>=0;l--){let f=o[l];i&&f.fieldIdx>=0?a.splice(cv(a,i,f.fieldIdx),0,`|${f.field}= ${f.value}`):a.splice(-1,0,`|${f.field}= ${f.value}`)}r=a.join(`
`)}return r}function Nu(t,e){let n=new Set(t);return e.add.forEach(i=>n.add(i)),e.remove.forEach(i=>n.delete(i)),[...n]}var Cu=id($u());function Du(t,e){try{I.csvData=uv(t),I.currentIndex=0,I.retryCount={},I.previousItem=null,localStorage.setItem("bgmCsvData",JSON.stringify(I.csvData)),localStorage.setItem("bgmCurrentIndex","0"),Oi(),en(e+"\u52A0\u8F7D\u6210\u529F")}catch(n){en("CSV\u89E3\u6790\u9519\u8BEF: "+n.message),console.error(n)}finally{vn(),document.querySelectorAll("#static-buttons-container button").forEach(n=>{n.disabled=!1})}}function Tu(t){let n=t.target.files?.[0];if(!n)return;document.querySelectorAll("#static-buttons-container button").forEach(r=>{r.disabled=!0}),Ui("\u6B63\u5728\u89E3\u6790CSV\u6587\u4EF6...");let i=new FileReader;i.onload=function(r){let o=r.target.result;Du(o,"CSV\u6587\u4EF6")},i.readAsText(n)}function Fu(t){document.querySelectorAll("#static-buttons-container button").forEach(e=>{e.disabled=!0}),Ui("\u6B63\u5728\u89E3\u6790\u7C98\u8D34\u7684CSV..."),Du(t,"\u7C98\u8D34\u7684CSV")}function uv(t){let e=Cu.default.parse(t,{header:!0,skipEmptyLines:!0,transform:a=>a.trim()});if(e.errors.length){let a=e.errors[0];throw new Error(`\u7B2C${a.row!==void 0?a.row+1:"?"}\u884C: ${a.message}`)}let n=e.meta.fields;if(!n||n.length===0)throw new Error("CSV\u6587\u4EF6\u4E3A\u7A7A\u6216\u683C\u5F0F\u9519\u8BEF");let i=n.find(a=>/^(person_id|character_id|id)$/i.test(a));if(!i)throw new Error('CSV\u5FC5\u987B\u5305\u542B"id"\u3001"person_id"\u6216"character_id"\u5217');I.entityType="subject",/^person_id$/i.test(i)?I.entityType="person":/^character_id$/i.test(i)&&(I.entityType="character");let r=n.filter(a=>a!==i),o=[];for(let a of e.data){let l=a[i]?.trim();if(!l)continue;let f={id:l};for(let u of r){let d=a[u];d!==void 0&&(f[u]=d.trim())}o.push(f)}if(o.length===0)throw new Error("\u672A\u627E\u5230\u6709\u6548\u7684\u6570\u636E\u884C");return o}function Oi(){I.currentView="setup";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container");document.getElementById("edit-regions").style.display="none",rd(),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">\u57FA\u672C\u8BBE\u7F6E</h3>
                <div class="setup-columns">
                    <div class="setup-column">
                        <div class="form-group">
                            <label>\u63D0\u4EA4\u65B9\u5F0F\u9009\u62E9</label>
                            <div class="method-option-group">
                                <input type="radio" id="method-patch" name="submit-method" value="patch" ${I.submitMethod==="patch"?"checked":""}>
                                <label for="method-patch">Private API</label>
                                <input type="radio" id="method-post" name="submit-method" value="post" ${I.submitMethod==="post"?"checked":""}>
                                <label for="method-post">\u65E7 API</label>
                            </div>
                        </div>

                        <div id="patch-method-options" class="form-group ${I.submitMethod==="patch"?"":"hidden"}">
                            <label for="setup-access-token">Access Token</label>
                            <input type="password" id="setup-access-token" value="${I.accessToken}">
                            <p class="formhash-hint">
                                \u5728<a href="https://next.bgm.tv/demo/access-token" target="_blank">\u4E2A\u4EBA\u4EE4\u724C\u9875</a>\u83B7\u53D6 Access Token<br>
                                \u9650\u901F\u4E25\u91CD\u53EF\u5207\u6362\u4E3A\u65E7 API
                            </p>
                        </div>

                        <div id="post-method-options" class="form-group ${I.submitMethod==="post"?"":"hidden"}">
                            <label for="setup-formhash">Formhash</label>
                            <div style="display:flex;gap:8px">
                                <input type="text" id="setup-formhash" value="${I.formhash}" style="flex:1">
                                <button type="button" class="secondary" id="setup-fetch-formhash"><i class="fas fa-magic"></i> \u81EA\u52A8\u83B7\u53D6</button>
                            </div>
                            <p class="formhash-hint">
                                \u5982\u4F55\u83B7\u53D6formhash\uFF1A<br>
                                1. \u6253\u5F00\u6761\u76EE\u7F16\u8F91\u9875\u9762\uFF08\u5982 <a href="https://bgm.tv/subject/354667/edit_detail">https://bgm.tv/subject/354667/edit_detail</a>\uFF09<br>
                                2. \u5728\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u6267\u884C\uFF1A<code>document.querySelector('[name=formhash]').value</code><br>
                                3. \u5C06\u8FD4\u56DE\u7684\u503C\u590D\u5236\u5230\u4E0A\u65B9\u8F93\u5165\u6846<br>
                                <strong>\u81EA\u52A8\u83B7\u53D6</strong>\uFF1A\u901A\u8FC7\u540E\u53F0\u8BF7\u6C42\u7F16\u8F91\u9875\u9762\u81EA\u52A8\u63D0\u53D6 formhash\uFF08\u9700\u5DF2\u767B\u5F55\uFF09
                            </p>
                        </div>

                        <div class="form-group">
                            <label>Diff \u663E\u793A\u6A21\u5F0F</label>
                            <div class="method-option-group">
                                <input type="radio" id="diff-mode-split" name="diff-view-mode" value="split" ${I.diffViewMode==="split"?"checked":""}>
                                <label for="diff-mode-split">\u5DE6\u53F3\u5BF9\u7167</label>
                                <input type="radio" id="diff-mode-unified" name="diff-view-mode" value="unified" ${I.diffViewMode==="unified"?"checked":""}>
                                <label for="diff-mode-unified">\u4E0A\u4E0B\u7EDF\u4E00</label>
                            </div>
                        </div>
                    </div>
                    <div class="setup-column">
                        <div class="form-group">
                            <label for="setup-csv-file">CSV\u6587\u4EF6 (\u5305\u542BID\u5217\u3001\u8981\u66F4\u65B0\u7684\u5B57\u6BB5\u5217\u3001tags\u5217\u6216series\u5217)</label>
                            <div class="file-upload-group">
                                <button type="button" class="secondary" id="setup-csv-btn">
                                    <i class="fas fa-upload"></i> \u9009\u62E9 CSV \u6587\u4EF6
                                </button>
                                <button type="button" class="secondary" id="setup-paste-csv-btn">
                                    <i class="fas fa-paste"></i> \u4ECE\u526A\u8D34\u677F\u7C98\u8D34
                                </button>
                                <span class="file-upload-name" id="setup-csv-file-name"></span>
                            </div>
                            <input type="file" id="setup-csv-file" accept=".csv" class="file-upload-input">
                            ${I.csvData?`<div class="csv-loaded-info">\u5DF2\u52A0\u8F7DCSV: ${I.csvData.length} \u6761\u8BB0\u5F55</div>`:""}
                            <p class="csv-hint">
                                \u5FC5\u5907ID\u5217\uFF0C\u6761\u76EEid\uFF0C\u4EBA\u7269person_id\uFF0C\u89D2\u8272character_id<br>
                                tags\u5217\u4F7F\u7528\u7A7A\u683C\u5206\u9694\u6807\u7B7E\uFF0C\u524D\u7F00\u5E26"-"\u7684\u6807\u7B7E\u8868\u793A\u5220\u9664\u8BE5\u6807\u7B7E<br>
                                series\u5217\u4F7F\u7528true\u6216false\u8868\u793A\u662F\u5426\u6807\u8BB0\u4E3A\u7CFB\u5217<br>
                                \u53EF\u4F7F\u7528 <a href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/bgq" target="_blank">Bangumi Query</a> \u8F85\u52A9\u751F\u6210\uFF08<a href="https://bgq.iccci.cc.cd" target="_blank">demo</a>\uFF09
                            </p>
                        </div>
                        ${I.csvData?`
                        <div class="form-group">
                            <label>\u5904\u7406\u8FDB\u5EA6</label>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${I.currentIndex/I.csvData.length*100}%"></div>
                            </div>
                            <div class="progress-info">\u4E0A\u6B21\u8FDB\u5EA6: ${I.currentIndex}/${I.csvData.length}</div>
                            <button id="setup-reset-progress" class="secondary" style="margin-top: 10px;">\u91CD\u7F6E\u8FDB\u5EA6</button>
                        </div>
                        `:""}
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="setup-start-processing" class="primary">\u5F00\u59CB\u5904\u7406</button>
        `);let n=document.getElementById("setup-access-token");n&&n.addEventListener("input",d=>{I.accessToken=d.target.value,GM_setValue("bgmAccessToken",I.accessToken)});let i=document.getElementById("setup-formhash");i&&i.addEventListener("input",d=>{I.formhash=d.target.value,GM_setValue("bgmFormhash",I.formhash)});let r=document.getElementById("setup-fetch-formhash");r&&r.addEventListener("click",()=>{i&&(r.disabled=!0,r.innerHTML='<i class="fas fa-spinner fa-pulse"></i> \u83B7\u53D6\u4E2D...',GM.xmlHttpRequest({method:"GET",url:"https://bgm.tv/subject/1/edit_detail",onload:d=>{try{let c=d.responseText.match(/<input[^>]*name="formhash"[^>]*value="([^"]+)"/);c&&c[1]?(I.formhash=c[1],GM_setValue("bgmFormhash",I.formhash),i.value=c[1]):alert("\u65E0\u6CD5\u4ECE\u9875\u9762\u63D0\u53D6 formhash\uFF0C\u8BF7\u786E\u4FDD\u5DF2\u767B\u5F55 Bangumi")}catch{alert("\u89E3\u6790\u7F16\u8F91\u9875\u9762\u5931\u8D25")}finally{r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> \u81EA\u52A8\u83B7\u53D6'}},onerror:()=>{alert("\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u83B7\u53D6 formhash"),r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> \u81EA\u52A8\u83B7\u53D6'}}))}),document.querySelectorAll('input[name="submit-method"]').forEach(d=>{d.addEventListener("change",c=>{I.submitMethod=c.target.value,GM_setValue("bgmSubmitMethod",I.submitMethod);let p=document.getElementById("patch-method-options"),m=document.getElementById("post-method-options");p&&p.classList.toggle("hidden",I.submitMethod!=="patch"),m&&m.classList.toggle("hidden",I.submitMethod!=="post")})}),document.querySelectorAll('input[name="diff-view-mode"]').forEach(d=>{d.addEventListener("change",c=>{I.diffViewMode=c.target.value,localStorage.setItem("bgmDiffViewMode",I.diffViewMode)})});let l=document.getElementById("setup-csv-file");l&&(l.addEventListener("change",Tu),l.addEventListener("change",()=>{let d=l.files?.[0]?.name||"",c=document.getElementById("setup-csv-file-name");c&&(c.textContent=d)}));let f=document.getElementById("setup-csv-btn");f&&l&&f.addEventListener("click",d=>{d.preventDefault(),l.click()});let u=document.getElementById("setup-paste-csv-btn");u&&u.addEventListener("click",async()=>{try{let d=await navigator.clipboard.readText();if(!d||!d.trim()){en("\u526A\u8D34\u677F\u5185\u5BB9\u4E0D\u662F\u6709\u6548\u7684CSV");return}let c=document.getElementById("setup-csv-file-name");c&&(c.textContent="\u5DF2\u4ECE\u526A\u8D34\u677F\u7C98\u8D34"),Fu(d)}catch(d){en("\u8BFB\u53D6\u526A\u8D34\u677F\u5931\u8D25: "+d.message)}})}function Mu(t){I.currentView="processing";let{currentItem:e,wikiData:n,historyData:i}=t;I.currentSubjectData=n,I.currentItemId=e.id;let r=I.entityType||"subject";I.currentWcode=null,I.currentTags=null,I.currentSeries=null,I.currentCommitMessage=null;let o=document.getElementById("core-content"),a=document.getElementById("static-buttons-container"),l=document.getElementById("edit-regions");l&&(l.style.display="block"),fo(),ji(I.currentIndex,I.totalItems);let f=n.name||"\u672A\u77E5\u540D\u79F0",u=n.infobox||"",d=r==="subject"?n.metaTags||[]:[],c=r==="subject"&&n.series||!1,p=Lu(e,u),m=ku(e,d),g=Su(e,c);I.currentFieldUpdates=p,I.currentTagUpdates=m,I.currentSeriesUpdate=g;let x={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"},b=document.getElementById("static-last-update"),_=i[0]?.createdAt,L=_?new Date(_*1e3):null,y=i[0]?.creator?.username||"",N=i[0]?.commitMessage||"",S=yu(_);if(L&&b){let{editPagePath:F}=Pi(r,e.id);b.innerHTML=`
            <a href="${F}" target="_blank">
                \u6700\u540E\u66F4\u65B0: ${L.toLocaleString()} ${y} ${N}
            </a>
        `,b.style.color=S?"#d9534f":"",b.style.display="block"}else b&&(b.style.display="none");let E=document.getElementById("prev-item-link");if(E&&I.previousItem&&I.currentIndex>0){let F=I.previousItem.type,{editPagePath:V}=Pi(F,I.previousItem.id);E.innerHTML=`
            <i class="fas fa-arrow-left"></i> \u4E0A\u4E00\u4E2A:
            <a href="${V}" target="_blank">
                ${I.previousItem.name}\uFF08${I.previousItem.id}\uFF09
            </a>
        `,E.style.display="block"}else E&&(E.style.display="none");let h=document.getElementById("static-commit-input"),w=document.getElementById("static-lock-commit"),A=oo(p,m,g,r);h.value=I.isCommitMessageLocked?I.lockedCommitMessage:A,w.innerHTML=`<i class="fas ${I.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>`,w.title=I.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981";let T=document.getElementById("static-wcode-input"),M=document.getElementById("static-content-diff-container"),U=Iu(u,p);T.value=U,Ko(u,U,"static-content-diff-container"),M&&(M.style.display="block");let P=document.getElementById("static-tags-area"),J=document.getElementById("static-tags-diff-section");if(r==="subject"){let F=document.getElementById("static-tags-input"),V=Nu(d,m);F.value=V.join(" "),Zs(d,V,"static-tags-diff-container"),P&&(P.style.display="block"),J&&(J.style.display="block")}else P&&(P.style.display="none"),J&&(J.style.display="none");let ee=document.getElementById("static-series-area");if(r==="subject"){let F=document.getElementById("static-series-checkbox"),V=g.hasUpdate?g.newValue:c;F.checked=V,I.currentSeries=V,ee&&(ee.style.display="block")}else ee&&(ee.style.display="none");let re=Pi(r,e.id).editPagePath.replace("/edit",""),q=x[r]||"\u6761\u76EE";o&&(o.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${q}\uFF1A<a href="${re}" target="_blank">${f}</a>\uFF08${e.id}\uFF09[${q}]
                </div>
            </div>
        `),a&&(a.innerHTML=`
            <button id="process-skip-update" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-confirm-update" class="primary">\u786E\u8BA4\u66F4\u65B0</button>
        `),Ri()}function Hu(t,e){I.currentView="processing";let n=document.getElementById("core-content"),i=document.getElementById("static-buttons-container"),r=document.getElementById("edit-regions");r&&(r.style.display="none"),fo(),ji(I.currentIndex,I.totalItems);let o=t.id,l={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[I.entityType]||"\u6761\u76EE",f=(I.retryCount[o]||0)+1;I.retryCount[o]=f,n&&(n.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${l}\uFF1A<a href="https://bgm.tv/${I.entityType}/${o}" target="_blank">\u67E5\u770B${l}</a>\uFF08${o}\uFF09
                </div>
                <div class="status-box error">
                    \u65E0\u6CD5\u83B7\u53D6${l}\u4FE1\u606F: ${e}
                    ${f>1?`<br>\u5DF2\u91CD\u8BD5 ${f-1} \u6B21`:""}
                </div>
                <p>\u662F\u5426\u7EE7\u7EED\u5904\u7406\uFF1F</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${I.currentIndex/I.totalItems*100}%"></div>
                </div>
            </div>
        `),i&&(i.innerHTML=`
            <button id="process-skip-error" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-error" class="primary">\u91CD\u8BD5</button>
        `)}function Bu(t){I.currentView="processing";let e=document.getElementById("core-content"),n=document.getElementById("static-buttons-container"),i=document.getElementById("edit-regions");i&&(i.style.display="none"),fo(),ji(I.currentIndex,I.totalItems);let r=I.currentItemId||"",o=(I.retryCount[r]||0)+1;I.retryCount[r]=o;let l=I.currentSubjectData?.name||"\u672A\u77E5\u540D\u79F0",u={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[I.entityType]||"\u6761\u76EE";e&&(e.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${u}\uFF1A<a href="https://bgm.tv/${I.entityType}/${r}" target="_blank">${l}</a>\uFF08${r}\uFF09
                </div>
                <div class="status-box error">
                    \u63D0\u4EA4\u66F4\u65B0\u5931\u8D25: ${t}
                </div>
                <p>\u662F\u5426\u91CD\u8BD5\u66F4\u65B0\uFF1F</p>
            </div>
        `),n&&(n.innerHTML=`
            <button id="process-skip-update-fail" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-update" class="primary">\u91CD\u8BD5</button>
        `)}function Ru(){I.currentView="completed";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container"),n=document.getElementById("edit-regions");n&&(n.style.display="none"),fo(),ji(I.totalItems,I.totalItems),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">\u5904\u7406\u5B8C\u6210</h3>
                <div class="status-box info">\u6240\u6709\u6761\u76EE\u5904\u7406\u5B8C\u6BD5</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">\u603B\u6761\u76EE</span>
                        <span class="stats-value">${I.totalItems}</span>
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="completed-back-to-setup" class="primary">\u8FD4\u56DE\u8BBE\u7F6E</button>
        `)}function pv(t){let e=t.trim();if(!e)return new Headers;let n=e.split(`\r
`).map(i=>{let r=i.split(":");return[r[0].trim(),r[1].trim()]});return new Headers(n)}function hv(t,e){let n=pv(e.responseHeaders),i=typeof e.response=="string"?new Blob([e.response],{type:n.get("Content-Type")||"text/plain"}):e.response;return new Yl(i,{statusCode:e.status,statusText:e.statusText,headers:n,finalUrl:e.finalUrl,redirected:e.finalUrl===t.url})}var Yl=class t{constructor(e,n){this.rawBody=e,this.init=n,this.body=e.stream();let{headers:i,statusCode:r,statusText:o,finalUrl:a,redirected:l}=n;this.headers=i,this.status=r,this.statusText=o,this.url=a,this.type="basic",this.redirected=l,this._bodyUsed=!1}get bodyUsed(){return this._bodyUsed}get ok(){return this.status<300}arrayBuffer(){if(this.bodyUsed)throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.arrayBuffer()}blob(){if(this.bodyUsed)throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");return this._bodyUsed=!0,Promise.resolve(this.rawBody.slice(0,this.rawBody.size,this.rawBody.type))}clone(){if(this.bodyUsed)throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");return new t(this.rawBody,this.init)}formData(){if(this.bodyUsed)throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text().then(mv)}async json(){if(this.bodyUsed)throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");return this._bodyUsed=!0,JSON.parse(await this.rawBody.text())}text(){if(this.bodyUsed)throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text()}async bytes(){if(this.bodyUsed)throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");return this._bodyUsed=!0,new Uint8Array(await this.rawBody.arrayBuffer())}};function mv(t){let e=new FormData;return t.trim().split("&").forEach(function(n){if(n){let i=n.split("="),r=i.shift()?.replace(/\+/g," "),o=i.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}async function ea(t,e){let n=new Request(t,e),i;return e?.body&&(i=await n.text()),await gv(n,e,i)}function gv(t,e,n){return new Promise((i,r)=>{if(t.signal&&t.signal.aborted)return r(new DOMException("Aborted","AbortError"));GM.xmlHttpRequest({url:t.url,method:wv(t.method.toUpperCase()),headers:Object.fromEntries(new Headers(e?.headers).entries()),data:n,responseType:"blob",onload(o){try{i(hv(t,o))}catch(a){r(a)}},onabort(){r(new DOMException("Aborted","AbortError"))},ontimeout(){r(new TypeError("Network request failed, timeout"))},onerror(o){r(new TypeError("Failed to fetch: "+o.finalUrl))}})})}var vv=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function _v(t,e){return t.includes(e)}function wv(t){if(_v(vv,t))return t;throw new Error(`unsupported http method ${t}`)}function Ou(){if(I.submitMethod==="patch"&&!I.accessToken){en("\u8BF7\u8F93\u5165Access Token");return}if(I.submitMethod==="post"&&!I.formhash){en("\u8BF7\u8F93\u5165Formhash");return}if(!I.csvData||I.csvData.length===0){en("\u8BF7\u4E0A\u4F20\u6709\u6548\u7684CSV\u6587\u4EF6");return}I.totalItems=I.csvData.length,I.processing=!0,I.paused=!1;let t=document.getElementById("core-content");t&&(t.innerHTML=`
            <div>
                <div class="item-info">\u51C6\u5907\u5904\u7406\u7B2C\u4E00\u4E2A\u6761\u76EE...</div>
            </div>
        `);let e=document.getElementById("static-buttons-container");e&&(e.innerHTML=`
            <button id="process-cancel" class="danger">\u53D6\u6D88</button>
        `),ci()}function ci(t=!1){if(I.paused||!I.processing)return;if(I.currentIndex>=I.totalItems){Ru();return}let e=I.csvData[I.currentIndex],n=I.entityType||"subject";t||ji(I.currentIndex,I.totalItems),document.querySelectorAll("#static-buttons-container button").forEach(a=>{a.disabled=!0}),Ui("\u6B63\u5728\u83B7\u53D6\u6761\u76EE\u4FE1\u606F...");let{wikiPath:i,historyPath:r}=Pi(n,e.id),o=I.submitMethod==="patch"?{Authorization:`Bearer ${I.accessToken}`,Accept:"application/json"}:{Accept:"application/json"};Promise.all([ea(i,{headers:o}),ea(r,{headers:o})]).then(async([a,l])=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);if(!l.ok)throw new Error(`HTTP ${l.status}`);let f=await a.json(),u=await l.json();return{currentItem:e,wikiData:f,historyData:u}}).then(a=>{I.retryCount[a.currentItem.id]=0,vn(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Mu(a)}).catch(a=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Hu(e,a.message)})}function Pu(t,e,n,i,r,o,a,l,f){I.processing=!0;let u=I.entityType||"subject";if(I.submitMethod==="patch"){let{wikiPath:d,patchBodyKey:c}=Pi(u,t),p={commitMessage:a};u==="subject"?p.subject={infobox:e,metaTags:n,series:i}:p[c]={infobox:e},ea(d,{method:"PATCH",headers:{Authorization:`Bearer ${I.accessToken}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(p)}).then(m=>m.ok?m:m.text().then(g=>{throw new Error(`HTTP ${m.status} - ${g||"\u66F4\u65B0\u5931\u8D25"}`)})).then(()=>{vn(),l()}).catch(m=>{f(m instanceof Error?m:new Error(String(m)))})}else{let d=e.replace(/\n/g,`\r
`),c=new FormData;if(c.append("formhash",I.formhash),c.append("editSummary",a),u==="subject")c.append("subject_title",I.currentSubjectData?.name||""),c.append("platform",I.currentSubjectData?.platform||""),c.append("subject_infobox",d),c.append("subject_summary",I.currentSubjectData?.summary||""),c.append("subject_meta_tags",n.join(" ")),c.append("series",i?"1":"0"),c.append("submit","\u63D0\u4EA4");else if(u==="person"){c.append("crt_name",I.currentSubjectData?.name||""),c.append("crt_infobox",d),c.append("crt_summary",I.currentSubjectData?.summary||"");let g=I.currentSubjectData?.profession;if(g)for(let[x,b]of Object.entries(g))b&&c.append(`prsn_pro[${x}]`,"1");c.append("picfile",""),c.append("submit","\u6539\u597D\u4E86")}else c.append("crt_name",I.currentSubjectData?.name||""),c.append("crt_infobox",d),c.append("crt_summary",I.currentSubjectData?.summary||""),c.append("picfile",""),c.append("submit","\u6539\u597D\u4E86");let p=new URLSearchParams;c.forEach((g,x)=>{p.append(x,g)});let m=u==="subject"?`https://bgm.tv/subject/${t}/new_revision`:`https://bgm.tv/${u}/${t}/edit`;GM.xmlHttpRequest({method:"POST",url:m,data:p.toString(),headers:{"Content-Type":"application/x-www-form-urlencoded"},onload:function(g){vn(),g.finalUrl===m?f(new Error("\u66F4\u65B0\u5931\u8D25\uFF0C\u53EF\u80FD\u662Fformhash\u65E0\u6548\u6216\u6743\u9650\u4E0D\u8DB3")):l()},onerror:function(g){vn(),f(new Error(`\u7F51\u7EDC\u9519\u8BEF: ${g.message}`))},onabort:function(){vn(),f(new Error("\u8BF7\u6C42\u5DF2\u4E2D\u6B62"))},ontimeout:function(){vn(),f(new Error("\u8BF7\u6C42\u8D85\u65F6"))}})}}function ju(t){switch(t){case"setup-start-processing":Ou();break;case"setup-reset-progress":I.currentIndex=0,I.retryCount={},I.previousItem=null,localStorage.setItem("bgmCurrentIndex","0"),Oi();break}}function Uu(t){if(!I.csvData)return;let e=I.csvData[I.currentIndex],n=I.currentSubjectData,i=e?.id||I.currentItemId||"",r=n?.name||"\u672A\u77E5\u540D\u79F0",o=I.entityType||"subject";function a(){return{id:i,name:r,type:o}}switch(t){case"process-confirm-update":{let l=document.getElementById("static-wcode-input").value,f=o==="subject"?document.getElementById("static-tags-input").value.split(" ").filter(p=>p):[],u=o==="subject"?document.getElementById("static-series-checkbox").checked:!1,d=document.getElementById("static-commit-input").value||oo(I.currentFieldUpdates,I.currentTagUpdates,I.currentSeriesUpdate,o);if(!Gl()){en("\u6CA1\u6709\u68C0\u6D4B\u5230\u5B9E\u8D28\u4FEE\u6539\uFF0C\u5DF2\u8DF3\u8FC7\u66F4\u65B0"),I.previousItem=a(),I.currentIndex++,pr(),Gn(),ci();return}document.querySelectorAll("#static-buttons-container button").forEach(p=>{p.disabled=!0}),Ui("\u6B63\u5728\u63D0\u4EA4\u66F4\u65B0..."),Pu(i,l,f,u,r,e,d,()=>{I.previousItem=a(),I.currentIndex++,pr(),Gn(),ci()},p=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(m=>{m.disabled=!1}),Bu(p.message)});break}case"process-skip-update":I.previousItem=a(),I.currentIndex++,pr(),Gn(),ci();break;case"process-confirm-continue":I.previousItem=a(),I.currentIndex++,pr(),Gn(),ci();break;case"process-skip-error":I.currentIndex++,pr(),Gn(),ci();break;case"process-retry-error":{let l=I.retryCount[i]||0;en(`\u6B63\u5728\u91CD\u8BD5\uFF08${l}\u6B21\uFF09...`),ci();break}case"process-skip-update-fail":I.previousItem=a(),I.currentIndex++,pr(),Gn(),ci();break;case"process-retry-update":{let l=I.retryCount[i]||0;en(`\u6B63\u5728\u91CD\u8BD5\uFF08${l}\u6B21\uFF09...`),ci(!0);break}}}function Wu(t){t==="completed-back-to-setup"&&(Oi(),bv())}function bv(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}var zu="data:image/png;base64,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";var Jl=["light","dark","system"],Qu=7,xv=40,ta=Math.floor(Math.random()*Qu),na="bgm-tool-container",yv="bgm-float-button",so=null;function ql(){if(so)return;so=[];let t=Array.from(document.body.children);for(let e of t){let n=e.id;n===na||n===yv||e.tagName!=="SCRIPT"&&(so.push({el:e,origDisplay:e.style.display||""}),e.style.display="none")}}function Ev(){if(so){for(let{el:t,origDisplay:e}of so)t.style.display=e;so=null}}function Av(){ta=(ta+1)%Qu;let t=document.getElementById("bgm-tool-logo-sprite");t&&(t.style.backgroundPosition=`${-ta*xv}px 0`)}function Kl(t){let e=document.getElementById("bgm-tool-container");if(!e)return;t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches?e.setAttribute("data-theme","dark"):e.removeAttribute("data-theme")}function Lv(){let t=Jl.indexOf(I.theme);I.theme=Jl[(t+1)%Jl.length],localStorage.setItem("bgmTheme",I.theme),Kl(I.theme),Vu()}function Vu(){let t=document.getElementById("bgm-tool-theme");if(!t)return;let e={light:'<i class="fas fa-sun"></i>',dark:'<i class="fas fa-moon"></i>',system:'<i class="fas fa-adjust"></i>'};t.innerHTML=e[I.theme]||e.system,t.title="\u4E3B\u9898: "+I.theme}function Gu(){let t=document.getElementById("bgm-float-button");return t||(t=document.createElement("div"),t.id="bgm-float-button",t.innerHTML='<i class="fas fa-tools"></i>',document.body.appendChild(t),t.addEventListener("click",()=>{let e=document.getElementById(na);e&&(e.style.display="flex",ql(),t&&(t.style.display="none"))})),t}function Yu(){let t=Gu();if(t.style.display="none",document.getElementById(na)){document.getElementById(na).style.display="flex",ql();return}let e=document.createElement("div");e.id="bgm-tool-container",e.innerHTML=`
        <div id="bgm-tool-header">
            <div id="bgm-tool-header-logo">
                <div id="bgm-tool-logo-sprite" style="background: url(${zu}) no-repeat; background-size: 280px 75px; background-position: ${-ta*40}px 0;"></div>
                <span>\u6279\u91CF\u66F4\u65B0</span>
            </div>
            <span class="header-spacer"></span>
            <div id="bgm-tool-header-actions">
                <span id="bgm-tool-theme" title="\u4E3B\u9898"><i class="fas fa-adjust"></i></span>
                <span id="bgm-tool-settings" title="\u8BBE\u7F6E"><i class="fas fa-cog"></i></span>
                <span id="bgm-tool-close"><i class="fas fa-sign-out-alt"></i></span>
            </div>
        </div>
        <div id="bgm-tool-progress">
            <div id="progress-inner">
                <span id="progress-text">\u5904\u7406\u8FDB\u5EA6: 0/0</span>
                <div id="progress-bar-container">
                    <div id="progress-bar"></div>
                </div>
            </div>
        </div>
        <div class="loading-container">
            <div id="bgm-tool-body">
                <div id="core-content"></div>
                <div id="edit-regions">
                    <div class="prev-item-link" id="prev-item-link"></div>

                    <div class="last-update-info" id="static-last-update"></div>
                    <div class="commit-message-area" id="static-commit-area">
                        <label>\u7F16\u8F91\u6458\u8981:</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="static-commit-input" placeholder="\u8BF7\u8F93\u5165\u7F16\u8F91\u6458\u8981" style="flex-grow: 1;">
                            <button id="static-lock-commit" class="secondary" title="${I.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981"}">
                                <i class="fas ${I.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>
                            </button>
                        </div>
                    </div>
                    <div class="edit-rows">
                        <div class="edit-row">
                            <div class="edit-area" id="static-wcode-area">
                                <label>Wcode:</label>
                                <textarea id="static-wcode-input"></textarea>
                            </div>
                            <div>
                                <div class="diff-section-label">Wcode \u53D8\u66F4</div>
                                <div class="diff-section wcode-diff-section">
                                    <div id="static-content-diff-container" class="diff-container"></div>
                                </div>
                            </div>
                        </div>
                        <div class="edit-row">
                            <div class="tags-edit-area" id="static-tags-area">
                                <label>\u6807\u7B7E (\u7A7A\u683C\u5206\u9694):</label>
                                <input type="text" id="static-tags-input">
                            </div>
                            <div class="diff-section tags-diff-section" id="static-tags-diff-section">
                                <div class="diff-section-title">\u6807\u7B7E\u53D8\u66F4</div>
                                <div id="static-tags-diff-container" class="diff-container"></div>
                            </div>
                        </div>
                        <div class="edit-row edit-row-series">
                            <div class="series-edit-area" id="static-series-area">
                                <input type="checkbox" id="static-series-checkbox">
                                <label for="static-series-checkbox" style="display: inline-flex; align-items: center;">\u6807\u8BB0\u4E3A\u7CFB\u5217</label>
                            </div>
                        </div>
                    </div>
                    <div id="diff-error" style="color: #a72e2e; font-size: 14px; margin-top: 8px; display: none;"></div>
                    <div id="status-container" class="status-box"></div>
                </div>
            </div>
            <div class="buttons-container" id="static-buttons-container"></div>
            <div id="bgm-loading-overlay">
                <div id="loading-spinner"></div>
                <div id="loading-text"></div>
            </div>
        </div>
        <div id="bgm-status-message"></div>
    `,document.body.appendChild(e),ql(),kv();let n=document.getElementById("bgm-tool-close");n&&n.addEventListener("click",()=>{e.style.display="none",Ev();let a=Gu();a.style.display="flex",od(),Gn()});let i=document.getElementById("bgm-tool-settings");i&&i.addEventListener("click",()=>{Oi()});let r=document.getElementById("bgm-tool-theme");r&&r.addEventListener("click",Lv);let o=document.getElementById("bgm-tool-header-logo");o&&o.addEventListener("click",Av),Kl(I.theme),Vu(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{I.theme==="system"&&Kl("system")}),Sv(),Oi()}function kv(){let t=document.getElementById("static-buttons-container");t&&t.addEventListener("click",e=>{let n=e.target.closest("button");if(!n)return;let i=n.id;switch(I.currentView){case"setup":ju(i);break;case"processing":Uu(i);break;case"completed":Wu(i);break}})}function Sv(){document.getElementById("static-commit-input").addEventListener("input",o=>{I.currentView==="processing"&&I.currentSubjectData&&(I.currentCommitMessage=o.target.value,Ri())});let e=document.getElementById("static-lock-commit");e.addEventListener("click",()=>{if(I.currentView!=="processing"||!I.currentSubjectData)return;I.isCommitMessageLocked=!I.isCommitMessageLocked;let o=document.getElementById("static-commit-input");I.isCommitMessageLocked?(I.lockedCommitMessage=o.value,e.innerHTML='<i class="fas fa-lock"></i>',e.title="\u89E3\u9501\u7F16\u8F91\u6458\u8981"):(e.innerHTML='<i class="fas fa-lock-open"></i>',e.title="\u56FA\u5B9A\u7F16\u8F91\u6458\u8981",I.currentCommitMessage=oo(I.currentFieldUpdates,I.currentTagUpdates,I.currentSeriesUpdate,I.entityType),o.value=I.currentCommitMessage),Gn(),Ri()}),document.getElementById("static-wcode-input").addEventListener("input",o=>{I.currentView==="processing"&&I.currentSubjectData&&(I.currentWcode=o.target.value,Ko(I.currentSubjectData.infobox||"",o.target.value,"static-content-diff-container"),Ri())}),document.getElementById("static-tags-input").addEventListener("input",o=>{I.currentView==="processing"&&I.currentSubjectData&&(I.currentTags=o.target.value,Zs(I.currentSubjectData.metaTags||[],o.target.value.split(" ").filter(a=>a),"static-tags-diff-container"),Ri())}),document.getElementById("static-series-checkbox").addEventListener("change",o=>{I.currentView==="processing"&&I.currentSubjectData&&(I.currentSeries=o.target.checked,Ri())})}var Ju=`/* stylelint-disable no-descending-specificity */

/* ===== CSS Variables & Layout (scoped to container) ===== */
#bgm-tool-container {
    --accent: #f09199;
    --accent-hover: #e07a85;
    --accent-light: #fef0f2;
    --accent-border: #fad4da;
    --white: #fff;
    --bg: #f7f8fa;
    --bg-alt: #f0f1f3;
    --text: #303133;
    --text-secondary: #909399;
    --text-placeholder: #c0c4cc;
    --border: #e4e7ed;
    --border-light: #ebeef5;
    --link: #0084b4;
    --link-hover: #006d96;
    --shadow-subtle: 0 0 0 2px rgb(0 0 0 / 4%);
    --transition: all 0.2s ease;
    /* stylelint-disable-next-line value-keyword-case */
    --font: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    --font-mono: "SF Mono", "Fira Code", "Cascadia Code", monospace;

    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    background: var(--bg);
    border: none;
    border-radius: 0;
    box-shadow: none;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    font-family: var(--font);
    font-size: 13px;
    color: var(--text);
    line-height: 1.6;
}

/* ===== Dark Mode ===== */
#bgm-tool-container[data-theme="dark"] {
    --accent-hover: #f5a3aa;
    --accent-light: rgb(240 145 153 / 12%);
    --accent-border: rgb(240 145 153 / 25%);
    --white: #2d2e2f;
    --bg: #1e1e1f;
    --bg-alt: #353637;
    --text: #dcdcdc;
    --text-secondary: #9a9a9a;
    --text-placeholder: #666;
    --border: #404040;
    --border-light: #383838;
    --link: #2ea6ff;
    --link-hover: #5cb8ff;
    --shadow-subtle: 0 0 0 2px rgb(255 255 255 / 4%);
}

.hidden {
    display: none !important;
}

/* ===== Header ===== */
#bgm-tool-header {
    padding: 0 36px;
    height: 56px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    box-shadow: var(--shadow-subtle);
    width: 100%;
    box-sizing: border-box;
}

@media (width < 640px) {
    #bgm-tool-header { padding: 0 16px; }
}

#bgm-tool-header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
}

#bgm-tool-logo-sprite {
    width: 40px;
    height: 50px;
    border-radius: 6px;
    flex-shrink: 0;
}

.header-spacer {
    flex: 1;
}

#bgm-tool-header-actions {
    display: flex;
    gap: 4px;
    margin-left: auto;
}

#bgm-tool-header-actions span {
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.15s;
}

#bgm-tool-header-actions span:hover {
    background: var(--accent-light);
    color: var(--accent);
}

/* ===== Progress Bar ===== */
#bgm-tool-progress {
    padding: 10px 36px;
    background: var(--white);
    border-bottom: 1px solid var(--border-light);
    display: none;
    flex-shrink: 0;
}

@media (width < 640px) {
    #bgm-tool-progress { padding: 10px 16px; }
}

#progress-inner {
    display: flex;
    align-items: center;
    gap: 12px;
}

#progress-text {
    font-size: 13px;
    color: var(--text-secondary);
    white-space: nowrap;
}

#progress-bar-container {
    flex-grow: 1;
    height: 5px;
    background: var(--bg-alt);
    border-radius: 3px;
    overflow: hidden;
}

#progress-bar {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width 0.3s ease;
}

/* ===== Toast Message ===== */
#bgm-status-message {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    border-radius: 6px;
    background: var(--text);
    color: #fff;
    font-size: 13px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
    line-height: 1.5;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

#bgm-status-message.show {
    opacity: 1;
    visibility: visible;
    animation: fade-in 0.3s forwards, fade-out 0.3s 2.7s forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translate(-50%, 20px);
    }

    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

@keyframes fade-out {
    from {
        opacity: 1;
        transform: translate(-50%, 0);
    }

    to {
        opacity: 0;
        transform: translate(-50%, 20px);
    }
}

/* ===== Buttons ===== */
#bgm-tool-container button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    padding: 0 20px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
    outline: none;
}

#bgm-tool-container button.primary {
    background: var(--accent);
    color: #fff;
}

#bgm-tool-container button.primary:hover {
    background: var(--accent-hover);
    box-shadow: 0 2px 8px rgb(240 145 153 / 30%);
}

#bgm-tool-container button.secondary {
    background: var(--white);
    color: var(--text);
    border: 1px solid var(--border);
}

#bgm-tool-container button.secondary:hover {
    color: var(--accent);
    border-color: var(--accent);
}

#bgm-tool-container button.danger {
    background: var(--white);
    color: #f56c6c;
    border: 1px solid #f56c6c;
}

#bgm-tool-container button.danger:hover {
    background: #fef0f0;
}

#bgm-tool-container button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ===== Form Controls ===== */
#bgm-tool-container .form-group {
    margin-bottom: 20px;
}

#bgm-tool-container label {
    display: block;
    margin-bottom: 4px;
    font-weight: normal;
    font-size: 13px;
    color: var(--text-secondary);
}

#bgm-tool-container input[type="radio"],
#bgm-tool-container input[type="checkbox"] {
    accent-color: var(--accent);
}

#bgm-tool-container input[type="checkbox"] {
    margin: 0;
}

#bgm-tool-container input[type="text"],
#bgm-tool-container input[type="password"] {
    width: 100%;
    height: 36px;
    padding: 0 12px;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--white);
    font-size: 13px;
    color: var(--text);
    transition: var(--transition);
}

#bgm-tool-container input[type="text"]:focus,
#bgm-tool-container input[type="password"]:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
    outline: none;
}

/* ===== File Upload ===== */
.file-upload-group {
    display: flex;
    align-items: center;
    gap: 12px;
}

.file-upload-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
    pointer-events: none;
}

.file-upload-name {
    font-size: 13px;
    color: var(--text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ===== Status Boxes ===== */
.status-box {
    padding: 12px 16px;
    border-radius: 10px;
    margin: 12px 0;
    font-size: 13px;
}

.status-box.info {
    background: var(--bg-alt);
    color: var(--text);
    border: 1px solid var(--border-light);
}

.status-box.success {
    background: #f0f9eb;
    color: #529b2e;
    border: 1px solid #e1f3d8;
}

.status-box.error {
    background: #fef0f0;
    color: #f56c6c;
    border: 1px solid #fde2e2;
}

.status-box.warning {
    background: #fdf6ec;
    color: #e6a23c;
    border: 1px solid #faecd8;
}

/* ===== Progress Bar (standalone, in views) ===== */
.progress-bar-container {
    height: 5px;
    background: var(--bg-alt);
    border-radius: 3px;
    overflow: hidden;
    margin: 15px 0;
}

.progress-bar {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width 0.3s ease;
}

.progress-info {
    margin-top: 8px;
    color: var(--text-secondary);
    font-size: 13px;
}

/* ===== Diff Containers ===== */
.diff-container {
    overflow: hidden;
}

.diff-section {
    margin: 0;
    padding: 16px;
    background: var(--white);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    box-shadow: var(--shadow-subtle);
}

.diff-section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-light);
    color: var(--text);
}

.diff-section-label {
    display: block;
    margin-bottom: 4px;
    font-weight: normal;
    font-size: 13px;
    color: var(--text-secondary);
}

/* ===== Logs ===== */
.log-container {
    border: 1px solid var(--border-light);
    border-radius: 10px;
    margin: 15px 0;
    max-height: calc(100% - 180px);
    overflow-y: auto;
    background: var(--white);
}

.log-entry {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border-light);
    font-size: 13px;
}

.log-entry:last-child {
    border-bottom: none;
}

.log-success {
    background: #f0f9eb;
    color: #529b2e;
}

.log-error {
    background: #fef0f0;
    color: #f56c6c;
}

.log-info {
    background: var(--white);
    color: var(--text);
}

/* ===== Layout ===== */
.loading-container {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

#bgm-tool-body {
    padding: 28px 36px;
    flex: 1;
    min-height: 0;
    box-sizing: border-box;
    line-height: 1.6;
    color: var(--text);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-wrap: anywhere;
}

.buttons-container {
    padding: 16px 36px;
    background: var(--white);
    border-top: 1px solid var(--border-light);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 100%;
}

#edit-regions {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

#core-content {
    width: 100%;
}

/* ===== Loading Overlay ===== */
#bgm-loading-overlay {
    position: absolute;
    inset: 0;
    background: rgb(255 255 255 / 70%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

#bgm-loading-overlay.active {
    opacity: 1;
    pointer-events: auto;
}

#loading-spinner {
    width: 30px;
    height: 30px;
    border: 3px solid var(--bg-alt);
    border-radius: 50%;
    border-top-color: var(--accent);
    animation: spin 0.7s linear infinite;
    margin-bottom: 15px;
}

#loading-text {
    color: var(--text-secondary);
    font-size: 13px;
    text-align: center;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ===== Setup Columns (Side by Side on Wide Screens) ===== */
.setup-columns {
    display: flex;
    flex-direction: column;
    gap: 28px;
}

.setup-column {
    min-width: 0;
}

@media (width >= 900px) {
    .setup-columns {
        flex-direction: row;
    }

    .setup-column {
        flex: 1;
    }
}

/* ===== Edit Rows (Edit + Diff paired side by side on Wide Screens) ===== */
.edit-rows {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    min-height: 0;
}

.edit-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
    min-height: 0;
    flex: 1;
}

.edit-row-series .series-edit-area {
    max-width: 400px;
}

@media (width >= 960px) {
    .edit-row {
        flex-direction: row;
    }

    .edit-row > * {
        flex: 1;
        min-width: 0;
        overflow: auto;
    }

    .edit-row-series {
        flex-direction: row;
    }
}

/* ===== Edit Areas ===== */
.edit-area {
    margin: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.edit-area textarea {
    width: 100%;
    flex: 1;
    min-height: 100px;
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
    resize: vertical;
    background: var(--white);
    color: var(--text);
    transition: var(--transition);
}

.edit-area textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
    outline: none;
}

.tags-edit-area {
    margin: 0;
    display: flex;
    flex-direction: column;
}

.tags-edit-area input {
    width: 100%;
    height: 36px;
    padding: 0 12px;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text);
    background: var(--white);
    transition: var(--transition);
}

.tags-edit-area input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
    outline: none;
}

.series-edit-area {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-alt);
    border-radius: 6px;
}

.series-edit-area label {
    margin-bottom: 0;
    color: var(--text);
    cursor: pointer;
}

.last-update-info {
    font-size: 13px;
    color: var(--text-secondary);
    margin: 10px 0;
    display: none;
}

.commit-message-area {
    margin: 0 0 16px;
    display: flex;
    flex-direction: column;
}

.commit-message-area input {
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text);
    background: var(--white);
    transition: var(--transition);
    box-sizing: border-box;
}

.commit-message-area input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
    outline: none;
}

/* ===== Typography Helpers ===== */
#bgm-tool-container a {
    color: var(--link);
    text-decoration: none;
    transition: color 0.15s;
}

#bgm-tool-container a:hover {
    color: var(--link-hover);
    text-decoration: underline;
}

#bgm-tool-container h3 {
    margin: 0 0 15px;
    color: var(--text);
    font-size: 18px;
    font-weight: 600;
}

#bgm-tool-container p {
    margin: 8px 0;
    color: var(--text-secondary);
    font-size: 13px;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-light);
    color: var(--text);
}

.item-info {
    font-size: 15px;
    margin: 0 0 16px;
    font-weight: 500;
    color: var(--text);
}

.prev-item-link {
    font-size: 13px;
    margin: 0 0 10px;
    color: var(--text-secondary);
    display: block;
}

.prev-item-link a {
    color: var(--link);
}

/* ===== Stats ===== */
.stats-container {
    margin: 20px 0;
    display: flex;
    gap: 10px;
}

.stats-item {
    flex: 1;
    text-align: center;
    padding: 20px 10px;
    background: var(--white);
    border: 1px solid var(--border-light);
    border-radius: 10px;
    box-shadow: var(--shadow-subtle);
}

.stats-label {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 4px;
    display: block;
}

.stats-value {
    font-size: 22px;
    font-weight: 600;
    color: var(--accent);
}

/* ===== Log Filter ===== */
.log-search-container {
    margin-bottom: 15px;
}

#log-search {
    padding: 0 12px;
    height: 36px;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text);
    background: var(--white);
    transition: var(--transition);
}

#log-search:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgb(240 145 153 / 15%);
    outline: none;
}

.log-filter {
    display: flex;
    gap: 8px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--text);
    cursor: pointer;
    transition: var(--transition);
}

.filter-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
}

.filter-btn.active {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
}

/* ===== Setup View ===== */
.method-option-group {
    background: var(--bg-alt);
    padding: 4px;
    border-radius: 6px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
}

.method-option-group input[type="radio"] {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
}

.method-option-group label {
    display: inline-flex;
    align-items: center;
    padding: 5px 16px;
    border: 1px solid transparent;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-secondary);
    background: transparent;
    margin-bottom: 0;
    user-select: none;
}

.method-option-group label:hover {
    color: var(--text);
}

.method-option-group input[type="radio"]:checked + label {
    background: var(--white);
    color: var(--text);
    border-color: var(--border);
    box-shadow: 0 1px 3px rgb(0 0 0 / 6%);
}

.method-option-title {
    font-weight: 600;
    margin-bottom: 10px;
    display: block;
    color: var(--text);
}

.formhash-hint {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
    padding: 10px 12px;
    background: var(--bg-alt);
    border-radius: 6px;
}

.formhash-hint code {
    background: var(--white);
    padding: 1px 4px;
    border-radius: 3px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--accent);
    word-break: break-all;
    overflow-wrap: anywhere;
}

.formhash-hint a {
    color: var(--link);
}

.csv-loaded-info {
    margin-top: 8px;
    padding: 10px 14px;
    background: var(--white);
    border: 1px solid var(--border-light);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text);
}

.csv-hint {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 6px;
    line-height: 1.6;
}

/* ===== Misc ===== */
#status-container {
    margin: 12px 0;
    display: none;
}

/* ===== Dark Mode Overrides ===== */
#bgm-tool-container[data-theme="dark"] #bgm-loading-overlay {
    background: rgb(0 0 0 / 60%);
}

#bgm-tool-container[data-theme="dark"] #bgm-status-message {
    background: #555;
}

#bgm-tool-container[data-theme="dark"] .status-box.success {
    background: rgb(103 194 58 / 10%);
    color: #85ce61;
    border-color: rgb(103 194 58 / 20%);
}

#bgm-tool-container[data-theme="dark"] .status-box.error {
    background: rgb(245 108 108 / 10%);
    border-color: rgb(245 108 108 / 20%);
}

#bgm-tool-container[data-theme="dark"] .status-box.warning {
    background: rgb(230 162 60 / 10%);
    border-color: rgb(230 162 60 / 20%);
}

#bgm-tool-container[data-theme="dark"] .log-success {
    background: rgb(103 194 58 / 10%);
    color: #85ce61;
}

#bgm-tool-container[data-theme="dark"] .log-error {
    background: rgb(245 108 108 / 10%);
}

#bgm-tool-container[data-theme="dark"] .log-info {
    background: var(--white);
    color: var(--text);
}

#bgm-tool-container[data-theme="dark"] button.danger {
    color: #f56c6c;
    border-color: #f56c6c;
}

#bgm-tool-container[data-theme="dark"] button.danger:hover {
    background: rgb(245 108 108 / 10%);
}

/* ===== Float Button ===== */
#bgm-float-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #f09199;
    color: #fff;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 2px 12px rgb(240 145 153 / 25%);
    cursor: pointer;
    z-index: 9998;
    transition: all 0.2s ease;
    /* stylelint-disable-next-line value-keyword-case */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

#bgm-float-button:hover {
    background: #e07a85;
    box-shadow: 0 4px 16px rgb(240 145 153 / 35%);
    transform: scale(1.05);
}
`;var qu=`.diff-tailwindcss-wrapper .\\!container {
	width: 100% !important;
}
.diff-tailwindcss-wrapper .container {
	width: 100%;
}
@media (min-width: 640px) {
	.diff-tailwindcss-wrapper .\\!container {
		max-width: 640px !important;
	}
	.diff-tailwindcss-wrapper .container {
		max-width: 640px;
	}
}
@media (min-width: 768px) {
	.diff-tailwindcss-wrapper .\\!container {
		max-width: 768px !important;
	}
	.diff-tailwindcss-wrapper .container {
		max-width: 768px;
	}
}
@media (min-width: 1024px) {
	.diff-tailwindcss-wrapper .\\!container {
		max-width: 1024px !important;
	}
	.diff-tailwindcss-wrapper .container {
		max-width: 1024px;
	}
}
@media (min-width: 1280px) {
	.diff-tailwindcss-wrapper .\\!container {
		max-width: 1280px !important;
	}
	.diff-tailwindcss-wrapper .container {
		max-width: 1280px;
	}
}
@media (min-width: 1536px) {
	.diff-tailwindcss-wrapper .\\!container {
		max-width: 1536px !important;
	}
	.diff-tailwindcss-wrapper .container {
		max-width: 1536px;
	}
}
.diff-tailwindcss-wrapper .visible {
	visibility: visible;
}
.diff-tailwindcss-wrapper .invisible {
	visibility: hidden;
}
.diff-tailwindcss-wrapper .static {
	position: static;
}
.diff-tailwindcss-wrapper .fixed {
	position: fixed;
}
.diff-tailwindcss-wrapper .absolute {
	position: absolute;
}
.diff-tailwindcss-wrapper .relative {
	position: relative;
}
.diff-tailwindcss-wrapper .sticky {
	position: sticky;
}
.diff-tailwindcss-wrapper .left-0 {
	left: 0px;
}
.diff-tailwindcss-wrapper .left-\\[100\\%\\] {
	left: 100%;
}
.diff-tailwindcss-wrapper .right-\\[100\\%\\] {
	right: 100%;
}
.diff-tailwindcss-wrapper .z-\\[1\\] {
	z-index: 1;
}
.diff-tailwindcss-wrapper .m-\\[5px\\] {
	margin: 5px;
}
.diff-tailwindcss-wrapper .m-auto {
	margin: auto;
}
.diff-tailwindcss-wrapper .mb-\\[0\\.5em\\] {
	margin-bottom: 0.5em;
}
.diff-tailwindcss-wrapper .mb-\\[1em\\] {
	margin-bottom: 1em;
}
.diff-tailwindcss-wrapper .mb-\\[4px\\] {
	margin-bottom: 4px;
}
.diff-tailwindcss-wrapper .mb-\\[5em\\] {
	margin-bottom: 5em;
}
.diff-tailwindcss-wrapper .ml-\\[-1\\.5em\\] {
	margin-left: -1.5em;
}
.diff-tailwindcss-wrapper .mt-\\[0\\.8em\\] {
	margin-top: 0.8em;
}
.diff-tailwindcss-wrapper .mt-\\[1em\\] {
	margin-top: 1em;
}
.diff-tailwindcss-wrapper .block {
	display: block;
}
.diff-tailwindcss-wrapper .inline-block {
	display: inline-block;
}
.diff-tailwindcss-wrapper .flex {
	display: flex;
}
.diff-tailwindcss-wrapper .inline-flex {
	display: inline-flex;
}
.diff-tailwindcss-wrapper .table {
	display: table;
}
.diff-tailwindcss-wrapper .hidden {
	display: none;
}
.diff-tailwindcss-wrapper .h-full {
	height: 100%;
}
.diff-tailwindcss-wrapper .min-h-\\[28px\\] {
	min-height: 28px;
}
.diff-tailwindcss-wrapper .min-h-\\[80px\\] {
	min-height: 80px;
}
.diff-tailwindcss-wrapper .w-\\[1\\%\\] {
	width: 1%;
}
.diff-tailwindcss-wrapper .w-\\[1\\.5em\\] {
	width: 1.5em;
}
.diff-tailwindcss-wrapper .w-\\[1\\.5px\\] {
	width: 1.5px;
}
.diff-tailwindcss-wrapper .w-\\[10px\\] {
	width: 10px;
}
.diff-tailwindcss-wrapper .w-\\[50\\%\\] {
	width: 50%;
}
.diff-tailwindcss-wrapper .w-\\[90\\%\\] {
	width: 90%;
}
.diff-tailwindcss-wrapper .w-full {
	width: 100%;
}
.diff-tailwindcss-wrapper .min-w-\\[100px\\] {
	min-width: 100px;
}
.diff-tailwindcss-wrapper .min-w-\\[40px\\] {
	min-width: 40px;
}
.diff-tailwindcss-wrapper .shrink-0 {
	flex-shrink: 0;
}
.diff-tailwindcss-wrapper .basis-\\[50\\%\\] {
	flex-basis: 50%;
}
.diff-tailwindcss-wrapper .table-fixed {
	table-layout: fixed;
}
.diff-tailwindcss-wrapper .border-collapse {
	border-collapse: collapse;
}
.diff-tailwindcss-wrapper .border-spacing-0 {
	--tw-border-spacing-x: 0px;
	--tw-border-spacing-y: 0px;
	border-spacing: var(--tw-border-spacing-x) var(--tw-border-spacing-y);
}
.diff-tailwindcss-wrapper .origin-center {
	transform-origin: center;
}
.diff-tailwindcss-wrapper .translate-x-\\[-50\\%\\] {
	--tw-translate-x: -50%;
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.diff-tailwindcss-wrapper .translate-x-\\[50\\%\\] {
	--tw-translate-x: 50%;
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.diff-tailwindcss-wrapper .cursor-pointer {
	cursor: pointer;
}
.diff-tailwindcss-wrapper .select-none {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
}
.diff-tailwindcss-wrapper .resize {
	resize: both;
}
.diff-tailwindcss-wrapper .flex-col {
	flex-direction: column;
}
.diff-tailwindcss-wrapper .items-center {
	align-items: center;
}
.diff-tailwindcss-wrapper .justify-end {
	justify-content: flex-end;
}
.diff-tailwindcss-wrapper .justify-center {
	justify-content: center;
}
.diff-tailwindcss-wrapper .gap-x-4 {
	-moz-column-gap: 1rem;
	     column-gap: 1rem;
}
.diff-tailwindcss-wrapper .gap-x-\\[12px\\] {
	-moz-column-gap: 12px;
	     column-gap: 12px;
}
.diff-tailwindcss-wrapper .overflow-hidden {
	overflow: hidden;
}
.diff-tailwindcss-wrapper .overflow-x-auto {
	overflow-x: auto;
}
.diff-tailwindcss-wrapper .overflow-y-hidden {
	overflow-y: hidden;
}
.diff-tailwindcss-wrapper .whitespace-nowrap {
	white-space: nowrap;
}
.diff-tailwindcss-wrapper .break-all {
	word-break: break-all;
}
.diff-tailwindcss-wrapper .rounded {
	border-radius: 0.25rem;
}
.diff-tailwindcss-wrapper .rounded-\\[2px\\] {
	border-radius: 2px;
}
.diff-tailwindcss-wrapper .rounded-\\[4px\\] {
	border-radius: 4px;
}
.diff-tailwindcss-wrapper .rounded-\\[5px\\] {
	border-radius: 5px;
}
.diff-tailwindcss-wrapper .rounded-full {
	border-radius: 9999px;
}
.diff-tailwindcss-wrapper .rounded-md {
	border-radius: 0.375rem;
}
.diff-tailwindcss-wrapper .rounded-sm {
	border-radius: 0.125rem;
}
.diff-tailwindcss-wrapper .border {
	border-width: 1px;
}
.diff-tailwindcss-wrapper .border-l-\\[1px\\] {
	border-left-width: 1px;
}
.diff-tailwindcss-wrapper .border-solid {
	border-style: solid;
}
.diff-tailwindcss-wrapper .border-\\[\\#e1e1e1\\] {
	--tw-border-opacity: 1;
	border-color: rgb(225 225 225 / var(--tw-border-opacity, 1));
}
.diff-tailwindcss-wrapper .bg-orange-500 {
	--tw-bg-opacity: 1;
	background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .bg-sky-500 {
	--tw-bg-opacity: 1;
	background-color: rgb(14 165 233 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .bg-slate-100 {
	--tw-bg-opacity: 1;
	background-color: rgb(241 245 249 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .bg-slate-400 {
	--tw-bg-opacity: 1;
	background-color: rgb(148 163 184 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .bg-white {
	--tw-bg-opacity: 1;
	background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .fill-current {
	fill: currentColor;
}
.diff-tailwindcss-wrapper .p-0 {
	padding: 0px;
}
.diff-tailwindcss-wrapper .p-\\[1px\\] {
	padding: 1px;
}
.diff-tailwindcss-wrapper .p-\\[2px\\] {
	padding: 2px;
}
.diff-tailwindcss-wrapper .p-\\[6px\\] {
	padding: 6px;
}
.diff-tailwindcss-wrapper .px-5 {
	padding-left: 1.25rem;
	padding-right: 1.25rem;
}
.diff-tailwindcss-wrapper .px-\\[10px\\] {
	padding-left: 10px;
	padding-right: 10px;
}
.diff-tailwindcss-wrapper .px-\\[12px\\] {
	padding-left: 12px;
	padding-right: 12px;
}
.diff-tailwindcss-wrapper .px-\\[4px\\] {
	padding-left: 4px;
	padding-right: 4px;
}
.diff-tailwindcss-wrapper .py-2 {
	padding-top: 0.5rem;
	padding-bottom: 0.5rem;
}
.diff-tailwindcss-wrapper .py-\\[2px\\] {
	padding-top: 2px;
	padding-bottom: 2px;
}
.diff-tailwindcss-wrapper .py-\\[6px\\] {
	padding-top: 6px;
	padding-bottom: 6px;
}
.diff-tailwindcss-wrapper .py-\\[8px\\] {
	padding-top: 8px;
	padding-bottom: 8px;
}
.diff-tailwindcss-wrapper .pl-\\[1\\.5em\\] {
	padding-left: 1.5em;
}
.diff-tailwindcss-wrapper .pl-\\[10px\\] {
	padding-left: 10px;
}
.diff-tailwindcss-wrapper .pl-\\[2\\.0em\\] {
	padding-left: 2.0em;
}
.diff-tailwindcss-wrapper .pr-\\[10px\\] {
	padding-right: 10px;
}
.diff-tailwindcss-wrapper .text-right {
	text-align: right;
}
.diff-tailwindcss-wrapper .indent-\\[0\\.2em\\] {
	text-indent: 0.2em;
}
.diff-tailwindcss-wrapper .align-top {
	vertical-align: top;
}
.diff-tailwindcss-wrapper .align-middle {
	vertical-align: middle;
}
.diff-tailwindcss-wrapper .text-\\[1\\.2em\\] {
	font-size: 1.2em;
}
.diff-tailwindcss-wrapper .text-\\[20px\\] {
	font-size: 20px;
}
.diff-tailwindcss-wrapper .text-\\[24px\\] {
	font-size: 24px;
}
.diff-tailwindcss-wrapper .text-sm {
	font-size: 0.875rem;
	line-height: 1.25rem;
}
.diff-tailwindcss-wrapper .text-xs {
	font-size: 0.75rem;
	line-height: 1rem;
}
.diff-tailwindcss-wrapper .font-semibold {
	font-weight: 600;
}
.diff-tailwindcss-wrapper .leading-5 {
	line-height: 1.25rem;
}
.diff-tailwindcss-wrapper .leading-\\[1\\.6\\] {
	line-height: 1.6;
}
.diff-tailwindcss-wrapper .\\!text-red-500 {
	--tw-text-opacity: 1 !important;
	color: rgb(239 68 68 / var(--tw-text-opacity, 1)) !important;
}
.diff-tailwindcss-wrapper .text-gray-500 {
	--tw-text-opacity: 1;
	color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}
.diff-tailwindcss-wrapper .text-white {
	--tw-text-opacity: 1;
	color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}
.diff-tailwindcss-wrapper .opacity-\\[0\\.5\\] {
	opacity: 0.5;
}
.diff-tailwindcss-wrapper .filter {
	filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}
.diff-tailwindcss-wrapper .transition-transform {
	transition-property: transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 150ms;
}
.diff-tailwindcss-wrapper * {
	box-sizing: border-box;
}
.diff-tailwindcss-wrapper[data-theme='light'] .diff-style-root {
	--diff-border--: #dedede;
	--diff-add-content--: #dafbe1;
	--diff-del-content--: #ffebe9;
	--diff-add-lineNumber--: #aceebb;
	--diff-del-lineNumber--: #ffcecb;
	--diff-plain-content--: #ffffff;
	--diff-expand-content--: #fafafa;
	--diff-plain-lineNumber--: #fafafa;
	--diff-expand-lineNumber--: #fafafa;
	--diff-plain-lineNumber-color--: #555555;
	--diff-expand-lineNumber-color--: #555555;
	--diff-hunk-content--: #ddf4ff;
	--diff-hunk-lineNumber--: #b6e3ff;
	--diff-hunk-lineNumber-hover--: #0969da;
	--diff-add-content-highlight--: #aceebb;
	--diff-del-content-highlight--: #ffcecb;
	--diff-add-widget--: #0969d2;
	--diff-add-widget-color--: #ffffff;
	--diff-empty-content--: #fafafa;
	--diff-hunk-content-color--: #777777;
}
.diff-tailwindcss-wrapper .diff-style-root .diff-line-syntax-raw *,
.diff-tailwindcss-wrapper[data-theme='light'] .diff-line-syntax-raw * {
	color: var(--diff-view-light, inherit);
	font-weight: var(--diff-view-light-font-weight, inherit);
}
.diff-tailwindcss-wrapper[data-theme='dark'] .diff-style-root {
	--diff-border--: #3d444d;
	--diff-add-content--: #18271f;
	--diff-del-content--: #23191c;
	--diff-add-lineNumber--: #284228;
	--diff-del-lineNumber--: #4f2828;
	--diff-plain-content--: #0d1117;
	--diff-expand-content--: #161b22;
	--diff-plain-lineNumber--: #161b22;
	--diff-expand-lineNumber--: #161b22;
	--diff-plain-lineNumber-color--: #a0aaab;
	--diff-expand-lineNumber-color--: #a0aaab;
	--diff-hunk-content--: #131d2e;
	--diff-hunk-lineNumber--: #0c2d6b;
	--diff-hunk-lineNumber-hover--: #1f6feb;
	--diff-add-content-highlight--: #2f5732;
	--diff-del-content-highlight--: #713431;
	--diff-add-widget--: #0969d2;
	--diff-add-widget-color--: #ffffff;
	--diff-empty-content--: #161b22;
	--diff-hunk-content-color--: #9298a0;
}
.diff-tailwindcss-wrapper[data-theme='dark'] [data-state='diff'],
.diff-tailwindcss-wrapper[data-theme='dark'] [data-state='plain'],
.diff-tailwindcss-wrapper[data-theme='dark'] [data-state='hunk'] {
	color: white;
}
.diff-tailwindcss-wrapper[data-theme='light'] [data-state='diff'],
.diff-tailwindcss-wrapper[data-theme='light'] [data-state='plain'],
.diff-tailwindcss-wrapper[data-theme='light'] [data-state='hunk'] {
	color: black;
}
.diff-tailwindcss-wrapper[data-theme='dark'] .diff-line-syntax-raw * {
	color: var(--diff-view-dark, inherit);
	font-weight: var(--diff-view-dark-font-weight, inherit);
}
.diff-tailwindcss-wrapper table,
.diff-tailwindcss-wrapper tr,
.diff-tailwindcss-wrapper td {
	border-color: transparent;
	border-width: 0px;
	text-align: left;
}
.diff-tailwindcss-wrapper td {
	padding: 0;
}
.diff-tailwindcss-wrapper .diff-line-old-num,
.diff-tailwindcss-wrapper .diff-line-new-num,
.diff-tailwindcss-wrapper .diff-line-num {
	text-align: right;
}
.diff-tailwindcss-wrapper .diff-style-root tr {
	content-visibility: auto;
}
.diff-tailwindcss-wrapper .diff-add-widget-wrapper {
	transform-origin: center;
	transform: translateX(-50%) !important;
}
.diff-tailwindcss-wrapper .diff-line-old-content .diff-add-widget-wrapper,
.diff-tailwindcss-wrapper .diff-line-new-content .diff-add-widget-wrapper {
	transform: translateX(50%) !important;
}
.diff-tailwindcss-wrapper .diff-add-widget-wrapper:hover {
	transform: translateX(-50%) scale(1.1) !important;
}
.diff-tailwindcss-wrapper .diff-line-old-content .diff-add-widget-wrapper:hover,
.diff-tailwindcss-wrapper .diff-line-new-content .diff-add-widget-wrapper:hover {
	transform: translateX(50%) scale(1.1) !important;
}
.diff-tailwindcss-wrapper .diff-widget-tooltip {
	position: relative;
}
.diff-tailwindcss-wrapper .diff-add-widget,
.diff-tailwindcss-wrapper .diff-widget-tooltip {
	font-family: inherit;
	font-feature-settings: inherit;
	font-variation-settings: inherit;
	font-size: 100%;
	font-weight: inherit;
	line-height: inherit;
	letter-spacing: inherit;
	color: inherit;
	margin: 0;
	text-transform: none;
	border-width: 0px;
	background-color: transparent;
	background-image: none;
}
.diff-tailwindcss-wrapper .diff-widget-tooltip::after {
	display: none;
	box-sizing: border-box;
	background-color: #555555;
	position: absolute;
	content: attr(data-title);
	font-size: 11px;
	padding: 1px 2px;
	border-radius: 4px;
	overflow: hidden;
	top: 50%;
	white-space: nowrap;
	transform: translateY(-50%);
	left: calc(100% + 8px);
	color: #ffffff;
}
.diff-tailwindcss-wrapper .diff-widget-tooltip::before {
	display: none;
	box-sizing: border-box;
	content: '';
	position: absolute;
	top: 50%;
	left: calc(100% - 2px);
	transform: translateY(-50%);
	border: 6px solid transparent;
	border-right-color: #555555;
}
.diff-tailwindcss-wrapper .diff-widget-tooltip:hover {
	background-color: var(--diff-hunk-lineNumber-hover--);
	color: white;
}
.diff-tailwindcss-wrapper .diff-widget-tooltip:hover::before {
	display: block;
}
.diff-tailwindcss-wrapper .diff-widget-tooltip:hover::after {
	display: block;
}
.diff-line-extend-wrapper,
.diff-line-widget-wrapper {
	display: flow-root;
}
/* Multi-select styles for line range selection */
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-new-num,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-old-num,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-num {
	z-index: 2;
}
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-content,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-new-content,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-old-content {
	position: relative;
}
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-new-num::after,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-old-num::after,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-num::after {
	content: '';
	position: absolute;
	z-index: 1;
	inset: 0;
	opacity: 0.15;
	background-color: var(--diff-multi-select-bg, #f0c000);
	pointer-events: none;
}
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-new-num::before,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-old-num::before,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-num::before {
	content: '';
	z-index: 2;
	position: absolute;
	top: 0;
	bottom: 0;
	right: -2px;
	width: 4px;
	background-color: var(--diff-multi-select-border, #2588fa);
}
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-new-content::after,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-old-content::after,
.diff-tailwindcss-wrapper .diff-multi-select-active.diff-line-content::after {
	content: '';
	position: absolute;
	z-index: 1;
	inset: 0;
	opacity: 0.15;
	background-color: var(--diff-multi-select-bg, #f0c000);
	pointer-events: none;
}
/* Multi-select: ensure proper positioning for line number cells */
.diff-multi-selecting .diff-line-old-num,
.diff-multi-selecting .diff-line-new-num,
.diff-multi-selecting .diff-line-num {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
}
.diff-multi-selecting .diff-line-old-content,
.diff-multi-selecting .diff-line-new-content,
.diff-multi-selecting .diff-line-content {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
}
/* Prevent text selection during multi-line selection */
.diff-multi-selecting {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
}
.diff-multi-selecting * {
	-webkit-user-select: none;
	   -moz-user-select: none;
	        user-select: none;
}
/* Hide addWidget button during active dragging selection */
.diff-multi-selecting .diff-add-widget-wrapper {
	display: none;
}
/* Ensure addWidget button is above selection overlay */
.diff-multiselect-wrapper .diff-add-widget-wrapper {
	z-index: 10 !important;
}
/* Line number span should not interfere with click events */
.diff-tailwindcss-wrapper .diff-line-new-num span[data-line-num],
.diff-tailwindcss-wrapper .diff-line-old-num span[data-line-num] {
	pointer-events: none;
}
.diff-multiselect-wrapper .diff-line-old-num,
.diff-multiselect-wrapper .diff-line-new-num,
.diff-multiselect-wrapper .diff-line-num {
	cursor: pointer;
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub
  Description: Light theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-light
  Current colors taken from GitHub's CSS
*/
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs {
  color: #24292e;
  background: #ffffff
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-doctag,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-keyword,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-meta .hljs-keyword,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-template-tag,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-template-variable,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-type,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #d73a49
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-title,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-title.class_,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-title.class_.inherited__,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #6f42c1
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-attr,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-attribute,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-literal,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-meta,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-number,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-operator,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-variable,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-selector-attr,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-selector-class,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #005cc5
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-regexp,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-string,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #032f62
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-built_in,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-symbol {
  /* prettylights-syntax-variable */
  color: #e36209
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-comment,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-code,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-formula {
  /* prettylights-syntax-comment */
  color: #6a737d
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-name,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-quote,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-selector-tag,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #22863a
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #24292e
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #005cc5;
  font-weight: bold
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #735c0f
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #24292e;
  font-style: italic
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #24292e;
  font-weight: bold
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #22863a;
  background-color: #f0fff4
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #b31d28;
  background-color: #ffeef0
}
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-char.escape_,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-link,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-params,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-property,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-punctuation,
.diff-tailwindcss-wrapper[data-theme="light"] .diff-line-syntax-raw .hljs-tag {
  /* purposely ignored */
  
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs {
  color: #c9d1d9;
  background: #0d1117
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-doctag,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-keyword,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-meta .hljs-keyword,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-template-tag,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-template-variable,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-type,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #ff7b72
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-title,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-title.class_,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-title.class_.inherited__,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #d2a8ff
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-attr,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-attribute,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-literal,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-meta,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-number,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-operator,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-variable,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-selector-attr,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-selector-class,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #79c0ff
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-regexp,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-string,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #a5d6ff
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-built_in,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-symbol {
  /* prettylights-syntax-variable */
  color: #ffa657
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-comment,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-code,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-formula {
  /* prettylights-syntax-comment */
  color: #8b949e
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-name,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-quote,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-selector-tag,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #7ee787
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #c9d1d9
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #1f6feb;
  font-weight: bold
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #f2cc60
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #c9d1d9;
  font-style: italic
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #c9d1d9;
  font-weight: bold
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #aff5b4;
  background-color: #033a16
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffdcd7;
  background-color: #67060c
}
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-char.escape_,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-link,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-params,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-property,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-punctuation,
.diff-tailwindcss-wrapper[data-theme="dark"] .diff-line-syntax-raw .hljs-tag {
  /* purposely ignored */
  
}
.diff-tailwindcss-wrapper .hover\\:scale-110:hover {
	--tw-scale-x: 1.1;
	--tw-scale-y: 1.1;
	transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.diff-tailwindcss-wrapper .hover\\:bg-orange-700:hover {
	--tw-bg-opacity: 1;
	background-color: rgb(194 65 12 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .hover\\:bg-sky-700:hover {
	--tw-bg-opacity: 1;
	background-color: rgb(3 105 161 / var(--tw-bg-opacity, 1));
}
.diff-tailwindcss-wrapper .group:hover .group-hover\\:visible {
	visibility: visible;
}
`;GM_addStyle(Ju);GM_addStyle(qu);var Xl=document.createElement("link");Xl.rel="stylesheet";Xl.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";document.head.appendChild(Xl);Yu();})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.4
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      9.9
// @description  支持两种提交方式，可在设置页面选择，支持编辑Wcode、标签和系列状态
// @author       You
// @match        https://next.bgm.tv/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @connect      bgm.tv
// @connect      github.com
// @connect      api.github.com
// @license      MIT
// ==/UserScript==

"use strict";(()=>{var dp=Object.create;var rd=Object.defineProperty;var fp=Object.getOwnPropertyDescriptor;var cp=Object.getOwnPropertyNames;var up=Object.getPrototypeOf,pp=Object.prototype.hasOwnProperty;var od=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var hp=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of cp(e))!pp.call(t,r)&&r!==n&&rd(t,r,{get:()=>e[r],enumerable:!(i=fp(e,r))||i.enumerable});return t};var sd=(t,e,n)=>(n=t!=null?dp(up(t)):{},hp(e||!t||!t.__esModule?rd(n,"default",{value:t,enumerable:!0}):n,t));var bd=od((t_,_d)=>{var fn=-1,Vt=1,ut=0;function uo(t,e,n,i,r){if(t===e)return t?[[ut,t]]:[];if(n!=null){var o=Ep(t,e,n);if(o)return o}var a=aa(t,e),l=t.substring(0,a);t=t.substring(a),e=e.substring(a),a=Zo(t,e);var d=t.substring(t.length-a);t=t.substring(0,t.length-a),e=e.substring(0,e.length-a);var u=mp(t,e);return l&&u.unshift([ut,l]),d&&u.push([ut,d]),la(u,r),i&&_p(u),u}function mp(t,e){var n;if(!t)return[[Vt,e]];if(!e)return[[fn,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,o=i.indexOf(r);if(o!==-1)return n=[[Vt,i.substring(0,o)],[ut,r],[Vt,i.substring(o+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=fn),n;if(r.length===1)return[[fn,t],[Vt,e]];var a=vp(t,e);if(a){var l=a[0],d=a[1],u=a[2],c=a[3],f=a[4],p=uo(l,u),m=uo(d,c);return p.concat([[ut,f]],m)}return gp(t,e)}function gp(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),o=r,a=2*r,l=new Array(a),d=new Array(a),u=0;u<a;u++)l[u]=-1,d[u]=-1;l[o+1]=0,d[o+1]=0;for(var c=n-i,f=c%2!==0,p=0,m=0,g=0,x=0,w=0;w<r;w++){for(var _=-w+p;_<=w-m;_+=2){var L=o+_,y;_===-w||_!==w&&l[L-1]<l[L+1]?y=l[L+1]:y=l[L-1]+1;for(var C=y-_;y<n&&C<i&&t.charAt(y)===e.charAt(C);)y++,C++;if(l[L]=y,y>n)m+=2;else if(C>i)p+=2;else if(f){var S=o+c-_;if(S>=0&&S<a&&d[S]!==-1){var E=n-d[S];if(y>=E)return dd(t,e,y,C)}}}for(var h=-w+g;h<=w-x;h+=2){var S=o+h,E;h===-w||h!==w&&d[S-1]<d[S+1]?E=d[S+1]:E=d[S-1]+1;for(var b=E-h;E<n&&b<i&&t.charAt(n-E-1)===e.charAt(i-b-1);)E++,b++;if(d[S]=E,E>n)x+=2;else if(b>i)g+=2;else if(!f){var L=o+c-h;if(L>=0&&L<a&&l[L]!==-1){var y=l[L],C=o+y-L;if(E=n-E,y>=E)return dd(t,e,y,C)}}}}return[[fn,t],[Vt,e]]}function dd(t,e,n,i){var r=t.substring(0,n),o=e.substring(0,i),a=t.substring(n),l=e.substring(i),d=uo(r,o),u=uo(a,l);return d.concat(u)}function aa(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(o,r)==e.substring(o,r)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return hd(t.charCodeAt(r-1))&&r--,r}function fd(t,e){var n=t.length,i=e.length;if(n==0||i==0)return 0;n>i?t=t.substring(n-i):n<i&&(e=e.substring(0,n));var r=Math.min(n,i);if(t==e)return r;for(var o=0,a=1;;){var l=t.substring(r-a),d=e.indexOf(l);if(d==-1)return o;a+=d,(d==0||t.substring(r-a)==e.substring(0,a))&&(o=a,a++)}}function Zo(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(t.length-r,t.length-o)==e.substring(e.length-r,e.length-o)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return md(t.charCodeAt(t.length-r))&&r--,r}function vp(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||i.length*2<n.length)return null;function r(m,g,x){for(var w=m.substring(x,x+Math.floor(m.length/4)),_=-1,L="",y,C,S,E;(_=g.indexOf(w,_+1))!==-1;){var h=aa(m.substring(x),g.substring(_)),b=Zo(m.substring(0,x),g.substring(0,_));L.length<b+h&&(L=g.substring(_-b,_)+g.substring(_,_+h),y=m.substring(0,x-b),C=m.substring(x+h),S=g.substring(0,_-b),E=g.substring(_+h))}return L.length*2>=m.length?[y,C,S,E,L]:null}var o=r(n,i,Math.ceil(n.length/4)),a=r(n,i,Math.ceil(n.length/2)),l;if(!o&&!a)return null;a?o?l=o[4].length>a[4].length?o:a:l=a:l=o;var d,u,c,f;t.length>e.length?(d=l[0],u=l[1],c=l[2],f=l[3]):(c=l[0],f=l[1],d=l[2],u=l[3]);var p=l[4];return[d,u,c,f,p]}function _p(t){for(var e=!1,n=[],i=0,r=null,o=0,a=0,l=0,d=0,u=0;o<t.length;)t[o][0]==ut?(n[i++]=o,a=d,l=u,d=0,u=0,r=t[o][1]):(t[o][0]==Vt?d+=t[o][1].length:u+=t[o][1].length,r&&r.length<=Math.max(a,l)&&r.length<=Math.max(d,u)&&(t.splice(n[i-1],0,[fn,r]),t[n[i-1]+1][0]=Vt,i--,i--,o=i>0?n[i-1]:-1,a=0,l=0,d=0,u=0,r=null,e=!0)),o++;for(e&&la(t),xp(t),o=1;o<t.length;){if(t[o-1][0]==fn&&t[o][0]==Vt){var c=t[o-1][1],f=t[o][1],p=fd(c,f),m=fd(f,c);p>=m?(p>=c.length/2||p>=f.length/2)&&(t.splice(o,0,[ut,f.substring(0,p)]),t[o-1][1]=c.substring(0,c.length-p),t[o+1][1]=f.substring(p),o++):(m>=c.length/2||m>=f.length/2)&&(t.splice(o,0,[ut,c.substring(0,m)]),t[o-1][0]=Vt,t[o-1][1]=f.substring(0,f.length-m),t[o+1][0]=fn,t[o+1][1]=c.substring(m),o++),o++}o++}}var cd=/[^a-zA-Z0-9]/,ud=/\s/,pd=/[\r\n]/,bp=/\n\r?\n$/,wp=/^\r?\n\r?\n/;function xp(t){function e(m,g){if(!m||!g)return 6;var x=m.charAt(m.length-1),w=g.charAt(0),_=x.match(cd),L=w.match(cd),y=_&&x.match(ud),C=L&&w.match(ud),S=y&&x.match(pd),E=C&&w.match(pd),h=S&&m.match(bp),b=E&&g.match(wp);return h||b?5:S||E?4:_&&!y&&C?3:y||C?2:_||L?1:0}for(var n=1;n<t.length-1;){if(t[n-1][0]==ut&&t[n+1][0]==ut){var i=t[n-1][1],r=t[n][1],o=t[n+1][1],a=Zo(i,r);if(a){var l=r.substring(r.length-a);i=i.substring(0,i.length-a),r=l+r.substring(0,r.length-a),o=l+o}for(var d=i,u=r,c=o,f=e(i,r)+e(r,o);r.charAt(0)===o.charAt(0);){i+=r.charAt(0),r=r.substring(1)+o.charAt(0),o=o.substring(1);var p=e(i,r)+e(r,o);p>=f&&(f=p,d=i,u=r,c=o)}t[n-1][1]!=d&&(d?t[n-1][1]=d:(t.splice(n-1,1),n--),t[n][1]=u,c?t[n+1][1]=c:(t.splice(n+1,1),n--))}n++}}function la(t,e){t.push([ut,""]);for(var n=0,i=0,r=0,o="",a="",l;n<t.length;){if(n<t.length-1&&!t[n][1]){t.splice(n,1);continue}switch(t[n][0]){case Vt:r++,a+=t[n][1],n++;break;case fn:i++,o+=t[n][1],n++;break;case ut:var d=n-r-i-1;if(e){if(d>=0&&vd(t[d][1])){var u=t[d][1].slice(-1);if(t[d][1]=t[d][1].slice(0,-1),o=u+o,a=u+a,!t[d][1]){t.splice(d,1),n--;var c=d-1;t[c]&&t[c][0]===Vt&&(r++,a=t[c][1]+a,c--),t[c]&&t[c][0]===fn&&(i++,o=t[c][1]+o,c--),d=c}}if(gd(t[n][1])){var u=t[n][1].charAt(0);t[n][1]=t[n][1].slice(1),o+=u,a+=u}}if(n<t.length-1&&!t[n][1]){t.splice(n,1);break}if(o.length>0||a.length>0){o.length>0&&a.length>0&&(l=aa(a,o),l!==0&&(d>=0?t[d][1]+=a.substring(0,l):(t.splice(0,0,[ut,a.substring(0,l)]),n++),a=a.substring(l),o=o.substring(l)),l=Zo(a,o),l!==0&&(t[n][1]=a.substring(a.length-l)+t[n][1],a=a.substring(0,a.length-l),o=o.substring(0,o.length-l)));var f=r+i;o.length===0&&a.length===0?(t.splice(n-f,f),n=n-f):o.length===0?(t.splice(n-f,f,[Vt,a]),n=n-f+1):a.length===0?(t.splice(n-f,f,[fn,o]),n=n-f+1):(t.splice(n-f,f,[fn,o],[Vt,a]),n=n-f+2)}n!==0&&t[n-1][0]===ut?(t[n-1][1]+=t[n][1],t.splice(n,1)):n++,r=0,i=0,o="",a="";break}}t[t.length-1][1]===""&&t.pop();var p=!1;for(n=1;n<t.length-1;)t[n-1][0]===ut&&t[n+1][0]===ut&&(t[n][1].substring(t[n][1].length-t[n-1][1].length)===t[n-1][1]?(t[n][1]=t[n-1][1]+t[n][1].substring(0,t[n][1].length-t[n-1][1].length),t[n+1][1]=t[n-1][1]+t[n+1][1],t.splice(n-1,1),p=!0):t[n][1].substring(0,t[n+1][1].length)==t[n+1][1]&&(t[n-1][1]+=t[n+1][1],t[n][1]=t[n][1].substring(t[n+1][1].length)+t[n+1][1],t.splice(n+1,1),p=!0)),n++;p&&la(t,e)}function hd(t){return t>=55296&&t<=56319}function md(t){return t>=56320&&t<=57343}function gd(t){return md(t.charCodeAt(0))}function vd(t){return hd(t.charCodeAt(t.length-1))}function yp(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}function sa(t,e,n,i){return vd(t)||gd(i)?null:yp([[ut,t],[fn,e],[Vt,n],[ut,i]])}function Ep(t,e,n){var i=typeof n=="number"?{index:n,length:0}:n.oldRange,r=typeof n=="number"?null:n.newRange,o=t.length,a=e.length;if(i.length===0&&(r===null||r.length===0)){var l=i.index,d=t.slice(0,l),u=t.slice(l),c=r?r.index:null;e:{var f=l+a-o;if(c!==null&&c!==f||f<0||f>a)break e;var p=e.slice(0,f),m=e.slice(f);if(m!==u)break e;var g=Math.min(l,f),x=d.slice(0,g),w=p.slice(0,g);if(x!==w)break e;var _=d.slice(g),L=p.slice(g);return sa(x,_,L,u)}e:{if(c!==null&&c!==l)break e;var y=l,p=e.slice(0,y),m=e.slice(y);if(p!==d)break e;var C=Math.min(o-y,a-y),S=u.slice(u.length-C),E=m.slice(m.length-C);if(S!==E)break e;var _=u.slice(0,u.length-C),L=m.slice(0,m.length-C);return sa(d,_,L,S)}}if(i.length>0&&r&&r.length===0)e:{var x=t.slice(0,i.index),S=t.slice(i.index+i.length),g=x.length,C=S.length;if(a<g+C)break e;var w=e.slice(0,g),E=e.slice(a-C);if(x!==w||S!==E)break e;var _=t.slice(g,o-C),L=e.slice(g,a-C);return sa(x,_,L,S)}return null}function es(t,e,n,i){return uo(t,e,n,i,!0)}es.INSERT=Vt;es.DELETE=fn;es.EQUAL=ut;_d.exports=es});var Tu=od((Yl,Jl)=>{((t,e)=>{typeof define=="function"&&define.amd?define([],e):typeof Jl=="object"&&typeof Yl<"u"?Jl.exports=e():t.Papa=e()})(Yl,function t(){var e=typeof self<"u"?self:typeof window<"u"?window:e!==void 0?e:{},n,i=!e.document&&!!e.postMessage,r=e.IS_PAPA_WORKER||!1,o={},a=0,l={};function d(h){return h.charCodeAt(0)===65279?h.slice(1):h}function u(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(b){var A=C(b);A.chunkSize=parseInt(A.chunkSize),b.step||b.chunk||(A.chunkSize=null),this._handle=new g(A),(this._handle.streamer=this)._config=A}.call(this,h),this.parseChunk=function(b,A){var T=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<T){let U=this._config.newline;U||(M=this._config.quoteChar||'"',U=this._handle.guessLineEndings(b,M)),b=[...b.split(U).slice(T)].join(U)}this.isFirstChunk&&E(this._config.beforeFirstChunk)&&(M=this._config.beforeFirstChunk(b))!==void 0&&(b=M),this.isFirstChunk=!1,this._halted=!1;var T=this._partialLine+b,M=(this._partialLine="",this._handle.parse(T,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(b=M.meta.cursor,T=(this._finished||(this._partialLine=T.substring(b-this._baseIndex),this._baseIndex=b),M&&M.data&&(this._rowCount+=M.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),r)e.postMessage({results:M,workerId:l.WORKER_ID,finished:T});else if(E(this._config.chunk)&&!A){if(this._config.chunk(M,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=M=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(M.data),this._completeResults.errors=this._completeResults.errors.concat(M.errors),this._completeResults.meta=M.meta),this._completed||!T||!E(this._config.complete)||M&&M.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),T||M&&M.meta.paused||this._nextChunk(),M}this._halted=!0},this._sendError=function(b){E(this._config.error)?this._config.error(b):r&&this._config.error&&e.postMessage({workerId:l.WORKER_ID,error:b,finished:!1})}}function c(h){var b;(h=h||{}).chunkSize||(h.chunkSize=l.RemoteChunkSize),u.call(this,h),this._nextChunk=i?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(A){this._input=A,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(b=new XMLHttpRequest,this._config.withCredentials&&(b.withCredentials=this._config.withCredentials),i||(b.onload=S(this._chunkLoaded,this),b.onerror=S(this._chunkError,this)),b.open(this._config.downloadRequestBody?"POST":"GET",this._input,!i),this._config.downloadRequestHeaders){var A,T=this._config.downloadRequestHeaders;for(A in T)b.setRequestHeader(A,T[A])}var M;this._config.chunkSize&&(M=this._start+this._config.chunkSize-1,b.setRequestHeader("Range","bytes="+this._start+"-"+M));try{b.send(this._config.downloadRequestBody)}catch(U){this._chunkError(U.message)}i&&b.status===0&&this._chunkError()}},this._chunkLoaded=function(){b.readyState===4&&(b.status<200||400<=b.status?this._chunkError():(this._start+=this._config.chunkSize||b.responseText.length,this._finished=!this._config.chunkSize||this._start>=(A=>(A=A.getResponseHeader("Content-Range"))!==null?parseInt(A.substring(A.lastIndexOf("/")+1)):-1)(b),this.parseChunk(b.responseText)))},this._chunkError=function(A){A=b.statusText||A,this._sendError(new Error(A))}}function f(h){(h=h||{}).chunkSize||(h.chunkSize=l.LocalChunkSize),u.call(this,h);var b,A,T=typeof FileReader<"u";this.stream=function(M){this._input=M,A=M.slice||M.webkitSlice||M.mozSlice,T?((b=new FileReader).onload=S(this._chunkLoaded,this),b.onerror=S(this._chunkError,this)):b=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var M=this._input,U=(this._config.chunkSize&&(U=Math.min(this._start+this._config.chunkSize,this._input.size),M=A.call(M,this._start,U)),b.readAsText(M,this._config.encoding));T||this._chunkLoaded({target:{result:U}})},this._chunkLoaded=function(M){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(M.target.result)},this._chunkError=function(){this._sendError(b.error)}}function p(h){var b;u.call(this,h=h||{}),this.stream=function(A){return b=A,this._nextChunk()},this._nextChunk=function(){var A,T;if(!this._finished)return A=this._config.chunkSize,b=A?(T=b.substring(0,A),b.substring(A)):(T=b,""),this._finished=!b,this.parseChunk(T)}}function m(h){u.call(this,h=h||{});var b=[],A=!0,T=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(M){this._input=M,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){T&&b.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),b.length?this.parseChunk(b.shift()):A=!0},this._streamData=S(function(M){try{b.push(typeof M=="string"?M:M.toString(this._config.encoding)),A&&(A=!1,this._checkIsFinished(),this.parseChunk(b.shift()))}catch(U){this._streamError(U)}},this),this._streamError=S(function(M){this._streamCleanUp(),this._sendError(M)},this),this._streamEnd=S(function(){this._streamCleanUp(),T=!0,this._streamData("")},this),this._streamCleanUp=S(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function g(h){var b,A,T,M,U=Math.pow(2,53),P=-U,J=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,ee=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,re=this,q=0,F=0,V=!1,j=!1,z=[],B={data:[],errors:[],meta:{}};function he(se){return h.skipEmptyLines==="greedy"?se.join("").trim()==="":se.length===1&&se[0].length===0}function ie(){if(B&&T&&(ve("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+l.DefaultDelimiter+"'"),T=!1),h.skipEmptyLines&&(B.data=B.data.filter(function(ge){return!he(ge)})),Z()){let ge=function(ke,Oe){ke=d(ke),E(h.transformHeader)&&(ke=h.transformHeader(ke,Oe)),z.push(ke)};var Ee=ge;if(B)if(Array.isArray(B.data[0])){for(var se=0;Z()&&se<B.data.length;se++)B.data[se].forEach(ge);B.data.splice(0,1)}else B.data.forEach(ge)}function te(ge,ke){for(var Oe=h.header?{}:[],Pe=0;Pe<ge.length;Pe++){var Ie=Pe,Ht=ge[Pe],Ht=((Te,Je)=>(ct=>(h.dynamicTypingFunction&&h.dynamicTyping[ct]===void 0&&(h.dynamicTyping[ct]=h.dynamicTypingFunction(ct)),(h.dynamicTyping[ct]||h.dynamicTyping)===!0))(Te)?Je==="true"||Je==="TRUE"||Je!=="false"&&Je!=="FALSE"&&((ct=>{if(J.test(ct)&&(ct=parseFloat(ct),P<ct&&ct<U))return 1})(Je)?parseFloat(Je):ee.test(Je)?new Date(Je):Je===""?null:Je):Je)(Ie=h.header?Pe>=z.length?"__parsed_extra":z[Pe]:Ie,Ht=h.transform?h.transform(Ht,Ie):Ht);Ie==="__parsed_extra"?(Oe[Ie]=Oe[Ie]||[],Oe[Ie].push(Ht)):Oe[Ie]=Ht}return h.header&&(Pe>z.length?ve("FieldMismatch","TooManyFields","Too many fields: expected "+z.length+" fields but parsed "+Pe,F+ke):Pe<z.length&&ve("FieldMismatch","TooFewFields","Too few fields: expected "+z.length+" fields but parsed "+Pe,F+ke)),Oe}var xe;B&&(h.header||h.dynamicTyping||h.transform)&&(xe=1,!B.data.length||Array.isArray(B.data[0])?(B.data=B.data.map(te),xe=B.data.length):B.data=te(B.data,0),h.header&&B.meta&&(B.meta.fields=z),F+=xe)}function Z(){return h.header&&z.length===0}function ve(se,te,xe,Ee){se={type:se,code:te,message:xe},Ee!==void 0&&(se.row=Ee),B.errors.push(se)}E(h.step)&&(M=h.step,h.step=function(se){B=se,Z()?ie():(ie(),B.data.length!==0&&(q+=se.data.length,h.preview&&q>h.preview?A.abort():(B.data=B.data[0],M(B,re))))}),this.parse=function(se,te,xe){var Ee=h.quoteChar||'"',Ee=(h.newline||(h.newline=this.guessLineEndings(se,Ee)),T=!1,h.delimiter?E(h.delimiter)&&(h.delimiter=h.delimiter(se),B.meta.delimiter=h.delimiter):((Ee=((ge,ke,Oe,Pe,Ie)=>{var Ht,Te,Je,ct;Ie=Ie||[",","	","|",";",l.RECORD_SEP,l.UNIT_SEP];for(var mr=0;mr<Ie.length;mr++){for(var Wn,lo=Ie[mr],Bt=0,Qn=0,Et=0,Zt=(Je=void 0,new w({comments:Pe,delimiter:lo,newline:ke,preview:10}).parse(ge)),hi=0;hi<Zt.data.length;hi++)Oe&&he(Zt.data[hi])?Et++:(Wn=Zt.data[hi].length,Qn+=Wn,Je===void 0?Je=Wn:0<Wn&&(Bt+=Math.abs(Wn-Je),Je=Wn));0<Zt.data.length&&(Qn/=Zt.data.length-Et),(Te===void 0||Bt<=Te)&&(ct===void 0||ct<Qn)&&1.99<Qn&&(Te=Bt,Ht=lo,ct=Qn)}return{successful:!!(h.delimiter=Ht),bestDelimiter:Ht}})(se,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=Ee.bestDelimiter:(T=!0,h.delimiter=l.DefaultDelimiter),B.meta.delimiter=h.delimiter),C(h));return h.preview&&h.header&&Ee.preview++,b=se,A=new w(Ee),B=A.parse(b,te,xe),ie(),V?{meta:{paused:!0}}:B||{meta:{paused:!1}}},this.paused=function(){return V},this.pause=function(){V=!0,A.abort(),b=E(h.chunk)?"":b.substring(A.getCharIndex())},this.resume=function(){re.streamer._halted?(V=!1,re.streamer.parseChunk(b,!0)):setTimeout(re.resume,3)},this.aborted=function(){return j},this.abort=function(){j=!0,A.abort(),B.meta.aborted=!0,E(h.complete)&&h.complete(B),b=""},this.guessLineEndings=function(ge,Ee){ge=ge.substring(0,1048576);var Ee=new RegExp(x(Ee)+"([^]*?)"+x(Ee),"gm"),xe=(ge=ge.replace(Ee,"")).split("\r"),Ee=ge.split(`
`),ge=1<Ee.length&&Ee[0].length<xe[0].length;if(xe.length===1||ge)return`
`;for(var ke=0,Oe=0;Oe<xe.length;Oe++)xe[Oe][0]===`
`&&ke++;return ke>=xe.length/2?`\r
`:"\r"}}function x(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function w(h){var b=(h=h||{}).delimiter,A=h.newline,T=h.comments,M=h.step,U=h.preview,P=h.fastMode,J=null,ee=!1,re=h.quoteChar==null?'"':h.quoteChar,q=re;if(h.escapeChar!==void 0&&(q=h.escapeChar),(typeof b!="string"||-1<l.BAD_DELIMITERS.indexOf(b))&&(b=","),T===b)throw new Error("Comment character same as delimiter");T===!0?T="#":(typeof T!="string"||-1<l.BAD_DELIMITERS.indexOf(T))&&(T=!1),A!==`
`&&A!=="\r"&&A!==`\r
`&&(A=`
`);var F=0,V=!1;this.parse=function(j,z,B){if(typeof j!="string")throw new Error("Input must be a string");var he=j.length,ie=b.length,Z=A.length,ve=T.length,se=E(M),te=[],xe=[],Ee=[],ge=F=0;if(!j)return Bt();if(P||P!==!1&&j.indexOf(re)===-1){for(var ke=j.split(A),Oe=0;Oe<ke.length;Oe++){if(Ee=ke[Oe],F+=Ee.length,Oe!==ke.length-1)F+=A.length;else if(B)return Bt();if(!T||Ee.substring(0,ve)!==T){if(se){if(te=[],ct(Ee.split(b)),Qn(),V)return Bt()}else ct(Ee.split(b));if(U&&U<=Oe)return te=te.slice(0,U),Bt(!0)}}return Bt()}for(var Pe=j.indexOf(b,F),Ie=j.indexOf(A,F),Ht=new RegExp(x(q)+x(re),"g"),Te=j.indexOf(re,F);;)if(j[F]===re)for(Te=F,F++;;){if((Te=j.indexOf(re,Te+1))===-1)return B||xe.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:te.length,index:F}),Wn();if(Te===he-1)return Wn(j.substring(F,Te).replace(Ht,re));if(re===q&&j[Te+1]===q)Te++;else if(re===q||Te===0||j[Te-1]!==q){Pe!==-1&&Pe<Te+1&&(Pe=j.indexOf(b,Te+1));var Je=mr((Ie=Ie!==-1&&Ie<Te+1?j.indexOf(A,Te+1):Ie)===-1?Pe:Math.min(Pe,Ie));if(j.substr(Te+1+Je,ie)===b){Ee.push(j.substring(F,Te).replace(Ht,re)),j[F=Te+1+Je+ie]!==re&&(Te=j.indexOf(re,F)),Pe=j.indexOf(b,F),Ie=j.indexOf(A,F);break}if(Je=mr(Ie),j.substring(Te+1+Je,Te+1+Je+Z)===A){if(Ee.push(j.substring(F,Te).replace(Ht,re)),lo(Te+1+Je+Z),Pe=j.indexOf(b,F),Te=j.indexOf(re,F),se&&(Qn(),V))return Bt();if(U&&te.length>=U)return Bt(!0);break}xe.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:te.length,index:F}),Te++}}else if(T&&Ee.length===0&&j.substring(F,F+ve)===T){if(Ie===-1)return Bt();F=Ie+Z,Ie=j.indexOf(A,F),Pe=j.indexOf(b,F)}else if(Pe!==-1&&(Pe<Ie||Ie===-1))Ee.push(j.substring(F,Pe)),F=Pe+ie,Pe=j.indexOf(b,F);else{if(Ie===-1)break;if(Ee.push(j.substring(F,Ie)),lo(Ie+Z),se&&(Qn(),V))return Bt();if(U&&te.length>=U)return Bt(!0)}return Wn();function ct(Et){te.push(Et),ge=F}function mr(Et){var Zt=0;return Zt=Et!==-1&&(Et=j.substring(Te+1,Et))&&Et.trim()===""?Et.length:Zt}function Wn(Et){return B||(Et===void 0&&(Et=j.substring(F)),Ee.push(Et),F=he,ct(Ee),se&&Qn()),Bt()}function lo(Et){F=Et,ct(Ee),Ee=[],Ie=j.indexOf(A,F)}function Bt(Et){if(h.header&&!z&&te.length&&!ee){var Zt=te[0],hi=Object.create(null),oa=new Set(Zt);let nd=!1;for(let gr=0;gr<Zt.length;gr++){let Vn=d(Zt[gr]);if(hi[Vn=E(h.transformHeader)?h.transformHeader(Vn,gr):Vn]){let fo,id=hi[Vn];for(;fo=Vn+"_"+id,id++,oa.has(fo););oa.add(fo),Zt[gr]=fo,hi[Vn]++,nd=!0,(J=J===null?{}:J)[fo]=Vn}else hi[Vn]=1,Zt[gr]=Vn;oa.add(Vn)}nd&&console.warn("Duplicate headers found and renamed."),ee=!0}return{data:te,errors:xe,meta:{delimiter:b,linebreak:A,aborted:V,truncated:!!Et,cursor:ge+(z||0),renamedHeaders:J}}}function Qn(){M(Bt()),te=[],xe=[]}},this.abort=function(){V=!0},this.getCharIndex=function(){return F}}function _(h){var b=h.data,A=o[b.workerId],T=!1;if(b.error)A.userError(b.error,b.file);else if(b.results&&b.results.data){var M={abort:function(){T=!0,L(b.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:y,resume:y};if(E(A.userStep)){for(var U=0;U<b.results.data.length&&(A.userStep({data:b.results.data[U],errors:b.results.errors,meta:b.results.meta},M),!T);U++);delete b.results}else E(A.userChunk)&&(A.userChunk(b.results,M,b.file),delete b.results)}b.finished&&!T&&L(b.workerId,b.results)}function L(h,b){var A=o[h];E(A.userComplete)&&A.userComplete(b),A.terminate(),delete o[h]}function y(){throw new Error("Not implemented.")}function C(h){if(typeof h!="object"||h===null)return h;var b,A=Array.isArray(h)?[]:{};for(b in h)A[b]=C(h[b]);return A}function S(h,b){return function(){h.apply(b,arguments)}}function E(h){return typeof h=="function"}return l.parse=function(h,b){var A=(b=b||{}).dynamicTyping||!1;if(E(A)&&(b.dynamicTypingFunction=A,A={}),b.dynamicTyping=A,b.transform=!!E(b.transform)&&b.transform,!b.worker||!l.WORKERS_SUPPORTED)return A=null,l.NODE_STREAM_INPUT,typeof h=="string"?(h=d(h),A=new(b.download?c:p)(b)):h.readable===!0&&E(h.read)&&E(h.on)?A=new m(b):(e.File&&h instanceof File||h instanceof Object)&&(A=new f(b)),A.stream(h);(A=(()=>{var T;return!!l.WORKERS_SUPPORTED&&(T=(()=>{var M=e.URL||e.webkitURL||null,U=t.toString();return l.BLOB_URL||(l.BLOB_URL=M.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",U,")();"],{type:"text/javascript"})))})(),(T=new e.Worker(T)).onmessage=_,T.id=a++,o[T.id]=T)})()).userStep=b.step,A.userChunk=b.chunk,A.userComplete=b.complete,A.userError=b.error,b.step=E(b.step),b.chunk=E(b.chunk),b.complete=E(b.complete),b.error=E(b.error),delete b.worker,A.postMessage({input:h,config:b,workerId:A.id})},l.unparse=function(h,b){var A=!1,T=!0,M=",",U=`\r
`,P='"',J=P+P,ee=!1,re=null,q=!1,F=((()=>{if(typeof b=="object"){if(typeof b.delimiter!="string"||l.BAD_DELIMITERS.filter(function(z){return b.delimiter.indexOf(z)!==-1}).length||(M=b.delimiter),typeof b.quotes!="boolean"&&typeof b.quotes!="function"&&!Array.isArray(b.quotes)||(A=b.quotes),typeof b.skipEmptyLines!="boolean"&&typeof b.skipEmptyLines!="string"||(ee=b.skipEmptyLines),typeof b.newline=="string"&&(U=b.newline),typeof b.quoteChar=="string"&&(P=b.quoteChar,J=P+P),typeof b.header=="boolean"&&(T=b.header),Array.isArray(b.columns)){if(b.columns.length===0)throw new Error("Option columns is empty");re=b.columns}b.escapeChar!==void 0&&(J=b.escapeChar+P),b.escapeFormulae instanceof RegExp?q=b.escapeFormulae:typeof b.escapeFormulae=="boolean"&&b.escapeFormulae&&(q=/^[=+\-@\t\r].*$/)}})(),new RegExp(x(P),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return V(null,h,ee);if(typeof h[0]=="object")return V(re||Object.keys(h[0]),h,ee)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||re),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),V(h.fields||[],h.data||[],ee);throw new Error("Unable to serialize unrecognized input");function V(z,B,he){var ie="",Z=(typeof z=="string"&&(z=JSON.parse(z)),typeof B=="string"&&(B=JSON.parse(B)),Array.isArray(z)&&0<z.length),ve=!Array.isArray(B[0]);if(Z&&T){for(var se=0;se<z.length;se++)0<se&&(ie+=M),ie+=j(z[se],se);0<B.length&&(ie+=U)}for(var te=0;te<B.length;te++){var xe=(Z?z:B[te]).length,Ee=!1,ge=Z?Object.keys(B[te]).length===0:B[te].length===0;if(he&&!Z&&(Ee=he==="greedy"?B[te].join("").trim()==="":B[te].length===1&&B[te][0].length===0),he==="greedy"&&Z){for(var ke=[],Oe=0;Oe<xe;Oe++){var Pe=ve?z[Oe]:Oe;ke.push(B[te][Pe])}Ee=ke.join("").trim()===""}if(!Ee){for(var Ie=0;Ie<xe;Ie++){0<Ie&&!ge&&(ie+=M);var Ht=Z&&ve?z[Ie]:Ie;ie+=j(B[te][Ht],Ie)}te<B.length-1&&(!he||0<xe&&!ge)&&(ie+=U)}}return ie}function j(z,B){var he,ie,Z;return z==null?"":z.constructor===Date?JSON.stringify(z).slice(1,25):(Z=!1,q&&typeof z=="string"&&q.test(z)&&(z="'"+z,Z=!0),ie=(he=z.toString()).replace(F,J),(Z=Z||A===!0||typeof A=="function"&&A(z,B)||Array.isArray(A)&&A[B]||((ve,se)=>{for(var te=0;te<se.length;te++)if(-1<ve.indexOf(se[te]))return!0;return!1})(ie,l.BAD_DELIMITERS)||-1<ie.indexOf(M)||-1<he.indexOf(P)||ie.charAt(0)===" "||ie.charAt(ie.length-1)===" ")?P+ie+P:ie)}},l.RECORD_SEP="",l.UNIT_SEP="",l.BYTE_ORDER_MARK="\uFEFF",l.BAD_DELIMITERS=["\r",`
`,'"',l.BYTE_ORDER_MARK],l.WORKERS_SUPPORTED=!i&&!!e.Worker,l.NODE_STREAM_INPUT=1,l.LocalChunkSize=10485760,l.RemoteChunkSize=5242880,l.DefaultDelimiter=",",l.Parser=w,l.ParserHandle=g,l.NetworkStreamer=c,l.FileStreamer=f,l.StringStreamer=p,l.ReadableStreamStreamer=m,e.jQuery&&((n=e.jQuery).fn.parse=function(h){var b=h.config||{},A=[];return this.each(function(U){if(!(n(this).prop("tagName").toUpperCase()==="INPUT"&&n(this).attr("type").toLowerCase()==="file"&&e.FileReader)||!this.files||this.files.length===0)return!0;for(var P=0;P<this.files.length;P++)A.push({file:this.files[P],inputElem:this,instanceConfig:n.extend({},b)})}),T(),this;function T(){if(A.length===0)E(h.complete)&&h.complete();else{var U,P,J,ee,re=A[0];if(E(h.before)){var q=h.before(re.file,re.inputElem);if(typeof q=="object"){if(q.action==="abort")return U="AbortError",P=re.file,J=re.inputElem,ee=q.reason,void(E(h.error)&&h.error({name:U},P,J,ee));if(q.action==="skip")return void M();typeof q.config=="object"&&(re.instanceConfig=n.extend(re.instanceConfig,q.config))}else if(q==="skip")return void M()}var F=re.instanceConfig.complete;re.instanceConfig.complete=function(V){E(F)&&F(V,re.file,re.inputElem),M()},l.parse(re.file,re.instanceConfig)}}function M(){A.splice(0,1),T()}}),r&&(e.onmessage=function(h){h=h.data,l.WORKER_ID===void 0&&h&&(l.WORKER_ID=h.workerId),typeof h.input=="string"?e.postMessage({workerId:l.WORKER_ID,results:l.parse(h.input,h.config),finished:!0}):(e.File&&h.input instanceof File||h.input instanceof Object)&&(h=l.parse(h.input,h.config))&&e.postMessage({workerId:l.WORKER_ID,results:h,finished:!0})}),(c.prototype=Object.create(u.prototype)).constructor=c,(f.prototype=Object.create(u.prototype)).constructor=f,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,l})});var k={accessToken:GM_getValue("bgmAccessToken")||"",formhash:GM_getValue("bgmFormhash")||"",submitMethod:GM_getValue("bgmSubmitMethod")||"patch",entityType:localStorage.getItem("bgmEntityType")||"subject",csvData:JSON.parse(localStorage.getItem("bgmCsvData")||"null"),currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),totalItems:parseInt(localStorage.getItem("bgmTotalItems")||"0"),processing:!1,paused:!1,currentView:"setup",currentSubjectData:null,currentFieldUpdates:null,currentTagUpdates:null,currentSeriesUpdate:null,currentWcode:null,currentTags:null,currentSeries:null,currentCommitMessage:null,isCommitMessageLocked:localStorage.getItem("bgmIsCommitMessageLocked")==="true"||!1,lockedCommitMessage:localStorage.getItem("bgmLockedCommitMessage")||"",retryCount:JSON.parse(GM_getValue("bgmRetryCount","{}")),currentItemId:null,previousItem:JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),diffViewMode:localStorage.getItem("bgmDiffViewMode")||"split",theme:localStorage.getItem("bgmTheme")||"system"};function In(){GM_setValue("bgmAccessToken",k.accessToken),GM_setValue("bgmFormhash",k.formhash),GM_setValue("bgmSubmitMethod",k.submitMethod),localStorage.setItem("bgmEntityType",k.entityType),localStorage.setItem("bgmCsvData",JSON.stringify(k.csvData)),localStorage.setItem("bgmCurrentIndex",k.currentIndex.toString()),localStorage.setItem("bgmTotalItems",k.totalItems.toString()),GM_setValue("bgmRetryCount",JSON.stringify(k.retryCount)),localStorage.setItem("bgmIsCommitMessageLocked",k.isCommitMessageLocked.toString()),localStorage.setItem("bgmLockedCommitMessage",k.lockedCommitMessage),k.previousItem&&localStorage.setItem("bgmPreviousItem",JSON.stringify(k.previousItem)),localStorage.setItem("bgmDiffViewMode",k.diffViewMode),localStorage.setItem("bgmTheme",k.theme)}function ji(t,e){let n={subject:{wikiPath:`/p1/wiki/subjects/${e}`,historyPath:`/p1/wiki/subjects/${e}/history-summary`,patchBodyKey:"subject",editPagePath:`https://bgm.tv/subject/${e}/edit`},character:{wikiPath:`/p1/wiki/characters/${e}`,historyPath:`/p1/wiki/characters/${e}/history-summary`,patchBodyKey:"character",editPagePath:`https://bgm.tv/character/${e}/edit`},person:{wikiPath:`/p1/wiki/persons/${e}`,historyPath:`/p1/wiki/persons/${e}/history-summary`,patchBodyKey:"person",editPagePath:`https://bgm.tv/person/${e}/edit`}};return n[t]||n.subject}function co(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="block")}function Ui(t,e){let n=document.getElementById("progress-text"),i=document.getElementById("progress-bar");n&&(n.textContent=`\u5904\u7406\u8FDB\u5EA6: ${t}/${e}`);let r=e>0?t/e*100:0;i&&(i.style.width=`${r}%`)}function ad(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Gi(t){let e=document.getElementById("bgm-loading-overlay"),n=document.getElementById("loading-text");n&&(n.textContent=t),e&&e.classList.add("active")}function vn(){let t=document.getElementById("bgm-loading-overlay");t&&t.classList.remove("active")}function en(t){let e=document.getElementById("bgm-status-message");e&&(e.classList.remove("show"),e.offsetWidth,e.textContent=t,e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3))}function ld(){let t=document.getElementById("bgm-status-message");t&&t.classList.remove("show")}var Gd=sd(bd(),1);var Ap={name:"stub",maxLineToIgnoreSyntax:0,setMaxLineToIgnoreSyntax:()=>{},ignoreSyntaxHighlightList:[],setIgnoreSyntaxHighlightList:()=>{},getAST:()=>({children:[]}),processAST:()=>({syntaxFileObject:{},syntaxFileLineNumber:0}),hasRegisteredCurrentLang:()=>!1,getHighlighterEngine:()=>null},vr=Ap;var Ar;(function(t){t.None="None",t.Up="Up",t.Down="Down",t.Both="Both",t.Short="Short"})(Ar||(Ar={}));var pa=class{constructor(e,n,i,r,o){this.header=e,this.lines=n,this.unifiedDiffStart=i,this.unifiedDiffEnd=r,this.expansionType=o}equals(e){return this===e?!0:this.header.equals(e.header)&&this.unifiedDiffStart===e.unifiedDiffStart&&this.unifiedDiffEnd===e.unifiedDiffEnd&&this.expansionType===e.expansionType&&this.lines.length===e.lines.length&&this.lines.every((n,i)=>n.equals(e.lines[i]))}},ha=class{constructor(e,n,i,r){this.oldStartLine=e,this.oldLineCount=n,this.newStartLine=i,this.newLineCount=r}toDiffLineRepresentation(){return`@@ -${this.oldStartLine},${this.oldLineCount} +${this.newStartLine},${this.newLineCount} @@`}equals(e){return this.oldStartLine===e.oldStartLine&&this.oldLineCount===e.oldLineCount&&this.newStartLine===e.newStartLine&&this.oldStartLine===e.oldStartLine}};var Cn="--diff-add-content-highlight--",Nn="--diff-del-content-highlight--",et;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(et||(et={}));var Eo=t=>{switch(t){case et.LF:return"\u240A";case et.CR:return"\u240D";case et.CRLF:return"\u240D\u240A";default:return""}},wd;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(wd||(wd={}));var Lp=1e3;function xd(t){return t.location+t.length}function yd(t,e,n,i,r){let o=Math.min(e.length,i.length),a=r?xd(e)-1:e.location,l=r?xd(i)-1:i.location,d=r?-1:1,u=0;for(;Math.abs(u)<o&&t[a+u]===n[l+u];)u+=d;return Math.abs(u)}function rs(t){return t.trim().length===0||t.length>=Lp}function zd(t,e){let n=t.text,i=e.text,r=n.slice(-2),o=i.slice(-2),a=r===`\r
`?et.CRLF:r.endsWith("\r")?et.CR:r.endsWith(`
`)?et.LF:et.NULL,l=o===`\r
`?et.CRLF:o.endsWith("\r")?et.CR:o.endsWith(`
`)?et.LF:et.NULL,d=t.noTrailingNewLine!==e.noTrailingNewLine;return a===l&&!d?{addSymbol:void 0,addString:n,delSymbol:void 0,delString:i}:{addSymbol:d?t.noTrailingNewLine?et.NEWLINE:et.NORMAL:a,addString:a===et.CRLF?n.slice(0,-2):a===et.CR||a===et.LF?n.slice(0,-1):n,delSymbol:d?e.noTrailingNewLine?et.NEWLINE:et.NORMAL:l,delString:l===et.CRLF?i.slice(0,-2):l===et.CR||l===et.LF?i.slice(0,-1):i}}function kp(t,e){let n=t.text,i=e.text,{addString:r,delString:o,addSymbol:a,delSymbol:l}=zd(t,e);if(r===o&&a&&l)return{addRange:{range:{location:r.length,length:n.length-r.length},hasLineChange:!0,newLineSymbol:a},delRange:{range:{location:o.length,length:i.length-o.length},hasLineChange:!0,newLineSymbol:l}};let d={location:0,length:o.length},u={location:0,length:r.length};if(rs(n)||rs(i))return u.length=0,d.length=0,{addRange:{range:u},delRange:{range:d}};let c=yd(o,d,r,u,!1);d={location:d.location+c,length:d.length-c},u={location:u.location+c,length:u.length-c};let f=yd(o,d,r,u,!0);return d.length-=f,u.length-=f,{addRange:{range:u,hasLineChange:(r.slice(0,u.location)+r.slice(u.location+u.length)).trim().length>0},delRange:{range:d,hasLineChange:(o.slice(0,d.location)+o.slice(d.location+d.length)).trim().length>0}}}function Ip(t,e){let{addString:n,addSymbol:i,delString:r,delSymbol:o}=zd(t,e);if(rs(n)||rs(r))return{addRange:{range:[],hasLineChange:!!i,newLineSymbol:i},delRange:{range:[],hasLineChange:!!o,newLineSymbol:o}};let a=(0,Gd.default)(r,n,0,!0),l=0,d=0,u=a.filter(f=>f[0]!==-1).map(f=>({type:f[0],str:f[1],startIndex:l,endIndex:l+f[1].length-1,length:(l+=f[1].length,f[1].length)})),c=a.filter(f=>f[0]!==1).map(f=>({type:f[0],str:f[1],startIndex:d,endIndex:d+f[1].length-1,length:(d+=f[1].length,f[1].length)}));return{addRange:{range:u,hasLineChange:u.some(f=>f.type===0&&f.str.trim().length>0),newLineSymbol:i},delRange:{range:c,hasLineChange:u.some(f=>f.type===0&&f.str.trim().length>0),newLineSymbol:o}}}var He;(function(t){t[t.Context=0]="Context",t[t.Add=1]="Add",t[t.Delete=2]="Delete",t[t.Hunk=3]="Hunk"})(He||(He={}));var Ot=class t{constructor(e,n,i,r,o,a=!1,l,d,u,c,f,p,m,g){this.text=e,this.type=n,this.originalLineNumber=i,this.oldLineNumber=r,this.newLineNumber=o,this.noTrailingNewLine=a,this.changes=l,this.diffChanges=d,this._diffChanges=u,this.plainTemplate=c,this.plainTemplateMode=f,this.syntaxTemplate=p,this.syntaxTemplateName=m,this.syntaxTemplateMode=g}withNoTrailingNewLine(e){return new t(this.text,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,e)}isIncludeableLine(){return this.type===He.Add||this.type===He.Delete}equals(e){return this.text===e.text&&this.type===e.type&&this.originalLineNumber===e.originalLineNumber&&this.oldLineNumber===e.oldLineNumber&&this.newLineNumber===e.newLineNumber&&this.noTrailingNewLine===e.noTrailingNewLine}clone(e){return new t(e,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,this.noTrailingNewLine)}},Xi=t=>t?t.type===He.Add||t.type===He.Delete:!1,Sp=/["'&<>]/;function Cp(t){let e=""+t,n=Sp.exec(e);if(!n)return e;let i="",r,o,a=0;for(o=n.index;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}a!==o&&(i+=e.slice(a,o)),a=o+1,i+=r}return a!==o?i+e.slice(a,o):i}var ya=!1,ss=t=>t,Ed=ss,Ad=ss;var Sr=()=>ya,Cr=t=>ya&&ss!==Ed?Ed(t):t,Np=t=>ya&&ss!==Ad?Ad(t):t,$p=!1,Dp=()=>$p;var Tp=!0,ma=()=>Tp;var Nr=t=>Cp(t).replace(/\n/g,"").replace(/\r/g,""),Ao=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="relative")return;let i=t.changes;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Cr:Nr,o=i.range,a=e.slice(0,o.location),l=e.slice(o.location,o.location+o.length),d=e.slice(o.location+o.length),u=l.includes(`
`),c=i.newLineSymbol,f=`<span data-range-start="${o.location}" data-range-end="${o.location+o.length}">`;f+=r(a),f+=`<span data-diff-highlight style="background-color: var(${n==="add"?Cn:Nn});border-radius: 0.2em;">`,f+=u?`${r(l)}<span data-newline-symbol>${Eo(c)}</span>`:r(l),f+="</span>",f+=r(d),f+="</span>",t.plainTemplate=f,t.plainTemplateMode="relative"},Ld=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="fast-diff")return;let i=t.diffChanges;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Cr:Nr,o="";i.range.forEach(({type:a,str:l,startIndex:d,endIndex:u},c,f)=>{let p=c===f.length-1;a===0?(o+=`<span>${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight style="background-color: var(${n==="add"?Cn:Nn});border-radius: 0.2em;">${Eo(i.newLineSymbol)}</span>`:"",o+="</span>"):(o+=`<span data-range-start="${d}" data-range-end="${u}">`,o+=`<span data-diff-highlight style="background-color: var(${n==="add"?Cn:Nn});border-radius: 0.2em;">${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight>${Eo(i.newLineSymbol)}</span>`:"",o+="</span></span>")}),t.plainTemplate=o,t.plainTemplateMode="fast-diff"},Lo=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="relative"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let o=e.changes;if(!o||!o.hasLineChange)return;let a=Sr()?Cr:Nr,l=o.range,d=`<span data-range-start="${l.location}" data-range-end="${l.location+l.length}">`;(r=n?.nodeList)===null||r===void 0||r.forEach(({node:u,wrapper:c})=>{var f,p,m,g,x,w;if(u.endIndex<l.location||l.location+l.length<u.startIndex)d+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(p=((f=c?.properties)===null||f===void 0?void 0:f.className)||[])===null||p===void 0?void 0:p.join(" ")}" style="${((m=c?.properties)===null||m===void 0?void 0:m.style)||""}">${a(u.value)}</span>`;else{let _=l.location-u.startIndex,L=_<0?0:_,y=u.value.slice(0,L),C=u.value.slice(L,_+l.length),S=u.value.slice(_+l.length),E=y.length||l.location===u.startIndex,h=S.length||u.endIndex===l.location+l.length-1,b=C.includes(`
`);d+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(x=((g=c?.properties)===null||g===void 0?void 0:g.className)||[])===null||x===void 0?void 0:x.join(" ")}" style="${((w=c?.properties)===null||w===void 0?void 0:w.style)||""}">${a(y)}<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-top-left-radius: ${E?"0.2em":"0"};border-bottom-left-radius: ${E?"0.2em":"0"};border-top-right-radius: ${h||b?"0.2em":"0"};border-bottom-right-radius: ${h||b?"0.2em":"0"}">${b?`${a(C)}<span data-newline-symbol>${Eo(o.newLineSymbol)}</span>`:a(C)}</span>${a(S)}</span>`}}),d+="</span>",e.syntaxTemplate=d,e.syntaxTemplateMode="relative",e.syntaxTemplateName=t._getHighlighterName()},kd=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r,o,a;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="fast-diff"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let l=e.diffChanges,d=e._diffChanges;if(!l||!l.hasLineChange)return;let u=Sr()?Cr:Nr,c="",f=((r=l?.range)===null||r===void 0?void 0:r.filter(g=>g.type!==0))||[],p=((o=d?.range)===null||o===void 0?void 0:o.filter(g=>g.type!==0))||[],m=0;(a=n?.nodeList)===null||a===void 0||a.forEach(({node:g,wrapper:x},w,_)=>{var L,y,C;c+=`<span data-start="${g.startIndex}" data-end="${g.endIndex}" class="${(y=((L=x?.properties)===null||L===void 0?void 0:L.className)||[])===null||y===void 0?void 0:y.join(" ")}" style="${((C=x?.properties)===null||C===void 0?void 0:C.style)||""}">`;let S=f[m],E=f.length===0&&p.length===0,h=w===_.length-1;for(let b=0;b<g.value.length;b++){let A=g.startIndex+b,T=g.value[b],M=b===g.value.length-1,U=h&&b===g.value.length-1;if(S)if(A<S.startIndex)c+=u(T);else if(A===S.startIndex)S.endIndex<=g.endIndex?c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-radius: 0.2em;">`:c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-top-left-radius: 0.2em;border-bottom-left-radius: 0.2em;">`,c+=u(T),(M||S.startIndex===S.endIndex)&&(c+="</span>"),S.endIndex===A&&(m++,S=f[m]);else if(A<S.endIndex){if(b===0){let P=S.startIndex>=g.startIndex&&S.endIndex<=g.endIndex,J=S.endIndex<=g.endIndex;c+=P?`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-radius: 0.2em;">`:J?`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`:`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});">`}c+=u(T),M&&(c+="</span>")}else A===S.endIndex&&(S.startIndex>=g.startIndex||b===0&&(c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`),c+=u(T),c+="</span>",m++,S=f[m]);else c+=u(T),E&&U&&l.newLineSymbol&&(c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Cn:Nn});border-radius: 0.2em;">`,c+=`<span data-newline-symbol>${Eo(l.newLineSymbol)}</span></span>`)}c+="</span>"}),e.syntaxTemplate=c,e.syntaxTemplateMode="fast-diff",e.syntaxTemplateName=t._getHighlighterName()},Ea=t=>{var e;let n="",i=Sr()?Cr:Nr;return(e=t?.nodeList)===null||e===void 0||e.forEach(({node:r,wrapper:o})=>{var a,l,d;n+=`<span data-start="${r.startIndex}" data-end="${r.endIndex}" class="${(l=((a=o?.properties)===null||a===void 0?void 0:a.className)||[])===null||l===void 0?void 0:l.join(" ")}" style="${((d=o?.properties)===null||d===void 0?void 0:d.style)||""}">${i(r.value)}</span>`}),n},Aa=t=>t?(Sr()?Cr:Nr)(t):"",Fp=40;function Mp(t,e){throw new Error(e)}function Hp(t){var e,n;if(t.length===0)return 0;for(let i=t.length-1;i>=0;i--){let r=t[i];for(let o=r.lines.length-1;o>=0;o--){let a=r.lines[o];if(a.type===He.Hunk)continue;let l=(e=a.newLineNumber)!==null&&e!==void 0?e:0,d=(n=a.oldLineNumber)!==null&&n!==void 0?n:0;return l>d?l:d}}return 0}function Bp(t,e,n){let i=n===null?1/0:e.oldStartLine-n.header.oldStartLine-n.header.oldLineCount;return t===0?e.oldStartLine>1&&e.newStartLine>1?Ar.Up:Ar.None:i<=Fp?Ar.Short:Ar.Both}var Wd=(t,e)=>{let n=[];for(let i=0;i<t;i++)n.push(e(i));return n},Id=t=>{let e=t.lastIndexOf(".");return t.slice(e+1)},Sd=(t,e,{diffFile:n,getAdditionRaw:i,getDeletionRaw:r,getAdditionSyntax:o,getDeletionSyntax:a})=>{if(t.length===e.length){let l=t.length;for(let d=0;d<l;d++){let u=t[d],c=e[d];if(!u.changes||!c.changes){let p=Ot.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Ot.prototype.clone.call(c,r(c.oldLineNumber)||c.text||""),{addRange:g,delRange:x}=kp(p,m);u.changes=g,c.changes=x}let f=ma();if(!Dp())f&&(Ao({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),Ao({diffLine:c,rawLine:r(c.oldLineNumber)||"",operator:"del"}),Lo({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),Lo({diffFile:n,diffLine:c,syntaxLine:a(c.oldLineNumber)||null,operator:"del"}));else{let p=Ot.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Ot.prototype.clone.call(c,r(c.oldLineNumber)||c.text||""),{addRange:g,delRange:x}=Ip(p,m);u.diffChanges=g,c.diffChanges=x,u._diffChanges=x,c._diffChanges=g,f&&(Ld({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),Ld({diffLine:c,rawLine:r(c.oldLineNumber)||"",operator:"del"}),kd({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),kd({diffFile:n,diffLine:c,syntaxLine:a(c.oldLineNumber)||null,operator:"del"}))}}}},Rp=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,Op=/[\u202A-\u202E]|[\u2066-\u2069]/,Qd="+",Vd="-",Yd=" ",Jd="\\",qd=`
`,Pp=new Set([Qd,Vd,Yd,Jd,qd]),ga=class{constructor(){Object.defineProperty(this,"__v_skip",{value:!0}),this.reset()}reset(){this.ls=0,this.le=-1,this.text=""}nextLine(){return this.ls=this.le+1,this.ls>=this.text.length?!1:(this.le=this.text.indexOf(`
`,this.ls),this.le===-1&&(this.le=this.text.length),this.ls!==this.le)}readLine(e){return e?this.nextLine()?this.text.substring(this.ls,this.le):null:this.nextLine()?this.text.substring(this.ls+1,this.le+1):this.text.length>this.ls?`
`:null}lineStartsWith(e){return this.text.startsWith(e,this.ls)}lineEndsWith(e){return this.text.endsWith(e,this.le)}peek(){let e=this.le+1;return e<this.text.length?this.text[e]:null}parseDiffHeader(){let e=!1;for(;this.nextLine();){if(this.lineStartsWith("Binary files ")&&this.lineEndsWith("differ"))return{isBinary:!0};if(this.lineStartsWith("---")&&(e=!0),this.lineStartsWith("+++"))return{isBinary:!1}}return null}numberFromGroup(e,n,i=null){let r=e[n];if(!r){if(!i)throw new Error(`Group ${n} missing from regexp match and no defaultValue was provided`);return i}let o=parseInt(r,10);if(isNaN(o))throw new Error(`Could not parse capture group ${n} into number: ${r}`);return o}parseHunkHeader(e){let n=Rp.exec(e);if(!n)throw new Error("Invalid hunk header format");let i=this.numberFromGroup(n,1),r=this.numberFromGroup(n,2,1),o=this.numberFromGroup(n,3),a=this.numberFromGroup(n,4,1);return new ha(i,r,o,a)}parseLinePrefix(e){return e&&e.length&&Pp.has(e[0])?e[0]:null}parseHunk(e,n,i){let r=this.readLine(!0);if(!r)throw new Error("Expected hunk header but reached end of diff");let o=this.parseHunkHeader(r),a=new Array;a.push(new Ot(r,He.Hunk,1,null,null));let l,d=o.oldStartLine,u=o.newStartLine,c=e;for(;l=this.parseLinePrefix(this.peek());){let f=this.readLine(!1);if(f===null)throw new Error("Expected unified diff line but reached end of diff");if(l===Jd){if(f.length<12)throw new Error('Expected "no newline at end of file" marker to be at least 12 bytes long');let m=a.length-1,g=a[m];a[m]=g.withNoTrailingNewLine(!0);continue}c++;let p;if(l===Qd)p=new Ot(f,He.Add,c,null,u++);else if(l===Vd)p=new Ot(f,He.Delete,c,d++,null);else if(l===Yd||l===qd)p=new Ot(f,He.Context,c,d++,u++);else return Mp(l,`Unknown DiffLinePrefix: ${l}`);a.push(p)}if(a.length===1)throw new Error("Malformed diff, empty hunk");return new pa(o,a,e,e+a.length-1,Bp(n,o,i))}parse(e){this.text=e;try{let n=this.parseDiffHeader(),i=this.le,r=this.text.substring(0,i);if(!n)return{header:r,contents:"",hunks:[],isBinary:!1,maxLineNumber:0,hasHiddenBidiChars:!1};if(n.isBinary)return{header:r,contents:"",hunks:[],isBinary:!0,maxLineNumber:0,hasHiddenBidiChars:!1};let o=new Array,a=0,l=null;for(;this.peek();){let u=this.parseHunk(a,o.length,l);o.push(u),l=u,a+=u.lines.length}let d=this.text.substring(i+1,this.le).replace(/\n\\ No newline at end of file/g,"");return{header:r,contents:d,hunks:o,isBinary:n.isBinary,maxLineNumber:Hp(o),hasHiddenBidiChars:Op.test(e)}}finally{this.reset()}}},jp=new ga;function v(t,e,n,i){if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?i:n==="a"?i.call(t):i?i.value:e.get(t)}function W(t,e,n,i,r){if(i==="m")throw new TypeError("Private method is not writable");if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return i==="a"?r.call(t,n):r?r.value=n:e.set(t,n),n}var ns,_o,Lr,va,_a=class extends Map{constructor(){super(...arguments),ns.add(this),_o.set(this,[]),Lr.set(this,30)}get maxLength(){return v(this,Lr,"f")}setMaxLength(e){W(this,Lr,e,"f"),v(this,ns,"m",va).call(this)}set(e,n){return v(this,Lr,"f")<=0?this:this.has(e)?this:(v(this,_o,"f").push(e),v(this,ns,"m",va).call(this),super.set(e,n))}};_o=new WeakMap,Lr=new WeakMap,ns=new WeakSet,va=function(){for(;v(this,_o,"f").length>v(this,Lr,"f");){let e=v(this,_o,"f").shift();e&&this.delete(e)}};var Kd,ho,Up,Li=new _a;Li.setMaxLength(50);Li.name="@git-diff-view/core";var da=new Set,ko=class t{static createInstance(e){let n=new t(e?.raw,e?.lang,e?.fileName);return n.ast=e?.ast,n.theme=e?.theme,n.rawFile=e?.rawFile||{},n.plainFile=e?.plainFile||{},n.hasDoRaw=e?.hasDoRaw,n.rawLength=e?.rawLength,n.syntaxFile=e?.syntaxFile||{},n.hasDoSyntax=e?.hasDoSyntax,n.syntaxLength=e?.syntaxLength,n.highlighterName=e?.highlighterName,n.highlighterType=e?.highlighterType,n.maxLineNumber=e?.maxLineNumber,n}constructor(e,n,i){Kd.add(this),this.raw=e,this.lang=n,this.fileName=i,ho.set(this,""),this.rawFile={},this.hasDoRaw=!1,this.syntaxFile={},this.plainFile={},this.hasDoSyntax=!1,this.maxLineNumber=0,this.raw=Np(e),Object.defineProperty(this,"__v_skip",{value:!0}),this.initId()}initId(){let e="-file--"+Math.random().toString().slice(2);for(;da.has(e);)e="-file--"+Math.random().toString().slice(2);da.add(e),W(this,ho,e,"f")}getId(){return v(this,ho,"f")}clearId(){da.delete(v(this,ho,"f"))}doSyntax({registerHighlighter:e,theme:n}){if(!this.raw)return;let i=e||vr;if(this.rawLength&&this.rawLength>i.maxLineToIgnoreSyntax)return;let r=i;try{i.hasRegisteredCurrentLang(this.lang)||(r=vr)}catch{r=vr}if(this.hasDoSyntax&&r.name===this.highlighterName&&r.type===this.highlighterType&&(this.theme===n||r.type==="class")||(this.ast=r.getAST(this.raw,this.fileName,this.lang,n),this.theme=n,!this.ast))return;let{syntaxFileObject:o,syntaxFileLineNumber:a}=r.processAST(this.ast);ma()&&Object.values(o).forEach(l=>{l.template=Ea(l)}),this.syntaxFile=o,this.syntaxLength=a,this.highlighterName=r.name,this.highlighterType=r.type,this.hasDoSyntax=!0}doRaw(){if(!this.raw||this.hasDoRaw)return;let n=this.raw.split(`
`);this.rawLength=n.length,this.maxLineNumber=n.length,this.rawFile={},this.plainFile={};let i=ma();for(let r=0;r<n.length;r++)this.rawFile[r+1]=r<n.length-1?n[r]+`
`:n[r],this.plainFile[r+1]={value:this.rawFile[r+1],template:i?Aa(this.rawFile[r+1]):void 0};this.hasDoRaw=!0}};ho=new WeakMap,Kd=new WeakSet,Up=function(){this.rawLength&&this.syntaxLength&&(this.rawLength!==this.syntaxLength&&console.warn("[@git-diff-view/core] The rawLength does not match the syntaxLength."),Object.values(this.syntaxFile).forEach(({value:e,lineNumber:n})=>{e!==this.rawFile[n]&&console.warn("[@git-diff-view/core] Content mismatch detected at line "+n+": "+e+" !== "+this.rawFile[n])}))};function _r(t,e,n,i,r){let o=t+"--0.1.7--"+n+"--"+e;r&&(o=r+"--0.1.7--"+n+"--"+e);let a=t+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e;if(r&&(a=r+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e),Li.has(o))return Li.get(o);if(Li.has(a)){let d=Li.get(a);if(d?.highlighterType==="class")return d}let l=new ko(t,e,i);return Li.set(o,l),l}var as=Li;var os;(function(t){t[t.hunk=1]="hunk",t[t.content=2]="content",t[t.widget=3]="widget",t[t.extend=4]="extend"})(os||(os={}));var R;(function(t){t[t.old=1]="old",t[t.new=2]="new"})(R||(R={}));var ls=t=>{let e=t.splitLineLength,n=[];return Wd(e,i=>{let r=t.getSplitLeftLine(i),o=t.getSplitRightLine(i);!r?.isHidden&&!o?.isHidden&&n.push({type:os.content,index:i,lineNumber:i+1,splitLine:{left:r,right:o}})}),n};var La=t=>{let e=t.unifiedLineLength,n=[];return Wd(e,i=>{let r=t.getUnifiedLine(i);r.isHidden||n.push({type:os.content,index:i,lineNumber:i+1,unifiedLine:r})}),n},Gp=(t,e,n)=>{let i=t.getSplitLineByLineNumber(e,n),r=t.getUnifiedLineByLineNumber(e,n);return{split:!i||i.isHidden,unified:!r||r.isHidden}},Ne,Ke,Xe,Si,Ci,Yn,Jn,Vi,Yi,Ji,qi,qn,Kn,$n,Dn,$t,it,ot,qe,st,mi,wr,xr,yr,Er,mo,Qi,go,bo,wo,ki,Ii,is,Rt,zi,Wi,vo,gi,Xd,Zd,ba,ef,zp,wa,xa,Cd,tf,kr,Ir,xo,yo,Nd,$d,je=40;var fa=new Set,Ki=class t{static createInstance(e,n){var i,r,o,a,l,d;let u=new t(((i=e?.oldFile)===null||i===void 0?void 0:i.fileName)||"",((r=e?.oldFile)===null||r===void 0?void 0:r.content)||"",((o=e?.newFile)===null||o===void 0?void 0:o.fileName)||"",((a=e?.newFile)===null||a===void 0?void 0:a.content)||"",e?.hunks||[],((l=e?.oldFile)===null||l===void 0?void 0:l.fileLang)||"",((d=e?.newFile)===null||d===void 0?void 0:d.fileLang)||"");return n&&(n.isFullMerge?u._mergeFullBundle(n):u.mergeBundle(n)),u}constructor(e,n,i,r,o,a,l,d){Ne.add(this),this.uuid=d,Ke.set(this,void 0),Xe.set(this,void 0),Si.set(this,void 0),Ci.set(this,void 0),Yn.set(this,void 0),Jn.set(this,void 0),Vi.set(this,void 0),Yi.set(this,void 0),Ji.set(this,void 0),qi.set(this,void 0),qn.set(this,void 0),Kn.set(this,void 0),$n.set(this,void 0),Dn.set(this,void 0),$t.set(this,[]),it.set(this,[]),ot.set(this,void 0),qe.set(this,[]),st.set(this,void 0),mi.set(this,[]),wr.set(this,!1),xr.set(this,!1),yr.set(this,!1),Er.set(this,!1),mo.set(this,0),Qi.set(this,!1),go.set(this,!1),bo.set(this,!1),wo.set(this,!1),ki.set(this,void 0),Ii.set(this,void 0),is.set(this,!1),Rt.set(this,"light"),zi.set(this,{state:!1}),Wi.set(this,{state:!1}),this._version_="0.1.7",this._oldFileName="",this._oldFileContent="",this._oldFileLang="",this._newFileName="",this._newFileContent="",this._newFileLang="",this._diffList=[],this.diffLineLength=0,this.splitLineLength=0,this.unifiedLineLength=0,this.fileLineLength=0,this.additionLength=0,this.deletionLength=0,this.hasSomeLineCollapsed=!1,vo.set(this,""),gi.set(this,new Map),this.getSplitLeftLine=c=>v(this,$t,"f")[c],this.getSplitLineByLineNumber=(c,f)=>{var p,m;return f===R.old?(p=v(this,$t,"f"))===null||p===void 0?void 0:p.find(g=>g.lineNumber===c):(m=v(this,it,"f"))===null||m===void 0?void 0:m.find(g=>g.lineNumber===c)},this.getSplitLineIndexByLineNumber=(c,f)=>{var p,m;return f===R.old?(p=v(this,$t,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.lineNumber===c):(m=v(this,it,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.lineNumber===c)},this.getSplitRightLine=c=>v(this,it,"f")[c],this.getSplitHunkLine=c=>{var f;return(f=v(this,ot,"f"))===null||f===void 0?void 0:f[c]},this.onSplitHunkExpand=(c,f,p=!0)=>{var m,g,x;if(!this.getExpandEnabled())return;let w=(m=v(this,ot,"f"))===null||m===void 0?void 0:m[f];if(!(!w||!w.splitInfo)){if(c==="all"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,$t,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.splitInfo={...w.splitInfo,...w.hunkInfo,plainText:w.text,startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(c==="down"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.startHiddenIndex+je;_++){let L=v(this,$t,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.isLast?w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je}:w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je,plainText:`@@ -${w.splitInfo.oldStartIndex},${w.splitInfo.oldLength} +${w.splitInfo.newStartIndex},${w.splitInfo.newLength}`}}else if(c==="down-all"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,$t,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(c==="up"){if(w.isLast)return;for(let S=w.splitInfo.endHiddenIndex-je;S<w.splitInfo.endHiddenIndex;S++){let E=v(this,$t,"f")[S],h=v(this,it,"f")[S];E?.isHidden&&(E.isHidden=!1),h?.isHidden&&(h.isHidden=!1)}let _=w.splitInfo.oldStartIndex-je,L=w.splitInfo.oldLength+je,y=w.splitInfo.newStartIndex-je,C=w.splitInfo.newLength+je;w.splitInfo={...w.splitInfo,endHiddenIndex:w.splitInfo.endHiddenIndex-je,oldStartIndex:_,oldLength:L,newStartIndex:y,newLength:C,plainText:`@@ -${_},${L} +${y},${C}`},(g=v(this,ot,"f"))===null||g===void 0||delete g[f],v(this,ot,"f")[w.splitInfo.endHiddenIndex]=w}else if(c==="up-all"){if(w.isLast)return;for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,$t,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",endHiddenIndex:w.splitInfo.startHiddenIndex},(x=v(this,ot,"f"))===null||x===void 0||delete x[f],v(this,ot,"f")[w.splitInfo.endHiddenIndex]=w}p&&this.notifyAll()}},this.getUnifiedLine=c=>v(this,qe,"f")[c],this.getUnifiedLineByLineNumber=(c,f)=>{var p,m;return f===R.old?(p=v(this,qe,"f"))===null||p===void 0?void 0:p.find(g=>g.oldLineNumber===c):(m=v(this,qe,"f"))===null||m===void 0?void 0:m.find(g=>g.newLineNumber===c)},this.getUnifiedLineIndexByLineNumber=(c,f)=>{var p,m;return f===R.old?(p=v(this,qe,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.oldLineNumber===c):(m=v(this,qe,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.newLineNumber===c)},this.getUnifiedHunkLine=c=>{var f;return(f=v(this,st,"f"))===null||f===void 0?void 0:f[c]},this.onUnifiedHunkExpand=(c,f,p=!0)=>{var m,g,x,w;if(!this.getExpandEnabled())return;let _=(m=v(this,st,"f"))===null||m===void 0?void 0:m[f];if(!(!_||!_.unifiedInfo)){if(c==="all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=(g=v(this,qe,"f"))===null||g===void 0?void 0:g[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,..._.hunkInfo,plainText:_.text,startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(c==="down"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.startHiddenIndex+je;L++){let y=v(this,qe,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.isLast?_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je}:_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je,plainText:`@@ -${_.unifiedInfo.oldStartIndex},${_.unifiedInfo.oldLength} +${_.unifiedInfo.newStartIndex},${_.unifiedInfo.newLength}`}}else if(c==="down-all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=v(this,qe,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(c==="up"){if(_.isLast)return;for(let E=_.unifiedInfo.endHiddenIndex-je;E<_.unifiedInfo.endHiddenIndex;E++){let h=v(this,qe,"f")[E];h?.isHidden&&(h.isHidden=!1)}let L=_.unifiedInfo.oldStartIndex-je,y=_.unifiedInfo.oldLength+je,C=_.unifiedInfo.newStartIndex-je,S=_.unifiedInfo.newLength+je;_.unifiedInfo={..._.unifiedInfo,endHiddenIndex:_.unifiedInfo.endHiddenIndex-je,oldStartIndex:L,oldLength:y,newStartIndex:C,newLength:S,plainText:`@@ -${L},${y} +${C},${S}`},(x=v(this,st,"f"))===null||x===void 0||delete x[f],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}else if(c==="up-all"){if(_.isLast)return;for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=v(this,qe,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",endHiddenIndex:_.unifiedInfo.startHiddenIndex},(w=v(this,st,"f"))===null||w===void 0||delete w[f],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}p&&this.notifyAll()}},this.onAllExpand=c=>{this.getExpandEnabled()&&(c==="split"?(Object.keys(v(this,ot,"f")||{}).forEach(f=>{this.onSplitHunkExpand("all",+f,!1)}),v(this,zi,"f").state=!0):(Object.keys(v(this,st,"f")||{}).forEach(f=>{this.onUnifiedHunkExpand("all",+f,!1)}),v(this,Wi,"f").state=!0),this.notifyAll())},this.onAllCollapse=c=>{this.getExpandEnabled()&&(c==="split"?(Object.values(v(this,$t,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(v(this,it,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(v(this,ot,"f")||{}).forEach(f=>{f.splitInfo&&(f.splitInfo={...f.splitInfo,oldStartIndex:f.splitInfo._oldStartIndex,oldLength:f.splitInfo._oldLength,newStartIndex:f.splitInfo._newStartIndex,newLength:f.splitInfo._newLength,startHiddenIndex:f.splitInfo._startHiddenIndex,endHiddenIndex:f.splitInfo._endHiddenIndex,plainText:f.splitInfo._plainText})}),Object.keys(v(this,ot,"f")||{}).forEach(f=>{let p=v(this,ot,"f")[f];p.splitInfo&&p.splitInfo.endHiddenIndex!==+f&&(delete v(this,ot,"f")[f],v(this,ot,"f")[p.splitInfo.endHiddenIndex]=p)}),v(this,zi,"f").state=!1):(Object.values(v(this,qe,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(v(this,st,"f")||{}).forEach(f=>{f.unifiedInfo&&(f.unifiedInfo={...f.unifiedInfo,oldStartIndex:f.unifiedInfo._oldStartIndex,oldLength:f.unifiedInfo._oldLength,newStartIndex:f.unifiedInfo._newStartIndex,newLength:f.unifiedInfo._newLength,startHiddenIndex:f.unifiedInfo._startHiddenIndex,endHiddenIndex:f.unifiedInfo._endHiddenIndex,plainText:f.unifiedInfo._plainText})}),Object.keys(v(this,st,"f")||{}).forEach(f=>{let p=v(this,st,"f")[f];p.unifiedInfo&&p.unifiedInfo.endHiddenIndex!==+f&&(delete v(this,st,"f")[f],v(this,st,"f")[p.unifiedInfo.endHiddenIndex]=p)}),v(this,Wi,"f").state=!1),this.notifyAll())},this.getOldFileContent=()=>{var c;return(c=v(this,Ke,"f"))===null||c===void 0?void 0:c.raw},this.getNewFileContent=()=>{var c;return(c=v(this,Xe,"f"))===null||c===void 0?void 0:c.raw},this.getOldPlainLine=c=>{var f;return(f=v(this,Ji,"f"))===null||f===void 0?void 0:f[c]},this.getOldSyntaxLine=c=>{var f;return(f=v(this,qn,"f"))===null||f===void 0?void 0:f[c]},this.getNewPlainLine=c=>{var f;return(f=v(this,qi,"f"))===null||f===void 0?void 0:f[c]},this.getNewSyntaxLine=c=>{var f;return(f=v(this,Kn,"f"))===null||f===void 0?void 0:f[c]},this.subscribe=c=>(v(this,mi,"f").push(c),()=>{W(this,mi,v(this,mi,"f").filter(f=>f!==c),"f")}),this.notifyAll=c=>{var f;W(this,mo,(f=v(this,mo,"f"),f++,f),"f"),v(this,mi,"f").forEach(p=>{c&&p.isSyncExternal||p()}),v(this,gi,"f").forEach((p,m)=>{m.notifyAll(!0)})},this.getUpdateCount=()=>v(this,mo,"f"),this.getExpandEnabled=()=>!v(this,Qi,"f")&&!v(this,go,"f"),this.getBundle=()=>{let c=v(this,wr,"f"),f=v(this,xr,"f"),p=v(this,yr,"f"),m=v(this,Er,"f"),g=v(this,Vi,"f"),x=v(this,Yn,"f"),w=v(this,Ji,"f"),_=v(this,qn,"f"),L=v(this,$n,"f"),y=v(this,Yi,"f"),C=v(this,Jn,"f"),S=v(this,qi,"f"),E=v(this,Kn,"f"),h=v(this,Dn,"f"),b=this.splitLineLength,A=this.unifiedLineLength,T=this.fileLineLength,M=this.additionLength,U=this.deletionLength,P=v(this,Qi,"f"),J=v(this,go,"f"),ee=v(this,ki,"f"),re=v(this,Ii,"f"),q=this.hasSomeLineCollapsed,F=v(this,zi,"f"),V=v(this,Wi,"f"),j=v(this,$t,"f"),z=v(this,it,"f"),B=v(this,ot,"f"),he=v(this,qe,"f"),ie=v(this,st,"f"),Z=this._version_,ve=v(this,Rt,"f");return{hasInitRaw:c,hasInitSyntax:f,hasBuildSplit:p,hasBuildUnified:m,oldFileLines:g,oldFileDiffLines:x,oldFilePlainLines:w,oldFileSyntaxLines:_,oldFilePlaceholderLines:L,newFileLines:y,newFileDiffLines:C,newFilePlainLines:S,newFileSyntaxLines:E,newFilePlaceholderLines:h,splitLineLength:b,unifiedLineLength:A,fileLineLength:T,additionLength:M,deletionLength:U,splitLeftLines:j,splitRightLines:z,splitHunkLines:B,unifiedLines:he,unifiedHunkLines:ie,highlighterName:ee,highlighterType:re,composeByDiff:P,composeByRange:J,hasSomeLineCollapsed:q,hasExpandSplitAll:F,hasExpandUnifiedAll:V,version:Z,theme:ve,isFullMerge:!1}},this.mergeBundle=(c,f=!0)=>{W(this,wr,c.hasInitRaw,"f"),W(this,xr,c.hasInitSyntax,"f"),W(this,yr,c.hasBuildSplit,"f"),W(this,Er,c.hasBuildUnified,"f"),W(this,Qi,c.composeByDiff,"f"),W(this,go,c.composeByRange,"f"),W(this,ki,c.highlighterName,"f"),W(this,Ii,c.highlighterType,"f"),W(this,Vi,c.oldFileLines,"f"),W(this,Yn,c.oldFileDiffLines,"f"),W(this,Ji,c.oldFilePlainLines,"f"),W(this,qn,c.oldFileSyntaxLines,"f"),W(this,$n,c.oldFilePlaceholderLines,"f"),W(this,Yi,c.newFileLines,"f"),W(this,Jn,c.newFileDiffLines,"f"),W(this,qi,c.newFilePlainLines,"f"),W(this,Kn,c.newFileSyntaxLines,"f"),W(this,Dn,c.newFilePlaceholderLines,"f"),this.splitLineLength=c.splitLineLength,this.unifiedLineLength=c.unifiedLineLength,this.fileLineLength=c.fileLineLength,this.additionLength=c.additionLength,this.deletionLength=c.deletionLength,this.hasSomeLineCollapsed=c.hasSomeLineCollapsed,W(this,zi,c.hasExpandSplitAll,"f"),W(this,Wi,c.hasExpandUnifiedAll,"f"),W(this,$t,c.splitLeftLines,"f"),W(this,it,c.splitRightLines,"f"),W(this,ot,c.splitHunkLines,"f"),W(this,qe,c.unifiedLines,"f"),W(this,st,c.unifiedHunkLines,"f"),W(this,Rt,c.theme,"f"),W(this,bo,!0,"f"),W(this,is,!0,"f"),f&&this.notifyAll()},this.generateInstanceFromLineNumberRange=(c,f,p=R.new)=>{if(c>=f)return this;let m=this.getSplitLineIndexByLineNumber(c,p),g=this.getSplitLineIndexByLineNumber(f,p),x=this.getUnifiedLineIndexByLineNumber(c,p),w=this.getUnifiedLineIndexByLineNumber(f,p),_=[],L=[],y=[];for(let S=m;S<=g;S++){let E=this.getSplitLeftLine(S),h=this.getSplitRightLine(S);!E?.value&&!h?.value||(_.push({...E,isHidden:!1}),L.push({...h,isHidden:!1}))}for(let S=x;S<=w;S++){let E=this.getUnifiedLine(S);E?.value&&y.push({...E,isHidden:!1})}return t.createInstance({},{...this._getFullBundle(),composeByRange:!0,splitHunkLines:{},splitLeftLines:_,splitRightLines:L,splitLineLength:_.length,unifiedHunkLines:{},unifiedLines:y,unifiedLineLength:y.length})},this._getHighlighterName=()=>v(this,ki,"f")||"",this._getHighlighterType=()=>v(this,Ii,"f")||"",this._getIsPureDiffRender=()=>v(this,Qi,"f"),this._getTheme=()=>v(this,Rt,"f"),this._getIsCloned=()=>v(this,is,"f"),this._addClonedInstance=c=>{let f=()=>{this._notifyOthers(c),this._mergeFullBundle(c._getFullBundle(),!1)};f.isSyncExternal=!0;let p=c.subscribe(f);v(this,gi,"f").set(c,p)},this._notifyOthers=c=>{v(this,gi,"f").forEach((f,p)=>{p!==c&&p.notifyAll(!0)})},this._delClonedInstance=c=>{let f=v(this,gi,"f").get(c);f?.(),v(this,gi,"f").delete(c)},this._getFullBundle=()=>{let c=this.getBundle(),f=v(this,Ke,"f"),p=v(this,Xe,"f"),m=v(this,Ci,"f"),g=v(this,Si,"f");return{...c,oldFileResult:f,newFileResult:p,diffLines:m,diffListResults:g,isFullMerge:v(this,bo,"f")?v(this,wo,"f"):!0}},this._mergeFullBundle=(c,f=!0)=>{this.mergeBundle(c,f);try{W(this,Ke,c.oldFileResult?ko.createInstance(c.oldFileResult):null,"f"),W(this,Xe,c.newFileResult?ko.createInstance(c.newFileResult):null,"f"),W(this,Ci,c.diffLines,"f"),W(this,Si,c.diffListResults,"f"),W(this,wo,c.isFullMerge,"f")}catch{}},this._getAllListener=()=>v(this,mi,"f"),this._destroy=()=>{this.clearId(),v(this,mi,"f").splice(0,v(this,mi,"f").length),v(this,gi,"f").forEach(c=>c()),v(this,gi,"f").clear()},this.clear=()=>{this._destroy(),W(this,Ke,void 0,"f"),W(this,Xe,void 0,"f"),W(this,Ci,void 0,"f"),W(this,Si,void 0,"f"),W(this,Jn,void 0,"f"),W(this,Yn,void 0,"f"),W(this,Yi,void 0,"f"),W(this,Vi,void 0,"f"),W(this,Kn,void 0,"f"),W(this,qn,void 0,"f"),W(this,ot,void 0,"f"),W(this,$t,[],"f"),W(this,it,[],"f"),W(this,st,void 0,"f"),W(this,qe,[],"f"),W(this,Rt,"light","f")},Object.defineProperty(this,"__v_skip",{value:!0});let u=Array.from(new Set(o));this._oldFileName=e,this._newFileName=i,this._diffList=u,this._oldFileLang=Id(a||e||l||i)||"txt",this._newFileLang=Id(l||i||a||e)||"txt",this._oldFileContent=n,this._newFileContent=r,this.initId()}initId(){let e="-diff--"+Math.random().toString().slice(2);for(;fa.has(e);)e="-diff--"+Math.random().toString().slice(2);fa.add(e),W(this,vo,e,"f")}getId(){return v(this,vo,"f")}clearId(){fa.delete(v(this,vo,"f"))}initTheme(e){W(this,Rt,e||v(this,Rt,"f")||"light","f")}initRaw(){var e;v(this,wr,"f")||(v(this,Ne,"m",Zd).call(this),v(this,Ne,"m",ba).call(this),v(this,Ne,"m",Xd).call(this),v(this,Ne,"m",wa).call(this),v(this,Ne,"m",ef).call(this),v(this,Ne,"m",xa).call(this),W(this,wr,!0,"f"))}initSyntax({registerHighlighter:e}={}){var n,i;if(v(this,xr,"f")&&(!e||e.name===v(this,ki,"f")&&e.type===v(this,Ii,"f"))){W(this,Kn,(n=v(this,Xe,"f"))===null||n===void 0?void 0:n.syntaxFile,"f"),W(this,qn,(i=v(this,Ke,"f"))===null||i===void 0?void 0:i.syntaxFile,"f");return}v(this,Ne,"m",tf).call(this,{registerHighlighter:e}),v(this,Ne,"m",wa).call(this),W(this,xr,!0,"f")}init(){this.initRaw(),this.initSyntax()}buildSplitDiffLines(){var e,n,i,r,o,a;if(v(this,yr,"f"))return;let l=1,d=1,u=!0,c=1/0,f=((e=v(this,Ke,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Xe,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=f||d<=p;){let m=v(this,Ne,"m",kr).call(this,l),g=v(this,Ne,"m",Ir).call(this,d),x=v(this,Ne,"m",xo).call(this,l),w=v(this,Ne,"m",yo).call(this,d),_=Ot.prototype.isIncludeableLine.call(m||{}),L=Ot.prototype.isIncludeableLine.call(g||{}),y=v(this,it,"f").length,C=!m&&!g;if(m&&!g){if(m.newLineNumber&&m.newLineNumber>d){d++;continue}(m.newLineNumber===null||m.newLineNumber===void 0)&&d++}if(g&&!m){if(g.oldLineNumber&&g.oldLineNumber>l){l++;continue}(g.oldLineNumber===null||g.oldLineNumber===void 0)&&l++}if(!m&&!x&&!g&&!w)break;if(!m&&!g){if(!((i=v(this,$n,"f"))===null||i===void 0)&&i[l]&&(!((r=v(this,Dn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!x&&(!((o=v(this,Dn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!w&&(!((a=v(this,$n,"f"))===null||a===void 0)&&a[l])){l++;continue}}if(_&&L||!_&&!L?(v(this,$t,"f").push({lineNumber:l++,value:x,diff:m,isHidden:C,_isHidden:C}),v(this,it,"f").push({lineNumber:d++,value:w,diff:g,isHidden:C,_isHidden:C})):_?(v(this,$t,"f").push({lineNumber:l++,value:x,diff:m,isHidden:C,_isHidden:C}),v(this,it,"f").push({})):L&&(v(this,$t,"f").push({}),v(this,it,"f").push({lineNumber:d++,value:w,diff:g,isHidden:C,_isHidden:C})),!u&&C&&(c=y),C&&(this.hasSomeLineCollapsed=!0),u=C,m?.prevHunkLine||g?.prevHunkLine){let S=m?.prevHunkLine||g?.prevHunkLine;S&&(S.isFirst?(S.splitInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},c=1/0):Number.isFinite(c)&&(S.splitInfo={...S.hunkInfo,startHiddenIndex:c,endHiddenIndex:y,plainText:S.text,_startHiddenIndex:c,_endHiddenIndex:y,_plainText:S.text},c=1/0),W(this,ot,{...v(this,ot,"f"),[y]:S},"f"))}}if(Number.isFinite(c)){let g=new Ot("",He.Hunk,null,null,null);g.isLast=!0,g.splitInfo={startHiddenIndex:c,endHiddenIndex:v(this,it,"f").length,_startHiddenIndex:c,_endHiddenIndex:v(this,it,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},W(this,ot,{...v(this,ot,"f"),[v(this,it,"f").length]:g},"f"),c=1/0}this.splitLineLength=v(this,it,"f").length,W(this,yr,!0,"f"),this.notifyAll()}buildUnifiedDiffLines(){var e,n,i,r,o,a;if(v(this,Er,"f"))return;let l=1,d=1,u=!0,c=1/0,f=((e=v(this,Ke,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Xe,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=f||d<=p;){let m=v(this,Ne,"m",xo).call(this,l),g=v(this,Ne,"m",kr).call(this,l),x=v(this,Ne,"m",yo).call(this,d),w=v(this,Ne,"m",Ir).call(this,d),_=Ot.prototype.isIncludeableLine.call(g||{}),L=Ot.prototype.isIncludeableLine.call(w||{}),y=v(this,qe,"f").length,C=!g&&!w;if(g&&!w){if(g.newLineNumber&&g.newLineNumber>d){d++;continue}(g.newLineNumber===null||g.newLineNumber===void 0)&&d++}if(w&&!g){if(w.oldLineNumber&&w.oldLineNumber>l){l++;continue}(w.oldLineNumber===null||w.oldLineNumber===void 0)&&l++}if(!m&&!x&&!w&&!g)break;if(!g&&!w){if(!((i=v(this,$n,"f"))===null||i===void 0)&&i[l]&&(!((r=v(this,Dn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!m&&(!((o=v(this,Dn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!x&&(!((a=v(this,$n,"f"))===null||a===void 0)&&a[l])){l++;continue}}if(!_&&!L?v(this,qe,"f").push({oldLineNumber:l++,newLineNumber:d++,value:x,diff:w,isHidden:C,_isHidden:C}):_?v(this,qe,"f").push({oldLineNumber:l++,value:m,diff:g,isHidden:C,_isHidden:C}):L&&v(this,qe,"f").push({newLineNumber:d++,value:x,diff:w,isHidden:C,_isHidden:C}),!u&&C&&(c=y),C&&(this.hasSomeLineCollapsed=!0),u=C,g?.prevHunkLine||w?.prevHunkLine){let S=g?.prevHunkLine||w?.prevHunkLine;S&&(S.isFirst?(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},c=1/0):Number.isFinite(c)&&(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:c,endHiddenIndex:y,plainText:S.text,_startHiddenIndex:c,_endHiddenIndex:y,_plainText:S.text},c=1/0),W(this,st,{...v(this,st,"f"),[y]:S},"f"))}}if(Number.isFinite(c)){let g=new Ot("",He.Hunk,null,null,null);g.isLast=!0,g.unifiedInfo={startHiddenIndex:c,endHiddenIndex:v(this,qe,"f").length,_startHiddenIndex:c,_endHiddenIndex:v(this,qe,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},W(this,st,{...v(this,st,"f"),[v(this,qe,"f").length]:g},"f"),c=1/0}this.unifiedLineLength=v(this,qe,"f").length,W(this,Er,!0,"f"),this.notifyAll()}get hasExpandSplitAll(){return v(this,zi,"f").state}get hasExpandUnifiedAll(){return v(this,Wi,"f").state}};Ke=new WeakMap,Xe=new WeakMap,Si=new WeakMap,Ci=new WeakMap,Yn=new WeakMap,Jn=new WeakMap,Vi=new WeakMap,Yi=new WeakMap,Ji=new WeakMap,qi=new WeakMap,qn=new WeakMap,Kn=new WeakMap,$n=new WeakMap,Dn=new WeakMap,$t=new WeakMap,it=new WeakMap,ot=new WeakMap,qe=new WeakMap,st=new WeakMap,mi=new WeakMap,wr=new WeakMap,xr=new WeakMap,yr=new WeakMap,Er=new WeakMap,mo=new WeakMap,Qi=new WeakMap,go=new WeakMap,bo=new WeakMap,wo=new WeakMap,ki=new WeakMap,Ii=new WeakMap,is=new WeakMap,Rt=new WeakMap,zi=new WeakMap,Wi=new WeakMap,vo=new WeakMap,gi=new WeakMap,Ne=new WeakSet,Xd=function(){this._diffList&&W(this,Si,this._diffList.map(e=>jp.parse(e)),"f")},Zd=function(){!this._oldFileContent&&!this._newFileContent||(this._oldFileContent&&W(this,Ke,_r(this._oldFileContent,this._oldFileLang,v(this,Rt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),this._newFileContent&&W(this,Xe,_r(this._newFileContent,this._newFileLang,v(this,Rt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"))},ba=function(){var e,n,i,r,o,a,l,d;(e=v(this,Ke,"f"))===null||e===void 0||e.doRaw(),W(this,Vi,(n=v(this,Ke,"f"))===null||n===void 0?void 0:n.rawFile,"f"),W(this,Ji,(i=v(this,Ke,"f"))===null||i===void 0?void 0:i.plainFile,"f"),(r=v(this,Xe,"f"))===null||r===void 0||r.doRaw(),W(this,Yi,(o=v(this,Xe,"f"))===null||o===void 0?void 0:o.rawFile,"f"),W(this,qi,(a=v(this,Xe,"f"))===null||a===void 0?void 0:a.plainFile,"f"),this.fileLineLength=Math.max(this.fileLineLength,((l=v(this,Ke,"f"))===null||l===void 0?void 0:l.maxLineNumber)||0,((d=v(this,Xe,"f"))===null||d===void 0?void 0:d.maxLineNumber)||0)},ef=function(){if(this._oldFileContent&&this._newFileContent)return;let e={},n={};if(!this._oldFileContent&&!this._newFileContent){let i=1,r=1,o="",a="",l=!1;for(;r<=this.diffLineLength||i<=this.diffLineLength;){let d=r++,u=i++,c=v(this,Ne,"m",kr).call(this,d),f=v(this,Ne,"m",Ir).call(this,u);c?o+=c.text:(o+=`
`,e[d]=!0),f?a+=f.text:(a+=`
`,n[u]=!0),!l&&c&&f&&(l=l||c.noTrailingNewLine!==f.noTrailingNewLine)}if(!l&&o===a)return;this._oldFileContent=o,this._newFileContent=a,W(this,Ke,_r(this._oldFileContent,this._oldFileLang,v(this,Rt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),W(this,Xe,_r(this._newFileContent,this._newFileLang,v(this,Rt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"),W(this,$n,e,"f"),W(this,Dn,n,"f"),W(this,Qi,!0,"f")}else if(v(this,Ke,"f")){let i=1,r=1,o="",a=!1;for(;r<=v(this,Ke,"f").maxLineNumber;){let l=v(this,Ne,"m",Ir).call(this,i++),d=v(this,Ne,"m",kr).call(this,r);l?(o+=l.text,r=l.oldLineNumber?l.oldLineNumber+1:r):(d||(o+=v(this,Ne,"m",xo).call(this,r)),r++),!a&&l&&d&&(a=a||l.noTrailingNewLine!==d.noTrailingNewLine)}if(!a&&o===this._oldFileContent)return;this._newFileContent=o,W(this,Xe,_r(this._newFileContent,this._newFileLang,v(this,Rt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f")}else if(v(this,Xe,"f")){let i=1,r=1,o="",a=!1;for(;r<=v(this,Xe,"f").maxLineNumber;){let l=v(this,Ne,"m",kr).call(this,i++),d=v(this,Ne,"m",Ir).call(this,r);l?(o+=l.text,r=l.newLineNumber?l.newLineNumber+1:r):(d||(o+=v(this,Ne,"m",yo).call(this,r)),r++),!a&&d&&l&&(a=a||d.noTrailingNewLine!==l.noTrailingNewLine)}if(!a&&o===this._newFileContent)return;this._oldFileContent=o,W(this,Ke,_r(this._oldFileContent,this._oldFileLang,v(this,Rt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f")}v(this,Ne,"m",ba).call(this)},zp=function(){var e,n,i,r;for(let o in v(this,Yn,"f")||{}){let a=(e=v(this,Yn,"f"))===null||e===void 0?void 0:e[o],l=(n=v(this,Ji,"f"))===null||n===void 0?void 0:n[o];if((!v(this,$n,"f")||!v(this,$n,"f")[o])&&a?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'oldFileContent' and 'diff' at line ${o}. Please verify the 'oldFileContent' is correct.`);break}}for(let o in v(this,Jn,"f")||{}){let a=(i=v(this,Jn,"f"))===null||i===void 0?void 0:i[o],l=(r=v(this,qi,"f"))===null||r===void 0?void 0:r[o];if((!v(this,Dn,"f")||!v(this,Dn,"f")[o])&&a?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'newFileContent' and 'diff' at line ${o}. Please verify the 'newFileContent' is correct.`);break}}},wa=function(){var e;if(!(!((e=v(this,Si,"f"))===null||e===void 0)&&e.length))return;let n=c=>v(this,Ne,"m",yo).call(this,c),i=c=>v(this,Ne,"m",xo).call(this,c),r=c=>v(this,Ne,"m",$d).call(this,c),o=c=>v(this,Ne,"m",Nd).call(this,c);W(this,Ci,[],"f"),this.additionLength=0,this.deletionLength=0;let a=[];v(this,Si,"f").forEach(c=>{c.hunks.forEach(p=>{let m=[],g=[];p.lines.forEach(x=>{x.type===He.Add?(m.push(x),this.additionLength++):x.type===He.Delete?(g.push(x),this.deletionLength++):(Sd(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o}),m=[],g=[]),a.push(x)}),Sd(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o})})});let l=null;W(this,Ci,a.map((c,f)=>{var p;let m=c;if(m.index=f,m.isFirst=f===0,m.type===He.Hunk){let g=(p=m.text.split("@@"))===null||p===void 0?void 0:p[1].split(" ").filter(Boolean),x=g?.[0]||"",w=g?.[1]||"",[_,L]=x.split(","),[y,C]=w.split(",");m.hunkInfo={oldStartIndex:-Number(_),oldLength:Number(L),newStartIndex:+Number(y),newLength:Number(C),_oldStartIndex:-Number(_),_oldLength:Number(L),_newStartIndex:+Number(y),_newLength:Number(C)},l=m}else if(m.type===He.Context){let g=c;l&&(g.prevHunkLine=l,l=null)}else l=null;return m}),"f"),W(this,Yn,{},"f"),W(this,Jn,{},"f");let d=-1,u=-1;v(this,Ci,"f").forEach(c=>{c.oldLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,c.oldLineNumber),v(this,Yn,"f")[c.oldLineNumber]=c),c.newLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,c.newLineNumber),v(this,Jn,"f")[c.newLineNumber]=c)})},xa=function(){var e,n,i,r,o,a;W(this,ki,((e=v(this,Ke,"f"))===null||e===void 0?void 0:e.highlighterName)||((n=v(this,Xe,"f"))===null||n===void 0?void 0:n.highlighterName)||v(this,ki,"f"),"f"),W(this,Ii,((i=v(this,Ke,"f"))===null||i===void 0?void 0:i.highlighterType)||((r=v(this,Xe,"f"))===null||r===void 0?void 0:r.highlighterType)||v(this,Ii,"f"),"f"),!((o=v(this,Ke,"f"))===null||o===void 0)&&o.highlighterName&&W(this,qn,v(this,Ke,"f").syntaxFile,"f"),!((a=v(this,Xe,"f"))===null||a===void 0)&&a.highlighterName&&W(this,Kn,v(this,Xe,"f").syntaxFile,"f")},Cd=function({registerHighlighter:e}){var n,i,r,o;(n=v(this,Ke,"f"))===null||n===void 0||n.doSyntax({registerHighlighter:e,theme:v(this,Rt,"f")}),W(this,qn,(i=v(this,Ke,"f"))===null||i===void 0?void 0:i.syntaxFile,"f"),(r=v(this,Xe,"f"))===null||r===void 0||r.doSyntax({registerHighlighter:e,theme:v(this,Rt,"f")}),W(this,Kn,(o=v(this,Xe,"f"))===null||o===void 0?void 0:o.syntaxFile,"f")},tf=function({registerHighlighter:e}={}){v(this,bo,"f")&&!v(this,wo,"f")||(v(this,Ne,"m",Cd).call(this,{registerHighlighter:e}),v(this,Ne,"m",xa).call(this))},kr=function(e){var n;if(e)return(n=v(this,Yn,"f"))===null||n===void 0?void 0:n[e]},Ir=function(e){var n;if(e)return(n=v(this,Jn,"f"))===null||n===void 0?void 0:n[e]},xo=function(e){var n;return(n=v(this,Vi,"f"))===null||n===void 0?void 0:n[e]},yo=function(e){var n;return(n=v(this,Yi,"f"))===null||n===void 0?void 0:n[e]},Nd=function(e){var n;return(n=v(this,qn,"f"))===null||n===void 0?void 0:n[e]},$d=function(e){var n;return(n=v(this,Kn,"f"))===null||n===void 0?void 0:n[e]};var nf="diff-multi-select-active";function Dd(t){if(!t)return null;let e=t.querySelector("span[data-line-num]");if(!e)return null;let n=e.getAttribute("data-line-num"),i=parseInt(n??"",10);return n!==i.toString()||isNaN(i)?null:i}function Wp(t){if(!t)return null;let e=t.closest("[data-side]");return e?e.getAttribute("data-side"):null}function Td(t){if(!t)return null;let e=t.closest(".diff-line-num");if(!e)return null;let n=e.querySelector("span[data-line-old-num]"),i=e.querySelector("span[data-line-new-num]"),r=n?.getAttribute("data-line-old-num"),o=i?.getAttribute("data-line-new-num"),a=r?parseInt(r,10):void 0,l=o?parseInt(o,10):void 0;return a===void 0&&l===void 0?null:{old:a,new:l}}function Fd(t,e=!1){var n,i,r,o;if(!t)return null;let a=null;if(!e||t.closest(".diff-add-widget-wrapper")){let l=t.closest(".diff-line-new-content"),d=t.closest(".diff-line-old-content");l&&(a=(i=(n=l.parentElement)===null||n===void 0?void 0:n.querySelector(".diff-line-new-num"))!==null&&i!==void 0?i:null),d&&(a=(o=(r=d.parentElement)===null||r===void 0?void 0:r.querySelector(".diff-line-old-num"))!==null&&o!==void 0?o:null)}return a||(a=t.closest(".diff-line-new-num")||t.closest(".diff-line-old-num")),a}function ds(t){let e=Math.min(t.startLineNumber,t.endLineNumber),n=Math.max(t.startLineNumber,t.endLineNumber);return{...t,startLineNumber:e,endLineNumber:n}}var rf=t=>{let e=[];return t.new&&t.new.length&&e.push({side:"new",startLineNumber:Math.min(...t.new),endLineNumber:Math.max(...t.new)}),t.old&&t.old.length&&e.push({side:"old",startLineNumber:Math.min(...t.old),endLineNumber:Math.max(...t.old)}),e},Qp=(t,e,n,i)=>{Jp(e,n).forEach(o=>{var a,l;if(!o.isHide&&o.index){let d=t.filter(u=>u.getAttribute("data-line")===o.index.toString());if(d.length===2)if(o.isContext)d.forEach(u=>u.querySelectorAll("td").forEach(c=>c.classList.add(i)));else{let u=d.find(c=>c.getAttribute("data-side")===n.side);u?.querySelectorAll("td").forEach(c=>c.classList.add(i))}else o.isContext?(a=d[0])===null||a===void 0||a.querySelectorAll("td").forEach(u=>u.classList.add(i)):(l=d[0])===null||l===void 0||l.querySelectorAll(`td[data-side="${n.side}"]`).forEach(u=>u.classList.add(i))}})};function Vp(t,e,n,i={old:[],new:[]},r=nf){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(f=>{var p;return((p=f.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),d=rf(i),c=(e?d.concat(e):d).map(ds);l.forEach(f=>{f.querySelectorAll("td").forEach(m=>m.classList.remove(r))}),c.forEach(f=>{f&&n&&Qp(l,n,f,r)})}function Yp(t,e,n,i={old:[],new:[]},r=nf){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(f=>{var p;return((p=f.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),d=rf(i),c=(e?d.concat(e):d).map(ds);l.forEach(f=>{let p=f.querySelector(".diff-line-num"),m=f.querySelector(".diff-line-content");if(!p||!m)return;p.classList.remove(r),m.classList.remove(r);let g=p.querySelector("span[data-line-old-num]"),x=p.querySelector("span[data-line-new-num]"),w=g?.getAttribute("data-line-old-num"),_=x?.getAttribute("data-line-new-num"),L=w?parseInt(w,10):void 0,y=_?parseInt(_,10):void 0;c.some(C=>C.side==="old"&&L&&L>=C.startLineNumber&&L<=C.endLineNumber||C.side==="new"&&y&&y>=C.startLineNumber&&y<=C.endLineNumber)&&(p.classList.add(r),m.classList.add(r))})}function Jp(t,e){var n;let i=ds(e),r=[],{side:o,startLineNumber:a,endLineNumber:l}=i,d=o==="old"?R.old:R.new;for(let u=a;u<=l;u++){let c=t.getSplitLineByLineNumber(u,d),f=t.getSplitLineIndexByLineNumber(u,d);if(c&&c.lineNumber!==void 0){let p=(n=c.diff)===null||n===void 0?void 0:n.type;r.push({index:f+1,lineNumber:c.lineNumber,value:c.value,isHide:Gp(t,u,d).split,isDelete:p===He.Delete,isAdd:p===He.Add,isContext:p===He.Context||p===void 0})}}return r}var Sn,br,ts,pt,Fe,ca,ua,qp,Md,Hd,Kp,Bd,Rd,Od,Pd,jd,po,Ud;br=new WeakMap,ts=new WeakMap,pt=new WeakMap,Fe=new WeakMap,ca=new WeakMap,ua=new WeakMap,qp=new WeakMap,Md=new WeakMap,Hd=new WeakMap,Sn=new WeakSet,Kp=function(){var e;if(!v(this,br,"f")||v(this,ua,"f"))return;let n=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Rd).call(this,o):v(this,Sn,"m",Bd).call(this,o)},i=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Pd).call(this,o):v(this,Sn,"m",Od).call(this,o)},r=()=>{v(this,Sn,"m",jd).call(this)};W(this,ua,{mousedown:n,mouseover:i,mouseup:r},"f"),v(this,br,"f").addEventListener("mousedown",n),v(this,br,"f").addEventListener("mouseover",i),document.addEventListener("mouseup",r),W(this,Md,((e=v(this,ts,"f"))===null||e===void 0?void 0:e.subscribe(()=>v(this,Hd,"f").call(this)))||(()=>{}),"f")},Bd=function(e){let n=Fd(e.target,!0);if(!n)return;let i=Dd(n);if(i===null)return;let r=Wp(n);if(!r)return;v(this,Fe,"f").isSelecting=!0,v(this,Fe,"f").startInfo={lineNumber:i,side:r};let o={side:r,startLineNumber:i,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let a=v(this,pt,"f").scopeToHunk(o);a&&(o=a)}v(this,Fe,"f").currentRange=o,v(this,Sn,"m",po).call(this),v(this,pt,"f").onSelectionChange(o,{...v(this,Fe,"f")})},Rd=function(e){var n;let i=Td(e.target);if(!i)return;let r=(n=i.new)!==null&&n!==void 0?n:i.old;if(r===void 0)return;let o=i.new!==void 0?"new":"old";v(this,Fe,"f").isSelecting=!0,v(this,Fe,"f").startInfo={lineNumber:r,side:o};let a={side:o,startLineNumber:r,endLineNumber:r};if(v(this,pt,"f").scopeToHunk){let l=v(this,pt,"f").scopeToHunk(a);l&&(a=l)}v(this,Fe,"f").currentRange=a,v(this,Sn,"m",po).call(this),v(this,pt,"f").onSelectionChange(a,{...v(this,Fe,"f")})},Od=function(e){if(!v(this,Fe,"f").isSelecting||!v(this,Fe,"f").startInfo)return;let n=Fd(e.target);if(!n)return;let i=Dd(n);if(i===null)return;let r={side:v(this,Fe,"f").startInfo.side,startLineNumber:v(this,Fe,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Fe,"f").currentRange=r,v(this,Sn,"m",po).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Fe,"f")})},Pd=function(e){if(!v(this,Fe,"f").isSelecting||!v(this,Fe,"f").startInfo)return;let n=Td(e.target);if(!n)return;let i=n[v(this,Fe,"f").startInfo.side];if(i===void 0)return;let r={side:v(this,Fe,"f").startInfo.side,startLineNumber:v(this,Fe,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Fe,"f").currentRange=r,v(this,Sn,"m",po).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Fe,"f")})},jd=function(){if(!v(this,Fe,"f").isSelecting||!v(this,Fe,"f").currentRange){v(this,Sn,"m",Ud).call(this);return}let e=ds(v(this,Fe,"f").currentRange);v(this,Fe,"f").currentRange=e,v(this,Fe,"f").isSelecting=!1;let n=this.getSelectionResult();v(this,pt,"f").onSelectionComplete(n)},po=function(){v(this,pt,"f").isUnifiedMode?Yp(v(this,br,"f"),v(this,Fe,"f").currentRange,v(this,ts,"f"),v(this,ca,"f"),v(this,pt,"f").selectedClassName):Vp(v(this,br,"f"),v(this,Fe,"f").currentRange,v(this,ts,"f"),v(this,ca,"f"),v(this,pt,"f").selectedClassName)},Ud=function(){W(this,Fe,{isSelecting:!1,startInfo:null,currentRange:null},"f")};var Io=class{diff(e,n,i={}){let r;typeof i=="function"?(r=i,i={}):"callback"in i&&(r=i.callback);let o=this.castInput(e,i),a=this.castInput(n,i),l=this.removeEmpty(this.tokenize(o,i)),d=this.removeEmpty(this.tokenize(a,i));return this.diffWithOptionsObj(l,d,i,r)}diffWithOptionsObj(e,n,i,r){var o;let a=L=>{if(L=this.postProcess(L,i),r){setTimeout(function(){r(L)},0);return}else return L},l=n.length,d=e.length,u=1,c=l+d;i.maxEditLength!=null&&(c=Math.min(c,i.maxEditLength));let f=(o=i.timeout)!==null&&o!==void 0?o:1/0,p=Date.now()+f,m=[{oldPos:-1,lastComponent:void 0}],g=this.extractCommon(m[0],n,e,0,i);if(m[0].oldPos+1>=d&&g+1>=l)return a(this.buildValues(m[0].lastComponent,n,e));let x=-1/0,w=1/0,_=()=>{for(let L=Math.max(x,-u);L<=Math.min(w,u);L+=2){let y,C=m[L-1],S=m[L+1];C&&(m[L-1]=void 0);let E=!1;if(S){let b=S.oldPos-L;E=S&&0<=b&&b<l}let h=C&&C.oldPos+1<d;if(!E&&!h){m[L]=void 0;continue}if(!h||E&&C.oldPos<S.oldPos?y=this.addToPath(S,!0,!1,0,i):y=this.addToPath(C,!1,!0,1,i),g=this.extractCommon(y,n,e,L,i),y.oldPos+1>=d&&g+1>=l)return a(this.buildValues(y.lastComponent,n,e))||!0;m[L]=y,y.oldPos+1>=d&&(w=Math.min(w,L-1)),g+1>=l&&(x=Math.max(x,L+1))}u++};if(r)(function L(){setTimeout(function(){if(u>c||Date.now()>p)return r(void 0);_()||L()},0)})();else for(;u<=c&&Date.now()<=p;){let L=_();if(L)return L}}addToPath(e,n,i,r,o){let a=e.lastComponent;return a&&!o.oneChangePerToken&&a.added===n&&a.removed===i?{oldPos:e.oldPos+r,lastComponent:{count:a.count+1,added:n,removed:i,previousComponent:a.previousComponent}}:{oldPos:e.oldPos+r,lastComponent:{count:1,added:n,removed:i,previousComponent:a}}}extractCommon(e,n,i,r,o){let a=n.length,l=i.length,d=e.oldPos,u=d-r,c=0;for(;u+1<a&&d+1<l&&this.equals(i[d+1],n[u+1],o);)u++,d++,c++,o.oneChangePerToken&&(e.lastComponent={count:1,previousComponent:e.lastComponent,added:!1,removed:!1});return c&&!o.oneChangePerToken&&(e.lastComponent={count:c,previousComponent:e.lastComponent,added:!1,removed:!1}),e.oldPos=d,u}equals(e,n,i){return i.comparator?i.comparator(e,n):e===n||!!i.ignoreCase&&e.toLowerCase()===n.toLowerCase()}removeEmpty(e){let n=[];for(let i=0;i<e.length;i++)e[i]&&n.push(e[i]);return n}castInput(e,n){return e}tokenize(e,n){return Array.from(e)}join(e){return e.join("")}postProcess(e,n){return e}get useLongestToken(){return!1}buildValues(e,n,i){let r=[],o;for(;e;)r.push(e),o=e.previousComponent,delete e.previousComponent,e=o;r.reverse();let a=r.length,l=0,d=0,u=0;for(;l<a;l++){let c=r[l];if(c.removed)c.value=this.join(i.slice(u,u+c.count)),u+=c.count;else{if(!c.added&&this.useLongestToken){let f=n.slice(d,d+c.count);f=f.map(function(p,m){let g=i[u+m];return g.length>p.length?g:p}),c.value=this.join(f)}else c.value=this.join(n.slice(d,d+c.count));d+=c.count,c.added||(u+=c.count)}}return r}};var ka=class extends Io{constructor(){super(...arguments),this.tokenize=Zp}equals(e,n,i){return i.ignoreWhitespace?((!i.newlineIsToken||!e.includes(`
`))&&(e=e.trim()),(!i.newlineIsToken||!n.includes(`
`))&&(n=n.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith(`
`)&&(e=e.slice(0,-1)),n.endsWith(`
`)&&(n=n.slice(0,-1))),super.equals(e,n,i)}},Xp=new ka;function Ia(t,e,n){return Xp.diff(t,e,n)}function Zp(t,e){e.stripTrailingCr&&(t=t.replace(/\r\n/g,`
`));let n=[],i=t.split(/(\n|\r\n)/);i[i.length-1]||i.pop();for(let r=0;r<i.length;r++){let o=i[r];r%2&&!e.newlineIsToken?n[n.length-1]+=o:n.push(o)}return n}var of={includeIndex:!0,includeUnderline:!0,includeFileHeaders:!0};function Sa(t,e,n,i,r,o,a){let l;a?typeof a=="function"?l={callback:a}:l=a:l={},typeof l.context>"u"&&(l.context=4);let d=l.context;if(l.newlineIsToken)throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(l.callback){let{callback:c}=l;Ia(n,i,Object.assign(Object.assign({},l),{callback:f=>{let p=u(f);c(p)}}))}else return u(Ia(n,i,l));function u(c){if(!c)return;c.push({value:"",lines:[]});function f(L){return L.map(function(y){return" "+y})}let p=[],m=0,g=0,x=[],w=1,_=1;for(let L=0;L<c.length;L++){let y=c[L],C=y.lines||eh(y.value);if(y.lines=C,y.added||y.removed){if(!m){let S=c[L-1];m=w,g=_,S&&(x=d>0?f(S.lines.slice(-d)):[],m-=x.length,g-=x.length)}for(let S of C)x.push((y.added?"+":"-")+S);y.added?_+=C.length:w+=C.length}else{if(m)if(C.length<=d*2&&L<c.length-2)for(let S of f(C))x.push(S);else{let S=Math.min(C.length,d);for(let h of f(C.slice(0,S)))x.push(h);let E={oldStart:m,oldLines:w-m+S,newStart:g,newLines:_-g+S,lines:x};p.push(E),m=0,g=0,x=[]}w+=C.length,_+=C.length}}for(let L of p)for(let y=0;y<L.lines.length;y++)L.lines[y].endsWith(`
`)?L.lines[y]=L.lines[y].slice(0,-1):(L.lines.splice(y+1,0,"\\ No newline at end of file"),y++);return{oldFileName:t,newFileName:e,oldHeader:r,newHeader:o,hunks:p}}}function fs(t,e){if(e||(e=of),Array.isArray(t)){if(t.length>1&&!e.includeFileHeaders)throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");return t.map(i=>fs(i,e)).join(`
`)}let n=[];e.includeIndex&&t.oldFileName==t.newFileName&&n.push("Index: "+t.oldFileName),e.includeUnderline&&n.push("==================================================================="),e.includeFileHeaders&&(n.push("--- "+t.oldFileName+(typeof t.oldHeader>"u"?"":"	"+t.oldHeader)),n.push("+++ "+t.newFileName+(typeof t.newHeader>"u"?"":"	"+t.newHeader)));for(let i=0;i<t.hunks.length;i++){let r=t.hunks[i];r.oldLines===0&&(r.oldStart-=1),r.newLines===0&&(r.newStart-=1),n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@");for(let o of r.lines)n.push(o)}return n.join(`
`)+`
`}function Ca(t,e,n,i,r,o,a){if(typeof a=="function"&&(a={callback:a}),a?.callback){let{callback:l}=a;Sa(t,e,n,i,r,o,Object.assign(Object.assign({},a),{callback:d=>{l(d?fs(d,a.headerOptions):void 0)}}))}else{let l=Sa(t,e,n,i,r,o,a);return l?fs(l,a?.headerOptions):void 0}}function eh(t){let e=t.endsWith(`
`),n=t.split(`
`).map(i=>i+`
`);return e?n.pop():n.push(n.pop().slice(0,-1)),n}as.name="@git-diff-view/file";function sf(t,e,n,i,r,o,a,l){let d=Ca(t,n,e,i,"","",a);return new Ki(t,e,n,i,[d],r,o,l)}var $r;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})($r||($r={}));var Pt;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(Pt||(Pt={}));typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var Xn={};var Ue=Symbol("uninitialized"),tn=Symbol("filename");var cs="http://www.w3.org/1999/xhtml",So="http://www.w3.org/2000/svg",Na="http://www.w3.org/1998/Math/MathML";var af=globalThis.process?.env?.NODE_ENV,H=af&&!af.toLowerCase().startsWith("prod");var vi=Array.isArray,lf=Array.prototype.indexOf,Ni=Array.prototype.includes,Dr=Array.from,$a=Object.keys,jt=Object.defineProperty,cn=Object.getOwnPropertyDescriptor,Da=Object.getOwnPropertyDescriptors,Ta=Object.prototype,df=Array.prototype,Tr=Object.getPrototypeOf,Fa=Object.isExtensible;var ht=()=>{};function us(t){for(var e=0;e<t.length;e++)t[e]()}function ps(){var t,e,n=new Promise((i,r)=>{t=i,e=r});return{promise:n,resolve:t,reject:e}}var Yt=Symbol("$state"),hs=Symbol("legacy props"),ff=Symbol(""),ms=Symbol("proxy path"),gs=Symbol("attributes"),Co=Symbol("class"),No=Symbol("style"),$o=Symbol("text");var Ma=Symbol("hmr anchor"),_i=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Ha=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Fr=3,un=8;function cf(t){if(H){let e=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${t}"
https://svelte.dev/e/invariant_violation`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invariant_violation")}function Mr(t){if(H){let e=new Error(`lifecycle_outside_component
\`${t}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function pf(){if(H){let t=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function hf(){if(H){let t=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/derived_references_self")}function Ba(t,e,n){if(H){let i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${t} and ${e}`:`Keyed each block has duplicate key at indexes ${t} and ${e}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function mf(t,e,n){if(H){let i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${t} was \`${e}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_volatile")}function gf(t){if(H){let e=new Error(`effect_in_teardown
\`${t}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function vf(){if(H){let t=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function _f(t){if(H){let e=new Error(`effect_orphan
\`${t}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_orphan")}function bf(){if(H){let t=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function wf(){if(H){let t=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydration_failed")}function xf(){if(H){let t=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invalid_snippet")}function yf(t){if(H){let e=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${t}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Ef(t){if(H){let e=new Error(`rune_outside_svelte
The \`${t}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Af(){if(H){let t=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/set_context_after_init")}function Lf(){if(H){let t=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function kf(){if(H){let t=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function If(){if(H){let t=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Sf(){if(H){let t=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Zn="font-weight: bold",ei="font-weight: normal";function Cf(t){H?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${t}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Zn,ei):console.warn("https://svelte.dev/e/await_reactivity_loss")}function Nf(t,e){H?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${t}\` (${e}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,Zn,ei):console.warn("https://svelte.dev/e/await_waterfall")}function $f(){H?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,Zn,ei):console.warn("https://svelte.dev/e/derived_inert")}function Df(t,e,n){H?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${t}\` attribute on \`${e}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Zn,ei):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Tf(t){H?console.warn(`%c[svelte] hydration_html_changed
%c${t?`The value of an \`{@html ...}\` block ${t} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,Zn,ei):console.warn("https://svelte.dev/e/hydration_html_changed")}function $i(t){H?console.warn(`%c[svelte] hydration_mismatch
%c${t?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${t}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,Zn,ei):console.warn("https://svelte.dev/e/hydration_mismatch")}function Ff(){H?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Zn,ei):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function vs(t){H?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${t}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Zn,ei):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function Mf(){H?console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Zn,ei):console.warn("https://svelte.dev/e/state_proxy_unmount")}function Hf(){H?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Zn,ei):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var le=!1;function mt(t){le=t}var _e;function Me(t){if(t===null)throw $i(),Xn;return _e=t}function At(){return Me(Lt(_e))}function N(t){if(le){if(Lt(_e)!==null)throw $i(),Xn;_e=t}}function Zi(t=1){if(le){for(var e=t,n=_e;e--;)n=Lt(n);_e=n}}function ti(t=!0){for(var e=0,n=_e;;){if(n.nodeType===un){var i=n.data;if(i==="]"){if(e===0)return n;e-=1}else(i==="["||i==="[!"||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(e+=1)}var r=Lt(n);t&&n.remove(),n=r}}function To(t){if(!t||t.nodeType!==un)throw $i(),Xn;return t.data}function _s(t){return t===this.v}function Ra(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function bs(t){return!Ra(t,this.v)}var gt=!1,bi=!1,Tn=!1;function Bf(){bi=!0}var Fo=null;function Ut(t,e){return t.label=e,xs(t.v,e),t}function xs(t,e){return t?.[ms]?.(e),t}function Fn(t){let e=new Error,n=ih();return n.length===0?null:(n.unshift(`
`),jt(e,"stack",{value:n.join(`
`)}),jt(e,"name",{value:t}),e)}function ih(){let t=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let e=new Error().stack;if(Error.stackTraceLimit=t,!e)return[];let n=e.split(`
`),i=[];for(let r=0;r<n.length;r++){let o=n[r],a=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||i.push(o)}}return i}function Of(t,e){if(!H)throw new Error("invariant(...) was not guarded by if (DEV)");t||cf(e)}var Ae=null;function wi(t){Ae=t}var Mn=null;function Rr(t){Mn=t}var pn=null;function ys(t){pn=t}function Ve(t){return Pf("getContext").get(t)}function Ye(t,e){let n=Pf("setContext");if(gt){var i=ae.f,r=!me&&(i&32)!==0&&!Ae.i;r||Af()}return n.set(t,e),e}function de(t,e=!1,n){Ae={p:Ae,i:!1,c:null,e:null,s:t,x:null,r:ae,l:bi&&!e?{s:null,u:null,$:[]}:null},H&&(Ae.function=n,pn=n)}function fe(t){var e=Ae,n=e.e;if(n!==null){e.e=null;for(var i of n)Oa(i)}return t!==void 0&&(e.x=t),e.i=!0,Ae=e.p,H&&(pn=Ae?.function??null),t??{}}function ni(){return!bi||Ae!==null&&Ae.l===null}function Pf(t){return Ae===null&&Mr(t),Ae.c??=new Map(rh(Ae)||void 0)}function rh(t){let e=t.p;for(;e!==null;){let n=e.c;if(n!==null)return n;e=e.p}return null}var er=[];function jf(){var t=er;er=[],us(t)}function kt(t){if(er.length===0&&!tr){var e=er;queueMicrotask(()=>{e===er&&jf()})}er.push(t)}function Uf(){for(;er.length>0;)jf()}var Pa=new WeakMap;function Es(t){var e=ae;if(e===null)return me.f|=8388608,t;if(H&&t instanceof Error&&!Pa.has(t)&&Pa.set(t,oh(t,e)),(e.f&32768)===0&&(e.f&4)===0)throw H&&!e.parent&&t instanceof Error&&Gf(t),t;Bn(t,e)}function Bn(t,e){if(!(e!==null&&(e.f&16384)!==0)){for(;e!==null;){if((e.f&128)!==0){if((e.f&32768)===0)throw t;try{e.b.error(t);return}catch(n){t=n}}e=e.parent}throw H&&t instanceof Error&&Gf(t),t}}function oh(t,e){let n=cn(t,"message");if(!(n&&!n.configurable)){for(var i=Ho?"  ":"	",r=`
${i}in ${e.fn?.name||"<unknown>"}`,o=e.ctx;o!==null;)r+=`
${i}in ${o.function?.[tn].split("/").pop()}`,o=o.p;return{message:t.message+`
${r}
`,stack:t.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function Gf(t){let e=Pa.get(t);e&&(jt(t,"message",{value:e.message}),jt(t,"stack",{value:e.stack}))}var sh=-7169;function Be(t,e){t.f=t.f&sh|e}function Or(t){(t.f&512)!==0||t.deps===null?Be(t,1024):Be(t,4096)}function zf(t){if(t!==null)for(let e of t)(e.f&2)===0||(e.f&65536)===0||(e.f^=65536,zf(e.deps))}function As(t,e,n){(t.f&2048)!==0?e.add(t):(t.f&4096)!==0&&n.add(t),zf(t.deps),Be(t,1024)}var Wf=!1;function ii(t){var e=me,n=ae;wt(null),xt(null);try{return t()}finally{wt(e),xt(n)}}function Vf(t){let e=0,n=Qt(0),i;return H&&Ut(n,"createSubscriber version"),()=>{Di()&&(s(n),Jt(()=>(e===0&&(i=Ze(()=>t(()=>or(n)))),e+=1,()=>{kt(()=>{e-=1,e===0&&(i?.(),i=void 0,or(n))})})))}}var dh=589824;function Ua(t,e,n,i){new ja(t,e,n,i)}var ja=class{parent;is_pending=!1;transform_error;#e;#t=le?_e:null;#n;#l;#o;#s=null;#i=null;#a=null;#r=null;#h=0;#f=0;#c=!1;#u=new Set;#g=new Set;#d=null;#b=Vf(()=>(this.#d=Qt(this.#h),H&&Ut(this.#d,"$effect.pending()"),()=>{this.#d=null}));constructor(e,n,i,r){this.#e=e,this.#n=n,this.#l=o=>{var a=ae;a.b=this,a.f|=128,i(o)},this.parent=ae.b,this.transform_error=r??this.parent?.transform_error??(o=>o),this.#o=sn(()=>{if(le){let o=this.#t;At();let a=o.data==="[!";if(o.data.startsWith("[?")){let d=JSON.parse(o.data.slice("[?".length));this.#w(d)}else a?this.#y():this.#v()}else this.#x()},dh),le&&(this.#e=_e)}#v(){try{this.#s=dt(()=>this.#l(this.#e))}catch(e){this.error(e)}}#w(e){let n=this.#n.failed;n&&(this.#a=dt(()=>{n(this.#e,()=>e,()=>()=>{})}))}#y(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#i=dt(()=>e(this.#e)),kt(()=>{var n=this.#r=document.createDocumentFragment(),i=yt();n.append(i),this.#s=this.#_(()=>dt(()=>this.#l(i))),this.#f===0&&(this.#e.before(n),this.#r=null,ri(this.#i,()=>{this.#i=null}),this.#p(be))}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#h=0,this.#s=dt(()=>{this.#l(this.#e)}),this.#f>0){var e=this.#r=document.createDocumentFragment();Pr(this.#s,e);let n=this.#n.pending;this.#i=dt(()=>n(this.#e))}else this.#p(be)}catch(n){this.error(n)}}#p(e){this.is_pending=!1,e.transfer_effects(this.#u,this.#g)}defer_effect(e){As(e,this.#u,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#_(e){var n=ae,i=me,r=Ae;xt(this.#o),wt(this.#o),wi(this.#o.ctx);try{return hn.ensure(),e()}catch(o){return Es(o),null}finally{xt(n),wt(i),wi(r)}}#m(e,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#m(e,n);return}this.#f+=e,this.#f===0&&(this.#p(n),this.#i&&ri(this.#i,()=>{this.#i=null}),this.#r&&(this.#e.before(this.#r),this.#r=null))}update_pending_count(e,n){this.#m(e,n),this.#h+=e,!(!this.#d||this.#c)&&(this.#c=!0,kt(()=>{this.#c=!1,this.#d&&Rn(this.#d,this.#h)}))}get_effect_pending(){return this.#b(),s(this.#d)}error(e){if(!this.#n.onerror&&!this.#n.failed)throw e;be?.is_fork?(this.#s&&be.skip_effect(this.#s),this.#i&&be.skip_effect(this.#i),this.#a&&be.skip_effect(this.#a),be.oncommit(()=>{this.#E(e)})):this.#E(e)}#E(e){this.#s&&(tt(this.#s),this.#s=null),this.#i&&(tt(this.#i),this.#i=null),this.#a&&(tt(this.#a),this.#a=null),le&&(Me(this.#t),Zi(),Me(ti()));var n=this.#n.onerror;let i=this.#n.failed;var r=!1,o=!1;let a=()=>{if(r){Hf();return}r=!0,o&&Sf(),this.#a!==null&&ri(this.#a,()=>{this.#a=null}),this.#_(()=>{this.#x()})},l=d=>{try{o=!0,n?.(d,a),o=!1}catch(u){Bn(u,this.#o&&this.#o.parent)}i&&(this.#a=this.#_(()=>{try{return dt(()=>{var u=ae;u.b=this,u.f|=128,i(this.#e,()=>d,()=>a)})}catch(u){return Bn(u,this.#o.parent),null}}))};kt(()=>{var d;try{d=this.transform_error(e)}catch(u){Bn(u,this.#o&&this.#o.parent);return}d!==null&&typeof d=="object"&&typeof d.then=="function"?d.then(l,u=>Bn(u,this.#o&&this.#o.parent)):l(d)})}};function Ls(t,e,n,i){let r=ni()?Ur:Gr;var o=t.filter(m=>!m.settled),a=e.map(r);if(H&&a.forEach((m,g)=>{m.label=e[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,(x,w)=>w)}),n.length===0&&o.length===0){i(a);return}var l=ae,d=Jf(),u=o.length===1?o[0].promise:o.length>1?Promise.all(o.map(m=>m.promise)):null;function c(m){if((l.f&16384)===0){d();try{i([...a,...m])}catch(g){Bn(g,l)}jr()}}var f=Ga();if(n.length===0){u.then(()=>c([])).finally(f);return}function p(){Promise.all(n.map(m=>Wa(m))).then(c).catch(m=>Bn(m,l)).finally(f)}u?u.then(()=>{d(),p(),jr()}):p()}function Jf(){var t=ae,e=me,n=Ae,i=be;if(H)var r=Mn;return function(a=!0){xt(t),wt(e),wi(n),a&&(t.f&16384)===0&&(i?.activate(),i?.apply()),H&&(za(null),Rr(r))}}function jr(t=!0){xt(null),wt(null),wi(null),t&&be?.deactivate(),H&&(za(null),Rr(null))}function Ga(){var t=ae,e=t.b,n=be,i=!!e?.is_rendered();return e?.update_pending_count(1,n),n.increment(i,t),()=>{e?.update_pending_count(-1,n),n.decrement(i,t)}}var an=null;function za(t){an=t}var Ro=new Set;function Ur(t){var e=2050;ae!==null&&(ae.f|=524288);let n={ctx:Ae,deps:null,effects:null,equals:_s,f:e,fn:t,reactions:null,rv:0,v:Ue,wv:0,parent:ae,ac:null};return H&&Tn&&(n.created=Fn("created at")),n}var zr=Symbol("obsolete");function Wa(t,e,n){let i=ae;i===null&&pf();var r=void 0,o=Qt(Ue);H&&(o.label=e??t.toString());var a=!me,l=new Set;return Xf(()=>{var d=ae;H&&(an={effect:d,effect_deps:new Set,warned:!1});var u=ps();r=u.promise;try{Promise.resolve(t()).then(u.resolve,m=>{m!==_i&&u.reject(m)}).finally(jr)}catch(m){u.reject(m),jr()}if(H){if(an){if(d.deps!==null)for(let m=0;m<qt;m+=1)an.effect_deps.add(d.deps[m]);if(It!==null)for(let m=0;m<It.length;m+=1)an.effect_deps.add(It[m])}an=null}var c=be;if(a){if((d.f&32768)!==0)var f=Ga();if(i.b?.is_rendered())c.async_deriveds.get(d)?.reject(zr);else for(let m of l.values())m.reject(zr);l.add(u),c.async_deriveds.set(d,u)}let p=(m,g=void 0)=>{H&&(an=null),f?.(),l.delete(u),g!==zr&&(c.activate(),g?(o.f|=8388608,Rn(o,g)):((o.f&8388608)!==0&&(o.f^=8388608),H&&n!==void 0&&!o.equals(m)&&(Ro.add(o),setTimeout(()=>{Ro.has(o)&&(d.f&16384)===0&&(Nf(o.label,n),Ro.delete(o))})),Rn(o,m)),c.deactivate())};u.promise.then(p,m=>p(null,m||"unknown"))}),zt(()=>{for(let d of l)d.reject(zr)}),H&&(o.f|=4194304),new Promise(d=>{function u(c){function f(){c===r?d(o):u(r)}c.then(f,f)}u(r)})}function I(t){let e=Ur(t);return gt||Ss(e),e}function Gr(t){let e=Ur(t);return e.equals=bs,e}function qf(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)tt(e[n])}}var Qa=[];function Oo(t){var e,n=ae,i=t.parent;if(!wn&&i!==null&&t.v!==Ue&&(i.f&24576)!==0)return $f(),t.v;if(xt(i),H){let r=sr;ks(new Set);try{Ni.call(Qa,t)&&hf(),Qa.push(t),t.f&=-65537,qf(t),e=Is(t)}finally{xt(n),ks(r),Qa.pop()}}else try{t.f&=-65537,qf(t),e=Is(t)}finally{xt(n)}return e}function Va(t){var e=Oo(t);if(!t.equals(e)&&(t.wv=Wr(),(!be?.is_fork||t.deps===null)&&(be!==null?(be.capture(t,e,!0),Ti?.capture(t,e,!0)):t.v=e,t.deps===null))){Be(t,1024);return}wn||(St!==null?(Di()||be?.is_fork)&&St.set(t,e):Or(t))}function Kf(t){if(t.effects!==null)for(let e of t.effects)(e.teardown||e.ac)&&(e.teardown?.(),e.ac!==null&&ii(()=>{e.ac.abort(_i),e.ac=null}),e.fn!==null&&(e.teardown=ht),ar(e,0),Po(e))}function Ya(t){if(t.effects!==null)for(let e of t.effects)e.teardown&&e.fn!==null&&oi(e)}var Cs=null,Qr=null,be=null,Ti=null,St=null,Ka=null,tr=!1,Ja=!1,lr=null,jo=null,Zf=0,qa=new Set,uh=1,hn=class t{id=uh++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#l=new Set;#o=new Set;#s=0;#i=new Map;#a=null;#r=[];#h=[];#f=new Set;#c=new Set;#u=new Map;#g=new Set;is_fork=!1;#d=!1;constructor(){Qr===null?Cs=Qr=this:(Qr.#n=this,this.#t=Qr),Qr=this}#b(){if(this.is_fork)return!0;for(let i of this.#i.keys()){for(var e=i,n=!1;e.parent!==null;){if(this.#u.has(e)){n=!0;break}e=e.parent}if(!n)return!0}return!1}skip_effect(e){this.#u.has(e)||this.#u.set(e,{d:[],m:[]}),this.#g.delete(e)}unskip_effect(e,n=i=>this.schedule(i)){var i=this.#u.get(e);if(i){this.#u.delete(e);for(var r of i.d)Be(r,2048),n(r);for(r of i.m)Be(r,4096),n(r)}this.#g.add(e)}#v(){if(this.#e=!0,Zf++>1e3&&(this.#m(),ph()),H)for(let d of this.current.keys())qa.add(d);for(let d of this.#f)this.#c.delete(d),Be(d,2048),this.schedule(d);for(let d of this.#c)Be(d,4096),this.schedule(d);let e=this.#r;this.#r=[],this.apply();var n=lr=[],i=[],r=jo=[];for(let d of e)try{this.#w(d,n,i)}catch(u){throw ic(d),this.#b()||this.discard(),u}if(be=null,r.length>0){var o=t.ensure();for(let d of r)o.schedule(d)}if(lr=null,jo=null,this.#b()){this.#p(i),this.#p(n);for(let[d,u]of this.#u)nc(d,u);r.length>0&&be.#v();return}let a=this.#y();if(a){this.#p(i),this.#p(n),a.#x(this);return}this.#f.clear(),this.#c.clear();for(let d of this.#l)d(this);this.#l.clear(),Ti=this,ec(i),ec(n),Ti=null,this.#a?.resolve();var l=be;if(this.#s===0&&(this.#r.length===0||l!==null)&&(this.#m(),gt&&(this.#_(),be=l)),this.#r.length>0)if(l!==null){let d=l;d.#r.push(...this.#r.filter(u=>!d.#r.includes(u)))}else l=this;l!==null&&l.#v()}#w(e,n,i){e.f^=1024;for(var r=e.first;r!==null;){var o=r.f,a=(o&96)!==0,l=a&&(o&1024)!==0,d=l||(o&8192)!==0||this.#u.has(r);if(!d&&r.fn!==null){a?r.f^=1024:(o&4)!==0?n.push(r):gt&&(o&16777224)!==0?i.push(r):Fi(r)&&((o&16)!==0&&this.#c.add(r),oi(r));var u=r.first;if(u!==null){r=u;continue}}for(;r!==null;){var c=r.next;if(c!==null){r=c;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[n,[,i]]of this.current)if(e.current.has(n)&&!i)return e}e=e.#t}return null}#x(e){for(let[i,r]of e.current)!this.previous.has(i)&&e.previous.has(i)&&this.previous.set(i,e.previous.get(i)),this.current.set(i,r);for(let[i,r]of e.async_deriveds){let o=this.async_deriveds.get(i);o&&r.promise.then(o.resolve).catch(o.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#f,e.#c);let n=i=>{var r=i.reactions;if(r!==null&&!((i.f&2)!==0&&(i.f&6144)===0))for(let l of r){var o=l.f;if((o&2)!==0)n(l);else{var a=l;o&4194320&&!this.async_deriveds.has(a)&&(this.#c.delete(a),Be(a,2048),this.schedule(a))}}};for(let i of this.current.keys())n(i);this.oncommit(()=>e.discard()),e.#m(),be=this,this.#v()}#p(e){for(var n=0;n<e.length;n+=1)As(e[n],this.#f,this.#c)}capture(e,n,i=!1){e.v!==Ue&&!this.previous.has(e)&&this.previous.set(e,e.v),(e.f&8388608)===0&&(this.current.set(e,[n,i]),St?.set(e,n)),this.is_fork||(e.v=n)}activate(){be=this}deactivate(){be=null,St=null}flush(){try{H&&qa.clear(),Ja=!0,be=this,this.#v()}finally{if(Zf=0,Ka=null,lr=null,jo=null,Ja=!1,be=null,St=null,Ei.clear(),H)for(let e of qa)e.updated=null}}discard(){for(let e of this.#o)e(this);this.#o.clear();for(let e of this.async_deriveds.values())e.reject(zr);this.#m(),this.#a?.resolve()}register_created_effect(e){this.#h.push(e)}#_(){for(let f=Cs;f!==null;f=f.#n){var e=f.id<this.id,n=[];for(let[p,[m,g]]of this.current){if(f.current.has(p)){var i=f.current.get(p)[0];if(e&&m!==i)f.current.set(p,[m,g]);else continue}n.push(p)}if(e)for(let[p,m]of this.async_deriveds){let g=f.async_deriveds.get(p);g&&m.promise.then(g.resolve).catch(g.reject)}var r=[...f.current.keys()].filter(p=>!f.current.get(p)[1]);if(!(!f.#e||r.length===0)){var o=r.filter(p=>!this.current.has(p));if(o.length===0)e&&f.discard();else if(n.length>0){if(H&&!f.#d&&Of(f.#r.length===0,"Batch has scheduled roots"),e)for(let p of this.#g)f.unskip_effect(p,m=>{(m.f&4194320)!==0?f.schedule(m):f.#p([m])});f.activate();var a=new Set,l=new Map;for(var d of n)tc(d,o,a,l);l=new Map;var u=[...f.current].filter(([p,m])=>{let g=this.current.get(p);return g?g[0]!==m[0]||g[1]!==m[1]:!0}).map(([p])=>p);if(u.length>0)for(let p of this.#h)(p.f&155648)===0&&Xa(p,u,l)&&((p.f&4194320)!==0?(Be(p,2048),f.schedule(p)):f.#f.add(p));if(f.#r.length>0&&!f.#d){f.apply();for(var c of f.#r)f.#w(c,[],[]);f.#r=[]}f.deactivate()}}}}increment(e,n){if(this.#s+=1,e){let i=this.#i.get(n)??0;this.#i.set(n,i+1)}}decrement(e,n){if(this.#s-=1,e){let i=this.#i.get(n)??0;i===1?this.#i.delete(n):this.#i.set(n,i-1)}this.#d||(this.#d=!0,kt(()=>{this.#d=!1,this.linked&&this.flush()}))}transfer_effects(e,n){for(let i of e)this.#f.add(i);for(let i of n)this.#c.add(i);e.clear(),n.clear()}oncommit(e){this.#l.add(e)}ondiscard(e){this.#o.add(e)}settled(){return(this.#a??=ps()).promise}static ensure(){if(be===null){let e=be=new t;!Ja&&!tr&&kt(()=>{e.#e||e.flush()})}return be}apply(){if(!gt||!this.is_fork&&this.#t===null&&this.#n===null){St=null;return}St=new Map;for(let[n,[i]]of this.current)St.set(n,i);for(let n=Cs;n!==null;n=n.#n)if(!(n===this||n.is_fork)){var e=!1;if(n.id<this.id){for(let[i,[,r]]of n.current)if(!r&&this.current.has(i)){e=!0;break}}if(!e)for(let[i,r]of n.previous)St.has(i)||St.set(i,r)}}schedule(e){if(Ka=e,e.b?.is_pending&&(e.f&16777228)!==0&&(e.f&32768)===0){e.b.defer_effect(e);return}for(var n=e;n.parent!==null;){n=n.parent;var i=n.f;if(lr!==null&&n===ae&&(gt||(me===null||(me.f&2)===0)&&!Wf))return;if((i&96)!==0){if((i&1024)===0)return;n.f^=1024}}this.#r.push(n)}#m(){if(this.linked){var e=this.#t,n=this.#n;e===null?Cs=n:e.#n=n,n===null?Qr=e:n.#t=e,this.linked=!1}}};function Vr(t){var e=tr;tr=!0;try{var n;for(t&&(be!==null&&!be.is_fork&&be.flush(),n=t());;){if(Uf(),be===null)return n;be.flush()}}finally{tr=e}}function ph(){if(H){var t=new Map;for(let n of be.current.keys())for(let[i,r]of n.updated??[]){var e=t.get(i);e||(e={error:r.error,count:0},t.set(i,e)),e.count+=r.count}for(let n of t.values())n.error&&console.error(n.error)}try{bf()}catch(n){H&&jt(n,"stack",{value:""}),Bn(n,Ka)}}var xn=null;function ec(t){var e=t.length;if(e!==0){for(var n=0;n<e;){var i=t[n++];if((i.f&24576)===0&&Fi(i)&&(xn=new Set,oi(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&Za(i),xn?.size>0)){Ei.clear();for(let r of xn){if((r.f&24576)!==0)continue;let o=[r],a=r.parent;for(;a!==null;)xn.has(a)&&(xn.delete(a),o.push(a)),a=a.parent;for(let l=o.length-1;l>=0;l--){let d=o[l];(d.f&24576)===0&&oi(d)}}xn.clear()}}xn=null}}function tc(t,e,n,i){if(!n.has(t)&&(n.add(t),t.reactions!==null))for(let r of t.reactions){let o=r.f;(o&2)!==0?tc(r,e,n,i):(o&4194320)!==0&&(o&2048)===0&&Xa(r,e,i)&&(Be(r,2048),Uo(r))}}function Xa(t,e,n){let i=n.get(t);if(i!==void 0)return i;if(t.deps!==null)for(let r of t.deps){if(Ni.call(e,r))return!0;if((r.f&2)!==0&&Xa(r,e,n))return n.set(r,!0),!0}return n.set(t,!1),!1}function Uo(t){be.schedule(t)}function nc(t,e){if(!((t.f&32)!==0&&(t.f&1024)!==0)){(t.f&2048)!==0?e.d.push(t):(t.f&4096)!==0&&e.m.push(t),Be(t,1024);for(var n=t.first;n!==null;)nc(n,e),n=n.next}}function ic(t){Be(t,1024);for(var e=t.first;e!==null;)ic(e),e=e.next}var sr=new Set,Ei=new Map;function ks(t){sr=t}var el=!1;function oc(){el=!0}function Qt(t,e){var n={f:0,v:t,reactions:null,equals:_s,rv:0,wv:0};return H&&Tn&&(n.created=e??Fn("created at"),n.updated=null,n.set_during_effect=!1,n.trace=null),n}function ce(t,e){let n=Qt(t,e);return Ss(n),n}function nr(t,e=!1,n=!0){let i=Qt(t);return e||(i.equals=bs),bi&&n&&Ae!==null&&Ae.l!==null&&(Ae.l.s??=[]).push(i),i}function oe(t,e,n=!1){me!==null&&(!Kt||(me.f&131072)!==0)&&ni()&&(me.f&4325394)!==0&&(On===null||!On.has(t))&&If();let i=n?Le(e):e;return H&&xs(i,t.label),Rn(t,i,jo)}function Rn(t,e,n=null){if(!t.equals(e)){Ei.set(t,wn?e:t.v);var i=hn.ensure();if(i.capture(t,e),H){if(Tn||ae!==null){t.updated??=new Map;let r=(t.updated.get("")?.count??0)+1;if(t.updated.set("",{error:null,count:r}),Tn||r>5){let o=Fn("updated at");if(o!==null){let a=t.updated.get(o.stack);a||(a={error:o,count:0},t.updated.set(o.stack,a)),a.count++}}}ae!==null&&(t.set_during_effect=!0)}if((t.f&2)!==0){let r=t;(t.f&2048)!==0&&Oo(r),St===null&&Or(r)}t.wv=Wr(),sc(t,2048,n),ni()&&ae!==null&&(ae.f&1024)!==0&&(ae.f&96)===0&&(mn===null?ac([t]):mn.push(t)),!i.is_fork&&sr.size>0&&!el&&$s()}return e}function $s(){el=!1;for(let t of sr){(t.f&1024)!==0&&Be(t,4096);let e;try{e=Fi(t)}catch{e=!0}e&&oi(t)}sr.clear()}function or(t){oe(t,t.v+1)}function sc(t,e,n){var i=t.reactions;if(i!==null)for(var r=ni(),o=i.length,a=0;a<o;a++){var l=i[a],d=l.f;if(!(!r&&l===ae)){var u=(d&2048)===0;if(u&&Be(l,e),(d&131072)!==0)sr.add(l);else if((d&2)!==0){var c=l;St?.delete(c),(d&65536)===0&&(d&512&&(ae===null||(ae.f&2097152)===0)&&(l.f|=65536),sc(c,4096,n))}else if(u){var f=l;(d&16)!==0&&xn!==null&&xn.add(f),n!==null?n.push(f):Uo(f)}}}}var mh=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Le(t){if(typeof t!="object"||t===null||Yt in t)return t;let e=Tr(t);if(e!==Ta&&e!==df)return t;var n=new Map,i=vi(t),r=ce(0),o=H&&Tn?Fn("created at"):null,a=Mi,l=f=>{if(Mi===a)return f();var p=me,m=Mi;wt(null),tl(a);var g=f();return wt(p),tl(m),g};i&&(n.set("length",ce(t.length,o)),H&&(t=vh(t)));var d="";let u=!1;function c(f){if(!u){u=!0,d=f,Ut(r,`${d} version`);for(let[p,m]of n)Ut(m,fr(d,p));u=!1}}return new Proxy(t,{defineProperty(f,p,m){(!("value"in m)||m.configurable===!1||m.enumerable===!1||m.writable===!1)&&Lf();var g=n.get(p);return g===void 0?l(()=>{var x=ce(m.value,o);return n.set(p,x),H&&typeof p=="string"&&Ut(x,fr(d,p)),x}):oe(g,m.value,!0),!0},deleteProperty(f,p){var m=n.get(p);if(m===void 0){if(p in f){let g=l(()=>ce(Ue,o));n.set(p,g),or(r),H&&Ut(g,fr(d,p))}}else oe(m,Ue),or(r);return!0},get(f,p,m){if(p===Yt)return t;if(H&&p===ms)return c;var g=n.get(p),x=p in f;if(g===void 0&&(!x||cn(f,p)?.writable)&&(g=l(()=>{var _=Le(x?f[p]:Ue),L=ce(_,o);return H&&Ut(L,fr(d,p)),L}),n.set(p,g)),g!==void 0){var w=s(g);return w===Ue?void 0:w}return Reflect.get(f,p,m)},getOwnPropertyDescriptor(f,p){var m=Reflect.getOwnPropertyDescriptor(f,p);if(m&&"value"in m){var g=n.get(p);g&&(m.value=s(g))}else if(m===void 0){var x=n.get(p),w=x?.v;if(x!==void 0&&w!==Ue)return{enumerable:!0,configurable:!0,value:w,writable:!0}}return m},has(f,p){if(p===Yt)return!0;var m=n.get(p),g=m!==void 0&&m.v!==Ue||Reflect.has(f,p);if(m!==void 0||ae!==null&&(!g||cn(f,p)?.writable)){m===void 0&&(m=l(()=>{var w=g?Le(f[p]):Ue,_=ce(w,o);return H&&Ut(_,fr(d,p)),_}),n.set(p,m));var x=s(m);if(x===Ue)return!1}return g},set(f,p,m,g){var x=n.get(p),w=p in f;if(i&&p==="length")for(var _=m;_<x.v;_+=1){var L=n.get(_+"");L!==void 0?oe(L,Ue):_ in f&&(L=l(()=>ce(Ue,o)),n.set(_+"",L),H&&Ut(L,fr(d,_)))}if(x===void 0)(!w||cn(f,p)?.writable)&&(x=l(()=>ce(void 0,o)),H&&Ut(x,fr(d,p)),oe(x,Le(m)),n.set(p,x));else{w=x.v!==Ue;var y=l(()=>Le(m));oe(x,y)}var C=Reflect.getOwnPropertyDescriptor(f,p);if(C?.set&&C.set.call(g,m),!w){if(i&&typeof p=="string"){var S=n.get("length"),E=Number(p);Number.isInteger(E)&&E>=S.v&&oe(S,E+1)}or(r)}return!0},ownKeys(f){s(r);var p=Reflect.ownKeys(f).filter(x=>{var w=n.get(x);return w===void 0||w.v!==Ue});for(var[m,g]of n)g.v!==Ue&&!(m in f)&&p.push(m);return p},setPrototypeOf(){kf()}})}function fr(t,e){return typeof e=="symbol"?`${t}[Symbol(${e.description??""})]`:mh.test(e)?`${t}.${e}`:/^\d+$/.test(e)?`${t}[${e}]`:`${t}['${e}']`}function Ds(t){try{if(t!==null&&typeof t=="object"&&Yt in t)return t[Yt]}catch{}return t}var gh=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function vh(t){return new Proxy(t,{get(e,n,i){var r=Reflect.get(e,n,i);return gh.has(n)?function(...o){oc();var a=r.apply(this,o);return $s(),a}:r}})}function lc(){let t=Array.prototype,e=Array.__svelte_cleanup;e&&e();let{indexOf:n,lastIndexOf:i,includes:r}=t;t.indexOf=function(o,a){let l=n.call(this,o,a);if(l===-1){for(let d=a??0;d<this.length;d+=1)if(Ds(this[d])===o){vs("array.indexOf(...)");break}}return l},t.lastIndexOf=function(o,a){let l=i.call(this,o,a??this.length-1);if(l===-1){for(let d=0;d<=(a??this.length-1);d+=1)if(Ds(this[d])===o){vs("array.lastIndexOf(...)");break}}return l},t.includes=function(o,a){let l=r.call(this,o,a);if(!l){for(let d=0;d<this.length;d+=1)if(Ds(this[d])===o){vs("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{t.indexOf=n,t.lastIndexOf=i,t.includes=r}}var nl,dc,Ho,fc,cc;function Ts(){if(nl===void 0){nl=window,dc=document,Ho=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;fc=cn(e,"firstChild").get,cc=cn(e,"nextSibling").get,Fa(t)&&(t[Co]=void 0,t[gs]=null,t[No]=void 0,t.__e=void 0),Fa(n)&&(n[$o]=void 0),H&&(t.__svelte_meta=null,lc())}}function yt(t=""){return document.createTextNode(t)}function Qe(t){return fc.call(t)}function Lt(t){return cc.call(t)}function $(t,e){if(!le)return Qe(t);var n=Qe(_e);if(n===null)n=_e.appendChild(yt());else if(e&&n.nodeType!==Fr){var i=yt();return n?.before(i),Me(i),i}return e&&Ms(n),Me(n),n}function ne(t,e=!1){if(!le){var n=Qe(t);return n instanceof Comment&&n.data===""?Lt(n):n}if(e){if(_e?.nodeType!==Fr){var i=yt();return _e?.before(i),Me(i),i}Ms(_e)}return _e}function K(t,e=1,n=!1){let i=le?_e:t;for(var r;e--;)r=i,i=Lt(i);if(!le)return i;if(n){if(i?.nodeType!==Fr){var o=yt();return i===null?r?.after(o):i.before(o),Me(o),o}Ms(i)}return Me(i),i}function Bo(t){t.textContent=""}function Fs(){if(!gt||xn!==null)return!1;var t=ae.f;return(t&32768)!==0}function si(t,e,n){return e==null||e===cs?n?document.createElement(t,{is:n}):document.createElement(t):n?document.createElementNS(e,t,{is:n}):document.createElementNS(e,t)}function Ms(t){if(t.nodeValue.length<65536)return;let e=t.nextSibling;for(;e!==null&&e.nodeType===Fr;)e.remove(),t.nodeValue+=e.nodeValue,e=t.nextSibling}function pc(t){ae===null&&(me===null&&_f(t),vf()),wn&&gf(t)}function bh(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function Pn(t,e){var n=ae;if(H)for(;n!==null&&(n.f&131072)!==0;)n=n.parent;n!==null&&(n.f&8192)!==0&&(t|=8192);var i={ctx:Ae,deps:null,nodes:null,f:t|2048|512,first:null,fn:e,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};H&&(i.component_function=pn),be?.register_created_effect(i);var r=i;if((t&4)!==0)lr!==null?lr.push(i):hn.ensure().schedule(i);else if(e!==null){try{oi(i)}catch(a){throw tt(i),a}r.deps===null&&r.teardown===null&&r.nodes===null&&r.first===r.last&&(r.f&524288)===0&&(r=r.first,(t&16)!==0&&(t&65536)!==0&&r!==null&&(r.f|=65536))}if(r!==null&&(r.parent=n,n!==null&&bh(r,n),me!==null&&(me.f&2)!==0&&(t&64)===0)){var o=me;(o.effects??=[]).push(r)}return i}function Di(){return me!==null&&!Kt}function zt(t){let e=Pn(8,null);return Be(e,1024),e.teardown=t,e}function ye(t){pc("$effect"),H&&jt(t,"name",{value:"$effect"});var e=ae.f,n=!me&&(e&32)!==0&&Ae!==null&&!Ae.i;if(n){var i=Ae;(i.e??=[]).push(t)}else return Oa(t)}function Oa(t){return Pn(1048580,t)}function rl(t){hn.ensure();let e=Pn(524352,t);return()=>{tt(e)}}function hc(t){hn.ensure();let e=Pn(524352,t);return(n={})=>new Promise(i=>{n.outro?ri(e,()=>{tt(e),i(void 0)}):(tt(e),i(void 0))})}function yn(t){return Pn(4,t)}function Xf(t){return Pn(4718592,t)}function Jt(t,e=0){return Pn(8|e,t)}function X(t,e=[],n=[],i=[]){Ls(i,e,n,r=>{Pn(8,()=>{t(...r.map(s))})})}function sn(t,e=0){var n=Pn(16|e,t);return H&&(n.dev_stack=Mn),n}function ol(t,e=0){var n=Pn(16777216|e,t);return H&&(n.dev_stack=Mn),n}function dt(t){return Pn(524320,t)}function sl(t){var e=t.teardown;if(e!==null){let n=wn,i=me;il(!0),wt(null);try{e.call(null)}finally{il(n),wt(i)}}}function Po(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){let r=n.ac;r!==null&&ii(()=>{r.abort(_i)});var i=n.next;(n.f&64)!==0?n.parent=null:tt(n,e),n=i}}function mc(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&32)===0&&tt(e),e=n}}function tt(t,e=!0){var n=!1;(e||(t.f&262144)!==0)&&t.nodes!==null&&t.nodes.end!==null&&(al(t.nodes.start,t.nodes.end),n=!0),t.f|=33554432,Po(t,e&&!n),ar(t,0);var i=t.nodes&&t.nodes.t;if(i!==null)for(let o of i)o.stop();sl(t),t.f^=33554432,t.f|=16384;var r=t.parent;r!==null&&r.first!==null&&Za(t),H&&(t.component_function=null),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes=t.ac=t.b=null}function al(t,e){for(;t!==null;){var n=t===e?null:Lt(t);t.remove(),t=n}}function Za(t){var e=t.parent,n=t.prev,i=t.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),e!==null&&(e.first===t&&(e.first=i),e.last===t&&(e.last=n))}function ri(t,e,n=!0){var i=[];gc(t,i,!0);var r=()=>{n&&tt(t),e&&e()},o=i.length;if(o>0){var a=()=>--o||r();for(var l of i)l.out(a)}else r()}function gc(t,e,n){if((t.f&8192)===0){t.f^=8192;var i=t.nodes&&t.nodes.t;if(i!==null)for(let l of i)(l.is_global||n)&&e.push(l);for(var r=t.first;r!==null;){var o=r.next;if((r.f&64)===0){var a=(r.f&65536)!==0||(r.f&32)!==0&&(t.f&16)!==0;gc(r,e,a?n:!1)}r=o}}}function Jr(t){vc(t,!0)}function vc(t,e){if((t.f&8192)!==0){t.f^=8192,(t.f&1024)===0&&(Be(t,2048),hn.ensure().schedule(t));for(var n=t.first;n!==null;){var i=n.next,r=(n.f&65536)!==0||(n.f&32)!==0;vc(n,r?e:!1),n=i}var o=t.nodes&&t.nodes.t;if(o!==null)for(let a of o)(a.is_global||e)&&a.in()}}function Pr(t,e){if(t.nodes)for(var n=t.nodes.start,i=t.nodes.end;n!==null;){var r=n===i?null:Lt(n);e.append(n),n=r}}var _c=null;var Hs=!1,wn=!1;function il(t){wn=t}var me=null,Kt=!1;function wt(t){me=t}var ae=null;function xt(t){ae=t}var On=null;function Ss(t){me!==null&&(!gt||(me.f&2)!==0)&&(On??=new Set).add(t)}var It=null,qt=0,mn=null;function ac(t){mn=t}var bc=1,cr=0,Mi=cr;function tl(t){Mi=t}function Wr(){return++bc}function Fi(t){var e=t.f;if((e&2048)!==0)return!0;if(e&2&&(t.f&=-65537),(e&4096)!==0){for(var n=t.deps,i=n.length,r=0;r<i;r++){var o=n[r];if(Fi(o)&&Va(o),o.wv>t.wv)return!0}(e&512)!==0&&St===null&&Be(t,1024)}return!1}function wc(t,e,n=!0){var i=t.reactions;if(i!==null&&!(!gt&&On!==null&&On.has(t)))for(var r=0;r<i.length;r++){var o=i[r];(o.f&2)!==0?wc(o,e,!1):e===o&&(n?Be(o,2048):(o.f&1024)!==0&&Be(o,4096),Uo(o))}}function Is(t){var e=It,n=qt,i=mn,r=me,o=On,a=Ae,l=Kt,d=Mi,u=t.f;It=null,qt=0,mn=null,me=(u&96)===0?t:null,On=null,wi(t.ctx),Kt=!1,Mi=++cr,t.ac!==null&&(ii(()=>{t.ac.abort(_i)}),t.ac=null);try{t.f|=2097152;var c=t.fn,f=c();t.f|=32768;var p=t.deps,m=be?.is_fork;if(It!==null){var g;if(m||ar(t,qt),p!==null&&qt>0)for(p.length=qt+It.length,g=0;g<It.length;g++)p[qt+g]=It[g];else t.deps=p=It;if(Di()&&(t.f&512)!==0)for(g=qt;g<p.length;g++)(p[g].reactions??=[]).push(t)}else!m&&p!==null&&qt<p.length&&(ar(t,qt),p.length=qt);if(ni()&&mn!==null&&!Kt&&p!==null&&(t.f&6146)===0)for(g=0;g<mn.length;g++)wc(mn[g],t);if(r!==null&&r!==t){if(cr++,r.deps!==null)for(let x=0;x<n;x+=1)r.deps[x].rv=cr;if(e!==null)for(let x of e)x.rv=cr;mn!==null&&(i===null?i=mn:i.push(...mn))}return(t.f&8388608)!==0&&(t.f^=8388608),f}catch(x){return Es(x)}finally{t.f^=2097152,It=e,qt=n,mn=i,me=r,On=o,wi(a),Kt=l,Mi=d}}function wh(t,e){let n=e.reactions;if(n!==null){var i=lf.call(n,t);if(i!==-1){var r=n.length-1;r===0?n=e.reactions=null:(n[i]=n[r],n.pop())}}if(n===null&&(e.f&2)!==0&&(It===null||!Ni.call(It,e))){var o=e;(o.f&512)!==0&&(o.f^=512,o.f&=-65537),o.v!==Ue&&Or(o),o.ac!==null&&ii(()=>{o.ac.abort(_i),o.ac=null,Be(o,2048)}),Kf(o),ar(o,0)}}function ar(t,e){var n=t.deps;if(n!==null)for(var i=e;i<n.length;i++)wh(t,n[i])}function oi(t){var e=t.f;if((e&16384)===0){Be(t,1024);var n=ae,i=Hs;if(ae=t,Hs=(e&96)===0,H){var r=pn;ys(t.component_function);var o=Mn;Rr(t.dev_stack??Mn)}try{(e&16777232)!==0?mc(t):Po(t),sl(t);var a=Is(t);if(t.teardown=typeof a=="function"?a:null,t.wv=bc,H&&Tn&&(t.f&2048)!==0&&t.deps!==null)for(var l of t.deps)l.set_during_effect&&(l.wv=Wr(),l.set_during_effect=!1)}finally{Hs=i,ae=n,H&&(ys(r),Rr(o))}}}function s(t){var e=t.f,n=(e&2)!==0;if(_c?.add(t),me!==null&&!Kt){var i=ae!==null&&(ae.f&16384)!==0;if(!i&&(On===null||!On.has(t))){var r=me.deps;if((me.f&2097152)!==0)t.rv<cr&&(t.rv=cr,It===null&&r!==null&&r[qt]===t?qt++:It===null?It=[t]:It.push(t));else{me.deps??=[],Ni.call(me.deps,t)||me.deps.push(t);var o=t.reactions;o===null?t.reactions=[me]:Ni.call(o,me)||o.push(me)}}}if(H){if(!Kt&&an&&be===null&&Ti===null&&!an.warned&&(an.effect.f&2097152)===0&&!an.effect_deps.has(t)){an.warned=!0,Cf(t.label);var a=Fn("traced at");a&&console.warn(a)}if(Ro.delete(t),Tn&&!Kt&&Fo!==null&&me!==null&&Fo.reaction===me){if(t.trace)t.trace();else if(a=Fn("traced at"),a){var l=Fo.entries.get(t);l===void 0&&(l={traces:[]},Fo.entries.set(t,l));var d=l.traces[l.traces.length-1];a.stack!==d?.stack&&l.traces.push(a)}}}if(wn&&Ei.has(t))return Ei.get(t);if(n){var u=t;if(wn){var c=u.v;return((u.f&1024)===0&&u.reactions!==null||yc(u))&&(c=Oo(u)),Ei.set(u,c),c}var f=(u.f&512)===0&&!Kt&&me!==null&&(Hs||(me.f&512)!==0),p=(u.f&32768)===0;Fi(u)&&(f&&(u.f|=512),Va(u)),f&&!p&&(Ya(u),xc(u))}if(St?.has(t))return St.get(t);if((t.f&8388608)!==0)throw t.v;return t.v}function xc(t){if(t.f|=512,t.deps!==null)for(let e of t.deps)(e.reactions??=[]).push(t),(e.f&2)!==0&&(e.f&512)===0&&(Ya(e),xc(e))}function yc(t){if(t.v===Ue)return!0;if(t.deps===null)return!1;for(let e of t.deps)if(Ei.has(e)||(e.f&2)!==0&&yc(e))return!0;return!1}function Ze(t){var e=Kt;try{return Kt=!0,t()}finally{Kt=e}}var Go=Symbol("events"),ll=new Set,Bs=new Set;function we(t,e,n){(e[Go]??={})[t]=n}function rt(t){for(var e=0;e<t.length;e++)ll.add(t[e]);for(var n of Bs)n(t)}var Ec=null;function dl(t){var e=this,n=e.ownerDocument,i=t.type,r=t.composedPath?.()||[],o=r[0]||t.target;Ec=t;var a=0,l=Ec===t&&t[Go];if(l){var d=r.indexOf(l);if(d!==-1&&(e===document||e===window)){t[Go]=e;return}var u=r.indexOf(e);if(u===-1)return;d<=u&&(a=d)}if(o=r[a]||t.target,o!==e){jt(t,"currentTarget",{configurable:!0,get(){return o||n}});var c=me,f=ae;wt(null),xt(null);try{for(var p,m=[];o!==null&&o!==e;){try{var g=o[Go]?.[i];g!=null&&(!o.disabled||t.target===o)&&g.call(o,t)}catch(x){p?m.push(x):p=x}if(t.cancelBubble)break;a++,o=a<r.length?r[a]:null}if(p){for(let x of m)queueMicrotask(()=>{throw x});throw p}}finally{t[Go]=e,delete t.currentTarget,wt(c),xt(f)}}}var xh=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:t=>t});function Ac(t){return xh?.createHTML(t)??t}function Rs(t){var e=si("template");return e.innerHTML=Ac(t.replaceAll("<!>","<!---->")),e.content}function Ft(t,e){var n=ae;n.nodes===null&&(n.nodes={start:t,end:e,a:null,t:null})}function O(t,e){var n=(e&1)!==0,i=(e&2)!==0,r,o=!t.startsWith("<!>");return()=>{if(le)return Ft(_e,null),_e;r===void 0&&(r=Rs(o?t:"<!>"+t),n||(r=Qe(r)));var a=i||Ho?document.importNode(r,!0):r.cloneNode(!0);if(n){var l=Qe(a),d=a.lastChild;Ft(l,d)}else Ft(a,a);return a}}function Lh(t,e,n="svg"){var i=!t.startsWith("<!>"),r=(e&1)!==0,o=`<${n}>${i?t:"<!>"+t}</${n}>`,a;return()=>{if(le)return Ft(_e,null),_e;if(!a){var l=Rs(o),d=Qe(l);if(r)for(a=document.createDocumentFragment();Qe(d);)a.appendChild(Qe(d));else a=Qe(d)}var u=a.cloneNode(!0);if(r){var c=Qe(u),f=u.lastChild;Ft(c,f)}else Ft(u,u);return u}}function Ai(t,e){return Lh(t,e,"svg")}function pe(){if(le)return Ft(_e,null),_e;var t=document.createDocumentFragment(),e=document.createComment(""),n=yt();return t.append(e,n),Ft(e,n),t}function D(t,e){if(le){var n=ae;((n.f&32768)===0||n.nodes.end===null)&&(n.nodes.end=_e),At();return}t!==null&&t.before(e)}var kh=/\r/g;function kc(t){t=t.replace(kh,"");let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return(e>>>0).toString(36)}var Ih=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var p0=[...Ih,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var Sh=["touchstart","touchmove"];function Ic(t){return Sh.includes(t)}var Ch=["$state","$state.raw","$derived","$derived.by"],h0=[...Ch,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];function Os(t){return t?.replace(/\//g,"/\u200B")}var fl=!0;function $e(t,e){var n=e==null?"":typeof e=="object"?`${e}`:e;n!==(t[$o]??=t.nodeValue)&&(t[$o]=n,t.nodeValue=`${n}`)}function qr(t,e){return Sc(t,e)}function ul(t,e){Ts(),e.intro=e.intro??!1;let n=e.target,i=le,r=_e;try{for(var o=Qe(n);o&&(o.nodeType!==un||o.data!=="[");)o=Lt(o);if(!o)throw Xn;mt(!0),Me(o);let a=Sc(t,{...e,anchor:o});return mt(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==Xn&&console.warn("Failed to hydrate: ",a),e.recover===!1&&wf(),Ts(),Bo(n),mt(!1),qr(t,e)}finally{mt(i),Me(r)}}var Ps=new Map;function Sc(t,{target:e,anchor:n,props:i={},events:r,context:o,intro:a=!0,transformError:l}){Ts();var d=void 0,u=hc(()=>{var c=n??e.appendChild(yt());Ua(c,{pending:()=>{}},m=>{de({});var g=Ae;if(o&&(g.c=o),r&&(i.$$events=r),le&&Ft(m,null),fl=a,d=t(m,i)||{},fl=!0,le&&(ae.nodes.end=_e,_e===null||_e.nodeType!==un||_e.data!=="]"))throw $i(),Xn;fe()},l);var f=new Set,p=m=>{for(var g=0;g<m.length;g++){var x=m[g];if(!f.has(x)){f.add(x);var w=Ic(x);for(let y of[e,document]){var _=Ps.get(y);_===void 0&&(_=new Map,Ps.set(y,_));var L=_.get(x);L===void 0?(y.addEventListener(x,dl,{passive:w}),_.set(x,1)):_.set(x,L+1)}}}};return p(Dr(ll)),Bs.add(p),()=>{for(var m of f)for(let w of[e,document]){var g=Ps.get(w),x=g.get(m);--x==0?(w.removeEventListener(m,dl),g.delete(m),g.size===0&&Ps.delete(w)):g.set(m,x)}Bs.delete(p),c!==n&&c.parentNode?.removeChild(c)}});return cl.set(d,u),d}var cl=new WeakMap;function zo(t,e){let n=cl.get(t);return n?(cl.delete(t),n(e)):(H&&(Yt in t?Mf():Ff()),Promise.resolve())}var ai=class{anchor;#e=new Map;#t=new Map;#n=new Map;#l=new Set;#o=!0;constructor(e,n=!0){this.anchor=e,this.#o=n}#s=e=>{if(this.#e.has(e)){var n=this.#e.get(e),i=this.#t.get(n);if(i)Jr(i),this.#l.delete(n);else{var r=this.#n.get(n);r&&(Jr(r.effect),this.#t.set(n,r.effect),this.#n.delete(n),H&&(r.fragment.lastChild[Ma]=this.anchor),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),i=r.effect)}for(let[o,a]of this.#e){if(this.#e.delete(o),o===e)break;let l=this.#n.get(a);l&&(tt(l.effect),this.#n.delete(a))}for(let[o,a]of this.#t){if(o===n||this.#l.has(o))continue;let l=()=>{if(Array.from(this.#e.values()).includes(o)){var u=document.createDocumentFragment();Pr(a,u),u.append(yt()),this.#n.set(o,{effect:a,fragment:u})}else tt(a);this.#l.delete(o),this.#t.delete(o)};this.#o||!i?(this.#l.add(o),ri(a,l,!1)):l()}}};#i=e=>{this.#e.delete(e);let n=Array.from(this.#e.values());for(let[i,r]of this.#n)n.includes(i)||(tt(r.effect),this.#n.delete(i))};ensure(e,n){var i=be,r=Fs();if(n&&!this.#t.has(e)&&!this.#n.has(e))if(r){var o=document.createDocumentFragment(),a=yt();o.append(a),this.#n.set(e,{effect:dt(()=>n(a)),fragment:o})}else this.#t.set(e,dt(()=>n(this.anchor)));if(this.#e.set(i,e),r){for(let[l,d]of this.#t)l===e?i.unskip_effect(d):i.skip_effect(d);for(let[l,d]of this.#n)l===e?i.unskip_effect(d.effect):i.skip_effect(d.effect);i.oncommit(this.#s),i.ondiscard(this.#i)}else le&&(this.anchor=_e),this.#s(i)}};function Mt(t,e,...n){var i=new ai(t);sn(()=>{let r=e()??null;H&&r==null&&xf(),i.ensure(r,r&&(o=>r(o,...n)))},65536)}if(H){let t=function(e){if(!(e in globalThis)){let n;Object.defineProperty(globalThis,e,{configurable:!0,get:()=>{if(n!==void 0)return n;Ef(e)},set:i=>{n=i}})}};t("$state"),t("$effect"),t("$derived"),t("$inspect"),t("$props"),t("$bindable")}function Dh(t){Ae===null&&Mr("onMount"),bi&&Ae.l!==null?Th(Ae).m.push(t):ye(()=>{let e=Ze(t);if(typeof e=="function")return e})}function ze(t){Ae===null&&Mr("onDestroy"),Dh(()=>()=>Ze(t))}function Th(t){var e=t.l;return e.u??={a:[],b:[],m:[]}}function Y(t,e,n=!1){var i;le&&(i=_e,At());var r=new ai(t),o=n?65536:0;function a(l,d){if(le){var u=To(i);if(l!==parseInt(u.substring(1))){var c=ti();Me(c),r.anchor=c,mt(!1),r.ensure(l,d),mt(!0);return}}r.ensure(l,d)}sn(()=>{var l=!1;e((d,u=0)=>{l=!0,a(u,d)}),l||a(-1,null)},o)}function di(t,e){return e}function jh(t,e,n){for(var i=[],r=e.length,o,a=e.length,l=0;l<r;l++){let f=e[l];ri(f,()=>{if(o){if(o.pending.delete(f),o.done.add(f),o.pending.size===0){var p=t.outrogroups;pl(t,Dr(o.done)),p.delete(o),p.size===0&&(t.outrogroups=null)}}else a-=1},!1)}if(a===0){var d=i.length===0&&n!==null;if(d){var u=n,c=u.parentNode;Bo(c),c.append(u),t.items.clear()}pl(t,e,!d)}else o={pending:new Set(e),done:new Set},(t.outrogroups??=new Set).add(o)}function pl(t,e,n=!0){var i;if(t.pending.size>0){i=new Set;for(let a of t.pending.values())for(let l of a)i.add(t.items.get(l).e)}for(var r=0;r<e.length;r++){var o=e[r];if(i?.has(o)){o.f|=33554432;let a=document.createDocumentFragment();Pr(o,a)}else tt(e[r],n)}}var $c;function fi(t,e,n,i,r,o=null){var a=t,l=new Map,d=(e&4)!==0;if(d){var u=t;a=le?Me(Qe(u)):u.appendChild(yt())}le&&At();var c=null,f=Gr(()=>{var y=n();return vi(y)?y:y==null?[]:Dr(y)});H&&Ut(f,"{#each ...}");var p,m=new Map,g=!0;function x(y){(L.effect.f&16384)===0&&(L.pending.delete(y),L.fallback=c,Uh(L,p,a,e,i),c!==null&&(p.length===0?(c.f&33554432)===0?Jr(c):(c.f^=33554432,Qo(c,null,a)):ri(c,()=>{c=null})))}function w(y){L.pending.delete(y)}var _=sn(()=>{p=s(f);var y=p.length;let C=!1;if(le){var S=To(a)==="[!";S!==(y===0)&&(a=ti(),Me(a),mt(!1),C=!0)}for(var E=new Set,h=be,b=Fs(),A=0;A<y;A+=1){le&&_e.nodeType===un&&_e.data==="]"&&(a=_e,C=!0,mt(!1));var T=p[A],M=i(T,A);if(H){var U=i(T,A);M!==U&&mf(String(A),String(M),String(U))}var P=g?null:l.get(M);P?(P.v&&Rn(P.v,T),P.i&&Rn(P.i,A),b&&h.unskip_effect(P.e)):(P=Gh(l,g?a:$c??=yt(),T,M,A,r,e,n),g||(P.e.f|=33554432),l.set(M,P)),E.add(M)}if(y===0&&o&&!c&&(g?c=dt(()=>o(a)):(c=dt(()=>o($c??=yt())),c.f|=33554432)),y>E.size&&(H?zh(p,i):Ba("","","")),le&&y>0&&Me(ti()),!g)if(m.set(h,E),b){for(let[J,ee]of l)E.has(J)||h.skip_effect(ee.e);h.oncommit(x),h.ondiscard(w)}else x(h);C&&mt(!0),s(f)}),L={effect:_,flags:e,items:l,pending:m,outrogroups:null,fallback:c};g=!1,le&&(a=_e)}function Wo(t){for(;t!==null&&(t.f&32)===0;)t=t.next;return t}function Uh(t,e,n,i,r){var o=(i&8)!==0,a=e.length,l=t.items,d=Wo(t.effect.first),u,c=null,f,p=[],m=[],g,x,w,_;if(o)for(_=0;_<a;_+=1)g=e[_],x=r(g,_),w=l.get(x).e,(w.f&33554432)===0&&(w.nodes?.a?.measure(),(f??=new Set).add(w));for(_=0;_<a;_+=1){if(g=e[_],x=r(g,_),w=l.get(x).e,t.outrogroups!==null)for(let T of t.outrogroups)T.pending.delete(w),T.done.delete(w);if((w.f&8192)!==0&&(Jr(w),o&&(w.nodes?.a?.unfix(),(f??=new Set).delete(w))),(w.f&33554432)!==0)if(w.f^=33554432,w===d)Qo(w,null,n);else{var L=c?c.next:d;w===t.effect.last&&(t.effect.last=w.prev),w.prev&&(w.prev.next=w.next),w.next&&(w.next.prev=w.prev),Hi(t,c,w),Hi(t,w,L),Qo(w,L,n),c=w,p=[],m=[],d=Wo(c.next);continue}if(w!==d){if(u!==void 0&&u.has(w)){if(p.length<m.length){var y=m[0],C;c=y.prev;var S=p[0],E=p[p.length-1];for(C=0;C<p.length;C+=1)Qo(p[C],y,n);for(C=0;C<m.length;C+=1)u.delete(m[C]);Hi(t,S.prev,E.next),Hi(t,c,S),Hi(t,E,y),d=y,c=E,_-=1,p=[],m=[]}else u.delete(w),Qo(w,d,n),Hi(t,w.prev,w.next),Hi(t,w,c===null?t.effect.first:c.next),Hi(t,c,w),c=w;continue}for(p=[],m=[];d!==null&&d!==w;)(u??=new Set).add(d),m.push(d),d=Wo(d.next);if(d===null)continue}(w.f&33554432)===0&&p.push(w),c=w,d=Wo(w.next)}if(t.outrogroups!==null){for(let T of t.outrogroups)T.pending.size===0&&(pl(t,Dr(T.done)),t.outrogroups?.delete(T));t.outrogroups.size===0&&(t.outrogroups=null)}if(d!==null||u!==void 0){var h=[];if(u!==void 0)for(w of u)(w.f&8192)===0&&h.push(w);for(;d!==null;)(d.f&8192)===0&&d!==t.fallback&&h.push(d),d=Wo(d.next);var b=h.length;if(b>0){var A=(i&4)!==0&&a===0?n:null;if(o){for(_=0;_<b;_+=1)h[_].nodes?.a?.measure();for(_=0;_<b;_+=1)h[_].nodes?.a?.fix()}jh(t,h,A)}}o&&kt(()=>{if(f!==void 0)for(w of f)w.nodes?.a?.apply()})}function Gh(t,e,n,i,r,o,a,l){var d=(a&1)!==0?(a&16)===0?nr(n,!1,!1):Qt(n):null,u=(a&2)!==0?Qt(r):null;return H&&d&&(d.trace=()=>{l()[u?.v??r]}),{v:d,i:u,e:dt(()=>(o(e,d??n,u??r,l),()=>{t.delete(i)}))}}function Qo(t,e,n){if(t.nodes)for(var i=t.nodes.start,r=t.nodes.end,o=e&&(e.f&33554432)===0?e.nodes.start:n;i!==null;){var a=Lt(i);if(o.before(i),i===r)return;i=a}}function Hi(t,e,n){e===null?t.effect.first=n:e.next=n,n===null?t.effect.last=e:n.prev=e}function zh(t,e){let n=new Map,i=t.length;for(let r=0;r<i;r++){let o=e(t[r],r);if(n.has(o)){let a=String(n.get(o)),l=String(r),d=String(o);d.startsWith("[object ")&&(d=null),Ba(a,l,d)}n.set(o,r)}}function Wh(t,e,n){if(!e||e===kc(String(n??"")))return;let i,r=t.__svelte_meta?.loc;r?i=`near ${r.file}:${r.line}:${r.column}`:pn?.[tn]&&(i=`in ${pn[tn]}`),Tf(Os(i))}function ur(t,e,n=!1,i=!1,r=!1,o=!1){var a=t,l="";if(n){var d=t;le&&(a=Me(Qe(d)))}X(()=>{var u=ae;if(l===(l=e()??"")){le&&At();return}if(n&&!le){u.nodes=null,d.innerHTML=l,l!==""&&Ft(Qe(d),d.lastChild);return}if(u.nodes!==null&&(al(u.nodes.start,u.nodes.end),u.nodes=null),l!==""){if(le){for(var c=_e.data,f=At(),p=f;f!==null&&(f.nodeType!==un||f.data!=="");)p=f,f=Lt(f);if(f===null)throw $i(),Xn;H&&!o&&Wh(f.parentNode,c,l),Ft(_e,p),a=Me(f);return}var m=i?So:r?Na:void 0,g=si(i?"svg":r?"math":"template",m);g.innerHTML=l;var x=i||r?g:g.content;if(Ft(Qe(x),x.lastChild),i||r)for(;Qe(x);)a.before(Qe(x));else a.before(x)}})}function lt(t,e){var n=void 0,i;ol(()=>{n!==(n=e())&&(i&&(tt(i),i=null),n&&(i=dt(()=>{yn(()=>n(t))})))})}function Fc(t){var e,n,i="";if(typeof t=="string"||typeof t=="number")i+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=Fc(t[e]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}function Mc(){for(var t,e,n=0,i="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=Fc(t))&&(i&&(i+=" "),i+=e);return i}function ln(t){return typeof t=="object"?Mc(t):t??""}var Hc=[...` 	
\r\f\xA0\v\uFEFF`];function Rc(t,e,n){var i=t==null?"":""+t;if(e&&(i=i?i+" "+e:e),n){for(var r of Object.keys(n))if(n[r])i=i?i+" "+r:r;else if(i.length)for(var o=r.length,a=0;(a=i.indexOf(r,a))>=0;){var l=a+o;(a===0||Hc.includes(i[a-1]))&&(l===i.length||Hc.includes(i[l]))?i=(a===0?"":i.substring(0,a))+i.substring(l+1):a=l}}return i===""?null:i}function Bc(t,e=!1){var n=e?" !important;":";",i="";for(var r of Object.keys(t)){var o=t[r];o!=null&&o!==""&&(i+=" "+r+": "+o+n)}return i}function hl(t){return t[0]!=="-"||t[1]!=="-"?t.toLowerCase():t}function Oc(t,e){if(e){var n="",i,r;if(Array.isArray(e)?(i=e[0],r=e[1]):i=e,t){t=String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var o=!1,a=0,l=!1,d=[];i&&d.push(...Object.keys(i).map(hl)),r&&d.push(...Object.keys(r).map(hl));var u=0,c=-1;let x=t.length;for(var f=0;f<x;f++){var p=t[f];if(l?p==="/"&&t[f-1]==="*"&&(l=!1):o?o===p&&(o=!1):p==="/"&&t[f+1]==="*"?l=!0:p==='"'||p==="'"?o=p:p==="("?a++:p===")"&&a--,!l&&o===!1&&a===0){if(p===":"&&c===-1)c=f;else if(p===";"||f===x-1){if(c!==-1){var m=hl(t.substring(u,c).trim());if(!d.includes(m)){p!==";"&&f++;var g=t.substring(u,f).trim();n+=" "+g+";"}}u=f+1,c=-1}}}}return i&&(n+=Bc(i)),r&&(n+=Bc(r,!0)),n=n.trim(),n===""?null:n}return t==null?null:String(t)}function Se(t,e,n,i,r,o){var a=t[Co];if(le||a!==n||a===void 0){var l=Rc(n,i,o);(!le||l!==t.getAttribute("class"))&&(l==null?t.removeAttribute("class"):e?t.className=l:t.setAttribute("class",l)),t[Co]=n}else if(o&&r!==o)for(var d in o){var u=!!o[d];(r==null||u!==!!r[d])&&t.classList.toggle(d,u)}return o}function ml(t,e={},n,i){for(var r in n){var o=n[r];e[r]!==o&&(n[r]==null?t.style.removeProperty(r):t.style.setProperty(r,o,i))}}function Q(t,e,n,i){var r=t[No];if(le||r!==e){var o=Oc(e,i);(!le||o!==t.getAttribute("style"))&&(o==null?t.removeAttribute("style"):t.style.cssText=o),t[No]=e}else i&&(Array.isArray(i)?(ml(t,n?.[0],i[0]),ml(t,n?.[1],i[1],"important")):ml(t,n,i));return i}var Zh=Symbol("is custom element"),em=Symbol("is html"),tm=Ha?"link":"LINK";function G(t,e,n,i){var r=nm(t);if(le&&(r[e]=t.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&t.nodeName===tm)){i||rm(t,e,n??"");return}r[e]!==(r[e]=n)&&(e==="loading"&&(t[ff]=n),n==null?t.removeAttribute(e):typeof n!="string"&&im(t).includes(e)?t[e]=n:t.setAttribute(e,n))}function nm(t){return t[gs]??={[Zh]:t.nodeName.includes("-"),[em]:t.namespaceURI===cs}}var Pc=new Map;function im(t){var e=t.getAttribute("is")||t.nodeName,n=Pc.get(e);if(n)return n;Pc.set(e,n=[]);for(var i,r=t,o=Element.prototype;o!==r;){i=Da(r);for(var a in i)i[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&n.push(a);r=Tr(r)}return n}function rm(t,e,n){H&&(e==="srcset"&&om(t,n)||gl(t.getAttribute(e)??"",n)||Df(e,t.outerHTML.replace(t.innerHTML,t.innerHTML&&"..."),String(n)))}function gl(t,e){return t===e?!0:new URL(t,document.baseURI).href===new URL(e,document.baseURI).href}function jc(t){return t.split(",").map(e=>e.trim().split(" ").filter(Boolean))}function om(t,e){var n=jc(t.srcset),i=jc(e);return i.length===n.length&&i.every(([r,o],a)=>o===n[a][1]&&(gl(n[a][0],r)||gl(r,n[a][0])))}var am={get(t,e){if(!t.exclude.has(e))return t.props[e]},set(t,e){return H&&yf(`${t.name}.${String(e)}`),!1},getOwnPropertyDescriptor(t,e){if(!t.exclude.has(e)&&e in t.props)return{enumerable:!0,configurable:!0,value:t.props[e]}},has(t,e){return t.exclude.has(e)?!1:e in t.props},ownKeys(t){return Reflect.ownKeys(t.props).filter(e=>!t.exclude.has(e))}};function ue(t,e,n){return new Proxy(H?{props:t,exclude:e,name:n}:{props:t,exclude:e},am)}function Uc(t){return new _l(t)}var _l=class{#e;#t;constructor(e){var n=new Map,i=(o,a)=>{var l=nr(a,!1,!1);return n.set(o,l),l};let r=new Proxy({...e.props||{},$$events:{}},{get(o,a){return s(n.get(a)??i(a,Reflect.get(o,a)))},has(o,a){return a===hs?!0:(s(n.get(a)??i(a,Reflect.get(o,a))),Reflect.has(o,a))},set(o,a,l){return oe(n.get(a)??i(a,l),l),Reflect.set(o,a,l)}});this.#t=(e.hydrate?ul:qr)(e.component,{target:e.target,anchor:e.anchor,props:r,context:e.context,intro:e.intro??!1,recover:e.recover,transformError:e.transformError}),!gt&&(!e?.props?.$$host||e.sync===!1)&&Vr(),this.#e=r.$$events;for(let o of Object.keys(this.#t))o==="$set"||o==="$destroy"||o==="$on"||jt(this,o,{get(){return this.#t[o]},set(a){this.#t[o]=a},enumerable:!0});this.#t.$set=o=>{Object.assign(r,o)},this.#t.$destroy=()=>{zo(this.#t)}}$set(e){this.#t.$set(e)}$on(e,n){this.#e[e]=this.#e[e]||[];let i=(...r)=>n.call(this,...r);return this.#e[e].push(i),()=>{this.#e[e]=this.#e[e].filter(r=>r!==i)}}$destroy(){this.#t.$destroy()}};var mm;typeof HTMLElement=="function"&&(mm=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(t,e,n){super(),this.$$ctor=t,this.$$s=e,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(t,e,n){if(this.$$l[t]=this.$$l[t]||[],this.$$l[t].push(e),this.$$c){let i=this.$$c.$on(t,e);this.$$l_u.set(e,i)}super.addEventListener(t,e,n)}removeEventListener(t,e,n){if(super.removeEventListener(t,e,n),this.$$c){let i=this.$$l_u.get(e);i&&(i(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let t=function(i){return r=>{let o=si("slot");i!=="default"&&(o.name=i),D(r,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let e={},n=gm(this);for(let i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=t(i),e.default=!0):e[i]=t(i));for(let i of this.attributes){let r=this.$$g_p(i.name);r in this.$$d||(this.$$d[r]=bl(r,i.value,this.$$p_d,"toProp"))}for(let i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Uc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=rl(()=>{Jt(()=>{this.$$r=!0;for(let i of $a(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];let r=bl(i,this.$$d[i],this.$$p_d,"toAttribute");r==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,r)}this.$$r=!1})});for(let i in this.$$l)for(let r of this.$$l[i]){let o=this.$$c.$on(i,r);this.$$l_u.set(r,o)}this.$$l={}}}attributeChangedCallback(t,e,n){this.$$r||(t=this.$$g_p(t),this.$$d[t]=bl(t,n,this.$$p_d,"toProp"),this.$$c?.$set({[t]:this.$$d[t]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(t){return $a(this.$$p_d).find(e=>this.$$p_d[e].attribute===t||!this.$$p_d[e].attribute&&e.toLowerCase()===t)||t}});function bl(t,e,n,i){let r=n[t]?.type;if(e=r==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(r){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(r){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function gm(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var nt="--diff-font-size--",De="--diff-aside-width--";var ci=()=>{let t=ce(!1);return ye(()=>{oe(t,!0)}),()=>s(t)};var Gc=Symbol("fontSize");function zc(t){Ye(Gc,()=>t.diffViewFontSize||14)}function Kr(){return Ve(Gc)}var Wc=Symbol("enableWrap");function Qc(t){Ye(Wc,()=>t.diffViewWrap)}function En(){return Ve(Wc)}var Vc=Symbol("renderWidget");function Yc(t){Ye(Vc,()=>t.renderWidgetLine)}function Xr(){return Ve(Vc)}var Jc=Symbol("id");function qc(t){Ye(Jc,t)}function Us(){return Ve(Jc)}var Kc=Symbol("dom");function Xc(t){Ye(Kc,t)}function Gs(){return Ve(Kc)}var Zc=Symbol("extend");function eu(t){Ye(Zc,()=>t.extendData)}function Zr(){return Ve(Zc)}var tu=Symbol("widget");function nu(t){Ye(tu,()=>t)}function An(){return Ve(tu)}var iu=Symbol("renderExtendLine");function ru(t){Ye(iu,()=>t.renderExtendLine)}function eo(){return Ve(iu)}var ou=Symbol("onAddWidgetClick");function su(t){Ye(ou,()=>t.onAddWidgetClick)}function to(){return Ve(ou)}var au=Symbol("enableHighlight");function lu(t){Ye(au,()=>t.diffViewHighlight)}function no(){return Ve(au)}var du=Symbol("enableAddWidget");function fu(t){Ye(du,()=>t.diffViewAddWidget)}function io(){return Ve(du)}var cu=Symbol("mode");function uu(t){Ye(cu,()=>t.diffViewMode||Pt.Split)}function zs(){return Ve(cu)}var wl=null,vm=(t,e)=>`${t.fontFamily}-${t.fontStyle}-${t.fontSize}-${e}`,_m=(t,e)=>vm(t,"0".repeat(e.length)),yl=class{#e="";#t={};#n(){return wl=wl||document.createElement("canvas").getContext("2d"),wl}measure(e,n){let i=_m(n||{},e);if(this.#t[i])return this.#t[i];let r=this.#n();if(n){let a=`${n.fontFamily}-${n.fontStyle}-${n.fontSize}`;this.#e!==a&&(this.#e=a,r.font=`${n.fontStyle||""} ${n.fontSize||""} ${n.fontFamily||""}`)}else r.font="";return r.measureText(e).width}},xl=null,pu=()=>(xl=xl||new yl,xl);var ro=({text:t,font:e})=>{let n=I(ci()),i=parseInt(e().fontSize||"14"),r=6;r+=i>10?(i-10)*.6:0;let o=ce(r*t().length);return ye(()=>{s(n)&&oe(o,pu().measure(t()||"",e()),!0)}),()=>s(o)};var Ln=()=>{window.getSelection()?.removeAllRanges()},hu=(t,e)=>{let n=function(i){i===null||i.target===null||(i.target===t?(e.scrollTop=t.scrollTop,e.scrollLeft=t.scrollLeft):(t.scrollTop=e.scrollTop,t.scrollLeft=e.scrollLeft))};return t.onscroll||(t.onscroll=n),e.onscroll||(e.onscroll=n),()=>{t.onscroll=null,e.onscroll=null}},Ws=t=>{if(t){let e=t.getRootNode();return e instanceof ShadowRoot?e:t.ownerDocument}return document},oo=t=>{if(t){if(typeof t.closest=="function")return t.closest('[data-component="git-diff-view"]')?.querySelector?.(".diff-view-wrapper")?.getAttribute?.("id");{let e=t;for(;e;){if(e.getAttribute&&e.getAttribute("data-component")==="git-diff-view")return e.querySelector(".diff-view-wrapper")?.getAttribute("id");e=e.parentElement}}}};var El="--diff-add-content--",Al="--diff-del-content--",gn="--diff-border--",Ll="--diff-add-lineNumber--",kl="--diff-del-lineNumber--",Il="--diff-plain-content--",Qs="--diff-expand-content--",ft="--diff-plain-lineNumber-color--",pr="--diff-expand-lineNumber-color--",Sl="--diff-plain-lineNumber--",bm="--diff-expand-lineNumber--",dn="--diff-hunk-content--",jn="--diff-hunk-content-color--",Un="--diff-hunk-lineNumber--";var Vs="--diff-add-widget--",Ys="--diff-add-widget-color--",Xt="--diff-empty-content--",Vo=(t,e,n)=>t?`var(${El})`:e?`var(${Al})`:n?`var(${Il})`:`var(${Qs})`,Yo=(t,e,n)=>t?`var(${Ll})`:e?`var(${kl})`:n?`var(${Sl})`:`var(${bm})`;var wm=new Set(["$$slots","$$events","$$legacy"]),xm=O('<div><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Bi(t,e){de(e,!0);let n=ue(e,wm);var i=xm(),r=$(i);N(i),X(()=>{G(i,"data-add-widget",R[e.side]),Se(i,1,"diff-add-widget-wrapper invisible select-none transition-transform hover:scale-110 group-hover:visible"+(e.className?" "+e.className:"")),Q(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),Q(r,`
			color: var(${Ys});
			background-color: var(${Vs});
    `)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),D(t,i),fe()}rt(["mousedown"]);Bf();var ym=Ai('<svg aria-label="No newline at end of file" role="img" viewBox="0 0 16 16" version="1.1" fill="currentColor"><path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>');function Jo(t){var e=ym();D(t,e)}var Em=new Set(["$$slots","$$events","$$legacy"]),Am=O('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),Lm=O('<span class="diff-line-content-raw"><span data-template=""></span><!></span>'),mu=O('<span class="diff-line-content-raw"> </span>'),km=O('<span class="diff-line-content-raw"><span data-template=""></span></span>');function qo(t,e){de(e,!0);let n=ue(e,Em);e.diffLine?.changes?.hasLineChange?e.diffLine?.plainTemplate&&typeof Ao=="function"&&Ao({diffLine:e.diffLine,rawLine:e.rawLine,operator:e.operator||"add"}):e.plainLine&&!e.plainLine?.template&&(e.plainLine.template=Aa(e.plainLine.value));var r=pe(),o=ne(r);{var a=u=>{var c=pe(),f=ne(c);{var p=g=>{var x=Lm(),w=$(x);ur(w,()=>e.diffLine.plainTemplate,!0),N(w);var _=K(w);{var L=y=>{var C=Am(),S=$(C);Jo(S,{}),N(C),X(()=>{Se(C,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),Q(C,`
						width: var(${nt});
						height: var(${nt})
					`)}),D(y,C)};Y(_,y=>{e.diffLine.changes.newLineSymbol===$r.NEWLINE&&y(L)})}N(x),D(g,x)},m=g=>{var x=mu(),w=$(x,!0);N(x),X(()=>$e(w,e.rawLine)),D(g,x)};Y(f,g=>{e.diffLine?.plainTemplate?g(p):g(m,-1)})}D(u,c)},l=u=>{var c=km(),f=$(c);ur(f,()=>e.plainLine.template,!0),N(f),N(c),D(u,c)},d=u=>{var c=mu(),f=$(c,!0);N(c),X(()=>$e(f,e.rawLine)),D(u,c)};Y(o,u=>{e.diffLine?.changes?.hasLineChange?u(a):e.plainLine?.template?u(l,1):u(d,-1)})}D(t,r),fe()}var Im=new Set(["$$slots","$$events","$$legacy"]),Sm=O('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),Cm=O('<span class="diff-line-syntax-raw"><span data-template=""></span><!></span>'),gu=O("<span> </span>"),vu=O('<span class="diff-line-syntax-raw"></span>'),Nm=O('<span class="diff-line-syntax-raw"><span data-template=""></span></span>');function Cl(t,e){de(e,!0);let n=ue(e,Im);e.diffLine?.changes?.hasLineChange?e.syntaxLine&&e.diffLine&&!e.diffLine?.syntaxTemplate&&typeof Lo=="function"&&Lo({diffFile:e.diffFile,diffLine:e.diffLine,syntaxLine:e.syntaxLine,operator:e.operator||"add"}):e.syntaxLine&&!e.syntaxLine.template&&(e.syntaxLine.template=Ea(e.syntaxLine));var r=pe(),o=ne(r);{var a=c=>{qo(c,{get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get operator(){return e.operator},get enableWrap(){return e.enableWrap}})},l=c=>{var f=pe(),p=ne(f);{var m=x=>{var w=Cm(),_=$(w);ur(_,()=>e.diffLine.syntaxTemplate,!0),N(_);var L=K(_);{var y=C=>{var S=Sm(),E=$(S);Jo(E,{}),N(S),X(()=>{Se(S,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),Q(S,`
                width: var(${nt});
                height: var(${nt});
              `)}),D(C,S)};Y(L,C=>{e.diffLine.changes.newLineSymbol===$r.NEWLINE&&C(y)})}N(w),D(x,w)},g=x=>{var w=vu();fi(w,21,()=>e.syntaxLine.nodeList,di,(_,L)=>{let y=()=>s(L).node,C=()=>s(L).wrapper;var S=gu(),E=$(S,!0);N(S),X(h=>{G(S,"data-start",y().startIndex),G(S,"data-end",y().endIndex),Se(S,1,h),Q(S,C()?.properties?.style),$e(E,y().value)},[()=>ln(C()?.properties?.className?.join(" "))]),D(_,S)}),N(w),D(x,w)};Y(p,x=>{e.diffLine?.syntaxTemplate?x(m):x(g,-1)})}D(c,f)},d=c=>{var f=Nm(),p=$(f);ur(p,()=>e.syntaxLine.template,!0),N(p),N(f),D(c,f)},u=c=>{var f=vu();fi(f,21,()=>e.syntaxLine.nodeList,di,(p,m)=>{let g=()=>s(m).node,x=()=>s(m).wrapper;var w=gu(),_=$(w,!0);N(w),X(L=>{G(w,"data-start",g().startIndex),G(w,"data-end",g().endIndex),Se(w,1,L),Q(w,x()?.properties?.style),$e(_,g().value)},[()=>ln(x()?.properties?.className?.join(" "))]),D(p,w)}),N(f),D(c,f)};Y(o,c=>{e.syntaxLine?e.diffLine?.changes?.hasLineChange?c(l,1):e.syntaxLine.template?c(d,2):c(u,-1):c(a)})}D(t,r),fe()}var $m=new Set(["$$slots","$$events","$$legacy"]),Dm=O('<div class="diff-line-content-item pl-[2.0em]"><span class="diff-line-content-operator ml-[-1.5em] inline-block w-[1.5em] select-none indent-[0.2em]"> </span> <!></div>');function ui(t,e){de(e,!0);let n=ue(e,$m),i=I(()=>e.diffLine?.type===He.Add),r=I(()=>e.diffLine?.type===He.Delete),o=I(()=>e.syntaxLine&&e.syntaxLine?.nodeList?.length>150);var a=Dm(),l=$(a),d=$(l,!0);N(l);var u=K(l,2);{var c=p=>{{let m=I(()=>s(i)?"add":s(r)?"del":void 0);Cl(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffFile(){return e.diffFile},get diffLine(){return e.diffLine},get syntaxLine(){return e.syntaxLine},get enableWrap(){return e.enableWrap}})}},f=p=>{{let m=I(()=>s(i)?"add":s(r)?"del":void 0);qo(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get plainLine(){return e.plainLine},get enableWrap(){return e.enableWrap}})}};Y(u,p=>{e.enableHighlight&&e.syntaxLine&&!s(o)?p(c):p(f,-1)})}N(a),X(()=>{Q(a,`
		white-space: ${e.enableWrap?"pre-wrap":"pre"};
		word-break: ${e.enableWrap?"break-all":"initial"}
	`),G(l,"data-operator",s(i)?"+":s(r)?"-":void 0),$e(d,s(i)?"+":s(r)?"-":" ")}),D(t,a),fe()}var Tm=new Set(["$$slots","$$events","$$legacy"]),Fm=O('<td class="diff-line-old-num group relative w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-old-content group relative pr-[10px] align-top"><!> <!></td>',1),Mm=O('<td class="diff-line-old-placeholder select-none"><span>&ensp;</span></td>'),Hm=O('<td class="diff-line-new-num group relative w-[1%] min-w-[40px] select-none border-l-[1px] pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-new-content group relative pr-[10px] align-top"><!> <!></td>',1),Bm=O('<td class="diff-line-new-placeholder select-none border-l-[1px]"><span>&ensp;</span></td>'),Rm=O('<tr class="diff-line"><!><!></tr>');function Nl(t,e){de(e,!0);let n=ue(e,Tm),i=I(An()),r=I(io()),o=I(no()),a=I(to()),l=I(()=>e.diffFile.getSplitLeftLine(e.index)),d=I(()=>e.diffFile.getSplitRightLine(e.index)),u=()=>e.diffFile.getOldSyntaxLine(s(l)?.lineNumber||0),c=()=>e.diffFile.getNewSyntaxLine(s(d)?.lineNumber||0),f=()=>e.diffFile.getOldPlainLine(s(l)?.lineNumber||0),p=()=>e.diffFile.getNewPlainLine(s(d)?.lineNumber||0),m=ce(Le(u())),g=ce(Le(c())),x=ce(Le(f())),w=ce(Le(p())),_=I(()=>!!s(l)?.diff||!!s(d)?.diff),L=I(()=>Xi(s(l)?.diff)||Xi(s(d)?.diff)),y=I(()=>s(l)?.isHidden&&s(d)?.isHidden),C=()=>s(l)?.diff?.type===He.Delete,S=()=>s(d)?.diff?.type===He.Add,E=()=>{oe(m,u(),!0),oe(g,c(),!0),oe(x,f(),!0),oe(w,p(),!0)},h={current:()=>{}};ye(()=>{h.current(),E(),h.current=e.diffFile.subscribe(E)}),ze(()=>h.current());let b=(U,P)=>{s(i).side=P,s(i).lineNumber=U};var A=pe(),T=ne(A);{var M=U=>{var P=Rm(),J=$(P);{var ee=j=>{var z=Fm(),B=ne(z),he=$(B);{var ie=ge=>{{let ke=I(()=>s(l)?.lineNumber||0);Bi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:b})}};Y(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Z=K(he,2),ve=$(Z,!0);N(Z),N(B);var se=K(B,2),te=$(se);{var xe=ge=>{{let ke=I(()=>s(l)?.lineNumber||0);Bi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:b})}};Y(te,ge=>{s(_)&&s(r)&&ge(xe)})}var Ee=K(te,2);{let ge=I(()=>s(l)?.value||""),ke=I(()=>s(l)?.diff),Oe=I(()=>!!s(o));ui(Ee,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(x)},get syntaxLine(){return s(m)},get enableHighlight(){return s(Oe)}})}N(se),X((ge,ke)=>{Q(B,ge),G(B,"data-side",R[R.old]),G(Z,"data-line-num",s(l)?.lineNumber),Q(Z,`opacity: ${s(L)?void 0:.5} `),$e(ve,s(l)?.lineNumber),Q(se,ke),G(se,"data-side",R[R.old])},[()=>`
					background-color: ${Yo(!1,C(),s(_))};
					color: var(${s(_)?ft:pr})
				`,()=>` background-color: ${Vo(!1,C(),s(_))} `]),D(j,z)},re=j=>{var z=Mm();G(z,"colspan",2),X(()=>Q(z,`background-color: var(${Xt}) `)),D(j,z)};Y(J,j=>{s(l)?.lineNumber?j(ee):j(re,-1)})}var q=K(J);{var F=j=>{var z=Hm(),B=ne(z),he=$(B);{var ie=ge=>{{let ke=I(()=>s(d)?.lineNumber||0);Bi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:b})}};Y(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Z=K(he,2),ve=$(Z,!0);N(Z),N(B);var se=K(B,2),te=$(se);{var xe=ge=>{{let ke=I(()=>s(d)?.lineNumber||0);Bi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return R.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:b})}};Y(te,ge=>{s(_)&&s(r)&&ge(xe)})}var Ee=K(te,2);{let ge=I(()=>s(d)?.value||""),ke=I(()=>s(d)?.diff),Oe=I(()=>!!s(o));ui(Ee,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(w)},get syntaxLine(){return s(g)},get enableHighlight(){return s(Oe)}})}N(se),X((ge,ke)=>{Q(B,ge),G(B,"data-side",R[R.new]),G(Z,"data-line-num",s(d)?.lineNumber),Q(Z,` opacity: ${s(L)?void 0:.5} `),$e(ve,s(d)?.lineNumber),Q(se,ke),G(se,"data-side",R[R.new])},[()=>`
					background-color: ${Yo(S(),!1,s(_))};
					color: var(${s(_)?ft:pr});
					border-left-color: var(${gn});
					border-left-style: solid
				`,()=>`background-color: ${Vo(S(),!1,s(_))} `]),D(j,z)},V=j=>{var z=Bm();G(z,"colspan",2),X(()=>Q(z,`
					background-color: var(${Xt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(j,z)};Y(q,j=>{s(d)?.lineNumber?j(F):j(V,-1)})}N(P),X(()=>{G(P,"data-line",e.lineNumber),G(P,"data-state",s(_)?"diff":"plain")}),D(U,P)};Y(T,U=>{s(y)||U(M)})}D(t,A),fe()}var Om=new Set(["$$slots","$$events","$$legacy"]),Pm=O('<td class="diff-line-extend-old-content p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),jm=O('<td class="diff-line-extend-old-placeholder select-none p-0"></td>'),Um=O('<td class="diff-line-extend-new-content border-l-[1px] p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),Gm=O('<td class="diff-line-extend-new-placeholder select-none border-l-[1px] p-0"></td>'),zm=O('<tr data-state="extend" class="diff-line diff-line-extend"><!><!></tr>');function $l(t,e){de(e,!0);let n=ue(e,Om),i=I(Zr()),r=I(eo()),o=I(()=>e.diffFile.getSplitLeftLine(e.index)),a=I(()=>e.diffFile.getSplitRightLine(e.index)),l=I(()=>e.diffFile.getExpandEnabled()),d=I(()=>s(i)?.oldFile?.[s(o)?.lineNumber||""]),u=I(()=>s(i)?.newFile?.[s(a)?.lineNumber||""]),c=I(()=>!!((s(d)||s(u))&&(!s(o)?.isHidden&&!s(a)?.isHidden||s(l))&&s(r)));var f=pe(),p=ne(f);{var m=g=>{var x=zm(),w=$(x);{var _=E=>{var h=Pm();G(h,"colspan",2);var b=$(h),A=$(b);Mt(A,()=>s(r),()=>({diffFile:e.diffFile,side:R.old,lineNumber:s(o)?.lineNumber||0,data:s(d)?.data,onUpdate:e.diffFile.notifyAll})),N(b),N(h),D(E,h)},L=E=>{var h=jm();G(h,"colspan",2),X(()=>Q(h,`background-color: var(${Xt})`)),D(E,h)};Y(w,E=>{s(r)&&s(d)?E(_):E(L,-1)})}var y=K(w);{var C=E=>{var h=Um();G(h,"colspan",2);var b=$(h),A=$(b);Mt(A,()=>s(r),()=>({diffFile:e.diffFile,side:R.new,lineNumber:s(a)?.lineNumber||0,data:s(u)?.data,onUpdate:e.diffFile.notifyAll})),N(b),N(h),X(()=>Q(h,`border-left-color: var(${gn}); border-left-style: solid `)),D(E,h)},S=E=>{var h=Gm();G(h,"colspan",2),X(()=>Q(h,`
					background-color: var(${Xt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(E,h)};Y(y,E=>{s(r)&&s(u)?E(C):E(S,-1)})}N(x),X(()=>G(x,"data-line",`${e.lineNumber}-extend`)),D(g,x)};Y(p,g=>{s(c)&&g(m)})}D(t,f),fe()}var Wm=new Set(["$$slots","$$events","$$legacy"]),Qm=Ai('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M7.823 1.677 4.927 4.573A.25.25 0 0 0 5.104 5H7.25v3.236a.75.75 0 1 0 1.5 0V5h2.146a.25.25 0 0 0 .177-.427L8.177 1.677a.25.25 0 0 0-.354 0ZM13.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-3.75.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM7.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM4 11.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM1.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"></path></svg>');function Ct(t,e){de(e,!0);let n=ue(e,Wm);var i=Qm();X(()=>Se(i,0,ln(e.className))),D(t,i),fe()}var Vm=new Set(["$$slots","$$events","$$legacy"]),Ym=Ai('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177 14.323 2.896-2.896a.25.25 0 0 0-.177-.427H8.75V7.764a.75.75 0 1 0-1.5 0V11H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0ZM2.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM8.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function Nt(t,e){de(e,!0);let n=ue(e,Vm);var i=Ym();X(()=>Se(i,0,ln(e.className))),D(t,i),fe()}var Jm=new Set(["$$slots","$$events","$$legacy"]),qm=Ai('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function kn(t,e){de(e,!0);let n=ue(e,Jm);var i=qm();X(()=>Se(i,0,ln(e.className))),D(t,i),fe()}var Km=new Set(["$$slots","$$events","$$legacy"]),Xm=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Zm=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),eg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),tg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),ng=O('<div class="min-h-[28px]">&ensp;</div>'),ig=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Dl(t,e){de(e,!0);let n=ue(e,Km),i=I(()=>e.diffFile.getSplitHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>s(r)&&s(i)?.splitInfo),a=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},l=ce(Le(a())),d=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(d())),c=I(()=>{let _=s(i);return _&&_.isFirst}),f=I(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=I(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,d(),!0),oe(l,a(),!0)};_(),m.current=e.diffFile.subscribe(_)}),ze(()=>m.current());var g=pe(),x=ne(g);{var w=_=>{var L=ig(),y=$(L),C=$(y);{var S=T=>{var M=pe(),U=ne(M);{var P=q=>{var F=Xm(),V=$(F);Ct(V,{className:"fill-current"}),N(F),we("click",F,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(q,F)},J=q=>{var F=Zm(),V=$(F);Nt(V,{className:"fill-current"}),N(F),we("click",F,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(q,F)},ee=q=>{var F=eg(),V=$(F);kn(V,{className:"fill-current"}),N(F),we("click",F,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(q,F)},re=q=>{var F=tg(),V=ne(F),j=$(V);Nt(j,{className:"fill-current"}),N(V);var z=K(V,2),B=$(z);Ct(B,{className:"fill-current"}),N(z),we("click",V,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(q,F)};Y(U,q=>{s(c)?q(P):s(p)?q(J,1):s(l)?q(ee,2):q(re,-1)})}D(T,M)},E=T=>{var M=ng();D(T,M)};Y(C,T=>{s(o)?T(S):T(E,-1)})}N(y);var h=K(y);G(h,"colspan",3);var b=$(h),A=$(b,!0);N(b),N(h),N(L),X(()=>{G(L,"data-line",`${e.lineNumber}-hunk`),Q(y,`
				background-color: var(${Un});
				color: var(${ft})
			`),Q(h,`background-color: var(${dn})`),Q(b,`
					color: var(${jn})
				`),$e(A,s(i)?.splitInfo?.plainText||s(i)?.text)}),D(_,L)};Y(x,_=>{(s(u)||s(f))&&_(w)})}D(t,g),fe()}rt(["click"]);var rg=new Set(["$$slots","$$events","$$legacy"]),_u=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),bu=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),wu=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),xu=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),yu=O('<div class="min-h-[28px]">&ensp;</div>'),og=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td><td class="diff-line-hunk-action relative z-[1] w-[1%] min-w-[40px] select-none border-l-[1px] p-[1px]"><!></td><td class="diff-line-hunk-content relative pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Tl(t,e){de(e,!0);let n=ue(e,rg),i=I(()=>e.diffFile.getSplitHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>s(r)&&s(i)?.splitInfo),a=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},l=ce(Le(a())),d=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(d())),c=I(()=>{let _=s(i);return _&&_.isFirst}),f=I(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=I(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,d(),!0),oe(l,a(),!0)};_(),m.current=e.diffFile.subscribe(_)}),ze(()=>m.current());var g=pe(),x=ne(g);{var w=_=>{var L=og(),y=$(L),C=$(y);{var S=q=>{var F=pe(),V=ne(F);{var j=ie=>{var Z=_u(),ve=$(Z);Ct(ve,{className:"fill-current"}),N(Z),we("click",Z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)},z=ie=>{var Z=bu(),ve=$(Z);Nt(ve,{className:"fill-current"}),N(Z),we("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(ie,Z)},B=ie=>{var Z=wu(),ve=$(Z);kn(ve,{className:"fill-current"}),N(Z),we("click",Z,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(ie,Z)},he=ie=>{var Z=xu(),ve=ne(Z),se=$(ve);Nt(se,{className:"fill-current"}),N(ve);var te=K(ve,2),xe=$(te);Ct(xe,{className:"fill-current"}),N(te),we("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)};Y(V,ie=>{s(c)?ie(j):s(p)?ie(z,1):s(l)?ie(B,2):ie(he,-1)})}D(q,F)},E=q=>{var F=yu();D(q,F)};Y(C,q=>{s(o)?q(S):q(E,-1)})}N(y);var h=K(y),b=$(h),A=$(b,!0);N(b),N(h);var T=K(h),M=$(T);{var U=q=>{var F=pe(),V=ne(F);{var j=ie=>{var Z=_u(),ve=$(Z);Ct(ve,{className:"fill-current"}),N(Z),we("click",Z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)},z=ie=>{var Z=bu(),ve=$(Z);Nt(ve,{className:"fill-current"}),N(Z),we("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(ie,Z)},B=ie=>{var Z=wu(),ve=$(Z);kn(ve,{className:"fill-current"}),N(Z),we("click",Z,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(ie,Z)},he=ie=>{var Z=xu(),ve=ne(Z),se=$(ve);Nt(se,{className:"fill-current"}),N(ve);var te=K(ve,2),xe=$(te);Ct(xe,{className:"fill-current"}),N(te),we("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,Z)};Y(V,ie=>{s(c)?ie(j):s(p)?ie(z,1):s(l)?ie(B,2):ie(he,-1)})}D(q,F)},P=q=>{var F=yu();D(q,F)};Y(M,q=>{s(o)?q(U):q(P,-1)})}N(T);var J=K(T),ee=$(J),re=$(ee,!0);N(ee),N(J),N(L),X(()=>{G(L,"data-line",`${e.lineNumber}-hunk`),Q(y,`
				background-color: var(${Un});
				color: var(${ft})
			`),Q(h,`background-color: var(${dn})`),Q(b,`
					color: var(${jn})
				`),$e(A,s(i)?.splitInfo?.plainText||s(i)?.text),Q(T,`
				background-color: var(${Un});
				color: var(${ft});
				border-left-color: var(${gn});
				border-left-style: solid
			`),Q(J,`background-color: var(${dn})`),Q(ee,`
					color: var(${jn})
				`),$e(re,s(i)?.splitInfo?.plainText||s(i)?.text)}),D(_,L)};Y(x,_=>{(s(u)||s(f))&&_(w)})}D(t,g),fe()}rt(["click"]);var sg=new Set(["$$slots","$$events","$$legacy"]);function Js(t,e){de(e,!0);let n=ue(e,sg),i=I(zs());var r=pe(),o=ne(r);{var a=d=>{Dl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Tl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};Y(o,d=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?d(a):d(l,-1)})}D(t,r),fe()}var ag=new Set(["$$slots","$$events","$$legacy"]),lg=O('<td class="diff-line-widget-old-content p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),dg=O('<td class="diff-line-widget-old-placeholder select-none p-0"></td>'),fg=O('<td class="diff-line-widget-new-content border-l-[1px] p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),cg=O('<td class="diff-line-widget-new-placeholder select-none border-l-[1px] p-0"></td>'),ug=O('<tr data-state="widget" class="diff-line diff-line-widget"><!><!></tr>');function Fl(t,e){de(e,!0);let n=ue(e,ag),i=I(Xr()),r=I(An()),o=I(()=>e.diffFile.getSplitLeftLine(e.index)),a=I(()=>e.diffFile.getSplitRightLine(e.index)),l=I(()=>s(o)?.lineNumber&&s(r)?.side===R.old&&s(r)?.lineNumber===s(o)?.lineNumber),d=I(()=>s(a)?.lineNumber&&s(r)?.side===R.new&&s(r)?.lineNumber===s(a)?.lineNumber),u=I(()=>(!!s(l)||!!s(d))&&!s(o)?.isHidden&&!s(a)?.isHidden&&!!s(i)),c=()=>{s(r).side=void 0,s(r).lineNumber=void 0};var f=pe(),p=ne(f);{var m=g=>{var x=ug(),w=$(x);{var _=E=>{var h=lg();G(h,"colspan",2);var b=$(h),A=$(b);Mt(A,()=>s(i),()=>({diffFile:e.diffFile,side:R.old,lineNumber:s(o)?.lineNumber||0,onClose:c})),N(b),N(h),D(E,h)},L=E=>{var h=dg();G(h,"colspan",2),X(()=>Q(h,`background-color: var(${Xt})`)),D(E,h)};Y(w,E=>{s(l)&&s(i)?E(_):E(L,-1)})}var y=K(w);{var C=E=>{var h=fg();G(h,"colspan",2);var b=$(h),A=$(b);Mt(A,()=>s(i)??ht,()=>({diffFile:e.diffFile,side:R.new,lineNumber:s(a)?.lineNumber||0,onClose:c})),N(b),N(h),X(()=>Q(h,`border-left-color: var(${gn}); border-left-style: solid `)),D(E,h)},S=E=>{var h=cg();G(h,"colspan",2),X(()=>Q(h,`
					background-color: var(${Xt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(E,h)};Y(y,E=>{s(d)&&s(i)?E(C):E(S,-1)})}N(x),X(()=>G(x,"data-line",`${e.lineNumber}-widget`)),D(g,x)};Y(p,g=>{s(u)&&g(m)})}D(t,f),fe()}var pg=new Set(["$$slots","$$events","$$legacy"]),hg=O("<!> <!> <!> <!>",1),mg=O('<div class="split-diff-view split-diff-view-warp w-full"><div class="diff-table-wrapper w-full"><style data-select-style=""></style> <table class="diff-table w-full table-fixed border-collapse border-spacing-0"><colgroup><col class="diff-table-old-num-col"/><col class="diff-table-old-content-col"/><col class="diff-table-new-num-col"/><col class="diff-table-new-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">old line number</th><th scope="col">old line content</th><th scope="col">new line number</th><th scope="col">new line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Ml(t,e){de(e,!0);let n=ue(e,pg),i=()=>ls(e.diffFile),r=ce(Le(i())),o={current:void 0},a=ce(void 0),l=I(()=>Math.max(e.diffFile.splitLineLength,e.diffFile.fileLineLength).toString()),d=I(Kr()),u=I(()=>({fontSize:`${s(d)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),c={current:()=>{}};ye(()=>{c.current();let A=()=>oe(r,i(),!0);A(),c.current=e.diffFile.subscribe(A)}),ze(()=>c.current());let f=A=>{let T=s(a);if(T)if(A){let M=A===R.old?R.new:R.old;T.textContent=`#diff-root${e.diffFile.getId()} [data-side="${R[M]}"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="extend"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="hunk"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="widget"] {user-select: none}`}else T.textContent=""},p=A=>{let T=A.target;if(T&&T instanceof HTMLElement&&T.nodeName==="BUTTON"){Ln();return}let M=oo(T);if(!(M&&M!==`diff-root${e.diffFile.getId()}`))for(;T&&T instanceof HTMLElement;){let U=T.getAttribute("data-state"),P=T.getAttribute("data-side");if(P&&o.current!==R[P]&&(o.current=R[P],f(R[P]),Ln()),U)if(U==="extend"||U==="hunk"||U==="widget"){o.current!==void 0&&(o.current=void 0,f(void 0),Ln());return}else return;T=T.parentElement}},m=I(ro({text:()=>s(l),font:()=>s(u)})),g=I(()=>Math.max(40,s(m)+25));var x=mg(),w=$(x),_=$(w);lt(_,()=>A=>oe(a,A,!0));var L=K(_,2),y=$(L),C=$(y),S=K(C,2);Zi(),N(y);var E=K(y,2),h=$(E);fi(h,17,()=>s(r),di,(A,T)=>{var M=hg(),U=ne(M);Js(U,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}});var P=K(U,2);Nl(P,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}});var J=K(P,2);Fl(J,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}});var ee=K(J,2);$l(ee,{get index(){return s(T).index},get lineNumber(){return s(T).lineNumber},get diffFile(){return e.diffFile}}),D(A,M)});var b=K(h);Js(b,{get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),N(E),N(L),N(w),N(x),X((A,T,M)=>{Q(w,A),G(C,"width",T),G(S,"width",M)},[()=>`
			${De}: ${Math.round(s(g))}px;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`,()=>Math.round(s(g)),()=>Math.round(s(g))]),we("mousedown",E,p),D(t,x),fe()}rt(["mousedown"]);var gg=new Set(["$$slots","$$events","$$legacy"]),vg=O("<td><!> <span> </span></td> <td><!></td>",1),_g=O("<td><span>&ensp;</span></td>"),bg=O("<tr><!></tr>");function Hl(t,e){de(e,!0);let n=ue(e,gg),i=I(An()),r=I(io()),o=I(no()),a=I(to()),l=I(()=>e.side===R.old?e.diffFile.getSplitLeftLine(e.index):e.diffFile.getSplitRightLine(e.index)),d=I(()=>!!s(l)?.diff),u=I(()=>Xi(s(l)?.diff)),c=I(()=>s(l)?.isHidden),f=I(()=>!!s(l)?.lineNumber),p=()=>e.side===R.old?e.diffFile.getOldSyntaxLine(s(l)?.lineNumber||0):e.diffFile.getNewSyntaxLine(s(l)?.lineNumber||0),m=()=>e.side===R.old?e.diffFile.getOldPlainLine(s(l)?.lineNumber||0):e.diffFile.getNewPlainLine(s(l)?.lineNumber||0),g=ce(Le(p())),x=ce(Le(m())),w=()=>{oe(g,p(),!0),oe(x,m(),!0)},_={current:()=>{}};ye(()=>{_.current(),w(),_.current=e.diffFile.subscribe(w)}),ze(()=>_.current());let L=(b,A)=>{s(i).side=A,s(i).lineNumber=b},y=()=>s(l)?.diff?.type===He.Add,C=()=>s(l)?.diff?.type===He.Delete;var S=pe(),E=ne(S);{var h=b=>{var A=bg(),T=$(A);{var M=P=>{var J=vg(),ee=ne(J),re=$(ee);{var q=B=>{{let he=I(()=>s(l)?.lineNumber||0);Bi(B,{get index(){return e.index},get lineNumber(){return s(he)},get side(){return e.side},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:L})}};Y(re,B=>{s(d)&&s(r)&&B(q)})}var F=K(re,2),V=$(F,!0);N(F),N(ee);var j=K(ee,2),z=$(j);{let B=I(()=>s(l)?.value||""),he=I(()=>s(l)?.diff),ie=I(()=>!!s(o));ui(z,{enableWrap:!1,get diffFile(){return e.diffFile},get rawLine(){return s(B)},get diffLine(){return s(he)},get plainLine(){return s(x)},get syntaxLine(){return s(g)},get enableHighlight(){return s(ie)}})}N(j),X((B,he)=>{Se(ee,1,`diff-line-${R[e.side]}-num sticky left-0 z-[1] w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top`),Q(ee,B),G(F,"data-line-num",s(l)?.lineNumber),Q(F,` opacity: ${s(u)?void 0:.5} `),$e(V,s(l)?.lineNumber),Se(j,1,`diff-line-${R[e.side]}-content pr-[10px] align-top`),Q(j,he)},[()=>`
					background-color: ${Yo(y(),C(),s(d))};
					color: var(${s(d)?ft:pr});
					width: var(${De});
					min-width: var(${De});
					max-width: var(${De})
				`,()=>` background-color: ${Vo(y(),C(),s(d))} `]),D(P,J)},U=P=>{var J=_g();G(J,"colspan",2),X(()=>{Se(J,1,`diff-line-${R[e.side]}-placeholder select-none`),Q(J,`background-color: var(${Xt}) `)}),D(P,J)};Y(T,P=>{s(f)?P(M):P(U,-1)})}N(A),X(()=>{G(A,"data-line",e.lineNumber),G(A,"data-state",s(d)||!s(f)?"diff":"plain"),G(A,"data-side",R[e.side]),Se(A,1,"diff-line"+(s(f)?" group":""))}),D(b,A)};Y(E,b=>{s(c)||b(h)})}D(t,S),fe()}var Ri=({selector:t,enable:e})=>{let n=I(Us()),i=I(Gs()),r=I(ci()),o=ce(0),a={current:()=>{}},l=()=>{if(s(r)&&e()){let c=Ws(s(i)).querySelector(`#diff-root${s(n)}`)?.querySelector(t());if(!c)return;let f=c,p=()=>{let x=c?.getBoundingClientRect();oe(o,x?.width??0,!0)};p();let m=()=>{f?.__observeCallback?.delete(p),f?.__observeCallback?.size===0&&(f.__observeInstance?.disconnect(),f.removeAttribute("data-observe"),delete f.__observeCallback,delete f.__observeInstance)};if(f.__observeCallback){f.__observeCallback.add(p),a.current=()=>m();return}f.__observeCallback=new Set,f.__observeCallback.add(p);let g=new ResizeObserver(()=>f?.__observeCallback?.forEach(x=>x()));f.__observeInstance=g,g.observe(f),f.setAttribute("data-observe","height"),a.current=()=>m()}};return ye(()=>(l(),()=>a.current?.())),()=>s(o)};var Oi=({selector:t,wrapper:e,side:n,enable:i})=>{let r=I(Us()),o=I(Gs()),a=I(ci()),l={current:()=>{}},d=()=>{if(s(a)&&i()){let u=()=>{},f=Ws(s(o)).querySelector(`#diff-root${s(r)}`),p=Array.from(f?.querySelectorAll(t())||[]),m=e()?Array.from(f?.querySelectorAll(e())||[]):p;if(p.length===2&&m.length===2){let g=p[0],x=p[1],w=m[0],_=m[1],L=g.getAttribute("data-side")===n()?g:x,y=L,C=()=>{g.style.height="auto",x.style.height="auto";let h=g.getBoundingClientRect(),b=x.getBoundingClientRect(),A=Math.max(h.height,b.height);w.style.height=A+"px",_.style.height=A+"px",w.setAttribute("data-sync-height",String(A)),_.setAttribute("data-sync-height",String(A))};C();let S=()=>{y.__observeCallback?.delete(C),y.__observeCallback?.size===0&&(y.__observeInstance?.disconnect(),L.removeAttribute("data-observe"),delete y.__observeCallback,delete y.__observeInstance)};if(y.__observeCallback){y.__observeCallback.add(C),u=S;return}y.__observeCallback=new Set,y.__observeCallback.add(C);let E=new ResizeObserver(()=>y.__observeCallback?.forEach(h=>h()));y.__observeInstance=E,E.observe(L),L.setAttribute("data-observe","height"),u=S}l.current=u}};ye(()=>(d(),()=>l.current?.()))};var wg=new Set(["$$slots","$$events","$$legacy"]),xg=O('<td><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!></div></td>'),yg=O("<td><div></div></td>"),Eg=O('<tr data-state="extend" class="diff-line diff-line-extend"><!></tr>');function Bl(t,e){de(e,!0);let n=ue(e,wg),i=ce(null),r=I(Zr()),o=I(eo()),a=I(()=>`div[data-line="${e.lineNumber}-extend-content"]`),l=I(()=>`tr[data-line="${e.lineNumber}-extend"]`),d=I(()=>e.side===R.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),u=I(()=>e.diffFile.getSplitLeftLine(e.index)),c=I(()=>e.diffFile.getSplitRightLine(e.index)),f=I(()=>e.diffFile.getExpandEnabled()),p=I(()=>s(r)?.oldFile?.[s(u)?.lineNumber||""]),m=I(()=>s(r)?.newFile?.[s(c)?.lineNumber||""]),g=I(()=>e.side===R.old?s(u):s(c)),x=I(()=>s(g)?.isHidden),w=I(()=>e.side===R.old?s(p):s(m)),_=I(()=>e.side===R.old?s(u)?.lineNumber:s(c)?.lineNumber),L=I(()=>!!((s(p)||s(m))&&(!s(x)||s(f))&&s(o))),y=I(()=>(e.side===R.old?!!s(p):!!s(m))&&s(L)),C=I(()=>R[s(w)?e.side:e.side===R.new?R.old:R.new]);Oi({selector:()=>s(a),wrapper:()=>s(l),side:()=>s(C),enable:()=>!!(s(L)&&s(i))});let S=I(Ri({selector:()=>s(d),enable:()=>!!(s(y)&&s(i))}));var E=pe(),h=ne(E);{var b=A=>{var T=Eg(),M=$(T);{var U=J=>{var ee=xg();G(ee,"colspan",2);var re=$(ee),q=$(re);{var F=V=>{var j=pe(),z=ne(j);Mt(z,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(_)||0,data:s(w)?.data,onUpdate:e.diffFile.notifyAll})),D(V,j)};Y(q,V=>{s(S)>0&&V(F)})}N(re),N(ee),X(()=>{Se(ee,1,`diff-line-extend-${R[e.side]}-content p-0`),G(re,"data-line",`${e.lineNumber}-extend-content`),G(re,"data-side",R[e.side]),Q(re,` width: ${s(S)}px `)}),D(J,ee)},P=J=>{var ee=yg();G(ee,"colspan",2);var re=$(ee);N(ee),X(()=>{Se(ee,1,`diff-line-extend-${R[e.side]}-placeholder select-none p-0`),Q(ee,` background-color: var(${Xt})`),G(re,"data-line",`${e.lineNumber}-extend-content`),G(re,"data-side",R[e.side])}),D(J,ee)};Y(M,J=>{s(o)&&s(w)?J(U):J(P,-1)})}N(T),lt(T,()=>J=>oe(i,J,!0)),X(()=>{G(T,"data-line",`${e.lineNumber}-extend`),G(T,"data-side",R[e.side])}),D(A,T)};Y(h,A=>{s(L)&&A(b)})}D(t,E),fe()}var Ag=new Set(["$$slots","$$events","$$legacy"]),Lg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),kg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Ig=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Sg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Cg=O('<div class="min-h-[28px]">&ensp;</div>'),Ng=O('<td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td> <td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td>',1),$g=O('<td class="diff-line-hunk-placeholder select-none"><div class="min-h-[28px]">&ensp;</div></td>'),Dg=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><!></tr>');function Rl(t,e){de(e,!0);let n=ue(e,Ag),i=ce(null),r=I(()=>e.diffFile.getSplitHunkLine(e.index)),o=I(()=>e.diffFile.getExpandEnabled()),a=I(()=>s(o)&&s(r)?.splitInfo),l=I(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=I(()=>e.side===R.old),u=()=>{let E=s(r);return E&&E.splitInfo&&E.splitInfo.endHiddenIndex-E.splitInfo.startHiddenIndex<je},c=ce(Le(u())),f=()=>{let E=s(r);return E&&E.splitInfo&&E.splitInfo.startHiddenIndex<E.splitInfo.endHiddenIndex},p=ce(Le(f())),m=I(()=>{let E=s(r);return E&&E.isFirst}),g=I(()=>{let E=s(r);return E&&e.diffFile._getIsPureDiffRender()&&!E.splitInfo}),x=I(()=>{let E=s(r);return E&&E.isLast}),w={current:()=>{}};ye(()=>{w.current();let E=()=>{oe(p,f(),!0),oe(c,u(),!0)};E(),w.current=e.diffFile.subscribe(E)}),ze(()=>w.current());let _=I(()=>R[R.old]),L=I(()=>e.side===R.new&&(!!s(p)||s(g)));Oi({selector:()=>s(l),wrapper:()=>s(l),side:()=>s(_),enable:()=>!!(s(L)&&s(i))});var y=pe(),C=ne(y);{var S=E=>{var h=Dg(),b=$(h);{var A=M=>{var U=Ng(),P=ne(U),J=$(P);{var ee=j=>{var z=pe(),B=ne(z);{var he=se=>{var te=Lg(),xe=$(te);Ct(xe,{className:"fill-current"}),N(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(se,te)},ie=se=>{var te=kg(),xe=$(te);Nt(xe,{className:"fill-current"}),N(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(se,te)},Z=se=>{var te=Ig(),xe=$(te);kn(xe,{className:"fill-current"}),N(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(se,te)},ve=se=>{var te=Sg(),xe=ne(te),Ee=$(xe);Nt(Ee,{className:"fill-current"}),N(xe);var ge=K(xe,2),ke=$(ge);Ct(ke,{className:"fill-current"}),N(ge),we("click",xe,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",ge,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(se,te)};Y(B,se=>{s(m)?se(he):s(x)?se(ie,1):s(c)?se(Z,2):se(ve,-1)})}D(j,z)},re=j=>{var z=Cg();D(j,z)};Y(J,j=>{s(a)?j(ee):j(re,-1)})}N(P);var q=K(P,2),F=$(q),V=$(F,!0);N(F),N(q),X(()=>{Q(P,`
					background-color: var(${Un});
					color: var(${ft});
					width: var(${De});
					min-width: var(${De});
					max-width: var(${De});
				`),Q(q,`background-color: var(${dn})`),Q(F,`
						color: var(${jn})
					`),$e(V,s(r)?.splitInfo?.plainText||s(r)?.text)}),D(M,U)},T=M=>{var U=$g();G(U,"colspan",2),X(()=>Q(U,`background-color: var(${dn})`)),D(M,U)};Y(b,M=>{s(d)?M(A):M(T,-1)})}N(h),lt(h,()=>M=>oe(i,M,!0)),X(()=>{G(h,"data-line",`${e.lineNumber}-hunk`),G(h,"data-side",R[e.side]),Q(h,`background-color: var(${dn})`)}),D(E,h)};Y(C,E=>{(s(p)||s(g))&&E(S)})}D(t,y),fe()}rt(["click"]);var Tg=new Set(["$$slots","$$events","$$legacy"]),Fg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Mg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Hg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Bg=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Rg=O('<div class="min-h-[28px]">&ensp;</div>'),Og=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Ol(t,e){de(e,!0);let n=ue(e,Tg),i=ce(null),r=I(()=>e.diffFile.getSplitHunkLine(e.index)),o=I(()=>e.diffFile.getExpandEnabled()),a=I(()=>s(o)&&s(r)?.splitInfo),l=I(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.endHiddenIndex-S.splitInfo.startHiddenIndex<je},u=ce(Le(d())),c=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.startHiddenIndex<S.splitInfo.endHiddenIndex},f=ce(Le(c())),p=I(()=>{let S=s(r);return S&&S.isFirst}),m=I(()=>{let S=s(r);return S&&e.diffFile._getIsPureDiffRender()&&!S.splitInfo}),g=I(()=>{let S=s(r);return S&&S.isLast}),x=I(()=>R[R.old]),w=I(()=>e.side===R.new&&(!!s(f)||s(m))),_={current:()=>{}};ye(()=>{_.current();let S=()=>{oe(f,c(),!0),oe(u,d(),!0)};S(),_.current=e.diffFile.subscribe(S)}),ze(()=>_.current()),Oi({selector:()=>s(l),wrapper:()=>s(l),side:()=>s(x),enable:()=>!!(s(w)&&s(i))});var L=pe(),y=ne(L);{var C=S=>{var E=Og(),h=$(E),b=$(h);{var A=J=>{var ee=pe(),re=ne(ee);{var q=z=>{var B=Fg(),he=$(B);Ct(he,{className:"fill-current"}),N(B),we("click",B,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(z,B)},F=z=>{var B=Mg(),he=$(B);Nt(he,{className:"fill-current"}),N(B),we("click",B,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(z,B)},V=z=>{var B=Hg(),he=$(B);kn(he,{className:"fill-current"}),N(B),we("click",B,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(z,B)},j=z=>{var B=Bg(),he=ne(B),ie=$(he);Nt(ie,{className:"fill-current"}),N(he);var Z=K(he,2),ve=$(Z);Ct(ve,{className:"fill-current"}),N(Z),we("click",he,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",Z,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(z,B)};Y(re,z=>{s(p)?z(q):s(g)?z(F,1):s(u)?z(V,2):z(j,-1)})}D(J,ee)},T=J=>{var ee=Rg();D(J,ee)};Y(b,J=>{s(a)?J(A):J(T,-1)})}N(h);var M=K(h),U=$(M),P=$(U,!0);N(U),N(M),N(E),lt(E,()=>J=>oe(i,J,!0)),X(()=>{G(E,"data-line",`${e.lineNumber}-hunk`),G(E,"data-side",R[e.side]),Q(E,`background-color: var(${dn})`),Q(h,`
				background-color: var(${Un});
				color: var(${ft});
				width: var(${De});
				min-width: var(${De});
				max-width: var(${De})
			`),Q(M,`background-color: var(${dn})`),Q(U,`
					color: var(${jn})
				`),$e(P,s(r)?.splitInfo?.plainText||s(r)?.text)}),D(S,E)};Y(y,S=>{(s(f)||s(m))&&S(C)})}D(t,L),fe()}rt(["click"]);var Pg=new Set(["$$slots","$$events","$$legacy"]);function qs(t,e){de(e,!0);let n=ue(e,Pg),i=I(zs());var r=pe(),o=ne(r);{var a=d=>{Rl(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Ol(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};Y(o,d=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?d(a):d(l,-1)})}D(t,r),fe()}var jg=new Set(["$$slots","$$events","$$legacy"]),Ug=O('<td><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!></div></td>'),Gg=O("<td><div></div></td>"),zg=O('<tr data-state="widget" class="diff-line diff-line-widget"><!></tr>');function Pl(t,e){de(e,!0);let n=ue(e,jg),i=ce(null),r=I(Xr()),o=I(An()),a=I(()=>e.diffFile.getSplitLeftLine(e.index)),l=I(()=>e.diffFile.getSplitRightLine(e.index)),d=I(()=>!!s(a)?.lineNumber&&s(o)?.side===R.old&&s(o)?.lineNumber===s(a)?.lineNumber),u=I(()=>!!s(l)?.lineNumber&&s(o)?.side===R.new&&s(o)?.lineNumber===s(l)?.lineNumber),c=I(()=>e.side===R.old?s(a):s(l)),f=I(()=>s(c)?.isHidden),p=I(()=>`div[data-line="${e.lineNumber}-widget-content"]`),m=I(()=>`tr[data-line="${e.lineNumber}-widget"]`),g=I(()=>e.side===R.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),x=I(()=>e.side===R.old?s(d):s(u)),w=I(()=>R[s(x)?e.side:e.side===R.old?R.new:R.old]),_=I(()=>(!!s(d)||!!s(u))&&!s(f)&&!!s(r)),L=I(()=>s(x)&&!!s(_)),y=()=>{s(o).side=void 0,s(o).lineNumber=void 0};Oi({selector:()=>s(p),wrapper:()=>s(m),side:()=>s(w),enable:()=>!!(s(_)&&s(i))});let C=I(Ri({selector:()=>s(g),enable:()=>!!(s(L)&&s(i))}));var S=pe(),E=ne(S);{var h=b=>{var A=zg(),T=$(A);{var M=P=>{var J=Ug();G(J,"colspan",2);var ee=$(J),re=$(ee);{var q=F=>{var V=pe(),j=ne(V);Mt(j,()=>s(r),()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(c)?.lineNumber||0,onClose:y})),D(F,V)};Y(re,F=>{s(C)>0&&F(q)})}N(ee),N(J),X(()=>{Se(J,1,`diff-line-widget-${R[e.side]}-content p-0`),G(ee,"data-line",`${e.lineNumber}-widget-content`),G(ee,"data-side",R[e.side]),Q(ee,` width: ${s(C)}px `)}),D(P,J)},U=P=>{var J=Gg();G(J,"colspan",2);var ee=$(J);N(J),X(()=>{Se(J,1,`diff-line-widget-${R[e.side]}-placeholder select-none p-0`),Q(J,`background-color: var(${Xt})`),G(ee,"data-line",`${e.lineNumber}-widget-content`),G(ee,"data-side",R[e.side])}),D(P,J)};Y(T,P=>{s(x)?P(M):P(U,-1)})}N(A),lt(A,()=>P=>oe(i,P,!0)),X(()=>{G(A,"data-line",`${e.lineNumber}-widget`),G(A,"data-side",R[e.side])}),D(b,A)};Y(E,b=>{s(_)&&b(h)})}D(t,S),fe()}var Wg=new Set(["$$slots","$$events","$$legacy"]),Qg=O("<!> <!> <!> <!>",1),Vg=O('<table><colgroup><col/><col/></colgroup><thead class="hidden"><tr><th scope="col"> </th><th scope="col"> </th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table>');function Ks(t,e){de(e,!0);let n=ue(e,Wg),i=I(()=>e.side===R.new?"new-diff-table":"old-diff-table"),r=()=>ls(e.diffFile),o=ce(Le(r())),a={current:()=>{}},l=e.selectState;ye(()=>{a.current();let E=()=>oe(o,r(),!0);E(),a.current=e.diffFile.subscribe(E)}),ze(()=>a.current());let d=E=>{let h=E.target;if(h&&h?.nodeName==="BUTTON"){Ln();return}let b=oo(h);if(!(b&&b!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let A=h.getAttribute("data-state");if(A){A==="extend"||A==="hunk"||A==="widget"?l.current!==void 0&&(l.current=void 0,e.onSelect?.(void 0),Ln()):l.current!==e.side&&(l.current=n.side,e.onSelect?.(e.side),Ln());return}h=h.parentElement}};var u=Vg(),c=$(u),f=$(c),p=K(f);N(c);var m=K(c),g=$(m),x=$(g),w=$(x);N(x);var _=K(x),L=$(_);N(_),N(g),N(m);var y=K(m),C=$(y);fi(C,17,()=>s(o),di,(E,h)=>{var b=Qg(),A=ne(b);qs(A,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var T=K(A,2);Hl(T,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=K(T,2);Pl(M,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var U=K(M,2);Bl(U,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),D(E,b)});var S=K(C);qs(S,{get side(){return e.side},get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),N(y),N(u),X(()=>{Se(u,1,`${s(i)} w-full border-collapse border-spacing-0`),G(u,"data-mode",R[e.side]),Se(f,1,`diff-table-${R[e.side]}-num-col`),Se(p,1,`diff-table-${R[e.side]}-content-col`),$e(w,`${R[e.side]??""} line number`),$e(L,`${R[e.side]??""} line content`)}),we("mousedown",y,d),D(t,u),fe()}rt(["mousedown"]);var Yg=new Set(["$$slots","$$events","$$legacy"]),Jg=O('<div class="split-diff-view split-diff-view-normal flex w-full basis-[50%]"><style data-select-style=""></style> <div class="old-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div> <div class="diff-split-line w-[1.5px]"></div> <div class="new-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div></div>');function jl(t,e){de(e,!0);let n=ue(e,Yg),i=I(ci()),r=ce(void 0),o=ce(void 0),a=ce(null),l=I(()=>Math.max(e.diffFile.fileLineLength,e.diffFile.splitLineLength).toString()),d={current:()=>{}},u={current:void 0};ye(()=>{if(d.current(),!s(i))return;let b=s(r),A=s(o);!b||!A||(d.current=hu(b,A))}),ze(()=>d.current());let f=b=>{let A=s(a);A&&(b?A.textContent=`#${w()} [data-state="extend"] {user-select: none} 
#${w()} [data-state="hunk"] {user-select: none} 
#${w()} [data-state="widget"] {user-select: none}`:A.textContent="")},p=I(Kr()),m=I(()=>({fontSize:`${s(p)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),g=I(ro({text:()=>s(l),font:()=>s(m)})),x=I(()=>Math.max(40,s(g)+25)),w=()=>`diff-split-view-${e.diffFile.getId()}`;var _=Jg(),L=$(_);lt(L,()=>b=>oe(a,b,!0));var y=K(L,2),C=$(y);Ks(C,{get side(){return R.old},get diffFile(){return e.diffFile},onSelect:f,get selectState(){return u}}),N(y),lt(y,()=>b=>{oe(r,b,!0)});var S=K(y,2),E=K(S,2),h=$(E);Ks(h,{get side(){return R.new},get diffFile(){return e.diffFile},onSelect:f,get selectState(){return u}}),N(E),lt(E,()=>b=>{oe(o,b,!0)}),N(_),X((b,A)=>{Q(y,b),Q(S,`background-color: var(${gn})`),Q(E,A)},[()=>`
      ${De}: ${Math.round(s(x))}px;
      overscroll-behavior-x: none;
      font-family: Menlo, Consolas, monospace;
      font-size: var(${nt});
    `,()=>`
			${De}: ${Math.round(s(x))}px;
			overscroll-behavior-x: none;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`]),D(t,_),fe()}var qg=new Set(["$$slots","$$events","$$legacy"]);function Ul(t,e){de(e,!0);let n=ue(e,qg),i=I(En());var r=pe(),o=ne(r);{var a=d=>{Ml(d,{get diffFile(){return e.diffFile}})},l=d=>{jl(d,{get diffFile(){return e.diffFile}})};Y(o,d=>{s(i)?d(a):d(l,-1)})}D(t,r),fe()}var Kg=new Set(["$$slots","$$events","$$legacy"]),Xg=O('<div class="diff-add-widget-wrapper invisible absolute left-[100%] translate-x-[-50%] select-none transition-transform hover:scale-110 group-hover:visible"><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Ko(t,e){de(e,!0);let n=ue(e,Kg);var i=Xg(),r=$(i);N(i),X(()=>{G(i,"data-add-widget",R[e.side]),Q(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),Q(r,`
			color: var(${Ys});
			background-color: var(${Vs});
		`)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),D(t,i),fe()}rt(["mousedown"]);var Zg=new Set(["$$slots","$$events","$$legacy"]),ev=O('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"></span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),tv=O('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"></span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),nv=O("<!> <!>",1),iv=O('<tr class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex opacity-[0.5]"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>');function Gl(t,e){de(e,!0);let n=ue(e,Zg),i=I(()=>e.diffFile.getUnifiedLine(e.index)),r=I(En()),o=I(An()),a=I(to()),l=I(no()),d=I(io()),u=I(()=>s(i)?.isHidden),c=I(()=>Xi(s(i)?.diff)),f=()=>s(i)?.newLineNumber?e.diffFile.getNewSyntaxLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldSyntaxLine(s(i)?.oldLineNumber||0):void 0,p=ce(Le(f())),m=()=>s(i)?.newLineNumber?e.diffFile.getNewPlainLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldPlainLine(s(i)?.oldLineNumber||0):void 0,g=ce(Le(m())),x={current:()=>{}};ye(()=>{x?.current?.();let C=()=>{oe(p,f(),!0),oe(g,m(),!0)};C(),x.current=e.diffFile.subscribe(C)}),ze(()=>x.current());let w=(C,S)=>{s(o).side=S,s(o).lineNumber=C};var _=pe(),L=ne(_);{var y=C=>{var S=pe(),E=ne(S);{var h=A=>{let T=(q,F=ht)=>{var V=ev(),j=$(V),z=$(j);{var B=te=>{{let xe=I(()=>F().index-1);Ko(te,{get index(){return s(xe)},get lineNumber(){return F().lineNumber},get diffFile(){return F().diffFile},get side(){return R.old},get onWidgetClick(){return F().onAddWidgetClick},get onOpenAddWidget(){return F().onOpenAddWidget}})}};Y(z,te=>{F().enableAddWidget&&te(B)})}var he=K(z,2),ie=$(he),Z=$(ie,!0);N(ie),Zi(4),N(he),N(j);var ve=K(j),se=$(ve);ui(se,{get enableWrap(){return F().enableWrap},get diffFile(){return F().diffFile},get enableHighlight(){return F().enableHighlight},get rawLine(){return F().rawLine},get diffLine(){return F().diffLine},get plainLine(){return F().plainLine},get syntaxLine(){return F().syntaxLine}}),N(ve),N(V),X(()=>{G(V,"data-line",F().index),Q(j,`
          color: var(${ft});
          background-color: var(${kl});
          width: calc(calc(var(${De}) + 5px) * 2);
          max-width: calc(calc(var(${De}) + 5px) * 2);
          min-width: calc(calc(var(${De}) + 5px) * 2);
        `),G(ie,"data-line-old-num",F().lineNumber),$e(Z,F().lineNumber),Q(ve,`background-color: var(${Al}) `)}),D(q,V)},M=(q,F=ht)=>{var V=tv(),j=$(V),z=$(j);{var B=te=>{{let xe=I(()=>F().index-1);Ko(te,{get index(){return s(xe)},get lineNumber(){return F().lineNumber},get diffFile(){return F().diffFile},get side(){return R.new},get onWidgetClick(){return F().onAddWidgetClick},get onOpenAddWidget(){return F().onOpenAddWidget}})}};Y(z,te=>{F().enableAddWidget&&te(B)})}var he=K(z,2),ie=K($(he),4),Z=$(ie,!0);N(ie),N(he),N(j);var ve=K(j),se=$(ve);ui(se,{get enableWrap(){return F().enableWrap},get diffFile(){return F().diffFile},get enableHighlight(){return F().enableHighlight},get rawLine(){return F().rawLine},get diffLine(){return F().diffLine},get plainLine(){return F().plainLine},get syntaxLine(){return F().syntaxLine}}),N(ve),N(V),X(()=>{G(V,"data-line",F().index),Q(j,`
          color: var(${ft});
          background-color: var(${Ll});
          width: calc(calc(var(${De}) + 5px) * 2);
          max-width: calc(calc(var(${De}) + 5px) * 2);
          min-width: calc(calc(var(${De}) + 5px) * 2);
        `),G(ie,"data-line-new-num",F().lineNumber),$e(Z,F().lineNumber),Q(ve,` background-color: var(${El}) `)}),D(q,V)};var U=nv(),P=ne(U);{var J=q=>{T(q,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(l),enableAddWidget:s(d),lineNumber:s(i).oldLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:s(a)}))};Y(P,q=>{s(i).oldLineNumber&&q(J)})}var ee=K(P,2);{var re=q=>{M(q,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(l),enableAddWidget:s(d),lineNumber:s(i).newLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:s(a)}))};Y(ee,q=>{s(i).newLineNumber&&q(re)})}D(A,U)},b=A=>{var T=iv(),M=$(T),U=$(M);{var P=z=>{{let B=I(()=>s(i)?.newLineNumber||0);Ko(z,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return s(B)},get side(){return R.new},onOpenAddWidget:w,get onWidgetClick(){return s(a)}})}};Y(U,z=>{s(d)&&s(i)?.diff&&z(P)})}var J=K(U,2),ee=$(J),re=$(ee,!0);N(ee);var q=K(ee,4),F=$(q,!0);N(q),N(J),N(M);var V=K(M),j=$(V);{let z=I(()=>!!s(r)),B=I(()=>!!s(l)),he=I(()=>s(i)?.value||""),ie=I(()=>s(i)?.diff);ui(j,{get enableWrap(){return s(z)},get diffFile(){return e.diffFile},get enableHighlight(){return s(B)},get rawLine(){return s(he)},get diffLine(){return s(ie)},get plainLine(){return s(g)},get syntaxLine(){return s(p)}})}N(V),N(T),X(()=>{G(T,"data-line",e.lineNumber),G(T,"data-state",s(i)?.diff?"diff":"plain"),Q(M,`
					color: var(${s(i)?.diff?ft:pr});
					background-color: ${s(i)?.diff?`var(${Sl})`:`var(${Qs})`};
					width: calc(calc(var(${De}) + 5px) * 2);
					max-width: calc(calc(var(${De}) + 5px) * 2);
					min-width: calc(calc(var(${De}) + 5px) * 2;
				`),G(ee,"data-line-old-num",s(i)?.oldLineNumber||0),$e(re,s(i)?.oldLineNumber||0),G(q,"data-line-new-num",s(i)?.newLineNumber||0),$e(F,s(i)?.newLineNumber||0),Q(V,`
					background-color: ${s(i)?.diff?`var(${Il})`:`var(${Qs})`}
				`)}),D(A,T)};Y(E,A=>{s(c)?A(h):A(b,-1)})}D(C,S)};Y(L,C=>{s(u)||C(y)})}D(t,_),fe()}var rv=new Set(["$$slots","$$events","$$legacy"]),ov=O('<tr data-state="extend" class="diff-line diff-line-extend"><td class="diff-line-extend-content p-0 align-top"><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function zl(t,e){de(e,!0);let n=ue(e,rv),i=I(Zr()),r=I(En()),o=I(eo()),a=I(()=>e.diffFile.getUnifiedLine(e.index)),l=I(()=>s(i)?.oldFile?.[s(a)?.oldLineNumber||-1]),d=I(()=>s(i)?.newFile?.[s(a)?.newLineNumber||-1]),u=I(()=>s(a).isHidden),c=I(()=>!!((s(l)||s(d))&&s(u)&&s(o))),f=I(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>s(c)}));var p=pe(),m=ne(p);{var g=x=>{var w=ov(),_=$(w);G(_,"colspan",2);var L=$(_),y=$(L);{var C=h=>{var b=pe(),A=ne(b);Mt(A,()=>s(o),()=>({diffFile:e.diffFile,side:R.old,data:s(l)?.data,lineNumber:s(a)?.oldLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),D(h,b)};Y(y,h=>{(s(r)||s(f)>0)&&s(l)&&s(o)&&h(C)})}var S=K(y,2);{var E=h=>{var b=pe(),A=ne(b);Mt(A,()=>s(o),()=>({diffFile:e.diffFile,side:R.new,data:s(d)?.data,lineNumber:s(a)?.newLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),D(h,b)};Y(S,h=>{(s(r)||s(f)>0)&&s(d)&&s(o)&&h(E)})}N(L),N(_),N(w),X(()=>{G(w,"data-line",`${e.lineNumber}-extend`),Q(L,`width: ${s(f)}px `)}),D(x,w)};Y(m,x=>{s(c)&&x(g)})}D(t,p),fe()}var sv=new Set(["$$slots","$$events","$$legacy"]),av=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),lv=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),dv=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),fv=O('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),cv=O('<div class="min-h-[28px]">&ensp;</div>'),uv=O('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[100px] select-none"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Xs(t,e){de(e,!0);let n=ue(e,sv),i=I(()=>e.diffFile.getUnifiedHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>s(r)&&s(i)&&s(i).unifiedInfo),a=I(En()),l=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.startHiddenIndex<s(i).unifiedInfo.endHiddenIndex,d=ce(Le(l())),u=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.endHiddenIndex-s(i).unifiedInfo.startHiddenIndex<je,c=ce(Le(u())),f=I(()=>s(i)&&s(i).isFirst),p=I(()=>s(i)&&s(i).isLast),m=I(()=>s(i)&&e.diffFile._getIsPureDiffRender()&&!s(i).unifiedInfo),g={current:()=>{}};ye(()=>{g?.current?.();let L=()=>{oe(d,l(),!0),oe(c,u(),!0)};L(),g.current=e.diffFile.subscribe(L)}),ze(()=>g.current());var x=pe(),w=ne(x);{var _=L=>{var y=uv(),C=$(y),S=$(C);{var E=M=>{var U=pe(),P=ne(U);{var J=F=>{var V=av(),j=$(V);Ct(j,{className:"fill-current"}),N(V),we("click",V,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),D(F,V)},ee=F=>{var V=lv(),j=$(V);Nt(j,{className:"fill-current"}),N(V),we("click",V,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),D(F,V)},re=F=>{var V=dv(),j=$(V);kn(j,{className:"fill-current"}),N(V),we("click",V,()=>e.diffFile.onUnifiedHunkExpand("all",e.index)),D(F,V)},q=F=>{var V=fv(),j=ne(V),z=$(j);Nt(z,{className:"fill-current"}),N(j);var B=K(j,2),he=$(B);Ct(he,{className:"fill-current"}),N(B),we("click",j,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),we("click",B,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),D(F,V)};Y(P,F=>{s(f)?F(J):s(p)?F(ee,1):s(c)?F(re,2):F(q,-1)})}D(M,U)},h=M=>{var U=cv();D(M,U)};Y(S,M=>{s(o)?M(E):M(h,-1)})}N(C);var b=K(C),A=$(b),T=$(A,!0);N(A),N(b),N(y),X(()=>{G(y,"data-line",`${e.lineNumber}-hunk`),Q(C,`
				background-color: var(${Un});
				color: var(${ft});
				width: calc(calc(var(${De}) + 5px) * 2);
				max-width: calc(calc(var(${De}) + 5px) * 2);
				min-width: calc(calc(var(${De}) + 5px) * 2);
			`),Q(b,` background-color: var(${dn}) `),Q(A,`
					white-space: ${s(a)?"pre-wrap":"pre"};
					word-break: ${s(a)?"break-all":"initial"};
					color: var(${jn});
				`),$e(T,s(i)?.unifiedInfo?.plainText||s(i)?.text)}),D(L,y)};Y(w,L=>{(s(d)||s(m))&&L(_)})}D(t,x),fe()}rt(["click"]);var pv=new Set(["$$slots","$$events","$$legacy"]),hv=O('<tr data-state="widget" class="diff-line diff-line-widget"><td class="diff-line-widget-content p-0"><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Wl(t,e){de(e,!0);let n=ue(e,pv),i=I(An()),r=I(En()),o=I(Xr()),a=I(()=>e.diffFile.getUnifiedLine(e.index)),l=I(()=>s(a)?.oldLineNumber&&s(i)?.side===R.old&&s(i)?.lineNumber===s(a)?.oldLineNumber),d=I(()=>s(a)?.newLineNumber&&s(i)?.side===R.new&&s(i)?.lineNumber===s(a)?.newLineNumber),u=I(()=>s(a)?.isHidden),c=I(()=>!!((s(l)||s(d))&&!s(u)&&s(o))),f=()=>{s(i).side=void 0,s(i).lineNumber=void 0},p=I(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>s(c)}));var m=pe(),g=ne(m);{var x=w=>{var _=hv(),L=$(_);G(L,"colspan",2);var y=$(L),C=$(y);{var S=b=>{var A=pe(),T=ne(A);Mt(T,()=>s(o),()=>({diffFile:e.diffFile,side:R.old,lineNumber:s(a)?.oldLineNumber||0,onClose:f})),D(b,A)};Y(C,b=>{(s(r)||s(p)>0)&&s(l)&&b(S)})}var E=K(C,2);{var h=b=>{var A=pe(),T=ne(A);Mt(T,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:R.new,lineNumber:s(a)?.newLineNumber||0,onClose:f})),D(b,A)};Y(E,b=>{(s(r)||s(p)>0)&&s(d)&&b(h)})}N(y),N(L),N(_),X(()=>{G(_,"data-line",`${e.lineNumber}-widget`),Q(y,`width: ${s(p)}px`)}),D(w,_)};Y(g,w=>{s(c)&&w(x)})}D(t,m),fe()}var mv=new Set(["$$slots","$$events","$$legacy"]),gv=O("<!> <!> <!> <!>",1),vv=O('<div><style data-select-style=""></style> <div class="unified-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><table><colgroup><col class="unified-diff-table-num-col"/><col class="unified-diff-table-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">line number</th><th scope="col">line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Ql(t,e){de(e,!0);let n=ue(e,mv),i=ce(Le(La(e.diffFile))),r=ce(Le(e.diffFile.unifiedLineLength.toString())),o=ce(null),a=I(Kr()),l=I(En()),d={current:()=>{}},u={current:void 0},c=()=>{let E=e.diffFile;oe(i,La(E),!0),oe(r,E.unifiedLineLength.toString(),!0)};ye(()=>{d.current?.(),c(),d.current=e.diffFile.subscribe(c)}),ze(()=>d.current());let f=E=>{let h=E.target;if(!s(o))return;if(h&&h?.nodeName==="BUTTON"){Ln();return}let b=oo(h);if(!(b&&b!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let A=h.getAttribute("data-state");if(A){A==="extend"||A==="hunk"||A==="widget"?u.current!==!1&&(u.current=!1,s(o).innerHTML="",Ln()):u.current!==!0&&(u.current=!0,s(o).innerHTML=`#${b} [data-state="extend"] {user-select: none} 
#${b} [data-state="hunk"] {user-select: none} 
#${b} [data-state="widget"] {user-select: none}`,Ln());return}h=h.parentElement}},p=I(()=>({fontSize:s(a)+"px",fontFamily:"Menlo, Consolas, monospace"})),m=I(ro({text:()=>s(r),font:()=>s(p)})),g=I(()=>Math.max(40,s(m)+10));var x=vv(),w=$(x);lt(w,()=>E=>oe(o,E,!0));var _=K(w,2),L=$(_),y=K($(L),2),C=$(y);fi(C,17,()=>s(i),di,(E,h)=>{var b=gv(),A=ne(b);Xs(A,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var T=K(A,2);Gl(T,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=K(T,2);Wl(M,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var U=K(M,2);zl(U,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),D(E,b)});var S=K(C);Xs(S,{get index(){return e.diffFile.unifiedLineLength},get lineNumber(){return e.diffFile.unifiedLineLength},get diffFile(){return e.diffFile}}),N(y),N(L),N(_),N(x),X(E=>{Se(x,1,`unified-diff-view ${s(l)?"unified-diff-view-wrap":"unified-diff-view-normal"} w-full`),Q(_,E),Se(L,1,`unified-diff-table w-full border-collapse border-spacing-0 ${s(l)?"table-fixed":""}`)},[()=>`${De}: ${Math.round(s(g))}px; font-family: Menlo, Consolas, monospace; font-size: var(${nt})`]),we("mousedown",y,f),D(t,x),fe()}rt(["mousedown"]);var _v=new Set(["$$slots","$$events","$$legacy"]),bv=O('<div class="diff-tailwindcss-wrapper" data-component="git-diff-view"><div class="diff-style-root"><div><!></div></div></div>');function Zs(t,e){de(e,!0);let n=ue(e,_v),i={current:null},o=I(()=>{if(i.current?.clear?.(),e.diffFile){let E=Ki.createInstance({});return E._mergeFullBundle(e.diffFile._getFullBundle()),i.current=E,E}else if(e.data){let E=e.data,h=new Ki(E.oldFile?.fileName||"",E.oldFile?.content||"",E.newFile?.fileName||"",E.newFile?.content||"",E.hunks||[],E.oldFile?.fileLang||"",E.newFile?.fileLang||"");return i.current=h,h}return null});ye(()=>{e.onDiffFileCreated?.(s(o))});let l=I(()=>s(o)?.getId?.()),d=Le({side:e.initialWidgetState?.side,lineNumber:e.initialWidgetState?.lineNumber}),u=ce(null),c=I(()=>e.diffViewHighlight??!0),f=I(()=>e.diffViewTheme);ye(()=>{d.side=e.initialWidgetState?.side,d.lineNumber=e.initialWidgetState?.lineNumber}),ye(()=>{(e.data||e.diffFile)&&(d.side=void 0,d.lineNumber=void 0)});let p={current:()=>{}},m=I(ci());ye(()=>{p?.current?.(),!(!s(m)||!s(o)||!e.diffFile)&&(e.diffFile._addClonedInstance(s(o)),p.current=()=>e.diffFile?._delClonedInstance(s(o)))}),ze(()=>p.current()),ye(()=>{!s(o)||!s(m)||(s(o).initTheme(s(f)),s(o).initRaw(),s(o).buildSplitDiffLines(),s(o).buildUnifiedDiffLines())}),ye(()=>{if(!(!s(o)||!s(m))&&(s(f),s(c))){let E=e.registerHighlighter;E?(E.name!==s(o)._getHighlighterName()||E.type!==s(o)._getHighlighterType()||E.type!=="class")&&(s(o).initSyntax({registerHighlighter:E}),s(o).notifyAll()):(!s(o)._getIsCloned()&&s(o)._getHighlighterName()!==vr.name||s(o)._getHighlighterType()!=="class")&&(s(o).initSyntax(),s(o).notifyAll())}});let _={current:()=>{}};ye(()=>{if(_?.current?.(),!s(m)||!s(o)||!s(u))return;s(f);let E=()=>{s(u)?.setAttribute("data-theme",s(o)._getTheme()||"light"),s(u)?.setAttribute("data-highlighter",s(o)._getHighlighterName())};E(),_.current=s(o).subscribe(E)}),ze(()=>_.current()),zc(n),Qc(n),Yc(n),ru(n),su(n),lu(n),fu(n),uu(n),nu(d),eu(n),qc(()=>s(o)?.getId()||""),Xc(()=>s(u));var y=pe(),C=ne(y);{var S=E=>{var h=bv(),b=$(h),A=$(b),T=$(A);{var M=P=>{Ul(P,{get diffFile(){return s(o)}})},U=P=>{Ql(P,{get diffFile(){return s(o)}})};Y(T,P=>{!e.diffViewMode||e.diffViewMode&Pt.Split?P(M):P(U,-1)})}N(A),N(b),N(h),lt(h,()=>P=>oe(u,P,!0)),X((P,J)=>{G(h,"data-theme",P),G(h,"data-highlighter",J),Q(b,`${nt}:${e.diffViewFontSize||14}px`),G(A,"id",s(m)?`diff-root${s(l)}`:void 0),Se(A,1,"diff-view-wrapper"+(e.class?` ${e.class}`:"")),Q(A,e.style)},[()=>s(o)?._getTheme()||"light",()=>s(o)?._getHighlighterName()]),D(E,h)};Y(C,E=>{s(o)&&E(S)})}D(t,y),fe()}as.name="@git-diff-view/svelte";function Eu(t){let e=/[.*+?^${}()|[\]\\]/g;return t.replace(e,"\\$&")}function Au(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function Lu(t){if(!t)return!1;let e=Date.now()-1440*60*1e3;return t*1e3>e}function hr(){let t=k;t.currentSubjectData=null,t.currentItemId=null,t.currentWcode=null,t.currentTags=null,t.currentSeries=null,t.currentCommitMessage=null,t.currentFieldUpdates=null,t.currentTagUpdates=null,t.currentSeriesUpdate=null}var ku={Album:["\u4E2D\u6587\u540D","\u522B\u540D","\u827A\u672F\u5BB6","\u4F5C\u66F2","\u7F16\u66F2","\u4F5C\u8BCD","\u5382\u724C","\u53D1\u552E\u65E5\u671F","\u4EF7\u683C","\u7248\u672C\u7279\u6027","\u64AD\u653E\u65F6\u957F","\u5F55\u97F3","\u789F\u7247\u6570\u91CF","\u94FE\u63A5"],Anime:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u5E74\u5EA6","\u7247\u957F","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","\u5176\u4ED6","Copyright"],Book:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u63D2\u56FE","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u9875\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],BookSeries:["\u4E2D\u6587\u540D","\u522B\u540D","\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u5F00\u59CB","\u7ED3\u675F","\u518C\u6570","\u8BDD\u6570","\u539F\u4F5C","\u94FE\u63A5","\u5176\u4ED6"],Crt:["\u7B80\u4F53\u4E2D\u6587\u540D","\u522B\u540D","\u6027\u522B","\u751F\u65E5","\u8840\u578B","\u8EAB\u9AD8","\u4F53\u91CD","BWH","\u5F15\u7528\u6765\u6E90"],Game:["\u4E2D\u6587\u540D","\u522B\u540D","\u5E73\u53F0","\u6E38\u620F\u7C7B\u578B","\u6E38\u620F\u5F15\u64CE","\u6E38\u73A9\u4EBA\u6570","\u53D1\u884C\u65E5\u671F","\u552E\u4EF7","\u5F00\u53D1","\u53D1\u884C","\u5267\u672C","\u7A0B\u5E8F","website","\u94FE\u63A5"],Manga:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u4F5C\u753B","\u811A\u672C","\u539F\u4F5C","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u518C\u6570","\u9875\u6570","\u8BDD\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],Movie:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u5E74\u5EA6","\u7247\u957F","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","\u5176\u4ED6","Copyright"],Novel:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u63D2\u56FE","\u51FA\u7248\u793E","\u4EF7\u683C","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u518C\u6570","\u9875\u6570","\u8BDD\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],OVA:["\u4E2D\u6587\u540D","\u522B\u540D","\u8BDD\u6570","\u53D1\u552E\u65E5","\u5B98\u65B9\u7F51\u7AD9","\u5F00\u59CB","\u7ED3\u675F","\u94FE\u63A5","\u5176\u4ED6"],PhotoBook:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u6444\u5F71","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u9875\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],TV:["\u4E2D\u6587\u540D","\u522B\u540D","\u96C6\u6570","\u5B63\u6570","\u653E\u9001\u661F\u671F","\u5F00\u59CB","\u7ED3\u675F","\u4E3B\u6F14","\u5BFC\u6F14","\u97F3\u4E50","\u539F\u4F5C","\u5236\u4F5C","\u7C7B\u578B","\u56FD\u5BB6/\u5730\u533A","\u8BED\u8A00","\u6BCF\u96C6\u957F","\u5728\u7EBF\u64AD\u653E\u5E73\u53F0","\u7535\u89C6\u7F51","\u7535\u89C6\u53F0","\u9891\u9053","\u89C6\u9891\u5236\u5F0F","\u97F3\u9891\u5236\u5F0F","\u9996\u64AD\u56FD\u5BB6","\u9996\u64AD\u5730\u533A","\u53F0\u6E7E\u540D\u79F0","\u6E2F\u6FB3\u540D\u79F0","\u9A6C\u65B0\u540D\u79F0","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","imdb_id","tvdb_id"],TVAnime:["\u4E2D\u6587\u540D","\u522B\u540D","\u8BDD\u6570","\u653E\u9001\u5F00\u59CB","\u653E\u9001\u661F\u671F","\u5B98\u65B9\u7F51\u7AD9","\u5728\u7EBF\u64AD\u653E\u5E73\u53F0","\u64AD\u653E\u7535\u89C6\u53F0","\u5176\u4ED6\u7535\u89C6\u53F0","\u64AD\u653E\u7ED3\u675F","\u5BFC\u6F14","\u97F3\u4E50","\u94FE\u63A5","\u5176\u4ED6","Copyright"],doujinBook:["\u4F5C\u8005","\u539F\u4F5C","CP","\u8BED\u8A00","\u9875\u6570","\u5C3A\u5BF8","\u4EF7\u683C","\u53D1\u552E\u65E5"],doujinGame:["\u522B\u540D","\u5F00\u53D1\u8005","\u539F\u4F5C","\u5E73\u53F0","\u6E38\u620F\u7C7B\u578B","\u6E38\u620F\u5F15\u64CE","\u6E38\u73A9\u4EBA\u6570","\u8BED\u8A00","\u4EF7\u683C","\u53D1\u552E\u65E5"],doujinMusic:["\u827A\u672F\u5BB6","\u539F\u4F5C","\u8BED\u8A00","\u7248\u672C\u7279\u6027","\u789F\u7247\u6570\u91CF","\u64AD\u653E\u65F6\u957F","\u4EF7\u683C","\u53D1\u552E\u65E5"],realMovie:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u65E5","\u7247\u957F","\u7C7B\u578B","\u56FD\u5BB6/\u5730\u533A","\u8BED\u8A00","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","imdb_id","tmdb_id","tvdb_id"]},Iu={Album:"Album","animanga/Anime":"Anime","animanga/Book":"Book","animanga/BookSeries":"BookSeries",Crt:"Crt",Game:"Game","animanga/Manga":"Manga","animanga/Movie":"Movie","animanga/Novel":"Novel","animanga/OVA":"OVA","Book/PhotoBook":"PhotoBook","real/Television":"TV","animanga/TVAnime":"TVAnime","doujin/Book":"doujinBook","doujin/Game":"doujinGame","doujin/Album":"doujinMusic","real/Movie":"realMovie"};function wv(){return k.theme==="dark"?"dark":k.theme==="light"?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function xv(){return k.entityType||"subject"}function Vl(){if(!k.currentSubjectData)return!1;let t=xv(),n=document.getElementById("static-wcode-input").value.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=(k.currentSubjectData.infobox||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),o=n!==r;if(t==="subject"){let l=document.getElementById("static-tags-input").value.split(" ").filter(m=>m),d=document.getElementById("static-series-checkbox").checked,u=k.currentSubjectData.metaTags||[],c=k.currentSubjectData.series||!1,f=!Au(l,u);return o||f||d!==c}return o}function Pi(){let t=document.querySelector("#static-buttons-container button#process-confirm-update");if(!t)return;Vl()?(t.textContent="\u786E\u8BA4\u66F4\u65B0",t.disabled=!1):(t.textContent="\u786E\u8BA4\u66F4\u65B0\uFF08\u65E0\u5B9E\u8D28\u4FEE\u6539\uFF09",t.disabled=!1)}function so(t,e,n,i){let r=Object.keys(t||{}),o=[];return r.length&&o.push(`\u66F4\u65B0${r.join("\u3001")}`),(i==="subject"||!i)&&(e?.add.length&&o.push(`\u6DFB\u52A0\u6807\u7B7E${e.add.join("\u3001")}`),e?.remove.length&&o.push(`\u5220\u9664\u6807\u7B7E${e.remove.join("\u3001")}`),n?.hasUpdate&&o.push(n.newValue?"\u6807\u8BB0\u4E3A\u7CFB\u5217":"\u53D6\u6D88\u7CFB\u5217\u6807\u8BB0")),o.filter(a=>a).join("\uFF1B")||"\u66F4\u65B0\u6761\u76EE\u4FE1\u606F"}function Xo(t,e,n){try{let i=(t||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),r=(e||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),l=sf("\u7F16\u8F91\u524D",i,"\u7F16\u8F91\u540E",r,"text","text",{context:1});l.init(),l.buildSplitDiffLines();let d=document.getElementById(n);if(!d)return;let u=d._diffViewInstance;u&&zo(u),d.innerHTML="";let c=qr(Zs,{target:d,props:{diffFile:l,diffViewMode:k.diffViewMode==="unified"?Pt.Unified:Pt.Split,diffViewFontSize:13,diffViewTheme:wv(),diffViewHighlight:!0,diffViewWrap:!0}});d._diffViewInstance=c,n==="static-content-diff-container"&&setTimeout(()=>{let p=document.getElementById("static-wcode-input");p&&(p.style.height="")},0);let f=document.getElementById("diff-error");f&&(f.style.display="none")}catch(i){console.error("Diff generation error:",i);let r=document.getElementById("diff-error");r&&(r.textContent=`\u5DEE\u5F02\u663E\u793A\u9519\u8BEF: ${i.message}`,r.style.display="block")}}function ea(t,e,n){let i=t.join(`
`),r=e.join(`
`);Xo(i,r,n)}function Su(t,e){let n={};return Object.keys(t).forEach(i=>{if(!["id","tags","series","type"].includes(i.toLowerCase())){let r=t[i];r!==void 0&&(n[i]=r)}}),n}function Cu(t,e){if(k.entityType!=="subject")return{add:[],remove:[]};let i=(t.tags||"").split(" ").filter(a=>a),r=[],o=[];return i.forEach(a=>{a.startsWith("-")?o.push(a.slice(1)):r.push(a)}),{add:r,remove:o}}function Nu(t,e){if(k.entityType!=="subject")return{hasUpdate:!1};if(t.series===void 0||t.series===null||t.series==="")return{hasUpdate:!1};let n=t.series.trim().toLowerCase(),i=n==="true"||n==="1"||n==="yes";return{hasUpdate:i!==e,newValue:i}}function yv(t){let e=t.match(/{{Infobox\s+(.+?)$/m);return e&&Iu[e[1]]||null}function Ev(t,e,n){for(let i=1;i<t.length;i++){let r=t[i].match(/^\|([^|=]+?)\s*=/);if(r&&e.indexOf(r[1])>n)return i}return t.length-1}function $u(t,e){let n=yv(t),i=n?ku[n]:null,r=t,o=[];if(Object.entries(e).forEach(([a,l])=>{l=l.replaceAll("\\n",`
`);let d=new RegExp(`\\|${Eu(a)}\\s*=.*`,"i");d.test(r)?r=r.replace(d,`|${a}= ${l}`):o.push({field:a,value:l,fieldIdx:i?i.indexOf(a):-1})}),o.length>0){i&&o.sort((l,d)=>l.fieldIdx===-1&&d.fieldIdx===-1?0:l.fieldIdx===-1?1:d.fieldIdx===-1?-1:l.fieldIdx-d.fieldIdx);let a=r.split(`
`);for(let l=o.length-1;l>=0;l--){let d=o[l];i&&d.fieldIdx>=0?a.splice(Ev(a,i,d.fieldIdx),0,`|${d.field}= ${d.value}`):a.splice(-1,0,`|${d.field}= ${d.value}`)}r=a.join(`
`)}return r}function Du(t,e){let n=new Set(t);return e.add.forEach(i=>n.add(i)),e.remove.forEach(i=>n.delete(i)),[...n]}var Fu=sd(Tu());function Mu(t,e){try{k.csvData=Av(t),k.currentIndex=0,k.retryCount={},k.previousItem=null,localStorage.setItem("bgmCsvData",JSON.stringify(k.csvData)),localStorage.setItem("bgmCurrentIndex","0"),Gn(),en(e+"\u52A0\u8F7D\u6210\u529F")}catch(n){en("CSV\u89E3\u6790\u9519\u8BEF: "+n.message),console.error(n)}finally{vn(),document.querySelectorAll("#static-buttons-container button").forEach(n=>{n.disabled=!1})}}function Hu(t){let n=t.target.files?.[0];if(!n)return;document.querySelectorAll("#static-buttons-container button").forEach(r=>{r.disabled=!0}),Gi("\u6B63\u5728\u89E3\u6790CSV\u6587\u4EF6...");let i=new FileReader;i.onload=function(r){let o=r.target.result;Mu(o,"CSV\u6587\u4EF6")},i.readAsText(n)}function Bu(t){document.querySelectorAll("#static-buttons-container button").forEach(e=>{e.disabled=!0}),Gi("\u6B63\u5728\u89E3\u6790\u7C98\u8D34\u7684CSV..."),Mu(t,"\u7C98\u8D34\u7684CSV")}function Av(t){let e=Fu.default.parse(t,{header:!0,skipEmptyLines:!0,transform:a=>a.trim()});if(e.errors.length){let a=e.errors[0];throw new Error(`\u7B2C${a.row!==void 0?a.row+1:"?"}\u884C: ${a.message}`)}let n=e.meta.fields;if(!n||n.length===0)throw new Error("CSV\u6587\u4EF6\u4E3A\u7A7A\u6216\u683C\u5F0F\u9519\u8BEF");let i=n.find(a=>/^(person_id|character_id|id)$/i.test(a));if(!i)throw new Error('CSV\u5FC5\u987B\u5305\u542B"id"\u3001"person_id"\u6216"character_id"\u5217');k.entityType="subject",/^person_id$/i.test(i)?k.entityType="person":/^character_id$/i.test(i)&&(k.entityType="character");let r=n.filter(a=>a!==i),o=[];for(let a of e.data){let l=a[i]?.trim();if(!l)continue;let d={id:l};for(let u of r){let c=a[u];c!==void 0&&(d[u]=c.trim())}o.push(d)}if(o.length===0)throw new Error("\u672A\u627E\u5230\u6709\u6548\u7684\u6570\u636E\u884C");return o}function Gn(){k.currentView="setup";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container");document.getElementById("edit-regions").style.display="none",ad(),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">\u57FA\u672C\u8BBE\u7F6E</h3>
                <div class="setup-columns">
                    <div class="setup-column">
                        <div class="form-group">
                            <label>\u63D0\u4EA4\u65B9\u5F0F\u9009\u62E9</label>
                            <div class="method-option-group">
                                <input type="radio" id="method-patch" name="submit-method" value="patch" ${k.submitMethod==="patch"?"checked":""}>
                                <label for="method-patch">Private API</label>
                                <input type="radio" id="method-post" name="submit-method" value="post" ${k.submitMethod==="post"?"checked":""}>
                                <label for="method-post">\u65E7 API</label>
                            </div>
                        </div>

                        <div id="patch-method-options" class="form-group ${k.submitMethod==="patch"?"":"hidden"}">
                            <label for="setup-access-token">Access Token</label>
                            <input type="password" id="setup-access-token" value="${k.accessToken}">
                            <p class="formhash-hint">
                                \u5728<a href="https://next.bgm.tv/demo/access-token" target="_blank">\u4E2A\u4EBA\u4EE4\u724C\u9875</a>\u83B7\u53D6 Access Token<br>
                                \u9650\u901F\u4E25\u91CD\u53EF\u5207\u6362\u4E3A\u65E7 API
                            </p>
                        </div>

                        <div id="post-method-options" class="form-group ${k.submitMethod==="post"?"":"hidden"}">
                            <label for="setup-formhash">Formhash</label>
                            <div style="display:flex;gap:8px">
                                <input type="text" id="setup-formhash" value="${k.formhash}" style="flex:1">
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
                                <input type="radio" id="diff-mode-split" name="diff-view-mode" value="split" ${k.diffViewMode==="split"?"checked":""}>
                                <label for="diff-mode-split">\u5DE6\u53F3\u5BF9\u7167</label>
                                <input type="radio" id="diff-mode-unified" name="diff-view-mode" value="unified" ${k.diffViewMode==="unified"?"checked":""}>
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
                            ${k.csvData?`<div class="csv-loaded-info">\u5DF2\u52A0\u8F7DCSV: ${k.csvData.length} \u6761\u8BB0\u5F55</div>`:""}
                            <p class="csv-hint">
                                \u5FC5\u5907ID\u5217\uFF0C\u6761\u76EEid\uFF0C\u4EBA\u7269person_id\uFF0C\u89D2\u8272character_id<br>
                                tags\u5217\u4F7F\u7528\u7A7A\u683C\u5206\u9694\u6807\u7B7E\uFF0C\u524D\u7F00\u5E26"-"\u7684\u6807\u7B7E\u8868\u793A\u5220\u9664\u8BE5\u6807\u7B7E<br>
                                series\u5217\u4F7F\u7528true\u6216false\u8868\u793A\u662F\u5426\u6807\u8BB0\u4E3A\u7CFB\u5217<br>
                                \u53EF\u4F7F\u7528 <a href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/bgq" target="_blank">Bangumi Query</a> \u8F85\u52A9\u751F\u6210\uFF08<a href="https://bgq.iccci.cc.cd" target="_blank">demo</a>\uFF09
                            </p>
                        </div>
                        ${k.csvData?`
                        <div class="form-group">
                            <label>\u5904\u7406\u8FDB\u5EA6</label>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${k.currentIndex/k.csvData.length*100}%"></div>
                            </div>
                            <div class="progress-info">\u4E0A\u6B21\u8FDB\u5EA6: ${k.currentIndex}/${k.csvData.length}</div>
                            <button id="setup-reset-progress" class="secondary" style="margin-top: 10px;">\u91CD\u7F6E\u8FDB\u5EA6</button>
                        </div>
                        `:""}
                    </div>
                </div>
                <div class="sync-section" style="margin-top:20px;border-top:1px solid var(--border-color);padding-top:16px">
                    <h3 class="section-title">\u8DE8\u8BBE\u5907\u540C\u6B65</h3>
                    <div id="sync-status" style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">\u672A\u540C\u6B65</div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap">
                        <button type="button" class="secondary" id="sync-auth-btn">
                            <i class="fab fa-github"></i> \u6388\u6743 GitHub
                        </button>
                        <button type="button" class="secondary" id="sync-upload-btn">
                            <i class="fas fa-upload"></i> \u4E0A\u4F20\u8FDB\u5EA6
                        </button>
                        <button type="button" class="secondary" id="sync-download-btn">
                            <i class="fas fa-download"></i> \u4E0B\u8F7D\u8FDB\u5EA6
                        </button>
                        <button type="button" class="secondary" id="sync-clear-btn">
                            <i class="fas fa-trash-alt"></i> \u6E05\u9664\u6388\u6743
                        </button>
                    </div>

                </div>
                <div style="margin-top:20px;border-top:1px solid var(--border-color);padding-top:14px;text-align:center">
                    <a href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/wikiBatch" target="_blank" style="color:var(--text-secondary);font-size:13px;text-decoration:none">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="setup-start-processing" class="primary">\u5F00\u59CB\u5904\u7406</button>
        `);let n=document.getElementById("setup-access-token");n&&n.addEventListener("input",f=>{k.accessToken=f.target.value,GM_setValue("bgmAccessToken",k.accessToken)});let i=document.getElementById("setup-formhash");i&&i.addEventListener("input",f=>{k.formhash=f.target.value,GM_setValue("bgmFormhash",k.formhash)});let r=document.getElementById("setup-fetch-formhash");r&&r.addEventListener("click",()=>{i&&(r.disabled=!0,r.innerHTML='<i class="fas fa-spinner fa-pulse"></i> \u83B7\u53D6\u4E2D...',GM.xmlHttpRequest({method:"GET",url:"https://bgm.tv/subject/1/edit_detail",onload:f=>{try{let p=f.responseText.match(/<input[^>]*name="formhash"[^>]*value="([^"]+)"/);p&&p[1]?(k.formhash=p[1],GM_setValue("bgmFormhash",k.formhash),i.value=p[1]):alert("\u65E0\u6CD5\u4ECE\u9875\u9762\u63D0\u53D6 formhash\uFF0C\u8BF7\u786E\u4FDD\u5DF2\u767B\u5F55 Bangumi")}catch{alert("\u89E3\u6790\u7F16\u8F91\u9875\u9762\u5931\u8D25")}finally{r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> \u81EA\u52A8\u83B7\u53D6'}},onerror:()=>{alert("\u7F51\u7EDC\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u83B7\u53D6 formhash"),r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> \u81EA\u52A8\u83B7\u53D6'}}))}),document.querySelectorAll('input[name="submit-method"]').forEach(f=>{f.addEventListener("change",p=>{k.submitMethod=p.target.value,GM_setValue("bgmSubmitMethod",k.submitMethod);let m=document.getElementById("patch-method-options"),g=document.getElementById("post-method-options");m&&m.classList.toggle("hidden",k.submitMethod!=="patch"),g&&g.classList.toggle("hidden",k.submitMethod!=="post")})}),document.querySelectorAll('input[name="diff-view-mode"]').forEach(f=>{f.addEventListener("change",p=>{k.diffViewMode=p.target.value,localStorage.setItem("bgmDiffViewMode",k.diffViewMode)})});let l=document.getElementById("setup-csv-file");l&&(l.addEventListener("change",Hu),l.addEventListener("change",()=>{let f=l.files?.[0]?.name||"",p=document.getElementById("setup-csv-file-name");p&&(p.textContent=f)}));let d=document.getElementById("setup-csv-btn");d&&l&&d.addEventListener("click",f=>{f.preventDefault(),l.click()});let u=document.getElementById("setup-paste-csv-btn");u&&u.addEventListener("click",async()=>{try{let f=await navigator.clipboard.readText();if(!f||!f.trim()){en("\u526A\u8D34\u677F\u5185\u5BB9\u4E0D\u662F\u6709\u6548\u7684CSV");return}let p=document.getElementById("setup-csv-file-name");p&&(p.textContent="\u5DF2\u4ECE\u526A\u8D34\u677F\u7C98\u8D34"),Bu(f)}catch(f){en("\u8BFB\u53D6\u526A\u8D34\u677F\u5931\u8D25: "+f.message)}});let c=document.getElementById("sync-status");if(c)if(GM_getValue("bgmGistToken","")){let p=GM_getValue("bgmGistId","");c.textContent=p?"\u5DF2\u540C\u6B65 (Gist: "+p.slice(0,8)+"\u2026)":"\u5DF2\u6388\u6743 GitHub"}else c.textContent="\u672A\u540C\u6B65"}function Ru(t){k.currentView="processing";let{currentItem:e,wikiData:n,historyData:i}=t;k.currentSubjectData=n,k.currentItemId=e.id;let r=k.entityType||"subject";k.currentWcode=null,k.currentTags=null,k.currentSeries=null,k.currentCommitMessage=null;let o=document.getElementById("core-content"),a=document.getElementById("static-buttons-container"),l=document.getElementById("edit-regions");l&&(l.style.display="block"),co(),Ui(k.currentIndex,k.totalItems);let d=n.name||"\u672A\u77E5\u540D\u79F0",u=n.infobox||"",c=r==="subject"?n.metaTags||[]:[],f=r==="subject"&&n.series||!1,p=Su(e,u),m=Cu(e,c),g=Nu(e,f);k.currentFieldUpdates=p,k.currentTagUpdates=m,k.currentSeriesUpdate=g;let x={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"},w=document.getElementById("static-last-update"),_=i[0]?.createdAt,L=_?new Date(_*1e3):null,y=i[0]?.creator?.username||"",C=i[0]?.commitMessage||"",S=Lu(_);if(L&&w){let{editPagePath:F}=ji(r,e.id);w.innerHTML=`
            <a href="${F}" target="_blank">
                \u6700\u540E\u66F4\u65B0: ${L.toLocaleString()} ${y} ${C}
            </a>
        `,w.style.color=S?"#d9534f":"",w.style.display="block"}else w&&(w.style.display="none");let E=document.getElementById("prev-item-link");if(E&&k.previousItem&&k.currentIndex>0){let F=k.previousItem.type,{editPagePath:V}=ji(F,k.previousItem.id);E.innerHTML=`
            <i class="fas fa-arrow-left"></i> \u4E0A\u4E00\u4E2A:
            <a href="${V}" target="_blank">
                ${k.previousItem.name}\uFF08${k.previousItem.id}\uFF09
            </a>
        `,E.style.display="block"}else E&&(E.style.display="none");let h=document.getElementById("static-commit-input"),b=document.getElementById("static-lock-commit"),A=so(p,m,g,r);h.value=k.isCommitMessageLocked?k.lockedCommitMessage:A,b.innerHTML=`<i class="fas ${k.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>`,b.title=k.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981";let T=document.getElementById("static-wcode-input"),M=document.getElementById("static-content-diff-container"),U=$u(u,p);T.value=U,Xo(u,U,"static-content-diff-container"),M&&(M.style.display="block");let P=document.getElementById("static-tags-area"),J=document.getElementById("static-tags-diff-wrapper");if(r==="subject"){let F=document.getElementById("static-tags-input"),V=Du(c,m);F.value=V.join(" "),ea(c,V,"static-tags-diff-container"),P&&(P.style.display="block"),J&&(J.style.display="block")}else P&&(P.style.display="none"),J&&(J.style.display="none");let ee=document.getElementById("static-series-area");if(r==="subject"){let F=document.getElementById("static-series-checkbox"),V=g.hasUpdate?g.newValue:f;F.checked=V,k.currentSeries=V,ee&&(ee.style.display="block")}else ee&&(ee.style.display="none");let re=ji(r,e.id).editPagePath.replace("/edit",""),q=x[r]||"\u6761\u76EE";o&&(o.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${q}\uFF1A<a href="${re}" target="_blank">${d}</a>\uFF08${e.id}\uFF09[${q}]
                </div>
            </div>
        `),a&&(a.innerHTML=`
            <button id="process-skip-update" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-confirm-update" class="primary">\u786E\u8BA4\u66F4\u65B0</button>
        `),Pi()}function Ou(t,e){k.currentView="processing";let n=document.getElementById("core-content"),i=document.getElementById("static-buttons-container"),r=document.getElementById("edit-regions");r&&(r.style.display="none"),co(),Ui(k.currentIndex,k.totalItems);let o=t.id,l={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[k.entityType]||"\u6761\u76EE",d=(k.retryCount[o]||0)+1;k.retryCount[o]=d,n&&(n.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${l}\uFF1A<a href="https://bgm.tv/${k.entityType}/${o}" target="_blank">\u67E5\u770B${l}</a>\uFF08${o}\uFF09
                </div>
                <div class="status-box error">
                    \u65E0\u6CD5\u83B7\u53D6${l}\u4FE1\u606F: ${e}
                    ${d>1?`<br>\u5DF2\u91CD\u8BD5 ${d-1} \u6B21`:""}
                </div>
                <p>\u662F\u5426\u7EE7\u7EED\u5904\u7406\uFF1F</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${k.currentIndex/k.totalItems*100}%"></div>
                </div>
            </div>
        `),i&&(i.innerHTML=`
            <button id="process-skip-error" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-error" class="primary">\u91CD\u8BD5</button>
        `)}function Pu(t){k.currentView="processing";let e=document.getElementById("core-content"),n=document.getElementById("static-buttons-container"),i=document.getElementById("edit-regions");i&&(i.style.display="none"),co(),Ui(k.currentIndex,k.totalItems);let r=k.currentItemId||"",o=(k.retryCount[r]||0)+1;k.retryCount[r]=o;let l=k.currentSubjectData?.name||"\u672A\u77E5\u540D\u79F0",u={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[k.entityType]||"\u6761\u76EE";e&&(e.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${u}\uFF1A<a href="https://bgm.tv/${k.entityType}/${r}" target="_blank">${l}</a>\uFF08${r}\uFF09
                </div>
                <div class="status-box error">
                    \u63D0\u4EA4\u66F4\u65B0\u5931\u8D25: ${t}
                </div>
                <p>\u662F\u5426\u91CD\u8BD5\u66F4\u65B0\uFF1F</p>
            </div>
        `),n&&(n.innerHTML=`
            <button id="process-skip-update-fail" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-update" class="primary">\u91CD\u8BD5</button>
        `)}function ju(){k.currentView="completed";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container"),n=document.getElementById("edit-regions");n&&(n.style.display="none"),co(),Ui(k.totalItems,k.totalItems),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">\u5904\u7406\u5B8C\u6210</h3>
                <div class="status-box info">\u6240\u6709\u6761\u76EE\u5904\u7406\u5B8C\u6BD5</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">\u603B\u6761\u76EE</span>
                        <span class="stats-value">${k.totalItems}</span>
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="completed-back-to-setup" class="primary">\u8FD4\u56DE\u8BBE\u7F6E</button>
        `)}function Lv(t){let e=t.trim();if(!e)return new Headers;let n=e.split(`\r
`).map(i=>{let r=i.split(":");return[r[0].trim(),r[1].trim()]});return new Headers(n)}function kv(t,e){let n=Lv(e.responseHeaders),i=typeof e.response=="string"?new Blob([e.response],{type:n.get("Content-Type")||"text/plain"}):e.response;return new ql(i,{statusCode:e.status,statusText:e.statusText,headers:n,finalUrl:e.finalUrl,redirected:e.finalUrl===t.url})}var ql=class t{constructor(e,n){this.rawBody=e,this.init=n,this.body=e.stream();let{headers:i,statusCode:r,statusText:o,finalUrl:a,redirected:l}=n;this.headers=i,this.status=r,this.statusText=o,this.url=a,this.type="basic",this.redirected=l,this._bodyUsed=!1}get bodyUsed(){return this._bodyUsed}get ok(){return this.status<300}arrayBuffer(){if(this.bodyUsed)throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.arrayBuffer()}blob(){if(this.bodyUsed)throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");return this._bodyUsed=!0,Promise.resolve(this.rawBody.slice(0,this.rawBody.size,this.rawBody.type))}clone(){if(this.bodyUsed)throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");return new t(this.rawBody,this.init)}formData(){if(this.bodyUsed)throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text().then(Iv)}async json(){if(this.bodyUsed)throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");return this._bodyUsed=!0,JSON.parse(await this.rawBody.text())}text(){if(this.bodyUsed)throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text()}async bytes(){if(this.bodyUsed)throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");return this._bodyUsed=!0,new Uint8Array(await this.rawBody.arrayBuffer())}};function Iv(t){let e=new FormData;return t.trim().split("&").forEach(function(n){if(n){let i=n.split("="),r=i.shift()?.replace(/\+/g," "),o=i.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}async function zn(t,e){let n=new Request(t,e),i;return e?.body&&(i=await n.text()),await Sv(n,e,i)}function Sv(t,e,n){return new Promise((i,r)=>{if(t.signal&&t.signal.aborted)return r(new DOMException("Aborted","AbortError"));GM.xmlHttpRequest({url:t.url,method:$v(t.method.toUpperCase()),headers:Object.fromEntries(new Headers(e?.headers).entries()),data:n,responseType:"blob",onload(o){try{i(kv(t,o))}catch(a){r(a)}},onabort(){r(new DOMException("Aborted","AbortError"))},ontimeout(){r(new TypeError("Network request failed, timeout"))},onerror(o){r(new TypeError("Failed to fetch: "+o.finalUrl))}})})}var Cv=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function Nv(t,e){return t.includes(e)}function $v(t){if(Nv(Cv,t))return t;throw new Error(`unsupported http method ${t}`)}function Uu(){if(k.submitMethod==="patch"&&!k.accessToken){en("\u8BF7\u8F93\u5165Access Token");return}if(k.submitMethod==="post"&&!k.formhash){en("\u8BF7\u8F93\u5165Formhash");return}if(!k.csvData||k.csvData.length===0){en("\u8BF7\u4E0A\u4F20\u6709\u6548\u7684CSV\u6587\u4EF6");return}k.totalItems=k.csvData.length,k.processing=!0,k.paused=!1;let t=document.getElementById("core-content");t&&(t.innerHTML=`
            <div>
                <div class="item-info">\u51C6\u5907\u5904\u7406\u7B2C\u4E00\u4E2A\u6761\u76EE...</div>
            </div>
        `);let e=document.getElementById("static-buttons-container");e&&(e.innerHTML=`
            <button id="process-cancel" class="danger">\u53D6\u6D88</button>
        `),pi()}function pi(t=!1){if(k.paused||!k.processing)return;if(k.currentIndex>=k.totalItems){ju();return}let e=k.csvData[k.currentIndex],n=k.entityType||"subject";t||Ui(k.currentIndex,k.totalItems),document.querySelectorAll("#static-buttons-container button").forEach(a=>{a.disabled=!0}),Gi("\u6B63\u5728\u83B7\u53D6\u6761\u76EE\u4FE1\u606F...");let{wikiPath:i,historyPath:r}=ji(n,e.id),o=k.submitMethod==="patch"?{Authorization:`Bearer ${k.accessToken}`,Accept:"application/json"}:{Accept:"application/json"};Promise.all([zn(i,{headers:o}),zn(r,{headers:o})]).then(async([a,l])=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);if(!l.ok)throw new Error(`HTTP ${l.status}`);let d=await a.json(),u=await l.json();return{currentItem:e,wikiData:d,historyData:u}}).then(a=>{k.retryCount[a.currentItem.id]=0,vn(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Ru(a)}).catch(a=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Ou(e,a.message)})}function Gu(t,e,n,i,r,o,a,l,d){k.processing=!0;let u=k.entityType||"subject";if(k.submitMethod==="patch"){let{wikiPath:c,patchBodyKey:f}=ji(u,t),p={commitMessage:a};u==="subject"?p.subject={infobox:e,metaTags:n,series:i}:p[f]={infobox:e},zn(c,{method:"PATCH",headers:{Authorization:`Bearer ${k.accessToken}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(p)}).then(m=>m.ok?m:m.text().then(g=>{throw new Error(`HTTP ${m.status} - ${g||"\u66F4\u65B0\u5931\u8D25"}`)})).then(()=>{vn(),l()}).catch(m=>{d(m instanceof Error?m:new Error(String(m)))})}else{let c=e.replace(/\n/g,`\r
`),f=new FormData;if(f.append("formhash",k.formhash),f.append("editSummary",a),u==="subject")f.append("subject_title",k.currentSubjectData?.name||""),f.append("platform",k.currentSubjectData?.platform||""),f.append("subject_infobox",c),f.append("subject_summary",k.currentSubjectData?.summary||""),f.append("subject_meta_tags",n.join(" ")),f.append("series",i?"1":"0"),f.append("submit","\u63D0\u4EA4");else if(u==="person"){f.append("crt_name",k.currentSubjectData?.name||""),f.append("crt_infobox",c),f.append("crt_summary",k.currentSubjectData?.summary||"");let g=k.currentSubjectData?.profession;if(g)for(let[x,w]of Object.entries(g))w&&f.append(`prsn_pro[${x}]`,"1");f.append("picfile",""),f.append("submit","\u6539\u597D\u4E86")}else f.append("crt_name",k.currentSubjectData?.name||""),f.append("crt_infobox",c),f.append("crt_summary",k.currentSubjectData?.summary||""),f.append("picfile",""),f.append("submit","\u6539\u597D\u4E86");let p=new URLSearchParams;f.forEach((g,x)=>{p.append(x,g)});let m=u==="subject"?`https://bgm.tv/subject/${t}/new_revision`:`https://bgm.tv/${u}/${t}/edit`;GM.xmlHttpRequest({method:"POST",url:m,data:p.toString(),headers:{"Content-Type":"application/x-www-form-urlencoded"},onload:function(g){vn(),g.finalUrl===m?d(new Error("\u66F4\u65B0\u5931\u8D25\uFF0C\u53EF\u80FD\u662Fformhash\u65E0\u6548\u6216\u6743\u9650\u4E0D\u8DB3")):l()},onerror:function(g){vn(),d(new Error(`\u7F51\u7EDC\u9519\u8BEF: ${g.message}`))},onabort:function(){vn(),d(new Error("\u8BF7\u6C42\u5DF2\u4E2D\u6B62"))},ontimeout:function(){vn(),d(new Error("\u8BF7\u6C42\u8D85\u65F6"))}})}}var zu="Ov23lifi6y3LGaJ8A53e",ta="wikiBatch-sync.json",Wu="wikiBatch \u8DE8\u8BBE\u5907\u540C\u6B65\u6570\u636E";function Dv(){return{version:1,csvData:localStorage.getItem("bgmCsvData")||"null",currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),retryCount:GM_getValue("bgmRetryCount")||"{}",previousItem:localStorage.getItem("bgmPreviousItem"),entityType:localStorage.getItem("bgmEntityType")||"subject",totalItems:parseInt(localStorage.getItem("bgmTotalItems")||"0")}}function Tv(t){localStorage.setItem("bgmCsvData",t.csvData),localStorage.setItem("bgmCurrentIndex",t.currentIndex.toString()),localStorage.setItem("bgmEntityType",t.entityType),localStorage.setItem("bgmTotalItems",t.totalItems.toString()),GM_setValue("bgmRetryCount",t.retryCount),t.previousItem?localStorage.setItem("bgmPreviousItem",t.previousItem):localStorage.removeItem("bgmPreviousItem")}async function Fv(){return(await zn("https://github.com/login/device/code",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:zu,scope:"gist"})})).json()}async function Mv(t,e){return new Promise((n,i)=>{let r=e,o=async()=>{let l=await(await zn("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:zu,device_code:t,grant_type:"urn:ietf:params:oauth:grant-type:device_code"})})).json();l.access_token?n(l.access_token):l.error==="authorization_pending"?setTimeout(o,r*1e3):l.error==="slow_down"?(r+=5,setTimeout(o,r*1e3)):i(new Error(l.error_description||l.error||"\u6388\u6743\u5931\u8D25"))};o()})}async function Qu(t){t.textContent="\u6B63\u5728\u83B7\u53D6\u8BBE\u5907\u7801...";let e;try{e=await Fv()}catch{t.textContent="\u7F51\u7EDC\u9519\u8BEF\uFF0C\u65E0\u6CD5\u8FDE\u63A5 GitHub";return}t.innerHTML=`\u8BF7\u5728\u6253\u5F00\u7684\u9875\u9762\u4E2D\u8F93\u5165\u7801: <strong>${e.user_code}</strong>`,GM_openInTab(e.verification_uri);try{let n=await Mv(e.device_code,e.interval);GM_setValue("bgmGistToken",n),t.textContent="\u6388\u6743\u6210\u529F"}catch(n){t.textContent=n.message}}function Vu(){return GM_getValue("bgmGistId")||null}function Kl(t){GM_setValue("bgmGistId",t)}function na(){return GM_getValue("bgmGistToken")||null}async function Hv(t){let e=na();if(!e)throw new Error("\u672A\u6388\u6743");return(await(await zn("https://api.github.com/gists",{method:"POST",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({description:Wu,public:!1,files:{[ta]:{content:t}}})})).json()).id}async function Bv(t,e){let n=na();if(!n)throw new Error("\u672A\u6388\u6743");await zn(`https://api.github.com/gists/${t}`,{method:"PATCH",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({files:{[ta]:{content:e}}})})}async function Yu(){let t=na();return t&&(await(await zn("https://api.github.com/gists?per_page=100",{headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${t}`}})).json()).find(r=>r.description===Wu&&r.files?.[ta])?.id||null}async function Rv(t){let e=na();if(!e)throw new Error("\u672A\u6388\u6743");let r=(await(await zn(`https://api.github.com/gists/${t}`,{headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`}})).json()).files?.[ta];if(!r)throw new Error("Gist \u4E2D\u672A\u627E\u5230\u540C\u6B65\u6570\u636E");return r.content}async function Ju(){let t=Dv(),e=JSON.stringify(t),n=Vu();n||(n=await Yu(),n&&Kl(n)),n?await Bv(n,e):(n=await Hv(e),Kl(n))}async function qu(){let t=Vu();if(!t){if(t=await Yu(),!t)throw new Error("\u672A\u627E\u5230\u540C\u6B65 Gist\uFF0C\u8BF7\u5148\u5728\u53E6\u4E00\u8BBE\u5907\u4E0A\u4F20");Kl(t)}let e=await Rv(t),n=JSON.parse(e);Tv(n)}function Ku(){GM_deleteValue("bgmGistToken"),GM_deleteValue("bgmGistId")}function Xu(t){switch(t){case"setup-start-processing":Uu();break;case"setup-reset-progress":k.currentIndex=0,k.retryCount={},k.previousItem=null,localStorage.setItem("bgmCurrentIndex","0"),Gn();break;case"sync-auth-btn":Ov();break;case"sync-upload-btn":Pv();break;case"sync-download-btn":jv();break;case"sync-clear-btn":Ku(),Gn();break}}async function Ov(){let t=document.getElementById("sync-status");if(!t)return;let e=document.getElementById("sync-auth-btn");e&&(e.disabled=!0),await Qu(t),e&&(e.disabled=!1),Gn()}async function Pv(){let t=document.getElementById("sync-status");if(t){In(),t.textContent="\u6B63\u5728\u4E0A\u4F20...";try{await Ju(),t.textContent="\u4E0A\u4F20\u6210\u529F: "+new Date().toLocaleString()}catch(e){t.textContent="\u4E0A\u4F20\u5931\u8D25: "+e.message}}}async function jv(){let t=document.getElementById("sync-status");if(t){t.textContent="\u6B63\u5728\u4E0B\u8F7D...";try{await qu(),k.csvData=JSON.parse(localStorage.getItem("bgmCsvData")||"null"),k.currentIndex=parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),k.entityType=localStorage.getItem("bgmEntityType")||"subject",k.totalItems=parseInt(localStorage.getItem("bgmTotalItems")||"0"),k.retryCount=JSON.parse(GM_getValue("bgmRetryCount","{}")),k.previousItem=JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),t.textContent="\u4E0B\u8F7D\u6210\u529F: "+new Date().toLocaleString(),Gn()}catch(e){t.textContent="\u4E0B\u8F7D\u5931\u8D25: "+e.message}}}function Zu(t){if(!k.csvData)return;let e=k.csvData[k.currentIndex],n=k.currentSubjectData,i=e?.id||k.currentItemId||"",r=n?.name||"\u672A\u77E5\u540D\u79F0",o=k.entityType||"subject";function a(){return{id:i,name:r,type:o}}switch(t){case"process-confirm-update":{let l=document.getElementById("static-wcode-input").value,d=o==="subject"?document.getElementById("static-tags-input").value.split(" ").filter(p=>p):[],u=o==="subject"?document.getElementById("static-series-checkbox").checked:!1,c=document.getElementById("static-commit-input").value||so(k.currentFieldUpdates,k.currentTagUpdates,k.currentSeriesUpdate,o);if(!Vl()){en("\u6CA1\u6709\u68C0\u6D4B\u5230\u5B9E\u8D28\u4FEE\u6539\uFF0C\u5DF2\u8DF3\u8FC7\u66F4\u65B0"),k.previousItem=a(),k.currentIndex++,hr(),In(),pi();return}document.querySelectorAll("#static-buttons-container button").forEach(p=>{p.disabled=!0}),Gi("\u6B63\u5728\u63D0\u4EA4\u66F4\u65B0..."),Gu(i,l,d,u,r,e,c,()=>{k.previousItem=a(),k.currentIndex++,hr(),In(),pi()},p=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(m=>{m.disabled=!1}),Pu(p.message)});break}case"process-skip-update":k.previousItem=a(),k.currentIndex++,hr(),In(),pi();break;case"process-confirm-continue":k.previousItem=a(),k.currentIndex++,hr(),In(),pi();break;case"process-skip-error":k.currentIndex++,hr(),In(),pi();break;case"process-retry-error":{let l=k.retryCount[i]||0;en(`\u6B63\u5728\u91CD\u8BD5\uFF08${l}\u6B21\uFF09...`),pi();break}case"process-skip-update-fail":k.previousItem=a(),k.currentIndex++,hr(),In(),pi();break;case"process-retry-update":{let l=k.retryCount[i]||0;en(`\u6B63\u5728\u91CD\u8BD5\uFF08${l}\u6B21\uFF09...`),pi(!0);break}}}function ep(t){t==="completed-back-to-setup"&&(Gn(),Uv())}function Uv(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}var tp="data:image/png;base64,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";var Xl=["light","dark","system"],rp=7,Gv=40,ia=Math.floor(Math.random()*rp),ra="bgm-tool-container",zv="bgm-float-button",ao=null;function Zl(){if(ao)return;ao=[];let t=Array.from(document.body.children);for(let e of t){let n=e.id;n===ra||n===zv||e.tagName!=="SCRIPT"&&(ao.push({el:e,origDisplay:e.style.display||""}),e.style.display="none")}}function Wv(){if(ao){for(let{el:t,origDisplay:e}of ao)t.style.display=e;ao=null}}function Qv(){ia=(ia+1)%rp;let t=document.getElementById("bgm-tool-logo-sprite");t&&(t.style.backgroundPosition=`${-ia*Gv}px 0`)}function ed(t){let e=document.getElementById("bgm-tool-container");if(!e)return;t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches?e.setAttribute("data-theme","dark"):e.removeAttribute("data-theme")}function Vv(){let t=Xl.indexOf(k.theme);k.theme=Xl[(t+1)%Xl.length],localStorage.setItem("bgmTheme",k.theme),ed(k.theme),op()}function op(){let t=document.getElementById("bgm-tool-theme");if(!t)return;let e={light:'<i class="fas fa-sun"></i>',dark:'<i class="fas fa-moon"></i>',system:'<i class="fas fa-adjust"></i>'};t.innerHTML=e[k.theme]||e.system,t.title="\u4E3B\u9898: "+k.theme}function np(){let t=document.getElementById("bgm-float-button");return t||(t=document.createElement("div"),t.id="bgm-float-button",t.innerHTML='<i class="fas fa-tools"></i>',document.body.appendChild(t),t.addEventListener("click",()=>{let e=document.getElementById(ra);e&&(e.style.display="flex",Zl(),t&&(t.style.display="none"))})),t}function sp(){let t=np();if(t.style.display="none",document.getElementById(ra)){document.getElementById(ra).style.display="flex",Zl();return}let e=document.createElement("div");e.id="bgm-tool-container",e.innerHTML=`
        <div id="bgm-tool-header">
            <div id="bgm-tool-header-logo">
                <div id="bgm-tool-logo-sprite" style="background: url(${tp}) no-repeat; background-size: 280px 75px; background-position: ${-ia*40}px 0;"></div>
                <span>\u6279\u91CF\u66F4\u65B0</span>
            </div>
            <span class="header-spacer"></span>
            <div id="bgm-tool-header-actions">
                <button id="bgm-tool-theme" title="\u4E3B\u9898" tabindex="0"><i class="fas fa-adjust"></i></button>
                <button id="bgm-tool-settings" title="\u8BBE\u7F6E" tabindex="0"><i class="fas fa-cog"></i></button>
                <button id="bgm-tool-close" title="\u5173\u95ED" tabindex="0"><i class="fas fa-sign-out-alt"></i></button>
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
                        <label for="static-commit-input">\u7F16\u8F91\u6458\u8981</label>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="text" id="static-commit-input" placeholder="\u8BF7\u8F93\u5165\u7F16\u8F91\u6458\u8981" style="flex-grow: 1;">
                            <button id="static-lock-commit" class="secondary" title="${k.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981"}">
                                <i class="fas ${k.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>
                            </button>
                        </div>
                    </div>
                    <div class="edit-rows">
                        <div class="edit-row">
                            <div class="edit-area" id="static-wcode-area">
                                <label for="static-wcode-input">Wcode</label>
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
                                <label for="static-tags-input">\u6807\u7B7E (\u7A7A\u683C\u5206\u9694)</label>
                                <input type="text" id="static-tags-input">
                            </div>
                            <div id="static-tags-diff-wrapper">
                                <div class="diff-section-label">\u6807\u7B7E\u53D8\u66F4</div>
                                <div class="diff-section tags-diff-section" id="static-tags-diff-section">
                                    <div id="static-tags-diff-container" class="diff-container"></div>
                                </div>
                            </div>
                        </div>
                        <div class="edit-row" id="static-series-area">
                            <label class="toggle-switch">
                                <input type="checkbox" id="static-series-checkbox">
                                <span class="toggle-slider"></span>
                            </label>
                            <label for="static-series-checkbox">\u6807\u8BB0\u4E3A\u7CFB\u5217</label>
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
    `,document.body.appendChild(e),Zl(),Yv();let n=document.getElementById("bgm-tool-close");n&&n.addEventListener("click",()=>{e.style.display="none",Wv();let a=np();a.style.display="flex",ld(),In()});let i=document.getElementById("bgm-tool-settings");i&&i.addEventListener("click",()=>{Gn()});let r=document.getElementById("bgm-tool-theme");r&&r.addEventListener("click",Vv);let o=document.getElementById("bgm-tool-header-logo");o&&o.addEventListener("click",Qv),ed(k.theme),op(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{k.theme==="system"&&ed("system")}),Jv(),Gn()}function ip(t){t.addEventListener("click",e=>{let n=e.target.closest("button");if(!n)return;let i=n.id;switch(k.currentView){case"setup":Xu(i);break;case"processing":Zu(i);break;case"completed":ep(i);break}})}function Yv(){let t=document.getElementById("static-buttons-container");t&&ip(t);let e=document.getElementById("core-content");e&&ip(e)}function Jv(){document.getElementById("static-commit-input").addEventListener("input",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentCommitMessage=o.target.value,Pi())});let e=document.getElementById("static-lock-commit");e.addEventListener("click",()=>{if(k.currentView!=="processing"||!k.currentSubjectData)return;k.isCommitMessageLocked=!k.isCommitMessageLocked;let o=document.getElementById("static-commit-input");k.isCommitMessageLocked?(k.lockedCommitMessage=o.value,e.innerHTML='<i class="fas fa-lock"></i>',e.title="\u89E3\u9501\u7F16\u8F91\u6458\u8981"):(e.innerHTML='<i class="fas fa-lock-open"></i>',e.title="\u56FA\u5B9A\u7F16\u8F91\u6458\u8981",k.currentCommitMessage=so(k.currentFieldUpdates,k.currentTagUpdates,k.currentSeriesUpdate,k.entityType),o.value=k.currentCommitMessage),In(),Pi()}),document.getElementById("static-wcode-input").addEventListener("input",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentWcode=o.target.value,Xo(k.currentSubjectData.infobox||"",o.target.value,"static-content-diff-container"),Pi())}),document.getElementById("static-tags-input").addEventListener("input",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentTags=o.target.value,ea(k.currentSubjectData.metaTags||[],o.target.value.split(" ").filter(a=>a),"static-tags-diff-container"),Pi())}),document.getElementById("static-series-checkbox").addEventListener("change",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentSeries=o.target.checked,Pi())})}var ap=`/* stylelint-disable no-descending-specificity */

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
    --font: system-ui, -apple-system, sans-serif;
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
    outline: none;
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
    outline: none;
}

#bgm-tool-logo-sprite {
    outline: none;
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

#bgm-tool-header-actions button {
    cursor: pointer;
    color: var(--text-secondary);
    font-size: 16px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: none;
    background: transparent;
    transition: all 0.15s;
    padding: 0;
}

#bgm-tool-header-actions button:hover {
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
    font-weight: 400;
    font-size: 13px;
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

.diff-section-label,
.edit-area label,
.tags-edit-area label,
.commit-message-area label {
    display: block;
    margin-bottom: 4px;
    font-weight: 400;
    font-size: 13px;
    color: var(--text);
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

@media (width >= 960px) {
    .edit-row {
        flex-direction: row;
    }

    .edit-row > * {
        flex: 1;
        min-width: 0;
        overflow: auto;
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

#static-series-area {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
}

#static-series-area label {
    display: inline-block;
    margin-bottom: 0;
    cursor: pointer;
}

/* Apple-style toggle switch */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 26px;
    flex-shrink: 0;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--border);
    transition: 0.2s;
    border-radius: 26px;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    height: 22px;
    width: 22px;
    left: 2px;
    bottom: 2px;
    background-color: #fff;
    transition: 0.2s;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
}

.toggle-switch input:checked + .toggle-slider {
    background-color: var(--accent);
}

.toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(18px);
}

.toggle-switch input:focus-visible + .toggle-slider {
    box-shadow: 0 0 0 2px var(--accent);
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

.method-option-group input[type="radio"]:focus-visible + label {
    outline: 2px solid -webkit-focus-ring-color;
    outline: 2px solid Highlight;
    outline-offset: 2px;
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
    font-family: system-ui, -apple-system, sans-serif;
}

#bgm-float-button:hover {
    background: #e07a85;
    box-shadow: 0 4px 16px rgb(240 145 153 / 35%);
    transform: scale(1.05);
}
`;var lp=`.diff-tailwindcss-wrapper .\\!container {
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
`;GM_addStyle(ap);GM_addStyle(lp);var td=document.createElement("link");td.rel="stylesheet";td.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";document.head.appendChild(td);sp();})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.4
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      1.0.2
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

"use strict";(()=>{var hp=Object.create;var od=Object.defineProperty;var mp=Object.getOwnPropertyDescriptor;var gp=Object.getOwnPropertyNames;var vp=Object.getPrototypeOf,_p=Object.prototype.hasOwnProperty;var sd=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var bp=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of gp(e))!_p.call(t,r)&&r!==n&&od(t,r,{get:()=>e[r],enumerable:!(i=mp(e,r))||i.enumerable});return t};var ad=(t,e,n)=>(n=t!=null?hp(vp(t)):{},bp(e||!t||!t.__esModule?od(n,"default",{value:t,enumerable:!0}):n,t));var wd=sd((i_,bd)=>{var fn=-1,Qt=1,ft=0;function uo(t,e,n,i,r){if(t===e)return t?[[ft,t]]:[];if(n!=null){var o=Sp(t,e,n);if(o)return o}var s=aa(t,e),l=t.substring(0,s);t=t.substring(s),e=e.substring(s),s=es(t,e);var d=t.substring(t.length-s);t=t.substring(0,t.length-s),e=e.substring(0,e.length-s);var p=wp(t,e);return l&&p.unshift([ft,l]),d&&p.push([ft,d]),la(p,r),i&&Ep(p),p}function wp(t,e){var n;if(!t)return[[Qt,e]];if(!e)return[[fn,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,o=i.indexOf(r);if(o!==-1)return n=[[Qt,i.substring(0,o)],[ft,r],[Qt,i.substring(o+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=fn),n;if(r.length===1)return[[fn,t],[Qt,e]];var s=yp(t,e);if(s){var l=s[0],d=s[1],p=s[2],c=s[3],f=s[4],u=uo(l,p),m=uo(d,c);return u.concat([[ft,f]],m)}return xp(t,e)}function xp(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),o=r,s=2*r,l=new Array(s),d=new Array(s),p=0;p<s;p++)l[p]=-1,d[p]=-1;l[o+1]=0,d[o+1]=0;for(var c=n-i,f=c%2!==0,u=0,m=0,v=0,y=0,w=0;w<r;w++){for(var b=-w+u;b<=w-m;b+=2){var A=o+b,x;b===-w||b!==w&&l[A-1]<l[A+1]?x=l[A+1]:x=l[A-1]+1;for(var S=x-b;x<n&&S<i&&t.charAt(x)===e.charAt(S);)x++,S++;if(l[A]=x,x>n)m+=2;else if(S>i)u+=2;else if(f){var L=o+c-b;if(L>=0&&L<s&&d[L]!==-1){var h=n-d[L];if(x>=h)return fd(t,e,x,S)}}}for(var g=-w+v;g<=w-y;g+=2){var L=o+g,h;g===-w||g!==w&&d[L-1]<d[L+1]?h=d[L+1]:h=d[L-1]+1;for(var E=h-g;h<n&&E<i&&t.charAt(n-h-1)===e.charAt(i-E-1);)h++,E++;if(d[L]=h,h>n)y+=2;else if(E>i)v+=2;else if(!f){var A=o+c-g;if(A>=0&&A<s&&l[A]!==-1){var x=l[A],S=o+x-A;if(h=n-h,x>=h)return fd(t,e,x,S)}}}}return[[fn,t],[Qt,e]]}function fd(t,e,n,i){var r=t.substring(0,n),o=e.substring(0,i),s=t.substring(n),l=e.substring(i),d=uo(r,o),p=uo(s,l);return d.concat(p)}function aa(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(o,r)==e.substring(o,r)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return md(t.charCodeAt(r-1))&&r--,r}function cd(t,e){var n=t.length,i=e.length;if(n==0||i==0)return 0;n>i?t=t.substring(n-i):n<i&&(e=e.substring(0,n));var r=Math.min(n,i);if(t==e)return r;for(var o=0,s=1;;){var l=t.substring(r-s),d=e.indexOf(l);if(d==-1)return o;s+=d,(d==0||t.substring(r-s)==e.substring(0,s))&&(o=s,s++)}}function es(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(t.length-r,t.length-o)==e.substring(e.length-r,e.length-o)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return gd(t.charCodeAt(t.length-r))&&r--,r}function yp(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||i.length*2<n.length)return null;function r(m,v,y){for(var w=m.substring(y,y+Math.floor(m.length/4)),b=-1,A="",x,S,L,h;(b=v.indexOf(w,b+1))!==-1;){var g=aa(m.substring(y),v.substring(b)),E=es(m.substring(0,y),v.substring(0,b));A.length<E+g&&(A=v.substring(b-E,b)+v.substring(b,b+g),x=m.substring(0,y-E),S=m.substring(y+g),L=v.substring(0,b-E),h=v.substring(b+g))}return A.length*2>=m.length?[x,S,L,h,A]:null}var o=r(n,i,Math.ceil(n.length/4)),s=r(n,i,Math.ceil(n.length/2)),l;if(!o&&!s)return null;s?o?l=o[4].length>s[4].length?o:s:l=s:l=o;var d,p,c,f;t.length>e.length?(d=l[0],p=l[1],c=l[2],f=l[3]):(c=l[0],f=l[1],d=l[2],p=l[3]);var u=l[4];return[d,p,c,f,u]}function Ep(t){for(var e=!1,n=[],i=0,r=null,o=0,s=0,l=0,d=0,p=0;o<t.length;)t[o][0]==ft?(n[i++]=o,s=d,l=p,d=0,p=0,r=t[o][1]):(t[o][0]==Qt?d+=t[o][1].length:p+=t[o][1].length,r&&r.length<=Math.max(s,l)&&r.length<=Math.max(d,p)&&(t.splice(n[i-1],0,[fn,r]),t[n[i-1]+1][0]=Qt,i--,i--,o=i>0?n[i-1]:-1,s=0,l=0,d=0,p=0,r=null,e=!0)),o++;for(e&&la(t),kp(t),o=1;o<t.length;){if(t[o-1][0]==fn&&t[o][0]==Qt){var c=t[o-1][1],f=t[o][1],u=cd(c,f),m=cd(f,c);u>=m?(u>=c.length/2||u>=f.length/2)&&(t.splice(o,0,[ft,f.substring(0,u)]),t[o-1][1]=c.substring(0,c.length-u),t[o+1][1]=f.substring(u),o++):(m>=c.length/2||m>=f.length/2)&&(t.splice(o,0,[ft,c.substring(0,m)]),t[o-1][0]=Qt,t[o-1][1]=f.substring(0,f.length-m),t[o+1][0]=fn,t[o+1][1]=c.substring(m),o++),o++}o++}}var ud=/[^a-zA-Z0-9]/,pd=/\s/,hd=/[\r\n]/,Ap=/\n\r?\n$/,Lp=/^\r?\n\r?\n/;function kp(t){function e(m,v){if(!m||!v)return 6;var y=m.charAt(m.length-1),w=v.charAt(0),b=y.match(ud),A=w.match(ud),x=b&&y.match(pd),S=A&&w.match(pd),L=x&&y.match(hd),h=S&&w.match(hd),g=L&&m.match(Ap),E=h&&v.match(Lp);return g||E?5:L||h?4:b&&!x&&S?3:x||S?2:b||A?1:0}for(var n=1;n<t.length-1;){if(t[n-1][0]==ft&&t[n+1][0]==ft){var i=t[n-1][1],r=t[n][1],o=t[n+1][1],s=es(i,r);if(s){var l=r.substring(r.length-s);i=i.substring(0,i.length-s),r=l+r.substring(0,r.length-s),o=l+o}for(var d=i,p=r,c=o,f=e(i,r)+e(r,o);r.charAt(0)===o.charAt(0);){i+=r.charAt(0),r=r.substring(1)+o.charAt(0),o=o.substring(1);var u=e(i,r)+e(r,o);u>=f&&(f=u,d=i,p=r,c=o)}t[n-1][1]!=d&&(d?t[n-1][1]=d:(t.splice(n-1,1),n--),t[n][1]=p,c?t[n+1][1]=c:(t.splice(n+1,1),n--))}n++}}function la(t,e){t.push([ft,""]);for(var n=0,i=0,r=0,o="",s="",l;n<t.length;){if(n<t.length-1&&!t[n][1]){t.splice(n,1);continue}switch(t[n][0]){case Qt:r++,s+=t[n][1],n++;break;case fn:i++,o+=t[n][1],n++;break;case ft:var d=n-r-i-1;if(e){if(d>=0&&_d(t[d][1])){var p=t[d][1].slice(-1);if(t[d][1]=t[d][1].slice(0,-1),o=p+o,s=p+s,!t[d][1]){t.splice(d,1),n--;var c=d-1;t[c]&&t[c][0]===Qt&&(r++,s=t[c][1]+s,c--),t[c]&&t[c][0]===fn&&(i++,o=t[c][1]+o,c--),d=c}}if(vd(t[n][1])){var p=t[n][1].charAt(0);t[n][1]=t[n][1].slice(1),o+=p,s+=p}}if(n<t.length-1&&!t[n][1]){t.splice(n,1);break}if(o.length>0||s.length>0){o.length>0&&s.length>0&&(l=aa(s,o),l!==0&&(d>=0?t[d][1]+=s.substring(0,l):(t.splice(0,0,[ft,s.substring(0,l)]),n++),s=s.substring(l),o=o.substring(l)),l=es(s,o),l!==0&&(t[n][1]=s.substring(s.length-l)+t[n][1],s=s.substring(0,s.length-l),o=o.substring(0,o.length-l)));var f=r+i;o.length===0&&s.length===0?(t.splice(n-f,f),n=n-f):o.length===0?(t.splice(n-f,f,[Qt,s]),n=n-f+1):s.length===0?(t.splice(n-f,f,[fn,o]),n=n-f+1):(t.splice(n-f,f,[fn,o],[Qt,s]),n=n-f+2)}n!==0&&t[n-1][0]===ft?(t[n-1][1]+=t[n][1],t.splice(n,1)):n++,r=0,i=0,o="",s="";break}}t[t.length-1][1]===""&&t.pop();var u=!1;for(n=1;n<t.length-1;)t[n-1][0]===ft&&t[n+1][0]===ft&&(t[n][1].substring(t[n][1].length-t[n-1][1].length)===t[n-1][1]?(t[n][1]=t[n-1][1]+t[n][1].substring(0,t[n][1].length-t[n-1][1].length),t[n+1][1]=t[n-1][1]+t[n+1][1],t.splice(n-1,1),u=!0):t[n][1].substring(0,t[n+1][1].length)==t[n+1][1]&&(t[n-1][1]+=t[n+1][1],t[n][1]=t[n][1].substring(t[n+1][1].length)+t[n+1][1],t.splice(n+1,1),u=!0)),n++;u&&la(t,e)}function md(t){return t>=55296&&t<=56319}function gd(t){return t>=56320&&t<=57343}function vd(t){return gd(t.charCodeAt(0))}function _d(t){return md(t.charCodeAt(t.length-1))}function Ip(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}function sa(t,e,n,i){return _d(t)||vd(i)?null:Ip([[ft,t],[fn,e],[Qt,n],[ft,i]])}function Sp(t,e,n){var i=typeof n=="number"?{index:n,length:0}:n.oldRange,r=typeof n=="number"?null:n.newRange,o=t.length,s=e.length;if(i.length===0&&(r===null||r.length===0)){var l=i.index,d=t.slice(0,l),p=t.slice(l),c=r?r.index:null;e:{var f=l+s-o;if(c!==null&&c!==f||f<0||f>s)break e;var u=e.slice(0,f),m=e.slice(f);if(m!==p)break e;var v=Math.min(l,f),y=d.slice(0,v),w=u.slice(0,v);if(y!==w)break e;var b=d.slice(v),A=u.slice(v);return sa(y,b,A,p)}e:{if(c!==null&&c!==l)break e;var x=l,u=e.slice(0,x),m=e.slice(x);if(u!==d)break e;var S=Math.min(o-x,s-x),L=p.slice(p.length-S),h=m.slice(m.length-S);if(L!==h)break e;var b=p.slice(0,p.length-S),A=m.slice(0,m.length-S);return sa(d,b,A,L)}}if(i.length>0&&r&&r.length===0)e:{var y=t.slice(0,i.index),L=t.slice(i.index+i.length),v=y.length,S=L.length;if(s<v+S)break e;var w=e.slice(0,v),h=e.slice(s-S);if(y!==w||L!==h)break e;var b=t.slice(v,o-S),A=e.slice(v,s-S);return sa(y,b,A,L)}return null}function ts(t,e,n,i){return uo(t,e,n,i,!0)}ts.INSERT=Qt;ts.DELETE=fn;ts.EQUAL=ft;bd.exports=ts});var Mu=sd((ql,Kl)=>{((t,e)=>{typeof define=="function"&&define.amd?define([],e):typeof Kl=="object"&&typeof ql<"u"?Kl.exports=e():t.Papa=e()})(ql,function t(){var e=typeof self<"u"?self:typeof window<"u"?window:e!==void 0?e:{},n=!e.document&&!!e.postMessage,i=e.IS_PAPA_WORKER||!1,r={},o=0,s={};function l(h){return h.charCodeAt(0)===65279?h.slice(1):h}function d(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(g){var E=x(g);E.chunkSize=parseInt(E.chunkSize),g.step||g.chunk||(E.chunkSize=null),this._handle=new m(E),(this._handle.streamer=this)._config=E}.call(this,h),this.parseChunk=function(g,E){var N=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<N){let O=this._config.newline;O||(T=this._config.quoteChar||'"',O=this._handle.guessLineEndings(g,T)),g=[...g.split(O).slice(N)].join(O)}this.isFirstChunk&&L(this._config.beforeFirstChunk)&&(T=this._config.beforeFirstChunk(g))!==void 0&&(g=T),this.isFirstChunk=!1,this._halted=!1;var N=this._partialLine+g,T=(this._partialLine="",this._handle.parse(N,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(g=T.meta.cursor,N=(this._finished||(this._partialLine=N.substring(g-this._baseIndex),this._baseIndex=g),T&&T.data&&(this._rowCount+=T.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),i)e.postMessage({results:T,workerId:s.WORKER_ID,finished:N});else if(L(this._config.chunk)&&!E){if(this._config.chunk(T,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=T=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(T.data),this._completeResults.errors=this._completeResults.errors.concat(T.errors),this._completeResults.meta=T.meta),this._completed||!N||!L(this._config.complete)||T&&T.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),N||T&&T.meta.paused||this._nextChunk(),T}this._halted=!0},this._sendError=function(g){L(this._config.error)?this._config.error(g):i&&this._config.error&&e.postMessage({workerId:s.WORKER_ID,error:g,finished:!1})}}function p(h){var g;(h=h||{}).chunkSize||(h.chunkSize=s.RemoteChunkSize),d.call(this,h),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(E){this._input=E,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(g=new XMLHttpRequest,this._config.withCredentials&&(g.withCredentials=this._config.withCredentials),n||(g.onload=S(this._chunkLoaded,this),g.onerror=S(this._chunkError,this)),g.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var E,N=this._config.downloadRequestHeaders;for(E in N)g.setRequestHeader(E,N[E])}var T;this._config.chunkSize&&(T=this._start+this._config.chunkSize-1,g.setRequestHeader("Range","bytes="+this._start+"-"+T));try{g.send(this._config.downloadRequestBody)}catch(O){this._chunkError(O.message)}n&&g.status===0&&this._chunkError()}},this._chunkLoaded=function(){g.readyState===4&&(g.status<200||400<=g.status?this._chunkError():(this._start+=this._config.chunkSize||g.responseText.length,this._finished=!this._config.chunkSize||this._start>=(E=>(E=E.getResponseHeader("Content-Range"))!==null?parseInt(E.substring(E.lastIndexOf("/")+1)):-1)(g),this.parseChunk(g.responseText)))},this._chunkError=function(E){E=g.statusText||E,this._sendError(new Error(E))}}function c(h){(h=h||{}).chunkSize||(h.chunkSize=s.LocalChunkSize),d.call(this,h);var g,E,N=typeof FileReader<"u";this.stream=function(T){this._input=T,E=T.slice||T.webkitSlice||T.mozSlice,N?((g=new FileReader).onload=S(this._chunkLoaded,this),g.onerror=S(this._chunkError,this)):g=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var T=this._input,O=(this._config.chunkSize&&(O=Math.min(this._start+this._config.chunkSize,this._input.size),T=E.call(T,this._start,O)),g.readAsText(T,this._config.encoding));N||this._chunkLoaded({target:{result:O}})},this._chunkLoaded=function(T){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(T.target.result)},this._chunkError=function(){this._sendError(g.error)}}function f(h){var g;d.call(this,h=h||{}),this.stream=function(E){return g=E,this._nextChunk()},this._nextChunk=function(){var E,N;if(!this._finished)return E=this._config.chunkSize,g=E?(N=g.substring(0,E),g.substring(E)):(N=g,""),this._finished=!g,this.parseChunk(N)}}function u(h){d.call(this,h=h||{});var g=[],E=!0,N=!1;this.pause=function(){d.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){d.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(T){this._input=T,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){N&&g.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),g.length?this.parseChunk(g.shift()):E=!0},this._streamData=S(function(T){try{g.push(typeof T=="string"?T:T.toString(this._config.encoding)),E&&(E=!1,this._checkIsFinished(),this.parseChunk(g.shift()))}catch(O){this._streamError(O)}},this),this._streamError=S(function(T){this._streamCleanUp(),this._sendError(T)},this),this._streamEnd=S(function(){this._streamCleanUp(),N=!0,this._streamData("")},this),this._streamCleanUp=S(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function m(h){var g,E,N,T,O=Math.pow(2,53),X=-O,z=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,J=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,Y=this,be=0,j=0,M=!1,R=!1,U=[],H={data:[],errors:[],meta:{}};function ee(Z){return h.skipEmptyLines==="greedy"?Z.join("").trim()==="":Z.length===1&&Z[0].length===0}function se(){if(H&&N&&(ne("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+s.DefaultDelimiter+"'"),N=!1),h.skipEmptyLines&&(H.data=H.data.filter(function(Fe){return!ee(Fe)})),ie()){let Fe=function(we,Le){we=l(we),L(h.transformHeader)&&(we=h.transformHeader(we,Le)),U.push(we)};var he=Fe;if(H)if(Array.isArray(H.data[0])){for(var Z=0;ie()&&Z<H.data.length;Z++)H.data[Z].forEach(Fe);H.data.splice(0,1)}else H.data.forEach(Fe)}function oe(Fe,we){for(var Le=h.header?{}:[],De=0;De<Fe.length;De++){var ke=De,Ht=Fe[De],Ht=((Te,Ye)=>(yt=>(h.dynamicTypingFunction&&h.dynamicTyping[yt]===void 0&&(h.dynamicTyping[yt]=h.dynamicTypingFunction(yt)),(h.dynamicTyping[yt]||h.dynamicTyping)===!0))(Te)?Ye==="true"||Ye==="TRUE"||Ye!=="false"&&Ye!=="FALSE"&&((yt=>{if(z.test(yt)&&(yt=parseFloat(yt),X<yt&&yt<O))return 1})(Ye)?parseFloat(Ye):J.test(Ye)?new Date(Ye):Ye===""?null:Ye):Ye)(ke=h.header?De>=U.length?"__parsed_extra":U[De]:ke,Ht=h.transform?h.transform(Ht,ke):Ht);ke==="__parsed_extra"?(Le[ke]=Le[ke]||[],Le[ke].push(Ht)):Le[ke]=Ht}return h.header&&(De>U.length?ne("FieldMismatch","TooManyFields","Too many fields: expected "+U.length+" fields but parsed "+De,j+we):De<U.length&&ne("FieldMismatch","TooFewFields","Too few fields: expected "+U.length+" fields but parsed "+De,j+we)),Le}var ue;H&&(h.header||h.dynamicTyping||h.transform)&&(ue=1,!H.data.length||Array.isArray(H.data[0])?(H.data=H.data.map(oe),ue=H.data.length):H.data=oe(H.data,0),h.header&&H.meta&&(H.meta.fields=U),j+=ue)}function ie(){return h.header&&U.length===0}function ne(Z,oe,ue,he){Z={type:Z,code:oe,message:ue},he!==void 0&&(Z.row=he),H.errors.push(Z)}L(h.step)&&(T=h.step,h.step=function(Z){H=Z,ie()?se():(se(),H.data.length!==0&&(be+=Z.data.length,h.preview&&be>h.preview?E.abort():(H.data=H.data[0],T(H,Y))))}),this.parse=function(Z,oe,ue){var he=h.quoteChar||'"',he=(h.newline||(h.newline=this.guessLineEndings(Z,he)),N=!1,h.delimiter?L(h.delimiter)&&(h.delimiter=h.delimiter(Z),H.meta.delimiter=h.delimiter):((he=((Fe,we,Le,De,ke)=>{var Ht,Te,Ye,yt;ke=ke||[",","	","|",";",s.RECORD_SEP,s.UNIT_SEP];for(var hr=0;hr<ke.length;hr++){for(var zn,lo=ke[hr],Ct=0,Wn=0,Et=0,Xt=(Ye=void 0,new y({comments:De,delimiter:lo,newline:we,preview:10}).parse(Fe)),pi=0;pi<Xt.data.length;pi++)Le&&ee(Xt.data[pi])?Et++:(zn=Xt.data[pi].length,Wn+=zn,Ye===void 0?Ye=zn:0<zn&&(Ct+=Math.abs(zn-Ye),Ye=zn));0<Xt.data.length&&(Wn/=Xt.data.length-Et),1.99<Wn&&(Te===void 0||Ct<Te||Ct===Te&&yt<Wn)&&(Te=Ct,Ht=lo,yt=Wn)}return{successful:!!(h.delimiter=Ht),bestDelimiter:Ht}})(Z,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=he.bestDelimiter:(N=!0,h.delimiter=s.DefaultDelimiter),H.meta.delimiter=h.delimiter),x(h));return h.preview&&h.header&&he.preview++,g=Z,E=new y(he),H=E.parse(g,oe,ue),se(),M?{meta:{paused:!0}}:H||{meta:{paused:!1}}},this.paused=function(){return M},this.pause=function(){M=!0,E.abort(),g=L(h.chunk)?"":g.substring(E.getCharIndex())},this.resume=function(){Y.streamer._halted?(M=!1,Y.streamer.parseChunk(g,!0)):setTimeout(Y.resume,3)},this.aborted=function(){return R},this.abort=function(){R=!0,E.abort(),H.meta.aborted=!0,L(h.complete)&&h.complete(H),g=""},this.guessLineEndings=function(Fe,he){Fe=Fe.substring(0,1048576);var he=new RegExp(v(he)+"([^]*?)"+v(he),"gm"),ue=(Fe=Fe.replace(he,"")).split("\r"),he=Fe.split(`
`),Fe=1<he.length&&he[0].length<ue[0].length;if(ue.length===1||Fe)return`
`;for(var we=0,Le=0;Le<ue.length;Le++)ue[Le][0]===`
`&&we++;return we>=ue.length/2?`\r
`:"\r"}}function v(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function y(h){var g=(h=h||{}).delimiter,E=h.newline,N=h.comments,T=h.step,O=h.preview,X=h.fastMode,z=null,J=!1,Y=h.quoteChar==null?'"':h.quoteChar,be=Y;if(h.escapeChar!==void 0&&(be=h.escapeChar),(typeof g!="string"||-1<s.BAD_DELIMITERS.indexOf(g))&&(g=","),N===g)throw new Error("Comment character same as delimiter");N===!0?N="#":(typeof N!="string"||-1<s.BAD_DELIMITERS.indexOf(N))&&(N=!1),E!==`
`&&E!=="\r"&&E!==`\r
`&&(E=`
`);var j=0,M=!1;this.parse=function(R,U,H){if(typeof R!="string")throw new Error("Input must be a string");var ee=R.length,se=g.length,ie=E.length,ne=N.length,Z=L(T),oe=[],ue=[],he=[],Fe=j=0;if(!R)return Ct();if(X||X!==!1&&R.indexOf(Y)===-1){for(var we=R.split(E),Le=0;Le<we.length;Le++){if(he=we[Le],j+=he.length,Le!==we.length-1)j+=E.length;else if(H)return Ct();if(!N||he.substring(0,ne)!==N){if(Z){if(oe=[],yt(he.split(g)),Wn(),M)return Ct()}else yt(he.split(g));if(O&&O<=Le)return oe=oe.slice(0,O),Ct(!0)}}return Ct()}for(var De=R.indexOf(g,j),ke=R.indexOf(E,j),Ht=new RegExp(v(be)+v(Y),"g"),Te=R.indexOf(Y,j);;)if(R[j]===Y)for(Te=j,j++;;){if((Te=R.indexOf(Y,Te+1))===-1)return H||ue.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:oe.length,index:j}),zn();if(Te===ee-1)return zn(R.substring(j,Te).replace(Ht,Y));if(Y===be&&R[Te+1]===be)Te++;else if(Y===be||Te===0||R[Te-1]!==be){De!==-1&&De<Te+1&&(De=R.indexOf(g,Te+1));var Ye=hr((ke=ke!==-1&&ke<Te+1?R.indexOf(E,Te+1):ke)===-1?De:Math.min(De,ke));if(R.substr(Te+1+Ye,se)===g){he.push(R.substring(j,Te).replace(Ht,Y)),R[j=Te+1+Ye+se]!==Y&&(Te=R.indexOf(Y,j)),De=R.indexOf(g,j),ke=R.indexOf(E,j);break}if(Ye=hr(ke),R.substring(Te+1+Ye,Te+1+Ye+ie)===E){if(he.push(R.substring(j,Te).replace(Ht,Y)),lo(Te+1+Ye+ie),De=R.indexOf(g,j),Te=R.indexOf(Y,j),Z&&(Wn(),M))return Ct();if(O&&oe.length>=O)return Ct(!0);break}ue.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:oe.length,index:j}),Te++}}else if(N&&he.length===0&&R.substring(j,j+ne)===N){if(ke===-1)return Ct();j=ke+ie,ke=R.indexOf(E,j),De=R.indexOf(g,j)}else if(De!==-1&&(De<ke||ke===-1))he.push(R.substring(j,De)),j=De+se,De=R.indexOf(g,j);else{if(ke===-1)break;if(he.push(R.substring(j,ke)),lo(ke+ie),Z&&(Wn(),M))return Ct();if(O&&oe.length>=O)return Ct(!0)}return zn();function yt(Et){oe.push(Et),Fe=j}function hr(Et){var Xt=0;return Xt=Et!==-1&&(Et=R.substring(Te+1,Et))&&Et.trim()===""?Et.length:Xt}function zn(Et){return H||(Et===void 0&&(Et=R.substring(j)),he.push(Et),j=ee,yt(he),Z&&Wn()),Ct()}function lo(Et){j=Et,yt(he),he=[],ke=R.indexOf(E,j)}function Ct(Et){if(h.header&&!U&&oe.length&&!J){var Xt=oe[0],pi=Object.create(null),oa=new Set(Xt);let id=!1;for(let mr=0;mr<Xt.length;mr++){let Qn=l(Xt[mr]);if(pi[Qn=L(h.transformHeader)?h.transformHeader(Qn,mr):Qn]){let fo,rd=pi[Qn];for(;fo=Qn+"_"+rd,rd++,oa.has(fo););oa.add(fo),Xt[mr]=fo,pi[Qn]++,id=!0,(z=z===null?{}:z)[fo]=Qn}else pi[Qn]=1,Xt[mr]=Qn;oa.add(Qn)}id&&console.warn("Duplicate headers found and renamed."),J=!0}return{data:oe,errors:ue,meta:{delimiter:g,linebreak:E,aborted:M,truncated:!!Et,cursor:Fe+(U||0),renamedHeaders:z}}}function Wn(){T(Ct()),oe=[],ue=[]}},this.abort=function(){M=!0},this.getCharIndex=function(){return j}}function w(h){var g=h.data,E=r[g.workerId],N=!1;if(g.error)E.userError(g.error,g.file);else if(g.results&&g.results.data){var T={abort:function(){N=!0,b(g.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:A,resume:A};if(L(E.userStep)){for(var O=0;O<g.results.data.length&&(E.userStep({data:g.results.data[O],errors:g.results.errors,meta:g.results.meta},T),!N);O++);delete g.results}else L(E.userChunk)&&(E.userChunk(g.results,T,g.file),delete g.results)}g.finished&&!N&&b(g.workerId,g.results)}function b(h,g){var E=r[h];L(E.userComplete)&&E.userComplete(g),E.terminate(),delete r[h]}function A(){throw new Error("Not implemented.")}function x(h){if(typeof h!="object"||h===null)return h;var g,E=Array.isArray(h)?[]:{};for(g in h)E[g]=x(h[g]);return E}function S(h,g){return function(){h.apply(g,arguments)}}function L(h){return typeof h=="function"}return s.parse=function(h,g){var E=(g=g||{}).dynamicTyping||!1;if(L(E)&&(g.dynamicTypingFunction=E,E={}),g.dynamicTyping=E,g.transform=!!L(g.transform)&&g.transform,!g.worker||!s.WORKERS_SUPPORTED)return E=null,s.NODE_STREAM_INPUT,typeof h=="string"?(h=l(h),E=new(g.download?p:f)(g)):h.readable===!0&&L(h.read)&&L(h.on)?E=new u(g):(e.File&&h instanceof File||h instanceof Object)&&(E=new c(g)),E.stream(h);(E=(()=>{var N;return!!s.WORKERS_SUPPORTED&&(N=(()=>{var T=e.URL||e.webkitURL||null,O=t.toString();return s.BLOB_URL||(s.BLOB_URL=T.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",O,")();"],{type:"text/javascript"})))})(),(N=new e.Worker(N)).onmessage=w,N.id=o++,r[N.id]=N)})()).userStep=g.step,E.userChunk=g.chunk,E.userComplete=g.complete,E.userError=g.error,g.step=L(g.step),g.chunk=L(g.chunk),g.complete=L(g.complete),g.error=L(g.error),delete g.worker,E.postMessage({input:h,config:g,workerId:E.id})},s.unparse=function(h,g){var E=!1,N=!0,T=",",O=`\r
`,X='"',z=X+X,J=!1,Y=null,be=!1,j=((()=>{if(typeof g=="object"){if(typeof g.delimiter!="string"||s.BAD_DELIMITERS.filter(function(U){return g.delimiter.indexOf(U)!==-1}).length||(T=g.delimiter),typeof g.quotes!="boolean"&&typeof g.quotes!="function"&&!Array.isArray(g.quotes)||(E=g.quotes),typeof g.skipEmptyLines!="boolean"&&typeof g.skipEmptyLines!="string"||(J=g.skipEmptyLines),typeof g.newline=="string"&&(O=g.newline),typeof g.quoteChar=="string"&&(X=g.quoteChar,z=X+X),typeof g.header=="boolean"&&(N=g.header),Array.isArray(g.columns)){if(g.columns.length===0)throw new Error("Option columns is empty");Y=g.columns}g.escapeChar!==void 0&&(z=g.escapeChar+X),g.escapeFormulae instanceof RegExp?be=g.escapeFormulae:typeof g.escapeFormulae=="boolean"&&g.escapeFormulae&&(be=/^[=+\-@\t\r].*$/)}})(),new RegExp(v(X),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return M(null,h,J);if(typeof h[0]=="object")return M(Y||Object.keys(h[0]),h,J)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||Y),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),M(h.fields||[],h.data||[],J);throw new Error("Unable to serialize unrecognized input");function M(U,H,ee){var se="",ie=(typeof U=="string"&&(U=JSON.parse(U)),typeof H=="string"&&(H=JSON.parse(H)),Array.isArray(U)&&0<U.length),ne=!Array.isArray(H[0]);if(ie&&N){for(var Z=0;Z<U.length;Z++)0<Z&&(se+=T),se+=R(U[Z],Z);0<H.length&&(se+=O)}for(var oe=0;oe<H.length;oe++){var ue=(ie?U:H[oe]).length,he=!1,Fe=ie?Object.keys(H[oe]).length===0:H[oe].length===0;if(ee&&!ie&&(he=ee==="greedy"?H[oe].join("").trim()==="":H[oe].length===1&&H[oe][0].length===0),ee==="greedy"&&ie){for(var we=[],Le=0;Le<ue;Le++){var De=ne?U[Le]:Le;we.push(H[oe][De])}he=we.join("").trim()===""}if(!he){for(var ke=0;ke<ue;ke++){0<ke&&!Fe&&(se+=T);var Ht=ie&&ne?U[ke]:ke;se+=R(H[oe][Ht],ke)}oe<H.length-1&&(!ee||0<ue&&!Fe)&&(se+=O)}}return se}function R(U,H){var ee,se,ie;return U==null?"":U.constructor===Date?isNaN(U.getTime())?"":U.toISOString():(ie=!1,be&&typeof U=="string"&&be.test(U)&&(U="'"+U,ie=!0),se=(ee=U.toString()).replace(j,z),(ie=ie||E===!0||typeof E=="function"&&E(U,H)||Array.isArray(E)&&E[H]||((ne,Z)=>{for(var oe=0;oe<Z.length;oe++)if(-1<ne.indexOf(Z[oe]))return!0;return!1})(se,s.BAD_DELIMITERS)||-1<se.indexOf(T)||-1<ee.indexOf(X)||se.charAt(0)===" "||se.charAt(se.length-1)===" ")?X+se+X:se)}},s.RECORD_SEP="",s.UNIT_SEP="",s.BYTE_ORDER_MARK="\uFEFF",s.BAD_DELIMITERS=["\r",`
`,'"',s.BYTE_ORDER_MARK],s.WORKERS_SUPPORTED=!n&&!!e.Worker,s.NODE_STREAM_INPUT=1,s.LocalChunkSize=10485760,s.RemoteChunkSize=5242880,s.DefaultDelimiter=",",s.Parser=y,s.ParserHandle=m,s.NetworkStreamer=p,s.FileStreamer=c,s.StringStreamer=f,s.ReadableStreamStreamer=u,i&&(e.onmessage=function(h){h=h.data,s.WORKER_ID===void 0&&h&&(s.WORKER_ID=h.workerId),typeof h.input=="string"?e.postMessage({workerId:s.WORKER_ID,results:s.parse(h.input,h.config),finished:!0}):(e.File&&h.input instanceof File||h.input instanceof Object)&&(h=s.parse(h.input,h.config))&&e.postMessage({workerId:s.WORKER_ID,results:h,finished:!0})}),(p.prototype=Object.create(d.prototype)).constructor=p,(c.prototype=Object.create(d.prototype)).constructor=c,(f.prototype=Object.create(f.prototype)).constructor=f,(u.prototype=Object.create(d.prototype)).constructor=u,s})});var k={accessToken:GM_getValue("bgmAccessToken")||"",formhash:GM_getValue("bgmFormhash")||"",submitMethod:GM_getValue("bgmSubmitMethod")||"patch",entityType:localStorage.getItem("bgmEntityType")||"subject",csvData:JSON.parse(localStorage.getItem("bgmCsvData")||"null"),currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),totalItems:parseInt(localStorage.getItem("bgmTotalItems")||"0"),processing:!1,paused:!1,currentView:"setup",currentSubjectData:null,currentFieldUpdates:null,currentTagUpdates:null,currentSeriesUpdate:null,currentWcode:null,currentTags:null,currentSeries:null,currentCommitMessage:null,isCommitMessageLocked:localStorage.getItem("bgmIsCommitMessageLocked")==="true"||!1,lockedCommitMessage:localStorage.getItem("bgmLockedCommitMessage")||"",retryCount:JSON.parse(GM_getValue("bgmRetryCount","{}")),currentItemId:null,previousItem:JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),diffViewMode:localStorage.getItem("bgmDiffViewMode")||"split",theme:localStorage.getItem("bgmTheme")||"system"};function In(){GM_setValue("bgmAccessToken",k.accessToken),GM_setValue("bgmFormhash",k.formhash),GM_setValue("bgmSubmitMethod",k.submitMethod),localStorage.setItem("bgmEntityType",k.entityType),localStorage.setItem("bgmCsvData",JSON.stringify(k.csvData)),localStorage.setItem("bgmCurrentIndex",k.currentIndex.toString()),localStorage.setItem("bgmTotalItems",k.totalItems.toString()),GM_setValue("bgmRetryCount",JSON.stringify(k.retryCount)),localStorage.setItem("bgmIsCommitMessageLocked",k.isCommitMessageLocked.toString()),localStorage.setItem("bgmLockedCommitMessage",k.lockedCommitMessage),k.previousItem&&localStorage.setItem("bgmPreviousItem",JSON.stringify(k.previousItem)),localStorage.setItem("bgmDiffViewMode",k.diffViewMode),localStorage.setItem("bgmTheme",k.theme)}function ji(t,e){let n={subject:{wikiPath:`/p1/wiki/subjects/${e}`,historyPath:`/p1/wiki/subjects/${e}/history-summary`,patchBodyKey:"subject",editPagePath:`https://bgm.tv/subject/${e}/edit`},character:{wikiPath:`/p1/wiki/characters/${e}`,historyPath:`/p1/wiki/characters/${e}/history-summary`,patchBodyKey:"character",editPagePath:`https://bgm.tv/character/${e}/edit`},person:{wikiPath:`/p1/wiki/persons/${e}`,historyPath:`/p1/wiki/persons/${e}/history-summary`,patchBodyKey:"person",editPagePath:`https://bgm.tv/person/${e}/edit`}};return n[t]||n.subject}function co(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="block")}function Ui(t,e){let n=document.getElementById("progress-text"),i=document.getElementById("progress-bar");if(n){let o=String(e).length,s=String(t).padStart(o," ");n.textContent=`处理进度: ${s}/${e}`}let r=e>0?t/e*100:0;i&&(i.style.width=`${r}%`)}function ld(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Gi(t){let e=document.getElementById("bgm-loading-overlay"),n=document.getElementById("loading-text");n&&(n.textContent=t),e&&e.classList.add("active")}function Zt(){let t=document.getElementById("bgm-loading-overlay");t&&t.classList.remove("active")}function en(t){let e=document.getElementById("bgm-status-message");e&&(e.classList.remove("show"),e.offsetWidth,e.textContent=t,e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3))}function dd(){let t=document.getElementById("bgm-status-message");t&&t.classList.remove("show")}var zd=ad(wd(),1);var Np={name:"stub",maxLineToIgnoreSyntax:0,setMaxLineToIgnoreSyntax:()=>{},ignoreSyntaxHighlightList:[],setIgnoreSyntaxHighlightList:()=>{},getAST:()=>({children:[]}),processAST:()=>({syntaxFileObject:{},syntaxFileLineNumber:0}),hasRegisteredCurrentLang:()=>!1,getHighlighterEngine:()=>null},gr=Np;var Er;(function(t){t.None="None",t.Up="Up",t.Down="Down",t.Both="Both",t.Short="Short"})(Er||(Er={}));var pa=class{constructor(e,n,i,r,o){this.header=e,this.lines=n,this.unifiedDiffStart=i,this.unifiedDiffEnd=r,this.expansionType=o}equals(e){return this===e?!0:this.header.equals(e.header)&&this.unifiedDiffStart===e.unifiedDiffStart&&this.unifiedDiffEnd===e.unifiedDiffEnd&&this.expansionType===e.expansionType&&this.lines.length===e.lines.length&&this.lines.every((n,i)=>n.equals(e.lines[i]))}},ha=class{constructor(e,n,i,r){this.oldStartLine=e,this.oldLineCount=n,this.newStartLine=i,this.newLineCount=r}toDiffLineRepresentation(){return`@@ -${this.oldStartLine},${this.oldLineCount} +${this.newStartLine},${this.newLineCount} @@`}equals(e){return this.oldStartLine===e.oldStartLine&&this.oldLineCount===e.oldLineCount&&this.newStartLine===e.newStartLine&&this.oldStartLine===e.oldStartLine}};var Nn="--diff-add-content-highlight--",Cn="--diff-del-content-highlight--",Ze;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(Ze||(Ze={}));var Eo=t=>{switch(t){case Ze.LF:return"␊";case Ze.CR:return"␍";case Ze.CRLF:return"␍␊";default:return""}},xd;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(xd||(xd={}));var Cp=1e3;function yd(t){return t.location+t.length}function Ed(t,e,n,i,r){let o=Math.min(e.length,i.length),s=r?yd(e)-1:e.location,l=r?yd(i)-1:i.location,d=r?-1:1,p=0;for(;Math.abs(p)<o&&t[s+p]===n[l+p];)p+=d;return Math.abs(p)}function os(t){return t.trim().length===0||t.length>=Cp}function Wd(t,e){let n=t.text,i=e.text,r=n.slice(-2),o=i.slice(-2),s=r===`\r
`?Ze.CRLF:r.endsWith("\r")?Ze.CR:r.endsWith(`
`)?Ze.LF:Ze.NULL,l=o===`\r
`?Ze.CRLF:o.endsWith("\r")?Ze.CR:o.endsWith(`
`)?Ze.LF:Ze.NULL,d=t.noTrailingNewLine!==e.noTrailingNewLine;return s===l&&!d?{addSymbol:void 0,addString:n,delSymbol:void 0,delString:i}:{addSymbol:d?t.noTrailingNewLine?Ze.NEWLINE:Ze.NORMAL:s,addString:s===Ze.CRLF?n.slice(0,-2):s===Ze.CR||s===Ze.LF?n.slice(0,-1):n,delSymbol:d?e.noTrailingNewLine?Ze.NEWLINE:Ze.NORMAL:l,delString:l===Ze.CRLF?i.slice(0,-2):l===Ze.CR||l===Ze.LF?i.slice(0,-1):i}}function $p(t,e){let n=t.text,i=e.text,{addString:r,delString:o,addSymbol:s,delSymbol:l}=Wd(t,e);if(r===o&&s&&l)return{addRange:{range:{location:r.length,length:n.length-r.length},hasLineChange:!0,newLineSymbol:s},delRange:{range:{location:o.length,length:i.length-o.length},hasLineChange:!0,newLineSymbol:l}};let d={location:0,length:o.length},p={location:0,length:r.length};if(os(n)||os(i))return p.length=0,d.length=0,{addRange:{range:p},delRange:{range:d}};let c=Ed(o,d,r,p,!1);d={location:d.location+c,length:d.length-c},p={location:p.location+c,length:p.length-c};let f=Ed(o,d,r,p,!0);return d.length-=f,p.length-=f,{addRange:{range:p,hasLineChange:(r.slice(0,p.location)+r.slice(p.location+p.length)).trim().length>0},delRange:{range:d,hasLineChange:(o.slice(0,d.location)+o.slice(d.location+d.length)).trim().length>0}}}function Dp(t,e){let{addString:n,addSymbol:i,delString:r,delSymbol:o}=Wd(t,e);if(os(n)||os(r))return{addRange:{range:[],hasLineChange:!!i,newLineSymbol:i},delRange:{range:[],hasLineChange:!!o,newLineSymbol:o}};let s=(0,zd.default)(r,n,0,!0),l=0,d=0,p=s.filter(f=>f[0]!==-1).map(f=>({type:f[0],str:f[1],startIndex:l,endIndex:l+f[1].length-1,length:(l+=f[1].length,f[1].length)})),c=s.filter(f=>f[0]!==1).map(f=>({type:f[0],str:f[1],startIndex:d,endIndex:d+f[1].length-1,length:(d+=f[1].length,f[1].length)}));return{addRange:{range:p,hasLineChange:p.some(f=>f.type===0&&f.str.trim().length>0),newLineSymbol:i},delRange:{range:c,hasLineChange:p.some(f=>f.type===0&&f.str.trim().length>0),newLineSymbol:o}}}var Be;(function(t){t[t.Context=0]="Context",t[t.Add=1]="Add",t[t.Delete=2]="Delete",t[t.Hunk=3]="Hunk"})(Be||(Be={}));var Rt=class t{constructor(e,n,i,r,o,s=!1,l,d,p,c,f,u,m,v){this.text=e,this.type=n,this.originalLineNumber=i,this.oldLineNumber=r,this.newLineNumber=o,this.noTrailingNewLine=s,this.changes=l,this.diffChanges=d,this._diffChanges=p,this.plainTemplate=c,this.plainTemplateMode=f,this.syntaxTemplate=u,this.syntaxTemplateName=m,this.syntaxTemplateMode=v}withNoTrailingNewLine(e){return new t(this.text,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,e)}isIncludeableLine(){return this.type===Be.Add||this.type===Be.Delete}equals(e){return this.text===e.text&&this.type===e.type&&this.originalLineNumber===e.originalLineNumber&&this.oldLineNumber===e.oldLineNumber&&this.newLineNumber===e.newLineNumber&&this.noTrailingNewLine===e.noTrailingNewLine}clone(e){return new t(e,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,this.noTrailingNewLine)}},Xi=t=>t?t.type===Be.Add||t.type===Be.Delete:!1,Tp=/["'&<>]/;function Fp(t){let e=""+t,n=Tp.exec(e);if(!n)return e;let i="",r,o,s=0;for(o=n.index;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}s!==o&&(i+=e.slice(s,o)),s=o+1,i+=r}return s!==o?i+e.slice(s,o):i}var ya=!1,as=t=>t,Ad=as,Ld=as;var Ir=()=>ya,Sr=t=>ya&&as!==Ad?Ad(t):t,Mp=t=>ya&&as!==Ld?Ld(t):t,Hp=!1,Bp=()=>Hp;var Rp=!0,ma=()=>Rp;var Nr=t=>Fp(t).replace(/\n/g,"").replace(/\r/g,""),Ao=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="relative")return;let i=t.changes;if(!i||!i.hasLineChange||!e)return;let r=Ir()?Sr:Nr,o=i.range,s=e.slice(0,o.location),l=e.slice(o.location,o.location+o.length),d=e.slice(o.location+o.length),p=l.includes(`
`),c=i.newLineSymbol,f=`<span data-range-start="${o.location}" data-range-end="${o.location+o.length}">`;f+=r(s),f+=`<span data-diff-highlight style="background-color: var(${n==="add"?Nn:Cn});border-radius: 0.2em;">`,f+=p?`${r(l)}<span data-newline-symbol>${Eo(c)}</span>`:r(l),f+="</span>",f+=r(d),f+="</span>",t.plainTemplate=f,t.plainTemplateMode="relative"},kd=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="fast-diff")return;let i=t.diffChanges;if(!i||!i.hasLineChange||!e)return;let r=Ir()?Sr:Nr,o="";i.range.forEach(({type:s,str:l,startIndex:d,endIndex:p},c,f)=>{let u=c===f.length-1;s===0?(o+=`<span>${r(l)}`,o+=u&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight style="background-color: var(${n==="add"?Nn:Cn});border-radius: 0.2em;">${Eo(i.newLineSymbol)}</span>`:"",o+="</span>"):(o+=`<span data-range-start="${d}" data-range-end="${p}">`,o+=`<span data-diff-highlight style="background-color: var(${n==="add"?Nn:Cn});border-radius: 0.2em;">${r(l)}`,o+=u&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight>${Eo(i.newLineSymbol)}</span>`:"",o+="</span></span>")}),t.plainTemplate=o,t.plainTemplateMode="fast-diff"},Lo=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="relative"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let o=e.changes;if(!o||!o.hasLineChange)return;let s=Ir()?Sr:Nr,l=o.range,d=`<span data-range-start="${l.location}" data-range-end="${l.location+l.length}">`;(r=n?.nodeList)===null||r===void 0||r.forEach(({node:p,wrapper:c})=>{var f,u,m,v,y,w;if(p.endIndex<l.location||l.location+l.length<p.startIndex)d+=`<span data-start="${p.startIndex}" data-end="${p.endIndex}" class="${(u=((f=c?.properties)===null||f===void 0?void 0:f.className)||[])===null||u===void 0?void 0:u.join(" ")}" style="${((m=c?.properties)===null||m===void 0?void 0:m.style)||""}">${s(p.value)}</span>`;else{let b=l.location-p.startIndex,A=b<0?0:b,x=p.value.slice(0,A),S=p.value.slice(A,b+l.length),L=p.value.slice(b+l.length),h=x.length||l.location===p.startIndex,g=L.length||p.endIndex===l.location+l.length-1,E=S.includes(`
`);d+=`<span data-start="${p.startIndex}" data-end="${p.endIndex}" class="${(y=((v=c?.properties)===null||v===void 0?void 0:v.className)||[])===null||y===void 0?void 0:y.join(" ")}" style="${((w=c?.properties)===null||w===void 0?void 0:w.style)||""}">${s(x)}<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-top-left-radius: ${h?"0.2em":"0"};border-bottom-left-radius: ${h?"0.2em":"0"};border-top-right-radius: ${g||E?"0.2em":"0"};border-bottom-right-radius: ${g||E?"0.2em":"0"}">${E?`${s(S)}<span data-newline-symbol>${Eo(o.newLineSymbol)}</span>`:s(S)}</span>${s(L)}</span>`}}),d+="</span>",e.syntaxTemplate=d,e.syntaxTemplateMode="relative",e.syntaxTemplateName=t._getHighlighterName()},Id=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r,o,s;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="fast-diff"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let l=e.diffChanges,d=e._diffChanges;if(!l||!l.hasLineChange)return;let p=Ir()?Sr:Nr,c="",f=((r=l?.range)===null||r===void 0?void 0:r.filter(v=>v.type!==0))||[],u=((o=d?.range)===null||o===void 0?void 0:o.filter(v=>v.type!==0))||[],m=0;(s=n?.nodeList)===null||s===void 0||s.forEach(({node:v,wrapper:y},w,b)=>{var A,x,S;c+=`<span data-start="${v.startIndex}" data-end="${v.endIndex}" class="${(x=((A=y?.properties)===null||A===void 0?void 0:A.className)||[])===null||x===void 0?void 0:x.join(" ")}" style="${((S=y?.properties)===null||S===void 0?void 0:S.style)||""}">`;let L=f[m],h=f.length===0&&u.length===0,g=w===b.length-1;for(let E=0;E<v.value.length;E++){let N=v.startIndex+E,T=v.value[E],O=E===v.value.length-1,X=g&&E===v.value.length-1;if(L)if(N<L.startIndex)c+=p(T);else if(N===L.startIndex)L.endIndex<=v.endIndex?c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-radius: 0.2em;">`:c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-top-left-radius: 0.2em;border-bottom-left-radius: 0.2em;">`,c+=p(T),(O||L.startIndex===L.endIndex)&&(c+="</span>"),L.endIndex===N&&(m++,L=f[m]);else if(N<L.endIndex){if(E===0){let z=L.startIndex>=v.startIndex&&L.endIndex<=v.endIndex,J=L.endIndex<=v.endIndex;c+=z?`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-radius: 0.2em;">`:J?`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`:`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});">`}c+=p(T),O&&(c+="</span>")}else N===L.endIndex&&(L.startIndex>=v.startIndex||E===0&&(c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`),c+=p(T),c+="</span>",m++,L=f[m]);else c+=p(T),h&&X&&l.newLineSymbol&&(c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:Cn});border-radius: 0.2em;">`,c+=`<span data-newline-symbol>${Eo(l.newLineSymbol)}</span></span>`)}c+="</span>"}),e.syntaxTemplate=c,e.syntaxTemplateMode="fast-diff",e.syntaxTemplateName=t._getHighlighterName()},Ea=t=>{var e;let n="",i=Ir()?Sr:Nr;return(e=t?.nodeList)===null||e===void 0||e.forEach(({node:r,wrapper:o})=>{var s,l,d;n+=`<span data-start="${r.startIndex}" data-end="${r.endIndex}" class="${(l=((s=o?.properties)===null||s===void 0?void 0:s.className)||[])===null||l===void 0?void 0:l.join(" ")}" style="${((d=o?.properties)===null||d===void 0?void 0:d.style)||""}">${i(r.value)}</span>`}),n},Aa=t=>t?(Ir()?Sr:Nr)(t):"",Op=40;function Pp(t,e){throw new Error(e)}function jp(t){var e,n;if(t.length===0)return 0;for(let i=t.length-1;i>=0;i--){let r=t[i];for(let o=r.lines.length-1;o>=0;o--){let s=r.lines[o];if(s.type===Be.Hunk)continue;let l=(e=s.newLineNumber)!==null&&e!==void 0?e:0,d=(n=s.oldLineNumber)!==null&&n!==void 0?n:0;return l>d?l:d}}return 0}function Up(t,e,n){let i=n===null?1/0:e.oldStartLine-n.header.oldStartLine-n.header.oldLineCount;return t===0?e.oldStartLine>1&&e.newStartLine>1?Er.Up:Er.None:i<=Op?Er.Short:Er.Both}var Qd=(t,e)=>{let n=[];for(let i=0;i<t;i++)n.push(e(i));return n},Sd=t=>{let e=t.lastIndexOf(".");return t.slice(e+1)},Nd=(t,e,{diffFile:n,getAdditionRaw:i,getDeletionRaw:r,getAdditionSyntax:o,getDeletionSyntax:s})=>{if(t.length===e.length){let l=t.length;for(let d=0;d<l;d++){let p=t[d],c=e[d];if(!p.changes||!c.changes){let u=Rt.prototype.clone.call(p,i(p.newLineNumber)||p.text||""),m=Rt.prototype.clone.call(c,r(c.oldLineNumber)||c.text||""),{addRange:v,delRange:y}=$p(u,m);p.changes=v,c.changes=y}let f=ma();if(!Bp())f&&(Ao({diffLine:p,rawLine:i(p.newLineNumber)||"",operator:"add"}),Ao({diffLine:c,rawLine:r(c.oldLineNumber)||"",operator:"del"}),Lo({diffFile:n,diffLine:p,syntaxLine:o(p.newLineNumber)||null,operator:"add"}),Lo({diffFile:n,diffLine:c,syntaxLine:s(c.oldLineNumber)||null,operator:"del"}));else{let u=Rt.prototype.clone.call(p,i(p.newLineNumber)||p.text||""),m=Rt.prototype.clone.call(c,r(c.oldLineNumber)||c.text||""),{addRange:v,delRange:y}=Dp(u,m);p.diffChanges=v,c.diffChanges=y,p._diffChanges=y,c._diffChanges=v,f&&(kd({diffLine:p,rawLine:i(p.newLineNumber)||"",operator:"add"}),kd({diffLine:c,rawLine:r(c.oldLineNumber)||"",operator:"del"}),Id({diffFile:n,diffLine:p,syntaxLine:o(p.newLineNumber)||null,operator:"add"}),Id({diffFile:n,diffLine:c,syntaxLine:s(c.oldLineNumber)||null,operator:"del"}))}}}},Gp=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,zp=/[\u202A-\u202E]|[\u2066-\u2069]/,Vd="+",Yd="-",Jd=" ",qd="\\",Kd=`
`,Wp=new Set([Vd,Yd,Jd,qd,Kd]),ga=class{constructor(){Object.defineProperty(this,"__v_skip",{value:!0}),this.reset()}reset(){this.ls=0,this.le=-1,this.text=""}nextLine(){return this.ls=this.le+1,this.ls>=this.text.length?!1:(this.le=this.text.indexOf(`
`,this.ls),this.le===-1&&(this.le=this.text.length),this.ls!==this.le)}readLine(e){return e?this.nextLine()?this.text.substring(this.ls,this.le):null:this.nextLine()?this.text.substring(this.ls+1,this.le+1):this.text.length>this.ls?`
`:null}lineStartsWith(e){return this.text.startsWith(e,this.ls)}lineEndsWith(e){return this.text.endsWith(e,this.le)}peek(){let e=this.le+1;return e<this.text.length?this.text[e]:null}parseDiffHeader(){let e=!1;for(;this.nextLine();){if(this.lineStartsWith("Binary files ")&&this.lineEndsWith("differ"))return{isBinary:!0};if(this.lineStartsWith("---")&&(e=!0),this.lineStartsWith("+++"))return{isBinary:!1}}return null}numberFromGroup(e,n,i=null){let r=e[n];if(!r){if(!i)throw new Error(`Group ${n} missing from regexp match and no defaultValue was provided`);return i}let o=parseInt(r,10);if(isNaN(o))throw new Error(`Could not parse capture group ${n} into number: ${r}`);return o}parseHunkHeader(e){let n=Gp.exec(e);if(!n)throw new Error("Invalid hunk header format");let i=this.numberFromGroup(n,1),r=this.numberFromGroup(n,2,1),o=this.numberFromGroup(n,3),s=this.numberFromGroup(n,4,1);return new ha(i,r,o,s)}parseLinePrefix(e){return e&&e.length&&Wp.has(e[0])?e[0]:null}parseHunk(e,n,i){let r=this.readLine(!0);if(!r)throw new Error("Expected hunk header but reached end of diff");let o=this.parseHunkHeader(r),s=new Array;s.push(new Rt(r,Be.Hunk,1,null,null));let l,d=o.oldStartLine,p=o.newStartLine,c=e;for(;l=this.parseLinePrefix(this.peek());){let f=this.readLine(!1);if(f===null)throw new Error("Expected unified diff line but reached end of diff");if(l===qd){if(f.length<12)throw new Error('Expected "no newline at end of file" marker to be at least 12 bytes long');let m=s.length-1,v=s[m];s[m]=v.withNoTrailingNewLine(!0);continue}c++;let u;if(l===Vd)u=new Rt(f,Be.Add,c,null,p++);else if(l===Yd)u=new Rt(f,Be.Delete,c,d++,null);else if(l===Jd||l===Kd)u=new Rt(f,Be.Context,c,d++,p++);else return Pp(l,`Unknown DiffLinePrefix: ${l}`);s.push(u)}if(s.length===1)throw new Error("Malformed diff, empty hunk");return new pa(o,s,e,e+s.length-1,Up(n,o,i))}parse(e){this.text=e;try{let n=this.parseDiffHeader(),i=this.le,r=this.text.substring(0,i);if(!n)return{header:r,contents:"",hunks:[],isBinary:!1,maxLineNumber:0,hasHiddenBidiChars:!1};if(n.isBinary)return{header:r,contents:"",hunks:[],isBinary:!0,maxLineNumber:0,hasHiddenBidiChars:!1};let o=new Array,s=0,l=null;for(;this.peek();){let p=this.parseHunk(s,o.length,l);o.push(p),l=p,s+=p.lines.length}let d=this.text.substring(i+1,this.le).replace(/\n\\ No newline at end of file/g,"");return{header:r,contents:d,hunks:o,isBinary:n.isBinary,maxLineNumber:jp(o),hasHiddenBidiChars:zp.test(e)}}finally{this.reset()}}},Qp=new ga;function _(t,e,n,i){if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?i:n==="a"?i.call(t):i?i.value:e.get(t)}function W(t,e,n,i,r){if(i==="m")throw new TypeError("Private method is not writable");if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return i==="a"?r.call(t,n):r?r.value=n:e.set(t,n),n}var is,_o,Ar,va,_a=class extends Map{constructor(){super(...arguments),is.add(this),_o.set(this,[]),Ar.set(this,30)}get maxLength(){return _(this,Ar,"f")}setMaxLength(e){W(this,Ar,e,"f"),_(this,is,"m",va).call(this)}set(e,n){return _(this,Ar,"f")<=0?this:this.has(e)?this:(_(this,_o,"f").push(e),_(this,is,"m",va).call(this),super.set(e,n))}};_o=new WeakMap,Ar=new WeakMap,is=new WeakSet,va=function(){for(;_(this,_o,"f").length>_(this,Ar,"f");){let e=_(this,_o,"f").shift();e&&this.delete(e)}};var Xd,ho,Vp,Li=new _a;Li.setMaxLength(50);Li.name="@git-diff-view/core";var da=new Set,ko=class t{static createInstance(e){let n=new t(e?.raw,e?.lang,e?.fileName);return n.ast=e?.ast,n.theme=e?.theme,n.rawFile=e?.rawFile||{},n.plainFile=e?.plainFile||{},n.hasDoRaw=e?.hasDoRaw,n.rawLength=e?.rawLength,n.syntaxFile=e?.syntaxFile||{},n.hasDoSyntax=e?.hasDoSyntax,n.syntaxLength=e?.syntaxLength,n.highlighterName=e?.highlighterName,n.highlighterType=e?.highlighterType,n.maxLineNumber=e?.maxLineNumber,n}constructor(e,n,i){Xd.add(this),this.raw=e,this.lang=n,this.fileName=i,ho.set(this,""),this.rawFile={},this.hasDoRaw=!1,this.syntaxFile={},this.plainFile={},this.hasDoSyntax=!1,this.maxLineNumber=0,this.raw=Mp(e),Object.defineProperty(this,"__v_skip",{value:!0}),this.initId()}initId(){let e="-file--"+Math.random().toString().slice(2);for(;da.has(e);)e="-file--"+Math.random().toString().slice(2);da.add(e),W(this,ho,e,"f")}getId(){return _(this,ho,"f")}clearId(){da.delete(_(this,ho,"f"))}doSyntax({registerHighlighter:e,theme:n}){if(!this.raw)return;let i=e||gr;if(this.rawLength&&this.rawLength>i.maxLineToIgnoreSyntax)return;let r=i;try{i.hasRegisteredCurrentLang(this.lang)||(r=gr)}catch{r=gr}if(this.hasDoSyntax&&r.name===this.highlighterName&&r.type===this.highlighterType&&(this.theme===n||r.type==="class")||(this.ast=r.getAST(this.raw,this.fileName,this.lang,n),this.theme=n,!this.ast))return;let{syntaxFileObject:o,syntaxFileLineNumber:s}=r.processAST(this.ast);ma()&&Object.values(o).forEach(l=>{l.template=Ea(l)}),this.syntaxFile=o,this.syntaxLength=s,this.highlighterName=r.name,this.highlighterType=r.type,this.hasDoSyntax=!0}doRaw(){if(!this.raw||this.hasDoRaw)return;let n=this.raw.split(`
`);this.rawLength=n.length,this.maxLineNumber=n.length,this.rawFile={},this.plainFile={};let i=ma();for(let r=0;r<n.length;r++)this.rawFile[r+1]=r<n.length-1?n[r]+`
`:n[r],this.plainFile[r+1]={value:this.rawFile[r+1],template:i?Aa(this.rawFile[r+1]):void 0};this.hasDoRaw=!0}};ho=new WeakMap,Xd=new WeakSet,Vp=function(){this.rawLength&&this.syntaxLength&&(this.rawLength!==this.syntaxLength&&console.warn("[@git-diff-view/core] The rawLength does not match the syntaxLength."),Object.values(this.syntaxFile).forEach(({value:e,lineNumber:n})=>{e!==this.rawFile[n]&&console.warn("[@git-diff-view/core] Content mismatch detected at line "+n+": "+e+" !== "+this.rawFile[n])}))};function vr(t,e,n,i,r){let o=t+"--0.1.7--"+n+"--"+e;r&&(o=r+"--0.1.7--"+n+"--"+e);let s=t+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e;if(r&&(s=r+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e),Li.has(o))return Li.get(o);if(Li.has(s)){let d=Li.get(s);if(d?.highlighterType==="class")return d}let l=new ko(t,e,i);return Li.set(o,l),l}var ls=Li;var ss;(function(t){t[t.hunk=1]="hunk",t[t.content=2]="content",t[t.widget=3]="widget",t[t.extend=4]="extend"})(ss||(ss={}));var B;(function(t){t[t.old=1]="old",t[t.new=2]="new"})(B||(B={}));var ds=t=>{let e=t.splitLineLength,n=[];return Qd(e,i=>{let r=t.getSplitLeftLine(i),o=t.getSplitRightLine(i);!r?.isHidden&&!o?.isHidden&&n.push({type:ss.content,index:i,lineNumber:i+1,splitLine:{left:r,right:o}})}),n};var La=t=>{let e=t.unifiedLineLength,n=[];return Qd(e,i=>{let r=t.getUnifiedLine(i);r.isHidden||n.push({type:ss.content,index:i,lineNumber:i+1,unifiedLine:r})}),n},Yp=(t,e,n)=>{let i=t.getSplitLineByLineNumber(e,n),r=t.getUnifiedLineByLineNumber(e,n);return{split:!i||i.isHidden,unified:!r||r.isHidden}},Ne,qe,Ke,Si,Ni,Vn,Yn,Vi,Yi,Ji,qi,Jn,qn,$n,Dn,$t,nt,rt,Je,ot,hi,br,wr,xr,yr,mo,Qi,go,bo,wo,ki,Ii,rs,Bt,zi,Wi,vo,mi,Zd,ef,ba,tf,Jp,wa,xa,Cd,nf,Lr,kr,xo,yo,$d,Dd,Pe=40;var fa=new Set,Ki=class t{static createInstance(e,n){var i,r,o,s,l,d;let p=new t(((i=e?.oldFile)===null||i===void 0?void 0:i.fileName)||"",((r=e?.oldFile)===null||r===void 0?void 0:r.content)||"",((o=e?.newFile)===null||o===void 0?void 0:o.fileName)||"",((s=e?.newFile)===null||s===void 0?void 0:s.content)||"",e?.hunks||[],((l=e?.oldFile)===null||l===void 0?void 0:l.fileLang)||"",((d=e?.newFile)===null||d===void 0?void 0:d.fileLang)||"");return n&&(n.isFullMerge?p._mergeFullBundle(n):p.mergeBundle(n)),p}constructor(e,n,i,r,o,s,l,d){Ne.add(this),this.uuid=d,qe.set(this,void 0),Ke.set(this,void 0),Si.set(this,void 0),Ni.set(this,void 0),Vn.set(this,void 0),Yn.set(this,void 0),Vi.set(this,void 0),Yi.set(this,void 0),Ji.set(this,void 0),qi.set(this,void 0),Jn.set(this,void 0),qn.set(this,void 0),$n.set(this,void 0),Dn.set(this,void 0),$t.set(this,[]),nt.set(this,[]),rt.set(this,void 0),Je.set(this,[]),ot.set(this,void 0),hi.set(this,[]),br.set(this,!1),wr.set(this,!1),xr.set(this,!1),yr.set(this,!1),mo.set(this,0),Qi.set(this,!1),go.set(this,!1),bo.set(this,!1),wo.set(this,!1),ki.set(this,void 0),Ii.set(this,void 0),rs.set(this,!1),Bt.set(this,"light"),zi.set(this,{state:!1}),Wi.set(this,{state:!1}),this._version_="0.1.7",this._oldFileName="",this._oldFileContent="",this._oldFileLang="",this._newFileName="",this._newFileContent="",this._newFileLang="",this._diffList=[],this.diffLineLength=0,this.splitLineLength=0,this.unifiedLineLength=0,this.fileLineLength=0,this.additionLength=0,this.deletionLength=0,this.hasSomeLineCollapsed=!1,vo.set(this,""),mi.set(this,new Map),this.getSplitLeftLine=c=>_(this,$t,"f")[c],this.getSplitLineByLineNumber=(c,f)=>{var u,m;return f===B.old?(u=_(this,$t,"f"))===null||u===void 0?void 0:u.find(v=>v.lineNumber===c):(m=_(this,nt,"f"))===null||m===void 0?void 0:m.find(v=>v.lineNumber===c)},this.getSplitLineIndexByLineNumber=(c,f)=>{var u,m;return f===B.old?(u=_(this,$t,"f"))===null||u===void 0?void 0:u.findIndex(v=>v.lineNumber===c):(m=_(this,nt,"f"))===null||m===void 0?void 0:m.findIndex(v=>v.lineNumber===c)},this.getSplitRightLine=c=>_(this,nt,"f")[c],this.getSplitHunkLine=c=>{var f;return(f=_(this,rt,"f"))===null||f===void 0?void 0:f[c]},this.onSplitHunkExpand=(c,f,u=!0)=>{var m,v,y;if(!this.getExpandEnabled())return;let w=(m=_(this,rt,"f"))===null||m===void 0?void 0:m[f];if(!(!w||!w.splitInfo)){if(c==="all"){for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.endHiddenIndex;b++){let A=_(this,$t,"f")[b],x=_(this,nt,"f")[b];A?.isHidden&&(A.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,...w.hunkInfo,plainText:w.text,startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(c==="down"){for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.startHiddenIndex+Pe;b++){let A=_(this,$t,"f")[b],x=_(this,nt,"f")[b];A?.isHidden&&(A.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.isLast?w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+Pe}:w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+Pe,plainText:`@@ -${w.splitInfo.oldStartIndex},${w.splitInfo.oldLength} +${w.splitInfo.newStartIndex},${w.splitInfo.newLength}`}}else if(c==="down-all"){for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.endHiddenIndex;b++){let A=_(this,$t,"f")[b],x=_(this,nt,"f")[b];A?.isHidden&&(A.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(c==="up"){if(w.isLast)return;for(let L=w.splitInfo.endHiddenIndex-Pe;L<w.splitInfo.endHiddenIndex;L++){let h=_(this,$t,"f")[L],g=_(this,nt,"f")[L];h?.isHidden&&(h.isHidden=!1),g?.isHidden&&(g.isHidden=!1)}let b=w.splitInfo.oldStartIndex-Pe,A=w.splitInfo.oldLength+Pe,x=w.splitInfo.newStartIndex-Pe,S=w.splitInfo.newLength+Pe;w.splitInfo={...w.splitInfo,endHiddenIndex:w.splitInfo.endHiddenIndex-Pe,oldStartIndex:b,oldLength:A,newStartIndex:x,newLength:S,plainText:`@@ -${b},${A} +${x},${S}`},(v=_(this,rt,"f"))===null||v===void 0||delete v[f],_(this,rt,"f")[w.splitInfo.endHiddenIndex]=w}else if(c==="up-all"){if(w.isLast)return;for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.endHiddenIndex;b++){let A=_(this,$t,"f")[b],x=_(this,nt,"f")[b];A?.isHidden&&(A.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",endHiddenIndex:w.splitInfo.startHiddenIndex},(y=_(this,rt,"f"))===null||y===void 0||delete y[f],_(this,rt,"f")[w.splitInfo.endHiddenIndex]=w}u&&this.notifyAll()}},this.getUnifiedLine=c=>_(this,Je,"f")[c],this.getUnifiedLineByLineNumber=(c,f)=>{var u,m;return f===B.old?(u=_(this,Je,"f"))===null||u===void 0?void 0:u.find(v=>v.oldLineNumber===c):(m=_(this,Je,"f"))===null||m===void 0?void 0:m.find(v=>v.newLineNumber===c)},this.getUnifiedLineIndexByLineNumber=(c,f)=>{var u,m;return f===B.old?(u=_(this,Je,"f"))===null||u===void 0?void 0:u.findIndex(v=>v.oldLineNumber===c):(m=_(this,Je,"f"))===null||m===void 0?void 0:m.findIndex(v=>v.newLineNumber===c)},this.getUnifiedHunkLine=c=>{var f;return(f=_(this,ot,"f"))===null||f===void 0?void 0:f[c]},this.onUnifiedHunkExpand=(c,f,u=!0)=>{var m,v,y,w;if(!this.getExpandEnabled())return;let b=(m=_(this,ot,"f"))===null||m===void 0?void 0:m[f];if(!(!b||!b.unifiedInfo)){if(c==="all"){for(let A=b.unifiedInfo.startHiddenIndex;A<b.unifiedInfo.endHiddenIndex;A++){let x=(v=_(this,Je,"f"))===null||v===void 0?void 0:v[A];x?.isHidden&&(x.isHidden=!1)}b.unifiedInfo={...b.unifiedInfo,...b.hunkInfo,plainText:b.text,startHiddenIndex:b.unifiedInfo.endHiddenIndex}}else if(c==="down"){for(let A=b.unifiedInfo.startHiddenIndex;A<b.unifiedInfo.startHiddenIndex+Pe;A++){let x=_(this,Je,"f")[A];x?.isHidden&&(x.isHidden=!1)}b.isLast?b.unifiedInfo={...b.unifiedInfo,startHiddenIndex:b.unifiedInfo.startHiddenIndex+Pe}:b.unifiedInfo={...b.unifiedInfo,startHiddenIndex:b.unifiedInfo.startHiddenIndex+Pe,plainText:`@@ -${b.unifiedInfo.oldStartIndex},${b.unifiedInfo.oldLength} +${b.unifiedInfo.newStartIndex},${b.unifiedInfo.newLength}`}}else if(c==="down-all"){for(let A=b.unifiedInfo.startHiddenIndex;A<b.unifiedInfo.endHiddenIndex;A++){let x=_(this,Je,"f")[A];x?.isHidden&&(x.isHidden=!1)}b.unifiedInfo={...b.unifiedInfo,plainText:"",startHiddenIndex:b.unifiedInfo.endHiddenIndex}}else if(c==="up"){if(b.isLast)return;for(let h=b.unifiedInfo.endHiddenIndex-Pe;h<b.unifiedInfo.endHiddenIndex;h++){let g=_(this,Je,"f")[h];g?.isHidden&&(g.isHidden=!1)}let A=b.unifiedInfo.oldStartIndex-Pe,x=b.unifiedInfo.oldLength+Pe,S=b.unifiedInfo.newStartIndex-Pe,L=b.unifiedInfo.newLength+Pe;b.unifiedInfo={...b.unifiedInfo,endHiddenIndex:b.unifiedInfo.endHiddenIndex-Pe,oldStartIndex:A,oldLength:x,newStartIndex:S,newLength:L,plainText:`@@ -${A},${x} +${S},${L}`},(y=_(this,ot,"f"))===null||y===void 0||delete y[f],_(this,ot,"f")[b.unifiedInfo.endHiddenIndex]=b}else if(c==="up-all"){if(b.isLast)return;for(let A=b.unifiedInfo.startHiddenIndex;A<b.unifiedInfo.endHiddenIndex;A++){let x=_(this,Je,"f")[A];x?.isHidden&&(x.isHidden=!1)}b.unifiedInfo={...b.unifiedInfo,plainText:"",endHiddenIndex:b.unifiedInfo.startHiddenIndex},(w=_(this,ot,"f"))===null||w===void 0||delete w[f],_(this,ot,"f")[b.unifiedInfo.endHiddenIndex]=b}u&&this.notifyAll()}},this.onAllExpand=c=>{this.getExpandEnabled()&&(c==="split"?(Object.keys(_(this,rt,"f")||{}).forEach(f=>{this.onSplitHunkExpand("all",+f,!1)}),_(this,zi,"f").state=!0):(Object.keys(_(this,ot,"f")||{}).forEach(f=>{this.onUnifiedHunkExpand("all",+f,!1)}),_(this,Wi,"f").state=!0),this.notifyAll())},this.onAllCollapse=c=>{this.getExpandEnabled()&&(c==="split"?(Object.values(_(this,$t,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(_(this,nt,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(_(this,rt,"f")||{}).forEach(f=>{f.splitInfo&&(f.splitInfo={...f.splitInfo,oldStartIndex:f.splitInfo._oldStartIndex,oldLength:f.splitInfo._oldLength,newStartIndex:f.splitInfo._newStartIndex,newLength:f.splitInfo._newLength,startHiddenIndex:f.splitInfo._startHiddenIndex,endHiddenIndex:f.splitInfo._endHiddenIndex,plainText:f.splitInfo._plainText})}),Object.keys(_(this,rt,"f")||{}).forEach(f=>{let u=_(this,rt,"f")[f];u.splitInfo&&u.splitInfo.endHiddenIndex!==+f&&(delete _(this,rt,"f")[f],_(this,rt,"f")[u.splitInfo.endHiddenIndex]=u)}),_(this,zi,"f").state=!1):(Object.values(_(this,Je,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(_(this,ot,"f")||{}).forEach(f=>{f.unifiedInfo&&(f.unifiedInfo={...f.unifiedInfo,oldStartIndex:f.unifiedInfo._oldStartIndex,oldLength:f.unifiedInfo._oldLength,newStartIndex:f.unifiedInfo._newStartIndex,newLength:f.unifiedInfo._newLength,startHiddenIndex:f.unifiedInfo._startHiddenIndex,endHiddenIndex:f.unifiedInfo._endHiddenIndex,plainText:f.unifiedInfo._plainText})}),Object.keys(_(this,ot,"f")||{}).forEach(f=>{let u=_(this,ot,"f")[f];u.unifiedInfo&&u.unifiedInfo.endHiddenIndex!==+f&&(delete _(this,ot,"f")[f],_(this,ot,"f")[u.unifiedInfo.endHiddenIndex]=u)}),_(this,Wi,"f").state=!1),this.notifyAll())},this.getOldFileContent=()=>{var c;return(c=_(this,qe,"f"))===null||c===void 0?void 0:c.raw},this.getNewFileContent=()=>{var c;return(c=_(this,Ke,"f"))===null||c===void 0?void 0:c.raw},this.getOldPlainLine=c=>{var f;return(f=_(this,Ji,"f"))===null||f===void 0?void 0:f[c]},this.getOldSyntaxLine=c=>{var f;return(f=_(this,Jn,"f"))===null||f===void 0?void 0:f[c]},this.getNewPlainLine=c=>{var f;return(f=_(this,qi,"f"))===null||f===void 0?void 0:f[c]},this.getNewSyntaxLine=c=>{var f;return(f=_(this,qn,"f"))===null||f===void 0?void 0:f[c]},this.subscribe=c=>(_(this,hi,"f").push(c),()=>{W(this,hi,_(this,hi,"f").filter(f=>f!==c),"f")}),this.notifyAll=c=>{var f;W(this,mo,(f=_(this,mo,"f"),f++,f),"f"),_(this,hi,"f").forEach(u=>{c&&u.isSyncExternal||u()}),_(this,mi,"f").forEach((u,m)=>{m.notifyAll(!0)})},this.getUpdateCount=()=>_(this,mo,"f"),this.getExpandEnabled=()=>!_(this,Qi,"f")&&!_(this,go,"f"),this.getBundle=()=>{let c=_(this,br,"f"),f=_(this,wr,"f"),u=_(this,xr,"f"),m=_(this,yr,"f"),v=_(this,Vi,"f"),y=_(this,Vn,"f"),w=_(this,Ji,"f"),b=_(this,Jn,"f"),A=_(this,$n,"f"),x=_(this,Yi,"f"),S=_(this,Yn,"f"),L=_(this,qi,"f"),h=_(this,qn,"f"),g=_(this,Dn,"f"),E=this.splitLineLength,N=this.unifiedLineLength,T=this.fileLineLength,O=this.additionLength,X=this.deletionLength,z=_(this,Qi,"f"),J=_(this,go,"f"),Y=_(this,ki,"f"),be=_(this,Ii,"f"),j=this.hasSomeLineCollapsed,M=_(this,zi,"f"),R=_(this,Wi,"f"),U=_(this,$t,"f"),H=_(this,nt,"f"),ee=_(this,rt,"f"),se=_(this,Je,"f"),ie=_(this,ot,"f"),ne=this._version_,Z=_(this,Bt,"f");return{hasInitRaw:c,hasInitSyntax:f,hasBuildSplit:u,hasBuildUnified:m,oldFileLines:v,oldFileDiffLines:y,oldFilePlainLines:w,oldFileSyntaxLines:b,oldFilePlaceholderLines:A,newFileLines:x,newFileDiffLines:S,newFilePlainLines:L,newFileSyntaxLines:h,newFilePlaceholderLines:g,splitLineLength:E,unifiedLineLength:N,fileLineLength:T,additionLength:O,deletionLength:X,splitLeftLines:U,splitRightLines:H,splitHunkLines:ee,unifiedLines:se,unifiedHunkLines:ie,highlighterName:Y,highlighterType:be,composeByDiff:z,composeByRange:J,hasSomeLineCollapsed:j,hasExpandSplitAll:M,hasExpandUnifiedAll:R,version:ne,theme:Z,isFullMerge:!1}},this.mergeBundle=(c,f=!0)=>{W(this,br,c.hasInitRaw,"f"),W(this,wr,c.hasInitSyntax,"f"),W(this,xr,c.hasBuildSplit,"f"),W(this,yr,c.hasBuildUnified,"f"),W(this,Qi,c.composeByDiff,"f"),W(this,go,c.composeByRange,"f"),W(this,ki,c.highlighterName,"f"),W(this,Ii,c.highlighterType,"f"),W(this,Vi,c.oldFileLines,"f"),W(this,Vn,c.oldFileDiffLines,"f"),W(this,Ji,c.oldFilePlainLines,"f"),W(this,Jn,c.oldFileSyntaxLines,"f"),W(this,$n,c.oldFilePlaceholderLines,"f"),W(this,Yi,c.newFileLines,"f"),W(this,Yn,c.newFileDiffLines,"f"),W(this,qi,c.newFilePlainLines,"f"),W(this,qn,c.newFileSyntaxLines,"f"),W(this,Dn,c.newFilePlaceholderLines,"f"),this.splitLineLength=c.splitLineLength,this.unifiedLineLength=c.unifiedLineLength,this.fileLineLength=c.fileLineLength,this.additionLength=c.additionLength,this.deletionLength=c.deletionLength,this.hasSomeLineCollapsed=c.hasSomeLineCollapsed,W(this,zi,c.hasExpandSplitAll,"f"),W(this,Wi,c.hasExpandUnifiedAll,"f"),W(this,$t,c.splitLeftLines,"f"),W(this,nt,c.splitRightLines,"f"),W(this,rt,c.splitHunkLines,"f"),W(this,Je,c.unifiedLines,"f"),W(this,ot,c.unifiedHunkLines,"f"),W(this,Bt,c.theme,"f"),W(this,bo,!0,"f"),W(this,rs,!0,"f"),f&&this.notifyAll()},this.generateInstanceFromLineNumberRange=(c,f,u=B.new)=>{if(c>=f)return this;let m=this.getSplitLineIndexByLineNumber(c,u),v=this.getSplitLineIndexByLineNumber(f,u),y=this.getUnifiedLineIndexByLineNumber(c,u),w=this.getUnifiedLineIndexByLineNumber(f,u),b=[],A=[],x=[];for(let L=m;L<=v;L++){let h=this.getSplitLeftLine(L),g=this.getSplitRightLine(L);!h?.value&&!g?.value||(b.push({...h,isHidden:!1}),A.push({...g,isHidden:!1}))}for(let L=y;L<=w;L++){let h=this.getUnifiedLine(L);h?.value&&x.push({...h,isHidden:!1})}return t.createInstance({},{...this._getFullBundle(),composeByRange:!0,splitHunkLines:{},splitLeftLines:b,splitRightLines:A,splitLineLength:b.length,unifiedHunkLines:{},unifiedLines:x,unifiedLineLength:x.length})},this._getHighlighterName=()=>_(this,ki,"f")||"",this._getHighlighterType=()=>_(this,Ii,"f")||"",this._getIsPureDiffRender=()=>_(this,Qi,"f"),this._getTheme=()=>_(this,Bt,"f"),this._getIsCloned=()=>_(this,rs,"f"),this._addClonedInstance=c=>{let f=()=>{this._notifyOthers(c),this._mergeFullBundle(c._getFullBundle(),!1)};f.isSyncExternal=!0;let u=c.subscribe(f);_(this,mi,"f").set(c,u)},this._notifyOthers=c=>{_(this,mi,"f").forEach((f,u)=>{u!==c&&u.notifyAll(!0)})},this._delClonedInstance=c=>{let f=_(this,mi,"f").get(c);f?.(),_(this,mi,"f").delete(c)},this._getFullBundle=()=>{let c=this.getBundle(),f=_(this,qe,"f"),u=_(this,Ke,"f"),m=_(this,Ni,"f"),v=_(this,Si,"f");return{...c,oldFileResult:f,newFileResult:u,diffLines:m,diffListResults:v,isFullMerge:_(this,bo,"f")?_(this,wo,"f"):!0}},this._mergeFullBundle=(c,f=!0)=>{this.mergeBundle(c,f);try{W(this,qe,c.oldFileResult?ko.createInstance(c.oldFileResult):null,"f"),W(this,Ke,c.newFileResult?ko.createInstance(c.newFileResult):null,"f"),W(this,Ni,c.diffLines,"f"),W(this,Si,c.diffListResults,"f"),W(this,wo,c.isFullMerge,"f")}catch{}},this._getAllListener=()=>_(this,hi,"f"),this._destroy=()=>{this.clearId(),_(this,hi,"f").splice(0,_(this,hi,"f").length),_(this,mi,"f").forEach(c=>c()),_(this,mi,"f").clear()},this.clear=()=>{this._destroy(),W(this,qe,void 0,"f"),W(this,Ke,void 0,"f"),W(this,Ni,void 0,"f"),W(this,Si,void 0,"f"),W(this,Yn,void 0,"f"),W(this,Vn,void 0,"f"),W(this,Yi,void 0,"f"),W(this,Vi,void 0,"f"),W(this,qn,void 0,"f"),W(this,Jn,void 0,"f"),W(this,rt,void 0,"f"),W(this,$t,[],"f"),W(this,nt,[],"f"),W(this,ot,void 0,"f"),W(this,Je,[],"f"),W(this,Bt,"light","f")},Object.defineProperty(this,"__v_skip",{value:!0});let p=Array.from(new Set(o));this._oldFileName=e,this._newFileName=i,this._diffList=p,this._oldFileLang=Sd(s||e||l||i)||"txt",this._newFileLang=Sd(l||i||s||e)||"txt",this._oldFileContent=n,this._newFileContent=r,this.initId()}initId(){let e="-diff--"+Math.random().toString().slice(2);for(;fa.has(e);)e="-diff--"+Math.random().toString().slice(2);fa.add(e),W(this,vo,e,"f")}getId(){return _(this,vo,"f")}clearId(){fa.delete(_(this,vo,"f"))}initTheme(e){W(this,Bt,e||_(this,Bt,"f")||"light","f")}initRaw(){var e;_(this,br,"f")||(_(this,Ne,"m",ef).call(this),_(this,Ne,"m",ba).call(this),_(this,Ne,"m",Zd).call(this),_(this,Ne,"m",wa).call(this),_(this,Ne,"m",tf).call(this),_(this,Ne,"m",xa).call(this),W(this,br,!0,"f"))}initSyntax({registerHighlighter:e}={}){var n,i;if(_(this,wr,"f")&&(!e||e.name===_(this,ki,"f")&&e.type===_(this,Ii,"f"))){W(this,qn,(n=_(this,Ke,"f"))===null||n===void 0?void 0:n.syntaxFile,"f"),W(this,Jn,(i=_(this,qe,"f"))===null||i===void 0?void 0:i.syntaxFile,"f");return}_(this,Ne,"m",nf).call(this,{registerHighlighter:e}),_(this,Ne,"m",wa).call(this),W(this,wr,!0,"f")}init(){this.initRaw(),this.initSyntax()}buildSplitDiffLines(){var e,n,i,r,o,s;if(_(this,xr,"f"))return;let l=1,d=1,p=!0,c=1/0,f=((e=_(this,qe,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,u=((n=_(this,Ke,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=f||d<=u;){let m=_(this,Ne,"m",Lr).call(this,l),v=_(this,Ne,"m",kr).call(this,d),y=_(this,Ne,"m",xo).call(this,l),w=_(this,Ne,"m",yo).call(this,d),b=Rt.prototype.isIncludeableLine.call(m||{}),A=Rt.prototype.isIncludeableLine.call(v||{}),x=_(this,nt,"f").length,S=!m&&!v;if(m&&!v){if(m.newLineNumber&&m.newLineNumber>d){d++;continue}(m.newLineNumber===null||m.newLineNumber===void 0)&&d++}if(v&&!m){if(v.oldLineNumber&&v.oldLineNumber>l){l++;continue}(v.oldLineNumber===null||v.oldLineNumber===void 0)&&l++}if(!m&&!y&&!v&&!w)break;if(!m&&!v){if(!((i=_(this,$n,"f"))===null||i===void 0)&&i[l]&&(!((r=_(this,Dn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!y&&(!((o=_(this,Dn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!w&&(!((s=_(this,$n,"f"))===null||s===void 0)&&s[l])){l++;continue}}if(b&&A||!b&&!A?(_(this,$t,"f").push({lineNumber:l++,value:y,diff:m,isHidden:S,_isHidden:S}),_(this,nt,"f").push({lineNumber:d++,value:w,diff:v,isHidden:S,_isHidden:S})):b?(_(this,$t,"f").push({lineNumber:l++,value:y,diff:m,isHidden:S,_isHidden:S}),_(this,nt,"f").push({})):A&&(_(this,$t,"f").push({}),_(this,nt,"f").push({lineNumber:d++,value:w,diff:v,isHidden:S,_isHidden:S})),!p&&S&&(c=x),S&&(this.hasSomeLineCollapsed=!0),p=S,m?.prevHunkLine||v?.prevHunkLine){let L=m?.prevHunkLine||v?.prevHunkLine;L&&(L.isFirst?(L.splitInfo={...L.hunkInfo,startHiddenIndex:0,endHiddenIndex:L.hunkInfo.newStartIndex-1,plainText:L.text,_startHiddenIndex:0,_endHiddenIndex:L.hunkInfo.newStartIndex-1,_plainText:L.text},c=1/0):Number.isFinite(c)&&(L.splitInfo={...L.hunkInfo,startHiddenIndex:c,endHiddenIndex:x,plainText:L.text,_startHiddenIndex:c,_endHiddenIndex:x,_plainText:L.text},c=1/0),W(this,rt,{..._(this,rt,"f"),[x]:L},"f"))}}if(Number.isFinite(c)){let v=new Rt("",Be.Hunk,null,null,null);v.isLast=!0,v.splitInfo={startHiddenIndex:c,endHiddenIndex:_(this,nt,"f").length,_startHiddenIndex:c,_endHiddenIndex:_(this,nt,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},W(this,rt,{..._(this,rt,"f"),[_(this,nt,"f").length]:v},"f"),c=1/0}this.splitLineLength=_(this,nt,"f").length,W(this,xr,!0,"f"),this.notifyAll()}buildUnifiedDiffLines(){var e,n,i,r,o,s;if(_(this,yr,"f"))return;let l=1,d=1,p=!0,c=1/0,f=((e=_(this,qe,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,u=((n=_(this,Ke,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=f||d<=u;){let m=_(this,Ne,"m",xo).call(this,l),v=_(this,Ne,"m",Lr).call(this,l),y=_(this,Ne,"m",yo).call(this,d),w=_(this,Ne,"m",kr).call(this,d),b=Rt.prototype.isIncludeableLine.call(v||{}),A=Rt.prototype.isIncludeableLine.call(w||{}),x=_(this,Je,"f").length,S=!v&&!w;if(v&&!w){if(v.newLineNumber&&v.newLineNumber>d){d++;continue}(v.newLineNumber===null||v.newLineNumber===void 0)&&d++}if(w&&!v){if(w.oldLineNumber&&w.oldLineNumber>l){l++;continue}(w.oldLineNumber===null||w.oldLineNumber===void 0)&&l++}if(!m&&!y&&!w&&!v)break;if(!v&&!w){if(!((i=_(this,$n,"f"))===null||i===void 0)&&i[l]&&(!((r=_(this,Dn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!m&&(!((o=_(this,Dn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!y&&(!((s=_(this,$n,"f"))===null||s===void 0)&&s[l])){l++;continue}}if(!b&&!A?_(this,Je,"f").push({oldLineNumber:l++,newLineNumber:d++,value:y,diff:w,isHidden:S,_isHidden:S}):b?_(this,Je,"f").push({oldLineNumber:l++,value:m,diff:v,isHidden:S,_isHidden:S}):A&&_(this,Je,"f").push({newLineNumber:d++,value:y,diff:w,isHidden:S,_isHidden:S}),!p&&S&&(c=x),S&&(this.hasSomeLineCollapsed=!0),p=S,v?.prevHunkLine||w?.prevHunkLine){let L=v?.prevHunkLine||w?.prevHunkLine;L&&(L.isFirst?(L.unifiedInfo={...L.hunkInfo,startHiddenIndex:0,endHiddenIndex:L.hunkInfo.newStartIndex-1,plainText:L.text,_startHiddenIndex:0,_endHiddenIndex:L.hunkInfo.newStartIndex-1,_plainText:L.text},c=1/0):Number.isFinite(c)&&(L.unifiedInfo={...L.hunkInfo,startHiddenIndex:c,endHiddenIndex:x,plainText:L.text,_startHiddenIndex:c,_endHiddenIndex:x,_plainText:L.text},c=1/0),W(this,ot,{..._(this,ot,"f"),[x]:L},"f"))}}if(Number.isFinite(c)){let v=new Rt("",Be.Hunk,null,null,null);v.isLast=!0,v.unifiedInfo={startHiddenIndex:c,endHiddenIndex:_(this,Je,"f").length,_startHiddenIndex:c,_endHiddenIndex:_(this,Je,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},W(this,ot,{..._(this,ot,"f"),[_(this,Je,"f").length]:v},"f"),c=1/0}this.unifiedLineLength=_(this,Je,"f").length,W(this,yr,!0,"f"),this.notifyAll()}get hasExpandSplitAll(){return _(this,zi,"f").state}get hasExpandUnifiedAll(){return _(this,Wi,"f").state}};qe=new WeakMap,Ke=new WeakMap,Si=new WeakMap,Ni=new WeakMap,Vn=new WeakMap,Yn=new WeakMap,Vi=new WeakMap,Yi=new WeakMap,Ji=new WeakMap,qi=new WeakMap,Jn=new WeakMap,qn=new WeakMap,$n=new WeakMap,Dn=new WeakMap,$t=new WeakMap,nt=new WeakMap,rt=new WeakMap,Je=new WeakMap,ot=new WeakMap,hi=new WeakMap,br=new WeakMap,wr=new WeakMap,xr=new WeakMap,yr=new WeakMap,mo=new WeakMap,Qi=new WeakMap,go=new WeakMap,bo=new WeakMap,wo=new WeakMap,ki=new WeakMap,Ii=new WeakMap,rs=new WeakMap,Bt=new WeakMap,zi=new WeakMap,Wi=new WeakMap,vo=new WeakMap,mi=new WeakMap,Ne=new WeakSet,Zd=function(){this._diffList&&W(this,Si,this._diffList.map(e=>Qp.parse(e)),"f")},ef=function(){!this._oldFileContent&&!this._newFileContent||(this._oldFileContent&&W(this,qe,vr(this._oldFileContent,this._oldFileLang,_(this,Bt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),this._newFileContent&&W(this,Ke,vr(this._newFileContent,this._newFileLang,_(this,Bt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"))},ba=function(){var e,n,i,r,o,s,l,d;(e=_(this,qe,"f"))===null||e===void 0||e.doRaw(),W(this,Vi,(n=_(this,qe,"f"))===null||n===void 0?void 0:n.rawFile,"f"),W(this,Ji,(i=_(this,qe,"f"))===null||i===void 0?void 0:i.plainFile,"f"),(r=_(this,Ke,"f"))===null||r===void 0||r.doRaw(),W(this,Yi,(o=_(this,Ke,"f"))===null||o===void 0?void 0:o.rawFile,"f"),W(this,qi,(s=_(this,Ke,"f"))===null||s===void 0?void 0:s.plainFile,"f"),this.fileLineLength=Math.max(this.fileLineLength,((l=_(this,qe,"f"))===null||l===void 0?void 0:l.maxLineNumber)||0,((d=_(this,Ke,"f"))===null||d===void 0?void 0:d.maxLineNumber)||0)},tf=function(){if(this._oldFileContent&&this._newFileContent)return;let e={},n={};if(!this._oldFileContent&&!this._newFileContent){let i=1,r=1,o="",s="",l=!1;for(;r<=this.diffLineLength||i<=this.diffLineLength;){let d=r++,p=i++,c=_(this,Ne,"m",Lr).call(this,d),f=_(this,Ne,"m",kr).call(this,p);c?o+=c.text:(o+=`
`,e[d]=!0),f?s+=f.text:(s+=`
`,n[p]=!0),!l&&c&&f&&(l=l||c.noTrailingNewLine!==f.noTrailingNewLine)}if(!l&&o===s)return;this._oldFileContent=o,this._newFileContent=s,W(this,qe,vr(this._oldFileContent,this._oldFileLang,_(this,Bt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),W(this,Ke,vr(this._newFileContent,this._newFileLang,_(this,Bt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"),W(this,$n,e,"f"),W(this,Dn,n,"f"),W(this,Qi,!0,"f")}else if(_(this,qe,"f")){let i=1,r=1,o="",s=!1;for(;r<=_(this,qe,"f").maxLineNumber;){let l=_(this,Ne,"m",kr).call(this,i++),d=_(this,Ne,"m",Lr).call(this,r);l?(o+=l.text,r=l.oldLineNumber?l.oldLineNumber+1:r):(d||(o+=_(this,Ne,"m",xo).call(this,r)),r++),!s&&l&&d&&(s=s||l.noTrailingNewLine!==d.noTrailingNewLine)}if(!s&&o===this._oldFileContent)return;this._newFileContent=o,W(this,Ke,vr(this._newFileContent,this._newFileLang,_(this,Bt,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f")}else if(_(this,Ke,"f")){let i=1,r=1,o="",s=!1;for(;r<=_(this,Ke,"f").maxLineNumber;){let l=_(this,Ne,"m",Lr).call(this,i++),d=_(this,Ne,"m",kr).call(this,r);l?(o+=l.text,r=l.newLineNumber?l.newLineNumber+1:r):(d||(o+=_(this,Ne,"m",yo).call(this,r)),r++),!s&&d&&l&&(s=s||d.noTrailingNewLine!==l.noTrailingNewLine)}if(!s&&o===this._newFileContent)return;this._oldFileContent=o,W(this,qe,vr(this._oldFileContent,this._oldFileLang,_(this,Bt,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f")}_(this,Ne,"m",ba).call(this)},Jp=function(){var e,n,i,r;for(let o in _(this,Vn,"f")||{}){let s=(e=_(this,Vn,"f"))===null||e===void 0?void 0:e[o],l=(n=_(this,Ji,"f"))===null||n===void 0?void 0:n[o];if((!_(this,$n,"f")||!_(this,$n,"f")[o])&&s?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'oldFileContent' and 'diff' at line ${o}. Please verify the 'oldFileContent' is correct.`);break}}for(let o in _(this,Yn,"f")||{}){let s=(i=_(this,Yn,"f"))===null||i===void 0?void 0:i[o],l=(r=_(this,qi,"f"))===null||r===void 0?void 0:r[o];if((!_(this,Dn,"f")||!_(this,Dn,"f")[o])&&s?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'newFileContent' and 'diff' at line ${o}. Please verify the 'newFileContent' is correct.`);break}}},wa=function(){var e;if(!(!((e=_(this,Si,"f"))===null||e===void 0)&&e.length))return;let n=c=>_(this,Ne,"m",yo).call(this,c),i=c=>_(this,Ne,"m",xo).call(this,c),r=c=>_(this,Ne,"m",Dd).call(this,c),o=c=>_(this,Ne,"m",$d).call(this,c);W(this,Ni,[],"f"),this.additionLength=0,this.deletionLength=0;let s=[];_(this,Si,"f").forEach(c=>{c.hunks.forEach(u=>{let m=[],v=[];u.lines.forEach(y=>{y.type===Be.Add?(m.push(y),this.additionLength++):y.type===Be.Delete?(v.push(y),this.deletionLength++):(Nd(m,v,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o}),m=[],v=[]),s.push(y)}),Nd(m,v,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o})})});let l=null;W(this,Ni,s.map((c,f)=>{var u;let m=c;if(m.index=f,m.isFirst=f===0,m.type===Be.Hunk){let v=(u=m.text.split("@@"))===null||u===void 0?void 0:u[1].split(" ").filter(Boolean),y=v?.[0]||"",w=v?.[1]||"",[b,A]=y.split(","),[x,S]=w.split(",");m.hunkInfo={oldStartIndex:-Number(b),oldLength:Number(A),newStartIndex:+Number(x),newLength:Number(S),_oldStartIndex:-Number(b),_oldLength:Number(A),_newStartIndex:+Number(x),_newLength:Number(S)},l=m}else if(m.type===Be.Context){let v=c;l&&(v.prevHunkLine=l,l=null)}else l=null;return m}),"f"),W(this,Vn,{},"f"),W(this,Yn,{},"f");let d=-1,p=-1;_(this,Ni,"f").forEach(c=>{c.oldLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,c.oldLineNumber),_(this,Vn,"f")[c.oldLineNumber]=c),c.newLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,c.newLineNumber),_(this,Yn,"f")[c.newLineNumber]=c)})},xa=function(){var e,n,i,r,o,s;W(this,ki,((e=_(this,qe,"f"))===null||e===void 0?void 0:e.highlighterName)||((n=_(this,Ke,"f"))===null||n===void 0?void 0:n.highlighterName)||_(this,ki,"f"),"f"),W(this,Ii,((i=_(this,qe,"f"))===null||i===void 0?void 0:i.highlighterType)||((r=_(this,Ke,"f"))===null||r===void 0?void 0:r.highlighterType)||_(this,Ii,"f"),"f"),!((o=_(this,qe,"f"))===null||o===void 0)&&o.highlighterName&&W(this,Jn,_(this,qe,"f").syntaxFile,"f"),!((s=_(this,Ke,"f"))===null||s===void 0)&&s.highlighterName&&W(this,qn,_(this,Ke,"f").syntaxFile,"f")},Cd=function({registerHighlighter:e}){var n,i,r,o;(n=_(this,qe,"f"))===null||n===void 0||n.doSyntax({registerHighlighter:e,theme:_(this,Bt,"f")}),W(this,Jn,(i=_(this,qe,"f"))===null||i===void 0?void 0:i.syntaxFile,"f"),(r=_(this,Ke,"f"))===null||r===void 0||r.doSyntax({registerHighlighter:e,theme:_(this,Bt,"f")}),W(this,qn,(o=_(this,Ke,"f"))===null||o===void 0?void 0:o.syntaxFile,"f")},nf=function({registerHighlighter:e}={}){_(this,bo,"f")&&!_(this,wo,"f")||(_(this,Ne,"m",Cd).call(this,{registerHighlighter:e}),_(this,Ne,"m",xa).call(this))},Lr=function(e){var n;if(e)return(n=_(this,Vn,"f"))===null||n===void 0?void 0:n[e]},kr=function(e){var n;if(e)return(n=_(this,Yn,"f"))===null||n===void 0?void 0:n[e]},xo=function(e){var n;return(n=_(this,Vi,"f"))===null||n===void 0?void 0:n[e]},yo=function(e){var n;return(n=_(this,Yi,"f"))===null||n===void 0?void 0:n[e]},$d=function(e){var n;return(n=_(this,Jn,"f"))===null||n===void 0?void 0:n[e]},Dd=function(e){var n;return(n=_(this,qn,"f"))===null||n===void 0?void 0:n[e]};var rf="diff-multi-select-active";function Td(t){if(!t)return null;let e=t.querySelector("span[data-line-num]");if(!e)return null;let n=e.getAttribute("data-line-num"),i=parseInt(n??"",10);return n!==i.toString()||isNaN(i)?null:i}function qp(t){if(!t)return null;let e=t.closest("[data-side]");return e?e.getAttribute("data-side"):null}function Fd(t){if(!t)return null;let e=t.closest(".diff-line-num");if(!e)return null;let n=e.querySelector("span[data-line-old-num]"),i=e.querySelector("span[data-line-new-num]"),r=n?.getAttribute("data-line-old-num"),o=i?.getAttribute("data-line-new-num"),s=r?parseInt(r,10):void 0,l=o?parseInt(o,10):void 0;return s===void 0&&l===void 0?null:{old:s,new:l}}function Md(t,e=!1){var n,i,r,o;if(!t)return null;let s=null;if(!e||t.closest(".diff-add-widget-wrapper")){let l=t.closest(".diff-line-new-content"),d=t.closest(".diff-line-old-content");l&&(s=(i=(n=l.parentElement)===null||n===void 0?void 0:n.querySelector(".diff-line-new-num"))!==null&&i!==void 0?i:null),d&&(s=(o=(r=d.parentElement)===null||r===void 0?void 0:r.querySelector(".diff-line-old-num"))!==null&&o!==void 0?o:null)}return s||(s=t.closest(".diff-line-new-num")||t.closest(".diff-line-old-num")),s}function fs(t){let e=Math.min(t.startLineNumber,t.endLineNumber),n=Math.max(t.startLineNumber,t.endLineNumber);return{...t,startLineNumber:e,endLineNumber:n}}var of=t=>{let e=[];return t.new&&t.new.length&&e.push({side:"new",startLineNumber:Math.min(...t.new),endLineNumber:Math.max(...t.new)}),t.old&&t.old.length&&e.push({side:"old",startLineNumber:Math.min(...t.old),endLineNumber:Math.max(...t.old)}),e},Kp=(t,e,n,i)=>{eh(e,n).forEach(o=>{var s,l;if(!o.isHide&&o.index){let d=t.filter(p=>p.getAttribute("data-line")===o.index.toString());if(d.length===2)if(o.isContext)d.forEach(p=>p.querySelectorAll("td").forEach(c=>c.classList.add(i)));else{let p=d.find(c=>c.getAttribute("data-side")===n.side);p?.querySelectorAll("td").forEach(c=>c.classList.add(i))}else o.isContext?(s=d[0])===null||s===void 0||s.querySelectorAll("td").forEach(p=>p.classList.add(i)):(l=d[0])===null||l===void 0||l.querySelectorAll(`td[data-side="${n.side}"]`).forEach(p=>p.classList.add(i))}})};function Xp(t,e,n,i={old:[],new:[]},r=rf){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(f=>{var u;return((u=f.closest(".diff-view-wrapper"))===null||u===void 0?void 0:u.getAttribute("id"))===o}),d=of(i),c=(e?d.concat(e):d).map(fs);l.forEach(f=>{f.querySelectorAll("td").forEach(m=>m.classList.remove(r))}),c.forEach(f=>{f&&n&&Kp(l,n,f,r)})}function Zp(t,e,n,i={old:[],new:[]},r=rf){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(f=>{var u;return((u=f.closest(".diff-view-wrapper"))===null||u===void 0?void 0:u.getAttribute("id"))===o}),d=of(i),c=(e?d.concat(e):d).map(fs);l.forEach(f=>{let u=f.querySelector(".diff-line-num"),m=f.querySelector(".diff-line-content");if(!u||!m)return;u.classList.remove(r),m.classList.remove(r);let v=u.querySelector("span[data-line-old-num]"),y=u.querySelector("span[data-line-new-num]"),w=v?.getAttribute("data-line-old-num"),b=y?.getAttribute("data-line-new-num"),A=w?parseInt(w,10):void 0,x=b?parseInt(b,10):void 0;c.some(S=>S.side==="old"&&A&&A>=S.startLineNumber&&A<=S.endLineNumber||S.side==="new"&&x&&x>=S.startLineNumber&&x<=S.endLineNumber)&&(u.classList.add(r),m.classList.add(r))})}function eh(t,e){var n;let i=fs(e),r=[],{side:o,startLineNumber:s,endLineNumber:l}=i,d=o==="old"?B.old:B.new;for(let p=s;p<=l;p++){let c=t.getSplitLineByLineNumber(p,d),f=t.getSplitLineIndexByLineNumber(p,d);if(c&&c.lineNumber!==void 0){let u=(n=c.diff)===null||n===void 0?void 0:n.type;r.push({index:f+1,lineNumber:c.lineNumber,value:c.value,isHide:Yp(t,p,d).split,isDelete:u===Be.Delete,isAdd:u===Be.Add,isContext:u===Be.Context||u===void 0})}}return r}var Sn,_r,ns,ct,Me,ca,ua,th,Hd,Bd,nh,Rd,Od,Pd,jd,Ud,po,Gd;_r=new WeakMap,ns=new WeakMap,ct=new WeakMap,Me=new WeakMap,ca=new WeakMap,ua=new WeakMap,th=new WeakMap,Hd=new WeakMap,Bd=new WeakMap,Sn=new WeakSet,nh=function(){var e;if(!_(this,_r,"f")||_(this,ua,"f"))return;let n=o=>{_(this,ct,"f").isUnifiedMode?_(this,Sn,"m",Od).call(this,o):_(this,Sn,"m",Rd).call(this,o)},i=o=>{_(this,ct,"f").isUnifiedMode?_(this,Sn,"m",jd).call(this,o):_(this,Sn,"m",Pd).call(this,o)},r=()=>{_(this,Sn,"m",Ud).call(this)};W(this,ua,{mousedown:n,mouseover:i,mouseup:r},"f"),_(this,_r,"f").addEventListener("mousedown",n),_(this,_r,"f").addEventListener("mouseover",i),document.addEventListener("mouseup",r),W(this,Hd,((e=_(this,ns,"f"))===null||e===void 0?void 0:e.subscribe(()=>_(this,Bd,"f").call(this)))||(()=>{}),"f")},Rd=function(e){let n=Md(e.target,!0);if(!n)return;let i=Td(n);if(i===null)return;let r=qp(n);if(!r)return;_(this,Me,"f").isSelecting=!0,_(this,Me,"f").startInfo={lineNumber:i,side:r};let o={side:r,startLineNumber:i,endLineNumber:i};if(_(this,ct,"f").scopeToHunk){let s=_(this,ct,"f").scopeToHunk(o);s&&(o=s)}_(this,Me,"f").currentRange=o,_(this,Sn,"m",po).call(this),_(this,ct,"f").onSelectionChange(o,{..._(this,Me,"f")})},Od=function(e){var n;let i=Fd(e.target);if(!i)return;let r=(n=i.new)!==null&&n!==void 0?n:i.old;if(r===void 0)return;let o=i.new!==void 0?"new":"old";_(this,Me,"f").isSelecting=!0,_(this,Me,"f").startInfo={lineNumber:r,side:o};let s={side:o,startLineNumber:r,endLineNumber:r};if(_(this,ct,"f").scopeToHunk){let l=_(this,ct,"f").scopeToHunk(s);l&&(s=l)}_(this,Me,"f").currentRange=s,_(this,Sn,"m",po).call(this),_(this,ct,"f").onSelectionChange(s,{..._(this,Me,"f")})},Pd=function(e){if(!_(this,Me,"f").isSelecting||!_(this,Me,"f").startInfo)return;let n=Md(e.target);if(!n)return;let i=Td(n);if(i===null)return;let r={side:_(this,Me,"f").startInfo.side,startLineNumber:_(this,Me,"f").startInfo.lineNumber,endLineNumber:i};if(_(this,ct,"f").scopeToHunk){let o=_(this,ct,"f").scopeToHunk(r);o&&(r=o)}_(this,Me,"f").currentRange=r,_(this,Sn,"m",po).call(this),_(this,ct,"f").onSelectionChange(r,{..._(this,Me,"f")})},jd=function(e){if(!_(this,Me,"f").isSelecting||!_(this,Me,"f").startInfo)return;let n=Fd(e.target);if(!n)return;let i=n[_(this,Me,"f").startInfo.side];if(i===void 0)return;let r={side:_(this,Me,"f").startInfo.side,startLineNumber:_(this,Me,"f").startInfo.lineNumber,endLineNumber:i};if(_(this,ct,"f").scopeToHunk){let o=_(this,ct,"f").scopeToHunk(r);o&&(r=o)}_(this,Me,"f").currentRange=r,_(this,Sn,"m",po).call(this),_(this,ct,"f").onSelectionChange(r,{..._(this,Me,"f")})},Ud=function(){if(!_(this,Me,"f").isSelecting||!_(this,Me,"f").currentRange){_(this,Sn,"m",Gd).call(this);return}let e=fs(_(this,Me,"f").currentRange);_(this,Me,"f").currentRange=e,_(this,Me,"f").isSelecting=!1;let n=this.getSelectionResult();_(this,ct,"f").onSelectionComplete(n)},po=function(){_(this,ct,"f").isUnifiedMode?Zp(_(this,_r,"f"),_(this,Me,"f").currentRange,_(this,ns,"f"),_(this,ca,"f"),_(this,ct,"f").selectedClassName):Xp(_(this,_r,"f"),_(this,Me,"f").currentRange,_(this,ns,"f"),_(this,ca,"f"),_(this,ct,"f").selectedClassName)},Gd=function(){W(this,Me,{isSelecting:!1,startInfo:null,currentRange:null},"f")};var Io=class{diff(e,n,i={}){let r;typeof i=="function"?(r=i,i={}):"callback"in i&&(r=i.callback);let o=this.castInput(e,i),s=this.castInput(n,i),l=this.removeEmpty(this.tokenize(o,i)),d=this.removeEmpty(this.tokenize(s,i));return this.diffWithOptionsObj(l,d,i,r)}diffWithOptionsObj(e,n,i,r){var o;let s=A=>{if(A=this.postProcess(A,i),r){setTimeout(function(){r(A)},0);return}else return A},l=n.length,d=e.length,p=1,c=l+d;i.maxEditLength!=null&&(c=Math.min(c,i.maxEditLength));let f=(o=i.timeout)!==null&&o!==void 0?o:1/0,u=Date.now()+f,m=[{oldPos:-1,lastComponent:void 0}],v=this.extractCommon(m[0],n,e,0,i);if(m[0].oldPos+1>=d&&v+1>=l)return s(this.buildValues(m[0].lastComponent,n,e));let y=-1/0,w=1/0,b=()=>{for(let A=Math.max(y,-p);A<=Math.min(w,p);A+=2){let x,S=m[A-1],L=m[A+1];S&&(m[A-1]=void 0);let h=!1;if(L){let E=L.oldPos-A;h=L&&0<=E&&E<l}let g=S&&S.oldPos+1<d;if(!h&&!g){m[A]=void 0;continue}if(!g||h&&S.oldPos<L.oldPos?x=this.addToPath(L,!0,!1,0,i):x=this.addToPath(S,!1,!0,1,i),v=this.extractCommon(x,n,e,A,i),x.oldPos+1>=d&&v+1>=l)return s(this.buildValues(x.lastComponent,n,e))||!0;m[A]=x,x.oldPos+1>=d&&(w=Math.min(w,A-1)),v+1>=l&&(y=Math.max(y,A+1))}p++};if(r)(function A(){setTimeout(function(){if(p>c||Date.now()>u)return r(void 0);b()||A()},0)})();else for(;p<=c&&Date.now()<=u;){let A=b();if(A)return A}}addToPath(e,n,i,r,o){let s=e.lastComponent;return s&&!o.oneChangePerToken&&s.added===n&&s.removed===i?{oldPos:e.oldPos+r,lastComponent:{count:s.count+1,added:n,removed:i,previousComponent:s.previousComponent}}:{oldPos:e.oldPos+r,lastComponent:{count:1,added:n,removed:i,previousComponent:s}}}extractCommon(e,n,i,r,o){let s=n.length,l=i.length,d=e.oldPos,p=d-r,c=0;for(;p+1<s&&d+1<l&&this.equals(i[d+1],n[p+1],o);)p++,d++,c++,o.oneChangePerToken&&(e.lastComponent={count:1,previousComponent:e.lastComponent,added:!1,removed:!1});return c&&!o.oneChangePerToken&&(e.lastComponent={count:c,previousComponent:e.lastComponent,added:!1,removed:!1}),e.oldPos=d,p}equals(e,n,i){return i.comparator?i.comparator(e,n):e===n||!!i.ignoreCase&&e.toLowerCase()===n.toLowerCase()}removeEmpty(e){let n=[];for(let i=0;i<e.length;i++)e[i]&&n.push(e[i]);return n}castInput(e,n){return e}tokenize(e,n){return Array.from(e)}join(e){return e.join("")}postProcess(e,n){return e}get useLongestToken(){return!1}buildValues(e,n,i){let r=[],o;for(;e;)r.push(e),o=e.previousComponent,delete e.previousComponent,e=o;r.reverse();let s=r.length,l=0,d=0,p=0;for(;l<s;l++){let c=r[l];if(c.removed)c.value=this.join(i.slice(p,p+c.count)),p+=c.count;else{if(!c.added&&this.useLongestToken){let f=n.slice(d,d+c.count);f=f.map(function(u,m){let v=i[p+m];return v.length>u.length?v:u}),c.value=this.join(f)}else c.value=this.join(n.slice(d,d+c.count));d+=c.count,c.added||(p+=c.count)}}return r}};var ka=class extends Io{constructor(){super(...arguments),this.tokenize=rh}equals(e,n,i){return i.ignoreWhitespace?((!i.newlineIsToken||!e.includes(`
`))&&(e=e.trim()),(!i.newlineIsToken||!n.includes(`
`))&&(n=n.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith(`
`)&&(e=e.slice(0,-1)),n.endsWith(`
`)&&(n=n.slice(0,-1))),super.equals(e,n,i)}},ih=new ka;function Ia(t,e,n){return ih.diff(t,e,n)}function rh(t,e){e.stripTrailingCr&&(t=t.replace(/\r\n/g,`
`));let n=[],i=t.split(/(\n|\r\n)/);i[i.length-1]||i.pop();for(let r=0;r<i.length;r++){let o=i[r];r%2&&!e.newlineIsToken?n[n.length-1]+=o:n.push(o)}return n}var sf={includeIndex:!0,includeUnderline:!0,includeFileHeaders:!0};function Sa(t,e,n,i,r,o,s){let l;s?typeof s=="function"?l={callback:s}:l=s:l={},typeof l.context>"u"&&(l.context=4);let d=l.context;if(l.newlineIsToken)throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(l.callback){let{callback:c}=l;Ia(n,i,Object.assign(Object.assign({},l),{callback:f=>{let u=p(f);c(u)}}))}else return p(Ia(n,i,l));function p(c){if(!c)return;c.push({value:"",lines:[]});function f(A){return A.map(function(x){return" "+x})}let u=[],m=0,v=0,y=[],w=1,b=1;for(let A=0;A<c.length;A++){let x=c[A],S=x.lines||oh(x.value);if(x.lines=S,x.added||x.removed){if(!m){let L=c[A-1];m=w,v=b,L&&(y=d>0?f(L.lines.slice(-d)):[],m-=y.length,v-=y.length)}for(let L of S)y.push((x.added?"+":"-")+L);x.added?b+=S.length:w+=S.length}else{if(m)if(S.length<=d*2&&A<c.length-2)for(let L of f(S))y.push(L);else{let L=Math.min(S.length,d);for(let g of f(S.slice(0,L)))y.push(g);let h={oldStart:m,oldLines:w-m+L,newStart:v,newLines:b-v+L,lines:y};u.push(h),m=0,v=0,y=[]}w+=S.length,b+=S.length}}for(let A of u)for(let x=0;x<A.lines.length;x++)A.lines[x].endsWith(`
`)?A.lines[x]=A.lines[x].slice(0,-1):(A.lines.splice(x+1,0,"\\ No newline at end of file"),x++);return{oldFileName:t,newFileName:e,oldHeader:r,newHeader:o,hunks:u}}}function cs(t,e){if(e||(e=sf),Array.isArray(t)){if(t.length>1&&!e.includeFileHeaders)throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");return t.map(i=>cs(i,e)).join(`
`)}let n=[];e.includeIndex&&t.oldFileName==t.newFileName&&n.push("Index: "+t.oldFileName),e.includeUnderline&&n.push("==================================================================="),e.includeFileHeaders&&(n.push("--- "+t.oldFileName+(typeof t.oldHeader>"u"?"":"	"+t.oldHeader)),n.push("+++ "+t.newFileName+(typeof t.newHeader>"u"?"":"	"+t.newHeader)));for(let i=0;i<t.hunks.length;i++){let r=t.hunks[i];r.oldLines===0&&(r.oldStart-=1),r.newLines===0&&(r.newStart-=1),n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@");for(let o of r.lines)n.push(o)}return n.join(`
`)+`
`}function Na(t,e,n,i,r,o,s){if(typeof s=="function"&&(s={callback:s}),s?.callback){let{callback:l}=s;Sa(t,e,n,i,r,o,Object.assign(Object.assign({},s),{callback:d=>{l(d?cs(d,s.headerOptions):void 0)}}))}else{let l=Sa(t,e,n,i,r,o,s);return l?cs(l,s?.headerOptions):void 0}}function oh(t){let e=t.endsWith(`
`),n=t.split(`
`).map(i=>i+`
`);return e?n.pop():n.push(n.pop().slice(0,-1)),n}ls.name="@git-diff-view/file";function af(t,e,n,i,r,o,s,l){let d=Na(t,n,e,i,"","",s);return new Ki(t,e,n,i,[d],r,o,l)}var Cr;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(Cr||(Cr={}));var Ot;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(Ot||(Ot={}));typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var Kn={};var je=Symbol("uninitialized"),tn=Symbol("filename");var us="http://www.w3.org/1999/xhtml",So="http://www.w3.org/2000/svg",Ca="http://www.w3.org/1998/Math/MathML";var lf=globalThis.process?.env?.NODE_ENV,F=lf&&!lf.toLowerCase().startsWith("prod");var gi=Array.isArray,df=Array.prototype.indexOf,Ci=Array.prototype.includes,$r=Array.from,$a=Object.keys,Pt=Object.defineProperty,cn=Object.getOwnPropertyDescriptor,Da=Object.getOwnPropertyDescriptors,Ta=Object.prototype,ff=Array.prototype,Dr=Object.getPrototypeOf,Fa=Object.isExtensible;var ut=()=>{};function ps(t){for(var e=0;e<t.length;e++)t[e]()}function hs(){var t,e,n=new Promise((i,r)=>{t=i,e=r});return{promise:n,resolve:t,reject:e}}var Vt=Symbol("$state"),ms=Symbol("legacy props"),cf=Symbol(""),gs=Symbol("proxy path"),vs=Symbol("attributes"),No=Symbol("class"),Co=Symbol("style"),$o=Symbol("text");var Ma=Symbol("hmr anchor"),vi=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Ha=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Tr=3,un=8;function uf(t){if(F){let e=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${t}"
https://svelte.dev/e/invariant_violation`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invariant_violation")}function Fr(t){if(F){let e=new Error(`lifecycle_outside_component
\`${t}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function hf(){if(F){let t=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function mf(){if(F){let t=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/derived_references_self")}function Ba(t,e,n){if(F){let i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${t} and ${e}`:`Keyed each block has duplicate key at indexes ${t} and ${e}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function gf(t,e,n){if(F){let i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${t} was \`${e}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_volatile")}function vf(t){if(F){let e=new Error(`effect_in_teardown
\`${t}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function _f(){if(F){let t=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function bf(t){if(F){let e=new Error(`effect_orphan
\`${t}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_orphan")}function wf(){if(F){let t=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function xf(){if(F){let t=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydration_failed")}function yf(){if(F){let t=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invalid_snippet")}function Ef(t){if(F){let e=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${t}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function Af(t){if(F){let e=new Error(`rune_outside_svelte
The \`${t}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Lf(){if(F){let t=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/set_context_after_init")}function kf(){if(F){let t=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function If(){if(F){let t=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Sf(){if(F){let t=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Nf(){if(F){let t=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Xn="font-weight: bold",Zn="font-weight: normal";function Cf(t){F?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${t}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Xn,Zn):console.warn("https://svelte.dev/e/await_reactivity_loss")}function $f(t,e){F?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${t}\` (${e}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,Xn,Zn):console.warn("https://svelte.dev/e/await_waterfall")}function Df(){F?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,Xn,Zn):console.warn("https://svelte.dev/e/derived_inert")}function Tf(t,e,n){F?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${t}\` attribute on \`${e}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Xn,Zn):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Ff(t){F?console.warn(`%c[svelte] hydration_html_changed
%c${t?`The value of an \`{@html ...}\` block ${t} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,Xn,Zn):console.warn("https://svelte.dev/e/hydration_html_changed")}function $i(t){F?console.warn(`%c[svelte] hydration_mismatch
%c${t?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${t}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,Xn,Zn):console.warn("https://svelte.dev/e/hydration_mismatch")}function Mf(){F?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Xn,Zn):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function _s(t){F?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${t}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Xn,Zn):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function Hf(){F?console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Xn,Zn):console.warn("https://svelte.dev/e/state_proxy_unmount")}function Bf(){F?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Xn,Zn):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var le=!1;function pt(t){le=t}var ve;function He(t){if(t===null)throw $i(),Kn;return ve=t}function At(){return He(Lt(ve))}function C(t){if(le){if(Lt(ve)!==null)throw $i(),Kn;ve=t}}function Zi(t=1){if(le){for(var e=t,n=ve;e--;)n=Lt(n);ve=n}}function ei(t=!0){for(var e=0,n=ve;;){if(n.nodeType===un){var i=n.data;if(i==="]"){if(e===0)return n;e-=1}else(i==="["||i==="[!"||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(e+=1)}var r=Lt(n);t&&n.remove(),n=r}}function To(t){if(!t||t.nodeType!==un)throw $i(),Kn;return t.data}function bs(t){return t===this.v}function Ra(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function ws(t){return!Ra(t,this.v)}var ht=!1,_i=!1,Tn=!1;function Rf(){_i=!0}var Fo=null;function jt(t,e){return t.label=e,ys(t.v,e),t}function ys(t,e){return t?.[gs]?.(e),t}function Fn(t){let e=new Error,n=lh();return n.length===0?null:(n.unshift(`
`),Pt(e,"stack",{value:n.join(`
`)}),Pt(e,"name",{value:t}),e)}function lh(){let t=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let e=new Error().stack;if(Error.stackTraceLimit=t,!e)return[];let n=e.split(`
`),i=[];for(let r=0;r<n.length;r++){let o=n[r],s=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];s.includes("svelte/src/internal")||s.includes("node_modules/.vite")||i.push(o)}}return i}function Pf(t,e){if(!F)throw new Error("invariant(...) was not guarded by if (DEV)");t||uf(e)}var Ee=null;function bi(t){Ee=t}var Mn=null;function Br(t){Mn=t}var pn=null;function Es(t){pn=t}function Qe(t){return jf("getContext").get(t)}function Ve(t,e){let n=jf("setContext");if(ht){var i=ae.f,r=!ge&&(i&32)!==0&&!Ee.i;r||Lf()}return n.set(t,e),e}function de(t,e=!1,n){Ee={p:Ee,i:!1,c:null,e:null,s:t,x:null,r:ae,l:_i&&!e?{s:null,u:null,$:[]}:null},F&&(Ee.function=n,pn=n)}function fe(t){var e=Ee,n=e.e;if(n!==null){e.e=null;for(var i of n)Oa(i)}return t!==void 0&&(e.x=t),e.i=!0,Ee=e.p,F&&(pn=Ee?.function??null),t??{}}function ti(){return!_i||Ee!==null&&Ee.l===null}function jf(t){return Ee===null&&Fr(t),Ee.c??=new Map(dh(Ee)||void 0)}function dh(t){let e=t.p;for(;e!==null;){let n=e.c;if(n!==null)return n;e=e.p}return null}var er=[];function Uf(){var t=er;er=[],ps(t)}function gt(t){if(er.length===0&&!tr){var e=er;queueMicrotask(()=>{e===er&&Uf()})}er.push(t)}function Gf(){for(;er.length>0;)Uf()}var Pa=new WeakMap;function As(t){var e=ae;if(e===null)return ge.f|=8388608,t;if(F&&t instanceof Error&&!Pa.has(t)&&Pa.set(t,fh(t,e)),(e.f&32768)===0&&(e.f&4)===0)throw F&&!e.parent&&t instanceof Error&&zf(t),t;Bn(t,e)}function Bn(t,e){if(!(e!==null&&(e.f&16384)!==0)){for(;e!==null;){if((e.f&128)!==0){if((e.f&32768)===0)throw t;try{e.b.error(t);return}catch(n){t=n}}e=e.parent}throw F&&t instanceof Error&&zf(t),t}}function fh(t,e){let n=cn(t,"message");if(!(n&&!n.configurable)){for(var i=Ho?"  ":"	",r=`
${i}in ${e.fn?.name||"<unknown>"}`,o=e.ctx;o!==null;)r+=`
${i}in ${o.function?.[tn].split("/").pop()}`,o=o.p;return{message:t.message+`
${r}
`,stack:t.stack?.split(`
`).filter(s=>!s.includes("svelte/src/internal")).join(`
`)}}}function zf(t){let e=Pa.get(t);e&&(Pt(t,"message",{value:e.message}),Pt(t,"stack",{value:e.stack}))}var ch=-7169;function Re(t,e){t.f=t.f&ch|e}function Rr(t){(t.f&512)!==0||t.deps===null?Re(t,1024):Re(t,4096)}function Wf(t){if(t!==null)for(let e of t)(e.f&2)===0||(e.f&65536)===0||(e.f^=65536,Wf(e.deps))}function Ls(t,e,n){(t.f&2048)!==0?e.add(t):(t.f&4096)!==0&&n.add(t),Wf(t.deps),Re(t,1024)}var Qf=!1;function ni(t){var e=ge,n=ae;bt(null),wt(null);try{return t()}finally{bt(e),wt(n)}}function Yf(t){let e=0,n=Wt(0),i;return F&&jt(n,"createSubscriber version"),()=>{Di()&&(a(n),Yt(()=>(e===0&&(i=Xe(()=>t(()=>or(n)))),e+=1,()=>{gt(()=>{e-=1,e===0&&(i?.(),i=void 0,or(n))})})))}}var hh=589824;function Ua(t,e,n,i){new ja(t,e,n,i)}var ja=class{parent;is_pending=!1;transform_error;#e;#t=le?ve:null;#n;#l;#o;#s=null;#i=null;#a=null;#r=null;#m=0;#f=0;#c=!1;#u=new Set;#g=new Set;#d=null;#b=Yf(()=>(this.#d=Wt(this.#m),F&&jt(this.#d,"$effect.pending()"),()=>{this.#d=null}));constructor(e,n,i,r){this.#e=e,this.#n=n,this.#l=o=>{var s=ae;s.b=this,s.f|=128,i(o)},this.parent=ae.b,this.transform_error=r??this.parent?.transform_error??(o=>o),this.#o=sn(()=>{if(le){let o=this.#t;At();let s=o.data==="[!";if(o.data.startsWith("[?")){let d=JSON.parse(o.data.slice("[?".length));this.#w(d)}else s?this.#y():this.#v()}else this.#p()},hh),le&&(this.#e=ve)}#v(){try{this.#s=lt(()=>this.#l(this.#e))}catch(e){this.error(e)}}#w(e){let n=this.#n.failed,{reset:i,invoke_onerror:r}=this.#x(e);gt(r),n&&(this.#a=lt(()=>{n(this.#e,()=>e,()=>i)}))}#x(e){var n=!1,i=!1;let r=()=>{if(n){Bf();return}n=!0,i&&Nf(),this.#a!==null&&ii(this.#a,()=>{this.#a=null}),this.#h(()=>{this.#p()})};return{reset:r,invoke_onerror:()=>{try{i=!0,this.#n.onerror?.(e,r),i=!1}catch(s){Bn(s,this.#o&&this.#o.parent)}}}}#y(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#i=lt(()=>e(this.#e)),gt(()=>{var n=this.#r=document.createDocumentFragment(),i=xt();n.append(i),this.#s=this.#h(()=>lt(()=>this.#l(i))),this.#f===0&&(this.#e.before(n),this.#r=null,ii(this.#i,()=>{this.#i=null}),this.#_(_e))}))}#p(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#m=0,this.#s=lt(()=>{this.#l(this.#e)}),this.#f>0){var e=this.#r=document.createDocumentFragment();Or(this.#s,e);let n=this.#n.pending;this.#i=lt(()=>n(this.#e))}else this.#_(_e)}catch(n){this.error(n)}}#_(e){this.is_pending=!1,e.transfer_effects(this.#u,this.#g)}defer_effect(e){Ls(e,this.#u,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#h(e){var n=ae,i=ge,r=Ee;wt(this.#o),bt(this.#o),bi(this.#o.ctx);try{return hn.ensure(),e()}catch(o){return As(o),null}finally{wt(n),bt(i),bi(r)}}#E(e,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#E(e,n);return}this.#f+=e,this.#f===0&&(this.#_(n),this.#i&&ii(this.#i,()=>{this.#i=null}),this.#r&&(this.#e.before(this.#r),this.#r=null))}update_pending_count(e,n){this.#E(e,n),this.#m+=e,!(!this.#d||this.#c)&&(this.#c=!0,gt(()=>{this.#c=!1,this.#d&&Rn(this.#d,this.#m)}))}get_effect_pending(){return this.#b(),a(this.#d)}error(e){if(!this.#n.onerror&&!this.#n.failed)throw e;_e?.is_fork?(this.#s&&_e.skip_effect(this.#s),this.#i&&_e.skip_effect(this.#i),this.#a&&_e.skip_effect(this.#a),_e.oncommit(()=>{this.#A(e)})):this.#A(e)}#A(e){this.#s&&(et(this.#s),this.#s=null),this.#i&&(et(this.#i),this.#i=null),this.#a&&(et(this.#a),this.#a=null),le&&(He(this.#t),Zi(),He(ei()));let n=this.#n.failed,i=r=>{let{reset:o,invoke_onerror:s}=this.#x(r);s(),n&&(this.#a=this.#h(()=>{try{return lt(()=>{var l=ae;l.b=this,l.f|=128,n(this.#e,()=>r,()=>o)})}catch(l){return Bn(l,this.#o.parent),null}}))};gt(()=>{var r;try{r=this.transform_error(e)}catch(o){Bn(o,this.#o&&this.#o.parent);return}r!==null&&typeof r=="object"&&typeof r.then=="function"?r.then(i,o=>Bn(o,this.#o&&this.#o.parent)):i(r)})}};function ks(t,e,n,i){let r=ti()?jr:Ur;var o=t.filter(m=>!m.settled),s=e.map(r);if(F&&s.forEach((m,v)=>{m.label=e[v].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,(y,w)=>w)}),n.length===0&&o.length===0){i(s);return}var l=ae,d=qf(),p=o.length===1?o[0].promise:o.length>1?Promise.all(o.map(m=>m.promise)):null;function c(m){if((l.f&16384)===0){d();try{i([...s,...m])}catch(v){Bn(v,l)}Pr()}}var f=Ga();if(n.length===0){p.then(()=>c([])).finally(f);return}function u(){Promise.all(n.map(m=>Wa(m))).then(c).catch(m=>Bn(m,l)).finally(f)}p?p.then(()=>{d(),u(),Pr()}):u()}function qf(){var t=ae,e=ge,n=Ee,i=_e;if(F)var r=Mn;return function(s=!0){wt(t),bt(e),bi(n),s&&(t.f&16384)===0&&(i?.activate(),i?.apply()),F&&(za(null),Br(r))}}function Pr(t=!0){wt(null),bt(null),bi(null),t&&_e?.deactivate(),F&&(za(null),Br(null))}function Ga(){var t=ae,e=t.b,n=_e,i=!!e?.is_rendered();return e?.update_pending_count(1,n),n.increment(i,t),()=>{e?.update_pending_count(-1,n),n.decrement(i,t)}}var an=null;function za(t){an=t}var Ro=new Set;function jr(t){var e=2050;ae!==null&&(ae.f|=524288);let n={ctx:Ee,deps:null,effects:null,equals:bs,f:e,fn:t,reactions:null,rv:0,v:je,wv:0,parent:ae,ac:null};return F&&Tn&&(n.created=Fn("created at")),n}var Gr=Symbol("obsolete");function Wa(t,e,n){let i=ae;i===null&&hf();var r=void 0,o=Wt(je);F&&(o.label=e??t.toString());var s=!ge,l=new Set;return Zf(()=>{var d=ae;F&&(an={effect:d,effect_deps:new Set,warned:!1});var p=hs();r=p.promise;try{Promise.resolve(t()).then(p.resolve,m=>{m!==vi&&p.reject(m)}).finally(Pr)}catch(m){p.reject(m),Pr()}if(F){if(an){if(d.deps!==null)for(let m=0;m<Jt;m+=1)an.effect_deps.add(d.deps[m]);if(kt!==null)for(let m=0;m<kt.length;m+=1)an.effect_deps.add(kt[m])}an=null}var c=_e;if(s){if((d.f&32768)!==0)var f=Ga();if(i.b?.is_rendered())c.async_deriveds.get(d)?.reject(Gr);else for(let m of l.values())m.reject(Gr);l.add(p),c.async_deriveds.set(d,p)}let u=(m,v=void 0)=>{F&&(an=null),f?.(),l.delete(p),v!==Gr&&(c.activate(),v?(o.f|=8388608,Rn(o,v)):((o.f&8388608)!==0&&(o.f^=8388608),F&&n!==void 0&&!o.equals(m)&&(Ro.add(o),setTimeout(()=>{Ro.has(o)&&(d.f&16384)===0&&($f(o.label,n),Ro.delete(o))})),Rn(o,m)),c.deactivate())};p.promise.then(u,m=>u(null,m||"unknown"))}),Gt(()=>{for(let d of l)d.reject(Gr)}),F&&(o.f|=4194304),new Promise(d=>{function p(c){function f(){c===r?d(o):p(r)}c.then(f,f)}p(r)})}function I(t){let e=jr(t);return ht||Ns(e),e}function Ur(t){let e=jr(t);return e.equals=ws,e}function Kf(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)et(e[n])}}var Qa=[];function Oo(t){var e,n=ae,i=t.parent;if(!bn&&i!==null&&t.v!==je&&(i.f&24576)!==0)return Df(),t.v;if(wt(i),F){let r=sr;Is(new Set);try{Ci.call(Qa,t)&&mf(),Qa.push(t),t.f&=-65537,Kf(t),e=Ss(t)}finally{wt(n),Is(r),Qa.pop()}}else try{t.f&=-65537,Kf(t),e=Ss(t)}finally{wt(n)}return e}function Va(t){var e=Oo(t);if(!t.equals(e)&&(t.wv=zr(),(!_e?.is_fork||t.deps===null)&&(_e!==null?(_e.capture(t,e,!0),Ti?.capture(t,e,!0)):t.v=e,t.deps===null))){Re(t,1024);return}bn||(It!==null?(Di()||_e?.is_fork)&&It.set(t,e):Rr(t))}function Xf(t){if(t.effects!==null)for(let e of t.effects)(e.teardown||e.ac)&&(e.teardown?.(),e.ac!==null&&ni(()=>{e.ac.abort(vi),e.ac=null}),e.fn!==null&&(e.teardown=ut),ar(e,0),Po(e))}function Ya(t){if(t.effects!==null)for(let e of t.effects)e.teardown&&e.fn!==null&&ri(e)}var Cs=null,Wr=null,_e=null,Ti=null,It=null,Ka=null,tr=!1,Ja=!1,lr=null,jo=null,ec=0,qa=new Set,vh=1,hn=class t{id=vh++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#l=new Set;#o=new Set;#s=0;#i=new Map;#a=null;#r=[];#m=[];#f=new Set;#c=new Set;#u=new Map;#g=new Set;is_fork=!1;#d=!1;constructor(){Wr===null?Cs=Wr=this:(Wr.#n=this,this.#t=Wr),Wr=this}#b(){if(this.is_fork)return!0;for(let i of this.#i.keys()){for(var e=i,n=!1;e.parent!==null;){if(this.#u.has(e)){n=!0;break}e=e.parent}if(!n)return!0}return!1}skip_effect(e){this.#u.has(e)||this.#u.set(e,{d:[],m:[]}),this.#g.delete(e)}unskip_effect(e,n=i=>this.schedule(i)){var i=this.#u.get(e);if(i){this.#u.delete(e);for(var r of i.d)Re(r,2048),n(r);for(r of i.m)Re(r,4096),n(r)}this.#g.add(e)}#v(){if(this.#e=!0,ec++>1e3&&(this.#h(),_h()),F)for(let d of this.current.keys())qa.add(d);for(let d of this.#f)this.#c.delete(d),Re(d,2048),this.schedule(d);for(let d of this.#c)Re(d,4096),this.schedule(d);let e=this.#r;this.#r=[],this.apply();var n=lr=[],i=[],r=jo=[];for(let d of e)try{this.#w(d,n,i)}catch(p){throw rc(d),this.#b()||this.discard(),p}if(_e=null,r.length>0){var o=t.ensure();for(let d of r)o.schedule(d)}if(lr=null,jo=null,this.#b()){this.#p(i),this.#p(n);for(let[d,p]of this.#u)ic(d,p);r.length>0&&_e.#v();return}let s=this.#x();if(s){this.#p(i),this.#p(n),s.#y(this);return}this.#f.clear(),this.#c.clear();for(let d of this.#l)d(this);this.#l.clear(),Ti=this,tc(i),tc(n),Ti=null,this.#a?.resolve();var l=_e;if(this.#s===0&&(this.#r.length===0||l!==null)&&(this.#h(),ht&&(this.#_(),_e=l)),this.#r.length>0)if(l!==null){let d=l;d.#r.push(...this.#r.filter(p=>!d.#r.includes(p)))}else l=this;l!==null&&l.#v()}#w(e,n,i){e.f^=1024;for(var r=e.first;r!==null;){var o=r.f,s=(o&96)!==0,l=s&&(o&1024)!==0,d=l||(o&8192)!==0||this.#u.has(r);if(!d&&r.fn!==null){s?r.f^=1024:(o&4)!==0?n.push(r):ht&&(o&16777224)!==0?i.push(r):Fi(r)&&((o&16)!==0&&this.#c.add(r),ri(r));var p=r.first;if(p!==null){r=p;continue}}for(;r!==null;){var c=r.next;if(c!==null){r=c;break}r=r.parent}}}#x(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[n,[,i]]of this.current)if(e.current.has(n)&&!i)return e}e=e.#t}return null}#y(e){for(let[i,r]of e.current)!this.previous.has(i)&&e.previous.has(i)&&this.previous.set(i,e.previous.get(i)),this.current.set(i,r);for(let[i,r]of e.async_deriveds){let o=this.async_deriveds.get(i);o&&r.promise.then(o.resolve).catch(o.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#f,e.#c);let n=i=>{var r=i.reactions;if(r!==null&&!((i.f&2)!==0&&(i.f&6144)===0))for(let l of r){var o=l.f;if((o&2)!==0)n(l);else{var s=l;o&4194320&&!this.async_deriveds.has(s)&&(this.#c.delete(s),Re(s,2048),this.schedule(s))}}};for(let i of this.current.keys())n(i);this.oncommit(()=>e.discard()),e.#h(),_e=this,this.#v()}#p(e){for(var n=0;n<e.length;n+=1)Ls(e[n],this.#f,this.#c)}capture(e,n,i=!1){e.v!==je&&!this.previous.has(e)&&this.previous.set(e,e.v),(e.f&8388608)===0&&(this.current.set(e,[n,i]),It?.set(e,n)),this.is_fork||(e.v=n)}activate(){_e=this}deactivate(){_e=null,It=null}flush(){try{F&&qa.clear(),Ja=!0,_e=this,this.#v()}finally{if(ec=0,Ka=null,lr=null,jo=null,Ja=!1,_e=null,It=null,yi.clear(),F)for(let e of qa)e.updated=null}}discard(){for(let e of this.#o)e(this);this.#o.clear();for(let e of this.async_deriveds.values())e.reject(Gr);this.#h(),this.#a?.resolve()}register_created_effect(e){this.#m.push(e)}#_(){for(let f=Cs;f!==null;f=f.#n){var e=f.id<this.id,n=[];for(let[u,[m,v]]of this.current){if(f.current.has(u)){var i=f.current.get(u)[0];if(e&&m!==i)f.current.set(u,[m,v]);else continue}n.push(u)}if(e)for(let[u,m]of this.async_deriveds){let v=f.async_deriveds.get(u);v&&m.promise.then(v.resolve).catch(v.reject)}var r=[...f.current.keys()].filter(u=>!f.current.get(u)[1]);if(!(!f.#e||r.length===0)){var o=r.filter(u=>!this.current.has(u));if(o.length===0)e&&f.discard();else if(n.length>0){if(F&&!f.#d&&Pf(f.#r.length===0,"Batch has scheduled roots"),e)for(let u of this.#g)f.unskip_effect(u,m=>{(m.f&4194320)!==0?f.schedule(m):f.#p([m])});f.activate();var s=new Set,l=new Map;for(var d of n)nc(d,o,s,l);l=new Map;var p=[...f.current].filter(([u,m])=>{let v=this.current.get(u);return v?v[0]!==m[0]||v[1]!==m[1]:!0}).map(([u])=>u);if(p.length>0)for(let u of this.#m)(u.f&155648)===0&&Xa(u,p,l)&&((u.f&4194320)!==0?(Re(u,2048),f.schedule(u)):f.#f.add(u));if(f.#r.length>0&&!f.#d){f.apply();for(var c of f.#r)f.#w(c,[],[]);f.#r=[]}f.deactivate()}}}}increment(e,n){if(this.#s+=1,e){let i=this.#i.get(n)??0;this.#i.set(n,i+1)}}decrement(e,n){if(this.#s-=1,e){let i=this.#i.get(n)??0;i===1?this.#i.delete(n):this.#i.set(n,i-1)}this.#d||(this.#d=!0,gt(()=>{this.#d=!1,this.linked&&this.flush()}))}transfer_effects(e,n){for(let i of e)this.#f.add(i);for(let i of n)this.#c.add(i);e.clear(),n.clear()}oncommit(e){this.#l.add(e)}ondiscard(e){this.#o.add(e)}settled(){return(this.#a??=hs()).promise}static ensure(){if(_e===null){let e=_e=new t;!Ja&&!tr&&gt(()=>{e.#e||e.flush()})}return _e}apply(){if(!ht||!this.is_fork&&this.#t===null&&this.#n===null){It=null;return}It=new Map;for(let[n,[i]]of this.current)It.set(n,i);for(let n=Cs;n!==null;n=n.#n)if(!(n===this||n.is_fork)){var e=!1;if(n.id<this.id){for(let[i,[,r]]of n.current)if(!r&&this.current.has(i)){e=!0;break}}if(!e)for(let[i,r]of n.previous)It.has(i)||It.set(i,r)}}schedule(e){if(Ka=e,e.b?.is_pending&&(e.f&16777228)!==0&&(e.f&32768)===0){e.b.defer_effect(e);return}for(var n=e;n.parent!==null;){n=n.parent;var i=n.f;if(lr!==null&&n===ae&&(ht||(ge===null||(ge.f&2)===0)&&!Qf))return;if((i&96)!==0){if((i&1024)===0)return;n.f^=1024}}this.#r.push(n)}#h(){if(this.linked){var e=this.#t,n=this.#n;e===null?Cs=n:e.#n=n,n===null?Wr=e:n.#t=e,this.linked=!1}}};function Qr(t){var e=tr;tr=!0;try{var n;for(t&&(_e!==null&&!_e.is_fork&&_e.flush(),n=t());;){if(Gf(),_e===null)return n;_e.flush()}}finally{tr=e}}function _h(){if(F){var t=new Map;for(let n of _e.current.keys())for(let[i,r]of n.updated??[]){var e=t.get(i);e||(e={error:r.error,count:0},t.set(i,e)),e.count+=r.count}for(let n of t.values())n.error&&console.error(n.error)}try{wf()}catch(n){F&&Pt(n,"stack",{value:""}),Bn(n,Ka)}}var wn=null;function tc(t){var e=t.length;if(e!==0){for(var n=0;n<e;){var i=t[n++];if((i.f&24576)===0&&Fi(i)&&(wn=new Set,ri(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&Za(i),wn?.size>0)){yi.clear();for(let r of wn){if((r.f&24576)!==0)continue;let o=[r],s=r.parent;for(;s!==null;)wn.has(s)&&(wn.delete(s),o.push(s)),s=s.parent;for(let l=o.length-1;l>=0;l--){let d=o[l];(d.f&24576)===0&&ri(d)}}wn.clear()}}wn=null}}function nc(t,e,n,i){if(!n.has(t)&&(n.add(t),t.reactions!==null))for(let r of t.reactions){let o=r.f;(o&2)!==0?nc(r,e,n,i):(o&4194320)!==0&&(o&2048)===0&&Xa(r,e,i)&&(Re(r,2048),Uo(r))}}function Xa(t,e,n){let i=n.get(t);if(i!==void 0)return i;if(t.deps!==null)for(let r of t.deps){if(Ci.call(e,r))return!0;if((r.f&2)!==0&&Xa(r,e,n))return n.set(r,!0),!0}return n.set(t,!1),!1}function Uo(t){_e.schedule(t)}function ic(t,e){if(!((t.f&32)!==0&&(t.f&1024)!==0)){(t.f&2048)!==0?e.d.push(t):(t.f&4096)!==0&&e.m.push(t),Re(t,1024);for(var n=t.first;n!==null;)ic(n,e),n=n.next}}function rc(t){Re(t,1024);for(var e=t.first;e!==null;)rc(e),e=e.next}var sr=new Set,yi=new Map;function Is(t){sr=t}var el=!1;function sc(){el=!0}function Wt(t,e){var n={f:0,v:t,reactions:null,equals:bs,rv:0,wv:0};return F&&Tn&&(n.created=e??Fn("created at"),n.updated=null,n.set_during_effect=!1,n.trace=null),n}function ce(t,e){let n=Wt(t,e);return Ns(n),n}function nr(t,e=!1,n=!0){let i=Wt(t);return e||(i.equals=ws),_i&&n&&Ee!==null&&Ee.l!==null&&(Ee.l.s??=[]).push(i),i}function re(t,e,n=!1){ge!==null&&(!qt||(ge.f&131072)!==0)&&ti()&&(ge.f&4325394)!==0&&(On===null||!On.has(t))&&Sf();let i=n?Ae(e):e;return F&&ys(i,t.label),Rn(t,i,jo)}function Rn(t,e,n=null){if(!t.equals(e)){yi.set(t,bn?e:t.v);var i=hn.ensure();if(i.capture(t,e),F){if(Tn||ae!==null){t.updated??=new Map;let r=(t.updated.get("")?.count??0)+1;if(t.updated.set("",{error:null,count:r}),Tn||r>5){let o=Fn("updated at");if(o!==null){let s=t.updated.get(o.stack);s||(s={error:o,count:0},t.updated.set(o.stack,s)),s.count++}}}ae!==null&&(t.set_during_effect=!0)}if((t.f&2)!==0){let r=t;(t.f&2048)!==0&&Oo(r),It===null&&Rr(r)}t.wv=zr(),ac(t,2048,n),ti()&&ae!==null&&(ae.f&1024)!==0&&(ae.f&96)===0&&(mn===null?lc([t]):mn.push(t)),!i.is_fork&&sr.size>0&&!el&&Ds()}return e}function Ds(){el=!1;for(let t of sr){(t.f&1024)!==0&&Re(t,4096);let e;try{e=Fi(t)}catch{e=!0}e&&ri(t)}sr.clear()}function or(t){re(t,t.v+1)}function ac(t,e,n){var i=t.reactions;if(i!==null)for(var r=ti(),o=i.length,s=0;s<o;s++){var l=i[s],d=l.f;if(!(!r&&l===ae)){var p=(d&2048)===0;if(p&&Re(l,e),(d&131072)!==0)sr.add(l);else if((d&2)!==0){var c=l;It?.delete(c),(d&65536)===0&&(d&512&&(ae===null||(ae.f&2097152)===0)&&(l.f|=65536),ac(c,4096,n))}else if(p){var f=l;(d&16)!==0&&wn!==null&&wn.add(f),n!==null?n.push(f):Uo(f)}}}}var wh=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Ae(t){if(typeof t!="object"||t===null||Vt in t)return t;let e=Dr(t);if(e!==Ta&&e!==ff)return t;var n=new Map,i=gi(t),r=ce(0),o=F&&Tn?Fn("created at"):null,s=Mi,l=f=>{if(Mi===s)return f();var u=ge,m=Mi;bt(null),tl(s);var v=f();return bt(u),tl(m),v};i&&(n.set("length",ce(t.length,o)),F&&(t=yh(t)));var d="";let p=!1;function c(f){if(!p){p=!0,d=f,jt(r,`${d} version`);for(let[u,m]of n)jt(m,fr(d,u));p=!1}}return new Proxy(t,{defineProperty(f,u,m){(!("value"in m)||m.configurable===!1||m.enumerable===!1||m.writable===!1)&&kf();var v=n.get(u);return v===void 0?l(()=>{var y=ce(m.value,o);return n.set(u,y),F&&typeof u=="string"&&jt(y,fr(d,u)),y}):re(v,m.value,!0),!0},deleteProperty(f,u){var m=n.get(u);if(m===void 0){if(u in f){let v=l(()=>ce(je,o));n.set(u,v),or(r),F&&jt(v,fr(d,u))}}else re(m,je),or(r);return!0},get(f,u,m){if(u===Vt)return t;if(F&&u===gs)return c;var v=n.get(u),y=u in f;if(v===void 0&&(!y||cn(f,u)?.writable)&&(v=l(()=>{var b=Ae(y?f[u]:je),A=ce(b,o);return F&&jt(A,fr(d,u)),A}),n.set(u,v)),v!==void 0){var w=a(v);return w===je?void 0:w}return Reflect.get(f,u,m)},getOwnPropertyDescriptor(f,u){var m=Reflect.getOwnPropertyDescriptor(f,u);if(m&&"value"in m){var v=n.get(u);v&&(m.value=a(v))}else if(m===void 0){var y=n.get(u),w=y?.v;if(y!==void 0&&w!==je)return{enumerable:!0,configurable:!0,value:w,writable:!0}}return m},has(f,u){if(u===Vt)return!0;var m=n.get(u),v=m!==void 0&&m.v!==je||Reflect.has(f,u);if(m!==void 0||ae!==null&&(!v||cn(f,u)?.writable)){m===void 0&&(m=l(()=>{var w=v?Ae(f[u]):je,b=ce(w,o);return F&&jt(b,fr(d,u)),b}),n.set(u,m));var y=a(m);if(y===je)return!1}return v},set(f,u,m,v){var y=n.get(u),w=u in f;if(i&&u==="length")for(var b=m;b<y.v;b+=1){var A=n.get(b+"");A!==void 0?re(A,je):b in f&&(A=l(()=>ce(je,o)),n.set(b+"",A),F&&jt(A,fr(d,b)))}if(y===void 0)(!w||cn(f,u)?.writable)&&(y=l(()=>ce(void 0,o)),F&&jt(y,fr(d,u)),re(y,Ae(m)),n.set(u,y));else{w=y.v!==je;var x=l(()=>Ae(m));re(y,x)}var S=Reflect.getOwnPropertyDescriptor(f,u);if(S?.set&&S.set.call(v,m),!w){if(i&&typeof u=="string"){var L=n.get("length"),h=Number(u);Number.isInteger(h)&&h>=L.v&&re(L,h+1)}or(r)}return!0},ownKeys(f){a(r);var u=Reflect.ownKeys(f).filter(y=>{var w=n.get(y);return w===void 0||w.v!==je});for(var[m,v]of n)v.v!==je&&!(m in f)&&u.push(m);return u},setPrototypeOf(){If()}})}function fr(t,e){return typeof e=="symbol"?`${t}[Symbol(${e.description??""})]`:wh.test(e)?`${t}.${e}`:/^\d+$/.test(e)?`${t}[${e}]`:`${t}['${e}']`}function Ts(t){try{if(t!==null&&typeof t=="object"&&Vt in t)return t[Vt]}catch{}return t}var xh=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function yh(t){return new Proxy(t,{get(e,n,i){var r=Reflect.get(e,n,i);return xh.has(n)?function(...o){sc();var s=r.apply(this,o);return Ds(),s}:r}})}function dc(){let t=Array.prototype,e=Array.__svelte_cleanup;e&&e();let{indexOf:n,lastIndexOf:i,includes:r}=t;t.indexOf=function(o,s){let l=n.call(this,o,s);if(l===-1){for(let d=s??0;d<this.length;d+=1)if(Ts(this[d])===o){_s("array.indexOf(...)");break}}return l},t.lastIndexOf=function(o,s){let l=i.call(this,o,s??this.length-1);if(l===-1){for(let d=0;d<=(s??this.length-1);d+=1)if(Ts(this[d])===o){_s("array.lastIndexOf(...)");break}}return l},t.includes=function(o,s){let l=r.call(this,o,s);if(!l){for(let d=0;d<this.length;d+=1)if(Ts(this[d])===o){_s("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{t.indexOf=n,t.lastIndexOf=i,t.includes=r}}var nl,fc,Ho,cc,uc;function Fs(){if(nl===void 0){nl=window,fc=document,Ho=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;cc=cn(e,"firstChild").get,uc=cn(e,"nextSibling").get,Fa(t)&&(t[No]=void 0,t[vs]=null,t[Co]=void 0,t.__e=void 0),Fa(n)&&(n[$o]=void 0),F&&(t.__svelte_meta=null,dc())}}function xt(t=""){return document.createTextNode(t)}function We(t){return cc.call(t)}function Lt(t){return uc.call(t)}function $(t,e){if(!le)return We(t);var n=We(ve);if(n===null)n=ve.appendChild(xt());else if(e&&n.nodeType!==Tr){var i=xt();return n?.before(i),He(i),i}return e&&Hs(n),He(n),n}function te(t,e=!1){if(!le){var n=We(t);return n instanceof Comment&&n.data===""?Lt(n):n}if(e){if(ve?.nodeType!==Tr){var i=xt();return ve?.before(i),He(i),i}Hs(ve)}return ve}function q(t,e=1,n=!1){let i=le?ve:t;for(var r;e--;)r=i,i=Lt(i);if(!le)return i;if(n){if(i?.nodeType!==Tr){var o=xt();return i===null?r?.after(o):i.before(o),He(o),o}Hs(i)}return He(i),i}function Bo(t){t.textContent=""}function Ms(){if(!ht||wn!==null)return!1;var t=ae.f;return(t&32768)!==0}function oi(t,e,n){return e==null||e===us?n?document.createElement(t,{is:n}):document.createElement(t):n?document.createElementNS(e,t,{is:n}):document.createElementNS(e,t)}function Hs(t){if(t.nodeValue.length<65536)return;let e=t.nextSibling;for(;e!==null&&e.nodeType===Tr;)e.remove(),t.nodeValue+=e.nodeValue,e=t.nextSibling}function hc(t){ae===null&&(ge===null&&bf(t),_f()),bn&&vf(t)}function Ah(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function Pn(t,e){var n=ae;if(F)for(;n!==null&&(n.f&131072)!==0;)n=n.parent;n!==null&&(n.f&8192)!==0&&(t|=8192);var i={ctx:Ee,deps:null,nodes:null,f:t|2048|512,first:null,fn:e,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};F&&(i.component_function=pn),_e?.register_created_effect(i);var r=i;if((t&4)!==0)lr!==null?lr.push(i):hn.ensure().schedule(i);else if(e!==null){try{ri(i)}catch(s){throw et(i),s}r.deps===null&&r.teardown===null&&r.nodes===null&&r.first===r.last&&(r.f&524288)===0&&(r=r.first,(t&16)!==0&&(t&65536)!==0&&r!==null&&(r.f|=65536))}if(r!==null&&(r.parent=n,n!==null&&Ah(r,n),ge!==null&&(ge.f&2)!==0&&(t&64)===0)){var o=ge;(o.effects??=[]).push(r)}return i}function Di(){return ge!==null&&!qt}function Gt(t){let e=Pn(8,null);return Re(e,1024),e.teardown=t,e}function ye(t){hc("$effect"),F&&Pt(t,"name",{value:"$effect"});var e=ae.f,n=!ge&&(e&32)!==0&&Ee!==null&&!Ee.i;if(n){var i=Ee;(i.e??=[]).push(t)}else return Oa(t)}function Oa(t){return Pn(1048580,t)}function rl(t){hn.ensure();let e=Pn(524352,t);return()=>{et(e)}}function mc(t){hn.ensure();let e=Pn(524352,t);return(n={})=>new Promise(i=>{n.outro?ii(e,()=>{et(e),i(void 0)}):(et(e),i(void 0))})}function xn(t){return Pn(4,t)}function Zf(t){return Pn(4718592,t)}function Yt(t,e=0){return Pn(8|e,t)}function K(t,e=[],n=[],i=[]){ks(i,e,n,r=>{Pn(8,()=>{t(...r.map(a))})})}function sn(t,e=0){var n=Pn(16|e,t);return F&&(n.dev_stack=Mn),n}function ol(t,e=0){var n=Pn(16777216|e,t);return F&&(n.dev_stack=Mn),n}function lt(t){return Pn(524320,t)}function sl(t){var e=t.teardown;if(e!==null){let n=bn,i=ge;il(!0),bt(null);try{e.call(null)}finally{il(n),bt(i)}}}function Po(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){let r=n.ac;r!==null&&ni(()=>{r.abort(vi)});var i=n.next;(n.f&64)!==0?n.parent=null:et(n,e),n=i}}function gc(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&32)===0&&et(e),e=n}}function et(t,e=!0){var n=!1;(e||(t.f&262144)!==0)&&t.nodes!==null&&t.nodes.end!==null&&(al(t.nodes.start,t.nodes.end),n=!0),t.f|=33554432,Po(t,e&&!n),ar(t,0);var i=t.nodes&&t.nodes.t;if(i!==null)for(let o of i)o.stop();sl(t),t.f^=33554432,t.f|=16384;var r=t.parent;r!==null&&r.first!==null&&Za(t),F&&(t.component_function=null),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes=t.ac=t.b=null}function al(t,e){for(;t!==null;){var n=t===e?null:Lt(t);t.remove(),t=n}}function Za(t){var e=t.parent,n=t.prev,i=t.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),e!==null&&(e.first===t&&(e.first=i),e.last===t&&(e.last=n))}function ii(t,e,n=!0){var i=[];vc(t,i,!0);var r=()=>{n&&et(t),e&&e()},o=i.length;if(o>0){var s=()=>--o||r();for(var l of i)l.out(s)}else r()}function vc(t,e,n){if((t.f&8192)===0){t.f^=8192;var i=t.nodes&&t.nodes.t;if(i!==null)for(let l of i)(l.is_global||n)&&e.push(l);for(var r=t.first;r!==null;){var o=r.next;if((r.f&64)===0){var s=(r.f&65536)!==0||(r.f&32)!==0&&(t.f&16)!==0;vc(r,e,s?n:!1)}r=o}}}function Yr(t){_c(t,!0)}function _c(t,e){if((t.f&8192)!==0){t.f^=8192,(t.f&1024)===0&&(Re(t,2048),hn.ensure().schedule(t));for(var n=t.first;n!==null;){var i=n.next,r=(n.f&65536)!==0||(n.f&32)!==0;_c(n,r?e:!1),n=i}var o=t.nodes&&t.nodes.t;if(o!==null)for(let s of o)(s.is_global||e)&&s.in()}}function Or(t,e){if(t.nodes)for(var n=t.nodes.start,i=t.nodes.end;n!==null;){var r=n===i?null:Lt(n);e.append(n),n=r}}var bc=null;var Bs=!1,bn=!1;function il(t){bn=t}var ge=null,qt=!1;function bt(t){ge=t}var ae=null;function wt(t){ae=t}var On=null;function Ns(t){ge!==null&&(!ht||(ge.f&2)!==0)&&(On??=new Set).add(t)}var kt=null,Jt=0,mn=null;function lc(t){mn=t}var wc=1,cr=0,Mi=cr;function tl(t){Mi=t}function zr(){return++wc}function Fi(t){var e=t.f;if((e&2048)!==0)return!0;if(e&2&&(t.f&=-65537),(e&4096)!==0){for(var n=t.deps,i=n.length,r=0;r<i;r++){var o=n[r];if(Fi(o)&&Va(o),o.wv>t.wv)return!0}(e&512)!==0&&It===null&&Re(t,1024)}return!1}function xc(t,e,n=!0){var i=t.reactions;if(i!==null&&!(!ht&&On!==null&&On.has(t)))for(var r=0;r<i.length;r++){var o=i[r];(o.f&2)!==0?xc(o,e,!1):e===o&&(n?Re(o,2048):(o.f&1024)!==0&&Re(o,4096),Uo(o))}}function Ss(t){var e=kt,n=Jt,i=mn,r=ge,o=On,s=Ee,l=qt,d=Mi,p=t.f;kt=null,Jt=0,mn=null,ge=(p&96)===0?t:null,On=null,bi(t.ctx),qt=!1,Mi=++cr,t.ac!==null&&(ni(()=>{t.ac.abort(vi)}),t.ac=null);try{t.f|=2097152;var c=t.fn,f=c();t.f|=32768;var u=t.deps,m=_e?.is_fork;if(kt!==null){var v;if(m||ar(t,Jt),u!==null&&Jt>0)for(u.length=Jt+kt.length,v=0;v<kt.length;v++)u[Jt+v]=kt[v];else t.deps=u=kt;if(Di()&&(t.f&512)!==0)for(v=Jt;v<u.length;v++)(u[v].reactions??=[]).push(t)}else!m&&u!==null&&Jt<u.length&&(ar(t,Jt),u.length=Jt);if(ti()&&mn!==null&&!qt&&u!==null&&(t.f&6146)===0)for(v=0;v<mn.length;v++)xc(mn[v],t);if(r!==null&&r!==t){if(cr++,r.deps!==null)for(let y=0;y<n;y+=1)r.deps[y].rv=cr;if(e!==null)for(let y of e)y.rv=cr;mn!==null&&(i===null?i=mn:i.push(...mn))}return(t.f&8388608)!==0&&(t.f^=8388608),f}catch(y){return As(y)}finally{t.f^=2097152,kt=e,Jt=n,mn=i,ge=r,On=o,bi(s),qt=l,Mi=d}}function Lh(t,e){let n=e.reactions;if(n!==null){var i=df.call(n,t);if(i!==-1){var r=n.length-1;r===0?n=e.reactions=null:(n[i]=n[r],n.pop())}}if(n===null&&(e.f&2)!==0&&(kt===null||!Ci.call(kt,e))){var o=e;(o.f&512)!==0&&(o.f^=512,o.f&=-65537),o.v!==je&&Rr(o),o.ac!==null&&ni(()=>{o.ac.abort(vi),o.ac=null,Re(o,2048)}),Xf(o),ar(o,0)}}function ar(t,e){var n=t.deps;if(n!==null)for(var i=e;i<n.length;i++)Lh(t,n[i])}function ri(t){var e=t.f;if((e&16384)===0){Re(t,1024);var n=ae,i=Bs;if(ae=t,Bs=(e&96)===0,F){var r=pn;Es(t.component_function);var o=Mn;Br(t.dev_stack??Mn)}try{(e&16777232)!==0?gc(t):Po(t),sl(t);var s=Ss(t);if(t.teardown=typeof s=="function"?s:null,t.wv=wc,F&&Tn&&(t.f&2048)!==0&&t.deps!==null)for(var l of t.deps)l.set_during_effect&&(l.wv=zr(),l.set_during_effect=!1)}finally{Bs=i,ae=n,F&&(Es(r),Br(o))}}}function a(t){var e=t.f,n=(e&2)!==0;if(bc?.add(t),ge!==null&&!qt){var i=ae!==null&&(ae.f&16384)!==0;if(!i&&(On===null||!On.has(t))){var r=ge.deps;if((ge.f&2097152)!==0)t.rv<cr&&(t.rv=cr,kt===null&&r!==null&&r[Jt]===t?Jt++:kt===null?kt=[t]:kt.push(t));else{ge.deps??=[],Ci.call(ge.deps,t)||ge.deps.push(t);var o=t.reactions;o===null?t.reactions=[ge]:Ci.call(o,ge)||o.push(ge)}}}if(F){if(!qt&&an&&_e===null&&Ti===null&&!an.warned&&(an.effect.f&2097152)===0&&!an.effect_deps.has(t)){an.warned=!0,Cf(t.label);var s=Fn("traced at");s&&console.warn(s)}if(Ro.delete(t),Tn&&!qt&&Fo!==null&&ge!==null&&Fo.reaction===ge){if(t.trace)t.trace();else if(s=Fn("traced at"),s){var l=Fo.entries.get(t);l===void 0&&(l={traces:[]},Fo.entries.set(t,l));var d=l.traces[l.traces.length-1];s.stack!==d?.stack&&l.traces.push(s)}}}if(bn&&yi.has(t))return yi.get(t);if(n){var p=t;if(bn){var c=p.v;return((p.f&1024)===0&&p.reactions!==null||Ec(p))&&(c=Oo(p)),yi.set(p,c),c}var f=(p.f&512)===0&&!qt&&ge!==null&&(Bs||(ge.f&512)!==0),u=(p.f&32768)===0;Fi(p)&&(f&&(p.f|=512),Va(p)),f&&!u&&(Ya(p),yc(p))}if(It?.has(t))return It.get(t);if((t.f&8388608)!==0)throw t.v;return t.v}function yc(t){if(t.f|=512,t.deps!==null)for(let e of t.deps)(e.reactions??=[]).push(t),(e.f&2)!==0&&(e.f&512)===0&&(Ya(e),yc(e))}function Ec(t){if(t.v===je)return!0;if(t.deps===null)return!1;for(let e of t.deps)if(yi.has(e)||(e.f&2)!==0&&Ec(e))return!0;return!1}function Xe(t){var e=qt;try{return qt=!0,t()}finally{qt=e}}var Go=Symbol("events"),ll=new Set,Rs=new Set;function xe(t,e,n){(e[Go]??={})[t]=n}function it(t){for(var e=0;e<t.length;e++)ll.add(t[e]);for(var n of Rs)n(t)}var Ac=null;function dl(t){var e=this,n=e.ownerDocument,i=t.type,r=t.composedPath?.()||[],o=r[0]||t.target;Ac=t;var s=0,l=Ac===t&&t[Go];if(l){var d=r.indexOf(l);if(d!==-1&&(e===document||e===window)){t[Go]=e;return}var p=r.indexOf(e);if(p===-1)return;d<=p&&(s=d)}if(o=r[s]||t.target,o!==e){Pt(t,"currentTarget",{configurable:!0,get(){return o||n}});var c=ge,f=ae;bt(null),wt(null);try{for(var u,m=[];o!==null&&o!==e;){try{var v=o[Go]?.[i];v!=null&&(!o.disabled||t.target===o)&&v.call(o,t)}catch(y){u?m.push(y):u=y}if(t.cancelBubble)break;s++,o=s<r.length?r[s]:null}if(u){for(let y of m)queueMicrotask(()=>{throw y});throw u}}finally{t[Go]=e,delete t.currentTarget,bt(c),wt(f)}}}var kh=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:t=>t});function Lc(t){return kh?.createHTML(t)??t}function Os(t){var e=oi("template");return e.innerHTML=Lc(t.replaceAll("<!>","<!---->")),e.content}function Ft(t,e){var n=ae;n.nodes===null&&(n.nodes={start:t,end:e,a:null,t:null})}function P(t,e){var n=(e&1)!==0,i=(e&2)!==0,r,o=!t.startsWith("<!>");return()=>{if(le)return Ft(ve,null),ve;r===void 0&&(r=Os(o?t:"<!>"+t),n||(r=We(r)));var s=i||Ho?document.importNode(r,!0):r.cloneNode(!0);if(n){var l=We(s),d=s.lastChild;Ft(l,d)}else Ft(s,s);return s}}function Ch(t,e,n="svg"){var i=!t.startsWith("<!>"),r=(e&1)!==0,o=`<${n}>${i?t:"<!>"+t}</${n}>`,s;return()=>{if(le)return Ft(ve,null),ve;if(!s){var l=Os(o),d=We(l);if(r)for(s=document.createDocumentFragment();We(d);)s.appendChild(We(d));else s=We(d)}var p=s.cloneNode(!0);if(r){var c=We(p),f=p.lastChild;Ft(c,f)}else Ft(p,p);return p}}function Ei(t,e){return Ch(t,e,"svg")}function me(){if(le)return Ft(ve,null),ve;var t=document.createDocumentFragment(),e=document.createComment(""),n=xt();return t.append(e,n),Ft(e,n),t}function D(t,e){if(le){var n=ae;((n.f&32768)===0||n.nodes.end===null)&&(n.nodes.end=ve),At();return}t!==null&&t.before(e)}var $h=/\r/g;function Ic(t){t=t.replace($h,"");let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return(e>>>0).toString(36)}var Dh=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var m0=[...Dh,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var Th=["touchstart","touchmove"];function Sc(t){return Th.includes(t)}var Fh=["$state","$state.raw","$derived","$derived.by"],g0=[...Fh,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];function Ps(t){return t?.replace(/\//g,"/​")}var fl=!0;function Ce(t,e){var n=e==null?"":typeof e=="object"?`${e}`:e;n!==(t[$o]??=t.nodeValue)&&(t[$o]=n,t.nodeValue=`${n}`)}function Jr(t,e){return Nc(t,e)}function ul(t,e){Fs(),e.intro=e.intro??!1;let n=e.target,i=le,r=ve;try{for(var o=We(n);o&&(o.nodeType!==un||o.data!=="[");)o=Lt(o);if(!o)throw Kn;pt(!0),He(o);let s=Nc(t,{...e,anchor:o});return pt(!1),s}catch(s){if(s instanceof Error&&s.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw s;return s!==Kn&&console.warn("Failed to hydrate: ",s),e.recover===!1&&xf(),Fs(),Bo(n),pt(!1),Jr(t,e)}finally{pt(i),He(r)}}var js=new Map;function Nc(t,{target:e,anchor:n,props:i={},events:r,context:o,intro:s=!0,transformError:l}){Fs();var d=void 0,p=mc(()=>{var c=n??e.appendChild(xt());Ua(c,{pending:()=>{}},m=>{de({});var v=Ee;if(o&&(v.c=o),r&&(i.$$events=r),le&&Ft(m,null),fl=s,d=t(m,i)||{},fl=!0,le&&(ae.nodes.end=ve,ve===null||ve.nodeType!==un||ve.data!=="]"))throw $i(),Kn;fe()},l);var f=new Set,u=m=>{for(var v=0;v<m.length;v++){var y=m[v];if(!f.has(y)){f.add(y);var w=Sc(y);for(let x of[e,document]){var b=js.get(x);b===void 0&&(b=new Map,js.set(x,b));var A=b.get(y);A===void 0?(x.addEventListener(y,dl,{passive:w}),b.set(y,1)):b.set(y,A+1)}}}};return u($r(ll)),Rs.add(u),()=>{for(var m of f)for(let w of[e,document]){var v=js.get(w),y=v.get(m);--y==0?(w.removeEventListener(m,dl),v.delete(m),v.size===0&&js.delete(w)):v.set(m,y)}Rs.delete(u),c!==n&&c.parentNode?.removeChild(c)}});return cl.set(d,p),d}var cl=new WeakMap;function zo(t,e){let n=cl.get(t);return n?(cl.delete(t),n(e)):(F&&(Vt in t?Hf():Mf()),Promise.resolve())}var si=class{anchor;#e=new Map;#t=new Map;#n=new Map;#l=new Set;#o=!0;constructor(e,n=!0){this.anchor=e,this.#o=n}#s=e=>{if(this.#e.has(e)){var n=this.#e.get(e),i=this.#t.get(n);if(i)Yr(i),this.#l.delete(n);else{var r=this.#n.get(n);r&&(Yr(r.effect),this.#t.set(n,r.effect),this.#n.delete(n),F&&(r.fragment.lastChild[Ma]=this.anchor),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),i=r.effect)}for(let[o,s]of this.#e){if(this.#e.delete(o),o===e)break;let l=this.#n.get(s);l&&(et(l.effect),this.#n.delete(s))}for(let[o,s]of this.#t){if(o===n||this.#l.has(o))continue;let l=()=>{if(Array.from(this.#e.values()).includes(o)){var p=document.createDocumentFragment();Or(s,p),p.append(xt()),this.#n.set(o,{effect:s,fragment:p})}else et(s);this.#l.delete(o),this.#t.delete(o)};this.#o||!i?(this.#l.add(o),ii(s,l,!1)):l()}}};#i=e=>{this.#e.delete(e);let n=Array.from(this.#e.values());for(let[i,r]of this.#n)n.includes(i)||(et(r.effect),this.#n.delete(i))};ensure(e,n){var i=_e,r=Ms();if(n&&!this.#t.has(e)&&!this.#n.has(e))if(r){var o=document.createDocumentFragment(),s=xt();o.append(s),this.#n.set(e,{effect:lt(()=>n(s)),fragment:o})}else this.#t.set(e,lt(()=>n(this.anchor)));if(this.#e.set(i,e),r){for(let[l,d]of this.#t)l===e?i.unskip_effect(d):i.skip_effect(d);for(let[l,d]of this.#n)l===e?i.unskip_effect(d.effect):i.skip_effect(d.effect);i.oncommit(this.#s),i.ondiscard(this.#i)}else le&&(this.anchor=ve),this.#s(i)}};function Mt(t,e,...n){var i=new si(t);sn(()=>{let r=e()??null;F&&r==null&&yf(),i.ensure(r,r&&(o=>r(o,...n)))},65536)}if(F){let t=function(e){if(!(e in globalThis)){let n;Object.defineProperty(globalThis,e,{configurable:!0,get:()=>{if(n!==void 0)return n;Af(e)},set:i=>{n=i}})}};t("$state"),t("$effect"),t("$derived"),t("$inspect"),t("$props"),t("$bindable")}function Bh(t){Ee===null&&Fr("onMount"),_i&&Ee.l!==null?Rh(Ee).m.push(t):ye(()=>{let e=Xe(t);if(typeof e=="function")return e})}function Ge(t){Ee===null&&Fr("onDestroy"),Bh(()=>()=>Xe(t))}function Rh(t){var e=t.l;return e.u??={a:[],b:[],m:[]}}function V(t,e,n=!1){var i;le&&(i=ve,At());var r=new si(t),o=n?65536:0;function s(l,d){if(le){var p=To(i);if(l!==parseInt(p.substring(1))){var c=ei();He(c),r.anchor=c,pt(!1),r.ensure(l,d),pt(!0);return}}r.ensure(l,d)}sn(()=>{var l=!1;e((d,p=0)=>{l=!0,s(p,d)}),l||s(-1,null)},o)}function li(t,e){return e}function Qh(t,e,n){for(var i=[],r=e.length,o,s=e.length,l=0;l<r;l++){let f=e[l];ii(f,()=>{if(o){if(o.pending.delete(f),o.done.add(f),o.pending.size===0){var u=t.outrogroups;pl(t,$r(o.done)),u.delete(o),u.size===0&&(t.outrogroups=null)}}else s-=1},!1)}if(s===0){var d=i.length===0&&n!==null&&t.pending.size===0;if(d){var p=n,c=p.parentNode;Bo(c),c.append(p),t.items.clear()}pl(t,e,!d)}else o={pending:new Set(e),done:new Set},(t.outrogroups??=new Set).add(o)}function pl(t,e,n=!0){var i;if(t.pending.size>0){i=new Set;for(let s of t.pending.values())for(let l of s)i.add(t.items.get(l).e)}for(var r=0;r<e.length;r++){var o=e[r];if(i?.has(o)){o.f|=33554432;let s=document.createDocumentFragment();Or(o,s)}else et(e[r],n)}}var Dc;function di(t,e,n,i,r,o=null){var s=t,l=new Map,d=(e&4)!==0;if(d){var p=t;s=le?He(We(p)):p.appendChild(xt())}le&&At();var c=null,f=Ur(()=>{var x=n();return gi(x)?x:x==null?[]:$r(x)});F&&jt(f,"{#each ...}");var u,m=new Map,v=!0;function y(x){(A.effect.f&16384)===0&&(A.pending.delete(x),A.fallback=c,Vh(A,u,s,e,i),c!==null&&(u.length===0?(c.f&33554432)===0?Yr(c):(c.f^=33554432,Qo(c,null,s)):ii(c,()=>{c=null})))}function w(x){A.pending.delete(x)}var b=sn(()=>{u=a(f);var x=u.length;let S=!1;if(le){var L=To(s)==="[!";L!==(x===0)&&(s=ei(),He(s),pt(!1),S=!0)}for(var h=new Set,g=_e,E=Ms(),N=0;N<x;N+=1){le&&ve.nodeType===un&&ve.data==="]"&&(s=ve,S=!0,pt(!1));var T=u[N],O=i(T,N);if(F){var X=i(T,N);O!==X&&gf(String(N),String(O),String(X))}var z=v?null:l.get(O);z?(z.v&&Rn(z.v,T),z.i&&Rn(z.i,N),E&&g.unskip_effect(z.e)):(z=Yh(l,v?s:Dc??=xt(),T,O,N,r,e,n),v||(z.e.f|=33554432),l.set(O,z)),h.add(O)}if(x===0&&o&&!c&&(v?c=lt(()=>o(s)):(c=lt(()=>o(Dc??=xt())),c.f|=33554432)),x>h.size&&(F?Jh(u,i):Ba("","","")),le&&x>0&&He(ei()),!v)if(m.set(g,h),E){for(let[J,Y]of l)h.has(J)||g.skip_effect(Y.e);g.oncommit(y),g.ondiscard(w)}else y(g);S&&pt(!0),a(f)}),A={effect:b,flags:e,items:l,pending:m,outrogroups:null,fallback:c};v=!1,le&&(s=ve)}function Wo(t){for(;t!==null&&(t.f&32)===0;)t=t.next;return t}function Vh(t,e,n,i,r){var o=(i&8)!==0,s=e.length,l=t.items,d=Wo(t.effect.first),p,c=null,f,u=[],m=[],v,y,w,b;if(o)for(b=0;b<s;b+=1)v=e[b],y=r(v,b),w=l.get(y).e,(w.f&33554432)===0&&(w.nodes?.a?.measure(),(f??=new Set).add(w));for(b=0;b<s;b+=1){if(v=e[b],y=r(v,b),w=l.get(y).e,t.outrogroups!==null)for(let T of t.outrogroups)T.pending.delete(w),T.done.delete(w);if((w.f&8192)!==0&&(Yr(w),o&&(w.nodes?.a?.unfix(),(f??=new Set).delete(w))),(w.f&33554432)!==0)if(w.f^=33554432,w===d)Qo(w,null,n);else{var A=c?c.next:d;w===t.effect.last&&(t.effect.last=w.prev),w.prev&&(w.prev.next=w.next),w.next&&(w.next.prev=w.prev),Hi(t,c,w),Hi(t,w,A),Qo(w,A,n),c=w,u=[],m=[],d=Wo(c.next);continue}if(w!==d){if(p!==void 0&&p.has(w)){if(u.length<m.length){var x=m[0],S;c=x.prev;var L=u[0],h=u[u.length-1];for(S=0;S<u.length;S+=1)Qo(u[S],x,n);for(S=0;S<m.length;S+=1)p.delete(m[S]);Hi(t,L.prev,h.next),Hi(t,c,L),Hi(t,h,x),d=x,c=h,b-=1,u=[],m=[]}else p.delete(w),Qo(w,d,n),Hi(t,w.prev,w.next),Hi(t,w,c===null?t.effect.first:c.next),Hi(t,c,w),c=w;continue}for(u=[],m=[];d!==null&&d!==w;)(p??=new Set).add(d),m.push(d),d=Wo(d.next);if(d===null)continue}(w.f&33554432)===0&&u.push(w),c=w,d=Wo(w.next)}if(t.outrogroups!==null){for(let T of t.outrogroups)T.pending.size===0&&(pl(t,$r(T.done)),t.outrogroups?.delete(T));t.outrogroups.size===0&&(t.outrogroups=null)}if(d!==null||p!==void 0){var g=[];if(p!==void 0)for(w of p)(w.f&8192)===0&&g.push(w);for(;d!==null;)(d.f&8192)===0&&d!==t.fallback&&g.push(d),d=Wo(d.next);var E=g.length;if(E>0){var N=(i&4)!==0&&s===0?n:null;if(o){for(b=0;b<E;b+=1)g[b].nodes?.a?.measure();for(b=0;b<E;b+=1)g[b].nodes?.a?.fix()}Qh(t,g,N)}}o&&gt(()=>{if(f!==void 0)for(w of f)w.nodes?.a?.apply()})}function Yh(t,e,n,i,r,o,s,l){var d=(s&1)!==0?(s&16)===0?nr(n,!1,!1):Wt(n):null,p=(s&2)!==0?Wt(r):null;return F&&d&&(d.trace=()=>{l()[p?.v??r]}),{v:d,i:p,e:lt(()=>(o(e,d??n,p??r,l),()=>{t.delete(i)}))}}function Qo(t,e,n){if(t.nodes)for(var i=t.nodes.start,r=t.nodes.end,o=e&&(e.f&33554432)===0?e.nodes.start:n;i!==null;){var s=Lt(i);if(o.before(i),i===r)return;i=s}}function Hi(t,e,n){e===null?t.effect.first=n:e.next=n,n===null?t.effect.last=e:n.prev=e}function Jh(t,e){let n=new Map,i=t.length;for(let r=0;r<i;r++){let o=e(t[r],r);if(n.has(o)){let s=String(n.get(o)),l=String(r),d=String(o);d.startsWith("[object ")&&(d=null),Ba(s,l,d)}n.set(o,r)}}function qh(t,e,n){if(!e||e===Ic(String(n??"")))return;let i,r=t.__svelte_meta?.loc;r?i=`near ${r.file}:${r.line}:${r.column}`:pn?.[tn]&&(i=`in ${pn[tn]}`),Ff(Ps(i))}function ur(t,e,n=!1,i=!1,r=!1,o=!1){var s=t,l="";if(n){var d=t;le&&(s=He(We(d)))}K(()=>{var p=ae;if(l===(l=e()??"")){le&&At();return}if(n&&!le){p.nodes=null,d.innerHTML=l,l!==""&&Ft(We(d),d.lastChild);return}if(p.nodes!==null&&(al(p.nodes.start,p.nodes.end),p.nodes=null),l!==""){if(le){for(var c=ve.data,f=At(),u=f;f!==null&&(f.nodeType!==un||f.data!=="");)u=f,f=Lt(f);if(f===null)throw $i(),Kn;F&&!o&&qh(f.parentNode,c,l),Ft(ve,u),s=He(f);return}var m=i?So:r?Ca:void 0,v=oi(i?"svg":r?"math":"template",m);v.innerHTML=l;var y=i||r?v:v.content;if(Ft(We(y),y.lastChild),i||r)for(;We(y);)s.before(We(y));else s.before(y)}})}function at(t,e){var n=void 0,i;ol(()=>{n!==(n=e())&&(i&&(et(i),i=null),n&&(i=lt(()=>{xn(()=>n(t))})))})}function Mc(t){var e,n,i="";if(typeof t=="string"||typeof t=="number")i+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=Mc(t[e]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}function Hc(){for(var t,e,n=0,i="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=Mc(t))&&(i&&(i+=" "),i+=e);return i}function ln(t){return typeof t=="object"?Hc(t):t??""}var Bc=[...` 	
\r\f \v\uFEFF`];function Oc(t,e,n){var i=t==null?"":""+t;if(e&&(i=i?i+" "+e:e),n){for(var r of Object.keys(n))if(n[r])i=i?i+" "+r:r;else if(i.length)for(var o=r.length,s=0;(s=i.indexOf(r,s))>=0;){var l=s+o;(s===0||Bc.includes(i[s-1]))&&(l===i.length||Bc.includes(i[l]))?i=(s===0?"":i.substring(0,s))+i.substring(l+1):s=l}}return i===""?null:i}function Rc(t,e=!1){var n=e?" !important;":";",i="";for(var r of Object.keys(t)){var o=t[r];o!=null&&o!==""&&(i+=" "+r+": "+o+n)}return i}function hl(t){return t[0]!=="-"||t[1]!=="-"?t.toLowerCase():t}function Pc(t,e){if(e){var n="",i,r;if(Array.isArray(e)?(i=e[0],r=e[1]):i=e,t){t=String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var o=!1,s=0,l=!1,d=[];i&&d.push(...Object.keys(i).map(hl)),r&&d.push(...Object.keys(r).map(hl));var p=0,c=-1;let y=t.length;for(var f=0;f<y;f++){var u=t[f];if(l?u==="/"&&t[f-1]==="*"&&(l=!1):o?o===u&&(o=!1):u==="/"&&t[f+1]==="*"?l=!0:u==='"'||u==="'"?o=u:u==="("?s++:u===")"&&s--,!l&&o===!1&&s===0){if(u===":"&&c===-1)c=f;else if(u===";"||f===y-1){if(c!==-1){var m=hl(t.substring(p,c).trim());if(!d.includes(m)){u!==";"&&f++;var v=t.substring(p,f).trim();n+=" "+v+";"}}p=f+1,c=-1}}}}return i&&(n+=Rc(i)),r&&(n+=Rc(r,!0)),n=n.trim(),n===""?null:n}return t==null?null:String(t)}function Ie(t,e,n,i,r,o){var s=t[No];if(le||s!==n||s===void 0){var l=Oc(n,i,o);(!le||l!==t.getAttribute("class"))&&(l==null?t.removeAttribute("class"):e?t.className=l:t.setAttribute("class",l)),t[No]=n}else if(o&&r!==o)for(var d in o){var p=!!o[d];(r==null||p!==!!r[d])&&t.classList.toggle(d,p)}return o}function ml(t,e={},n,i){for(var r in n){var o=n[r];e[r]!==o&&(n[r]==null?t.style.removeProperty(r):t.style.setProperty(r,o,i))}}function Q(t,e,n,i){var r=t[Co];if(le||r!==e){var o=Pc(e,i);(!le||o!==t.getAttribute("style"))&&(o==null?t.removeAttribute("style"):t.style.cssText=o),t[Co]=e}else i&&(Array.isArray(i)?(ml(t,n?.[0],i[0]),ml(t,n?.[1],i[1],"important")):ml(t,n,i));return i}var rm=Symbol("is custom element"),om=Symbol("is html"),sm=Ha?"link":"LINK";function G(t,e,n,i){var r=am(t);if(le&&(r[e]=t.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&t.nodeName===sm)){i||dm(t,e,n??"");return}r[e]!==(r[e]=n)&&(e==="loading"&&(t[cf]=n),n==null?t.removeAttribute(e):typeof n!="string"&&lm(t).includes(e)?t[e]=n:t.setAttribute(e,n))}function am(t){return t[vs]??={[rm]:t.nodeName.includes("-"),[om]:t.namespaceURI===us}}var jc=new Map;function lm(t){var e=t.getAttribute("is")||t.nodeName,n=jc.get(e);if(n)return n;jc.set(e,n=[]);for(var i,r=t,o=Element.prototype;o!==r;){i=Da(r);for(var s in i)i[s].set&&s!=="innerHTML"&&s!=="textContent"&&s!=="innerText"&&n.push(s);r=Dr(r)}return n}function dm(t,e,n){F&&(e==="srcset"&&fm(t,n)||gl(t.getAttribute(e)??"",n)||Tf(e,t.outerHTML.replace(t.innerHTML,t.innerHTML&&"..."),String(n)))}function gl(t,e){return t===e?!0:new URL(t,document.baseURI).href===new URL(e,document.baseURI).href}function Uc(t){return t.split(",").map(e=>e.trim().split(" ").filter(Boolean))}function fm(t,e){var n=Uc(t.srcset),i=Uc(e);return i.length===n.length&&i.every(([r,o],s)=>o===n[s][1]&&(gl(n[s][0],r)||gl(r,n[s][0])))}var um={get(t,e){if(!t.exclude.has(e))return t.props[e]},set(t,e){return F&&Ef(`${t.name}.${String(e)}`),!1},getOwnPropertyDescriptor(t,e){if(!t.exclude.has(e)&&e in t.props)return{enumerable:!0,configurable:!0,value:t.props[e]}},has(t,e){return t.exclude.has(e)?!1:e in t.props},ownKeys(t){return Reflect.ownKeys(t.props).filter(e=>!t.exclude.has(e))}};function pe(t,e,n){return new Proxy(F?{props:t,exclude:e,name:n}:{props:t,exclude:e},um)}function Gc(t){return new _l(t)}var _l=class{#e;#t;constructor(e){var n=new Map,i=(o,s)=>{var l=nr(s,!1,!1);return n.set(o,l),l};let r=new Proxy({...e.props||{},$$events:{}},{get(o,s){return a(n.get(s)??i(s,Reflect.get(o,s)))},has(o,s){return s===ms?!0:(a(n.get(s)??i(s,Reflect.get(o,s))),Reflect.has(o,s))},set(o,s,l){return re(n.get(s)??i(s,l),l),Reflect.set(o,s,l)}});this.#t=(e.hydrate?ul:Jr)(e.component,{target:e.target,anchor:e.anchor,props:r,context:e.context,intro:e.intro??!1,recover:e.recover,transformError:e.transformError}),!ht&&(!e?.props?.$$host||e.sync===!1)&&Qr(),this.#e=r.$$events;for(let o of Object.keys(this.#t))o==="$set"||o==="$destroy"||o==="$on"||Pt(this,o,{get(){return this.#t[o]},set(s){this.#t[o]=s},enumerable:!0});this.#t.$set=o=>{Object.assign(r,o)},this.#t.$destroy=()=>{zo(this.#t)}}$set(e){this.#t.$set(e)}$on(e,n){this.#e[e]=this.#e[e]||[];let i=(...r)=>n.call(this,...r);return this.#e[e].push(i),()=>{this.#e[e]=this.#e[e].filter(r=>r!==i)}}$destroy(){this.#t.$destroy()}};var wm;typeof HTMLElement=="function"&&(wm=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(t,e,n){super(),this.$$ctor=t,this.$$s=e,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(t,e,n){if(this.$$l[t]=this.$$l[t]||[],this.$$l[t].push(e),this.$$c){let i=this.$$c.$on(t,e);this.$$l_u.set(e,i)}super.addEventListener(t,e,n)}removeEventListener(t,e,n){if(super.removeEventListener(t,e,n),this.$$c){let i=this.$$l_u.get(e);i&&(i(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let t=function(i){return r=>{let o=oi("slot");i!=="default"&&(o.name=i),D(r,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let e={},n=xm(this);for(let i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=t(i),e.default=!0):e[i]=t(i));for(let i of this.attributes){let r=this.$$g_p(i.name);r in this.$$d||(this.$$d[r]=bl(r,i.value,this.$$p_d,"toProp"))}for(let i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Gc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=rl(()=>{Yt(()=>{this.$$r=!0;for(let i of $a(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];let r=bl(i,this.$$d[i],this.$$p_d,"toAttribute");r==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,r)}this.$$r=!1})});for(let i in this.$$l)for(let r of this.$$l[i]){let o=this.$$c.$on(i,r);this.$$l_u.set(r,o)}this.$$l={}}}attributeChangedCallback(t,e,n){this.$$r||(t=this.$$g_p(t),this.$$d[t]=bl(t,n,this.$$p_d,"toProp"),this.$$c?.$set({[t]:this.$$d[t]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(t){return $a(this.$$p_d).find(e=>this.$$p_d[e].attribute===t||!this.$$p_d[e].attribute&&e.toLowerCase()===t)||t}});function bl(t,e,n,i){let r=n[t]?.type;if(e=r==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(r){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(r){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function xm(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var tt="--diff-font-size--",$e="--diff-aside-width--";var fi=()=>{let t=ce(!1);return ye(()=>{re(t,!0)}),()=>a(t)};var zc=Symbol("fontSize");function Wc(t){Ve(zc,()=>t.diffViewFontSize||14)}function qr(){return Qe(zc)}var Qc=Symbol("enableWrap");function Vc(t){Ve(Qc,()=>t.diffViewWrap)}function yn(){return Qe(Qc)}var Yc=Symbol("renderWidget");function Jc(t){Ve(Yc,()=>t.renderWidgetLine)}function Kr(){return Qe(Yc)}var qc=Symbol("id");function Kc(t){Ve(qc,t)}function Gs(){return Qe(qc)}var Xc=Symbol("dom");function Zc(t){Ve(Xc,t)}function zs(){return Qe(Xc)}var eu=Symbol("extend");function tu(t){Ve(eu,()=>t.extendData)}function Xr(){return Qe(eu)}var nu=Symbol("widget");function iu(t){Ve(nu,()=>t)}function En(){return Qe(nu)}var ru=Symbol("renderExtendLine");function ou(t){Ve(ru,()=>t.renderExtendLine)}function Zr(){return Qe(ru)}var su=Symbol("onAddWidgetClick");function au(t){Ve(su,()=>t.onAddWidgetClick)}function eo(){return Qe(su)}var lu=Symbol("enableHighlight");function du(t){Ve(lu,()=>t.diffViewHighlight)}function to(){return Qe(lu)}var fu=Symbol("enableAddWidget");function cu(t){Ve(fu,()=>t.diffViewAddWidget)}function no(){return Qe(fu)}var uu=Symbol("mode");function pu(t){Ve(uu,()=>t.diffViewMode||Ot.Split)}function Ws(){return Qe(uu)}var wl=null,ym=(t,e)=>`${t.fontFamily}-${t.fontStyle}-${t.fontSize}-${e}`,Em=(t,e)=>ym(t,"0".repeat(e.length)),yl=class{#e="";#t={};#n(){return wl=wl||document.createElement("canvas").getContext("2d"),wl}measure(e,n){let i=Em(n||{},e);if(this.#t[i])return this.#t[i];let r=this.#n();if(n){let s=`${n.fontFamily}-${n.fontStyle}-${n.fontSize}`;this.#e!==s&&(this.#e=s,r.font=`${n.fontStyle||""} ${n.fontSize||""} ${n.fontFamily||""}`)}else r.font="";return r.measureText(e).width}},xl=null,hu=()=>(xl=xl||new yl,xl);var io=({text:t,font:e})=>{let n=I(fi()),i=parseInt(e().fontSize||"14"),r=6;r+=i>10?(i-10)*.6:0;let o=ce(r*t().length);return ye(()=>{a(n)&&re(o,hu().measure(t()||"",e()),!0)}),()=>a(o)};var An=()=>{window.getSelection()?.removeAllRanges()},mu=(t,e)=>{let n=function(i){i===null||i.target===null||(i.target===t?(e.scrollTop=t.scrollTop,e.scrollLeft=t.scrollLeft):(t.scrollTop=e.scrollTop,t.scrollLeft=e.scrollLeft))};return t.onscroll||(t.onscroll=n),e.onscroll||(e.onscroll=n),()=>{t.onscroll=null,e.onscroll=null}},Qs=t=>{if(t){let e=t.getRootNode();return e instanceof ShadowRoot?e:t.ownerDocument}return document},ro=t=>{if(t){if(typeof t.closest=="function")return t.closest('[data-component="git-diff-view"]')?.querySelector?.(".diff-view-wrapper")?.getAttribute?.("id");{let e=t;for(;e;){if(e.getAttribute&&e.getAttribute("data-component")==="git-diff-view")return e.querySelector(".diff-view-wrapper")?.getAttribute("id");e=e.parentElement}}}};var El="--diff-add-content--",Al="--diff-del-content--",gn="--diff-border--",Ll="--diff-add-lineNumber--",kl="--diff-del-lineNumber--",Il="--diff-plain-content--",Vs="--diff-expand-content--",dt="--diff-plain-lineNumber-color--",pr="--diff-expand-lineNumber-color--",Sl="--diff-plain-lineNumber--",Am="--diff-expand-lineNumber--",dn="--diff-hunk-content--",jn="--diff-hunk-content-color--",Un="--diff-hunk-lineNumber--";var Ys="--diff-add-widget--",Js="--diff-add-widget-color--",Kt="--diff-empty-content--",Vo=(t,e,n)=>t?`var(${El})`:e?`var(${Al})`:n?`var(${Il})`:`var(${Vs})`,Yo=(t,e,n)=>t?`var(${Ll})`:e?`var(${kl})`:n?`var(${Sl})`:`var(${Am})`;var Lm=new Set(["$$slots","$$events","$$legacy"]),km=P('<div><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Bi(t,e){de(e,!0);let n=pe(e,Lm);var i=km(),r=$(i);C(i),K(()=>{G(i,"data-add-widget",B[e.side]),Ie(i,1,"diff-add-widget-wrapper invisible select-none transition-transform hover:scale-110 group-hover:visible"+(e.className?" "+e.className:"")),Q(i,`
		width: calc(var(${tt}) * 1.4);
		height: calc(var(${tt}) * 1.4);
		top: calc(var(${tt}) * 0.1);
	`),Q(r,`
			color: var(${Js});
			background-color: var(${Ys});
    `)}),xe("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),D(t,i),fe()}it(["mousedown"]);Rf();var Im=Ei('<svg aria-label="No newline at end of file" role="img" viewBox="0 0 16 16" version="1.1" fill="currentColor"><path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>');function Jo(t){var e=Im();D(t,e)}var Sm=new Set(["$$slots","$$events","$$legacy"]),Nm=P('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),Cm=P('<span class="diff-line-content-raw"><span data-template=""></span><!></span>'),gu=P('<span class="diff-line-content-raw"> </span>'),$m=P('<span class="diff-line-content-raw"><span data-template=""></span></span>');function qo(t,e){de(e,!0);let n=pe(e,Sm);e.diffLine?.changes?.hasLineChange?e.diffLine?.plainTemplate&&typeof Ao=="function"&&Ao({diffLine:e.diffLine,rawLine:e.rawLine,operator:e.operator||"add"}):e.plainLine&&!e.plainLine?.template&&(e.plainLine.template=Aa(e.plainLine.value));var r=me(),o=te(r);{var s=p=>{var c=me(),f=te(c);{var u=v=>{var y=Cm(),w=$(y);ur(w,()=>e.diffLine.plainTemplate,!0),C(w);var b=q(w);{var A=x=>{var S=Nm(),L=$(S);Jo(L,{}),C(S),K(()=>{Ie(S,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),Q(S,`
						width: var(${tt});
						height: var(${tt})
					`)}),D(x,S)};V(b,x=>{e.diffLine.changes.newLineSymbol===Cr.NEWLINE&&x(A)})}C(y),D(v,y)},m=v=>{var y=gu(),w=$(y,!0);C(y),K(()=>Ce(w,e.rawLine)),D(v,y)};V(f,v=>{e.diffLine?.plainTemplate?v(u):v(m,-1)})}D(p,c)},l=p=>{var c=$m(),f=$(c);ur(f,()=>e.plainLine.template,!0),C(f),C(c),D(p,c)},d=p=>{var c=gu(),f=$(c,!0);C(c),K(()=>Ce(f,e.rawLine)),D(p,c)};V(o,p=>{e.diffLine?.changes?.hasLineChange?p(s):e.plainLine?.template?p(l,1):p(d,-1)})}D(t,r),fe()}var Dm=new Set(["$$slots","$$events","$$legacy"]),Tm=P('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),Fm=P('<span class="diff-line-syntax-raw"><span data-template=""></span><!></span>'),vu=P("<span> </span>"),_u=P('<span class="diff-line-syntax-raw"></span>'),Mm=P('<span class="diff-line-syntax-raw"><span data-template=""></span></span>');function Nl(t,e){de(e,!0);let n=pe(e,Dm);e.diffLine?.changes?.hasLineChange?e.syntaxLine&&e.diffLine&&!e.diffLine?.syntaxTemplate&&typeof Lo=="function"&&Lo({diffFile:e.diffFile,diffLine:e.diffLine,syntaxLine:e.syntaxLine,operator:e.operator||"add"}):e.syntaxLine&&!e.syntaxLine.template&&(e.syntaxLine.template=Ea(e.syntaxLine));var r=me(),o=te(r);{var s=c=>{qo(c,{get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get operator(){return e.operator},get enableWrap(){return e.enableWrap}})},l=c=>{var f=me(),u=te(f);{var m=y=>{var w=Fm(),b=$(w);ur(b,()=>e.diffLine.syntaxTemplate,!0),C(b);var A=q(b);{var x=S=>{var L=Tm(),h=$(L);Jo(h,{}),C(L),K(()=>{Ie(L,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),Q(L,`
                width: var(${tt});
                height: var(${tt});
              `)}),D(S,L)};V(A,S=>{e.diffLine.changes.newLineSymbol===Cr.NEWLINE&&S(x)})}C(w),D(y,w)},v=y=>{var w=_u();di(w,21,()=>e.syntaxLine.nodeList,li,(b,A)=>{let x=()=>a(A).node,S=()=>a(A).wrapper;var L=vu(),h=$(L,!0);C(L),K(g=>{G(L,"data-start",x().startIndex),G(L,"data-end",x().endIndex),Ie(L,1,g),Q(L,S()?.properties?.style),Ce(h,x().value)},[()=>ln(S()?.properties?.className?.join(" "))]),D(b,L)}),C(w),D(y,w)};V(u,y=>{e.diffLine?.syntaxTemplate?y(m):y(v,-1)})}D(c,f)},d=c=>{var f=Mm(),u=$(f);ur(u,()=>e.syntaxLine.template,!0),C(u),C(f),D(c,f)},p=c=>{var f=_u();di(f,21,()=>e.syntaxLine.nodeList,li,(u,m)=>{let v=()=>a(m).node,y=()=>a(m).wrapper;var w=vu(),b=$(w,!0);C(w),K(A=>{G(w,"data-start",v().startIndex),G(w,"data-end",v().endIndex),Ie(w,1,A),Q(w,y()?.properties?.style),Ce(b,v().value)},[()=>ln(y()?.properties?.className?.join(" "))]),D(u,w)}),C(f),D(c,f)};V(o,c=>{e.syntaxLine?e.diffLine?.changes?.hasLineChange?c(l,1):e.syntaxLine.template?c(d,2):c(p,-1):c(s)})}D(t,r),fe()}var Hm=new Set(["$$slots","$$events","$$legacy"]),Bm=P('<div class="diff-line-content-item pl-[2.0em]"><span class="diff-line-content-operator ml-[-1.5em] inline-block w-[1.5em] select-none indent-[0.2em]"> </span> <!></div>');function ci(t,e){de(e,!0);let n=pe(e,Hm),i=I(()=>e.diffLine?.type===Be.Add),r=I(()=>e.diffLine?.type===Be.Delete),o=I(()=>e.syntaxLine&&e.syntaxLine?.nodeList?.length>150);var s=Bm(),l=$(s),d=$(l,!0);C(l);var p=q(l,2);{var c=u=>{{let m=I(()=>a(i)?"add":a(r)?"del":void 0);Nl(u,{get operator(){return a(m)},get rawLine(){return e.rawLine},get diffFile(){return e.diffFile},get diffLine(){return e.diffLine},get syntaxLine(){return e.syntaxLine},get enableWrap(){return e.enableWrap}})}},f=u=>{{let m=I(()=>a(i)?"add":a(r)?"del":void 0);qo(u,{get operator(){return a(m)},get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get plainLine(){return e.plainLine},get enableWrap(){return e.enableWrap}})}};V(p,u=>{e.enableHighlight&&e.syntaxLine&&!a(o)?u(c):u(f,-1)})}C(s),K(()=>{Q(s,`
		white-space: ${e.enableWrap?"pre-wrap":"pre"};
		word-break: ${e.enableWrap?"break-all":"initial"}
	`),G(l,"data-operator",a(i)?"+":a(r)?"-":void 0),Ce(d,a(i)?"+":a(r)?"-":" ")}),D(t,s),fe()}var Rm=new Set(["$$slots","$$events","$$legacy"]),Om=P('<td class="diff-line-old-num group relative w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-old-content group relative pr-[10px] align-top"><!> <!></td>',1),Pm=P('<td class="diff-line-old-placeholder select-none"><span>&ensp;</span></td>'),jm=P('<td class="diff-line-new-num group relative w-[1%] min-w-[40px] select-none border-l-[1px] pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-new-content group relative pr-[10px] align-top"><!> <!></td>',1),Um=P('<td class="diff-line-new-placeholder select-none border-l-[1px]"><span>&ensp;</span></td>'),Gm=P('<tr class="diff-line"><!><!></tr>');function Cl(t,e){de(e,!0);let n=pe(e,Rm),i=I(En()),r=I(no()),o=I(to()),s=I(eo()),l=I(()=>e.diffFile.getSplitLeftLine(e.index)),d=I(()=>e.diffFile.getSplitRightLine(e.index)),p=()=>e.diffFile.getOldSyntaxLine(a(l)?.lineNumber||0),c=()=>e.diffFile.getNewSyntaxLine(a(d)?.lineNumber||0),f=()=>e.diffFile.getOldPlainLine(a(l)?.lineNumber||0),u=()=>e.diffFile.getNewPlainLine(a(d)?.lineNumber||0),m=ce(Ae(p())),v=ce(Ae(c())),y=ce(Ae(f())),w=ce(Ae(u())),b=I(()=>!!a(l)?.diff||!!a(d)?.diff),A=I(()=>Xi(a(l)?.diff)||Xi(a(d)?.diff)),x=I(()=>a(l)?.isHidden&&a(d)?.isHidden),S=()=>a(l)?.diff?.type===Be.Delete,L=()=>a(d)?.diff?.type===Be.Add,h=()=>{re(m,p(),!0),re(v,c(),!0),re(y,f(),!0),re(w,u(),!0)},g={current:()=>{}};ye(()=>{g.current(),h(),g.current=e.diffFile.subscribe(h)}),Ge(()=>g.current());let E=(X,z)=>{a(i).side=z,a(i).lineNumber=X};var N=me(),T=te(N);{var O=X=>{var z=Gm(),J=$(z);{var Y=U=>{var H=Om(),ee=te(H),se=$(ee);{var ie=we=>{{let Le=I(()=>a(l)?.lineNumber||0);Bi(we,{get index(){return e.index},get lineNumber(){return a(Le)},get side(){return B.old},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:E})}};V(se,we=>{a(b)&&a(r)&&we(ie)})}var ne=q(se,2),Z=$(ne,!0);C(ne),C(ee);var oe=q(ee,2),ue=$(oe);{var he=we=>{{let Le=I(()=>a(l)?.lineNumber||0);Bi(we,{get index(){return e.index},get lineNumber(){return a(Le)},get side(){return B.old},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:E})}};V(ue,we=>{a(b)&&a(r)&&we(he)})}var Fe=q(ue,2);{let we=I(()=>a(l)?.value||""),Le=I(()=>a(l)?.diff),De=I(()=>!!a(o));ci(Fe,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return a(we)},get diffLine(){return a(Le)},get plainLine(){return a(y)},get syntaxLine(){return a(m)},get enableHighlight(){return a(De)}})}C(oe),K((we,Le)=>{Q(ee,we),G(ee,"data-side",B[B.old]),G(ne,"data-line-num",a(l)?.lineNumber),Q(ne,`opacity: ${a(A)?void 0:.5} `),Ce(Z,a(l)?.lineNumber),Q(oe,Le),G(oe,"data-side",B[B.old])},[()=>`
					background-color: ${Yo(!1,S(),a(b))};
					color: var(${a(b)?dt:pr})
				`,()=>` background-color: ${Vo(!1,S(),a(b))} `]),D(U,H)},be=U=>{var H=Pm();G(H,"colspan",2),K(()=>Q(H,`background-color: var(${Kt}) `)),D(U,H)};V(J,U=>{a(l)?.lineNumber?U(Y):U(be,-1)})}var j=q(J);{var M=U=>{var H=jm(),ee=te(H),se=$(ee);{var ie=we=>{{let Le=I(()=>a(d)?.lineNumber||0);Bi(we,{get index(){return e.index},get lineNumber(){return a(Le)},get side(){return B.new},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:E})}};V(se,we=>{a(b)&&a(r)&&we(ie)})}var ne=q(se,2),Z=$(ne,!0);C(ne),C(ee);var oe=q(ee,2),ue=$(oe);{var he=we=>{{let Le=I(()=>a(d)?.lineNumber||0);Bi(we,{get index(){return e.index},get lineNumber(){return a(Le)},get side(){return B.new},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:E})}};V(ue,we=>{a(b)&&a(r)&&we(he)})}var Fe=q(ue,2);{let we=I(()=>a(d)?.value||""),Le=I(()=>a(d)?.diff),De=I(()=>!!a(o));ci(Fe,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return a(we)},get diffLine(){return a(Le)},get plainLine(){return a(w)},get syntaxLine(){return a(v)},get enableHighlight(){return a(De)}})}C(oe),K((we,Le)=>{Q(ee,we),G(ee,"data-side",B[B.new]),G(ne,"data-line-num",a(d)?.lineNumber),Q(ne,` opacity: ${a(A)?void 0:.5} `),Ce(Z,a(d)?.lineNumber),Q(oe,Le),G(oe,"data-side",B[B.new])},[()=>`
					background-color: ${Yo(L(),!1,a(b))};
					color: var(${a(b)?dt:pr});
					border-left-color: var(${gn});
					border-left-style: solid
				`,()=>`background-color: ${Vo(L(),!1,a(b))} `]),D(U,H)},R=U=>{var H=Um();G(H,"colspan",2),K(()=>Q(H,`
					background-color: var(${Kt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(U,H)};V(j,U=>{a(d)?.lineNumber?U(M):U(R,-1)})}C(z),K(()=>{G(z,"data-line",e.lineNumber),G(z,"data-state",a(b)?"diff":"plain")}),D(X,z)};V(T,X=>{a(x)||X(O)})}D(t,N),fe()}var zm=new Set(["$$slots","$$events","$$legacy"]),Wm=P('<td class="diff-line-extend-old-content p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),Qm=P('<td class="diff-line-extend-old-placeholder select-none p-0"></td>'),Vm=P('<td class="diff-line-extend-new-content border-l-[1px] p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),Ym=P('<td class="diff-line-extend-new-placeholder select-none border-l-[1px] p-0"></td>'),Jm=P('<tr data-state="extend" class="diff-line diff-line-extend"><!><!></tr>');function $l(t,e){de(e,!0);let n=pe(e,zm),i=I(Xr()),r=I(Zr()),o=I(()=>e.diffFile.getSplitLeftLine(e.index)),s=I(()=>e.diffFile.getSplitRightLine(e.index)),l=I(()=>e.diffFile.getExpandEnabled()),d=I(()=>a(i)?.oldFile?.[a(o)?.lineNumber||""]),p=I(()=>a(i)?.newFile?.[a(s)?.lineNumber||""]),c=I(()=>!!((a(d)||a(p))&&(!a(o)?.isHidden&&!a(s)?.isHidden||a(l))&&a(r)));var f=me(),u=te(f);{var m=v=>{var y=Jm(),w=$(y);{var b=h=>{var g=Wm();G(g,"colspan",2);var E=$(g),N=$(E);Mt(N,()=>a(r),()=>({diffFile:e.diffFile,side:B.old,lineNumber:a(o)?.lineNumber||0,data:a(d)?.data,onUpdate:e.diffFile.notifyAll})),C(E),C(g),D(h,g)},A=h=>{var g=Qm();G(g,"colspan",2),K(()=>Q(g,`background-color: var(${Kt})`)),D(h,g)};V(w,h=>{a(r)&&a(d)?h(b):h(A,-1)})}var x=q(w);{var S=h=>{var g=Vm();G(g,"colspan",2);var E=$(g),N=$(E);Mt(N,()=>a(r),()=>({diffFile:e.diffFile,side:B.new,lineNumber:a(s)?.lineNumber||0,data:a(p)?.data,onUpdate:e.diffFile.notifyAll})),C(E),C(g),K(()=>Q(g,`border-left-color: var(${gn}); border-left-style: solid `)),D(h,g)},L=h=>{var g=Ym();G(g,"colspan",2),K(()=>Q(g,`
					background-color: var(${Kt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(h,g)};V(x,h=>{a(r)&&a(p)?h(S):h(L,-1)})}C(y),K(()=>G(y,"data-line",`${e.lineNumber}-extend`)),D(v,y)};V(u,v=>{a(c)&&v(m)})}D(t,f),fe()}var qm=new Set(["$$slots","$$events","$$legacy"]),Km=Ei('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M7.823 1.677 4.927 4.573A.25.25 0 0 0 5.104 5H7.25v3.236a.75.75 0 1 0 1.5 0V5h2.146a.25.25 0 0 0 .177-.427L8.177 1.677a.25.25 0 0 0-.354 0ZM13.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-3.75.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM7.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM4 11.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM1.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"></path></svg>');function St(t,e){de(e,!0);let n=pe(e,qm);var i=Km();K(()=>Ie(i,0,ln(e.className))),D(t,i),fe()}var Xm=new Set(["$$slots","$$events","$$legacy"]),Zm=Ei('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177 14.323 2.896-2.896a.25.25 0 0 0-.177-.427H8.75V7.764a.75.75 0 1 0-1.5 0V11H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0ZM2.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM8.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function Nt(t,e){de(e,!0);let n=pe(e,Xm);var i=Zm();K(()=>Ie(i,0,ln(e.className))),D(t,i),fe()}var eg=new Set(["$$slots","$$events","$$legacy"]),tg=Ei('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function Ln(t,e){de(e,!0);let n=pe(e,eg);var i=tg();K(()=>Ie(i,0,ln(e.className))),D(t,i),fe()}var ng=new Set(["$$slots","$$events","$$legacy"]),ig=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),rg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),og=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),sg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),ag=P('<div class="min-h-[28px]">&ensp;</div>'),lg=P('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Dl(t,e){de(e,!0);let n=pe(e,ng),i=I(()=>e.diffFile.getSplitHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>a(r)&&a(i)?.splitInfo),s=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.endHiddenIndex-b.splitInfo.startHiddenIndex<Pe},l=ce(Ae(s())),d=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.startHiddenIndex<b.splitInfo.endHiddenIndex},p=ce(Ae(d())),c=I(()=>{let b=a(i);return b&&b.isFirst}),f=I(()=>{let b=a(i);return b&&e.diffFile._getIsPureDiffRender()&&!b.splitInfo}),u=I(()=>{let b=a(i);return b&&b.isLast}),m={current:()=>{}};ye(()=>{m.current();let b=()=>{re(p,d(),!0),re(l,s(),!0)};b(),m.current=e.diffFile.subscribe(b)}),Ge(()=>m.current());var v=me(),y=te(v);{var w=b=>{var A=lg(),x=$(A),S=$(x);{var L=T=>{var O=me(),X=te(O);{var z=j=>{var M=ig(),R=$(M);St(R,{className:"fill-current"}),C(M),xe("click",M,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(j,M)},J=j=>{var M=rg(),R=$(M);Nt(R,{className:"fill-current"}),C(M),xe("click",M,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(j,M)},Y=j=>{var M=og(),R=$(M);Ln(R,{className:"fill-current"}),C(M),xe("click",M,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(j,M)},be=j=>{var M=sg(),R=te(M),U=$(R);Nt(U,{className:"fill-current"}),C(R);var H=q(R,2),ee=$(H);St(ee,{className:"fill-current"}),C(H),xe("click",R,()=>e.diffFile.onSplitHunkExpand("down",e.index)),xe("click",H,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(j,M)};V(X,j=>{a(c)?j(z):a(u)?j(J,1):a(l)?j(Y,2):j(be,-1)})}D(T,O)},h=T=>{var O=ag();D(T,O)};V(S,T=>{a(o)?T(L):T(h,-1)})}C(x);var g=q(x);G(g,"colspan",3);var E=$(g),N=$(E,!0);C(E),C(g),C(A),K(()=>{G(A,"data-line",`${e.lineNumber}-hunk`),Q(x,`
				background-color: var(${Un});
				color: var(${dt})
			`),Q(g,`background-color: var(${dn})`),Q(E,`
					color: var(${jn})
				`),Ce(N,a(i)?.splitInfo?.plainText||a(i)?.text)}),D(b,A)};V(y,b=>{(a(p)||a(f))&&b(w)})}D(t,v),fe()}it(["click"]);var dg=new Set(["$$slots","$$events","$$legacy"]),bu=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),wu=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),xu=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),yu=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Eu=P('<div class="min-h-[28px]">&ensp;</div>'),fg=P('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td><td class="diff-line-hunk-action relative z-[1] w-[1%] min-w-[40px] select-none border-l-[1px] p-[1px]"><!></td><td class="diff-line-hunk-content relative pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Tl(t,e){de(e,!0);let n=pe(e,dg),i=I(()=>e.diffFile.getSplitHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>a(r)&&a(i)?.splitInfo),s=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.endHiddenIndex-b.splitInfo.startHiddenIndex<Pe},l=ce(Ae(s())),d=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.startHiddenIndex<b.splitInfo.endHiddenIndex},p=ce(Ae(d())),c=I(()=>{let b=a(i);return b&&b.isFirst}),f=I(()=>{let b=a(i);return b&&e.diffFile._getIsPureDiffRender()&&!b.splitInfo}),u=I(()=>{let b=a(i);return b&&b.isLast}),m={current:()=>{}};ye(()=>{m.current();let b=()=>{re(p,d(),!0),re(l,s(),!0)};b(),m.current=e.diffFile.subscribe(b)}),Ge(()=>m.current());var v=me(),y=te(v);{var w=b=>{var A=fg(),x=$(A),S=$(x);{var L=j=>{var M=me(),R=te(M);{var U=ie=>{var ne=bu(),Z=$(ne);St(Z,{className:"fill-current"}),C(ne),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,ne)},H=ie=>{var ne=wu(),Z=$(ne);Nt(Z,{className:"fill-current"}),C(ne),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(ie,ne)},ee=ie=>{var ne=xu(),Z=$(ne);Ln(Z,{className:"fill-current"}),C(ne),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(ie,ne)},se=ie=>{var ne=yu(),Z=te(ne),oe=$(Z);Nt(oe,{className:"fill-current"}),C(Z);var ue=q(Z,2),he=$(ue);St(he,{className:"fill-current"}),C(ue),xe("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),xe("click",ue,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,ne)};V(R,ie=>{a(c)?ie(U):a(u)?ie(H,1):a(l)?ie(ee,2):ie(se,-1)})}D(j,M)},h=j=>{var M=Eu();D(j,M)};V(S,j=>{a(o)?j(L):j(h,-1)})}C(x);var g=q(x),E=$(g),N=$(E,!0);C(E),C(g);var T=q(g),O=$(T);{var X=j=>{var M=me(),R=te(M);{var U=ie=>{var ne=bu(),Z=$(ne);St(Z,{className:"fill-current"}),C(ne),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,ne)},H=ie=>{var ne=wu(),Z=$(ne);Nt(Z,{className:"fill-current"}),C(ne),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(ie,ne)},ee=ie=>{var ne=xu(),Z=$(ne);Ln(Z,{className:"fill-current"}),C(ne),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(ie,ne)},se=ie=>{var ne=yu(),Z=te(ne),oe=$(Z);Nt(oe,{className:"fill-current"}),C(Z);var ue=q(Z,2),he=$(ue);St(he,{className:"fill-current"}),C(ue),xe("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),xe("click",ue,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(ie,ne)};V(R,ie=>{a(c)?ie(U):a(u)?ie(H,1):a(l)?ie(ee,2):ie(se,-1)})}D(j,M)},z=j=>{var M=Eu();D(j,M)};V(O,j=>{a(o)?j(X):j(z,-1)})}C(T);var J=q(T),Y=$(J),be=$(Y,!0);C(Y),C(J),C(A),K(()=>{G(A,"data-line",`${e.lineNumber}-hunk`),Q(x,`
				background-color: var(${Un});
				color: var(${dt})
			`),Q(g,`background-color: var(${dn})`),Q(E,`
					color: var(${jn})
				`),Ce(N,a(i)?.splitInfo?.plainText||a(i)?.text),Q(T,`
				background-color: var(${Un});
				color: var(${dt});
				border-left-color: var(${gn});
				border-left-style: solid
			`),Q(J,`background-color: var(${dn})`),Q(Y,`
					color: var(${jn})
				`),Ce(be,a(i)?.splitInfo?.plainText||a(i)?.text)}),D(b,A)};V(y,b=>{(a(p)||a(f))&&b(w)})}D(t,v),fe()}it(["click"]);var cg=new Set(["$$slots","$$events","$$legacy"]);function qs(t,e){de(e,!0);let n=pe(e,cg),i=I(Ws());var r=me(),o=te(r);{var s=d=>{Dl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Tl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};V(o,d=>{a(i)===Ot.SplitGitHub||a(i)===Ot.Split?d(s):d(l,-1)})}D(t,r),fe()}var ug=new Set(["$$slots","$$events","$$legacy"]),pg=P('<td class="diff-line-widget-old-content p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),hg=P('<td class="diff-line-widget-old-placeholder select-none p-0"></td>'),mg=P('<td class="diff-line-widget-new-content border-l-[1px] p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),gg=P('<td class="diff-line-widget-new-placeholder select-none border-l-[1px] p-0"></td>'),vg=P('<tr data-state="widget" class="diff-line diff-line-widget"><!><!></tr>');function Fl(t,e){de(e,!0);let n=pe(e,ug),i=I(Kr()),r=I(En()),o=I(()=>e.diffFile.getSplitLeftLine(e.index)),s=I(()=>e.diffFile.getSplitRightLine(e.index)),l=I(()=>a(o)?.lineNumber&&a(r)?.side===B.old&&a(r)?.lineNumber===a(o)?.lineNumber),d=I(()=>a(s)?.lineNumber&&a(r)?.side===B.new&&a(r)?.lineNumber===a(s)?.lineNumber),p=I(()=>(!!a(l)||!!a(d))&&!a(o)?.isHidden&&!a(s)?.isHidden&&!!a(i)),c=()=>{a(r).side=void 0,a(r).lineNumber=void 0};var f=me(),u=te(f);{var m=v=>{var y=vg(),w=$(y);{var b=h=>{var g=pg();G(g,"colspan",2);var E=$(g),N=$(E);Mt(N,()=>a(i),()=>({diffFile:e.diffFile,side:B.old,lineNumber:a(o)?.lineNumber||0,onClose:c})),C(E),C(g),D(h,g)},A=h=>{var g=hg();G(g,"colspan",2),K(()=>Q(g,`background-color: var(${Kt})`)),D(h,g)};V(w,h=>{a(l)&&a(i)?h(b):h(A,-1)})}var x=q(w);{var S=h=>{var g=mg();G(g,"colspan",2);var E=$(g),N=$(E);Mt(N,()=>a(i)??ut,()=>({diffFile:e.diffFile,side:B.new,lineNumber:a(s)?.lineNumber||0,onClose:c})),C(E),C(g),K(()=>Q(g,`border-left-color: var(${gn}); border-left-style: solid `)),D(h,g)},L=h=>{var g=gg();G(g,"colspan",2),K(()=>Q(g,`
					background-color: var(${Kt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),D(h,g)};V(x,h=>{a(d)&&a(i)?h(S):h(L,-1)})}C(y),K(()=>G(y,"data-line",`${e.lineNumber}-widget`)),D(v,y)};V(u,v=>{a(p)&&v(m)})}D(t,f),fe()}var _g=new Set(["$$slots","$$events","$$legacy"]),bg=P("<!> <!> <!> <!>",1),wg=P('<div class="split-diff-view split-diff-view-warp w-full"><div class="diff-table-wrapper w-full"><style data-select-style=""></style> <table class="diff-table w-full table-fixed border-collapse border-spacing-0"><colgroup><col class="diff-table-old-num-col"/><col class="diff-table-old-content-col"/><col class="diff-table-new-num-col"/><col class="diff-table-new-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">old line number</th><th scope="col">old line content</th><th scope="col">new line number</th><th scope="col">new line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Ml(t,e){de(e,!0);let n=pe(e,_g),i=()=>ds(e.diffFile),r=ce(Ae(i())),o={current:void 0},s=ce(void 0),l=I(()=>Math.max(e.diffFile.splitLineLength,e.diffFile.fileLineLength).toString()),d=I(qr()),p=I(()=>({fontSize:`${a(d)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),c={current:()=>{}};ye(()=>{c.current();let N=()=>re(r,i(),!0);N(),c.current=e.diffFile.subscribe(N)}),Ge(()=>c.current());let f=N=>{let T=a(s);if(T)if(N){let O=N===B.old?B.new:B.old;T.textContent=`#diff-root${e.diffFile.getId()} [data-side="${B[O]}"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="extend"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="hunk"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="widget"] {user-select: none}`}else T.textContent=""},u=N=>{let T=N.target;if(T&&T instanceof HTMLElement&&T.nodeName==="BUTTON"){An();return}let O=ro(T);if(!(O&&O!==`diff-root${e.diffFile.getId()}`))for(;T&&T instanceof HTMLElement;){let X=T.getAttribute("data-state"),z=T.getAttribute("data-side");if(z&&o.current!==B[z]&&(o.current=B[z],f(B[z]),An()),X)if(X==="extend"||X==="hunk"||X==="widget"){o.current!==void 0&&(o.current=void 0,f(void 0),An());return}else return;T=T.parentElement}},m=I(io({text:()=>a(l),font:()=>a(p)})),v=I(()=>Math.max(40,a(m)+25));var y=wg(),w=$(y),b=$(w);at(b,()=>N=>re(s,N,!0));var A=q(b,2),x=$(A),S=$(x),L=q(S,2);Zi(),C(x);var h=q(x,2),g=$(h);di(g,17,()=>a(r),li,(N,T)=>{var O=bg(),X=te(O);qs(X,{get index(){return a(T).index},get lineNumber(){return a(T).lineNumber},get diffFile(){return e.diffFile}});var z=q(X,2);Cl(z,{get index(){return a(T).index},get lineNumber(){return a(T).lineNumber},get diffFile(){return e.diffFile}});var J=q(z,2);Fl(J,{get index(){return a(T).index},get lineNumber(){return a(T).lineNumber},get diffFile(){return e.diffFile}});var Y=q(J,2);$l(Y,{get index(){return a(T).index},get lineNumber(){return a(T).lineNumber},get diffFile(){return e.diffFile}}),D(N,O)});var E=q(g);qs(E,{get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),C(h),C(A),C(w),C(y),K((N,T,O)=>{Q(w,N),G(S,"width",T),G(L,"width",O)},[()=>`
			${$e}: ${Math.round(a(v))}px;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${tt});
		`,()=>Math.round(a(v)),()=>Math.round(a(v))]),xe("mousedown",h,u),D(t,y),fe()}it(["mousedown"]);var xg=new Set(["$$slots","$$events","$$legacy"]),yg=P("<td><!> <span> </span></td> <td><!></td>",1),Eg=P("<td><span>&ensp;</span></td>"),Ag=P("<tr><!></tr>");function Hl(t,e){de(e,!0);let n=pe(e,xg),i=I(En()),r=I(no()),o=I(to()),s=I(eo()),l=I(()=>e.side===B.old?e.diffFile.getSplitLeftLine(e.index):e.diffFile.getSplitRightLine(e.index)),d=I(()=>!!a(l)?.diff),p=I(()=>Xi(a(l)?.diff)),c=I(()=>a(l)?.isHidden),f=I(()=>!!a(l)?.lineNumber),u=()=>e.side===B.old?e.diffFile.getOldSyntaxLine(a(l)?.lineNumber||0):e.diffFile.getNewSyntaxLine(a(l)?.lineNumber||0),m=()=>e.side===B.old?e.diffFile.getOldPlainLine(a(l)?.lineNumber||0):e.diffFile.getNewPlainLine(a(l)?.lineNumber||0),v=ce(Ae(u())),y=ce(Ae(m())),w=()=>{re(v,u(),!0),re(y,m(),!0)},b={current:()=>{}};ye(()=>{b.current(),w(),b.current=e.diffFile.subscribe(w)}),Ge(()=>b.current());let A=(E,N)=>{a(i).side=N,a(i).lineNumber=E},x=()=>a(l)?.diff?.type===Be.Add,S=()=>a(l)?.diff?.type===Be.Delete;var L=me(),h=te(L);{var g=E=>{var N=Ag(),T=$(N);{var O=z=>{var J=yg(),Y=te(J),be=$(Y);{var j=ee=>{{let se=I(()=>a(l)?.lineNumber||0);Bi(ee,{get index(){return e.index},get lineNumber(){return a(se)},get side(){return e.side},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:A})}};V(be,ee=>{a(d)&&a(r)&&ee(j)})}var M=q(be,2),R=$(M,!0);C(M),C(Y);var U=q(Y,2),H=$(U);{let ee=I(()=>a(l)?.value||""),se=I(()=>a(l)?.diff),ie=I(()=>!!a(o));ci(H,{enableWrap:!1,get diffFile(){return e.diffFile},get rawLine(){return a(ee)},get diffLine(){return a(se)},get plainLine(){return a(y)},get syntaxLine(){return a(v)},get enableHighlight(){return a(ie)}})}C(U),K((ee,se)=>{Ie(Y,1,`diff-line-${B[e.side]}-num sticky left-0 z-[1] w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top`),Q(Y,ee),G(M,"data-line-num",a(l)?.lineNumber),Q(M,` opacity: ${a(p)?void 0:.5} `),Ce(R,a(l)?.lineNumber),Ie(U,1,`diff-line-${B[e.side]}-content pr-[10px] align-top`),Q(U,se)},[()=>`
					background-color: ${Yo(x(),S(),a(d))};
					color: var(${a(d)?dt:pr});
					width: var(${$e});
					min-width: var(${$e});
					max-width: var(${$e})
				`,()=>` background-color: ${Vo(x(),S(),a(d))} `]),D(z,J)},X=z=>{var J=Eg();G(J,"colspan",2),K(()=>{Ie(J,1,`diff-line-${B[e.side]}-placeholder select-none`),Q(J,`background-color: var(${Kt}) `)}),D(z,J)};V(T,z=>{a(f)?z(O):z(X,-1)})}C(N),K(()=>{G(N,"data-line",e.lineNumber),G(N,"data-state",a(d)||!a(f)?"diff":"plain"),G(N,"data-side",B[e.side]),Ie(N,1,"diff-line"+(a(f)?" group":""))}),D(E,N)};V(h,E=>{a(c)||E(g)})}D(t,L),fe()}var Ri=({selector:t,enable:e})=>{let n=I(Gs()),i=I(zs()),r=I(fi()),o=ce(0),s={current:()=>{}},l=()=>{if(a(r)&&e()){let c=Qs(a(i)).querySelector(`#diff-root${a(n)}`)?.querySelector(t());if(!c)return;let f=c,u=()=>{let y=c?.getBoundingClientRect();re(o,y?.width??0,!0)};u();let m=()=>{f?.__observeCallback?.delete(u),f?.__observeCallback?.size===0&&(f.__observeInstance?.disconnect(),f.removeAttribute("data-observe"),delete f.__observeCallback,delete f.__observeInstance)};if(f.__observeCallback){f.__observeCallback.add(u),s.current=()=>m();return}f.__observeCallback=new Set,f.__observeCallback.add(u);let v=new ResizeObserver(()=>f?.__observeCallback?.forEach(y=>y()));f.__observeInstance=v,v.observe(f),f.setAttribute("data-observe","height"),s.current=()=>m()}};return ye(()=>(l(),()=>s.current?.())),()=>a(o)};var Oi=({selector:t,wrapper:e,side:n,enable:i})=>{let r=I(Gs()),o=I(zs()),s=I(fi()),l={current:()=>{}},d=()=>{if(a(s)&&i()){let p=()=>{},f=Qs(a(o)).querySelector(`#diff-root${a(r)}`),u=Array.from(f?.querySelectorAll(t())||[]),m=e()?Array.from(f?.querySelectorAll(e())||[]):u;if(u.length===2&&m.length===2){let v=u[0],y=u[1],w=m[0],b=m[1],A=v.getAttribute("data-side")===n()?v:y,x=A,S=()=>{v.style.height="auto",y.style.height="auto";let g=v.getBoundingClientRect(),E=y.getBoundingClientRect(),N=Math.max(g.height,E.height);w.style.height=N+"px",b.style.height=N+"px",w.setAttribute("data-sync-height",String(N)),b.setAttribute("data-sync-height",String(N))};S();let L=()=>{x.__observeCallback?.delete(S),x.__observeCallback?.size===0&&(x.__observeInstance?.disconnect(),A.removeAttribute("data-observe"),delete x.__observeCallback,delete x.__observeInstance)};if(x.__observeCallback){x.__observeCallback.add(S),p=L;return}x.__observeCallback=new Set,x.__observeCallback.add(S);let h=new ResizeObserver(()=>x.__observeCallback?.forEach(g=>g()));x.__observeInstance=h,h.observe(A),A.setAttribute("data-observe","height"),p=L}l.current=p}};ye(()=>(d(),()=>l.current?.()))};var Lg=new Set(["$$slots","$$events","$$legacy"]),kg=P('<td><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!></div></td>'),Ig=P("<td><div></div></td>"),Sg=P('<tr data-state="extend" class="diff-line diff-line-extend"><!></tr>');function Bl(t,e){de(e,!0);let n=pe(e,Lg),i=ce(null),r=I(Xr()),o=I(Zr()),s=I(()=>`div[data-line="${e.lineNumber}-extend-content"]`),l=I(()=>`tr[data-line="${e.lineNumber}-extend"]`),d=I(()=>e.side===B.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),p=I(()=>e.diffFile.getSplitLeftLine(e.index)),c=I(()=>e.diffFile.getSplitRightLine(e.index)),f=I(()=>e.diffFile.getExpandEnabled()),u=I(()=>a(r)?.oldFile?.[a(p)?.lineNumber||""]),m=I(()=>a(r)?.newFile?.[a(c)?.lineNumber||""]),v=I(()=>e.side===B.old?a(p):a(c)),y=I(()=>a(v)?.isHidden),w=I(()=>e.side===B.old?a(u):a(m)),b=I(()=>e.side===B.old?a(p)?.lineNumber:a(c)?.lineNumber),A=I(()=>!!((a(u)||a(m))&&(!a(y)||a(f))&&a(o))),x=I(()=>(e.side===B.old?!!a(u):!!a(m))&&a(A)),S=I(()=>B[a(w)?e.side:e.side===B.new?B.old:B.new]);Oi({selector:()=>a(s),wrapper:()=>a(l),side:()=>a(S),enable:()=>!!(a(A)&&a(i))});let L=I(Ri({selector:()=>a(d),enable:()=>!!(a(x)&&a(i))}));var h=me(),g=te(h);{var E=N=>{var T=Sg(),O=$(T);{var X=J=>{var Y=kg();G(Y,"colspan",2);var be=$(Y),j=$(be);{var M=R=>{var U=me(),H=te(U);Mt(H,()=>a(o)??ut,()=>({diffFile:e.diffFile,side:e.side,lineNumber:a(b)||0,data:a(w)?.data,onUpdate:e.diffFile.notifyAll})),D(R,U)};V(j,R=>{a(L)>0&&R(M)})}C(be),C(Y),K(()=>{Ie(Y,1,`diff-line-extend-${B[e.side]}-content p-0`),G(be,"data-line",`${e.lineNumber}-extend-content`),G(be,"data-side",B[e.side]),Q(be,` width: ${a(L)}px `)}),D(J,Y)},z=J=>{var Y=Ig();G(Y,"colspan",2);var be=$(Y);C(Y),K(()=>{Ie(Y,1,`diff-line-extend-${B[e.side]}-placeholder select-none p-0`),Q(Y,` background-color: var(${Kt})`),G(be,"data-line",`${e.lineNumber}-extend-content`),G(be,"data-side",B[e.side])}),D(J,Y)};V(O,J=>{a(o)&&a(w)?J(X):J(z,-1)})}C(T),at(T,()=>J=>re(i,J,!0)),K(()=>{G(T,"data-line",`${e.lineNumber}-extend`),G(T,"data-side",B[e.side])}),D(N,T)};V(g,N=>{a(A)&&N(E)})}D(t,h),fe()}var Ng=new Set(["$$slots","$$events","$$legacy"]),Cg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),$g=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Dg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Tg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Fg=P('<div class="min-h-[28px]">&ensp;</div>'),Mg=P('<td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td> <td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td>',1),Hg=P('<td class="diff-line-hunk-placeholder select-none"><div class="min-h-[28px]">&ensp;</div></td>'),Bg=P('<tr data-state="hunk" class="diff-line diff-line-hunk"><!></tr>');function Rl(t,e){de(e,!0);let n=pe(e,Ng),i=ce(null),r=I(()=>e.diffFile.getSplitHunkLine(e.index)),o=I(()=>e.diffFile.getExpandEnabled()),s=I(()=>a(o)&&a(r)?.splitInfo),l=I(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=I(()=>e.side===B.old),p=()=>{let h=a(r);return h&&h.splitInfo&&h.splitInfo.endHiddenIndex-h.splitInfo.startHiddenIndex<Pe},c=ce(Ae(p())),f=()=>{let h=a(r);return h&&h.splitInfo&&h.splitInfo.startHiddenIndex<h.splitInfo.endHiddenIndex},u=ce(Ae(f())),m=I(()=>{let h=a(r);return h&&h.isFirst}),v=I(()=>{let h=a(r);return h&&e.diffFile._getIsPureDiffRender()&&!h.splitInfo}),y=I(()=>{let h=a(r);return h&&h.isLast}),w={current:()=>{}};ye(()=>{w.current();let h=()=>{re(u,f(),!0),re(c,p(),!0)};h(),w.current=e.diffFile.subscribe(h)}),Ge(()=>w.current());let b=I(()=>B[B.old]),A=I(()=>e.side===B.new&&(!!a(u)||a(v)));Oi({selector:()=>a(l),wrapper:()=>a(l),side:()=>a(b),enable:()=>!!(a(A)&&a(i))});var x=me(),S=te(x);{var L=h=>{var g=Bg(),E=$(g);{var N=O=>{var X=Mg(),z=te(X),J=$(z);{var Y=U=>{var H=me(),ee=te(H);{var se=oe=>{var ue=Cg(),he=$(ue);St(he,{className:"fill-current"}),C(ue),xe("click",ue,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(oe,ue)},ie=oe=>{var ue=$g(),he=$(ue);Nt(he,{className:"fill-current"}),C(ue),xe("click",ue,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(oe,ue)},ne=oe=>{var ue=Dg(),he=$(ue);Ln(he,{className:"fill-current"}),C(ue),xe("click",ue,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(oe,ue)},Z=oe=>{var ue=Tg(),he=te(ue),Fe=$(he);Nt(Fe,{className:"fill-current"}),C(he);var we=q(he,2),Le=$(we);St(Le,{className:"fill-current"}),C(we),xe("click",he,()=>e.diffFile.onSplitHunkExpand("down",e.index)),xe("click",we,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(oe,ue)};V(ee,oe=>{a(m)?oe(se):a(y)?oe(ie,1):a(c)?oe(ne,2):oe(Z,-1)})}D(U,H)},be=U=>{var H=Fg();D(U,H)};V(J,U=>{a(s)?U(Y):U(be,-1)})}C(z);var j=q(z,2),M=$(j),R=$(M,!0);C(M),C(j),K(()=>{Q(z,`
					background-color: var(${Un});
					color: var(${dt});
					width: var(${$e});
					min-width: var(${$e});
					max-width: var(${$e});
				`),Q(j,`background-color: var(${dn})`),Q(M,`
						color: var(${jn})
					`),Ce(R,a(r)?.splitInfo?.plainText||a(r)?.text)}),D(O,X)},T=O=>{var X=Hg();G(X,"colspan",2),K(()=>Q(X,`background-color: var(${dn})`)),D(O,X)};V(E,O=>{a(d)?O(N):O(T,-1)})}C(g),at(g,()=>O=>re(i,O,!0)),K(()=>{G(g,"data-line",`${e.lineNumber}-hunk`),G(g,"data-side",B[e.side]),Q(g,`background-color: var(${dn})`)}),D(h,g)};V(S,h=>{(a(u)||a(v))&&h(L)})}D(t,x),fe()}it(["click"]);var Rg=new Set(["$$slots","$$events","$$legacy"]),Og=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Pg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),jg=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Ug=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Gg=P('<div class="min-h-[28px]">&ensp;</div>'),zg=P('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Ol(t,e){de(e,!0);let n=pe(e,Rg),i=ce(null),r=I(()=>e.diffFile.getSplitHunkLine(e.index)),o=I(()=>e.diffFile.getExpandEnabled()),s=I(()=>a(o)&&a(r)?.splitInfo),l=I(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=()=>{let L=a(r);return L&&L.splitInfo&&L.splitInfo.endHiddenIndex-L.splitInfo.startHiddenIndex<Pe},p=ce(Ae(d())),c=()=>{let L=a(r);return L&&L.splitInfo&&L.splitInfo.startHiddenIndex<L.splitInfo.endHiddenIndex},f=ce(Ae(c())),u=I(()=>{let L=a(r);return L&&L.isFirst}),m=I(()=>{let L=a(r);return L&&e.diffFile._getIsPureDiffRender()&&!L.splitInfo}),v=I(()=>{let L=a(r);return L&&L.isLast}),y=I(()=>B[B.old]),w=I(()=>e.side===B.new&&(!!a(f)||a(m))),b={current:()=>{}};ye(()=>{b.current();let L=()=>{re(f,c(),!0),re(p,d(),!0)};L(),b.current=e.diffFile.subscribe(L)}),Ge(()=>b.current()),Oi({selector:()=>a(l),wrapper:()=>a(l),side:()=>a(y),enable:()=>!!(a(w)&&a(i))});var A=me(),x=te(A);{var S=L=>{var h=zg(),g=$(h),E=$(g);{var N=J=>{var Y=me(),be=te(Y);{var j=H=>{var ee=Og(),se=$(ee);St(se,{className:"fill-current"}),C(ee),xe("click",ee,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(H,ee)},M=H=>{var ee=Pg(),se=$(ee);Nt(se,{className:"fill-current"}),C(ee),xe("click",ee,()=>e.diffFile.onSplitHunkExpand("down",e.index)),D(H,ee)},R=H=>{var ee=jg(),se=$(ee);Ln(se,{className:"fill-current"}),C(ee),xe("click",ee,()=>e.diffFile.onSplitHunkExpand("all",e.index)),D(H,ee)},U=H=>{var ee=Ug(),se=te(ee),ie=$(se);Nt(ie,{className:"fill-current"}),C(se);var ne=q(se,2),Z=$(ne);St(Z,{className:"fill-current"}),C(ne),xe("click",se,()=>e.diffFile.onSplitHunkExpand("down",e.index)),xe("click",ne,()=>e.diffFile.onSplitHunkExpand("up",e.index)),D(H,ee)};V(be,H=>{a(u)?H(j):a(v)?H(M,1):a(p)?H(R,2):H(U,-1)})}D(J,Y)},T=J=>{var Y=Gg();D(J,Y)};V(E,J=>{a(s)?J(N):J(T,-1)})}C(g);var O=q(g),X=$(O),z=$(X,!0);C(X),C(O),C(h),at(h,()=>J=>re(i,J,!0)),K(()=>{G(h,"data-line",`${e.lineNumber}-hunk`),G(h,"data-side",B[e.side]),Q(h,`background-color: var(${dn})`),Q(g,`
				background-color: var(${Un});
				color: var(${dt});
				width: var(${$e});
				min-width: var(${$e});
				max-width: var(${$e})
			`),Q(O,`background-color: var(${dn})`),Q(X,`
					color: var(${jn})
				`),Ce(z,a(r)?.splitInfo?.plainText||a(r)?.text)}),D(L,h)};V(x,L=>{(a(f)||a(m))&&L(S)})}D(t,A),fe()}it(["click"]);var Wg=new Set(["$$slots","$$events","$$legacy"]);function Ks(t,e){de(e,!0);let n=pe(e,Wg),i=I(Ws());var r=me(),o=te(r);{var s=d=>{Rl(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Ol(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};V(o,d=>{a(i)===Ot.SplitGitHub||a(i)===Ot.Split?d(s):d(l,-1)})}D(t,r),fe()}var Qg=new Set(["$$slots","$$events","$$legacy"]),Vg=P('<td><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!></div></td>'),Yg=P("<td><div></div></td>"),Jg=P('<tr data-state="widget" class="diff-line diff-line-widget"><!></tr>');function Pl(t,e){de(e,!0);let n=pe(e,Qg),i=ce(null),r=I(Kr()),o=I(En()),s=I(()=>e.diffFile.getSplitLeftLine(e.index)),l=I(()=>e.diffFile.getSplitRightLine(e.index)),d=I(()=>!!a(s)?.lineNumber&&a(o)?.side===B.old&&a(o)?.lineNumber===a(s)?.lineNumber),p=I(()=>!!a(l)?.lineNumber&&a(o)?.side===B.new&&a(o)?.lineNumber===a(l)?.lineNumber),c=I(()=>e.side===B.old?a(s):a(l)),f=I(()=>a(c)?.isHidden),u=I(()=>`div[data-line="${e.lineNumber}-widget-content"]`),m=I(()=>`tr[data-line="${e.lineNumber}-widget"]`),v=I(()=>e.side===B.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),y=I(()=>e.side===B.old?a(d):a(p)),w=I(()=>B[a(y)?e.side:e.side===B.old?B.new:B.old]),b=I(()=>(!!a(d)||!!a(p))&&!a(f)&&!!a(r)),A=I(()=>a(y)&&!!a(b)),x=()=>{a(o).side=void 0,a(o).lineNumber=void 0};Oi({selector:()=>a(u),wrapper:()=>a(m),side:()=>a(w),enable:()=>!!(a(b)&&a(i))});let S=I(Ri({selector:()=>a(v),enable:()=>!!(a(A)&&a(i))}));var L=me(),h=te(L);{var g=E=>{var N=Jg(),T=$(N);{var O=z=>{var J=Vg();G(J,"colspan",2);var Y=$(J),be=$(Y);{var j=M=>{var R=me(),U=te(R);Mt(U,()=>a(r),()=>({diffFile:e.diffFile,side:e.side,lineNumber:a(c)?.lineNumber||0,onClose:x})),D(M,R)};V(be,M=>{a(S)>0&&M(j)})}C(Y),C(J),K(()=>{Ie(J,1,`diff-line-widget-${B[e.side]}-content p-0`),G(Y,"data-line",`${e.lineNumber}-widget-content`),G(Y,"data-side",B[e.side]),Q(Y,` width: ${a(S)}px `)}),D(z,J)},X=z=>{var J=Yg();G(J,"colspan",2);var Y=$(J);C(J),K(()=>{Ie(J,1,`diff-line-widget-${B[e.side]}-placeholder select-none p-0`),Q(J,`background-color: var(${Kt})`),G(Y,"data-line",`${e.lineNumber}-widget-content`),G(Y,"data-side",B[e.side])}),D(z,J)};V(T,z=>{a(y)?z(O):z(X,-1)})}C(N),at(N,()=>z=>re(i,z,!0)),K(()=>{G(N,"data-line",`${e.lineNumber}-widget`),G(N,"data-side",B[e.side])}),D(E,N)};V(h,E=>{a(b)&&E(g)})}D(t,L),fe()}var qg=new Set(["$$slots","$$events","$$legacy"]),Kg=P("<!> <!> <!> <!>",1),Xg=P('<table><colgroup><col/><col/></colgroup><thead class="hidden"><tr><th scope="col"> </th><th scope="col"> </th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table>');function Xs(t,e){de(e,!0);let n=pe(e,qg),i=I(()=>e.side===B.new?"new-diff-table":"old-diff-table"),r=()=>ds(e.diffFile),o=ce(Ae(r())),s={current:()=>{}},l=e.selectState;ye(()=>{s.current();let h=()=>re(o,r(),!0);h(),s.current=e.diffFile.subscribe(h)}),Ge(()=>s.current());let d=h=>{let g=h.target;if(g&&g?.nodeName==="BUTTON"){An();return}let E=ro(g);if(!(E&&E!==`diff-root${e.diffFile.getId()}`))for(;g&&g instanceof HTMLElement;){let N=g.getAttribute("data-state");if(N){N==="extend"||N==="hunk"||N==="widget"?l.current!==void 0&&(l.current=void 0,e.onSelect?.(void 0),An()):l.current!==e.side&&(l.current=n.side,e.onSelect?.(e.side),An());return}g=g.parentElement}};var p=Xg(),c=$(p),f=$(c),u=q(f);C(c);var m=q(c),v=$(m),y=$(v),w=$(y);C(y);var b=q(y),A=$(b);C(b),C(v),C(m);var x=q(m),S=$(x);di(S,17,()=>a(o),li,(h,g)=>{var E=Kg(),N=te(E);Ks(N,{get index(){return a(g).index},get side(){return e.side},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}});var T=q(N,2);Hl(T,{get index(){return a(g).index},get side(){return e.side},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}});var O=q(T,2);Pl(O,{get index(){return a(g).index},get side(){return e.side},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}});var X=q(O,2);Bl(X,{get index(){return a(g).index},get side(){return e.side},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}}),D(h,E)});var L=q(S);Ks(L,{get side(){return e.side},get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),C(x),C(p),K(()=>{Ie(p,1,`${a(i)} w-full border-collapse border-spacing-0`),G(p,"data-mode",B[e.side]),Ie(f,1,`diff-table-${B[e.side]}-num-col`),Ie(u,1,`diff-table-${B[e.side]}-content-col`),Ce(w,`${B[e.side]??""} line number`),Ce(A,`${B[e.side]??""} line content`)}),xe("mousedown",x,d),D(t,p),fe()}it(["mousedown"]);var Zg=new Set(["$$slots","$$events","$$legacy"]),ev=P('<div class="split-diff-view split-diff-view-normal flex w-full basis-[50%]"><style data-select-style=""></style> <div class="old-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div> <div class="diff-split-line w-[1.5px]"></div> <div class="new-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div></div>');function jl(t,e){de(e,!0);let n=pe(e,Zg),i=I(fi()),r=ce(void 0),o=ce(void 0),s=ce(null),l=I(()=>Math.max(e.diffFile.fileLineLength,e.diffFile.splitLineLength).toString()),d={current:()=>{}},p={current:void 0};ye(()=>{if(d.current(),!a(i))return;let E=a(r),N=a(o);!E||!N||(d.current=mu(E,N))}),Ge(()=>d.current());let f=E=>{let N=a(s);N&&(E?N.textContent=`#${w()} [data-state="extend"] {user-select: none} 
#${w()} [data-state="hunk"] {user-select: none} 
#${w()} [data-state="widget"] {user-select: none}`:N.textContent="")},u=I(qr()),m=I(()=>({fontSize:`${a(u)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),v=I(io({text:()=>a(l),font:()=>a(m)})),y=I(()=>Math.max(40,a(v)+25)),w=()=>`diff-split-view-${e.diffFile.getId()}`;var b=ev(),A=$(b);at(A,()=>E=>re(s,E,!0));var x=q(A,2),S=$(x);Xs(S,{get side(){return B.old},get diffFile(){return e.diffFile},onSelect:f,get selectState(){return p}}),C(x),at(x,()=>E=>{re(r,E,!0)});var L=q(x,2),h=q(L,2),g=$(h);Xs(g,{get side(){return B.new},get diffFile(){return e.diffFile},onSelect:f,get selectState(){return p}}),C(h),at(h,()=>E=>{re(o,E,!0)}),C(b),K((E,N)=>{Q(x,E),Q(L,`background-color: var(${gn})`),Q(h,N)},[()=>`
      ${$e}: ${Math.round(a(y))}px;
      overscroll-behavior-x: none;
      font-family: Menlo, Consolas, monospace;
      font-size: var(${tt});
    `,()=>`
			${$e}: ${Math.round(a(y))}px;
			overscroll-behavior-x: none;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${tt});
		`]),D(t,b),fe()}var tv=new Set(["$$slots","$$events","$$legacy"]);function Ul(t,e){de(e,!0);let n=pe(e,tv),i=I(yn());var r=me(),o=te(r);{var s=d=>{Ml(d,{get diffFile(){return e.diffFile}})},l=d=>{jl(d,{get diffFile(){return e.diffFile}})};V(o,d=>{a(i)?d(s):d(l,-1)})}D(t,r),fe()}var nv=new Set(["$$slots","$$events","$$legacy"]),iv=P('<div class="diff-add-widget-wrapper invisible absolute left-[100%] translate-x-[-50%] select-none transition-transform hover:scale-110 group-hover:visible"><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Ko(t,e){de(e,!0);let n=pe(e,nv);var i=iv(),r=$(i);C(i),K(()=>{G(i,"data-add-widget",B[e.side]),Q(i,`
		width: calc(var(${tt}) * 1.4);
		height: calc(var(${tt}) * 1.4);
		top: calc(var(${tt}) * 0.1);
	`),Q(r,`
			color: var(${Js});
			background-color: var(${Ys});
		`)}),xe("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),D(t,i),fe()}it(["mousedown"]);var rv=new Set(["$$slots","$$events","$$legacy"]),ov=P('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"></span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),sv=P('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"></span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),av=P("<!> <!>",1),lv=P('<tr class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex opacity-[0.5]"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>');function Gl(t,e){de(e,!0);let n=pe(e,rv),i=I(()=>e.diffFile.getUnifiedLine(e.index)),r=I(yn()),o=I(En()),s=I(eo()),l=I(to()),d=I(no()),p=I(()=>a(i)?.isHidden),c=I(()=>Xi(a(i)?.diff)),f=()=>a(i)?.newLineNumber?e.diffFile.getNewSyntaxLine(a(i)?.newLineNumber||0):a(i)?.oldLineNumber?e.diffFile.getOldSyntaxLine(a(i)?.oldLineNumber||0):void 0,u=ce(Ae(f())),m=()=>a(i)?.newLineNumber?e.diffFile.getNewPlainLine(a(i)?.newLineNumber||0):a(i)?.oldLineNumber?e.diffFile.getOldPlainLine(a(i)?.oldLineNumber||0):void 0,v=ce(Ae(m())),y={current:()=>{}};ye(()=>{y?.current?.();let S=()=>{re(u,f(),!0),re(v,m(),!0)};S(),y.current=e.diffFile.subscribe(S)}),Ge(()=>y.current());let w=(S,L)=>{a(o).side=L,a(o).lineNumber=S};var b=me(),A=te(b);{var x=S=>{var L=me(),h=te(L);{var g=N=>{let T=(j,M=ut)=>{var R=ov(),U=$(R),H=$(U);{var ee=ue=>{{let he=I(()=>M().index-1);Ko(ue,{get index(){return a(he)},get lineNumber(){return M().lineNumber},get diffFile(){return M().diffFile},get side(){return B.old},get onWidgetClick(){return M().onAddWidgetClick},get onOpenAddWidget(){return M().onOpenAddWidget}})}};V(H,ue=>{M().enableAddWidget&&ue(ee)})}var se=q(H,2),ie=$(se),ne=$(ie,!0);C(ie),Zi(4),C(se),C(U);var Z=q(U),oe=$(Z);ci(oe,{get enableWrap(){return M().enableWrap},get diffFile(){return M().diffFile},get enableHighlight(){return M().enableHighlight},get rawLine(){return M().rawLine},get diffLine(){return M().diffLine},get plainLine(){return M().plainLine},get syntaxLine(){return M().syntaxLine}}),C(Z),C(R),K(()=>{G(R,"data-line",M().index),Q(U,`
          color: var(${dt});
          background-color: var(${kl});
          width: calc(calc(var(${$e}) + 5px) * 2);
          max-width: calc(calc(var(${$e}) + 5px) * 2);
          min-width: calc(calc(var(${$e}) + 5px) * 2);
        `),G(ie,"data-line-old-num",M().lineNumber),Ce(ne,M().lineNumber),Q(Z,`background-color: var(${Al}) `)}),D(j,R)},O=(j,M=ut)=>{var R=sv(),U=$(R),H=$(U);{var ee=ue=>{{let he=I(()=>M().index-1);Ko(ue,{get index(){return a(he)},get lineNumber(){return M().lineNumber},get diffFile(){return M().diffFile},get side(){return B.new},get onWidgetClick(){return M().onAddWidgetClick},get onOpenAddWidget(){return M().onOpenAddWidget}})}};V(H,ue=>{M().enableAddWidget&&ue(ee)})}var se=q(H,2),ie=q($(se),4),ne=$(ie,!0);C(ie),C(se),C(U);var Z=q(U),oe=$(Z);ci(oe,{get enableWrap(){return M().enableWrap},get diffFile(){return M().diffFile},get enableHighlight(){return M().enableHighlight},get rawLine(){return M().rawLine},get diffLine(){return M().diffLine},get plainLine(){return M().plainLine},get syntaxLine(){return M().syntaxLine}}),C(Z),C(R),K(()=>{G(R,"data-line",M().index),Q(U,`
          color: var(${dt});
          background-color: var(${Ll});
          width: calc(calc(var(${$e}) + 5px) * 2);
          max-width: calc(calc(var(${$e}) + 5px) * 2);
          min-width: calc(calc(var(${$e}) + 5px) * 2);
        `),G(ie,"data-line-new-num",M().lineNumber),Ce(ne,M().lineNumber),Q(Z,` background-color: var(${El}) `)}),D(j,R)};var X=av(),z=te(X);{var J=j=>{T(j,()=>({index:e.lineNumber,enableWrap:a(r),diffFile:e.diffFile,rawLine:a(i)?.value||"",diffLine:a(i)?.diff,plainLine:a(v),syntaxLine:a(u),enableHighlight:a(l),enableAddWidget:a(d),lineNumber:a(i).oldLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:a(s)}))};V(z,j=>{a(i).oldLineNumber&&j(J)})}var Y=q(z,2);{var be=j=>{O(j,()=>({index:e.lineNumber,enableWrap:a(r),diffFile:e.diffFile,rawLine:a(i)?.value||"",diffLine:a(i)?.diff,plainLine:a(v),syntaxLine:a(u),enableHighlight:a(l),enableAddWidget:a(d),lineNumber:a(i).newLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:a(s)}))};V(Y,j=>{a(i).newLineNumber&&j(be)})}D(N,X)},E=N=>{var T=lv(),O=$(T),X=$(O);{var z=H=>{{let ee=I(()=>a(i)?.newLineNumber||0);Ko(H,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return a(ee)},get side(){return B.new},onOpenAddWidget:w,get onWidgetClick(){return a(s)}})}};V(X,H=>{a(d)&&a(i)?.diff&&H(z)})}var J=q(X,2),Y=$(J),be=$(Y,!0);C(Y);var j=q(Y,4),M=$(j,!0);C(j),C(J),C(O);var R=q(O),U=$(R);{let H=I(()=>!!a(r)),ee=I(()=>!!a(l)),se=I(()=>a(i)?.value||""),ie=I(()=>a(i)?.diff);ci(U,{get enableWrap(){return a(H)},get diffFile(){return e.diffFile},get enableHighlight(){return a(ee)},get rawLine(){return a(se)},get diffLine(){return a(ie)},get plainLine(){return a(v)},get syntaxLine(){return a(u)}})}C(R),C(T),K(()=>{G(T,"data-line",e.lineNumber),G(T,"data-state",a(i)?.diff?"diff":"plain"),Q(O,`
					color: var(${a(i)?.diff?dt:pr});
					background-color: ${a(i)?.diff?`var(${Sl})`:`var(${Vs})`};
					width: calc(calc(var(${$e}) + 5px) * 2);
					max-width: calc(calc(var(${$e}) + 5px) * 2);
					min-width: calc(calc(var(${$e}) + 5px) * 2;
				`),G(Y,"data-line-old-num",a(i)?.oldLineNumber||0),Ce(be,a(i)?.oldLineNumber||0),G(j,"data-line-new-num",a(i)?.newLineNumber||0),Ce(M,a(i)?.newLineNumber||0),Q(R,`
					background-color: ${a(i)?.diff?`var(${Il})`:`var(${Vs})`}
				`)}),D(N,T)};V(h,N=>{a(c)?N(g):N(E,-1)})}D(S,L)};V(A,S=>{a(p)||S(x)})}D(t,b),fe()}var dv=new Set(["$$slots","$$events","$$legacy"]),fv=P('<tr data-state="extend" class="diff-line diff-line-extend"><td class="diff-line-extend-content p-0 align-top"><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function zl(t,e){de(e,!0);let n=pe(e,dv),i=I(Xr()),r=I(yn()),o=I(Zr()),s=I(()=>e.diffFile.getUnifiedLine(e.index)),l=I(()=>a(i)?.oldFile?.[a(s)?.oldLineNumber||-1]),d=I(()=>a(i)?.newFile?.[a(s)?.newLineNumber||-1]),p=I(()=>a(s).isHidden),c=I(()=>!!((a(l)||a(d))&&a(p)&&a(o))),f=I(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>a(c)}));var u=me(),m=te(u);{var v=y=>{var w=fv(),b=$(w);G(b,"colspan",2);var A=$(b),x=$(A);{var S=g=>{var E=me(),N=te(E);Mt(N,()=>a(o),()=>({diffFile:e.diffFile,side:B.old,data:a(l)?.data,lineNumber:a(s)?.oldLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),D(g,E)};V(x,g=>{(a(r)||a(f)>0)&&a(l)&&a(o)&&g(S)})}var L=q(x,2);{var h=g=>{var E=me(),N=te(E);Mt(N,()=>a(o),()=>({diffFile:e.diffFile,side:B.new,data:a(d)?.data,lineNumber:a(s)?.newLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),D(g,E)};V(L,g=>{(a(r)||a(f)>0)&&a(d)&&a(o)&&g(h)})}C(A),C(b),C(w),K(()=>{G(w,"data-line",`${e.lineNumber}-extend`),Q(A,`width: ${a(f)}px `)}),D(y,w)};V(m,y=>{a(c)&&y(v)})}D(t,u),fe()}var cv=new Set(["$$slots","$$events","$$legacy"]),uv=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),pv=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),hv=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),mv=P('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),gv=P('<div class="min-h-[28px]">&ensp;</div>'),vv=P('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[100px] select-none"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Zs(t,e){de(e,!0);let n=pe(e,cv),i=I(()=>e.diffFile.getUnifiedHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>a(r)&&a(i)&&a(i).unifiedInfo),s=I(yn()),l=()=>a(i)&&a(i).unifiedInfo&&a(i).unifiedInfo.startHiddenIndex<a(i).unifiedInfo.endHiddenIndex,d=ce(Ae(l())),p=()=>a(i)&&a(i).unifiedInfo&&a(i).unifiedInfo.endHiddenIndex-a(i).unifiedInfo.startHiddenIndex<Pe,c=ce(Ae(p())),f=I(()=>a(i)&&a(i).isFirst),u=I(()=>a(i)&&a(i).isLast),m=I(()=>a(i)&&e.diffFile._getIsPureDiffRender()&&!a(i).unifiedInfo),v={current:()=>{}};ye(()=>{v?.current?.();let A=()=>{re(d,l(),!0),re(c,p(),!0)};A(),v.current=e.diffFile.subscribe(A)}),Ge(()=>v.current());var y=me(),w=te(y);{var b=A=>{var x=vv(),S=$(x),L=$(S);{var h=O=>{var X=me(),z=te(X);{var J=M=>{var R=uv(),U=$(R);St(U,{className:"fill-current"}),C(R),xe("click",R,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),D(M,R)},Y=M=>{var R=pv(),U=$(R);Nt(U,{className:"fill-current"}),C(R),xe("click",R,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),D(M,R)},be=M=>{var R=hv(),U=$(R);Ln(U,{className:"fill-current"}),C(R),xe("click",R,()=>e.diffFile.onUnifiedHunkExpand("all",e.index)),D(M,R)},j=M=>{var R=mv(),U=te(R),H=$(U);Nt(H,{className:"fill-current"}),C(U);var ee=q(U,2),se=$(ee);St(se,{className:"fill-current"}),C(ee),xe("click",U,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),xe("click",ee,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),D(M,R)};V(z,M=>{a(f)?M(J):a(u)?M(Y,1):a(c)?M(be,2):M(j,-1)})}D(O,X)},g=O=>{var X=gv();D(O,X)};V(L,O=>{a(o)?O(h):O(g,-1)})}C(S);var E=q(S),N=$(E),T=$(N,!0);C(N),C(E),C(x),K(()=>{G(x,"data-line",`${e.lineNumber}-hunk`),Q(S,`
				background-color: var(${Un});
				color: var(${dt});
				width: calc(calc(var(${$e}) + 5px) * 2);
				max-width: calc(calc(var(${$e}) + 5px) * 2);
				min-width: calc(calc(var(${$e}) + 5px) * 2);
			`),Q(E,` background-color: var(${dn}) `),Q(N,`
					white-space: ${a(s)?"pre-wrap":"pre"};
					word-break: ${a(s)?"break-all":"initial"};
					color: var(${jn});
				`),Ce(T,a(i)?.unifiedInfo?.plainText||a(i)?.text)}),D(A,x)};V(w,A=>{(a(d)||a(m))&&A(b)})}D(t,y),fe()}it(["click"]);var _v=new Set(["$$slots","$$events","$$legacy"]),bv=P('<tr data-state="widget" class="diff-line diff-line-widget"><td class="diff-line-widget-content p-0"><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Wl(t,e){de(e,!0);let n=pe(e,_v),i=I(En()),r=I(yn()),o=I(Kr()),s=I(()=>e.diffFile.getUnifiedLine(e.index)),l=I(()=>a(s)?.oldLineNumber&&a(i)?.side===B.old&&a(i)?.lineNumber===a(s)?.oldLineNumber),d=I(()=>a(s)?.newLineNumber&&a(i)?.side===B.new&&a(i)?.lineNumber===a(s)?.newLineNumber),p=I(()=>a(s)?.isHidden),c=I(()=>!!((a(l)||a(d))&&!a(p)&&a(o))),f=()=>{a(i).side=void 0,a(i).lineNumber=void 0},u=I(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>a(c)}));var m=me(),v=te(m);{var y=w=>{var b=bv(),A=$(b);G(A,"colspan",2);var x=$(A),S=$(x);{var L=E=>{var N=me(),T=te(N);Mt(T,()=>a(o),()=>({diffFile:e.diffFile,side:B.old,lineNumber:a(s)?.oldLineNumber||0,onClose:f})),D(E,N)};V(S,E=>{(a(r)||a(u)>0)&&a(l)&&E(L)})}var h=q(S,2);{var g=E=>{var N=me(),T=te(N);Mt(T,()=>a(o)??ut,()=>({diffFile:e.diffFile,side:B.new,lineNumber:a(s)?.newLineNumber||0,onClose:f})),D(E,N)};V(h,E=>{(a(r)||a(u)>0)&&a(d)&&E(g)})}C(x),C(A),C(b),K(()=>{G(b,"data-line",`${e.lineNumber}-widget`),Q(x,`width: ${a(u)}px`)}),D(w,b)};V(v,w=>{a(c)&&w(y)})}D(t,m),fe()}var wv=new Set(["$$slots","$$events","$$legacy"]),xv=P("<!> <!> <!> <!>",1),yv=P('<div><style data-select-style=""></style> <div class="unified-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><table><colgroup><col class="unified-diff-table-num-col"/><col class="unified-diff-table-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">line number</th><th scope="col">line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Ql(t,e){de(e,!0);let n=pe(e,wv),i=ce(Ae(La(e.diffFile))),r=ce(Ae(e.diffFile.unifiedLineLength.toString())),o=ce(null),s=I(qr()),l=I(yn()),d={current:()=>{}},p={current:void 0},c=()=>{let h=e.diffFile;re(i,La(h),!0),re(r,h.unifiedLineLength.toString(),!0)};ye(()=>{d.current?.(),c(),d.current=e.diffFile.subscribe(c)}),Ge(()=>d.current());let f=h=>{let g=h.target;if(!a(o))return;if(g&&g?.nodeName==="BUTTON"){An();return}let E=ro(g);if(!(E&&E!==`diff-root${e.diffFile.getId()}`))for(;g&&g instanceof HTMLElement;){let N=g.getAttribute("data-state");if(N){N==="extend"||N==="hunk"||N==="widget"?p.current!==!1&&(p.current=!1,a(o).innerHTML="",An()):p.current!==!0&&(p.current=!0,a(o).innerHTML=`#${E} [data-state="extend"] {user-select: none} 
#${E} [data-state="hunk"] {user-select: none} 
#${E} [data-state="widget"] {user-select: none}`,An());return}g=g.parentElement}},u=I(()=>({fontSize:a(s)+"px",fontFamily:"Menlo, Consolas, monospace"})),m=I(io({text:()=>a(r),font:()=>a(u)})),v=I(()=>Math.max(40,a(m)+10));var y=yv(),w=$(y);at(w,()=>h=>re(o,h,!0));var b=q(w,2),A=$(b),x=q($(A),2),S=$(x);di(S,17,()=>a(i),li,(h,g)=>{var E=xv(),N=te(E);Zs(N,{get index(){return a(g).index},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}});var T=q(N,2);Gl(T,{get index(){return a(g).index},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}});var O=q(T,2);Wl(O,{get index(){return a(g).index},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}});var X=q(O,2);zl(X,{get index(){return a(g).index},get lineNumber(){return a(g).lineNumber},get diffFile(){return e.diffFile}}),D(h,E)});var L=q(S);Zs(L,{get index(){return e.diffFile.unifiedLineLength},get lineNumber(){return e.diffFile.unifiedLineLength},get diffFile(){return e.diffFile}}),C(x),C(A),C(b),C(y),K(h=>{Ie(y,1,`unified-diff-view ${a(l)?"unified-diff-view-wrap":"unified-diff-view-normal"} w-full`),Q(b,h),Ie(A,1,`unified-diff-table w-full border-collapse border-spacing-0 ${a(l)?"table-fixed":""}`)},[()=>`${$e}: ${Math.round(a(v))}px; font-family: Menlo, Consolas, monospace; font-size: var(${tt})`]),xe("mousedown",x,f),D(t,y),fe()}it(["mousedown"]);var Ev=new Set(["$$slots","$$events","$$legacy"]),Av=P('<div class="diff-tailwindcss-wrapper" data-component="git-diff-view"><div class="diff-style-root"><div><!></div></div></div>');function ea(t,e){de(e,!0);let n=pe(e,Ev),i={current:null},o=I(()=>{if(i.current?.clear?.(),e.diffFile){let h=Ki.createInstance({});return h._mergeFullBundle(e.diffFile._getFullBundle()),i.current=h,h}else if(e.data){let h=e.data,g=new Ki(h.oldFile?.fileName||"",h.oldFile?.content||"",h.newFile?.fileName||"",h.newFile?.content||"",h.hunks||[],h.oldFile?.fileLang||"",h.newFile?.fileLang||"");return i.current=g,g}return null});ye(()=>{e.onDiffFileCreated?.(a(o))});let l=I(()=>a(o)?.getId?.()),d=Ae({side:e.initialWidgetState?.side,lineNumber:e.initialWidgetState?.lineNumber}),p=ce(null),c=I(()=>e.diffViewHighlight??!0),f=I(()=>e.diffViewTheme);ye(()=>{d.side=e.initialWidgetState?.side,d.lineNumber=e.initialWidgetState?.lineNumber}),ye(()=>{(e.data||e.diffFile)&&(d.side=void 0,d.lineNumber=void 0)});let u={current:()=>{}},m=I(fi());ye(()=>{u?.current?.(),!(!a(m)||!a(o)||!e.diffFile)&&(e.diffFile._addClonedInstance(a(o)),u.current=()=>e.diffFile?._delClonedInstance(a(o)))}),Ge(()=>u.current()),ye(()=>{!a(o)||!a(m)||(a(o).initTheme(a(f)),a(o).initRaw(),a(o).buildSplitDiffLines(),a(o).buildUnifiedDiffLines())}),ye(()=>{if(!(!a(o)||!a(m))&&(a(f),a(c))){let h=e.registerHighlighter;h?(h.name!==a(o)._getHighlighterName()||h.type!==a(o)._getHighlighterType()||h.type!=="class")&&(a(o).initSyntax({registerHighlighter:h}),a(o).notifyAll()):(!a(o)._getIsCloned()&&a(o)._getHighlighterName()!==gr.name||a(o)._getHighlighterType()!=="class")&&(a(o).initSyntax(),a(o).notifyAll())}});let b={current:()=>{}};ye(()=>{if(b?.current?.(),!a(m)||!a(o)||!a(p))return;a(f);let h=()=>{a(p)?.setAttribute("data-theme",a(o)._getTheme()||"light"),a(p)?.setAttribute("data-highlighter",a(o)._getHighlighterName())};h(),b.current=a(o).subscribe(h)}),Ge(()=>b.current()),Wc(n),Vc(n),Jc(n),ou(n),au(n),du(n),cu(n),pu(n),iu(d),tu(n),Kc(()=>a(o)?.getId()||""),Zc(()=>a(p));var x=me(),S=te(x);{var L=h=>{var g=Av(),E=$(g),N=$(E),T=$(N);{var O=z=>{Ul(z,{get diffFile(){return a(o)}})},X=z=>{Ql(z,{get diffFile(){return a(o)}})};V(T,z=>{!e.diffViewMode||e.diffViewMode&Ot.Split?z(O):z(X,-1)})}C(N),C(E),C(g),at(g,()=>z=>re(p,z,!0)),K((z,J)=>{G(g,"data-theme",z),G(g,"data-highlighter",J),Q(E,`${tt}:${e.diffViewFontSize||14}px`),G(N,"id",a(m)?`diff-root${a(l)}`:void 0),Ie(N,1,"diff-view-wrapper"+(e.class?` ${e.class}`:"")),Q(N,e.style)},[()=>a(o)?._getTheme()||"light",()=>a(o)?._getHighlighterName()]),D(h,g)};V(S,h=>{a(o)&&h(L)})}D(t,x),fe()}ls.name="@git-diff-view/svelte";function Au(t){let e=/[.*+?^${}()|[\]\\]/g;return t.replace(e,"\\$&")}function Lu(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function ku(t){if(!t)return!1;let e=Date.now()-1440*60*1e3;return t*1e3>e}function Ai(){let t=k;t.currentSubjectData=null,t.currentItemId=null,t.currentWcode=null,t.currentTags=null,t.currentSeries=null,t.currentCommitMessage=null,t.currentFieldUpdates=null,t.currentTagUpdates=null,t.currentSeriesUpdate=null}var Iu={Album:["中文名","别名","艺术家","作曲","编曲","作词","厂牌","发售日期","价格","版本特性","播放时长","录音","碟片数量","链接"],Anime:["中文名","别名","上映年度","片长","官方网站","链接","其他","Copyright"],Book:["中文名","别名","作者","插图","出版社","价格","其他出版社","连载杂志","发售日","页数","ISBN","链接","其他"],BookSeries:["中文名","别名","出版社","连载杂志","开始","结束","册数","话数","原作","链接","其他"],Crt:["简体中文名","别名","性别","生日","血型","身高","体重","BWH","引用来源"],Game:["中文名","别名","平台","游戏类型","游戏引擎","游玩人数","发行日期","售价","开发","发行","剧本","程序","website","链接"],Manga:["中文名","别名","作者","作画","脚本","原作","出版社","价格","其他出版社","连载杂志","发售日","册数","页数","话数","ISBN","链接","其他"],Movie:["中文名","别名","上映年度","片长","官方网站","链接","其他","Copyright"],Novel:["中文名","别名","作者","插图","出版社","价格","连载杂志","发售日","册数","页数","话数","ISBN","链接","其他"],OVA:["中文名","别名","话数","发售日","官方网站","开始","结束","链接","其他"],PhotoBook:["中文名","别名","作者","摄影","出版社","价格","其他出版社","连载杂志","发售日","页数","ISBN","链接","其他"],TV:["中文名","别名","集数","季数","放送星期","开始","结束","主演","导演","音乐","原作","制作","类型","国家/地区","语言","每集长","在线播放平台","电视网","电视台","频道","视频制式","音频制式","首播国家","首播地区","台湾名称","港澳名称","马新名称","官方网站","链接","imdb_id","tvdb_id"],TVAnime:["中文名","别名","话数","放送开始","放送星期","官方网站","在线播放平台","播放电视台","其他电视台","播放结束","导演","音乐","链接","其他","Copyright"],doujinBook:["作者","原作","CP","语言","页数","尺寸","价格","发售日"],doujinGame:["别名","开发者","原作","平台","游戏类型","游戏引擎","游玩人数","语言","价格","发售日"],doujinMusic:["艺术家","原作","语言","版本特性","碟片数量","播放时长","价格","发售日"],realMovie:["中文名","别名","上映日","片长","类型","国家/地区","语言","官方网站","链接","imdb_id","tmdb_id","tvdb_id"]},Su={Album:"Album","animanga/Anime":"Anime","animanga/Book":"Book","animanga/BookSeries":"BookSeries",Crt:"Crt",Game:"Game","animanga/Manga":"Manga","animanga/Movie":"Movie","animanga/Novel":"Novel","animanga/OVA":"OVA","Book/PhotoBook":"PhotoBook","real/Television":"TV","animanga/TVAnime":"TVAnime","doujin/Book":"doujinBook","doujin/Game":"doujinGame","doujin/Album":"doujinMusic","real/Movie":"realMovie"};function Vl(){return k.theme==="dark"?"dark":k.theme==="light"?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function Nu(){return k.entityType||"subject"}function Yl(){if(!k.currentSubjectData)return!1;let t=Nu(),n=document.getElementById("static-wcode-input").value.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=(k.currentSubjectData.infobox||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),o=n!==r;if(t==="subject"){let l=document.getElementById("static-tags-input").value.split(" ").filter(m=>m),d=document.getElementById("static-series-checkbox").checked,p=k.currentSubjectData.metaTags||[],c=k.currentSubjectData.series||!1,f=!Lu(l,p);return o||f||d!==c}return o}function Pi(){let t=document.querySelector("#static-buttons-container button#process-confirm-update");if(!t)return;Yl()?(t.textContent="确认更新",t.disabled=!1):(t.textContent="确认更新（无实质修改）",t.disabled=!1)}function oo(t,e,n,i){let r=Object.keys(t||{}),o=[];return r.length&&o.push(`更新${r.join("、")}`),(i==="subject"||!i)&&(e?.add.length&&o.push(`添加标签${e.add.join("、")}`),e?.remove.length&&o.push(`删除标签${e.remove.join("、")}`),n?.hasUpdate&&o.push(n.newValue?"标记为系列":"取消系列标记")),o.filter(s=>s).join("；")||"更新条目信息"}function so(t,e,n){try{let i=(t||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),r=(e||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),l=af("编辑前",i,"编辑后",r,"text","text",{context:1});l.init(),l.buildSplitDiffLines();let d=document.getElementById(n);if(!d)return;let p=d._diffViewInstance;p&&zo(p),d.innerHTML="";let c=Jr(ea,{target:d,props:{diffFile:l,diffViewMode:k.diffViewMode==="unified"?Ot.Unified:Ot.Split,diffViewFontSize:13,diffViewTheme:Vl(),diffViewHighlight:!0,diffViewWrap:!0}});d._diffViewInstance=c,n==="static-content-diff-container"&&setTimeout(()=>{let u=document.getElementById("static-wcode-input");u&&(u.style.height="")},0);let f=document.getElementById("diff-error");f&&(f.style.display="none")}catch(i){console.error("Diff generation error:",i);let r=document.getElementById("diff-error");r&&(r.textContent=`差异显示错误: ${i.message}`,r.style.display="block")}}function Jl(){let t=k.currentSubjectData;if(!t)return;let e=Nu(),n=t.infobox||"",i=document.getElementById("static-wcode-input")?.value;if(i!==void 0&&so(n,i,"static-content-diff-container"),e==="subject"){let r=t.metaTags||[],o=document.getElementById("static-tags-input")?.value.split(" ").filter(s=>s);o!==void 0&&Xo(r,o,"static-tags-diff-container")}}function Xo(t,e,n){let i=t.join(`
`),r=e.join(`
`);so(i,r,n)}function Cu(t,e){let n={};return Object.keys(t).forEach(i=>{if(!["id","tags","series","type"].includes(i.toLowerCase())){let r=t[i];r!==void 0&&(n[i]=r)}}),n}function $u(t,e){if(k.entityType!=="subject")return{add:[],remove:[]};let i=(t.tags||"").split(" ").filter(s=>s),r=[],o=[];return i.forEach(s=>{s.startsWith("-")?o.push(s.slice(1)):r.push(s)}),{add:r,remove:o}}function Du(t,e){if(k.entityType!=="subject")return{hasUpdate:!1};if(t.series===void 0||t.series===null||t.series==="")return{hasUpdate:!1};let n=t.series.trim().toLowerCase(),i=n==="true"||n==="1"||n==="yes";return{hasUpdate:i!==e,newValue:i}}function Lv(t){let e=t.match(/{{Infobox\s+(.+?)$/m);return e&&Su[e[1]]||null}function kv(t,e,n){for(let i=1;i<t.length;i++){let r=t[i].match(/^\|([^|=]+?)\s*=/);if(r&&e.indexOf(r[1])>n)return i}return t.length-1}function Tu(t,e){let n=Lv(t),i=n?Iu[n]:null,r=t,o=[];if(Object.entries(e).forEach(([s,l])=>{l=l.replaceAll("\\n",`
`);let d=new RegExp(`\\|${Au(s)}\\s*=.*`,"i");d.test(r)?r=r.replace(d,`|${s}= ${l}`):o.push({field:s,value:l,fieldIdx:i?i.indexOf(s):-1})}),o.length>0){i&&o.sort((l,d)=>l.fieldIdx===-1&&d.fieldIdx===-1?0:l.fieldIdx===-1?1:d.fieldIdx===-1?-1:l.fieldIdx-d.fieldIdx);let s=r.split(`
`);for(let l=o.length-1;l>=0;l--){let d=o[l];i&&d.fieldIdx>=0?s.splice(kv(s,i,d.fieldIdx),0,`|${d.field}= ${d.value}`):s.splice(-1,0,`|${d.field}= ${d.value}`)}r=s.join(`
`)}return r}function Fu(t,e){let n=new Set(t);return e.add.forEach(i=>n.add(i)),e.remove.forEach(i=>n.delete(i)),[...n]}var Hu=ad(Mu());function Bu(t,e){try{k.csvData=Iv(t),k.currentIndex=0,k.retryCount={},k.previousItem=null,localStorage.setItem("bgmCsvData",JSON.stringify(k.csvData)),localStorage.setItem("bgmCurrentIndex","0"),Gn(),en(e+"加载成功")}catch(n){en("CSV解析错误: "+n.message),console.error(n)}finally{Zt(),document.querySelectorAll("#static-buttons-container button").forEach(n=>{n.disabled=!1})}}function Ru(t){let n=t.target.files?.[0];if(!n)return;document.querySelectorAll("#static-buttons-container button").forEach(r=>{r.disabled=!0}),Gi("正在解析CSV文件...");let i=new FileReader;i.onload=function(r){let o=r.target.result;Bu(o,"CSV文件")},i.readAsText(n)}function Ou(t){document.querySelectorAll("#static-buttons-container button").forEach(e=>{e.disabled=!0}),Gi("正在解析粘贴的CSV..."),Bu(t,"粘贴的CSV")}function Iv(t){let e=Hu.default.parse(t,{header:!0,skipEmptyLines:!0,transform:s=>s.trim()});if(e.errors.length){let s=e.errors[0];throw new Error(`第${s.row!==void 0?s.row+1:"?"}行: ${s.message}`)}let n=e.meta.fields;if(!n||n.length===0)throw new Error("CSV文件为空或格式错误");let i=n.find(s=>/^(person_id|character_id|id)$/i.test(s));if(!i)throw new Error('CSV必须包含"id"、"person_id"或"character_id"列');k.entityType="subject",/^person_id$/i.test(i)?k.entityType="person":/^character_id$/i.test(i)&&(k.entityType="character");let r=n.filter(s=>s!==i),o=[];for(let s of e.data){let l=s[i]?.trim();if(!l)continue;let d={id:l};for(let p of r){let c=s[p];c!==void 0&&(d[p]=c.trim())}o.push(d)}if(o.length===0)throw new Error("未找到有效的数据行");return o}function Gn(){k.currentView="setup",k.processing=!1,k.paused=!0,Ai(),Zt();let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container");document.getElementById("edit-regions").style.display="none",ld(),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">基本设置</h3>
                <div class="setup-columns">
                    <div class="setup-column">
                        <div class="form-group">
                            <label>提交方式选择</label>
                            <div class="method-option-group">
                                <input type="radio" id="method-patch" name="submit-method" value="patch" ${k.submitMethod==="patch"?"checked":""}>
                                <label for="method-patch">Private API</label>
                                <input type="radio" id="method-post" name="submit-method" value="post" ${k.submitMethod==="post"?"checked":""}>
                                <label for="method-post">旧 API</label>
                            </div>
                        </div>

                        <div id="patch-method-options" class="form-group ${k.submitMethod==="patch"?"":"hidden"}">
                            <label for="setup-access-token">Access Token</label>
                            <input type="password" id="setup-access-token" value="${k.accessToken}">
                            <p class="formhash-hint">
                                在<a href="https://next.bgm.tv/demo/access-token" target="_blank">个人令牌页</a>获取 Access Token<br>
                                限速严重可切换为旧 API
                            </p>
                        </div>

                        <div id="post-method-options" class="form-group ${k.submitMethod==="post"?"":"hidden"}">
                            <label for="setup-formhash">Formhash</label>
                            <div class="row-flex">
                                <input type="text" id="setup-formhash" value="${k.formhash}">
                                <button type="button" class="secondary" id="setup-fetch-formhash"><i class="fas fa-magic"></i> 自动获取</button>
                            </div>
                            <p class="formhash-hint">
                                如何获取formhash：<br>
                                1. 打开条目编辑页面（如 <a href="https://bgm.tv/subject/354667/edit_detail" target="_blank">https://bgm.tv/subject/354667/edit_detail</a>）<br>
                                2. 在浏览器控制台执行：<code>document.querySelector('[name=formhash]').value</code><br>
                                3. 将返回的值复制到上方输入框<br>
                                <strong>自动获取</strong>：通过后台请求编辑页面自动提取 formhash（需已登录）
                            </p>
                        </div>

                        <div class="form-group">
                            <label>Diff 显示模式</label>
                            <div class="method-option-group">
                                <input type="radio" id="diff-mode-split" name="diff-view-mode" value="split" ${k.diffViewMode==="split"?"checked":""}>
                                <label for="diff-mode-split">左右对照</label>
                                <input type="radio" id="diff-mode-unified" name="diff-view-mode" value="unified" ${k.diffViewMode==="unified"?"checked":""}>
                                <label for="diff-mode-unified">上下统一</label>
                            </div>
                        </div>
                    </div>
                    <div class="setup-column">
                        <div class="form-group">
                            <label for="setup-csv-file">CSV文件 (包含ID列、要更新的字段列、tags列或series列)</label>
                            <div class="file-upload-group">
                                <button type="button" class="secondary" id="setup-csv-btn">
                                    <i class="fas fa-upload"></i> 选择 CSV 文件
                                </button>
                                <button type="button" class="secondary" id="setup-paste-csv-btn">
                                    <i class="fas fa-paste"></i> 从剪贴板粘贴
                                </button>
                                <span class="file-upload-name" id="setup-csv-file-name"></span>
                            </div>
                            <input type="file" id="setup-csv-file" accept=".csv" class="file-upload-input">
                            ${k.csvData?`<div class="csv-loaded-info">已加载CSV: ${k.csvData.length} 条记录</div>`:""}
                            <p class="csv-hint">
                                必备ID列，条目id，人物person_id，角色character_id<br>
                                tags列使用空格分隔标签，前缀带"-"的标签表示删除该标签<br>
                                series列使用true或false表示是否标记为系列<br>
                                可使用 <a href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/bgq" target="_blank">Bangumi Query</a> 辅助生成（<a href="https://bgq.iccci.cc.cd" target="_blank">demo</a>）
                            </p>
                        </div>
                        ${k.csvData?`
                        <div class="form-group">
                            <label>处理进度</label>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${k.currentIndex/k.csvData.length*100}%"></div>
                            </div>
                            <div class="progress-info">上次进度: ${k.currentIndex}/${k.csvData.length}</div>
                            <button id="setup-reset-progress" class="secondary setup-reset-btn">重置进度</button>
                        </div>
                        `:""}
                    </div>
                </div>
                <div class="sync-section">
                    <h3 class="section-title">跨设备同步</h3>
                    <div class="sync-status" id="sync-status">未同步</div>
                    <div class="row-flex">
                        <button type="button" class="secondary" id="sync-auth-btn">
                            <i class="fab fa-github"></i> 授权 GitHub
                        </button>
                        <button type="button" class="secondary" id="sync-upload-btn">
                            <i class="fas fa-upload"></i> 上传进度
                        </button>
                        <button type="button" class="secondary" id="sync-download-btn">
                            <i class="fas fa-download"></i> 下载进度
                        </button>
                        <button type="button" class="secondary" id="sync-clear-btn">
                            <i class="fas fa-trash-alt"></i> 清除授权
                        </button>
                    </div>

                </div>
                <div class="setup-footer">
                    <a href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/wikiBatch" target="_blank">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="setup-start-processing" class="primary">开始处理</button>
        `);let n=document.getElementById("setup-access-token");n&&n.addEventListener("input",f=>{k.accessToken=f.target.value,GM_setValue("bgmAccessToken",k.accessToken)});let i=document.getElementById("setup-formhash");i&&i.addEventListener("input",f=>{k.formhash=f.target.value,GM_setValue("bgmFormhash",k.formhash)});let r=document.getElementById("setup-fetch-formhash");r&&r.addEventListener("click",()=>{i&&(r.disabled=!0,r.innerHTML='<i class="fas fa-spinner fa-pulse"></i> 获取中...',GM.xmlHttpRequest({method:"GET",url:"https://bgm.tv/subject/1/edit_detail",onload:f=>{try{let u=f.responseText.match(/<input[^>]*name="formhash"[^>]*value="([^"]+)"/);u&&u[1]?(k.formhash=u[1],GM_setValue("bgmFormhash",k.formhash),i.value=u[1]):alert("无法从页面提取 formhash，请确保已登录 Bangumi")}catch{alert("解析编辑页面失败")}finally{r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> 自动获取'}},onerror:()=>{alert("网络请求失败，请手动获取 formhash"),r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> 自动获取'}}))}),document.querySelectorAll('input[name="submit-method"]').forEach(f=>{f.addEventListener("change",u=>{k.submitMethod=u.target.value,GM_setValue("bgmSubmitMethod",k.submitMethod);let m=document.getElementById("patch-method-options"),v=document.getElementById("post-method-options");m&&m.classList.toggle("hidden",k.submitMethod!=="patch"),v&&v.classList.toggle("hidden",k.submitMethod!=="post")})}),document.querySelectorAll('input[name="diff-view-mode"]').forEach(f=>{f.addEventListener("change",u=>{k.diffViewMode=u.target.value,localStorage.setItem("bgmDiffViewMode",k.diffViewMode)})});let l=document.getElementById("setup-csv-file");l&&(l.addEventListener("change",Ru),l.addEventListener("change",()=>{let f=l.files?.[0]?.name||"",u=document.getElementById("setup-csv-file-name");u&&(u.textContent=f)}));let d=document.getElementById("setup-csv-btn");d&&l&&d.addEventListener("click",f=>{f.preventDefault(),l.click()});let p=document.getElementById("setup-paste-csv-btn");p&&p.addEventListener("click",async()=>{try{let f=await navigator.clipboard.readText();if(!f||!f.trim()){en("剪贴板内容不是有效的CSV");return}let u=document.getElementById("setup-csv-file-name");u&&(u.textContent="已从剪贴板粘贴"),Ou(f)}catch(f){en("读取剪贴板失败: "+f.message)}});let c=document.getElementById("sync-status");if(c)if(GM_getValue("bgmGistToken","")){let u=GM_getValue("bgmGistId","");c.textContent=u?"已同步 (Gist: "+u.slice(0,8)+"…)":"已授权 GitHub"}else c.textContent="未同步"}function Pu(t){k.currentView="processing";let{currentItem:e,wikiData:n,historyData:i}=t;k.currentSubjectData=n,k.currentItemId=e.id;let r=k.entityType||"subject";k.currentWcode=null,k.currentTags=null,k.currentSeries=null,k.currentCommitMessage=null;let o=document.getElementById("core-content"),s=document.getElementById("static-buttons-container"),l=document.getElementById("edit-regions");l&&(l.style.display="block"),co(),Ui(k.currentIndex,k.totalItems);let d=n.name||"未知名称",p=n.infobox||"",c=r==="subject"?n.metaTags||[]:[],f=r==="subject"&&n.series||!1,u=Cu(e,p),m=$u(e,c),v=Du(e,f);k.currentFieldUpdates=u,k.currentTagUpdates=m,k.currentSeriesUpdate=v;let y={subject:"条目",character:"角色",person:"人物"},w=document.getElementById("static-last-update"),b=i[0]?.createdAt,A=b?new Date(b*1e3):null,x=i[0]?.creator?.username||"",S=i[0]?.commitMessage||"",L=ku(b);if(A&&w){let{editPagePath:M}=ji(r,e.id);w.innerHTML=`
            <a href="${M}" target="_blank">
                最后更新: ${A.toLocaleString()} ${x} ${S}
            </a>
        `,w.style.color=L?"#d9534f":"",w.style.display="block"}else w&&(w.style.display="none");let h=document.getElementById("prev-item-link");if(h&&k.previousItem&&k.currentIndex>0){let M=k.previousItem.type,{editPagePath:R}=ji(M,k.previousItem.id);h.innerHTML=`
            <i class="fas fa-arrow-left"></i> 上一个:
            <a href="${R}" target="_blank">
                ${k.previousItem.name}（${k.previousItem.id}）
            </a>
        `,h.style.display="block"}else h&&(h.style.display="none");let g=document.getElementById("static-commit-input"),E=document.getElementById("static-lock-commit"),N=oo(u,m,v,r);g.value=k.isCommitMessageLocked?k.lockedCommitMessage:N,E.innerHTML=`<i class="fas ${k.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>`,E.title=k.isCommitMessageLocked?"解锁编辑摘要":"固定编辑摘要";let T=document.getElementById("static-wcode-input"),O=document.getElementById("static-content-diff-container"),X=Tu(p,u);T.value=X,so(p,X,"static-content-diff-container"),O&&(O.style.display="block");let z=document.getElementById("static-tags-area"),J=document.getElementById("static-tags-diff-wrapper");if(r==="subject"){let M=document.getElementById("static-tags-input"),R=Fu(c,m);M.value=R.join(" "),Xo(c,R,"static-tags-diff-container"),z&&(z.style.display="block"),J&&(J.style.display="block")}else z&&(z.style.display="none"),J&&(J.style.display="none");let Y=document.getElementById("static-series-area");if(r==="subject"){let M=document.getElementById("static-series-checkbox"),R=v.hasUpdate?v.newValue:f;M.checked=R,k.currentSeries=R,Y&&(Y.style.display="block")}else Y&&(Y.style.display="none");let be=ji(r,e.id).editPagePath.replace("/edit",""),j=y[r]||"条目";o&&(o.innerHTML=`
            <div>
                <div class="item-info">
                    当前${j}：<a href="${be}" target="_blank">${d}</a>（${e.id}）[${j}]
                </div>
            </div>
        `),s&&(s.innerHTML=`
            <button id="process-skip-update" class="secondary">跳过</button>
            <button id="process-confirm-update" class="primary">确认更新</button>
        `),Pi()}function ju(t,e){k.currentView="processing";let n=document.getElementById("core-content"),i=document.getElementById("static-buttons-container"),r=document.getElementById("edit-regions");r&&(r.style.display="none"),co(),Ui(k.currentIndex,k.totalItems);let o=t.id,l={subject:"条目",character:"角色",person:"人物"}[k.entityType]||"条目",d=(k.retryCount[o]||0)+1;k.retryCount[o]=d,n&&(n.innerHTML=`
            <div>
                <div class="item-info">
                    当前${l}：<a href="https://bgm.tv/${k.entityType}/${o}" target="_blank">查看${l}</a>（${o}）
                </div>
                <div class="status-box error">
                    无法获取${l}信息: ${e}
                    ${d>1?`<br>已重试 ${d-1} 次`:""}
                </div>
                <p>是否继续处理？</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${k.currentIndex/k.totalItems*100}%"></div>
                </div>
            </div>
        `),i&&(i.innerHTML=`
            <button id="process-skip-error" class="secondary">跳过</button>
            <button id="process-retry-error" class="primary">重试</button>
        `)}function Uu(t){k.currentView="processing";let e=document.getElementById("core-content"),n=document.getElementById("static-buttons-container"),i=document.getElementById("edit-regions");i&&(i.style.display="none"),co(),Ui(k.currentIndex,k.totalItems);let r=k.currentItemId||"",o=(k.retryCount[r]||0)+1;k.retryCount[r]=o;let l=k.currentSubjectData?.name||"未知名称",p={subject:"条目",character:"角色",person:"人物"}[k.entityType]||"条目";e&&(e.innerHTML=`
            <div>
                <div class="item-info">
                    当前${p}：<a href="https://bgm.tv/${k.entityType}/${r}" target="_blank">${l}</a>（${r}）
                </div>
                <div class="status-box error">
                    提交更新失败: ${t}
                </div>
                <p>是否重试更新？</p>
            </div>
        `),n&&(n.innerHTML=`
            <button id="process-skip-update-fail" class="secondary">跳过</button>
            <button id="process-retry-update" class="primary">重试</button>
        `)}function Gu(){k.currentView="completed";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container"),n=document.getElementById("edit-regions");n&&(n.style.display="none"),co(),Ui(k.totalItems,k.totalItems),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">处理完成</h3>
                <div class="status-box info">所有条目处理完毕</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">总条目</span>
                        <span class="stats-value">${k.totalItems}</span>
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="completed-back-to-setup" class="primary">返回设置</button>
        `)}function Sv(t){let e=t.trim();if(!e)return new Headers;let n=e.split(`\r
`).map(i=>{let r=i.split(":");return[r[0].trim(),r[1].trim()]});return new Headers(n)}function Nv(t,e){let n=Sv(e.responseHeaders),i=typeof e.response=="string"?new Blob([e.response],{type:n.get("Content-Type")||"text/plain"}):e.response;return new Xl(i,{statusCode:e.status,statusText:e.statusText,headers:n,finalUrl:e.finalUrl,redirected:e.finalUrl===t.url})}var Xl=class t{constructor(e,n){this.rawBody=e,this.init=n,this.body=e.stream();let{headers:i,statusCode:r,statusText:o,finalUrl:s,redirected:l}=n;this.headers=i,this.status=r,this.statusText=o,this.url=s,this.type="basic",this.redirected=l,this._bodyUsed=!1}get bodyUsed(){return this._bodyUsed}get ok(){return this.status<300}arrayBuffer(){if(this.bodyUsed)throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.arrayBuffer()}blob(){if(this.bodyUsed)throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");return this._bodyUsed=!0,Promise.resolve(this.rawBody.slice(0,this.rawBody.size,this.rawBody.type))}clone(){if(this.bodyUsed)throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");return new t(this.rawBody,this.init)}formData(){if(this.bodyUsed)throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text().then(Cv)}async json(){if(this.bodyUsed)throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");return this._bodyUsed=!0,JSON.parse(await this.rawBody.text())}text(){if(this.bodyUsed)throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text()}async bytes(){if(this.bodyUsed)throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");return this._bodyUsed=!0,new Uint8Array(await this.rawBody.arrayBuffer())}};function Cv(t){let e=new FormData;return t.trim().split("&").forEach(function(n){if(n){let i=n.split("="),r=i.shift()?.replace(/\+/g," "),o=i.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}async function kn(t,e){let n=new Request(t,e),i;return e?.body&&(i=await n.text()),await $v(n,e,i)}function $v(t,e,n){return new Promise((i,r)=>{if(t.signal&&t.signal.aborted)return r(new DOMException("Aborted","AbortError"));GM.xmlHttpRequest({url:t.url,method:Fv(t.method.toUpperCase()),headers:Object.fromEntries(new Headers(e?.headers).entries()),data:n,responseType:"blob",onload(o){try{i(Nv(t,o))}catch(s){r(s)}},onabort(){r(new DOMException("Aborted","AbortError"))},ontimeout(){r(new TypeError("Network request failed, timeout"))},onerror(o){r(new TypeError("Failed to fetch: "+o.finalUrl))}})})}var Dv=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function Tv(t,e){return t.includes(e)}function Fv(t){if(Tv(Dv,t))return t;throw new Error(`unsupported http method ${t}`)}var Zo=!1;function zu(){if(k.submitMethod==="patch"&&!k.accessToken){en("请输入Access Token");return}if(k.submitMethod==="post"&&!k.formhash){en("请输入Formhash");return}if(!k.csvData||k.csvData.length===0){en("请上传有效的CSV文件");return}k.totalItems=k.csvData.length,k.processing=!0,k.paused=!1,Zo=!1;let t=document.getElementById("core-content");t&&(t.innerHTML=`
            <div>
                <div class="item-info">准备处理第一个条目...</div>
            </div>
        `),ui()}function ui(t=!1){if(k.paused||!k.processing||Zo)return;if(k.currentIndex>=k.totalItems){Gu();return}let e=k.csvData[k.currentIndex],n=k.entityType||"subject";t||Ui(k.currentIndex,k.totalItems),document.querySelectorAll("#static-buttons-container button").forEach(s=>{s.disabled=!0}),Gi("正在获取条目信息...");let{wikiPath:i,historyPath:r}=ji(n,e.id),o=k.submitMethod==="patch"?{Authorization:`Bearer ${k.accessToken}`,Accept:"application/json"}:{Accept:"application/json"};Zo=!0,Promise.all([kn(i,{headers:o}),kn(r,{headers:o})]).then(async([s,l])=>{if(!s.ok)throw new Error(`HTTP ${s.status}`);if(!l.ok)throw new Error(`HTTP ${l.status}`);let d=await s.json(),p=await l.json();return{currentItem:e,wikiData:d,historyData:p}}).then(s=>{k.processing&&(k.retryCount[s.currentItem.id]=0,Zt(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Zo=!1,Pu(s))}).catch(s=>{k.processing&&(Zt(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Zo=!1,ju(e,s.message))})}function Wu(t,e,n,i,r,o,s,l,d){let p=k.entityType||"subject";if(k.submitMethod==="patch"){let{wikiPath:c,patchBodyKey:f}=ji(p,t),u={commitMessage:s};p==="subject"?u.subject={infobox:e,metaTags:n,series:i}:u[f]={infobox:e},kn(c,{method:"PATCH",headers:{Authorization:`Bearer ${k.accessToken}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(u)}).then(m=>m.ok?m:m.text().then(v=>{throw new Error(`HTTP ${m.status} - ${v||"更新失败"}`)})).then(()=>{Zt(),l()}).catch(m=>{d(m instanceof Error?m:new Error(String(m)))})}else{let c=e.replace(/\n/g,`\r
`),f=new FormData;if(f.append("formhash",k.formhash),f.append("editSummary",s),p==="subject")f.append("subject_title",k.currentSubjectData?.name||""),f.append("platform",k.currentSubjectData?.platform||""),f.append("subject_infobox",c),f.append("subject_summary",k.currentSubjectData?.summary||""),f.append("subject_meta_tags",n.join(" ")),f.append("series",i?"1":"0"),f.append("submit","提交");else if(p==="person"){f.append("crt_name",k.currentSubjectData?.name||""),f.append("crt_infobox",c),f.append("crt_summary",k.currentSubjectData?.summary||"");let v=k.currentSubjectData?.profession;if(v)for(let[y,w]of Object.entries(v))w&&f.append(`prsn_pro[${y}]`,"1");f.append("picfile",""),f.append("submit","改好了")}else f.append("crt_name",k.currentSubjectData?.name||""),f.append("crt_infobox",c),f.append("crt_summary",k.currentSubjectData?.summary||""),f.append("picfile",""),f.append("submit","改好了");let u=new URLSearchParams;f.forEach((v,y)=>{u.append(y,v)});let m=p==="subject"?`https://bgm.tv/subject/${t}/new_revision`:`https://bgm.tv/${p}/${t}/edit`;GM.xmlHttpRequest({method:"POST",url:m,data:u.toString(),headers:{"Content-Type":"application/x-www-form-urlencoded"},onload:function(v){Zt(),v.finalUrl===m?d(new Error("更新失败，可能是formhash无效或权限不足")):l()},onerror:function(v){Zt(),d(new Error(`网络错误: ${v.message}`))},onabort:function(){Zt(),d(new Error("请求已中止"))},ontimeout:function(){Zt(),d(new Error("请求超时"))}})}}var Qu="Ov23lifi6y3LGaJ8A53e",ta="wikiBatch-sync.json",Vu="wikiBatch 跨设备同步数据";function Mv(){return{version:1,csvData:localStorage.getItem("bgmCsvData")||"null",currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),retryCount:GM_getValue("bgmRetryCount")||"{}",previousItem:localStorage.getItem("bgmPreviousItem"),entityType:localStorage.getItem("bgmEntityType")||"subject",totalItems:parseInt(localStorage.getItem("bgmTotalItems")||"0")}}function Hv(t){localStorage.setItem("bgmCsvData",t.csvData),localStorage.setItem("bgmCurrentIndex",t.currentIndex.toString()),localStorage.setItem("bgmEntityType",t.entityType),localStorage.setItem("bgmTotalItems",t.totalItems.toString()),GM_setValue("bgmRetryCount",t.retryCount),t.previousItem?localStorage.setItem("bgmPreviousItem",t.previousItem):localStorage.removeItem("bgmPreviousItem")}async function Bv(){return(await kn("https://github.com/login/device/code",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:Qu,scope:"gist"})})).json()}async function Rv(t,e){return new Promise((n,i)=>{let r=e,o=async()=>{let l=await(await kn("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:Qu,device_code:t,grant_type:"urn:ietf:params:oauth:grant-type:device_code"})})).json();l.access_token?n(l.access_token):l.error==="authorization_pending"?setTimeout(o,r*1e3):l.error==="slow_down"?(r+=5,setTimeout(o,r*1e3)):i(new Error(l.error_description||l.error||"授权失败"))};o()})}async function Yu(t){t.textContent="正在获取设备码...";let e;try{e=await Bv()}catch{t.textContent="网络错误，无法连接 GitHub";return}t.innerHTML=`请在打开的页面中输入码: <strong>${e.user_code}</strong>`,GM_openInTab(e.verification_uri);try{let n=await Rv(e.device_code,e.interval);GM_setValue("bgmGistToken",n),t.textContent="授权成功"}catch(n){t.textContent=n.message}}function Ju(){return GM_getValue("bgmGistId")||null}function Zl(t){GM_setValue("bgmGistId",t)}function na(){return GM_getValue("bgmGistToken")||null}async function Ov(t){let e=na();if(!e)throw new Error("未授权");return(await(await kn("https://api.github.com/gists",{method:"POST",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({description:Vu,public:!1,files:{[ta]:{content:t}}})})).json()).id}async function Pv(t,e){let n=na();if(!n)throw new Error("未授权");await kn(`https://api.github.com/gists/${t}`,{method:"PATCH",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({files:{[ta]:{content:e}}})})}async function qu(){let t=na();return t&&(await(await kn("https://api.github.com/gists?per_page=100",{headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${t}`}})).json()).find(r=>r.description===Vu&&r.files?.[ta])?.id||null}async function jv(t){let e=na();if(!e)throw new Error("未授权");let r=(await(await kn(`https://api.github.com/gists/${t}`,{headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`}})).json()).files?.[ta];if(!r)throw new Error("Gist 中未找到同步数据");if(console.log("[wikiBatch] gist read:",{size:r.size,truncated:r.truncated,hasContent:typeof r.content=="string"}),r.truncated&&r.raw_url){console.log("[wikiBatch] gist content truncated, fetching raw_url...");let o=await kn(r.raw_url,{headers:{Authorization:`Bearer ${e}`}});if(!o.ok)throw new Error(`读取原始文件失败: HTTP ${o.status}`);let s=await o.text();return console.log("[wikiBatch] gist raw content length:",s.length),s}return r.content}async function Ku(){let t=Mv(),e=JSON.stringify(t),n=Ju();n||(n=await qu(),n&&Zl(n)),n?await Pv(n,e):(n=await Ov(e),Zl(n))}async function Xu(){let t=Ju();if(!t){if(t=await qu(),!t)throw new Error("未找到同步 Gist，请先在另一设备上传");Zl(t)}let e=await jv(t);console.log("[wikiBatch] parsed content length:",e.length);let n;try{n=JSON.parse(e)}catch(i){throw console.error("[wikiBatch] JSON.parse failed, content head:",e.slice(0,200)),console.error("[wikiBatch] JSON.parse failed, content tail:",e.slice(-200)),new Error("同步数据解析失败",{cause:i})}Hv(n)}function Zu(){GM_deleteValue("bgmGistToken"),GM_deleteValue("bgmGistId")}function ep(t){switch(t){case"setup-start-processing":zu();break;case"setup-reset-progress":k.currentIndex=0,k.retryCount={},k.previousItem=null,localStorage.setItem("bgmCurrentIndex","0"),Gn();break;case"sync-auth-btn":Uv();break;case"sync-upload-btn":Gv();break;case"sync-download-btn":zv();break;case"sync-clear-btn":Zu(),Gn();break}}async function Uv(){let t=document.getElementById("sync-status");if(!t)return;let e=document.getElementById("sync-auth-btn");e&&(e.disabled=!0),await Yu(t),e&&(e.disabled=!1),Gn()}async function Gv(){let t=document.getElementById("sync-status");if(t){In(),t.textContent="正在上传...";try{await Ku(),t.textContent="上传成功: "+new Date().toLocaleString()}catch(e){t.textContent="上传失败: "+e.message}}}async function zv(){let t=document.getElementById("sync-status");if(t){t.textContent="正在下载...";try{await Xu(),k.csvData=JSON.parse(localStorage.getItem("bgmCsvData")||"null"),k.currentIndex=parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),k.entityType=localStorage.getItem("bgmEntityType")||"subject",k.totalItems=parseInt(localStorage.getItem("bgmTotalItems")||"0"),k.retryCount=JSON.parse(GM_getValue("bgmRetryCount","{}")),k.previousItem=JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),t.textContent="下载成功: "+new Date().toLocaleString(),Gn()}catch(e){t.textContent="下载失败: "+e.message}}}function tp(t){if(!k.csvData)return;let e=k.csvData[k.currentIndex],n=k.currentSubjectData,i=e?.id||k.currentItemId||"",r=n?.name||"未知名称",o=k.entityType||"subject";function s(){return{id:i,name:r,type:o}}switch(t){case"process-confirm-update":{let l=document.getElementById("static-wcode-input").value,d=o==="subject"?document.getElementById("static-tags-input").value.split(" ").filter(u=>u):[],p=o==="subject"?document.getElementById("static-series-checkbox").checked:!1,c=document.getElementById("static-commit-input").value||oo(k.currentFieldUpdates,k.currentTagUpdates,k.currentSeriesUpdate,o);if(!Yl()){en("没有检测到实质修改，已跳过更新"),k.previousItem=s(),k.currentIndex++,Ai(),In(),ui();return}document.querySelectorAll("#static-buttons-container button").forEach(u=>{u.disabled=!0}),Gi("正在提交更新..."),Wu(i,l,d,p,r,e,c,()=>{k.previousItem=s(),k.currentIndex++,Ai(),In(),ui()},u=>{Zt(),document.querySelectorAll("#static-buttons-container button").forEach(m=>{m.disabled=!1}),Uu(u.message)});break}case"process-skip-update":k.previousItem=s(),k.currentIndex++,Ai(),In(),ui();break;case"process-confirm-continue":k.previousItem=s(),k.currentIndex++,Ai(),In(),ui();break;case"process-skip-error":k.currentIndex++,Ai(),In(),ui();break;case"process-retry-error":{let l=k.retryCount[i]||0;en(`正在重试（${l}次）...`),ui();break}case"process-skip-update-fail":k.previousItem=s(),k.currentIndex++,Ai(),In(),ui();break;case"process-retry-update":{let l=k.retryCount[i]||0;en(`正在重试（${l}次）...`),ui(!0);break}}}function np(t){t==="completed-back-to-setup"&&(Gn(),Wv())}function Wv(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}var ip="data:image/png;base64,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";var lp=7,dp=40,ia=Math.floor(Math.random()*lp),ra="bgm-tool-container",Qv="bgm-float-button",ao=null;function ed(){if(ao)return;ao=[];let t=Array.from(document.body.children);for(let e of t){let n=e.id;n===ra||n===Qv||e.tagName!=="SCRIPT"&&(ao.push({el:e,origDisplay:e.style.display||""}),e.style.display="none")}}function Vv(){if(ao){for(let{el:t,origDisplay:e}of ao)t.style.display=e;ao=null}}function Yv(){ia=(ia+1)%lp;let t=document.getElementById("bgm-tool-logo-sprite");t&&(t.style.backgroundPosition=`${-ia*dp}px 0`)}function td(t){let e=document.getElementById("bgm-tool-container");if(!e)return;t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches?e.setAttribute("data-theme","dark"):e.removeAttribute("data-theme")}function rp(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function op(t){return t==="dark"?"light":"dark"}function Jv(){if(k.theme==="system")k.theme=op(rp()),localStorage.setItem("bgmTheme",k.theme);else{let t=op(k.theme);t===rp()?(k.theme="system",localStorage.removeItem("bgmTheme")):(k.theme=t,localStorage.setItem("bgmTheme",k.theme))}td(k.theme),fp(),k.currentView==="processing"&&Jl()}function fp(){let t=document.getElementById("bgm-tool-theme");if(!t)return;let e=Vl();t.innerHTML=e==="dark"?'<i class="fas fa-moon"></i>':'<i class="fas fa-sun"></i>',t.title="主题: "+(e==="dark"?"深色":"浅色")}function sp(){let t=document.getElementById("bgm-float-button");return t||(t=document.createElement("div"),t.id="bgm-float-button",t.innerHTML='<i class="fas fa-tools"></i>',document.body.appendChild(t),t.addEventListener("click",()=>{let e=document.getElementById(ra);e&&(e.style.display="flex",ed(),t&&(t.style.display="none"))})),t}function cp(){let t=sp();if(t.style.display="none",document.getElementById(ra)){document.getElementById(ra).style.display="flex",ed();return}let e=document.createElement("div");e.id="bgm-tool-container",e.innerHTML=`
        <div id="bgm-tool-header">
            <div id="bgm-tool-header-logo">
                <div id="bgm-tool-logo-sprite" style="background-image: url(${ip}); background-position: ${-ia*dp}px 0;"></div>
                <span>批量更新</span>
            </div>
            <span class="header-spacer"></span>
            <div id="bgm-tool-header-actions">
                <button id="bgm-tool-theme" class="btn btn-default" title="主题" tabindex="0"><i class="fas fa-adjust"></i></button>
                <button id="bgm-tool-settings" class="btn btn-default" title="设置" tabindex="0"><i class="fas fa-cog"></i></button>
                <button id="bgm-tool-close" class="btn btn-default" title="关闭" tabindex="0"><i class="fas fa-sign-out-alt"></i></button>
            </div>
        </div>
        <div id="bgm-tool-progress">
            <div id="progress-inner">
                <span id="progress-text">处理进度: 0/0</span>
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
                        <label for="static-commit-input">编辑摘要</label>
                        <div class="row-flex">
                            <input type="text" id="static-commit-input" placeholder="请输入编辑摘要">
                            <button id="static-lock-commit" class="secondary" title="${k.isCommitMessageLocked?"解锁编辑摘要":"固定编辑摘要"}">
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
                                <div class="diff-section-label">Wcode 变更</div>
                                <div class="diff-section wcode-diff-section">
                                    <div id="static-content-diff-container" class="diff-container"></div>
                                </div>
                            </div>
                        </div>
                        <div class="edit-row">
                            <div class="tags-edit-area" id="static-tags-area">
                                <label for="static-tags-input">标签 (空格分隔)</label>
                                <input type="text" id="static-tags-input">
                            </div>
                            <div id="static-tags-diff-wrapper">
                                <div class="diff-section-label">标签变更</div>
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
                            <label for="static-series-checkbox">标记为系列</label>
                        </div>
                    </div>
                    <div id="diff-error"></div>
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
    `,document.body.appendChild(e),ed(),qv();let n=document.getElementById("bgm-tool-close");n&&n.addEventListener("click",()=>{e.style.display="none",Vv();let s=sp();s.style.display="flex",dd(),In()});let i=document.getElementById("bgm-tool-settings");i&&i.addEventListener("click",()=>{Gn()});let r=document.getElementById("bgm-tool-theme");r&&r.addEventListener("click",Jv);let o=document.getElementById("bgm-tool-header-logo");o&&o.addEventListener("click",Yv),td(k.theme),fp(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{k.theme==="system"&&(td("system"),k.currentView==="processing"&&Jl())}),Kv(),Gn()}function ap(t){t.addEventListener("click",e=>{let n=e.target.closest("button");if(!n)return;let i=n.id;switch(k.currentView){case"setup":ep(i);break;case"processing":tp(i);break;case"completed":np(i);break}})}function qv(){let t=document.getElementById("static-buttons-container");t&&ap(t);let e=document.getElementById("core-content");e&&ap(e)}function Kv(){document.getElementById("static-commit-input").addEventListener("input",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentCommitMessage=o.target.value,Pi())});let e=document.getElementById("static-lock-commit");e.addEventListener("click",()=>{if(k.currentView!=="processing"||!k.currentSubjectData)return;k.isCommitMessageLocked=!k.isCommitMessageLocked;let o=document.getElementById("static-commit-input");k.isCommitMessageLocked?(k.lockedCommitMessage=o.value,e.innerHTML='<i class="fas fa-lock"></i>',e.title="解锁编辑摘要"):(e.innerHTML='<i class="fas fa-lock-open"></i>',e.title="固定编辑摘要",k.currentCommitMessage=oo(k.currentFieldUpdates,k.currentTagUpdates,k.currentSeriesUpdate,k.entityType),o.value=k.currentCommitMessage),In(),Pi()}),document.getElementById("static-wcode-input").addEventListener("input",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentWcode=o.target.value,so(k.currentSubjectData.infobox||"",o.target.value,"static-content-diff-container"),Pi())}),document.getElementById("static-tags-input").addEventListener("input",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentTags=o.target.value,Xo(k.currentSubjectData.metaTags||[],o.target.value.split(" ").filter(s=>s),"static-tags-diff-container"),Pi())}),document.getElementById("static-series-checkbox").addEventListener("change",o=>{k.currentView==="processing"&&k.currentSubjectData&&(k.currentSeries=o.target.checked,Pi())})}var up=`/* stylelint-disable no-descending-specificity */

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
    padding: 0 24px;
    height: 56px;
    background: var(--white);
    border-bottom: 1px solid var(--border);
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 24px;
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
    gap: 8px;
    outline: none;
}

#bgm-tool-logo-sprite {
    outline: none;
    width: 40px;
    height: 50px;
    border-radius: 6px;
    flex-shrink: 0;
    background-repeat: no-repeat;
    background-size: 280px 75px;
}

.header-spacer {
    flex: 1;
}

#bgm-tool-header-actions {
    display: flex;
    gap: 20px;
    margin-left: auto;
    flex-wrap: wrap;
}

/* Reuse bgq button classes in the header (mirrors bgq .header .btn overrides) */
#bgm-tool-header-actions button.btn {
    padding: 0;
    border: none;
    font-size: 16px;
    cursor: pointer;
}

#bgm-tool-header-actions button.btn:hover {
    color: var(--accent);
    border-color: var(--accent);
}

/* ===== Progress Bar ===== */
#bgm-tool-progress {
    padding: 10px 24px;
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
    font-variant-numeric: tabular-nums;
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

/* Shared .btn classes, same definitions as bgq frontend */
#bgm-tool-container .btn {
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
    font-family: var(--font);
    cursor: pointer;
    transition: var(--transition);
    white-space: nowrap;
}

#bgm-tool-container .btn-default {
    background: var(--white);
    color: var(--text);
    border: 1px solid var(--border);
}

#bgm-tool-container .btn-default:hover {
    color: var(--accent);
    border-color: var(--accent);
}

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

/* ===== Layout Helpers ===== */
.row-flex {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.row-flex > .grow {
    flex: 1;
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
    flex-wrap: wrap;
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

.setup-reset-btn {
    margin-top: 10px;
}

/* ===== Diff Containers ===== */
.diff-container {
    overflow: hidden;
}

.diff-section {
    margin: 0;
    overflow: hidden;
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

/* ===== Diff Error ===== */
#diff-error {
    color: #a72e2e;
    font-size: 14px;
    margin-top: 8px;
    display: none;
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
    padding: 16px 24px;
    background: var(--white);
    border-top: 1px solid var(--border-light);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-wrap: wrap;
    box-sizing: border-box;
    flex-shrink: 0;
    width: 100%;
}

@media (width < 640px) {
    .buttons-container { padding: 16px; }
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
    flex-flow: row wrap;
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
    flex: 1;
}

#static-commit-input,
#setup-formhash {
    flex: 1;
    min-width: 0;
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

/* ===== Setup Sync & Footer ===== */
.sync-section {
    margin-top: 20px;
    border-top: 1px solid var(--border);
    padding-top: 16px;
}

.sync-status {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 8px;
}

.setup-footer {
    margin-top: 20px;
    border-top: 1px solid var(--border);
    padding-top: 14px;
    text-align: center;
}

.setup-footer a {
    color: var(--text-secondary);
    font-size: 13px;
    text-decoration: none;
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
    flex-wrap: wrap;
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
`;var pp=`.diff-tailwindcss-wrapper .\\!container {
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
`;GM_addStyle(up);GM_addStyle(pp);var nd=document.createElement("link");nd.rel="stylesheet";nd.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";document.head.appendChild(nd);cp();})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.6.0
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

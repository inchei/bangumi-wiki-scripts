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

"use strict";(()=>{var Ip=Object.create;var gd=Object.defineProperty;var Sp=Object.getOwnPropertyDescriptor;var Np=Object.getOwnPropertyNames;var Cp=Object.getPrototypeOf,$p=Object.prototype.hasOwnProperty;var vd=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var Tp=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Np(e))!$p.call(t,r)&&r!==n&&gd(t,r,{get:()=>e[r],enumerable:!(i=Sp(e,r))||i.enumerable});return t};var da=(t,e,n)=>(n=t!=null?Ip(Cp(t)):{},Tp(e||!t||!t.__esModule?gd(n,"default",{value:t,enumerable:!0}):n,t));var ha=vd((b_,Nd)=>{var cn=-1,Qt=1,ut=0;function ho(t,e,n,i,r){if(t===e)return t?[[ut,t]]:[];if(n!=null){var o=jp(t,e,n);if(o)return o}var s=ua(t,e),l=t.substring(0,s);t=t.substring(s),e=e.substring(s),s=is(t,e);var d=t.substring(t.length-s);t=t.substring(0,t.length-s),e=e.substring(0,e.length-s);var u=Dp(t,e);return l&&u.unshift([ut,l]),d&&u.push([ut,d]),pa(u,r),i&&Hp(u),u}function Dp(t,e){var n;if(!t)return[[Qt,e]];if(!e)return[[cn,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,o=i.indexOf(r);if(o!==-1)return n=[[Qt,i.substring(0,o)],[ut,r],[Qt,i.substring(o+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=cn),n;if(r.length===1)return[[cn,t],[Qt,e]];var s=Mp(t,e);if(s){var l=s[0],d=s[1],u=s[2],c=s[3],f=s[4],p=ho(l,u),g=ho(d,c);return p.concat([[ut,f]],g)}return Fp(t,e)}function Fp(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),o=r,s=2*r,l=new Array(s),d=new Array(s),u=0;u<s;u++)l[u]=-1,d[u]=-1;l[o+1]=0,d[o+1]=0;for(var c=n-i,f=c%2!==0,p=0,g=0,v=0,y=0,w=0;w<r;w++){for(var b=-w+p;b<=w-g;b+=2){var E=o+b,x;b===-w||b!==w&&l[E-1]<l[E+1]?x=l[E+1]:x=l[E-1]+1;for(var S=x-b;x<n&&S<i&&t.charAt(x)===e.charAt(S);)x++,S++;if(l[E]=x,x>n)g+=2;else if(S>i)p+=2;else if(f){var k=o+c-b;if(k>=0&&k<s&&d[k]!==-1){var h=n-d[k];if(x>=h)return wd(t,e,x,S)}}}for(var m=-w+v;m<=w-y;m+=2){var k=o+m,h;m===-w||m!==w&&d[k-1]<d[k+1]?h=d[k+1]:h=d[k-1]+1;for(var A=h-m;h<n&&A<i&&t.charAt(n-h-1)===e.charAt(i-A-1);)h++,A++;if(d[k]=h,h>n)y+=2;else if(A>i)v+=2;else if(!f){var E=o+c-m;if(E>=0&&E<s&&l[E]!==-1){var x=l[E],S=o+x-E;if(h=n-h,x>=h)return wd(t,e,x,S)}}}}return[[cn,t],[Qt,e]]}function wd(t,e,n,i){var r=t.substring(0,n),o=e.substring(0,i),s=t.substring(n),l=e.substring(i),d=ho(r,o),u=ho(s,l);return d.concat(u)}function ua(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(o,r)==e.substring(o,r)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return Ld(t.charCodeAt(r-1))&&r--,r}function xd(t,e){var n=t.length,i=e.length;if(n==0||i==0)return 0;n>i?t=t.substring(n-i):n<i&&(e=e.substring(0,n));var r=Math.min(n,i);if(t==e)return r;for(var o=0,s=1;;){var l=t.substring(r-s),d=e.indexOf(l);if(d==-1)return o;s+=d,(d==0||t.substring(r-s)==e.substring(0,s))&&(o=s,s++)}}function is(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(t.length-r,t.length-o)==e.substring(e.length-r,e.length-o)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return kd(t.charCodeAt(t.length-r))&&r--,r}function Mp(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||i.length*2<n.length)return null;function r(g,v,y){for(var w=g.substring(y,y+Math.floor(g.length/4)),b=-1,E="",x,S,k,h;(b=v.indexOf(w,b+1))!==-1;){var m=ua(g.substring(y),v.substring(b)),A=is(g.substring(0,y),v.substring(0,b));E.length<A+m&&(E=v.substring(b-A,b)+v.substring(b,b+m),x=g.substring(0,y-A),S=g.substring(y+m),k=v.substring(0,b-A),h=v.substring(b+m))}return E.length*2>=g.length?[x,S,k,h,E]:null}var o=r(n,i,Math.ceil(n.length/4)),s=r(n,i,Math.ceil(n.length/2)),l;if(!o&&!s)return null;s?o?l=o[4].length>s[4].length?o:s:l=s:l=o;var d,u,c,f;t.length>e.length?(d=l[0],u=l[1],c=l[2],f=l[3]):(c=l[0],f=l[1],d=l[2],u=l[3]);var p=l[4];return[d,u,c,f,p]}function Hp(t){for(var e=!1,n=[],i=0,r=null,o=0,s=0,l=0,d=0,u=0;o<t.length;)t[o][0]==ut?(n[i++]=o,s=d,l=u,d=0,u=0,r=t[o][1]):(t[o][0]==Qt?d+=t[o][1].length:u+=t[o][1].length,r&&r.length<=Math.max(s,l)&&r.length<=Math.max(d,u)&&(t.splice(n[i-1],0,[cn,r]),t[n[i-1]+1][0]=Qt,i--,i--,o=i>0?n[i-1]:-1,s=0,l=0,d=0,u=0,r=null,e=!0)),o++;for(e&&pa(t),Op(t),o=1;o<t.length;){if(t[o-1][0]==cn&&t[o][0]==Qt){var c=t[o-1][1],f=t[o][1],p=xd(c,f),g=xd(f,c);p>=g?(p>=c.length/2||p>=f.length/2)&&(t.splice(o,0,[ut,f.substring(0,p)]),t[o-1][1]=c.substring(0,c.length-p),t[o+1][1]=f.substring(p),o++):(g>=c.length/2||g>=f.length/2)&&(t.splice(o,0,[ut,c.substring(0,g)]),t[o-1][0]=Qt,t[o-1][1]=f.substring(0,f.length-g),t[o+1][0]=cn,t[o+1][1]=c.substring(g),o++),o++}o++}}var yd=/[^a-zA-Z0-9]/,Ed=/\s/,Ad=/[\r\n]/,Bp=/\n\r?\n$/,Rp=/^\r?\n\r?\n/;function Op(t){function e(g,v){if(!g||!v)return 6;var y=g.charAt(g.length-1),w=v.charAt(0),b=y.match(yd),E=w.match(yd),x=b&&y.match(Ed),S=E&&w.match(Ed),k=x&&y.match(Ad),h=S&&w.match(Ad),m=k&&g.match(Bp),A=h&&v.match(Rp);return m||A?5:k||h?4:b&&!x&&S?3:x||S?2:b||E?1:0}for(var n=1;n<t.length-1;){if(t[n-1][0]==ut&&t[n+1][0]==ut){var i=t[n-1][1],r=t[n][1],o=t[n+1][1],s=is(i,r);if(s){var l=r.substring(r.length-s);i=i.substring(0,i.length-s),r=l+r.substring(0,r.length-s),o=l+o}for(var d=i,u=r,c=o,f=e(i,r)+e(r,o);r.charAt(0)===o.charAt(0);){i+=r.charAt(0),r=r.substring(1)+o.charAt(0),o=o.substring(1);var p=e(i,r)+e(r,o);p>=f&&(f=p,d=i,u=r,c=o)}t[n-1][1]!=d&&(d?t[n-1][1]=d:(t.splice(n-1,1),n--),t[n][1]=u,c?t[n+1][1]=c:(t.splice(n+1,1),n--))}n++}}function pa(t,e){t.push([ut,""]);for(var n=0,i=0,r=0,o="",s="",l;n<t.length;){if(n<t.length-1&&!t[n][1]){t.splice(n,1);continue}switch(t[n][0]){case Qt:r++,s+=t[n][1],n++;break;case cn:i++,o+=t[n][1],n++;break;case ut:var d=n-r-i-1;if(e){if(d>=0&&Sd(t[d][1])){var u=t[d][1].slice(-1);if(t[d][1]=t[d][1].slice(0,-1),o=u+o,s=u+s,!t[d][1]){t.splice(d,1),n--;var c=d-1;t[c]&&t[c][0]===Qt&&(r++,s=t[c][1]+s,c--),t[c]&&t[c][0]===cn&&(i++,o=t[c][1]+o,c--),d=c}}if(Id(t[n][1])){var u=t[n][1].charAt(0);t[n][1]=t[n][1].slice(1),o+=u,s+=u}}if(n<t.length-1&&!t[n][1]){t.splice(n,1);break}if(o.length>0||s.length>0){o.length>0&&s.length>0&&(l=ua(s,o),l!==0&&(d>=0?t[d][1]+=s.substring(0,l):(t.splice(0,0,[ut,s.substring(0,l)]),n++),s=s.substring(l),o=o.substring(l)),l=is(s,o),l!==0&&(t[n][1]=s.substring(s.length-l)+t[n][1],s=s.substring(0,s.length-l),o=o.substring(0,o.length-l)));var f=r+i;o.length===0&&s.length===0?(t.splice(n-f,f),n=n-f):o.length===0?(t.splice(n-f,f,[Qt,s]),n=n-f+1):s.length===0?(t.splice(n-f,f,[cn,o]),n=n-f+1):(t.splice(n-f,f,[cn,o],[Qt,s]),n=n-f+2)}n!==0&&t[n-1][0]===ut?(t[n-1][1]+=t[n][1],t.splice(n,1)):n++,r=0,i=0,o="",s="";break}}t[t.length-1][1]===""&&t.pop();var p=!1;for(n=1;n<t.length-1;)t[n-1][0]===ut&&t[n+1][0]===ut&&(t[n][1].substring(t[n][1].length-t[n-1][1].length)===t[n-1][1]?(t[n][1]=t[n-1][1]+t[n][1].substring(0,t[n][1].length-t[n-1][1].length),t[n+1][1]=t[n-1][1]+t[n+1][1],t.splice(n-1,1),p=!0):t[n][1].substring(0,t[n+1][1].length)==t[n+1][1]&&(t[n-1][1]+=t[n+1][1],t[n][1]=t[n][1].substring(t[n+1][1].length)+t[n+1][1],t.splice(n+1,1),p=!0)),n++;p&&pa(t,e)}function Ld(t){return t>=55296&&t<=56319}function kd(t){return t>=56320&&t<=57343}function Id(t){return kd(t.charCodeAt(0))}function Sd(t){return Ld(t.charCodeAt(t.length-1))}function Pp(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}function ca(t,e,n,i){return Sd(t)||Id(i)?null:Pp([[ut,t],[cn,e],[Qt,n],[ut,i]])}function jp(t,e,n){var i=typeof n=="number"?{index:n,length:0}:n.oldRange,r=typeof n=="number"?null:n.newRange,o=t.length,s=e.length;if(i.length===0&&(r===null||r.length===0)){var l=i.index,d=t.slice(0,l),u=t.slice(l),c=r?r.index:null;e:{var f=l+s-o;if(c!==null&&c!==f||f<0||f>s)break e;var p=e.slice(0,f),g=e.slice(f);if(g!==u)break e;var v=Math.min(l,f),y=d.slice(0,v),w=p.slice(0,v);if(y!==w)break e;var b=d.slice(v),E=p.slice(v);return ca(y,b,E,u)}e:{if(c!==null&&c!==l)break e;var x=l,p=e.slice(0,x),g=e.slice(x);if(p!==d)break e;var S=Math.min(o-x,s-x),k=u.slice(u.length-S),h=g.slice(g.length-S);if(k!==h)break e;var b=u.slice(0,u.length-S),E=g.slice(0,g.length-S);return ca(d,b,E,k)}}if(i.length>0&&r&&r.length===0)e:{var y=t.slice(0,i.index),k=t.slice(i.index+i.length),v=y.length,S=k.length;if(s<v+S)break e;var w=e.slice(0,v),h=e.slice(s-S);if(y!==w||k!==h)break e;var b=t.slice(v,o-S),E=e.slice(v,s-S);return ca(y,b,E,k)}return null}function rs(t,e,n,i){return ho(t,e,n,i,!0)}rs.INSERT=Qt;rs.DELETE=cn;rs.EQUAL=ut;Nd.exports=rs});var Yu=vd((ad,ld)=>{((t,e)=>{typeof define=="function"&&define.amd?define([],e):typeof ld=="object"&&typeof ad<"u"?ld.exports=e():t.Papa=e()})(ad,function t(){var e=typeof self<"u"?self:typeof window<"u"?window:e!==void 0?e:{},n=!e.document&&!!e.postMessage,i=e.IS_PAPA_WORKER||!1,r={},o=0,s={};function l(h){return h.charCodeAt(0)===65279?h.slice(1):h}function d(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(m){var A=x(m);A.chunkSize=parseInt(A.chunkSize),m.step||m.chunk||(A.chunkSize=null),this._handle=new g(A),(this._handle.streamer=this)._config=A}.call(this,h),this.parseChunk=function(m,A){var N=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<N){let P=this._config.newline;P||($=this._config.quoteChar||'"',P=this._handle.guessLineEndings(m,$)),m=[...m.split(P).slice(N)].join(P)}this.isFirstChunk&&k(this._config.beforeFirstChunk)&&($=this._config.beforeFirstChunk(m))!==void 0&&(m=$),this.isFirstChunk=!1,this._halted=!1;var N=this._partialLine+m,$=(this._partialLine="",this._handle.parse(N,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(m=$.meta.cursor,N=(this._finished||(this._partialLine=N.substring(m-this._baseIndex),this._baseIndex=m),$&&$.data&&(this._rowCount+=$.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),i)e.postMessage({results:$,workerId:s.WORKER_ID,finished:N});else if(k(this._config.chunk)&&!A){if(this._config.chunk($,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=$=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat($.data),this._completeResults.errors=this._completeResults.errors.concat($.errors),this._completeResults.meta=$.meta),this._completed||!N||!k(this._config.complete)||$&&$.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),N||$&&$.meta.paused||this._nextChunk(),$}this._halted=!0},this._sendError=function(m){k(this._config.error)?this._config.error(m):i&&this._config.error&&e.postMessage({workerId:s.WORKER_ID,error:m,finished:!1})}}function u(h){var m;(h=h||{}).chunkSize||(h.chunkSize=s.RemoteChunkSize),d.call(this,h),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(A){this._input=A,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(m=new XMLHttpRequest,this._config.withCredentials&&(m.withCredentials=this._config.withCredentials),n||(m.onload=S(this._chunkLoaded,this),m.onerror=S(this._chunkError,this)),m.ontimeout=S(this._chunkTimeout,this),m.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadTimeout&&!n&&(m.timeout=this._config.downloadTimeout),this._config.downloadRequestHeaders){var A,N=this._config.downloadRequestHeaders;for(A in N)m.setRequestHeader(A,N[A])}var $;this._config.chunkSize&&($=this._start+this._config.chunkSize-1,m.setRequestHeader("Range","bytes="+this._start+"-"+$));try{m.send(this._config.downloadRequestBody)}catch(P){this._chunkError(P.message)}n&&m.status===0&&this._chunkError()}},this._chunkLoaded=function(){m.readyState===4&&(m.status<200||400<=m.status?this._chunkError():(this._start+=this._config.chunkSize||m.responseText.length,this._finished=!this._config.chunkSize||this._start>=(A=>(A=A.getResponseHeader("Content-Range"))!==null?parseInt(A.substring(A.lastIndexOf("/")+1)):-1)(m),this.parseChunk(m.responseText)))},this._chunkError=function(A){A=m.statusText||A,this._sendError(new Error(A))},this._chunkTimeout=function(){this._chunkError("Request timed out after "+this._config.downloadTimeout+"ms")}}function c(h){(h=h||{}).chunkSize||(h.chunkSize=s.LocalChunkSize),d.call(this,h);var m,A,N=typeof FileReader<"u";this.stream=function($){this._input=$,A=$.slice||$.webkitSlice||$.mozSlice,N?((m=new FileReader).onload=S(this._chunkLoaded,this),m.onerror=S(this._chunkError,this)):m=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var $=this._input,P=(this._config.chunkSize&&(P=Math.min(this._start+this._config.chunkSize,this._input.size),$=A.call($,this._start,P)),m.readAsText($,this._config.encoding));N||this._chunkLoaded({target:{result:P}})},this._chunkLoaded=function($){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk($.target.result)},this._chunkError=function(){this._sendError(m.error)}}function f(h){var m;d.call(this,h=h||{}),this.stream=function(A){return m=A,this._nextChunk()},this._nextChunk=function(){var A,N;if(!this._finished)return A=this._config.chunkSize,m=A?(N=m.substring(0,A),m.substring(A)):(N=m,""),this._finished=!m,this.parseChunk(N)}}function p(h){d.call(this,h=h||{});var m=[],A=!0,N=!1;this.pause=function(){d.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){d.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function($){this._input=$,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){N&&m.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),m.length?this.parseChunk(m.shift()):A=!0},this._streamData=S(function($){try{m.push(typeof $=="string"?$:$.toString(this._config.encoding)),A&&(A=!1,this._checkIsFinished(),this.parseChunk(m.shift()))}catch(P){this._streamError(P)}},this),this._streamError=S(function($){this._streamCleanUp(),this._sendError($)},this),this._streamEnd=S(function(){this._streamCleanUp(),N=!0,this._streamData("")},this),this._streamCleanUp=S(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function g(h){var m,A,N,$,P=Math.pow(2,53),X=-P,z=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,q=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,Y=this,ve=0,U=0,B=!1,R=!1,O=[],M={data:[],errors:[],meta:{}};function ee(Z){return h.skipEmptyLines==="greedy"?Z.join("").trim()==="":Z.length===1&&Z[0].length===0}function ae(){if(M&&N&&(re("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+s.DefaultDelimiter+"'"),N=!1),h.skipEmptyLines&&(M.data=M.data.filter(function(He){return!ee(He)})),ie()){let He=function(xe){O.push(xe)};var pe=He;if(M)if(Array.isArray(M.data[0])){for(var Z=0;ie()&&Z<M.data.length;Z++)M.data[Z].forEach(He);M.data.splice(0,1)}else M.data.forEach(He)}function oe(He,xe){for(var ke=h.header?{}:[],De=0;De<He.length;De++){var Ie=De,Rt=He[De],Rt=((Me,Je)=>(yt=>(h.dynamicTypingFunction&&h.dynamicTyping[yt]===void 0&&(h.dynamicTyping[yt]=h.dynamicTypingFunction(yt)),(h.dynamicTyping[yt]||h.dynamicTyping)===!0))(Me)?Je==="true"||Je==="TRUE"||Je!=="false"&&Je!=="FALSE"&&((yt=>{if(z.test(yt)&&(yt=parseFloat(yt),X<yt&&yt<P))return 1})(Je)?parseFloat(Je):q.test(Je)?new Date(Je):Je===""?null:Je):Je)(Ie=h.header?De>=O.length?"__parsed_extra":O[De]:Ie,Rt=h.transform?h.transform(Rt,Ie):Rt);Ie==="__parsed_extra"?(ke[Ie]=ke[Ie]||[],ke[Ie].push(Rt)):ke[Ie]=Rt}return h.header&&(De>O.length?re("FieldMismatch","TooManyFields","Too many fields: expected "+O.length+" fields but parsed "+De,U+xe):De<O.length&&re("FieldMismatch","TooFewFields","Too few fields: expected "+O.length+" fields but parsed "+De,U+xe)),ke}var ue;M&&(h.header||h.dynamicTyping||h.transform)&&(ue=1,!M.data.length||Array.isArray(M.data[0])?(M.data=M.data.map(oe),ue=M.data.length):M.data=oe(M.data,0),h.header&&M.meta&&(M.meta.fields=O),U+=ue)}function ie(){return h.header&&O.length===0}function re(Z,oe,ue,pe){Z={type:Z,code:oe,message:ue},pe!==void 0&&(Z.row=pe),M.errors.push(Z)}k(h.step)&&($=h.step,h.step=function(Z){M=Z,ie()?ae():(ae(),M.data.length!==0&&(ve+=Z.data.length,h.preview&&ve>h.preview?A.abort():(M.data=M.data[0],$(M,Y))))}),this.parse=function(Z,oe,ue){var pe=h.quoteChar||'"',pe=(h.newline||(h.newline=this.guessLineEndings(Z,pe)),N=!1,h.delimiter?k(h.delimiter)&&(h.delimiter=h.delimiter(Z),M.meta.delimiter=h.delimiter):((pe=((He,xe,ke,De,Ie)=>{var Rt,Me,Je,yt;Ie=Ie||[",","	","|",";",s.RECORD_SEP,s.UNIT_SEP];for(var mr=0;mr<Ie.length;mr++){for(var Qn,co=Ie[mr],Tt=0,Yn=0,Et=0,Xt=(Je=void 0,new y({comments:De,delimiter:co,newline:xe,preview:10}).parse(He)),pi=0;pi<Xt.data.length;pi++)ke&&ee(Xt.data[pi])?Et++:(Qn=Xt.data[pi].length,Yn+=Qn,Je===void 0?Je=Qn:0<Qn&&(Tt+=Math.abs(Qn-Je),Je=Qn));0<Xt.data.length&&(Yn/=Xt.data.length-Et),1.99<Yn&&(Me===void 0||Tt<Me||Tt===Me&&yt<Yn)&&(Me=Tt,Rt=co,yt=Yn)}return{successful:!!(h.delimiter=Rt),bestDelimiter:Rt}})(Z,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=pe.bestDelimiter:(N=!0,h.delimiter=s.DefaultDelimiter),M.meta.delimiter=h.delimiter),x(h));return pe.header=ie(),h.preview&&h.header&&pe.preview++,m=Z,A=new y(pe),M=A.parse(m,oe,ue),ae(),B?{meta:{paused:!0}}:M||{meta:{paused:!1}}},this.paused=function(){return B},this.pause=function(){B=!0,A.abort(),m=k(h.chunk)?"":m.substring(A.getCharIndex())},this.resume=function(){Y.streamer._halted?(B=!1,Y.streamer.parseChunk(m,!0)):setTimeout(Y.resume,3)},this.aborted=function(){return R},this.abort=function(){R=!0,A.abort(),M.meta.aborted=!0,k(h.complete)&&h.complete(M),m=""},this.guessLineEndings=function(He,pe){He=He.substring(0,1048576);var pe=new RegExp(v(pe)+"([^]*?)"+v(pe),"gm"),ue=(He=He.replace(pe,"")).split("\r"),pe=He.split(`
`),He=1<pe.length&&pe[0].length<ue[0].length;if(ue.length===1||He)return`
`;for(var xe=0,ke=0;ke<ue.length;ke++)ue[ke][0]===`
`&&xe++;return xe>=ue.length/2?`\r
`:"\r"}}function v(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function y(h){var m=(h=h||{}).delimiter,A=h.newline,N=h.comments,$=h.step,P=h.preview,X=h.fastMode,z=null,q=!1,Y=h.quoteChar==null?'"':h.quoteChar,ve=Y;if(h.escapeChar!==void 0&&(ve=h.escapeChar),(typeof m!="string"||-1<s.BAD_DELIMITERS.indexOf(m))&&(m=","),N===m)throw new Error("Comment character same as delimiter");N===!0?N="#":(typeof N!="string"||-1<s.BAD_DELIMITERS.indexOf(N))&&(N=!1),A!==`
`&&A!=="\r"&&A!==`\r
`&&(A=`
`);var U=0,B=!1;this.parse=function(R,O,M){if(typeof R!="string")throw new Error("Input must be a string");var ee=R.length,ae=m.length,ie=A.length,re=N.length,Z=k($),oe=[],ue=[],pe=[],He=U=0;if(!R)return Tt();if(X||X!==!1&&R.indexOf(Y)===-1){for(var xe=R.split(A),ke=0;ke<xe.length;ke++){if(pe=xe[ke],U+=pe.length,ke!==xe.length-1)U+=A.length;else if(M)return Tt();if(!N||pe.substring(0,re)!==N){if(Z){if(oe=[],yt(pe.split(m)),Yn(),B)return Tt()}else yt(pe.split(m));if(P&&P<=ke)return oe=oe.slice(0,P),Tt(!0)}}return Tt()}for(var De=R.indexOf(m,U),Ie=R.indexOf(A,U),Rt=new RegExp(v(ve)+v(Y),"g"),Me=R.indexOf(Y,U);;)if(R[U]===Y)for(Me=U,U++;;){if((Me=R.indexOf(Y,Me+1))===-1)return M||ue.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:oe.length,index:U}),Qn();if(Me===ee-1)return Qn(R.substring(U,Me).replace(Rt,Y));if(Y===ve&&R[Me+1]===ve)Me++;else if(Y===ve||Me===0||R[Me-1]!==ve){De!==-1&&De<Me+1&&(De=R.indexOf(m,Me+1));var Je=mr((Ie=Ie!==-1&&Ie<Me+1?R.indexOf(A,Me+1):Ie)===-1?De:Math.min(De,Ie));if(R.substr(Me+1+Je,ae)===m){pe.push(R.substring(U,Me).replace(Rt,Y)),R[U=Me+1+Je+ae]!==Y&&(Me=R.indexOf(Y,U)),De=R.indexOf(m,U),Ie=R.indexOf(A,U);break}if(Je=mr(Ie),R.substring(Me+1+Je,Me+1+Je+ie)===A){if(pe.push(R.substring(U,Me).replace(Rt,Y)),co(Me+1+Je+ie),De=R.indexOf(m,U),Me=R.indexOf(Y,U),Z&&(Yn(),B))return Tt();if(P&&oe.length>=P)return Tt(!0);break}ue.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:oe.length,index:U}),Me++}}else if(N&&pe.length===0&&R.substring(U,U+re)===N){if(Ie===-1)return Tt();U=Ie+ie,Ie=R.indexOf(A,U),De=R.indexOf(m,U)}else if(De!==-1&&(De<Ie||Ie===-1))pe.push(R.substring(U,De)),U=De+ae,De=R.indexOf(m,U);else{if(Ie===-1)break;if(pe.push(R.substring(U,Ie)),co(Ie+ie),Z&&(Yn(),B))return Tt();if(P&&oe.length>=P)return Tt(!0)}return Qn();function yt(Et){oe.push(Et),He=U}function mr(Et){var Xt=0;return Xt=Et!==-1&&(Et=R.substring(Me+1,Et))&&Et.trim()===""?Et.length:Xt}function Qn(Et){return M||(Et===void 0&&(Et=R.substring(U)),pe.push(Et),U=ee,yt(pe),Z&&Yn()),Tt()}function co(Et){U=Et,yt(pe),pe=[],Ie=R.indexOf(A,U)}function Tt(Et){if(h.header&&!O&&oe.length&&!q){var Xt=oe[0],pi=Object.create(null),la=new Set(Xt);let hd=!1;for(let gr=0;gr<Xt.length;gr++){let Jn=l(Xt[gr]);if(pi[Jn=k(h.transformHeader)?h.transformHeader(Jn,gr):Jn]){let uo,md=pi[Jn];for(;uo=Jn+"_"+md,md++,la.has(uo););la.add(uo),Xt[gr]=uo,pi[Jn]++,hd=!0,(z=z===null?{}:z)[uo]=Jn}else pi[Jn]=1,Xt[gr]=Jn;la.add(Jn)}hd&&console.warn("Duplicate headers found and renamed."),q=!0}return{data:oe,errors:ue,meta:{delimiter:m,linebreak:A,aborted:B,truncated:!!Et,cursor:He+(O||0),renamedHeaders:z}}}function Yn(){$(Tt()),oe=[],ue=[]}},this.abort=function(){B=!0},this.getCharIndex=function(){return U}}function w(h){var m=h.data,A=r[m.workerId],N=!1;if(m.error)A.userError(m.error,m.file);else if(m.results&&m.results.data){var $={abort:function(){N=!0,b(m.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:E,resume:E};if(k(A.userStep)){for(var P=0;P<m.results.data.length&&(A.userStep({data:m.results.data[P],errors:m.results.errors,meta:m.results.meta},$),!N);P++);delete m.results}else k(A.userChunk)&&(A.userChunk(m.results,$,m.file),delete m.results)}m.finished&&!N&&b(m.workerId,m.results)}function b(h,m){var A=r[h];k(A.userComplete)&&A.userComplete(m),A.terminate(),delete r[h]}function E(){throw new Error("Not implemented.")}function x(h){if(typeof h!="object"||h===null)return h;var m,A=Array.isArray(h)?[]:{};for(m in h)A[m]=x(h[m]);return A}function S(h,m){return function(){h.apply(m,arguments)}}function k(h){return typeof h=="function"}return s.parse=function(h,m){var A=(m=m||{}).dynamicTyping||!1;if(k(A)&&(m.dynamicTypingFunction=A,A={}),m.dynamicTyping=A,m.transform=!!k(m.transform)&&m.transform,m.downloadTimeout!==void 0){var A=parseInt(m.downloadTimeout);if(isNaN(A))throw new Error("Config downloadTimeout value ("+m.downloadTimeout+") not parsable by parseInt(val).");m.downloadTimeout=A}if(!m.worker||!s.WORKERS_SUPPORTED)return A=null,s.NODE_STREAM_INPUT,typeof h=="string"?(h=l(h),A=new(m.download?u:f)(m)):h.readable===!0&&k(h.read)&&k(h.on)?A=new p(m):(e.File&&h instanceof File||h instanceof Object)&&(A=new c(m)),A.stream(h);(A=(()=>{var N;return!!s.WORKERS_SUPPORTED&&(N=(()=>{var $=e.URL||e.webkitURL||null,P=t.toString();return s.BLOB_URL||(s.BLOB_URL=$.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",P,")();"],{type:"text/javascript"})))})(),(N=new e.Worker(N)).onmessage=w,N.id=o++,r[N.id]=N)})()).userStep=m.step,A.userChunk=m.chunk,A.userComplete=m.complete,A.userError=m.error,m.step=k(m.step),m.chunk=k(m.chunk),m.complete=k(m.complete),m.error=k(m.error),delete m.worker,A.postMessage({input:h,config:m,workerId:A.id})},s.unparse=function(h,m){var A=!1,N=!0,$=",",P=`\r
`,X='"',z=X+X,q=!1,Y=null,ve=!1,U=((()=>{if(typeof m=="object"){if(typeof m.delimiter!="string"||s.BAD_DELIMITERS.filter(function(O){return m.delimiter.indexOf(O)!==-1}).length||($=m.delimiter),typeof m.quotes!="boolean"&&typeof m.quotes!="function"&&!Array.isArray(m.quotes)||(A=m.quotes),typeof m.skipEmptyLines!="boolean"&&typeof m.skipEmptyLines!="string"||(q=m.skipEmptyLines),typeof m.newline=="string"&&(P=m.newline),typeof m.quoteChar=="string"&&(X=m.quoteChar,z=X+X),typeof m.header=="boolean"&&(N=m.header),Array.isArray(m.columns)){if(m.columns.length===0)throw new Error("Option columns is empty");Y=m.columns}m.escapeChar!==void 0&&(z=m.escapeChar+X),m.escapeFormulae instanceof RegExp?ve=m.escapeFormulae:typeof m.escapeFormulae=="boolean"&&m.escapeFormulae&&(ve=/^[=+\-@\t\r].*$/)}})(),new RegExp(v(X),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return B(null,h,q);if(typeof h[0]=="object")return B(Y||Object.keys(h[0]),h,q)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||Y),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),B(h.fields||[],h.data||[],q);throw new Error("Unable to serialize unrecognized input");function B(O,M,ee){var ae="",ie=(typeof O=="string"&&(O=JSON.parse(O)),typeof M=="string"&&(M=JSON.parse(M)),Array.isArray(O)&&0<O.length),re=!Array.isArray(M[0]);if(ie&&N){for(var Z=0;Z<O.length;Z++)0<Z&&(ae+=$),ae+=R(O[Z],Z);0<M.length&&(ae+=P)}for(var oe=0;oe<M.length;oe++){var ue=(ie?O:M[oe]).length,pe=!1,He=ie?Object.keys(M[oe]).length===0:M[oe].length===0;if(ee&&!ie&&(pe=ee==="greedy"?M[oe].join("").trim()==="":M[oe].length===1&&M[oe][0].length===0),ee==="greedy"&&ie){for(var xe=[],ke=0;ke<ue;ke++){var De=re?O[ke]:ke;xe.push(M[oe][De])}pe=xe.join("").trim()===""}if(!pe){for(var Ie=0;Ie<ue;Ie++){0<Ie&&!He&&(ae+=$);var Rt=ie&&re?O[Ie]:Ie;ae+=R(M[oe][Rt],Ie)}oe<M.length-1&&(!ee||0<ue&&!He)&&(ae+=P)}}return ae}function R(O,M){var ee,ae,ie;return O==null?"":O.constructor===Date?isNaN(O.getTime())?"":O.toISOString():(ie=!1,ve&&typeof O=="string"&&ve.test(O)&&(O="'"+O,ie=!0),ae=(ee=O.toString()).replace(U,z),(ie=ie||A===!0||typeof A=="function"&&A(O,M)||Array.isArray(A)&&A[M]||((re,Z)=>{for(var oe=0;oe<Z.length;oe++)if(-1<re.indexOf(Z[oe]))return!0;return!1})(ae,s.BAD_DELIMITERS)||-1<ae.indexOf($)||-1<ee.indexOf(X)||ae.charAt(0)===" "||ae.charAt(ae.length-1)===" ")?X+ae+X:ae)}},s.RECORD_SEP="",s.UNIT_SEP="",s.BYTE_ORDER_MARK="\uFEFF",s.BAD_DELIMITERS=["\r",`
`,'"',s.BYTE_ORDER_MARK],s.WORKERS_SUPPORTED=!n&&!!e.Worker,s.NODE_STREAM_INPUT=1,s.LocalChunkSize=10485760,s.RemoteChunkSize=5242880,s.DefaultDelimiter=",",s.Parser=y,s.ParserHandle=g,s.NetworkStreamer=u,s.FileStreamer=c,s.StringStreamer=f,s.ReadableStreamStreamer=p,i&&(e.onmessage=function(h){h=h.data,s.WORKER_ID===void 0&&h&&(s.WORKER_ID=h.workerId),typeof h.input=="string"?e.postMessage({workerId:s.WORKER_ID,results:s.parse(h.input,h.config),finished:!0}):(e.File&&h.input instanceof File||h.input instanceof Object)&&(h=s.parse(h.input,h.config))&&e.postMessage({workerId:s.WORKER_ID,results:h,finished:!0})}),(u.prototype=Object.create(d.prototype)).constructor=u,(c.prototype=Object.create(d.prototype)).constructor=c,(f.prototype=Object.create(f.prototype)).constructor=f,(p.prototype=Object.create(d.prototype)).constructor=p,s})});var L={accessToken:GM_getValue("bgmAccessToken")||"",formhash:GM_getValue("bgmFormhash")||"",submitMethod:GM_getValue("bgmSubmitMethod")||"patch",entityType:localStorage.getItem("bgmEntityType")||"subject",csvData:JSON.parse(localStorage.getItem("bgmCsvData")||"null"),csvPersistDenied:!1,currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),totalItems:parseInt(localStorage.getItem("bgmTotalItems")||"0"),processing:!1,paused:!1,currentView:"setup",currentSubjectData:null,currentFieldUpdates:null,currentTagUpdates:null,currentSeriesUpdate:null,currentWcode:null,currentTags:null,currentSeries:null,currentCommitMessage:null,isCommitMessageLocked:localStorage.getItem("bgmIsCommitMessageLocked")==="true"||!1,lockedCommitMessage:localStorage.getItem("bgmLockedCommitMessage")||"",retryCount:JSON.parse(GM_getValue("bgmRetryCount","{}")),currentItemId:null,previousItem:JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),diffViewMode:localStorage.getItem("bgmDiffViewMode")||"split",theme:localStorage.getItem("bgmTheme")||"system"};function Cn(){GM_setValue("bgmAccessToken",L.accessToken),GM_setValue("bgmFormhash",L.formhash),GM_setValue("bgmSubmitMethod",L.submitMethod),localStorage.setItem("bgmEntityType",L.entityType),fa(),localStorage.setItem("bgmCurrentIndex",L.currentIndex.toString()),localStorage.setItem("bgmTotalItems",L.totalItems.toString()),GM_setValue("bgmRetryCount",JSON.stringify(L.retryCount)),localStorage.setItem("bgmIsCommitMessageLocked",L.isCommitMessageLocked.toString()),localStorage.setItem("bgmLockedCommitMessage",L.lockedCommitMessage),L.previousItem&&localStorage.setItem("bgmPreviousItem",JSON.stringify(L.previousItem)),localStorage.setItem("bgmDiffViewMode",L.diffViewMode),localStorage.setItem("bgmTheme",L.theme)}function fa(){if(L.csvPersistDenied)return!1;try{return localStorage.setItem("bgmCsvData",JSON.stringify(L.csvData)),!0}catch{return L.csvPersistDenied=!0,!1}}function Ui(t,e){let n={subject:{wikiPath:`/p1/wiki/subjects/${e}`,historyPath:`/p1/wiki/subjects/${e}/history-summary`,patchBodyKey:"subject",editPagePath:`https://bgm.tv/subject/${e}/edit`},character:{wikiPath:`/p1/wiki/characters/${e}`,historyPath:`/p1/wiki/characters/${e}/history-summary`,patchBodyKey:"character",editPagePath:`https://bgm.tv/character/${e}/edit`},person:{wikiPath:`/p1/wiki/persons/${e}`,historyPath:`/p1/wiki/persons/${e}/history-summary`,patchBodyKey:"person",editPagePath:`https://bgm.tv/person/${e}/edit`}};return n[t]||n.subject}function po(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="block")}function Gi(t,e){let n=document.getElementById("progress-text"),i=document.getElementById("progress-bar");if(n){let o=String(e).length,s=String(t).padStart(o," ");n.textContent=`处理进度: ${s}/${e}`}let r=e>0?t/e*100:0;i&&(i.style.width=`${r}%`)}function _d(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function zi(t){let e=document.getElementById("bgm-loading-overlay"),n=document.getElementById("loading-text");n&&(n.textContent=t),e&&e.classList.add("active")}function Zt(){let t=document.getElementById("bgm-loading-overlay");t&&t.classList.remove("active")}function en(t){let e=document.getElementById("bgm-status-message");e&&(e.classList.remove("show"),e.offsetWidth,e.textContent=t,e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3))}function bd(){let t=document.getElementById("bgm-status-message");t&&t.classList.remove("show")}var Xd=da(ha(),1);var Up={name:"stub",maxLineToIgnoreSyntax:0,setMaxLineToIgnoreSyntax:()=>{},ignoreSyntaxHighlightList:[],setIgnoreSyntaxHighlightList:()=>{},getAST:()=>({children:[]}),processAST:()=>({syntaxFileObject:{},syntaxFileLineNumber:0}),hasRegisteredCurrentLang:()=>!1,getHighlighterEngine:()=>null},vr=Up;var Ar;(function(t){t.None="None",t.Up="Up",t.Down="Down",t.Both="Both",t.Short="Short"})(Ar||(Ar={}));var ba=class{constructor(e,n,i,r,o){this.header=e,this.lines=n,this.unifiedDiffStart=i,this.unifiedDiffEnd=r,this.expansionType=o}equals(e){return this===e?!0:this.header.equals(e.header)&&this.unifiedDiffStart===e.unifiedDiffStart&&this.unifiedDiffEnd===e.unifiedDiffEnd&&this.expansionType===e.expansionType&&this.lines.length===e.lines.length&&this.lines.every((n,i)=>n.equals(e.lines[i]))}},wa=class{constructor(e,n,i,r){this.oldStartLine=e,this.oldLineCount=n,this.newStartLine=i,this.newLineCount=r}toDiffLineRepresentation(){return`@@ -${this.oldStartLine},${this.oldLineCount} +${this.newStartLine},${this.newLineCount} @@`}equals(e){return this.oldStartLine===e.oldStartLine&&this.oldLineCount===e.oldLineCount&&this.newStartLine===e.newStartLine&&this.oldStartLine===e.oldStartLine}};var Tn="--diff-add-content-highlight--",Dn="--diff-del-content-highlight--",et;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(et||(et={}));var Lo=t=>{switch(t){case et.LF:return"␊";case et.CR:return"␍";case et.CRLF:return"␍␊";default:return""}},Cd;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(Cd||(Cd={}));var Zd=1e3,ef=t=>{Zd=t};function $d(t){return t.location+t.length}function Td(t,e,n,i,r){let o=Math.min(e.length,i.length),s=r?$d(e)-1:e.location,l=r?$d(i)-1:i.location,d=r?-1:1,u=0;for(;Math.abs(u)<o&&t[s+u]===n[l+u];)u+=d;return Math.abs(u)}function ls(t){return t.trim().length===0||t.length>=Zd}function tf(t,e){let n=t.text,i=e.text,r=n.slice(-2),o=i.slice(-2),s=r===`\r
`?et.CRLF:r.endsWith("\r")?et.CR:r.endsWith(`
`)?et.LF:et.NULL,l=o===`\r
`?et.CRLF:o.endsWith("\r")?et.CR:o.endsWith(`
`)?et.LF:et.NULL,d=t.noTrailingNewLine!==e.noTrailingNewLine;return s===l&&!d?{addSymbol:void 0,addString:n,delSymbol:void 0,delString:i}:{addSymbol:d?t.noTrailingNewLine?et.NEWLINE:et.NORMAL:s,addString:s===et.CRLF?n.slice(0,-2):s===et.CR||s===et.LF?n.slice(0,-1):n,delSymbol:d?e.noTrailingNewLine?et.NEWLINE:et.NORMAL:l,delString:l===et.CRLF?i.slice(0,-2):l===et.CR||l===et.LF?i.slice(0,-1):i}}function Gp(t,e){let n=t.text,i=e.text,{addString:r,delString:o,addSymbol:s,delSymbol:l}=tf(t,e);if(r===o&&s&&l)return{addRange:{range:{location:r.length,length:n.length-r.length},hasLineChange:!0,newLineSymbol:s},delRange:{range:{location:o.length,length:i.length-o.length},hasLineChange:!0,newLineSymbol:l}};let d={location:0,length:o.length},u={location:0,length:r.length};if(ls(n)||ls(i))return u.length=0,d.length=0,{addRange:{range:u},delRange:{range:d}};let c=Td(o,d,r,u,!1);d={location:d.location+c,length:d.length-c},u={location:u.location+c,length:u.length-c};let f=Td(o,d,r,u,!0);return d.length-=f,u.length-=f,{addRange:{range:u,hasLineChange:(r.slice(0,u.location)+r.slice(u.location+u.length)).trim().length>0},delRange:{range:d,hasLineChange:(o.slice(0,d.location)+o.slice(d.location+d.length)).trim().length>0}}}function zp(t,e){let{addString:n,addSymbol:i,delString:r,delSymbol:o}=tf(t,e);if(ls(n)||ls(r))return{addRange:{range:[],hasLineChange:!!i,newLineSymbol:i},delRange:{range:[],hasLineChange:!!o,newLineSymbol:o}};let s=(0,Xd.default)(r,n,0,!0),l=0,d=0,u=s.filter(f=>f[0]!==-1).map(f=>({type:f[0],str:f[1],startIndex:l,endIndex:l+f[1].length-1,length:(l+=f[1].length,f[1].length)})),c=s.filter(f=>f[0]!==1).map(f=>({type:f[0],str:f[1],startIndex:d,endIndex:d+f[1].length-1,length:(d+=f[1].length,f[1].length)}));return{addRange:{range:u,hasLineChange:u.some(f=>f.type===0&&f.str.trim().length>0),newLineSymbol:i},delRange:{range:c,hasLineChange:u.some(f=>f.type===0&&f.str.trim().length>0),newLineSymbol:o}}}var Fe;(function(t){t[t.Context=0]="Context",t[t.Add=1]="Add",t[t.Delete=2]="Delete",t[t.Hunk=3]="Hunk"})(Fe||(Fe={}));var Pt=class t{constructor(e,n,i,r,o,s=!1,l,d,u,c,f,p,g,v){this.text=e,this.type=n,this.originalLineNumber=i,this.oldLineNumber=r,this.newLineNumber=o,this.noTrailingNewLine=s,this.changes=l,this.diffChanges=d,this._diffChanges=u,this.plainTemplate=c,this.plainTemplateMode=f,this.syntaxTemplate=p,this.syntaxTemplateName=g,this.syntaxTemplateMode=v}withNoTrailingNewLine(e){return new t(this.text,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,e)}isIncludeableLine(){return this.type===Fe.Add||this.type===Fe.Delete}equals(e){return this.text===e.text&&this.type===e.type&&this.originalLineNumber===e.originalLineNumber&&this.oldLineNumber===e.oldLineNumber&&this.newLineNumber===e.newLineNumber&&this.noTrailingNewLine===e.noTrailingNewLine}clone(e){return new t(e,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,this.noTrailingNewLine)}},Zi=t=>t?t.type===Fe.Add||t.type===Fe.Delete:!1,Wp=/["'&<>]/;function Vp(t){let e=""+t,n=Wp.exec(e);if(!n)return e;let i="",r,o,s=0;for(o=n.index;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}s!==o&&(i+=e.slice(s,o)),s=o+1,i+=r}return s!==o?i+e.slice(s,o):i}var Sa=!1,fs=t=>t,Dd=fs,Fd=fs;var Sr=()=>Sa,Nr=t=>Sa&&fs!==Dd?Dd(t):t,Qp=t=>Sa&&fs!==Fd?Fd(t):t,Yp=!1,Jp=()=>Yp;var qp=!0,xa=()=>qp;var Cr=t=>Vp(t).replace(/\n/g,"").replace(/\r/g,""),ko=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="relative")return;let i=t.changes;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Nr:Cr,o=i.range,s=e.slice(0,o.location),l=e.slice(o.location,o.location+o.length),d=e.slice(o.location+o.length),u=l.includes(`
`),c=i.newLineSymbol,f=`<span data-range-start="${o.location}" data-range-end="${o.location+o.length}">`;f+=r(s),f+=`<span data-diff-highlight style="background-color: var(${n==="add"?Tn:Dn});border-radius: 0.2em;">`,f+=u?`${r(l)}<span data-newline-symbol>${Lo(c)}</span>`:r(l),f+="</span>",f+=r(d),f+="</span>",t.plainTemplate=f,t.plainTemplateMode="relative"},Io=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="fast-diff")return;let i=t.diffChanges;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Nr:Cr,o="";i.range.forEach(({type:s,str:l,startIndex:d,endIndex:u},c,f)=>{let p=c===f.length-1;s===0?(o+=`<span>${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight style="background-color: var(${n==="add"?Tn:Dn});border-radius: 0.2em;">${Lo(i.newLineSymbol)}</span>`:"",o+="</span>"):(o+=`<span data-range-start="${d}" data-range-end="${u}">`,o+=`<span data-diff-highlight style="background-color: var(${n==="add"?Tn:Dn});border-radius: 0.2em;">${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight>${Lo(i.newLineSymbol)}</span>`:"",o+="</span></span>")}),t.plainTemplate=o,t.plainTemplateMode="fast-diff"},So=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="relative"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let o=e.changes;if(!o||!o.hasLineChange)return;let s=Sr()?Nr:Cr,l=o.range,d=`<span data-range-start="${l.location}" data-range-end="${l.location+l.length}">`;(r=n?.nodeList)===null||r===void 0||r.forEach(({node:u,wrapper:c})=>{var f,p,g,v,y,w;if(u.endIndex<l.location||l.location+l.length<u.startIndex)d+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(p=((f=c?.properties)===null||f===void 0?void 0:f.className)||[])===null||p===void 0?void 0:p.join(" ")}" style="${((g=c?.properties)===null||g===void 0?void 0:g.style)||""}">${s(u.value)}</span>`;else{let b=l.location-u.startIndex,E=b<0?0:b,x=u.value.slice(0,E),S=u.value.slice(E,b+l.length),k=u.value.slice(b+l.length),h=x.length||l.location===u.startIndex,m=k.length||u.endIndex===l.location+l.length-1,A=S.includes(`
`);d+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(y=((v=c?.properties)===null||v===void 0?void 0:v.className)||[])===null||y===void 0?void 0:y.join(" ")}" style="${((w=c?.properties)===null||w===void 0?void 0:w.style)||""}">${s(x)}<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-top-left-radius: ${h?"0.2em":"0"};border-bottom-left-radius: ${h?"0.2em":"0"};border-top-right-radius: ${m||A?"0.2em":"0"};border-bottom-right-radius: ${m||A?"0.2em":"0"}">${A?`${s(S)}<span data-newline-symbol>${Lo(o.newLineSymbol)}</span>`:s(S)}</span>${s(k)}</span>`}}),d+="</span>",e.syntaxTemplate=d,e.syntaxTemplateMode="relative",e.syntaxTemplateName=t._getHighlighterName()},Md=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r,o,s;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="fast-diff"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let l=e.diffChanges,d=e._diffChanges;if(!l||!l.hasLineChange)return;let u=Sr()?Nr:Cr,c="",f=((r=l?.range)===null||r===void 0?void 0:r.filter(v=>v.type!==0))||[],p=((o=d?.range)===null||o===void 0?void 0:o.filter(v=>v.type!==0))||[],g=0;(s=n?.nodeList)===null||s===void 0||s.forEach(({node:v,wrapper:y},w,b)=>{var E,x,S;c+=`<span data-start="${v.startIndex}" data-end="${v.endIndex}" class="${(x=((E=y?.properties)===null||E===void 0?void 0:E.className)||[])===null||x===void 0?void 0:x.join(" ")}" style="${((S=y?.properties)===null||S===void 0?void 0:S.style)||""}">`;let k=f[g],h=f.length===0&&p.length===0,m=w===b.length-1;for(let A=0;A<v.value.length;A++){let N=v.startIndex+A,$=v.value[A],P=A===v.value.length-1,X=m&&A===v.value.length-1;if(k)if(N<k.startIndex)c+=u($);else if(N===k.startIndex)k.endIndex<=v.endIndex?c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-radius: 0.2em;">`:c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-top-left-radius: 0.2em;border-bottom-left-radius: 0.2em;">`,c+=u($),(P||k.startIndex===k.endIndex)&&(c+="</span>"),k.endIndex===N&&(g++,k=f[g]);else if(N<k.endIndex){if(A===0){let z=k.startIndex>=v.startIndex&&k.endIndex<=v.endIndex,q=k.endIndex<=v.endIndex;c+=z?`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-radius: 0.2em;">`:q?`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`:`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});">`}c+=u($),P&&(c+="</span>")}else N===k.endIndex&&(k.startIndex>=v.startIndex||A===0&&(c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`),c+=u($),c+="</span>",g++,k=f[g]);else c+=u($),h&&X&&l.newLineSymbol&&(c+=`<span data-diff-highlight style="background-color: var(${i==="add"?Tn:Dn});border-radius: 0.2em;">`,c+=`<span data-newline-symbol>${Lo(l.newLineSymbol)}</span></span>`)}c+="</span>"}),e.syntaxTemplate=c,e.syntaxTemplateMode="fast-diff",e.syntaxTemplateName=t._getHighlighterName()},Na=t=>{var e;let n="",i=Sr()?Nr:Cr;return(e=t?.nodeList)===null||e===void 0||e.forEach(({node:r,wrapper:o})=>{var s,l,d;n+=`<span data-start="${r.startIndex}" data-end="${r.endIndex}" class="${(l=((s=o?.properties)===null||s===void 0?void 0:s.className)||[])===null||l===void 0?void 0:l.join(" ")}" style="${((d=o?.properties)===null||d===void 0?void 0:d.style)||""}">${i(r.value)}</span>`}),n},Ca=t=>t?(Sr()?Nr:Cr)(t):"",Kp=40;function Xp(t,e){throw new Error(e)}function Zp(t){var e,n;if(t.length===0)return 0;for(let i=t.length-1;i>=0;i--){let r=t[i];for(let o=r.lines.length-1;o>=0;o--){let s=r.lines[o];if(s.type===Fe.Hunk)continue;let l=(e=s.newLineNumber)!==null&&e!==void 0?e:0,d=(n=s.oldLineNumber)!==null&&n!==void 0?n:0;return l>d?l:d}}return 0}function eh(t,e,n){let i=n===null?1/0:e.oldStartLine-n.header.oldStartLine-n.header.oldLineCount;return t===0?e.oldStartLine>1&&e.newStartLine>1?Ar.Up:Ar.None:i<=Kp?Ar.Short:Ar.Both}var nf=(t,e)=>{let n=[];for(let i=0;i<t;i++)n.push(e(i));return n},Hd=t=>{let e=t.lastIndexOf(".");return t.slice(e+1)},Bd=(t,e,{diffFile:n,getAdditionRaw:i,getDeletionRaw:r,getAdditionSyntax:o,getDeletionSyntax:s})=>{if(t.length===e.length){let l=t.length;for(let d=0;d<l;d++){let u=t[d],c=e[d];if(!u.changes||!c.changes){let p=Pt.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),g=Pt.prototype.clone.call(c,r(c.oldLineNumber)||c.text||""),{addRange:v,delRange:y}=Gp(p,g);u.changes=v,c.changes=y}let f=xa();if(!Jp())f&&(ko({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),ko({diffLine:c,rawLine:r(c.oldLineNumber)||"",operator:"del"}),So({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),So({diffFile:n,diffLine:c,syntaxLine:s(c.oldLineNumber)||null,operator:"del"}));else{let p=Pt.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),g=Pt.prototype.clone.call(c,r(c.oldLineNumber)||c.text||""),{addRange:v,delRange:y}=zp(p,g);u.diffChanges=v,c.diffChanges=y,u._diffChanges=y,c._diffChanges=v,f&&(Io({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),Io({diffLine:c,rawLine:r(c.oldLineNumber)||"",operator:"del"}),Md({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),Md({diffFile:n,diffLine:c,syntaxLine:s(c.oldLineNumber)||null,operator:"del"}))}}}},th=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,nh=/[\u202A-\u202E]|[\u2066-\u2069]/,rf="+",of="-",sf=" ",af="\\",lf=`
`,ih=new Set([rf,of,sf,af,lf]),ya=class{constructor(){Object.defineProperty(this,"__v_skip",{value:!0}),this.reset()}reset(){this.ls=0,this.le=-1,this.text=""}nextLine(){return this.ls=this.le+1,this.ls>=this.text.length?!1:(this.le=this.text.indexOf(`
`,this.ls),this.le===-1&&(this.le=this.text.length),this.ls!==this.le)}readLine(e){return e?this.nextLine()?this.text.substring(this.ls,this.le):null:this.nextLine()?this.text.substring(this.ls+1,this.le+1):this.text.length>this.ls?`
`:null}lineStartsWith(e){return this.text.startsWith(e,this.ls)}lineEndsWith(e){return this.text.endsWith(e,this.le)}peek(){let e=this.le+1;return e<this.text.length?this.text[e]:null}parseDiffHeader(){let e=!1;for(;this.nextLine();){if(this.lineStartsWith("Binary files ")&&this.lineEndsWith("differ"))return{isBinary:!0};if(this.lineStartsWith("---")&&(e=!0),this.lineStartsWith("+++"))return{isBinary:!1}}return null}numberFromGroup(e,n,i=null){let r=e[n];if(!r){if(!i)throw new Error(`Group ${n} missing from regexp match and no defaultValue was provided`);return i}let o=parseInt(r,10);if(isNaN(o))throw new Error(`Could not parse capture group ${n} into number: ${r}`);return o}parseHunkHeader(e){let n=th.exec(e);if(!n)throw new Error("Invalid hunk header format");let i=this.numberFromGroup(n,1),r=this.numberFromGroup(n,2,1),o=this.numberFromGroup(n,3),s=this.numberFromGroup(n,4,1);return new wa(i,r,o,s)}parseLinePrefix(e){return e&&e.length&&ih.has(e[0])?e[0]:null}parseHunk(e,n,i){let r=this.readLine(!0);if(!r)throw new Error("Expected hunk header but reached end of diff");let o=this.parseHunkHeader(r),s=new Array;s.push(new Pt(r,Fe.Hunk,1,null,null));let l,d=o.oldStartLine,u=o.newStartLine,c=e;for(;l=this.parseLinePrefix(this.peek());){let f=this.readLine(!1);if(f===null)throw new Error("Expected unified diff line but reached end of diff");if(l===af){if(f.length<12)throw new Error('Expected "no newline at end of file" marker to be at least 12 bytes long');let g=s.length-1,v=s[g];s[g]=v.withNoTrailingNewLine(!0);continue}c++;let p;if(l===rf)p=new Pt(f,Fe.Add,c,null,u++);else if(l===of)p=new Pt(f,Fe.Delete,c,d++,null);else if(l===sf||l===lf)p=new Pt(f,Fe.Context,c,d++,u++);else return Xp(l,`Unknown DiffLinePrefix: ${l}`);s.push(p)}if(s.length===1)throw new Error("Malformed diff, empty hunk");return new ba(o,s,e,e+s.length-1,eh(n,o,i))}parse(e){this.text=e;try{let n=this.parseDiffHeader(),i=this.le,r=this.text.substring(0,i);if(!n)return{header:r,contents:"",hunks:[],isBinary:!1,maxLineNumber:0,hasHiddenBidiChars:!1};if(n.isBinary)return{header:r,contents:"",hunks:[],isBinary:!0,maxLineNumber:0,hasHiddenBidiChars:!1};let o=new Array,s=0,l=null;for(;this.peek();){let u=this.parseHunk(s,o.length,l);o.push(u),l=u,s+=u.lines.length}let d=this.text.substring(i+1,this.le).replace(/\n\\ No newline at end of file/g,"");return{header:r,contents:d,hunks:o,isBinary:n.isBinary,maxLineNumber:Zp(o),hasHiddenBidiChars:nh.test(e)}}finally{this.reset()}}},rh=new ya;function _(t,e,n,i){if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?i:n==="a"?i.call(t):i?i.value:e.get(t)}function W(t,e,n,i,r){if(i==="m")throw new TypeError("Private method is not writable");if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return i==="a"?r.call(t,n):r?r.value=n:e.set(t,n),n}var ss,wo,Lr,Ea,Aa=class extends Map{constructor(){super(...arguments),ss.add(this),wo.set(this,[]),Lr.set(this,30)}get maxLength(){return _(this,Lr,"f")}setMaxLength(e){W(this,Lr,e,"f"),_(this,ss,"m",Ea).call(this)}set(e,n){return _(this,Lr,"f")<=0?this:this.has(e)?this:(_(this,wo,"f").push(e),_(this,ss,"m",Ea).call(this),super.set(e,n))}};wo=new WeakMap,Lr=new WeakMap,ss=new WeakSet,Ea=function(){for(;_(this,wo,"f").length>_(this,Lr,"f");){let e=_(this,wo,"f").shift();e&&this.delete(e)}};var df,go,oh,ki=new Aa;ki.setMaxLength(50);ki.name="@git-diff-view/core";var ma=new Set,No=class t{static createInstance(e){let n=new t(e?.raw,e?.lang,e?.fileName);return n.ast=e?.ast,n.theme=e?.theme,n.rawFile=e?.rawFile||{},n.plainFile=e?.plainFile||{},n.hasDoRaw=e?.hasDoRaw,n.rawLength=e?.rawLength,n.syntaxFile=e?.syntaxFile||{},n.hasDoSyntax=e?.hasDoSyntax,n.syntaxLength=e?.syntaxLength,n.highlighterName=e?.highlighterName,n.highlighterType=e?.highlighterType,n.maxLineNumber=e?.maxLineNumber,n}constructor(e,n,i){df.add(this),this.raw=e,this.lang=n,this.fileName=i,go.set(this,""),this.rawFile={},this.hasDoRaw=!1,this.syntaxFile={},this.plainFile={},this.hasDoSyntax=!1,this.maxLineNumber=0,this.raw=Qp(e),Object.defineProperty(this,"__v_skip",{value:!0}),this.initId()}initId(){let e="-file--"+Math.random().toString().slice(2);for(;ma.has(e);)e="-file--"+Math.random().toString().slice(2);ma.add(e),W(this,go,e,"f")}getId(){return _(this,go,"f")}clearId(){ma.delete(_(this,go,"f"))}doSyntax({registerHighlighter:e,theme:n}){if(!this.raw)return;let i=e||vr;if(this.rawLength&&this.rawLength>i.maxLineToIgnoreSyntax)return;let r=i;try{i.hasRegisteredCurrentLang(this.lang)||(r=vr)}catch{r=vr}if(this.hasDoSyntax&&r.name===this.highlighterName&&r.type===this.highlighterType&&(this.theme===n||r.type==="class")||(this.ast=r.getAST(this.raw,this.fileName,this.lang,n),this.theme=n,!this.ast))return;let{syntaxFileObject:o,syntaxFileLineNumber:s}=r.processAST(this.ast);xa()&&Object.values(o).forEach(l=>{l.template=Na(l)}),this.syntaxFile=o,this.syntaxLength=s,this.highlighterName=r.name,this.highlighterType=r.type,this.hasDoSyntax=!0}doRaw(){if(!this.raw||this.hasDoRaw)return;let n=this.raw.split(`
`);this.rawLength=n.length,this.maxLineNumber=n.length,this.rawFile={},this.plainFile={};let i=xa();for(let r=0;r<n.length;r++)this.rawFile[r+1]=r<n.length-1?n[r]+`
`:n[r],this.plainFile[r+1]={value:this.rawFile[r+1],template:i?Ca(this.rawFile[r+1]):void 0};this.hasDoRaw=!0}};go=new WeakMap,df=new WeakSet,oh=function(){this.rawLength&&this.syntaxLength&&(this.rawLength!==this.syntaxLength&&console.warn("[@git-diff-view/core] The rawLength does not match the syntaxLength."),Object.values(this.syntaxFile).forEach(({value:e,lineNumber:n})=>{e!==this.rawFile[n]&&console.warn("[@git-diff-view/core] Content mismatch detected at line "+n+": "+e+" !== "+this.rawFile[n])}))};function _r(t,e,n,i,r){let o=t+"--0.1.7--"+n+"--"+e;r&&(o=r+"--0.1.7--"+n+"--"+e);let s=t+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e;if(r&&(s=r+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e),ki.has(o))return ki.get(o);if(ki.has(s)){let d=ki.get(s);if(d?.highlighterType==="class")return d}let l=new No(t,e,i);return ki.set(o,l),l}var cs=ki;var ds;(function(t){t[t.hunk=1]="hunk",t[t.content=2]="content",t[t.widget=3]="widget",t[t.extend=4]="extend"})(ds||(ds={}));var H;(function(t){t[t.old=1]="old",t[t.new=2]="new"})(H||(H={}));var us=t=>{let e=t.splitLineLength,n=[];return nf(e,i=>{let r=t.getSplitLeftLine(i),o=t.getSplitRightLine(i);!r?.isHidden&&!o?.isHidden&&n.push({type:ds.content,index:i,lineNumber:i+1,splitLine:{left:r,right:o}})}),n};var $a=t=>{let e=t.unifiedLineLength,n=[];return nf(e,i=>{let r=t.getUnifiedLine(i);r.isHidden||n.push({type:ds.content,index:i,lineNumber:i+1,unifiedLine:r})}),n},sh=(t,e,n)=>{let i=t.getSplitLineByLineNumber(e,n),r=t.getUnifiedLineByLineNumber(e,n);return{split:!i||i.isHidden,unified:!r||r.isHidden}},Ce,Ke,Xe,Ni,Ci,qn,Kn,Yi,Ji,qi,Ki,Xn,Zn,Fn,Mn,Dt,it,st,qe,at,hi,wr,xr,yr,Er,vo,Qi,_o,xo,yo,Ii,Si,as,Ot,Wi,Vi,bo,mi,ff,cf,La,uf,ah,ka,Ia,Rd,pf,kr,Ir,Eo,Ao,Od,Pd,je=40;var ga=new Set,Xi=class t{static createInstance(e,n){var i,r,o,s,l,d;let u=new t(((i=e?.oldFile)===null||i===void 0?void 0:i.fileName)||"",((r=e?.oldFile)===null||r===void 0?void 0:r.content)||"",((o=e?.newFile)===null||o===void 0?void 0:o.fileName)||"",((s=e?.newFile)===null||s===void 0?void 0:s.content)||"",e?.hunks||[],((l=e?.oldFile)===null||l===void 0?void 0:l.fileLang)||"",((d=e?.newFile)===null||d===void 0?void 0:d.fileLang)||"");return n&&(n.isFullMerge?u._mergeFullBundle(n):u.mergeBundle(n)),u}constructor(e,n,i,r,o,s,l,d){Ce.add(this),this.uuid=d,Ke.set(this,void 0),Xe.set(this,void 0),Ni.set(this,void 0),Ci.set(this,void 0),qn.set(this,void 0),Kn.set(this,void 0),Yi.set(this,void 0),Ji.set(this,void 0),qi.set(this,void 0),Ki.set(this,void 0),Xn.set(this,void 0),Zn.set(this,void 0),Fn.set(this,void 0),Mn.set(this,void 0),Dt.set(this,[]),it.set(this,[]),st.set(this,void 0),qe.set(this,[]),at.set(this,void 0),hi.set(this,[]),wr.set(this,!1),xr.set(this,!1),yr.set(this,!1),Er.set(this,!1),vo.set(this,0),Qi.set(this,!1),_o.set(this,!1),xo.set(this,!1),yo.set(this,!1),Ii.set(this,void 0),Si.set(this,void 0),as.set(this,!1),Ot.set(this,"light"),Wi.set(this,{state:!1}),Vi.set(this,{state:!1}),this._version_="0.1.7",this._oldFileName="",this._oldFileContent="",this._oldFileLang="",this._newFileName="",this._newFileContent="",this._newFileLang="",this._diffList=[],this.diffLineLength=0,this.splitLineLength=0,this.unifiedLineLength=0,this.fileLineLength=0,this.additionLength=0,this.deletionLength=0,this.hasSomeLineCollapsed=!1,bo.set(this,""),mi.set(this,new Map),this.getSplitLeftLine=c=>_(this,Dt,"f")[c],this.getSplitLineByLineNumber=(c,f)=>{var p,g;return f===H.old?(p=_(this,Dt,"f"))===null||p===void 0?void 0:p.find(v=>v.lineNumber===c):(g=_(this,it,"f"))===null||g===void 0?void 0:g.find(v=>v.lineNumber===c)},this.getSplitLineIndexByLineNumber=(c,f)=>{var p,g;return f===H.old?(p=_(this,Dt,"f"))===null||p===void 0?void 0:p.findIndex(v=>v.lineNumber===c):(g=_(this,it,"f"))===null||g===void 0?void 0:g.findIndex(v=>v.lineNumber===c)},this.getSplitRightLine=c=>_(this,it,"f")[c],this.getSplitHunkLine=c=>{var f;return(f=_(this,st,"f"))===null||f===void 0?void 0:f[c]},this.onSplitHunkExpand=(c,f,p=!0)=>{var g,v,y;if(!this.getExpandEnabled())return;let w=(g=_(this,st,"f"))===null||g===void 0?void 0:g[f];if(!(!w||!w.splitInfo)){if(c==="all"){for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.endHiddenIndex;b++){let E=_(this,Dt,"f")[b],x=_(this,it,"f")[b];E?.isHidden&&(E.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,...w.hunkInfo,plainText:w.text,startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(c==="down"){for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.startHiddenIndex+je;b++){let E=_(this,Dt,"f")[b],x=_(this,it,"f")[b];E?.isHidden&&(E.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.isLast?w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je}:w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je,plainText:`@@ -${w.splitInfo.oldStartIndex},${w.splitInfo.oldLength} +${w.splitInfo.newStartIndex},${w.splitInfo.newLength}`}}else if(c==="down-all"){for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.endHiddenIndex;b++){let E=_(this,Dt,"f")[b],x=_(this,it,"f")[b];E?.isHidden&&(E.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(c==="up"){if(w.isLast)return;for(let k=w.splitInfo.endHiddenIndex-je;k<w.splitInfo.endHiddenIndex;k++){let h=_(this,Dt,"f")[k],m=_(this,it,"f")[k];h?.isHidden&&(h.isHidden=!1),m?.isHidden&&(m.isHidden=!1)}let b=w.splitInfo.oldStartIndex-je,E=w.splitInfo.oldLength+je,x=w.splitInfo.newStartIndex-je,S=w.splitInfo.newLength+je;w.splitInfo={...w.splitInfo,endHiddenIndex:w.splitInfo.endHiddenIndex-je,oldStartIndex:b,oldLength:E,newStartIndex:x,newLength:S,plainText:`@@ -${b},${E} +${x},${S}`},(v=_(this,st,"f"))===null||v===void 0||delete v[f],_(this,st,"f")[w.splitInfo.endHiddenIndex]=w}else if(c==="up-all"){if(w.isLast)return;for(let b=w.splitInfo.startHiddenIndex;b<w.splitInfo.endHiddenIndex;b++){let E=_(this,Dt,"f")[b],x=_(this,it,"f")[b];E?.isHidden&&(E.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",endHiddenIndex:w.splitInfo.startHiddenIndex},(y=_(this,st,"f"))===null||y===void 0||delete y[f],_(this,st,"f")[w.splitInfo.endHiddenIndex]=w}p&&this.notifyAll()}},this.getUnifiedLine=c=>_(this,qe,"f")[c],this.getUnifiedLineByLineNumber=(c,f)=>{var p,g;return f===H.old?(p=_(this,qe,"f"))===null||p===void 0?void 0:p.find(v=>v.oldLineNumber===c):(g=_(this,qe,"f"))===null||g===void 0?void 0:g.find(v=>v.newLineNumber===c)},this.getUnifiedLineIndexByLineNumber=(c,f)=>{var p,g;return f===H.old?(p=_(this,qe,"f"))===null||p===void 0?void 0:p.findIndex(v=>v.oldLineNumber===c):(g=_(this,qe,"f"))===null||g===void 0?void 0:g.findIndex(v=>v.newLineNumber===c)},this.getUnifiedHunkLine=c=>{var f;return(f=_(this,at,"f"))===null||f===void 0?void 0:f[c]},this.onUnifiedHunkExpand=(c,f,p=!0)=>{var g,v,y,w;if(!this.getExpandEnabled())return;let b=(g=_(this,at,"f"))===null||g===void 0?void 0:g[f];if(!(!b||!b.unifiedInfo)){if(c==="all"){for(let E=b.unifiedInfo.startHiddenIndex;E<b.unifiedInfo.endHiddenIndex;E++){let x=(v=_(this,qe,"f"))===null||v===void 0?void 0:v[E];x?.isHidden&&(x.isHidden=!1)}b.unifiedInfo={...b.unifiedInfo,...b.hunkInfo,plainText:b.text,startHiddenIndex:b.unifiedInfo.endHiddenIndex}}else if(c==="down"){for(let E=b.unifiedInfo.startHiddenIndex;E<b.unifiedInfo.startHiddenIndex+je;E++){let x=_(this,qe,"f")[E];x?.isHidden&&(x.isHidden=!1)}b.isLast?b.unifiedInfo={...b.unifiedInfo,startHiddenIndex:b.unifiedInfo.startHiddenIndex+je}:b.unifiedInfo={...b.unifiedInfo,startHiddenIndex:b.unifiedInfo.startHiddenIndex+je,plainText:`@@ -${b.unifiedInfo.oldStartIndex},${b.unifiedInfo.oldLength} +${b.unifiedInfo.newStartIndex},${b.unifiedInfo.newLength}`}}else if(c==="down-all"){for(let E=b.unifiedInfo.startHiddenIndex;E<b.unifiedInfo.endHiddenIndex;E++){let x=_(this,qe,"f")[E];x?.isHidden&&(x.isHidden=!1)}b.unifiedInfo={...b.unifiedInfo,plainText:"",startHiddenIndex:b.unifiedInfo.endHiddenIndex}}else if(c==="up"){if(b.isLast)return;for(let h=b.unifiedInfo.endHiddenIndex-je;h<b.unifiedInfo.endHiddenIndex;h++){let m=_(this,qe,"f")[h];m?.isHidden&&(m.isHidden=!1)}let E=b.unifiedInfo.oldStartIndex-je,x=b.unifiedInfo.oldLength+je,S=b.unifiedInfo.newStartIndex-je,k=b.unifiedInfo.newLength+je;b.unifiedInfo={...b.unifiedInfo,endHiddenIndex:b.unifiedInfo.endHiddenIndex-je,oldStartIndex:E,oldLength:x,newStartIndex:S,newLength:k,plainText:`@@ -${E},${x} +${S},${k}`},(y=_(this,at,"f"))===null||y===void 0||delete y[f],_(this,at,"f")[b.unifiedInfo.endHiddenIndex]=b}else if(c==="up-all"){if(b.isLast)return;for(let E=b.unifiedInfo.startHiddenIndex;E<b.unifiedInfo.endHiddenIndex;E++){let x=_(this,qe,"f")[E];x?.isHidden&&(x.isHidden=!1)}b.unifiedInfo={...b.unifiedInfo,plainText:"",endHiddenIndex:b.unifiedInfo.startHiddenIndex},(w=_(this,at,"f"))===null||w===void 0||delete w[f],_(this,at,"f")[b.unifiedInfo.endHiddenIndex]=b}p&&this.notifyAll()}},this.onAllExpand=c=>{this.getExpandEnabled()&&(c==="split"?(Object.keys(_(this,st,"f")||{}).forEach(f=>{this.onSplitHunkExpand("all",+f,!1)}),_(this,Wi,"f").state=!0):(Object.keys(_(this,at,"f")||{}).forEach(f=>{this.onUnifiedHunkExpand("all",+f,!1)}),_(this,Vi,"f").state=!0),this.notifyAll())},this.onAllCollapse=c=>{this.getExpandEnabled()&&(c==="split"?(Object.values(_(this,Dt,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(_(this,it,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(_(this,st,"f")||{}).forEach(f=>{f.splitInfo&&(f.splitInfo={...f.splitInfo,oldStartIndex:f.splitInfo._oldStartIndex,oldLength:f.splitInfo._oldLength,newStartIndex:f.splitInfo._newStartIndex,newLength:f.splitInfo._newLength,startHiddenIndex:f.splitInfo._startHiddenIndex,endHiddenIndex:f.splitInfo._endHiddenIndex,plainText:f.splitInfo._plainText})}),Object.keys(_(this,st,"f")||{}).forEach(f=>{let p=_(this,st,"f")[f];p.splitInfo&&p.splitInfo.endHiddenIndex!==+f&&(delete _(this,st,"f")[f],_(this,st,"f")[p.splitInfo.endHiddenIndex]=p)}),_(this,Wi,"f").state=!1):(Object.values(_(this,qe,"f")||{}).forEach(f=>{!f.isHidden&&f._isHidden&&(f.isHidden=f._isHidden)}),Object.values(_(this,at,"f")||{}).forEach(f=>{f.unifiedInfo&&(f.unifiedInfo={...f.unifiedInfo,oldStartIndex:f.unifiedInfo._oldStartIndex,oldLength:f.unifiedInfo._oldLength,newStartIndex:f.unifiedInfo._newStartIndex,newLength:f.unifiedInfo._newLength,startHiddenIndex:f.unifiedInfo._startHiddenIndex,endHiddenIndex:f.unifiedInfo._endHiddenIndex,plainText:f.unifiedInfo._plainText})}),Object.keys(_(this,at,"f")||{}).forEach(f=>{let p=_(this,at,"f")[f];p.unifiedInfo&&p.unifiedInfo.endHiddenIndex!==+f&&(delete _(this,at,"f")[f],_(this,at,"f")[p.unifiedInfo.endHiddenIndex]=p)}),_(this,Vi,"f").state=!1),this.notifyAll())},this.getOldFileContent=()=>{var c;return(c=_(this,Ke,"f"))===null||c===void 0?void 0:c.raw},this.getNewFileContent=()=>{var c;return(c=_(this,Xe,"f"))===null||c===void 0?void 0:c.raw},this.getOldPlainLine=c=>{var f;return(f=_(this,qi,"f"))===null||f===void 0?void 0:f[c]},this.getOldSyntaxLine=c=>{var f;return(f=_(this,Xn,"f"))===null||f===void 0?void 0:f[c]},this.getNewPlainLine=c=>{var f;return(f=_(this,Ki,"f"))===null||f===void 0?void 0:f[c]},this.getNewSyntaxLine=c=>{var f;return(f=_(this,Zn,"f"))===null||f===void 0?void 0:f[c]},this.subscribe=c=>(_(this,hi,"f").push(c),()=>{W(this,hi,_(this,hi,"f").filter(f=>f!==c),"f")}),this.notifyAll=c=>{var f;W(this,vo,(f=_(this,vo,"f"),f++,f),"f"),_(this,hi,"f").forEach(p=>{c&&p.isSyncExternal||p()}),_(this,mi,"f").forEach((p,g)=>{g.notifyAll(!0)})},this.getUpdateCount=()=>_(this,vo,"f"),this.getExpandEnabled=()=>!_(this,Qi,"f")&&!_(this,_o,"f"),this.getBundle=()=>{let c=_(this,wr,"f"),f=_(this,xr,"f"),p=_(this,yr,"f"),g=_(this,Er,"f"),v=_(this,Yi,"f"),y=_(this,qn,"f"),w=_(this,qi,"f"),b=_(this,Xn,"f"),E=_(this,Fn,"f"),x=_(this,Ji,"f"),S=_(this,Kn,"f"),k=_(this,Ki,"f"),h=_(this,Zn,"f"),m=_(this,Mn,"f"),A=this.splitLineLength,N=this.unifiedLineLength,$=this.fileLineLength,P=this.additionLength,X=this.deletionLength,z=_(this,Qi,"f"),q=_(this,_o,"f"),Y=_(this,Ii,"f"),ve=_(this,Si,"f"),U=this.hasSomeLineCollapsed,B=_(this,Wi,"f"),R=_(this,Vi,"f"),O=_(this,Dt,"f"),M=_(this,it,"f"),ee=_(this,st,"f"),ae=_(this,qe,"f"),ie=_(this,at,"f"),re=this._version_,Z=_(this,Ot,"f");return{hasInitRaw:c,hasInitSyntax:f,hasBuildSplit:p,hasBuildUnified:g,oldFileLines:v,oldFileDiffLines:y,oldFilePlainLines:w,oldFileSyntaxLines:b,oldFilePlaceholderLines:E,newFileLines:x,newFileDiffLines:S,newFilePlainLines:k,newFileSyntaxLines:h,newFilePlaceholderLines:m,splitLineLength:A,unifiedLineLength:N,fileLineLength:$,additionLength:P,deletionLength:X,splitLeftLines:O,splitRightLines:M,splitHunkLines:ee,unifiedLines:ae,unifiedHunkLines:ie,highlighterName:Y,highlighterType:ve,composeByDiff:z,composeByRange:q,hasSomeLineCollapsed:U,hasExpandSplitAll:B,hasExpandUnifiedAll:R,version:re,theme:Z,isFullMerge:!1}},this.mergeBundle=(c,f=!0)=>{W(this,wr,c.hasInitRaw,"f"),W(this,xr,c.hasInitSyntax,"f"),W(this,yr,c.hasBuildSplit,"f"),W(this,Er,c.hasBuildUnified,"f"),W(this,Qi,c.composeByDiff,"f"),W(this,_o,c.composeByRange,"f"),W(this,Ii,c.highlighterName,"f"),W(this,Si,c.highlighterType,"f"),W(this,Yi,c.oldFileLines,"f"),W(this,qn,c.oldFileDiffLines,"f"),W(this,qi,c.oldFilePlainLines,"f"),W(this,Xn,c.oldFileSyntaxLines,"f"),W(this,Fn,c.oldFilePlaceholderLines,"f"),W(this,Ji,c.newFileLines,"f"),W(this,Kn,c.newFileDiffLines,"f"),W(this,Ki,c.newFilePlainLines,"f"),W(this,Zn,c.newFileSyntaxLines,"f"),W(this,Mn,c.newFilePlaceholderLines,"f"),this.splitLineLength=c.splitLineLength,this.unifiedLineLength=c.unifiedLineLength,this.fileLineLength=c.fileLineLength,this.additionLength=c.additionLength,this.deletionLength=c.deletionLength,this.hasSomeLineCollapsed=c.hasSomeLineCollapsed,W(this,Wi,c.hasExpandSplitAll,"f"),W(this,Vi,c.hasExpandUnifiedAll,"f"),W(this,Dt,c.splitLeftLines,"f"),W(this,it,c.splitRightLines,"f"),W(this,st,c.splitHunkLines,"f"),W(this,qe,c.unifiedLines,"f"),W(this,at,c.unifiedHunkLines,"f"),W(this,Ot,c.theme,"f"),W(this,xo,!0,"f"),W(this,as,!0,"f"),f&&this.notifyAll()},this.generateInstanceFromLineNumberRange=(c,f,p=H.new)=>{if(c>=f)return this;let g=this.getSplitLineIndexByLineNumber(c,p),v=this.getSplitLineIndexByLineNumber(f,p),y=this.getUnifiedLineIndexByLineNumber(c,p),w=this.getUnifiedLineIndexByLineNumber(f,p),b=[],E=[],x=[];for(let k=g;k<=v;k++){let h=this.getSplitLeftLine(k),m=this.getSplitRightLine(k);!h?.value&&!m?.value||(b.push({...h,isHidden:!1}),E.push({...m,isHidden:!1}))}for(let k=y;k<=w;k++){let h=this.getUnifiedLine(k);h?.value&&x.push({...h,isHidden:!1})}return t.createInstance({},{...this._getFullBundle(),composeByRange:!0,splitHunkLines:{},splitLeftLines:b,splitRightLines:E,splitLineLength:b.length,unifiedHunkLines:{},unifiedLines:x,unifiedLineLength:x.length})},this._getHighlighterName=()=>_(this,Ii,"f")||"",this._getHighlighterType=()=>_(this,Si,"f")||"",this._getIsPureDiffRender=()=>_(this,Qi,"f"),this._getTheme=()=>_(this,Ot,"f"),this._getIsCloned=()=>_(this,as,"f"),this._addClonedInstance=c=>{let f=()=>{this._notifyOthers(c),this._mergeFullBundle(c._getFullBundle(),!1)};f.isSyncExternal=!0;let p=c.subscribe(f);_(this,mi,"f").set(c,p)},this._notifyOthers=c=>{_(this,mi,"f").forEach((f,p)=>{p!==c&&p.notifyAll(!0)})},this._delClonedInstance=c=>{let f=_(this,mi,"f").get(c);f?.(),_(this,mi,"f").delete(c)},this._getFullBundle=()=>{let c=this.getBundle(),f=_(this,Ke,"f"),p=_(this,Xe,"f"),g=_(this,Ci,"f"),v=_(this,Ni,"f");return{...c,oldFileResult:f,newFileResult:p,diffLines:g,diffListResults:v,isFullMerge:_(this,xo,"f")?_(this,yo,"f"):!0}},this._mergeFullBundle=(c,f=!0)=>{this.mergeBundle(c,f);try{W(this,Ke,c.oldFileResult?No.createInstance(c.oldFileResult):null,"f"),W(this,Xe,c.newFileResult?No.createInstance(c.newFileResult):null,"f"),W(this,Ci,c.diffLines,"f"),W(this,Ni,c.diffListResults,"f"),W(this,yo,c.isFullMerge,"f")}catch{}},this._getAllListener=()=>_(this,hi,"f"),this._destroy=()=>{this.clearId(),_(this,hi,"f").splice(0,_(this,hi,"f").length),_(this,mi,"f").forEach(c=>c()),_(this,mi,"f").clear()},this.clear=()=>{this._destroy(),W(this,Ke,void 0,"f"),W(this,Xe,void 0,"f"),W(this,Ci,void 0,"f"),W(this,Ni,void 0,"f"),W(this,Kn,void 0,"f"),W(this,qn,void 0,"f"),W(this,Ji,void 0,"f"),W(this,Yi,void 0,"f"),W(this,Zn,void 0,"f"),W(this,Xn,void 0,"f"),W(this,st,void 0,"f"),W(this,Dt,[],"f"),W(this,it,[],"f"),W(this,at,void 0,"f"),W(this,qe,[],"f"),W(this,Ot,"light","f")},Object.defineProperty(this,"__v_skip",{value:!0});let u=Array.from(new Set(o));this._oldFileName=e,this._newFileName=i,this._diffList=u,this._oldFileLang=Hd(s||e||l||i)||"txt",this._newFileLang=Hd(l||i||s||e)||"txt",this._oldFileContent=n,this._newFileContent=r,this.initId()}initId(){let e="-diff--"+Math.random().toString().slice(2);for(;ga.has(e);)e="-diff--"+Math.random().toString().slice(2);ga.add(e),W(this,bo,e,"f")}getId(){return _(this,bo,"f")}clearId(){ga.delete(_(this,bo,"f"))}initTheme(e){W(this,Ot,e||_(this,Ot,"f")||"light","f")}initRaw(){var e;_(this,wr,"f")||(_(this,Ce,"m",cf).call(this),_(this,Ce,"m",La).call(this),_(this,Ce,"m",ff).call(this),_(this,Ce,"m",ka).call(this),_(this,Ce,"m",uf).call(this),_(this,Ce,"m",Ia).call(this),W(this,wr,!0,"f"))}initSyntax({registerHighlighter:e}={}){var n,i;if(_(this,xr,"f")&&(!e||e.name===_(this,Ii,"f")&&e.type===_(this,Si,"f"))){W(this,Zn,(n=_(this,Xe,"f"))===null||n===void 0?void 0:n.syntaxFile,"f"),W(this,Xn,(i=_(this,Ke,"f"))===null||i===void 0?void 0:i.syntaxFile,"f");return}_(this,Ce,"m",pf).call(this,{registerHighlighter:e}),_(this,Ce,"m",ka).call(this),W(this,xr,!0,"f")}init(){this.initRaw(),this.initSyntax()}buildSplitDiffLines(){var e,n,i,r,o,s;if(_(this,yr,"f"))return;let l=1,d=1,u=!0,c=1/0,f=((e=_(this,Ke,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=_(this,Xe,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=f||d<=p;){let g=_(this,Ce,"m",kr).call(this,l),v=_(this,Ce,"m",Ir).call(this,d),y=_(this,Ce,"m",Eo).call(this,l),w=_(this,Ce,"m",Ao).call(this,d),b=Pt.prototype.isIncludeableLine.call(g||{}),E=Pt.prototype.isIncludeableLine.call(v||{}),x=_(this,it,"f").length,S=!g&&!v;if(g&&!v){if(g.newLineNumber&&g.newLineNumber>d){d++;continue}(g.newLineNumber===null||g.newLineNumber===void 0)&&d++}if(v&&!g){if(v.oldLineNumber&&v.oldLineNumber>l){l++;continue}(v.oldLineNumber===null||v.oldLineNumber===void 0)&&l++}if(!g&&!y&&!v&&!w)break;if(!g&&!v){if(!((i=_(this,Fn,"f"))===null||i===void 0)&&i[l]&&(!((r=_(this,Mn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!y&&(!((o=_(this,Mn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!w&&(!((s=_(this,Fn,"f"))===null||s===void 0)&&s[l])){l++;continue}}if(b&&E||!b&&!E?(_(this,Dt,"f").push({lineNumber:l++,value:y,diff:g,isHidden:S,_isHidden:S}),_(this,it,"f").push({lineNumber:d++,value:w,diff:v,isHidden:S,_isHidden:S})):b?(_(this,Dt,"f").push({lineNumber:l++,value:y,diff:g,isHidden:S,_isHidden:S}),_(this,it,"f").push({})):E&&(_(this,Dt,"f").push({}),_(this,it,"f").push({lineNumber:d++,value:w,diff:v,isHidden:S,_isHidden:S})),!u&&S&&(c=x),S&&(this.hasSomeLineCollapsed=!0),u=S,g?.prevHunkLine||v?.prevHunkLine){let k=g?.prevHunkLine||v?.prevHunkLine;k&&(k.isFirst?(k.splitInfo={...k.hunkInfo,startHiddenIndex:0,endHiddenIndex:k.hunkInfo.newStartIndex-1,plainText:k.text,_startHiddenIndex:0,_endHiddenIndex:k.hunkInfo.newStartIndex-1,_plainText:k.text},c=1/0):Number.isFinite(c)&&(k.splitInfo={...k.hunkInfo,startHiddenIndex:c,endHiddenIndex:x,plainText:k.text,_startHiddenIndex:c,_endHiddenIndex:x,_plainText:k.text},c=1/0),W(this,st,{..._(this,st,"f"),[x]:k},"f"))}}if(Number.isFinite(c)){let v=new Pt("",Fe.Hunk,null,null,null);v.isLast=!0,v.splitInfo={startHiddenIndex:c,endHiddenIndex:_(this,it,"f").length,_startHiddenIndex:c,_endHiddenIndex:_(this,it,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},W(this,st,{..._(this,st,"f"),[_(this,it,"f").length]:v},"f"),c=1/0}this.splitLineLength=_(this,it,"f").length,W(this,yr,!0,"f"),this.notifyAll()}buildUnifiedDiffLines(){var e,n,i,r,o,s;if(_(this,Er,"f"))return;let l=1,d=1,u=!0,c=1/0,f=((e=_(this,Ke,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=_(this,Xe,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=f||d<=p;){let g=_(this,Ce,"m",Eo).call(this,l),v=_(this,Ce,"m",kr).call(this,l),y=_(this,Ce,"m",Ao).call(this,d),w=_(this,Ce,"m",Ir).call(this,d),b=Pt.prototype.isIncludeableLine.call(v||{}),E=Pt.prototype.isIncludeableLine.call(w||{}),x=_(this,qe,"f").length,S=!v&&!w;if(v&&!w){if(v.newLineNumber&&v.newLineNumber>d){d++;continue}(v.newLineNumber===null||v.newLineNumber===void 0)&&d++}if(w&&!v){if(w.oldLineNumber&&w.oldLineNumber>l){l++;continue}(w.oldLineNumber===null||w.oldLineNumber===void 0)&&l++}if(!g&&!y&&!w&&!v)break;if(!v&&!w){if(!((i=_(this,Fn,"f"))===null||i===void 0)&&i[l]&&(!((r=_(this,Mn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!g&&(!((o=_(this,Mn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!y&&(!((s=_(this,Fn,"f"))===null||s===void 0)&&s[l])){l++;continue}}if(!b&&!E?_(this,qe,"f").push({oldLineNumber:l++,newLineNumber:d++,value:y,diff:w,isHidden:S,_isHidden:S}):b?_(this,qe,"f").push({oldLineNumber:l++,value:g,diff:v,isHidden:S,_isHidden:S}):E&&_(this,qe,"f").push({newLineNumber:d++,value:y,diff:w,isHidden:S,_isHidden:S}),!u&&S&&(c=x),S&&(this.hasSomeLineCollapsed=!0),u=S,v?.prevHunkLine||w?.prevHunkLine){let k=v?.prevHunkLine||w?.prevHunkLine;k&&(k.isFirst?(k.unifiedInfo={...k.hunkInfo,startHiddenIndex:0,endHiddenIndex:k.hunkInfo.newStartIndex-1,plainText:k.text,_startHiddenIndex:0,_endHiddenIndex:k.hunkInfo.newStartIndex-1,_plainText:k.text},c=1/0):Number.isFinite(c)&&(k.unifiedInfo={...k.hunkInfo,startHiddenIndex:c,endHiddenIndex:x,plainText:k.text,_startHiddenIndex:c,_endHiddenIndex:x,_plainText:k.text},c=1/0),W(this,at,{..._(this,at,"f"),[x]:k},"f"))}}if(Number.isFinite(c)){let v=new Pt("",Fe.Hunk,null,null,null);v.isLast=!0,v.unifiedInfo={startHiddenIndex:c,endHiddenIndex:_(this,qe,"f").length,_startHiddenIndex:c,_endHiddenIndex:_(this,qe,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},W(this,at,{..._(this,at,"f"),[_(this,qe,"f").length]:v},"f"),c=1/0}this.unifiedLineLength=_(this,qe,"f").length,W(this,Er,!0,"f"),this.notifyAll()}get hasExpandSplitAll(){return _(this,Wi,"f").state}get hasExpandUnifiedAll(){return _(this,Vi,"f").state}};Ke=new WeakMap,Xe=new WeakMap,Ni=new WeakMap,Ci=new WeakMap,qn=new WeakMap,Kn=new WeakMap,Yi=new WeakMap,Ji=new WeakMap,qi=new WeakMap,Ki=new WeakMap,Xn=new WeakMap,Zn=new WeakMap,Fn=new WeakMap,Mn=new WeakMap,Dt=new WeakMap,it=new WeakMap,st=new WeakMap,qe=new WeakMap,at=new WeakMap,hi=new WeakMap,wr=new WeakMap,xr=new WeakMap,yr=new WeakMap,Er=new WeakMap,vo=new WeakMap,Qi=new WeakMap,_o=new WeakMap,xo=new WeakMap,yo=new WeakMap,Ii=new WeakMap,Si=new WeakMap,as=new WeakMap,Ot=new WeakMap,Wi=new WeakMap,Vi=new WeakMap,bo=new WeakMap,mi=new WeakMap,Ce=new WeakSet,ff=function(){this._diffList&&W(this,Ni,this._diffList.map(e=>rh.parse(e)),"f")},cf=function(){!this._oldFileContent&&!this._newFileContent||(this._oldFileContent&&W(this,Ke,_r(this._oldFileContent,this._oldFileLang,_(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),this._newFileContent&&W(this,Xe,_r(this._newFileContent,this._newFileLang,_(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"))},La=function(){var e,n,i,r,o,s,l,d;(e=_(this,Ke,"f"))===null||e===void 0||e.doRaw(),W(this,Yi,(n=_(this,Ke,"f"))===null||n===void 0?void 0:n.rawFile,"f"),W(this,qi,(i=_(this,Ke,"f"))===null||i===void 0?void 0:i.plainFile,"f"),(r=_(this,Xe,"f"))===null||r===void 0||r.doRaw(),W(this,Ji,(o=_(this,Xe,"f"))===null||o===void 0?void 0:o.rawFile,"f"),W(this,Ki,(s=_(this,Xe,"f"))===null||s===void 0?void 0:s.plainFile,"f"),this.fileLineLength=Math.max(this.fileLineLength,((l=_(this,Ke,"f"))===null||l===void 0?void 0:l.maxLineNumber)||0,((d=_(this,Xe,"f"))===null||d===void 0?void 0:d.maxLineNumber)||0)},uf=function(){if(this._oldFileContent&&this._newFileContent)return;let e={},n={};if(!this._oldFileContent&&!this._newFileContent){let i=1,r=1,o="",s="",l=!1;for(;r<=this.diffLineLength||i<=this.diffLineLength;){let d=r++,u=i++,c=_(this,Ce,"m",kr).call(this,d),f=_(this,Ce,"m",Ir).call(this,u);c?o+=c.text:(o+=`
`,e[d]=!0),f?s+=f.text:(s+=`
`,n[u]=!0),!l&&c&&f&&(l=l||c.noTrailingNewLine!==f.noTrailingNewLine)}if(!l&&o===s)return;this._oldFileContent=o,this._newFileContent=s,W(this,Ke,_r(this._oldFileContent,this._oldFileLang,_(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),W(this,Xe,_r(this._newFileContent,this._newFileLang,_(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"),W(this,Fn,e,"f"),W(this,Mn,n,"f"),W(this,Qi,!0,"f")}else if(_(this,Ke,"f")){let i=1,r=1,o="",s=!1;for(;r<=_(this,Ke,"f").maxLineNumber;){let l=_(this,Ce,"m",Ir).call(this,i++),d=_(this,Ce,"m",kr).call(this,r);l?(o+=l.text,r=l.oldLineNumber?l.oldLineNumber+1:r):(d||(o+=_(this,Ce,"m",Eo).call(this,r)),r++),!s&&l&&d&&(s=s||l.noTrailingNewLine!==d.noTrailingNewLine)}if(!s&&o===this._oldFileContent)return;this._newFileContent=o,W(this,Xe,_r(this._newFileContent,this._newFileLang,_(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f")}else if(_(this,Xe,"f")){let i=1,r=1,o="",s=!1;for(;r<=_(this,Xe,"f").maxLineNumber;){let l=_(this,Ce,"m",kr).call(this,i++),d=_(this,Ce,"m",Ir).call(this,r);l?(o+=l.text,r=l.newLineNumber?l.newLineNumber+1:r):(d||(o+=_(this,Ce,"m",Ao).call(this,r)),r++),!s&&d&&l&&(s=s||d.noTrailingNewLine!==l.noTrailingNewLine)}if(!s&&o===this._newFileContent)return;this._oldFileContent=o,W(this,Ke,_r(this._oldFileContent,this._oldFileLang,_(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f")}_(this,Ce,"m",La).call(this)},ah=function(){var e,n,i,r;for(let o in _(this,qn,"f")||{}){let s=(e=_(this,qn,"f"))===null||e===void 0?void 0:e[o],l=(n=_(this,qi,"f"))===null||n===void 0?void 0:n[o];if((!_(this,Fn,"f")||!_(this,Fn,"f")[o])&&s?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'oldFileContent' and 'diff' at line ${o}. Please verify the 'oldFileContent' is correct.`);break}}for(let o in _(this,Kn,"f")||{}){let s=(i=_(this,Kn,"f"))===null||i===void 0?void 0:i[o],l=(r=_(this,Ki,"f"))===null||r===void 0?void 0:r[o];if((!_(this,Mn,"f")||!_(this,Mn,"f")[o])&&s?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'newFileContent' and 'diff' at line ${o}. Please verify the 'newFileContent' is correct.`);break}}},ka=function(){var e;if(!(!((e=_(this,Ni,"f"))===null||e===void 0)&&e.length))return;let n=c=>_(this,Ce,"m",Ao).call(this,c),i=c=>_(this,Ce,"m",Eo).call(this,c),r=c=>_(this,Ce,"m",Pd).call(this,c),o=c=>_(this,Ce,"m",Od).call(this,c);W(this,Ci,[],"f"),this.additionLength=0,this.deletionLength=0;let s=[];_(this,Ni,"f").forEach(c=>{c.hunks.forEach(p=>{let g=[],v=[];p.lines.forEach(y=>{y.type===Fe.Add?(g.push(y),this.additionLength++):y.type===Fe.Delete?(v.push(y),this.deletionLength++):(Bd(g,v,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o}),g=[],v=[]),s.push(y)}),Bd(g,v,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o})})});let l=null;W(this,Ci,s.map((c,f)=>{var p;let g=c;if(g.index=f,g.isFirst=f===0,g.type===Fe.Hunk){let v=(p=g.text.split("@@"))===null||p===void 0?void 0:p[1].split(" ").filter(Boolean),y=v?.[0]||"",w=v?.[1]||"",[b,E]=y.split(","),[x,S]=w.split(",");g.hunkInfo={oldStartIndex:-Number(b),oldLength:Number(E),newStartIndex:+Number(x),newLength:Number(S),_oldStartIndex:-Number(b),_oldLength:Number(E),_newStartIndex:+Number(x),_newLength:Number(S)},l=g}else if(g.type===Fe.Context){let v=c;l&&(v.prevHunkLine=l,l=null)}else l=null;return g}),"f"),W(this,qn,{},"f"),W(this,Kn,{},"f");let d=-1,u=-1;_(this,Ci,"f").forEach(c=>{c.oldLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,c.oldLineNumber),_(this,qn,"f")[c.oldLineNumber]=c),c.newLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,c.newLineNumber),_(this,Kn,"f")[c.newLineNumber]=c)})},Ia=function(){var e,n,i,r,o,s;W(this,Ii,((e=_(this,Ke,"f"))===null||e===void 0?void 0:e.highlighterName)||((n=_(this,Xe,"f"))===null||n===void 0?void 0:n.highlighterName)||_(this,Ii,"f"),"f"),W(this,Si,((i=_(this,Ke,"f"))===null||i===void 0?void 0:i.highlighterType)||((r=_(this,Xe,"f"))===null||r===void 0?void 0:r.highlighterType)||_(this,Si,"f"),"f"),!((o=_(this,Ke,"f"))===null||o===void 0)&&o.highlighterName&&W(this,Xn,_(this,Ke,"f").syntaxFile,"f"),!((s=_(this,Xe,"f"))===null||s===void 0)&&s.highlighterName&&W(this,Zn,_(this,Xe,"f").syntaxFile,"f")},Rd=function({registerHighlighter:e}){var n,i,r,o;(n=_(this,Ke,"f"))===null||n===void 0||n.doSyntax({registerHighlighter:e,theme:_(this,Ot,"f")}),W(this,Xn,(i=_(this,Ke,"f"))===null||i===void 0?void 0:i.syntaxFile,"f"),(r=_(this,Xe,"f"))===null||r===void 0||r.doSyntax({registerHighlighter:e,theme:_(this,Ot,"f")}),W(this,Zn,(o=_(this,Xe,"f"))===null||o===void 0?void 0:o.syntaxFile,"f")},pf=function({registerHighlighter:e}={}){_(this,xo,"f")&&!_(this,yo,"f")||(_(this,Ce,"m",Rd).call(this,{registerHighlighter:e}),_(this,Ce,"m",Ia).call(this))},kr=function(e){var n;if(e)return(n=_(this,qn,"f"))===null||n===void 0?void 0:n[e]},Ir=function(e){var n;if(e)return(n=_(this,Kn,"f"))===null||n===void 0?void 0:n[e]},Eo=function(e){var n;return(n=_(this,Yi,"f"))===null||n===void 0?void 0:n[e]},Ao=function(e){var n;return(n=_(this,Ji,"f"))===null||n===void 0?void 0:n[e]},Od=function(e){var n;return(n=_(this,Xn,"f"))===null||n===void 0?void 0:n[e]},Pd=function(e){var n;return(n=_(this,Zn,"f"))===null||n===void 0?void 0:n[e]};var hf="diff-multi-select-active";function jd(t){if(!t)return null;let e=t.querySelector("span[data-line-num]");if(!e)return null;let n=e.getAttribute("data-line-num"),i=parseInt(n??"",10);return n!==i.toString()||isNaN(i)?null:i}function lh(t){if(!t)return null;let e=t.closest("[data-side]");return e?e.getAttribute("data-side"):null}function Ud(t){if(!t)return null;let e=t.closest(".diff-line-num");if(!e)return null;let n=e.querySelector("span[data-line-old-num]"),i=e.querySelector("span[data-line-new-num]"),r=n?.getAttribute("data-line-old-num"),o=i?.getAttribute("data-line-new-num"),s=r?parseInt(r,10):void 0,l=o?parseInt(o,10):void 0;return s===void 0&&l===void 0?null:{old:s,new:l}}function Gd(t,e=!1){var n,i,r,o;if(!t)return null;let s=null;if(!e||t.closest(".diff-add-widget-wrapper")){let l=t.closest(".diff-line-new-content"),d=t.closest(".diff-line-old-content");l&&(s=(i=(n=l.parentElement)===null||n===void 0?void 0:n.querySelector(".diff-line-new-num"))!==null&&i!==void 0?i:null),d&&(s=(o=(r=d.parentElement)===null||r===void 0?void 0:r.querySelector(".diff-line-old-num"))!==null&&o!==void 0?o:null)}return s||(s=t.closest(".diff-line-new-num")||t.closest(".diff-line-old-num")),s}function ps(t){let e=Math.min(t.startLineNumber,t.endLineNumber),n=Math.max(t.startLineNumber,t.endLineNumber);return{...t,startLineNumber:e,endLineNumber:n}}var mf=t=>{let e=[];return t.new&&t.new.length&&e.push({side:"new",startLineNumber:Math.min(...t.new),endLineNumber:Math.max(...t.new)}),t.old&&t.old.length&&e.push({side:"old",startLineNumber:Math.min(...t.old),endLineNumber:Math.max(...t.old)}),e},dh=(t,e,n,i)=>{uh(e,n).forEach(o=>{var s,l;if(!o.isHide&&o.index){let d=t.filter(u=>u.getAttribute("data-line")===o.index.toString());if(d.length===2)if(o.isContext)d.forEach(u=>u.querySelectorAll("td").forEach(c=>c.classList.add(i)));else{let u=d.find(c=>c.getAttribute("data-side")===n.side);u?.querySelectorAll("td").forEach(c=>c.classList.add(i))}else o.isContext?(s=d[0])===null||s===void 0||s.querySelectorAll("td").forEach(u=>u.classList.add(i)):(l=d[0])===null||l===void 0||l.querySelectorAll(`td[data-side="${n.side}"]`).forEach(u=>u.classList.add(i))}})};function fh(t,e,n,i={old:[],new:[]},r=hf){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(f=>{var p;return((p=f.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),d=mf(i),c=(e?d.concat(e):d).map(ps);l.forEach(f=>{f.querySelectorAll("td").forEach(g=>g.classList.remove(r))}),c.forEach(f=>{f&&n&&dh(l,n,f,r)})}function ch(t,e,n,i={old:[],new:[]},r=hf){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(f=>{var p;return((p=f.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),d=mf(i),c=(e?d.concat(e):d).map(ps);l.forEach(f=>{let p=f.querySelector(".diff-line-num"),g=f.querySelector(".diff-line-content");if(!p||!g)return;p.classList.remove(r),g.classList.remove(r);let v=p.querySelector("span[data-line-old-num]"),y=p.querySelector("span[data-line-new-num]"),w=v?.getAttribute("data-line-old-num"),b=y?.getAttribute("data-line-new-num"),E=w?parseInt(w,10):void 0,x=b?parseInt(b,10):void 0;c.some(S=>S.side==="old"&&E&&E>=S.startLineNumber&&E<=S.endLineNumber||S.side==="new"&&x&&x>=S.startLineNumber&&x<=S.endLineNumber)&&(p.classList.add(r),g.classList.add(r))})}function uh(t,e){var n;let i=ps(e),r=[],{side:o,startLineNumber:s,endLineNumber:l}=i,d=o==="old"?H.old:H.new;for(let u=s;u<=l;u++){let c=t.getSplitLineByLineNumber(u,d),f=t.getSplitLineIndexByLineNumber(u,d);if(c&&c.lineNumber!==void 0){let p=(n=c.diff)===null||n===void 0?void 0:n.type;r.push({index:f+1,lineNumber:c.lineNumber,value:c.value,isHide:sh(t,u,d).split,isDelete:p===Fe.Delete,isAdd:p===Fe.Add,isContext:p===Fe.Context||p===void 0})}}return r}var $n,br,os,pt,Be,va,_a,ph,zd,Wd,hh,Vd,Qd,Yd,Jd,qd,mo,Kd;br=new WeakMap,os=new WeakMap,pt=new WeakMap,Be=new WeakMap,va=new WeakMap,_a=new WeakMap,ph=new WeakMap,zd=new WeakMap,Wd=new WeakMap,$n=new WeakSet,hh=function(){var e;if(!_(this,br,"f")||_(this,_a,"f"))return;let n=o=>{_(this,pt,"f").isUnifiedMode?_(this,$n,"m",Qd).call(this,o):_(this,$n,"m",Vd).call(this,o)},i=o=>{_(this,pt,"f").isUnifiedMode?_(this,$n,"m",Jd).call(this,o):_(this,$n,"m",Yd).call(this,o)},r=()=>{_(this,$n,"m",qd).call(this)};W(this,_a,{mousedown:n,mouseover:i,mouseup:r},"f"),_(this,br,"f").addEventListener("mousedown",n),_(this,br,"f").addEventListener("mouseover",i),document.addEventListener("mouseup",r),W(this,zd,((e=_(this,os,"f"))===null||e===void 0?void 0:e.subscribe(()=>_(this,Wd,"f").call(this)))||(()=>{}),"f")},Vd=function(e){let n=Gd(e.target,!0);if(!n)return;let i=jd(n);if(i===null)return;let r=lh(n);if(!r)return;_(this,Be,"f").isSelecting=!0,_(this,Be,"f").startInfo={lineNumber:i,side:r};let o={side:r,startLineNumber:i,endLineNumber:i};if(_(this,pt,"f").scopeToHunk){let s=_(this,pt,"f").scopeToHunk(o);s&&(o=s)}_(this,Be,"f").currentRange=o,_(this,$n,"m",mo).call(this),_(this,pt,"f").onSelectionChange(o,{..._(this,Be,"f")})},Qd=function(e){var n;let i=Ud(e.target);if(!i)return;let r=(n=i.new)!==null&&n!==void 0?n:i.old;if(r===void 0)return;let o=i.new!==void 0?"new":"old";_(this,Be,"f").isSelecting=!0,_(this,Be,"f").startInfo={lineNumber:r,side:o};let s={side:o,startLineNumber:r,endLineNumber:r};if(_(this,pt,"f").scopeToHunk){let l=_(this,pt,"f").scopeToHunk(s);l&&(s=l)}_(this,Be,"f").currentRange=s,_(this,$n,"m",mo).call(this),_(this,pt,"f").onSelectionChange(s,{..._(this,Be,"f")})},Yd=function(e){if(!_(this,Be,"f").isSelecting||!_(this,Be,"f").startInfo)return;let n=Gd(e.target);if(!n)return;let i=jd(n);if(i===null)return;let r={side:_(this,Be,"f").startInfo.side,startLineNumber:_(this,Be,"f").startInfo.lineNumber,endLineNumber:i};if(_(this,pt,"f").scopeToHunk){let o=_(this,pt,"f").scopeToHunk(r);o&&(r=o)}_(this,Be,"f").currentRange=r,_(this,$n,"m",mo).call(this),_(this,pt,"f").onSelectionChange(r,{..._(this,Be,"f")})},Jd=function(e){if(!_(this,Be,"f").isSelecting||!_(this,Be,"f").startInfo)return;let n=Ud(e.target);if(!n)return;let i=n[_(this,Be,"f").startInfo.side];if(i===void 0)return;let r={side:_(this,Be,"f").startInfo.side,startLineNumber:_(this,Be,"f").startInfo.lineNumber,endLineNumber:i};if(_(this,pt,"f").scopeToHunk){let o=_(this,pt,"f").scopeToHunk(r);o&&(r=o)}_(this,Be,"f").currentRange=r,_(this,$n,"m",mo).call(this),_(this,pt,"f").onSelectionChange(r,{..._(this,Be,"f")})},qd=function(){if(!_(this,Be,"f").isSelecting||!_(this,Be,"f").currentRange){_(this,$n,"m",Kd).call(this);return}let e=ps(_(this,Be,"f").currentRange);_(this,Be,"f").currentRange=e,_(this,Be,"f").isSelecting=!1;let n=this.getSelectionResult();_(this,pt,"f").onSelectionComplete(n)},mo=function(){_(this,pt,"f").isUnifiedMode?ch(_(this,br,"f"),_(this,Be,"f").currentRange,_(this,os,"f"),_(this,va,"f"),_(this,pt,"f").selectedClassName):fh(_(this,br,"f"),_(this,Be,"f").currentRange,_(this,os,"f"),_(this,va,"f"),_(this,pt,"f").selectedClassName)},Kd=function(){W(this,Be,{isSelecting:!1,startInfo:null,currentRange:null},"f")};var Co=class{diff(e,n,i={}){let r;typeof i=="function"?(r=i,i={}):"callback"in i&&(r=i.callback);let o=this.castInput(e,i),s=this.castInput(n,i),l=this.removeEmpty(this.tokenize(o,i)),d=this.removeEmpty(this.tokenize(s,i));return this.diffWithOptionsObj(l,d,i,r)}diffWithOptionsObj(e,n,i,r){var o;let s=E=>{if(E=this.postProcess(E,i),r){setTimeout(function(){r(E)},0);return}else return E},l=n.length,d=e.length,u=1,c=l+d;i.maxEditLength!=null&&(c=Math.min(c,i.maxEditLength));let f=(o=i.timeout)!==null&&o!==void 0?o:1/0,p=Date.now()+f,g=[{oldPos:-1,lastComponent:void 0}],v=this.extractCommon(g[0],n,e,0,i);if(g[0].oldPos+1>=d&&v+1>=l)return s(this.buildValues(g[0].lastComponent,n,e));let y=-1/0,w=1/0,b=()=>{for(let E=Math.max(y,-u);E<=Math.min(w,u);E+=2){let x,S=g[E-1],k=g[E+1];S&&(g[E-1]=void 0);let h=!1;if(k){let A=k.oldPos-E;h=k&&0<=A&&A<l}let m=S&&S.oldPos+1<d;if(!h&&!m){g[E]=void 0;continue}if(!m||h&&S.oldPos<k.oldPos?x=this.addToPath(k,!0,!1,0,i):x=this.addToPath(S,!1,!0,1,i),v=this.extractCommon(x,n,e,E,i),x.oldPos+1>=d&&v+1>=l)return s(this.buildValues(x.lastComponent,n,e))||!0;g[E]=x,x.oldPos+1>=d&&(w=Math.min(w,E-1)),v+1>=l&&(y=Math.max(y,E+1))}u++};if(r)(function E(){setTimeout(function(){if(u>c||Date.now()>p)return r(void 0);b()||E()},0)})();else for(;u<=c&&Date.now()<=p;){let E=b();if(E)return E}}addToPath(e,n,i,r,o){let s=e.lastComponent;return s&&!o.oneChangePerToken&&s.added===n&&s.removed===i?{oldPos:e.oldPos+r,lastComponent:{count:s.count+1,added:n,removed:i,previousComponent:s.previousComponent}}:{oldPos:e.oldPos+r,lastComponent:{count:1,added:n,removed:i,previousComponent:s}}}extractCommon(e,n,i,r,o){let s=n.length,l=i.length,d=e.oldPos,u=d-r,c=0;for(;u+1<s&&d+1<l&&this.equals(i[d+1],n[u+1],o);)u++,d++,c++,o.oneChangePerToken&&(e.lastComponent={count:1,previousComponent:e.lastComponent,added:!1,removed:!1});return c&&!o.oneChangePerToken&&(e.lastComponent={count:c,previousComponent:e.lastComponent,added:!1,removed:!1}),e.oldPos=d,u}equals(e,n,i){return i.comparator?i.comparator(e,n):e===n||!!i.ignoreCase&&e.toLowerCase()===n.toLowerCase()}removeEmpty(e){let n=[];for(let i=0;i<e.length;i++)e[i]&&n.push(e[i]);return n}castInput(e,n){return e}tokenize(e,n){return Array.from(e)}join(e){return e.join("")}postProcess(e,n){return e}get useLongestToken(){return!1}buildValues(e,n,i){let r=[],o;for(;e;)r.push(e),o=e.previousComponent,delete e.previousComponent,e=o;r.reverse();let s=r.length,l=0,d=0,u=0;for(;l<s;l++){let c=r[l];if(c.removed)c.value=this.join(i.slice(u,u+c.count)),u+=c.count;else{if(!c.added&&this.useLongestToken){let f=n.slice(d,d+c.count);f=f.map(function(p,g){let v=i[u+g];return v.length>p.length?v:p}),c.value=this.join(f)}else c.value=this.join(n.slice(d,d+c.count));d+=c.count,c.added||(u+=c.count)}}return r}};var Ta=class extends Co{constructor(){super(...arguments),this.tokenize=gh}equals(e,n,i){return i.ignoreWhitespace?((!i.newlineIsToken||!e.includes(`
`))&&(e=e.trim()),(!i.newlineIsToken||!n.includes(`
`))&&(n=n.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith(`
`)&&(e=e.slice(0,-1)),n.endsWith(`
`)&&(n=n.slice(0,-1))),super.equals(e,n,i)}},mh=new Ta;function Da(t,e,n){return mh.diff(t,e,n)}function gh(t,e){e.stripTrailingCr&&(t=t.replace(/\r\n/g,`
`));let n=[],i=t.split(/(\n|\r\n)/);i[i.length-1]||i.pop();for(let r=0;r<i.length;r++){let o=i[r];r%2&&!e.newlineIsToken?n[n.length-1]+=o:n.push(o)}return n}var gf={includeIndex:!0,includeUnderline:!0,includeFileHeaders:!0};function Fa(t,e,n,i,r,o,s){let l;s?typeof s=="function"?l={callback:s}:l=s:l={},typeof l.context>"u"&&(l.context=4);let d=l.context;if(l.newlineIsToken)throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(l.callback){let{callback:c}=l;Da(n,i,Object.assign(Object.assign({},l),{callback:f=>{let p=u(f);c(p)}}))}else return u(Da(n,i,l));function u(c){if(!c)return;c.push({value:"",lines:[]});function f(E){return E.map(function(x){return" "+x})}let p=[],g=0,v=0,y=[],w=1,b=1;for(let E=0;E<c.length;E++){let x=c[E],S=x.lines||vh(x.value);if(x.lines=S,x.added||x.removed){if(!g){let k=c[E-1];g=w,v=b,k&&(y=d>0?f(k.lines.slice(-d)):[],g-=y.length,v-=y.length)}for(let k of S)y.push((x.added?"+":"-")+k);x.added?b+=S.length:w+=S.length}else{if(g)if(S.length<=d*2&&E<c.length-2)for(let k of f(S))y.push(k);else{let k=Math.min(S.length,d);for(let m of f(S.slice(0,k)))y.push(m);let h={oldStart:g,oldLines:w-g+k,newStart:v,newLines:b-v+k,lines:y};p.push(h),g=0,v=0,y=[]}w+=S.length,b+=S.length}}for(let E of p)for(let x=0;x<E.lines.length;x++)E.lines[x].endsWith(`
`)?E.lines[x]=E.lines[x].slice(0,-1):(E.lines.splice(x+1,0,"\\ No newline at end of file"),x++);return{oldFileName:t,newFileName:e,oldHeader:r,newHeader:o,hunks:p}}}function hs(t,e){if(e||(e=gf),Array.isArray(t)){if(t.length>1&&!e.includeFileHeaders)throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");return t.map(i=>hs(i,e)).join(`
`)}let n=[];e.includeIndex&&t.oldFileName==t.newFileName&&n.push("Index: "+t.oldFileName),e.includeUnderline&&n.push("==================================================================="),e.includeFileHeaders&&(n.push("--- "+t.oldFileName+(typeof t.oldHeader>"u"?"":"	"+t.oldHeader)),n.push("+++ "+t.newFileName+(typeof t.newHeader>"u"?"":"	"+t.newHeader)));for(let i=0;i<t.hunks.length;i++){let r=t.hunks[i];r.oldLines===0&&(r.oldStart-=1),r.newLines===0&&(r.newStart-=1),n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@");for(let o of r.lines)n.push(o)}return n.join(`
`)+`
`}function Ma(t,e,n,i,r,o,s){if(typeof s=="function"&&(s={callback:s}),s?.callback){let{callback:l}=s;Fa(t,e,n,i,r,o,Object.assign(Object.assign({},s),{callback:d=>{l(d?hs(d,s.headerOptions):void 0)}}))}else{let l=Fa(t,e,n,i,r,o,s);return l?hs(l,s?.headerOptions):void 0}}function vh(t){let e=t.endsWith(`
`),n=t.split(`
`).map(i=>i+`
`);return e?n.pop():n.push(n.pop().slice(0,-1)),n}cs.name="@git-diff-view/file";function vf(t,e,n,i,r,o,s,l){let d=Ma(t,n,e,i,"","",s);return new Xi(t,e,n,i,[d],r,o,l)}var $r;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})($r||($r={}));var jt;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(jt||(jt={}));typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var ei={};var Ue=Symbol("uninitialized"),tn=Symbol("filename");var ms="http://www.w3.org/1999/xhtml",$o="http://www.w3.org/2000/svg",Ha="http://www.w3.org/1998/Math/MathML";var _f=globalThis.process?.env?.NODE_ENV,F=_f&&!_f.toLowerCase().startsWith("prod");var gi=Array.isArray,bf=Array.prototype.indexOf,$i=Array.prototype.includes,Tr=Array.from,Ba=Object.keys,At=Object.defineProperty,un=Object.getOwnPropertyDescriptor,Ra=Object.getOwnPropertyDescriptors,Oa=Object.prototype,wf=Array.prototype,Dr=Object.getPrototypeOf,Pa=Object.isExtensible;var ht=()=>{};function gs(t){for(var e=0;e<t.length;e++)t[e]()}function vs(){var t,e,n=new Promise((i,r)=>{t=i,e=r});return{promise:n,resolve:t,reject:e}}var pn=Symbol("$state"),_s=Symbol("component"),bs=Symbol("legacy props"),xf=Symbol(""),ws=Symbol("proxy path"),xs=Symbol("attributes"),To=Symbol("class"),Do=Symbol("style"),Fo=Symbol("text");var ja=Symbol("hmr anchor"),vi=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Ua=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Fr=3,hn=8;var _i="font-weight: bold",bi="font-weight: normal";function yf(t){F?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${t}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,_i,bi):console.warn("https://svelte.dev/e/await_reactivity_loss")}function Ef(t,e){F?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${t}\` (${e}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,_i,bi):console.warn("https://svelte.dev/e/await_waterfall")}function Af(){F?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,_i,bi):console.warn("https://svelte.dev/e/derived_inert")}function Lf(t,e,n){F?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${t}\` attribute on \`${e}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,_i,bi):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function kf(t){F?console.warn(`%c[svelte] hydration_html_changed
%c${t?`The value of an \`{@html ...}\` block ${t} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,_i,bi):console.warn("https://svelte.dev/e/hydration_html_changed")}function Ti(t){F?console.warn(`%c[svelte] hydration_mismatch
%c${t?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${t}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,_i,bi):console.warn("https://svelte.dev/e/hydration_mismatch")}function If(){F?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,_i,bi):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function ys(t){F?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${t}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,_i,bi):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function Sf(){F?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",_i,bi):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var le=!1;function mt(t){le=t}var _e;function Re(t){if(t===null)throw Ti(),ei;return _e=t}function Lt(){return Re(kt(_e))}function T(t){if(le){if(kt(_e)!==null)throw Ti(),ei;_e=t}}function er(t=1){if(le){for(var e=t,n=_e;e--;)n=kt(n);_e=n}}function ti(t=!0){for(var e=0,n=_e;;){if(n.nodeType===hn){var i=n.data;if(i==="]"){if(e===0)return n;e-=1}else(i==="["||i==="[!"||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(e+=1)}var r=kt(n);t&&n.remove(),n=r}}function Ho(t){if(!t||t.nodeType!==hn)throw Ti(),ei;return t.data}function Es(t){return t===this.v}function Ga(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function As(t){return!Ga(t,this.v)}function Nf(t){if(F){let e=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app — please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${t}"
https://svelte.dev/e/invariant_violation`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invariant_violation")}function Br(t){if(F){let e=new Error(`lifecycle_outside_component
\`${t}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function $f(){if(F){let t=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function Tf(){if(F){let t=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/derived_references_self")}function za(t,e,n){if(F){let i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${t} and ${e}`:`Keyed each block has duplicate key at indexes ${t} and ${e}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function Df(t,e,n){if(F){let i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent — the key for item at index ${t} was \`${e}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_volatile")}function Ff(t){if(F){let e=new Error(`effect_in_teardown
\`${t}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function Mf(){if(F){let t=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function Hf(t){if(F){let e=new Error(`effect_orphan
\`${t}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_orphan")}function Bf(){if(F){let t=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function Rf(){if(F){let t=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydration_failed")}function Of(){if(F){let t=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invalid_snippet")}function Pf(t){if(F){let e=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${t}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function jf(t){if(F){let e=new Error(`rune_outside_svelte
The \`${t}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function Uf(){if(F){let t=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/set_context_after_init")}function Gf(){if(F){let t=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function zf(){if(F){let t=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function Wf(){if(F){let t=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function Vf(){if(F){let t=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var gt=!1,wi=!1,Hn=!1;function Qf(){wi=!0}var Bo=null;function Ut(t,e){return t.label=e,ks(t.v,e),t}function ks(t,e){return t?.[ws]?.(e),t}function Bn(t){let e=new Error,n=wh();return n.length===0?null:(n.unshift(`
`),At(e,"stack",{value:n.join(`
`)}),At(e,"name",{value:t}),e)}function wh(){let t=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let e=new Error().stack;if(Error.stackTraceLimit=t,!e)return[];let n=e.split(`
`),i=[];for(let r=0;r<n.length;r++){let o=n[r],s=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];s.includes("svelte/src/internal")||s.includes("node_modules/.vite")||i.push(o)}}return i}function Jf(t,e){if(!F)throw new Error("invariant(...) was not guarded by if (DEV)");t||Nf(e)}function xh(t){let e=t.p;for(;e!==null&&e.c===null;)e=e.p;return e?.c??null}function Wa(t,e){return t===null&&Br(e),t.c??=new Map(xh(t)||void 0)}var Ae=null;function xi(t){Ae=t}var Rn=null;function Rr(t){Rn=t}var mn=null;function Is(t){mn=t}function Qe(t){return Wa(Ae,"getContext").get(t)}function Ye(t,e){let n=Wa(Ae,"setContext");if(gt){var i=se.f,r=!ge&&(i&32)!==0&&!Ae.i;r||Uf()}return n.set(t,e),e}function de(t,e=!1,n){Ae={p:Ae,i:!1,c:null,e:null,s:t,x:null,r:se,l:wi&&!e?{s:null,u:null,$:[]}:null},F&&(Ae.function=n,mn=n)}function fe(t){var e=Ae,n=e.e;if(n!==null){e.e=null;for(var i of n)Va(i)}return t!==void 0&&(e.x=t),e.i=!0,Ae=e.p,F&&(mn=Ae?.function??null),Ss(t)}function Ss(t={}){return At(t,_s,{value:!0}),t}function ni(){return!wi||Ae!==null&&Ae.l===null}var tr=[];function qf(){var t=tr;tr=[],gs(t)}function It(t){if(tr.length===0&&!nr){var e=tr;queueMicrotask(()=>{e===tr&&qf()})}tr.push(t)}function Kf(){for(;tr.length>0;)qf()}var yh=-7169;function Oe(t,e){t.f=t.f&yh|e}function Or(t){(t.f&512)!==0||t.deps===null?Oe(t,1024):Oe(t,4096)}function Xf(t){if(t!==null)for(let e of t)(e.f&2)===0||(e.f&65536)===0||(e.f^=65536,Xf(e.deps))}function Ns(t,e,n){(t.f&2048)!==0?e.add(t):(t.f&4096)!==0&&n.add(t),Xf(t.deps),Oe(t,1024)}var Zf=!1;function ii(t){var e=ge,n=se;wt(null),xt(null);try{return t()}finally{wt(e),xt(n)}}function Cs(t,e,n,i){let r=ni()?jr:Ur;var o=t.filter(g=>!g.settled),s=e.map(r);if(F&&s.forEach((g,v)=>{g.label=e[v].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,(y,w)=>w)}),n.length===0&&o.length===0){i(s);return}var l=se,d=tc(),u=o.length===1?o[0].promise:o.length>1?Promise.all(o.map(g=>g.promise)):null;function c(g){if((l.f&16384)===0){d();try{i([...s,...g])}catch(v){rn(v,l)}Pr()}}var f=Qa();if(n.length===0){u.then(()=>c([])).finally(f);return}function p(){Promise.all(n.map(g=>Ja(g))).then(c).catch(g=>rn(g,l)).finally(f)}u?u.then(()=>{d(),p(),Pr()}):p()}function tc(){var t=se,e=ge,n=Ae,i=be;if(F)var r=Rn;return function(s=!0){xt(t),wt(e),xi(n),s&&(t.f&16384)===0&&(i?.activate(),i?.apply()),F&&(Ya(null),Rr(r))}}var Lh=!1;function Pr(t=!0){Lh=!1,xt(null),wt(null),xi(null),t&&be?.deactivate(),F&&(Ya(null),Rr(null))}function Qa(){var t=se,e=t.b,n=be,i=!!e?.is_rendered();return e?.update_pending_count(1,n),n.increment(i,t),()=>{e?.update_pending_count(-1,n),n.decrement(i,t)}}var on=null;function Ya(t){on=t}var Po=new Set;function jr(t){var e=2050;se!==null&&(se.f|=524288);let n={ctx:Ae,deps:null,effects:null,equals:Es,f:e,fn:t,reactions:null,rv:0,v:Ue,wv:0,parent:se,ac:null};return F&&Hn&&(n.created=Bn("created at")),n}var Gr=Symbol("obsolete");function Ja(t,e,n){let i=se;i===null&&$f();var r=void 0,o=Vt(Ue);F&&(o.label=e??t.toString());var s=!ge,l=new Set;return rc(()=>{var d=se;F&&(on={effect:d,effect_deps:new Set,warned:!1});var u=vs();r=u.promise;try{Promise.resolve(t()).then(u.resolve,g=>{g!==vi&&u.reject(g)}).finally(Pr)}catch(g){u.reject(g),Pr()}if(F){if(on){if(d.deps!==null)for(let g=0;g<Yt;g+=1)on.effect_deps.add(d.deps[g]);if(St!==null)for(let g=0;g<St.length;g+=1)on.effect_deps.add(St[g])}on=null}var c=be;if(s){if((d.f&32768)!==0)var f=Qa();if(i.b?.is_rendered())c.async_deriveds.get(d)?.reject(Gr);else for(let g of l.values())g.reject(Gr);l.add(u),c.async_deriveds.set(d,u)}let p=(g,v=void 0)=>{F&&(on=null),f?.(),l.delete(u),v!==Gr&&(c.activate(),v?(o.f|=8388608,Pn(o,v)):((o.f&8388608)!==0&&(o.f^=8388608),F&&n!==void 0&&!o.equals(g)&&(Po.add(o),setTimeout(()=>{Po.has(o)&&(d.f&16384)===0&&(Ef(o.label,n),Po.delete(o))})),Pn(o,g)),c.deactivate())};u.promise.then(p,g=>p(null,g||"unknown"))}),zt(()=>{for(let d of l)d.reject(Gr)}),F&&(o.f|=4194304),new Promise(d=>{function u(c){function f(){c===r?d(o):u(r)}c.then(f,f)}u(r)})}function I(t){let e=jr(t);return gt||Ds(e),e}function Ur(t){let e=jr(t);return e.equals=As,e}function nc(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)tt(e[n])}}var qa=[];function jo(t){var e,n=se,i=t.parent;if(!xn&&i!==null&&t.v!==Ue&&(i.f&24576)!==0)return Af(),t.v;if(xt(i),F){let r=sr;$s(new Set);try{$i.call(qa,t)&&Tf(),qa.push(t),t.f&=-65537,nc(t),e=Ts(t)}finally{xt(n),$s(r),qa.pop()}}else try{t.f&=-65537,nc(t),e=Ts(t)}finally{xt(n)}return e}function Ka(t){var e=jo(t);if(!t.equals(e)&&(t.wv=zr(),(!be?.is_fork||t.deps===null)&&(be!==null?(be.capture(t,e,!0),Fi?.capture(t,e,!0)):t.v=e,t.deps===null))){Oe(t,1024);return}xn||(Nt!==null?(Di()||be?.is_fork)&&Nt.set(t,e):Or(t))}function ic(t){if(t.effects!==null)for(let e of t.effects)(e.teardown||e.ac)&&(e.teardown?.(),e.ac!==null&&ii(()=>{e.ac.abort(vi),e.ac=null}),e.fn!==null&&(e.teardown=ht),ar(e,0),Uo(e))}function Xa(t){if(t.effects!==null)for(let e of t.effects)e.teardown&&e.fn!==null&&ri(e)}var Fs=null,Wr=null,be=null,Fi=null,Nt=null,tl=null,nr=!1,Za=!1,lr=null,Go=null,oc=0,el=new Set,Sh=1,gn=class t{id=Sh++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#l=new Set;#o=new Set;#s=0;#i=new Map;#a=null;#r=[];#m=[];#f=new Set;#c=new Set;#u=new Map;#g=new Set;is_fork=!1;#d=!1;constructor(){Wr===null?Fs=Wr=this:(Wr.#n=this,this.#t=Wr),Wr=this}#b(){if(this.is_fork)return!0;for(let i of this.#i.keys()){for(var e=i,n=!1;e.parent!==null;){if(this.#u.has(e)){n=!0;break}e=e.parent}if(!n)return!0}return!1}skip_effect(e){this.#u.has(e)||this.#u.set(e,{d:[],m:[]}),this.#g.delete(e)}unskip_effect(e,n=i=>this.schedule(i)){var i=this.#u.get(e);if(i){this.#u.delete(e);for(var r of i.d)Oe(r,2048),n(r);for(r of i.m)Oe(r,4096),n(r)}this.#g.add(e)}#v(){if(this.#e=!0,oc++>1e3&&(this.#h(),Nh()),F)for(let d of this.current.keys())el.add(d);for(let d of this.#f)this.#c.delete(d),Oe(d,2048),this.schedule(d);for(let d of this.#c)Oe(d,4096),this.schedule(d);let e=this.#r;this.#r=[],this.apply();var n=lr=[],i=[],r=Go=[];for(let d of e)try{this.#w(d,n,i)}catch(u){throw dc(d),this.#b()||this.discard(),u}if(be=null,r.length>0){var o=t.ensure();for(let d of r)o.schedule(d)}if(lr=null,Go=null,this.#b()){this.#p(i),this.#p(n);for(let[d,u]of this.#u)lc(d,u);r.length>0&&be.#v();return}let s=this.#x();if(s){this.#p(i),this.#p(n),s.#y(this);return}this.#f.clear(),this.#c.clear();for(let d of this.#l)d(this);this.#l.clear(),Fi=this,sc(i),sc(n),Fi=null,this.#a?.resolve();var l=be;if(this.#s===0&&(this.#r.length===0||l!==null)&&(this.#h(),gt&&(this.#_(),be=l)),this.#r.length>0)if(l!==null){let d=l;d.#r.push(...this.#r.filter(u=>!d.#r.includes(u)))}else l=this;l!==null&&(En.clear(),l.#v())}#w(e,n,i){e.f^=1024;for(var r=e.first;r!==null;){var o=r.f,s=(o&96)!==0,l=s&&(o&1024)!==0,d=l||(o&8192)!==0||this.#u.has(r);if(!d&&r.fn!==null){s?r.f^=1024:(o&4)!==0?n.push(r):gt&&(o&16777224)!==0?i.push(r):Mi(r)&&((o&16)!==0&&this.#c.add(r),ri(r));var u=r.first;if(u!==null){r=u;continue}}for(;r!==null;){var c=r.next;if(c!==null){r=c;break}r=r.parent}}}#x(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[n,[,i]]of this.current)if(e.current.has(n)&&!i)return e}e=e.#t}return null}#y(e){for(let[i,r]of e.current)!this.previous.has(i)&&e.previous.has(i)&&this.previous.set(i,e.previous.get(i)),this.current.set(i,r);for(let[i,r]of e.async_deriveds){let o=this.async_deriveds.get(i);o&&r.promise.then(o.resolve).catch(o.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#f,e.#c);let n=i=>{var r=i.reactions;if(r!==null&&!((i.f&2)!==0&&(i.f&6144)===0))for(let l of r){var o=l.f;if((o&2)!==0)n(l);else{var s=l;o&4194320&&!this.async_deriveds.has(s)&&(this.#c.delete(s),Oe(s,2048),this.schedule(s))}}};for(let i of this.current.keys())n(i);this.oncommit(()=>e.discard()),e.#h(),be=this,this.#v()}#p(e){for(var n=0;n<e.length;n+=1)Ns(e[n],this.#f,this.#c)}capture(e,n,i=!1){e.v!==Ue&&!this.previous.has(e)&&this.previous.set(e,e.v),(e.f&8388608)===0&&(this.current.set(e,[n,i]),Nt?.set(e,n)),this.is_fork||(e.v=n)}activate(){be=this}deactivate(){be=null,Nt=null}flush(){try{F&&el.clear(),Za=!0,be=this,this.#v()}finally{if(oc=0,tl=null,lr=null,Go=null,Za=!1,be=null,Nt=null,En.clear(),F)for(let e of el)e.updated=null}}discard(){for(let e of this.#o)e(this);this.#o.clear();for(let e of this.async_deriveds.values())e.reject(Gr);this.#h(),this.#a?.resolve()}register_created_effect(e){this.#m.push(e)}#_(){for(let f=Fs;f!==null;f=f.#n){var e=f.id<this.id,n=[];for(let[p,[g,v]]of this.current){if(f.current.has(p)){var i=f.current.get(p)[0];if(e&&g!==i)f.current.set(p,[g,v]);else continue}n.push(p)}if(e)for(let[p,g]of this.async_deriveds){let v=f.async_deriveds.get(p);v&&g.promise.then(v.resolve).catch(v.reject)}var r=[...f.current.keys()].filter(p=>!f.current.get(p)[1]);if(!(!f.#e||r.length===0)){var o=r.filter(p=>!this.current.has(p));if(o.length===0)e&&f.discard();else if(n.length>0){if(F&&!f.#d&&Jf(f.#r.length===0,"Batch has scheduled roots"),e)for(let p of this.#g)f.unskip_effect(p,g=>{(g.f&4194320)!==0?f.schedule(g):f.#p([g])});f.activate();var s=new Set,l=new Map;for(var d of n)ac(d,o,s,l);l=new Map;var u=[...f.current].filter(([p,g])=>{let v=this.current.get(p);return v?v[0]!==g[0]||v[1]!==g[1]:!0}).map(([p])=>p);if(u.length>0)for(let p of this.#m)(p.f&155648)===0&&nl(p,u,l)&&((p.f&4194320)!==0?(Oe(p,2048),f.schedule(p)):f.#f.add(p));if(f.#r.length>0&&!f.#d){f.apply();for(var c of f.#r)f.#w(c,[],[]);f.#r=[]}f.deactivate()}}}}increment(e,n){if(this.#s+=1,e){let i=this.#i.get(n)??0;this.#i.set(n,i+1)}}decrement(e,n){if(this.#s-=1,e){let i=this.#i.get(n)??0;i===1?this.#i.delete(n):this.#i.set(n,i-1)}this.#d||(this.#d=!0,It(()=>{this.#d=!1,this.linked&&this.flush()}))}transfer_effects(e,n){for(let i of e)this.#f.add(i);for(let i of n)this.#c.add(i);e.clear(),n.clear()}oncommit(e){this.#l.add(e)}ondiscard(e){this.#o.add(e)}settled(){return(this.#a??=vs()).promise}static ensure(){if(be===null){let e=be=new t;!Za&&!nr&&It(()=>{e.#e||e.flush()})}return be}apply(){if(!gt||!this.is_fork&&this.#t===null&&this.#n===null){Nt=null;return}Nt=new Map;for(let[n,[i]]of this.current)Nt.set(n,i);for(let n=Fs;n!==null;n=n.#n)if(!(n===this||n.is_fork)){var e=!1;if(n.id<this.id){for(let[i,[,r]]of n.current)if(!r&&this.current.has(i)){e=!0;break}}if(!e)for(let[i,r]of n.previous)Nt.has(i)||Nt.set(i,r)}}schedule(e){if(tl=e,e.b?.is_pending&&(e.f&16777228)!==0&&(e.f&32768)===0){e.b.defer_effect(e);return}for(var n=e;n.parent!==null;){n=n.parent;var i=n.f;if(lr!==null&&n===se&&(gt||(ge===null||(ge.f&2)===0)&&!Zf))return;if((i&96)!==0){if((i&1024)===0)return;n.f^=1024}}this.#r.push(n)}#h(){if(this.linked){var e=this.#t,n=this.#n;e===null?Fs=n:e.#n=n,n===null?Wr=e:n.#t=e,this.linked=!1}}};function Qr(t){var e=nr;nr=!0;try{var n;for(t&&(be!==null&&!be.is_fork&&be.flush(),n=t());;){if(Kf(),be===null)return n;be.flush()}}finally{nr=e}}function Nh(){if(F){var t=new Map;for(let n of be.current.keys())for(let[i,r]of n.updated??[]){var e=t.get(i);e||(e={error:r.error,count:0},t.set(i,e)),e.count+=r.count}for(let n of t.values())n.error&&console.error(n.error)}try{Bf()}catch(n){F&&At(n,"stack",{value:""}),rn(n,tl)}}var yn=null;function sc(t){var e=t.length;if(e!==0){for(var n=0;n<e;){var i=t[n++];if((i.f&24576)===0&&Mi(i)&&(yn=new Set,ri(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&il(i),yn?.size>0)){En.clear();for(let r of yn){if((r.f&24576)!==0)continue;let o=[r],s=r.parent;for(;s!==null;)yn.has(s)&&(yn.delete(s),o.push(s)),s=s.parent;for(let l=o.length-1;l>=0;l--){let d=o[l];(d.f&24576)===0&&ri(d)}}yn.clear()}}yn=null}}function ac(t,e,n,i){if(!n.has(t)&&(n.add(t),t.reactions!==null))for(let r of t.reactions){let o=r.f;(o&2)!==0?ac(r,e,n,i):(o&4194320)!==0&&(o&2048)===0&&nl(r,e,i)&&(Oe(r,2048),zo(r))}}function nl(t,e,n){let i=n.get(t);if(i!==void 0)return i;if(t.deps!==null)for(let r of t.deps){if($i.call(e,r))return!0;if((r.f&2)!==0&&nl(r,e,n))return n.set(r,!0),!0}return n.set(t,!1),!1}function zo(t){be.schedule(t)}function lc(t,e){if(!((t.f&32)!==0&&(t.f&1024)!==0)){(t.f&2048)!==0?e.d.push(t):(t.f&4096)!==0&&e.m.push(t),Oe(t,1024);for(var n=t.first;n!==null;)lc(n,e),n=n.next}}function dc(t){Oe(t,1024);for(var e=t.first;e!==null;)dc(e),e=e.next}var sr=new Set,En=new Map;function $s(t){sr=t}var rl=!1;function cc(){rl=!0}function Vt(t,e){var n={f:0,v:t,reactions:null,equals:Es,rv:0,wv:0};return F&&Hn&&(n.created=e??Bn("created at"),n.updated=null,n.set_during_effect=!1,n.trace=null),n}function ce(t,e){let n=Vt(t,e);return Ds(n),n}function ir(t,e=!1,n=!0){let i=Vt(t);return e||(i.equals=As),wi&&n&&Ae!==null&&Ae.l!==null&&(Ae.l.s??=[]).push(i),i}function ne(t,e,n=!1){ge!==null&&(!Jt||(ge.f&131072)!==0)&&ni()&&(ge.f&4325394)!==0&&(jn===null||!jn.has(t))&&Wf();let i=n?Ee(e):e;return F&&ks(i,t.label),Pn(t,i,Go)}function Pn(t,e,n=null){if(!t.equals(e)){xn?En.set(t,e):En.has(t)||En.set(t,t.v);var i=gn.ensure();if(i.capture(t,e),F){if(Hn||se!==null){t.updated??=new Map;let r=(t.updated.get("")?.count??0)+1;if(t.updated.set("",{error:null,count:r}),Hn||r>5){let o=Bn("updated at");if(o!==null){let s=t.updated.get(o.stack);s||(s={error:o,count:0},t.updated.set(o.stack,s)),s.count++}}}se!==null&&(t.set_during_effect=!0)}if((t.f&2)!==0){let r=t;(t.f&2048)!==0&&jo(r),Nt===null&&Or(r)}t.wv=zr(),uc(t,2048,n),ni()&&se!==null&&(se.f&1024)!==0&&(se.f&96)===0&&(vn===null?pc([t]):vn.push(t)),!i.is_fork&&sr.size>0&&!rl&&Ms()}return e}function Ms(){rl=!1;for(let t of sr){(t.f&1024)!==0&&Oe(t,4096);let e;try{e=Mi(t)}catch{e=!0}e&&ri(t)}sr.clear()}function fr(t){ne(t,t.v+1)}function uc(t,e,n){var i=t.reactions;if(i!==null)for(var r=ni(),o=i.length,s=0;s<o;s++){var l=i[s],d=l.f;if(!(!r&&l===se)){var u=(d&2048)===0;if(u&&Oe(l,e),(d&131072)!==0)sr.add(l);else if((d&2)!==0){var c=l;Nt?.delete(c),(d&65536)===0&&(d&512&&(se===null||(se.f&2097152)===0)&&(l.f|=65536),uc(c,4096,n))}else if(u){var f=l;(d&16)!==0&&yn!==null&&yn.add(f),n!==null?n.push(f):zo(f)}}}}var $h=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Ee(t){if(typeof t!="object"||t===null||pn in t||_s in t)return t;let e=Dr(t);if(e!==Oa&&e!==wf)return t;var n=new Map,i=gi(t),r=ce(0),o=F&&Hn?Bn("created at"):null,s=Hi,l=f=>{if(Hi===s)return f();var p=ge,g=Hi;wt(null),ol(s);var v=f();return wt(p),ol(g),v};i&&(n.set("length",ce(t.length,o)),F&&(t=Dh(t)));var d="";let u=!1;function c(f){if(!u){u=!0,d=f,Ut(r,`${d} version`);for(let[p,g]of n)Ut(g,cr(d,p));u=!1}}return new Proxy(t,{defineProperty(f,p,g){(!("value"in g)||g.configurable===!1||g.enumerable===!1||g.writable===!1)&&Gf();var v=n.get(p);return v===void 0?l(()=>{var y=ce(g.value,o);return n.set(p,y),F&&typeof p=="string"&&Ut(y,cr(d,p)),y}):ne(v,g.value,!0),!0},deleteProperty(f,p){var g=n.get(p);if(g===void 0){if(p in f){let v=l(()=>ce(Ue,o));n.set(p,v),fr(r),F&&Ut(v,cr(d,p))}}else ne(g,Ue),fr(r);return!0},get(f,p,g){if(p===pn)return t;if(F&&p===ws)return c;var v=n.get(p),y=p in f;if(v===void 0&&(!y||un(f,p)?.writable)&&(v=l(()=>{var b=Ee(y?f[p]:Ue),E=ce(b,o);return F&&Ut(E,cr(d,p)),E}),n.set(p,v)),v!==void 0){var w=a(v);return w===Ue?void 0:w}return Reflect.get(f,p,g)},getOwnPropertyDescriptor(f,p){var g=Reflect.getOwnPropertyDescriptor(f,p);if(g&&"value"in g){var v=n.get(p);v&&(g.value=a(v))}else if(g===void 0){var y=n.get(p),w=y?.v;if(y!==void 0&&w!==Ue)return{enumerable:!0,configurable:!0,value:w,writable:!0}}return g},has(f,p){if(p===pn)return!0;var g=n.get(p),v=g!==void 0&&g.v!==Ue||Reflect.has(f,p);if(g!==void 0||se!==null&&(!v||un(f,p)?.writable)){g===void 0&&(g=l(()=>{var w=v?Ee(f[p]):Ue,b=ce(w,o);return F&&Ut(b,cr(d,p)),b}),n.set(p,g));var y=a(g);if(y===Ue)return!1}return v},set(f,p,g,v){var y=n.get(p),w=p in f;if(i&&p==="length")for(var b=g;b<y.v;b+=1){var E=n.get(b+"");E!==void 0?ne(E,Ue):b in f&&(E=l(()=>ce(Ue,o)),n.set(b+"",E),F&&Ut(E,cr(d,b)))}if(y===void 0)(!w||un(f,p)?.writable)&&(y=l(()=>ce(void 0,o)),F&&Ut(y,cr(d,p)),ne(y,Ee(g)),n.set(p,y));else{w=y.v!==Ue;var x=l(()=>Ee(g));ne(y,x)}var S=Reflect.getOwnPropertyDescriptor(f,p);if(S?.set&&S.set.call(v,g),!w){if(i&&typeof p=="string"){var k=n.get("length"),h=Number(p);Number.isInteger(h)&&h>=k.v&&ne(k,h+1)}fr(r)}return!0},ownKeys(f){a(r);var p=Reflect.ownKeys(f).filter(y=>{var w=n.get(y);return w===void 0||w.v!==Ue});for(var[g,v]of n)v.v!==Ue&&!(g in f)&&p.push(g);return p},setPrototypeOf(){zf()}})}function cr(t,e){return typeof e=="symbol"?`${t}[Symbol(${e.description??""})]`:$h.test(e)?`${t}.${e}`:/^\d+$/.test(e)?`${t}[${e}]`:`${t}['${e}']`}function Hs(t){try{if(t!==null&&typeof t=="object"&&pn in t)return t[pn]}catch{}return t}var Th=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Dh(t){return new Proxy(t,{get(e,n,i){var r=Reflect.get(e,n,i);return Th.has(n)?function(...o){cc();var s=r.apply(this,o);return Ms(),s}:r}})}function hc(){let t=Array.prototype,e=Array.__svelte_cleanup;e&&e();let{indexOf:n,lastIndexOf:i,includes:r}=t;t.indexOf=function(o,s){let l=n.call(this,o,s);if(l===-1){for(let d=s??0;d<this.length;d+=1)if(Hs(this[d])===o){ys("array.indexOf(...)");break}}return l},t.lastIndexOf=function(o,s){let l=i.call(this,o,s??this.length-1);if(l===-1){for(let d=0;d<=(s??this.length-1);d+=1)if(Hs(this[d])===o){ys("array.lastIndexOf(...)");break}}return l},t.includes=function(o,s){let l=r.call(this,o,s);if(!l){for(let d=0;d<this.length;d+=1)if(Hs(this[d])===o){ys("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{t.indexOf=n,t.lastIndexOf=i,t.includes=r}}var sl,mc,Wo,gc,vc;function Bs(){if(sl===void 0){sl=window,mc=document,Wo=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;gc=un(e,"firstChild").get,vc=un(e,"nextSibling").get,Pa(t)&&(t[To]=void 0,t[xs]=null,t[Do]=void 0,t.__e=void 0),Pa(n)&&(n[Fo]=void 0),F&&(t.__svelte_meta=null,hc())}}function dt(t=""){return document.createTextNode(t)}function ze(t){return gc.call(t)}function kt(t){return vc.call(t)}function D(t,e){if(!le)return ze(t);var n=ze(_e);if(n===null)n=_e.appendChild(dt());else if(e&&n.nodeType!==Fr){var i=dt();return n?.before(i),Re(i),i}return e&&Os(n),Re(n),n}function te(t,e=!1){if(!le){var n=ze(t);return n instanceof Comment&&n.data===""?kt(n):n}if(e){if(_e?.nodeType!==Fr){var i=dt();return _e?.before(i),Re(i),i}Os(_e)}return _e}function Le(t,e=!1){if(!le)return ze(t);var n=D(t,e);return T(t),n}function J(t,e=1,n=!1){let i=le?_e:t;for(var r;e--;)r=i,i=kt(i);if(!le)return i;if(n){if(i?.nodeType!==Fr){var o=dt();return i===null?r?.after(o):i.before(o),Re(o),o}Os(i)}return Re(i),i}function Oo(t){t.textContent=""}function Rs(){if(!gt||yn!==null)return!1;var t=se.f;return(t&32768)!==0}function Un(t,e,n){return e==null||e===ms?n?document.createElement(t,{is:n}):document.createElement(t):n?document.createElementNS(e,t,{is:n}):document.createElementNS(e,t)}function Os(t){if(t.nodeValue.length<65536)return;let e=t.nextSibling;for(;e!==null&&e.nodeType===Fr;)e.remove(),t.nodeValue+=e.nodeValue,e=t.nextSibling}var al=new WeakMap;function _c(t){var e=se;if(e===null)return ge.f|=8388608,t;if(F&&t instanceof Error&&!al.has(t)&&al.set(t,Fh(t,e)),(e.f&32768)===0&&(e.f&4)===0)throw F&&!e.parent&&t instanceof Error&&bc(t),t;rn(t,e)}function rn(t,e){if(!(e!==null&&(e.f&16384)!==0)){for(;e!==null;){if((e.f&128)!==0&&(e.f&33570816)===0){if((e.f&32768)===0)throw t;try{e.b.error(t);return}catch(n){t=n}}e=e.parent}throw F&&t instanceof Error&&bc(t),t}}function Fh(t,e){let n=un(t,"message");if(!(n&&!n.configurable)){for(var i=Wo?"  ":"	",r=`
${i}in ${e.fn?.name||"<unknown>"}`,o=e.ctx;o!==null;)r+=`
${i}in ${o.function?.[tn].split("/").pop()}`,o=o.p;return{message:t.message+`
${r}
`,stack:t.stack?.split(`
`).filter(s=>!s.includes("svelte/src/internal")).join(`
`)}}}function bc(t){let e=al.get(t);e&&(At(t,"message",{value:e.message}),At(t,"stack",{value:e.stack}))}function xc(t){se===null&&(ge===null&&Hf(t),Mf()),xn&&Ff(t)}function Hh(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function Gn(t,e){var n=se;if(F)for(;n!==null&&(n.f&131072)!==0;)n=n.parent;n!==null&&(n.f&8192)!==0&&(t|=8192);var i={ctx:Ae,deps:null,nodes:null,f:t|2048|512,first:null,fn:e,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};F&&(i.component_function=mn),be?.register_created_effect(i);var r=i;if((t&4)!==0)lr!==null?lr.push(i):gn.ensure().schedule(i);else if(e!==null){try{ri(i)}catch(s){throw tt(i),s}r.deps===null&&r.teardown===null&&r.nodes===null&&r.first===r.last&&(r.f&524288)===0&&(r=r.first,(t&16)!==0&&(t&65536)!==0&&r!==null&&(r.f|=65536))}if(r!==null&&(r.parent=n,n!==null&&Hh(r,n),ge!==null&&(ge.f&2)!==0&&(t&64)===0)){var o=ge;(o.effects??=[]).push(r)}return i}function Di(){return ge!==null&&!Jt}function zt(t){let e=Gn(8,null);return Oe(e,1024),e.teardown=t,e}function ye(t){xc("$effect"),F&&At(t,"name",{value:"$effect"});var e=se.f,n=!ge&&(e&32)!==0&&Ae!==null&&!Ae.i;if(n){var i=Ae;(i.e??=[]).push(t)}else return Va(t)}function Va(t){return Gn(1048580,t)}function fl(t){gn.ensure();let e=Gn(524352,t);return()=>{tt(e)}}function yc(t){gn.ensure();let e=Gn(524352,t);return(n={})=>new Promise(i=>{n.outro?oi(e,()=>{tt(e),i(void 0)}):(tt(e),i(void 0))})}function An(t){return Gn(4,t)}function rc(t){return Gn(4718592,t)}function qt(t,e=0){return Gn(8|e,t)}function K(t,e=[],n=[],i=[]){Cs(i,e,n,r=>{Gn(8,()=>{t(...r.map(a))})})}function ln(t,e=0){var n=Gn(16|e,t);return F&&(n.dev_stack=Rn),n}function cl(t,e=0){var n=Gn(16777216|e,t);return F&&(n.dev_stack=Rn),n}function ft(t){return Gn(524320,t)}function ul(t){var e=t.teardown;if(e!==null){let n=xn,i=ge;ll(!0),wt(null);try{e.call(null)}catch(r){rn(r,t.parent)}finally{ll(n),wt(i)}}}function Uo(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){let r=n.ac;r!==null&&ii(()=>{r.abort(vi)});var i=n.next;(n.f&64)!==0?n.parent=null:tt(n,e),n=i}}function Ec(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&32)===0&&tt(e),e=n}}function tt(t,e=!0){var n=!1;(e||(t.f&262144)!==0)&&t.nodes!==null&&t.nodes.end!==null&&(pl(t.nodes.start,t.nodes.end),n=!0),t.f|=33554432,Uo(t,e&&!n),ar(t,0);var i=t.nodes&&t.nodes.t;if(i!==null)for(let o of i)o.stop();ul(t),t.f^=33554432,t.f|=16384;var r=t.parent;r!==null&&r.first!==null&&il(t),F&&(t.component_function=null),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes=t.ac=t.b=null}function pl(t,e){for(;t!==null;){var n=t===e?null:kt(t);t.remove(),t=n}}function il(t){var e=t.parent,n=t.prev,i=t.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),e!==null&&(e.first===t&&(e.first=i),e.last===t&&(e.last=n))}function oi(t,e,n=!0){var i=[];t.f|=256,Ac(t,i,!0);var r=()=>{n&&tt(t),e&&e()},o=i.length;if(o>0){var s=()=>--o||r();for(var l of i)l.out(s)}else r()}function Ac(t,e,n){if((t.f&8192)===0){t.f^=8192;var i=t.nodes&&t.nodes.t;if(i!==null)for(let l of i)(l.is_global||n)&&e.push(l);for(var r=t.first;r!==null;){var o=r.next;if((r.f&64)===0){var s=(r.f&65536)!==0||(r.f&32)!==0&&(t.f&16)!==0;Ac(r,e,s?n:!1)}r=o}}}function Jr(t){t.f&=-257,Lc(t,!0)}function Lc(t,e){if((t.f&256)===0&&(t.f&8192)!==0){t.f^=8192,(t.f&1024)===0&&(Oe(t,2048),gn.ensure().schedule(t));for(var n=t.first;n!==null;){var i=n.next,r=(n.f&65536)!==0||(n.f&32)!==0;Lc(n,r?e:!1),n=i}var o=t.nodes&&t.nodes.t;if(o!==null)for(let s of o)(s.is_global||e)&&s.in()}}function qr(t,e){if(t.nodes)for(var n=t.nodes.start,i=t.nodes.end;n!==null;){var r=n===i?null:kt(n);e.append(n),n=r}}var kc=null;var Ps=!1,xn=!1;function ll(t){xn=t}var ge=null,Jt=!1;function wt(t){ge=t}var se=null;function xt(t){se=t}var jn=null;function Ds(t){ge!==null&&(!gt||(ge.f&2)!==0)&&(jn??=new Set).add(t)}var St=null,Yt=0,vn=null;function pc(t){vn=t}var Sc=1,ur=0,Hi=ur;function ol(t){Hi=t}function zr(){return++Sc}function Mi(t){var e=t.f;if((e&2048)!==0)return!0;if(e&2&&(t.f&=-65537),(e&4096)!==0){for(var n=t.deps,i=n.length,r=0;r<i;r++){var o=n[r];if(Mi(o)&&Ka(o),o.wv>t.wv)return!0}(e&512)!==0&&Nt===null&&Oe(t,1024)}return!1}function Nc(t,e,n=!0){var i=t.reactions;if(i!==null&&!(!gt&&jn!==null&&jn.has(t)))for(var r=0;r<i.length;r++){var o=i[r];(o.f&2)!==0?Nc(o,e,!1):e===o&&(n?Oe(o,2048):(o.f&1024)!==0&&Oe(o,4096),zo(o))}}function Ts(t){var e=St,n=Yt,i=vn,r=ge,o=jn,s=Ae,l=Jt,d=Hi,u=t.f;St=null,Yt=0,vn=null,ge=(u&96)===0?t:null,jn=null,xi(t.ctx),Jt=!1,Hi=++ur,t.ac!==null&&(ii(()=>{t.ac.abort(vi)}),t.ac=null);try{t.f|=2097152;var c=t.fn,f=c();t.f|=32768;var p=Ic(t);if(ni()&&vn!==null&&!Jt&&p!==null&&(t.f&6146)===0)for(var g=0;g<vn.length;g++)Nc(vn[g],t);if(r!==null&&r!==t){if(ur++,r.deps!==null)for(let v=0;v<n;v+=1)r.deps[v].rv=ur;if(e!==null)for(let v of e)v.rv=ur;vn!==null&&(i===null?i=vn:i.push(...vn))}return(t.f&8388608)!==0&&(t.f^=8388608),f}catch(v){return Ic(t),_c(v)}finally{t.f^=2097152,St=e,Yt=n,vn=i,ge=r,jn=o,xi(s),Jt=l,Hi=d}}function Ic(t){var e=t.deps,n=be?.is_fork;if(St!==null){var i;if(n||ar(t,Yt),e!==null&&Yt>0)for(e.length=Yt+St.length,i=0;i<St.length;i++)e[Yt+i]=St[i];else t.deps=e=St;if(Di()&&(t.f&512)!==0)for(i=Yt;i<e.length;i++)(e[i].reactions??=[]).push(t)}else!n&&e!==null&&Yt<e.length&&(ar(t,Yt),e.length=Yt);return e}function Bh(t,e){let n=e.reactions;if(n!==null){var i=bf.call(n,t);if(i!==-1){var r=n.length-1;r===0?n=e.reactions=null:(n[i]=n[r],n.pop())}}if(n===null&&(e.f&2)!==0&&(St===null||!$i.call(St,e))){var o=e;(o.f&512)!==0&&(o.f^=512,o.f&=-65537),o.v!==Ue&&Or(o),o.ac!==null&&ii(()=>{o.ac.abort(vi),o.ac=null,Oe(o,2048)}),ic(o),ar(o,0)}}function ar(t,e){var n=t.deps;if(n!==null)for(var i=e;i<n.length;i++)Bh(t,n[i])}function ri(t){var e=t.f;if((e&16384)===0){Oe(t,1024);var n=se,i=Ps;if(se=t,Ps=(e&96)===0,F){var r=mn;Is(t.component_function);var o=Rn;Rr(t.dev_stack??Rn)}try{(e&16777232)!==0?Ec(t):Uo(t),ul(t);var s=Ts(t);if(t.teardown=typeof s=="function"?s:null,t.wv=Sc,F&&Hn&&(t.f&2048)!==0&&t.deps!==null)for(var l of t.deps)l.set_during_effect&&(l.wv=zr(),l.set_during_effect=!1)}finally{Ps=i,se=n,F&&(Is(r),Rr(o))}}}function a(t){var e=t.f,n=(e&2)!==0;if(kc?.add(t),ge!==null&&!Jt){var i=se!==null&&(se.f&16384)!==0;if(!i&&(jn===null||!jn.has(t))){var r=ge.deps;if((ge.f&2097152)!==0)t.rv<ur&&(t.rv=ur,St===null&&r!==null&&r[Yt]===t?Yt++:St===null?St=[t]:St.push(t));else{ge.deps??=[],$i.call(ge.deps,t)||ge.deps.push(t);var o=t.reactions;o===null?t.reactions=[ge]:$i.call(o,ge)||o.push(ge)}}}if(F){if(!Jt&&on&&be===null&&Fi===null&&!on.warned&&(on.effect.f&2097152)===0&&!on.effect_deps.has(t)){on.warned=!0,yf(t.label);var s=Bn("traced at");s&&console.warn(s)}if(Po.delete(t),Hn&&!Jt&&Bo!==null&&ge!==null&&Bo.reaction===ge){if(t.trace)t.trace();else if(s=Bn("traced at"),s){var l=Bo.entries.get(t);l===void 0&&(l={traces:[]},Bo.entries.set(t,l));var d=l.traces[l.traces.length-1];s.stack!==d?.stack&&l.traces.push(s)}}}if(xn&&En.has(t))return En.get(t);if(n){var u=t;if(xn){var c=u.v;return((u.f&1024)===0&&u.reactions!==null||$c(u))&&(c=jo(u)),En.set(u,c),c}var f=(u.f&512)===0&&!Jt&&ge!==null&&(Ps||(ge.f&512)!==0),p=(u.f&32768)===0;Mi(u)&&(f&&(u.f|=512),Ka(u)),f&&!p&&(Xa(u),Cc(u))}if(Nt?.has(t))return Nt.get(t);if((t.f&8388608)!==0)throw t.v;return t.v}function Cc(t){if(t.f|=512,t.deps!==null)for(let e of t.deps)(e.reactions??=[]).push(t),(e.f&2)!==0&&(e.f&512)===0&&(Xa(e),Cc(e))}function $c(t){if(t.v===Ue)return!0;if(t.deps===null)return!1;for(let e of t.deps)if(En.has(e)||(e.f&2)!==0&&$c(e))return!0;return!1}function Ze(t){var e=Jt;try{return Jt=!0,t()}finally{Jt=e}}var Vo=Symbol("events"),gl=new Set,js=new Set;function we(t,e,n){(e[Vo]??={})[t]=n}function ot(t){for(var e=0;e<t.length;e++)gl.add(t[e]);for(var n of js)n(t)}var hl=null,ml=!1;function vl(t){var e=this,n=e.ownerDocument,i=t.type,r=t.composedPath?.()||[],o=r[0]||t.target;hl=t,ml||(ml=!0,setTimeout(()=>{ml=!1,hl=null}));var s=0,l=hl===t&&t[Vo];if(l){var d=r.indexOf(l);if(d!==-1&&(e===document||e===window)){t[Vo]=e;return}var u=r.indexOf(e);if(u===-1)return;d<=u&&(s=d)}if(o=r[s]||t.target,o!==e){At(t,"currentTarget",{configurable:!0,get(){return o||n}});var c=ge,f=se;wt(null),xt(null);try{for(var p,g=[];o!==null&&o!==e;){try{var v=o[Vo]?.[i];v!=null&&(!o.disabled||t.target===o)&&v.call(o,t)}catch(y){p?g.push(y):p=y}if(t.cancelBubble)break;s++,o=s<r.length?r[s]:null}if(p){for(let y of g)queueMicrotask(()=>{throw y});throw p}}finally{t[Vo]=e,delete t.currentTarget,wt(c),xt(f)}}}var Rh=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:t=>t});function Tc(t){return Rh?.createHTML(t)??t}function Us(t){var e=Un("template");return e.innerHTML=Tc(t.replaceAll("<!>","<!---->")),e.content}function Ht(t,e){var n=se;n.nodes===null&&(n.nodes={start:t,end:e,a:null,t:null})}function j(t,e){var n=(e&1)!==0,i=(e&2)!==0,r,o=!t.startsWith("<!>");return()=>{if(le)return Ht(_e,null),_e;r===void 0&&(r=Us(o?t:"<!>"+t),n||(r=ze(r)));var s=i||Wo?document.importNode(r,!0):r.cloneNode(!0);if(n){var l=ze(s),d=s.lastChild;Ht(l,d)}else Ht(s,s);return s}}function Uh(t,e,n="svg"){var i=!t.startsWith("<!>"),r=(e&1)!==0,o=`<${n}>${i?t:"<!>"+t}</${n}>`,s;return()=>{if(le)return Ht(_e,null),_e;if(!s){var l=Us(o),d=ze(l);if(r)for(s=document.createDocumentFragment();ze(d);)s.appendChild(ze(d));else s=ze(d)}var u=s.cloneNode(!0);if(r){var c=ze(u),f=u.lastChild;Ht(c,f)}else Ht(u,u);return u}}function Ai(t,e){return Uh(t,e,"svg")}function me(){if(le)return Ht(_e,null),_e;var t=document.createDocumentFragment(),e=document.createComment(""),n=dt();return t.append(e,n),Ht(e,n),t}function C(t,e){if(le){var n=se;((n.f&32768)===0||n.nodes.end===null)&&(n.nodes.end=_e),Lt();return}t!==null&&t.before(e)}var Gh=/\r/g;function Fc(t){t=t.replace(Gh,"");let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return(e>>>0).toString(36)}var zh=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var a0=[...zh,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var Wh=["touchstart","touchmove"];function Mc(t){return Wh.includes(t)}var Vh=["$state","$state.raw","$derived","$derived.by"],l0=[...Vh,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];function Gs(t){return t?.replace(/\//g,"/​")}function Hc(t){let e=0,n=Vt(0),i;return F&&Ut(n,"createSubscriber version"),()=>{Di()&&(a(n),qt(()=>(e===0&&(i=Ze(()=>t(()=>fr(n)))),e+=1,()=>{It(()=>{e-=1,e===0&&(i?.(),i=void 0,fr(n))})})))}}var Qh=589824;function bl(t,e,n,i){new _l(t,e,n,i)}var _l=class{parent;is_pending=!1;transform_error;#e;#t=le?_e:null;#n;#l;#o;#s=null;#i=null;#a=null;#r=null;#m=0;#f=0;#c=!1;#u=new Set;#g=new Set;#d=null;#b=Hc(()=>(this.#d=Vt(this.#m),F&&Ut(this.#d,"$effect.pending()"),()=>{this.#d=null}));constructor(e,n,i,r){this.#e=e,this.#n=n,this.#l=o=>{var s=se;s.b=this,s.f|=128,i(o)},this.parent=se.b,this.transform_error=r??this.parent?.transform_error??(o=>o),this.#o=ln(()=>{if(le){let o=this.#t;Lt();let s=o.data==="[!";if(o.data.startsWith("[?")){let d=JSON.parse(o.data.slice("[?".length));this.#w(d)}else s?this.#y():this.#v()}else this.#p()},Qh),le&&(this.#e=_e)}#v(){try{this.#s=ft(()=>this.#l(this.#e))}catch(e){this.error(e)}}#w(e){let n=this.#n.failed,{reset:i,invoke_onerror:r}=this.#x(e);It(r),n&&(this.#a=ft(()=>{n(this.#e,()=>e,()=>i)}))}#x(e){var n=!1,i=!1;let r=()=>{if(n){Sf();return}n=!0,i&&Vf(),this.#a!==null&&oi(this.#a,()=>{this.#a=null}),this.#h(()=>{this.#p()})};return{reset:r,invoke_onerror:()=>{try{i=!0,this.#n.onerror?.(e,r),i=!1}catch(s){rn(s,this.#o&&this.#o.parent)}}}}#y(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#i=ft(()=>e(this.#e)),It(()=>{var n=this.#r=document.createDocumentFragment(),i=dt(),r=!1;if(n.append(i),this.#s=this.#h(()=>{try{return ft(()=>this.#l(i))}catch(o){try{this.error(o),r=!0}catch(s){rn(s,this.#o.parent)}return null}}),this.#s===null){this.#r=null,r&&this.#_(be);return}this.#f===0&&(this.#e.before(n),this.#r=null,oi(this.#i,()=>{this.#i=null}),this.#_(be))}))}#p(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#m=0,this.#s=ft(()=>{this.#l(this.#e)}),this.#f>0){var e=this.#r=document.createDocumentFragment();qr(this.#s,e);let n=this.#n.pending;this.#i=ft(()=>n(this.#e))}else this.#_(be)}catch(n){this.error(n)}}#_(e){this.is_pending=!1,e.transfer_effects(this.#u,this.#g)}defer_effect(e){Ns(e,this.#u,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#h(e){var n=se,i=ge,r=Ae;xt(this.#o),wt(this.#o),xi(this.#o.ctx);try{return gn.ensure(),e()}finally{xt(n),wt(i),xi(r)}}#E(e,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#E(e,n);return}this.#f+=e,this.#f===0&&(this.#_(n),this.#i&&oi(this.#i,()=>{this.#i=null}),this.#r&&(this.#e.before(this.#r),this.#r=null))}update_pending_count(e,n){this.#E(e,n),this.#m+=e,!(!this.#d||this.#c)&&(this.#c=!0,It(()=>{this.#c=!1,this.#d&&Pn(this.#d,this.#m)}))}get_effect_pending(){return this.#b(),a(this.#d)}error(e){if(!this.#n.onerror&&!this.#n.failed)throw e;be?.is_fork?(this.#s&&be.skip_effect(this.#s),this.#i&&be.skip_effect(this.#i),this.#a&&be.skip_effect(this.#a),be.oncommit(()=>{this.#A(e)})):this.#A(e)}#A(e){this.#s&&(tt(this.#s),this.#s=null),this.#i&&(tt(this.#i),this.#i=null),this.#a&&(tt(this.#a),this.#a=null),le&&(Re(this.#t),er(),Re(ti()));let n=this.#n.failed,i=r=>{let{reset:o,invoke_onerror:s}=this.#x(r);s(),n&&(this.#a=this.#h(()=>{try{return ft(()=>{var l=se;l.b=this,l.f|=128,n(this.#e,()=>r,()=>o)})}catch(l){return rn(l,this.#o.parent),null}}))};It(()=>{var r;try{r=this.transform_error(e)}catch(o){rn(o,this.#o&&this.#o.parent);return}r!==null&&typeof r=="object"&&typeof r.then=="function"?r.then(i,o=>rn(o,this.#o&&this.#o.parent)):i(r)})}};var wl=!0;function $e(t,e){var n=e==null?"":typeof e=="object"?`${e}`:e;n!==(t[Fo]??=t.nodeValue)&&(t[Fo]=n,t.nodeValue=`${n}`)}function Kr(t,e){return Rc(t,e)}function yl(t,e){Bs(),e.intro=e.intro??!1;let n=e.target,i=le,r=_e;try{for(var o=ze(n);o&&(o.nodeType!==hn||o.data!=="[");)o=kt(o);if(!o)throw ei;mt(!0),Re(o);let s=Rc(t,{...e,anchor:o});return mt(!1),s}catch(s){if(s instanceof Error&&s.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw s;return s!==ei&&console.warn("Failed to hydrate: ",s),e.recover===!1&&Rf(),Bs(),Oo(n),mt(!1),Kr(t,e)}finally{mt(i),Re(r)}}var zs=new Map;function Rc(t,{target:e,anchor:n,props:i={},events:r,context:o,intro:s=!0,transformError:l}){Bs();var d=void 0,u=yc(()=>{var c=n??e.appendChild(dt());bl(c,{pending:()=>{}},g=>{de({});var v=Ae;if(o&&(v.c=o),r&&(i.$$events=r),le&&Ht(g,null),wl=s,d=t(g,i)||Ss(),wl=!0,le&&(se.nodes.end=_e,_e===null||_e.nodeType!==hn||_e.data!=="]"))throw Ti(),ei;fe()},l);var f=new Set,p=g=>{for(var v=0;v<g.length;v++){var y=g[v];if(!f.has(y)){f.add(y);var w=Mc(y);for(let x of[e,document]){var b=zs.get(x);b===void 0&&(b=new Map,zs.set(x,b));var E=b.get(y);E===void 0?(x.addEventListener(y,vl,{passive:w}),b.set(y,1)):b.set(y,E+1)}}}};return p(Tr(gl)),js.add(p),()=>{for(var g of f)for(let w of[e,document]){var v=zs.get(w),y=v.get(g);--y==0?(w.removeEventListener(g,vl),v.delete(g),v.size===0&&zs.delete(w)):v.set(g,y)}js.delete(p),c!==n&&c.parentNode?.removeChild(c)}});return xl.set(d,u),d}var xl=new WeakMap;function Qo(t,e){let n=xl.get(t);return n?(xl.delete(t),n(e)):(F&&If(),Promise.resolve())}var si=class{anchor;#e=new Map;#t=new Map;#n=new Map;#l=new Set;#o=!0;constructor(e,n=!0){this.anchor=e,this.#o=n}#s=e=>{if(this.#e.has(e)){var n=this.#e.get(e),i=this.#t.get(n);if(i)Jr(i),this.#l.delete(n);else{var r=this.#n.get(n);r&&(Jr(r.effect),this.#t.set(n,r.effect),this.#n.delete(n),F&&(r.fragment.lastChild[ja]=this.anchor),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),i=r.effect)}for(let[o,s]of this.#e){if(this.#e.delete(o),o===e)break;let l=this.#n.get(s);l&&(tt(l.effect),this.#n.delete(s))}for(let[o,s]of this.#t){if(o===n||this.#l.has(o))continue;let l=()=>{if(Array.from(this.#e.values()).includes(o)){var u=document.createDocumentFragment();qr(s,u),u.append(dt()),this.#n.set(o,{effect:s,fragment:u})}else tt(s);this.#l.delete(o),this.#t.delete(o)};this.#o||!i?(this.#l.add(o),oi(s,l,!1)):l()}}};#i=e=>{this.#e.delete(e);let n=Array.from(this.#e.values());for(let[i,r]of this.#n)n.includes(i)||(tt(r.effect),this.#n.delete(i))};ensure(e,n){var i=be,r=Rs();if(n&&!this.#t.has(e)&&!this.#n.has(e))if(r){var o=document.createDocumentFragment(),s=dt();o.append(s),this.#n.set(e,{effect:ft(()=>n(s)),fragment:o})}else this.#t.set(e,ft(()=>n(this.anchor)));if(this.#e.set(i,e),r){for(let[l,d]of this.#t)l===e?i.unskip_effect(d):i.skip_effect(d);for(let[l,d]of this.#n)l===e?i.unskip_effect(d.effect):i.skip_effect(d.effect);i.oncommit(this.#s),i.ondiscard(this.#i)}else le&&(this.anchor=_e),this.#s(i)}};function Bt(t,e,...n){var i=new si(t);ln(()=>{let r=e()??null;F&&r==null&&Of(),i.ensure(r,r&&(o=>r(o,...n)))},65536)}if(F){let t=function(e){if(!(e in globalThis)){let n;Object.defineProperty(globalThis,e,{configurable:!0,get:()=>{if(n!==void 0)return n;jf(e)},set:i=>{n=i}})}};t("$state"),t("$effect"),t("$derived"),t("$inspect"),t("$props"),t("$bindable")}function qh(t){Ae===null&&Br("onMount"),wi&&Ae.l!==null?Kh(Ae).m.push(t):ye(()=>{let e=Ze(t);if(typeof e=="function")return e})}function We(t){Ae===null&&Br("onDestroy"),qh(()=>()=>Ze(t))}function Kh(t){var e=t.l;return e.u??={a:[],b:[],m:[]}}function Q(t,e,n=!1){var i;le&&(i=_e,Lt());var r=new si(t),o=n?65536:0;function s(l,d){if(le){var u=Ho(i);if(l!==parseInt(u.substring(1))){var c=ti();Re(c),r.anchor=c,mt(!1),r.ensure(l,d),mt(!0);return}}r.ensure(l,d)}ln(()=>{var l=!1;e((d,u=0)=>{l=!0,s(u,d)}),l||s(-1,null)},o)}function li(t,e){return e}function om(t,e,n){for(var i=[],r=e.length,o,s=e.length,l=0;l<r;l++){let f=e[l];oi(f,()=>{if(o){if(o.pending.delete(f),o.done.add(f),o.pending.size===0){var p=t.outrogroups;El(t,Tr(o.done)),p.delete(o),p.size===0&&(t.outrogroups=null)}}else s-=1},!1)}if(s===0){var d=i.length===0&&n!==null&&t.pending.size===0;if(d){var u=n,c=u.parentNode;Oo(c),c.append(u),t.items.clear()}El(t,e,!d)}else o={pending:new Set(e),done:new Set},(t.outrogroups??=new Set).add(o)}function El(t,e,n=!0){var i;if(t.pending.size>0){i=new Set;for(let s of t.pending.values())for(let l of s)i.add(t.items.get(l).e)}for(var r=0;r<e.length;r++){var o=e[r];if(i?.has(o)){o.f|=33554432;let s=document.createDocumentFragment();qr(o,s)}else tt(e[r],n)}}var jc;function di(t,e,n,i,r,o=null){var s=t,l=new Map,d=(e&4)!==0;if(d){var u=t;s=le?Re(ze(u)):u.appendChild(dt())}le&&Lt();var c=null,f=Ur(()=>{var x=n();return gi(x)?x:x==null?[]:Tr(x)});F&&Ut(f,"{#each ...}");var p,g=new Map,v=!0;function y(x){(E.effect.f&16384)===0&&(E.pending.delete(x),E.fallback=c,sm(E,p,s,e,i),c!==null&&(p.length===0?(c.f&33554432)===0?Jr(c):(c.f^=33554432,Jo(c,null,s)):oi(c,()=>{c=null})))}function w(x){E.pending.delete(x)}var b=ln(()=>{p=a(f);var x=p.length;let S=!1;if(le){var k=Ho(s)==="[!";k!==(x===0)&&(s=ti(),Re(s),mt(!1),S=!0)}for(var h=new Set,m=be,A=Rs(),N=0;N<x;N+=1){le&&_e.nodeType===hn&&_e.data==="]"&&(s=_e,S=!0,mt(!1));var $=p[N],P=i($,N);if(F){var X=i($,N);P!==X&&Df(String(N),String(P),String(X))}var z=v?null:l.get(P);z?(z.v&&Pn(z.v,$),z.i&&Pn(z.i,N),A&&m.unskip_effect(z.e)):(z=am(l,v?s:jc??=dt(),$,P,N,r,e,n),v||(z.e.f|=33554432),l.set(P,z)),h.add(P)}if(x===0&&o&&!c&&(v?c=ft(()=>o(s)):(c=ft(()=>o(jc??=dt())),c.f|=33554432)),x>h.size&&(F?lm(p,i):za("","","")),le&&x>0&&Re(ti()),!v)if(g.set(m,h),A){for(let[q,Y]of l)h.has(q)||m.skip_effect(Y.e);m.oncommit(y),m.ondiscard(w)}else y(m);S&&mt(!0),a(f)}),E={effect:b,flags:e,items:l,pending:g,outrogroups:null,fallback:c};v=!1,le&&(s=_e)}function Yo(t){for(;t!==null&&(t.f&32)===0;)t=t.next;return t}function sm(t,e,n,i,r){var o=(i&8)!==0,s=e.length,l=t.items,d=Yo(t.effect.first),u,c=null,f,p=[],g=[],v,y,w,b;if(o)for(b=0;b<s;b+=1)v=e[b],y=r(v,b),w=l.get(y).e,(w.f&33554432)===0&&(w.nodes?.a?.measure(),(f??=new Set).add(w));for(b=0;b<s;b+=1){if(v=e[b],y=r(v,b),w=l.get(y).e,t.outrogroups!==null)for(let $ of t.outrogroups)$.pending.delete(w),$.done.delete(w);if((w.f&8192)!==0&&(Jr(w),o&&(w.nodes?.a?.unfix(),(f??=new Set).delete(w))),(w.f&33554432)!==0)if(w.f^=33554432,w===d)Jo(w,null,n);else{var E=c?c.next:d;w===t.effect.last&&(t.effect.last=w.prev),w.prev&&(w.prev.next=w.next),w.next&&(w.next.prev=w.prev),Bi(t,c,w),Bi(t,w,E),Jo(w,E,n),c=w,p=[],g=[],d=Yo(c.next);continue}if(w!==d){if(u!==void 0&&u.has(w)){if(p.length<g.length){var x=g[0],S;c=x.prev;var k=p[0],h=p[p.length-1];for(S=0;S<p.length;S+=1)Jo(p[S],x,n);for(S=0;S<g.length;S+=1)u.delete(g[S]);Bi(t,k.prev,h.next),Bi(t,c,k),Bi(t,h,x),d=x,c=h,b-=1,p=[],g=[]}else u.delete(w),Jo(w,d,n),Bi(t,w.prev,w.next),Bi(t,w,c===null?t.effect.first:c.next),Bi(t,c,w),c=w;continue}for(p=[],g=[];d!==null&&d!==w;)(u??=new Set).add(d),g.push(d),d=Yo(d.next);if(d===null)continue}(w.f&33554432)===0&&p.push(w),c=w,d=Yo(w.next)}if(t.outrogroups!==null){for(let $ of t.outrogroups)$.pending.size===0&&(El(t,Tr($.done)),t.outrogroups?.delete($));t.outrogroups.size===0&&(t.outrogroups=null)}if(d!==null||u!==void 0){var m=[];if(u!==void 0)for(w of u)(w.f&8192)===0&&m.push(w);for(;d!==null;)(d.f&8192)===0&&d!==t.fallback&&m.push(d),d=Yo(d.next);var A=m.length;if(A>0){var N=(i&4)!==0&&s===0?n:null;if(o){for(b=0;b<A;b+=1)m[b].nodes?.a?.measure();for(b=0;b<A;b+=1)m[b].nodes?.a?.fix()}om(t,m,N)}}o&&It(()=>{if(f!==void 0)for(w of f)w.nodes?.a?.apply()})}function am(t,e,n,i,r,o,s,l){var d=(s&1)!==0?(s&16)===0?ir(n,!1,!1):Vt(n):null,u=(s&2)!==0?Vt(r):null;return F&&d&&(d.trace=()=>{l()[u?.v??r]}),{v:d,i:u,e:ft(()=>(o(e,d??n,u??r,l),()=>{t.delete(i)}))}}function Jo(t,e,n){if(t.nodes)for(var i=t.nodes.start,r=t.nodes.end,o=e&&(e.f&33554432)===0?e.nodes.start:n;i!==null;){var s=kt(i);if(o.before(i),i===r)return;i=s}}function Bi(t,e,n){e===null?t.effect.first=n:e.next=n,n===null?t.effect.last=e:n.prev=e}function lm(t,e){let n=new Map,i=t.length;for(let r=0;r<i;r++){let o=e(t[r],r);if(n.has(o)){let s=String(n.get(o)),l=String(r),d=String(o);d.startsWith("[object ")&&(d=null),za(s,l,d)}n.set(o,r)}}function dm(t,e,n){if(!e||e===Fc(String(n??"")))return;let i,r=t.__svelte_meta?.loc;r?i=`near ${r.file}:${r.line}:${r.column}`:mn?.[tn]&&(i=`in ${mn[tn]}`),kf(Gs(i))}function pr(t,e,n=!1,i=!1,r=!1,o=!1){var s=t,l="";if(n){var d=t;le&&(s=Re(ze(d)))}K(()=>{var u=se;if(l===(l=e()??"")){le&&Lt();return}if(n&&!le){u.nodes=null,d.innerHTML=l,l!==""&&Ht(ze(d),d.lastChild);return}if(u.nodes!==null&&(pl(u.nodes.start,u.nodes.end),u.nodes=null),l!==""){if(le){for(var c=_e.data,f=Lt(),p=f;f!==null&&(f.nodeType!==hn||f.data!=="");)p=f,f=kt(f);if(f===null)throw Ti(),ei;F&&!o&&dm(f.parentNode,c,l),Ht(_e,p),s=Re(f);return}var g=i?$o:r?Ha:void 0,v=Un(i?"svg":r?"math":"template",g);v.innerHTML=l;var y=i||r?v:v.content;if(Ht(ze(y),y.lastChild),i||r)for(;ze(y);)s.before(ze(y));else s.before(y)}})}function lt(t,e){var n=void 0,i;cl(()=>{n!==(n=e())&&(i&&(tt(i),i=null),n&&(i=ft(()=>{An(()=>n(t))})))})}function zc(t){var e,n,i="";if(typeof t=="string"||typeof t=="number")i+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=zc(t[e]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}function Wc(){for(var t,e,n=0,i="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=zc(t))&&(i&&(i+=" "),i+=e);return i}function dn(t){return typeof t=="object"?Wc(t):t??""}var Vc=[...` 	
\r\f \v\uFEFF`];function Yc(t,e,n){var i=t==null?"":""+t;if(e&&(i=i?i+" "+e:e),n){for(var r of Object.keys(n))if(n[r])i=i?i+" "+r:r;else if(i.length)for(var o=r.length,s=0;(s=i.indexOf(r,s))>=0;){var l=s+o;(s===0||Vc.includes(i[s-1]))&&(l===i.length||Vc.includes(i[l]))?i=(s===0?"":i.substring(0,s))+i.substring(l+1):s=l}}return i===""?null:i}function Qc(t,e=!1){var n=e?" !important;":";",i="";for(var r of Object.keys(t)){var o=t[r];o!=null&&o!==""&&(i+=" "+r+": "+o+n)}return i}function Al(t){return t[0]!=="-"||t[1]!=="-"?t.toLowerCase():t}function Jc(t,e){if(e){var n="",i,r;if(Array.isArray(e)?(i=e[0],r=e[1]):i=e,t){t=String(t).replaceAll(/\/\*.*?\*\//g,"").trim();var o=!1,s=0,l=!1,d=[];i&&d.push(...Object.keys(i).map(Al)),r&&d.push(...Object.keys(r).map(Al));var u=0,c=-1;let y=t.length;for(var f=0;f<y;f++){var p=t[f];if(l?p==="/"&&t[f-1]==="*"&&(l=!1):o?o===p&&(o=!1):p==="/"&&t[f+1]==="*"?l=!0:p==='"'||p==="'"?o=p:p==="("?s++:p===")"&&s--,!l&&o===!1&&s===0){if(p===":"&&c===-1)c=f;else if(p===";"||f===y-1){if(c!==-1){var g=Al(t.substring(u,c).trim());if(!d.includes(g)){p!==";"&&f++;var v=t.substring(u,f).trim();n+=" "+v+";"}}u=f+1,c=-1}}}}return i&&(n+=Qc(i)),r&&(n+=Qc(r,!0)),n=n.trim(),n===""?null:n}return t==null?null:String(t)}function Se(t,e,n,i,r,o){var s=t[To];if(le||s!==n||s===void 0){var l=Yc(n,i,o);(!le||l!==t.getAttribute("class"))&&(l==null?t.removeAttribute("class"):e?t.className=l:t.setAttribute("class",l)),t[To]=n}else if(o&&r!==o)for(var d in o){var u=!!o[d];(r==null||u!==!!r[d])&&t.classList.toggle(d,u)}return o}function Ll(t,e={},n,i){for(var r in n){var o=n[r];e[r]!==o&&(n[r]==null?t.style.removeProperty(r):t.style.setProperty(r,o,i))}}function V(t,e,n,i){var r=t[Do];if(le||r!==e){var o=Jc(e,i);(!le||o!==t.getAttribute("style"))&&(o==null?t.removeAttribute("style"):t.style.cssText=o),t[Do]=e}else i&&(Array.isArray(i)?(Ll(t,n?.[0],i[0]),Ll(t,n?.[1],i[1],"important")):Ll(t,n,i));return i}var bm=Symbol("is custom element"),wm=Symbol("is html"),xm=Ua?"link":"LINK";function G(t,e,n,i){var r=ym(t);if(le&&(r[e]=t.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&t.nodeName===xm)){i||Am(t,e,n??"");return}r[e]!==(r[e]=n)&&(e==="loading"&&(t[xf]=n),n==null?t.removeAttribute(e):typeof n!="string"&&Em(t).has(e)?t[e]=n:t.setAttribute(e,n))}function ym(t){return t[xs]??={[bm]:t.nodeName.includes("-"),[wm]:t.namespaceURI===ms}}var qc=new Map;function Em(t){var e=t.getAttribute("is")||t.nodeName,n=qc.get(e);if(n)return n;qc.set(e,n=new Set);for(var i,r=t,o=Element.prototype;o!==r;){i=Ra(r);for(var s in i)i[s].set&&s!=="innerHTML"&&s!=="textContent"&&s!=="innerText"&&n.add(s);r=Dr(r)}return n}function Am(t,e,n){F&&(e==="srcset"&&Lm(t,n)||kl(t.getAttribute(e)??"",n)||Lf(e,t.outerHTML.replace(t.innerHTML,t.innerHTML&&"..."),String(n)))}function kl(t,e){return t===e?!0:new URL(t,document.baseURI).href===new URL(e,document.baseURI).href}function Kc(t){return t.split(",").map(e=>e.trim().split(" ").filter(Boolean))}function Lm(t,e){var n=Kc(t.srcset),i=Kc(e);return i.length===n.length&&i.every(([r,o],s)=>o===n[s][1]&&(kl(n[s][0],r)||kl(r,n[s][0])))}var Im={get(t,e){if(!t.exclude.has(e))return t.props[e]},set(t,e){return F&&Pf(`${t.name}.${String(e)}`),!1},getOwnPropertyDescriptor(t,e){if(!t.exclude.has(e)&&e in t.props)return{enumerable:!0,configurable:!0,value:t.props[e]}},has(t,e){return t.exclude.has(e)?!1:e in t.props},ownKeys(t){return Reflect.ownKeys(t.props).filter(e=>!t.exclude.has(e))}};function he(t,e,n){return new Proxy(F?{props:t,exclude:e,name:n}:{props:t,exclude:e},Im)}function Xc(t){return new Sl(t)}var Sl=class{#e;#t;constructor(e){var n=new Map,i=(o,s)=>{var l=ir(s,!1,!1);return n.set(o,l),l};let r=new Proxy({...e.props||{},$$events:{}},{get(o,s){return a(n.get(s)??i(s,Reflect.get(o,s)))},has(o,s){return s===bs?!0:(a(n.get(s)??i(s,Reflect.get(o,s))),Reflect.has(o,s))},set(o,s,l){return ne(n.get(s)??i(s,l),l),Reflect.set(o,s,l)}});this.#t=(e.hydrate?yl:Kr)(e.component,{target:e.target,anchor:e.anchor,props:r,context:e.context,intro:e.intro??!1,recover:e.recover,transformError:e.transformError}),!gt&&(!e?.props?.$$host||e.sync===!1)&&Qr(),this.#e=r.$$events;for(let o of Object.keys(this.#t))o==="$set"||o==="$destroy"||o==="$on"||At(this,o,{get(){return this.#t[o]},set(s){this.#t[o]=s},enumerable:!0});this.#t.$set=o=>{Object.assign(r,o)},this.#t.$destroy=()=>{Qo(this.#t)}}$set(e){this.#t.$set(e)}$on(e,n){this.#e[e]=this.#e[e]||[];let i=(...r)=>n.call(this,...r);return this.#e[e].push(i),()=>{this.#e[e]=this.#e[e].filter(r=>r!==i)}}$destroy(){this.#t.$destroy()}};var Mm;typeof HTMLElement=="function"&&(Mm=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(t,e,n){super(),this.$$ctor=t,this.$$s=e,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(t,e,n){if(this.$$l[t]=this.$$l[t]||[],this.$$l[t].push(e),this.$$c){let i=this.$$c.$on(t,e);this.$$l_u.set(e,i)}super.addEventListener(t,e,n)}removeEventListener(t,e,n){if(super.removeEventListener(t,e,n),this.$$c){let i=this.$$l_u.get(e);i&&(i(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let t=function(i){return r=>{let o=Un("slot");i!=="default"&&(o.name=i),C(r,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let e={},n=Hm(this);for(let i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=t(i),e.default=!0):e[i]=t(i));for(let i of this.attributes){let r=this.$$g_p(i.name);r in this.$$d||(this.$$d[r]=Nl(r,i.value,this.$$p_d,"toProp"))}for(let i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Xc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=fl(()=>{qt(()=>{this.$$r=!0;for(let i of Ba(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];let r=Nl(i,this.$$d[i],this.$$p_d,"toAttribute");r==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,r)}this.$$r=!1})});for(let i in this.$$l)for(let r of this.$$l[i]){let o=this.$$c.$on(i,r);this.$$l_u.set(r,o)}this.$$l={}}}attributeChangedCallback(t,e,n){this.$$r||(t=this.$$g_p(t),this.$$d[t]=Nl(t,n,this.$$p_d,"toProp"),this.$$c?.$set({[t]:this.$$d[t]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(t){return Ba(this.$$p_d).find(e=>this.$$p_d[e].attribute===t||!this.$$p_d[e].attribute&&e.toLowerCase()===t)||t}});function Nl(t,e,n,i){let r=n[t]?.type;if(e=r==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(r){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(r){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function Hm(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var nt="--diff-font-size--",Te="--diff-aside-width--";var fi=()=>{let t=ce(!1);return ye(()=>{ne(t,!0)}),()=>a(t)};var Zc=Symbol("fontSize");function eu(t){Ye(Zc,()=>t.diffViewFontSize||14)}function Xr(){return Qe(Zc)}var tu=Symbol("enableWrap");function nu(t){Ye(tu,()=>t.diffViewWrap)}function Ln(){return Qe(tu)}var iu=Symbol("renderWidget");function ru(t){Ye(iu,()=>t.renderWidgetLine)}function Zr(){return Qe(iu)}var ou=Symbol("id");function su(t){Ye(ou,t)}function Vs(){return Qe(ou)}var au=Symbol("dom");function lu(t){Ye(au,t)}function Qs(){return Qe(au)}var du=Symbol("extend");function fu(t){Ye(du,()=>t.extendData)}function eo(){return Qe(du)}var cu=Symbol("widget");function uu(t){Ye(cu,()=>t)}function kn(){return Qe(cu)}var pu=Symbol("renderExtendLine");function hu(t){Ye(pu,()=>t.renderExtendLine)}function to(){return Qe(pu)}var mu=Symbol("onAddWidgetClick");function gu(t){Ye(mu,()=>t.onAddWidgetClick)}function no(){return Qe(mu)}var vu=Symbol("enableHighlight");function _u(t){Ye(vu,()=>t.diffViewHighlight)}function io(){return Qe(vu)}var bu=Symbol("enableAddWidget");function wu(t){Ye(bu,()=>t.diffViewAddWidget)}function ro(){return Qe(bu)}var xu=Symbol("mode");function yu(t){Ye(xu,()=>t.diffViewMode||jt.Split)}function Ys(){return Qe(xu)}var Cl=null,Bm=(t,e)=>`${t.fontFamily}-${t.fontStyle}-${t.fontSize}-${e}`,Rm=(t,e)=>Bm(t,"0".repeat(e.length)),Tl=class{#e="";#t={};#n(){return Cl=Cl||document.createElement("canvas").getContext("2d"),Cl}measure(e,n){let i=Rm(n||{},e);if(this.#t[i])return this.#t[i];let r=this.#n();if(n){let s=`${n.fontFamily}-${n.fontStyle}-${n.fontSize}`;this.#e!==s&&(this.#e=s,r.font=`${n.fontStyle||""} ${n.fontSize||""} ${n.fontFamily||""}`)}else r.font="";return r.measureText(e).width}},$l=null,Eu=()=>($l=$l||new Tl,$l);var oo=({text:t,font:e})=>{let n=I(fi()),i=parseInt(e().fontSize||"14"),r=6;r+=i>10?(i-10)*.6:0;let o=ce(r*t().length);return ye(()=>{a(n)&&ne(o,Eu().measure(t()||"",e()),!0)}),()=>a(o)};var In=()=>{window.getSelection()?.removeAllRanges()},Au=(t,e)=>{let n=function(i){i===null||i.target===null||(i.target===t?(e.scrollTop=t.scrollTop,e.scrollLeft=t.scrollLeft):(t.scrollTop=e.scrollTop,t.scrollLeft=e.scrollLeft))};return t.onscroll||(t.onscroll=n),e.onscroll||(e.onscroll=n),()=>{t.onscroll=null,e.onscroll=null}},Js=t=>{if(t){let e=t.getRootNode();return e instanceof ShadowRoot?e:t.ownerDocument}return document},so=t=>{if(t){if(typeof t.closest=="function")return t.closest('[data-component="git-diff-view"]')?.querySelector?.(".diff-view-wrapper")?.getAttribute?.("id");{let e=t;for(;e;){if(e.getAttribute&&e.getAttribute("data-component")==="git-diff-view")return e.querySelector(".diff-view-wrapper")?.getAttribute("id");e=e.parentElement}}}};var Dl="--diff-add-content--",Fl="--diff-del-content--",_n="--diff-border--",Ml="--diff-add-lineNumber--",Hl="--diff-del-lineNumber--",Bl="--diff-plain-content--",qs="--diff-expand-content--",ct="--diff-plain-lineNumber-color--",hr="--diff-expand-lineNumber-color--",Rl="--diff-plain-lineNumber--",Om="--diff-expand-lineNumber--",fn="--diff-hunk-content--",zn="--diff-hunk-content-color--",Wn="--diff-hunk-lineNumber--";var Ks="--diff-add-widget--",Xs="--diff-add-widget-color--",Kt="--diff-empty-content--",qo=(t,e,n)=>t?`var(${Dl})`:e?`var(${Fl})`:n?`var(${Bl})`:`var(${qs})`,Ko=(t,e,n)=>t?`var(${Ml})`:e?`var(${Hl})`:n?`var(${Rl})`:`var(${Om})`;var Pm=new Set(["$$slots","$$events","$$legacy"]),jm=j('<div><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Ri(t,e){de(e,!0);let n=he(e,Pm);var i=jm(),r=Le(i);K(()=>{G(i,"data-add-widget",H[e.side]),Se(i,1,"diff-add-widget-wrapper invisible select-none transition-transform hover:scale-110 group-hover:visible"+(e.className?" "+e.className:"")),V(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),V(r,`
			color: var(${Xs});
			background-color: var(${Ks});
    `)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),C(t,i),fe()}ot(["mousedown"]);Qf();var Um=Ai('<svg aria-label="No newline at end of file" role="img" viewBox="0 0 16 16" version="1.1" fill="currentColor"><path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>');function Xo(t){var e=Um();C(t,e)}var Gm=new Set(["$$slots","$$events","$$legacy"]),zm=j('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),Wm=j('<span class="diff-line-content-raw"><span data-template=""></span><!></span>'),Lu=j('<span class="diff-line-content-raw"> </span>'),Vm=j('<span class="diff-line-content-raw"><span data-template=""></span></span>');function Zo(t,e){de(e,!0);let n=he(e,Gm);e.diffLine?.changes?.hasLineChange?e.diffLine?.plainTemplate&&typeof ko=="function"&&ko({diffLine:e.diffLine,rawLine:e.rawLine,operator:e.operator||"add"}):e.plainLine&&!e.plainLine?.template&&(e.plainLine.template=Ca(e.plainLine.value));var r=me(),o=te(r);{var s=u=>{var c=me(),f=te(c);{var p=v=>{var y=Wm(),w=D(y);pr(w,()=>e.diffLine.plainTemplate,!0),T(w);var b=J(w);{var E=x=>{var S=zm(),k=D(S);Xo(k,{}),T(S),K(()=>{Se(S,1,dn(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),V(S,`
						width: var(${nt});
						height: var(${nt})
					`)}),C(x,S)};Q(b,x=>{e.diffLine.changes.newLineSymbol===$r.NEWLINE&&x(E)})}T(y),C(v,y)},g=v=>{var y=Lu(),w=Le(y,!0);K(()=>$e(w,e.rawLine)),C(v,y)};Q(f,v=>{e.diffLine?.plainTemplate?v(p):v(g,-1)})}C(u,c)},l=u=>{var c=Vm(),f=D(c);pr(f,()=>e.plainLine.template,!0),T(f),T(c),C(u,c)},d=u=>{var c=Lu(),f=Le(c,!0);K(()=>$e(f,e.rawLine)),C(u,c)};Q(o,u=>{e.diffLine?.changes?.hasLineChange?u(s):e.plainLine?.template?u(l,1):u(d,-1)})}C(t,r),fe()}var Qm=new Set(["$$slots","$$events","$$legacy"]),Ym=j('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),Jm=j('<span class="diff-line-syntax-raw"><span data-template=""></span><!></span>'),ku=j("<span> </span>"),Iu=j('<span class="diff-line-syntax-raw"></span>'),qm=j('<span class="diff-line-syntax-raw"><span data-template=""></span></span>');function Ol(t,e){de(e,!0);let n=he(e,Qm);e.diffLine?.changes?.hasLineChange?e.syntaxLine&&e.diffLine&&!e.diffLine?.syntaxTemplate&&typeof So=="function"&&So({diffFile:e.diffFile,diffLine:e.diffLine,syntaxLine:e.syntaxLine,operator:e.operator||"add"}):e.syntaxLine&&!e.syntaxLine.template&&(e.syntaxLine.template=Na(e.syntaxLine));var r=me(),o=te(r);{var s=c=>{Zo(c,{get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get operator(){return e.operator},get enableWrap(){return e.enableWrap}})},l=c=>{var f=me(),p=te(f);{var g=y=>{var w=Jm(),b=D(w);pr(b,()=>e.diffLine.syntaxTemplate,!0),T(b);var E=J(b);{var x=S=>{var k=Ym(),h=D(k);Xo(h,{}),T(k),K(()=>{Se(k,1,dn(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),V(k,`
                width: var(${nt});
                height: var(${nt});
              `)}),C(S,k)};Q(E,S=>{e.diffLine.changes.newLineSymbol===$r.NEWLINE&&S(x)})}T(w),C(y,w)},v=y=>{var w=Iu();di(w,21,()=>e.syntaxLine.nodeList,li,(b,E)=>{let x=()=>a(E).node,S=()=>a(E).wrapper;var k=ku(),h=Le(k,!0);K(m=>{G(k,"data-start",x().startIndex),G(k,"data-end",x().endIndex),Se(k,1,m),V(k,S()?.properties?.style),$e(h,x().value)},[()=>dn(S()?.properties?.className?.join(" "))]),C(b,k)}),T(w),C(y,w)};Q(p,y=>{e.diffLine?.syntaxTemplate?y(g):y(v,-1)})}C(c,f)},d=c=>{var f=qm(),p=D(f);pr(p,()=>e.syntaxLine.template,!0),T(p),T(f),C(c,f)},u=c=>{var f=Iu();di(f,21,()=>e.syntaxLine.nodeList,li,(p,g)=>{let v=()=>a(g).node,y=()=>a(g).wrapper;var w=ku(),b=Le(w,!0);K(E=>{G(w,"data-start",v().startIndex),G(w,"data-end",v().endIndex),Se(w,1,E),V(w,y()?.properties?.style),$e(b,v().value)},[()=>dn(y()?.properties?.className?.join(" "))]),C(p,w)}),T(f),C(c,f)};Q(o,c=>{e.syntaxLine?e.diffLine?.changes?.hasLineChange?c(l,1):e.syntaxLine.template?c(d,2):c(u,-1):c(s)})}C(t,r),fe()}var Km=new Set(["$$slots","$$events","$$legacy"]),Xm=j('<div class="diff-line-content-item pl-[2.0em]"><span class="diff-line-content-operator ml-[-1.5em] inline-block w-[1.5em] select-none indent-[0.2em]"> </span> <!></div>');function ci(t,e){de(e,!0);let n=he(e,Km),i=I(()=>e.diffLine?.type===Fe.Add),r=I(()=>e.diffLine?.type===Fe.Delete),o=I(()=>e.syntaxLine&&e.syntaxLine?.nodeList?.length>150);var s=Xm(),l=D(s),d=Le(l,!0),u=J(l,2);{var c=p=>{{let g=I(()=>a(i)?"add":a(r)?"del":void 0);Ol(p,{get operator(){return a(g)},get rawLine(){return e.rawLine},get diffFile(){return e.diffFile},get diffLine(){return e.diffLine},get syntaxLine(){return e.syntaxLine},get enableWrap(){return e.enableWrap}})}},f=p=>{{let g=I(()=>a(i)?"add":a(r)?"del":void 0);Zo(p,{get operator(){return a(g)},get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get plainLine(){return e.plainLine},get enableWrap(){return e.enableWrap}})}};Q(u,p=>{e.enableHighlight&&e.syntaxLine&&!a(o)?p(c):p(f,-1)})}T(s),K(()=>{V(s,`
		white-space: ${e.enableWrap?"pre-wrap":"pre"};
		word-break: ${e.enableWrap?"break-all":"initial"}
	`),G(l,"data-operator",a(i)?"+":a(r)?"-":void 0),$e(d,a(i)?"+":a(r)?"-":" ")}),C(t,s),fe()}var Zm=new Set(["$$slots","$$events","$$legacy"]),eg=j('<td class="diff-line-old-num group relative w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-old-content group relative pr-[10px] align-top"><!> <!></td>',1),tg=j('<td class="diff-line-old-placeholder select-none"><span>&ensp;</span></td>'),ng=j('<td class="diff-line-new-num group relative w-[1%] min-w-[40px] select-none border-l-[1px] pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-new-content group relative pr-[10px] align-top"><!> <!></td>',1),ig=j('<td class="diff-line-new-placeholder select-none border-l-[1px]"><span>&ensp;</span></td>'),rg=j('<tr class="diff-line"><!><!></tr>');function Pl(t,e){de(e,!0);let n=he(e,Zm),i=I(kn()),r=I(ro()),o=I(io()),s=I(no()),l=I(()=>e.diffFile.getSplitLeftLine(e.index)),d=I(()=>e.diffFile.getSplitRightLine(e.index)),u=()=>e.diffFile.getOldSyntaxLine(a(l)?.lineNumber||0),c=()=>e.diffFile.getNewSyntaxLine(a(d)?.lineNumber||0),f=()=>e.diffFile.getOldPlainLine(a(l)?.lineNumber||0),p=()=>e.diffFile.getNewPlainLine(a(d)?.lineNumber||0),g=ce(Ee(u())),v=ce(Ee(c())),y=ce(Ee(f())),w=ce(Ee(p())),b=I(()=>!!a(l)?.diff||!!a(d)?.diff),E=I(()=>Zi(a(l)?.diff)||Zi(a(d)?.diff)),x=I(()=>a(l)?.isHidden&&a(d)?.isHidden),S=()=>a(l)?.diff?.type===Fe.Delete,k=()=>a(d)?.diff?.type===Fe.Add,h=()=>{ne(g,u(),!0),ne(v,c(),!0),ne(y,f(),!0),ne(w,p(),!0)},m={current:()=>{}};ye(()=>{m.current(),h(),m.current=e.diffFile.subscribe(h)}),We(()=>m.current());let A=(X,z)=>{a(i).side=z,a(i).lineNumber=X};var N=me(),$=te(N);{var P=X=>{var z=rg(),q=D(z);{var Y=O=>{var M=eg(),ee=te(M),ae=D(ee);{var ie=xe=>{{let ke=I(()=>a(l)?.lineNumber||0);Ri(xe,{get index(){return e.index},get lineNumber(){return a(ke)},get side(){return H.old},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:A})}};Q(ae,xe=>{a(b)&&a(r)&&xe(ie)})}var re=J(ae,2),Z=Le(re,!0);T(ee);var oe=J(ee,2),ue=D(oe);{var pe=xe=>{{let ke=I(()=>a(l)?.lineNumber||0);Ri(xe,{get index(){return e.index},get lineNumber(){return a(ke)},get side(){return H.old},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:A})}};Q(ue,xe=>{a(b)&&a(r)&&xe(pe)})}var He=J(ue,2);{let xe=I(()=>a(l)?.value||""),ke=I(()=>a(l)?.diff),De=I(()=>!!a(o));ci(He,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return a(xe)},get diffLine(){return a(ke)},get plainLine(){return a(y)},get syntaxLine(){return a(g)},get enableHighlight(){return a(De)}})}T(oe),K((xe,ke)=>{V(ee,xe),G(ee,"data-side",H[H.old]),G(re,"data-line-num",a(l)?.lineNumber),V(re,`opacity: ${a(E)?void 0:.5} `),$e(Z,a(l)?.lineNumber),V(oe,ke),G(oe,"data-side",H[H.old])},[()=>`
					background-color: ${Ko(!1,S(),a(b))};
					color: var(${a(b)?ct:hr})
				`,()=>` background-color: ${qo(!1,S(),a(b))} `]),C(O,M)},ve=O=>{var M=tg();G(M,"colspan",2),K(()=>V(M,`background-color: var(${Kt}) `)),C(O,M)};Q(q,O=>{a(l)?.lineNumber?O(Y):O(ve,-1)})}var U=J(q);{var B=O=>{var M=ng(),ee=te(M),ae=D(ee);{var ie=xe=>{{let ke=I(()=>a(d)?.lineNumber||0);Ri(xe,{get index(){return e.index},get lineNumber(){return a(ke)},get side(){return H.new},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:A})}};Q(ae,xe=>{a(b)&&a(r)&&xe(ie)})}var re=J(ae,2),Z=Le(re,!0);T(ee);var oe=J(ee,2),ue=D(oe);{var pe=xe=>{{let ke=I(()=>a(d)?.lineNumber||0);Ri(xe,{get index(){return e.index},get lineNumber(){return a(ke)},get side(){return H.new},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:A})}};Q(ue,xe=>{a(b)&&a(r)&&xe(pe)})}var He=J(ue,2);{let xe=I(()=>a(d)?.value||""),ke=I(()=>a(d)?.diff),De=I(()=>!!a(o));ci(He,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return a(xe)},get diffLine(){return a(ke)},get plainLine(){return a(w)},get syntaxLine(){return a(v)},get enableHighlight(){return a(De)}})}T(oe),K((xe,ke)=>{V(ee,xe),G(ee,"data-side",H[H.new]),G(re,"data-line-num",a(d)?.lineNumber),V(re,` opacity: ${a(E)?void 0:.5} `),$e(Z,a(d)?.lineNumber),V(oe,ke),G(oe,"data-side",H[H.new])},[()=>`
					background-color: ${Ko(k(),!1,a(b))};
					color: var(${a(b)?ct:hr});
					border-left-color: var(${_n});
					border-left-style: solid
				`,()=>`background-color: ${qo(k(),!1,a(b))} `]),C(O,M)},R=O=>{var M=ig();G(M,"colspan",2),K(()=>V(M,`
					background-color: var(${Kt});
					border-left-color: var(${_n});
					border-left-style: solid;
				`)),C(O,M)};Q(U,O=>{a(d)?.lineNumber?O(B):O(R,-1)})}T(z),K(()=>{G(z,"data-line",e.lineNumber),G(z,"data-state",a(b)?"diff":"plain")}),C(X,z)};Q($,X=>{a(x)||X(P)})}C(t,N),fe()}var og=new Set(["$$slots","$$events","$$legacy"]),sg=j('<td class="diff-line-extend-old-content p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),ag=j('<td class="diff-line-extend-old-placeholder select-none p-0"></td>'),lg=j('<td class="diff-line-extend-new-content border-l-[1px] p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),dg=j('<td class="diff-line-extend-new-placeholder select-none border-l-[1px] p-0"></td>'),fg=j('<tr data-state="extend" class="diff-line diff-line-extend"><!><!></tr>');function jl(t,e){de(e,!0);let n=he(e,og),i=I(eo()),r=I(to()),o=I(()=>e.diffFile.getSplitLeftLine(e.index)),s=I(()=>e.diffFile.getSplitRightLine(e.index)),l=I(()=>e.diffFile.getExpandEnabled()),d=I(()=>a(i)?.oldFile?.[a(o)?.lineNumber||""]),u=I(()=>a(i)?.newFile?.[a(s)?.lineNumber||""]),c=I(()=>!!((a(d)||a(u))&&(!a(o)?.isHidden&&!a(s)?.isHidden||a(l))&&a(r)));var f=me(),p=te(f);{var g=v=>{var y=fg(),w=D(y);{var b=h=>{var m=sg();G(m,"colspan",2);var A=D(m),N=D(A);Bt(N,()=>a(r),()=>({diffFile:e.diffFile,side:H.old,lineNumber:a(o)?.lineNumber||0,data:a(d)?.data,onUpdate:e.diffFile.notifyAll})),T(A),T(m),C(h,m)},E=h=>{var m=ag();G(m,"colspan",2),K(()=>V(m,`background-color: var(${Kt})`)),C(h,m)};Q(w,h=>{a(r)&&a(d)?h(b):h(E,-1)})}var x=J(w);{var S=h=>{var m=lg();G(m,"colspan",2);var A=D(m),N=D(A);Bt(N,()=>a(r),()=>({diffFile:e.diffFile,side:H.new,lineNumber:a(s)?.lineNumber||0,data:a(u)?.data,onUpdate:e.diffFile.notifyAll})),T(A),T(m),K(()=>V(m,`border-left-color: var(${_n}); border-left-style: solid `)),C(h,m)},k=h=>{var m=dg();G(m,"colspan",2),K(()=>V(m,`
					background-color: var(${Kt});
					border-left-color: var(${_n});
					border-left-style: solid;
				`)),C(h,m)};Q(x,h=>{a(r)&&a(u)?h(S):h(k,-1)})}T(y),K(()=>G(y,"data-line",`${e.lineNumber}-extend`)),C(v,y)};Q(p,v=>{a(c)&&v(g)})}C(t,f),fe()}var cg=new Set(["$$slots","$$events","$$legacy"]),ug=Ai('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M7.823 1.677 4.927 4.573A.25.25 0 0 0 5.104 5H7.25v3.236a.75.75 0 1 0 1.5 0V5h2.146a.25.25 0 0 0 .177-.427L8.177 1.677a.25.25 0 0 0-.354 0ZM13.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-3.75.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM7.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM4 11.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM1.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"></path></svg>');function Ct(t,e){de(e,!0);let n=he(e,cg);var i=ug();K(()=>Se(i,0,dn(e.className))),C(t,i),fe()}var pg=new Set(["$$slots","$$events","$$legacy"]),hg=Ai('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177 14.323 2.896-2.896a.25.25 0 0 0-.177-.427H8.75V7.764a.75.75 0 1 0-1.5 0V11H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0ZM2.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM8.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function $t(t,e){de(e,!0);let n=he(e,pg);var i=hg();K(()=>Se(i,0,dn(e.className))),C(t,i),fe()}var mg=new Set(["$$slots","$$events","$$legacy"]),gg=Ai('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function Sn(t,e){de(e,!0);let n=he(e,mg);var i=gg();K(()=>Se(i,0,dn(e.className))),C(t,i),fe()}var vg=new Set(["$$slots","$$events","$$legacy"]),_g=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),bg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),wg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),xg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),yg=j('<div class="min-h-[28px]">&ensp;</div>'),Eg=j('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Ul(t,e){de(e,!0);let n=he(e,vg),i=I(()=>e.diffFile.getSplitHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>a(r)&&a(i)?.splitInfo),s=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.endHiddenIndex-b.splitInfo.startHiddenIndex<je},l=ce(Ee(s())),d=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.startHiddenIndex<b.splitInfo.endHiddenIndex},u=ce(Ee(d())),c=I(()=>{let b=a(i);return b&&b.isFirst}),f=I(()=>{let b=a(i);return b&&e.diffFile._getIsPureDiffRender()&&!b.splitInfo}),p=I(()=>{let b=a(i);return b&&b.isLast}),g={current:()=>{}};ye(()=>{g.current();let b=()=>{ne(u,d(),!0),ne(l,s(),!0)};b(),g.current=e.diffFile.subscribe(b)}),We(()=>g.current());var v=me(),y=te(v);{var w=b=>{var E=Eg(),x=D(E),S=D(x);{var k=$=>{var P=me(),X=te(P);{var z=U=>{var B=_g(),R=D(B);Ct(R,{className:"fill-current"}),T(B),we("click",B,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(U,B)},q=U=>{var B=bg(),R=D(B);$t(R,{className:"fill-current"}),T(B),we("click",B,()=>e.diffFile.onSplitHunkExpand("down",e.index)),C(U,B)},Y=U=>{var B=wg(),R=D(B);Sn(R,{className:"fill-current"}),T(B),we("click",B,()=>e.diffFile.onSplitHunkExpand("all",e.index)),C(U,B)},ve=U=>{var B=xg(),R=te(B),O=D(R);$t(O,{className:"fill-current"}),T(R);var M=J(R,2),ee=D(M);Ct(ee,{className:"fill-current"}),T(M),we("click",R,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",M,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(U,B)};Q(X,U=>{a(c)?U(z):a(p)?U(q,1):a(l)?U(Y,2):U(ve,-1)})}C($,P)},h=$=>{var P=yg();C($,P)};Q(S,$=>{a(o)?$(k):$(h,-1)})}T(x);var m=J(x);G(m,"colspan",3);var A=D(m),N=Le(A,!0);T(m),T(E),K(()=>{G(E,"data-line",`${e.lineNumber}-hunk`),V(x,`
				background-color: var(${Wn});
				color: var(${ct})
			`),V(m,`background-color: var(${fn})`),V(A,`
					color: var(${zn})
				`),$e(N,a(i)?.splitInfo?.plainText||a(i)?.text)}),C(b,E)};Q(y,b=>{(a(u)||a(f))&&b(w)})}C(t,v),fe()}ot(["click"]);var Ag=new Set(["$$slots","$$events","$$legacy"]),Su=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Nu=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Cu=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),$u=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Tu=j('<div class="min-h-[28px]">&ensp;</div>'),Lg=j('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td><td class="diff-line-hunk-action relative z-[1] w-[1%] min-w-[40px] select-none border-l-[1px] p-[1px]"><!></td><td class="diff-line-hunk-content relative pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Gl(t,e){de(e,!0);let n=he(e,Ag),i=I(()=>e.diffFile.getSplitHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>a(r)&&a(i)?.splitInfo),s=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.endHiddenIndex-b.splitInfo.startHiddenIndex<je},l=ce(Ee(s())),d=()=>{let b=a(i);return b&&b.splitInfo&&b.splitInfo.startHiddenIndex<b.splitInfo.endHiddenIndex},u=ce(Ee(d())),c=I(()=>{let b=a(i);return b&&b.isFirst}),f=I(()=>{let b=a(i);return b&&e.diffFile._getIsPureDiffRender()&&!b.splitInfo}),p=I(()=>{let b=a(i);return b&&b.isLast}),g={current:()=>{}};ye(()=>{g.current();let b=()=>{ne(u,d(),!0),ne(l,s(),!0)};b(),g.current=e.diffFile.subscribe(b)}),We(()=>g.current());var v=me(),y=te(v);{var w=b=>{var E=Lg(),x=D(E),S=D(x);{var k=U=>{var B=me(),R=te(B);{var O=ie=>{var re=Su(),Z=D(re);Ct(Z,{className:"fill-current"}),T(re),we("click",re,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(ie,re)},M=ie=>{var re=Nu(),Z=D(re);$t(Z,{className:"fill-current"}),T(re),we("click",re,()=>e.diffFile.onSplitHunkExpand("down",e.index)),C(ie,re)},ee=ie=>{var re=Cu(),Z=D(re);Sn(Z,{className:"fill-current"}),T(re),we("click",re,()=>e.diffFile.onSplitHunkExpand("all",e.index)),C(ie,re)},ae=ie=>{var re=$u(),Z=te(re),oe=D(Z);$t(oe,{className:"fill-current"}),T(Z);var ue=J(Z,2),pe=D(ue);Ct(pe,{className:"fill-current"}),T(ue),we("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",ue,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(ie,re)};Q(R,ie=>{a(c)?ie(O):a(p)?ie(M,1):a(l)?ie(ee,2):ie(ae,-1)})}C(U,B)},h=U=>{var B=Tu();C(U,B)};Q(S,U=>{a(o)?U(k):U(h,-1)})}T(x);var m=J(x),A=D(m),N=Le(A,!0);T(m);var $=J(m),P=D($);{var X=U=>{var B=me(),R=te(B);{var O=ie=>{var re=Su(),Z=D(re);Ct(Z,{className:"fill-current"}),T(re),we("click",re,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(ie,re)},M=ie=>{var re=Nu(),Z=D(re);$t(Z,{className:"fill-current"}),T(re),we("click",re,()=>e.diffFile.onSplitHunkExpand("down",e.index)),C(ie,re)},ee=ie=>{var re=Cu(),Z=D(re);Sn(Z,{className:"fill-current"}),T(re),we("click",re,()=>e.diffFile.onSplitHunkExpand("all",e.index)),C(ie,re)},ae=ie=>{var re=$u(),Z=te(re),oe=D(Z);$t(oe,{className:"fill-current"}),T(Z);var ue=J(Z,2),pe=D(ue);Ct(pe,{className:"fill-current"}),T(ue),we("click",Z,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",ue,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(ie,re)};Q(R,ie=>{a(c)?ie(O):a(p)?ie(M,1):a(l)?ie(ee,2):ie(ae,-1)})}C(U,B)},z=U=>{var B=Tu();C(U,B)};Q(P,U=>{a(o)?U(X):U(z,-1)})}T($);var q=J($),Y=D(q),ve=Le(Y,!0);T(q),T(E),K(()=>{G(E,"data-line",`${e.lineNumber}-hunk`),V(x,`
				background-color: var(${Wn});
				color: var(${ct})
			`),V(m,`background-color: var(${fn})`),V(A,`
					color: var(${zn})
				`),$e(N,a(i)?.splitInfo?.plainText||a(i)?.text),V($,`
				background-color: var(${Wn});
				color: var(${ct});
				border-left-color: var(${_n});
				border-left-style: solid
			`),V(q,`background-color: var(${fn})`),V(Y,`
					color: var(${zn})
				`),$e(ve,a(i)?.splitInfo?.plainText||a(i)?.text)}),C(b,E)};Q(y,b=>{(a(u)||a(f))&&b(w)})}C(t,v),fe()}ot(["click"]);var kg=new Set(["$$slots","$$events","$$legacy"]);function Zs(t,e){de(e,!0);let n=he(e,kg),i=I(Ys());var r=me(),o=te(r);{var s=d=>{Ul(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Gl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};Q(o,d=>{a(i)===jt.SplitGitHub||a(i)===jt.Split?d(s):d(l,-1)})}C(t,r),fe()}var Ig=new Set(["$$slots","$$events","$$legacy"]),Sg=j('<td class="diff-line-widget-old-content p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Ng=j('<td class="diff-line-widget-old-placeholder select-none p-0"></td>'),Cg=j('<td class="diff-line-widget-new-content border-l-[1px] p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),$g=j('<td class="diff-line-widget-new-placeholder select-none border-l-[1px] p-0"></td>'),Tg=j('<tr data-state="widget" class="diff-line diff-line-widget"><!><!></tr>');function zl(t,e){de(e,!0);let n=he(e,Ig),i=I(Zr()),r=I(kn()),o=I(()=>e.diffFile.getSplitLeftLine(e.index)),s=I(()=>e.diffFile.getSplitRightLine(e.index)),l=I(()=>a(o)?.lineNumber&&a(r)?.side===H.old&&a(r)?.lineNumber===a(o)?.lineNumber),d=I(()=>a(s)?.lineNumber&&a(r)?.side===H.new&&a(r)?.lineNumber===a(s)?.lineNumber),u=I(()=>(!!a(l)||!!a(d))&&!a(o)?.isHidden&&!a(s)?.isHidden&&!!a(i)),c=()=>{a(r).side=void 0,a(r).lineNumber=void 0};var f=me(),p=te(f);{var g=v=>{var y=Tg(),w=D(y);{var b=h=>{var m=Sg();G(m,"colspan",2);var A=D(m),N=D(A);Bt(N,()=>a(i),()=>({diffFile:e.diffFile,side:H.old,lineNumber:a(o)?.lineNumber||0,onClose:c})),T(A),T(m),C(h,m)},E=h=>{var m=Ng();G(m,"colspan",2),K(()=>V(m,`background-color: var(${Kt})`)),C(h,m)};Q(w,h=>{a(l)&&a(i)?h(b):h(E,-1)})}var x=J(w);{var S=h=>{var m=Cg();G(m,"colspan",2);var A=D(m),N=D(A);Bt(N,()=>a(i)??ht,()=>({diffFile:e.diffFile,side:H.new,lineNumber:a(s)?.lineNumber||0,onClose:c})),T(A),T(m),K(()=>V(m,`border-left-color: var(${_n}); border-left-style: solid `)),C(h,m)},k=h=>{var m=$g();G(m,"colspan",2),K(()=>V(m,`
					background-color: var(${Kt});
					border-left-color: var(${_n});
					border-left-style: solid;
				`)),C(h,m)};Q(x,h=>{a(d)&&a(i)?h(S):h(k,-1)})}T(y),K(()=>G(y,"data-line",`${e.lineNumber}-widget`)),C(v,y)};Q(p,v=>{a(u)&&v(g)})}C(t,f),fe()}var Dg=new Set(["$$slots","$$events","$$legacy"]),Fg=j("<!> <!> <!> <!>",1),Mg=j('<div class="split-diff-view split-diff-view-warp w-full"><div class="diff-table-wrapper w-full"><style data-select-style=""></style> <table class="diff-table w-full table-fixed border-collapse border-spacing-0"><colgroup><col class="diff-table-old-num-col"/><col class="diff-table-old-content-col"/><col class="diff-table-new-num-col"/><col class="diff-table-new-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">old line number</th><th scope="col">old line content</th><th scope="col">new line number</th><th scope="col">new line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Wl(t,e){de(e,!0);let n=he(e,Dg),i=()=>us(e.diffFile),r=ce(Ee(i())),o={current:void 0},s=ce(void 0),l=I(()=>Math.max(e.diffFile.splitLineLength,e.diffFile.fileLineLength).toString()),d=I(Xr()),u=I(()=>({fontSize:`${a(d)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),c={current:()=>{}};ye(()=>{c.current();let N=()=>ne(r,i(),!0);N(),c.current=e.diffFile.subscribe(N)}),We(()=>c.current());let f=N=>{let $=a(s);if($)if(N){let P=N===H.old?H.new:H.old;$.textContent=`#diff-root${e.diffFile.getId()} [data-side="${H[P]}"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="extend"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="hunk"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="widget"] {user-select: none}`}else $.textContent=""},p=N=>{let $=N.target;if($&&$ instanceof HTMLElement&&$.nodeName==="BUTTON"){In();return}let P=so($);if(!(P&&P!==`diff-root${e.diffFile.getId()}`))for(;$&&$ instanceof HTMLElement;){let X=$.getAttribute("data-state"),z=$.getAttribute("data-side");if(z&&o.current!==H[z]&&(o.current=H[z],f(H[z]),In()),X)if(X==="extend"||X==="hunk"||X==="widget"){o.current!==void 0&&(o.current=void 0,f(void 0),In());return}else return;$=$.parentElement}},g=I(oo({text:()=>a(l),font:()=>a(u)})),v=I(()=>Math.max(40,a(g)+25));var y=Mg(),w=D(y),b=D(w);lt(b,()=>N=>ne(s,N,!0));var E=J(b,2),x=D(E),S=D(x),k=J(S,2);er(),T(x);var h=J(x,2),m=D(h);di(m,17,()=>a(r),li,(N,$)=>{var P=Fg(),X=te(P);Zs(X,{get index(){return a($).index},get lineNumber(){return a($).lineNumber},get diffFile(){return e.diffFile}});var z=J(X,2);Pl(z,{get index(){return a($).index},get lineNumber(){return a($).lineNumber},get diffFile(){return e.diffFile}});var q=J(z,2);zl(q,{get index(){return a($).index},get lineNumber(){return a($).lineNumber},get diffFile(){return e.diffFile}});var Y=J(q,2);jl(Y,{get index(){return a($).index},get lineNumber(){return a($).lineNumber},get diffFile(){return e.diffFile}}),C(N,P)});var A=J(m);Zs(A,{get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),T(h),T(E),T(w),T(y),K((N,$,P)=>{V(w,N),G(S,"width",$),G(k,"width",P)},[()=>`
			${Te}: ${Math.round(a(v))}px;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`,()=>Math.round(a(v)),()=>Math.round(a(v))]),we("mousedown",h,p),C(t,y),fe()}ot(["mousedown"]);var Hg=new Set(["$$slots","$$events","$$legacy"]),Bg=j("<td><!> <span> </span></td> <td><!></td>",1),Rg=j("<td><span>&ensp;</span></td>"),Og=j("<tr><!></tr>");function Vl(t,e){de(e,!0);let n=he(e,Hg),i=I(kn()),r=I(ro()),o=I(io()),s=I(no()),l=I(()=>e.side===H.old?e.diffFile.getSplitLeftLine(e.index):e.diffFile.getSplitRightLine(e.index)),d=I(()=>!!a(l)?.diff),u=I(()=>Zi(a(l)?.diff)),c=I(()=>a(l)?.isHidden),f=I(()=>!!a(l)?.lineNumber),p=()=>e.side===H.old?e.diffFile.getOldSyntaxLine(a(l)?.lineNumber||0):e.diffFile.getNewSyntaxLine(a(l)?.lineNumber||0),g=()=>e.side===H.old?e.diffFile.getOldPlainLine(a(l)?.lineNumber||0):e.diffFile.getNewPlainLine(a(l)?.lineNumber||0),v=ce(Ee(p())),y=ce(Ee(g())),w=()=>{ne(v,p(),!0),ne(y,g(),!0)},b={current:()=>{}};ye(()=>{b.current(),w(),b.current=e.diffFile.subscribe(w)}),We(()=>b.current());let E=(A,N)=>{a(i).side=N,a(i).lineNumber=A},x=()=>a(l)?.diff?.type===Fe.Add,S=()=>a(l)?.diff?.type===Fe.Delete;var k=me(),h=te(k);{var m=A=>{var N=Og(),$=D(N);{var P=z=>{var q=Bg(),Y=te(q),ve=D(Y);{var U=ee=>{{let ae=I(()=>a(l)?.lineNumber||0);Ri(ee,{get index(){return e.index},get lineNumber(){return a(ae)},get side(){return e.side},get diffFile(){return e.diffFile},get onWidgetClick(){return a(s)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:E})}};Q(ve,ee=>{a(d)&&a(r)&&ee(U)})}var B=J(ve,2),R=Le(B,!0);T(Y);var O=J(Y,2),M=D(O);{let ee=I(()=>a(l)?.value||""),ae=I(()=>a(l)?.diff),ie=I(()=>!!a(o));ci(M,{enableWrap:!1,get diffFile(){return e.diffFile},get rawLine(){return a(ee)},get diffLine(){return a(ae)},get plainLine(){return a(y)},get syntaxLine(){return a(v)},get enableHighlight(){return a(ie)}})}T(O),K((ee,ae)=>{Se(Y,1,`diff-line-${H[e.side]}-num sticky left-0 z-[1] w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top`),V(Y,ee),G(B,"data-line-num",a(l)?.lineNumber),V(B,` opacity: ${a(u)?void 0:.5} `),$e(R,a(l)?.lineNumber),Se(O,1,`diff-line-${H[e.side]}-content pr-[10px] align-top`),V(O,ae)},[()=>`
					background-color: ${Ko(x(),S(),a(d))};
					color: var(${a(d)?ct:hr});
					width: var(${Te});
					min-width: var(${Te});
					max-width: var(${Te})
				`,()=>` background-color: ${qo(x(),S(),a(d))} `]),C(z,q)},X=z=>{var q=Rg();G(q,"colspan",2),K(()=>{Se(q,1,`diff-line-${H[e.side]}-placeholder select-none`),V(q,`background-color: var(${Kt}) `)}),C(z,q)};Q($,z=>{a(f)?z(P):z(X,-1)})}T(N),K(()=>{G(N,"data-line",e.lineNumber),G(N,"data-state",a(d)||!a(f)?"diff":"plain"),G(N,"data-side",H[e.side]),Se(N,1,"diff-line"+(a(f)?" group":""))}),C(A,N)};Q(h,A=>{a(c)||A(m)})}C(t,k),fe()}var Oi=({selector:t,enable:e})=>{let n=I(Vs()),i=I(Qs()),r=I(fi()),o=ce(0),s={current:()=>{}},l=()=>{if(a(r)&&e()){let c=Js(a(i)).querySelector(`#diff-root${a(n)}`)?.querySelector(t());if(!c)return;let f=c,p=()=>{let y=c?.getBoundingClientRect();ne(o,y?.width??0,!0)};p();let g=()=>{f?.__observeCallback?.delete(p),f?.__observeCallback?.size===0&&(f.__observeInstance?.disconnect(),f.removeAttribute("data-observe"),delete f.__observeCallback,delete f.__observeInstance)};if(f.__observeCallback){f.__observeCallback.add(p),s.current=()=>g();return}f.__observeCallback=new Set,f.__observeCallback.add(p);let v=new ResizeObserver(()=>f?.__observeCallback?.forEach(y=>y()));f.__observeInstance=v,v.observe(f),f.setAttribute("data-observe","height"),s.current=()=>g()}};return ye(()=>(l(),()=>s.current?.())),()=>a(o)};var Pi=({selector:t,wrapper:e,side:n,enable:i})=>{let r=I(Vs()),o=I(Qs()),s=I(fi()),l={current:()=>{}},d=()=>{if(a(s)&&i()){let u=()=>{},f=Js(a(o)).querySelector(`#diff-root${a(r)}`),p=Array.from(f?.querySelectorAll(t())||[]),g=e()?Array.from(f?.querySelectorAll(e())||[]):p;if(p.length===2&&g.length===2){let v=p[0],y=p[1],w=g[0],b=g[1],E=v.getAttribute("data-side")===n()?v:y,x=E,S=()=>{v.style.height="auto",y.style.height="auto";let m=v.getBoundingClientRect(),A=y.getBoundingClientRect(),N=Math.max(m.height,A.height);w.style.height=N+"px",b.style.height=N+"px",w.setAttribute("data-sync-height",String(N)),b.setAttribute("data-sync-height",String(N))};S();let k=()=>{x.__observeCallback?.delete(S),x.__observeCallback?.size===0&&(x.__observeInstance?.disconnect(),E.removeAttribute("data-observe"),delete x.__observeCallback,delete x.__observeInstance)};if(x.__observeCallback){x.__observeCallback.add(S),u=k;return}x.__observeCallback=new Set,x.__observeCallback.add(S);let h=new ResizeObserver(()=>x.__observeCallback?.forEach(m=>m()));x.__observeInstance=h,h.observe(E),E.setAttribute("data-observe","height"),u=k}l.current=u}};ye(()=>(d(),()=>l.current?.()))};var Pg=new Set(["$$slots","$$events","$$legacy"]),jg=j('<td><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!></div></td>'),Ug=j("<td><div></div></td>"),Gg=j('<tr data-state="extend" class="diff-line diff-line-extend"><!></tr>');function Ql(t,e){de(e,!0);let n=he(e,Pg),i=ce(null),r=I(eo()),o=I(to()),s=I(()=>`div[data-line="${e.lineNumber}-extend-content"]`),l=I(()=>`tr[data-line="${e.lineNumber}-extend"]`),d=I(()=>e.side===H.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),u=I(()=>e.diffFile.getSplitLeftLine(e.index)),c=I(()=>e.diffFile.getSplitRightLine(e.index)),f=I(()=>e.diffFile.getExpandEnabled()),p=I(()=>a(r)?.oldFile?.[a(u)?.lineNumber||""]),g=I(()=>a(r)?.newFile?.[a(c)?.lineNumber||""]),v=I(()=>e.side===H.old?a(u):a(c)),y=I(()=>a(v)?.isHidden),w=I(()=>e.side===H.old?a(p):a(g)),b=I(()=>e.side===H.old?a(u)?.lineNumber:a(c)?.lineNumber),E=I(()=>!!((a(p)||a(g))&&(!a(y)||a(f))&&a(o))),x=I(()=>(e.side===H.old?!!a(p):!!a(g))&&a(E)),S=I(()=>H[a(w)?e.side:e.side===H.new?H.old:H.new]);Pi({selector:()=>a(s),wrapper:()=>a(l),side:()=>a(S),enable:()=>!!(a(E)&&a(i))});let k=I(Oi({selector:()=>a(d),enable:()=>!!(a(x)&&a(i))}));var h=me(),m=te(h);{var A=N=>{var $=Gg(),P=D($);{var X=q=>{var Y=jg();G(Y,"colspan",2);var ve=D(Y),U=D(ve);{var B=R=>{var O=me(),M=te(O);Bt(M,()=>a(o)??ht,()=>({diffFile:e.diffFile,side:e.side,lineNumber:a(b)||0,data:a(w)?.data,onUpdate:e.diffFile.notifyAll})),C(R,O)};Q(U,R=>{a(k)>0&&R(B)})}T(ve),T(Y),K(()=>{Se(Y,1,`diff-line-extend-${H[e.side]}-content p-0`),G(ve,"data-line",`${e.lineNumber}-extend-content`),G(ve,"data-side",H[e.side]),V(ve,` width: ${a(k)}px `)}),C(q,Y)},z=q=>{var Y=Ug();G(Y,"colspan",2);var ve=Le(Y);K(()=>{Se(Y,1,`diff-line-extend-${H[e.side]}-placeholder select-none p-0`),V(Y,` background-color: var(${Kt})`),G(ve,"data-line",`${e.lineNumber}-extend-content`),G(ve,"data-side",H[e.side])}),C(q,Y)};Q(P,q=>{a(o)&&a(w)?q(X):q(z,-1)})}T($),lt($,()=>q=>ne(i,q,!0)),K(()=>{G($,"data-line",`${e.lineNumber}-extend`),G($,"data-side",H[e.side])}),C(N,$)};Q(m,N=>{a(E)&&N(A)})}C(t,h),fe()}var zg=new Set(["$$slots","$$events","$$legacy"]),Wg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Vg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Qg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Yg=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Jg=j('<div class="min-h-[28px]">&ensp;</div>'),qg=j('<td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td> <td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td>',1),Kg=j('<td class="diff-line-hunk-placeholder select-none"><div class="min-h-[28px]">&ensp;</div></td>'),Xg=j('<tr data-state="hunk" class="diff-line diff-line-hunk"><!></tr>');function Yl(t,e){de(e,!0);let n=he(e,zg),i=ce(null),r=I(()=>e.diffFile.getSplitHunkLine(e.index)),o=I(()=>e.diffFile.getExpandEnabled()),s=I(()=>a(o)&&a(r)?.splitInfo),l=I(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=I(()=>e.side===H.old),u=()=>{let h=a(r);return h&&h.splitInfo&&h.splitInfo.endHiddenIndex-h.splitInfo.startHiddenIndex<je},c=ce(Ee(u())),f=()=>{let h=a(r);return h&&h.splitInfo&&h.splitInfo.startHiddenIndex<h.splitInfo.endHiddenIndex},p=ce(Ee(f())),g=I(()=>{let h=a(r);return h&&h.isFirst}),v=I(()=>{let h=a(r);return h&&e.diffFile._getIsPureDiffRender()&&!h.splitInfo}),y=I(()=>{let h=a(r);return h&&h.isLast}),w={current:()=>{}};ye(()=>{w.current();let h=()=>{ne(p,f(),!0),ne(c,u(),!0)};h(),w.current=e.diffFile.subscribe(h)}),We(()=>w.current());let b=I(()=>H[H.old]),E=I(()=>e.side===H.new&&(!!a(p)||a(v)));Pi({selector:()=>a(l),wrapper:()=>a(l),side:()=>a(b),enable:()=>!!(a(E)&&a(i))});var x=me(),S=te(x);{var k=h=>{var m=Xg(),A=D(m);{var N=P=>{var X=qg(),z=te(X),q=D(z);{var Y=O=>{var M=me(),ee=te(M);{var ae=oe=>{var ue=Wg(),pe=D(ue);Ct(pe,{className:"fill-current"}),T(ue),we("click",ue,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(oe,ue)},ie=oe=>{var ue=Vg(),pe=D(ue);$t(pe,{className:"fill-current"}),T(ue),we("click",ue,()=>e.diffFile.onSplitHunkExpand("down",e.index)),C(oe,ue)},re=oe=>{var ue=Qg(),pe=D(ue);Sn(pe,{className:"fill-current"}),T(ue),we("click",ue,()=>e.diffFile.onSplitHunkExpand("all",e.index)),C(oe,ue)},Z=oe=>{var ue=Yg(),pe=te(ue),He=D(pe);$t(He,{className:"fill-current"}),T(pe);var xe=J(pe,2),ke=D(xe);Ct(ke,{className:"fill-current"}),T(xe),we("click",pe,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",xe,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(oe,ue)};Q(ee,oe=>{a(g)?oe(ae):a(y)?oe(ie,1):a(c)?oe(re,2):oe(Z,-1)})}C(O,M)},ve=O=>{var M=Jg();C(O,M)};Q(q,O=>{a(s)?O(Y):O(ve,-1)})}T(z);var U=J(z,2),B=D(U),R=Le(B,!0);T(U),K(()=>{V(z,`
					background-color: var(${Wn});
					color: var(${ct});
					width: var(${Te});
					min-width: var(${Te});
					max-width: var(${Te});
				`),V(U,`background-color: var(${fn})`),V(B,`
						color: var(${zn})
					`),$e(R,a(r)?.splitInfo?.plainText||a(r)?.text)}),C(P,X)},$=P=>{var X=Kg();G(X,"colspan",2),K(()=>V(X,`background-color: var(${fn})`)),C(P,X)};Q(A,P=>{a(d)?P(N):P($,-1)})}T(m),lt(m,()=>P=>ne(i,P,!0)),K(()=>{G(m,"data-line",`${e.lineNumber}-hunk`),G(m,"data-side",H[e.side]),V(m,`background-color: var(${fn})`)}),C(h,m)};Q(S,h=>{(a(p)||a(v))&&h(k)})}C(t,x),fe()}ot(["click"]);var Zg=new Set(["$$slots","$$events","$$legacy"]),ev=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),tv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),nv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),iv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),rv=j('<div class="min-h-[28px]">&ensp;</div>'),ov=j('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Jl(t,e){de(e,!0);let n=he(e,Zg),i=ce(null),r=I(()=>e.diffFile.getSplitHunkLine(e.index)),o=I(()=>e.diffFile.getExpandEnabled()),s=I(()=>a(o)&&a(r)?.splitInfo),l=I(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=()=>{let k=a(r);return k&&k.splitInfo&&k.splitInfo.endHiddenIndex-k.splitInfo.startHiddenIndex<je},u=ce(Ee(d())),c=()=>{let k=a(r);return k&&k.splitInfo&&k.splitInfo.startHiddenIndex<k.splitInfo.endHiddenIndex},f=ce(Ee(c())),p=I(()=>{let k=a(r);return k&&k.isFirst}),g=I(()=>{let k=a(r);return k&&e.diffFile._getIsPureDiffRender()&&!k.splitInfo}),v=I(()=>{let k=a(r);return k&&k.isLast}),y=I(()=>H[H.old]),w=I(()=>e.side===H.new&&(!!a(f)||a(g))),b={current:()=>{}};ye(()=>{b.current();let k=()=>{ne(f,c(),!0),ne(u,d(),!0)};k(),b.current=e.diffFile.subscribe(k)}),We(()=>b.current()),Pi({selector:()=>a(l),wrapper:()=>a(l),side:()=>a(y),enable:()=>!!(a(w)&&a(i))});var E=me(),x=te(E);{var S=k=>{var h=ov(),m=D(h),A=D(m);{var N=q=>{var Y=me(),ve=te(Y);{var U=M=>{var ee=ev(),ae=D(ee);Ct(ae,{className:"fill-current"}),T(ee),we("click",ee,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(M,ee)},B=M=>{var ee=tv(),ae=D(ee);$t(ae,{className:"fill-current"}),T(ee),we("click",ee,()=>e.diffFile.onSplitHunkExpand("down",e.index)),C(M,ee)},R=M=>{var ee=nv(),ae=D(ee);Sn(ae,{className:"fill-current"}),T(ee),we("click",ee,()=>e.diffFile.onSplitHunkExpand("all",e.index)),C(M,ee)},O=M=>{var ee=iv(),ae=te(ee),ie=D(ae);$t(ie,{className:"fill-current"}),T(ae);var re=J(ae,2),Z=D(re);Ct(Z,{className:"fill-current"}),T(re),we("click",ae,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",re,()=>e.diffFile.onSplitHunkExpand("up",e.index)),C(M,ee)};Q(ve,M=>{a(p)?M(U):a(v)?M(B,1):a(u)?M(R,2):M(O,-1)})}C(q,Y)},$=q=>{var Y=rv();C(q,Y)};Q(A,q=>{a(s)?q(N):q($,-1)})}T(m);var P=J(m),X=D(P),z=Le(X,!0);T(P),T(h),lt(h,()=>q=>ne(i,q,!0)),K(()=>{G(h,"data-line",`${e.lineNumber}-hunk`),G(h,"data-side",H[e.side]),V(h,`background-color: var(${fn})`),V(m,`
				background-color: var(${Wn});
				color: var(${ct});
				width: var(${Te});
				min-width: var(${Te});
				max-width: var(${Te})
			`),V(P,`background-color: var(${fn})`),V(X,`
					color: var(${zn})
				`),$e(z,a(r)?.splitInfo?.plainText||a(r)?.text)}),C(k,h)};Q(x,k=>{(a(f)||a(g))&&k(S)})}C(t,E),fe()}ot(["click"]);var sv=new Set(["$$slots","$$events","$$legacy"]);function ea(t,e){de(e,!0);let n=he(e,sv),i=I(Ys());var r=me(),o=te(r);{var s=d=>{Yl(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Jl(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};Q(o,d=>{a(i)===jt.SplitGitHub||a(i)===jt.Split?d(s):d(l,-1)})}C(t,r),fe()}var av=new Set(["$$slots","$$events","$$legacy"]),lv=j('<td><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!></div></td>'),dv=j("<td><div></div></td>"),fv=j('<tr data-state="widget" class="diff-line diff-line-widget"><!></tr>');function ql(t,e){de(e,!0);let n=he(e,av),i=ce(null),r=I(Zr()),o=I(kn()),s=I(()=>e.diffFile.getSplitLeftLine(e.index)),l=I(()=>e.diffFile.getSplitRightLine(e.index)),d=I(()=>!!a(s)?.lineNumber&&a(o)?.side===H.old&&a(o)?.lineNumber===a(s)?.lineNumber),u=I(()=>!!a(l)?.lineNumber&&a(o)?.side===H.new&&a(o)?.lineNumber===a(l)?.lineNumber),c=I(()=>e.side===H.old?a(s):a(l)),f=I(()=>a(c)?.isHidden),p=I(()=>`div[data-line="${e.lineNumber}-widget-content"]`),g=I(()=>`tr[data-line="${e.lineNumber}-widget"]`),v=I(()=>e.side===H.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),y=I(()=>e.side===H.old?a(d):a(u)),w=I(()=>H[a(y)?e.side:e.side===H.old?H.new:H.old]),b=I(()=>(!!a(d)||!!a(u))&&!a(f)&&!!a(r)),E=I(()=>a(y)&&!!a(b)),x=()=>{a(o).side=void 0,a(o).lineNumber=void 0};Pi({selector:()=>a(p),wrapper:()=>a(g),side:()=>a(w),enable:()=>!!(a(b)&&a(i))});let S=I(Oi({selector:()=>a(v),enable:()=>!!(a(E)&&a(i))}));var k=me(),h=te(k);{var m=A=>{var N=fv(),$=D(N);{var P=z=>{var q=lv();G(q,"colspan",2);var Y=D(q),ve=D(Y);{var U=B=>{var R=me(),O=te(R);Bt(O,()=>a(r),()=>({diffFile:e.diffFile,side:e.side,lineNumber:a(c)?.lineNumber||0,onClose:x})),C(B,R)};Q(ve,B=>{a(S)>0&&B(U)})}T(Y),T(q),K(()=>{Se(q,1,`diff-line-widget-${H[e.side]}-content p-0`),G(Y,"data-line",`${e.lineNumber}-widget-content`),G(Y,"data-side",H[e.side]),V(Y,` width: ${a(S)}px `)}),C(z,q)},X=z=>{var q=dv();G(q,"colspan",2);var Y=Le(q);K(()=>{Se(q,1,`diff-line-widget-${H[e.side]}-placeholder select-none p-0`),V(q,`background-color: var(${Kt})`),G(Y,"data-line",`${e.lineNumber}-widget-content`),G(Y,"data-side",H[e.side])}),C(z,q)};Q($,z=>{a(y)?z(P):z(X,-1)})}T(N),lt(N,()=>z=>ne(i,z,!0)),K(()=>{G(N,"data-line",`${e.lineNumber}-widget`),G(N,"data-side",H[e.side])}),C(A,N)};Q(h,A=>{a(b)&&A(m)})}C(t,k),fe()}var cv=new Set(["$$slots","$$events","$$legacy"]),uv=j("<!> <!> <!> <!>",1),pv=j('<table><colgroup><col/><col/></colgroup><thead class="hidden"><tr><th scope="col"> </th><th scope="col"> </th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table>');function ta(t,e){de(e,!0);let n=he(e,cv),i=I(()=>e.side===H.new?"new-diff-table":"old-diff-table"),r=()=>us(e.diffFile),o=ce(Ee(r())),s={current:()=>{}},l=e.selectState;ye(()=>{s.current();let h=()=>ne(o,r(),!0);h(),s.current=e.diffFile.subscribe(h)}),We(()=>s.current());let d=h=>{let m=h.target;if(m&&m?.nodeName==="BUTTON"){In();return}let A=so(m);if(!(A&&A!==`diff-root${e.diffFile.getId()}`))for(;m&&m instanceof HTMLElement;){let N=m.getAttribute("data-state");if(N){N==="extend"||N==="hunk"||N==="widget"?l.current!==void 0&&(l.current=void 0,e.onSelect?.(void 0),In()):l.current!==e.side&&(l.current=n.side,e.onSelect?.(e.side),In());return}m=m.parentElement}};var u=pv(),c=D(u),f=D(c),p=J(f);T(c);var g=J(c),v=D(g),y=D(v),w=Le(y),b=J(y),E=Le(b);T(v),T(g);var x=J(g),S=D(x);di(S,17,()=>a(o),li,(h,m)=>{var A=uv(),N=te(A);ea(N,{get index(){return a(m).index},get side(){return e.side},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}});var $=J(N,2);Vl($,{get index(){return a(m).index},get side(){return e.side},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}});var P=J($,2);ql(P,{get index(){return a(m).index},get side(){return e.side},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}});var X=J(P,2);Ql(X,{get index(){return a(m).index},get side(){return e.side},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}}),C(h,A)});var k=J(S);ea(k,{get side(){return e.side},get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),T(x),T(u),K(()=>{Se(u,1,`${a(i)} w-full border-collapse border-spacing-0`),G(u,"data-mode",H[e.side]),Se(f,1,`diff-table-${H[e.side]}-num-col`),Se(p,1,`diff-table-${H[e.side]}-content-col`),$e(w,`${H[e.side]??""} line number`),$e(E,`${H[e.side]??""} line content`)}),we("mousedown",x,d),C(t,u),fe()}ot(["mousedown"]);var hv=new Set(["$$slots","$$events","$$legacy"]),mv=j('<div class="split-diff-view split-diff-view-normal flex w-full basis-[50%]"><style data-select-style=""></style> <div class="old-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div> <div class="diff-split-line w-[1.5px]"></div> <div class="new-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div></div>');function Kl(t,e){de(e,!0);let n=he(e,hv),i=I(fi()),r=ce(void 0),o=ce(void 0),s=ce(null),l=I(()=>Math.max(e.diffFile.fileLineLength,e.diffFile.splitLineLength).toString()),d={current:()=>{}},u={current:void 0};ye(()=>{if(d.current(),!a(i))return;let A=a(r),N=a(o);!A||!N||(d.current=Au(A,N))}),We(()=>d.current());let f=A=>{let N=a(s);N&&(A?N.textContent=`#${w()} [data-state="extend"] {user-select: none} 
#${w()} [data-state="hunk"] {user-select: none} 
#${w()} [data-state="widget"] {user-select: none}`:N.textContent="")},p=I(Xr()),g=I(()=>({fontSize:`${a(p)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),v=I(oo({text:()=>a(l),font:()=>a(g)})),y=I(()=>Math.max(40,a(v)+25)),w=()=>`diff-split-view-${e.diffFile.getId()}`;var b=mv(),E=D(b);lt(E,()=>A=>ne(s,A,!0));var x=J(E,2),S=D(x);ta(S,{get side(){return H.old},get diffFile(){return e.diffFile},onSelect:f,get selectState(){return u}}),T(x),lt(x,()=>A=>{ne(r,A,!0)});var k=J(x,2),h=J(k,2),m=D(h);ta(m,{get side(){return H.new},get diffFile(){return e.diffFile},onSelect:f,get selectState(){return u}}),T(h),lt(h,()=>A=>{ne(o,A,!0)}),T(b),K((A,N)=>{V(x,A),V(k,`background-color: var(${_n})`),V(h,N)},[()=>`
      ${Te}: ${Math.round(a(y))}px;
      overscroll-behavior-x: none;
      font-family: Menlo, Consolas, monospace;
      font-size: var(${nt});
    `,()=>`
			${Te}: ${Math.round(a(y))}px;
			overscroll-behavior-x: none;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`]),C(t,b),fe()}var gv=new Set(["$$slots","$$events","$$legacy"]);function Xl(t,e){de(e,!0);let n=he(e,gv),i=I(Ln());var r=me(),o=te(r);{var s=d=>{Wl(d,{get diffFile(){return e.diffFile}})},l=d=>{Kl(d,{get diffFile(){return e.diffFile}})};Q(o,d=>{a(i)?d(s):d(l,-1)})}C(t,r),fe()}var vv=new Set(["$$slots","$$events","$$legacy"]),_v=j('<div class="diff-add-widget-wrapper invisible absolute left-[100%] translate-x-[-50%] select-none transition-transform hover:scale-110 group-hover:visible"><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function es(t,e){de(e,!0);let n=he(e,vv);var i=_v(),r=Le(i);K(()=>{G(i,"data-add-widget",H[e.side]),V(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),V(r,`
			color: var(${Xs});
			background-color: var(${Ks});
		`)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),C(t,i),fe()}ot(["mousedown"]);var bv=new Set(["$$slots","$$events","$$legacy"]),wv=j('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"></span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),xv=j('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"></span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),yv=j("<!> <!>",1),Ev=j('<tr class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex opacity-[0.5]"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>');function Zl(t,e){de(e,!0);let n=he(e,bv),i=I(()=>e.diffFile.getUnifiedLine(e.index)),r=I(Ln()),o=I(kn()),s=I(no()),l=I(io()),d=I(ro()),u=I(()=>a(i)?.isHidden),c=I(()=>Zi(a(i)?.diff)),f=()=>a(i)?.newLineNumber?e.diffFile.getNewSyntaxLine(a(i)?.newLineNumber||0):a(i)?.oldLineNumber?e.diffFile.getOldSyntaxLine(a(i)?.oldLineNumber||0):void 0,p=ce(Ee(f())),g=()=>a(i)?.newLineNumber?e.diffFile.getNewPlainLine(a(i)?.newLineNumber||0):a(i)?.oldLineNumber?e.diffFile.getOldPlainLine(a(i)?.oldLineNumber||0):void 0,v=ce(Ee(g())),y={current:()=>{}};ye(()=>{y?.current?.();let S=()=>{ne(p,f(),!0),ne(v,g(),!0)};S(),y.current=e.diffFile.subscribe(S)}),We(()=>y.current());let w=(S,k)=>{a(o).side=k,a(o).lineNumber=S};var b=me(),E=te(b);{var x=S=>{var k=me(),h=te(k);{var m=N=>{let $=(U,B=ht)=>{var R=wv(),O=D(R),M=D(O);{var ee=ue=>{{let pe=I(()=>B().index-1);es(ue,{get index(){return a(pe)},get lineNumber(){return B().lineNumber},get diffFile(){return B().diffFile},get side(){return H.old},get onWidgetClick(){return B().onAddWidgetClick},get onOpenAddWidget(){return B().onOpenAddWidget}})}};Q(M,ue=>{B().enableAddWidget&&ue(ee)})}var ae=J(M,2),ie=D(ae),re=Le(ie,!0);er(4),T(ae),T(O);var Z=J(O),oe=D(Z);ci(oe,{get enableWrap(){return B().enableWrap},get diffFile(){return B().diffFile},get enableHighlight(){return B().enableHighlight},get rawLine(){return B().rawLine},get diffLine(){return B().diffLine},get plainLine(){return B().plainLine},get syntaxLine(){return B().syntaxLine}}),T(Z),T(R),K(()=>{G(R,"data-line",B().index),V(O,`
          color: var(${ct});
          background-color: var(${Hl});
          width: calc(calc(var(${Te}) + 5px) * 2);
          max-width: calc(calc(var(${Te}) + 5px) * 2);
          min-width: calc(calc(var(${Te}) + 5px) * 2);
        `),G(ie,"data-line-old-num",B().lineNumber),$e(re,B().lineNumber),V(Z,`background-color: var(${Fl}) `)}),C(U,R)},P=(U,B=ht)=>{var R=xv(),O=D(R),M=D(O);{var ee=ue=>{{let pe=I(()=>B().index-1);es(ue,{get index(){return a(pe)},get lineNumber(){return B().lineNumber},get diffFile(){return B().diffFile},get side(){return H.new},get onWidgetClick(){return B().onAddWidgetClick},get onOpenAddWidget(){return B().onOpenAddWidget}})}};Q(M,ue=>{B().enableAddWidget&&ue(ee)})}var ae=J(M,2),ie=J(D(ae),4),re=Le(ie,!0);T(ae),T(O);var Z=J(O),oe=D(Z);ci(oe,{get enableWrap(){return B().enableWrap},get diffFile(){return B().diffFile},get enableHighlight(){return B().enableHighlight},get rawLine(){return B().rawLine},get diffLine(){return B().diffLine},get plainLine(){return B().plainLine},get syntaxLine(){return B().syntaxLine}}),T(Z),T(R),K(()=>{G(R,"data-line",B().index),V(O,`
          color: var(${ct});
          background-color: var(${Ml});
          width: calc(calc(var(${Te}) + 5px) * 2);
          max-width: calc(calc(var(${Te}) + 5px) * 2);
          min-width: calc(calc(var(${Te}) + 5px) * 2);
        `),G(ie,"data-line-new-num",B().lineNumber),$e(re,B().lineNumber),V(Z,` background-color: var(${Dl}) `)}),C(U,R)};var X=yv(),z=te(X);{var q=U=>{$(U,()=>({index:e.lineNumber,enableWrap:a(r),diffFile:e.diffFile,rawLine:a(i)?.value||"",diffLine:a(i)?.diff,plainLine:a(v),syntaxLine:a(p),enableHighlight:a(l),enableAddWidget:a(d),lineNumber:a(i).oldLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:a(s)}))};Q(z,U=>{a(i).oldLineNumber&&U(q)})}var Y=J(z,2);{var ve=U=>{P(U,()=>({index:e.lineNumber,enableWrap:a(r),diffFile:e.diffFile,rawLine:a(i)?.value||"",diffLine:a(i)?.diff,plainLine:a(v),syntaxLine:a(p),enableHighlight:a(l),enableAddWidget:a(d),lineNumber:a(i).newLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:a(s)}))};Q(Y,U=>{a(i).newLineNumber&&U(ve)})}C(N,X)},A=N=>{var $=Ev(),P=D($),X=D(P);{var z=M=>{{let ee=I(()=>a(i)?.newLineNumber||0);es(M,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return a(ee)},get side(){return H.new},onOpenAddWidget:w,get onWidgetClick(){return a(s)}})}};Q(X,M=>{a(d)&&a(i)?.diff&&M(z)})}var q=J(X,2),Y=D(q),ve=Le(Y,!0),U=J(Y,4),B=Le(U,!0);T(q),T(P);var R=J(P),O=D(R);{let M=I(()=>!!a(r)),ee=I(()=>!!a(l)),ae=I(()=>a(i)?.value||""),ie=I(()=>a(i)?.diff);ci(O,{get enableWrap(){return a(M)},get diffFile(){return e.diffFile},get enableHighlight(){return a(ee)},get rawLine(){return a(ae)},get diffLine(){return a(ie)},get plainLine(){return a(v)},get syntaxLine(){return a(p)}})}T(R),T($),K(()=>{G($,"data-line",e.lineNumber),G($,"data-state",a(i)?.diff?"diff":"plain"),V(P,`
					color: var(${a(i)?.diff?ct:hr});
					background-color: ${a(i)?.diff?`var(${Rl})`:`var(${qs})`};
					width: calc(calc(var(${Te}) + 5px) * 2);
					max-width: calc(calc(var(${Te}) + 5px) * 2);
					min-width: calc(calc(var(${Te}) + 5px) * 2;
				`),G(Y,"data-line-old-num",a(i)?.oldLineNumber||0),$e(ve,a(i)?.oldLineNumber||0),G(U,"data-line-new-num",a(i)?.newLineNumber||0),$e(B,a(i)?.newLineNumber||0),V(R,`
					background-color: ${a(i)?.diff?`var(${Bl})`:`var(${qs})`}
				`)}),C(N,$)};Q(h,N=>{a(c)?N(m):N(A,-1)})}C(S,k)};Q(E,S=>{a(u)||S(x)})}C(t,b),fe()}var Av=new Set(["$$slots","$$events","$$legacy"]),Lv=j('<tr data-state="extend" class="diff-line diff-line-extend"><td class="diff-line-extend-content p-0 align-top"><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function ed(t,e){de(e,!0);let n=he(e,Av),i=I(eo()),r=I(Ln()),o=I(to()),s=I(()=>e.diffFile.getUnifiedLine(e.index)),l=I(()=>a(i)?.oldFile?.[a(s)?.oldLineNumber||-1]),d=I(()=>a(i)?.newFile?.[a(s)?.newLineNumber||-1]),u=I(()=>a(s).isHidden),c=I(()=>!!((a(l)||a(d))&&a(u)&&a(o))),f=I(Oi({selector:()=>".unified-diff-table-wrapper",enable:()=>a(c)}));var p=me(),g=te(p);{var v=y=>{var w=Lv(),b=D(w);G(b,"colspan",2);var E=D(b),x=D(E);{var S=m=>{var A=me(),N=te(A);Bt(N,()=>a(o),()=>({diffFile:e.diffFile,side:H.old,data:a(l)?.data,lineNumber:a(s)?.oldLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),C(m,A)};Q(x,m=>{(a(r)||a(f)>0)&&a(l)&&a(o)&&m(S)})}var k=J(x,2);{var h=m=>{var A=me(),N=te(A);Bt(N,()=>a(o),()=>({diffFile:e.diffFile,side:H.new,data:a(d)?.data,lineNumber:a(s)?.newLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),C(m,A)};Q(k,m=>{(a(r)||a(f)>0)&&a(d)&&a(o)&&m(h)})}T(E),T(b),T(w),K(()=>{G(w,"data-line",`${e.lineNumber}-extend`),V(E,`width: ${a(f)}px `)}),C(y,w)};Q(g,y=>{a(c)&&y(v)})}C(t,p),fe()}var kv=new Set(["$$slots","$$events","$$legacy"]),Iv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Sv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Nv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Cv=j('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),$v=j('<div class="min-h-[28px]">&ensp;</div>'),Tv=j('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[100px] select-none"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function na(t,e){de(e,!0);let n=he(e,kv),i=I(()=>e.diffFile.getUnifiedHunkLine(e.index)),r=I(()=>e.diffFile.getExpandEnabled()),o=I(()=>a(r)&&a(i)&&a(i).unifiedInfo),s=I(Ln()),l=()=>a(i)&&a(i).unifiedInfo&&a(i).unifiedInfo.startHiddenIndex<a(i).unifiedInfo.endHiddenIndex,d=ce(Ee(l())),u=()=>a(i)&&a(i).unifiedInfo&&a(i).unifiedInfo.endHiddenIndex-a(i).unifiedInfo.startHiddenIndex<je,c=ce(Ee(u())),f=I(()=>a(i)&&a(i).isFirst),p=I(()=>a(i)&&a(i).isLast),g=I(()=>a(i)&&e.diffFile._getIsPureDiffRender()&&!a(i).unifiedInfo),v={current:()=>{}};ye(()=>{v?.current?.();let E=()=>{ne(d,l(),!0),ne(c,u(),!0)};E(),v.current=e.diffFile.subscribe(E)}),We(()=>v.current());var y=me(),w=te(y);{var b=E=>{var x=Tv(),S=D(x),k=D(S);{var h=P=>{var X=me(),z=te(X);{var q=B=>{var R=Iv(),O=D(R);Ct(O,{className:"fill-current"}),T(R),we("click",R,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),C(B,R)},Y=B=>{var R=Sv(),O=D(R);$t(O,{className:"fill-current"}),T(R),we("click",R,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),C(B,R)},ve=B=>{var R=Nv(),O=D(R);Sn(O,{className:"fill-current"}),T(R),we("click",R,()=>e.diffFile.onUnifiedHunkExpand("all",e.index)),C(B,R)},U=B=>{var R=Cv(),O=te(R),M=D(O);$t(M,{className:"fill-current"}),T(O);var ee=J(O,2),ae=D(ee);Ct(ae,{className:"fill-current"}),T(ee),we("click",O,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),we("click",ee,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),C(B,R)};Q(z,B=>{a(f)?B(q):a(p)?B(Y,1):a(c)?B(ve,2):B(U,-1)})}C(P,X)},m=P=>{var X=$v();C(P,X)};Q(k,P=>{a(o)?P(h):P(m,-1)})}T(S);var A=J(S),N=D(A),$=Le(N,!0);T(A),T(x),K(()=>{G(x,"data-line",`${e.lineNumber}-hunk`),V(S,`
				background-color: var(${Wn});
				color: var(${ct});
				width: calc(calc(var(${Te}) + 5px) * 2);
				max-width: calc(calc(var(${Te}) + 5px) * 2);
				min-width: calc(calc(var(${Te}) + 5px) * 2);
			`),V(A,` background-color: var(${fn}) `),V(N,`
					white-space: ${a(s)?"pre-wrap":"pre"};
					word-break: ${a(s)?"break-all":"initial"};
					color: var(${zn});
				`),$e($,a(i)?.unifiedInfo?.plainText||a(i)?.text)}),C(E,x)};Q(w,E=>{(a(d)||a(g))&&E(b)})}C(t,y),fe()}ot(["click"]);var Dv=new Set(["$$slots","$$events","$$legacy"]),Fv=j('<tr data-state="widget" class="diff-line diff-line-widget"><td class="diff-line-widget-content p-0"><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function td(t,e){de(e,!0);let n=he(e,Dv),i=I(kn()),r=I(Ln()),o=I(Zr()),s=I(()=>e.diffFile.getUnifiedLine(e.index)),l=I(()=>a(s)?.oldLineNumber&&a(i)?.side===H.old&&a(i)?.lineNumber===a(s)?.oldLineNumber),d=I(()=>a(s)?.newLineNumber&&a(i)?.side===H.new&&a(i)?.lineNumber===a(s)?.newLineNumber),u=I(()=>a(s)?.isHidden),c=I(()=>!!((a(l)||a(d))&&!a(u)&&a(o))),f=()=>{a(i).side=void 0,a(i).lineNumber=void 0},p=I(Oi({selector:()=>".unified-diff-table-wrapper",enable:()=>a(c)}));var g=me(),v=te(g);{var y=w=>{var b=Fv(),E=D(b);G(E,"colspan",2);var x=D(E),S=D(x);{var k=A=>{var N=me(),$=te(N);Bt($,()=>a(o),()=>({diffFile:e.diffFile,side:H.old,lineNumber:a(s)?.oldLineNumber||0,onClose:f})),C(A,N)};Q(S,A=>{(a(r)||a(p)>0)&&a(l)&&A(k)})}var h=J(S,2);{var m=A=>{var N=me(),$=te(N);Bt($,()=>a(o)??ht,()=>({diffFile:e.diffFile,side:H.new,lineNumber:a(s)?.newLineNumber||0,onClose:f})),C(A,N)};Q(h,A=>{(a(r)||a(p)>0)&&a(d)&&A(m)})}T(x),T(E),T(b),K(()=>{G(b,"data-line",`${e.lineNumber}-widget`),V(x,`width: ${a(p)}px`)}),C(w,b)};Q(v,w=>{a(c)&&w(y)})}C(t,g),fe()}var Mv=new Set(["$$slots","$$events","$$legacy"]),Hv=j("<!> <!> <!> <!>",1),Bv=j('<div><style data-select-style=""></style> <div class="unified-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><table><colgroup><col class="unified-diff-table-num-col"/><col class="unified-diff-table-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">line number</th><th scope="col">line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function nd(t,e){de(e,!0);let n=he(e,Mv),i=ce(Ee($a(e.diffFile))),r=ce(Ee(e.diffFile.unifiedLineLength.toString())),o=ce(null),s=I(Xr()),l=I(Ln()),d={current:()=>{}},u={current:void 0},c=()=>{let h=e.diffFile;ne(i,$a(h),!0),ne(r,h.unifiedLineLength.toString(),!0)};ye(()=>{d.current?.(),c(),d.current=e.diffFile.subscribe(c)}),We(()=>d.current());let f=h=>{let m=h.target;if(!a(o))return;if(m&&m?.nodeName==="BUTTON"){In();return}let A=so(m);if(!(A&&A!==`diff-root${e.diffFile.getId()}`))for(;m&&m instanceof HTMLElement;){let N=m.getAttribute("data-state");if(N){N==="extend"||N==="hunk"||N==="widget"?u.current!==!1&&(u.current=!1,a(o).innerHTML="",In()):u.current!==!0&&(u.current=!0,a(o).innerHTML=`#${A} [data-state="extend"] {user-select: none} 
#${A} [data-state="hunk"] {user-select: none} 
#${A} [data-state="widget"] {user-select: none}`,In());return}m=m.parentElement}},p=I(()=>({fontSize:a(s)+"px",fontFamily:"Menlo, Consolas, monospace"})),g=I(oo({text:()=>a(r),font:()=>a(p)})),v=I(()=>Math.max(40,a(g)+10));var y=Bv(),w=D(y);lt(w,()=>h=>ne(o,h,!0));var b=J(w,2),E=D(b),x=J(D(E),2),S=D(x);di(S,17,()=>a(i),li,(h,m)=>{var A=Hv(),N=te(A);na(N,{get index(){return a(m).index},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}});var $=J(N,2);Zl($,{get index(){return a(m).index},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}});var P=J($,2);td(P,{get index(){return a(m).index},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}});var X=J(P,2);ed(X,{get index(){return a(m).index},get lineNumber(){return a(m).lineNumber},get diffFile(){return e.diffFile}}),C(h,A)});var k=J(S);na(k,{get index(){return e.diffFile.unifiedLineLength},get lineNumber(){return e.diffFile.unifiedLineLength},get diffFile(){return e.diffFile}}),T(x),T(E),T(b),T(y),K(h=>{Se(y,1,`unified-diff-view ${a(l)?"unified-diff-view-wrap":"unified-diff-view-normal"} w-full`),V(b,h),Se(E,1,`unified-diff-table w-full border-collapse border-spacing-0 ${a(l)?"table-fixed":""}`)},[()=>`${Te}: ${Math.round(a(v))}px; font-family: Menlo, Consolas, monospace; font-size: var(${nt})`]),we("mousedown",x,f),C(t,y),fe()}ot(["mousedown"]);var Rv=new Set(["$$slots","$$events","$$legacy"]),Ov=j('<div class="diff-tailwindcss-wrapper" data-component="git-diff-view"><div class="diff-style-root"><div><!></div></div></div>');function ia(t,e){de(e,!0);let n=he(e,Rv),i={current:null},o=I(()=>{if(i.current?.clear?.(),e.diffFile){let h=Xi.createInstance({});return h._mergeFullBundle(e.diffFile._getFullBundle()),i.current=h,h}else if(e.data){let h=e.data,m=new Xi(h.oldFile?.fileName||"",h.oldFile?.content||"",h.newFile?.fileName||"",h.newFile?.content||"",h.hunks||[],h.oldFile?.fileLang||"",h.newFile?.fileLang||"");return i.current=m,m}return null});ye(()=>{e.onDiffFileCreated?.(a(o))});let l=I(()=>a(o)?.getId?.()),d=Ee({side:e.initialWidgetState?.side,lineNumber:e.initialWidgetState?.lineNumber}),u=ce(null),c=I(()=>e.diffViewHighlight??!0),f=I(()=>e.diffViewTheme);ye(()=>{d.side=e.initialWidgetState?.side,d.lineNumber=e.initialWidgetState?.lineNumber}),ye(()=>{(e.data||e.diffFile)&&(d.side=void 0,d.lineNumber=void 0)});let p={current:()=>{}},g=I(fi());ye(()=>{p?.current?.(),!(!a(g)||!a(o)||!e.diffFile)&&(e.diffFile._addClonedInstance(a(o)),p.current=()=>e.diffFile?._delClonedInstance(a(o)))}),We(()=>p.current()),ye(()=>{!a(o)||!a(g)||(a(o).initTheme(a(f)),a(o).initRaw(),a(o).buildSplitDiffLines(),a(o).buildUnifiedDiffLines())}),ye(()=>{if(!(!a(o)||!a(g))&&(a(f),a(c))){let h=e.registerHighlighter;h?(h.name!==a(o)._getHighlighterName()||h.type!==a(o)._getHighlighterType()||h.type!=="class")&&(a(o).initSyntax({registerHighlighter:h}),a(o).notifyAll()):(!a(o)._getIsCloned()&&a(o)._getHighlighterName()!==vr.name||a(o)._getHighlighterType()!=="class")&&(a(o).initSyntax(),a(o).notifyAll())}});let b={current:()=>{}};ye(()=>{if(b?.current?.(),!a(g)||!a(o)||!a(u))return;a(f);let h=()=>{a(u)?.setAttribute("data-theme",a(o)._getTheme()||"light"),a(u)?.setAttribute("data-highlighter",a(o)._getHighlighterName())};h(),b.current=a(o).subscribe(h)}),We(()=>b.current()),eu(n),nu(n),ru(n),hu(n),gu(n),_u(n),wu(n),yu(n),uu(d),fu(n),su(()=>a(o)?.getId()||""),lu(()=>a(u));var x=me(),S=te(x);{var k=h=>{var m=Ov(),A=D(m),N=D(A),$=D(N);{var P=z=>{Xl(z,{get diffFile(){return a(o)}})},X=z=>{nd(z,{get diffFile(){return a(o)}})};Q($,z=>{!e.diffViewMode||e.diffViewMode&jt.Split?z(P):z(X,-1)})}T(N),T(A),T(m),lt(m,()=>z=>ne(u,z,!0)),K((z,q)=>{G(m,"data-theme",z),G(m,"data-highlighter",q),V(A,`${nt}:${e.diffViewFontSize||14}px`),G(N,"id",a(g)?`diff-root${a(l)}`:void 0),Se(N,1,"diff-view-wrapper"+(e.class?` ${e.class}`:"")),V(N,e.style)},[()=>a(o)?._getTheme()||"light",()=>a(o)?._getHighlighterName()]),C(h,m)};Q(S,h=>{a(o)&&h(k)})}C(t,x),fe()}cs.name="@git-diff-view/svelte";function Du(t){let e=/[.*+?^${}()|[\]\\]/g;return t.replace(e,"\\$&")}function Fu(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function Mu(t){if(!t)return!1;let e=Date.now()-1440*60*1e3;return t*1e3>e}function Li(){let t=L;t.currentSubjectData=null,t.currentItemId=null,t.currentWcode=null,t.currentTags=null,t.currentSeries=null,t.currentCommitMessage=null,t.currentFieldUpdates=null,t.currentTagUpdates=null,t.currentSeriesUpdate=null}var Bu=da(ha());var id=1e4;ef(id);function Hu(t,e){let n=0,i=[];for(let[r,o]of t)e(r)&&(i.push({type:r,str:o,startIndex:n,endIndex:n+o.length-1,length:o.length}),n+=o.length);return i}function Pv(t,e){if(t.text.length>id||e.text.length>id)return;let n=(0,Bu.default)(t.text,e.text,0,!1),i=Hu(n,d=>d!==-1),r=Hu(n,d=>d!==1),o=i.some(d=>d.type===0&&d.str.trim().length>0),s=e.changes,l=t.changes;!s||!l||(e.diffChanges={range:i,hasLineChange:o,newLineSymbol:s.newLineSymbol},t.diffChanges={range:r,hasLineChange:o,newLineSymbol:l.newLineSymbol},e._diffChanges=t.diffChanges,t._diffChanges=e.diffChanges,e.plainTemplate=void 0,t.plainTemplate=void 0,Io({diffLine:e,rawLine:e.text,operator:"add"}),Io({diffLine:t,rawLine:t.text,operator:"del"}),e.plainTemplate&&(e.plainTemplateMode="relative"),t.plainTemplate&&(t.plainTemplateMode="relative"))}function Ru(t){for(let e=0;e<t.splitLineLength;e++){let n=t.getSplitLeftLine(e).diff,i=t.getSplitRightLine(e).diff;!n||!i||n.type!==Fe.Delete||i.type!==Fe.Add||!n.changes||!i.changes||Pv(n,i)}}var Ou={Album:["中文名","别名","艺术家","作曲","编曲","作词","厂牌","发售日期","价格","版本特性","播放时长","录音","碟片数量","链接"],Anime:["中文名","别名","上映年度","片长","官方网站","链接","其他","Copyright"],Book:["中文名","别名","作者","插图","出版社","价格","其他出版社","连载杂志","发售日","页数","ISBN","链接","其他"],BookSeries:["中文名","别名","出版社","连载杂志","开始","结束","册数","话数","原作","链接","其他"],Crt:["简体中文名","别名","性别","生日","血型","身高","体重","BWH","引用来源"],Game:["中文名","别名","平台","游戏类型","游戏引擎","游玩人数","发行日期","售价","开发","发行","剧本","程序","website","链接"],Manga:["中文名","别名","作者","作画","脚本","原作","出版社","价格","其他出版社","连载杂志","发售日","册数","页数","话数","ISBN","链接","其他"],Movie:["中文名","别名","上映年度","片长","官方网站","链接","其他","Copyright"],Novel:["中文名","别名","作者","插图","出版社","价格","连载杂志","发售日","册数","页数","话数","ISBN","链接","其他"],OVA:["中文名","别名","话数","发售日","官方网站","开始","结束","链接","其他"],PhotoBook:["中文名","别名","作者","摄影","出版社","价格","其他出版社","连载杂志","发售日","页数","ISBN","链接","其他"],TV:["中文名","别名","集数","季数","放送星期","开始","结束","主演","导演","音乐","原作","制作","类型","国家/地区","语言","每集长","在线播放平台","电视网","电视台","频道","视频制式","音频制式","首播国家","首播地区","台湾名称","港澳名称","马新名称","官方网站","链接","imdb_id","tvdb_id"],TVAnime:["中文名","别名","话数","放送开始","放送星期","官方网站","在线播放平台","播放电视台","其他电视台","播放结束","导演","音乐","链接","其他","Copyright"],doujinBook:["作者","原作","CP","语言","页数","尺寸","价格","发售日"],doujinGame:["别名","开发者","原作","平台","游戏类型","游戏引擎","游玩人数","语言","价格","发售日"],doujinMusic:["艺术家","原作","语言","版本特性","碟片数量","播放时长","价格","发售日"],realMovie:["中文名","别名","上映日","片长","类型","国家/地区","语言","官方网站","链接","imdb_id","tmdb_id","tvdb_id"]},Pu={Album:"Album","animanga/Anime":"Anime","animanga/Book":"Book","animanga/BookSeries":"BookSeries",Crt:"Crt",Game:"Game","animanga/Manga":"Manga","animanga/Movie":"Movie","animanga/Novel":"Novel","animanga/OVA":"OVA","Book/PhotoBook":"PhotoBook","real/Television":"TV","animanga/TVAnime":"TVAnime","doujin/Book":"doujinBook","doujin/Game":"doujinGame","doujin/Album":"doujinMusic","real/Movie":"realMovie"};function rd(){return L.theme==="dark"?"dark":L.theme==="light"?"light":window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function ju(){return L.entityType||"subject"}function od(){if(!L.currentSubjectData)return!1;let t=ju(),n=document.getElementById("static-wcode-input").value.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=(L.currentSubjectData.infobox||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),o=n!==r;if(t==="subject"){let l=document.getElementById("static-tags-input").value.split(" ").filter(g=>g),d=document.getElementById("static-series-checkbox").checked,u=L.currentSubjectData.metaTags||[],c=L.currentSubjectData.series||!1,f=!Fu(l,u);return o||f||d!==c}return o}function ji(){let t=document.querySelector("#static-buttons-container button#process-confirm-update");if(!t)return;od()?(t.textContent="确认更新",t.disabled=!1):(t.textContent="确认更新（无实质修改）",t.disabled=!1)}function ao(t,e,n,i){let r=Object.keys(t||{}),o=[];return r.length&&o.push(`更新${r.join("、")}`),(i==="subject"||!i)&&(e?.add.length&&o.push(`添加标签${e.add.join("、")}`),e?.remove.length&&o.push(`删除标签${e.remove.join("、")}`),n?.hasUpdate&&o.push(n.newValue?"标记为系列":"取消系列标记")),o.filter(s=>s).join("；")||"更新条目信息"}function lo(t,e,n){try{let i=(t||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),r=(e||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),l=vf("编辑前",i,"编辑后",r,"text","text",{context:1});l.init(),l.buildSplitDiffLines(),Ru(l);let d=document.getElementById(n);if(!d)return;let u=d._diffViewInstance;u&&Qo(u),d.innerHTML="";let c=Kr(ia,{target:d,props:{diffFile:l,diffViewMode:L.diffViewMode==="unified"?jt.Unified:jt.Split,diffViewFontSize:13,diffViewTheme:rd(),diffViewHighlight:!0,diffViewWrap:!0}});d._diffViewInstance=c,n==="static-content-diff-container"&&setTimeout(()=>{let p=document.getElementById("static-wcode-input");p&&(p.style.height="")},0);let f=document.getElementById("diff-error");f&&(f.style.display="none")}catch(i){console.error("Diff generation error:",i);let r=document.getElementById("diff-error");r&&(r.textContent=`差异显示错误: ${i.message}`,r.style.display="block")}}function sd(){let t=L.currentSubjectData;if(!t)return;let e=ju(),n=t.infobox||"",i=document.getElementById("static-wcode-input")?.value;if(i!==void 0&&lo(n,i,"static-content-diff-container"),e==="subject"){let r=t.metaTags||[],o=document.getElementById("static-tags-input")?.value.split(" ").filter(s=>s);o!==void 0&&ts(r,o,"static-tags-diff-container")}}function ts(t,e,n){let i=t.join(`
`),r=e.join(`
`);lo(i,r,n)}function Uu(t,e){let n={};return Object.keys(t).forEach(i=>{if(!["id","tags","series","type","infobox"].includes(i.toLowerCase())){let r=t[i];r!==void 0&&(n[i]=r)}}),n}function Gu(t){let e=Object.keys(t).find(i=>i.toLowerCase()==="infobox");if(!e)return null;let n=t[e]?.replaceAll("\\n",`
`);return!n||!n.trim()?null:n}function zu(t,e){if(L.entityType!=="subject")return{add:[],remove:[]};let i=(t.tags||"").split(" ").filter(s=>s),r=[],o=[];return i.forEach(s=>{s.startsWith("-")?o.push(s.slice(1)):r.push(s)}),{add:r,remove:o}}function Wu(t,e){if(L.entityType!=="subject")return{hasUpdate:!1};if(t.series===void 0||t.series===null||t.series==="")return{hasUpdate:!1};let n=t.series.trim().toLowerCase(),i=n==="true"||n==="1"||n==="yes";return{hasUpdate:i!==e,newValue:i}}function jv(t){let e=t.match(/{{Infobox\s+(.+?)$/m);return e&&Pu[e[1]]||null}function Uv(t,e,n){for(let i=1;i<t.length;i++){let r=t[i].match(/^\|([^|=]+?)\s*=/);if(r&&e.indexOf(r[1])>n)return i}return t.length-1}function Vu(t,e){let n=jv(t),i=n?Ou[n]:null,r=t,o=[];if(Object.entries(e).forEach(([s,l])=>{l=l.replaceAll("\\n",`
`);let d=new RegExp(`\\|${Du(s)}\\s*=.*`,"i");d.test(r)?r=r.replace(d,`|${s}= ${l}`):o.push({field:s,value:l,fieldIdx:i?i.indexOf(s):-1})}),o.length>0){i&&o.sort((l,d)=>l.fieldIdx===-1&&d.fieldIdx===-1?0:l.fieldIdx===-1?1:d.fieldIdx===-1?-1:l.fieldIdx-d.fieldIdx);let s=r.split(`
`);for(let l=o.length-1;l>=0;l--){let d=o[l];i&&d.fieldIdx>=0?s.splice(Uv(s,i,d.fieldIdx),0,`|${d.field}= ${d.value}`):s.splice(-1,0,`|${d.field}= ${d.value}`)}r=s.join(`
`)}return r}function Qu(t,e){let n=new Set(t);return e.add.forEach(i=>n.add(i)),e.remove.forEach(i=>n.delete(i)),[...n]}var Ju=da(Yu());function qu(t,e){try{L.csvData=Gv(t),L.currentIndex=0,L.retryCount={},L.previousItem=null,L.csvPersistDenied=!1;let n=fa();localStorage.setItem("bgmCurrentIndex","0"),Vn(),en(e+"加载成功"+(n?"":"（内存模式：刷新页面后需重新加载）"))}catch(n){en("CSV解析错误: "+n.message),console.error(n)}finally{Zt(),document.querySelectorAll("#static-buttons-container button").forEach(n=>{n.disabled=!1})}}function Ku(t){let n=t.target.files?.[0];if(!n)return;document.querySelectorAll("#static-buttons-container button").forEach(r=>{r.disabled=!0}),zi("正在解析CSV文件...");let i=new FileReader;i.onload=function(r){let o=r.target.result;qu(o,"CSV文件")},i.readAsText(n)}function Xu(t){document.querySelectorAll("#static-buttons-container button").forEach(e=>{e.disabled=!0}),zi("正在解析粘贴的CSV..."),qu(t,"粘贴的CSV")}function Gv(t){let e=Ju.default.parse(t,{header:!0,skipEmptyLines:!0,transform:s=>s.trim()});if(e.errors.length){let s=e.errors[0];throw new Error(`第${s.row!==void 0?s.row+1:"?"}行: ${s.message}`)}let n=e.meta.fields;if(!n||n.length===0)throw new Error("CSV文件为空或格式错误");let i=n.find(s=>/^(person_id|character_id|id)$/i.test(s));if(!i)throw new Error('CSV必须包含"id"、"person_id"或"character_id"列');L.entityType="subject",/^person_id$/i.test(i)?L.entityType="person":/^character_id$/i.test(i)&&(L.entityType="character");let r=n.filter(s=>s!==i),o=[];for(let s of e.data){let l=s[i]?.trim();if(!l)continue;let d={id:l};for(let u of r){let c=s[u];c!==void 0&&(d[u]=c.trim())}o.push(d)}if(o.length===0)throw new Error("未找到有效的数据行");return o}function Vn(){L.currentView="setup",L.processing=!1,L.paused=!0,Li(),Zt();let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container");document.getElementById("edit-regions").style.display="none",_d(),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">基本设置</h3>
                <div class="setup-columns">
                    <div class="setup-column">
                        <div class="form-group">
                            <label>提交方式选择</label>
                            <div class="method-option-group">
                                <input type="radio" id="method-patch" name="submit-method" value="patch" ${L.submitMethod==="patch"?"checked":""}>
                                <label for="method-patch">Private API</label>
                                <input type="radio" id="method-post" name="submit-method" value="post" ${L.submitMethod==="post"?"checked":""}>
                                <label for="method-post">旧 API</label>
                            </div>
                        </div>

                        <div id="patch-method-options" class="form-group ${L.submitMethod==="patch"?"":"hidden"}">
                            <label for="setup-access-token">Access Token</label>
                            <input type="password" id="setup-access-token" value="${L.accessToken}">
                            <p class="formhash-hint">
                                在<a href="https://next.bgm.tv/demo/access-token" target="_blank">个人令牌页</a>获取 Access Token<br>
                                限速严重可切换为旧 API
                            </p>
                        </div>

                        <div id="post-method-options" class="form-group ${L.submitMethod==="post"?"":"hidden"}">
                            <label for="setup-formhash">Formhash</label>
                            <div class="row-flex">
                                <input type="text" id="setup-formhash" value="${L.formhash}">
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
                                <input type="radio" id="diff-mode-split" name="diff-view-mode" value="split" ${L.diffViewMode==="split"?"checked":""}>
                                <label for="diff-mode-split">左右对照</label>
                                <input type="radio" id="diff-mode-unified" name="diff-view-mode" value="unified" ${L.diffViewMode==="unified"?"checked":""}>
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
                            ${L.csvData?`<div class="csv-loaded-info">已加载CSV: ${L.csvData.length} 条记录</div>`:""}
                            <p class="csv-hint">
                                必备ID列，条目id，人物person_id，角色character_id<br>
                                tags列使用空格分隔标签，前缀带"-"的标签表示删除该标签<br>
                                series列使用true或false表示是否标记为系列<br>
                                infobox列将整体替换Wiki文本（其余列仍按字段名逐项更新）<br>
                                可使用 <a href="https://github.com/inchei/bangumi-wiki-scripts/tree/main/bgq" target="_blank">Bangumi Query</a> 辅助生成（<a href="https://bgq.iccci.cc.cd" target="_blank">demo</a>）
                            </p>
                        </div>
                        ${L.csvData?`
                        <div class="form-group">
                            <label>处理进度</label>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${L.currentIndex/L.csvData.length*100}%"></div>
                            </div>
                            <div class="progress-info">上次进度: ${L.currentIndex}/${L.csvData.length}</div>
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
        `);let n=document.getElementById("setup-access-token");n&&n.addEventListener("input",f=>{L.accessToken=f.target.value,GM_setValue("bgmAccessToken",L.accessToken)});let i=document.getElementById("setup-formhash");i&&i.addEventListener("input",f=>{L.formhash=f.target.value,GM_setValue("bgmFormhash",L.formhash)});let r=document.getElementById("setup-fetch-formhash");r&&r.addEventListener("click",()=>{i&&(r.disabled=!0,r.innerHTML='<i class="fas fa-spinner fa-pulse"></i> 获取中...',GM.xmlHttpRequest({method:"GET",url:"https://bgm.tv/subject/1/edit_detail",onload:f=>{try{let p=f.responseText.match(/<input[^>]*name="formhash"[^>]*value="([^"]+)"/);p&&p[1]?(L.formhash=p[1],GM_setValue("bgmFormhash",L.formhash),i.value=p[1]):alert("无法从页面提取 formhash，请确保已登录 Bangumi")}catch{alert("解析编辑页面失败")}finally{r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> 自动获取'}},onerror:()=>{alert("网络请求失败，请手动获取 formhash"),r.disabled=!1,r.innerHTML='<i class="fas fa-magic"></i> 自动获取'}}))}),document.querySelectorAll('input[name="submit-method"]').forEach(f=>{f.addEventListener("change",p=>{L.submitMethod=p.target.value,GM_setValue("bgmSubmitMethod",L.submitMethod);let g=document.getElementById("patch-method-options"),v=document.getElementById("post-method-options");g&&g.classList.toggle("hidden",L.submitMethod!=="patch"),v&&v.classList.toggle("hidden",L.submitMethod!=="post")})}),document.querySelectorAll('input[name="diff-view-mode"]').forEach(f=>{f.addEventListener("change",p=>{L.diffViewMode=p.target.value,localStorage.setItem("bgmDiffViewMode",L.diffViewMode)})});let l=document.getElementById("setup-csv-file");l&&(l.addEventListener("change",Ku),l.addEventListener("change",()=>{let f=l.files?.[0]?.name||"",p=document.getElementById("setup-csv-file-name");p&&(p.textContent=f)}));let d=document.getElementById("setup-csv-btn");d&&l&&d.addEventListener("click",f=>{f.preventDefault(),l.click()});let u=document.getElementById("setup-paste-csv-btn");u&&u.addEventListener("click",async()=>{try{let f=await navigator.clipboard.readText();if(!f||!f.trim()){en("剪贴板内容不是有效的CSV");return}let p=document.getElementById("setup-csv-file-name");p&&(p.textContent="已从剪贴板粘贴"),Xu(f)}catch(f){en("读取剪贴板失败: "+f.message)}});let c=document.getElementById("sync-status");if(c)if(GM_getValue("bgmGistToken","")){let p=GM_getValue("bgmGistId","");c.textContent=p?"已同步 (Gist: "+p.slice(0,8)+"…)":"已授权 GitHub"}else c.textContent="未同步"}function Zu(t){L.currentView="processing";let{currentItem:e,wikiData:n,historyData:i}=t;L.currentSubjectData=n,L.currentItemId=e.id;let r=L.entityType||"subject";L.currentWcode=null,L.currentTags=null,L.currentSeries=null,L.currentCommitMessage=null;let o=document.getElementById("core-content"),s=document.getElementById("static-buttons-container"),l=document.getElementById("edit-regions");l&&(l.style.display="block"),po(),Gi(L.currentIndex,L.totalItems);let d=n.name||"未知名称",u=n.infobox||"",c=r==="subject"?n.metaTags||[]:[],f=r==="subject"&&n.series||!1,p=Uu(e,u),g=Gu(e),v=zu(e,c),y=Wu(e,f);L.currentFieldUpdates=p,L.currentTagUpdates=v,L.currentSeriesUpdate=y;let w={subject:"条目",character:"角色",person:"人物"},b=document.getElementById("static-last-update"),E=i[0]?.createdAt,x=E?new Date(E*1e3):null,S=i[0]?.creator?.username||"",k=i[0]?.commitMessage||"",h=Mu(E);if(x&&b){let{editPagePath:R}=Ui(r,e.id);b.innerHTML=`
            <a href="${R}" target="_blank">
                最后更新: ${x.toLocaleString()} ${S} ${k}
            </a>
        `,b.style.color=h?"#d9534f":"",b.style.display="block"}else b&&(b.style.display="none");let m=document.getElementById("prev-item-link");if(m&&L.previousItem&&L.currentIndex>0){let R=L.previousItem.type,{editPagePath:O}=Ui(R,L.previousItem.id);m.innerHTML=`
            <i class="fas fa-arrow-left"></i> 上一个:
            <a href="${O}" target="_blank">
                ${L.previousItem.name}（${L.previousItem.id}）
            </a>
        `,m.style.display="block"}else m&&(m.style.display="none");let A=document.getElementById("static-commit-input"),N=document.getElementById("static-lock-commit"),$=ao(p,v,y,r);A.value=L.isCommitMessageLocked?L.lockedCommitMessage:$,N.innerHTML=`<i class="fas ${L.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>`,N.title=L.isCommitMessageLocked?"解锁编辑摘要":"固定编辑摘要";let P=document.getElementById("static-wcode-input"),X=document.getElementById("static-content-diff-container"),z=Vu(g??u,p);P.value=z,lo(u,z,"static-content-diff-container"),X&&(X.style.display="block");let q=document.getElementById("static-tags-area"),Y=document.getElementById("static-tags-diff-wrapper");if(r==="subject"){let R=document.getElementById("static-tags-input"),O=Qu(c,v);R.value=O.join(" "),ts(c,O,"static-tags-diff-container"),q&&(q.style.display="block"),Y&&(Y.style.display="block")}else q&&(q.style.display="none"),Y&&(Y.style.display="none");let ve=document.getElementById("static-series-area");if(r==="subject"){let R=document.getElementById("static-series-checkbox"),O=y.hasUpdate?y.newValue:f;R.checked=O,L.currentSeries=O,ve&&(ve.style.display="block")}else ve&&(ve.style.display="none");let U=Ui(r,e.id).editPagePath.replace("/edit",""),B=w[r]||"条目";o&&(o.innerHTML=`
            <div>
                <div class="item-info">
                    当前${B}：<a href="${U}" target="_blank">${d}</a>（${e.id}）[${B}]
                </div>
            </div>
        `),s&&(s.innerHTML=`
            <button id="process-skip-update" class="secondary">跳过</button>
            <button id="process-confirm-update" class="primary">确认更新</button>
        `),ji()}function ep(t,e){L.currentView="processing";let n=document.getElementById("core-content"),i=document.getElementById("static-buttons-container"),r=document.getElementById("edit-regions");r&&(r.style.display="none"),po(),Gi(L.currentIndex,L.totalItems);let o=t.id,l={subject:"条目",character:"角色",person:"人物"}[L.entityType]||"条目",d=(L.retryCount[o]||0)+1;L.retryCount[o]=d,n&&(n.innerHTML=`
            <div>
                <div class="item-info">
                    当前${l}：<a href="https://bgm.tv/${L.entityType}/${o}" target="_blank">查看${l}</a>（${o}）
                </div>
                <div class="status-box error">
                    无法获取${l}信息: ${e}
                    ${d>1?`<br>已重试 ${d-1} 次`:""}
                </div>
                <p>是否继续处理？</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${L.currentIndex/L.totalItems*100}%"></div>
                </div>
            </div>
        `),i&&(i.innerHTML=`
            <button id="process-skip-error" class="secondary">跳过</button>
            <button id="process-retry-error" class="primary">重试</button>
        `)}function tp(t){L.currentView="processing";let e=document.getElementById("core-content"),n=document.getElementById("static-buttons-container"),i=document.getElementById("edit-regions");i&&(i.style.display="none"),po(),Gi(L.currentIndex,L.totalItems);let r=L.currentItemId||"",o=(L.retryCount[r]||0)+1;L.retryCount[r]=o;let l=L.currentSubjectData?.name||"未知名称",u={subject:"条目",character:"角色",person:"人物"}[L.entityType]||"条目";e&&(e.innerHTML=`
            <div>
                <div class="item-info">
                    当前${u}：<a href="https://bgm.tv/${L.entityType}/${r}" target="_blank">${l}</a>（${r}）
                </div>
                <div class="status-box error">
                    提交更新失败: ${t}
                </div>
                <p>是否重试更新？</p>
            </div>
        `),n&&(n.innerHTML=`
            <button id="process-skip-update-fail" class="secondary">跳过</button>
            <button id="process-retry-update" class="primary">重试</button>
        `)}function np(){L.currentView="completed";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container"),n=document.getElementById("edit-regions");n&&(n.style.display="none"),po(),Gi(L.totalItems,L.totalItems),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">处理完成</h3>
                <div class="status-box info">所有条目处理完毕</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">总条目</span>
                        <span class="stats-value">${L.totalItems}</span>
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="completed-back-to-setup" class="primary">返回设置</button>
        `)}function zv(t){let e=t.trim();if(!e)return new Headers;let n=e.split(`\r
`).map(i=>{let r=i.split(":");return[r[0].trim(),r[1].trim()]});return new Headers(n)}function Wv(t,e){let n=zv(e.responseHeaders),i=typeof e.response=="string"?new Blob([e.response],{type:n.get("Content-Type")||"text/plain"}):e.response;return new dd(i,{statusCode:e.status,statusText:e.statusText,headers:n,finalUrl:e.finalUrl,redirected:e.finalUrl===t.url})}var dd=class t{constructor(e,n){this.rawBody=e,this.init=n,this.body=e.stream();let{headers:i,statusCode:r,statusText:o,finalUrl:s,redirected:l}=n;this.headers=i,this.status=r,this.statusText=o,this.url=s,this.type="basic",this.redirected=l,this._bodyUsed=!1}get bodyUsed(){return this._bodyUsed}get ok(){return this.status<300}arrayBuffer(){if(this.bodyUsed)throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.arrayBuffer()}blob(){if(this.bodyUsed)throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");return this._bodyUsed=!0,Promise.resolve(this.rawBody.slice(0,this.rawBody.size,this.rawBody.type))}clone(){if(this.bodyUsed)throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");return new t(this.rawBody,this.init)}formData(){if(this.bodyUsed)throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text().then(Vv)}async json(){if(this.bodyUsed)throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");return this._bodyUsed=!0,JSON.parse(await this.rawBody.text())}text(){if(this.bodyUsed)throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text()}async bytes(){if(this.bodyUsed)throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");return this._bodyUsed=!0,new Uint8Array(await this.rawBody.arrayBuffer())}};function Vv(t){let e=new FormData;return t.trim().split("&").forEach(function(n){if(n){let i=n.split("="),r=i.shift()?.replace(/\+/g," "),o=i.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}async function Nn(t,e){let n=new Request(t,e),i;return e?.body&&(i=await n.text()),await Qv(n,e,i)}function Qv(t,e,n){return new Promise((i,r)=>{if(t.signal&&t.signal.aborted)return r(new DOMException("Aborted","AbortError"));GM.xmlHttpRequest({url:t.url,method:qv(t.method.toUpperCase()),headers:Object.fromEntries(new Headers(e?.headers).entries()),data:n,responseType:"blob",onload(o){try{i(Wv(t,o))}catch(s){r(s)}},onabort(){r(new DOMException("Aborted","AbortError"))},ontimeout(){r(new TypeError("Network request failed, timeout"))},onerror(o){r(new TypeError("Failed to fetch: "+o.finalUrl))}})})}var Yv=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function Jv(t,e){return t.includes(e)}function qv(t){if(Jv(Yv,t))return t;throw new Error(`unsupported http method ${t}`)}var ns=!1;function ip(){if(L.submitMethod==="patch"&&!L.accessToken){en("请输入Access Token");return}if(L.submitMethod==="post"&&!L.formhash){en("请输入Formhash");return}if(!L.csvData||L.csvData.length===0){en("请上传有效的CSV文件");return}L.totalItems=L.csvData.length,L.processing=!0,L.paused=!1,ns=!1;let t=document.getElementById("core-content");t&&(t.innerHTML=`
            <div>
                <div class="item-info">准备处理第一个条目...</div>
            </div>
        `),ui()}function ui(t=!1){if(L.paused||!L.processing||ns)return;if(L.currentIndex>=L.totalItems){np();return}let e=L.csvData[L.currentIndex],n=L.entityType||"subject";t||Gi(L.currentIndex,L.totalItems),document.querySelectorAll("#static-buttons-container button").forEach(s=>{s.disabled=!0}),zi("正在获取条目信息...");let{wikiPath:i,historyPath:r}=Ui(n,e.id),o=L.submitMethod==="patch"?{Authorization:`Bearer ${L.accessToken}`,Accept:"application/json"}:{Accept:"application/json"};ns=!0,Promise.all([Nn(i,{headers:o}),Nn(r,{headers:o})]).then(async([s,l])=>{if(!s.ok)throw new Error(`HTTP ${s.status}`);if(!l.ok)throw new Error(`HTTP ${l.status}`);let d=await s.json(),u=await l.json();return{currentItem:e,wikiData:d,historyData:u}}).then(s=>{L.processing&&(L.retryCount[s.currentItem.id]=0,Zt(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),ns=!1,Zu(s))}).catch(s=>{L.processing&&(Zt(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),ns=!1,ep(e,s.message))})}function rp(t,e,n,i,r,o,s,l,d){let u=L.entityType||"subject";if(L.submitMethod==="patch"){let{wikiPath:c,patchBodyKey:f}=Ui(u,t),p={commitMessage:s};u==="subject"?p.subject={infobox:e,metaTags:n,series:i}:p[f]={infobox:e},Nn(c,{method:"PATCH",headers:{Authorization:`Bearer ${L.accessToken}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(p)}).then(g=>g.ok?g:g.text().then(v=>{throw new Error(`HTTP ${g.status} - ${v||"更新失败"}`)})).then(()=>{Zt(),l()}).catch(g=>{d(g instanceof Error?g:new Error(String(g)))})}else{let c=e.replace(/\n/g,`\r
`),f=new FormData;if(f.append("formhash",L.formhash),f.append("editSummary",s),u==="subject")f.append("subject_title",L.currentSubjectData?.name||""),f.append("platform",L.currentSubjectData?.platform||""),f.append("subject_infobox",c),f.append("subject_summary",L.currentSubjectData?.summary||""),f.append("subject_meta_tags",n.join(" ")),f.append("series",i?"1":"0"),f.append("submit","提交");else if(u==="person"){f.append("crt_name",L.currentSubjectData?.name||""),f.append("crt_infobox",c),f.append("crt_summary",L.currentSubjectData?.summary||"");let v=L.currentSubjectData?.profession;if(v)for(let[y,w]of Object.entries(v))w&&f.append(`prsn_pro[${y}]`,"1");f.append("picfile",""),f.append("submit","改好了")}else f.append("crt_name",L.currentSubjectData?.name||""),f.append("crt_infobox",c),f.append("crt_summary",L.currentSubjectData?.summary||""),f.append("picfile",""),f.append("submit","改好了");let p=new URLSearchParams;f.forEach((v,y)=>{p.append(y,v)});let g=u==="subject"?`https://bgm.tv/subject/${t}/new_revision`:`https://bgm.tv/${u}/${t}/edit`;GM.xmlHttpRequest({method:"POST",url:g,data:p.toString(),headers:{"Content-Type":"application/x-www-form-urlencoded"},onload:function(v){Zt(),v.finalUrl===g?d(new Error("更新失败，可能是formhash无效或权限不足")):l()},onerror:function(v){Zt(),d(new Error(`网络错误: ${v.message}`))},onabort:function(){Zt(),d(new Error("请求已中止"))},ontimeout:function(){Zt(),d(new Error("请求超时"))}})}}var op="Ov23lifi6y3LGaJ8A53e",ra="wikiBatch-sync.json",sp="wikiBatch 跨设备同步数据";function Kv(){return{version:1,csvData:localStorage.getItem("bgmCsvData")||"null",currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),retryCount:GM_getValue("bgmRetryCount")||"{}",previousItem:localStorage.getItem("bgmPreviousItem"),entityType:localStorage.getItem("bgmEntityType")||"subject",totalItems:parseInt(localStorage.getItem("bgmTotalItems")||"0")}}function Xv(t){try{localStorage.setItem("bgmCsvData",t.csvData),localStorage.setItem("bgmCurrentIndex",t.currentIndex.toString()),localStorage.setItem("bgmEntityType",t.entityType),localStorage.setItem("bgmTotalItems",t.totalItems.toString())}catch{throw new Error("同步数据过大，超出本地存储配额")}GM_setValue("bgmRetryCount",t.retryCount),t.previousItem?localStorage.setItem("bgmPreviousItem",t.previousItem):localStorage.removeItem("bgmPreviousItem")}async function Zv(){return(await Nn("https://github.com/login/device/code",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:op,scope:"gist"})})).json()}async function e_(t,e){return new Promise((n,i)=>{let r=e,o=async()=>{let l=await(await Nn("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:op,device_code:t,grant_type:"urn:ietf:params:oauth:grant-type:device_code"})})).json();l.access_token?n(l.access_token):l.error==="authorization_pending"?setTimeout(o,r*1e3):l.error==="slow_down"?(r+=5,setTimeout(o,r*1e3)):i(new Error(l.error_description||l.error||"授权失败"))};o()})}async function ap(t){t.textContent="正在获取设备码...";let e;try{e=await Zv()}catch{t.textContent="网络错误，无法连接 GitHub";return}t.innerHTML=`请在打开的页面中输入码: <strong>${e.user_code}</strong>`,GM_openInTab(e.verification_uri);try{let n=await e_(e.device_code,e.interval);GM_setValue("bgmGistToken",n),t.textContent="授权成功"}catch(n){t.textContent=n.message}}function lp(){return GM_getValue("bgmGistId")||null}function fd(t){GM_setValue("bgmGistId",t)}function oa(){return GM_getValue("bgmGistToken")||null}async function t_(t){let e=oa();if(!e)throw new Error("未授权");return(await(await Nn("https://api.github.com/gists",{method:"POST",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({description:sp,public:!1,files:{[ra]:{content:t}}})})).json()).id}async function n_(t,e){let n=oa();if(!n)throw new Error("未授权");await Nn(`https://api.github.com/gists/${t}`,{method:"PATCH",headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${n}`,"Content-Type":"application/json"},body:JSON.stringify({files:{[ra]:{content:e}}})})}async function dp(){let t=oa();return t&&(await(await Nn("https://api.github.com/gists?per_page=100",{headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${t}`}})).json()).find(r=>r.description===sp&&r.files?.[ra])?.id||null}async function i_(t){let e=oa();if(!e)throw new Error("未授权");let r=(await(await Nn(`https://api.github.com/gists/${t}`,{headers:{Accept:"application/vnd.github+json",Authorization:`Bearer ${e}`}})).json()).files?.[ra];if(!r)throw new Error("Gist 中未找到同步数据");if(console.log("[wikiBatch] gist read:",{size:r.size,truncated:r.truncated,hasContent:typeof r.content=="string"}),r.truncated&&r.raw_url){console.log("[wikiBatch] gist content truncated, fetching raw_url...");let o=await Nn(r.raw_url,{headers:{Authorization:`Bearer ${e}`}});if(!o.ok)throw new Error(`读取原始文件失败: HTTP ${o.status}`);let s=await o.text();return console.log("[wikiBatch] gist raw content length:",s.length),s}return r.content}async function fp(){let t=Kv(),e=JSON.stringify(t),n=lp();n||(n=await dp(),n&&fd(n)),n?await n_(n,e):(n=await t_(e),fd(n))}async function cp(){let t=lp();if(!t){if(t=await dp(),!t)throw new Error("未找到同步 Gist，请先在另一设备上传");fd(t)}let e=await i_(t);console.log("[wikiBatch] parsed content length:",e.length);let n;try{n=JSON.parse(e)}catch(i){throw console.error("[wikiBatch] JSON.parse failed, content head:",e.slice(0,200)),console.error("[wikiBatch] JSON.parse failed, content tail:",e.slice(-200)),new Error("同步数据解析失败",{cause:i})}Xv(n)}function up(){GM_deleteValue("bgmGistToken"),GM_deleteValue("bgmGistId")}function pp(t){switch(t){case"setup-start-processing":ip();break;case"setup-reset-progress":L.currentIndex=0,L.retryCount={},L.previousItem=null,localStorage.setItem("bgmCurrentIndex","0"),Vn();break;case"sync-auth-btn":r_();break;case"sync-upload-btn":o_();break;case"sync-download-btn":s_();break;case"sync-clear-btn":up(),Vn();break}}async function r_(){let t=document.getElementById("sync-status");if(!t)return;let e=document.getElementById("sync-auth-btn");e&&(e.disabled=!0),await ap(t),e&&(e.disabled=!1),Vn()}async function o_(){let t=document.getElementById("sync-status");if(t){Cn(),t.textContent="正在上传...";try{await fp(),t.textContent="上传成功: "+new Date().toLocaleString()}catch(e){t.textContent="上传失败: "+e.message}}}async function s_(){let t=document.getElementById("sync-status");if(t){t.textContent="正在下载...";try{await cp(),L.csvData=JSON.parse(localStorage.getItem("bgmCsvData")||"null"),L.currentIndex=parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),L.entityType=localStorage.getItem("bgmEntityType")||"subject",L.totalItems=parseInt(localStorage.getItem("bgmTotalItems")||"0"),L.retryCount=JSON.parse(GM_getValue("bgmRetryCount","{}")),L.previousItem=JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),t.textContent="下载成功: "+new Date().toLocaleString(),Vn()}catch(e){t.textContent="下载失败: "+e.message}}}function hp(t){if(!L.csvData)return;let e=L.csvData[L.currentIndex],n=L.currentSubjectData,i=e?.id||L.currentItemId||"",r=n?.name||"未知名称",o=L.entityType||"subject";function s(){return{id:i,name:r,type:o}}switch(t){case"process-confirm-update":{let l=document.getElementById("static-wcode-input").value,d=o==="subject"?document.getElementById("static-tags-input").value.split(" ").filter(p=>p):[],u=o==="subject"?document.getElementById("static-series-checkbox").checked:!1,c=document.getElementById("static-commit-input").value||ao(L.currentFieldUpdates,L.currentTagUpdates,L.currentSeriesUpdate,o);if(!od()){en("没有检测到实质修改，已跳过更新"),L.previousItem=s(),L.currentIndex++,Li(),Cn(),ui();return}document.querySelectorAll("#static-buttons-container button").forEach(p=>{p.disabled=!0}),zi("正在提交更新..."),rp(i,l,d,u,r,e,c,()=>{L.previousItem=s(),L.currentIndex++,Li(),Cn(),ui()},p=>{Zt(),document.querySelectorAll("#static-buttons-container button").forEach(g=>{g.disabled=!1}),tp(p.message)});break}case"process-skip-update":L.previousItem=s(),L.currentIndex++,Li(),Cn(),ui();break;case"process-confirm-continue":L.previousItem=s(),L.currentIndex++,Li(),Cn(),ui();break;case"process-skip-error":L.currentIndex++,Li(),Cn(),ui();break;case"process-retry-error":{let l=L.retryCount[i]||0;en(`正在重试（${l}次）...`),ui();break}case"process-skip-update-fail":L.previousItem=s(),L.currentIndex++,Li(),Cn(),ui();break;case"process-retry-update":{let l=L.retryCount[i]||0;en(`正在重试（${l}次）...`),ui(!0);break}}}function mp(t){t==="completed-back-to-setup"&&(Vn(),a_())}function a_(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}var gp="data:image/png;base64,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";var xp=7,yp=40,sa=Math.floor(Math.random()*xp),aa="bgm-tool-container",l_="bgm-float-button",fo=null;function cd(){if(fo)return;fo=[];let t=Array.from(document.body.children);for(let e of t){let n=e.id;n===aa||n===l_||e.tagName!=="SCRIPT"&&(fo.push({el:e,origDisplay:e.style.display||""}),e.style.display="none")}}function d_(){if(fo){for(let{el:t,origDisplay:e}of fo)t.style.display=e;fo=null}}function f_(){sa=(sa+1)%xp;let t=document.getElementById("bgm-tool-logo-sprite");t&&(t.style.backgroundPosition=`${-sa*yp}px 0`)}function ud(t){let e=document.getElementById("bgm-tool-container");if(!e)return;t==="dark"||t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches?e.setAttribute("data-theme","dark"):e.removeAttribute("data-theme")}function vp(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function _p(t){return t==="dark"?"light":"dark"}function c_(){if(L.theme==="system")L.theme=_p(vp()),localStorage.setItem("bgmTheme",L.theme);else{let t=_p(L.theme);t===vp()?(L.theme="system",localStorage.removeItem("bgmTheme")):(L.theme=t,localStorage.setItem("bgmTheme",L.theme))}ud(L.theme),Ep(),L.currentView==="processing"&&sd()}function Ep(){let t=document.getElementById("bgm-tool-theme");if(!t)return;let e=rd();t.innerHTML=e==="dark"?'<i class="fas fa-moon"></i>':'<i class="fas fa-sun"></i>',t.title="主题: "+(e==="dark"?"深色":"浅色")}function bp(){let t=document.getElementById("bgm-float-button");return t||(t=document.createElement("div"),t.id="bgm-float-button",t.innerHTML='<i class="fas fa-tools"></i>',document.body.appendChild(t),t.addEventListener("click",()=>{let e=document.getElementById(aa);e&&(e.style.display="flex",cd(),t&&(t.style.display="none"))})),t}function Ap(){let t=bp();if(t.style.display="none",document.getElementById(aa)){document.getElementById(aa).style.display="flex",cd();return}let e=document.createElement("div");e.id="bgm-tool-container",e.innerHTML=`
        <div id="bgm-tool-header">
            <div id="bgm-tool-header-logo">
                <div id="bgm-tool-logo-sprite" style="background-image: url(${gp}); background-position: ${-sa*yp}px 0;"></div>
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
                            <button id="static-lock-commit" class="secondary" title="${L.isCommitMessageLocked?"解锁编辑摘要":"固定编辑摘要"}">
                                <i class="fas ${L.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>
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
    `,document.body.appendChild(e),cd(),u_();let n=document.getElementById("bgm-tool-close");n&&n.addEventListener("click",()=>{e.style.display="none",d_();let s=bp();s.style.display="flex",bd(),Cn()});let i=document.getElementById("bgm-tool-settings");i&&i.addEventListener("click",()=>{Vn()});let r=document.getElementById("bgm-tool-theme");r&&r.addEventListener("click",c_);let o=document.getElementById("bgm-tool-header-logo");o&&o.addEventListener("click",f_),ud(L.theme),Ep(),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{L.theme==="system"&&(ud("system"),L.currentView==="processing"&&sd())}),p_(),Vn()}function wp(t){t.addEventListener("click",e=>{let n=e.target.closest("button");if(!n)return;let i=n.id;switch(L.currentView){case"setup":pp(i);break;case"processing":hp(i);break;case"completed":mp(i);break}})}function u_(){let t=document.getElementById("static-buttons-container");t&&wp(t);let e=document.getElementById("core-content");e&&wp(e)}function p_(){document.getElementById("static-commit-input").addEventListener("input",o=>{L.currentView==="processing"&&L.currentSubjectData&&(L.currentCommitMessage=o.target.value,ji())});let e=document.getElementById("static-lock-commit");e.addEventListener("click",()=>{if(L.currentView!=="processing"||!L.currentSubjectData)return;L.isCommitMessageLocked=!L.isCommitMessageLocked;let o=document.getElementById("static-commit-input");L.isCommitMessageLocked?(L.lockedCommitMessage=o.value,e.innerHTML='<i class="fas fa-lock"></i>',e.title="解锁编辑摘要"):(e.innerHTML='<i class="fas fa-lock-open"></i>',e.title="固定编辑摘要",L.currentCommitMessage=ao(L.currentFieldUpdates,L.currentTagUpdates,L.currentSeriesUpdate,L.entityType),o.value=L.currentCommitMessage),Cn(),ji()}),document.getElementById("static-wcode-input").addEventListener("input",o=>{L.currentView==="processing"&&L.currentSubjectData&&(L.currentWcode=o.target.value,lo(L.currentSubjectData.infobox||"",o.target.value,"static-content-diff-container"),ji())}),document.getElementById("static-tags-input").addEventListener("input",o=>{L.currentView==="processing"&&L.currentSubjectData&&(L.currentTags=o.target.value,ts(L.currentSubjectData.metaTags||[],o.target.value.split(" ").filter(s=>s),"static-tags-diff-container"),ji())}),document.getElementById("static-series-checkbox").addEventListener("change",o=>{L.currentView==="processing"&&L.currentSubjectData&&(L.currentSeries=o.target.checked,ji())})}var Lp=`/* stylelint-disable no-descending-specificity */

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
`;var kp=`.diff-tailwindcss-wrapper .\\!container {
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
`;GM_addStyle(Lp);GM_addStyle(kp);var pd=document.createElement("link");pd.rel="stylesheet";pd.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";document.head.appendChild(pd);Ap();})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.7.0
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

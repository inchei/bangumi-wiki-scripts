// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      9.1
// @description  支持两种提交方式，可在设置页面选择，支持编辑Wcode、标签和系列状态
// @author       You
// @match        https://next.bgm.tv/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @license      MIT
// ==/UserScript==

"use strict";(()=>{var Pu=Object.create;var Zl=Object.defineProperty;var ju=Object.getOwnPropertyDescriptor;var Wu=Object.getOwnPropertyNames;var Uu=Object.getPrototypeOf,Vu=Object.prototype.hasOwnProperty;var Xl=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var zu=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Wu(e))!Vu.call(t,r)&&r!==n&&Zl(t,r,{get:()=>e[r],enumerable:!(i=ju(e,r))||i.enumerable});return t};var Jl=(t,e,n)=>(n=t!=null?Pu(Uu(t)):{},zu(e||!t||!t.__esModule?Zl(n,"default",{value:t,enumerable:!0}):n,t));var cd=Xl((mv,fd)=>{var fn=-1,qt=1,ut=0;function fo(t,e,n,i,r){if(t===e)return t?[[ut,t]]:[];if(n!=null){var o=ep(t,e,n);if(o)return o}var l=ia(t,e),a=t.substring(0,l);t=t.substring(l),e=e.substring(l),l=Xo(t,e);var f=t.substring(t.length-l);t=t.substring(0,t.length-l),e=e.substring(0,e.length-l);var u=Gu(t,e);return a&&u.unshift([ut,a]),f&&u.push([ut,f]),ra(u,r),i&&Ku(u),u}function Gu(t,e){var n;if(!t)return[[qt,e]];if(!e)return[[fn,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,o=i.indexOf(r);if(o!==-1)return n=[[qt,i.substring(0,o)],[ut,r],[qt,i.substring(o+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=fn),n;if(r.length===1)return[[fn,t],[qt,e]];var l=qu(t,e);if(l){var a=l[0],f=l[1],u=l[2],d=l[3],c=l[4],p=fo(a,u),m=fo(f,d);return p.concat([[ut,c]],m)}return Yu(t,e)}function Yu(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),o=r,l=2*r,a=new Array(l),f=new Array(l),u=0;u<l;u++)a[u]=-1,f[u]=-1;a[o+1]=0,f[o+1]=0;for(var d=n-i,c=d%2!==0,p=0,m=0,g=0,$=0,w=0;w<r;w++){for(var _=-w+p;_<=w-m;_+=2){var L=o+_,x;_===-w||_!==w&&a[L-1]<a[L+1]?x=a[L+1]:x=a[L-1]+1;for(var I=x-_;x<n&&I<i&&t.charAt(x)===e.charAt(I);)x++,I++;if(a[L]=x,x>n)m+=2;else if(I>i)p+=2;else if(c){var S=o+d-_;if(S>=0&&S<l&&f[S]!==-1){var y=n-f[S];if(x>=y)return td(t,e,x,I)}}}for(var h=-w+g;h<=w-$;h+=2){var S=o+h,y;h===-w||h!==w&&f[S-1]<f[S+1]?y=f[S+1]:y=f[S-1]+1;for(var b=y-h;y<n&&b<i&&t.charAt(n-y-1)===e.charAt(i-b-1);)y++,b++;if(f[S]=y,y>n)$+=2;else if(b>i)g+=2;else if(!c){var L=o+d-h;if(L>=0&&L<l&&a[L]!==-1){var x=a[L],I=o+x-L;if(y=n-y,x>=y)return td(t,e,x,I)}}}}return[[fn,t],[qt,e]]}function td(t,e,n,i){var r=t.substring(0,n),o=e.substring(0,i),l=t.substring(n),a=e.substring(i),f=fo(r,o),u=fo(l,a);return f.concat(u)}function ia(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(o,r)==e.substring(o,r)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return sd(t.charCodeAt(r-1))&&r--,r}function nd(t,e){var n=t.length,i=e.length;if(n==0||i==0)return 0;n>i?t=t.substring(n-i):n<i&&(e=e.substring(0,n));var r=Math.min(n,i);if(t==e)return r;for(var o=0,l=1;;){var a=t.substring(r-l),f=e.indexOf(a);if(f==-1)return o;l+=f,(f==0||t.substring(r-l)==e.substring(0,l))&&(o=l,l++)}}function Xo(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(t.length-r,t.length-o)==e.substring(e.length-r,e.length-o)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return ad(t.charCodeAt(t.length-r))&&r--,r}function qu(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||i.length*2<n.length)return null;function r(m,g,$){for(var w=m.substring($,$+Math.floor(m.length/4)),_=-1,L="",x,I,S,y;(_=g.indexOf(w,_+1))!==-1;){var h=ia(m.substring($),g.substring(_)),b=Xo(m.substring(0,$),g.substring(0,_));L.length<b+h&&(L=g.substring(_-b,_)+g.substring(_,_+h),x=m.substring(0,$-b),I=m.substring($+h),S=g.substring(0,_-b),y=g.substring(_+h))}return L.length*2>=m.length?[x,I,S,y,L]:null}var o=r(n,i,Math.ceil(n.length/4)),l=r(n,i,Math.ceil(n.length/2)),a;if(!o&&!l)return null;l?o?a=o[4].length>l[4].length?o:l:a=l:a=o;var f,u,d,c;t.length>e.length?(f=a[0],u=a[1],d=a[2],c=a[3]):(d=a[0],c=a[1],f=a[2],u=a[3]);var p=a[4];return[f,u,d,c,p]}function Ku(t){for(var e=!1,n=[],i=0,r=null,o=0,l=0,a=0,f=0,u=0;o<t.length;)t[o][0]==ut?(n[i++]=o,l=f,a=u,f=0,u=0,r=t[o][1]):(t[o][0]==qt?f+=t[o][1].length:u+=t[o][1].length,r&&r.length<=Math.max(l,a)&&r.length<=Math.max(f,u)&&(t.splice(n[i-1],0,[fn,r]),t[n[i-1]+1][0]=qt,i--,i--,o=i>0?n[i-1]:-1,l=0,a=0,f=0,u=0,r=null,e=!0)),o++;for(e&&ra(t),Ju(t),o=1;o<t.length;){if(t[o-1][0]==fn&&t[o][0]==qt){var d=t[o-1][1],c=t[o][1],p=nd(d,c),m=nd(c,d);p>=m?(p>=d.length/2||p>=c.length/2)&&(t.splice(o,0,[ut,c.substring(0,p)]),t[o-1][1]=d.substring(0,d.length-p),t[o+1][1]=c.substring(p),o++):(m>=d.length/2||m>=c.length/2)&&(t.splice(o,0,[ut,d.substring(0,m)]),t[o-1][0]=qt,t[o-1][1]=c.substring(0,c.length-m),t[o+1][0]=fn,t[o+1][1]=d.substring(m),o++),o++}o++}}var id=/[^a-zA-Z0-9]/,rd=/\s/,od=/[\r\n]/,Zu=/\n\r?\n$/,Xu=/^\r?\n\r?\n/;function Ju(t){function e(m,g){if(!m||!g)return 6;var $=m.charAt(m.length-1),w=g.charAt(0),_=$.match(id),L=w.match(id),x=_&&$.match(rd),I=L&&w.match(rd),S=x&&$.match(od),y=I&&w.match(od),h=S&&m.match(Zu),b=y&&g.match(Xu);return h||b?5:S||y?4:_&&!x&&I?3:x||I?2:_||L?1:0}for(var n=1;n<t.length-1;){if(t[n-1][0]==ut&&t[n+1][0]==ut){var i=t[n-1][1],r=t[n][1],o=t[n+1][1],l=Xo(i,r);if(l){var a=r.substring(r.length-l);i=i.substring(0,i.length-l),r=a+r.substring(0,r.length-l),o=a+o}for(var f=i,u=r,d=o,c=e(i,r)+e(r,o);r.charAt(0)===o.charAt(0);){i+=r.charAt(0),r=r.substring(1)+o.charAt(0),o=o.substring(1);var p=e(i,r)+e(r,o);p>=c&&(c=p,f=i,u=r,d=o)}t[n-1][1]!=f&&(f?t[n-1][1]=f:(t.splice(n-1,1),n--),t[n][1]=u,d?t[n+1][1]=d:(t.splice(n+1,1),n--))}n++}}function ra(t,e){t.push([ut,""]);for(var n=0,i=0,r=0,o="",l="",a;n<t.length;){if(n<t.length-1&&!t[n][1]){t.splice(n,1);continue}switch(t[n][0]){case qt:r++,l+=t[n][1],n++;break;case fn:i++,o+=t[n][1],n++;break;case ut:var f=n-r-i-1;if(e){if(f>=0&&dd(t[f][1])){var u=t[f][1].slice(-1);if(t[f][1]=t[f][1].slice(0,-1),o=u+o,l=u+l,!t[f][1]){t.splice(f,1),n--;var d=f-1;t[d]&&t[d][0]===qt&&(r++,l=t[d][1]+l,d--),t[d]&&t[d][0]===fn&&(i++,o=t[d][1]+o,d--),f=d}}if(ld(t[n][1])){var u=t[n][1].charAt(0);t[n][1]=t[n][1].slice(1),o+=u,l+=u}}if(n<t.length-1&&!t[n][1]){t.splice(n,1);break}if(o.length>0||l.length>0){o.length>0&&l.length>0&&(a=ia(l,o),a!==0&&(f>=0?t[f][1]+=l.substring(0,a):(t.splice(0,0,[ut,l.substring(0,a)]),n++),l=l.substring(a),o=o.substring(a)),a=Xo(l,o),a!==0&&(t[n][1]=l.substring(l.length-a)+t[n][1],l=l.substring(0,l.length-a),o=o.substring(0,o.length-a)));var c=r+i;o.length===0&&l.length===0?(t.splice(n-c,c),n=n-c):o.length===0?(t.splice(n-c,c,[qt,l]),n=n-c+1):l.length===0?(t.splice(n-c,c,[fn,o]),n=n-c+1):(t.splice(n-c,c,[fn,o],[qt,l]),n=n-c+2)}n!==0&&t[n-1][0]===ut?(t[n-1][1]+=t[n][1],t.splice(n,1)):n++,r=0,i=0,o="",l="";break}}t[t.length-1][1]===""&&t.pop();var p=!1;for(n=1;n<t.length-1;)t[n-1][0]===ut&&t[n+1][0]===ut&&(t[n][1].substring(t[n][1].length-t[n-1][1].length)===t[n-1][1]?(t[n][1]=t[n-1][1]+t[n][1].substring(0,t[n][1].length-t[n-1][1].length),t[n+1][1]=t[n-1][1]+t[n+1][1],t.splice(n-1,1),p=!0):t[n][1].substring(0,t[n+1][1].length)==t[n+1][1]&&(t[n-1][1]+=t[n+1][1],t[n][1]=t[n][1].substring(t[n+1][1].length)+t[n+1][1],t.splice(n+1,1),p=!0)),n++;p&&ra(t,e)}function sd(t){return t>=55296&&t<=56319}function ad(t){return t>=56320&&t<=57343}function ld(t){return ad(t.charCodeAt(0))}function dd(t){return sd(t.charCodeAt(t.length-1))}function Qu(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}function na(t,e,n,i){return dd(t)||ld(i)?null:Qu([[ut,t],[fn,e],[qt,n],[ut,i]])}function ep(t,e,n){var i=typeof n=="number"?{index:n,length:0}:n.oldRange,r=typeof n=="number"?null:n.newRange,o=t.length,l=e.length;if(i.length===0&&(r===null||r.length===0)){var a=i.index,f=t.slice(0,a),u=t.slice(a),d=r?r.index:null;e:{var c=a+l-o;if(d!==null&&d!==c||c<0||c>l)break e;var p=e.slice(0,c),m=e.slice(c);if(m!==u)break e;var g=Math.min(a,c),$=f.slice(0,g),w=p.slice(0,g);if($!==w)break e;var _=f.slice(g),L=p.slice(g);return na($,_,L,u)}e:{if(d!==null&&d!==a)break e;var x=a,p=e.slice(0,x),m=e.slice(x);if(p!==f)break e;var I=Math.min(o-x,l-x),S=u.slice(u.length-I),y=m.slice(m.length-I);if(S!==y)break e;var _=u.slice(0,u.length-I),L=m.slice(0,m.length-I);return na(f,_,L,S)}}if(i.length>0&&r&&r.length===0)e:{var $=t.slice(0,i.index),S=t.slice(i.index+i.length),g=$.length,I=S.length;if(l<g+I)break e;var w=e.slice(0,g),y=e.slice(l-I);if($!==w||S!==y)break e;var _=t.slice(g,o-I),L=e.slice(g,l-I);return na($,_,L,S)}return null}function Jo(t,e,n,i){return fo(t,e,n,i,!0)}Jo.INSERT=qt;Jo.DELETE=fn;Jo.EQUAL=ut;fd.exports=Jo});var yu=Xl((Vl,zl)=>{((t,e)=>{typeof define=="function"&&define.amd?define([],e):typeof zl=="object"&&typeof Vl<"u"?zl.exports=e():t.Papa=e()})(Vl,function t(){var e=typeof self<"u"?self:typeof window<"u"?window:e!==void 0?e:{},n,i=!e.document&&!!e.postMessage,r=e.IS_PAPA_WORKER||!1,o={},l=0,a={};function f(h){return h.charCodeAt(0)===65279?h.slice(1):h}function u(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(b){var E=I(b);E.chunkSize=parseInt(E.chunkSize),b.step||b.chunk||(E.chunkSize=null),this._handle=new g(E),(this._handle.streamer=this)._config=E}.call(this,h),this.parseChunk=function(b,E){var D=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<D){let W=this._config.newline;W||(M=this._config.quoteChar||'"',W=this._handle.guessLineEndings(b,M)),b=[...b.split(W).slice(D)].join(W)}this.isFirstChunk&&y(this._config.beforeFirstChunk)&&(M=this._config.beforeFirstChunk(b))!==void 0&&(b=M),this.isFirstChunk=!1,this._halted=!1;var D=this._partialLine+b,M=(this._partialLine="",this._handle.parse(D,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(b=M.meta.cursor,D=(this._finished||(this._partialLine=D.substring(b-this._baseIndex),this._baseIndex=b),M&&M.data&&(this._rowCount+=M.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),r)e.postMessage({results:M,workerId:a.WORKER_ID,finished:D});else if(y(this._config.chunk)&&!E){if(this._config.chunk(M,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=M=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(M.data),this._completeResults.errors=this._completeResults.errors.concat(M.errors),this._completeResults.meta=M.meta),this._completed||!D||!y(this._config.complete)||M&&M.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),D||M&&M.meta.paused||this._nextChunk(),M}this._halted=!0},this._sendError=function(b){y(this._config.error)?this._config.error(b):r&&this._config.error&&e.postMessage({workerId:a.WORKER_ID,error:b,finished:!1})}}function d(h){var b;(h=h||{}).chunkSize||(h.chunkSize=a.RemoteChunkSize),u.call(this,h),this._nextChunk=i?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(E){this._input=E,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(b=new XMLHttpRequest,this._config.withCredentials&&(b.withCredentials=this._config.withCredentials),i||(b.onload=S(this._chunkLoaded,this),b.onerror=S(this._chunkError,this)),b.open(this._config.downloadRequestBody?"POST":"GET",this._input,!i),this._config.downloadRequestHeaders){var E,D=this._config.downloadRequestHeaders;for(E in D)b.setRequestHeader(E,D[E])}var M;this._config.chunkSize&&(M=this._start+this._config.chunkSize-1,b.setRequestHeader("Range","bytes="+this._start+"-"+M));try{b.send(this._config.downloadRequestBody)}catch(W){this._chunkError(W.message)}i&&b.status===0&&this._chunkError()}},this._chunkLoaded=function(){b.readyState===4&&(b.status<200||400<=b.status?this._chunkError():(this._start+=this._config.chunkSize||b.responseText.length,this._finished=!this._config.chunkSize||this._start>=(E=>(E=E.getResponseHeader("Content-Range"))!==null?parseInt(E.substring(E.lastIndexOf("/")+1)):-1)(b),this.parseChunk(b.responseText)))},this._chunkError=function(E){E=b.statusText||E,this._sendError(new Error(E))}}function c(h){(h=h||{}).chunkSize||(h.chunkSize=a.LocalChunkSize),u.call(this,h);var b,E,D=typeof FileReader<"u";this.stream=function(M){this._input=M,E=M.slice||M.webkitSlice||M.mozSlice,D?((b=new FileReader).onload=S(this._chunkLoaded,this),b.onerror=S(this._chunkError,this)):b=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var M=this._input,W=(this._config.chunkSize&&(W=Math.min(this._start+this._config.chunkSize,this._input.size),M=E.call(M,this._start,W)),b.readAsText(M,this._config.encoding));D||this._chunkLoaded({target:{result:W}})},this._chunkLoaded=function(M){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(M.target.result)},this._chunkError=function(){this._sendError(b.error)}}function p(h){var b;u.call(this,h=h||{}),this.stream=function(E){return b=E,this._nextChunk()},this._nextChunk=function(){var E,D;if(!this._finished)return E=this._config.chunkSize,b=E?(D=b.substring(0,E),b.substring(E)):(D=b,""),this._finished=!b,this.parseChunk(D)}}function m(h){u.call(this,h=h||{});var b=[],E=!0,D=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(M){this._input=M,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){D&&b.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),b.length?this.parseChunk(b.shift()):E=!0},this._streamData=S(function(M){try{b.push(typeof M=="string"?M:M.toString(this._config.encoding)),E&&(E=!1,this._checkIsFinished(),this.parseChunk(b.shift()))}catch(W){this._streamError(W)}},this),this._streamError=S(function(M){this._streamCleanUp(),this._sendError(M)},this),this._streamEnd=S(function(){this._streamCleanUp(),D=!0,this._streamData("")},this),this._streamCleanUp=S(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function g(h){var b,E,D,M,W=Math.pow(2,53),P=-W,K=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,ee=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,re=this,Z=0,A=0,Y=!1,j=!1,V=[],H={data:[],errors:[],meta:{}};function he(se){return h.skipEmptyLines==="greedy"?se.join("").trim()==="":se.length===1&&se[0].length===0}function ie(){if(H&&D&&(ve("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+a.DefaultDelimiter+"'"),D=!1),h.skipEmptyLines&&(H.data=H.data.filter(function(ge){return!he(ge)})),Q()){let ge=function(ke,Be){ke=f(ke),y(h.transformHeader)&&(ke=h.transformHeader(ke,Be)),V.push(ke)};var $e=ge;if(H)if(Array.isArray(H.data[0])){for(var se=0;Q()&&se<H.data.length;se++)H.data[se].forEach(ge);H.data.splice(0,1)}else H.data.forEach(ge)}function te(ge,ke){for(var Be=h.header?{}:[],Pe=0;Pe<ge.length;Pe++){var Se=Pe,Rt=ge[Pe],Rt=((De,Ke)=>(ct=>(h.dynamicTypingFunction&&h.dynamicTyping[ct]===void 0&&(h.dynamicTyping[ct]=h.dynamicTypingFunction(ct)),(h.dynamicTyping[ct]||h.dynamicTyping)===!0))(De)?Ke==="true"||Ke==="TRUE"||Ke!=="false"&&Ke!=="FALSE"&&((ct=>{if(K.test(ct)&&(ct=parseFloat(ct),P<ct&&ct<W))return 1})(Ke)?parseFloat(Ke):ee.test(Ke)?new Date(Ke):Ke===""?null:Ke):Ke)(Se=h.header?Pe>=V.length?"__parsed_extra":V[Pe]:Se,Rt=h.transform?h.transform(Rt,Se):Rt);Se==="__parsed_extra"?(Be[Se]=Be[Se]||[],Be[Se].push(Rt)):Be[Se]=Rt}return h.header&&(Pe>V.length?ve("FieldMismatch","TooManyFields","Too many fields: expected "+V.length+" fields but parsed "+Pe,A+ke):Pe<V.length&&ve("FieldMismatch","TooFewFields","Too few fields: expected "+V.length+" fields but parsed "+Pe,A+ke)),Be}var xe;H&&(h.header||h.dynamicTyping||h.transform)&&(xe=1,!H.data.length||Array.isArray(H.data[0])?(H.data=H.data.map(te),xe=H.data.length):H.data=te(H.data,0),h.header&&H.meta&&(H.meta.fields=V),A+=xe)}function Q(){return h.header&&V.length===0}function ve(se,te,xe,$e){se={type:se,code:te,message:xe},$e!==void 0&&(se.row=$e),H.errors.push(se)}y(h.step)&&(M=h.step,h.step=function(se){H=se,Q()?ie():(ie(),H.data.length!==0&&(Z+=se.data.length,h.preview&&Z>h.preview?E.abort():(H.data=H.data[0],M(H,re))))}),this.parse=function(se,te,xe){var $e=h.quoteChar||'"',$e=(h.newline||(h.newline=this.guessLineEndings(se,$e)),D=!1,h.delimiter?y(h.delimiter)&&(h.delimiter=h.delimiter(se),H.meta.delimiter=h.delimiter):(($e=((ge,ke,Be,Pe,Se)=>{var Rt,De,Ke,ct;Se=Se||[",","	","|",";",a.RECORD_SEP,a.UNIT_SEP];for(var hr=0;hr<Se.length;hr++){for(var Wn,so=Se[hr],Ht=0,Un=0,$t=0,en=(Ke=void 0,new w({comments:Pe,delimiter:so,newline:ke,preview:10}).parse(ge)),ui=0;ui<en.data.length;ui++)Be&&he(en.data[ui])?$t++:(Wn=en.data[ui].length,Un+=Wn,Ke===void 0?Ke=Wn:0<Wn&&(Ht+=Math.abs(Wn-Ke),Ke=Wn));0<en.data.length&&(Un/=en.data.length-$t),(De===void 0||Ht<=De)&&(ct===void 0||ct<Un)&&1.99<Un&&(De=Ht,Rt=so,ct=Un)}return{successful:!!(h.delimiter=Rt),bestDelimiter:Rt}})(se,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=$e.bestDelimiter:(D=!0,h.delimiter=a.DefaultDelimiter),H.meta.delimiter=h.delimiter),I(h));return h.preview&&h.header&&$e.preview++,b=se,E=new w($e),H=E.parse(b,te,xe),ie(),Y?{meta:{paused:!0}}:H||{meta:{paused:!1}}},this.paused=function(){return Y},this.pause=function(){Y=!0,E.abort(),b=y(h.chunk)?"":b.substring(E.getCharIndex())},this.resume=function(){re.streamer._halted?(Y=!1,re.streamer.parseChunk(b,!0)):setTimeout(re.resume,3)},this.aborted=function(){return j},this.abort=function(){j=!0,E.abort(),H.meta.aborted=!0,y(h.complete)&&h.complete(H),b=""},this.guessLineEndings=function(ge,$e){ge=ge.substring(0,1048576);var $e=new RegExp($($e)+"([^]*?)"+$($e),"gm"),xe=(ge=ge.replace($e,"")).split("\r"),$e=ge.split(`
`),ge=1<$e.length&&$e[0].length<xe[0].length;if(xe.length===1||ge)return`
`;for(var ke=0,Be=0;Be<xe.length;Be++)xe[Be][0]===`
`&&ke++;return ke>=xe.length/2?`\r
`:"\r"}}function $(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function w(h){var b=(h=h||{}).delimiter,E=h.newline,D=h.comments,M=h.step,W=h.preview,P=h.fastMode,K=null,ee=!1,re=h.quoteChar==null?'"':h.quoteChar,Z=re;if(h.escapeChar!==void 0&&(Z=h.escapeChar),(typeof b!="string"||-1<a.BAD_DELIMITERS.indexOf(b))&&(b=","),D===b)throw new Error("Comment character same as delimiter");D===!0?D="#":(typeof D!="string"||-1<a.BAD_DELIMITERS.indexOf(D))&&(D=!1),E!==`
`&&E!=="\r"&&E!==`\r
`&&(E=`
`);var A=0,Y=!1;this.parse=function(j,V,H){if(typeof j!="string")throw new Error("Input must be a string");var he=j.length,ie=b.length,Q=E.length,ve=D.length,se=y(M),te=[],xe=[],$e=[],ge=A=0;if(!j)return Ht();if(P||P!==!1&&j.indexOf(re)===-1){for(var ke=j.split(E),Be=0;Be<ke.length;Be++){if($e=ke[Be],A+=$e.length,Be!==ke.length-1)A+=E.length;else if(H)return Ht();if(!D||$e.substring(0,ve)!==D){if(se){if(te=[],ct($e.split(b)),Un(),Y)return Ht()}else ct($e.split(b));if(W&&W<=Be)return te=te.slice(0,W),Ht(!0)}}return Ht()}for(var Pe=j.indexOf(b,A),Se=j.indexOf(E,A),Rt=new RegExp($(Z)+$(re),"g"),De=j.indexOf(re,A);;)if(j[A]===re)for(De=A,A++;;){if((De=j.indexOf(re,De+1))===-1)return H||xe.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:te.length,index:A}),Wn();if(De===he-1)return Wn(j.substring(A,De).replace(Rt,re));if(re===Z&&j[De+1]===Z)De++;else if(re===Z||De===0||j[De-1]!==Z){Pe!==-1&&Pe<De+1&&(Pe=j.indexOf(b,De+1));var Ke=hr((Se=Se!==-1&&Se<De+1?j.indexOf(E,De+1):Se)===-1?Pe:Math.min(Pe,Se));if(j.substr(De+1+Ke,ie)===b){$e.push(j.substring(A,De).replace(Rt,re)),j[A=De+1+Ke+ie]!==re&&(De=j.indexOf(re,A)),Pe=j.indexOf(b,A),Se=j.indexOf(E,A);break}if(Ke=hr(Se),j.substring(De+1+Ke,De+1+Ke+Q)===E){if($e.push(j.substring(A,De).replace(Rt,re)),so(De+1+Ke+Q),Pe=j.indexOf(b,A),De=j.indexOf(re,A),se&&(Un(),Y))return Ht();if(W&&te.length>=W)return Ht(!0);break}xe.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:te.length,index:A}),De++}}else if(D&&$e.length===0&&j.substring(A,A+ve)===D){if(Se===-1)return Ht();A=Se+Q,Se=j.indexOf(E,A),Pe=j.indexOf(b,A)}else if(Pe!==-1&&(Pe<Se||Se===-1))$e.push(j.substring(A,Pe)),A=Pe+ie,Pe=j.indexOf(b,A);else{if(Se===-1)break;if($e.push(j.substring(A,Se)),so(Se+Q),se&&(Un(),Y))return Ht();if(W&&te.length>=W)return Ht(!0)}return Wn();function ct($t){te.push($t),ge=A}function hr($t){var en=0;return en=$t!==-1&&($t=j.substring(De+1,$t))&&$t.trim()===""?$t.length:en}function Wn($t){return H||($t===void 0&&($t=j.substring(A)),$e.push($t),A=he,ct($e),se&&Un()),Ht()}function so($t){A=$t,ct($e),$e=[],Se=j.indexOf(E,A)}function Ht($t){if(h.header&&!V&&te.length&&!ee){var en=te[0],ui=Object.create(null),ta=new Set(en);let ql=!1;for(let mr=0;mr<en.length;mr++){let Vn=f(en[mr]);if(ui[Vn=y(h.transformHeader)?h.transformHeader(Vn,mr):Vn]){let ao,Kl=ui[Vn];for(;ao=Vn+"_"+Kl,Kl++,ta.has(ao););ta.add(ao),en[mr]=ao,ui[Vn]++,ql=!0,(K=K===null?{}:K)[ao]=Vn}else ui[Vn]=1,en[mr]=Vn;ta.add(Vn)}ql&&console.warn("Duplicate headers found and renamed."),ee=!0}return{data:te,errors:xe,meta:{delimiter:b,linebreak:E,aborted:Y,truncated:!!$t,cursor:ge+(V||0),renamedHeaders:K}}}function Un(){M(Ht()),te=[],xe=[]}},this.abort=function(){Y=!0},this.getCharIndex=function(){return A}}function _(h){var b=h.data,E=o[b.workerId],D=!1;if(b.error)E.userError(b.error,b.file);else if(b.results&&b.results.data){var M={abort:function(){D=!0,L(b.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:x,resume:x};if(y(E.userStep)){for(var W=0;W<b.results.data.length&&(E.userStep({data:b.results.data[W],errors:b.results.errors,meta:b.results.meta},M),!D);W++);delete b.results}else y(E.userChunk)&&(E.userChunk(b.results,M,b.file),delete b.results)}b.finished&&!D&&L(b.workerId,b.results)}function L(h,b){var E=o[h];y(E.userComplete)&&E.userComplete(b),E.terminate(),delete o[h]}function x(){throw new Error("Not implemented.")}function I(h){if(typeof h!="object"||h===null)return h;var b,E=Array.isArray(h)?[]:{};for(b in h)E[b]=I(h[b]);return E}function S(h,b){return function(){h.apply(b,arguments)}}function y(h){return typeof h=="function"}return a.parse=function(h,b){var E=(b=b||{}).dynamicTyping||!1;if(y(E)&&(b.dynamicTypingFunction=E,E={}),b.dynamicTyping=E,b.transform=!!y(b.transform)&&b.transform,!b.worker||!a.WORKERS_SUPPORTED)return E=null,a.NODE_STREAM_INPUT,typeof h=="string"?(h=f(h),E=new(b.download?d:p)(b)):h.readable===!0&&y(h.read)&&y(h.on)?E=new m(b):(e.File&&h instanceof File||h instanceof Object)&&(E=new c(b)),E.stream(h);(E=(()=>{var D;return!!a.WORKERS_SUPPORTED&&(D=(()=>{var M=e.URL||e.webkitURL||null,W=t.toString();return a.BLOB_URL||(a.BLOB_URL=M.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",W,")();"],{type:"text/javascript"})))})(),(D=new e.Worker(D)).onmessage=_,D.id=l++,o[D.id]=D)})()).userStep=b.step,E.userChunk=b.chunk,E.userComplete=b.complete,E.userError=b.error,b.step=y(b.step),b.chunk=y(b.chunk),b.complete=y(b.complete),b.error=y(b.error),delete b.worker,E.postMessage({input:h,config:b,workerId:E.id})},a.unparse=function(h,b){var E=!1,D=!0,M=",",W=`\r
`,P='"',K=P+P,ee=!1,re=null,Z=!1,A=((()=>{if(typeof b=="object"){if(typeof b.delimiter!="string"||a.BAD_DELIMITERS.filter(function(V){return b.delimiter.indexOf(V)!==-1}).length||(M=b.delimiter),typeof b.quotes!="boolean"&&typeof b.quotes!="function"&&!Array.isArray(b.quotes)||(E=b.quotes),typeof b.skipEmptyLines!="boolean"&&typeof b.skipEmptyLines!="string"||(ee=b.skipEmptyLines),typeof b.newline=="string"&&(W=b.newline),typeof b.quoteChar=="string"&&(P=b.quoteChar,K=P+P),typeof b.header=="boolean"&&(D=b.header),Array.isArray(b.columns)){if(b.columns.length===0)throw new Error("Option columns is empty");re=b.columns}b.escapeChar!==void 0&&(K=b.escapeChar+P),b.escapeFormulae instanceof RegExp?Z=b.escapeFormulae:typeof b.escapeFormulae=="boolean"&&b.escapeFormulae&&(Z=/^[=+\-@\t\r].*$/)}})(),new RegExp($(P),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return Y(null,h,ee);if(typeof h[0]=="object")return Y(re||Object.keys(h[0]),h,ee)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||re),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),Y(h.fields||[],h.data||[],ee);throw new Error("Unable to serialize unrecognized input");function Y(V,H,he){var ie="",Q=(typeof V=="string"&&(V=JSON.parse(V)),typeof H=="string"&&(H=JSON.parse(H)),Array.isArray(V)&&0<V.length),ve=!Array.isArray(H[0]);if(Q&&D){for(var se=0;se<V.length;se++)0<se&&(ie+=M),ie+=j(V[se],se);0<H.length&&(ie+=W)}for(var te=0;te<H.length;te++){var xe=(Q?V:H[te]).length,$e=!1,ge=Q?Object.keys(H[te]).length===0:H[te].length===0;if(he&&!Q&&($e=he==="greedy"?H[te].join("").trim()==="":H[te].length===1&&H[te][0].length===0),he==="greedy"&&Q){for(var ke=[],Be=0;Be<xe;Be++){var Pe=ve?V[Be]:Be;ke.push(H[te][Pe])}$e=ke.join("").trim()===""}if(!$e){for(var Se=0;Se<xe;Se++){0<Se&&!ge&&(ie+=M);var Rt=Q&&ve?V[Se]:Se;ie+=j(H[te][Rt],Se)}te<H.length-1&&(!he||0<xe&&!ge)&&(ie+=W)}}return ie}function j(V,H){var he,ie,Q;return V==null?"":V.constructor===Date?JSON.stringify(V).slice(1,25):(Q=!1,Z&&typeof V=="string"&&Z.test(V)&&(V="'"+V,Q=!0),ie=(he=V.toString()).replace(A,K),(Q=Q||E===!0||typeof E=="function"&&E(V,H)||Array.isArray(E)&&E[H]||((ve,se)=>{for(var te=0;te<se.length;te++)if(-1<ve.indexOf(se[te]))return!0;return!1})(ie,a.BAD_DELIMITERS)||-1<ie.indexOf(M)||-1<he.indexOf(P)||ie.charAt(0)===" "||ie.charAt(ie.length-1)===" ")?P+ie+P:ie)}},a.RECORD_SEP="",a.UNIT_SEP="",a.BYTE_ORDER_MARK="\uFEFF",a.BAD_DELIMITERS=["\r",`
`,'"',a.BYTE_ORDER_MARK],a.WORKERS_SUPPORTED=!i&&!!e.Worker,a.NODE_STREAM_INPUT=1,a.LocalChunkSize=10485760,a.RemoteChunkSize=5242880,a.DefaultDelimiter=",",a.Parser=w,a.ParserHandle=g,a.NetworkStreamer=d,a.FileStreamer=c,a.StringStreamer=p,a.ReadableStreamStreamer=m,e.jQuery&&((n=e.jQuery).fn.parse=function(h){var b=h.config||{},E=[];return this.each(function(W){if(!(n(this).prop("tagName").toUpperCase()==="INPUT"&&n(this).attr("type").toLowerCase()==="file"&&e.FileReader)||!this.files||this.files.length===0)return!0;for(var P=0;P<this.files.length;P++)E.push({file:this.files[P],inputElem:this,instanceConfig:n.extend({},b)})}),D(),this;function D(){if(E.length===0)y(h.complete)&&h.complete();else{var W,P,K,ee,re=E[0];if(y(h.before)){var Z=h.before(re.file,re.inputElem);if(typeof Z=="object"){if(Z.action==="abort")return W="AbortError",P=re.file,K=re.inputElem,ee=Z.reason,void(y(h.error)&&h.error({name:W},P,K,ee));if(Z.action==="skip")return void M();typeof Z.config=="object"&&(re.instanceConfig=n.extend(re.instanceConfig,Z.config))}else if(Z==="skip")return void M()}var A=re.instanceConfig.complete;re.instanceConfig.complete=function(Y){y(A)&&A(Y,re.file,re.inputElem),M()},a.parse(re.file,re.instanceConfig)}}function M(){E.splice(0,1),D()}}),r&&(e.onmessage=function(h){h=h.data,a.WORKER_ID===void 0&&h&&(a.WORKER_ID=h.workerId),typeof h.input=="string"?e.postMessage({workerId:a.WORKER_ID,results:a.parse(h.input,h.config),finished:!0}):(e.File&&h.input instanceof File||h.input instanceof Object)&&(h=a.parse(h.input,h.config))&&e.postMessage({workerId:a.WORKER_ID,results:h,finished:!0})}),(d.prototype=Object.create(u.prototype)).constructor=d,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,a})});var N={accessToken:GM_getValue("bgmAccessToken")||"",formhash:GM_getValue("bgmFormhash")||"",submitMethod:GM_getValue("bgmSubmitMethod")||"patch",csvData:JSON.parse(localStorage.getItem("bgmCsvData")||"null"),currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),totalItems:0,processing:!1,paused:!1,currentView:"setup",currentSubjectData:null,currentFieldUpdates:null,currentTagUpdates:null,currentSeriesUpdate:null,currentWcode:null,currentTags:null,currentSeries:null,currentCommitMessage:null,isCommitMessageLocked:localStorage.getItem("bgmIsCommitMessageLocked")==="true"||!1,lockedCommitMessage:localStorage.getItem("bgmLockedCommitMessage")||"",retryCount:{},currentItemId:null,previousItem:JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),diffViewMode:localStorage.getItem("bgmDiffViewMode")||"split"};function zn(){GM_setValue("bgmAccessToken",N.accessToken),GM_setValue("bgmFormhash",N.formhash),GM_setValue("bgmSubmitMethod",N.submitMethod),localStorage.setItem("bgmCsvData",JSON.stringify(N.csvData)),localStorage.setItem("bgmCurrentIndex",N.currentIndex.toString()),localStorage.setItem("bgmIsCommitMessageLocked",N.isCommitMessageLocked.toString()),localStorage.setItem("bgmLockedCommitMessage",N.lockedCommitMessage),N.previousItem&&localStorage.setItem("bgmPreviousItem",JSON.stringify(N.previousItem)),localStorage.setItem("bgmDiffViewMode",N.diffViewMode)}function Pi(t,e){let n={subject:{wikiPath:`/p1/wiki/subjects/${e}`,historyPath:`/p1/wiki/subjects/${e}/history-summary`,patchBodyKey:"subject",editPagePath:`https://bgm.tv/subject/${e}/edit`},character:{wikiPath:`/p1/wiki/characters/${e}`,historyPath:`/p1/wiki/characters/${e}/history-summary`,patchBodyKey:"character",editPagePath:`https://bgm.tv/character/${e}/edit`},person:{wikiPath:`/p1/wiki/persons/${e}`,historyPath:`/p1/wiki/persons/${e}/history-summary`,patchBodyKey:"person",editPagePath:`https://bgm.tv/person/${e}/edit`}};return n[t]||n.subject}function lo(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="block")}function ji(t,e){let n=document.getElementById("progress-text"),i=document.getElementById("progress-bar");n&&(n.textContent=`\u5904\u7406\u8FDB\u5EA6: ${t}/${e}`);let r=e>0?t/e*100:0;i&&(i.style.width=`${r}%`)}function Ql(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Wi(t){let e=document.getElementById("bgm-loading-overlay"),n=document.getElementById("loading-text");n&&(n.textContent=t),e&&e.classList.add("active")}function vn(){let t=document.getElementById("bgm-loading-overlay");t&&t.classList.remove("active")}function Yt(t){let e=document.getElementById("bgm-status-message");e&&(e.classList.remove("show"),e.offsetWidth,e.textContent=t,e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3))}function ed(){let t=document.getElementById("bgm-status-message");t&&t.classList.remove("show")}var Md=Jl(cd(),1);var tp={name:"stub",maxLineToIgnoreSyntax:0,setMaxLineToIgnoreSyntax:()=>{},ignoreSyntaxHighlightList:[],setIgnoreSyntaxHighlightList:()=>{},getAST:()=>({children:[]}),processAST:()=>({syntaxFileObject:{},syntaxFileLineNumber:0}),hasRegisteredCurrentLang:()=>!1,getHighlighterEngine:()=>null},gr=tp;var $r;(function(t){t.None="None",t.Up="Up",t.Down="Down",t.Both="Both",t.Short="Short"})($r||($r={}));var da=class{constructor(e,n,i,r,o){this.header=e,this.lines=n,this.unifiedDiffStart=i,this.unifiedDiffEnd=r,this.expansionType=o}equals(e){return this===e?!0:this.header.equals(e.header)&&this.unifiedDiffStart===e.unifiedDiffStart&&this.unifiedDiffEnd===e.unifiedDiffEnd&&this.expansionType===e.expansionType&&this.lines.length===e.lines.length&&this.lines.every((n,i)=>n.equals(e.lines[i]))}},fa=class{constructor(e,n,i,r){this.oldStartLine=e,this.oldLineCount=n,this.newStartLine=i,this.newLineCount=r}toDiffLineRepresentation(){return`@@ -${this.oldStartLine},${this.oldLineCount} +${this.newStartLine},${this.newLineCount} @@`}equals(e){return this.oldStartLine===e.oldStartLine&&this.oldLineCount===e.oldLineCount&&this.newStartLine===e.newStartLine&&this.oldStartLine===e.oldStartLine}};var Nn="--diff-add-content-highlight--",In="--diff-del-content-highlight--",et;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(et||(et={}));var xo=t=>{switch(t){case et.LF:return"\u240A";case et.CR:return"\u240D";case et.CRLF:return"\u240D\u240A";default:return""}},ud;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(ud||(ud={}));var np=1e3;function pd(t){return t.location+t.length}function hd(t,e,n,i,r){let o=Math.min(e.length,i.length),l=r?pd(e)-1:e.location,a=r?pd(i)-1:i.location,f=r?-1:1,u=0;for(;Math.abs(u)<o&&t[l+u]===n[a+u];)u+=f;return Math.abs(u)}function ns(t){return t.trim().length===0||t.length>=np}function Rd(t,e){let n=t.text,i=e.text,r=n.slice(-2),o=i.slice(-2),l=r===`\r
`?et.CRLF:r.endsWith("\r")?et.CR:r.endsWith(`
`)?et.LF:et.NULL,a=o===`\r
`?et.CRLF:o.endsWith("\r")?et.CR:o.endsWith(`
`)?et.LF:et.NULL,f=t.noTrailingNewLine!==e.noTrailingNewLine;return l===a&&!f?{addSymbol:void 0,addString:n,delSymbol:void 0,delString:i}:{addSymbol:f?t.noTrailingNewLine?et.NEWLINE:et.NORMAL:l,addString:l===et.CRLF?n.slice(0,-2):l===et.CR||l===et.LF?n.slice(0,-1):n,delSymbol:f?e.noTrailingNewLine?et.NEWLINE:et.NORMAL:a,delString:a===et.CRLF?i.slice(0,-2):a===et.CR||a===et.LF?i.slice(0,-1):i}}function ip(t,e){let n=t.text,i=e.text,{addString:r,delString:o,addSymbol:l,delSymbol:a}=Rd(t,e);if(r===o&&l&&a)return{addRange:{range:{location:r.length,length:n.length-r.length},hasLineChange:!0,newLineSymbol:l},delRange:{range:{location:o.length,length:i.length-o.length},hasLineChange:!0,newLineSymbol:a}};let f={location:0,length:o.length},u={location:0,length:r.length};if(ns(n)||ns(i))return u.length=0,f.length=0,{addRange:{range:u},delRange:{range:f}};let d=hd(o,f,r,u,!1);f={location:f.location+d,length:f.length-d},u={location:u.location+d,length:u.length-d};let c=hd(o,f,r,u,!0);return f.length-=c,u.length-=c,{addRange:{range:u,hasLineChange:(r.slice(0,u.location)+r.slice(u.location+u.length)).trim().length>0},delRange:{range:f,hasLineChange:(o.slice(0,f.location)+o.slice(f.location+f.length)).trim().length>0}}}function rp(t,e){let{addString:n,addSymbol:i,delString:r,delSymbol:o}=Rd(t,e);if(ns(n)||ns(r))return{addRange:{range:[],hasLineChange:!!i,newLineSymbol:i},delRange:{range:[],hasLineChange:!!o,newLineSymbol:o}};let l=(0,Md.default)(r,n,0,!0),a=0,f=0,u=l.filter(c=>c[0]!==-1).map(c=>({type:c[0],str:c[1],startIndex:a,endIndex:a+c[1].length-1,length:(a+=c[1].length,c[1].length)})),d=l.filter(c=>c[0]!==1).map(c=>({type:c[0],str:c[1],startIndex:f,endIndex:f+c[1].length-1,length:(f+=c[1].length,c[1].length)}));return{addRange:{range:u,hasLineChange:u.some(c=>c.type===0&&c.str.trim().length>0),newLineSymbol:i},delRange:{range:d,hasLineChange:u.some(c=>c.type===0&&c.str.trim().length>0),newLineSymbol:o}}}var Re;(function(t){t[t.Context=0]="Context",t[t.Add=1]="Add",t[t.Delete=2]="Delete",t[t.Hunk=3]="Hunk"})(Re||(Re={}));var Bt=class t{constructor(e,n,i,r,o,l=!1,a,f,u,d,c,p,m,g){this.text=e,this.type=n,this.originalLineNumber=i,this.oldLineNumber=r,this.newLineNumber=o,this.noTrailingNewLine=l,this.changes=a,this.diffChanges=f,this._diffChanges=u,this.plainTemplate=d,this.plainTemplateMode=c,this.syntaxTemplate=p,this.syntaxTemplateName=m,this.syntaxTemplateMode=g}withNoTrailingNewLine(e){return new t(this.text,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,e)}isIncludeableLine(){return this.type===Re.Add||this.type===Re.Delete}equals(e){return this.text===e.text&&this.type===e.type&&this.originalLineNumber===e.originalLineNumber&&this.oldLineNumber===e.oldLineNumber&&this.newLineNumber===e.newLineNumber&&this.noTrailingNewLine===e.noTrailingNewLine}clone(e){return new t(e,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,this.noTrailingNewLine)}},Xi=t=>t?t.type===Re.Add||t.type===Re.Delete:!1,op=/["'&<>]/;function sp(t){let e=""+t,n=op.exec(e);if(!n)return e;let i="",r,o,l=0;for(o=n.index;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}l!==o&&(i+=e.slice(l,o)),l=o+1,i+=r}return l!==o?i+e.slice(l,o):i}var _a=!1,rs=t=>t,md=rs,gd=rs;var Sr=()=>_a,Nr=t=>_a&&rs!==md?md(t):t,ap=t=>_a&&rs!==gd?gd(t):t,lp=!1,dp=()=>lp;var fp=!0,ca=()=>fp;var Ir=t=>sp(t).replace(/\n/g,"").replace(/\r/g,""),yo=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="relative")return;let i=t.changes;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Nr:Ir,o=i.range,l=e.slice(0,o.location),a=e.slice(o.location,o.location+o.length),f=e.slice(o.location+o.length),u=a.includes(`
`),d=i.newLineSymbol,c=`<span data-range-start="${o.location}" data-range-end="${o.location+o.length}">`;c+=r(l),c+=`<span data-diff-highlight style="background-color: var(${n==="add"?Nn:In});border-radius: 0.2em;">`,c+=u?`${r(a)}<span data-newline-symbol>${xo(d)}</span>`:r(a),c+="</span>",c+=r(f),c+="</span>",t.plainTemplate=c,t.plainTemplateMode="relative"},vd=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="fast-diff")return;let i=t.diffChanges;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Nr:Ir,o="";i.range.forEach(({type:l,str:a,startIndex:f,endIndex:u},d,c)=>{let p=d===c.length-1;l===0?(o+=`<span>${r(a)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight style="background-color: var(${n==="add"?Nn:In});border-radius: 0.2em;">${xo(i.newLineSymbol)}</span>`:"",o+="</span>"):(o+=`<span data-range-start="${f}" data-range-end="${u}">`,o+=`<span data-diff-highlight style="background-color: var(${n==="add"?Nn:In});border-radius: 0.2em;">${r(a)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight>${xo(i.newLineSymbol)}</span>`:"",o+="</span></span>")}),t.plainTemplate=o,t.plainTemplateMode="fast-diff"},$o=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="relative"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let o=e.changes;if(!o||!o.hasLineChange)return;let l=Sr()?Nr:Ir,a=o.range,f=`<span data-range-start="${a.location}" data-range-end="${a.location+a.length}">`;(r=n?.nodeList)===null||r===void 0||r.forEach(({node:u,wrapper:d})=>{var c,p,m,g,$,w;if(u.endIndex<a.location||a.location+a.length<u.startIndex)f+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(p=((c=d?.properties)===null||c===void 0?void 0:c.className)||[])===null||p===void 0?void 0:p.join(" ")}" style="${((m=d?.properties)===null||m===void 0?void 0:m.style)||""}">${l(u.value)}</span>`;else{let _=a.location-u.startIndex,L=_<0?0:_,x=u.value.slice(0,L),I=u.value.slice(L,_+a.length),S=u.value.slice(_+a.length),y=x.length||a.location===u.startIndex,h=S.length||u.endIndex===a.location+a.length-1,b=I.includes(`
`);f+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${($=((g=d?.properties)===null||g===void 0?void 0:g.className)||[])===null||$===void 0?void 0:$.join(" ")}" style="${((w=d?.properties)===null||w===void 0?void 0:w.style)||""}">${l(x)}<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-left-radius: ${y?"0.2em":"0"};border-bottom-left-radius: ${y?"0.2em":"0"};border-top-right-radius: ${h||b?"0.2em":"0"};border-bottom-right-radius: ${h||b?"0.2em":"0"}">${b?`${l(I)}<span data-newline-symbol>${xo(o.newLineSymbol)}</span>`:l(I)}</span>${l(S)}</span>`}}),f+="</span>",e.syntaxTemplate=f,e.syntaxTemplateMode="relative",e.syntaxTemplateName=t._getHighlighterName()},_d=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r,o,l;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="fast-diff"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let a=e.diffChanges,f=e._diffChanges;if(!a||!a.hasLineChange)return;let u=Sr()?Nr:Ir,d="",c=((r=a?.range)===null||r===void 0?void 0:r.filter(g=>g.type!==0))||[],p=((o=f?.range)===null||o===void 0?void 0:o.filter(g=>g.type!==0))||[],m=0;(l=n?.nodeList)===null||l===void 0||l.forEach(({node:g,wrapper:$},w,_)=>{var L,x,I;d+=`<span data-start="${g.startIndex}" data-end="${g.endIndex}" class="${(x=((L=$?.properties)===null||L===void 0?void 0:L.className)||[])===null||x===void 0?void 0:x.join(" ")}" style="${((I=$?.properties)===null||I===void 0?void 0:I.style)||""}">`;let S=c[m],y=c.length===0&&p.length===0,h=w===_.length-1;for(let b=0;b<g.value.length;b++){let E=g.startIndex+b,D=g.value[b],M=b===g.value.length-1,W=h&&b===g.value.length-1;if(S)if(E<S.startIndex)d+=u(D);else if(E===S.startIndex)S.endIndex<=g.endIndex?d+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-radius: 0.2em;">`:d+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-left-radius: 0.2em;border-bottom-left-radius: 0.2em;">`,d+=u(D),(M||S.startIndex===S.endIndex)&&(d+="</span>"),S.endIndex===E&&(m++,S=c[m]);else if(E<S.endIndex){if(b===0){let P=S.startIndex>=g.startIndex&&S.endIndex<=g.endIndex,K=S.endIndex<=g.endIndex;d+=P?`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-radius: 0.2em;">`:K?`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`:`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});">`}d+=u(D),M&&(d+="</span>")}else E===S.endIndex&&(S.startIndex>=g.startIndex||b===0&&(d+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`),d+=u(D),d+="</span>",m++,S=c[m]);else d+=u(D),y&&W&&a.newLineSymbol&&(d+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-radius: 0.2em;">`,d+=`<span data-newline-symbol>${xo(a.newLineSymbol)}</span></span>`)}d+="</span>"}),e.syntaxTemplate=d,e.syntaxTemplateMode="fast-diff",e.syntaxTemplateName=t._getHighlighterName()},ba=t=>{var e;let n="",i=Sr()?Nr:Ir;return(e=t?.nodeList)===null||e===void 0||e.forEach(({node:r,wrapper:o})=>{var l,a,f;n+=`<span data-start="${r.startIndex}" data-end="${r.endIndex}" class="${(a=((l=o?.properties)===null||l===void 0?void 0:l.className)||[])===null||a===void 0?void 0:a.join(" ")}" style="${((f=o?.properties)===null||f===void 0?void 0:f.style)||""}">${i(r.value)}</span>`}),n},wa=t=>t?(Sr()?Nr:Ir)(t):"",cp=40;function up(t,e){throw new Error(e)}function pp(t){var e,n;if(t.length===0)return 0;for(let i=t.length-1;i>=0;i--){let r=t[i];for(let o=r.lines.length-1;o>=0;o--){let l=r.lines[o];if(l.type===Re.Hunk)continue;let a=(e=l.newLineNumber)!==null&&e!==void 0?e:0,f=(n=l.oldLineNumber)!==null&&n!==void 0?n:0;return a>f?a:f}}return 0}function hp(t,e,n){let i=n===null?1/0:e.oldStartLine-n.header.oldStartLine-n.header.oldLineCount;return t===0?e.oldStartLine>1&&e.newStartLine>1?$r.Up:$r.None:i<=cp?$r.Short:$r.Both}var Hd=(t,e)=>{let n=[];for(let i=0;i<t;i++)n.push(e(i));return n},bd=t=>{let e=t.lastIndexOf(".");return t.slice(e+1)},wd=(t,e,{diffFile:n,getAdditionRaw:i,getDeletionRaw:r,getAdditionSyntax:o,getDeletionSyntax:l})=>{if(t.length===e.length){let a=t.length;for(let f=0;f<a;f++){let u=t[f],d=e[f];if(!u.changes||!d.changes){let p=Bt.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Bt.prototype.clone.call(d,r(d.oldLineNumber)||d.text||""),{addRange:g,delRange:$}=ip(p,m);u.changes=g,d.changes=$}let c=ca();if(!dp())c&&(yo({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),yo({diffLine:d,rawLine:r(d.oldLineNumber)||"",operator:"del"}),$o({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),$o({diffFile:n,diffLine:d,syntaxLine:l(d.oldLineNumber)||null,operator:"del"}));else{let p=Bt.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Bt.prototype.clone.call(d,r(d.oldLineNumber)||d.text||""),{addRange:g,delRange:$}=rp(p,m);u.diffChanges=g,d.diffChanges=$,u._diffChanges=$,d._diffChanges=g,c&&(vd({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),vd({diffLine:d,rawLine:r(d.oldLineNumber)||"",operator:"del"}),_d({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),_d({diffFile:n,diffLine:d,syntaxLine:l(d.oldLineNumber)||null,operator:"del"}))}}}},mp=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,gp=/[\u202A-\u202E]|[\u2066-\u2069]/,Od="+",Bd="-",Pd=" ",jd="\\",Wd=`
`,vp=new Set([Od,Bd,Pd,jd,Wd]),ua=class{constructor(){Object.defineProperty(this,"__v_skip",{value:!0}),this.reset()}reset(){this.ls=0,this.le=-1,this.text=""}nextLine(){return this.ls=this.le+1,this.ls>=this.text.length?!1:(this.le=this.text.indexOf(`
`,this.ls),this.le===-1&&(this.le=this.text.length),this.ls!==this.le)}readLine(e){return e?this.nextLine()?this.text.substring(this.ls,this.le):null:this.nextLine()?this.text.substring(this.ls+1,this.le+1):this.text.length>this.ls?`
`:null}lineStartsWith(e){return this.text.startsWith(e,this.ls)}lineEndsWith(e){return this.text.endsWith(e,this.le)}peek(){let e=this.le+1;return e<this.text.length?this.text[e]:null}parseDiffHeader(){let e=!1;for(;this.nextLine();){if(this.lineStartsWith("Binary files ")&&this.lineEndsWith("differ"))return{isBinary:!0};if(this.lineStartsWith("---")&&(e=!0),this.lineStartsWith("+++"))return{isBinary:!1}}return null}numberFromGroup(e,n,i=null){let r=e[n];if(!r){if(!i)throw new Error(`Group ${n} missing from regexp match and no defaultValue was provided`);return i}let o=parseInt(r,10);if(isNaN(o))throw new Error(`Could not parse capture group ${n} into number: ${r}`);return o}parseHunkHeader(e){let n=mp.exec(e);if(!n)throw new Error("Invalid hunk header format");let i=this.numberFromGroup(n,1),r=this.numberFromGroup(n,2,1),o=this.numberFromGroup(n,3),l=this.numberFromGroup(n,4,1);return new fa(i,r,o,l)}parseLinePrefix(e){return e&&e.length&&vp.has(e[0])?e[0]:null}parseHunk(e,n,i){let r=this.readLine(!0);if(!r)throw new Error("Expected hunk header but reached end of diff");let o=this.parseHunkHeader(r),l=new Array;l.push(new Bt(r,Re.Hunk,1,null,null));let a,f=o.oldStartLine,u=o.newStartLine,d=e;for(;a=this.parseLinePrefix(this.peek());){let c=this.readLine(!1);if(c===null)throw new Error("Expected unified diff line but reached end of diff");if(a===jd){if(c.length<12)throw new Error('Expected "no newline at end of file" marker to be at least 12 bytes long');let m=l.length-1,g=l[m];l[m]=g.withNoTrailingNewLine(!0);continue}d++;let p;if(a===Od)p=new Bt(c,Re.Add,d,null,u++);else if(a===Bd)p=new Bt(c,Re.Delete,d,f++,null);else if(a===Pd||a===Wd)p=new Bt(c,Re.Context,d,f++,u++);else return up(a,`Unknown DiffLinePrefix: ${a}`);l.push(p)}if(l.length===1)throw new Error("Malformed diff, empty hunk");return new da(o,l,e,e+l.length-1,hp(n,o,i))}parse(e){this.text=e;try{let n=this.parseDiffHeader(),i=this.le,r=this.text.substring(0,i);if(!n)return{header:r,contents:"",hunks:[],isBinary:!1,maxLineNumber:0,hasHiddenBidiChars:!1};if(n.isBinary)return{header:r,contents:"",hunks:[],isBinary:!0,maxLineNumber:0,hasHiddenBidiChars:!1};let o=new Array,l=0,a=null;for(;this.peek();){let u=this.parseHunk(l,o.length,a);o.push(u),a=u,l+=u.lines.length}let f=this.text.substring(i+1,this.le).replace(/\n\\ No newline at end of file/g,"");return{header:r,contents:f,hunks:o,isBinary:n.isBinary,maxLineNumber:pp(o),hasHiddenBidiChars:gp.test(e)}}finally{this.reset()}}},_p=new ua;function v(t,e,n,i){if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?i:n==="a"?i.call(t):i?i.value:e.get(t)}function z(t,e,n,i,r){if(i==="m")throw new TypeError("Private method is not writable");if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return i==="a"?r.call(t,n):r?r.value=n:e.set(t,n),n}var es,go,Er,pa,ha=class extends Map{constructor(){super(...arguments),es.add(this),go.set(this,[]),Er.set(this,30)}get maxLength(){return v(this,Er,"f")}setMaxLength(e){z(this,Er,e,"f"),v(this,es,"m",pa).call(this)}set(e,n){return v(this,Er,"f")<=0?this:this.has(e)?this:(v(this,go,"f").push(e),v(this,es,"m",pa).call(this),super.set(e,n))}};go=new WeakMap,Er=new WeakMap,es=new WeakSet,pa=function(){for(;v(this,go,"f").length>v(this,Er,"f");){let e=v(this,go,"f").shift();e&&this.delete(e)}};var Ud,uo,bp,$i=new ha;$i.setMaxLength(50);$i.name="@git-diff-view/core";var oa=new Set,Eo=class t{static createInstance(e){let n=new t(e?.raw,e?.lang,e?.fileName);return n.ast=e?.ast,n.theme=e?.theme,n.rawFile=e?.rawFile||{},n.plainFile=e?.plainFile||{},n.hasDoRaw=e?.hasDoRaw,n.rawLength=e?.rawLength,n.syntaxFile=e?.syntaxFile||{},n.hasDoSyntax=e?.hasDoSyntax,n.syntaxLength=e?.syntaxLength,n.highlighterName=e?.highlighterName,n.highlighterType=e?.highlighterType,n.maxLineNumber=e?.maxLineNumber,n}constructor(e,n,i){Ud.add(this),this.raw=e,this.lang=n,this.fileName=i,uo.set(this,""),this.rawFile={},this.hasDoRaw=!1,this.syntaxFile={},this.plainFile={},this.hasDoSyntax=!1,this.maxLineNumber=0,this.raw=ap(e),Object.defineProperty(this,"__v_skip",{value:!0}),this.initId()}initId(){let e="-file--"+Math.random().toString().slice(2);for(;oa.has(e);)e="-file--"+Math.random().toString().slice(2);oa.add(e),z(this,uo,e,"f")}getId(){return v(this,uo,"f")}clearId(){oa.delete(v(this,uo,"f"))}doSyntax({registerHighlighter:e,theme:n}){if(!this.raw)return;let i=e||gr;if(this.rawLength&&this.rawLength>i.maxLineToIgnoreSyntax)return;let r=i;try{i.hasRegisteredCurrentLang(this.lang)||(r=gr)}catch{r=gr}if(this.hasDoSyntax&&r.name===this.highlighterName&&r.type===this.highlighterType&&(this.theme===n||r.type==="class")||(this.ast=r.getAST(this.raw,this.fileName,this.lang,n),this.theme=n,!this.ast))return;let{syntaxFileObject:o,syntaxFileLineNumber:l}=r.processAST(this.ast);ca()&&Object.values(o).forEach(a=>{a.template=ba(a)}),this.syntaxFile=o,this.syntaxLength=l,this.highlighterName=r.name,this.highlighterType=r.type,this.hasDoSyntax=!0}doRaw(){if(!this.raw||this.hasDoRaw)return;let n=this.raw.split(`
`);this.rawLength=n.length,this.maxLineNumber=n.length,this.rawFile={},this.plainFile={};let i=ca();for(let r=0;r<n.length;r++)this.rawFile[r+1]=r<n.length-1?n[r]+`
`:n[r],this.plainFile[r+1]={value:this.rawFile[r+1],template:i?wa(this.rawFile[r+1]):void 0};this.hasDoRaw=!0}};uo=new WeakMap,Ud=new WeakSet,bp=function(){this.rawLength&&this.syntaxLength&&(this.rawLength!==this.syntaxLength&&console.warn("[@git-diff-view/core] The rawLength does not match the syntaxLength."),Object.values(this.syntaxFile).forEach(({value:e,lineNumber:n})=>{e!==this.rawFile[n]&&console.warn("[@git-diff-view/core] Content mismatch detected at line "+n+": "+e+" !== "+this.rawFile[n])}))};function vr(t,e,n,i,r){let o=t+"--0.1.7--"+n+"--"+e;r&&(o=r+"--0.1.7--"+n+"--"+e);let l=t+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e;if(r&&(l=r+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e),$i.has(o))return $i.get(o);if($i.has(l)){let f=$i.get(l);if(f?.highlighterType==="class")return f}let a=new Eo(t,e,i);return $i.set(o,a),a}var os=$i;var is;(function(t){t[t.hunk=1]="hunk",t[t.content=2]="content",t[t.widget=3]="widget",t[t.extend=4]="extend"})(is||(is={}));var O;(function(t){t[t.old=1]="old",t[t.new=2]="new"})(O||(O={}));var ss=t=>{let e=t.splitLineLength,n=[];return Hd(e,i=>{let r=t.getSplitLeftLine(i),o=t.getSplitRightLine(i);!r?.isHidden&&!o?.isHidden&&n.push({type:is.content,index:i,lineNumber:i+1,splitLine:{left:r,right:o}})}),n};var xa=t=>{let e=t.unifiedLineLength,n=[];return Hd(e,i=>{let r=t.getUnifiedLine(i);r.isHidden||n.push({type:is.content,index:i,lineNumber:i+1,unifiedLine:r})}),n},wp=(t,e,n)=>{let i=t.getSplitLineByLineNumber(e,n),r=t.getUnifiedLineByLineNumber(e,n);return{split:!i||i.isHidden,unified:!r||r.isHidden}},Te,Xe,Je,ki,Si,Gn,Yn,Gi,Yi,qi,Ki,qn,Kn,Tn,Cn,Ct,it,ot,Ze,st,pi,br,wr,xr,yr,po,zi,ho,vo,_o,Ei,Li,ts,Ot,Ui,Vi,mo,hi,Vd,zd,ma,Gd,xp,ga,va,xd,Yd,Lr,kr,bo,wo,yd,$d,je=40;var sa=new Set,Zi=class t{static createInstance(e,n){var i,r,o,l,a,f;let u=new t(((i=e?.oldFile)===null||i===void 0?void 0:i.fileName)||"",((r=e?.oldFile)===null||r===void 0?void 0:r.content)||"",((o=e?.newFile)===null||o===void 0?void 0:o.fileName)||"",((l=e?.newFile)===null||l===void 0?void 0:l.content)||"",e?.hunks||[],((a=e?.oldFile)===null||a===void 0?void 0:a.fileLang)||"",((f=e?.newFile)===null||f===void 0?void 0:f.fileLang)||"");return n&&(n.isFullMerge?u._mergeFullBundle(n):u.mergeBundle(n)),u}constructor(e,n,i,r,o,l,a,f){Te.add(this),this.uuid=f,Xe.set(this,void 0),Je.set(this,void 0),ki.set(this,void 0),Si.set(this,void 0),Gn.set(this,void 0),Yn.set(this,void 0),Gi.set(this,void 0),Yi.set(this,void 0),qi.set(this,void 0),Ki.set(this,void 0),qn.set(this,void 0),Kn.set(this,void 0),Tn.set(this,void 0),Cn.set(this,void 0),Ct.set(this,[]),it.set(this,[]),ot.set(this,void 0),Ze.set(this,[]),st.set(this,void 0),pi.set(this,[]),br.set(this,!1),wr.set(this,!1),xr.set(this,!1),yr.set(this,!1),po.set(this,0),zi.set(this,!1),ho.set(this,!1),vo.set(this,!1),_o.set(this,!1),Ei.set(this,void 0),Li.set(this,void 0),ts.set(this,!1),Ot.set(this,"light"),Ui.set(this,{state:!1}),Vi.set(this,{state:!1}),this._version_="0.1.7",this._oldFileName="",this._oldFileContent="",this._oldFileLang="",this._newFileName="",this._newFileContent="",this._newFileLang="",this._diffList=[],this.diffLineLength=0,this.splitLineLength=0,this.unifiedLineLength=0,this.fileLineLength=0,this.additionLength=0,this.deletionLength=0,this.hasSomeLineCollapsed=!1,mo.set(this,""),hi.set(this,new Map),this.getSplitLeftLine=d=>v(this,Ct,"f")[d],this.getSplitLineByLineNumber=(d,c)=>{var p,m;return c===O.old?(p=v(this,Ct,"f"))===null||p===void 0?void 0:p.find(g=>g.lineNumber===d):(m=v(this,it,"f"))===null||m===void 0?void 0:m.find(g=>g.lineNumber===d)},this.getSplitLineIndexByLineNumber=(d,c)=>{var p,m;return c===O.old?(p=v(this,Ct,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.lineNumber===d):(m=v(this,it,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.lineNumber===d)},this.getSplitRightLine=d=>v(this,it,"f")[d],this.getSplitHunkLine=d=>{var c;return(c=v(this,ot,"f"))===null||c===void 0?void 0:c[d]},this.onSplitHunkExpand=(d,c,p=!0)=>{var m,g,$;if(!this.getExpandEnabled())return;let w=(m=v(this,ot,"f"))===null||m===void 0?void 0:m[c];if(!(!w||!w.splitInfo)){if(d==="all"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],x=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,...w.hunkInfo,plainText:w.text,startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(d==="down"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.startHiddenIndex+je;_++){let L=v(this,Ct,"f")[_],x=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.isLast?w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je}:w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je,plainText:`@@ -${w.splitInfo.oldStartIndex},${w.splitInfo.oldLength} +${w.splitInfo.newStartIndex},${w.splitInfo.newLength}`}}else if(d==="down-all"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],x=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(d==="up"){if(w.isLast)return;for(let S=w.splitInfo.endHiddenIndex-je;S<w.splitInfo.endHiddenIndex;S++){let y=v(this,Ct,"f")[S],h=v(this,it,"f")[S];y?.isHidden&&(y.isHidden=!1),h?.isHidden&&(h.isHidden=!1)}let _=w.splitInfo.oldStartIndex-je,L=w.splitInfo.oldLength+je,x=w.splitInfo.newStartIndex-je,I=w.splitInfo.newLength+je;w.splitInfo={...w.splitInfo,endHiddenIndex:w.splitInfo.endHiddenIndex-je,oldStartIndex:_,oldLength:L,newStartIndex:x,newLength:I,plainText:`@@ -${_},${L} +${x},${I}`},(g=v(this,ot,"f"))===null||g===void 0||delete g[c],v(this,ot,"f")[w.splitInfo.endHiddenIndex]=w}else if(d==="up-all"){if(w.isLast)return;for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],x=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),x?.isHidden&&(x.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",endHiddenIndex:w.splitInfo.startHiddenIndex},($=v(this,ot,"f"))===null||$===void 0||delete $[c],v(this,ot,"f")[w.splitInfo.endHiddenIndex]=w}p&&this.notifyAll()}},this.getUnifiedLine=d=>v(this,Ze,"f")[d],this.getUnifiedLineByLineNumber=(d,c)=>{var p,m;return c===O.old?(p=v(this,Ze,"f"))===null||p===void 0?void 0:p.find(g=>g.oldLineNumber===d):(m=v(this,Ze,"f"))===null||m===void 0?void 0:m.find(g=>g.newLineNumber===d)},this.getUnifiedLineIndexByLineNumber=(d,c)=>{var p,m;return c===O.old?(p=v(this,Ze,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.oldLineNumber===d):(m=v(this,Ze,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.newLineNumber===d)},this.getUnifiedHunkLine=d=>{var c;return(c=v(this,st,"f"))===null||c===void 0?void 0:c[d]},this.onUnifiedHunkExpand=(d,c,p=!0)=>{var m,g,$,w;if(!this.getExpandEnabled())return;let _=(m=v(this,st,"f"))===null||m===void 0?void 0:m[c];if(!(!_||!_.unifiedInfo)){if(d==="all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let x=(g=v(this,Ze,"f"))===null||g===void 0?void 0:g[L];x?.isHidden&&(x.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,..._.hunkInfo,plainText:_.text,startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(d==="down"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.startHiddenIndex+je;L++){let x=v(this,Ze,"f")[L];x?.isHidden&&(x.isHidden=!1)}_.isLast?_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je}:_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je,plainText:`@@ -${_.unifiedInfo.oldStartIndex},${_.unifiedInfo.oldLength} +${_.unifiedInfo.newStartIndex},${_.unifiedInfo.newLength}`}}else if(d==="down-all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let x=v(this,Ze,"f")[L];x?.isHidden&&(x.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(d==="up"){if(_.isLast)return;for(let y=_.unifiedInfo.endHiddenIndex-je;y<_.unifiedInfo.endHiddenIndex;y++){let h=v(this,Ze,"f")[y];h?.isHidden&&(h.isHidden=!1)}let L=_.unifiedInfo.oldStartIndex-je,x=_.unifiedInfo.oldLength+je,I=_.unifiedInfo.newStartIndex-je,S=_.unifiedInfo.newLength+je;_.unifiedInfo={..._.unifiedInfo,endHiddenIndex:_.unifiedInfo.endHiddenIndex-je,oldStartIndex:L,oldLength:x,newStartIndex:I,newLength:S,plainText:`@@ -${L},${x} +${I},${S}`},($=v(this,st,"f"))===null||$===void 0||delete $[c],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}else if(d==="up-all"){if(_.isLast)return;for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let x=v(this,Ze,"f")[L];x?.isHidden&&(x.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",endHiddenIndex:_.unifiedInfo.startHiddenIndex},(w=v(this,st,"f"))===null||w===void 0||delete w[c],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}p&&this.notifyAll()}},this.onAllExpand=d=>{this.getExpandEnabled()&&(d==="split"?(Object.keys(v(this,ot,"f")||{}).forEach(c=>{this.onSplitHunkExpand("all",+c,!1)}),v(this,Ui,"f").state=!0):(Object.keys(v(this,st,"f")||{}).forEach(c=>{this.onUnifiedHunkExpand("all",+c,!1)}),v(this,Vi,"f").state=!0),this.notifyAll())},this.onAllCollapse=d=>{this.getExpandEnabled()&&(d==="split"?(Object.values(v(this,Ct,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,it,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,ot,"f")||{}).forEach(c=>{c.splitInfo&&(c.splitInfo={...c.splitInfo,oldStartIndex:c.splitInfo._oldStartIndex,oldLength:c.splitInfo._oldLength,newStartIndex:c.splitInfo._newStartIndex,newLength:c.splitInfo._newLength,startHiddenIndex:c.splitInfo._startHiddenIndex,endHiddenIndex:c.splitInfo._endHiddenIndex,plainText:c.splitInfo._plainText})}),Object.keys(v(this,ot,"f")||{}).forEach(c=>{let p=v(this,ot,"f")[c];p.splitInfo&&p.splitInfo.endHiddenIndex!==+c&&(delete v(this,ot,"f")[c],v(this,ot,"f")[p.splitInfo.endHiddenIndex]=p)}),v(this,Ui,"f").state=!1):(Object.values(v(this,Ze,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,st,"f")||{}).forEach(c=>{c.unifiedInfo&&(c.unifiedInfo={...c.unifiedInfo,oldStartIndex:c.unifiedInfo._oldStartIndex,oldLength:c.unifiedInfo._oldLength,newStartIndex:c.unifiedInfo._newStartIndex,newLength:c.unifiedInfo._newLength,startHiddenIndex:c.unifiedInfo._startHiddenIndex,endHiddenIndex:c.unifiedInfo._endHiddenIndex,plainText:c.unifiedInfo._plainText})}),Object.keys(v(this,st,"f")||{}).forEach(c=>{let p=v(this,st,"f")[c];p.unifiedInfo&&p.unifiedInfo.endHiddenIndex!==+c&&(delete v(this,st,"f")[c],v(this,st,"f")[p.unifiedInfo.endHiddenIndex]=p)}),v(this,Vi,"f").state=!1),this.notifyAll())},this.getOldFileContent=()=>{var d;return(d=v(this,Xe,"f"))===null||d===void 0?void 0:d.raw},this.getNewFileContent=()=>{var d;return(d=v(this,Je,"f"))===null||d===void 0?void 0:d.raw},this.getOldPlainLine=d=>{var c;return(c=v(this,qi,"f"))===null||c===void 0?void 0:c[d]},this.getOldSyntaxLine=d=>{var c;return(c=v(this,qn,"f"))===null||c===void 0?void 0:c[d]},this.getNewPlainLine=d=>{var c;return(c=v(this,Ki,"f"))===null||c===void 0?void 0:c[d]},this.getNewSyntaxLine=d=>{var c;return(c=v(this,Kn,"f"))===null||c===void 0?void 0:c[d]},this.subscribe=d=>(v(this,pi,"f").push(d),()=>{z(this,pi,v(this,pi,"f").filter(c=>c!==d),"f")}),this.notifyAll=d=>{var c;z(this,po,(c=v(this,po,"f"),c++,c),"f"),v(this,pi,"f").forEach(p=>{d&&p.isSyncExternal||p()}),v(this,hi,"f").forEach((p,m)=>{m.notifyAll(!0)})},this.getUpdateCount=()=>v(this,po,"f"),this.getExpandEnabled=()=>!v(this,zi,"f")&&!v(this,ho,"f"),this.getBundle=()=>{let d=v(this,br,"f"),c=v(this,wr,"f"),p=v(this,xr,"f"),m=v(this,yr,"f"),g=v(this,Gi,"f"),$=v(this,Gn,"f"),w=v(this,qi,"f"),_=v(this,qn,"f"),L=v(this,Tn,"f"),x=v(this,Yi,"f"),I=v(this,Yn,"f"),S=v(this,Ki,"f"),y=v(this,Kn,"f"),h=v(this,Cn,"f"),b=this.splitLineLength,E=this.unifiedLineLength,D=this.fileLineLength,M=this.additionLength,W=this.deletionLength,P=v(this,zi,"f"),K=v(this,ho,"f"),ee=v(this,Ei,"f"),re=v(this,Li,"f"),Z=this.hasSomeLineCollapsed,A=v(this,Ui,"f"),Y=v(this,Vi,"f"),j=v(this,Ct,"f"),V=v(this,it,"f"),H=v(this,ot,"f"),he=v(this,Ze,"f"),ie=v(this,st,"f"),Q=this._version_,ve=v(this,Ot,"f");return{hasInitRaw:d,hasInitSyntax:c,hasBuildSplit:p,hasBuildUnified:m,oldFileLines:g,oldFileDiffLines:$,oldFilePlainLines:w,oldFileSyntaxLines:_,oldFilePlaceholderLines:L,newFileLines:x,newFileDiffLines:I,newFilePlainLines:S,newFileSyntaxLines:y,newFilePlaceholderLines:h,splitLineLength:b,unifiedLineLength:E,fileLineLength:D,additionLength:M,deletionLength:W,splitLeftLines:j,splitRightLines:V,splitHunkLines:H,unifiedLines:he,unifiedHunkLines:ie,highlighterName:ee,highlighterType:re,composeByDiff:P,composeByRange:K,hasSomeLineCollapsed:Z,hasExpandSplitAll:A,hasExpandUnifiedAll:Y,version:Q,theme:ve,isFullMerge:!1}},this.mergeBundle=(d,c=!0)=>{z(this,br,d.hasInitRaw,"f"),z(this,wr,d.hasInitSyntax,"f"),z(this,xr,d.hasBuildSplit,"f"),z(this,yr,d.hasBuildUnified,"f"),z(this,zi,d.composeByDiff,"f"),z(this,ho,d.composeByRange,"f"),z(this,Ei,d.highlighterName,"f"),z(this,Li,d.highlighterType,"f"),z(this,Gi,d.oldFileLines,"f"),z(this,Gn,d.oldFileDiffLines,"f"),z(this,qi,d.oldFilePlainLines,"f"),z(this,qn,d.oldFileSyntaxLines,"f"),z(this,Tn,d.oldFilePlaceholderLines,"f"),z(this,Yi,d.newFileLines,"f"),z(this,Yn,d.newFileDiffLines,"f"),z(this,Ki,d.newFilePlainLines,"f"),z(this,Kn,d.newFileSyntaxLines,"f"),z(this,Cn,d.newFilePlaceholderLines,"f"),this.splitLineLength=d.splitLineLength,this.unifiedLineLength=d.unifiedLineLength,this.fileLineLength=d.fileLineLength,this.additionLength=d.additionLength,this.deletionLength=d.deletionLength,this.hasSomeLineCollapsed=d.hasSomeLineCollapsed,z(this,Ui,d.hasExpandSplitAll,"f"),z(this,Vi,d.hasExpandUnifiedAll,"f"),z(this,Ct,d.splitLeftLines,"f"),z(this,it,d.splitRightLines,"f"),z(this,ot,d.splitHunkLines,"f"),z(this,Ze,d.unifiedLines,"f"),z(this,st,d.unifiedHunkLines,"f"),z(this,Ot,d.theme,"f"),z(this,vo,!0,"f"),z(this,ts,!0,"f"),c&&this.notifyAll()},this.generateInstanceFromLineNumberRange=(d,c,p=O.new)=>{if(d>=c)return this;let m=this.getSplitLineIndexByLineNumber(d,p),g=this.getSplitLineIndexByLineNumber(c,p),$=this.getUnifiedLineIndexByLineNumber(d,p),w=this.getUnifiedLineIndexByLineNumber(c,p),_=[],L=[],x=[];for(let S=m;S<=g;S++){let y=this.getSplitLeftLine(S),h=this.getSplitRightLine(S);!y?.value&&!h?.value||(_.push({...y,isHidden:!1}),L.push({...h,isHidden:!1}))}for(let S=$;S<=w;S++){let y=this.getUnifiedLine(S);y?.value&&x.push({...y,isHidden:!1})}return t.createInstance({},{...this._getFullBundle(),composeByRange:!0,splitHunkLines:{},splitLeftLines:_,splitRightLines:L,splitLineLength:_.length,unifiedHunkLines:{},unifiedLines:x,unifiedLineLength:x.length})},this._getHighlighterName=()=>v(this,Ei,"f")||"",this._getHighlighterType=()=>v(this,Li,"f")||"",this._getIsPureDiffRender=()=>v(this,zi,"f"),this._getTheme=()=>v(this,Ot,"f"),this._getIsCloned=()=>v(this,ts,"f"),this._addClonedInstance=d=>{let c=()=>{this._notifyOthers(d),this._mergeFullBundle(d._getFullBundle(),!1)};c.isSyncExternal=!0;let p=d.subscribe(c);v(this,hi,"f").set(d,p)},this._notifyOthers=d=>{v(this,hi,"f").forEach((c,p)=>{p!==d&&p.notifyAll(!0)})},this._delClonedInstance=d=>{let c=v(this,hi,"f").get(d);c?.(),v(this,hi,"f").delete(d)},this._getFullBundle=()=>{let d=this.getBundle(),c=v(this,Xe,"f"),p=v(this,Je,"f"),m=v(this,Si,"f"),g=v(this,ki,"f");return{...d,oldFileResult:c,newFileResult:p,diffLines:m,diffListResults:g,isFullMerge:v(this,vo,"f")?v(this,_o,"f"):!0}},this._mergeFullBundle=(d,c=!0)=>{this.mergeBundle(d,c);try{z(this,Xe,d.oldFileResult?Eo.createInstance(d.oldFileResult):null,"f"),z(this,Je,d.newFileResult?Eo.createInstance(d.newFileResult):null,"f"),z(this,Si,d.diffLines,"f"),z(this,ki,d.diffListResults,"f"),z(this,_o,d.isFullMerge,"f")}catch{}},this._getAllListener=()=>v(this,pi,"f"),this._destroy=()=>{this.clearId(),v(this,pi,"f").splice(0,v(this,pi,"f").length),v(this,hi,"f").forEach(d=>d()),v(this,hi,"f").clear()},this.clear=()=>{this._destroy(),z(this,Xe,void 0,"f"),z(this,Je,void 0,"f"),z(this,Si,void 0,"f"),z(this,ki,void 0,"f"),z(this,Yn,void 0,"f"),z(this,Gn,void 0,"f"),z(this,Yi,void 0,"f"),z(this,Gi,void 0,"f"),z(this,Kn,void 0,"f"),z(this,qn,void 0,"f"),z(this,ot,void 0,"f"),z(this,Ct,[],"f"),z(this,it,[],"f"),z(this,st,void 0,"f"),z(this,Ze,[],"f"),z(this,Ot,"light","f")},Object.defineProperty(this,"__v_skip",{value:!0});let u=Array.from(new Set(o));this._oldFileName=e,this._newFileName=i,this._diffList=u,this._oldFileLang=bd(l||e||a||i)||"txt",this._newFileLang=bd(a||i||l||e)||"txt",this._oldFileContent=n,this._newFileContent=r,this.initId()}initId(){let e="-diff--"+Math.random().toString().slice(2);for(;sa.has(e);)e="-diff--"+Math.random().toString().slice(2);sa.add(e),z(this,mo,e,"f")}getId(){return v(this,mo,"f")}clearId(){sa.delete(v(this,mo,"f"))}initTheme(e){z(this,Ot,e||v(this,Ot,"f")||"light","f")}initRaw(){var e;v(this,br,"f")||(v(this,Te,"m",zd).call(this),v(this,Te,"m",ma).call(this),v(this,Te,"m",Vd).call(this),v(this,Te,"m",ga).call(this),v(this,Te,"m",Gd).call(this),v(this,Te,"m",va).call(this),z(this,br,!0,"f"))}initSyntax({registerHighlighter:e}={}){var n,i;if(v(this,wr,"f")&&(!e||e.name===v(this,Ei,"f")&&e.type===v(this,Li,"f"))){z(this,Kn,(n=v(this,Je,"f"))===null||n===void 0?void 0:n.syntaxFile,"f"),z(this,qn,(i=v(this,Xe,"f"))===null||i===void 0?void 0:i.syntaxFile,"f");return}v(this,Te,"m",Yd).call(this,{registerHighlighter:e}),v(this,Te,"m",ga).call(this),z(this,wr,!0,"f")}init(){this.initRaw(),this.initSyntax()}buildSplitDiffLines(){var e,n,i,r,o,l;if(v(this,xr,"f"))return;let a=1,f=1,u=!0,d=1/0,c=((e=v(this,Xe,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Je,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;a<=c||f<=p;){let m=v(this,Te,"m",Lr).call(this,a),g=v(this,Te,"m",kr).call(this,f),$=v(this,Te,"m",bo).call(this,a),w=v(this,Te,"m",wo).call(this,f),_=Bt.prototype.isIncludeableLine.call(m||{}),L=Bt.prototype.isIncludeableLine.call(g||{}),x=v(this,it,"f").length,I=!m&&!g;if(m&&!g){if(m.newLineNumber&&m.newLineNumber>f){f++;continue}(m.newLineNumber===null||m.newLineNumber===void 0)&&f++}if(g&&!m){if(g.oldLineNumber&&g.oldLineNumber>a){a++;continue}(g.oldLineNumber===null||g.oldLineNumber===void 0)&&a++}if(!m&&!$&&!g&&!w)break;if(!m&&!g){if(!((i=v(this,Tn,"f"))===null||i===void 0)&&i[a]&&(!((r=v(this,Cn,"f"))===null||r===void 0)&&r[f])){a++,f++;continue}if(!$&&(!((o=v(this,Cn,"f"))===null||o===void 0)&&o[f])){f++;continue}if(!w&&(!((l=v(this,Tn,"f"))===null||l===void 0)&&l[a])){a++;continue}}if(_&&L||!_&&!L?(v(this,Ct,"f").push({lineNumber:a++,value:$,diff:m,isHidden:I,_isHidden:I}),v(this,it,"f").push({lineNumber:f++,value:w,diff:g,isHidden:I,_isHidden:I})):_?(v(this,Ct,"f").push({lineNumber:a++,value:$,diff:m,isHidden:I,_isHidden:I}),v(this,it,"f").push({})):L&&(v(this,Ct,"f").push({}),v(this,it,"f").push({lineNumber:f++,value:w,diff:g,isHidden:I,_isHidden:I})),!u&&I&&(d=x),I&&(this.hasSomeLineCollapsed=!0),u=I,m?.prevHunkLine||g?.prevHunkLine){let S=m?.prevHunkLine||g?.prevHunkLine;S&&(S.isFirst?(S.splitInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},d=1/0):Number.isFinite(d)&&(S.splitInfo={...S.hunkInfo,startHiddenIndex:d,endHiddenIndex:x,plainText:S.text,_startHiddenIndex:d,_endHiddenIndex:x,_plainText:S.text},d=1/0),z(this,ot,{...v(this,ot,"f"),[x]:S},"f"))}}if(Number.isFinite(d)){let g=new Bt("",Re.Hunk,null,null,null);g.isLast=!0,g.splitInfo={startHiddenIndex:d,endHiddenIndex:v(this,it,"f").length,_startHiddenIndex:d,_endHiddenIndex:v(this,it,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},z(this,ot,{...v(this,ot,"f"),[v(this,it,"f").length]:g},"f"),d=1/0}this.splitLineLength=v(this,it,"f").length,z(this,xr,!0,"f"),this.notifyAll()}buildUnifiedDiffLines(){var e,n,i,r,o,l;if(v(this,yr,"f"))return;let a=1,f=1,u=!0,d=1/0,c=((e=v(this,Xe,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Je,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;a<=c||f<=p;){let m=v(this,Te,"m",bo).call(this,a),g=v(this,Te,"m",Lr).call(this,a),$=v(this,Te,"m",wo).call(this,f),w=v(this,Te,"m",kr).call(this,f),_=Bt.prototype.isIncludeableLine.call(g||{}),L=Bt.prototype.isIncludeableLine.call(w||{}),x=v(this,Ze,"f").length,I=!g&&!w;if(g&&!w){if(g.newLineNumber&&g.newLineNumber>f){f++;continue}(g.newLineNumber===null||g.newLineNumber===void 0)&&f++}if(w&&!g){if(w.oldLineNumber&&w.oldLineNumber>a){a++;continue}(w.oldLineNumber===null||w.oldLineNumber===void 0)&&a++}if(!m&&!$&&!w&&!g)break;if(!g&&!w){if(!((i=v(this,Tn,"f"))===null||i===void 0)&&i[a]&&(!((r=v(this,Cn,"f"))===null||r===void 0)&&r[f])){a++,f++;continue}if(!m&&(!((o=v(this,Cn,"f"))===null||o===void 0)&&o[f])){f++;continue}if(!$&&(!((l=v(this,Tn,"f"))===null||l===void 0)&&l[a])){a++;continue}}if(!_&&!L?v(this,Ze,"f").push({oldLineNumber:a++,newLineNumber:f++,value:$,diff:w,isHidden:I,_isHidden:I}):_?v(this,Ze,"f").push({oldLineNumber:a++,value:m,diff:g,isHidden:I,_isHidden:I}):L&&v(this,Ze,"f").push({newLineNumber:f++,value:$,diff:w,isHidden:I,_isHidden:I}),!u&&I&&(d=x),I&&(this.hasSomeLineCollapsed=!0),u=I,g?.prevHunkLine||w?.prevHunkLine){let S=g?.prevHunkLine||w?.prevHunkLine;S&&(S.isFirst?(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},d=1/0):Number.isFinite(d)&&(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:d,endHiddenIndex:x,plainText:S.text,_startHiddenIndex:d,_endHiddenIndex:x,_plainText:S.text},d=1/0),z(this,st,{...v(this,st,"f"),[x]:S},"f"))}}if(Number.isFinite(d)){let g=new Bt("",Re.Hunk,null,null,null);g.isLast=!0,g.unifiedInfo={startHiddenIndex:d,endHiddenIndex:v(this,Ze,"f").length,_startHiddenIndex:d,_endHiddenIndex:v(this,Ze,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},z(this,st,{...v(this,st,"f"),[v(this,Ze,"f").length]:g},"f"),d=1/0}this.unifiedLineLength=v(this,Ze,"f").length,z(this,yr,!0,"f"),this.notifyAll()}get hasExpandSplitAll(){return v(this,Ui,"f").state}get hasExpandUnifiedAll(){return v(this,Vi,"f").state}};Xe=new WeakMap,Je=new WeakMap,ki=new WeakMap,Si=new WeakMap,Gn=new WeakMap,Yn=new WeakMap,Gi=new WeakMap,Yi=new WeakMap,qi=new WeakMap,Ki=new WeakMap,qn=new WeakMap,Kn=new WeakMap,Tn=new WeakMap,Cn=new WeakMap,Ct=new WeakMap,it=new WeakMap,ot=new WeakMap,Ze=new WeakMap,st=new WeakMap,pi=new WeakMap,br=new WeakMap,wr=new WeakMap,xr=new WeakMap,yr=new WeakMap,po=new WeakMap,zi=new WeakMap,ho=new WeakMap,vo=new WeakMap,_o=new WeakMap,Ei=new WeakMap,Li=new WeakMap,ts=new WeakMap,Ot=new WeakMap,Ui=new WeakMap,Vi=new WeakMap,mo=new WeakMap,hi=new WeakMap,Te=new WeakSet,Vd=function(){this._diffList&&z(this,ki,this._diffList.map(e=>_p.parse(e)),"f")},zd=function(){!this._oldFileContent&&!this._newFileContent||(this._oldFileContent&&z(this,Xe,vr(this._oldFileContent,this._oldFileLang,v(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),this._newFileContent&&z(this,Je,vr(this._newFileContent,this._newFileLang,v(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"))},ma=function(){var e,n,i,r,o,l,a,f;(e=v(this,Xe,"f"))===null||e===void 0||e.doRaw(),z(this,Gi,(n=v(this,Xe,"f"))===null||n===void 0?void 0:n.rawFile,"f"),z(this,qi,(i=v(this,Xe,"f"))===null||i===void 0?void 0:i.plainFile,"f"),(r=v(this,Je,"f"))===null||r===void 0||r.doRaw(),z(this,Yi,(o=v(this,Je,"f"))===null||o===void 0?void 0:o.rawFile,"f"),z(this,Ki,(l=v(this,Je,"f"))===null||l===void 0?void 0:l.plainFile,"f"),this.fileLineLength=Math.max(this.fileLineLength,((a=v(this,Xe,"f"))===null||a===void 0?void 0:a.maxLineNumber)||0,((f=v(this,Je,"f"))===null||f===void 0?void 0:f.maxLineNumber)||0)},Gd=function(){if(this._oldFileContent&&this._newFileContent)return;let e={},n={};if(!this._oldFileContent&&!this._newFileContent){let i=1,r=1,o="",l="",a=!1;for(;r<=this.diffLineLength||i<=this.diffLineLength;){let f=r++,u=i++,d=v(this,Te,"m",Lr).call(this,f),c=v(this,Te,"m",kr).call(this,u);d?o+=d.text:(o+=`
`,e[f]=!0),c?l+=c.text:(l+=`
`,n[u]=!0),!a&&d&&c&&(a=a||d.noTrailingNewLine!==c.noTrailingNewLine)}if(!a&&o===l)return;this._oldFileContent=o,this._newFileContent=l,z(this,Xe,vr(this._oldFileContent,this._oldFileLang,v(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),z(this,Je,vr(this._newFileContent,this._newFileLang,v(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"),z(this,Tn,e,"f"),z(this,Cn,n,"f"),z(this,zi,!0,"f")}else if(v(this,Xe,"f")){let i=1,r=1,o="",l=!1;for(;r<=v(this,Xe,"f").maxLineNumber;){let a=v(this,Te,"m",kr).call(this,i++),f=v(this,Te,"m",Lr).call(this,r);a?(o+=a.text,r=a.oldLineNumber?a.oldLineNumber+1:r):(f||(o+=v(this,Te,"m",bo).call(this,r)),r++),!l&&a&&f&&(l=l||a.noTrailingNewLine!==f.noTrailingNewLine)}if(!l&&o===this._oldFileContent)return;this._newFileContent=o,z(this,Je,vr(this._newFileContent,this._newFileLang,v(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f")}else if(v(this,Je,"f")){let i=1,r=1,o="",l=!1;for(;r<=v(this,Je,"f").maxLineNumber;){let a=v(this,Te,"m",Lr).call(this,i++),f=v(this,Te,"m",kr).call(this,r);a?(o+=a.text,r=a.newLineNumber?a.newLineNumber+1:r):(f||(o+=v(this,Te,"m",wo).call(this,r)),r++),!l&&f&&a&&(l=l||f.noTrailingNewLine!==a.noTrailingNewLine)}if(!l&&o===this._newFileContent)return;this._oldFileContent=o,z(this,Xe,vr(this._oldFileContent,this._oldFileLang,v(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f")}v(this,Te,"m",ma).call(this)},xp=function(){var e,n,i,r;for(let o in v(this,Gn,"f")||{}){let l=(e=v(this,Gn,"f"))===null||e===void 0?void 0:e[o],a=(n=v(this,qi,"f"))===null||n===void 0?void 0:n[o];if((!v(this,Tn,"f")||!v(this,Tn,"f")[o])&&l?.text!==a?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'oldFileContent' and 'diff' at line ${o}. Please verify the 'oldFileContent' is correct.`);break}}for(let o in v(this,Yn,"f")||{}){let l=(i=v(this,Yn,"f"))===null||i===void 0?void 0:i[o],a=(r=v(this,Ki,"f"))===null||r===void 0?void 0:r[o];if((!v(this,Cn,"f")||!v(this,Cn,"f")[o])&&l?.text!==a?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'newFileContent' and 'diff' at line ${o}. Please verify the 'newFileContent' is correct.`);break}}},ga=function(){var e;if(!(!((e=v(this,ki,"f"))===null||e===void 0)&&e.length))return;let n=d=>v(this,Te,"m",wo).call(this,d),i=d=>v(this,Te,"m",bo).call(this,d),r=d=>v(this,Te,"m",$d).call(this,d),o=d=>v(this,Te,"m",yd).call(this,d);z(this,Si,[],"f"),this.additionLength=0,this.deletionLength=0;let l=[];v(this,ki,"f").forEach(d=>{d.hunks.forEach(p=>{let m=[],g=[];p.lines.forEach($=>{$.type===Re.Add?(m.push($),this.additionLength++):$.type===Re.Delete?(g.push($),this.deletionLength++):(wd(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o}),m=[],g=[]),l.push($)}),wd(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o})})});let a=null;z(this,Si,l.map((d,c)=>{var p;let m=d;if(m.index=c,m.isFirst=c===0,m.type===Re.Hunk){let g=(p=m.text.split("@@"))===null||p===void 0?void 0:p[1].split(" ").filter(Boolean),$=g?.[0]||"",w=g?.[1]||"",[_,L]=$.split(","),[x,I]=w.split(",");m.hunkInfo={oldStartIndex:-Number(_),oldLength:Number(L),newStartIndex:+Number(x),newLength:Number(I),_oldStartIndex:-Number(_),_oldLength:Number(L),_newStartIndex:+Number(x),_newLength:Number(I)},a=m}else if(m.type===Re.Context){let g=d;a&&(g.prevHunkLine=a,a=null)}else a=null;return m}),"f"),z(this,Gn,{},"f"),z(this,Yn,{},"f");let f=-1,u=-1;v(this,Si,"f").forEach(d=>{d.oldLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,d.oldLineNumber),v(this,Gn,"f")[d.oldLineNumber]=d),d.newLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,d.newLineNumber),v(this,Yn,"f")[d.newLineNumber]=d)})},va=function(){var e,n,i,r,o,l;z(this,Ei,((e=v(this,Xe,"f"))===null||e===void 0?void 0:e.highlighterName)||((n=v(this,Je,"f"))===null||n===void 0?void 0:n.highlighterName)||v(this,Ei,"f"),"f"),z(this,Li,((i=v(this,Xe,"f"))===null||i===void 0?void 0:i.highlighterType)||((r=v(this,Je,"f"))===null||r===void 0?void 0:r.highlighterType)||v(this,Li,"f"),"f"),!((o=v(this,Xe,"f"))===null||o===void 0)&&o.highlighterName&&z(this,qn,v(this,Xe,"f").syntaxFile,"f"),!((l=v(this,Je,"f"))===null||l===void 0)&&l.highlighterName&&z(this,Kn,v(this,Je,"f").syntaxFile,"f")},xd=function({registerHighlighter:e}){var n,i,r,o;(n=v(this,Xe,"f"))===null||n===void 0||n.doSyntax({registerHighlighter:e,theme:v(this,Ot,"f")}),z(this,qn,(i=v(this,Xe,"f"))===null||i===void 0?void 0:i.syntaxFile,"f"),(r=v(this,Je,"f"))===null||r===void 0||r.doSyntax({registerHighlighter:e,theme:v(this,Ot,"f")}),z(this,Kn,(o=v(this,Je,"f"))===null||o===void 0?void 0:o.syntaxFile,"f")},Yd=function({registerHighlighter:e}={}){v(this,vo,"f")&&!v(this,_o,"f")||(v(this,Te,"m",xd).call(this,{registerHighlighter:e}),v(this,Te,"m",va).call(this))},Lr=function(e){var n;if(e)return(n=v(this,Gn,"f"))===null||n===void 0?void 0:n[e]},kr=function(e){var n;if(e)return(n=v(this,Yn,"f"))===null||n===void 0?void 0:n[e]},bo=function(e){var n;return(n=v(this,Gi,"f"))===null||n===void 0?void 0:n[e]},wo=function(e){var n;return(n=v(this,Yi,"f"))===null||n===void 0?void 0:n[e]},yd=function(e){var n;return(n=v(this,qn,"f"))===null||n===void 0?void 0:n[e]},$d=function(e){var n;return(n=v(this,Kn,"f"))===null||n===void 0?void 0:n[e]};var qd="diff-multi-select-active";function Ed(t){if(!t)return null;let e=t.querySelector("span[data-line-num]");if(!e)return null;let n=e.getAttribute("data-line-num"),i=parseInt(n??"",10);return n!==i.toString()||isNaN(i)?null:i}function yp(t){if(!t)return null;let e=t.closest("[data-side]");return e?e.getAttribute("data-side"):null}function Ld(t){if(!t)return null;let e=t.closest(".diff-line-num");if(!e)return null;let n=e.querySelector("span[data-line-old-num]"),i=e.querySelector("span[data-line-new-num]"),r=n?.getAttribute("data-line-old-num"),o=i?.getAttribute("data-line-new-num"),l=r?parseInt(r,10):void 0,a=o?parseInt(o,10):void 0;return l===void 0&&a===void 0?null:{old:l,new:a}}function kd(t,e=!1){var n,i,r,o;if(!t)return null;let l=null;if(!e||t.closest(".diff-add-widget-wrapper")){let a=t.closest(".diff-line-new-content"),f=t.closest(".diff-line-old-content");a&&(l=(i=(n=a.parentElement)===null||n===void 0?void 0:n.querySelector(".diff-line-new-num"))!==null&&i!==void 0?i:null),f&&(l=(o=(r=f.parentElement)===null||r===void 0?void 0:r.querySelector(".diff-line-old-num"))!==null&&o!==void 0?o:null)}return l||(l=t.closest(".diff-line-new-num")||t.closest(".diff-line-old-num")),l}function as(t){let e=Math.min(t.startLineNumber,t.endLineNumber),n=Math.max(t.startLineNumber,t.endLineNumber);return{...t,startLineNumber:e,endLineNumber:n}}var Kd=t=>{let e=[];return t.new&&t.new.length&&e.push({side:"new",startLineNumber:Math.min(...t.new),endLineNumber:Math.max(...t.new)}),t.old&&t.old.length&&e.push({side:"old",startLineNumber:Math.min(...t.old),endLineNumber:Math.max(...t.old)}),e},$p=(t,e,n,i)=>{kp(e,n).forEach(o=>{var l,a;if(!o.isHide&&o.index){let f=t.filter(u=>u.getAttribute("data-line")===o.index.toString());if(f.length===2)if(o.isContext)f.forEach(u=>u.querySelectorAll("td").forEach(d=>d.classList.add(i)));else{let u=f.find(d=>d.getAttribute("data-side")===n.side);u?.querySelectorAll("td").forEach(d=>d.classList.add(i))}else o.isContext?(l=f[0])===null||l===void 0||l.querySelectorAll("td").forEach(u=>u.classList.add(i)):(a=f[0])===null||a===void 0||a.querySelectorAll(`td[data-side="${n.side}"]`).forEach(u=>u.classList.add(i))}})};function Ep(t,e,n,i={old:[],new:[]},r=qd){if(!t)return;let o=`diff-root${n?.getId()}`,a=Array.from(t.querySelectorAll("tr[data-line]")).filter(c=>{var p;return((p=c.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),f=Kd(i),d=(e?f.concat(e):f).map(as);a.forEach(c=>{c.querySelectorAll("td").forEach(m=>m.classList.remove(r))}),d.forEach(c=>{c&&n&&$p(a,n,c,r)})}function Lp(t,e,n,i={old:[],new:[]},r=qd){if(!t)return;let o=`diff-root${n?.getId()}`,a=Array.from(t.querySelectorAll("tr[data-line]")).filter(c=>{var p;return((p=c.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),f=Kd(i),d=(e?f.concat(e):f).map(as);a.forEach(c=>{let p=c.querySelector(".diff-line-num"),m=c.querySelector(".diff-line-content");if(!p||!m)return;p.classList.remove(r),m.classList.remove(r);let g=p.querySelector("span[data-line-old-num]"),$=p.querySelector("span[data-line-new-num]"),w=g?.getAttribute("data-line-old-num"),_=$?.getAttribute("data-line-new-num"),L=w?parseInt(w,10):void 0,x=_?parseInt(_,10):void 0;d.some(I=>I.side==="old"&&L&&L>=I.startLineNumber&&L<=I.endLineNumber||I.side==="new"&&x&&x>=I.startLineNumber&&x<=I.endLineNumber)&&(p.classList.add(r),m.classList.add(r))})}function kp(t,e){var n;let i=as(e),r=[],{side:o,startLineNumber:l,endLineNumber:a}=i,f=o==="old"?O.old:O.new;for(let u=l;u<=a;u++){let d=t.getSplitLineByLineNumber(u,f),c=t.getSplitLineIndexByLineNumber(u,f);if(d&&d.lineNumber!==void 0){let p=(n=d.diff)===null||n===void 0?void 0:n.type;r.push({index:c+1,lineNumber:d.lineNumber,value:d.value,isHide:wp(t,u,f).split,isDelete:p===Re.Delete,isAdd:p===Re.Add,isContext:p===Re.Context||p===void 0})}}return r}var Sn,_r,Qo,pt,Ae,aa,la,Sp,Sd,Nd,Np,Id,Td,Cd,Fd,Dd,co,Ad;_r=new WeakMap,Qo=new WeakMap,pt=new WeakMap,Ae=new WeakMap,aa=new WeakMap,la=new WeakMap,Sp=new WeakMap,Sd=new WeakMap,Nd=new WeakMap,Sn=new WeakSet,Np=function(){var e;if(!v(this,_r,"f")||v(this,la,"f"))return;let n=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Td).call(this,o):v(this,Sn,"m",Id).call(this,o)},i=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Fd).call(this,o):v(this,Sn,"m",Cd).call(this,o)},r=()=>{v(this,Sn,"m",Dd).call(this)};z(this,la,{mousedown:n,mouseover:i,mouseup:r},"f"),v(this,_r,"f").addEventListener("mousedown",n),v(this,_r,"f").addEventListener("mouseover",i),document.addEventListener("mouseup",r),z(this,Sd,((e=v(this,Qo,"f"))===null||e===void 0?void 0:e.subscribe(()=>v(this,Nd,"f").call(this)))||(()=>{}),"f")},Id=function(e){let n=kd(e.target,!0);if(!n)return;let i=Ed(n);if(i===null)return;let r=yp(n);if(!r)return;v(this,Ae,"f").isSelecting=!0,v(this,Ae,"f").startInfo={lineNumber:i,side:r};let o={side:r,startLineNumber:i,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let l=v(this,pt,"f").scopeToHunk(o);l&&(o=l)}v(this,Ae,"f").currentRange=o,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(o,{...v(this,Ae,"f")})},Td=function(e){var n;let i=Ld(e.target);if(!i)return;let r=(n=i.new)!==null&&n!==void 0?n:i.old;if(r===void 0)return;let o=i.new!==void 0?"new":"old";v(this,Ae,"f").isSelecting=!0,v(this,Ae,"f").startInfo={lineNumber:r,side:o};let l={side:o,startLineNumber:r,endLineNumber:r};if(v(this,pt,"f").scopeToHunk){let a=v(this,pt,"f").scopeToHunk(l);a&&(l=a)}v(this,Ae,"f").currentRange=l,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(l,{...v(this,Ae,"f")})},Cd=function(e){if(!v(this,Ae,"f").isSelecting||!v(this,Ae,"f").startInfo)return;let n=kd(e.target);if(!n)return;let i=Ed(n);if(i===null)return;let r={side:v(this,Ae,"f").startInfo.side,startLineNumber:v(this,Ae,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Ae,"f").currentRange=r,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Ae,"f")})},Fd=function(e){if(!v(this,Ae,"f").isSelecting||!v(this,Ae,"f").startInfo)return;let n=Ld(e.target);if(!n)return;let i=n[v(this,Ae,"f").startInfo.side];if(i===void 0)return;let r={side:v(this,Ae,"f").startInfo.side,startLineNumber:v(this,Ae,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Ae,"f").currentRange=r,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Ae,"f")})},Dd=function(){if(!v(this,Ae,"f").isSelecting||!v(this,Ae,"f").currentRange){v(this,Sn,"m",Ad).call(this);return}let e=as(v(this,Ae,"f").currentRange);v(this,Ae,"f").currentRange=e,v(this,Ae,"f").isSelecting=!1;let n=this.getSelectionResult();v(this,pt,"f").onSelectionComplete(n)},co=function(){v(this,pt,"f").isUnifiedMode?Lp(v(this,_r,"f"),v(this,Ae,"f").currentRange,v(this,Qo,"f"),v(this,aa,"f"),v(this,pt,"f").selectedClassName):Ep(v(this,_r,"f"),v(this,Ae,"f").currentRange,v(this,Qo,"f"),v(this,aa,"f"),v(this,pt,"f").selectedClassName)},Ad=function(){z(this,Ae,{isSelecting:!1,startInfo:null,currentRange:null},"f")};var Lo=class{diff(e,n,i={}){let r;typeof i=="function"?(r=i,i={}):"callback"in i&&(r=i.callback);let o=this.castInput(e,i),l=this.castInput(n,i),a=this.removeEmpty(this.tokenize(o,i)),f=this.removeEmpty(this.tokenize(l,i));return this.diffWithOptionsObj(a,f,i,r)}diffWithOptionsObj(e,n,i,r){var o;let l=L=>{if(L=this.postProcess(L,i),r){setTimeout(function(){r(L)},0);return}else return L},a=n.length,f=e.length,u=1,d=a+f;i.maxEditLength!=null&&(d=Math.min(d,i.maxEditLength));let c=(o=i.timeout)!==null&&o!==void 0?o:1/0,p=Date.now()+c,m=[{oldPos:-1,lastComponent:void 0}],g=this.extractCommon(m[0],n,e,0,i);if(m[0].oldPos+1>=f&&g+1>=a)return l(this.buildValues(m[0].lastComponent,n,e));let $=-1/0,w=1/0,_=()=>{for(let L=Math.max($,-u);L<=Math.min(w,u);L+=2){let x,I=m[L-1],S=m[L+1];I&&(m[L-1]=void 0);let y=!1;if(S){let b=S.oldPos-L;y=S&&0<=b&&b<a}let h=I&&I.oldPos+1<f;if(!y&&!h){m[L]=void 0;continue}if(!h||y&&I.oldPos<S.oldPos?x=this.addToPath(S,!0,!1,0,i):x=this.addToPath(I,!1,!0,1,i),g=this.extractCommon(x,n,e,L,i),x.oldPos+1>=f&&g+1>=a)return l(this.buildValues(x.lastComponent,n,e))||!0;m[L]=x,x.oldPos+1>=f&&(w=Math.min(w,L-1)),g+1>=a&&($=Math.max($,L+1))}u++};if(r)(function L(){setTimeout(function(){if(u>d||Date.now()>p)return r(void 0);_()||L()},0)})();else for(;u<=d&&Date.now()<=p;){let L=_();if(L)return L}}addToPath(e,n,i,r,o){let l=e.lastComponent;return l&&!o.oneChangePerToken&&l.added===n&&l.removed===i?{oldPos:e.oldPos+r,lastComponent:{count:l.count+1,added:n,removed:i,previousComponent:l.previousComponent}}:{oldPos:e.oldPos+r,lastComponent:{count:1,added:n,removed:i,previousComponent:l}}}extractCommon(e,n,i,r,o){let l=n.length,a=i.length,f=e.oldPos,u=f-r,d=0;for(;u+1<l&&f+1<a&&this.equals(i[f+1],n[u+1],o);)u++,f++,d++,o.oneChangePerToken&&(e.lastComponent={count:1,previousComponent:e.lastComponent,added:!1,removed:!1});return d&&!o.oneChangePerToken&&(e.lastComponent={count:d,previousComponent:e.lastComponent,added:!1,removed:!1}),e.oldPos=f,u}equals(e,n,i){return i.comparator?i.comparator(e,n):e===n||!!i.ignoreCase&&e.toLowerCase()===n.toLowerCase()}removeEmpty(e){let n=[];for(let i=0;i<e.length;i++)e[i]&&n.push(e[i]);return n}castInput(e,n){return e}tokenize(e,n){return Array.from(e)}join(e){return e.join("")}postProcess(e,n){return e}get useLongestToken(){return!1}buildValues(e,n,i){let r=[],o;for(;e;)r.push(e),o=e.previousComponent,delete e.previousComponent,e=o;r.reverse();let l=r.length,a=0,f=0,u=0;for(;a<l;a++){let d=r[a];if(d.removed)d.value=this.join(i.slice(u,u+d.count)),u+=d.count;else{if(!d.added&&this.useLongestToken){let c=n.slice(f,f+d.count);c=c.map(function(p,m){let g=i[u+m];return g.length>p.length?g:p}),d.value=this.join(c)}else d.value=this.join(n.slice(f,f+d.count));f+=d.count,d.added||(u+=d.count)}}return r}};var ya=class extends Lo{constructor(){super(...arguments),this.tokenize=Tp}equals(e,n,i){return i.ignoreWhitespace?((!i.newlineIsToken||!e.includes(`
`))&&(e=e.trim()),(!i.newlineIsToken||!n.includes(`
`))&&(n=n.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith(`
`)&&(e=e.slice(0,-1)),n.endsWith(`
`)&&(n=n.slice(0,-1))),super.equals(e,n,i)}},Ip=new ya;function $a(t,e,n){return Ip.diff(t,e,n)}function Tp(t,e){e.stripTrailingCr&&(t=t.replace(/\r\n/g,`
`));let n=[],i=t.split(/(\n|\r\n)/);i[i.length-1]||i.pop();for(let r=0;r<i.length;r++){let o=i[r];r%2&&!e.newlineIsToken?n[n.length-1]+=o:n.push(o)}return n}var Zd={includeIndex:!0,includeUnderline:!0,includeFileHeaders:!0};function Ea(t,e,n,i,r,o,l){let a;l?typeof l=="function"?a={callback:l}:a=l:a={},typeof a.context>"u"&&(a.context=4);let f=a.context;if(a.newlineIsToken)throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(a.callback){let{callback:d}=a;$a(n,i,Object.assign(Object.assign({},a),{callback:c=>{let p=u(c);d(p)}}))}else return u($a(n,i,a));function u(d){if(!d)return;d.push({value:"",lines:[]});function c(L){return L.map(function(x){return" "+x})}let p=[],m=0,g=0,$=[],w=1,_=1;for(let L=0;L<d.length;L++){let x=d[L],I=x.lines||Cp(x.value);if(x.lines=I,x.added||x.removed){if(!m){let S=d[L-1];m=w,g=_,S&&($=f>0?c(S.lines.slice(-f)):[],m-=$.length,g-=$.length)}for(let S of I)$.push((x.added?"+":"-")+S);x.added?_+=I.length:w+=I.length}else{if(m)if(I.length<=f*2&&L<d.length-2)for(let S of c(I))$.push(S);else{let S=Math.min(I.length,f);for(let h of c(I.slice(0,S)))$.push(h);let y={oldStart:m,oldLines:w-m+S,newStart:g,newLines:_-g+S,lines:$};p.push(y),m=0,g=0,$=[]}w+=I.length,_+=I.length}}for(let L of p)for(let x=0;x<L.lines.length;x++)L.lines[x].endsWith(`
`)?L.lines[x]=L.lines[x].slice(0,-1):(L.lines.splice(x+1,0,"\\ No newline at end of file"),x++);return{oldFileName:t,newFileName:e,oldHeader:r,newHeader:o,hunks:p}}}function ls(t,e){if(e||(e=Zd),Array.isArray(t)){if(t.length>1&&!e.includeFileHeaders)throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");return t.map(i=>ls(i,e)).join(`
`)}let n=[];e.includeIndex&&t.oldFileName==t.newFileName&&n.push("Index: "+t.oldFileName),e.includeUnderline&&n.push("==================================================================="),e.includeFileHeaders&&(n.push("--- "+t.oldFileName+(typeof t.oldHeader>"u"?"":"	"+t.oldHeader)),n.push("+++ "+t.newFileName+(typeof t.newHeader>"u"?"":"	"+t.newHeader)));for(let i=0;i<t.hunks.length;i++){let r=t.hunks[i];r.oldLines===0&&(r.oldStart-=1),r.newLines===0&&(r.newStart-=1),n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@");for(let o of r.lines)n.push(o)}return n.join(`
`)+`
`}function La(t,e,n,i,r,o,l){if(typeof l=="function"&&(l={callback:l}),l?.callback){let{callback:a}=l;Ea(t,e,n,i,r,o,Object.assign(Object.assign({},l),{callback:f=>{a(f?ls(f,l.headerOptions):void 0)}}))}else{let a=Ea(t,e,n,i,r,o,l);return a?ls(a,l?.headerOptions):void 0}}function Cp(t){let e=t.endsWith(`
`),n=t.split(`
`).map(i=>i+`
`);return e?n.pop():n.push(n.pop().slice(0,-1)),n}os.name="@git-diff-view/file";function Xd(t,e,n,i,r,o,l,a){let f=La(t,n,e,i,"","",l);return new Zi(t,e,n,i,[f],r,o,a)}var Tr;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(Tr||(Tr={}));var Pt;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(Pt||(Pt={}));typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var Zn={};var We=Symbol("uninitialized"),tn=Symbol("filename");var ds="http://www.w3.org/1999/xhtml",ko="http://www.w3.org/2000/svg",ka="http://www.w3.org/1998/Math/MathML";var Jd=globalThis.process?.env?.NODE_ENV,R=Jd&&!Jd.toLowerCase().startsWith("prod");var mi=Array.isArray,Qd=Array.prototype.indexOf,Ni=Array.prototype.includes,Cr=Array.from,Sa=Object.keys,jt=Object.defineProperty,cn=Object.getOwnPropertyDescriptor,Na=Object.getOwnPropertyDescriptors,Ia=Object.prototype,ef=Array.prototype,Fr=Object.getPrototypeOf,Ta=Object.isExtensible;var ht=()=>{};function fs(t){for(var e=0;e<t.length;e++)t[e]()}function cs(){var t,e,n=new Promise((i,r)=>{t=i,e=r});return{promise:n,resolve:t,reject:e}}var Kt=Symbol("$state"),us=Symbol("legacy props"),tf=Symbol(""),ps=Symbol("proxy path"),hs=Symbol("attributes"),So=Symbol("class"),No=Symbol("style"),Io=Symbol("text");var Ca=Symbol("hmr anchor"),gi=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Fa=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Dr=3,un=8;function nf(t){if(R){let e=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${t}"
https://svelte.dev/e/invariant_violation`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invariant_violation")}function Ar(t){if(R){let e=new Error(`lifecycle_outside_component
\`${t}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function of(){if(R){let t=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function sf(){if(R){let t=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/derived_references_self")}function Da(t,e,n){if(R){let i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${t} and ${e}`:`Keyed each block has duplicate key at indexes ${t} and ${e}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function af(t,e,n){if(R){let i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${t} was \`${e}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_volatile")}function lf(t){if(R){let e=new Error(`effect_in_teardown
\`${t}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function df(){if(R){let t=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function ff(t){if(R){let e=new Error(`effect_orphan
\`${t}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_orphan")}function cf(){if(R){let t=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function uf(){if(R){let t=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydration_failed")}function pf(){if(R){let t=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invalid_snippet")}function hf(t){if(R){let e=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${t}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function mf(t){if(R){let e=new Error(`rune_outside_svelte
The \`${t}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function gf(){if(R){let t=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/set_context_after_init")}function vf(){if(R){let t=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function _f(){if(R){let t=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function bf(){if(R){let t=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function wf(){if(R){let t=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Xn="font-weight: bold",Jn="font-weight: normal";function xf(t){R?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${t}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Xn,Jn):console.warn("https://svelte.dev/e/await_reactivity_loss")}function yf(t,e){R?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${t}\` (${e}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,Xn,Jn):console.warn("https://svelte.dev/e/await_waterfall")}function $f(){R?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,Xn,Jn):console.warn("https://svelte.dev/e/derived_inert")}function Ef(t,e,n){R?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${t}\` attribute on \`${e}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Xn,Jn):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Lf(t){R?console.warn(`%c[svelte] hydration_html_changed
%c${t?`The value of an \`{@html ...}\` block ${t} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,Xn,Jn):console.warn("https://svelte.dev/e/hydration_html_changed")}function Ii(t){R?console.warn(`%c[svelte] hydration_mismatch
%c${t?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${t}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,Xn,Jn):console.warn("https://svelte.dev/e/hydration_mismatch")}function kf(){R?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Xn,Jn):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function ms(t){R?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${t}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Xn,Jn):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function Sf(){R?console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Xn,Jn):console.warn("https://svelte.dev/e/state_proxy_unmount")}function Nf(){R?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Xn,Jn):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var le=!1;function mt(t){le=t}var _e;function Me(t){if(t===null)throw Ii(),Zn;return _e=t}function Et(){return Me(Lt(_e))}function T(t){if(le){if(Lt(_e)!==null)throw Ii(),Zn;_e=t}}function Ji(t=1){if(le){for(var e=t,n=_e;e--;)n=Lt(n);_e=n}}function Qn(t=!0){for(var e=0,n=_e;;){if(n.nodeType===un){var i=n.data;if(i==="]"){if(e===0)return n;e-=1}else(i==="["||i==="[!"||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(e+=1)}var r=Lt(n);t&&n.remove(),n=r}}function Co(t){if(!t||t.nodeType!==un)throw Ii(),Zn;return t.data}function gs(t){return t===this.v}function Aa(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function vs(t){return!Aa(t,this.v)}var gt=!1,vi=!1,Fn=!1;function If(){vi=!0}var Fo=null;function Wt(t,e){return t.label=e,bs(t.v,e),t}function bs(t,e){return t?.[ps]?.(e),t}function Dn(t){let e=new Error,n=Ap();return n.length===0?null:(n.unshift(`
`),jt(e,"stack",{value:n.join(`
`)}),jt(e,"name",{value:t}),e)}function Ap(){let t=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let e=new Error().stack;if(Error.stackTraceLimit=t,!e)return[];let n=e.split(`
`),i=[];for(let r=0;r<n.length;r++){let o=n[r],l=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];l.includes("svelte/src/internal")||l.includes("node_modules/.vite")||i.push(o)}}return i}function Cf(t,e){if(!R)throw new Error("invariant(...) was not guarded by if (DEV)");t||nf(e)}var Ee=null;function _i(t){Ee=t}var An=null;function Hr(t){An=t}var pn=null;function ws(t){pn=t}function Ye(t){return Ff("getContext").get(t)}function qe(t,e){let n=Ff("setContext");if(gt){var i=ae.f,r=!me&&(i&32)!==0&&!Ee.i;r||gf()}return n.set(t,e),e}function de(t,e=!1,n){Ee={p:Ee,i:!1,c:null,e:null,s:t,x:null,r:ae,l:vi&&!e?{s:null,u:null,$:[]}:null},R&&(Ee.function=n,pn=n)}function fe(t){var e=Ee,n=e.e;if(n!==null){e.e=null;for(var i of n)Ma(i)}return t!==void 0&&(e.x=t),e.i=!0,Ee=e.p,R&&(pn=Ee?.function??null),t??{}}function ei(){return!vi||Ee!==null&&Ee.l===null}function Ff(t){return Ee===null&&Ar(t),Ee.c??=new Map(Mp(Ee)||void 0)}function Mp(t){let e=t.p;for(;e!==null;){let n=e.c;if(n!==null)return n;e=e.p}return null}var Qi=[];function Df(){var t=Qi;Qi=[],fs(t)}function kt(t){if(Qi.length===0&&!er){var e=Qi;queueMicrotask(()=>{e===Qi&&Df()})}Qi.push(t)}function Af(){for(;Qi.length>0;)Df()}var Ra=new WeakMap;function xs(t){var e=ae;if(e===null)return me.f|=8388608,t;if(R&&t instanceof Error&&!Ra.has(t)&&Ra.set(t,Rp(t,e)),(e.f&32768)===0&&(e.f&4)===0)throw R&&!e.parent&&t instanceof Error&&Mf(t),t;Rn(t,e)}function Rn(t,e){if(!(e!==null&&(e.f&16384)!==0)){for(;e!==null;){if((e.f&128)!==0){if((e.f&32768)===0)throw t;try{e.b.error(t);return}catch(n){t=n}}e=e.parent}throw R&&t instanceof Error&&Mf(t),t}}function Rp(t,e){let n=cn(t,"message");if(!(n&&!n.configurable)){for(var i=Ao?"  ":"	",r=`
${i}in ${e.fn?.name||"<unknown>"}`,o=e.ctx;o!==null;)r+=`
${i}in ${o.function?.[tn].split("/").pop()}`,o=o.p;return{message:t.message+`
${r}
`,stack:t.stack?.split(`
`).filter(l=>!l.includes("svelte/src/internal")).join(`
`)}}}function Mf(t){let e=Ra.get(t);e&&(jt(t,"message",{value:e.message}),jt(t,"stack",{value:e.stack}))}var Hp=-7169;function He(t,e){t.f=t.f&Hp|e}function Or(t){(t.f&512)!==0||t.deps===null?He(t,1024):He(t,4096)}function Rf(t){if(t!==null)for(let e of t)(e.f&2)===0||(e.f&65536)===0||(e.f^=65536,Rf(e.deps))}function ys(t,e,n){(t.f&2048)!==0?e.add(t):(t.f&4096)!==0&&n.add(t),Rf(t.deps),He(t,1024)}var Hf=!1;function ti(t){var e=me,n=ae;wt(null),xt(null);try{return t()}finally{wt(e),xt(n)}}function Bf(t){let e=0,n=Gt(0),i;return R&&Wt(n,"createSubscriber version"),()=>{Ti()&&(s(n),Zt(()=>(e===0&&(i=Qe(()=>t(()=>rr(n)))),e+=1,()=>{kt(()=>{e-=1,e===0&&(i?.(),i=void 0,rr(n))})})))}}var Pp=589824;function Oa(t,e,n,i){new Ha(t,e,n,i)}var Ha=class{parent;is_pending=!1;transform_error;#e;#t=le?_e:null;#n;#l;#o;#s=null;#i=null;#a=null;#r=null;#h=0;#f=0;#c=!1;#u=new Set;#g=new Set;#d=null;#b=Bf(()=>(this.#d=Gt(this.#h),R&&Wt(this.#d,"$effect.pending()"),()=>{this.#d=null}));constructor(e,n,i,r){this.#e=e,this.#n=n,this.#l=o=>{var l=ae;l.b=this,l.f|=128,i(o)},this.parent=ae.b,this.transform_error=r??this.parent?.transform_error??(o=>o),this.#o=sn(()=>{if(le){let o=this.#t;Et();let l=o.data==="[!";if(o.data.startsWith("[?")){let f=JSON.parse(o.data.slice("[?".length));this.#w(f)}else l?this.#y():this.#v()}else this.#x()},Pp),le&&(this.#e=_e)}#v(){try{this.#s=dt(()=>this.#l(this.#e))}catch(e){this.error(e)}}#w(e){let n=this.#n.failed;n&&(this.#a=dt(()=>{n(this.#e,()=>e,()=>()=>{})}))}#y(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#i=dt(()=>e(this.#e)),kt(()=>{var n=this.#r=document.createDocumentFragment(),i=yt();n.append(i),this.#s=this.#_(()=>dt(()=>this.#l(i))),this.#f===0&&(this.#e.before(n),this.#r=null,ni(this.#i,()=>{this.#i=null}),this.#p(be))}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#h=0,this.#s=dt(()=>{this.#l(this.#e)}),this.#f>0){var e=this.#r=document.createDocumentFragment();Br(this.#s,e);let n=this.#n.pending;this.#i=dt(()=>n(this.#e))}else this.#p(be)}catch(n){this.error(n)}}#p(e){this.is_pending=!1,e.transfer_effects(this.#u,this.#g)}defer_effect(e){ys(e,this.#u,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#_(e){var n=ae,i=me,r=Ee;xt(this.#o),wt(this.#o),_i(this.#o.ctx);try{return hn.ensure(),e()}catch(o){return xs(o),null}finally{xt(n),wt(i),_i(r)}}#m(e,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#m(e,n);return}this.#f+=e,this.#f===0&&(this.#p(n),this.#i&&ni(this.#i,()=>{this.#i=null}),this.#r&&(this.#e.before(this.#r),this.#r=null))}update_pending_count(e,n){this.#m(e,n),this.#h+=e,!(!this.#d||this.#c)&&(this.#c=!0,kt(()=>{this.#c=!1,this.#d&&Hn(this.#d,this.#h)}))}get_effect_pending(){return this.#b(),s(this.#d)}error(e){if(!this.#n.onerror&&!this.#n.failed)throw e;be?.is_fork?(this.#s&&be.skip_effect(this.#s),this.#i&&be.skip_effect(this.#i),this.#a&&be.skip_effect(this.#a),be.oncommit(()=>{this.#$(e)})):this.#$(e)}#$(e){this.#s&&(tt(this.#s),this.#s=null),this.#i&&(tt(this.#i),this.#i=null),this.#a&&(tt(this.#a),this.#a=null),le&&(Me(this.#t),Ji(),Me(Qn()));var n=this.#n.onerror;let i=this.#n.failed;var r=!1,o=!1;let l=()=>{if(r){Nf();return}r=!0,o&&wf(),this.#a!==null&&ni(this.#a,()=>{this.#a=null}),this.#_(()=>{this.#x()})},a=f=>{try{o=!0,n?.(f,l),o=!1}catch(u){Rn(u,this.#o&&this.#o.parent)}i&&(this.#a=this.#_(()=>{try{return dt(()=>{var u=ae;u.b=this,u.f|=128,i(this.#e,()=>f,()=>l)})}catch(u){return Rn(u,this.#o.parent),null}}))};kt(()=>{var f;try{f=this.transform_error(e)}catch(u){Rn(u,this.#o&&this.#o.parent);return}f!==null&&typeof f=="object"&&typeof f.then=="function"?f.then(a,u=>Rn(u,this.#o&&this.#o.parent)):a(f)})}};function $s(t,e,n,i){let r=ei()?jr:Wr;var o=t.filter(m=>!m.settled),l=e.map(r);if(R&&l.forEach((m,g)=>{m.label=e[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,($,w)=>w)}),n.length===0&&o.length===0){i(l);return}var a=ae,f=jf(),u=o.length===1?o[0].promise:o.length>1?Promise.all(o.map(m=>m.promise)):null;function d(m){if((a.f&16384)===0){f();try{i([...l,...m])}catch(g){Rn(g,a)}Pr()}}var c=Ba();if(n.length===0){u.then(()=>d([])).finally(c);return}function p(){Promise.all(n.map(m=>ja(m))).then(d).catch(m=>Rn(m,a)).finally(c)}u?u.then(()=>{f(),p(),Pr()}):p()}function jf(){var t=ae,e=me,n=Ee,i=be;if(R)var r=An;return function(l=!0){xt(t),wt(e),_i(n),l&&(t.f&16384)===0&&(i?.activate(),i?.apply()),R&&(Pa(null),Hr(r))}}function Pr(t=!0){xt(null),wt(null),_i(null),t&&be?.deactivate(),R&&(Pa(null),Hr(null))}function Ba(){var t=ae,e=t.b,n=be,i=!!e?.is_rendered();return e?.update_pending_count(1,n),n.increment(i,t),()=>{e?.update_pending_count(-1,n),n.decrement(i,t)}}var an=null;function Pa(t){an=t}var Ro=new Set;function jr(t){var e=2050;ae!==null&&(ae.f|=524288);let n={ctx:Ee,deps:null,effects:null,equals:gs,f:e,fn:t,reactions:null,rv:0,v:We,wv:0,parent:ae,ac:null};return R&&Fn&&(n.created=Dn("created at")),n}var Ur=Symbol("obsolete");function ja(t,e,n){let i=ae;i===null&&of();var r=void 0,o=Gt(We);R&&(o.label=e??t.toString());var l=!me,a=new Set;return Vf(()=>{var f=ae;R&&(an={effect:f,effect_deps:new Set,warned:!1});var u=cs();r=u.promise;try{Promise.resolve(t()).then(u.resolve,m=>{m!==gi&&u.reject(m)}).finally(Pr)}catch(m){u.reject(m),Pr()}if(R){if(an){if(f.deps!==null)for(let m=0;m<Xt;m+=1)an.effect_deps.add(f.deps[m]);if(St!==null)for(let m=0;m<St.length;m+=1)an.effect_deps.add(St[m])}an=null}var d=be;if(l){if((f.f&32768)!==0)var c=Ba();if(i.b?.is_rendered())d.async_deriveds.get(f)?.reject(Ur);else for(let m of a.values())m.reject(Ur);a.add(u),d.async_deriveds.set(f,u)}let p=(m,g=void 0)=>{R&&(an=null),c?.(),a.delete(u),g!==Ur&&(d.activate(),g?(o.f|=8388608,Hn(o,g)):((o.f&8388608)!==0&&(o.f^=8388608),R&&n!==void 0&&!o.equals(m)&&(Ro.add(o),setTimeout(()=>{Ro.has(o)&&(f.f&16384)===0&&(yf(o.label,n),Ro.delete(o))})),Hn(o,m)),d.deactivate())};u.promise.then(p,m=>p(null,m||"unknown"))}),Vt(()=>{for(let f of a)f.reject(Ur)}),R&&(o.f|=4194304),new Promise(f=>{function u(d){function c(){d===r?f(o):u(r)}d.then(c,c)}u(r)})}function k(t){let e=jr(t);return gt||ks(e),e}function Wr(t){let e=jr(t);return e.equals=vs,e}function Wf(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)tt(e[n])}}var Wa=[];function Ho(t){var e,n=ae,i=t.parent;if(!wn&&i!==null&&t.v!==We&&(i.f&24576)!==0)return $f(),t.v;if(xt(i),R){let r=or;Es(new Set);try{Ni.call(Wa,t)&&sf(),Wa.push(t),t.f&=-65537,Wf(t),e=Ls(t)}finally{xt(n),Es(r),Wa.pop()}}else try{t.f&=-65537,Wf(t),e=Ls(t)}finally{xt(n)}return e}function Ua(t){var e=Ho(t);if(!t.equals(e)&&(t.wv=Vr(),(!be?.is_fork||t.deps===null)&&(be!==null?(be.capture(t,e,!0),Ci?.capture(t,e,!0)):t.v=e,t.deps===null))){He(t,1024);return}wn||(Nt!==null?(Ti()||be?.is_fork)&&Nt.set(t,e):Or(t))}function Uf(t){if(t.effects!==null)for(let e of t.effects)(e.teardown||e.ac)&&(e.teardown?.(),e.ac!==null&&ti(()=>{e.ac.abort(gi),e.ac=null}),e.fn!==null&&(e.teardown=ht),sr(e,0),Oo(e))}function Va(t){if(t.effects!==null)for(let e of t.effects)e.teardown&&e.fn!==null&&ii(e)}var Ss=null,zr=null,be=null,Ci=null,Nt=null,Ya=null,er=!1,za=!1,ar=null,Bo=null,zf=0,Ga=new Set,Up=1,hn=class t{id=Up++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#l=new Set;#o=new Set;#s=0;#i=new Map;#a=null;#r=[];#h=[];#f=new Set;#c=new Set;#u=new Map;#g=new Set;is_fork=!1;#d=!1;constructor(){zr===null?Ss=zr=this:(zr.#n=this,this.#t=zr),zr=this}#b(){if(this.is_fork)return!0;for(let i of this.#i.keys()){for(var e=i,n=!1;e.parent!==null;){if(this.#u.has(e)){n=!0;break}e=e.parent}if(!n)return!0}return!1}skip_effect(e){this.#u.has(e)||this.#u.set(e,{d:[],m:[]}),this.#g.delete(e)}unskip_effect(e,n=i=>this.schedule(i)){var i=this.#u.get(e);if(i){this.#u.delete(e);for(var r of i.d)He(r,2048),n(r);for(r of i.m)He(r,4096),n(r)}this.#g.add(e)}#v(){if(this.#e=!0,zf++>1e3&&(this.#m(),Vp()),R)for(let f of this.current.keys())Ga.add(f);for(let f of this.#f)this.#c.delete(f),He(f,2048),this.schedule(f);for(let f of this.#c)He(f,4096),this.schedule(f);let e=this.#r;this.#r=[],this.apply();var n=ar=[],i=[],r=Bo=[];for(let f of e)try{this.#w(f,n,i)}catch(u){throw Kf(f),this.#b()||this.discard(),u}if(be=null,r.length>0){var o=t.ensure();for(let f of r)o.schedule(f)}if(ar=null,Bo=null,this.#b()){this.#p(i),this.#p(n);for(let[f,u]of this.#u)qf(f,u);r.length>0&&be.#v();return}let l=this.#y();if(l){this.#p(i),this.#p(n),l.#x(this);return}this.#f.clear(),this.#c.clear();for(let f of this.#l)f(this);this.#l.clear(),Ci=this,Gf(i),Gf(n),Ci=null,this.#a?.resolve();var a=be;if(this.#s===0&&(this.#r.length===0||a!==null)&&(this.#m(),gt&&(this.#_(),be=a)),this.#r.length>0)if(a!==null){let f=a;f.#r.push(...this.#r.filter(u=>!f.#r.includes(u)))}else a=this;a!==null&&a.#v()}#w(e,n,i){e.f^=1024;for(var r=e.first;r!==null;){var o=r.f,l=(o&96)!==0,a=l&&(o&1024)!==0,f=a||(o&8192)!==0||this.#u.has(r);if(!f&&r.fn!==null){l?r.f^=1024:(o&4)!==0?n.push(r):gt&&(o&16777224)!==0?i.push(r):Fi(r)&&((o&16)!==0&&this.#c.add(r),ii(r));var u=r.first;if(u!==null){r=u;continue}}for(;r!==null;){var d=r.next;if(d!==null){r=d;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[n,[,i]]of this.current)if(e.current.has(n)&&!i)return e}e=e.#t}return null}#x(e){for(let[i,r]of e.current)!this.previous.has(i)&&e.previous.has(i)&&this.previous.set(i,e.previous.get(i)),this.current.set(i,r);for(let[i,r]of e.async_deriveds){let o=this.async_deriveds.get(i);o&&r.promise.then(o.resolve).catch(o.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#f,e.#c);let n=i=>{var r=i.reactions;if(r!==null&&!((i.f&2)!==0&&(i.f&6144)===0))for(let a of r){var o=a.f;if((o&2)!==0)n(a);else{var l=a;o&4194320&&!this.async_deriveds.has(l)&&(this.#c.delete(l),He(l,2048),this.schedule(l))}}};for(let i of this.current.keys())n(i);this.oncommit(()=>e.discard()),e.#m(),be=this,this.#v()}#p(e){for(var n=0;n<e.length;n+=1)ys(e[n],this.#f,this.#c)}capture(e,n,i=!1){e.v!==We&&!this.previous.has(e)&&this.previous.set(e,e.v),(e.f&8388608)===0&&(this.current.set(e,[n,i]),Nt?.set(e,n)),this.is_fork||(e.v=n)}activate(){be=this}deactivate(){be=null,Nt=null}flush(){try{R&&Ga.clear(),za=!0,be=this,this.#v()}finally{if(zf=0,Ya=null,ar=null,Bo=null,za=!1,be=null,Nt=null,xi.clear(),R)for(let e of Ga)e.updated=null}}discard(){for(let e of this.#o)e(this);this.#o.clear();for(let e of this.async_deriveds.values())e.reject(Ur);this.#m(),this.#a?.resolve()}register_created_effect(e){this.#h.push(e)}#_(){for(let c=Ss;c!==null;c=c.#n){var e=c.id<this.id,n=[];for(let[p,[m,g]]of this.current){if(c.current.has(p)){var i=c.current.get(p)[0];if(e&&m!==i)c.current.set(p,[m,g]);else continue}n.push(p)}if(e)for(let[p,m]of this.async_deriveds){let g=c.async_deriveds.get(p);g&&m.promise.then(g.resolve).catch(g.reject)}var r=[...c.current.keys()].filter(p=>!c.current.get(p)[1]);if(!(!c.#e||r.length===0)){var o=r.filter(p=>!this.current.has(p));if(o.length===0)e&&c.discard();else if(n.length>0){if(R&&!c.#d&&Cf(c.#r.length===0,"Batch has scheduled roots"),e)for(let p of this.#g)c.unskip_effect(p,m=>{(m.f&4194320)!==0?c.schedule(m):c.#p([m])});c.activate();var l=new Set,a=new Map;for(var f of n)Yf(f,o,l,a);a=new Map;var u=[...c.current].filter(([p,m])=>{let g=this.current.get(p);return g?g[0]!==m[0]||g[1]!==m[1]:!0}).map(([p])=>p);if(u.length>0)for(let p of this.#h)(p.f&155648)===0&&qa(p,u,a)&&((p.f&4194320)!==0?(He(p,2048),c.schedule(p)):c.#f.add(p));if(c.#r.length>0&&!c.#d){c.apply();for(var d of c.#r)c.#w(d,[],[]);c.#r=[]}c.deactivate()}}}}increment(e,n){if(this.#s+=1,e){let i=this.#i.get(n)??0;this.#i.set(n,i+1)}}decrement(e,n){if(this.#s-=1,e){let i=this.#i.get(n)??0;i===1?this.#i.delete(n):this.#i.set(n,i-1)}this.#d||(this.#d=!0,kt(()=>{this.#d=!1,this.linked&&this.flush()}))}transfer_effects(e,n){for(let i of e)this.#f.add(i);for(let i of n)this.#c.add(i);e.clear(),n.clear()}oncommit(e){this.#l.add(e)}ondiscard(e){this.#o.add(e)}settled(){return(this.#a??=cs()).promise}static ensure(){if(be===null){let e=be=new t;!za&&!er&&kt(()=>{e.#e||e.flush()})}return be}apply(){if(!gt||!this.is_fork&&this.#t===null&&this.#n===null){Nt=null;return}Nt=new Map;for(let[n,[i]]of this.current)Nt.set(n,i);for(let n=Ss;n!==null;n=n.#n)if(!(n===this||n.is_fork)){var e=!1;if(n.id<this.id){for(let[i,[,r]]of n.current)if(!r&&this.current.has(i)){e=!0;break}}if(!e)for(let[i,r]of n.previous)Nt.has(i)||Nt.set(i,r)}}schedule(e){if(Ya=e,e.b?.is_pending&&(e.f&16777228)!==0&&(e.f&32768)===0){e.b.defer_effect(e);return}for(var n=e;n.parent!==null;){n=n.parent;var i=n.f;if(ar!==null&&n===ae&&(gt||(me===null||(me.f&2)===0)&&!Hf))return;if((i&96)!==0){if((i&1024)===0)return;n.f^=1024}}this.#r.push(n)}#m(){if(this.linked){var e=this.#t,n=this.#n;e===null?Ss=n:e.#n=n,n===null?zr=e:n.#t=e,this.linked=!1}}};function Gr(t){var e=er;er=!0;try{var n;for(t&&(be!==null&&!be.is_fork&&be.flush(),n=t());;){if(Af(),be===null)return n;be.flush()}}finally{er=e}}function Vp(){if(R){var t=new Map;for(let n of be.current.keys())for(let[i,r]of n.updated??[]){var e=t.get(i);e||(e={error:r.error,count:0},t.set(i,e)),e.count+=r.count}for(let n of t.values())n.error&&console.error(n.error)}try{cf()}catch(n){R&&jt(n,"stack",{value:""}),Rn(n,Ya)}}var xn=null;function Gf(t){var e=t.length;if(e!==0){for(var n=0;n<e;){var i=t[n++];if((i.f&24576)===0&&Fi(i)&&(xn=new Set,ii(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&Ka(i),xn?.size>0)){xi.clear();for(let r of xn){if((r.f&24576)!==0)continue;let o=[r],l=r.parent;for(;l!==null;)xn.has(l)&&(xn.delete(l),o.push(l)),l=l.parent;for(let a=o.length-1;a>=0;a--){let f=o[a];(f.f&24576)===0&&ii(f)}}xn.clear()}}xn=null}}function Yf(t,e,n,i){if(!n.has(t)&&(n.add(t),t.reactions!==null))for(let r of t.reactions){let o=r.f;(o&2)!==0?Yf(r,e,n,i):(o&4194320)!==0&&(o&2048)===0&&qa(r,e,i)&&(He(r,2048),Po(r))}}function qa(t,e,n){let i=n.get(t);if(i!==void 0)return i;if(t.deps!==null)for(let r of t.deps){if(Ni.call(e,r))return!0;if((r.f&2)!==0&&qa(r,e,n))return n.set(r,!0),!0}return n.set(t,!1),!1}function Po(t){be.schedule(t)}function qf(t,e){if(!((t.f&32)!==0&&(t.f&1024)!==0)){(t.f&2048)!==0?e.d.push(t):(t.f&4096)!==0&&e.m.push(t),He(t,1024);for(var n=t.first;n!==null;)qf(n,e),n=n.next}}function Kf(t){He(t,1024);for(var e=t.first;e!==null;)Kf(e),e=e.next}var or=new Set,xi=new Map;function Es(t){or=t}var Za=!1;function Xf(){Za=!0}function Gt(t,e){var n={f:0,v:t,reactions:null,equals:gs,rv:0,wv:0};return R&&Fn&&(n.created=e??Dn("created at"),n.updated=null,n.set_during_effect=!1,n.trace=null),n}function ce(t,e){let n=Gt(t,e);return ks(n),n}function tr(t,e=!1,n=!0){let i=Gt(t);return e||(i.equals=vs),vi&&n&&Ee!==null&&Ee.l!==null&&(Ee.l.s??=[]).push(i),i}function oe(t,e,n=!1){me!==null&&(!Jt||(me.f&131072)!==0)&&ei()&&(me.f&4325394)!==0&&(On===null||!On.has(t))&&bf();let i=n?Le(e):e;return R&&bs(i,t.label),Hn(t,i,Bo)}function Hn(t,e,n=null){if(!t.equals(e)){xi.set(t,wn?e:t.v);var i=hn.ensure();if(i.capture(t,e),R){if(Fn||ae!==null){t.updated??=new Map;let r=(t.updated.get("")?.count??0)+1;if(t.updated.set("",{error:null,count:r}),Fn||r>5){let o=Dn("updated at");if(o!==null){let l=t.updated.get(o.stack);l||(l={error:o,count:0},t.updated.set(o.stack,l)),l.count++}}}ae!==null&&(t.set_during_effect=!0)}if((t.f&2)!==0){let r=t;(t.f&2048)!==0&&Ho(r),Nt===null&&Or(r)}t.wv=Vr(),Jf(t,2048,n),ei()&&ae!==null&&(ae.f&1024)!==0&&(ae.f&96)===0&&(mn===null?Qf([t]):mn.push(t)),!i.is_fork&&or.size>0&&!Za&&Is()}return e}function Is(){Za=!1;for(let t of or){(t.f&1024)!==0&&He(t,4096);let e;try{e=Fi(t)}catch{e=!0}e&&ii(t)}or.clear()}function rr(t){oe(t,t.v+1)}function Jf(t,e,n){var i=t.reactions;if(i!==null)for(var r=ei(),o=i.length,l=0;l<o;l++){var a=i[l],f=a.f;if(!(!r&&a===ae)){var u=(f&2048)===0;if(u&&He(a,e),(f&131072)!==0)or.add(a);else if((f&2)!==0){var d=a;Nt?.delete(d),(f&65536)===0&&(f&512&&(ae===null||(ae.f&2097152)===0)&&(a.f|=65536),Jf(d,4096,n))}else if(u){var c=a;(f&16)!==0&&xn!==null&&xn.add(c),n!==null?n.push(c):Po(c)}}}}var Gp=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Le(t){if(typeof t!="object"||t===null||Kt in t)return t;let e=Fr(t);if(e!==Ia&&e!==ef)return t;var n=new Map,i=mi(t),r=ce(0),o=R&&Fn?Dn("created at"):null,l=Di,a=c=>{if(Di===l)return c();var p=me,m=Di;wt(null),Xa(l);var g=c();return wt(p),Xa(m),g};i&&(n.set("length",ce(t.length,o)),R&&(t=qp(t)));var f="";let u=!1;function d(c){if(!u){u=!0,f=c,Wt(r,`${f} version`);for(let[p,m]of n)Wt(m,dr(f,p));u=!1}}return new Proxy(t,{defineProperty(c,p,m){(!("value"in m)||m.configurable===!1||m.enumerable===!1||m.writable===!1)&&vf();var g=n.get(p);return g===void 0?a(()=>{var $=ce(m.value,o);return n.set(p,$),R&&typeof p=="string"&&Wt($,dr(f,p)),$}):oe(g,m.value,!0),!0},deleteProperty(c,p){var m=n.get(p);if(m===void 0){if(p in c){let g=a(()=>ce(We,o));n.set(p,g),rr(r),R&&Wt(g,dr(f,p))}}else oe(m,We),rr(r);return!0},get(c,p,m){if(p===Kt)return t;if(R&&p===ps)return d;var g=n.get(p),$=p in c;if(g===void 0&&(!$||cn(c,p)?.writable)&&(g=a(()=>{var _=Le($?c[p]:We),L=ce(_,o);return R&&Wt(L,dr(f,p)),L}),n.set(p,g)),g!==void 0){var w=s(g);return w===We?void 0:w}return Reflect.get(c,p,m)},getOwnPropertyDescriptor(c,p){var m=Reflect.getOwnPropertyDescriptor(c,p);if(m&&"value"in m){var g=n.get(p);g&&(m.value=s(g))}else if(m===void 0){var $=n.get(p),w=$?.v;if($!==void 0&&w!==We)return{enumerable:!0,configurable:!0,value:w,writable:!0}}return m},has(c,p){if(p===Kt)return!0;var m=n.get(p),g=m!==void 0&&m.v!==We||Reflect.has(c,p);if(m!==void 0||ae!==null&&(!g||cn(c,p)?.writable)){m===void 0&&(m=a(()=>{var w=g?Le(c[p]):We,_=ce(w,o);return R&&Wt(_,dr(f,p)),_}),n.set(p,m));var $=s(m);if($===We)return!1}return g},set(c,p,m,g){var $=n.get(p),w=p in c;if(i&&p==="length")for(var _=m;_<$.v;_+=1){var L=n.get(_+"");L!==void 0?oe(L,We):_ in c&&(L=a(()=>ce(We,o)),n.set(_+"",L),R&&Wt(L,dr(f,_)))}if($===void 0)(!w||cn(c,p)?.writable)&&($=a(()=>ce(void 0,o)),R&&Wt($,dr(f,p)),oe($,Le(m)),n.set(p,$));else{w=$.v!==We;var x=a(()=>Le(m));oe($,x)}var I=Reflect.getOwnPropertyDescriptor(c,p);if(I?.set&&I.set.call(g,m),!w){if(i&&typeof p=="string"){var S=n.get("length"),y=Number(p);Number.isInteger(y)&&y>=S.v&&oe(S,y+1)}rr(r)}return!0},ownKeys(c){s(r);var p=Reflect.ownKeys(c).filter($=>{var w=n.get($);return w===void 0||w.v!==We});for(var[m,g]of n)g.v!==We&&!(m in c)&&p.push(m);return p},setPrototypeOf(){_f()}})}function dr(t,e){return typeof e=="symbol"?`${t}[Symbol(${e.description??""})]`:Gp.test(e)?`${t}.${e}`:/^\d+$/.test(e)?`${t}[${e}]`:`${t}['${e}']`}function Ts(t){try{if(t!==null&&typeof t=="object"&&Kt in t)return t[Kt]}catch{}return t}var Yp=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function qp(t){return new Proxy(t,{get(e,n,i){var r=Reflect.get(e,n,i);return Yp.has(n)?function(...o){Xf();var l=r.apply(this,o);return Is(),l}:r}})}function ec(){let t=Array.prototype,e=Array.__svelte_cleanup;e&&e();let{indexOf:n,lastIndexOf:i,includes:r}=t;t.indexOf=function(o,l){let a=n.call(this,o,l);if(a===-1){for(let f=l??0;f<this.length;f+=1)if(Ts(this[f])===o){ms("array.indexOf(...)");break}}return a},t.lastIndexOf=function(o,l){let a=i.call(this,o,l??this.length-1);if(a===-1){for(let f=0;f<=(l??this.length-1);f+=1)if(Ts(this[f])===o){ms("array.lastIndexOf(...)");break}}return a},t.includes=function(o,l){let a=r.call(this,o,l);if(!a){for(let f=0;f<this.length;f+=1)if(Ts(this[f])===o){ms("array.includes(...)");break}}return a},Array.__svelte_cleanup=()=>{t.indexOf=n,t.lastIndexOf=i,t.includes=r}}var Ja,tc,Ao,nc,ic;function Cs(){if(Ja===void 0){Ja=window,tc=document,Ao=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;nc=cn(e,"firstChild").get,ic=cn(e,"nextSibling").get,Ta(t)&&(t[So]=void 0,t[hs]=null,t[No]=void 0,t.__e=void 0),Ta(n)&&(n[Io]=void 0),R&&(t.__svelte_meta=null,ec())}}function yt(t=""){return document.createTextNode(t)}function Ge(t){return nc.call(t)}function Lt(t){return ic.call(t)}function C(t,e){if(!le)return Ge(t);var n=Ge(_e);if(n===null)n=_e.appendChild(yt());else if(e&&n.nodeType!==Dr){var i=yt();return n?.before(i),Me(i),i}return e&&Ds(n),Me(n),n}function ne(t,e=!1){if(!le){var n=Ge(t);return n instanceof Comment&&n.data===""?Lt(n):n}if(e){if(_e?.nodeType!==Dr){var i=yt();return _e?.before(i),Me(i),i}Ds(_e)}return _e}function X(t,e=1,n=!1){let i=le?_e:t;for(var r;e--;)r=i,i=Lt(i);if(!le)return i;if(n){if(i?.nodeType!==Dr){var o=yt();return i===null?r?.after(o):i.before(o),Me(o),o}Ds(i)}return Me(i),i}function Mo(t){t.textContent=""}function Fs(){if(!gt||xn!==null)return!1;var t=ae.f;return(t&32768)!==0}function ri(t,e,n){return e==null||e===ds?n?document.createElement(t,{is:n}):document.createElement(t):n?document.createElementNS(e,t,{is:n}):document.createElementNS(e,t)}function Ds(t){if(t.nodeValue.length<65536)return;let e=t.nextSibling;for(;e!==null&&e.nodeType===Dr;)e.remove(),t.nodeValue+=e.nodeValue,e=t.nextSibling}function oc(t){ae===null&&(me===null&&ff(t),df()),wn&&lf(t)}function Zp(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function Bn(t,e){var n=ae;if(R)for(;n!==null&&(n.f&131072)!==0;)n=n.parent;n!==null&&(n.f&8192)!==0&&(t|=8192);var i={ctx:Ee,deps:null,nodes:null,f:t|2048|512,first:null,fn:e,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};R&&(i.component_function=pn),be?.register_created_effect(i);var r=i;if((t&4)!==0)ar!==null?ar.push(i):hn.ensure().schedule(i);else if(e!==null){try{ii(i)}catch(l){throw tt(i),l}r.deps===null&&r.teardown===null&&r.nodes===null&&r.first===r.last&&(r.f&524288)===0&&(r=r.first,(t&16)!==0&&(t&65536)!==0&&r!==null&&(r.f|=65536))}if(r!==null&&(r.parent=n,n!==null&&Zp(r,n),me!==null&&(me.f&2)!==0&&(t&64)===0)){var o=me;(o.effects??=[]).push(r)}return i}function Ti(){return me!==null&&!Jt}function Vt(t){let e=Bn(8,null);return He(e,1024),e.teardown=t,e}function ye(t){oc("$effect"),R&&jt(t,"name",{value:"$effect"});var e=ae.f,n=!me&&(e&32)!==0&&Ee!==null&&!Ee.i;if(n){var i=Ee;(i.e??=[]).push(t)}else return Ma(t)}function Ma(t){return Bn(1048580,t)}function el(t){hn.ensure();let e=Bn(524352,t);return()=>{tt(e)}}function sc(t){hn.ensure();let e=Bn(524352,t);return(n={})=>new Promise(i=>{n.outro?ni(e,()=>{tt(e),i(void 0)}):(tt(e),i(void 0))})}function yn(t){return Bn(4,t)}function Vf(t){return Bn(4718592,t)}function Zt(t,e=0){return Bn(8|e,t)}function J(t,e=[],n=[],i=[]){$s(i,e,n,r=>{Bn(8,()=>{t(...r.map(s))})})}function sn(t,e=0){var n=Bn(16|e,t);return R&&(n.dev_stack=An),n}function tl(t,e=0){var n=Bn(16777216|e,t);return R&&(n.dev_stack=An),n}function dt(t){return Bn(524320,t)}function nl(t){var e=t.teardown;if(e!==null){let n=wn,i=me;Qa(!0),wt(null);try{e.call(null)}finally{Qa(n),wt(i)}}}function Oo(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){let r=n.ac;r!==null&&ti(()=>{r.abort(gi)});var i=n.next;(n.f&64)!==0?n.parent=null:tt(n,e),n=i}}function ac(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&32)===0&&tt(e),e=n}}function tt(t,e=!0){var n=!1;(e||(t.f&262144)!==0)&&t.nodes!==null&&t.nodes.end!==null&&(il(t.nodes.start,t.nodes.end),n=!0),t.f|=33554432,Oo(t,e&&!n),sr(t,0);var i=t.nodes&&t.nodes.t;if(i!==null)for(let o of i)o.stop();nl(t),t.f^=33554432,t.f|=16384;var r=t.parent;r!==null&&r.first!==null&&Ka(t),R&&(t.component_function=null),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes=t.ac=t.b=null}function il(t,e){for(;t!==null;){var n=t===e?null:Lt(t);t.remove(),t=n}}function Ka(t){var e=t.parent,n=t.prev,i=t.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),e!==null&&(e.first===t&&(e.first=i),e.last===t&&(e.last=n))}function ni(t,e,n=!0){var i=[];lc(t,i,!0);var r=()=>{n&&tt(t),e&&e()},o=i.length;if(o>0){var l=()=>--o||r();for(var a of i)a.out(l)}else r()}function lc(t,e,n){if((t.f&8192)===0){t.f^=8192;var i=t.nodes&&t.nodes.t;if(i!==null)for(let a of i)(a.is_global||n)&&e.push(a);for(var r=t.first;r!==null;){var o=r.next;if((r.f&64)===0){var l=(r.f&65536)!==0||(r.f&32)!==0&&(t.f&16)!==0;lc(r,e,l?n:!1)}r=o}}}function qr(t){dc(t,!0)}function dc(t,e){if((t.f&8192)!==0){t.f^=8192,(t.f&1024)===0&&(He(t,2048),hn.ensure().schedule(t));for(var n=t.first;n!==null;){var i=n.next,r=(n.f&65536)!==0||(n.f&32)!==0;dc(n,r?e:!1),n=i}var o=t.nodes&&t.nodes.t;if(o!==null)for(let l of o)(l.is_global||e)&&l.in()}}function Br(t,e){if(t.nodes)for(var n=t.nodes.start,i=t.nodes.end;n!==null;){var r=n===i?null:Lt(n);e.append(n),n=r}}var fc=null;var As=!1,wn=!1;function Qa(t){wn=t}var me=null,Jt=!1;function wt(t){me=t}var ae=null;function xt(t){ae=t}var On=null;function ks(t){me!==null&&(!gt||(me.f&2)!==0)&&(On??=new Set).add(t)}var St=null,Xt=0,mn=null;function Qf(t){mn=t}var cc=1,fr=0,Di=fr;function Xa(t){Di=t}function Vr(){return++cc}function Fi(t){var e=t.f;if((e&2048)!==0)return!0;if(e&2&&(t.f&=-65537),(e&4096)!==0){for(var n=t.deps,i=n.length,r=0;r<i;r++){var o=n[r];if(Fi(o)&&Ua(o),o.wv>t.wv)return!0}(e&512)!==0&&Nt===null&&He(t,1024)}return!1}function uc(t,e,n=!0){var i=t.reactions;if(i!==null&&!(!gt&&On!==null&&On.has(t)))for(var r=0;r<i.length;r++){var o=i[r];(o.f&2)!==0?uc(o,e,!1):e===o&&(n?He(o,2048):(o.f&1024)!==0&&He(o,4096),Po(o))}}function Ls(t){var e=St,n=Xt,i=mn,r=me,o=On,l=Ee,a=Jt,f=Di,u=t.f;St=null,Xt=0,mn=null,me=(u&96)===0?t:null,On=null,_i(t.ctx),Jt=!1,Di=++fr,t.ac!==null&&(ti(()=>{t.ac.abort(gi)}),t.ac=null);try{t.f|=2097152;var d=t.fn,c=d();t.f|=32768;var p=t.deps,m=be?.is_fork;if(St!==null){var g;if(m||sr(t,Xt),p!==null&&Xt>0)for(p.length=Xt+St.length,g=0;g<St.length;g++)p[Xt+g]=St[g];else t.deps=p=St;if(Ti()&&(t.f&512)!==0)for(g=Xt;g<p.length;g++)(p[g].reactions??=[]).push(t)}else!m&&p!==null&&Xt<p.length&&(sr(t,Xt),p.length=Xt);if(ei()&&mn!==null&&!Jt&&p!==null&&(t.f&6146)===0)for(g=0;g<mn.length;g++)uc(mn[g],t);if(r!==null&&r!==t){if(fr++,r.deps!==null)for(let $=0;$<n;$+=1)r.deps[$].rv=fr;if(e!==null)for(let $ of e)$.rv=fr;mn!==null&&(i===null?i=mn:i.push(...mn))}return(t.f&8388608)!==0&&(t.f^=8388608),c}catch($){return xs($)}finally{t.f^=2097152,St=e,Xt=n,mn=i,me=r,On=o,_i(l),Jt=a,Di=f}}function Xp(t,e){let n=e.reactions;if(n!==null){var i=Qd.call(n,t);if(i!==-1){var r=n.length-1;r===0?n=e.reactions=null:(n[i]=n[r],n.pop())}}if(n===null&&(e.f&2)!==0&&(St===null||!Ni.call(St,e))){var o=e;(o.f&512)!==0&&(o.f^=512,o.f&=-65537),o.v!==We&&Or(o),o.ac!==null&&ti(()=>{o.ac.abort(gi),o.ac=null,He(o,2048)}),Uf(o),sr(o,0)}}function sr(t,e){var n=t.deps;if(n!==null)for(var i=e;i<n.length;i++)Xp(t,n[i])}function ii(t){var e=t.f;if((e&16384)===0){He(t,1024);var n=ae,i=As;if(ae=t,As=(e&96)===0,R){var r=pn;ws(t.component_function);var o=An;Hr(t.dev_stack??An)}try{(e&16777232)!==0?ac(t):Oo(t),nl(t);var l=Ls(t);if(t.teardown=typeof l=="function"?l:null,t.wv=cc,R&&Fn&&(t.f&2048)!==0&&t.deps!==null)for(var a of t.deps)a.set_during_effect&&(a.wv=Vr(),a.set_during_effect=!1)}finally{As=i,ae=n,R&&(ws(r),Hr(o))}}}function s(t){var e=t.f,n=(e&2)!==0;if(fc?.add(t),me!==null&&!Jt){var i=ae!==null&&(ae.f&16384)!==0;if(!i&&(On===null||!On.has(t))){var r=me.deps;if((me.f&2097152)!==0)t.rv<fr&&(t.rv=fr,St===null&&r!==null&&r[Xt]===t?Xt++:St===null?St=[t]:St.push(t));else{me.deps??=[],Ni.call(me.deps,t)||me.deps.push(t);var o=t.reactions;o===null?t.reactions=[me]:Ni.call(o,me)||o.push(me)}}}if(R){if(!Jt&&an&&be===null&&Ci===null&&!an.warned&&(an.effect.f&2097152)===0&&!an.effect_deps.has(t)){an.warned=!0,xf(t.label);var l=Dn("traced at");l&&console.warn(l)}if(Ro.delete(t),Fn&&!Jt&&Fo!==null&&me!==null&&Fo.reaction===me){if(t.trace)t.trace();else if(l=Dn("traced at"),l){var a=Fo.entries.get(t);a===void 0&&(a={traces:[]},Fo.entries.set(t,a));var f=a.traces[a.traces.length-1];l.stack!==f?.stack&&a.traces.push(l)}}}if(wn&&xi.has(t))return xi.get(t);if(n){var u=t;if(wn){var d=u.v;return((u.f&1024)===0&&u.reactions!==null||hc(u))&&(d=Ho(u)),xi.set(u,d),d}var c=(u.f&512)===0&&!Jt&&me!==null&&(As||(me.f&512)!==0),p=(u.f&32768)===0;Fi(u)&&(c&&(u.f|=512),Ua(u)),c&&!p&&(Va(u),pc(u))}if(Nt?.has(t))return Nt.get(t);if((t.f&8388608)!==0)throw t.v;return t.v}function pc(t){if(t.f|=512,t.deps!==null)for(let e of t.deps)(e.reactions??=[]).push(t),(e.f&2)!==0&&(e.f&512)===0&&(Va(e),pc(e))}function hc(t){if(t.v===We)return!0;if(t.deps===null)return!1;for(let e of t.deps)if(xi.has(e)||(e.f&2)!==0&&hc(e))return!0;return!1}function Qe(t){var e=Jt;try{return Jt=!0,t()}finally{Jt=e}}var jo=Symbol("events"),rl=new Set,Ms=new Set;function we(t,e,n){(e[jo]??={})[t]=n}function rt(t){for(var e=0;e<t.length;e++)rl.add(t[e]);for(var n of Ms)n(t)}var mc=null;function ol(t){var e=this,n=e.ownerDocument,i=t.type,r=t.composedPath?.()||[],o=r[0]||t.target;mc=t;var l=0,a=mc===t&&t[jo];if(a){var f=r.indexOf(a);if(f!==-1&&(e===document||e===window)){t[jo]=e;return}var u=r.indexOf(e);if(u===-1)return;f<=u&&(l=f)}if(o=r[l]||t.target,o!==e){jt(t,"currentTarget",{configurable:!0,get(){return o||n}});var d=me,c=ae;wt(null),xt(null);try{for(var p,m=[];o!==null&&o!==e;){try{var g=o[jo]?.[i];g!=null&&(!o.disabled||t.target===o)&&g.call(o,t)}catch($){p?m.push($):p=$}if(t.cancelBubble)break;l++,o=l<r.length?r[l]:null}if(p){for(let $ of m)queueMicrotask(()=>{throw $});throw p}}finally{t[jo]=e,delete t.currentTarget,wt(d),xt(c)}}}var Jp=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:t=>t});function gc(t){return Jp?.createHTML(t)??t}function Rs(t){var e=ri("template");return e.innerHTML=gc(t.replaceAll("<!>","<!---->")),e.content}function At(t,e){var n=ae;n.nodes===null&&(n.nodes={start:t,end:e,a:null,t:null})}function B(t,e){var n=(e&1)!==0,i=(e&2)!==0,r,o=!t.startsWith("<!>");return()=>{if(le)return At(_e,null),_e;r===void 0&&(r=Rs(o?t:"<!>"+t),n||(r=Ge(r)));var l=i||Ao?document.importNode(r,!0):r.cloneNode(!0);if(n){var a=Ge(l),f=l.lastChild;At(a,f)}else At(l,l);return l}}function nh(t,e,n="svg"){var i=!t.startsWith("<!>"),r=(e&1)!==0,o=`<${n}>${i?t:"<!>"+t}</${n}>`,l;return()=>{if(le)return At(_e,null),_e;if(!l){var a=Rs(o),f=Ge(a);if(r)for(l=document.createDocumentFragment();Ge(f);)l.appendChild(Ge(f));else l=Ge(f)}var u=l.cloneNode(!0);if(r){var d=Ge(u),c=u.lastChild;At(d,c)}else At(u,u);return u}}function yi(t,e){return nh(t,e,"svg")}function pe(){if(le)return At(_e,null),_e;var t=document.createDocumentFragment(),e=document.createComment(""),n=yt();return t.append(e,n),At(e,n),t}function F(t,e){if(le){var n=ae;((n.f&32768)===0||n.nodes.end===null)&&(n.nodes.end=_e),Et();return}t!==null&&t.before(e)}var ih=/\r/g;function _c(t){t=t.replace(ih,"");let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return(e>>>0).toString(36)}var rh=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var Sy=[...rh,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var oh=["touchstart","touchmove"];function bc(t){return oh.includes(t)}var sh=["$state","$state.raw","$derived","$derived.by"],Ny=[...sh,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];function Hs(t){return t?.replace(/\//g,"/\u200B")}var sl=!0;function Ce(t,e){var n=e==null?"":typeof e=="object"?`${e}`:e;n!==(t[Io]??=t.nodeValue)&&(t[Io]=n,t.nodeValue=`${n}`)}function Kr(t,e){return wc(t,e)}function ll(t,e){Cs(),e.intro=e.intro??!1;let n=e.target,i=le,r=_e;try{for(var o=Ge(n);o&&(o.nodeType!==un||o.data!=="[");)o=Lt(o);if(!o)throw Zn;mt(!0),Me(o);let l=wc(t,{...e,anchor:o});return mt(!1),l}catch(l){if(l instanceof Error&&l.message.split(`
`).some(a=>a.startsWith("https://svelte.dev/e/")))throw l;return l!==Zn&&console.warn("Failed to hydrate: ",l),e.recover===!1&&uf(),Cs(),Mo(n),mt(!1),Kr(t,e)}finally{mt(i),Me(r)}}var Os=new Map;function wc(t,{target:e,anchor:n,props:i={},events:r,context:o,intro:l=!0,transformError:a}){Cs();var f=void 0,u=sc(()=>{var d=n??e.appendChild(yt());Oa(d,{pending:()=>{}},m=>{de({});var g=Ee;if(o&&(g.c=o),r&&(i.$$events=r),le&&At(m,null),sl=l,f=t(m,i)||{},sl=!0,le&&(ae.nodes.end=_e,_e===null||_e.nodeType!==un||_e.data!=="]"))throw Ii(),Zn;fe()},a);var c=new Set,p=m=>{for(var g=0;g<m.length;g++){var $=m[g];if(!c.has($)){c.add($);var w=bc($);for(let x of[e,document]){var _=Os.get(x);_===void 0&&(_=new Map,Os.set(x,_));var L=_.get($);L===void 0?(x.addEventListener($,ol,{passive:w}),_.set($,1)):_.set($,L+1)}}}};return p(Cr(rl)),Ms.add(p),()=>{for(var m of c)for(let w of[e,document]){var g=Os.get(w),$=g.get(m);--$==0?(w.removeEventListener(m,ol),g.delete(m),g.size===0&&Os.delete(w)):g.set(m,$)}Ms.delete(p),d!==n&&d.parentNode?.removeChild(d)}});return al.set(f,u),f}var al=new WeakMap;function Wo(t,e){let n=al.get(t);return n?(al.delete(t),n(e)):(R&&(Kt in t?Sf():kf()),Promise.resolve())}var oi=class{anchor;#e=new Map;#t=new Map;#n=new Map;#l=new Set;#o=!0;constructor(e,n=!0){this.anchor=e,this.#o=n}#s=e=>{if(this.#e.has(e)){var n=this.#e.get(e),i=this.#t.get(n);if(i)qr(i),this.#l.delete(n);else{var r=this.#n.get(n);r&&(qr(r.effect),this.#t.set(n,r.effect),this.#n.delete(n),R&&(r.fragment.lastChild[Ca]=this.anchor),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),i=r.effect)}for(let[o,l]of this.#e){if(this.#e.delete(o),o===e)break;let a=this.#n.get(l);a&&(tt(a.effect),this.#n.delete(l))}for(let[o,l]of this.#t){if(o===n||this.#l.has(o))continue;let a=()=>{if(Array.from(this.#e.values()).includes(o)){var u=document.createDocumentFragment();Br(l,u),u.append(yt()),this.#n.set(o,{effect:l,fragment:u})}else tt(l);this.#l.delete(o),this.#t.delete(o)};this.#o||!i?(this.#l.add(o),ni(l,a,!1)):a()}}};#i=e=>{this.#e.delete(e);let n=Array.from(this.#e.values());for(let[i,r]of this.#n)n.includes(i)||(tt(r.effect),this.#n.delete(i))};ensure(e,n){var i=be,r=Fs();if(n&&!this.#t.has(e)&&!this.#n.has(e))if(r){var o=document.createDocumentFragment(),l=yt();o.append(l),this.#n.set(e,{effect:dt(()=>n(l)),fragment:o})}else this.#t.set(e,dt(()=>n(this.anchor)));if(this.#e.set(i,e),r){for(let[a,f]of this.#t)a===e?i.unskip_effect(f):i.skip_effect(f);for(let[a,f]of this.#n)a===e?i.unskip_effect(f.effect):i.skip_effect(f.effect);i.oncommit(this.#s),i.ondiscard(this.#i)}else le&&(this.anchor=_e),this.#s(i)}};function Mt(t,e,...n){var i=new oi(t);sn(()=>{let r=e()??null;R&&r==null&&pf(),i.ensure(r,r&&(o=>r(o,...n)))},65536)}if(R){let t=function(e){if(!(e in globalThis)){let n;Object.defineProperty(globalThis,e,{configurable:!0,get:()=>{if(n!==void 0)return n;mf(e)},set:i=>{n=i}})}};t("$state"),t("$effect"),t("$derived"),t("$inspect"),t("$props"),t("$bindable")}function dh(t){Ee===null&&Ar("onMount"),vi&&Ee.l!==null?fh(Ee).m.push(t):ye(()=>{let e=Qe(t);if(typeof e=="function")return e})}function Ve(t){Ee===null&&Ar("onDestroy"),dh(()=>()=>Qe(t))}function fh(t){var e=t.l;return e.u??={a:[],b:[],m:[]}}function q(t,e,n=!1){var i;le&&(i=_e,Et());var r=new oi(t),o=n?65536:0;function l(a,f){if(le){var u=Co(i);if(a!==parseInt(u.substring(1))){var d=Qn();Me(d),r.anchor=d,mt(!1),r.ensure(a,f),mt(!0);return}}r.ensure(a,f)}sn(()=>{var a=!1;e((f,u=0)=>{a=!0,l(u,f)}),a||l(-1,null)},o)}function ai(t,e){return e}function _h(t,e,n){for(var i=[],r=e.length,o,l=e.length,a=0;a<r;a++){let c=e[a];ni(c,()=>{if(o){if(o.pending.delete(c),o.done.add(c),o.pending.size===0){var p=t.outrogroups;dl(t,Cr(o.done)),p.delete(o),p.size===0&&(t.outrogroups=null)}}else l-=1},!1)}if(l===0){var f=i.length===0&&n!==null;if(f){var u=n,d=u.parentNode;Mo(d),d.append(u),t.items.clear()}dl(t,e,!f)}else o={pending:new Set(e),done:new Set},(t.outrogroups??=new Set).add(o)}function dl(t,e,n=!0){var i;if(t.pending.size>0){i=new Set;for(let l of t.pending.values())for(let a of l)i.add(t.items.get(a).e)}for(var r=0;r<e.length;r++){var o=e[r];if(i?.has(o)){o.f|=33554432;let l=document.createDocumentFragment();Br(o,l)}else tt(e[r],n)}}var $c;function li(t,e,n,i,r,o=null){var l=t,a=new Map,f=(e&4)!==0;if(f){var u=t;l=le?Me(Ge(u)):u.appendChild(yt())}le&&Et();var d=null,c=Wr(()=>{var x=n();return mi(x)?x:x==null?[]:Cr(x)});R&&Wt(c,"{#each ...}");var p,m=new Map,g=!0;function $(x){(L.effect.f&16384)===0&&(L.pending.delete(x),L.fallback=d,bh(L,p,l,e,i),d!==null&&(p.length===0?(d.f&33554432)===0?qr(d):(d.f^=33554432,Vo(d,null,l)):ni(d,()=>{d=null})))}function w(x){L.pending.delete(x)}var _=sn(()=>{p=s(c);var x=p.length;let I=!1;if(le){var S=Co(l)==="[!";S!==(x===0)&&(l=Qn(),Me(l),mt(!1),I=!0)}for(var y=new Set,h=be,b=Fs(),E=0;E<x;E+=1){le&&_e.nodeType===un&&_e.data==="]"&&(l=_e,I=!0,mt(!1));var D=p[E],M=i(D,E);if(R){var W=i(D,E);M!==W&&af(String(E),String(M),String(W))}var P=g?null:a.get(M);P?(P.v&&Hn(P.v,D),P.i&&Hn(P.i,E),b&&h.unskip_effect(P.e)):(P=wh(a,g?l:$c??=yt(),D,M,E,r,e,n),g||(P.e.f|=33554432),a.set(M,P)),y.add(M)}if(x===0&&o&&!d&&(g?d=dt(()=>o(l)):(d=dt(()=>o($c??=yt())),d.f|=33554432)),x>y.size&&(R?xh(p,i):Da("","","")),le&&x>0&&Me(Qn()),!g)if(m.set(h,y),b){for(let[K,ee]of a)y.has(K)||h.skip_effect(ee.e);h.oncommit($),h.ondiscard(w)}else $(h);I&&mt(!0),s(c)}),L={effect:_,flags:e,items:a,pending:m,outrogroups:null,fallback:d};g=!1,le&&(l=_e)}function Uo(t){for(;t!==null&&(t.f&32)===0;)t=t.next;return t}function bh(t,e,n,i,r){var o=(i&8)!==0,l=e.length,a=t.items,f=Uo(t.effect.first),u,d=null,c,p=[],m=[],g,$,w,_;if(o)for(_=0;_<l;_+=1)g=e[_],$=r(g,_),w=a.get($).e,(w.f&33554432)===0&&(w.nodes?.a?.measure(),(c??=new Set).add(w));for(_=0;_<l;_+=1){if(g=e[_],$=r(g,_),w=a.get($).e,t.outrogroups!==null)for(let D of t.outrogroups)D.pending.delete(w),D.done.delete(w);if((w.f&8192)!==0&&(qr(w),o&&(w.nodes?.a?.unfix(),(c??=new Set).delete(w))),(w.f&33554432)!==0)if(w.f^=33554432,w===f)Vo(w,null,n);else{var L=d?d.next:f;w===t.effect.last&&(t.effect.last=w.prev),w.prev&&(w.prev.next=w.next),w.next&&(w.next.prev=w.prev),Ai(t,d,w),Ai(t,w,L),Vo(w,L,n),d=w,p=[],m=[],f=Uo(d.next);continue}if(w!==f){if(u!==void 0&&u.has(w)){if(p.length<m.length){var x=m[0],I;d=x.prev;var S=p[0],y=p[p.length-1];for(I=0;I<p.length;I+=1)Vo(p[I],x,n);for(I=0;I<m.length;I+=1)u.delete(m[I]);Ai(t,S.prev,y.next),Ai(t,d,S),Ai(t,y,x),f=x,d=y,_-=1,p=[],m=[]}else u.delete(w),Vo(w,f,n),Ai(t,w.prev,w.next),Ai(t,w,d===null?t.effect.first:d.next),Ai(t,d,w),d=w;continue}for(p=[],m=[];f!==null&&f!==w;)(u??=new Set).add(f),m.push(f),f=Uo(f.next);if(f===null)continue}(w.f&33554432)===0&&p.push(w),d=w,f=Uo(w.next)}if(t.outrogroups!==null){for(let D of t.outrogroups)D.pending.size===0&&(dl(t,Cr(D.done)),t.outrogroups?.delete(D));t.outrogroups.size===0&&(t.outrogroups=null)}if(f!==null||u!==void 0){var h=[];if(u!==void 0)for(w of u)(w.f&8192)===0&&h.push(w);for(;f!==null;)(f.f&8192)===0&&f!==t.fallback&&h.push(f),f=Uo(f.next);var b=h.length;if(b>0){var E=(i&4)!==0&&l===0?n:null;if(o){for(_=0;_<b;_+=1)h[_].nodes?.a?.measure();for(_=0;_<b;_+=1)h[_].nodes?.a?.fix()}_h(t,h,E)}}o&&kt(()=>{if(c!==void 0)for(w of c)w.nodes?.a?.apply()})}function wh(t,e,n,i,r,o,l,a){var f=(l&1)!==0?(l&16)===0?tr(n,!1,!1):Gt(n):null,u=(l&2)!==0?Gt(r):null;return R&&f&&(f.trace=()=>{a()[u?.v??r]}),{v:f,i:u,e:dt(()=>(o(e,f??n,u??r,a),()=>{t.delete(i)}))}}function Vo(t,e,n){if(t.nodes)for(var i=t.nodes.start,r=t.nodes.end,o=e&&(e.f&33554432)===0?e.nodes.start:n;i!==null;){var l=Lt(i);if(o.before(i),i===r)return;i=l}}function Ai(t,e,n){e===null?t.effect.first=n:e.next=n,n===null?t.effect.last=e:n.prev=e}function xh(t,e){let n=new Map,i=t.length;for(let r=0;r<i;r++){let o=e(t[r],r);if(n.has(o)){let l=String(n.get(o)),a=String(r),f=String(o);f.startsWith("[object ")&&(f=null),Da(l,a,f)}n.set(o,r)}}function yh(t,e,n){if(!e||e===_c(String(n??"")))return;let i,r=t.__svelte_meta?.loc;r?i=`near ${r.file}:${r.line}:${r.column}`:pn?.[tn]&&(i=`in ${pn[tn]}`),Lf(Hs(i))}function cr(t,e,n=!1,i=!1,r=!1,o=!1){var l=t,a="";if(n){var f=t;le&&(l=Me(Ge(f)))}J(()=>{var u=ae;if(a===(a=e()??"")){le&&Et();return}if(n&&!le){u.nodes=null,f.innerHTML=a,a!==""&&At(Ge(f),f.lastChild);return}if(u.nodes!==null&&(il(u.nodes.start,u.nodes.end),u.nodes=null),a!==""){if(le){for(var d=_e.data,c=Et(),p=c;c!==null&&(c.nodeType!==un||c.data!=="");)p=c,c=Lt(c);if(c===null)throw Ii(),Zn;R&&!o&&yh(c.parentNode,d,a),At(_e,p),l=Me(c);return}var m=i?ko:r?ka:void 0,g=ri(i?"svg":r?"math":"template",m);g.innerHTML=a;var $=i||r?g:g.content;if(At(Ge($),$.lastChild),i||r)for(;Ge($);)l.before(Ge($));else l.before($)}})}function lt(t,e){var n=void 0,i;tl(()=>{n!==(n=e())&&(i&&(tt(i),i=null),n&&(i=dt(()=>{yn(()=>n(t))})))})}function kc(t){var e,n,i="";if(typeof t=="string"||typeof t=="number")i+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=kc(t[e]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}function Sc(){for(var t,e,n=0,i="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=kc(t))&&(i&&(i+=" "),i+=e);return i}function ln(t){return typeof t=="object"?Sc(t):t??""}var Nc=[...` 	
\r\f\xA0\v\uFEFF`];function Tc(t,e,n){var i=t==null?"":""+t;if(e&&(i=i?i+" "+e:e),n){for(var r of Object.keys(n))if(n[r])i=i?i+" "+r:r;else if(i.length)for(var o=r.length,l=0;(l=i.indexOf(r,l))>=0;){var a=l+o;(l===0||Nc.includes(i[l-1]))&&(a===i.length||Nc.includes(i[a]))?i=(l===0?"":i.substring(0,l))+i.substring(a+1):l=a}}return i===""?null:i}function Ic(t,e=!1){var n=e?" !important;":";",i="";for(var r of Object.keys(t)){var o=t[r];o!=null&&o!==""&&(i+=" "+r+": "+o+n)}return i}function fl(t){return t[0]!=="-"||t[1]!=="-"?t.toLowerCase():t}function Cc(t,e){if(e){var n="",i,r;if(Array.isArray(e)?(i=e[0],r=e[1]):i=e,t){t=String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var o=!1,l=0,a=!1,f=[];i&&f.push(...Object.keys(i).map(fl)),r&&f.push(...Object.keys(r).map(fl));var u=0,d=-1;let $=t.length;for(var c=0;c<$;c++){var p=t[c];if(a?p==="/"&&t[c-1]==="*"&&(a=!1):o?o===p&&(o=!1):p==="/"&&t[c+1]==="*"?a=!0:p==='"'||p==="'"?o=p:p==="("?l++:p===")"&&l--,!a&&o===!1&&l===0){if(p===":"&&d===-1)d=c;else if(p===";"||c===$-1){if(d!==-1){var m=fl(t.substring(u,d).trim());if(!f.includes(m)){p!==";"&&c++;var g=t.substring(u,c).trim();n+=" "+g+";"}}u=c+1,d=-1}}}}return i&&(n+=Ic(i)),r&&(n+=Ic(r,!0)),n=n.trim(),n===""?null:n}return t==null?null:String(t)}function Ne(t,e,n,i,r,o){var l=t[So];if(le||l!==n||l===void 0){var a=Tc(n,i,o);(!le||a!==t.getAttribute("class"))&&(a==null?t.removeAttribute("class"):e?t.className=a:t.setAttribute("class",a)),t[So]=n}else if(o&&r!==o)for(var f in o){var u=!!o[f];(r==null||u!==!!r[f])&&t.classList.toggle(f,u)}return o}function cl(t,e={},n,i){for(var r in n){var o=n[r];e[r]!==o&&(n[r]==null?t.style.removeProperty(r):t.style.setProperty(r,o,i))}}function G(t,e,n,i){var r=t[No];if(le||r!==e){var o=Cc(e,i);(!le||o!==t.getAttribute("style"))&&(o==null?t.removeAttribute("style"):t.style.cssText=o),t[No]=e}else i&&(Array.isArray(i)?(cl(t,n?.[0],i[0]),cl(t,n?.[1],i[1],"important")):cl(t,n,i));return i}var Th=Symbol("is custom element"),Ch=Symbol("is html"),Fh=Fa?"link":"LINK";function U(t,e,n,i){var r=Dh(t);if(le&&(r[e]=t.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&t.nodeName===Fh)){i||Mh(t,e,n??"");return}r[e]!==(r[e]=n)&&(e==="loading"&&(t[tf]=n),n==null?t.removeAttribute(e):typeof n!="string"&&Ah(t).includes(e)?t[e]=n:t.setAttribute(e,n))}function Dh(t){return t[hs]??={[Th]:t.nodeName.includes("-"),[Ch]:t.namespaceURI===ds}}var Fc=new Map;function Ah(t){var e=t.getAttribute("is")||t.nodeName,n=Fc.get(e);if(n)return n;Fc.set(e,n=[]);for(var i,r=t,o=Element.prototype;o!==r;){i=Na(r);for(var l in i)i[l].set&&l!=="innerHTML"&&l!=="textContent"&&l!=="innerText"&&n.push(l);r=Fr(r)}return n}function Mh(t,e,n){R&&(e==="srcset"&&Rh(t,n)||ul(t.getAttribute(e)??"",n)||Ef(e,t.outerHTML.replace(t.innerHTML,t.innerHTML&&"..."),String(n)))}function ul(t,e){return t===e?!0:new URL(t,document.baseURI).href===new URL(e,document.baseURI).href}function Dc(t){return t.split(",").map(e=>e.trim().split(" ").filter(Boolean))}function Rh(t,e){var n=Dc(t.srcset),i=Dc(e);return i.length===n.length&&i.every(([r,o],l)=>o===n[l][1]&&(ul(n[l][0],r)||ul(r,n[l][0])))}var Oh={get(t,e){if(!t.exclude.has(e))return t.props[e]},set(t,e){return R&&hf(`${t.name}.${String(e)}`),!1},getOwnPropertyDescriptor(t,e){if(!t.exclude.has(e)&&e in t.props)return{enumerable:!0,configurable:!0,value:t.props[e]}},has(t,e){return t.exclude.has(e)?!1:e in t.props},ownKeys(t){return Reflect.ownKeys(t.props).filter(e=>!t.exclude.has(e))}};function ue(t,e,n){return new Proxy(R?{props:t,exclude:e,name:n}:{props:t,exclude:e},Oh)}function Ac(t){return new hl(t)}var hl=class{#e;#t;constructor(e){var n=new Map,i=(o,l)=>{var a=tr(l,!1,!1);return n.set(o,a),a};let r=new Proxy({...e.props||{},$$events:{}},{get(o,l){return s(n.get(l)??i(l,Reflect.get(o,l)))},has(o,l){return l===us?!0:(s(n.get(l)??i(l,Reflect.get(o,l))),Reflect.has(o,l))},set(o,l,a){return oe(n.get(l)??i(l,a),a),Reflect.set(o,l,a)}});this.#t=(e.hydrate?ll:Kr)(e.component,{target:e.target,anchor:e.anchor,props:r,context:e.context,intro:e.intro??!1,recover:e.recover,transformError:e.transformError}),!gt&&(!e?.props?.$$host||e.sync===!1)&&Gr(),this.#e=r.$$events;for(let o of Object.keys(this.#t))o==="$set"||o==="$destroy"||o==="$on"||jt(this,o,{get(){return this.#t[o]},set(l){this.#t[o]=l},enumerable:!0});this.#t.$set=o=>{Object.assign(r,o)},this.#t.$destroy=()=>{Wo(this.#t)}}$set(e){this.#t.$set(e)}$on(e,n){this.#e[e]=this.#e[e]||[];let i=(...r)=>n.call(this,...r);return this.#e[e].push(i),()=>{this.#e[e]=this.#e[e].filter(r=>r!==i)}}$destroy(){this.#t.$destroy()}};var Gh;typeof HTMLElement=="function"&&(Gh=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(t,e,n){super(),this.$$ctor=t,this.$$s=e,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(t,e,n){if(this.$$l[t]=this.$$l[t]||[],this.$$l[t].push(e),this.$$c){let i=this.$$c.$on(t,e);this.$$l_u.set(e,i)}super.addEventListener(t,e,n)}removeEventListener(t,e,n){if(super.removeEventListener(t,e,n),this.$$c){let i=this.$$l_u.get(e);i&&(i(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let t=function(i){return r=>{let o=ri("slot");i!=="default"&&(o.name=i),F(r,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let e={},n=Yh(this);for(let i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=t(i),e.default=!0):e[i]=t(i));for(let i of this.attributes){let r=this.$$g_p(i.name);r in this.$$d||(this.$$d[r]=ml(r,i.value,this.$$p_d,"toProp"))}for(let i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Ac({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=el(()=>{Zt(()=>{this.$$r=!0;for(let i of Sa(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];let r=ml(i,this.$$d[i],this.$$p_d,"toAttribute");r==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,r)}this.$$r=!1})});for(let i in this.$$l)for(let r of this.$$l[i]){let o=this.$$c.$on(i,r);this.$$l_u.set(r,o)}this.$$l={}}}attributeChangedCallback(t,e,n){this.$$r||(t=this.$$g_p(t),this.$$d[t]=ml(t,n,this.$$p_d,"toProp"),this.$$c?.$set({[t]:this.$$d[t]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(t){return Sa(this.$$p_d).find(e=>this.$$p_d[e].attribute===t||!this.$$p_d[e].attribute&&e.toLowerCase()===t)||t}});function ml(t,e,n,i){let r=n[t]?.type;if(e=r==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(r){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(r){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function Yh(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var nt="--diff-font-size--",Fe="--diff-aside-width--";var di=()=>{let t=ce(!1);return ye(()=>{oe(t,!0)}),()=>s(t)};var Mc=Symbol("fontSize");function Rc(t){qe(Mc,()=>t.diffViewFontSize||14)}function Zr(){return Ye(Mc)}var Hc=Symbol("enableWrap");function Oc(t){qe(Hc,()=>t.diffViewWrap)}function $n(){return Ye(Hc)}var Bc=Symbol("renderWidget");function Pc(t){qe(Bc,()=>t.renderWidgetLine)}function Xr(){return Ye(Bc)}var jc=Symbol("id");function Wc(t){qe(jc,t)}function Ps(){return Ye(jc)}var Uc=Symbol("dom");function Vc(t){qe(Uc,t)}function js(){return Ye(Uc)}var zc=Symbol("extend");function Gc(t){qe(zc,()=>t.extendData)}function Jr(){return Ye(zc)}var Yc=Symbol("widget");function qc(t){qe(Yc,()=>t)}function En(){return Ye(Yc)}var Kc=Symbol("renderExtendLine");function Zc(t){qe(Kc,()=>t.renderExtendLine)}function Qr(){return Ye(Kc)}var Xc=Symbol("onAddWidgetClick");function Jc(t){qe(Xc,()=>t.onAddWidgetClick)}function eo(){return Ye(Xc)}var Qc=Symbol("enableHighlight");function eu(t){qe(Qc,()=>t.diffViewHighlight)}function to(){return Ye(Qc)}var tu=Symbol("enableAddWidget");function nu(t){qe(tu,()=>t.diffViewAddWidget)}function no(){return Ye(tu)}var iu=Symbol("mode");function ru(t){qe(iu,()=>t.diffViewMode||Pt.Split)}function Ws(){return Ye(iu)}var gl=null,qh=(t,e)=>`${t.fontFamily}-${t.fontStyle}-${t.fontSize}-${e}`,Kh=(t,e)=>qh(t,"0".repeat(e.length)),_l=class{#e="";#t={};#n(){return gl=gl||document.createElement("canvas").getContext("2d"),gl}measure(e,n){let i=Kh(n||{},e);if(this.#t[i])return this.#t[i];let r=this.#n();if(n){let l=`${n.fontFamily}-${n.fontStyle}-${n.fontSize}`;this.#e!==l&&(this.#e=l,r.font=`${n.fontStyle||""} ${n.fontSize||""} ${n.fontFamily||""}`)}else r.font="";return r.measureText(e).width}},vl=null,ou=()=>(vl=vl||new _l,vl);var io=({text:t,font:e})=>{let n=k(di()),i=parseInt(e().fontSize||"14"),r=6;r+=i>10?(i-10)*.6:0;let o=ce(r*t().length);return ye(()=>{s(n)&&oe(o,ou().measure(t()||"",e()),!0)}),()=>s(o)};var Ln=()=>{window.getSelection()?.removeAllRanges()},su=(t,e)=>{let n=function(i){i===null||i.target===null||(i.target===t?(e.scrollTop=t.scrollTop,e.scrollLeft=t.scrollLeft):(t.scrollTop=e.scrollTop,t.scrollLeft=e.scrollLeft))};return t.onscroll||(t.onscroll=n),e.onscroll||(e.onscroll=n),()=>{t.onscroll=null,e.onscroll=null}},Us=t=>{if(t){let e=t.getRootNode();return e instanceof ShadowRoot?e:t.ownerDocument}return document},ro=t=>{if(t){if(typeof t.closest=="function")return t.closest('[data-component="git-diff-view"]')?.querySelector?.(".diff-view-wrapper")?.getAttribute?.("id");{let e=t;for(;e;){if(e.getAttribute&&e.getAttribute("data-component")==="git-diff-view")return e.querySelector(".diff-view-wrapper")?.getAttribute("id");e=e.parentElement}}}};var bl="--diff-add-content--",wl="--diff-del-content--",gn="--diff-border--",xl="--diff-add-lineNumber--",yl="--diff-del-lineNumber--",$l="--diff-plain-content--",Vs="--diff-expand-content--",ft="--diff-plain-lineNumber-color--",ur="--diff-expand-lineNumber-color--",El="--diff-plain-lineNumber--",Zh="--diff-expand-lineNumber--",dn="--diff-hunk-content--",Pn="--diff-hunk-content-color--",jn="--diff-hunk-lineNumber--";var zs="--diff-add-widget--",Gs="--diff-add-widget-color--",Qt="--diff-empty-content--",zo=(t,e,n)=>t?`var(${bl})`:e?`var(${wl})`:n?`var(${$l})`:`var(${Vs})`,Go=(t,e,n)=>t?`var(${xl})`:e?`var(${yl})`:n?`var(${El})`:`var(${Zh})`;var Xh=new Set(["$$slots","$$events","$$legacy"]),Jh=B('<div><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Mi(t,e){de(e,!0);let n=ue(e,Xh);var i=Jh(),r=C(i);T(i),J(()=>{U(i,"data-add-widget",O[e.side]),Ne(i,1,"diff-add-widget-wrapper invisible select-none transition-transform hover:scale-110 group-hover:visible"+(e.className?" "+e.className:"")),G(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),G(r,`
			color: var(${Gs});
			background-color: var(${zs});
    `)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),F(t,i),fe()}rt(["mousedown"]);If();var Qh=yi('<svg aria-label="No newline at end of file" role="img" viewBox="0 0 16 16" version="1.1" fill="currentColor"><path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>');function Yo(t){var e=Qh();F(t,e)}var em=new Set(["$$slots","$$events","$$legacy"]),tm=B('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),nm=B('<span class="diff-line-content-raw"><span data-template=""></span><!></span>'),au=B('<span class="diff-line-content-raw"> </span>'),im=B('<span class="diff-line-content-raw"><span data-template=""></span></span>');function qo(t,e){de(e,!0);let n=ue(e,em);e.diffLine?.changes?.hasLineChange?e.diffLine?.plainTemplate&&typeof yo=="function"&&yo({diffLine:e.diffLine,rawLine:e.rawLine,operator:e.operator||"add"}):e.plainLine&&!e.plainLine?.template&&(e.plainLine.template=wa(e.plainLine.value));var r=pe(),o=ne(r);{var l=u=>{var d=pe(),c=ne(d);{var p=g=>{var $=nm(),w=C($);cr(w,()=>e.diffLine.plainTemplate,!0),T(w);var _=X(w);{var L=x=>{var I=tm(),S=C(I);Yo(S,{}),T(I),J(()=>{Ne(I,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),G(I,`
						width: var(${nt});
						height: var(${nt})
					`)}),F(x,I)};q(_,x=>{e.diffLine.changes.newLineSymbol===Tr.NEWLINE&&x(L)})}T($),F(g,$)},m=g=>{var $=au(),w=C($,!0);T($),J(()=>Ce(w,e.rawLine)),F(g,$)};q(c,g=>{e.diffLine?.plainTemplate?g(p):g(m,-1)})}F(u,d)},a=u=>{var d=im(),c=C(d);cr(c,()=>e.plainLine.template,!0),T(c),T(d),F(u,d)},f=u=>{var d=au(),c=C(d,!0);T(d),J(()=>Ce(c,e.rawLine)),F(u,d)};q(o,u=>{e.diffLine?.changes?.hasLineChange?u(l):e.plainLine?.template?u(a,1):u(f,-1)})}F(t,r),fe()}var rm=new Set(["$$slots","$$events","$$legacy"]),om=B('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),sm=B('<span class="diff-line-syntax-raw"><span data-template=""></span><!></span>'),lu=B("<span> </span>"),du=B('<span class="diff-line-syntax-raw"></span>'),am=B('<span class="diff-line-syntax-raw"><span data-template=""></span></span>');function Ll(t,e){de(e,!0);let n=ue(e,rm);e.diffLine?.changes?.hasLineChange?e.syntaxLine&&e.diffLine&&!e.diffLine?.syntaxTemplate&&typeof $o=="function"&&$o({diffFile:e.diffFile,diffLine:e.diffLine,syntaxLine:e.syntaxLine,operator:e.operator||"add"}):e.syntaxLine&&!e.syntaxLine.template&&(e.syntaxLine.template=ba(e.syntaxLine));var r=pe(),o=ne(r);{var l=d=>{qo(d,{get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get operator(){return e.operator},get enableWrap(){return e.enableWrap}})},a=d=>{var c=pe(),p=ne(c);{var m=$=>{var w=sm(),_=C(w);cr(_,()=>e.diffLine.syntaxTemplate,!0),T(_);var L=X(_);{var x=I=>{var S=om(),y=C(S);Yo(y,{}),T(S),J(()=>{Ne(S,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),G(S,`
                width: var(${nt});
                height: var(${nt});
              `)}),F(I,S)};q(L,I=>{e.diffLine.changes.newLineSymbol===Tr.NEWLINE&&I(x)})}T(w),F($,w)},g=$=>{var w=du();li(w,21,()=>e.syntaxLine.nodeList,ai,(_,L)=>{let x=()=>s(L).node,I=()=>s(L).wrapper;var S=lu(),y=C(S,!0);T(S),J(h=>{U(S,"data-start",x().startIndex),U(S,"data-end",x().endIndex),Ne(S,1,h),G(S,I()?.properties?.style),Ce(y,x().value)},[()=>ln(I()?.properties?.className?.join(" "))]),F(_,S)}),T(w),F($,w)};q(p,$=>{e.diffLine?.syntaxTemplate?$(m):$(g,-1)})}F(d,c)},f=d=>{var c=am(),p=C(c);cr(p,()=>e.syntaxLine.template,!0),T(p),T(c),F(d,c)},u=d=>{var c=du();li(c,21,()=>e.syntaxLine.nodeList,ai,(p,m)=>{let g=()=>s(m).node,$=()=>s(m).wrapper;var w=lu(),_=C(w,!0);T(w),J(L=>{U(w,"data-start",g().startIndex),U(w,"data-end",g().endIndex),Ne(w,1,L),G(w,$()?.properties?.style),Ce(_,g().value)},[()=>ln($()?.properties?.className?.join(" "))]),F(p,w)}),T(c),F(d,c)};q(o,d=>{e.syntaxLine?e.diffLine?.changes?.hasLineChange?d(a,1):e.syntaxLine.template?d(f,2):d(u,-1):d(l)})}F(t,r),fe()}var lm=new Set(["$$slots","$$events","$$legacy"]),dm=B('<div class="diff-line-content-item pl-[2.0em]"><span class="diff-line-content-operator ml-[-1.5em] inline-block w-[1.5em] select-none indent-[0.2em]"> </span> <!></div>');function fi(t,e){de(e,!0);let n=ue(e,lm),i=k(()=>e.diffLine?.type===Re.Add),r=k(()=>e.diffLine?.type===Re.Delete),o=k(()=>e.syntaxLine&&e.syntaxLine?.nodeList?.length>150);var l=dm(),a=C(l),f=C(a,!0);T(a);var u=X(a,2);{var d=p=>{{let m=k(()=>s(i)?"add":s(r)?"del":void 0);Ll(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffFile(){return e.diffFile},get diffLine(){return e.diffLine},get syntaxLine(){return e.syntaxLine},get enableWrap(){return e.enableWrap}})}},c=p=>{{let m=k(()=>s(i)?"add":s(r)?"del":void 0);qo(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get plainLine(){return e.plainLine},get enableWrap(){return e.enableWrap}})}};q(u,p=>{e.enableHighlight&&e.syntaxLine&&!s(o)?p(d):p(c,-1)})}T(l),J(()=>{G(l,`
		white-space: ${e.enableWrap?"pre-wrap":"pre"};
		word-break: ${e.enableWrap?"break-all":"initial"}
	`),U(a,"data-operator",s(i)?"+":s(r)?"-":void 0),Ce(f,s(i)?"+":s(r)?"-":" ")}),F(t,l),fe()}var fm=new Set(["$$slots","$$events","$$legacy"]),cm=B('<td class="diff-line-old-num group relative w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-old-content group relative pr-[10px] align-top"><!> <!></td>',1),um=B('<td class="diff-line-old-placeholder select-none"><span>&ensp;</span></td>'),pm=B('<td class="diff-line-new-num group relative w-[1%] min-w-[40px] select-none border-l-[1px] pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-new-content group relative pr-[10px] align-top"><!> <!></td>',1),hm=B('<td class="diff-line-new-placeholder select-none border-l-[1px]"><span>&ensp;</span></td>'),mm=B('<tr class="diff-line"><!><!></tr>');function kl(t,e){de(e,!0);let n=ue(e,fm),i=k(En()),r=k(no()),o=k(to()),l=k(eo()),a=k(()=>e.diffFile.getSplitLeftLine(e.index)),f=k(()=>e.diffFile.getSplitRightLine(e.index)),u=()=>e.diffFile.getOldSyntaxLine(s(a)?.lineNumber||0),d=()=>e.diffFile.getNewSyntaxLine(s(f)?.lineNumber||0),c=()=>e.diffFile.getOldPlainLine(s(a)?.lineNumber||0),p=()=>e.diffFile.getNewPlainLine(s(f)?.lineNumber||0),m=ce(Le(u())),g=ce(Le(d())),$=ce(Le(c())),w=ce(Le(p())),_=k(()=>!!s(a)?.diff||!!s(f)?.diff),L=k(()=>Xi(s(a)?.diff)||Xi(s(f)?.diff)),x=k(()=>s(a)?.isHidden&&s(f)?.isHidden),I=()=>s(a)?.diff?.type===Re.Delete,S=()=>s(f)?.diff?.type===Re.Add,y=()=>{oe(m,u(),!0),oe(g,d(),!0),oe($,c(),!0),oe(w,p(),!0)},h={current:()=>{}};ye(()=>{h.current(),y(),h.current=e.diffFile.subscribe(y)}),Ve(()=>h.current());let b=(W,P)=>{s(i).side=P,s(i).lineNumber=W};var E=pe(),D=ne(E);{var M=W=>{var P=mm(),K=C(P);{var ee=j=>{var V=cm(),H=ne(V),he=C(H);{var ie=ge=>{{let ke=k(()=>s(a)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(l)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:b})}};q(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Q=X(he,2),ve=C(Q,!0);T(Q),T(H);var se=X(H,2),te=C(se);{var xe=ge=>{{let ke=k(()=>s(a)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(l)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:b})}};q(te,ge=>{s(_)&&s(r)&&ge(xe)})}var $e=X(te,2);{let ge=k(()=>s(a)?.value||""),ke=k(()=>s(a)?.diff),Be=k(()=>!!s(o));fi($e,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s($)},get syntaxLine(){return s(m)},get enableHighlight(){return s(Be)}})}T(se),J((ge,ke)=>{G(H,ge),U(H,"data-side",O[O.old]),U(Q,"data-line-num",s(a)?.lineNumber),G(Q,`opacity: ${s(L)?void 0:.5} `),Ce(ve,s(a)?.lineNumber),G(se,ke),U(se,"data-side",O[O.old])},[()=>`
					background-color: ${Go(!1,I(),s(_))};
					color: var(${s(_)?ft:ur})
				`,()=>` background-color: ${zo(!1,I(),s(_))} `]),F(j,V)},re=j=>{var V=um();U(V,"colspan",2),J(()=>G(V,`background-color: var(${Qt}) `)),F(j,V)};q(K,j=>{s(a)?.lineNumber?j(ee):j(re,-1)})}var Z=X(K);{var A=j=>{var V=pm(),H=ne(V),he=C(H);{var ie=ge=>{{let ke=k(()=>s(f)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(l)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:b})}};q(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Q=X(he,2),ve=C(Q,!0);T(Q),T(H);var se=X(H,2),te=C(se);{var xe=ge=>{{let ke=k(()=>s(f)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(l)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:b})}};q(te,ge=>{s(_)&&s(r)&&ge(xe)})}var $e=X(te,2);{let ge=k(()=>s(f)?.value||""),ke=k(()=>s(f)?.diff),Be=k(()=>!!s(o));fi($e,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(w)},get syntaxLine(){return s(g)},get enableHighlight(){return s(Be)}})}T(se),J((ge,ke)=>{G(H,ge),U(H,"data-side",O[O.new]),U(Q,"data-line-num",s(f)?.lineNumber),G(Q,` opacity: ${s(L)?void 0:.5} `),Ce(ve,s(f)?.lineNumber),G(se,ke),U(se,"data-side",O[O.new])},[()=>`
					background-color: ${Go(S(),!1,s(_))};
					color: var(${s(_)?ft:ur});
					border-left-color: var(${gn});
					border-left-style: solid
				`,()=>`background-color: ${zo(S(),!1,s(_))} `]),F(j,V)},Y=j=>{var V=hm();U(V,"colspan",2),J(()=>G(V,`
					background-color: var(${Qt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),F(j,V)};q(Z,j=>{s(f)?.lineNumber?j(A):j(Y,-1)})}T(P),J(()=>{U(P,"data-line",e.lineNumber),U(P,"data-state",s(_)?"diff":"plain")}),F(W,P)};q(D,W=>{s(x)||W(M)})}F(t,E),fe()}var gm=new Set(["$$slots","$$events","$$legacy"]),vm=B('<td class="diff-line-extend-old-content p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),_m=B('<td class="diff-line-extend-old-placeholder select-none p-0"></td>'),bm=B('<td class="diff-line-extend-new-content border-l-[1px] p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),wm=B('<td class="diff-line-extend-new-placeholder select-none border-l-[1px] p-0"></td>'),xm=B('<tr data-state="extend" class="diff-line diff-line-extend"><!><!></tr>');function Sl(t,e){de(e,!0);let n=ue(e,gm),i=k(Jr()),r=k(Qr()),o=k(()=>e.diffFile.getSplitLeftLine(e.index)),l=k(()=>e.diffFile.getSplitRightLine(e.index)),a=k(()=>e.diffFile.getExpandEnabled()),f=k(()=>s(i)?.oldFile?.[s(o)?.lineNumber||""]),u=k(()=>s(i)?.newFile?.[s(l)?.lineNumber||""]),d=k(()=>!!((s(f)||s(u))&&(!s(o)?.isHidden&&!s(l)?.isHidden||s(a))&&s(r)));var c=pe(),p=ne(c);{var m=g=>{var $=xm(),w=C($);{var _=y=>{var h=vm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(r),()=>({diffFile:e.diffFile,side:O.old,lineNumber:s(o)?.lineNumber||0,data:s(f)?.data,onUpdate:e.diffFile.notifyAll})),T(b),T(h),F(y,h)},L=y=>{var h=_m();U(h,"colspan",2),J(()=>G(h,`background-color: var(${Qt})`)),F(y,h)};q(w,y=>{s(r)&&s(f)?y(_):y(L,-1)})}var x=X(w);{var I=y=>{var h=bm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(r),()=>({diffFile:e.diffFile,side:O.new,lineNumber:s(l)?.lineNumber||0,data:s(u)?.data,onUpdate:e.diffFile.notifyAll})),T(b),T(h),J(()=>G(h,`border-left-color: var(${gn}); border-left-style: solid `)),F(y,h)},S=y=>{var h=wm();U(h,"colspan",2),J(()=>G(h,`
					background-color: var(${Qt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),F(y,h)};q(x,y=>{s(r)&&s(u)?y(I):y(S,-1)})}T($),J(()=>U($,"data-line",`${e.lineNumber}-extend`)),F(g,$)};q(p,g=>{s(d)&&g(m)})}F(t,c),fe()}var ym=new Set(["$$slots","$$events","$$legacy"]),$m=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M7.823 1.677 4.927 4.573A.25.25 0 0 0 5.104 5H7.25v3.236a.75.75 0 1 0 1.5 0V5h2.146a.25.25 0 0 0 .177-.427L8.177 1.677a.25.25 0 0 0-.354 0ZM13.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-3.75.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM7.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM4 11.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM1.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"></path></svg>');function It(t,e){de(e,!0);let n=ue(e,ym);var i=$m();J(()=>Ne(i,0,ln(e.className))),F(t,i),fe()}var Em=new Set(["$$slots","$$events","$$legacy"]),Lm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177 14.323 2.896-2.896a.25.25 0 0 0-.177-.427H8.75V7.764a.75.75 0 1 0-1.5 0V11H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0ZM2.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM8.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function Tt(t,e){de(e,!0);let n=ue(e,Em);var i=Lm();J(()=>Ne(i,0,ln(e.className))),F(t,i),fe()}var km=new Set(["$$slots","$$events","$$legacy"]),Sm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function kn(t,e){de(e,!0);let n=ue(e,km);var i=Sm();J(()=>Ne(i,0,ln(e.className))),F(t,i),fe()}var Nm=new Set(["$$slots","$$events","$$legacy"]),Im=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Tm=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Cm=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Fm=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Dm=B('<div class="min-h-[28px]">&ensp;</div>'),Am=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Nl(t,e){de(e,!0);let n=ue(e,Nm),i=k(()=>e.diffFile.getSplitHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)?.splitInfo),l=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},a=ce(Le(l())),f=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(f())),d=k(()=>{let _=s(i);return _&&_.isFirst}),c=k(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=k(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,f(),!0),oe(a,l(),!0)};_(),m.current=e.diffFile.subscribe(_)}),Ve(()=>m.current());var g=pe(),$=ne(g);{var w=_=>{var L=Am(),x=C(L),I=C(x);{var S=D=>{var M=pe(),W=ne(M);{var P=Z=>{var A=Im(),Y=C(A);It(Y,{className:"fill-current"}),T(A),we("click",A,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(Z,A)},K=Z=>{var A=Tm(),Y=C(A);Tt(Y,{className:"fill-current"}),T(A),we("click",A,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(Z,A)},ee=Z=>{var A=Cm(),Y=C(A);kn(Y,{className:"fill-current"}),T(A),we("click",A,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(Z,A)},re=Z=>{var A=Fm(),Y=ne(A),j=C(Y);Tt(j,{className:"fill-current"}),T(Y);var V=X(Y,2),H=C(V);It(H,{className:"fill-current"}),T(V),we("click",Y,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",V,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(Z,A)};q(W,Z=>{s(d)?Z(P):s(p)?Z(K,1):s(a)?Z(ee,2):Z(re,-1)})}F(D,M)},y=D=>{var M=Dm();F(D,M)};q(I,D=>{s(o)?D(S):D(y,-1)})}T(x);var h=X(x);U(h,"colspan",3);var b=C(h),E=C(b,!0);T(b),T(h),T(L),J(()=>{U(L,"data-line",`${e.lineNumber}-hunk`),G(x,`
				background-color: var(${jn});
				color: var(${ft})
			`),G(h,`background-color: var(${dn})`),G(b,`
					color: var(${Pn})
				`),Ce(E,s(i)?.splitInfo?.plainText||s(i)?.text)}),F(_,L)};q($,_=>{(s(u)||s(c))&&_(w)})}F(t,g),fe()}rt(["click"]);var Mm=new Set(["$$slots","$$events","$$legacy"]),fu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),cu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),uu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),pu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),hu=B('<div class="min-h-[28px]">&ensp;</div>'),Rm=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td><td class="diff-line-hunk-action relative z-[1] w-[1%] min-w-[40px] select-none border-l-[1px] p-[1px]"><!></td><td class="diff-line-hunk-content relative pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Il(t,e){de(e,!0);let n=ue(e,Mm),i=k(()=>e.diffFile.getSplitHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)?.splitInfo),l=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},a=ce(Le(l())),f=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(f())),d=k(()=>{let _=s(i);return _&&_.isFirst}),c=k(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=k(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,f(),!0),oe(a,l(),!0)};_(),m.current=e.diffFile.subscribe(_)}),Ve(()=>m.current());var g=pe(),$=ne(g);{var w=_=>{var L=Rm(),x=C(L),I=C(x);{var S=Z=>{var A=pe(),Y=ne(A);{var j=ie=>{var Q=fu(),ve=C(Q);It(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)},V=ie=>{var Q=cu(),ve=C(Q);Tt(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(ie,Q)},H=ie=>{var Q=uu(),ve=C(Q);kn(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(ie,Q)},he=ie=>{var Q=pu(),ve=ne(Q),se=C(ve);Tt(se,{className:"fill-current"}),T(ve);var te=X(ve,2),xe=C(te);It(xe,{className:"fill-current"}),T(te),we("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)};q(Y,ie=>{s(d)?ie(j):s(p)?ie(V,1):s(a)?ie(H,2):ie(he,-1)})}F(Z,A)},y=Z=>{var A=hu();F(Z,A)};q(I,Z=>{s(o)?Z(S):Z(y,-1)})}T(x);var h=X(x),b=C(h),E=C(b,!0);T(b),T(h);var D=X(h),M=C(D);{var W=Z=>{var A=pe(),Y=ne(A);{var j=ie=>{var Q=fu(),ve=C(Q);It(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)},V=ie=>{var Q=cu(),ve=C(Q);Tt(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(ie,Q)},H=ie=>{var Q=uu(),ve=C(Q);kn(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(ie,Q)},he=ie=>{var Q=pu(),ve=ne(Q),se=C(ve);Tt(se,{className:"fill-current"}),T(ve);var te=X(ve,2),xe=C(te);It(xe,{className:"fill-current"}),T(te),we("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)};q(Y,ie=>{s(d)?ie(j):s(p)?ie(V,1):s(a)?ie(H,2):ie(he,-1)})}F(Z,A)},P=Z=>{var A=hu();F(Z,A)};q(M,Z=>{s(o)?Z(W):Z(P,-1)})}T(D);var K=X(D),ee=C(K),re=C(ee,!0);T(ee),T(K),T(L),J(()=>{U(L,"data-line",`${e.lineNumber}-hunk`),G(x,`
				background-color: var(${jn});
				color: var(${ft})
			`),G(h,`background-color: var(${dn})`),G(b,`
					color: var(${Pn})
				`),Ce(E,s(i)?.splitInfo?.plainText||s(i)?.text),G(D,`
				background-color: var(${jn});
				color: var(${ft});
				border-left-color: var(${gn});
				border-left-style: solid
			`),G(K,`background-color: var(${dn})`),G(ee,`
					color: var(${Pn})
				`),Ce(re,s(i)?.splitInfo?.plainText||s(i)?.text)}),F(_,L)};q($,_=>{(s(u)||s(c))&&_(w)})}F(t,g),fe()}rt(["click"]);var Hm=new Set(["$$slots","$$events","$$legacy"]);function Ys(t,e){de(e,!0);let n=ue(e,Hm),i=k(Ws());var r=pe(),o=ne(r);{var l=f=>{Nl(f,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},a=f=>{Il(f,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};q(o,f=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?f(l):f(a,-1)})}F(t,r),fe()}var Om=new Set(["$$slots","$$events","$$legacy"]),Bm=B('<td class="diff-line-widget-old-content p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Pm=B('<td class="diff-line-widget-old-placeholder select-none p-0"></td>'),jm=B('<td class="diff-line-widget-new-content border-l-[1px] p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Wm=B('<td class="diff-line-widget-new-placeholder select-none border-l-[1px] p-0"></td>'),Um=B('<tr data-state="widget" class="diff-line diff-line-widget"><!><!></tr>');function Tl(t,e){de(e,!0);let n=ue(e,Om),i=k(Xr()),r=k(En()),o=k(()=>e.diffFile.getSplitLeftLine(e.index)),l=k(()=>e.diffFile.getSplitRightLine(e.index)),a=k(()=>s(o)?.lineNumber&&s(r)?.side===O.old&&s(r)?.lineNumber===s(o)?.lineNumber),f=k(()=>s(l)?.lineNumber&&s(r)?.side===O.new&&s(r)?.lineNumber===s(l)?.lineNumber),u=k(()=>(!!s(a)||!!s(f))&&!s(o)?.isHidden&&!s(l)?.isHidden&&!!s(i)),d=()=>{s(r).side=void 0,s(r).lineNumber=void 0};var c=pe(),p=ne(c);{var m=g=>{var $=Um(),w=C($);{var _=y=>{var h=Bm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(i),()=>({diffFile:e.diffFile,side:O.old,lineNumber:s(o)?.lineNumber||0,onClose:d})),T(b),T(h),F(y,h)},L=y=>{var h=Pm();U(h,"colspan",2),J(()=>G(h,`background-color: var(${Qt})`)),F(y,h)};q(w,y=>{s(a)&&s(i)?y(_):y(L,-1)})}var x=X(w);{var I=y=>{var h=jm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(i)??ht,()=>({diffFile:e.diffFile,side:O.new,lineNumber:s(l)?.lineNumber||0,onClose:d})),T(b),T(h),J(()=>G(h,`border-left-color: var(${gn}); border-left-style: solid `)),F(y,h)},S=y=>{var h=Wm();U(h,"colspan",2),J(()=>G(h,`
					background-color: var(${Qt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),F(y,h)};q(x,y=>{s(f)&&s(i)?y(I):y(S,-1)})}T($),J(()=>U($,"data-line",`${e.lineNumber}-widget`)),F(g,$)};q(p,g=>{s(u)&&g(m)})}F(t,c),fe()}var Vm=new Set(["$$slots","$$events","$$legacy"]),zm=B("<!> <!> <!> <!>",1),Gm=B('<div class="split-diff-view split-diff-view-warp w-full"><div class="diff-table-wrapper w-full"><style data-select-style=""></style> <table class="diff-table w-full table-fixed border-collapse border-spacing-0"><colgroup><col class="diff-table-old-num-col"/><col class="diff-table-old-content-col"/><col class="diff-table-new-num-col"/><col class="diff-table-new-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">old line number</th><th scope="col">old line content</th><th scope="col">new line number</th><th scope="col">new line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Cl(t,e){de(e,!0);let n=ue(e,Vm),i=()=>ss(e.diffFile),r=ce(Le(i())),o={current:void 0},l=ce(void 0),a=k(()=>Math.max(e.diffFile.splitLineLength,e.diffFile.fileLineLength).toString()),f=k(Zr()),u=k(()=>({fontSize:`${s(f)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),d={current:()=>{}};ye(()=>{d.current();let E=()=>oe(r,i(),!0);E(),d.current=e.diffFile.subscribe(E)}),Ve(()=>d.current());let c=E=>{let D=s(l);if(D)if(E){let M=E===O.old?O.new:O.old;D.textContent=`#diff-root${e.diffFile.getId()} [data-side="${O[M]}"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="extend"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="hunk"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="widget"] {user-select: none}`}else D.textContent=""},p=E=>{let D=E.target;if(D&&D instanceof HTMLElement&&D.nodeName==="BUTTON"){Ln();return}let M=ro(D);if(!(M&&M!==`diff-root${e.diffFile.getId()}`))for(;D&&D instanceof HTMLElement;){let W=D.getAttribute("data-state"),P=D.getAttribute("data-side");if(P&&o.current!==O[P]&&(o.current=O[P],c(O[P]),Ln()),W)if(W==="extend"||W==="hunk"||W==="widget"){o.current!==void 0&&(o.current=void 0,c(void 0),Ln());return}else return;D=D.parentElement}},m=k(io({text:()=>s(a),font:()=>s(u)})),g=k(()=>Math.max(40,s(m)+25));var $=Gm(),w=C($),_=C(w);lt(_,()=>E=>oe(l,E,!0));var L=X(_,2),x=C(L),I=C(x),S=X(I,2);Ji(),T(x);var y=X(x,2),h=C(y);li(h,17,()=>s(r),ai,(E,D)=>{var M=zm(),W=ne(M);Ys(W,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}});var P=X(W,2);kl(P,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}});var K=X(P,2);Tl(K,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}});var ee=X(K,2);Sl(ee,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}}),F(E,M)});var b=X(h);Ys(b,{get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),T(y),T(L),T(w),T($),J((E,D,M)=>{G(w,E),U(I,"width",D),U(S,"width",M)},[()=>`
			${Fe}: ${Math.round(s(g))}px;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`,()=>Math.round(s(g)),()=>Math.round(s(g))]),we("mousedown",y,p),F(t,$),fe()}rt(["mousedown"]);var Ym=new Set(["$$slots","$$events","$$legacy"]),qm=B("<td><!> <span> </span></td> <td><!></td>",1),Km=B("<td><span>&ensp;</span></td>"),Zm=B("<tr><!></tr>");function Fl(t,e){de(e,!0);let n=ue(e,Ym),i=k(En()),r=k(no()),o=k(to()),l=k(eo()),a=k(()=>e.side===O.old?e.diffFile.getSplitLeftLine(e.index):e.diffFile.getSplitRightLine(e.index)),f=k(()=>!!s(a)?.diff),u=k(()=>Xi(s(a)?.diff)),d=k(()=>s(a)?.isHidden),c=k(()=>!!s(a)?.lineNumber),p=()=>e.side===O.old?e.diffFile.getOldSyntaxLine(s(a)?.lineNumber||0):e.diffFile.getNewSyntaxLine(s(a)?.lineNumber||0),m=()=>e.side===O.old?e.diffFile.getOldPlainLine(s(a)?.lineNumber||0):e.diffFile.getNewPlainLine(s(a)?.lineNumber||0),g=ce(Le(p())),$=ce(Le(m())),w=()=>{oe(g,p(),!0),oe($,m(),!0)},_={current:()=>{}};ye(()=>{_.current(),w(),_.current=e.diffFile.subscribe(w)}),Ve(()=>_.current());let L=(b,E)=>{s(i).side=E,s(i).lineNumber=b},x=()=>s(a)?.diff?.type===Re.Add,I=()=>s(a)?.diff?.type===Re.Delete;var S=pe(),y=ne(S);{var h=b=>{var E=Zm(),D=C(E);{var M=P=>{var K=qm(),ee=ne(K),re=C(ee);{var Z=H=>{{let he=k(()=>s(a)?.lineNumber||0);Mi(H,{get index(){return e.index},get lineNumber(){return s(he)},get side(){return e.side},get diffFile(){return e.diffFile},get onWidgetClick(){return s(l)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:L})}};q(re,H=>{s(f)&&s(r)&&H(Z)})}var A=X(re,2),Y=C(A,!0);T(A),T(ee);var j=X(ee,2),V=C(j);{let H=k(()=>s(a)?.value||""),he=k(()=>s(a)?.diff),ie=k(()=>!!s(o));fi(V,{enableWrap:!1,get diffFile(){return e.diffFile},get rawLine(){return s(H)},get diffLine(){return s(he)},get plainLine(){return s($)},get syntaxLine(){return s(g)},get enableHighlight(){return s(ie)}})}T(j),J((H,he)=>{Ne(ee,1,`diff-line-${O[e.side]}-num sticky left-0 z-[1] w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top`),G(ee,H),U(A,"data-line-num",s(a)?.lineNumber),G(A,` opacity: ${s(u)?void 0:.5} `),Ce(Y,s(a)?.lineNumber),Ne(j,1,`diff-line-${O[e.side]}-content pr-[10px] align-top`),G(j,he)},[()=>`
					background-color: ${Go(x(),I(),s(f))};
					color: var(${s(f)?ft:ur});
					width: var(${Fe});
					min-width: var(${Fe});
					max-width: var(${Fe})
				`,()=>` background-color: ${zo(x(),I(),s(f))} `]),F(P,K)},W=P=>{var K=Km();U(K,"colspan",2),J(()=>{Ne(K,1,`diff-line-${O[e.side]}-placeholder select-none`),G(K,`background-color: var(${Qt}) `)}),F(P,K)};q(D,P=>{s(c)?P(M):P(W,-1)})}T(E),J(()=>{U(E,"data-line",e.lineNumber),U(E,"data-state",s(f)||!s(c)?"diff":"plain"),U(E,"data-side",O[e.side]),Ne(E,1,"diff-line"+(s(c)?" group":""))}),F(b,E)};q(y,b=>{s(d)||b(h)})}F(t,S),fe()}var Ri=({selector:t,enable:e})=>{let n=k(Ps()),i=k(js()),r=k(di()),o=ce(0),l={current:()=>{}},a=()=>{if(s(r)&&e()){let d=Us(s(i)).querySelector(`#diff-root${s(n)}`)?.querySelector(t());if(!d)return;let c=d,p=()=>{let $=d?.getBoundingClientRect();oe(o,$?.width??0,!0)};p();let m=()=>{c?.__observeCallback?.delete(p),c?.__observeCallback?.size===0&&(c.__observeInstance?.disconnect(),c.removeAttribute("data-observe"),delete c.__observeCallback,delete c.__observeInstance)};if(c.__observeCallback){c.__observeCallback.add(p),l.current=()=>m();return}c.__observeCallback=new Set,c.__observeCallback.add(p);let g=new ResizeObserver(()=>c?.__observeCallback?.forEach($=>$()));c.__observeInstance=g,g.observe(c),c.setAttribute("data-observe","height"),l.current=()=>m()}};return ye(()=>(a(),()=>l.current?.())),()=>s(o)};var Hi=({selector:t,wrapper:e,side:n,enable:i})=>{let r=k(Ps()),o=k(js()),l=k(di()),a={current:()=>{}},f=()=>{if(s(l)&&i()){let u=()=>{},c=Us(s(o)).querySelector(`#diff-root${s(r)}`),p=Array.from(c?.querySelectorAll(t())||[]),m=e()?Array.from(c?.querySelectorAll(e())||[]):p;if(p.length===2&&m.length===2){let g=p[0],$=p[1],w=m[0],_=m[1],L=g.getAttribute("data-side")===n()?g:$,x=L,I=()=>{g.style.height="auto",$.style.height="auto";let h=g.getBoundingClientRect(),b=$.getBoundingClientRect(),E=Math.max(h.height,b.height);w.style.height=E+"px",_.style.height=E+"px",w.setAttribute("data-sync-height",String(E)),_.setAttribute("data-sync-height",String(E))};I();let S=()=>{x.__observeCallback?.delete(I),x.__observeCallback?.size===0&&(x.__observeInstance?.disconnect(),L.removeAttribute("data-observe"),delete x.__observeCallback,delete x.__observeInstance)};if(x.__observeCallback){x.__observeCallback.add(I),u=S;return}x.__observeCallback=new Set,x.__observeCallback.add(I);let y=new ResizeObserver(()=>x.__observeCallback?.forEach(h=>h()));x.__observeInstance=y,y.observe(L),L.setAttribute("data-observe","height"),u=S}a.current=u}};ye(()=>(f(),()=>a.current?.()))};var Xm=new Set(["$$slots","$$events","$$legacy"]),Jm=B('<td><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!></div></td>'),Qm=B("<td><div></div></td>"),eg=B('<tr data-state="extend" class="diff-line diff-line-extend"><!></tr>');function Dl(t,e){de(e,!0);let n=ue(e,Xm),i=ce(null),r=k(Jr()),o=k(Qr()),l=k(()=>`div[data-line="${e.lineNumber}-extend-content"]`),a=k(()=>`tr[data-line="${e.lineNumber}-extend"]`),f=k(()=>e.side===O.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),u=k(()=>e.diffFile.getSplitLeftLine(e.index)),d=k(()=>e.diffFile.getSplitRightLine(e.index)),c=k(()=>e.diffFile.getExpandEnabled()),p=k(()=>s(r)?.oldFile?.[s(u)?.lineNumber||""]),m=k(()=>s(r)?.newFile?.[s(d)?.lineNumber||""]),g=k(()=>e.side===O.old?s(u):s(d)),$=k(()=>s(g)?.isHidden),w=k(()=>e.side===O.old?s(p):s(m)),_=k(()=>e.side===O.old?s(u)?.lineNumber:s(d)?.lineNumber),L=k(()=>!!((s(p)||s(m))&&(!s($)||s(c))&&s(o))),x=k(()=>(e.side===O.old?!!s(p):!!s(m))&&s(L)),I=k(()=>O[s(w)?e.side:e.side===O.new?O.old:O.new]);Hi({selector:()=>s(l),wrapper:()=>s(a),side:()=>s(I),enable:()=>!!(s(L)&&s(i))});let S=k(Ri({selector:()=>s(f),enable:()=>!!(s(x)&&s(i))}));var y=pe(),h=ne(y);{var b=E=>{var D=eg(),M=C(D);{var W=K=>{var ee=Jm();U(ee,"colspan",2);var re=C(ee),Z=C(re);{var A=Y=>{var j=pe(),V=ne(j);Mt(V,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(_)||0,data:s(w)?.data,onUpdate:e.diffFile.notifyAll})),F(Y,j)};q(Z,Y=>{s(S)>0&&Y(A)})}T(re),T(ee),J(()=>{Ne(ee,1,`diff-line-extend-${O[e.side]}-content p-0`),U(re,"data-line",`${e.lineNumber}-extend-content`),U(re,"data-side",O[e.side]),G(re,` width: ${s(S)}px `)}),F(K,ee)},P=K=>{var ee=Qm();U(ee,"colspan",2);var re=C(ee);T(ee),J(()=>{Ne(ee,1,`diff-line-extend-${O[e.side]}-placeholder select-none p-0`),G(ee,` background-color: var(${Qt})`),U(re,"data-line",`${e.lineNumber}-extend-content`),U(re,"data-side",O[e.side])}),F(K,ee)};q(M,K=>{s(o)&&s(w)?K(W):K(P,-1)})}T(D),lt(D,()=>K=>oe(i,K,!0)),J(()=>{U(D,"data-line",`${e.lineNumber}-extend`),U(D,"data-side",O[e.side])}),F(E,D)};q(h,E=>{s(L)&&E(b)})}F(t,y),fe()}var tg=new Set(["$$slots","$$events","$$legacy"]),ng=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),ig=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),rg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),og=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),sg=B('<div class="min-h-[28px]">&ensp;</div>'),ag=B('<td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td> <td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td>',1),lg=B('<td class="diff-line-hunk-placeholder select-none"><div class="min-h-[28px]">&ensp;</div></td>'),dg=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><!></tr>');function Al(t,e){de(e,!0);let n=ue(e,tg),i=ce(null),r=k(()=>e.diffFile.getSplitHunkLine(e.index)),o=k(()=>e.diffFile.getExpandEnabled()),l=k(()=>s(o)&&s(r)?.splitInfo),a=k(()=>`tr[data-line="${e.lineNumber}-hunk"]`),f=k(()=>e.side===O.old),u=()=>{let y=s(r);return y&&y.splitInfo&&y.splitInfo.endHiddenIndex-y.splitInfo.startHiddenIndex<je},d=ce(Le(u())),c=()=>{let y=s(r);return y&&y.splitInfo&&y.splitInfo.startHiddenIndex<y.splitInfo.endHiddenIndex},p=ce(Le(c())),m=k(()=>{let y=s(r);return y&&y.isFirst}),g=k(()=>{let y=s(r);return y&&e.diffFile._getIsPureDiffRender()&&!y.splitInfo}),$=k(()=>{let y=s(r);return y&&y.isLast}),w={current:()=>{}};ye(()=>{w.current();let y=()=>{oe(p,c(),!0),oe(d,u(),!0)};y(),w.current=e.diffFile.subscribe(y)}),Ve(()=>w.current());let _=k(()=>O[O.old]),L=k(()=>e.side===O.new&&(!!s(p)||s(g)));Hi({selector:()=>s(a),wrapper:()=>s(a),side:()=>s(_),enable:()=>!!(s(L)&&s(i))});var x=pe(),I=ne(x);{var S=y=>{var h=dg(),b=C(h);{var E=M=>{var W=ag(),P=ne(W),K=C(P);{var ee=j=>{var V=pe(),H=ne(V);{var he=se=>{var te=ng(),xe=C(te);It(xe,{className:"fill-current"}),T(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(se,te)},ie=se=>{var te=ig(),xe=C(te);Tt(xe,{className:"fill-current"}),T(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(se,te)},Q=se=>{var te=rg(),xe=C(te);kn(xe,{className:"fill-current"}),T(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(se,te)},ve=se=>{var te=og(),xe=ne(te),$e=C(xe);Tt($e,{className:"fill-current"}),T(xe);var ge=X(xe,2),ke=C(ge);It(ke,{className:"fill-current"}),T(ge),we("click",xe,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",ge,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(se,te)};q(H,se=>{s(m)?se(he):s($)?se(ie,1):s(d)?se(Q,2):se(ve,-1)})}F(j,V)},re=j=>{var V=sg();F(j,V)};q(K,j=>{s(l)?j(ee):j(re,-1)})}T(P);var Z=X(P,2),A=C(Z),Y=C(A,!0);T(A),T(Z),J(()=>{G(P,`
					background-color: var(${jn});
					color: var(${ft});
					width: var(${Fe});
					min-width: var(${Fe});
					max-width: var(${Fe});
				`),G(Z,`background-color: var(${dn})`),G(A,`
						color: var(${Pn})
					`),Ce(Y,s(r)?.splitInfo?.plainText||s(r)?.text)}),F(M,W)},D=M=>{var W=lg();U(W,"colspan",2),J(()=>G(W,`background-color: var(${dn})`)),F(M,W)};q(b,M=>{s(f)?M(E):M(D,-1)})}T(h),lt(h,()=>M=>oe(i,M,!0)),J(()=>{U(h,"data-line",`${e.lineNumber}-hunk`),U(h,"data-side",O[e.side]),G(h,`background-color: var(${dn})`)}),F(y,h)};q(I,y=>{(s(p)||s(g))&&y(S)})}F(t,x),fe()}rt(["click"]);var fg=new Set(["$$slots","$$events","$$legacy"]),cg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),ug=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),pg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),hg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),mg=B('<div class="min-h-[28px]">&ensp;</div>'),gg=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Ml(t,e){de(e,!0);let n=ue(e,fg),i=ce(null),r=k(()=>e.diffFile.getSplitHunkLine(e.index)),o=k(()=>e.diffFile.getExpandEnabled()),l=k(()=>s(o)&&s(r)?.splitInfo),a=k(()=>`tr[data-line="${e.lineNumber}-hunk"]`),f=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.endHiddenIndex-S.splitInfo.startHiddenIndex<je},u=ce(Le(f())),d=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.startHiddenIndex<S.splitInfo.endHiddenIndex},c=ce(Le(d())),p=k(()=>{let S=s(r);return S&&S.isFirst}),m=k(()=>{let S=s(r);return S&&e.diffFile._getIsPureDiffRender()&&!S.splitInfo}),g=k(()=>{let S=s(r);return S&&S.isLast}),$=k(()=>O[O.old]),w=k(()=>e.side===O.new&&(!!s(c)||s(m))),_={current:()=>{}};ye(()=>{_.current();let S=()=>{oe(c,d(),!0),oe(u,f(),!0)};S(),_.current=e.diffFile.subscribe(S)}),Ve(()=>_.current()),Hi({selector:()=>s(a),wrapper:()=>s(a),side:()=>s($),enable:()=>!!(s(w)&&s(i))});var L=pe(),x=ne(L);{var I=S=>{var y=gg(),h=C(y),b=C(h);{var E=K=>{var ee=pe(),re=ne(ee);{var Z=V=>{var H=cg(),he=C(H);It(he,{className:"fill-current"}),T(H),we("click",H,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(V,H)},A=V=>{var H=ug(),he=C(H);Tt(he,{className:"fill-current"}),T(H),we("click",H,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(V,H)},Y=V=>{var H=pg(),he=C(H);kn(he,{className:"fill-current"}),T(H),we("click",H,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(V,H)},j=V=>{var H=hg(),he=ne(H),ie=C(he);Tt(ie,{className:"fill-current"}),T(he);var Q=X(he,2),ve=C(Q);It(ve,{className:"fill-current"}),T(Q),we("click",he,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",Q,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(V,H)};q(re,V=>{s(p)?V(Z):s(g)?V(A,1):s(u)?V(Y,2):V(j,-1)})}F(K,ee)},D=K=>{var ee=mg();F(K,ee)};q(b,K=>{s(l)?K(E):K(D,-1)})}T(h);var M=X(h),W=C(M),P=C(W,!0);T(W),T(M),T(y),lt(y,()=>K=>oe(i,K,!0)),J(()=>{U(y,"data-line",`${e.lineNumber}-hunk`),U(y,"data-side",O[e.side]),G(y,`background-color: var(${dn})`),G(h,`
				background-color: var(${jn});
				color: var(${ft});
				width: var(${Fe});
				min-width: var(${Fe});
				max-width: var(${Fe})
			`),G(M,`background-color: var(${dn})`),G(W,`
					color: var(${Pn})
				`),Ce(P,s(r)?.splitInfo?.plainText||s(r)?.text)}),F(S,y)};q(x,S=>{(s(c)||s(m))&&S(I)})}F(t,L),fe()}rt(["click"]);var vg=new Set(["$$slots","$$events","$$legacy"]);function qs(t,e){de(e,!0);let n=ue(e,vg),i=k(Ws());var r=pe(),o=ne(r);{var l=f=>{Al(f,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},a=f=>{Ml(f,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};q(o,f=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?f(l):f(a,-1)})}F(t,r),fe()}var _g=new Set(["$$slots","$$events","$$legacy"]),bg=B('<td><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!></div></td>'),wg=B("<td><div></div></td>"),xg=B('<tr data-state="widget" class="diff-line diff-line-widget"><!></tr>');function Rl(t,e){de(e,!0);let n=ue(e,_g),i=ce(null),r=k(Xr()),o=k(En()),l=k(()=>e.diffFile.getSplitLeftLine(e.index)),a=k(()=>e.diffFile.getSplitRightLine(e.index)),f=k(()=>!!s(l)?.lineNumber&&s(o)?.side===O.old&&s(o)?.lineNumber===s(l)?.lineNumber),u=k(()=>!!s(a)?.lineNumber&&s(o)?.side===O.new&&s(o)?.lineNumber===s(a)?.lineNumber),d=k(()=>e.side===O.old?s(l):s(a)),c=k(()=>s(d)?.isHidden),p=k(()=>`div[data-line="${e.lineNumber}-widget-content"]`),m=k(()=>`tr[data-line="${e.lineNumber}-widget"]`),g=k(()=>e.side===O.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),$=k(()=>e.side===O.old?s(f):s(u)),w=k(()=>O[s($)?e.side:e.side===O.old?O.new:O.old]),_=k(()=>(!!s(f)||!!s(u))&&!s(c)&&!!s(r)),L=k(()=>s($)&&!!s(_)),x=()=>{s(o).side=void 0,s(o).lineNumber=void 0};Hi({selector:()=>s(p),wrapper:()=>s(m),side:()=>s(w),enable:()=>!!(s(_)&&s(i))});let I=k(Ri({selector:()=>s(g),enable:()=>!!(s(L)&&s(i))}));var S=pe(),y=ne(S);{var h=b=>{var E=xg(),D=C(E);{var M=P=>{var K=bg();U(K,"colspan",2);var ee=C(K),re=C(ee);{var Z=A=>{var Y=pe(),j=ne(Y);Mt(j,()=>s(r),()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(d)?.lineNumber||0,onClose:x})),F(A,Y)};q(re,A=>{s(I)>0&&A(Z)})}T(ee),T(K),J(()=>{Ne(K,1,`diff-line-widget-${O[e.side]}-content p-0`),U(ee,"data-line",`${e.lineNumber}-widget-content`),U(ee,"data-side",O[e.side]),G(ee,` width: ${s(I)}px `)}),F(P,K)},W=P=>{var K=wg();U(K,"colspan",2);var ee=C(K);T(K),J(()=>{Ne(K,1,`diff-line-widget-${O[e.side]}-placeholder select-none p-0`),G(K,`background-color: var(${Qt})`),U(ee,"data-line",`${e.lineNumber}-widget-content`),U(ee,"data-side",O[e.side])}),F(P,K)};q(D,P=>{s($)?P(M):P(W,-1)})}T(E),lt(E,()=>P=>oe(i,P,!0)),J(()=>{U(E,"data-line",`${e.lineNumber}-widget`),U(E,"data-side",O[e.side])}),F(b,E)};q(y,b=>{s(_)&&b(h)})}F(t,S),fe()}var yg=new Set(["$$slots","$$events","$$legacy"]),$g=B("<!> <!> <!> <!>",1),Eg=B('<table><colgroup><col/><col/></colgroup><thead class="hidden"><tr><th scope="col"> </th><th scope="col"> </th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table>');function Ks(t,e){de(e,!0);let n=ue(e,yg),i=k(()=>e.side===O.new?"new-diff-table":"old-diff-table"),r=()=>ss(e.diffFile),o=ce(Le(r())),l={current:()=>{}},a=e.selectState;ye(()=>{l.current();let y=()=>oe(o,r(),!0);y(),l.current=e.diffFile.subscribe(y)}),Ve(()=>l.current());let f=y=>{let h=y.target;if(h&&h?.nodeName==="BUTTON"){Ln();return}let b=ro(h);if(!(b&&b!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let E=h.getAttribute("data-state");if(E){E==="extend"||E==="hunk"||E==="widget"?a.current!==void 0&&(a.current=void 0,e.onSelect?.(void 0),Ln()):a.current!==e.side&&(a.current=n.side,e.onSelect?.(e.side),Ln());return}h=h.parentElement}};var u=Eg(),d=C(u),c=C(d),p=X(c);T(d);var m=X(d),g=C(m),$=C(g),w=C($);T($);var _=X($),L=C(_);T(_),T(g),T(m);var x=X(m),I=C(x);li(I,17,()=>s(o),ai,(y,h)=>{var b=$g(),E=ne(b);qs(E,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var D=X(E,2);Fl(D,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=X(D,2);Rl(M,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var W=X(M,2);Dl(W,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),F(y,b)});var S=X(I);qs(S,{get side(){return e.side},get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),T(x),T(u),J(()=>{Ne(u,1,`${s(i)} w-full border-collapse border-spacing-0`),U(u,"data-mode",O[e.side]),Ne(c,1,`diff-table-${O[e.side]}-num-col`),Ne(p,1,`diff-table-${O[e.side]}-content-col`),Ce(w,`${O[e.side]??""} line number`),Ce(L,`${O[e.side]??""} line content`)}),we("mousedown",x,f),F(t,u),fe()}rt(["mousedown"]);var Lg=new Set(["$$slots","$$events","$$legacy"]),kg=B('<div class="split-diff-view split-diff-view-normal flex w-full basis-[50%]"><style data-select-style=""></style> <div class="old-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div> <div class="diff-split-line w-[1.5px]"></div> <div class="new-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div></div>');function Hl(t,e){de(e,!0);let n=ue(e,Lg),i=k(di()),r=ce(void 0),o=ce(void 0),l=ce(null),a=k(()=>Math.max(e.diffFile.fileLineLength,e.diffFile.splitLineLength).toString()),f={current:()=>{}},u={current:void 0};ye(()=>{if(f.current(),!s(i))return;let b=s(r),E=s(o);!b||!E||(f.current=su(b,E))}),Ve(()=>f.current());let c=b=>{let E=s(l);E&&(b?E.textContent=`#${w()} [data-state="extend"] {user-select: none} 
#${w()} [data-state="hunk"] {user-select: none} 
#${w()} [data-state="widget"] {user-select: none}`:E.textContent="")},p=k(Zr()),m=k(()=>({fontSize:`${s(p)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),g=k(io({text:()=>s(a),font:()=>s(m)})),$=k(()=>Math.max(40,s(g)+25)),w=()=>`diff-split-view-${e.diffFile.getId()}`;var _=kg(),L=C(_);lt(L,()=>b=>oe(l,b,!0));var x=X(L,2),I=C(x);Ks(I,{get side(){return O.old},get diffFile(){return e.diffFile},onSelect:c,get selectState(){return u}}),T(x),lt(x,()=>b=>{oe(r,b,!0)});var S=X(x,2),y=X(S,2),h=C(y);Ks(h,{get side(){return O.new},get diffFile(){return e.diffFile},onSelect:c,get selectState(){return u}}),T(y),lt(y,()=>b=>{oe(o,b,!0)}),T(_),J((b,E)=>{G(x,b),G(S,`background-color: var(${gn})`),G(y,E)},[()=>`
      ${Fe}: ${Math.round(s($))}px;
      overscroll-behavior-x: none;
      font-family: Menlo, Consolas, monospace;
      font-size: var(${nt});
    `,()=>`
			${Fe}: ${Math.round(s($))}px;
			overscroll-behavior-x: none;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`]),F(t,_),fe()}var Sg=new Set(["$$slots","$$events","$$legacy"]);function Ol(t,e){de(e,!0);let n=ue(e,Sg),i=k($n());var r=pe(),o=ne(r);{var l=f=>{Cl(f,{get diffFile(){return e.diffFile}})},a=f=>{Hl(f,{get diffFile(){return e.diffFile}})};q(o,f=>{s(i)?f(l):f(a,-1)})}F(t,r),fe()}var Ng=new Set(["$$slots","$$events","$$legacy"]),Ig=B('<div class="diff-add-widget-wrapper invisible absolute left-[100%] translate-x-[-50%] select-none transition-transform hover:scale-110 group-hover:visible"><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Ko(t,e){de(e,!0);let n=ue(e,Ng);var i=Ig(),r=C(i);T(i),J(()=>{U(i,"data-add-widget",O[e.side]),G(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),G(r,`
			color: var(${Gs});
			background-color: var(${zs});
		`)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),F(t,i),fe()}rt(["mousedown"]);var Tg=new Set(["$$slots","$$events","$$legacy"]),Cg=B('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"></span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),Fg=B('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"></span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),Dg=B("<!> <!>",1),Ag=B('<tr class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex opacity-[0.5]"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>');function Bl(t,e){de(e,!0);let n=ue(e,Tg),i=k(()=>e.diffFile.getUnifiedLine(e.index)),r=k($n()),o=k(En()),l=k(eo()),a=k(to()),f=k(no()),u=k(()=>s(i)?.isHidden),d=k(()=>Xi(s(i)?.diff)),c=()=>s(i)?.newLineNumber?e.diffFile.getNewSyntaxLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldSyntaxLine(s(i)?.oldLineNumber||0):void 0,p=ce(Le(c())),m=()=>s(i)?.newLineNumber?e.diffFile.getNewPlainLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldPlainLine(s(i)?.oldLineNumber||0):void 0,g=ce(Le(m())),$={current:()=>{}};ye(()=>{$?.current?.();let I=()=>{oe(p,c(),!0),oe(g,m(),!0)};I(),$.current=e.diffFile.subscribe(I)}),Ve(()=>$.current());let w=(I,S)=>{s(o).side=S,s(o).lineNumber=I};var _=pe(),L=ne(_);{var x=I=>{var S=pe(),y=ne(S);{var h=E=>{let D=(Z,A=ht)=>{var Y=Cg(),j=C(Y),V=C(j);{var H=te=>{{let xe=k(()=>A().index-1);Ko(te,{get index(){return s(xe)},get lineNumber(){return A().lineNumber},get diffFile(){return A().diffFile},get side(){return O.old},get onWidgetClick(){return A().onAddWidgetClick},get onOpenAddWidget(){return A().onOpenAddWidget}})}};q(V,te=>{A().enableAddWidget&&te(H)})}var he=X(V,2),ie=C(he),Q=C(ie,!0);T(ie),Ji(4),T(he),T(j);var ve=X(j),se=C(ve);fi(se,{get enableWrap(){return A().enableWrap},get diffFile(){return A().diffFile},get enableHighlight(){return A().enableHighlight},get rawLine(){return A().rawLine},get diffLine(){return A().diffLine},get plainLine(){return A().plainLine},get syntaxLine(){return A().syntaxLine}}),T(ve),T(Y),J(()=>{U(Y,"data-line",A().index),G(j,`
          color: var(${ft});
          background-color: var(${yl});
          width: calc(calc(var(${Fe}) + 5px) * 2);
          max-width: calc(calc(var(${Fe}) + 5px) * 2);
          min-width: calc(calc(var(${Fe}) + 5px) * 2);
        `),U(ie,"data-line-old-num",A().lineNumber),Ce(Q,A().lineNumber),G(ve,`background-color: var(${wl}) `)}),F(Z,Y)},M=(Z,A=ht)=>{var Y=Fg(),j=C(Y),V=C(j);{var H=te=>{{let xe=k(()=>A().index-1);Ko(te,{get index(){return s(xe)},get lineNumber(){return A().lineNumber},get diffFile(){return A().diffFile},get side(){return O.new},get onWidgetClick(){return A().onAddWidgetClick},get onOpenAddWidget(){return A().onOpenAddWidget}})}};q(V,te=>{A().enableAddWidget&&te(H)})}var he=X(V,2),ie=X(C(he),4),Q=C(ie,!0);T(ie),T(he),T(j);var ve=X(j),se=C(ve);fi(se,{get enableWrap(){return A().enableWrap},get diffFile(){return A().diffFile},get enableHighlight(){return A().enableHighlight},get rawLine(){return A().rawLine},get diffLine(){return A().diffLine},get plainLine(){return A().plainLine},get syntaxLine(){return A().syntaxLine}}),T(ve),T(Y),J(()=>{U(Y,"data-line",A().index),G(j,`
          color: var(${ft});
          background-color: var(${xl});
          width: calc(calc(var(${Fe}) + 5px) * 2);
          max-width: calc(calc(var(${Fe}) + 5px) * 2);
          min-width: calc(calc(var(${Fe}) + 5px) * 2);
        `),U(ie,"data-line-new-num",A().lineNumber),Ce(Q,A().lineNumber),G(ve,` background-color: var(${bl}) `)}),F(Z,Y)};var W=Dg(),P=ne(W);{var K=Z=>{D(Z,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(a),enableAddWidget:s(f),lineNumber:s(i).oldLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:s(l)}))};q(P,Z=>{s(i).oldLineNumber&&Z(K)})}var ee=X(P,2);{var re=Z=>{M(Z,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(a),enableAddWidget:s(f),lineNumber:s(i).newLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:s(l)}))};q(ee,Z=>{s(i).newLineNumber&&Z(re)})}F(E,W)},b=E=>{var D=Ag(),M=C(D),W=C(M);{var P=V=>{{let H=k(()=>s(i)?.newLineNumber||0);Ko(V,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return s(H)},get side(){return O.new},onOpenAddWidget:w,get onWidgetClick(){return s(l)}})}};q(W,V=>{s(f)&&s(i)?.diff&&V(P)})}var K=X(W,2),ee=C(K),re=C(ee,!0);T(ee);var Z=X(ee,4),A=C(Z,!0);T(Z),T(K),T(M);var Y=X(M),j=C(Y);{let V=k(()=>!!s(r)),H=k(()=>!!s(a)),he=k(()=>s(i)?.value||""),ie=k(()=>s(i)?.diff);fi(j,{get enableWrap(){return s(V)},get diffFile(){return e.diffFile},get enableHighlight(){return s(H)},get rawLine(){return s(he)},get diffLine(){return s(ie)},get plainLine(){return s(g)},get syntaxLine(){return s(p)}})}T(Y),T(D),J(()=>{U(D,"data-line",e.lineNumber),U(D,"data-state",s(i)?.diff?"diff":"plain"),G(M,`
					color: var(${s(i)?.diff?ft:ur});
					background-color: ${s(i)?.diff?`var(${El})`:`var(${Vs})`};
					width: calc(calc(var(${Fe}) + 5px) * 2);
					max-width: calc(calc(var(${Fe}) + 5px) * 2);
					min-width: calc(calc(var(${Fe}) + 5px) * 2;
				`),U(ee,"data-line-old-num",s(i)?.oldLineNumber||0),Ce(re,s(i)?.oldLineNumber||0),U(Z,"data-line-new-num",s(i)?.newLineNumber||0),Ce(A,s(i)?.newLineNumber||0),G(Y,`
					background-color: ${s(i)?.diff?`var(${$l})`:`var(${Vs})`}
				`)}),F(E,D)};q(y,E=>{s(d)?E(h):E(b,-1)})}F(I,S)};q(L,I=>{s(u)||I(x)})}F(t,_),fe()}var Mg=new Set(["$$slots","$$events","$$legacy"]),Rg=B('<tr data-state="extend" class="diff-line diff-line-extend"><td class="diff-line-extend-content p-0 align-top"><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Pl(t,e){de(e,!0);let n=ue(e,Mg),i=k(Jr()),r=k($n()),o=k(Qr()),l=k(()=>e.diffFile.getUnifiedLine(e.index)),a=k(()=>s(i)?.oldFile?.[s(l)?.oldLineNumber||-1]),f=k(()=>s(i)?.newFile?.[s(l)?.newLineNumber||-1]),u=k(()=>s(l).isHidden),d=k(()=>!!((s(a)||s(f))&&s(u)&&s(o))),c=k(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>s(d)}));var p=pe(),m=ne(p);{var g=$=>{var w=Rg(),_=C(w);U(_,"colspan",2);var L=C(_),x=C(L);{var I=h=>{var b=pe(),E=ne(b);Mt(E,()=>s(o),()=>({diffFile:e.diffFile,side:O.old,data:s(a)?.data,lineNumber:s(l)?.oldLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),F(h,b)};q(x,h=>{(s(r)||s(c)>0)&&s(a)&&s(o)&&h(I)})}var S=X(x,2);{var y=h=>{var b=pe(),E=ne(b);Mt(E,()=>s(o),()=>({diffFile:e.diffFile,side:O.new,data:s(f)?.data,lineNumber:s(l)?.newLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),F(h,b)};q(S,h=>{(s(r)||s(c)>0)&&s(f)&&s(o)&&h(y)})}T(L),T(_),T(w),J(()=>{U(w,"data-line",`${e.lineNumber}-extend`),G(L,`width: ${s(c)}px `)}),F($,w)};q(m,$=>{s(d)&&$(g)})}F(t,p),fe()}var Hg=new Set(["$$slots","$$events","$$legacy"]),Og=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Bg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Pg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),jg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Wg=B('<div class="min-h-[28px]">&ensp;</div>'),Ug=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[100px] select-none"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Zs(t,e){de(e,!0);let n=ue(e,Hg),i=k(()=>e.diffFile.getUnifiedHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)&&s(i).unifiedInfo),l=k($n()),a=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.startHiddenIndex<s(i).unifiedInfo.endHiddenIndex,f=ce(Le(a())),u=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.endHiddenIndex-s(i).unifiedInfo.startHiddenIndex<je,d=ce(Le(u())),c=k(()=>s(i)&&s(i).isFirst),p=k(()=>s(i)&&s(i).isLast),m=k(()=>s(i)&&e.diffFile._getIsPureDiffRender()&&!s(i).unifiedInfo),g={current:()=>{}};ye(()=>{g?.current?.();let L=()=>{oe(f,a(),!0),oe(d,u(),!0)};L(),g.current=e.diffFile.subscribe(L)}),Ve(()=>g.current());var $=pe(),w=ne($);{var _=L=>{var x=Ug(),I=C(x),S=C(I);{var y=M=>{var W=pe(),P=ne(W);{var K=A=>{var Y=Og(),j=C(Y);It(j,{className:"fill-current"}),T(Y),we("click",Y,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),F(A,Y)},ee=A=>{var Y=Bg(),j=C(Y);Tt(j,{className:"fill-current"}),T(Y),we("click",Y,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),F(A,Y)},re=A=>{var Y=Pg(),j=C(Y);kn(j,{className:"fill-current"}),T(Y),we("click",Y,()=>e.diffFile.onUnifiedHunkExpand("all",e.index)),F(A,Y)},Z=A=>{var Y=jg(),j=ne(Y),V=C(j);Tt(V,{className:"fill-current"}),T(j);var H=X(j,2),he=C(H);It(he,{className:"fill-current"}),T(H),we("click",j,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),we("click",H,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),F(A,Y)};q(P,A=>{s(c)?A(K):s(p)?A(ee,1):s(d)?A(re,2):A(Z,-1)})}F(M,W)},h=M=>{var W=Wg();F(M,W)};q(S,M=>{s(o)?M(y):M(h,-1)})}T(I);var b=X(I),E=C(b),D=C(E,!0);T(E),T(b),T(x),J(()=>{U(x,"data-line",`${e.lineNumber}-hunk`),G(I,`
				background-color: var(${jn});
				color: var(${ft});
				width: calc(calc(var(${Fe}) + 5px) * 2);
				max-width: calc(calc(var(${Fe}) + 5px) * 2);
				min-width: calc(calc(var(${Fe}) + 5px) * 2);
			`),G(b,` background-color: var(${dn}) `),G(E,`
					white-space: ${s(l)?"pre-wrap":"pre"};
					word-break: ${s(l)?"break-all":"initial"};
					color: var(${Pn});
				`),Ce(D,s(i)?.unifiedInfo?.plainText||s(i)?.text)}),F(L,x)};q(w,L=>{(s(f)||s(m))&&L(_)})}F(t,$),fe()}rt(["click"]);var Vg=new Set(["$$slots","$$events","$$legacy"]),zg=B('<tr data-state="widget" class="diff-line diff-line-widget"><td class="diff-line-widget-content p-0"><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function jl(t,e){de(e,!0);let n=ue(e,Vg),i=k(En()),r=k($n()),o=k(Xr()),l=k(()=>e.diffFile.getUnifiedLine(e.index)),a=k(()=>s(l)?.oldLineNumber&&s(i)?.side===O.old&&s(i)?.lineNumber===s(l)?.oldLineNumber),f=k(()=>s(l)?.newLineNumber&&s(i)?.side===O.new&&s(i)?.lineNumber===s(l)?.newLineNumber),u=k(()=>s(l)?.isHidden),d=k(()=>!!((s(a)||s(f))&&!s(u)&&s(o))),c=()=>{s(i).side=void 0,s(i).lineNumber=void 0},p=k(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>s(d)}));var m=pe(),g=ne(m);{var $=w=>{var _=zg(),L=C(_);U(L,"colspan",2);var x=C(L),I=C(x);{var S=b=>{var E=pe(),D=ne(E);Mt(D,()=>s(o),()=>({diffFile:e.diffFile,side:O.old,lineNumber:s(l)?.oldLineNumber||0,onClose:c})),F(b,E)};q(I,b=>{(s(r)||s(p)>0)&&s(a)&&b(S)})}var y=X(I,2);{var h=b=>{var E=pe(),D=ne(E);Mt(D,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:O.new,lineNumber:s(l)?.newLineNumber||0,onClose:c})),F(b,E)};q(y,b=>{(s(r)||s(p)>0)&&s(f)&&b(h)})}T(x),T(L),T(_),J(()=>{U(_,"data-line",`${e.lineNumber}-widget`),G(x,`width: ${s(p)}px`)}),F(w,_)};q(g,w=>{s(d)&&w($)})}F(t,m),fe()}var Gg=new Set(["$$slots","$$events","$$legacy"]),Yg=B("<!> <!> <!> <!>",1),qg=B('<div><style data-select-style=""></style> <div class="unified-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><table><colgroup><col class="unified-diff-table-num-col"/><col class="unified-diff-table-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">line number</th><th scope="col">line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Wl(t,e){de(e,!0);let n=ue(e,Gg),i=ce(Le(xa(e.diffFile))),r=ce(Le(e.diffFile.unifiedLineLength.toString())),o=ce(null),l=k(Zr()),a=k($n()),f={current:()=>{}},u={current:void 0},d=()=>{let y=e.diffFile;oe(i,xa(y),!0),oe(r,y.unifiedLineLength.toString(),!0)};ye(()=>{f.current?.(),d(),f.current=e.diffFile.subscribe(d)}),Ve(()=>f.current());let c=y=>{let h=y.target;if(!s(o))return;if(h&&h?.nodeName==="BUTTON"){Ln();return}let b=ro(h);if(!(b&&b!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let E=h.getAttribute("data-state");if(E){E==="extend"||E==="hunk"||E==="widget"?u.current!==!1&&(u.current=!1,s(o).innerHTML="",Ln()):u.current!==!0&&(u.current=!0,s(o).innerHTML=`#${b} [data-state="extend"] {user-select: none} 
#${b} [data-state="hunk"] {user-select: none} 
#${b} [data-state="widget"] {user-select: none}`,Ln());return}h=h.parentElement}},p=k(()=>({fontSize:s(l)+"px",fontFamily:"Menlo, Consolas, monospace"})),m=k(io({text:()=>s(r),font:()=>s(p)})),g=k(()=>Math.max(40,s(m)+10));var $=qg(),w=C($);lt(w,()=>y=>oe(o,y,!0));var _=X(w,2),L=C(_),x=X(C(L),2),I=C(x);li(I,17,()=>s(i),ai,(y,h)=>{var b=Yg(),E=ne(b);Zs(E,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var D=X(E,2);Bl(D,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=X(D,2);jl(M,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var W=X(M,2);Pl(W,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),F(y,b)});var S=X(I);Zs(S,{get index(){return e.diffFile.unifiedLineLength},get lineNumber(){return e.diffFile.unifiedLineLength},get diffFile(){return e.diffFile}}),T(x),T(L),T(_),T($),J(y=>{Ne($,1,`unified-diff-view ${s(a)?"unified-diff-view-wrap":"unified-diff-view-normal"} w-full`),G(_,y),Ne(L,1,`unified-diff-table w-full border-collapse border-spacing-0 ${s(a)?"table-fixed":""}`)},[()=>`${Fe}: ${Math.round(s(g))}px; font-family: Menlo, Consolas, monospace; font-size: var(${nt})`]),we("mousedown",x,c),F(t,$),fe()}rt(["mousedown"]);var Kg=new Set(["$$slots","$$events","$$legacy"]),Zg=B('<div class="diff-tailwindcss-wrapper" data-component="git-diff-view"><div class="diff-style-root"><div><!></div></div></div>');function Xs(t,e){de(e,!0);let n=ue(e,Kg),i={current:null},o=k(()=>{if(i.current?.clear?.(),e.diffFile){let y=Zi.createInstance({});return y._mergeFullBundle(e.diffFile._getFullBundle()),i.current=y,y}else if(e.data){let y=e.data,h=new Zi(y.oldFile?.fileName||"",y.oldFile?.content||"",y.newFile?.fileName||"",y.newFile?.content||"",y.hunks||[],y.oldFile?.fileLang||"",y.newFile?.fileLang||"");return i.current=h,h}return null});ye(()=>{e.onDiffFileCreated?.(s(o))});let a=k(()=>s(o)?.getId?.()),f=Le({side:e.initialWidgetState?.side,lineNumber:e.initialWidgetState?.lineNumber}),u=ce(null),d=k(()=>e.diffViewHighlight??!0),c=k(()=>e.diffViewTheme);ye(()=>{f.side=e.initialWidgetState?.side,f.lineNumber=e.initialWidgetState?.lineNumber}),ye(()=>{(e.data||e.diffFile)&&(f.side=void 0,f.lineNumber=void 0)});let p={current:()=>{}},m=k(di());ye(()=>{p?.current?.(),!(!s(m)||!s(o)||!e.diffFile)&&(e.diffFile._addClonedInstance(s(o)),p.current=()=>e.diffFile?._delClonedInstance(s(o)))}),Ve(()=>p.current()),ye(()=>{!s(o)||!s(m)||(s(o).initTheme(s(c)),s(o).initRaw(),s(o).buildSplitDiffLines(),s(o).buildUnifiedDiffLines())}),ye(()=>{if(!(!s(o)||!s(m))&&(s(c),s(d))){let y=e.registerHighlighter;y?(y.name!==s(o)._getHighlighterName()||y.type!==s(o)._getHighlighterType()||y.type!=="class")&&(s(o).initSyntax({registerHighlighter:y}),s(o).notifyAll()):(!s(o)._getIsCloned()&&s(o)._getHighlighterName()!==gr.name||s(o)._getHighlighterType()!=="class")&&(s(o).initSyntax(),s(o).notifyAll())}});let _={current:()=>{}};ye(()=>{if(_?.current?.(),!s(m)||!s(o)||!s(u))return;s(c);let y=()=>{s(u)?.setAttribute("data-theme",s(o)._getTheme()||"light"),s(u)?.setAttribute("data-highlighter",s(o)._getHighlighterName())};y(),_.current=s(o).subscribe(y)}),Ve(()=>_.current()),Rc(n),Oc(n),Pc(n),Zc(n),Jc(n),eu(n),nu(n),ru(n),qc(f),Gc(n),Wc(()=>s(o)?.getId()||""),Vc(()=>s(u));var x=pe(),I=ne(x);{var S=y=>{var h=Zg(),b=C(h),E=C(b),D=C(E);{var M=P=>{Ol(P,{get diffFile(){return s(o)}})},W=P=>{Wl(P,{get diffFile(){return s(o)}})};q(D,P=>{!e.diffViewMode||e.diffViewMode&Pt.Split?P(M):P(W,-1)})}T(E),T(b),T(h),lt(h,()=>P=>oe(u,P,!0)),J((P,K)=>{U(h,"data-theme",P),U(h,"data-highlighter",K),G(b,`${nt}:${e.diffViewFontSize||14}px`),U(E,"id",s(m)?`diff-root${s(a)}`:void 0),Ne(E,1,"diff-view-wrapper"+(e.class?` ${e.class}`:"")),G(E,e.style)},[()=>s(o)?._getTheme()||"light",()=>s(o)?._getHighlighterName()]),F(y,h)};q(I,y=>{s(o)&&y(S)})}F(t,x),fe()}os.name="@git-diff-view/svelte";function Js(t){let e=/[.*+?^${}()|[\]\\]/g;return t.replace(e,"\\$&")}function mu(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function gu(t){if(!t)return!1;let e=Date.now()-1440*60*1e3;return t*1e3>e}function pr(){let t=N;t.currentSubjectData=null,t.currentItemId=null,t.currentWcode=null,t.currentTags=null,t.currentSeries=null,t.currentCommitMessage=null,t.currentFieldUpdates=null,t.currentTagUpdates=null,t.currentSeriesUpdate=null}function Xg(){return!N.csvData||N.currentIndex>=N.csvData.length?"subject":N.csvData[N.currentIndex]?.type||"subject"}function Ul(){if(!N.currentSubjectData)return!1;let t=Xg(),n=document.getElementById("static-wcode-input").value.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=(N.currentSubjectData.infobox||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),o=n!==r;if(t==="subject"){let a=document.getElementById("static-tags-input").value.split(" ").filter(m=>m),f=document.getElementById("static-series-checkbox").checked,u=N.currentSubjectData.metaTags||[],d=N.currentSubjectData.series||!1,c=!mu(a,u);return o||c||f!==d}return o}function Oi(){let t=document.querySelector("#static-buttons-container button#process-confirm-update");if(!t)return;Ul()?(t.textContent="\u786E\u8BA4\u66F4\u65B0",t.disabled=!1):(t.textContent="\u786E\u8BA4\u66F4\u65B0\uFF08\u65E0\u5B9E\u8D28\u4FEE\u6539\uFF09",t.disabled=!1)}function oo(t,e,n,i){let r=Object.keys(t||{}),o=[];return r.length&&o.push(`\u66F4\u65B0${r.join("\u3001")}`),(i==="subject"||!i)&&(e?.add.length&&o.push(`\u6DFB\u52A0\u6807\u7B7E${e.add.join("\u3001")}`),e?.remove.length&&o.push(`\u5220\u9664\u6807\u7B7E${e.remove.join("\u3001")}`),n?.hasUpdate&&o.push(n.newValue?"\u6807\u8BB0\u4E3A\u7CFB\u5217":"\u53D6\u6D88\u7CFB\u5217\u6807\u8BB0")),o.filter(l=>l).join("\uFF1B")||"\u66F4\u65B0\u6761\u76EE\u4FE1\u606F"}function Zo(t,e,n){try{let i=(t||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),r=(e||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),a=Xd("\u7F16\u8F91\u524D",i,"\u7F16\u8F91\u540E",r,"text","text",{context:1});a.init(),a.buildSplitDiffLines();let f=document.getElementById(n);if(!f)return;let u=f._diffViewInstance;u&&Wo(u),f.innerHTML="";let d=Kr(Xs,{target:f,props:{diffFile:a,diffViewMode:N.diffViewMode==="unified"?Pt.Unified:Pt.Split,diffViewFontSize:13,diffViewTheme:"light",diffViewHighlight:!0,diffViewWrap:!0}});f._diffViewInstance=d,n==="static-content-diff-container"&&setTimeout(()=>{let p=document.getElementById("static-wcode-input");if(!p)return;let m=p.closest(".edit-row");if(!m)return;let g=m.querySelector(".diff-section");g&&(p.style.height="auto",p.style.height=Math.min(p.scrollHeight,g.offsetHeight)+"px")},0);let c=document.getElementById("diff-error");c&&(c.style.display="none")}catch(i){console.error("Diff generation error:",i);let r=document.getElementById("diff-error");r&&(r.textContent=`\u5DEE\u5F02\u663E\u793A\u9519\u8BEF: ${i.message}`,r.style.display="block")}}function Qs(t,e,n){let i=t.join(" "),r=e.join(" ");Zo(i,r,n)}function vu(t,e){let n={};return Object.keys(t).forEach(i=>{if(!["id","tags","series","type"].includes(i.toLowerCase())){let r=t[i];r!==void 0&&(n[i]=r)}}),n}function _u(t,e){if((t.type||"subject")!=="subject")return{add:[],remove:[]};let r=(t.tags||"").split(" ").filter(a=>a),o=[],l=[];return r.forEach(a=>{a.startsWith("-")?l.push(a.slice(1)):o.push(a)}),{add:o,remove:l}}function bu(t,e){if((t.type||"subject")!=="subject")return{hasUpdate:!1};if(t.series===void 0||t.series===null||t.series==="")return{hasUpdate:!1};let i=t.series.trim().toLowerCase(),r=i==="true"||i==="1"||i==="yes";return{hasUpdate:r!==e,newValue:r}}function wu(t,e){let n=t;return Object.entries(e).forEach(([i,r])=>{r=r.replaceAll("\\n",`
`);let o=new RegExp(`\\|${Js(i)}\\s*=.*`,"i");if(o.test(n))n=n.replace(o,`|${i}= ${r}`);else{let l=n.split(`
`);l.splice(-1,0,`|${i}= ${r}`),n=l.join(`
`)}}),n}function xu(t,e){let n=new Set(t);return e.add.forEach(i=>n.add(i)),e.remove.forEach(i=>n.delete(i)),[...n]}var $u=Jl(yu());var Jg={subject:"subject",character:"character",crt:"character",person:"person",prsn:"person"};function Eu(t,e){try{N.csvData=Qg(t),N.currentIndex=0,N.retryCount={},N.previousItem=null,localStorage.setItem("bgmCsvData",JSON.stringify(N.csvData)),localStorage.setItem("bgmCurrentIndex","0"),Bi(),Yt(e+"\u52A0\u8F7D\u6210\u529F")}catch(n){Yt("CSV\u89E3\u6790\u9519\u8BEF: "+n.message),console.error(n)}finally{vn(),document.querySelectorAll("#static-buttons-container button").forEach(n=>{n.disabled=!1})}}function Lu(t){let n=t.target.files?.[0];if(!n)return;document.querySelectorAll("#static-buttons-container button").forEach(r=>{r.disabled=!0}),Wi("\u6B63\u5728\u89E3\u6790CSV\u6587\u4EF6...");let i=new FileReader;i.onload=function(r){let o=r.target.result;Eu(o,"CSV\u6587\u4EF6")},i.readAsText(n)}function ku(t){document.querySelectorAll("#static-buttons-container button").forEach(e=>{e.disabled=!0}),Wi("\u6B63\u5728\u89E3\u6790\u7C98\u8D34\u7684CSV..."),Eu(t,"\u7C98\u8D34\u7684CSV")}function Qg(t){let e=$u.default.parse(t,{header:!0,skipEmptyLines:!0,transform:a=>a.trim()});if(e.errors.length){let a=e.errors[0];throw new Error(`\u7B2C${a.row!==void 0?a.row+1:"?"}\u884C: ${a.message}`)}let n=e.meta.fields;if(!n||n.length===0)throw new Error("CSV\u6587\u4EF6\u4E3A\u7A7A\u6216\u683C\u5F0F\u9519\u8BEF");let i=n.findIndex(a=>a.toLowerCase()==="id");if(i===-1)throw new Error('CSV\u5FC5\u987B\u5305\u542B"ID"\u5217');let r=n.findIndex(a=>a.toLowerCase()==="type"),o=n.filter((a,f)=>f!==i&&f!==r),l=[];for(let a of e.data){let f=a[n[i]]?.trim();if(!f)continue;let u=r!==-1&&a[n[r]]?.trim().toLowerCase()||"subject",d={id:f,type:Jg[u]||"subject"};for(let c of o){let p=a[c];p!==void 0&&(d[c]=p.trim())}l.push(d)}if(l.length===0)throw new Error("\u672A\u627E\u5230\u6709\u6548\u7684\u6570\u636E\u884C");return l}function Bi(){N.currentView="setup";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container");document.getElementById("edit-regions").style.display="none",Ql(),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">\u57FA\u672C\u8BBE\u7F6E</h3>
                <div class="setup-columns">
                    <div class="setup-column">
                        <div class="form-group">
                            <label>\u63D0\u4EA4\u65B9\u5F0F\u9009\u62E9</label>
                            <div class="method-option-group">
                                <input type="radio" id="method-patch" name="submit-method" value="patch" ${N.submitMethod==="patch"?"checked":""}>
                                <label for="method-patch">Private API</label>
                                <input type="radio" id="method-post" name="submit-method" value="post" ${N.submitMethod==="post"?"checked":""}>
                                <label for="method-post">\u65E7 API</label>
                            </div>
                        </div>

                        <div id="patch-method-options" class="form-group ${N.submitMethod==="patch"?"":"hidden"}">
                            <label for="setup-access-token">Access Token</label>
                            <input type="password" id="setup-access-token" value="${N.accessToken}">
                            <p class="formhash-hint">
                                \u4F60\u53EF\u4EE5\u5728<a href="https://next.bgm.tv/demo/access-token" target="_blank">\u4E2A\u4EBA\u4EE4\u724C\u9875</a>\u4E2D\u83B7\u53D6 Access Token
                            </p>
                        </div>

                        <div id="post-method-options" class="form-group ${N.submitMethod==="post"?"":"hidden"}">
                            <label for="setup-formhash">Formhash</label>
                            <input type="text" id="setup-formhash" value="${N.formhash}">
                            <p class="formhash-hint">
                                \u5982\u4F55\u83B7\u53D6formhash\uFF1A<br>
                                1. \u6253\u5F00\u6761\u76EE\u7F16\u8F91\u9875\u9762\uFF08\u5982 <a href="https://bgm.tv/subject/354667/edit_detail">https://bgm.tv/subject/354667/edit_detail</a>\uFF09<br>
                                2. \u5728\u6D4F\u89C8\u5668\u63A7\u5236\u53F0\u6267\u884C\uFF1A<code>document.querySelector('[name=formhash]').value</code><br>
                                3. \u5C06\u8FD4\u56DE\u7684\u503C\u590D\u5236\u5230\u4E0A\u65B9\u8F93\u5165\u6846
                            </p>
                        </div>

                        <div class="form-group">
                            <label>Diff \u663E\u793A\u6A21\u5F0F</label>
                            <div class="method-option-group">
                                <input type="radio" id="diff-mode-split" name="diff-view-mode" value="split" ${N.diffViewMode==="split"?"checked":""}>
                                <label for="diff-mode-split">\u5DE6\u53F3\u5BF9\u7167</label>
                                <input type="radio" id="diff-mode-unified" name="diff-view-mode" value="unified" ${N.diffViewMode==="unified"?"checked":""}>
                                <label for="diff-mode-unified">\u4E0A\u4E0B\u7EDF\u4E00</label>
                            </div>
                        </div>
                    </div>
                    <div class="setup-column">
                        <div class="form-group">
                            <label for="setup-csv-file">CSV\u6587\u4EF6 (\u5305\u542Btype\u3001ID\u3001\u8981\u66F4\u65B0\u7684\u5B57\u6BB5\u5217\u3001tags\u5217\u6216series\u5217)</label>
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
                            ${N.csvData?`<div class="csv-loaded-info">\u5DF2\u52A0\u8F7DCSV: ${N.csvData.length} \u6761\u8BB0\u5F55</div>`:""}
                            <p class="csv-hint">
                                type\u5217\u53EF\u9009\u503C\u4E3A subject\uFF08\u6761\u76EE\uFF09\u3001character/crt\uFF08\u89D2\u8272\uFF09\u3001person/prsn\uFF08\u4EBA\u7269\uFF09\uFF0C\u4E0D\u586B\u9ED8\u8BA4\u4E3Asubject<br>
                                tags\u5217\u4F7F\u7528\u7A7A\u683C\u5206\u9694\u6807\u7B7E\uFF0C\u524D\u7F00\u5E26"-"\u7684\u6807\u7B7E\u8868\u793A\u5220\u9664\u8BE5\u6807\u7B7E<br>
                                series\u5217\u4F7F\u7528true\u6216false\u8868\u793A\u662F\u5426\u6807\u8BB0\u4E3A\u7CFB\u5217<br>
                                \u89D2\u8272\u548C\u4EBA\u7269\u4EC5\u652F\u6301 Private API \u63D0\u4EA4\u65B9\u5F0F
                            </p>
                        </div>
                        ${N.csvData?`
                        <div class="form-group">
                            <label>\u5904\u7406\u8FDB\u5EA6</label>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${N.currentIndex/N.csvData.length*100}%"></div>
                            </div>
                            <div class="progress-info">\u4E0A\u6B21\u8FDB\u5EA6: ${N.currentIndex}/${N.csvData.length}</div>
                            <button id="setup-reset-progress" class="secondary" style="margin-top: 10px;">\u91CD\u7F6E\u8FDB\u5EA6</button>
                        </div>
                        `:""}
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="setup-start-processing" class="primary">\u5F00\u59CB\u5904\u7406</button>
        `);let n=document.getElementById("setup-access-token");n&&n.addEventListener("input",u=>{N.accessToken=u.target.value,GM_setValue("bgmAccessToken",N.accessToken)});let i=document.getElementById("setup-formhash");i&&i.addEventListener("input",u=>{N.formhash=u.target.value,GM_setValue("bgmFormhash",N.formhash)}),document.querySelectorAll('input[name="submit-method"]').forEach(u=>{u.addEventListener("change",d=>{N.submitMethod=d.target.value,GM_setValue("bgmSubmitMethod",N.submitMethod);let c=document.getElementById("patch-method-options"),p=document.getElementById("post-method-options");c&&c.classList.toggle("hidden",N.submitMethod!=="patch"),p&&p.classList.toggle("hidden",N.submitMethod!=="post")})}),document.querySelectorAll('input[name="diff-view-mode"]').forEach(u=>{u.addEventListener("change",d=>{N.diffViewMode=d.target.value,localStorage.setItem("bgmDiffViewMode",N.diffViewMode)})});let l=document.getElementById("setup-csv-file");l&&(l.addEventListener("change",Lu),l.addEventListener("change",()=>{let u=l.files?.[0]?.name||"",d=document.getElementById("setup-csv-file-name");d&&(d.textContent=u)}));let a=document.getElementById("setup-csv-btn");a&&l&&a.addEventListener("click",u=>{u.preventDefault(),l.click()});let f=document.getElementById("setup-paste-csv-btn");f&&f.addEventListener("click",async()=>{try{let u=await navigator.clipboard.readText();if(!u||!u.trim()){Yt("\u526A\u8D34\u677F\u5185\u5BB9\u4E0D\u662F\u6709\u6548\u7684CSV");return}let d=document.getElementById("setup-csv-file-name");d&&(d.textContent="\u5DF2\u4ECE\u526A\u8D34\u677F\u7C98\u8D34"),ku(u)}catch(u){Yt("\u8BFB\u53D6\u526A\u8D34\u677F\u5931\u8D25: "+u.message)}})}function Su(t){N.currentView="processing";let{currentItem:e,wikiData:n,historyData:i}=t;N.currentSubjectData=n,N.currentItemId=e.id;let r=e.type||"subject";N.currentWcode=null,N.currentTags=null,N.currentSeries=null,N.currentCommitMessage=null;let o=document.getElementById("core-content"),l=document.getElementById("static-buttons-container"),a=document.getElementById("edit-regions");a&&(a.style.display="block"),lo(),ji(N.currentIndex,N.totalItems);let f=n.name||"\u672A\u77E5\u540D\u79F0",u=n.infobox||"",d=r==="subject"?n.metaTags||[]:[],c=r==="subject"&&n.series||!1,p=vu(e,u),m=_u(e,d),g=bu(e,c);N.currentFieldUpdates=p,N.currentTagUpdates=m,N.currentSeriesUpdate=g;let $={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"},w=document.getElementById("static-last-update"),_=i[0]?.createdAt,L=_?new Date(_*1e3):null,x=i[0]?.creator?.username||"",I=i[0]?.commitMessage||"",S=gu(_);if(L&&w){let{editPagePath:A}=Pi(r,e.id);w.innerHTML=`
            <a href="${A}" target="_blank">
                \u6700\u540E\u66F4\u65B0: ${L.toLocaleString()} ${x} ${I}
            </a>
        `,w.style.color=S?"#d9534f":"",w.style.display="block"}else w&&(w.style.display="none");let y=document.getElementById("prev-item-link");if(y&&N.previousItem&&N.currentIndex>0){let A=N.previousItem.type,{editPagePath:Y}=Pi(A,N.previousItem.id);y.innerHTML=`
            <i class="fas fa-arrow-left"></i> \u4E0A\u4E00\u4E2A:
            <a href="${Y}" target="_blank">
                ${N.previousItem.name}\uFF08${N.previousItem.id}\uFF09
            </a>
        `,y.style.display="block"}else y&&(y.style.display="none");let h=document.getElementById("static-commit-input"),b=document.getElementById("static-lock-commit"),E=oo(p,m,g,r);h.value=N.isCommitMessageLocked?N.lockedCommitMessage:E,b.innerHTML=`<i class="fas ${N.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>`,b.title=N.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981";let D=document.getElementById("static-wcode-input"),M=document.getElementById("static-content-diff-container"),W=wu(u,p);D.value=W,Zo(u,W,"static-content-diff-container"),M&&(M.style.display="block");let P=document.getElementById("static-tags-area"),K=document.getElementById("static-tags-diff-section");if(r==="subject"){let A=document.getElementById("static-tags-input"),Y=xu(d,m);A.value=Y.join(" "),Qs(d,Y,"static-tags-diff-container"),P&&(P.style.display="block"),K&&(K.style.display="block")}else P&&(P.style.display="none"),K&&(K.style.display="none");let ee=document.getElementById("static-series-area");if(r==="subject"){let A=document.getElementById("static-series-checkbox"),Y=g.hasUpdate?g.newValue:c;A.checked=Y,N.currentSeries=Y,ee&&(ee.style.display="block")}else ee&&(ee.style.display="none");let re=Pi(r,e.id).editPagePath.replace("/edit",""),Z=$[r]||"\u6761\u76EE";o&&(o.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${Z}\uFF1A<a href="${re}" target="_blank">${f}</a>\uFF08${e.id}\uFF09[${Z}]
                </div>
            </div>
        `),l&&(l.innerHTML=`
            <button id="process-skip-update" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-confirm-update" class="primary">\u786E\u8BA4\u66F4\u65B0</button>
        `),Oi()}function Nu(t,e){N.currentView="processing";let n=document.getElementById("core-content"),i=document.getElementById("static-buttons-container"),r=document.getElementById("edit-regions");r&&(r.style.display="none"),lo(),ji(N.currentIndex,N.totalItems);let o=t.id,l=t.type||"subject",f={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[l]||"\u6761\u76EE",u=(N.retryCount[o]||0)+1;N.retryCount[o]=u,n&&(n.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${f}\uFF1A<a href="https://bgm.tv/${l}/${o}" target="_blank">\u67E5\u770B${f}</a>\uFF08${o}\uFF09
                </div>
                <div class="status-box error">
                    \u65E0\u6CD5\u83B7\u53D6${f}\u4FE1\u606F: ${e}
                    ${u>1?`<br>\u5DF2\u91CD\u8BD5 ${u-1} \u6B21`:""}
                </div>
                <p>\u662F\u5426\u7EE7\u7EED\u5904\u7406\uFF1F</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${N.currentIndex/N.totalItems*100}%"></div>
                </div>
            </div>
        `),i&&(i.innerHTML=`
            <button id="process-skip-error" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-error" class="primary">\u91CD\u8BD5</button>
        `)}function Iu(t){N.currentView="processing";let e=document.getElementById("core-content"),n=document.getElementById("static-buttons-container"),i=document.getElementById("edit-regions");i&&(i.style.display="none"),lo(),ji(N.currentIndex,N.totalItems);let r=N.currentItemId||"",o=(N.retryCount[r]||0)+1;N.retryCount[r]=o;let a=N.currentSubjectData?.name||"\u672A\u77E5\u540D\u79F0",u=(N.csvData?N.csvData[N.currentIndex]:null)?.type||"subject",c={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[u]||"\u6761\u76EE";e&&(e.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${c}\uFF1A<a href="https://bgm.tv/${u}/${r}" target="_blank">${a}</a>\uFF08${r}\uFF09
                </div>
                <div class="status-box error">
                    \u63D0\u4EA4\u66F4\u65B0\u5931\u8D25: ${t}
                </div>
                <p>\u662F\u5426\u91CD\u8BD5\u66F4\u65B0\uFF1F</p>
            </div>
        `),n&&(n.innerHTML=`
            <button id="process-skip-update-fail" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-update" class="primary">\u91CD\u8BD5</button>
        `)}function Tu(){N.currentView="completed";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container"),n=document.getElementById("edit-regions");n&&(n.style.display="none"),lo(),ji(N.totalItems,N.totalItems),t&&(t.innerHTML=`
            <div>
                <h3 class="section-title">\u5904\u7406\u5B8C\u6210</h3>
                <div class="status-box info">\u6240\u6709\u6761\u76EE\u5904\u7406\u5B8C\u6BD5</div>
                <div class="stats-container">
                    <div class="stats-item">
                        <span class="stats-label">\u603B\u6761\u76EE</span>
                        <span class="stats-value">${N.totalItems}</span>
                    </div>
                </div>
            </div>
        `),e&&(e.innerHTML=`
            <button id="completed-back-to-setup" class="primary">\u8FD4\u56DE\u8BBE\u7F6E</button>
        `)}function ev(t){let e=t.trim();if(!e)return new Headers;let n=e.split(`\r
`).map(i=>{let r=i.split(":");return[r[0].trim(),r[1].trim()]});return new Headers(n)}function tv(t,e){let n=ev(e.responseHeaders),i=typeof e.response=="string"?new Blob([e.response],{type:n.get("Content-Type")||"text/plain"}):e.response;return new Gl(i,{statusCode:e.status,statusText:e.statusText,headers:n,finalUrl:e.finalUrl,redirected:e.finalUrl===t.url})}var Gl=class t{constructor(e,n){this.rawBody=e,this.init=n,this.body=e.stream();let{headers:i,statusCode:r,statusText:o,finalUrl:l,redirected:a}=n;this.headers=i,this.status=r,this.statusText=o,this.url=l,this.type="basic",this.redirected=a,this._bodyUsed=!1}get bodyUsed(){return this._bodyUsed}get ok(){return this.status<300}arrayBuffer(){if(this.bodyUsed)throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.arrayBuffer()}blob(){if(this.bodyUsed)throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");return this._bodyUsed=!0,Promise.resolve(this.rawBody.slice(0,this.rawBody.size,this.rawBody.type))}clone(){if(this.bodyUsed)throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");return new t(this.rawBody,this.init)}formData(){if(this.bodyUsed)throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text().then(nv)}async json(){if(this.bodyUsed)throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");return this._bodyUsed=!0,JSON.parse(await this.rawBody.text())}text(){if(this.bodyUsed)throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text()}async bytes(){if(this.bodyUsed)throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");return this._bodyUsed=!0,new Uint8Array(await this.rawBody.arrayBuffer())}};function nv(t){let e=new FormData;return t.trim().split("&").forEach(function(n){if(n){let i=n.split("="),r=i.shift()?.replace(/\+/g," "),o=i.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}async function ea(t,e){let n=new Request(t,e),i;return e?.body&&(i=await n.text()),await iv(n,e,i)}function iv(t,e,n){return new Promise((i,r)=>{if(t.signal&&t.signal.aborted)return r(new DOMException("Aborted","AbortError"));GM.xmlHttpRequest({url:t.url,method:sv(t.method.toUpperCase()),headers:Object.fromEntries(new Headers(e?.headers).entries()),data:n,responseType:"blob",onload(o){try{i(tv(t,o))}catch(l){r(l)}},onabort(){r(new DOMException("Aborted","AbortError"))},ontimeout(){r(new TypeError("Network request failed, timeout"))},onerror(o){r(new TypeError("Failed to fetch: "+o.finalUrl))}})})}var rv=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function ov(t,e){return t.includes(e)}function sv(t){if(ov(rv,t))return t;throw new Error(`unsupported http method ${t}`)}function Cu(){if(N.submitMethod==="patch"&&!N.accessToken){Yt("\u8BF7\u8F93\u5165Access Token");return}if(N.submitMethod==="post"&&!N.formhash){Yt("\u8BF7\u8F93\u5165Formhash");return}if(!N.csvData||N.csvData.length===0){Yt("\u8BF7\u4E0A\u4F20\u6709\u6548\u7684CSV\u6587\u4EF6");return}N.totalItems=N.csvData.length,N.processing=!0,N.paused=!1;let t=document.getElementById("core-content");t&&(t.innerHTML=`
            <div>
                <div class="item-info">\u51C6\u5907\u5904\u7406\u7B2C\u4E00\u4E2A\u6761\u76EE...</div>
            </div>
        `);let e=document.getElementById("static-buttons-container");e&&(e.innerHTML=`
            <button id="process-cancel" class="danger">\u53D6\u6D88</button>
        `),ci()}function ci(t=!1){if(N.paused||!N.processing)return;if(N.currentIndex>=N.totalItems){Tu();return}let e=N.csvData[N.currentIndex],n=e.type||"subject";if(n!=="subject"&&N.submitMethod==="post"){Yt("\u89D2\u8272\u548C\u4EBA\u7269\u4EC5\u652F\u6301 Private API (PATCH) \u63D0\u4EA4\u65B9\u5F0F\uFF0C\u8BF7\u5728\u8BBE\u7F6E\u4E2D\u5207\u6362");return}t||ji(N.currentIndex,N.totalItems),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!0}),Wi("\u6B63\u5728\u83B7\u53D6\u6761\u76EE\u4FE1\u606F...");let{wikiPath:i,historyPath:r}=Pi(n,e.id),o=N.submitMethod==="patch"?{Authorization:`Bearer ${N.accessToken}`,Accept:"application/json"}:{Accept:"application/json"};Promise.all([ea(i,{headers:o}),ea(r,{headers:o})]).then(async([l,a])=>{if(!l.ok)throw new Error(`HTTP ${l.status}`);if(!a.ok)throw new Error(`HTTP ${a.status}`);let f=await l.json(),u=await a.json();return{currentItem:e,wikiData:f,historyData:u}}).then(l=>{N.retryCount[l.currentItem.id]=0,vn(),document.querySelectorAll("#static-buttons-container button").forEach(a=>{a.disabled=!1}),Su(l)}).catch(l=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(a=>{a.disabled=!1}),Nu(e,l.message)})}function Fu(t,e,n,i,r,o,l,a,f){N.processing=!0;let u=o.type||"subject";if(N.submitMethod==="patch"){let{wikiPath:d,patchBodyKey:c}=Pi(u,t),p={commitMessage:l};u==="subject"?p.subject={infobox:e,metaTags:n,series:i}:p[c]={infobox:e},ea(d,{method:"PATCH",headers:{Authorization:`Bearer ${N.accessToken}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(p)}).then(m=>m.ok?m:m.text().then(g=>{throw new Error(`HTTP ${m.status} - ${g||"\u66F4\u65B0\u5931\u8D25"}`)})).then(()=>{vn(),a()}).catch(m=>{f(m instanceof Error?m:new Error(String(m)))})}else if(u==="subject"){let d=e.replace(/\n/g,`\r
`),c=new FormData;c.append("formhash",N.formhash),c.append("subject_title",N.currentSubjectData?.name||""),c.append("platform",N.currentSubjectData?.platform||""),c.append("subject_infobox",d),c.append("subject_summary",N.currentSubjectData?.summary||""),c.append("subject_meta_tags",n.join(" ")),c.append("editSummary",l),c.append("series",i?"1":"0"),c.append("submit","\u63D0\u4EA4");let p=new URLSearchParams;c.forEach((m,g)=>{p.append(g,m)}),GM.xmlHttpRequest({method:"POST",url:`https://bgm.tv/subject/${t}/new_revision`,data:p.toString(),headers:{"Content-Type":"application/x-www-form-urlencoded"},onload:function(m){vn(),new RegExp(`${Js(r)} \u7684\u65B0\u63CF\u8FF0`).test(m.responseText)?f(new Error("\u66F4\u65B0\u5931\u8D25\uFF0C\u53EF\u80FD\u662Fformhash\u65E0\u6548\u6216\u6743\u9650\u4E0D\u8DB3")):a()},onerror:function(m){vn(),f(new Error(`\u7F51\u7EDC\u9519\u8BEF: ${m.message}`))},onabort:function(){vn(),f(new Error("\u8BF7\u6C42\u5DF2\u4E2D\u6B62"))},ontimeout:function(){vn(),f(new Error("\u8BF7\u6C42\u8D85\u65F6"))}})}else f(new Error("\u89D2\u8272\u548C\u4EBA\u7269\u4EC5\u652F\u6301 Private API (PATCH) \u63D0\u4EA4\u65B9\u5F0F"))}function Du(t){switch(t){case"setup-start-processing":Cu();break;case"setup-reset-progress":N.currentIndex=0,N.retryCount={},N.previousItem=null,localStorage.setItem("bgmCurrentIndex","0"),Bi();break}}function Au(t){if(!N.csvData)return;let e=N.csvData[N.currentIndex],n=N.currentSubjectData,i=e?.id||N.currentItemId||"",r=n?.name||"\u672A\u77E5\u540D\u79F0",o=e?.type||"subject";function l(){return{id:i,name:r,type:o}}switch(t){case"process-confirm-update":{let a=document.getElementById("static-wcode-input").value,f=o==="subject"?document.getElementById("static-tags-input").value.split(" ").filter(p=>p):[],u=o==="subject"?document.getElementById("static-series-checkbox").checked:!1,d=document.getElementById("static-commit-input").value||oo(N.currentFieldUpdates,N.currentTagUpdates,N.currentSeriesUpdate,o);if(!Ul()){Yt("\u6CA1\u6709\u68C0\u6D4B\u5230\u5B9E\u8D28\u4FEE\u6539\uFF0C\u5DF2\u8DF3\u8FC7\u66F4\u65B0"),N.previousItem=l(),N.currentIndex++,pr(),zn(),ci();return}document.querySelectorAll("#static-buttons-container button").forEach(p=>{p.disabled=!0}),Wi("\u6B63\u5728\u63D0\u4EA4\u66F4\u65B0..."),Fu(i,a,f,u,r,e,d,()=>{N.previousItem=l(),N.currentIndex++,pr(),zn(),ci()},p=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(m=>{m.disabled=!1}),Iu(p.message)});break}case"process-skip-update":N.previousItem=l(),N.currentIndex++,pr(),zn(),ci();break;case"process-confirm-continue":N.previousItem=l(),N.currentIndex++,pr(),zn(),ci();break;case"process-skip-error":N.currentIndex++,pr(),zn(),ci();break;case"process-retry-error":{let a=N.retryCount[i]||0;Yt(`\u6B63\u5728\u91CD\u8BD5\uFF08${a}\u6B21\uFF09...`),ci();break}case"process-skip-update-fail":N.previousItem=l(),N.currentIndex++,pr(),zn(),ci();break;case"process-retry-update":{let a=N.retryCount[i]||0;Yt(`\u6B63\u5728\u91CD\u8BD5\uFF08${a}\u6B21\uFF09...`),ci(!0);break}}}function Mu(t){t==="completed-back-to-setup"&&(Bi(),av())}function av(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Ru(){let t=document.getElementById("bgm-float-button");return t||(t=document.createElement("div"),t.id="bgm-float-button",t.innerHTML='<i class="fas fa-tools"></i>',document.body.appendChild(t),t.addEventListener("click",()=>{let e=document.getElementById("bgm-tool-container");e&&(e.style.display="flex",t&&(t.style.display="none"))})),t}function Hu(){let t=Ru();if(t.style.display="none",document.getElementById("bgm-tool-container")){document.getElementById("bgm-tool-container").style.display="flex";return}let e=document.createElement("div");e.id="bgm-tool-container",e.innerHTML=`
        <div id="bgm-tool-header">
            bangumi wiki \u6279\u91CF\u66F4\u65B0\u5DE5\u5177
            <div id="bgm-tool-header-actions">
                <span id="bgm-tool-settings" title="\u8BBE\u7F6E"><i class="fas fa-cog"></i></span>
                <span id="bgm-tool-close">\xD7</span>
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
                            <button id="static-lock-commit" class="secondary" title="${N.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981"}">
                                <i class="fas ${N.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>
                            </button>
                        </div>
                    </div>
                    <div class="edit-rows">
                        <div class="edit-row">
                            <div class="edit-area" id="static-wcode-area">
                                <label>Wcode:</label>
                                <textarea id="static-wcode-input"></textarea>
                            </div>
                            <div class="diff-section wcode-diff-section">
                                <div class="diff-section-title">Wcode \u53D8\u66F4</div>
                                <div id="static-content-diff-container" class="diff-container"></div>
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
    `,document.body.appendChild(e),lv();let n=document.getElementById("bgm-tool-close");n&&n.addEventListener("click",()=>{e.style.display="none";let r=Ru();r.style.display="flex",ed(),zn()});let i=document.getElementById("bgm-tool-settings");i&&i.addEventListener("click",()=>{Bi()}),dv(),Bi()}function lv(){let t=document.getElementById("static-buttons-container");t&&t.addEventListener("click",e=>{let n=e.target.closest("button");if(!n)return;let i=n.id;switch(N.currentView){case"setup":Du(i);break;case"processing":Au(i);break;case"completed":Mu(i);break}})}function dv(){document.getElementById("static-commit-input").addEventListener("input",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentCommitMessage=o.target.value,Oi())});let e=document.getElementById("static-lock-commit");e.addEventListener("click",()=>{if(N.currentView!=="processing"||!N.currentSubjectData)return;N.isCommitMessageLocked=!N.isCommitMessageLocked;let o=document.getElementById("static-commit-input");if(N.isCommitMessageLocked)N.lockedCommitMessage=o.value,e.innerHTML='<i class="fas fa-lock"></i>',e.title="\u89E3\u9501\u7F16\u8F91\u6458\u8981";else{e.innerHTML='<i class="fas fa-lock-open"></i>',e.title="\u56FA\u5B9A\u7F16\u8F91\u6458\u8981";let a=N.csvData?.[N.currentIndex]?.type||"subject";N.currentCommitMessage=oo(N.currentFieldUpdates,N.currentTagUpdates,N.currentSeriesUpdate,a),o.value=N.currentCommitMessage}zn(),Oi()}),document.getElementById("static-wcode-input").addEventListener("input",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentWcode=o.target.value,Zo(N.currentSubjectData.infobox||"",o.target.value,"static-content-diff-container"),Oi())}),document.getElementById("static-tags-input").addEventListener("input",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentTags=o.target.value,Qs(N.currentSubjectData.metaTags||[],o.target.value.split(" ").filter(l=>l),"static-tags-diff-container"),Oi())}),document.getElementById("static-series-checkbox").addEventListener("change",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentSeries=o.target.checked,Oi())})}var Ou=`/* stylelint-disable no-descending-specificity */

/* ===== CSS Variables (scoped to container) ===== */
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
    top: 0;
    left: 0;
    transform: none;
    width: 100%;
    height: 100%;
    max-width: none;
    background: var(--bg);
    border: none;
    border-radius: 0;
    box-shadow: none;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: var(--font);
    font-size: 13px;
    color: var(--text);
    line-height: 1.6;
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
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    box-shadow: var(--shadow-subtle);
}

#bgm-tool-header-actions {
    display: flex;
    gap: 4px;
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
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

#bgm-tool-body {
    padding: 28px 36px;
    flex-grow: 1;
    box-sizing: border-box;
    line-height: 1.6;
    color: var(--text);
    overflow-y: auto;
}

#core-content {
    width: 100%;
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
}

.edit-area textarea {
    width: 100%;
    height: auto;
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
`;var Bu=`.diff-tailwindcss-wrapper .\\!container {
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
`;GM_addStyle(Ou);GM_addStyle(Bu);var Yl=document.createElement("link");Yl.rel="stylesheet";Yl.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";document.head.appendChild(Yl);Hu();})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.4
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

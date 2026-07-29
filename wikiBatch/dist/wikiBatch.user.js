// ==UserScript==
// @name         bangumi wiki 批量更新工具
// @namespace    http://tampermonkey.net/
// @version      9.5
// @description  支持两种提交方式，可在设置页面选择，支持编辑Wcode、标签和系列状态
// @author       You
// @match        https://next.bgm.tv/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @license      MIT
// ==/UserScript==

"use strict";(()=>{var Wu=Object.create;var Kl=Object.defineProperty;var Uu=Object.getOwnPropertyDescriptor;var Vu=Object.getOwnPropertyNames;var zu=Object.getPrototypeOf,Gu=Object.prototype.hasOwnProperty;var Zl=(t,e)=>()=>{try{return e||t((e={exports:{}}).exports,e),e.exports}catch(n){throw e=0,n}};var Yu=(t,e,n,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Vu(e))!Gu.call(t,r)&&r!==n&&Kl(t,r,{get:()=>e[r],enumerable:!(i=Uu(e,r))||i.enumerable});return t};var Xl=(t,e,n)=>(n=t!=null?Wu(zu(t)):{},Yu(e||!t||!t.__esModule?Kl(n,"default",{value:t,enumerable:!0}):n,t));var fd=Zl((_v,dd)=>{var fn=-1,Yt=1,ut=0;function fo(t,e,n,i,r){if(t===e)return t?[[ut,t]]:[];if(n!=null){var o=np(t,e,n);if(o)return o}var a=na(t,e),l=t.substring(0,a);t=t.substring(a),e=e.substring(a),a=Xo(t,e);var d=t.substring(t.length-a);t=t.substring(0,t.length-a),e=e.substring(0,e.length-a);var u=qu(t,e);return l&&u.unshift([ut,l]),d&&u.push([ut,d]),ia(u,r),i&&Xu(u),u}function qu(t,e){var n;if(!t)return[[Yt,e]];if(!e)return[[fn,t]];var i=t.length>e.length?t:e,r=t.length>e.length?e:t,o=i.indexOf(r);if(o!==-1)return n=[[Yt,i.substring(0,o)],[ut,r],[Yt,i.substring(o+r.length)]],t.length>e.length&&(n[0][0]=n[2][0]=fn),n;if(r.length===1)return[[fn,t],[Yt,e]];var a=Zu(t,e);if(a){var l=a[0],d=a[1],u=a[2],f=a[3],c=a[4],p=fo(l,u),m=fo(d,f);return p.concat([[ut,c]],m)}return Ku(t,e)}function Ku(t,e){for(var n=t.length,i=e.length,r=Math.ceil((n+i)/2),o=r,a=2*r,l=new Array(a),d=new Array(a),u=0;u<a;u++)l[u]=-1,d[u]=-1;l[o+1]=0,d[o+1]=0;for(var f=n-i,c=f%2!==0,p=0,m=0,g=0,x=0,w=0;w<r;w++){for(var _=-w+p;_<=w-m;_+=2){var L=o+_,y;_===-w||_!==w&&l[L-1]<l[L+1]?y=l[L+1]:y=l[L-1]+1;for(var I=y-_;y<n&&I<i&&t.charAt(y)===e.charAt(I);)y++,I++;if(l[L]=y,y>n)m+=2;else if(I>i)p+=2;else if(c){var S=o+f-_;if(S>=0&&S<a&&d[S]!==-1){var $=n-d[S];if(y>=$)return ed(t,e,y,I)}}}for(var h=-w+g;h<=w-x;h+=2){var S=o+h,$;h===-w||h!==w&&d[S-1]<d[S+1]?$=d[S+1]:$=d[S-1]+1;for(var b=$-h;$<n&&b<i&&t.charAt(n-$-1)===e.charAt(i-b-1);)$++,b++;if(d[S]=$,$>n)x+=2;else if(b>i)g+=2;else if(!c){var L=o+f-h;if(L>=0&&L<a&&l[L]!==-1){var y=l[L],I=o+y-L;if($=n-$,y>=$)return ed(t,e,y,I)}}}}return[[fn,t],[Yt,e]]}function ed(t,e,n,i){var r=t.substring(0,n),o=e.substring(0,i),a=t.substring(n),l=e.substring(i),d=fo(r,o),u=fo(a,l);return d.concat(u)}function na(t,e){if(!t||!e||t.charAt(0)!==e.charAt(0))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(o,r)==e.substring(o,r)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return od(t.charCodeAt(r-1))&&r--,r}function td(t,e){var n=t.length,i=e.length;if(n==0||i==0)return 0;n>i?t=t.substring(n-i):n<i&&(e=e.substring(0,n));var r=Math.min(n,i);if(t==e)return r;for(var o=0,a=1;;){var l=t.substring(r-a),d=e.indexOf(l);if(d==-1)return o;a+=d,(d==0||t.substring(r-a)==e.substring(0,a))&&(o=a,a++)}}function Xo(t,e){if(!t||!e||t.slice(-1)!==e.slice(-1))return 0;for(var n=0,i=Math.min(t.length,e.length),r=i,o=0;n<r;)t.substring(t.length-r,t.length-o)==e.substring(e.length-r,e.length-o)?(n=r,o=n):i=r,r=Math.floor((i-n)/2+n);return sd(t.charCodeAt(t.length-r))&&r--,r}function Zu(t,e){var n=t.length>e.length?t:e,i=t.length>e.length?e:t;if(n.length<4||i.length*2<n.length)return null;function r(m,g,x){for(var w=m.substring(x,x+Math.floor(m.length/4)),_=-1,L="",y,I,S,$;(_=g.indexOf(w,_+1))!==-1;){var h=na(m.substring(x),g.substring(_)),b=Xo(m.substring(0,x),g.substring(0,_));L.length<b+h&&(L=g.substring(_-b,_)+g.substring(_,_+h),y=m.substring(0,x-b),I=m.substring(x+h),S=g.substring(0,_-b),$=g.substring(_+h))}return L.length*2>=m.length?[y,I,S,$,L]:null}var o=r(n,i,Math.ceil(n.length/4)),a=r(n,i,Math.ceil(n.length/2)),l;if(!o&&!a)return null;a?o?l=o[4].length>a[4].length?o:a:l=a:l=o;var d,u,f,c;t.length>e.length?(d=l[0],u=l[1],f=l[2],c=l[3]):(f=l[0],c=l[1],d=l[2],u=l[3]);var p=l[4];return[d,u,f,c,p]}function Xu(t){for(var e=!1,n=[],i=0,r=null,o=0,a=0,l=0,d=0,u=0;o<t.length;)t[o][0]==ut?(n[i++]=o,a=d,l=u,d=0,u=0,r=t[o][1]):(t[o][0]==Yt?d+=t[o][1].length:u+=t[o][1].length,r&&r.length<=Math.max(a,l)&&r.length<=Math.max(d,u)&&(t.splice(n[i-1],0,[fn,r]),t[n[i-1]+1][0]=Yt,i--,i--,o=i>0?n[i-1]:-1,a=0,l=0,d=0,u=0,r=null,e=!0)),o++;for(e&&ia(t),ep(t),o=1;o<t.length;){if(t[o-1][0]==fn&&t[o][0]==Yt){var f=t[o-1][1],c=t[o][1],p=td(f,c),m=td(c,f);p>=m?(p>=f.length/2||p>=c.length/2)&&(t.splice(o,0,[ut,c.substring(0,p)]),t[o-1][1]=f.substring(0,f.length-p),t[o+1][1]=c.substring(p),o++):(m>=f.length/2||m>=c.length/2)&&(t.splice(o,0,[ut,f.substring(0,m)]),t[o-1][0]=Yt,t[o-1][1]=c.substring(0,c.length-m),t[o+1][0]=fn,t[o+1][1]=f.substring(m),o++),o++}o++}}var nd=/[^a-zA-Z0-9]/,id=/\s/,rd=/[\r\n]/,Ju=/\n\r?\n$/,Qu=/^\r?\n\r?\n/;function ep(t){function e(m,g){if(!m||!g)return 6;var x=m.charAt(m.length-1),w=g.charAt(0),_=x.match(nd),L=w.match(nd),y=_&&x.match(id),I=L&&w.match(id),S=y&&x.match(rd),$=I&&w.match(rd),h=S&&m.match(Ju),b=$&&g.match(Qu);return h||b?5:S||$?4:_&&!y&&I?3:y||I?2:_||L?1:0}for(var n=1;n<t.length-1;){if(t[n-1][0]==ut&&t[n+1][0]==ut){var i=t[n-1][1],r=t[n][1],o=t[n+1][1],a=Xo(i,r);if(a){var l=r.substring(r.length-a);i=i.substring(0,i.length-a),r=l+r.substring(0,r.length-a),o=l+o}for(var d=i,u=r,f=o,c=e(i,r)+e(r,o);r.charAt(0)===o.charAt(0);){i+=r.charAt(0),r=r.substring(1)+o.charAt(0),o=o.substring(1);var p=e(i,r)+e(r,o);p>=c&&(c=p,d=i,u=r,f=o)}t[n-1][1]!=d&&(d?t[n-1][1]=d:(t.splice(n-1,1),n--),t[n][1]=u,f?t[n+1][1]=f:(t.splice(n+1,1),n--))}n++}}function ia(t,e){t.push([ut,""]);for(var n=0,i=0,r=0,o="",a="",l;n<t.length;){if(n<t.length-1&&!t[n][1]){t.splice(n,1);continue}switch(t[n][0]){case Yt:r++,a+=t[n][1],n++;break;case fn:i++,o+=t[n][1],n++;break;case ut:var d=n-r-i-1;if(e){if(d>=0&&ld(t[d][1])){var u=t[d][1].slice(-1);if(t[d][1]=t[d][1].slice(0,-1),o=u+o,a=u+a,!t[d][1]){t.splice(d,1),n--;var f=d-1;t[f]&&t[f][0]===Yt&&(r++,a=t[f][1]+a,f--),t[f]&&t[f][0]===fn&&(i++,o=t[f][1]+o,f--),d=f}}if(ad(t[n][1])){var u=t[n][1].charAt(0);t[n][1]=t[n][1].slice(1),o+=u,a+=u}}if(n<t.length-1&&!t[n][1]){t.splice(n,1);break}if(o.length>0||a.length>0){o.length>0&&a.length>0&&(l=na(a,o),l!==0&&(d>=0?t[d][1]+=a.substring(0,l):(t.splice(0,0,[ut,a.substring(0,l)]),n++),a=a.substring(l),o=o.substring(l)),l=Xo(a,o),l!==0&&(t[n][1]=a.substring(a.length-l)+t[n][1],a=a.substring(0,a.length-l),o=o.substring(0,o.length-l)));var c=r+i;o.length===0&&a.length===0?(t.splice(n-c,c),n=n-c):o.length===0?(t.splice(n-c,c,[Yt,a]),n=n-c+1):a.length===0?(t.splice(n-c,c,[fn,o]),n=n-c+1):(t.splice(n-c,c,[fn,o],[Yt,a]),n=n-c+2)}n!==0&&t[n-1][0]===ut?(t[n-1][1]+=t[n][1],t.splice(n,1)):n++,r=0,i=0,o="",a="";break}}t[t.length-1][1]===""&&t.pop();var p=!1;for(n=1;n<t.length-1;)t[n-1][0]===ut&&t[n+1][0]===ut&&(t[n][1].substring(t[n][1].length-t[n-1][1].length)===t[n-1][1]?(t[n][1]=t[n-1][1]+t[n][1].substring(0,t[n][1].length-t[n-1][1].length),t[n+1][1]=t[n-1][1]+t[n+1][1],t.splice(n-1,1),p=!0):t[n][1].substring(0,t[n+1][1].length)==t[n+1][1]&&(t[n-1][1]+=t[n+1][1],t[n][1]=t[n][1].substring(t[n+1][1].length)+t[n+1][1],t.splice(n+1,1),p=!0)),n++;p&&ia(t,e)}function od(t){return t>=55296&&t<=56319}function sd(t){return t>=56320&&t<=57343}function ad(t){return sd(t.charCodeAt(0))}function ld(t){return od(t.charCodeAt(t.length-1))}function tp(t){for(var e=[],n=0;n<t.length;n++)t[n][1].length>0&&e.push(t[n]);return e}function ta(t,e,n,i){return ld(t)||ad(i)?null:tp([[ut,t],[fn,e],[Yt,n],[ut,i]])}function np(t,e,n){var i=typeof n=="number"?{index:n,length:0}:n.oldRange,r=typeof n=="number"?null:n.newRange,o=t.length,a=e.length;if(i.length===0&&(r===null||r.length===0)){var l=i.index,d=t.slice(0,l),u=t.slice(l),f=r?r.index:null;e:{var c=l+a-o;if(f!==null&&f!==c||c<0||c>a)break e;var p=e.slice(0,c),m=e.slice(c);if(m!==u)break e;var g=Math.min(l,c),x=d.slice(0,g),w=p.slice(0,g);if(x!==w)break e;var _=d.slice(g),L=p.slice(g);return ta(x,_,L,u)}e:{if(f!==null&&f!==l)break e;var y=l,p=e.slice(0,y),m=e.slice(y);if(p!==d)break e;var I=Math.min(o-y,a-y),S=u.slice(u.length-I),$=m.slice(m.length-I);if(S!==$)break e;var _=u.slice(0,u.length-I),L=m.slice(0,m.length-I);return ta(d,_,L,S)}}if(i.length>0&&r&&r.length===0)e:{var x=t.slice(0,i.index),S=t.slice(i.index+i.length),g=x.length,I=S.length;if(a<g+I)break e;var w=e.slice(0,g),$=e.slice(a-I);if(x!==w||S!==$)break e;var _=t.slice(g,o-I),L=e.slice(g,a-I);return ta(x,_,L,S)}return null}function Jo(t,e,n,i){return fo(t,e,n,i,!0)}Jo.INSERT=Yt;Jo.DELETE=fn;Jo.EQUAL=ut;dd.exports=Jo});var Eu=Zl((Ul,Vl)=>{((t,e)=>{typeof define=="function"&&define.amd?define([],e):typeof Vl=="object"&&typeof Ul<"u"?Vl.exports=e():t.Papa=e()})(Ul,function t(){var e=typeof self<"u"?self:typeof window<"u"?window:e!==void 0?e:{},n,i=!e.document&&!!e.postMessage,r=e.IS_PAPA_WORKER||!1,o={},a=0,l={};function d(h){return h.charCodeAt(0)===65279?h.slice(1):h}function u(h){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(b){var E=I(b);E.chunkSize=parseInt(E.chunkSize),b.step||b.chunk||(E.chunkSize=null),this._handle=new g(E),(this._handle.streamer=this)._config=E}.call(this,h),this.parseChunk=function(b,E){var D=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<D){let W=this._config.newline;W||(M=this._config.quoteChar||'"',W=this._handle.guessLineEndings(b,M)),b=[...b.split(W).slice(D)].join(W)}this.isFirstChunk&&$(this._config.beforeFirstChunk)&&(M=this._config.beforeFirstChunk(b))!==void 0&&(b=M),this.isFirstChunk=!1,this._halted=!1;var D=this._partialLine+b,M=(this._partialLine="",this._handle.parse(D,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(b=M.meta.cursor,D=(this._finished||(this._partialLine=D.substring(b-this._baseIndex),this._baseIndex=b),M&&M.data&&(this._rowCount+=M.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),r)e.postMessage({results:M,workerId:l.WORKER_ID,finished:D});else if($(this._config.chunk)&&!E){if(this._config.chunk(M,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=M=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(M.data),this._completeResults.errors=this._completeResults.errors.concat(M.errors),this._completeResults.meta=M.meta),this._completed||!D||!$(this._config.complete)||M&&M.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),D||M&&M.meta.paused||this._nextChunk(),M}this._halted=!0},this._sendError=function(b){$(this._config.error)?this._config.error(b):r&&this._config.error&&e.postMessage({workerId:l.WORKER_ID,error:b,finished:!1})}}function f(h){var b;(h=h||{}).chunkSize||(h.chunkSize=l.RemoteChunkSize),u.call(this,h),this._nextChunk=i?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(E){this._input=E,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(b=new XMLHttpRequest,this._config.withCredentials&&(b.withCredentials=this._config.withCredentials),i||(b.onload=S(this._chunkLoaded,this),b.onerror=S(this._chunkError,this)),b.open(this._config.downloadRequestBody?"POST":"GET",this._input,!i),this._config.downloadRequestHeaders){var E,D=this._config.downloadRequestHeaders;for(E in D)b.setRequestHeader(E,D[E])}var M;this._config.chunkSize&&(M=this._start+this._config.chunkSize-1,b.setRequestHeader("Range","bytes="+this._start+"-"+M));try{b.send(this._config.downloadRequestBody)}catch(W){this._chunkError(W.message)}i&&b.status===0&&this._chunkError()}},this._chunkLoaded=function(){b.readyState===4&&(b.status<200||400<=b.status?this._chunkError():(this._start+=this._config.chunkSize||b.responseText.length,this._finished=!this._config.chunkSize||this._start>=(E=>(E=E.getResponseHeader("Content-Range"))!==null?parseInt(E.substring(E.lastIndexOf("/")+1)):-1)(b),this.parseChunk(b.responseText)))},this._chunkError=function(E){E=b.statusText||E,this._sendError(new Error(E))}}function c(h){(h=h||{}).chunkSize||(h.chunkSize=l.LocalChunkSize),u.call(this,h);var b,E,D=typeof FileReader<"u";this.stream=function(M){this._input=M,E=M.slice||M.webkitSlice||M.mozSlice,D?((b=new FileReader).onload=S(this._chunkLoaded,this),b.onerror=S(this._chunkError,this)):b=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var M=this._input,W=(this._config.chunkSize&&(W=Math.min(this._start+this._config.chunkSize,this._input.size),M=E.call(M,this._start,W)),b.readAsText(M,this._config.encoding));D||this._chunkLoaded({target:{result:W}})},this._chunkLoaded=function(M){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(M.target.result)},this._chunkError=function(){this._sendError(b.error)}}function p(h){var b;u.call(this,h=h||{}),this.stream=function(E){return b=E,this._nextChunk()},this._nextChunk=function(){var E,D;if(!this._finished)return E=this._config.chunkSize,b=E?(D=b.substring(0,E),b.substring(E)):(D=b,""),this._finished=!b,this.parseChunk(D)}}function m(h){u.call(this,h=h||{});var b=[],E=!0,D=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(M){this._input=M,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){D&&b.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),b.length?this.parseChunk(b.shift()):E=!0},this._streamData=S(function(M){try{b.push(typeof M=="string"?M:M.toString(this._config.encoding)),E&&(E=!1,this._checkIsFinished(),this.parseChunk(b.shift()))}catch(W){this._streamError(W)}},this),this._streamError=S(function(M){this._streamCleanUp(),this._sendError(M)},this),this._streamEnd=S(function(){this._streamCleanUp(),D=!0,this._streamData("")},this),this._streamCleanUp=S(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function g(h){var b,E,D,M,W=Math.pow(2,53),P=-W,K=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,ee=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,re=this,Z=0,A=0,Y=!1,j=!1,V=[],H={data:[],errors:[],meta:{}};function he(se){return h.skipEmptyLines==="greedy"?se.join("").trim()==="":se.length===1&&se[0].length===0}function ie(){if(H&&D&&(ve("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+l.DefaultDelimiter+"'"),D=!1),h.skipEmptyLines&&(H.data=H.data.filter(function(ge){return!he(ge)})),Q()){let ge=function(ke,Be){ke=d(ke),$(h.transformHeader)&&(ke=h.transformHeader(ke,Be)),V.push(ke)};var $e=ge;if(H)if(Array.isArray(H.data[0])){for(var se=0;Q()&&se<H.data.length;se++)H.data[se].forEach(ge);H.data.splice(0,1)}else H.data.forEach(ge)}function te(ge,ke){for(var Be=h.header?{}:[],Pe=0;Pe<ge.length;Pe++){var Se=Pe,Rt=ge[Pe],Rt=((De,Ke)=>(ct=>(h.dynamicTypingFunction&&h.dynamicTyping[ct]===void 0&&(h.dynamicTyping[ct]=h.dynamicTypingFunction(ct)),(h.dynamicTyping[ct]||h.dynamicTyping)===!0))(De)?Ke==="true"||Ke==="TRUE"||Ke!=="false"&&Ke!=="FALSE"&&((ct=>{if(K.test(ct)&&(ct=parseFloat(ct),P<ct&&ct<W))return 1})(Ke)?parseFloat(Ke):ee.test(Ke)?new Date(Ke):Ke===""?null:Ke):Ke)(Se=h.header?Pe>=V.length?"__parsed_extra":V[Pe]:Se,Rt=h.transform?h.transform(Rt,Se):Rt);Se==="__parsed_extra"?(Be[Se]=Be[Se]||[],Be[Se].push(Rt)):Be[Se]=Rt}return h.header&&(Pe>V.length?ve("FieldMismatch","TooManyFields","Too many fields: expected "+V.length+" fields but parsed "+Pe,A+ke):Pe<V.length&&ve("FieldMismatch","TooFewFields","Too few fields: expected "+V.length+" fields but parsed "+Pe,A+ke)),Be}var xe;H&&(h.header||h.dynamicTyping||h.transform)&&(xe=1,!H.data.length||Array.isArray(H.data[0])?(H.data=H.data.map(te),xe=H.data.length):H.data=te(H.data,0),h.header&&H.meta&&(H.meta.fields=V),A+=xe)}function Q(){return h.header&&V.length===0}function ve(se,te,xe,$e){se={type:se,code:te,message:xe},$e!==void 0&&(se.row=$e),H.errors.push(se)}$(h.step)&&(M=h.step,h.step=function(se){H=se,Q()?ie():(ie(),H.data.length!==0&&(Z+=se.data.length,h.preview&&Z>h.preview?E.abort():(H.data=H.data[0],M(H,re))))}),this.parse=function(se,te,xe){var $e=h.quoteChar||'"',$e=(h.newline||(h.newline=this.guessLineEndings(se,$e)),D=!1,h.delimiter?$(h.delimiter)&&(h.delimiter=h.delimiter(se),H.meta.delimiter=h.delimiter):(($e=((ge,ke,Be,Pe,Se)=>{var Rt,De,Ke,ct;Se=Se||[",","	","|",";",l.RECORD_SEP,l.UNIT_SEP];for(var hr=0;hr<Se.length;hr++){for(var Wn,so=Se[hr],Ht=0,Un=0,$t=0,Qt=(Ke=void 0,new w({comments:Pe,delimiter:so,newline:ke,preview:10}).parse(ge)),ui=0;ui<Qt.data.length;ui++)Be&&he(Qt.data[ui])?$t++:(Wn=Qt.data[ui].length,Un+=Wn,Ke===void 0?Ke=Wn:0<Wn&&(Ht+=Math.abs(Wn-Ke),Ke=Wn));0<Qt.data.length&&(Un/=Qt.data.length-$t),(De===void 0||Ht<=De)&&(ct===void 0||ct<Un)&&1.99<Un&&(De=Ht,Rt=so,ct=Un)}return{successful:!!(h.delimiter=Rt),bestDelimiter:Rt}})(se,h.newline,h.skipEmptyLines,h.comments,h.delimitersToGuess)).successful?h.delimiter=$e.bestDelimiter:(D=!0,h.delimiter=l.DefaultDelimiter),H.meta.delimiter=h.delimiter),I(h));return h.preview&&h.header&&$e.preview++,b=se,E=new w($e),H=E.parse(b,te,xe),ie(),Y?{meta:{paused:!0}}:H||{meta:{paused:!1}}},this.paused=function(){return Y},this.pause=function(){Y=!0,E.abort(),b=$(h.chunk)?"":b.substring(E.getCharIndex())},this.resume=function(){re.streamer._halted?(Y=!1,re.streamer.parseChunk(b,!0)):setTimeout(re.resume,3)},this.aborted=function(){return j},this.abort=function(){j=!0,E.abort(),H.meta.aborted=!0,$(h.complete)&&h.complete(H),b=""},this.guessLineEndings=function(ge,$e){ge=ge.substring(0,1048576);var $e=new RegExp(x($e)+"([^]*?)"+x($e),"gm"),xe=(ge=ge.replace($e,"")).split("\r"),$e=ge.split(`
`),ge=1<$e.length&&$e[0].length<xe[0].length;if(xe.length===1||ge)return`
`;for(var ke=0,Be=0;Be<xe.length;Be++)xe[Be][0]===`
`&&ke++;return ke>=xe.length/2?`\r
`:"\r"}}function x(h){return h.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function w(h){var b=(h=h||{}).delimiter,E=h.newline,D=h.comments,M=h.step,W=h.preview,P=h.fastMode,K=null,ee=!1,re=h.quoteChar==null?'"':h.quoteChar,Z=re;if(h.escapeChar!==void 0&&(Z=h.escapeChar),(typeof b!="string"||-1<l.BAD_DELIMITERS.indexOf(b))&&(b=","),D===b)throw new Error("Comment character same as delimiter");D===!0?D="#":(typeof D!="string"||-1<l.BAD_DELIMITERS.indexOf(D))&&(D=!1),E!==`
`&&E!=="\r"&&E!==`\r
`&&(E=`
`);var A=0,Y=!1;this.parse=function(j,V,H){if(typeof j!="string")throw new Error("Input must be a string");var he=j.length,ie=b.length,Q=E.length,ve=D.length,se=$(M),te=[],xe=[],$e=[],ge=A=0;if(!j)return Ht();if(P||P!==!1&&j.indexOf(re)===-1){for(var ke=j.split(E),Be=0;Be<ke.length;Be++){if($e=ke[Be],A+=$e.length,Be!==ke.length-1)A+=E.length;else if(H)return Ht();if(!D||$e.substring(0,ve)!==D){if(se){if(te=[],ct($e.split(b)),Un(),Y)return Ht()}else ct($e.split(b));if(W&&W<=Be)return te=te.slice(0,W),Ht(!0)}}return Ht()}for(var Pe=j.indexOf(b,A),Se=j.indexOf(E,A),Rt=new RegExp(x(Z)+x(re),"g"),De=j.indexOf(re,A);;)if(j[A]===re)for(De=A,A++;;){if((De=j.indexOf(re,De+1))===-1)return H||xe.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:te.length,index:A}),Wn();if(De===he-1)return Wn(j.substring(A,De).replace(Rt,re));if(re===Z&&j[De+1]===Z)De++;else if(re===Z||De===0||j[De-1]!==Z){Pe!==-1&&Pe<De+1&&(Pe=j.indexOf(b,De+1));var Ke=hr((Se=Se!==-1&&Se<De+1?j.indexOf(E,De+1):Se)===-1?Pe:Math.min(Pe,Se));if(j.substr(De+1+Ke,ie)===b){$e.push(j.substring(A,De).replace(Rt,re)),j[A=De+1+Ke+ie]!==re&&(De=j.indexOf(re,A)),Pe=j.indexOf(b,A),Se=j.indexOf(E,A);break}if(Ke=hr(Se),j.substring(De+1+Ke,De+1+Ke+Q)===E){if($e.push(j.substring(A,De).replace(Rt,re)),so(De+1+Ke+Q),Pe=j.indexOf(b,A),De=j.indexOf(re,A),se&&(Un(),Y))return Ht();if(W&&te.length>=W)return Ht(!0);break}xe.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:te.length,index:A}),De++}}else if(D&&$e.length===0&&j.substring(A,A+ve)===D){if(Se===-1)return Ht();A=Se+Q,Se=j.indexOf(E,A),Pe=j.indexOf(b,A)}else if(Pe!==-1&&(Pe<Se||Se===-1))$e.push(j.substring(A,Pe)),A=Pe+ie,Pe=j.indexOf(b,A);else{if(Se===-1)break;if($e.push(j.substring(A,Se)),so(Se+Q),se&&(Un(),Y))return Ht();if(W&&te.length>=W)return Ht(!0)}return Wn();function ct($t){te.push($t),ge=A}function hr($t){var Qt=0;return Qt=$t!==-1&&($t=j.substring(De+1,$t))&&$t.trim()===""?$t.length:Qt}function Wn($t){return H||($t===void 0&&($t=j.substring(A)),$e.push($t),A=he,ct($e),se&&Un()),Ht()}function so($t){A=$t,ct($e),$e=[],Se=j.indexOf(E,A)}function Ht($t){if(h.header&&!V&&te.length&&!ee){var Qt=te[0],ui=Object.create(null),ea=new Set(Qt);let Yl=!1;for(let mr=0;mr<Qt.length;mr++){let Vn=d(Qt[mr]);if(ui[Vn=$(h.transformHeader)?h.transformHeader(Vn,mr):Vn]){let ao,ql=ui[Vn];for(;ao=Vn+"_"+ql,ql++,ea.has(ao););ea.add(ao),Qt[mr]=ao,ui[Vn]++,Yl=!0,(K=K===null?{}:K)[ao]=Vn}else ui[Vn]=1,Qt[mr]=Vn;ea.add(Vn)}Yl&&console.warn("Duplicate headers found and renamed."),ee=!0}return{data:te,errors:xe,meta:{delimiter:b,linebreak:E,aborted:Y,truncated:!!$t,cursor:ge+(V||0),renamedHeaders:K}}}function Un(){M(Ht()),te=[],xe=[]}},this.abort=function(){Y=!0},this.getCharIndex=function(){return A}}function _(h){var b=h.data,E=o[b.workerId],D=!1;if(b.error)E.userError(b.error,b.file);else if(b.results&&b.results.data){var M={abort:function(){D=!0,L(b.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:y,resume:y};if($(E.userStep)){for(var W=0;W<b.results.data.length&&(E.userStep({data:b.results.data[W],errors:b.results.errors,meta:b.results.meta},M),!D);W++);delete b.results}else $(E.userChunk)&&(E.userChunk(b.results,M,b.file),delete b.results)}b.finished&&!D&&L(b.workerId,b.results)}function L(h,b){var E=o[h];$(E.userComplete)&&E.userComplete(b),E.terminate(),delete o[h]}function y(){throw new Error("Not implemented.")}function I(h){if(typeof h!="object"||h===null)return h;var b,E=Array.isArray(h)?[]:{};for(b in h)E[b]=I(h[b]);return E}function S(h,b){return function(){h.apply(b,arguments)}}function $(h){return typeof h=="function"}return l.parse=function(h,b){var E=(b=b||{}).dynamicTyping||!1;if($(E)&&(b.dynamicTypingFunction=E,E={}),b.dynamicTyping=E,b.transform=!!$(b.transform)&&b.transform,!b.worker||!l.WORKERS_SUPPORTED)return E=null,l.NODE_STREAM_INPUT,typeof h=="string"?(h=d(h),E=new(b.download?f:p)(b)):h.readable===!0&&$(h.read)&&$(h.on)?E=new m(b):(e.File&&h instanceof File||h instanceof Object)&&(E=new c(b)),E.stream(h);(E=(()=>{var D;return!!l.WORKERS_SUPPORTED&&(D=(()=>{var M=e.URL||e.webkitURL||null,W=t.toString();return l.BLOB_URL||(l.BLOB_URL=M.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",W,")();"],{type:"text/javascript"})))})(),(D=new e.Worker(D)).onmessage=_,D.id=a++,o[D.id]=D)})()).userStep=b.step,E.userChunk=b.chunk,E.userComplete=b.complete,E.userError=b.error,b.step=$(b.step),b.chunk=$(b.chunk),b.complete=$(b.complete),b.error=$(b.error),delete b.worker,E.postMessage({input:h,config:b,workerId:E.id})},l.unparse=function(h,b){var E=!1,D=!0,M=",",W=`\r
`,P='"',K=P+P,ee=!1,re=null,Z=!1,A=((()=>{if(typeof b=="object"){if(typeof b.delimiter!="string"||l.BAD_DELIMITERS.filter(function(V){return b.delimiter.indexOf(V)!==-1}).length||(M=b.delimiter),typeof b.quotes!="boolean"&&typeof b.quotes!="function"&&!Array.isArray(b.quotes)||(E=b.quotes),typeof b.skipEmptyLines!="boolean"&&typeof b.skipEmptyLines!="string"||(ee=b.skipEmptyLines),typeof b.newline=="string"&&(W=b.newline),typeof b.quoteChar=="string"&&(P=b.quoteChar,K=P+P),typeof b.header=="boolean"&&(D=b.header),Array.isArray(b.columns)){if(b.columns.length===0)throw new Error("Option columns is empty");re=b.columns}b.escapeChar!==void 0&&(K=b.escapeChar+P),b.escapeFormulae instanceof RegExp?Z=b.escapeFormulae:typeof b.escapeFormulae=="boolean"&&b.escapeFormulae&&(Z=/^[=+\-@\t\r].*$/)}})(),new RegExp(x(P),"g"));if(typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(h)){if(!h.length||Array.isArray(h[0]))return Y(null,h,ee);if(typeof h[0]=="object")return Y(re||Object.keys(h[0]),h,ee)}else if(typeof h=="object")return typeof h.data=="string"&&(h.data=JSON.parse(h.data)),Array.isArray(h.data)&&(h.fields||(h.fields=h.meta&&h.meta.fields||re),h.fields||(h.fields=Array.isArray(h.data[0])?h.fields:typeof h.data[0]=="object"?Object.keys(h.data[0]):[]),Array.isArray(h.data[0])||typeof h.data[0]=="object"||(h.data=[h.data])),Y(h.fields||[],h.data||[],ee);throw new Error("Unable to serialize unrecognized input");function Y(V,H,he){var ie="",Q=(typeof V=="string"&&(V=JSON.parse(V)),typeof H=="string"&&(H=JSON.parse(H)),Array.isArray(V)&&0<V.length),ve=!Array.isArray(H[0]);if(Q&&D){for(var se=0;se<V.length;se++)0<se&&(ie+=M),ie+=j(V[se],se);0<H.length&&(ie+=W)}for(var te=0;te<H.length;te++){var xe=(Q?V:H[te]).length,$e=!1,ge=Q?Object.keys(H[te]).length===0:H[te].length===0;if(he&&!Q&&($e=he==="greedy"?H[te].join("").trim()==="":H[te].length===1&&H[te][0].length===0),he==="greedy"&&Q){for(var ke=[],Be=0;Be<xe;Be++){var Pe=ve?V[Be]:Be;ke.push(H[te][Pe])}$e=ke.join("").trim()===""}if(!$e){for(var Se=0;Se<xe;Se++){0<Se&&!ge&&(ie+=M);var Rt=Q&&ve?V[Se]:Se;ie+=j(H[te][Rt],Se)}te<H.length-1&&(!he||0<xe&&!ge)&&(ie+=W)}}return ie}function j(V,H){var he,ie,Q;return V==null?"":V.constructor===Date?JSON.stringify(V).slice(1,25):(Q=!1,Z&&typeof V=="string"&&Z.test(V)&&(V="'"+V,Q=!0),ie=(he=V.toString()).replace(A,K),(Q=Q||E===!0||typeof E=="function"&&E(V,H)||Array.isArray(E)&&E[H]||((ve,se)=>{for(var te=0;te<se.length;te++)if(-1<ve.indexOf(se[te]))return!0;return!1})(ie,l.BAD_DELIMITERS)||-1<ie.indexOf(M)||-1<he.indexOf(P)||ie.charAt(0)===" "||ie.charAt(ie.length-1)===" ")?P+ie+P:ie)}},l.RECORD_SEP="",l.UNIT_SEP="",l.BYTE_ORDER_MARK="\uFEFF",l.BAD_DELIMITERS=["\r",`
`,'"',l.BYTE_ORDER_MARK],l.WORKERS_SUPPORTED=!i&&!!e.Worker,l.NODE_STREAM_INPUT=1,l.LocalChunkSize=10485760,l.RemoteChunkSize=5242880,l.DefaultDelimiter=",",l.Parser=w,l.ParserHandle=g,l.NetworkStreamer=f,l.FileStreamer=c,l.StringStreamer=p,l.ReadableStreamStreamer=m,e.jQuery&&((n=e.jQuery).fn.parse=function(h){var b=h.config||{},E=[];return this.each(function(W){if(!(n(this).prop("tagName").toUpperCase()==="INPUT"&&n(this).attr("type").toLowerCase()==="file"&&e.FileReader)||!this.files||this.files.length===0)return!0;for(var P=0;P<this.files.length;P++)E.push({file:this.files[P],inputElem:this,instanceConfig:n.extend({},b)})}),D(),this;function D(){if(E.length===0)$(h.complete)&&h.complete();else{var W,P,K,ee,re=E[0];if($(h.before)){var Z=h.before(re.file,re.inputElem);if(typeof Z=="object"){if(Z.action==="abort")return W="AbortError",P=re.file,K=re.inputElem,ee=Z.reason,void($(h.error)&&h.error({name:W},P,K,ee));if(Z.action==="skip")return void M();typeof Z.config=="object"&&(re.instanceConfig=n.extend(re.instanceConfig,Z.config))}else if(Z==="skip")return void M()}var A=re.instanceConfig.complete;re.instanceConfig.complete=function(Y){$(A)&&A(Y,re.file,re.inputElem),M()},l.parse(re.file,re.instanceConfig)}}function M(){E.splice(0,1),D()}}),r&&(e.onmessage=function(h){h=h.data,l.WORKER_ID===void 0&&h&&(l.WORKER_ID=h.workerId),typeof h.input=="string"?e.postMessage({workerId:l.WORKER_ID,results:l.parse(h.input,h.config),finished:!0}):(e.File&&h.input instanceof File||h.input instanceof Object)&&(h=l.parse(h.input,h.config))&&e.postMessage({workerId:l.WORKER_ID,results:h,finished:!0})}),(f.prototype=Object.create(u.prototype)).constructor=f,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,l})});var N={accessToken:GM_getValue("bgmAccessToken")||"",formhash:GM_getValue("bgmFormhash")||"",submitMethod:GM_getValue("bgmSubmitMethod")||"patch",entityType:localStorage.getItem("bgmEntityType")||"subject",csvData:JSON.parse(localStorage.getItem("bgmCsvData")||"null"),currentIndex:parseInt(localStorage.getItem("bgmCurrentIndex")||"0"),totalItems:0,processing:!1,paused:!1,currentView:"setup",currentSubjectData:null,currentFieldUpdates:null,currentTagUpdates:null,currentSeriesUpdate:null,currentWcode:null,currentTags:null,currentSeries:null,currentCommitMessage:null,isCommitMessageLocked:localStorage.getItem("bgmIsCommitMessageLocked")==="true"||!1,lockedCommitMessage:localStorage.getItem("bgmLockedCommitMessage")||"",retryCount:{},currentItemId:null,previousItem:JSON.parse(localStorage.getItem("bgmPreviousItem")||"null"),diffViewMode:localStorage.getItem("bgmDiffViewMode")||"split"};function zn(){GM_setValue("bgmAccessToken",N.accessToken),GM_setValue("bgmFormhash",N.formhash),GM_setValue("bgmSubmitMethod",N.submitMethod),localStorage.setItem("bgmEntityType",N.entityType),localStorage.setItem("bgmCsvData",JSON.stringify(N.csvData)),localStorage.setItem("bgmCurrentIndex",N.currentIndex.toString()),localStorage.setItem("bgmIsCommitMessageLocked",N.isCommitMessageLocked.toString()),localStorage.setItem("bgmLockedCommitMessage",N.lockedCommitMessage),N.previousItem&&localStorage.setItem("bgmPreviousItem",JSON.stringify(N.previousItem)),localStorage.setItem("bgmDiffViewMode",N.diffViewMode)}function Pi(t,e){let n={subject:{wikiPath:`/p1/wiki/subjects/${e}`,historyPath:`/p1/wiki/subjects/${e}/history-summary`,patchBodyKey:"subject",editPagePath:`https://bgm.tv/subject/${e}/edit`},character:{wikiPath:`/p1/wiki/characters/${e}`,historyPath:`/p1/wiki/characters/${e}/history-summary`,patchBodyKey:"character",editPagePath:`https://bgm.tv/character/${e}/edit`},person:{wikiPath:`/p1/wiki/persons/${e}`,historyPath:`/p1/wiki/persons/${e}/history-summary`,patchBodyKey:"person",editPagePath:`https://bgm.tv/person/${e}/edit`}};return n[t]||n.subject}function lo(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="block")}function ji(t,e){let n=document.getElementById("progress-text"),i=document.getElementById("progress-bar");n&&(n.textContent=`\u5904\u7406\u8FDB\u5EA6: ${t}/${e}`);let r=e>0?t/e*100:0;i&&(i.style.width=`${r}%`)}function Jl(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Wi(t){let e=document.getElementById("bgm-loading-overlay"),n=document.getElementById("loading-text");n&&(n.textContent=t),e&&e.classList.add("active")}function vn(){let t=document.getElementById("bgm-loading-overlay");t&&t.classList.remove("active")}function en(t){let e=document.getElementById("bgm-status-message");e&&(e.classList.remove("show"),e.offsetWidth,e.textContent=t,e.classList.add("show"),setTimeout(()=>{e.classList.remove("show")},3e3))}function Ql(){let t=document.getElementById("bgm-status-message");t&&t.classList.remove("show")}var Ad=Xl(fd(),1);var ip={name:"stub",maxLineToIgnoreSyntax:0,setMaxLineToIgnoreSyntax:()=>{},ignoreSyntaxHighlightList:[],setIgnoreSyntaxHighlightList:()=>{},getAST:()=>({children:[]}),processAST:()=>({syntaxFileObject:{},syntaxFileLineNumber:0}),hasRegisteredCurrentLang:()=>!1,getHighlighterEngine:()=>null},gr=ip;var $r;(function(t){t.None="None",t.Up="Up",t.Down="Down",t.Both="Both",t.Short="Short"})($r||($r={}));var la=class{constructor(e,n,i,r,o){this.header=e,this.lines=n,this.unifiedDiffStart=i,this.unifiedDiffEnd=r,this.expansionType=o}equals(e){return this===e?!0:this.header.equals(e.header)&&this.unifiedDiffStart===e.unifiedDiffStart&&this.unifiedDiffEnd===e.unifiedDiffEnd&&this.expansionType===e.expansionType&&this.lines.length===e.lines.length&&this.lines.every((n,i)=>n.equals(e.lines[i]))}},da=class{constructor(e,n,i,r){this.oldStartLine=e,this.oldLineCount=n,this.newStartLine=i,this.newLineCount=r}toDiffLineRepresentation(){return`@@ -${this.oldStartLine},${this.oldLineCount} +${this.newStartLine},${this.newLineCount} @@`}equals(e){return this.oldStartLine===e.oldStartLine&&this.oldLineCount===e.oldLineCount&&this.newStartLine===e.newStartLine&&this.oldStartLine===e.oldStartLine}};var Nn="--diff-add-content-highlight--",In="--diff-del-content-highlight--",et;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(et||(et={}));var xo=t=>{switch(t){case et.LF:return"\u240A";case et.CR:return"\u240D";case et.CRLF:return"\u240D\u240A";default:return""}},cd;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(cd||(cd={}));var rp=1e3;function ud(t){return t.location+t.length}function pd(t,e,n,i,r){let o=Math.min(e.length,i.length),a=r?ud(e)-1:e.location,l=r?ud(i)-1:i.location,d=r?-1:1,u=0;for(;Math.abs(u)<o&&t[a+u]===n[l+u];)u+=d;return Math.abs(u)}function ns(t){return t.trim().length===0||t.length>=rp}function Md(t,e){let n=t.text,i=e.text,r=n.slice(-2),o=i.slice(-2),a=r===`\r
`?et.CRLF:r.endsWith("\r")?et.CR:r.endsWith(`
`)?et.LF:et.NULL,l=o===`\r
`?et.CRLF:o.endsWith("\r")?et.CR:o.endsWith(`
`)?et.LF:et.NULL,d=t.noTrailingNewLine!==e.noTrailingNewLine;return a===l&&!d?{addSymbol:void 0,addString:n,delSymbol:void 0,delString:i}:{addSymbol:d?t.noTrailingNewLine?et.NEWLINE:et.NORMAL:a,addString:a===et.CRLF?n.slice(0,-2):a===et.CR||a===et.LF?n.slice(0,-1):n,delSymbol:d?e.noTrailingNewLine?et.NEWLINE:et.NORMAL:l,delString:l===et.CRLF?i.slice(0,-2):l===et.CR||l===et.LF?i.slice(0,-1):i}}function op(t,e){let n=t.text,i=e.text,{addString:r,delString:o,addSymbol:a,delSymbol:l}=Md(t,e);if(r===o&&a&&l)return{addRange:{range:{location:r.length,length:n.length-r.length},hasLineChange:!0,newLineSymbol:a},delRange:{range:{location:o.length,length:i.length-o.length},hasLineChange:!0,newLineSymbol:l}};let d={location:0,length:o.length},u={location:0,length:r.length};if(ns(n)||ns(i))return u.length=0,d.length=0,{addRange:{range:u},delRange:{range:d}};let f=pd(o,d,r,u,!1);d={location:d.location+f,length:d.length-f},u={location:u.location+f,length:u.length-f};let c=pd(o,d,r,u,!0);return d.length-=c,u.length-=c,{addRange:{range:u,hasLineChange:(r.slice(0,u.location)+r.slice(u.location+u.length)).trim().length>0},delRange:{range:d,hasLineChange:(o.slice(0,d.location)+o.slice(d.location+d.length)).trim().length>0}}}function sp(t,e){let{addString:n,addSymbol:i,delString:r,delSymbol:o}=Md(t,e);if(ns(n)||ns(r))return{addRange:{range:[],hasLineChange:!!i,newLineSymbol:i},delRange:{range:[],hasLineChange:!!o,newLineSymbol:o}};let a=(0,Ad.default)(r,n,0,!0),l=0,d=0,u=a.filter(c=>c[0]!==-1).map(c=>({type:c[0],str:c[1],startIndex:l,endIndex:l+c[1].length-1,length:(l+=c[1].length,c[1].length)})),f=a.filter(c=>c[0]!==1).map(c=>({type:c[0],str:c[1],startIndex:d,endIndex:d+c[1].length-1,length:(d+=c[1].length,c[1].length)}));return{addRange:{range:u,hasLineChange:u.some(c=>c.type===0&&c.str.trim().length>0),newLineSymbol:i},delRange:{range:f,hasLineChange:u.some(c=>c.type===0&&c.str.trim().length>0),newLineSymbol:o}}}var Re;(function(t){t[t.Context=0]="Context",t[t.Add=1]="Add",t[t.Delete=2]="Delete",t[t.Hunk=3]="Hunk"})(Re||(Re={}));var Bt=class t{constructor(e,n,i,r,o,a=!1,l,d,u,f,c,p,m,g){this.text=e,this.type=n,this.originalLineNumber=i,this.oldLineNumber=r,this.newLineNumber=o,this.noTrailingNewLine=a,this.changes=l,this.diffChanges=d,this._diffChanges=u,this.plainTemplate=f,this.plainTemplateMode=c,this.syntaxTemplate=p,this.syntaxTemplateName=m,this.syntaxTemplateMode=g}withNoTrailingNewLine(e){return new t(this.text,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,e)}isIncludeableLine(){return this.type===Re.Add||this.type===Re.Delete}equals(e){return this.text===e.text&&this.type===e.type&&this.originalLineNumber===e.originalLineNumber&&this.oldLineNumber===e.oldLineNumber&&this.newLineNumber===e.newLineNumber&&this.noTrailingNewLine===e.noTrailingNewLine}clone(e){return new t(e,this.type,this.originalLineNumber,this.oldLineNumber,this.newLineNumber,this.noTrailingNewLine)}},Xi=t=>t?t.type===Re.Add||t.type===Re.Delete:!1,ap=/["'&<>]/;function lp(t){let e=""+t,n=ap.exec(e);if(!n)return e;let i="",r,o,a=0;for(o=n.index;o<e.length;o++){switch(e.charCodeAt(o)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}a!==o&&(i+=e.slice(a,o)),a=o+1,i+=r}return a!==o?i+e.slice(a,o):i}var va=!1,rs=t=>t,hd=rs,md=rs;var Sr=()=>va,Nr=t=>va&&rs!==hd?hd(t):t,dp=t=>va&&rs!==md?md(t):t,fp=!1,cp=()=>fp;var up=!0,fa=()=>up;var Ir=t=>lp(t).replace(/\n/g,"").replace(/\r/g,""),yo=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="relative")return;let i=t.changes;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Nr:Ir,o=i.range,a=e.slice(0,o.location),l=e.slice(o.location,o.location+o.length),d=e.slice(o.location+o.length),u=l.includes(`
`),f=i.newLineSymbol,c=`<span data-range-start="${o.location}" data-range-end="${o.location+o.length}">`;c+=r(a),c+=`<span data-diff-highlight style="background-color: var(${n==="add"?Nn:In});border-radius: 0.2em;">`,c+=u?`${r(l)}<span data-newline-symbol>${xo(f)}</span>`:r(l),c+="</span>",c+=r(d),c+="</span>",t.plainTemplate=c,t.plainTemplateMode="relative"},gd=({diffLine:t,rawLine:e,operator:n})=>{if(t.plainTemplate&&t.plainTemplateMode==="fast-diff")return;let i=t.diffChanges;if(!i||!i.hasLineChange||!e)return;let r=Sr()?Nr:Ir,o="";i.range.forEach(({type:a,str:l,startIndex:d,endIndex:u},f,c)=>{let p=f===c.length-1;a===0?(o+=`<span>${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight style="background-color: var(${n==="add"?Nn:In});border-radius: 0.2em;">${xo(i.newLineSymbol)}</span>`:"",o+="</span>"):(o+=`<span data-range-start="${d}" data-range-end="${u}">`,o+=`<span data-diff-highlight style="background-color: var(${n==="add"?Nn:In});border-radius: 0.2em;">${r(l)}`,o+=p&&i.newLineSymbol?`<span data-newline-symbol data-diff-highlight>${xo(i.newLineSymbol)}</span>`:"",o+="</span></span>")}),t.plainTemplate=o,t.plainTemplateMode="fast-diff"},$o=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="relative"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let o=e.changes;if(!o||!o.hasLineChange)return;let a=Sr()?Nr:Ir,l=o.range,d=`<span data-range-start="${l.location}" data-range-end="${l.location+l.length}">`;(r=n?.nodeList)===null||r===void 0||r.forEach(({node:u,wrapper:f})=>{var c,p,m,g,x,w;if(u.endIndex<l.location||l.location+l.length<u.startIndex)d+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(p=((c=f?.properties)===null||c===void 0?void 0:c.className)||[])===null||p===void 0?void 0:p.join(" ")}" style="${((m=f?.properties)===null||m===void 0?void 0:m.style)||""}">${a(u.value)}</span>`;else{let _=l.location-u.startIndex,L=_<0?0:_,y=u.value.slice(0,L),I=u.value.slice(L,_+l.length),S=u.value.slice(_+l.length),$=y.length||l.location===u.startIndex,h=S.length||u.endIndex===l.location+l.length-1,b=I.includes(`
`);d+=`<span data-start="${u.startIndex}" data-end="${u.endIndex}" class="${(x=((g=f?.properties)===null||g===void 0?void 0:g.className)||[])===null||x===void 0?void 0:x.join(" ")}" style="${((w=f?.properties)===null||w===void 0?void 0:w.style)||""}">${a(y)}<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-left-radius: ${$?"0.2em":"0"};border-bottom-left-radius: ${$?"0.2em":"0"};border-top-right-radius: ${h||b?"0.2em":"0"};border-bottom-right-radius: ${h||b?"0.2em":"0"}">${b?`${a(I)}<span data-newline-symbol>${xo(o.newLineSymbol)}</span>`:a(I)}</span>${a(S)}</span>`}}),d+="</span>",e.syntaxTemplate=d,e.syntaxTemplateMode="relative",e.syntaxTemplateName=t._getHighlighterName()},vd=({diffFile:t,diffLine:e,syntaxLine:n,operator:i})=>{var r,o,a;if(!n||e.syntaxTemplate&&e.syntaxTemplateMode==="fast-diff"&&e.syntaxTemplateName===t._getHighlighterName()&&t._getHighlighterType()==="class")return;let l=e.diffChanges,d=e._diffChanges;if(!l||!l.hasLineChange)return;let u=Sr()?Nr:Ir,f="",c=((r=l?.range)===null||r===void 0?void 0:r.filter(g=>g.type!==0))||[],p=((o=d?.range)===null||o===void 0?void 0:o.filter(g=>g.type!==0))||[],m=0;(a=n?.nodeList)===null||a===void 0||a.forEach(({node:g,wrapper:x},w,_)=>{var L,y,I;f+=`<span data-start="${g.startIndex}" data-end="${g.endIndex}" class="${(y=((L=x?.properties)===null||L===void 0?void 0:L.className)||[])===null||y===void 0?void 0:y.join(" ")}" style="${((I=x?.properties)===null||I===void 0?void 0:I.style)||""}">`;let S=c[m],$=c.length===0&&p.length===0,h=w===_.length-1;for(let b=0;b<g.value.length;b++){let E=g.startIndex+b,D=g.value[b],M=b===g.value.length-1,W=h&&b===g.value.length-1;if(S)if(E<S.startIndex)f+=u(D);else if(E===S.startIndex)S.endIndex<=g.endIndex?f+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-radius: 0.2em;">`:f+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-left-radius: 0.2em;border-bottom-left-radius: 0.2em;">`,f+=u(D),(M||S.startIndex===S.endIndex)&&(f+="</span>"),S.endIndex===E&&(m++,S=c[m]);else if(E<S.endIndex){if(b===0){let P=S.startIndex>=g.startIndex&&S.endIndex<=g.endIndex,K=S.endIndex<=g.endIndex;f+=P?`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-radius: 0.2em;">`:K?`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`:`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});">`}f+=u(D),M&&(f+="</span>")}else E===S.endIndex&&(S.startIndex>=g.startIndex||b===0&&(f+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-top-right-radius: 0.2em;border-bottom-right-radius: 0.2em;">`),f+=u(D),f+="</span>",m++,S=c[m]);else f+=u(D),$&&W&&l.newLineSymbol&&(f+=`<span data-diff-highlight style="background-color: var(${i==="add"?Nn:In});border-radius: 0.2em;">`,f+=`<span data-newline-symbol>${xo(l.newLineSymbol)}</span></span>`)}f+="</span>"}),e.syntaxTemplate=f,e.syntaxTemplateMode="fast-diff",e.syntaxTemplateName=t._getHighlighterName()},_a=t=>{var e;let n="",i=Sr()?Nr:Ir;return(e=t?.nodeList)===null||e===void 0||e.forEach(({node:r,wrapper:o})=>{var a,l,d;n+=`<span data-start="${r.startIndex}" data-end="${r.endIndex}" class="${(l=((a=o?.properties)===null||a===void 0?void 0:a.className)||[])===null||l===void 0?void 0:l.join(" ")}" style="${((d=o?.properties)===null||d===void 0?void 0:d.style)||""}">${i(r.value)}</span>`}),n},ba=t=>t?(Sr()?Nr:Ir)(t):"",pp=40;function hp(t,e){throw new Error(e)}function mp(t){var e,n;if(t.length===0)return 0;for(let i=t.length-1;i>=0;i--){let r=t[i];for(let o=r.lines.length-1;o>=0;o--){let a=r.lines[o];if(a.type===Re.Hunk)continue;let l=(e=a.newLineNumber)!==null&&e!==void 0?e:0,d=(n=a.oldLineNumber)!==null&&n!==void 0?n:0;return l>d?l:d}}return 0}function gp(t,e,n){let i=n===null?1/0:e.oldStartLine-n.header.oldStartLine-n.header.oldLineCount;return t===0?e.oldStartLine>1&&e.newStartLine>1?$r.Up:$r.None:i<=pp?$r.Short:$r.Both}var Rd=(t,e)=>{let n=[];for(let i=0;i<t;i++)n.push(e(i));return n},_d=t=>{let e=t.lastIndexOf(".");return t.slice(e+1)},bd=(t,e,{diffFile:n,getAdditionRaw:i,getDeletionRaw:r,getAdditionSyntax:o,getDeletionSyntax:a})=>{if(t.length===e.length){let l=t.length;for(let d=0;d<l;d++){let u=t[d],f=e[d];if(!u.changes||!f.changes){let p=Bt.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Bt.prototype.clone.call(f,r(f.oldLineNumber)||f.text||""),{addRange:g,delRange:x}=op(p,m);u.changes=g,f.changes=x}let c=fa();if(!cp())c&&(yo({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),yo({diffLine:f,rawLine:r(f.oldLineNumber)||"",operator:"del"}),$o({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),$o({diffFile:n,diffLine:f,syntaxLine:a(f.oldLineNumber)||null,operator:"del"}));else{let p=Bt.prototype.clone.call(u,i(u.newLineNumber)||u.text||""),m=Bt.prototype.clone.call(f,r(f.oldLineNumber)||f.text||""),{addRange:g,delRange:x}=sp(p,m);u.diffChanges=g,f.diffChanges=x,u._diffChanges=x,f._diffChanges=g,c&&(gd({diffLine:u,rawLine:i(u.newLineNumber)||"",operator:"add"}),gd({diffLine:f,rawLine:r(f.oldLineNumber)||"",operator:"del"}),vd({diffFile:n,diffLine:u,syntaxLine:o(u.newLineNumber)||null,operator:"add"}),vd({diffFile:n,diffLine:f,syntaxLine:a(f.oldLineNumber)||null,operator:"del"}))}}}},vp=/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/,_p=/[\u202A-\u202E]|[\u2066-\u2069]/,Hd="+",Od="-",Bd=" ",Pd="\\",jd=`
`,bp=new Set([Hd,Od,Bd,Pd,jd]),ca=class{constructor(){Object.defineProperty(this,"__v_skip",{value:!0}),this.reset()}reset(){this.ls=0,this.le=-1,this.text=""}nextLine(){return this.ls=this.le+1,this.ls>=this.text.length?!1:(this.le=this.text.indexOf(`
`,this.ls),this.le===-1&&(this.le=this.text.length),this.ls!==this.le)}readLine(e){return e?this.nextLine()?this.text.substring(this.ls,this.le):null:this.nextLine()?this.text.substring(this.ls+1,this.le+1):this.text.length>this.ls?`
`:null}lineStartsWith(e){return this.text.startsWith(e,this.ls)}lineEndsWith(e){return this.text.endsWith(e,this.le)}peek(){let e=this.le+1;return e<this.text.length?this.text[e]:null}parseDiffHeader(){let e=!1;for(;this.nextLine();){if(this.lineStartsWith("Binary files ")&&this.lineEndsWith("differ"))return{isBinary:!0};if(this.lineStartsWith("---")&&(e=!0),this.lineStartsWith("+++"))return{isBinary:!1}}return null}numberFromGroup(e,n,i=null){let r=e[n];if(!r){if(!i)throw new Error(`Group ${n} missing from regexp match and no defaultValue was provided`);return i}let o=parseInt(r,10);if(isNaN(o))throw new Error(`Could not parse capture group ${n} into number: ${r}`);return o}parseHunkHeader(e){let n=vp.exec(e);if(!n)throw new Error("Invalid hunk header format");let i=this.numberFromGroup(n,1),r=this.numberFromGroup(n,2,1),o=this.numberFromGroup(n,3),a=this.numberFromGroup(n,4,1);return new da(i,r,o,a)}parseLinePrefix(e){return e&&e.length&&bp.has(e[0])?e[0]:null}parseHunk(e,n,i){let r=this.readLine(!0);if(!r)throw new Error("Expected hunk header but reached end of diff");let o=this.parseHunkHeader(r),a=new Array;a.push(new Bt(r,Re.Hunk,1,null,null));let l,d=o.oldStartLine,u=o.newStartLine,f=e;for(;l=this.parseLinePrefix(this.peek());){let c=this.readLine(!1);if(c===null)throw new Error("Expected unified diff line but reached end of diff");if(l===Pd){if(c.length<12)throw new Error('Expected "no newline at end of file" marker to be at least 12 bytes long');let m=a.length-1,g=a[m];a[m]=g.withNoTrailingNewLine(!0);continue}f++;let p;if(l===Hd)p=new Bt(c,Re.Add,f,null,u++);else if(l===Od)p=new Bt(c,Re.Delete,f,d++,null);else if(l===Bd||l===jd)p=new Bt(c,Re.Context,f,d++,u++);else return hp(l,`Unknown DiffLinePrefix: ${l}`);a.push(p)}if(a.length===1)throw new Error("Malformed diff, empty hunk");return new la(o,a,e,e+a.length-1,gp(n,o,i))}parse(e){this.text=e;try{let n=this.parseDiffHeader(),i=this.le,r=this.text.substring(0,i);if(!n)return{header:r,contents:"",hunks:[],isBinary:!1,maxLineNumber:0,hasHiddenBidiChars:!1};if(n.isBinary)return{header:r,contents:"",hunks:[],isBinary:!0,maxLineNumber:0,hasHiddenBidiChars:!1};let o=new Array,a=0,l=null;for(;this.peek();){let u=this.parseHunk(a,o.length,l);o.push(u),l=u,a+=u.lines.length}let d=this.text.substring(i+1,this.le).replace(/\n\\ No newline at end of file/g,"");return{header:r,contents:d,hunks:o,isBinary:n.isBinary,maxLineNumber:mp(o),hasHiddenBidiChars:_p.test(e)}}finally{this.reset()}}},wp=new ca;function v(t,e,n,i){if(n==="a"&&!i)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return n==="m"?i:n==="a"?i.call(t):i?i.value:e.get(t)}function z(t,e,n,i,r){if(i==="m")throw new TypeError("Private method is not writable");if(i==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof e=="function"?t!==e||!r:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return i==="a"?r.call(t,n):r?r.value=n:e.set(t,n),n}var es,go,Er,ua,pa=class extends Map{constructor(){super(...arguments),es.add(this),go.set(this,[]),Er.set(this,30)}get maxLength(){return v(this,Er,"f")}setMaxLength(e){z(this,Er,e,"f"),v(this,es,"m",ua).call(this)}set(e,n){return v(this,Er,"f")<=0?this:this.has(e)?this:(v(this,go,"f").push(e),v(this,es,"m",ua).call(this),super.set(e,n))}};go=new WeakMap,Er=new WeakMap,es=new WeakSet,ua=function(){for(;v(this,go,"f").length>v(this,Er,"f");){let e=v(this,go,"f").shift();e&&this.delete(e)}};var Wd,uo,xp,$i=new pa;$i.setMaxLength(50);$i.name="@git-diff-view/core";var ra=new Set,Eo=class t{static createInstance(e){let n=new t(e?.raw,e?.lang,e?.fileName);return n.ast=e?.ast,n.theme=e?.theme,n.rawFile=e?.rawFile||{},n.plainFile=e?.plainFile||{},n.hasDoRaw=e?.hasDoRaw,n.rawLength=e?.rawLength,n.syntaxFile=e?.syntaxFile||{},n.hasDoSyntax=e?.hasDoSyntax,n.syntaxLength=e?.syntaxLength,n.highlighterName=e?.highlighterName,n.highlighterType=e?.highlighterType,n.maxLineNumber=e?.maxLineNumber,n}constructor(e,n,i){Wd.add(this),this.raw=e,this.lang=n,this.fileName=i,uo.set(this,""),this.rawFile={},this.hasDoRaw=!1,this.syntaxFile={},this.plainFile={},this.hasDoSyntax=!1,this.maxLineNumber=0,this.raw=dp(e),Object.defineProperty(this,"__v_skip",{value:!0}),this.initId()}initId(){let e="-file--"+Math.random().toString().slice(2);for(;ra.has(e);)e="-file--"+Math.random().toString().slice(2);ra.add(e),z(this,uo,e,"f")}getId(){return v(this,uo,"f")}clearId(){ra.delete(v(this,uo,"f"))}doSyntax({registerHighlighter:e,theme:n}){if(!this.raw)return;let i=e||gr;if(this.rawLength&&this.rawLength>i.maxLineToIgnoreSyntax)return;let r=i;try{i.hasRegisteredCurrentLang(this.lang)||(r=gr)}catch{r=gr}if(this.hasDoSyntax&&r.name===this.highlighterName&&r.type===this.highlighterType&&(this.theme===n||r.type==="class")||(this.ast=r.getAST(this.raw,this.fileName,this.lang,n),this.theme=n,!this.ast))return;let{syntaxFileObject:o,syntaxFileLineNumber:a}=r.processAST(this.ast);fa()&&Object.values(o).forEach(l=>{l.template=_a(l)}),this.syntaxFile=o,this.syntaxLength=a,this.highlighterName=r.name,this.highlighterType=r.type,this.hasDoSyntax=!0}doRaw(){if(!this.raw||this.hasDoRaw)return;let n=this.raw.split(`
`);this.rawLength=n.length,this.maxLineNumber=n.length,this.rawFile={},this.plainFile={};let i=fa();for(let r=0;r<n.length;r++)this.rawFile[r+1]=r<n.length-1?n[r]+`
`:n[r],this.plainFile[r+1]={value:this.rawFile[r+1],template:i?ba(this.rawFile[r+1]):void 0};this.hasDoRaw=!0}};uo=new WeakMap,Wd=new WeakSet,xp=function(){this.rawLength&&this.syntaxLength&&(this.rawLength!==this.syntaxLength&&console.warn("[@git-diff-view/core] The rawLength does not match the syntaxLength."),Object.values(this.syntaxFile).forEach(({value:e,lineNumber:n})=>{e!==this.rawFile[n]&&console.warn("[@git-diff-view/core] Content mismatch detected at line "+n+": "+e+" !== "+this.rawFile[n])}))};function vr(t,e,n,i,r){let o=t+"--0.1.7--"+n+"--"+e;r&&(o=r+"--0.1.7--"+n+"--"+e);let a=t+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e;if(r&&(a=r+"--0.1.7--"+(n==="light"?"dark":"light")+"--"+e),$i.has(o))return $i.get(o);if($i.has(a)){let d=$i.get(a);if(d?.highlighterType==="class")return d}let l=new Eo(t,e,i);return $i.set(o,l),l}var os=$i;var is;(function(t){t[t.hunk=1]="hunk",t[t.content=2]="content",t[t.widget=3]="widget",t[t.extend=4]="extend"})(is||(is={}));var O;(function(t){t[t.old=1]="old",t[t.new=2]="new"})(O||(O={}));var ss=t=>{let e=t.splitLineLength,n=[];return Rd(e,i=>{let r=t.getSplitLeftLine(i),o=t.getSplitRightLine(i);!r?.isHidden&&!o?.isHidden&&n.push({type:is.content,index:i,lineNumber:i+1,splitLine:{left:r,right:o}})}),n};var wa=t=>{let e=t.unifiedLineLength,n=[];return Rd(e,i=>{let r=t.getUnifiedLine(i);r.isHidden||n.push({type:is.content,index:i,lineNumber:i+1,unifiedLine:r})}),n},yp=(t,e,n)=>{let i=t.getSplitLineByLineNumber(e,n),r=t.getUnifiedLineByLineNumber(e,n);return{split:!i||i.isHidden,unified:!r||r.isHidden}},Te,Xe,Je,ki,Si,Gn,Yn,Gi,Yi,qi,Ki,qn,Kn,Tn,Cn,Ct,it,ot,Ze,st,pi,br,wr,xr,yr,po,zi,ho,vo,_o,Ei,Li,ts,Ot,Ui,Vi,mo,hi,Ud,Vd,ha,zd,$p,ma,ga,wd,Gd,Lr,kr,bo,wo,xd,yd,je=40;var oa=new Set,Zi=class t{static createInstance(e,n){var i,r,o,a,l,d;let u=new t(((i=e?.oldFile)===null||i===void 0?void 0:i.fileName)||"",((r=e?.oldFile)===null||r===void 0?void 0:r.content)||"",((o=e?.newFile)===null||o===void 0?void 0:o.fileName)||"",((a=e?.newFile)===null||a===void 0?void 0:a.content)||"",e?.hunks||[],((l=e?.oldFile)===null||l===void 0?void 0:l.fileLang)||"",((d=e?.newFile)===null||d===void 0?void 0:d.fileLang)||"");return n&&(n.isFullMerge?u._mergeFullBundle(n):u.mergeBundle(n)),u}constructor(e,n,i,r,o,a,l,d){Te.add(this),this.uuid=d,Xe.set(this,void 0),Je.set(this,void 0),ki.set(this,void 0),Si.set(this,void 0),Gn.set(this,void 0),Yn.set(this,void 0),Gi.set(this,void 0),Yi.set(this,void 0),qi.set(this,void 0),Ki.set(this,void 0),qn.set(this,void 0),Kn.set(this,void 0),Tn.set(this,void 0),Cn.set(this,void 0),Ct.set(this,[]),it.set(this,[]),ot.set(this,void 0),Ze.set(this,[]),st.set(this,void 0),pi.set(this,[]),br.set(this,!1),wr.set(this,!1),xr.set(this,!1),yr.set(this,!1),po.set(this,0),zi.set(this,!1),ho.set(this,!1),vo.set(this,!1),_o.set(this,!1),Ei.set(this,void 0),Li.set(this,void 0),ts.set(this,!1),Ot.set(this,"light"),Ui.set(this,{state:!1}),Vi.set(this,{state:!1}),this._version_="0.1.7",this._oldFileName="",this._oldFileContent="",this._oldFileLang="",this._newFileName="",this._newFileContent="",this._newFileLang="",this._diffList=[],this.diffLineLength=0,this.splitLineLength=0,this.unifiedLineLength=0,this.fileLineLength=0,this.additionLength=0,this.deletionLength=0,this.hasSomeLineCollapsed=!1,mo.set(this,""),hi.set(this,new Map),this.getSplitLeftLine=f=>v(this,Ct,"f")[f],this.getSplitLineByLineNumber=(f,c)=>{var p,m;return c===O.old?(p=v(this,Ct,"f"))===null||p===void 0?void 0:p.find(g=>g.lineNumber===f):(m=v(this,it,"f"))===null||m===void 0?void 0:m.find(g=>g.lineNumber===f)},this.getSplitLineIndexByLineNumber=(f,c)=>{var p,m;return c===O.old?(p=v(this,Ct,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.lineNumber===f):(m=v(this,it,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.lineNumber===f)},this.getSplitRightLine=f=>v(this,it,"f")[f],this.getSplitHunkLine=f=>{var c;return(c=v(this,ot,"f"))===null||c===void 0?void 0:c[f]},this.onSplitHunkExpand=(f,c,p=!0)=>{var m,g,x;if(!this.getExpandEnabled())return;let w=(m=v(this,ot,"f"))===null||m===void 0?void 0:m[c];if(!(!w||!w.splitInfo)){if(f==="all"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.splitInfo={...w.splitInfo,...w.hunkInfo,plainText:w.text,startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(f==="down"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.startHiddenIndex+je;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.isLast?w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je}:w.splitInfo={...w.splitInfo,startHiddenIndex:w.splitInfo.startHiddenIndex+je,plainText:`@@ -${w.splitInfo.oldStartIndex},${w.splitInfo.oldLength} +${w.splitInfo.newStartIndex},${w.splitInfo.newLength}`}}else if(f==="down-all"){for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",startHiddenIndex:w.splitInfo.endHiddenIndex}}else if(f==="up"){if(w.isLast)return;for(let S=w.splitInfo.endHiddenIndex-je;S<w.splitInfo.endHiddenIndex;S++){let $=v(this,Ct,"f")[S],h=v(this,it,"f")[S];$?.isHidden&&($.isHidden=!1),h?.isHidden&&(h.isHidden=!1)}let _=w.splitInfo.oldStartIndex-je,L=w.splitInfo.oldLength+je,y=w.splitInfo.newStartIndex-je,I=w.splitInfo.newLength+je;w.splitInfo={...w.splitInfo,endHiddenIndex:w.splitInfo.endHiddenIndex-je,oldStartIndex:_,oldLength:L,newStartIndex:y,newLength:I,plainText:`@@ -${_},${L} +${y},${I}`},(g=v(this,ot,"f"))===null||g===void 0||delete g[c],v(this,ot,"f")[w.splitInfo.endHiddenIndex]=w}else if(f==="up-all"){if(w.isLast)return;for(let _=w.splitInfo.startHiddenIndex;_<w.splitInfo.endHiddenIndex;_++){let L=v(this,Ct,"f")[_],y=v(this,it,"f")[_];L?.isHidden&&(L.isHidden=!1),y?.isHidden&&(y.isHidden=!1)}w.splitInfo={...w.splitInfo,plainText:"",endHiddenIndex:w.splitInfo.startHiddenIndex},(x=v(this,ot,"f"))===null||x===void 0||delete x[c],v(this,ot,"f")[w.splitInfo.endHiddenIndex]=w}p&&this.notifyAll()}},this.getUnifiedLine=f=>v(this,Ze,"f")[f],this.getUnifiedLineByLineNumber=(f,c)=>{var p,m;return c===O.old?(p=v(this,Ze,"f"))===null||p===void 0?void 0:p.find(g=>g.oldLineNumber===f):(m=v(this,Ze,"f"))===null||m===void 0?void 0:m.find(g=>g.newLineNumber===f)},this.getUnifiedLineIndexByLineNumber=(f,c)=>{var p,m;return c===O.old?(p=v(this,Ze,"f"))===null||p===void 0?void 0:p.findIndex(g=>g.oldLineNumber===f):(m=v(this,Ze,"f"))===null||m===void 0?void 0:m.findIndex(g=>g.newLineNumber===f)},this.getUnifiedHunkLine=f=>{var c;return(c=v(this,st,"f"))===null||c===void 0?void 0:c[f]},this.onUnifiedHunkExpand=(f,c,p=!0)=>{var m,g,x,w;if(!this.getExpandEnabled())return;let _=(m=v(this,st,"f"))===null||m===void 0?void 0:m[c];if(!(!_||!_.unifiedInfo)){if(f==="all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=(g=v(this,Ze,"f"))===null||g===void 0?void 0:g[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,..._.hunkInfo,plainText:_.text,startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(f==="down"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.startHiddenIndex+je;L++){let y=v(this,Ze,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.isLast?_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je}:_.unifiedInfo={..._.unifiedInfo,startHiddenIndex:_.unifiedInfo.startHiddenIndex+je,plainText:`@@ -${_.unifiedInfo.oldStartIndex},${_.unifiedInfo.oldLength} +${_.unifiedInfo.newStartIndex},${_.unifiedInfo.newLength}`}}else if(f==="down-all"){for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=v(this,Ze,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",startHiddenIndex:_.unifiedInfo.endHiddenIndex}}else if(f==="up"){if(_.isLast)return;for(let $=_.unifiedInfo.endHiddenIndex-je;$<_.unifiedInfo.endHiddenIndex;$++){let h=v(this,Ze,"f")[$];h?.isHidden&&(h.isHidden=!1)}let L=_.unifiedInfo.oldStartIndex-je,y=_.unifiedInfo.oldLength+je,I=_.unifiedInfo.newStartIndex-je,S=_.unifiedInfo.newLength+je;_.unifiedInfo={..._.unifiedInfo,endHiddenIndex:_.unifiedInfo.endHiddenIndex-je,oldStartIndex:L,oldLength:y,newStartIndex:I,newLength:S,plainText:`@@ -${L},${y} +${I},${S}`},(x=v(this,st,"f"))===null||x===void 0||delete x[c],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}else if(f==="up-all"){if(_.isLast)return;for(let L=_.unifiedInfo.startHiddenIndex;L<_.unifiedInfo.endHiddenIndex;L++){let y=v(this,Ze,"f")[L];y?.isHidden&&(y.isHidden=!1)}_.unifiedInfo={..._.unifiedInfo,plainText:"",endHiddenIndex:_.unifiedInfo.startHiddenIndex},(w=v(this,st,"f"))===null||w===void 0||delete w[c],v(this,st,"f")[_.unifiedInfo.endHiddenIndex]=_}p&&this.notifyAll()}},this.onAllExpand=f=>{this.getExpandEnabled()&&(f==="split"?(Object.keys(v(this,ot,"f")||{}).forEach(c=>{this.onSplitHunkExpand("all",+c,!1)}),v(this,Ui,"f").state=!0):(Object.keys(v(this,st,"f")||{}).forEach(c=>{this.onUnifiedHunkExpand("all",+c,!1)}),v(this,Vi,"f").state=!0),this.notifyAll())},this.onAllCollapse=f=>{this.getExpandEnabled()&&(f==="split"?(Object.values(v(this,Ct,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,it,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,ot,"f")||{}).forEach(c=>{c.splitInfo&&(c.splitInfo={...c.splitInfo,oldStartIndex:c.splitInfo._oldStartIndex,oldLength:c.splitInfo._oldLength,newStartIndex:c.splitInfo._newStartIndex,newLength:c.splitInfo._newLength,startHiddenIndex:c.splitInfo._startHiddenIndex,endHiddenIndex:c.splitInfo._endHiddenIndex,plainText:c.splitInfo._plainText})}),Object.keys(v(this,ot,"f")||{}).forEach(c=>{let p=v(this,ot,"f")[c];p.splitInfo&&p.splitInfo.endHiddenIndex!==+c&&(delete v(this,ot,"f")[c],v(this,ot,"f")[p.splitInfo.endHiddenIndex]=p)}),v(this,Ui,"f").state=!1):(Object.values(v(this,Ze,"f")||{}).forEach(c=>{!c.isHidden&&c._isHidden&&(c.isHidden=c._isHidden)}),Object.values(v(this,st,"f")||{}).forEach(c=>{c.unifiedInfo&&(c.unifiedInfo={...c.unifiedInfo,oldStartIndex:c.unifiedInfo._oldStartIndex,oldLength:c.unifiedInfo._oldLength,newStartIndex:c.unifiedInfo._newStartIndex,newLength:c.unifiedInfo._newLength,startHiddenIndex:c.unifiedInfo._startHiddenIndex,endHiddenIndex:c.unifiedInfo._endHiddenIndex,plainText:c.unifiedInfo._plainText})}),Object.keys(v(this,st,"f")||{}).forEach(c=>{let p=v(this,st,"f")[c];p.unifiedInfo&&p.unifiedInfo.endHiddenIndex!==+c&&(delete v(this,st,"f")[c],v(this,st,"f")[p.unifiedInfo.endHiddenIndex]=p)}),v(this,Vi,"f").state=!1),this.notifyAll())},this.getOldFileContent=()=>{var f;return(f=v(this,Xe,"f"))===null||f===void 0?void 0:f.raw},this.getNewFileContent=()=>{var f;return(f=v(this,Je,"f"))===null||f===void 0?void 0:f.raw},this.getOldPlainLine=f=>{var c;return(c=v(this,qi,"f"))===null||c===void 0?void 0:c[f]},this.getOldSyntaxLine=f=>{var c;return(c=v(this,qn,"f"))===null||c===void 0?void 0:c[f]},this.getNewPlainLine=f=>{var c;return(c=v(this,Ki,"f"))===null||c===void 0?void 0:c[f]},this.getNewSyntaxLine=f=>{var c;return(c=v(this,Kn,"f"))===null||c===void 0?void 0:c[f]},this.subscribe=f=>(v(this,pi,"f").push(f),()=>{z(this,pi,v(this,pi,"f").filter(c=>c!==f),"f")}),this.notifyAll=f=>{var c;z(this,po,(c=v(this,po,"f"),c++,c),"f"),v(this,pi,"f").forEach(p=>{f&&p.isSyncExternal||p()}),v(this,hi,"f").forEach((p,m)=>{m.notifyAll(!0)})},this.getUpdateCount=()=>v(this,po,"f"),this.getExpandEnabled=()=>!v(this,zi,"f")&&!v(this,ho,"f"),this.getBundle=()=>{let f=v(this,br,"f"),c=v(this,wr,"f"),p=v(this,xr,"f"),m=v(this,yr,"f"),g=v(this,Gi,"f"),x=v(this,Gn,"f"),w=v(this,qi,"f"),_=v(this,qn,"f"),L=v(this,Tn,"f"),y=v(this,Yi,"f"),I=v(this,Yn,"f"),S=v(this,Ki,"f"),$=v(this,Kn,"f"),h=v(this,Cn,"f"),b=this.splitLineLength,E=this.unifiedLineLength,D=this.fileLineLength,M=this.additionLength,W=this.deletionLength,P=v(this,zi,"f"),K=v(this,ho,"f"),ee=v(this,Ei,"f"),re=v(this,Li,"f"),Z=this.hasSomeLineCollapsed,A=v(this,Ui,"f"),Y=v(this,Vi,"f"),j=v(this,Ct,"f"),V=v(this,it,"f"),H=v(this,ot,"f"),he=v(this,Ze,"f"),ie=v(this,st,"f"),Q=this._version_,ve=v(this,Ot,"f");return{hasInitRaw:f,hasInitSyntax:c,hasBuildSplit:p,hasBuildUnified:m,oldFileLines:g,oldFileDiffLines:x,oldFilePlainLines:w,oldFileSyntaxLines:_,oldFilePlaceholderLines:L,newFileLines:y,newFileDiffLines:I,newFilePlainLines:S,newFileSyntaxLines:$,newFilePlaceholderLines:h,splitLineLength:b,unifiedLineLength:E,fileLineLength:D,additionLength:M,deletionLength:W,splitLeftLines:j,splitRightLines:V,splitHunkLines:H,unifiedLines:he,unifiedHunkLines:ie,highlighterName:ee,highlighterType:re,composeByDiff:P,composeByRange:K,hasSomeLineCollapsed:Z,hasExpandSplitAll:A,hasExpandUnifiedAll:Y,version:Q,theme:ve,isFullMerge:!1}},this.mergeBundle=(f,c=!0)=>{z(this,br,f.hasInitRaw,"f"),z(this,wr,f.hasInitSyntax,"f"),z(this,xr,f.hasBuildSplit,"f"),z(this,yr,f.hasBuildUnified,"f"),z(this,zi,f.composeByDiff,"f"),z(this,ho,f.composeByRange,"f"),z(this,Ei,f.highlighterName,"f"),z(this,Li,f.highlighterType,"f"),z(this,Gi,f.oldFileLines,"f"),z(this,Gn,f.oldFileDiffLines,"f"),z(this,qi,f.oldFilePlainLines,"f"),z(this,qn,f.oldFileSyntaxLines,"f"),z(this,Tn,f.oldFilePlaceholderLines,"f"),z(this,Yi,f.newFileLines,"f"),z(this,Yn,f.newFileDiffLines,"f"),z(this,Ki,f.newFilePlainLines,"f"),z(this,Kn,f.newFileSyntaxLines,"f"),z(this,Cn,f.newFilePlaceholderLines,"f"),this.splitLineLength=f.splitLineLength,this.unifiedLineLength=f.unifiedLineLength,this.fileLineLength=f.fileLineLength,this.additionLength=f.additionLength,this.deletionLength=f.deletionLength,this.hasSomeLineCollapsed=f.hasSomeLineCollapsed,z(this,Ui,f.hasExpandSplitAll,"f"),z(this,Vi,f.hasExpandUnifiedAll,"f"),z(this,Ct,f.splitLeftLines,"f"),z(this,it,f.splitRightLines,"f"),z(this,ot,f.splitHunkLines,"f"),z(this,Ze,f.unifiedLines,"f"),z(this,st,f.unifiedHunkLines,"f"),z(this,Ot,f.theme,"f"),z(this,vo,!0,"f"),z(this,ts,!0,"f"),c&&this.notifyAll()},this.generateInstanceFromLineNumberRange=(f,c,p=O.new)=>{if(f>=c)return this;let m=this.getSplitLineIndexByLineNumber(f,p),g=this.getSplitLineIndexByLineNumber(c,p),x=this.getUnifiedLineIndexByLineNumber(f,p),w=this.getUnifiedLineIndexByLineNumber(c,p),_=[],L=[],y=[];for(let S=m;S<=g;S++){let $=this.getSplitLeftLine(S),h=this.getSplitRightLine(S);!$?.value&&!h?.value||(_.push({...$,isHidden:!1}),L.push({...h,isHidden:!1}))}for(let S=x;S<=w;S++){let $=this.getUnifiedLine(S);$?.value&&y.push({...$,isHidden:!1})}return t.createInstance({},{...this._getFullBundle(),composeByRange:!0,splitHunkLines:{},splitLeftLines:_,splitRightLines:L,splitLineLength:_.length,unifiedHunkLines:{},unifiedLines:y,unifiedLineLength:y.length})},this._getHighlighterName=()=>v(this,Ei,"f")||"",this._getHighlighterType=()=>v(this,Li,"f")||"",this._getIsPureDiffRender=()=>v(this,zi,"f"),this._getTheme=()=>v(this,Ot,"f"),this._getIsCloned=()=>v(this,ts,"f"),this._addClonedInstance=f=>{let c=()=>{this._notifyOthers(f),this._mergeFullBundle(f._getFullBundle(),!1)};c.isSyncExternal=!0;let p=f.subscribe(c);v(this,hi,"f").set(f,p)},this._notifyOthers=f=>{v(this,hi,"f").forEach((c,p)=>{p!==f&&p.notifyAll(!0)})},this._delClonedInstance=f=>{let c=v(this,hi,"f").get(f);c?.(),v(this,hi,"f").delete(f)},this._getFullBundle=()=>{let f=this.getBundle(),c=v(this,Xe,"f"),p=v(this,Je,"f"),m=v(this,Si,"f"),g=v(this,ki,"f");return{...f,oldFileResult:c,newFileResult:p,diffLines:m,diffListResults:g,isFullMerge:v(this,vo,"f")?v(this,_o,"f"):!0}},this._mergeFullBundle=(f,c=!0)=>{this.mergeBundle(f,c);try{z(this,Xe,f.oldFileResult?Eo.createInstance(f.oldFileResult):null,"f"),z(this,Je,f.newFileResult?Eo.createInstance(f.newFileResult):null,"f"),z(this,Si,f.diffLines,"f"),z(this,ki,f.diffListResults,"f"),z(this,_o,f.isFullMerge,"f")}catch{}},this._getAllListener=()=>v(this,pi,"f"),this._destroy=()=>{this.clearId(),v(this,pi,"f").splice(0,v(this,pi,"f").length),v(this,hi,"f").forEach(f=>f()),v(this,hi,"f").clear()},this.clear=()=>{this._destroy(),z(this,Xe,void 0,"f"),z(this,Je,void 0,"f"),z(this,Si,void 0,"f"),z(this,ki,void 0,"f"),z(this,Yn,void 0,"f"),z(this,Gn,void 0,"f"),z(this,Yi,void 0,"f"),z(this,Gi,void 0,"f"),z(this,Kn,void 0,"f"),z(this,qn,void 0,"f"),z(this,ot,void 0,"f"),z(this,Ct,[],"f"),z(this,it,[],"f"),z(this,st,void 0,"f"),z(this,Ze,[],"f"),z(this,Ot,"light","f")},Object.defineProperty(this,"__v_skip",{value:!0});let u=Array.from(new Set(o));this._oldFileName=e,this._newFileName=i,this._diffList=u,this._oldFileLang=_d(a||e||l||i)||"txt",this._newFileLang=_d(l||i||a||e)||"txt",this._oldFileContent=n,this._newFileContent=r,this.initId()}initId(){let e="-diff--"+Math.random().toString().slice(2);for(;oa.has(e);)e="-diff--"+Math.random().toString().slice(2);oa.add(e),z(this,mo,e,"f")}getId(){return v(this,mo,"f")}clearId(){oa.delete(v(this,mo,"f"))}initTheme(e){z(this,Ot,e||v(this,Ot,"f")||"light","f")}initRaw(){var e;v(this,br,"f")||(v(this,Te,"m",Vd).call(this),v(this,Te,"m",ha).call(this),v(this,Te,"m",Ud).call(this),v(this,Te,"m",ma).call(this),v(this,Te,"m",zd).call(this),v(this,Te,"m",ga).call(this),z(this,br,!0,"f"))}initSyntax({registerHighlighter:e}={}){var n,i;if(v(this,wr,"f")&&(!e||e.name===v(this,Ei,"f")&&e.type===v(this,Li,"f"))){z(this,Kn,(n=v(this,Je,"f"))===null||n===void 0?void 0:n.syntaxFile,"f"),z(this,qn,(i=v(this,Xe,"f"))===null||i===void 0?void 0:i.syntaxFile,"f");return}v(this,Te,"m",Gd).call(this,{registerHighlighter:e}),v(this,Te,"m",ma).call(this),z(this,wr,!0,"f")}init(){this.initRaw(),this.initSyntax()}buildSplitDiffLines(){var e,n,i,r,o,a;if(v(this,xr,"f"))return;let l=1,d=1,u=!0,f=1/0,c=((e=v(this,Xe,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Je,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=c||d<=p;){let m=v(this,Te,"m",Lr).call(this,l),g=v(this,Te,"m",kr).call(this,d),x=v(this,Te,"m",bo).call(this,l),w=v(this,Te,"m",wo).call(this,d),_=Bt.prototype.isIncludeableLine.call(m||{}),L=Bt.prototype.isIncludeableLine.call(g||{}),y=v(this,it,"f").length,I=!m&&!g;if(m&&!g){if(m.newLineNumber&&m.newLineNumber>d){d++;continue}(m.newLineNumber===null||m.newLineNumber===void 0)&&d++}if(g&&!m){if(g.oldLineNumber&&g.oldLineNumber>l){l++;continue}(g.oldLineNumber===null||g.oldLineNumber===void 0)&&l++}if(!m&&!x&&!g&&!w)break;if(!m&&!g){if(!((i=v(this,Tn,"f"))===null||i===void 0)&&i[l]&&(!((r=v(this,Cn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!x&&(!((o=v(this,Cn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!w&&(!((a=v(this,Tn,"f"))===null||a===void 0)&&a[l])){l++;continue}}if(_&&L||!_&&!L?(v(this,Ct,"f").push({lineNumber:l++,value:x,diff:m,isHidden:I,_isHidden:I}),v(this,it,"f").push({lineNumber:d++,value:w,diff:g,isHidden:I,_isHidden:I})):_?(v(this,Ct,"f").push({lineNumber:l++,value:x,diff:m,isHidden:I,_isHidden:I}),v(this,it,"f").push({})):L&&(v(this,Ct,"f").push({}),v(this,it,"f").push({lineNumber:d++,value:w,diff:g,isHidden:I,_isHidden:I})),!u&&I&&(f=y),I&&(this.hasSomeLineCollapsed=!0),u=I,m?.prevHunkLine||g?.prevHunkLine){let S=m?.prevHunkLine||g?.prevHunkLine;S&&(S.isFirst?(S.splitInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},f=1/0):Number.isFinite(f)&&(S.splitInfo={...S.hunkInfo,startHiddenIndex:f,endHiddenIndex:y,plainText:S.text,_startHiddenIndex:f,_endHiddenIndex:y,_plainText:S.text},f=1/0),z(this,ot,{...v(this,ot,"f"),[y]:S},"f"))}}if(Number.isFinite(f)){let g=new Bt("",Re.Hunk,null,null,null);g.isLast=!0,g.splitInfo={startHiddenIndex:f,endHiddenIndex:v(this,it,"f").length,_startHiddenIndex:f,_endHiddenIndex:v(this,it,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},z(this,ot,{...v(this,ot,"f"),[v(this,it,"f").length]:g},"f"),f=1/0}this.splitLineLength=v(this,it,"f").length,z(this,xr,!0,"f"),this.notifyAll()}buildUnifiedDiffLines(){var e,n,i,r,o,a;if(v(this,yr,"f"))return;let l=1,d=1,u=!0,f=1/0,c=((e=v(this,Xe,"f"))===null||e===void 0?void 0:e.maxLineNumber)||0,p=((n=v(this,Je,"f"))===null||n===void 0?void 0:n.maxLineNumber)||0;for(;l<=c||d<=p;){let m=v(this,Te,"m",bo).call(this,l),g=v(this,Te,"m",Lr).call(this,l),x=v(this,Te,"m",wo).call(this,d),w=v(this,Te,"m",kr).call(this,d),_=Bt.prototype.isIncludeableLine.call(g||{}),L=Bt.prototype.isIncludeableLine.call(w||{}),y=v(this,Ze,"f").length,I=!g&&!w;if(g&&!w){if(g.newLineNumber&&g.newLineNumber>d){d++;continue}(g.newLineNumber===null||g.newLineNumber===void 0)&&d++}if(w&&!g){if(w.oldLineNumber&&w.oldLineNumber>l){l++;continue}(w.oldLineNumber===null||w.oldLineNumber===void 0)&&l++}if(!m&&!x&&!w&&!g)break;if(!g&&!w){if(!((i=v(this,Tn,"f"))===null||i===void 0)&&i[l]&&(!((r=v(this,Cn,"f"))===null||r===void 0)&&r[d])){l++,d++;continue}if(!m&&(!((o=v(this,Cn,"f"))===null||o===void 0)&&o[d])){d++;continue}if(!x&&(!((a=v(this,Tn,"f"))===null||a===void 0)&&a[l])){l++;continue}}if(!_&&!L?v(this,Ze,"f").push({oldLineNumber:l++,newLineNumber:d++,value:x,diff:w,isHidden:I,_isHidden:I}):_?v(this,Ze,"f").push({oldLineNumber:l++,value:m,diff:g,isHidden:I,_isHidden:I}):L&&v(this,Ze,"f").push({newLineNumber:d++,value:x,diff:w,isHidden:I,_isHidden:I}),!u&&I&&(f=y),I&&(this.hasSomeLineCollapsed=!0),u=I,g?.prevHunkLine||w?.prevHunkLine){let S=g?.prevHunkLine||w?.prevHunkLine;S&&(S.isFirst?(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:0,endHiddenIndex:S.hunkInfo.newStartIndex-1,plainText:S.text,_startHiddenIndex:0,_endHiddenIndex:S.hunkInfo.newStartIndex-1,_plainText:S.text},f=1/0):Number.isFinite(f)&&(S.unifiedInfo={...S.hunkInfo,startHiddenIndex:f,endHiddenIndex:y,plainText:S.text,_startHiddenIndex:f,_endHiddenIndex:y,_plainText:S.text},f=1/0),z(this,st,{...v(this,st,"f"),[y]:S},"f"))}}if(Number.isFinite(f)){let g=new Bt("",Re.Hunk,null,null,null);g.isLast=!0,g.unifiedInfo={startHiddenIndex:f,endHiddenIndex:v(this,Ze,"f").length,_startHiddenIndex:f,_endHiddenIndex:v(this,Ze,"f").length,plainText:"",oldStartIndex:0,newStartIndex:0,oldLength:0,newLength:0,_plainText:"",_oldStartIndex:0,_newStartIndex:0,_oldLength:0,_newLength:0},z(this,st,{...v(this,st,"f"),[v(this,Ze,"f").length]:g},"f"),f=1/0}this.unifiedLineLength=v(this,Ze,"f").length,z(this,yr,!0,"f"),this.notifyAll()}get hasExpandSplitAll(){return v(this,Ui,"f").state}get hasExpandUnifiedAll(){return v(this,Vi,"f").state}};Xe=new WeakMap,Je=new WeakMap,ki=new WeakMap,Si=new WeakMap,Gn=new WeakMap,Yn=new WeakMap,Gi=new WeakMap,Yi=new WeakMap,qi=new WeakMap,Ki=new WeakMap,qn=new WeakMap,Kn=new WeakMap,Tn=new WeakMap,Cn=new WeakMap,Ct=new WeakMap,it=new WeakMap,ot=new WeakMap,Ze=new WeakMap,st=new WeakMap,pi=new WeakMap,br=new WeakMap,wr=new WeakMap,xr=new WeakMap,yr=new WeakMap,po=new WeakMap,zi=new WeakMap,ho=new WeakMap,vo=new WeakMap,_o=new WeakMap,Ei=new WeakMap,Li=new WeakMap,ts=new WeakMap,Ot=new WeakMap,Ui=new WeakMap,Vi=new WeakMap,mo=new WeakMap,hi=new WeakMap,Te=new WeakSet,Ud=function(){this._diffList&&z(this,ki,this._diffList.map(e=>wp.parse(e)),"f")},Vd=function(){!this._oldFileContent&&!this._newFileContent||(this._oldFileContent&&z(this,Xe,vr(this._oldFileContent,this._oldFileLang,v(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),this._newFileContent&&z(this,Je,vr(this._newFileContent,this._newFileLang,v(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"))},ha=function(){var e,n,i,r,o,a,l,d;(e=v(this,Xe,"f"))===null||e===void 0||e.doRaw(),z(this,Gi,(n=v(this,Xe,"f"))===null||n===void 0?void 0:n.rawFile,"f"),z(this,qi,(i=v(this,Xe,"f"))===null||i===void 0?void 0:i.plainFile,"f"),(r=v(this,Je,"f"))===null||r===void 0||r.doRaw(),z(this,Yi,(o=v(this,Je,"f"))===null||o===void 0?void 0:o.rawFile,"f"),z(this,Ki,(a=v(this,Je,"f"))===null||a===void 0?void 0:a.plainFile,"f"),this.fileLineLength=Math.max(this.fileLineLength,((l=v(this,Xe,"f"))===null||l===void 0?void 0:l.maxLineNumber)||0,((d=v(this,Je,"f"))===null||d===void 0?void 0:d.maxLineNumber)||0)},zd=function(){if(this._oldFileContent&&this._newFileContent)return;let e={},n={};if(!this._oldFileContent&&!this._newFileContent){let i=1,r=1,o="",a="",l=!1;for(;r<=this.diffLineLength||i<=this.diffLineLength;){let d=r++,u=i++,f=v(this,Te,"m",Lr).call(this,d),c=v(this,Te,"m",kr).call(this,u);f?o+=f.text:(o+=`
`,e[d]=!0),c?a+=c.text:(a+=`
`,n[u]=!0),!l&&f&&c&&(l=l||f.noTrailingNewLine!==c.noTrailingNewLine)}if(!l&&o===a)return;this._oldFileContent=o,this._newFileContent=a,z(this,Xe,vr(this._oldFileContent,this._oldFileLang,v(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f"),z(this,Je,vr(this._newFileContent,this._newFileLang,v(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f"),z(this,Tn,e,"f"),z(this,Cn,n,"f"),z(this,zi,!0,"f")}else if(v(this,Xe,"f")){let i=1,r=1,o="",a=!1;for(;r<=v(this,Xe,"f").maxLineNumber;){let l=v(this,Te,"m",kr).call(this,i++),d=v(this,Te,"m",Lr).call(this,r);l?(o+=l.text,r=l.oldLineNumber?l.oldLineNumber+1:r):(d||(o+=v(this,Te,"m",bo).call(this,r)),r++),!a&&l&&d&&(a=a||l.noTrailingNewLine!==d.noTrailingNewLine)}if(!a&&o===this._oldFileContent)return;this._newFileContent=o,z(this,Je,vr(this._newFileContent,this._newFileLang,v(this,Ot,"f"),this._newFileName,this.uuid?this.uuid+"-new":void 0),"f")}else if(v(this,Je,"f")){let i=1,r=1,o="",a=!1;for(;r<=v(this,Je,"f").maxLineNumber;){let l=v(this,Te,"m",Lr).call(this,i++),d=v(this,Te,"m",kr).call(this,r);l?(o+=l.text,r=l.newLineNumber?l.newLineNumber+1:r):(d||(o+=v(this,Te,"m",wo).call(this,r)),r++),!a&&d&&l&&(a=a||d.noTrailingNewLine!==l.noTrailingNewLine)}if(!a&&o===this._newFileContent)return;this._oldFileContent=o,z(this,Xe,vr(this._oldFileContent,this._oldFileLang,v(this,Ot,"f"),this._oldFileName,this.uuid?this.uuid+"-old":void 0),"f")}v(this,Te,"m",ha).call(this)},$p=function(){var e,n,i,r;for(let o in v(this,Gn,"f")||{}){let a=(e=v(this,Gn,"f"))===null||e===void 0?void 0:e[o],l=(n=v(this,qi,"f"))===null||n===void 0?void 0:n[o];if((!v(this,Tn,"f")||!v(this,Tn,"f")[o])&&a?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'oldFileContent' and 'diff' at line ${o}. Please verify the 'oldFileContent' is correct.`);break}}for(let o in v(this,Yn,"f")||{}){let a=(i=v(this,Yn,"f"))===null||i===void 0?void 0:i[o],l=(r=v(this,Ki,"f"))===null||r===void 0?void 0:r[o];if((!v(this,Cn,"f")||!v(this,Cn,"f")[o])&&a?.text!==l?.value){console.warn(`[@git-diff-view/core] Mismatch detected between 'newFileContent' and 'diff' at line ${o}. Please verify the 'newFileContent' is correct.`);break}}},ma=function(){var e;if(!(!((e=v(this,ki,"f"))===null||e===void 0)&&e.length))return;let n=f=>v(this,Te,"m",wo).call(this,f),i=f=>v(this,Te,"m",bo).call(this,f),r=f=>v(this,Te,"m",yd).call(this,f),o=f=>v(this,Te,"m",xd).call(this,f);z(this,Si,[],"f"),this.additionLength=0,this.deletionLength=0;let a=[];v(this,ki,"f").forEach(f=>{f.hunks.forEach(p=>{let m=[],g=[];p.lines.forEach(x=>{x.type===Re.Add?(m.push(x),this.additionLength++):x.type===Re.Delete?(g.push(x),this.deletionLength++):(bd(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o}),m=[],g=[]),a.push(x)}),bd(m,g,{diffFile:this,getAdditionRaw:n,getDeletionRaw:i,getAdditionSyntax:r,getDeletionSyntax:o})})});let l=null;z(this,Si,a.map((f,c)=>{var p;let m=f;if(m.index=c,m.isFirst=c===0,m.type===Re.Hunk){let g=(p=m.text.split("@@"))===null||p===void 0?void 0:p[1].split(" ").filter(Boolean),x=g?.[0]||"",w=g?.[1]||"",[_,L]=x.split(","),[y,I]=w.split(",");m.hunkInfo={oldStartIndex:-Number(_),oldLength:Number(L),newStartIndex:+Number(y),newLength:Number(I),_oldStartIndex:-Number(_),_oldLength:Number(L),_newStartIndex:+Number(y),_newLength:Number(I)},l=m}else if(m.type===Re.Context){let g=f;l&&(g.prevHunkLine=l,l=null)}else l=null;return m}),"f"),z(this,Gn,{},"f"),z(this,Yn,{},"f");let d=-1,u=-1;v(this,Si,"f").forEach(f=>{f.oldLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,f.oldLineNumber),v(this,Gn,"f")[f.oldLineNumber]=f),f.newLineNumber&&(this.diffLineLength=Math.max(this.diffLineLength,f.newLineNumber),v(this,Yn,"f")[f.newLineNumber]=f)})},ga=function(){var e,n,i,r,o,a;z(this,Ei,((e=v(this,Xe,"f"))===null||e===void 0?void 0:e.highlighterName)||((n=v(this,Je,"f"))===null||n===void 0?void 0:n.highlighterName)||v(this,Ei,"f"),"f"),z(this,Li,((i=v(this,Xe,"f"))===null||i===void 0?void 0:i.highlighterType)||((r=v(this,Je,"f"))===null||r===void 0?void 0:r.highlighterType)||v(this,Li,"f"),"f"),!((o=v(this,Xe,"f"))===null||o===void 0)&&o.highlighterName&&z(this,qn,v(this,Xe,"f").syntaxFile,"f"),!((a=v(this,Je,"f"))===null||a===void 0)&&a.highlighterName&&z(this,Kn,v(this,Je,"f").syntaxFile,"f")},wd=function({registerHighlighter:e}){var n,i,r,o;(n=v(this,Xe,"f"))===null||n===void 0||n.doSyntax({registerHighlighter:e,theme:v(this,Ot,"f")}),z(this,qn,(i=v(this,Xe,"f"))===null||i===void 0?void 0:i.syntaxFile,"f"),(r=v(this,Je,"f"))===null||r===void 0||r.doSyntax({registerHighlighter:e,theme:v(this,Ot,"f")}),z(this,Kn,(o=v(this,Je,"f"))===null||o===void 0?void 0:o.syntaxFile,"f")},Gd=function({registerHighlighter:e}={}){v(this,vo,"f")&&!v(this,_o,"f")||(v(this,Te,"m",wd).call(this,{registerHighlighter:e}),v(this,Te,"m",ga).call(this))},Lr=function(e){var n;if(e)return(n=v(this,Gn,"f"))===null||n===void 0?void 0:n[e]},kr=function(e){var n;if(e)return(n=v(this,Yn,"f"))===null||n===void 0?void 0:n[e]},bo=function(e){var n;return(n=v(this,Gi,"f"))===null||n===void 0?void 0:n[e]},wo=function(e){var n;return(n=v(this,Yi,"f"))===null||n===void 0?void 0:n[e]},xd=function(e){var n;return(n=v(this,qn,"f"))===null||n===void 0?void 0:n[e]},yd=function(e){var n;return(n=v(this,Kn,"f"))===null||n===void 0?void 0:n[e]};var Yd="diff-multi-select-active";function $d(t){if(!t)return null;let e=t.querySelector("span[data-line-num]");if(!e)return null;let n=e.getAttribute("data-line-num"),i=parseInt(n??"",10);return n!==i.toString()||isNaN(i)?null:i}function Ep(t){if(!t)return null;let e=t.closest("[data-side]");return e?e.getAttribute("data-side"):null}function Ed(t){if(!t)return null;let e=t.closest(".diff-line-num");if(!e)return null;let n=e.querySelector("span[data-line-old-num]"),i=e.querySelector("span[data-line-new-num]"),r=n?.getAttribute("data-line-old-num"),o=i?.getAttribute("data-line-new-num"),a=r?parseInt(r,10):void 0,l=o?parseInt(o,10):void 0;return a===void 0&&l===void 0?null:{old:a,new:l}}function Ld(t,e=!1){var n,i,r,o;if(!t)return null;let a=null;if(!e||t.closest(".diff-add-widget-wrapper")){let l=t.closest(".diff-line-new-content"),d=t.closest(".diff-line-old-content");l&&(a=(i=(n=l.parentElement)===null||n===void 0?void 0:n.querySelector(".diff-line-new-num"))!==null&&i!==void 0?i:null),d&&(a=(o=(r=d.parentElement)===null||r===void 0?void 0:r.querySelector(".diff-line-old-num"))!==null&&o!==void 0?o:null)}return a||(a=t.closest(".diff-line-new-num")||t.closest(".diff-line-old-num")),a}function as(t){let e=Math.min(t.startLineNumber,t.endLineNumber),n=Math.max(t.startLineNumber,t.endLineNumber);return{...t,startLineNumber:e,endLineNumber:n}}var qd=t=>{let e=[];return t.new&&t.new.length&&e.push({side:"new",startLineNumber:Math.min(...t.new),endLineNumber:Math.max(...t.new)}),t.old&&t.old.length&&e.push({side:"old",startLineNumber:Math.min(...t.old),endLineNumber:Math.max(...t.old)}),e},Lp=(t,e,n,i)=>{Np(e,n).forEach(o=>{var a,l;if(!o.isHide&&o.index){let d=t.filter(u=>u.getAttribute("data-line")===o.index.toString());if(d.length===2)if(o.isContext)d.forEach(u=>u.querySelectorAll("td").forEach(f=>f.classList.add(i)));else{let u=d.find(f=>f.getAttribute("data-side")===n.side);u?.querySelectorAll("td").forEach(f=>f.classList.add(i))}else o.isContext?(a=d[0])===null||a===void 0||a.querySelectorAll("td").forEach(u=>u.classList.add(i)):(l=d[0])===null||l===void 0||l.querySelectorAll(`td[data-side="${n.side}"]`).forEach(u=>u.classList.add(i))}})};function kp(t,e,n,i={old:[],new:[]},r=Yd){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(c=>{var p;return((p=c.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),d=qd(i),f=(e?d.concat(e):d).map(as);l.forEach(c=>{c.querySelectorAll("td").forEach(m=>m.classList.remove(r))}),f.forEach(c=>{c&&n&&Lp(l,n,c,r)})}function Sp(t,e,n,i={old:[],new:[]},r=Yd){if(!t)return;let o=`diff-root${n?.getId()}`,l=Array.from(t.querySelectorAll("tr[data-line]")).filter(c=>{var p;return((p=c.closest(".diff-view-wrapper"))===null||p===void 0?void 0:p.getAttribute("id"))===o}),d=qd(i),f=(e?d.concat(e):d).map(as);l.forEach(c=>{let p=c.querySelector(".diff-line-num"),m=c.querySelector(".diff-line-content");if(!p||!m)return;p.classList.remove(r),m.classList.remove(r);let g=p.querySelector("span[data-line-old-num]"),x=p.querySelector("span[data-line-new-num]"),w=g?.getAttribute("data-line-old-num"),_=x?.getAttribute("data-line-new-num"),L=w?parseInt(w,10):void 0,y=_?parseInt(_,10):void 0;f.some(I=>I.side==="old"&&L&&L>=I.startLineNumber&&L<=I.endLineNumber||I.side==="new"&&y&&y>=I.startLineNumber&&y<=I.endLineNumber)&&(p.classList.add(r),m.classList.add(r))})}function Np(t,e){var n;let i=as(e),r=[],{side:o,startLineNumber:a,endLineNumber:l}=i,d=o==="old"?O.old:O.new;for(let u=a;u<=l;u++){let f=t.getSplitLineByLineNumber(u,d),c=t.getSplitLineIndexByLineNumber(u,d);if(f&&f.lineNumber!==void 0){let p=(n=f.diff)===null||n===void 0?void 0:n.type;r.push({index:c+1,lineNumber:f.lineNumber,value:f.value,isHide:yp(t,u,d).split,isDelete:p===Re.Delete,isAdd:p===Re.Add,isContext:p===Re.Context||p===void 0})}}return r}var Sn,_r,Qo,pt,Ae,sa,aa,Ip,kd,Sd,Tp,Nd,Id,Td,Cd,Fd,co,Dd;_r=new WeakMap,Qo=new WeakMap,pt=new WeakMap,Ae=new WeakMap,sa=new WeakMap,aa=new WeakMap,Ip=new WeakMap,kd=new WeakMap,Sd=new WeakMap,Sn=new WeakSet,Tp=function(){var e;if(!v(this,_r,"f")||v(this,aa,"f"))return;let n=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Id).call(this,o):v(this,Sn,"m",Nd).call(this,o)},i=o=>{v(this,pt,"f").isUnifiedMode?v(this,Sn,"m",Cd).call(this,o):v(this,Sn,"m",Td).call(this,o)},r=()=>{v(this,Sn,"m",Fd).call(this)};z(this,aa,{mousedown:n,mouseover:i,mouseup:r},"f"),v(this,_r,"f").addEventListener("mousedown",n),v(this,_r,"f").addEventListener("mouseover",i),document.addEventListener("mouseup",r),z(this,kd,((e=v(this,Qo,"f"))===null||e===void 0?void 0:e.subscribe(()=>v(this,Sd,"f").call(this)))||(()=>{}),"f")},Nd=function(e){let n=Ld(e.target,!0);if(!n)return;let i=$d(n);if(i===null)return;let r=Ep(n);if(!r)return;v(this,Ae,"f").isSelecting=!0,v(this,Ae,"f").startInfo={lineNumber:i,side:r};let o={side:r,startLineNumber:i,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let a=v(this,pt,"f").scopeToHunk(o);a&&(o=a)}v(this,Ae,"f").currentRange=o,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(o,{...v(this,Ae,"f")})},Id=function(e){var n;let i=Ed(e.target);if(!i)return;let r=(n=i.new)!==null&&n!==void 0?n:i.old;if(r===void 0)return;let o=i.new!==void 0?"new":"old";v(this,Ae,"f").isSelecting=!0,v(this,Ae,"f").startInfo={lineNumber:r,side:o};let a={side:o,startLineNumber:r,endLineNumber:r};if(v(this,pt,"f").scopeToHunk){let l=v(this,pt,"f").scopeToHunk(a);l&&(a=l)}v(this,Ae,"f").currentRange=a,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(a,{...v(this,Ae,"f")})},Td=function(e){if(!v(this,Ae,"f").isSelecting||!v(this,Ae,"f").startInfo)return;let n=Ld(e.target);if(!n)return;let i=$d(n);if(i===null)return;let r={side:v(this,Ae,"f").startInfo.side,startLineNumber:v(this,Ae,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Ae,"f").currentRange=r,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Ae,"f")})},Cd=function(e){if(!v(this,Ae,"f").isSelecting||!v(this,Ae,"f").startInfo)return;let n=Ed(e.target);if(!n)return;let i=n[v(this,Ae,"f").startInfo.side];if(i===void 0)return;let r={side:v(this,Ae,"f").startInfo.side,startLineNumber:v(this,Ae,"f").startInfo.lineNumber,endLineNumber:i};if(v(this,pt,"f").scopeToHunk){let o=v(this,pt,"f").scopeToHunk(r);o&&(r=o)}v(this,Ae,"f").currentRange=r,v(this,Sn,"m",co).call(this),v(this,pt,"f").onSelectionChange(r,{...v(this,Ae,"f")})},Fd=function(){if(!v(this,Ae,"f").isSelecting||!v(this,Ae,"f").currentRange){v(this,Sn,"m",Dd).call(this);return}let e=as(v(this,Ae,"f").currentRange);v(this,Ae,"f").currentRange=e,v(this,Ae,"f").isSelecting=!1;let n=this.getSelectionResult();v(this,pt,"f").onSelectionComplete(n)},co=function(){v(this,pt,"f").isUnifiedMode?Sp(v(this,_r,"f"),v(this,Ae,"f").currentRange,v(this,Qo,"f"),v(this,sa,"f"),v(this,pt,"f").selectedClassName):kp(v(this,_r,"f"),v(this,Ae,"f").currentRange,v(this,Qo,"f"),v(this,sa,"f"),v(this,pt,"f").selectedClassName)},Dd=function(){z(this,Ae,{isSelecting:!1,startInfo:null,currentRange:null},"f")};var Lo=class{diff(e,n,i={}){let r;typeof i=="function"?(r=i,i={}):"callback"in i&&(r=i.callback);let o=this.castInput(e,i),a=this.castInput(n,i),l=this.removeEmpty(this.tokenize(o,i)),d=this.removeEmpty(this.tokenize(a,i));return this.diffWithOptionsObj(l,d,i,r)}diffWithOptionsObj(e,n,i,r){var o;let a=L=>{if(L=this.postProcess(L,i),r){setTimeout(function(){r(L)},0);return}else return L},l=n.length,d=e.length,u=1,f=l+d;i.maxEditLength!=null&&(f=Math.min(f,i.maxEditLength));let c=(o=i.timeout)!==null&&o!==void 0?o:1/0,p=Date.now()+c,m=[{oldPos:-1,lastComponent:void 0}],g=this.extractCommon(m[0],n,e,0,i);if(m[0].oldPos+1>=d&&g+1>=l)return a(this.buildValues(m[0].lastComponent,n,e));let x=-1/0,w=1/0,_=()=>{for(let L=Math.max(x,-u);L<=Math.min(w,u);L+=2){let y,I=m[L-1],S=m[L+1];I&&(m[L-1]=void 0);let $=!1;if(S){let b=S.oldPos-L;$=S&&0<=b&&b<l}let h=I&&I.oldPos+1<d;if(!$&&!h){m[L]=void 0;continue}if(!h||$&&I.oldPos<S.oldPos?y=this.addToPath(S,!0,!1,0,i):y=this.addToPath(I,!1,!0,1,i),g=this.extractCommon(y,n,e,L,i),y.oldPos+1>=d&&g+1>=l)return a(this.buildValues(y.lastComponent,n,e))||!0;m[L]=y,y.oldPos+1>=d&&(w=Math.min(w,L-1)),g+1>=l&&(x=Math.max(x,L+1))}u++};if(r)(function L(){setTimeout(function(){if(u>f||Date.now()>p)return r(void 0);_()||L()},0)})();else for(;u<=f&&Date.now()<=p;){let L=_();if(L)return L}}addToPath(e,n,i,r,o){let a=e.lastComponent;return a&&!o.oneChangePerToken&&a.added===n&&a.removed===i?{oldPos:e.oldPos+r,lastComponent:{count:a.count+1,added:n,removed:i,previousComponent:a.previousComponent}}:{oldPos:e.oldPos+r,lastComponent:{count:1,added:n,removed:i,previousComponent:a}}}extractCommon(e,n,i,r,o){let a=n.length,l=i.length,d=e.oldPos,u=d-r,f=0;for(;u+1<a&&d+1<l&&this.equals(i[d+1],n[u+1],o);)u++,d++,f++,o.oneChangePerToken&&(e.lastComponent={count:1,previousComponent:e.lastComponent,added:!1,removed:!1});return f&&!o.oneChangePerToken&&(e.lastComponent={count:f,previousComponent:e.lastComponent,added:!1,removed:!1}),e.oldPos=d,u}equals(e,n,i){return i.comparator?i.comparator(e,n):e===n||!!i.ignoreCase&&e.toLowerCase()===n.toLowerCase()}removeEmpty(e){let n=[];for(let i=0;i<e.length;i++)e[i]&&n.push(e[i]);return n}castInput(e,n){return e}tokenize(e,n){return Array.from(e)}join(e){return e.join("")}postProcess(e,n){return e}get useLongestToken(){return!1}buildValues(e,n,i){let r=[],o;for(;e;)r.push(e),o=e.previousComponent,delete e.previousComponent,e=o;r.reverse();let a=r.length,l=0,d=0,u=0;for(;l<a;l++){let f=r[l];if(f.removed)f.value=this.join(i.slice(u,u+f.count)),u+=f.count;else{if(!f.added&&this.useLongestToken){let c=n.slice(d,d+f.count);c=c.map(function(p,m){let g=i[u+m];return g.length>p.length?g:p}),f.value=this.join(c)}else f.value=this.join(n.slice(d,d+f.count));d+=f.count,f.added||(u+=f.count)}}return r}};var xa=class extends Lo{constructor(){super(...arguments),this.tokenize=Fp}equals(e,n,i){return i.ignoreWhitespace?((!i.newlineIsToken||!e.includes(`
`))&&(e=e.trim()),(!i.newlineIsToken||!n.includes(`
`))&&(n=n.trim())):i.ignoreNewlineAtEof&&!i.newlineIsToken&&(e.endsWith(`
`)&&(e=e.slice(0,-1)),n.endsWith(`
`)&&(n=n.slice(0,-1))),super.equals(e,n,i)}},Cp=new xa;function ya(t,e,n){return Cp.diff(t,e,n)}function Fp(t,e){e.stripTrailingCr&&(t=t.replace(/\r\n/g,`
`));let n=[],i=t.split(/(\n|\r\n)/);i[i.length-1]||i.pop();for(let r=0;r<i.length;r++){let o=i[r];r%2&&!e.newlineIsToken?n[n.length-1]+=o:n.push(o)}return n}var Kd={includeIndex:!0,includeUnderline:!0,includeFileHeaders:!0};function $a(t,e,n,i,r,o,a){let l;a?typeof a=="function"?l={callback:a}:l=a:l={},typeof l.context>"u"&&(l.context=4);let d=l.context;if(l.newlineIsToken)throw new Error("newlineIsToken may not be used with patch-generation functions, only with diffing functions");if(l.callback){let{callback:f}=l;ya(n,i,Object.assign(Object.assign({},l),{callback:c=>{let p=u(c);f(p)}}))}else return u(ya(n,i,l));function u(f){if(!f)return;f.push({value:"",lines:[]});function c(L){return L.map(function(y){return" "+y})}let p=[],m=0,g=0,x=[],w=1,_=1;for(let L=0;L<f.length;L++){let y=f[L],I=y.lines||Dp(y.value);if(y.lines=I,y.added||y.removed){if(!m){let S=f[L-1];m=w,g=_,S&&(x=d>0?c(S.lines.slice(-d)):[],m-=x.length,g-=x.length)}for(let S of I)x.push((y.added?"+":"-")+S);y.added?_+=I.length:w+=I.length}else{if(m)if(I.length<=d*2&&L<f.length-2)for(let S of c(I))x.push(S);else{let S=Math.min(I.length,d);for(let h of c(I.slice(0,S)))x.push(h);let $={oldStart:m,oldLines:w-m+S,newStart:g,newLines:_-g+S,lines:x};p.push($),m=0,g=0,x=[]}w+=I.length,_+=I.length}}for(let L of p)for(let y=0;y<L.lines.length;y++)L.lines[y].endsWith(`
`)?L.lines[y]=L.lines[y].slice(0,-1):(L.lines.splice(y+1,0,"\\ No newline at end of file"),y++);return{oldFileName:t,newFileName:e,oldHeader:r,newHeader:o,hunks:p}}}function ls(t,e){if(e||(e=Kd),Array.isArray(t)){if(t.length>1&&!e.includeFileHeaders)throw new Error("Cannot omit file headers on a multi-file patch. (The result would be unparseable; how would a tool trying to apply the patch know which changes are to which file?)");return t.map(i=>ls(i,e)).join(`
`)}let n=[];e.includeIndex&&t.oldFileName==t.newFileName&&n.push("Index: "+t.oldFileName),e.includeUnderline&&n.push("==================================================================="),e.includeFileHeaders&&(n.push("--- "+t.oldFileName+(typeof t.oldHeader>"u"?"":"	"+t.oldHeader)),n.push("+++ "+t.newFileName+(typeof t.newHeader>"u"?"":"	"+t.newHeader)));for(let i=0;i<t.hunks.length;i++){let r=t.hunks[i];r.oldLines===0&&(r.oldStart-=1),r.newLines===0&&(r.newStart-=1),n.push("@@ -"+r.oldStart+","+r.oldLines+" +"+r.newStart+","+r.newLines+" @@");for(let o of r.lines)n.push(o)}return n.join(`
`)+`
`}function Ea(t,e,n,i,r,o,a){if(typeof a=="function"&&(a={callback:a}),a?.callback){let{callback:l}=a;$a(t,e,n,i,r,o,Object.assign(Object.assign({},a),{callback:d=>{l(d?ls(d,a.headerOptions):void 0)}}))}else{let l=$a(t,e,n,i,r,o,a);return l?ls(l,a?.headerOptions):void 0}}function Dp(t){let e=t.endsWith(`
`),n=t.split(`
`).map(i=>i+`
`);return e?n.pop():n.push(n.pop().slice(0,-1)),n}os.name="@git-diff-view/file";function Zd(t,e,n,i,r,o,a,l){let d=Ea(t,n,e,i,"","",a);return new Zi(t,e,n,i,[d],r,o,l)}var Tr;(function(t){t[t.CRLF=1]="CRLF",t[t.CR=2]="CR",t[t.LF=3]="LF",t[t.NEWLINE=4]="NEWLINE",t[t.NORMAL=5]="NORMAL",t[t.NULL=6]="NULL"})(Tr||(Tr={}));var Pt;(function(t){t[t.SplitGitHub=1]="SplitGitHub",t[t.SplitGitLab=2]="SplitGitLab",t[t.Split=3]="Split",t[t.Unified=4]="Unified"})(Pt||(Pt={}));typeof window<"u"&&((window.__svelte??={}).v??=new Set).add("5");var Zn={};var We=Symbol("uninitialized"),tn=Symbol("filename");var ds="http://www.w3.org/1999/xhtml",ko="http://www.w3.org/2000/svg",La="http://www.w3.org/1998/Math/MathML";var Xd=globalThis.process?.env?.NODE_ENV,R=Xd&&!Xd.toLowerCase().startsWith("prod");var mi=Array.isArray,Jd=Array.prototype.indexOf,Ni=Array.prototype.includes,Cr=Array.from,ka=Object.keys,jt=Object.defineProperty,cn=Object.getOwnPropertyDescriptor,Sa=Object.getOwnPropertyDescriptors,Na=Object.prototype,Qd=Array.prototype,Fr=Object.getPrototypeOf,Ia=Object.isExtensible;var ht=()=>{};function fs(t){for(var e=0;e<t.length;e++)t[e]()}function cs(){var t,e,n=new Promise((i,r)=>{t=i,e=r});return{promise:n,resolve:t,reject:e}}var qt=Symbol("$state"),us=Symbol("legacy props"),ef=Symbol(""),ps=Symbol("proxy path"),hs=Symbol("attributes"),So=Symbol("class"),No=Symbol("style"),Io=Symbol("text");var Ta=Symbol("hmr anchor"),gi=new class extends Error{name="StaleReactionError";message="The reaction that called `getAbortSignal()` was re-run or destroyed"},Ca=!!globalThis.document?.contentType&&globalThis.document.contentType.includes("xml");var Dr=3,un=8;function tf(t){if(R){let e=new Error(`invariant_violation
An invariant violation occurred, meaning Svelte's internal assumptions were flawed. This is a bug in Svelte, not your app \u2014 please open an issue at https://github.com/sveltejs/svelte, citing the following message: "${t}"
https://svelte.dev/e/invariant_violation`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/invariant_violation")}function Ar(t){if(R){let e=new Error(`lifecycle_outside_component
\`${t}(...)\` can only be used during component initialisation
https://svelte.dev/e/lifecycle_outside_component`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/lifecycle_outside_component")}function rf(){if(R){let t=new Error("async_derived_orphan\nCannot create a `$derived(...)` with an `await` expression outside of an effect tree\nhttps://svelte.dev/e/async_derived_orphan");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/async_derived_orphan")}function of(){if(R){let t=new Error(`derived_references_self
A derived value cannot reference itself recursively
https://svelte.dev/e/derived_references_self`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/derived_references_self")}function Fa(t,e,n){if(R){let i=new Error(`each_key_duplicate
${n?`Keyed each block has duplicate key \`${n}\` at indexes ${t} and ${e}`:`Keyed each block has duplicate key at indexes ${t} and ${e}`}
https://svelte.dev/e/each_key_duplicate`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_duplicate")}function sf(t,e,n){if(R){let i=new Error(`each_key_volatile
Keyed each block has key that is not idempotent \u2014 the key for item at index ${t} was \`${e}\` but is now \`${n}\`. Keys must be the same each time for a given item
https://svelte.dev/e/each_key_volatile`);throw i.name="Svelte error",i}else throw new Error("https://svelte.dev/e/each_key_volatile")}function af(t){if(R){let e=new Error(`effect_in_teardown
\`${t}\` cannot be used inside an effect cleanup function
https://svelte.dev/e/effect_in_teardown`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_in_teardown")}function lf(){if(R){let t=new Error("effect_in_unowned_derived\nEffect cannot be created inside a `$derived` value that was not itself created inside an effect\nhttps://svelte.dev/e/effect_in_unowned_derived");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_in_unowned_derived")}function df(t){if(R){let e=new Error(`effect_orphan
\`${t}\` can only be used inside an effect (e.g. during component initialisation)
https://svelte.dev/e/effect_orphan`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/effect_orphan")}function ff(){if(R){let t=new Error(`effect_update_depth_exceeded
Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
https://svelte.dev/e/effect_update_depth_exceeded`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/effect_update_depth_exceeded")}function cf(){if(R){let t=new Error(`hydration_failed
Failed to hydrate the application
https://svelte.dev/e/hydration_failed`);throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/hydration_failed")}function uf(){if(R){let t=new Error("invalid_snippet\nCould not `{@render}` snippet due to the expression being `null` or `undefined`. Consider using optional chaining `{@render snippet?.()}`\nhttps://svelte.dev/e/invalid_snippet");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/invalid_snippet")}function pf(t){if(R){let e=new Error(`props_rest_readonly
Rest element properties of \`$props()\` such as \`${t}\` are readonly
https://svelte.dev/e/props_rest_readonly`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/props_rest_readonly")}function hf(t){if(R){let e=new Error(`rune_outside_svelte
The \`${t}\` rune is only available inside \`.svelte\` and \`.svelte.js/ts\` files
https://svelte.dev/e/rune_outside_svelte`);throw e.name="Svelte error",e}else throw new Error("https://svelte.dev/e/rune_outside_svelte")}function mf(){if(R){let t=new Error("set_context_after_init\n`setContext` must be called when a component first initializes, not in a subsequent effect or after an `await` expression\nhttps://svelte.dev/e/set_context_after_init");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/set_context_after_init")}function gf(){if(R){let t=new Error("state_descriptors_fixed\nProperty descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.\nhttps://svelte.dev/e/state_descriptors_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_descriptors_fixed")}function vf(){if(R){let t=new Error("state_prototype_fixed\nCannot set prototype of `$state` object\nhttps://svelte.dev/e/state_prototype_fixed");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_prototype_fixed")}function _f(){if(R){let t=new Error("state_unsafe_mutation\nUpdating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`\nhttps://svelte.dev/e/state_unsafe_mutation");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/state_unsafe_mutation")}function bf(){if(R){let t=new Error("svelte_boundary_reset_onerror\nA `<svelte:boundary>` `reset` function cannot be called while an error is still being handled\nhttps://svelte.dev/e/svelte_boundary_reset_onerror");throw t.name="Svelte error",t}else throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror")}var Xn="font-weight: bold",Jn="font-weight: normal";function wf(t){R?console.warn(`%c[svelte] await_reactivity_loss
%cDetected reactivity loss when reading \`${t}\`. This happens when state is read in an async function after an earlier \`await\`
https://svelte.dev/e/await_reactivity_loss`,Xn,Jn):console.warn("https://svelte.dev/e/await_reactivity_loss")}function xf(t,e){R?console.warn(`%c[svelte] await_waterfall
%cAn async derived, \`${t}\` (${e}) was not read immediately after it resolved. This often indicates an unnecessary waterfall, which can slow down your app
https://svelte.dev/e/await_waterfall`,Xn,Jn):console.warn("https://svelte.dev/e/await_waterfall")}function yf(){R?console.warn(`%c[svelte] derived_inert
%cReading a derived belonging to a now-destroyed effect may result in stale values
https://svelte.dev/e/derived_inert`,Xn,Jn):console.warn("https://svelte.dev/e/derived_inert")}function $f(t,e,n){R?console.warn(`%c[svelte] hydration_attribute_changed
%cThe \`${t}\` attribute on \`${e}\` changed its value between server and client renders. The client value, \`${n}\`, will be ignored in favour of the server value
https://svelte.dev/e/hydration_attribute_changed`,Xn,Jn):console.warn("https://svelte.dev/e/hydration_attribute_changed")}function Ef(t){R?console.warn(`%c[svelte] hydration_html_changed
%c${t?`The value of an \`{@html ...}\` block ${t} changed between server and client renders. The client value will be ignored in favour of the server value`:"The value of an `{@html ...}` block changed between server and client renders. The client value will be ignored in favour of the server value"}
https://svelte.dev/e/hydration_html_changed`,Xn,Jn):console.warn("https://svelte.dev/e/hydration_html_changed")}function Ii(t){R?console.warn(`%c[svelte] hydration_mismatch
%c${t?`Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near ${t}`:"Hydration failed because the initial UI does not match what was rendered on the server"}
https://svelte.dev/e/hydration_mismatch`,Xn,Jn):console.warn("https://svelte.dev/e/hydration_mismatch")}function Lf(){R?console.warn(`%c[svelte] lifecycle_double_unmount
%cTried to unmount a component that was not mounted
https://svelte.dev/e/lifecycle_double_unmount`,Xn,Jn):console.warn("https://svelte.dev/e/lifecycle_double_unmount")}function ms(t){R?console.warn(`%c[svelte] state_proxy_equality_mismatch
%cReactive \`$state(...)\` proxies and the values they proxy have different identities. Because of this, comparisons with \`${t}\` will produce unexpected results
https://svelte.dev/e/state_proxy_equality_mismatch`,Xn,Jn):console.warn("https://svelte.dev/e/state_proxy_equality_mismatch")}function kf(){R?console.warn(`%c[svelte] state_proxy_unmount
%cTried to unmount a state proxy, rather than a component
https://svelte.dev/e/state_proxy_unmount`,Xn,Jn):console.warn("https://svelte.dev/e/state_proxy_unmount")}function Sf(){R?console.warn("%c[svelte] svelte_boundary_reset_noop\n%cA `<svelte:boundary>` `reset` function only resets the boundary the first time it is called\nhttps://svelte.dev/e/svelte_boundary_reset_noop",Xn,Jn):console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}var le=!1;function mt(t){le=t}var _e;function Me(t){if(t===null)throw Ii(),Zn;return _e=t}function Et(){return Me(Lt(_e))}function T(t){if(le){if(Lt(_e)!==null)throw Ii(),Zn;_e=t}}function Ji(t=1){if(le){for(var e=t,n=_e;e--;)n=Lt(n);_e=n}}function Qn(t=!0){for(var e=0,n=_e;;){if(n.nodeType===un){var i=n.data;if(i==="]"){if(e===0)return n;e-=1}else(i==="["||i==="[!"||i[0]==="["&&!isNaN(Number(i.slice(1))))&&(e+=1)}var r=Lt(n);t&&n.remove(),n=r}}function Co(t){if(!t||t.nodeType!==un)throw Ii(),Zn;return t.data}function gs(t){return t===this.v}function Da(t,e){return t!=t?e==e:t!==e||t!==null&&typeof t=="object"||typeof t=="function"}function vs(t){return!Da(t,this.v)}var gt=!1,vi=!1,Fn=!1;function Nf(){vi=!0}var Fo=null;function Wt(t,e){return t.label=e,bs(t.v,e),t}function bs(t,e){return t?.[ps]?.(e),t}function Dn(t){let e=new Error,n=Rp();return n.length===0?null:(n.unshift(`
`),jt(e,"stack",{value:n.join(`
`)}),jt(e,"name",{value:t}),e)}function Rp(){let t=Error.stackTraceLimit;Error.stackTraceLimit=1/0;let e=new Error().stack;if(Error.stackTraceLimit=t,!e)return[];let n=e.split(`
`),i=[];for(let r=0;r<n.length;r++){let o=n[r],a=o.replaceAll("\\","/");if(o.trim()!=="Error"){if(o.includes("validate_each_keys"))return[];a.includes("svelte/src/internal")||a.includes("node_modules/.vite")||i.push(o)}}return i}function Tf(t,e){if(!R)throw new Error("invariant(...) was not guarded by if (DEV)");t||tf(e)}var Ee=null;function _i(t){Ee=t}var An=null;function Hr(t){An=t}var pn=null;function ws(t){pn=t}function Ye(t){return Cf("getContext").get(t)}function qe(t,e){let n=Cf("setContext");if(gt){var i=ae.f,r=!me&&(i&32)!==0&&!Ee.i;r||mf()}return n.set(t,e),e}function de(t,e=!1,n){Ee={p:Ee,i:!1,c:null,e:null,s:t,x:null,r:ae,l:vi&&!e?{s:null,u:null,$:[]}:null},R&&(Ee.function=n,pn=n)}function fe(t){var e=Ee,n=e.e;if(n!==null){e.e=null;for(var i of n)Aa(i)}return t!==void 0&&(e.x=t),e.i=!0,Ee=e.p,R&&(pn=Ee?.function??null),t??{}}function ei(){return!vi||Ee!==null&&Ee.l===null}function Cf(t){return Ee===null&&Ar(t),Ee.c??=new Map(Hp(Ee)||void 0)}function Hp(t){let e=t.p;for(;e!==null;){let n=e.c;if(n!==null)return n;e=e.p}return null}var Qi=[];function Ff(){var t=Qi;Qi=[],fs(t)}function kt(t){if(Qi.length===0&&!er){var e=Qi;queueMicrotask(()=>{e===Qi&&Ff()})}Qi.push(t)}function Df(){for(;Qi.length>0;)Ff()}var Ma=new WeakMap;function xs(t){var e=ae;if(e===null)return me.f|=8388608,t;if(R&&t instanceof Error&&!Ma.has(t)&&Ma.set(t,Op(t,e)),(e.f&32768)===0&&(e.f&4)===0)throw R&&!e.parent&&t instanceof Error&&Af(t),t;Rn(t,e)}function Rn(t,e){if(!(e!==null&&(e.f&16384)!==0)){for(;e!==null;){if((e.f&128)!==0){if((e.f&32768)===0)throw t;try{e.b.error(t);return}catch(n){t=n}}e=e.parent}throw R&&t instanceof Error&&Af(t),t}}function Op(t,e){let n=cn(t,"message");if(!(n&&!n.configurable)){for(var i=Ao?"  ":"	",r=`
${i}in ${e.fn?.name||"<unknown>"}`,o=e.ctx;o!==null;)r+=`
${i}in ${o.function?.[tn].split("/").pop()}`,o=o.p;return{message:t.message+`
${r}
`,stack:t.stack?.split(`
`).filter(a=>!a.includes("svelte/src/internal")).join(`
`)}}}function Af(t){let e=Ma.get(t);e&&(jt(t,"message",{value:e.message}),jt(t,"stack",{value:e.stack}))}var Bp=-7169;function He(t,e){t.f=t.f&Bp|e}function Or(t){(t.f&512)!==0||t.deps===null?He(t,1024):He(t,4096)}function Mf(t){if(t!==null)for(let e of t)(e.f&2)===0||(e.f&65536)===0||(e.f^=65536,Mf(e.deps))}function ys(t,e,n){(t.f&2048)!==0?e.add(t):(t.f&4096)!==0&&n.add(t),Mf(t.deps),He(t,1024)}var Rf=!1;function ti(t){var e=me,n=ae;wt(null),xt(null);try{return t()}finally{wt(e),xt(n)}}function Of(t){let e=0,n=Gt(0),i;return R&&Wt(n,"createSubscriber version"),()=>{Ti()&&(s(n),Kt(()=>(e===0&&(i=Qe(()=>t(()=>rr(n)))),e+=1,()=>{kt(()=>{e-=1,e===0&&(i?.(),i=void 0,rr(n))})})))}}var Wp=589824;function Ha(t,e,n,i){new Ra(t,e,n,i)}var Ra=class{parent;is_pending=!1;transform_error;#e;#t=le?_e:null;#n;#l;#o;#s=null;#i=null;#a=null;#r=null;#h=0;#f=0;#c=!1;#u=new Set;#g=new Set;#d=null;#b=Of(()=>(this.#d=Gt(this.#h),R&&Wt(this.#d,"$effect.pending()"),()=>{this.#d=null}));constructor(e,n,i,r){this.#e=e,this.#n=n,this.#l=o=>{var a=ae;a.b=this,a.f|=128,i(o)},this.parent=ae.b,this.transform_error=r??this.parent?.transform_error??(o=>o),this.#o=sn(()=>{if(le){let o=this.#t;Et();let a=o.data==="[!";if(o.data.startsWith("[?")){let d=JSON.parse(o.data.slice("[?".length));this.#w(d)}else a?this.#y():this.#v()}else this.#x()},Wp),le&&(this.#e=_e)}#v(){try{this.#s=dt(()=>this.#l(this.#e))}catch(e){this.error(e)}}#w(e){let n=this.#n.failed;n&&(this.#a=dt(()=>{n(this.#e,()=>e,()=>()=>{})}))}#y(){let e=this.#n.pending;e&&(this.is_pending=!0,this.#i=dt(()=>e(this.#e)),kt(()=>{var n=this.#r=document.createDocumentFragment(),i=yt();n.append(i),this.#s=this.#_(()=>dt(()=>this.#l(i))),this.#f===0&&(this.#e.before(n),this.#r=null,ni(this.#i,()=>{this.#i=null}),this.#p(be))}))}#x(){try{if(this.is_pending=this.has_pending_snippet(),this.#f=0,this.#h=0,this.#s=dt(()=>{this.#l(this.#e)}),this.#f>0){var e=this.#r=document.createDocumentFragment();Br(this.#s,e);let n=this.#n.pending;this.#i=dt(()=>n(this.#e))}else this.#p(be)}catch(n){this.error(n)}}#p(e){this.is_pending=!1,e.transfer_effects(this.#u,this.#g)}defer_effect(e){ys(e,this.#u,this.#g)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#n.pending}#_(e){var n=ae,i=me,r=Ee;xt(this.#o),wt(this.#o),_i(this.#o.ctx);try{return hn.ensure(),e()}catch(o){return xs(o),null}finally{xt(n),wt(i),_i(r)}}#m(e,n){if(!this.has_pending_snippet()){this.parent&&this.parent.#m(e,n);return}this.#f+=e,this.#f===0&&(this.#p(n),this.#i&&ni(this.#i,()=>{this.#i=null}),this.#r&&(this.#e.before(this.#r),this.#r=null))}update_pending_count(e,n){this.#m(e,n),this.#h+=e,!(!this.#d||this.#c)&&(this.#c=!0,kt(()=>{this.#c=!1,this.#d&&Hn(this.#d,this.#h)}))}get_effect_pending(){return this.#b(),s(this.#d)}error(e){if(!this.#n.onerror&&!this.#n.failed)throw e;be?.is_fork?(this.#s&&be.skip_effect(this.#s),this.#i&&be.skip_effect(this.#i),this.#a&&be.skip_effect(this.#a),be.oncommit(()=>{this.#$(e)})):this.#$(e)}#$(e){this.#s&&(tt(this.#s),this.#s=null),this.#i&&(tt(this.#i),this.#i=null),this.#a&&(tt(this.#a),this.#a=null),le&&(Me(this.#t),Ji(),Me(Qn()));var n=this.#n.onerror;let i=this.#n.failed;var r=!1,o=!1;let a=()=>{if(r){Sf();return}r=!0,o&&bf(),this.#a!==null&&ni(this.#a,()=>{this.#a=null}),this.#_(()=>{this.#x()})},l=d=>{try{o=!0,n?.(d,a),o=!1}catch(u){Rn(u,this.#o&&this.#o.parent)}i&&(this.#a=this.#_(()=>{try{return dt(()=>{var u=ae;u.b=this,u.f|=128,i(this.#e,()=>d,()=>a)})}catch(u){return Rn(u,this.#o.parent),null}}))};kt(()=>{var d;try{d=this.transform_error(e)}catch(u){Rn(u,this.#o&&this.#o.parent);return}d!==null&&typeof d=="object"&&typeof d.then=="function"?d.then(l,u=>Rn(u,this.#o&&this.#o.parent)):l(d)})}};function $s(t,e,n,i){let r=ei()?jr:Wr;var o=t.filter(m=>!m.settled),a=e.map(r);if(R&&a.forEach((m,g)=>{m.label=e[g].toString().replace("() => ","").replaceAll("$.eager(() => ","$state.eager(").replace(/\$\.get\((.+?)\)/g,(x,w)=>w)}),n.length===0&&o.length===0){i(a);return}var l=ae,d=Pf(),u=o.length===1?o[0].promise:o.length>1?Promise.all(o.map(m=>m.promise)):null;function f(m){if((l.f&16384)===0){d();try{i([...a,...m])}catch(g){Rn(g,l)}Pr()}}var c=Oa();if(n.length===0){u.then(()=>f([])).finally(c);return}function p(){Promise.all(n.map(m=>Pa(m))).then(f).catch(m=>Rn(m,l)).finally(c)}u?u.then(()=>{d(),p(),Pr()}):p()}function Pf(){var t=ae,e=me,n=Ee,i=be;if(R)var r=An;return function(a=!0){xt(t),wt(e),_i(n),a&&(t.f&16384)===0&&(i?.activate(),i?.apply()),R&&(Ba(null),Hr(r))}}function Pr(t=!0){xt(null),wt(null),_i(null),t&&be?.deactivate(),R&&(Ba(null),Hr(null))}function Oa(){var t=ae,e=t.b,n=be,i=!!e?.is_rendered();return e?.update_pending_count(1,n),n.increment(i,t),()=>{e?.update_pending_count(-1,n),n.decrement(i,t)}}var an=null;function Ba(t){an=t}var Ro=new Set;function jr(t){var e=2050;ae!==null&&(ae.f|=524288);let n={ctx:Ee,deps:null,effects:null,equals:gs,f:e,fn:t,reactions:null,rv:0,v:We,wv:0,parent:ae,ac:null};return R&&Fn&&(n.created=Dn("created at")),n}var Ur=Symbol("obsolete");function Pa(t,e,n){let i=ae;i===null&&rf();var r=void 0,o=Gt(We);R&&(o.label=e??t.toString());var a=!me,l=new Set;return Uf(()=>{var d=ae;R&&(an={effect:d,effect_deps:new Set,warned:!1});var u=cs();r=u.promise;try{Promise.resolve(t()).then(u.resolve,m=>{m!==gi&&u.reject(m)}).finally(Pr)}catch(m){u.reject(m),Pr()}if(R){if(an){if(d.deps!==null)for(let m=0;m<Zt;m+=1)an.effect_deps.add(d.deps[m]);if(St!==null)for(let m=0;m<St.length;m+=1)an.effect_deps.add(St[m])}an=null}var f=be;if(a){if((d.f&32768)!==0)var c=Oa();if(i.b?.is_rendered())f.async_deriveds.get(d)?.reject(Ur);else for(let m of l.values())m.reject(Ur);l.add(u),f.async_deriveds.set(d,u)}let p=(m,g=void 0)=>{R&&(an=null),c?.(),l.delete(u),g!==Ur&&(f.activate(),g?(o.f|=8388608,Hn(o,g)):((o.f&8388608)!==0&&(o.f^=8388608),R&&n!==void 0&&!o.equals(m)&&(Ro.add(o),setTimeout(()=>{Ro.has(o)&&(d.f&16384)===0&&(xf(o.label,n),Ro.delete(o))})),Hn(o,m)),f.deactivate())};u.promise.then(p,m=>p(null,m||"unknown"))}),Vt(()=>{for(let d of l)d.reject(Ur)}),R&&(o.f|=4194304),new Promise(d=>{function u(f){function c(){f===r?d(o):u(r)}f.then(c,c)}u(r)})}function k(t){let e=jr(t);return gt||ks(e),e}function Wr(t){let e=jr(t);return e.equals=vs,e}function jf(t){var e=t.effects;if(e!==null){t.effects=null;for(var n=0;n<e.length;n+=1)tt(e[n])}}var ja=[];function Ho(t){var e,n=ae,i=t.parent;if(!wn&&i!==null&&t.v!==We&&(i.f&24576)!==0)return yf(),t.v;if(xt(i),R){let r=or;Es(new Set);try{Ni.call(ja,t)&&of(),ja.push(t),t.f&=-65537,jf(t),e=Ls(t)}finally{xt(n),Es(r),ja.pop()}}else try{t.f&=-65537,jf(t),e=Ls(t)}finally{xt(n)}return e}function Wa(t){var e=Ho(t);if(!t.equals(e)&&(t.wv=Vr(),(!be?.is_fork||t.deps===null)&&(be!==null?(be.capture(t,e,!0),Ci?.capture(t,e,!0)):t.v=e,t.deps===null))){He(t,1024);return}wn||(Nt!==null?(Ti()||be?.is_fork)&&Nt.set(t,e):Or(t))}function Wf(t){if(t.effects!==null)for(let e of t.effects)(e.teardown||e.ac)&&(e.teardown?.(),e.ac!==null&&ti(()=>{e.ac.abort(gi),e.ac=null}),e.fn!==null&&(e.teardown=ht),sr(e,0),Oo(e))}function Ua(t){if(t.effects!==null)for(let e of t.effects)e.teardown&&e.fn!==null&&ii(e)}var Ss=null,zr=null,be=null,Ci=null,Nt=null,Ga=null,er=!1,Va=!1,ar=null,Bo=null,Vf=0,za=new Set,zp=1,hn=class t{id=zp++;#e=!1;linked=!0;#t=null;#n=null;async_deriveds=new Map;current=new Map;previous=new Map;#l=new Set;#o=new Set;#s=0;#i=new Map;#a=null;#r=[];#h=[];#f=new Set;#c=new Set;#u=new Map;#g=new Set;is_fork=!1;#d=!1;constructor(){zr===null?Ss=zr=this:(zr.#n=this,this.#t=zr),zr=this}#b(){if(this.is_fork)return!0;for(let i of this.#i.keys()){for(var e=i,n=!1;e.parent!==null;){if(this.#u.has(e)){n=!0;break}e=e.parent}if(!n)return!0}return!1}skip_effect(e){this.#u.has(e)||this.#u.set(e,{d:[],m:[]}),this.#g.delete(e)}unskip_effect(e,n=i=>this.schedule(i)){var i=this.#u.get(e);if(i){this.#u.delete(e);for(var r of i.d)He(r,2048),n(r);for(r of i.m)He(r,4096),n(r)}this.#g.add(e)}#v(){if(this.#e=!0,Vf++>1e3&&(this.#m(),Gp()),R)for(let d of this.current.keys())za.add(d);for(let d of this.#f)this.#c.delete(d),He(d,2048),this.schedule(d);for(let d of this.#c)He(d,4096),this.schedule(d);let e=this.#r;this.#r=[],this.apply();var n=ar=[],i=[],r=Bo=[];for(let d of e)try{this.#w(d,n,i)}catch(u){throw qf(d),this.#b()||this.discard(),u}if(be=null,r.length>0){var o=t.ensure();for(let d of r)o.schedule(d)}if(ar=null,Bo=null,this.#b()){this.#p(i),this.#p(n);for(let[d,u]of this.#u)Yf(d,u);r.length>0&&be.#v();return}let a=this.#y();if(a){this.#p(i),this.#p(n),a.#x(this);return}this.#f.clear(),this.#c.clear();for(let d of this.#l)d(this);this.#l.clear(),Ci=this,zf(i),zf(n),Ci=null,this.#a?.resolve();var l=be;if(this.#s===0&&(this.#r.length===0||l!==null)&&(this.#m(),gt&&(this.#_(),be=l)),this.#r.length>0)if(l!==null){let d=l;d.#r.push(...this.#r.filter(u=>!d.#r.includes(u)))}else l=this;l!==null&&l.#v()}#w(e,n,i){e.f^=1024;for(var r=e.first;r!==null;){var o=r.f,a=(o&96)!==0,l=a&&(o&1024)!==0,d=l||(o&8192)!==0||this.#u.has(r);if(!d&&r.fn!==null){a?r.f^=1024:(o&4)!==0?n.push(r):gt&&(o&16777224)!==0?i.push(r):Fi(r)&&((o&16)!==0&&this.#c.add(r),ii(r));var u=r.first;if(u!==null){r=u;continue}}for(;r!==null;){var f=r.next;if(f!==null){r=f;break}r=r.parent}}}#y(){for(var e=this.#t;e!==null;){if(!e.is_fork){for(let[n,[,i]]of this.current)if(e.current.has(n)&&!i)return e}e=e.#t}return null}#x(e){for(let[i,r]of e.current)!this.previous.has(i)&&e.previous.has(i)&&this.previous.set(i,e.previous.get(i)),this.current.set(i,r);for(let[i,r]of e.async_deriveds){let o=this.async_deriveds.get(i);o&&r.promise.then(o.resolve).catch(o.reject)}e.async_deriveds.clear(),this.transfer_effects(e.#f,e.#c);let n=i=>{var r=i.reactions;if(r!==null&&!((i.f&2)!==0&&(i.f&6144)===0))for(let l of r){var o=l.f;if((o&2)!==0)n(l);else{var a=l;o&4194320&&!this.async_deriveds.has(a)&&(this.#c.delete(a),He(a,2048),this.schedule(a))}}};for(let i of this.current.keys())n(i);this.oncommit(()=>e.discard()),e.#m(),be=this,this.#v()}#p(e){for(var n=0;n<e.length;n+=1)ys(e[n],this.#f,this.#c)}capture(e,n,i=!1){e.v!==We&&!this.previous.has(e)&&this.previous.set(e,e.v),(e.f&8388608)===0&&(this.current.set(e,[n,i]),Nt?.set(e,n)),this.is_fork||(e.v=n)}activate(){be=this}deactivate(){be=null,Nt=null}flush(){try{R&&za.clear(),Va=!0,be=this,this.#v()}finally{if(Vf=0,Ga=null,ar=null,Bo=null,Va=!1,be=null,Nt=null,xi.clear(),R)for(let e of za)e.updated=null}}discard(){for(let e of this.#o)e(this);this.#o.clear();for(let e of this.async_deriveds.values())e.reject(Ur);this.#m(),this.#a?.resolve()}register_created_effect(e){this.#h.push(e)}#_(){for(let c=Ss;c!==null;c=c.#n){var e=c.id<this.id,n=[];for(let[p,[m,g]]of this.current){if(c.current.has(p)){var i=c.current.get(p)[0];if(e&&m!==i)c.current.set(p,[m,g]);else continue}n.push(p)}if(e)for(let[p,m]of this.async_deriveds){let g=c.async_deriveds.get(p);g&&m.promise.then(g.resolve).catch(g.reject)}var r=[...c.current.keys()].filter(p=>!c.current.get(p)[1]);if(!(!c.#e||r.length===0)){var o=r.filter(p=>!this.current.has(p));if(o.length===0)e&&c.discard();else if(n.length>0){if(R&&!c.#d&&Tf(c.#r.length===0,"Batch has scheduled roots"),e)for(let p of this.#g)c.unskip_effect(p,m=>{(m.f&4194320)!==0?c.schedule(m):c.#p([m])});c.activate();var a=new Set,l=new Map;for(var d of n)Gf(d,o,a,l);l=new Map;var u=[...c.current].filter(([p,m])=>{let g=this.current.get(p);return g?g[0]!==m[0]||g[1]!==m[1]:!0}).map(([p])=>p);if(u.length>0)for(let p of this.#h)(p.f&155648)===0&&Ya(p,u,l)&&((p.f&4194320)!==0?(He(p,2048),c.schedule(p)):c.#f.add(p));if(c.#r.length>0&&!c.#d){c.apply();for(var f of c.#r)c.#w(f,[],[]);c.#r=[]}c.deactivate()}}}}increment(e,n){if(this.#s+=1,e){let i=this.#i.get(n)??0;this.#i.set(n,i+1)}}decrement(e,n){if(this.#s-=1,e){let i=this.#i.get(n)??0;i===1?this.#i.delete(n):this.#i.set(n,i-1)}this.#d||(this.#d=!0,kt(()=>{this.#d=!1,this.linked&&this.flush()}))}transfer_effects(e,n){for(let i of e)this.#f.add(i);for(let i of n)this.#c.add(i);e.clear(),n.clear()}oncommit(e){this.#l.add(e)}ondiscard(e){this.#o.add(e)}settled(){return(this.#a??=cs()).promise}static ensure(){if(be===null){let e=be=new t;!Va&&!er&&kt(()=>{e.#e||e.flush()})}return be}apply(){if(!gt||!this.is_fork&&this.#t===null&&this.#n===null){Nt=null;return}Nt=new Map;for(let[n,[i]]of this.current)Nt.set(n,i);for(let n=Ss;n!==null;n=n.#n)if(!(n===this||n.is_fork)){var e=!1;if(n.id<this.id){for(let[i,[,r]]of n.current)if(!r&&this.current.has(i)){e=!0;break}}if(!e)for(let[i,r]of n.previous)Nt.has(i)||Nt.set(i,r)}}schedule(e){if(Ga=e,e.b?.is_pending&&(e.f&16777228)!==0&&(e.f&32768)===0){e.b.defer_effect(e);return}for(var n=e;n.parent!==null;){n=n.parent;var i=n.f;if(ar!==null&&n===ae&&(gt||(me===null||(me.f&2)===0)&&!Rf))return;if((i&96)!==0){if((i&1024)===0)return;n.f^=1024}}this.#r.push(n)}#m(){if(this.linked){var e=this.#t,n=this.#n;e===null?Ss=n:e.#n=n,n===null?zr=e:n.#t=e,this.linked=!1}}};function Gr(t){var e=er;er=!0;try{var n;for(t&&(be!==null&&!be.is_fork&&be.flush(),n=t());;){if(Df(),be===null)return n;be.flush()}}finally{er=e}}function Gp(){if(R){var t=new Map;for(let n of be.current.keys())for(let[i,r]of n.updated??[]){var e=t.get(i);e||(e={error:r.error,count:0},t.set(i,e)),e.count+=r.count}for(let n of t.values())n.error&&console.error(n.error)}try{ff()}catch(n){R&&jt(n,"stack",{value:""}),Rn(n,Ga)}}var xn=null;function zf(t){var e=t.length;if(e!==0){for(var n=0;n<e;){var i=t[n++];if((i.f&24576)===0&&Fi(i)&&(xn=new Set,ii(i),i.deps===null&&i.first===null&&i.nodes===null&&i.teardown===null&&i.ac===null&&qa(i),xn?.size>0)){xi.clear();for(let r of xn){if((r.f&24576)!==0)continue;let o=[r],a=r.parent;for(;a!==null;)xn.has(a)&&(xn.delete(a),o.push(a)),a=a.parent;for(let l=o.length-1;l>=0;l--){let d=o[l];(d.f&24576)===0&&ii(d)}}xn.clear()}}xn=null}}function Gf(t,e,n,i){if(!n.has(t)&&(n.add(t),t.reactions!==null))for(let r of t.reactions){let o=r.f;(o&2)!==0?Gf(r,e,n,i):(o&4194320)!==0&&(o&2048)===0&&Ya(r,e,i)&&(He(r,2048),Po(r))}}function Ya(t,e,n){let i=n.get(t);if(i!==void 0)return i;if(t.deps!==null)for(let r of t.deps){if(Ni.call(e,r))return!0;if((r.f&2)!==0&&Ya(r,e,n))return n.set(r,!0),!0}return n.set(t,!1),!1}function Po(t){be.schedule(t)}function Yf(t,e){if(!((t.f&32)!==0&&(t.f&1024)!==0)){(t.f&2048)!==0?e.d.push(t):(t.f&4096)!==0&&e.m.push(t),He(t,1024);for(var n=t.first;n!==null;)Yf(n,e),n=n.next}}function qf(t){He(t,1024);for(var e=t.first;e!==null;)qf(e),e=e.next}var or=new Set,xi=new Map;function Es(t){or=t}var Ka=!1;function Zf(){Ka=!0}function Gt(t,e){var n={f:0,v:t,reactions:null,equals:gs,rv:0,wv:0};return R&&Fn&&(n.created=e??Dn("created at"),n.updated=null,n.set_during_effect=!1,n.trace=null),n}function ce(t,e){let n=Gt(t,e);return ks(n),n}function tr(t,e=!1,n=!0){let i=Gt(t);return e||(i.equals=vs),vi&&n&&Ee!==null&&Ee.l!==null&&(Ee.l.s??=[]).push(i),i}function oe(t,e,n=!1){me!==null&&(!Xt||(me.f&131072)!==0)&&ei()&&(me.f&4325394)!==0&&(On===null||!On.has(t))&&_f();let i=n?Le(e):e;return R&&bs(i,t.label),Hn(t,i,Bo)}function Hn(t,e,n=null){if(!t.equals(e)){xi.set(t,wn?e:t.v);var i=hn.ensure();if(i.capture(t,e),R){if(Fn||ae!==null){t.updated??=new Map;let r=(t.updated.get("")?.count??0)+1;if(t.updated.set("",{error:null,count:r}),Fn||r>5){let o=Dn("updated at");if(o!==null){let a=t.updated.get(o.stack);a||(a={error:o,count:0},t.updated.set(o.stack,a)),a.count++}}}ae!==null&&(t.set_during_effect=!0)}if((t.f&2)!==0){let r=t;(t.f&2048)!==0&&Ho(r),Nt===null&&Or(r)}t.wv=Vr(),Xf(t,2048,n),ei()&&ae!==null&&(ae.f&1024)!==0&&(ae.f&96)===0&&(mn===null?Jf([t]):mn.push(t)),!i.is_fork&&or.size>0&&!Ka&&Is()}return e}function Is(){Ka=!1;for(let t of or){(t.f&1024)!==0&&He(t,4096);let e;try{e=Fi(t)}catch{e=!0}e&&ii(t)}or.clear()}function rr(t){oe(t,t.v+1)}function Xf(t,e,n){var i=t.reactions;if(i!==null)for(var r=ei(),o=i.length,a=0;a<o;a++){var l=i[a],d=l.f;if(!(!r&&l===ae)){var u=(d&2048)===0;if(u&&He(l,e),(d&131072)!==0)or.add(l);else if((d&2)!==0){var f=l;Nt?.delete(f),(d&65536)===0&&(d&512&&(ae===null||(ae.f&2097152)===0)&&(l.f|=65536),Xf(f,4096,n))}else if(u){var c=l;(d&16)!==0&&xn!==null&&xn.add(c),n!==null?n.push(c):Po(c)}}}}var qp=/^[a-zA-Z_$][a-zA-Z_$0-9]*$/;function Le(t){if(typeof t!="object"||t===null||qt in t)return t;let e=Fr(t);if(e!==Na&&e!==Qd)return t;var n=new Map,i=mi(t),r=ce(0),o=R&&Fn?Dn("created at"):null,a=Di,l=c=>{if(Di===a)return c();var p=me,m=Di;wt(null),Za(a);var g=c();return wt(p),Za(m),g};i&&(n.set("length",ce(t.length,o)),R&&(t=Zp(t)));var d="";let u=!1;function f(c){if(!u){u=!0,d=c,Wt(r,`${d} version`);for(let[p,m]of n)Wt(m,dr(d,p));u=!1}}return new Proxy(t,{defineProperty(c,p,m){(!("value"in m)||m.configurable===!1||m.enumerable===!1||m.writable===!1)&&gf();var g=n.get(p);return g===void 0?l(()=>{var x=ce(m.value,o);return n.set(p,x),R&&typeof p=="string"&&Wt(x,dr(d,p)),x}):oe(g,m.value,!0),!0},deleteProperty(c,p){var m=n.get(p);if(m===void 0){if(p in c){let g=l(()=>ce(We,o));n.set(p,g),rr(r),R&&Wt(g,dr(d,p))}}else oe(m,We),rr(r);return!0},get(c,p,m){if(p===qt)return t;if(R&&p===ps)return f;var g=n.get(p),x=p in c;if(g===void 0&&(!x||cn(c,p)?.writable)&&(g=l(()=>{var _=Le(x?c[p]:We),L=ce(_,o);return R&&Wt(L,dr(d,p)),L}),n.set(p,g)),g!==void 0){var w=s(g);return w===We?void 0:w}return Reflect.get(c,p,m)},getOwnPropertyDescriptor(c,p){var m=Reflect.getOwnPropertyDescriptor(c,p);if(m&&"value"in m){var g=n.get(p);g&&(m.value=s(g))}else if(m===void 0){var x=n.get(p),w=x?.v;if(x!==void 0&&w!==We)return{enumerable:!0,configurable:!0,value:w,writable:!0}}return m},has(c,p){if(p===qt)return!0;var m=n.get(p),g=m!==void 0&&m.v!==We||Reflect.has(c,p);if(m!==void 0||ae!==null&&(!g||cn(c,p)?.writable)){m===void 0&&(m=l(()=>{var w=g?Le(c[p]):We,_=ce(w,o);return R&&Wt(_,dr(d,p)),_}),n.set(p,m));var x=s(m);if(x===We)return!1}return g},set(c,p,m,g){var x=n.get(p),w=p in c;if(i&&p==="length")for(var _=m;_<x.v;_+=1){var L=n.get(_+"");L!==void 0?oe(L,We):_ in c&&(L=l(()=>ce(We,o)),n.set(_+"",L),R&&Wt(L,dr(d,_)))}if(x===void 0)(!w||cn(c,p)?.writable)&&(x=l(()=>ce(void 0,o)),R&&Wt(x,dr(d,p)),oe(x,Le(m)),n.set(p,x));else{w=x.v!==We;var y=l(()=>Le(m));oe(x,y)}var I=Reflect.getOwnPropertyDescriptor(c,p);if(I?.set&&I.set.call(g,m),!w){if(i&&typeof p=="string"){var S=n.get("length"),$=Number(p);Number.isInteger($)&&$>=S.v&&oe(S,$+1)}rr(r)}return!0},ownKeys(c){s(r);var p=Reflect.ownKeys(c).filter(x=>{var w=n.get(x);return w===void 0||w.v!==We});for(var[m,g]of n)g.v!==We&&!(m in c)&&p.push(m);return p},setPrototypeOf(){vf()}})}function dr(t,e){return typeof e=="symbol"?`${t}[Symbol(${e.description??""})]`:qp.test(e)?`${t}.${e}`:/^\d+$/.test(e)?`${t}[${e}]`:`${t}['${e}']`}function Ts(t){try{if(t!==null&&typeof t=="object"&&qt in t)return t[qt]}catch{}return t}var Kp=new Set(["copyWithin","fill","pop","push","reverse","shift","sort","splice","unshift"]);function Zp(t){return new Proxy(t,{get(e,n,i){var r=Reflect.get(e,n,i);return Kp.has(n)?function(...o){Zf();var a=r.apply(this,o);return Is(),a}:r}})}function Qf(){let t=Array.prototype,e=Array.__svelte_cleanup;e&&e();let{indexOf:n,lastIndexOf:i,includes:r}=t;t.indexOf=function(o,a){let l=n.call(this,o,a);if(l===-1){for(let d=a??0;d<this.length;d+=1)if(Ts(this[d])===o){ms("array.indexOf(...)");break}}return l},t.lastIndexOf=function(o,a){let l=i.call(this,o,a??this.length-1);if(l===-1){for(let d=0;d<=(a??this.length-1);d+=1)if(Ts(this[d])===o){ms("array.lastIndexOf(...)");break}}return l},t.includes=function(o,a){let l=r.call(this,o,a);if(!l){for(let d=0;d<this.length;d+=1)if(Ts(this[d])===o){ms("array.includes(...)");break}}return l},Array.__svelte_cleanup=()=>{t.indexOf=n,t.lastIndexOf=i,t.includes=r}}var Xa,ec,Ao,tc,nc;function Cs(){if(Xa===void 0){Xa=window,ec=document,Ao=/Firefox/.test(navigator.userAgent);var t=Element.prototype,e=Node.prototype,n=Text.prototype;tc=cn(e,"firstChild").get,nc=cn(e,"nextSibling").get,Ia(t)&&(t[So]=void 0,t[hs]=null,t[No]=void 0,t.__e=void 0),Ia(n)&&(n[Io]=void 0),R&&(t.__svelte_meta=null,Qf())}}function yt(t=""){return document.createTextNode(t)}function Ge(t){return tc.call(t)}function Lt(t){return nc.call(t)}function C(t,e){if(!le)return Ge(t);var n=Ge(_e);if(n===null)n=_e.appendChild(yt());else if(e&&n.nodeType!==Dr){var i=yt();return n?.before(i),Me(i),i}return e&&Ds(n),Me(n),n}function ne(t,e=!1){if(!le){var n=Ge(t);return n instanceof Comment&&n.data===""?Lt(n):n}if(e){if(_e?.nodeType!==Dr){var i=yt();return _e?.before(i),Me(i),i}Ds(_e)}return _e}function X(t,e=1,n=!1){let i=le?_e:t;for(var r;e--;)r=i,i=Lt(i);if(!le)return i;if(n){if(i?.nodeType!==Dr){var o=yt();return i===null?r?.after(o):i.before(o),Me(o),o}Ds(i)}return Me(i),i}function Mo(t){t.textContent=""}function Fs(){if(!gt||xn!==null)return!1;var t=ae.f;return(t&32768)!==0}function ri(t,e,n){return e==null||e===ds?n?document.createElement(t,{is:n}):document.createElement(t):n?document.createElementNS(e,t,{is:n}):document.createElementNS(e,t)}function Ds(t){if(t.nodeValue.length<65536)return;let e=t.nextSibling;for(;e!==null&&e.nodeType===Dr;)e.remove(),t.nodeValue+=e.nodeValue,e=t.nextSibling}function rc(t){ae===null&&(me===null&&df(t),lf()),wn&&af(t)}function Jp(t,e){var n=e.last;n===null?e.last=e.first=t:(n.next=t,t.prev=n,e.last=t)}function Bn(t,e){var n=ae;if(R)for(;n!==null&&(n.f&131072)!==0;)n=n.parent;n!==null&&(n.f&8192)!==0&&(t|=8192);var i={ctx:Ee,deps:null,nodes:null,f:t|2048|512,first:null,fn:e,last:null,next:null,parent:n,b:n&&n.b,prev:null,teardown:null,wv:0,ac:null};R&&(i.component_function=pn),be?.register_created_effect(i);var r=i;if((t&4)!==0)ar!==null?ar.push(i):hn.ensure().schedule(i);else if(e!==null){try{ii(i)}catch(a){throw tt(i),a}r.deps===null&&r.teardown===null&&r.nodes===null&&r.first===r.last&&(r.f&524288)===0&&(r=r.first,(t&16)!==0&&(t&65536)!==0&&r!==null&&(r.f|=65536))}if(r!==null&&(r.parent=n,n!==null&&Jp(r,n),me!==null&&(me.f&2)!==0&&(t&64)===0)){var o=me;(o.effects??=[]).push(r)}return i}function Ti(){return me!==null&&!Xt}function Vt(t){let e=Bn(8,null);return He(e,1024),e.teardown=t,e}function ye(t){rc("$effect"),R&&jt(t,"name",{value:"$effect"});var e=ae.f,n=!me&&(e&32)!==0&&Ee!==null&&!Ee.i;if(n){var i=Ee;(i.e??=[]).push(t)}else return Aa(t)}function Aa(t){return Bn(1048580,t)}function Qa(t){hn.ensure();let e=Bn(524352,t);return()=>{tt(e)}}function oc(t){hn.ensure();let e=Bn(524352,t);return(n={})=>new Promise(i=>{n.outro?ni(e,()=>{tt(e),i(void 0)}):(tt(e),i(void 0))})}function yn(t){return Bn(4,t)}function Uf(t){return Bn(4718592,t)}function Kt(t,e=0){return Bn(8|e,t)}function J(t,e=[],n=[],i=[]){$s(i,e,n,r=>{Bn(8,()=>{t(...r.map(s))})})}function sn(t,e=0){var n=Bn(16|e,t);return R&&(n.dev_stack=An),n}function el(t,e=0){var n=Bn(16777216|e,t);return R&&(n.dev_stack=An),n}function dt(t){return Bn(524320,t)}function tl(t){var e=t.teardown;if(e!==null){let n=wn,i=me;Ja(!0),wt(null);try{e.call(null)}finally{Ja(n),wt(i)}}}function Oo(t,e=!1){var n=t.first;for(t.first=t.last=null;n!==null;){let r=n.ac;r!==null&&ti(()=>{r.abort(gi)});var i=n.next;(n.f&64)!==0?n.parent=null:tt(n,e),n=i}}function sc(t){for(var e=t.first;e!==null;){var n=e.next;(e.f&32)===0&&tt(e),e=n}}function tt(t,e=!0){var n=!1;(e||(t.f&262144)!==0)&&t.nodes!==null&&t.nodes.end!==null&&(nl(t.nodes.start,t.nodes.end),n=!0),t.f|=33554432,Oo(t,e&&!n),sr(t,0);var i=t.nodes&&t.nodes.t;if(i!==null)for(let o of i)o.stop();tl(t),t.f^=33554432,t.f|=16384;var r=t.parent;r!==null&&r.first!==null&&qa(t),R&&(t.component_function=null),t.next=t.prev=t.teardown=t.ctx=t.deps=t.fn=t.nodes=t.ac=t.b=null}function nl(t,e){for(;t!==null;){var n=t===e?null:Lt(t);t.remove(),t=n}}function qa(t){var e=t.parent,n=t.prev,i=t.next;n!==null&&(n.next=i),i!==null&&(i.prev=n),e!==null&&(e.first===t&&(e.first=i),e.last===t&&(e.last=n))}function ni(t,e,n=!0){var i=[];ac(t,i,!0);var r=()=>{n&&tt(t),e&&e()},o=i.length;if(o>0){var a=()=>--o||r();for(var l of i)l.out(a)}else r()}function ac(t,e,n){if((t.f&8192)===0){t.f^=8192;var i=t.nodes&&t.nodes.t;if(i!==null)for(let l of i)(l.is_global||n)&&e.push(l);for(var r=t.first;r!==null;){var o=r.next;if((r.f&64)===0){var a=(r.f&65536)!==0||(r.f&32)!==0&&(t.f&16)!==0;ac(r,e,a?n:!1)}r=o}}}function qr(t){lc(t,!0)}function lc(t,e){if((t.f&8192)!==0){t.f^=8192,(t.f&1024)===0&&(He(t,2048),hn.ensure().schedule(t));for(var n=t.first;n!==null;){var i=n.next,r=(n.f&65536)!==0||(n.f&32)!==0;lc(n,r?e:!1),n=i}var o=t.nodes&&t.nodes.t;if(o!==null)for(let a of o)(a.is_global||e)&&a.in()}}function Br(t,e){if(t.nodes)for(var n=t.nodes.start,i=t.nodes.end;n!==null;){var r=n===i?null:Lt(n);e.append(n),n=r}}var dc=null;var As=!1,wn=!1;function Ja(t){wn=t}var me=null,Xt=!1;function wt(t){me=t}var ae=null;function xt(t){ae=t}var On=null;function ks(t){me!==null&&(!gt||(me.f&2)!==0)&&(On??=new Set).add(t)}var St=null,Zt=0,mn=null;function Jf(t){mn=t}var fc=1,fr=0,Di=fr;function Za(t){Di=t}function Vr(){return++fc}function Fi(t){var e=t.f;if((e&2048)!==0)return!0;if(e&2&&(t.f&=-65537),(e&4096)!==0){for(var n=t.deps,i=n.length,r=0;r<i;r++){var o=n[r];if(Fi(o)&&Wa(o),o.wv>t.wv)return!0}(e&512)!==0&&Nt===null&&He(t,1024)}return!1}function cc(t,e,n=!0){var i=t.reactions;if(i!==null&&!(!gt&&On!==null&&On.has(t)))for(var r=0;r<i.length;r++){var o=i[r];(o.f&2)!==0?cc(o,e,!1):e===o&&(n?He(o,2048):(o.f&1024)!==0&&He(o,4096),Po(o))}}function Ls(t){var e=St,n=Zt,i=mn,r=me,o=On,a=Ee,l=Xt,d=Di,u=t.f;St=null,Zt=0,mn=null,me=(u&96)===0?t:null,On=null,_i(t.ctx),Xt=!1,Di=++fr,t.ac!==null&&(ti(()=>{t.ac.abort(gi)}),t.ac=null);try{t.f|=2097152;var f=t.fn,c=f();t.f|=32768;var p=t.deps,m=be?.is_fork;if(St!==null){var g;if(m||sr(t,Zt),p!==null&&Zt>0)for(p.length=Zt+St.length,g=0;g<St.length;g++)p[Zt+g]=St[g];else t.deps=p=St;if(Ti()&&(t.f&512)!==0)for(g=Zt;g<p.length;g++)(p[g].reactions??=[]).push(t)}else!m&&p!==null&&Zt<p.length&&(sr(t,Zt),p.length=Zt);if(ei()&&mn!==null&&!Xt&&p!==null&&(t.f&6146)===0)for(g=0;g<mn.length;g++)cc(mn[g],t);if(r!==null&&r!==t){if(fr++,r.deps!==null)for(let x=0;x<n;x+=1)r.deps[x].rv=fr;if(e!==null)for(let x of e)x.rv=fr;mn!==null&&(i===null?i=mn:i.push(...mn))}return(t.f&8388608)!==0&&(t.f^=8388608),c}catch(x){return xs(x)}finally{t.f^=2097152,St=e,Zt=n,mn=i,me=r,On=o,_i(a),Xt=l,Di=d}}function Qp(t,e){let n=e.reactions;if(n!==null){var i=Jd.call(n,t);if(i!==-1){var r=n.length-1;r===0?n=e.reactions=null:(n[i]=n[r],n.pop())}}if(n===null&&(e.f&2)!==0&&(St===null||!Ni.call(St,e))){var o=e;(o.f&512)!==0&&(o.f^=512,o.f&=-65537),o.v!==We&&Or(o),o.ac!==null&&ti(()=>{o.ac.abort(gi),o.ac=null,He(o,2048)}),Wf(o),sr(o,0)}}function sr(t,e){var n=t.deps;if(n!==null)for(var i=e;i<n.length;i++)Qp(t,n[i])}function ii(t){var e=t.f;if((e&16384)===0){He(t,1024);var n=ae,i=As;if(ae=t,As=(e&96)===0,R){var r=pn;ws(t.component_function);var o=An;Hr(t.dev_stack??An)}try{(e&16777232)!==0?sc(t):Oo(t),tl(t);var a=Ls(t);if(t.teardown=typeof a=="function"?a:null,t.wv=fc,R&&Fn&&(t.f&2048)!==0&&t.deps!==null)for(var l of t.deps)l.set_during_effect&&(l.wv=Vr(),l.set_during_effect=!1)}finally{As=i,ae=n,R&&(ws(r),Hr(o))}}}function s(t){var e=t.f,n=(e&2)!==0;if(dc?.add(t),me!==null&&!Xt){var i=ae!==null&&(ae.f&16384)!==0;if(!i&&(On===null||!On.has(t))){var r=me.deps;if((me.f&2097152)!==0)t.rv<fr&&(t.rv=fr,St===null&&r!==null&&r[Zt]===t?Zt++:St===null?St=[t]:St.push(t));else{me.deps??=[],Ni.call(me.deps,t)||me.deps.push(t);var o=t.reactions;o===null?t.reactions=[me]:Ni.call(o,me)||o.push(me)}}}if(R){if(!Xt&&an&&be===null&&Ci===null&&!an.warned&&(an.effect.f&2097152)===0&&!an.effect_deps.has(t)){an.warned=!0,wf(t.label);var a=Dn("traced at");a&&console.warn(a)}if(Ro.delete(t),Fn&&!Xt&&Fo!==null&&me!==null&&Fo.reaction===me){if(t.trace)t.trace();else if(a=Dn("traced at"),a){var l=Fo.entries.get(t);l===void 0&&(l={traces:[]},Fo.entries.set(t,l));var d=l.traces[l.traces.length-1];a.stack!==d?.stack&&l.traces.push(a)}}}if(wn&&xi.has(t))return xi.get(t);if(n){var u=t;if(wn){var f=u.v;return((u.f&1024)===0&&u.reactions!==null||pc(u))&&(f=Ho(u)),xi.set(u,f),f}var c=(u.f&512)===0&&!Xt&&me!==null&&(As||(me.f&512)!==0),p=(u.f&32768)===0;Fi(u)&&(c&&(u.f|=512),Wa(u)),c&&!p&&(Ua(u),uc(u))}if(Nt?.has(t))return Nt.get(t);if((t.f&8388608)!==0)throw t.v;return t.v}function uc(t){if(t.f|=512,t.deps!==null)for(let e of t.deps)(e.reactions??=[]).push(t),(e.f&2)!==0&&(e.f&512)===0&&(Ua(e),uc(e))}function pc(t){if(t.v===We)return!0;if(t.deps===null)return!1;for(let e of t.deps)if(xi.has(e)||(e.f&2)!==0&&pc(e))return!0;return!1}function Qe(t){var e=Xt;try{return Xt=!0,t()}finally{Xt=e}}var jo=Symbol("events"),il=new Set,Ms=new Set;function we(t,e,n){(e[jo]??={})[t]=n}function rt(t){for(var e=0;e<t.length;e++)il.add(t[e]);for(var n of Ms)n(t)}var hc=null;function rl(t){var e=this,n=e.ownerDocument,i=t.type,r=t.composedPath?.()||[],o=r[0]||t.target;hc=t;var a=0,l=hc===t&&t[jo];if(l){var d=r.indexOf(l);if(d!==-1&&(e===document||e===window)){t[jo]=e;return}var u=r.indexOf(e);if(u===-1)return;d<=u&&(a=d)}if(o=r[a]||t.target,o!==e){jt(t,"currentTarget",{configurable:!0,get(){return o||n}});var f=me,c=ae;wt(null),xt(null);try{for(var p,m=[];o!==null&&o!==e;){try{var g=o[jo]?.[i];g!=null&&(!o.disabled||t.target===o)&&g.call(o,t)}catch(x){p?m.push(x):p=x}if(t.cancelBubble)break;a++,o=a<r.length?r[a]:null}if(p){for(let x of m)queueMicrotask(()=>{throw x});throw p}}finally{t[jo]=e,delete t.currentTarget,wt(f),xt(c)}}}var eh=globalThis?.window?.trustedTypes&&globalThis.window.trustedTypes.createPolicy("svelte-trusted-html",{createHTML:t=>t});function mc(t){return eh?.createHTML(t)??t}function Rs(t){var e=ri("template");return e.innerHTML=mc(t.replaceAll("<!>","<!---->")),e.content}function At(t,e){var n=ae;n.nodes===null&&(n.nodes={start:t,end:e,a:null,t:null})}function B(t,e){var n=(e&1)!==0,i=(e&2)!==0,r,o=!t.startsWith("<!>");return()=>{if(le)return At(_e,null),_e;r===void 0&&(r=Rs(o?t:"<!>"+t),n||(r=Ge(r)));var a=i||Ao?document.importNode(r,!0):r.cloneNode(!0);if(n){var l=Ge(a),d=a.lastChild;At(l,d)}else At(a,a);return a}}function rh(t,e,n="svg"){var i=!t.startsWith("<!>"),r=(e&1)!==0,o=`<${n}>${i?t:"<!>"+t}</${n}>`,a;return()=>{if(le)return At(_e,null),_e;if(!a){var l=Rs(o),d=Ge(l);if(r)for(a=document.createDocumentFragment();Ge(d);)a.appendChild(Ge(d));else a=Ge(d)}var u=a.cloneNode(!0);if(r){var f=Ge(u),c=u.lastChild;At(f,c)}else At(u,u);return u}}function yi(t,e){return rh(t,e,"svg")}function pe(){if(le)return At(_e,null),_e;var t=document.createDocumentFragment(),e=document.createComment(""),n=yt();return t.append(e,n),At(e,n),t}function F(t,e){if(le){var n=ae;((n.f&32768)===0||n.nodes.end===null)&&(n.nodes.end=_e),Et();return}t!==null&&t.before(e)}var oh=/\r/g;function vc(t){t=t.replace(oh,"");let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return(e>>>0).toString(36)}var sh=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","indeterminate","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected","webkitdirectory","defer","disablepictureinpicture","disableremoteplayback"];var Ty=[...sh,"formNoValidate","isMap","noModule","playsInline","readOnly","value","volume","defaultValue","defaultChecked","srcObject","noValidate","allowFullscreen","disablePictureInPicture","disableRemotePlayback"];var ah=["touchstart","touchmove"];function _c(t){return ah.includes(t)}var lh=["$state","$state.raw","$derived","$derived.by"],Cy=[...lh,"$state.eager","$state.snapshot","$props","$props.id","$bindable","$effect","$effect.pre","$effect.tracking","$effect.root","$effect.pending","$inspect","$inspect().with","$inspect.trace","$host"];function Hs(t){return t?.replace(/\//g,"/\u200B")}var ol=!0;function Ce(t,e){var n=e==null?"":typeof e=="object"?`${e}`:e;n!==(t[Io]??=t.nodeValue)&&(t[Io]=n,t.nodeValue=`${n}`)}function Kr(t,e){return bc(t,e)}function al(t,e){Cs(),e.intro=e.intro??!1;let n=e.target,i=le,r=_e;try{for(var o=Ge(n);o&&(o.nodeType!==un||o.data!=="[");)o=Lt(o);if(!o)throw Zn;mt(!0),Me(o);let a=bc(t,{...e,anchor:o});return mt(!1),a}catch(a){if(a instanceof Error&&a.message.split(`
`).some(l=>l.startsWith("https://svelte.dev/e/")))throw a;return a!==Zn&&console.warn("Failed to hydrate: ",a),e.recover===!1&&cf(),Cs(),Mo(n),mt(!1),Kr(t,e)}finally{mt(i),Me(r)}}var Os=new Map;function bc(t,{target:e,anchor:n,props:i={},events:r,context:o,intro:a=!0,transformError:l}){Cs();var d=void 0,u=oc(()=>{var f=n??e.appendChild(yt());Ha(f,{pending:()=>{}},m=>{de({});var g=Ee;if(o&&(g.c=o),r&&(i.$$events=r),le&&At(m,null),ol=a,d=t(m,i)||{},ol=!0,le&&(ae.nodes.end=_e,_e===null||_e.nodeType!==un||_e.data!=="]"))throw Ii(),Zn;fe()},l);var c=new Set,p=m=>{for(var g=0;g<m.length;g++){var x=m[g];if(!c.has(x)){c.add(x);var w=_c(x);for(let y of[e,document]){var _=Os.get(y);_===void 0&&(_=new Map,Os.set(y,_));var L=_.get(x);L===void 0?(y.addEventListener(x,rl,{passive:w}),_.set(x,1)):_.set(x,L+1)}}}};return p(Cr(il)),Ms.add(p),()=>{for(var m of c)for(let w of[e,document]){var g=Os.get(w),x=g.get(m);--x==0?(w.removeEventListener(m,rl),g.delete(m),g.size===0&&Os.delete(w)):g.set(m,x)}Ms.delete(p),f!==n&&f.parentNode?.removeChild(f)}});return sl.set(d,u),d}var sl=new WeakMap;function Wo(t,e){let n=sl.get(t);return n?(sl.delete(t),n(e)):(R&&(qt in t?kf():Lf()),Promise.resolve())}var oi=class{anchor;#e=new Map;#t=new Map;#n=new Map;#l=new Set;#o=!0;constructor(e,n=!0){this.anchor=e,this.#o=n}#s=e=>{if(this.#e.has(e)){var n=this.#e.get(e),i=this.#t.get(n);if(i)qr(i),this.#l.delete(n);else{var r=this.#n.get(n);r&&(qr(r.effect),this.#t.set(n,r.effect),this.#n.delete(n),R&&(r.fragment.lastChild[Ta]=this.anchor),r.fragment.lastChild.remove(),this.anchor.before(r.fragment),i=r.effect)}for(let[o,a]of this.#e){if(this.#e.delete(o),o===e)break;let l=this.#n.get(a);l&&(tt(l.effect),this.#n.delete(a))}for(let[o,a]of this.#t){if(o===n||this.#l.has(o))continue;let l=()=>{if(Array.from(this.#e.values()).includes(o)){var u=document.createDocumentFragment();Br(a,u),u.append(yt()),this.#n.set(o,{effect:a,fragment:u})}else tt(a);this.#l.delete(o),this.#t.delete(o)};this.#o||!i?(this.#l.add(o),ni(a,l,!1)):l()}}};#i=e=>{this.#e.delete(e);let n=Array.from(this.#e.values());for(let[i,r]of this.#n)n.includes(i)||(tt(r.effect),this.#n.delete(i))};ensure(e,n){var i=be,r=Fs();if(n&&!this.#t.has(e)&&!this.#n.has(e))if(r){var o=document.createDocumentFragment(),a=yt();o.append(a),this.#n.set(e,{effect:dt(()=>n(a)),fragment:o})}else this.#t.set(e,dt(()=>n(this.anchor)));if(this.#e.set(i,e),r){for(let[l,d]of this.#t)l===e?i.unskip_effect(d):i.skip_effect(d);for(let[l,d]of this.#n)l===e?i.unskip_effect(d.effect):i.skip_effect(d.effect);i.oncommit(this.#s),i.ondiscard(this.#i)}else le&&(this.anchor=_e),this.#s(i)}};function Mt(t,e,...n){var i=new oi(t);sn(()=>{let r=e()??null;R&&r==null&&uf(),i.ensure(r,r&&(o=>r(o,...n)))},65536)}if(R){let t=function(e){if(!(e in globalThis)){let n;Object.defineProperty(globalThis,e,{configurable:!0,get:()=>{if(n!==void 0)return n;hf(e)},set:i=>{n=i}})}};t("$state"),t("$effect"),t("$derived"),t("$inspect"),t("$props"),t("$bindable")}function ch(t){Ee===null&&Ar("onMount"),vi&&Ee.l!==null?uh(Ee).m.push(t):ye(()=>{let e=Qe(t);if(typeof e=="function")return e})}function Ve(t){Ee===null&&Ar("onDestroy"),ch(()=>()=>Qe(t))}function uh(t){var e=t.l;return e.u??={a:[],b:[],m:[]}}function q(t,e,n=!1){var i;le&&(i=_e,Et());var r=new oi(t),o=n?65536:0;function a(l,d){if(le){var u=Co(i);if(l!==parseInt(u.substring(1))){var f=Qn();Me(f),r.anchor=f,mt(!1),r.ensure(l,d),mt(!0);return}}r.ensure(l,d)}sn(()=>{var l=!1;e((d,u=0)=>{l=!0,a(u,d)}),l||a(-1,null)},o)}function ai(t,e){return e}function wh(t,e,n){for(var i=[],r=e.length,o,a=e.length,l=0;l<r;l++){let c=e[l];ni(c,()=>{if(o){if(o.pending.delete(c),o.done.add(c),o.pending.size===0){var p=t.outrogroups;ll(t,Cr(o.done)),p.delete(o),p.size===0&&(t.outrogroups=null)}}else a-=1},!1)}if(a===0){var d=i.length===0&&n!==null;if(d){var u=n,f=u.parentNode;Mo(f),f.append(u),t.items.clear()}ll(t,e,!d)}else o={pending:new Set(e),done:new Set},(t.outrogroups??=new Set).add(o)}function ll(t,e,n=!0){var i;if(t.pending.size>0){i=new Set;for(let a of t.pending.values())for(let l of a)i.add(t.items.get(l).e)}for(var r=0;r<e.length;r++){var o=e[r];if(i?.has(o)){o.f|=33554432;let a=document.createDocumentFragment();Br(o,a)}else tt(e[r],n)}}var yc;function li(t,e,n,i,r,o=null){var a=t,l=new Map,d=(e&4)!==0;if(d){var u=t;a=le?Me(Ge(u)):u.appendChild(yt())}le&&Et();var f=null,c=Wr(()=>{var y=n();return mi(y)?y:y==null?[]:Cr(y)});R&&Wt(c,"{#each ...}");var p,m=new Map,g=!0;function x(y){(L.effect.f&16384)===0&&(L.pending.delete(y),L.fallback=f,xh(L,p,a,e,i),f!==null&&(p.length===0?(f.f&33554432)===0?qr(f):(f.f^=33554432,Vo(f,null,a)):ni(f,()=>{f=null})))}function w(y){L.pending.delete(y)}var _=sn(()=>{p=s(c);var y=p.length;let I=!1;if(le){var S=Co(a)==="[!";S!==(y===0)&&(a=Qn(),Me(a),mt(!1),I=!0)}for(var $=new Set,h=be,b=Fs(),E=0;E<y;E+=1){le&&_e.nodeType===un&&_e.data==="]"&&(a=_e,I=!0,mt(!1));var D=p[E],M=i(D,E);if(R){var W=i(D,E);M!==W&&sf(String(E),String(M),String(W))}var P=g?null:l.get(M);P?(P.v&&Hn(P.v,D),P.i&&Hn(P.i,E),b&&h.unskip_effect(P.e)):(P=yh(l,g?a:yc??=yt(),D,M,E,r,e,n),g||(P.e.f|=33554432),l.set(M,P)),$.add(M)}if(y===0&&o&&!f&&(g?f=dt(()=>o(a)):(f=dt(()=>o(yc??=yt())),f.f|=33554432)),y>$.size&&(R?$h(p,i):Fa("","","")),le&&y>0&&Me(Qn()),!g)if(m.set(h,$),b){for(let[K,ee]of l)$.has(K)||h.skip_effect(ee.e);h.oncommit(x),h.ondiscard(w)}else x(h);I&&mt(!0),s(c)}),L={effect:_,flags:e,items:l,pending:m,outrogroups:null,fallback:f};g=!1,le&&(a=_e)}function Uo(t){for(;t!==null&&(t.f&32)===0;)t=t.next;return t}function xh(t,e,n,i,r){var o=(i&8)!==0,a=e.length,l=t.items,d=Uo(t.effect.first),u,f=null,c,p=[],m=[],g,x,w,_;if(o)for(_=0;_<a;_+=1)g=e[_],x=r(g,_),w=l.get(x).e,(w.f&33554432)===0&&(w.nodes?.a?.measure(),(c??=new Set).add(w));for(_=0;_<a;_+=1){if(g=e[_],x=r(g,_),w=l.get(x).e,t.outrogroups!==null)for(let D of t.outrogroups)D.pending.delete(w),D.done.delete(w);if((w.f&8192)!==0&&(qr(w),o&&(w.nodes?.a?.unfix(),(c??=new Set).delete(w))),(w.f&33554432)!==0)if(w.f^=33554432,w===d)Vo(w,null,n);else{var L=f?f.next:d;w===t.effect.last&&(t.effect.last=w.prev),w.prev&&(w.prev.next=w.next),w.next&&(w.next.prev=w.prev),Ai(t,f,w),Ai(t,w,L),Vo(w,L,n),f=w,p=[],m=[],d=Uo(f.next);continue}if(w!==d){if(u!==void 0&&u.has(w)){if(p.length<m.length){var y=m[0],I;f=y.prev;var S=p[0],$=p[p.length-1];for(I=0;I<p.length;I+=1)Vo(p[I],y,n);for(I=0;I<m.length;I+=1)u.delete(m[I]);Ai(t,S.prev,$.next),Ai(t,f,S),Ai(t,$,y),d=y,f=$,_-=1,p=[],m=[]}else u.delete(w),Vo(w,d,n),Ai(t,w.prev,w.next),Ai(t,w,f===null?t.effect.first:f.next),Ai(t,f,w),f=w;continue}for(p=[],m=[];d!==null&&d!==w;)(u??=new Set).add(d),m.push(d),d=Uo(d.next);if(d===null)continue}(w.f&33554432)===0&&p.push(w),f=w,d=Uo(w.next)}if(t.outrogroups!==null){for(let D of t.outrogroups)D.pending.size===0&&(ll(t,Cr(D.done)),t.outrogroups?.delete(D));t.outrogroups.size===0&&(t.outrogroups=null)}if(d!==null||u!==void 0){var h=[];if(u!==void 0)for(w of u)(w.f&8192)===0&&h.push(w);for(;d!==null;)(d.f&8192)===0&&d!==t.fallback&&h.push(d),d=Uo(d.next);var b=h.length;if(b>0){var E=(i&4)!==0&&a===0?n:null;if(o){for(_=0;_<b;_+=1)h[_].nodes?.a?.measure();for(_=0;_<b;_+=1)h[_].nodes?.a?.fix()}wh(t,h,E)}}o&&kt(()=>{if(c!==void 0)for(w of c)w.nodes?.a?.apply()})}function yh(t,e,n,i,r,o,a,l){var d=(a&1)!==0?(a&16)===0?tr(n,!1,!1):Gt(n):null,u=(a&2)!==0?Gt(r):null;return R&&d&&(d.trace=()=>{l()[u?.v??r]}),{v:d,i:u,e:dt(()=>(o(e,d??n,u??r,l),()=>{t.delete(i)}))}}function Vo(t,e,n){if(t.nodes)for(var i=t.nodes.start,r=t.nodes.end,o=e&&(e.f&33554432)===0?e.nodes.start:n;i!==null;){var a=Lt(i);if(o.before(i),i===r)return;i=a}}function Ai(t,e,n){e===null?t.effect.first=n:e.next=n,n===null?t.effect.last=e:n.prev=e}function $h(t,e){let n=new Map,i=t.length;for(let r=0;r<i;r++){let o=e(t[r],r);if(n.has(o)){let a=String(n.get(o)),l=String(r),d=String(o);d.startsWith("[object ")&&(d=null),Fa(a,l,d)}n.set(o,r)}}function Eh(t,e,n){if(!e||e===vc(String(n??"")))return;let i,r=t.__svelte_meta?.loc;r?i=`near ${r.file}:${r.line}:${r.column}`:pn?.[tn]&&(i=`in ${pn[tn]}`),Ef(Hs(i))}function cr(t,e,n=!1,i=!1,r=!1,o=!1){var a=t,l="";if(n){var d=t;le&&(a=Me(Ge(d)))}J(()=>{var u=ae;if(l===(l=e()??"")){le&&Et();return}if(n&&!le){u.nodes=null,d.innerHTML=l,l!==""&&At(Ge(d),d.lastChild);return}if(u.nodes!==null&&(nl(u.nodes.start,u.nodes.end),u.nodes=null),l!==""){if(le){for(var f=_e.data,c=Et(),p=c;c!==null&&(c.nodeType!==un||c.data!=="");)p=c,c=Lt(c);if(c===null)throw Ii(),Zn;R&&!o&&Eh(c.parentNode,f,l),At(_e,p),a=Me(c);return}var m=i?ko:r?La:void 0,g=ri(i?"svg":r?"math":"template",m);g.innerHTML=l;var x=i||r?g:g.content;if(At(Ge(x),x.lastChild),i||r)for(;Ge(x);)a.before(Ge(x));else a.before(x)}})}function lt(t,e){var n=void 0,i;el(()=>{n!==(n=e())&&(i&&(tt(i),i=null),n&&(i=dt(()=>{yn(()=>n(t))})))})}function Lc(t){var e,n,i="";if(typeof t=="string"||typeof t=="number")i+=t;else if(typeof t=="object")if(Array.isArray(t)){var r=t.length;for(e=0;e<r;e++)t[e]&&(n=Lc(t[e]))&&(i&&(i+=" "),i+=n)}else for(n in t)t[n]&&(i&&(i+=" "),i+=n);return i}function kc(){for(var t,e,n=0,i="",r=arguments.length;n<r;n++)(t=arguments[n])&&(e=Lc(t))&&(i&&(i+=" "),i+=e);return i}function ln(t){return typeof t=="object"?kc(t):t??""}var Sc=[...` 	
\r\f\xA0\v\uFEFF`];function Ic(t,e,n){var i=t==null?"":""+t;if(e&&(i=i?i+" "+e:e),n){for(var r of Object.keys(n))if(n[r])i=i?i+" "+r:r;else if(i.length)for(var o=r.length,a=0;(a=i.indexOf(r,a))>=0;){var l=a+o;(a===0||Sc.includes(i[a-1]))&&(l===i.length||Sc.includes(i[l]))?i=(a===0?"":i.substring(0,a))+i.substring(l+1):a=l}}return i===""?null:i}function Nc(t,e=!1){var n=e?" !important;":";",i="";for(var r of Object.keys(t)){var o=t[r];o!=null&&o!==""&&(i+=" "+r+": "+o+n)}return i}function dl(t){return t[0]!=="-"||t[1]!=="-"?t.toLowerCase():t}function Tc(t,e){if(e){var n="",i,r;if(Array.isArray(e)?(i=e[0],r=e[1]):i=e,t){t=String(t).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var o=!1,a=0,l=!1,d=[];i&&d.push(...Object.keys(i).map(dl)),r&&d.push(...Object.keys(r).map(dl));var u=0,f=-1;let x=t.length;for(var c=0;c<x;c++){var p=t[c];if(l?p==="/"&&t[c-1]==="*"&&(l=!1):o?o===p&&(o=!1):p==="/"&&t[c+1]==="*"?l=!0:p==='"'||p==="'"?o=p:p==="("?a++:p===")"&&a--,!l&&o===!1&&a===0){if(p===":"&&f===-1)f=c;else if(p===";"||c===x-1){if(f!==-1){var m=dl(t.substring(u,f).trim());if(!d.includes(m)){p!==";"&&c++;var g=t.substring(u,c).trim();n+=" "+g+";"}}u=c+1,f=-1}}}}return i&&(n+=Nc(i)),r&&(n+=Nc(r,!0)),n=n.trim(),n===""?null:n}return t==null?null:String(t)}function Ne(t,e,n,i,r,o){var a=t[So];if(le||a!==n||a===void 0){var l=Ic(n,i,o);(!le||l!==t.getAttribute("class"))&&(l==null?t.removeAttribute("class"):e?t.className=l:t.setAttribute("class",l)),t[So]=n}else if(o&&r!==o)for(var d in o){var u=!!o[d];(r==null||u!==!!r[d])&&t.classList.toggle(d,u)}return o}function fl(t,e={},n,i){for(var r in n){var o=n[r];e[r]!==o&&(n[r]==null?t.style.removeProperty(r):t.style.setProperty(r,o,i))}}function G(t,e,n,i){var r=t[No];if(le||r!==e){var o=Tc(e,i);(!le||o!==t.getAttribute("style"))&&(o==null?t.removeAttribute("style"):t.style.cssText=o),t[No]=e}else i&&(Array.isArray(i)?(fl(t,n?.[0],i[0]),fl(t,n?.[1],i[1],"important")):fl(t,n,i));return i}var Fh=Symbol("is custom element"),Dh=Symbol("is html"),Ah=Ca?"link":"LINK";function U(t,e,n,i){var r=Mh(t);if(le&&(r[e]=t.getAttribute(e),e==="src"||e==="srcset"||e==="href"&&t.nodeName===Ah)){i||Hh(t,e,n??"");return}r[e]!==(r[e]=n)&&(e==="loading"&&(t[ef]=n),n==null?t.removeAttribute(e):typeof n!="string"&&Rh(t).includes(e)?t[e]=n:t.setAttribute(e,n))}function Mh(t){return t[hs]??={[Fh]:t.nodeName.includes("-"),[Dh]:t.namespaceURI===ds}}var Cc=new Map;function Rh(t){var e=t.getAttribute("is")||t.nodeName,n=Cc.get(e);if(n)return n;Cc.set(e,n=[]);for(var i,r=t,o=Element.prototype;o!==r;){i=Sa(r);for(var a in i)i[a].set&&a!=="innerHTML"&&a!=="textContent"&&a!=="innerText"&&n.push(a);r=Fr(r)}return n}function Hh(t,e,n){R&&(e==="srcset"&&Oh(t,n)||cl(t.getAttribute(e)??"",n)||$f(e,t.outerHTML.replace(t.innerHTML,t.innerHTML&&"..."),String(n)))}function cl(t,e){return t===e?!0:new URL(t,document.baseURI).href===new URL(e,document.baseURI).href}function Fc(t){return t.split(",").map(e=>e.trim().split(" ").filter(Boolean))}function Oh(t,e){var n=Fc(t.srcset),i=Fc(e);return i.length===n.length&&i.every(([r,o],a)=>o===n[a][1]&&(cl(n[a][0],r)||cl(r,n[a][0])))}var Ph={get(t,e){if(!t.exclude.has(e))return t.props[e]},set(t,e){return R&&pf(`${t.name}.${String(e)}`),!1},getOwnPropertyDescriptor(t,e){if(!t.exclude.has(e)&&e in t.props)return{enumerable:!0,configurable:!0,value:t.props[e]}},has(t,e){return t.exclude.has(e)?!1:e in t.props},ownKeys(t){return Reflect.ownKeys(t.props).filter(e=>!t.exclude.has(e))}};function ue(t,e,n){return new Proxy(R?{props:t,exclude:e,name:n}:{props:t,exclude:e},Ph)}function Dc(t){return new pl(t)}var pl=class{#e;#t;constructor(e){var n=new Map,i=(o,a)=>{var l=tr(a,!1,!1);return n.set(o,l),l};let r=new Proxy({...e.props||{},$$events:{}},{get(o,a){return s(n.get(a)??i(a,Reflect.get(o,a)))},has(o,a){return a===us?!0:(s(n.get(a)??i(a,Reflect.get(o,a))),Reflect.has(o,a))},set(o,a,l){return oe(n.get(a)??i(a,l),l),Reflect.set(o,a,l)}});this.#t=(e.hydrate?al:Kr)(e.component,{target:e.target,anchor:e.anchor,props:r,context:e.context,intro:e.intro??!1,recover:e.recover,transformError:e.transformError}),!gt&&(!e?.props?.$$host||e.sync===!1)&&Gr(),this.#e=r.$$events;for(let o of Object.keys(this.#t))o==="$set"||o==="$destroy"||o==="$on"||jt(this,o,{get(){return this.#t[o]},set(a){this.#t[o]=a},enumerable:!0});this.#t.$set=o=>{Object.assign(r,o)},this.#t.$destroy=()=>{Wo(this.#t)}}$set(e){this.#t.$set(e)}$on(e,n){this.#e[e]=this.#e[e]||[];let i=(...r)=>n.call(this,...r);return this.#e[e].push(i),()=>{this.#e[e]=this.#e[e].filter(r=>r!==i)}}$destroy(){this.#t.$destroy()}};var qh;typeof HTMLElement=="function"&&(qh=class extends HTMLElement{$$ctor;$$s;$$c;$$cn=!1;$$d={};$$r=!1;$$p_d={};$$l={};$$l_u=new Map;$$me;$$shadowRoot=null;constructor(t,e,n){super(),this.$$ctor=t,this.$$s=e,n&&(this.$$shadowRoot=this.attachShadow(n))}addEventListener(t,e,n){if(this.$$l[t]=this.$$l[t]||[],this.$$l[t].push(e),this.$$c){let i=this.$$c.$on(t,e);this.$$l_u.set(e,i)}super.addEventListener(t,e,n)}removeEventListener(t,e,n){if(super.removeEventListener(t,e,n),this.$$c){let i=this.$$l_u.get(e);i&&(i(),this.$$l_u.delete(e))}}async connectedCallback(){if(this.$$cn=!0,!this.$$c){let t=function(i){return r=>{let o=ri("slot");i!=="default"&&(o.name=i),F(r,o)}};if(await Promise.resolve(),!this.$$cn||this.$$c)return;let e={},n=Kh(this);for(let i of this.$$s)i in n&&(i==="default"&&!this.$$d.children?(this.$$d.children=t(i),e.default=!0):e[i]=t(i));for(let i of this.attributes){let r=this.$$g_p(i.name);r in this.$$d||(this.$$d[r]=hl(r,i.value,this.$$p_d,"toProp"))}for(let i in this.$$p_d)!(i in this.$$d)&&this[i]!==void 0&&(this.$$d[i]=this[i],delete this[i]);this.$$c=Dc({component:this.$$ctor,target:this.$$shadowRoot||this,props:{...this.$$d,$$slots:e,$$host:this}}),this.$$me=Qa(()=>{Kt(()=>{this.$$r=!0;for(let i of ka(this.$$c)){if(!this.$$p_d[i]?.reflect)continue;this.$$d[i]=this.$$c[i];let r=hl(i,this.$$d[i],this.$$p_d,"toAttribute");r==null?this.removeAttribute(this.$$p_d[i].attribute||i):this.setAttribute(this.$$p_d[i].attribute||i,r)}this.$$r=!1})});for(let i in this.$$l)for(let r of this.$$l[i]){let o=this.$$c.$on(i,r);this.$$l_u.set(r,o)}this.$$l={}}}attributeChangedCallback(t,e,n){this.$$r||(t=this.$$g_p(t),this.$$d[t]=hl(t,n,this.$$p_d,"toProp"),this.$$c?.$set({[t]:this.$$d[t]}))}disconnectedCallback(){this.$$cn=!1,Promise.resolve().then(()=>{!this.$$cn&&this.$$c&&(this.$$c.$destroy(),this.$$me(),this.$$c=void 0)})}$$g_p(t){return ka(this.$$p_d).find(e=>this.$$p_d[e].attribute===t||!this.$$p_d[e].attribute&&e.toLowerCase()===t)||t}});function hl(t,e,n,i){let r=n[t]?.type;if(e=r==="Boolean"&&typeof e!="boolean"?e!=null:e,!i||!n[t])return e;if(i==="toAttribute")switch(r){case"Object":case"Array":return e==null?null:JSON.stringify(e);case"Boolean":return e?"":null;case"Number":return e??null;default:return e}else switch(r){case"Object":case"Array":return e&&JSON.parse(e);case"Boolean":return e;case"Number":return e!=null?+e:e;default:return e}}function Kh(t){let e={};return t.childNodes.forEach(n=>{e[n.slot||"default"]=!0}),e}var nt="--diff-font-size--",Fe="--diff-aside-width--";var di=()=>{let t=ce(!1);return ye(()=>{oe(t,!0)}),()=>s(t)};var Ac=Symbol("fontSize");function Mc(t){qe(Ac,()=>t.diffViewFontSize||14)}function Zr(){return Ye(Ac)}var Rc=Symbol("enableWrap");function Hc(t){qe(Rc,()=>t.diffViewWrap)}function $n(){return Ye(Rc)}var Oc=Symbol("renderWidget");function Bc(t){qe(Oc,()=>t.renderWidgetLine)}function Xr(){return Ye(Oc)}var Pc=Symbol("id");function jc(t){qe(Pc,t)}function Ps(){return Ye(Pc)}var Wc=Symbol("dom");function Uc(t){qe(Wc,t)}function js(){return Ye(Wc)}var Vc=Symbol("extend");function zc(t){qe(Vc,()=>t.extendData)}function Jr(){return Ye(Vc)}var Gc=Symbol("widget");function Yc(t){qe(Gc,()=>t)}function En(){return Ye(Gc)}var qc=Symbol("renderExtendLine");function Kc(t){qe(qc,()=>t.renderExtendLine)}function Qr(){return Ye(qc)}var Zc=Symbol("onAddWidgetClick");function Xc(t){qe(Zc,()=>t.onAddWidgetClick)}function eo(){return Ye(Zc)}var Jc=Symbol("enableHighlight");function Qc(t){qe(Jc,()=>t.diffViewHighlight)}function to(){return Ye(Jc)}var eu=Symbol("enableAddWidget");function tu(t){qe(eu,()=>t.diffViewAddWidget)}function no(){return Ye(eu)}var nu=Symbol("mode");function iu(t){qe(nu,()=>t.diffViewMode||Pt.Split)}function Ws(){return Ye(nu)}var ml=null,Zh=(t,e)=>`${t.fontFamily}-${t.fontStyle}-${t.fontSize}-${e}`,Xh=(t,e)=>Zh(t,"0".repeat(e.length)),vl=class{#e="";#t={};#n(){return ml=ml||document.createElement("canvas").getContext("2d"),ml}measure(e,n){let i=Xh(n||{},e);if(this.#t[i])return this.#t[i];let r=this.#n();if(n){let a=`${n.fontFamily}-${n.fontStyle}-${n.fontSize}`;this.#e!==a&&(this.#e=a,r.font=`${n.fontStyle||""} ${n.fontSize||""} ${n.fontFamily||""}`)}else r.font="";return r.measureText(e).width}},gl=null,ru=()=>(gl=gl||new vl,gl);var io=({text:t,font:e})=>{let n=k(di()),i=parseInt(e().fontSize||"14"),r=6;r+=i>10?(i-10)*.6:0;let o=ce(r*t().length);return ye(()=>{s(n)&&oe(o,ru().measure(t()||"",e()),!0)}),()=>s(o)};var Ln=()=>{window.getSelection()?.removeAllRanges()},ou=(t,e)=>{let n=function(i){i===null||i.target===null||(i.target===t?(e.scrollTop=t.scrollTop,e.scrollLeft=t.scrollLeft):(t.scrollTop=e.scrollTop,t.scrollLeft=e.scrollLeft))};return t.onscroll||(t.onscroll=n),e.onscroll||(e.onscroll=n),()=>{t.onscroll=null,e.onscroll=null}},Us=t=>{if(t){let e=t.getRootNode();return e instanceof ShadowRoot?e:t.ownerDocument}return document},ro=t=>{if(t){if(typeof t.closest=="function")return t.closest('[data-component="git-diff-view"]')?.querySelector?.(".diff-view-wrapper")?.getAttribute?.("id");{let e=t;for(;e;){if(e.getAttribute&&e.getAttribute("data-component")==="git-diff-view")return e.querySelector(".diff-view-wrapper")?.getAttribute("id");e=e.parentElement}}}};var _l="--diff-add-content--",bl="--diff-del-content--",gn="--diff-border--",wl="--diff-add-lineNumber--",xl="--diff-del-lineNumber--",yl="--diff-plain-content--",Vs="--diff-expand-content--",ft="--diff-plain-lineNumber-color--",ur="--diff-expand-lineNumber-color--",$l="--diff-plain-lineNumber--",Jh="--diff-expand-lineNumber--",dn="--diff-hunk-content--",Pn="--diff-hunk-content-color--",jn="--diff-hunk-lineNumber--";var zs="--diff-add-widget--",Gs="--diff-add-widget-color--",Jt="--diff-empty-content--",zo=(t,e,n)=>t?`var(${_l})`:e?`var(${bl})`:n?`var(${yl})`:`var(${Vs})`,Go=(t,e,n)=>t?`var(${wl})`:e?`var(${xl})`:n?`var(${$l})`:`var(${Jh})`;var Qh=new Set(["$$slots","$$events","$$legacy"]),em=B('<div><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Mi(t,e){de(e,!0);let n=ue(e,Qh);var i=em(),r=C(i);T(i),J(()=>{U(i,"data-add-widget",O[e.side]),Ne(i,1,"diff-add-widget-wrapper invisible select-none transition-transform hover:scale-110 group-hover:visible"+(e.className?" "+e.className:"")),G(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),G(r,`
			color: var(${Gs});
			background-color: var(${zs});
    `)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),F(t,i),fe()}rt(["mousedown"]);Nf();var tm=yi('<svg aria-label="No newline at end of file" role="img" viewBox="0 0 16 16" version="1.1" fill="currentColor"><path d="M4.25 7.25a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5Z"></path><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0Z"></path></svg>');function Yo(t){var e=tm();F(t,e)}var nm=new Set(["$$slots","$$events","$$legacy"]),im=B('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),rm=B('<span class="diff-line-content-raw"><span data-template=""></span><!></span>'),su=B('<span class="diff-line-content-raw"> </span>'),om=B('<span class="diff-line-content-raw"><span data-template=""></span></span>');function qo(t,e){de(e,!0);let n=ue(e,nm);e.diffLine?.changes?.hasLineChange?e.diffLine?.plainTemplate&&typeof yo=="function"&&yo({diffLine:e.diffLine,rawLine:e.rawLine,operator:e.operator||"add"}):e.plainLine&&!e.plainLine?.template&&(e.plainLine.template=ba(e.plainLine.value));var r=pe(),o=ne(r);{var a=u=>{var f=pe(),c=ne(f);{var p=g=>{var x=rm(),w=C(x);cr(w,()=>e.diffLine.plainTemplate,!0),T(w);var _=X(w);{var L=y=>{var I=im(),S=C(I);Yo(S,{}),T(I),J(()=>{Ne(I,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),G(I,`
						width: var(${nt});
						height: var(${nt})
					`)}),F(y,I)};q(_,y=>{e.diffLine.changes.newLineSymbol===Tr.NEWLINE&&y(L)})}T(x),F(g,x)},m=g=>{var x=su(),w=C(x,!0);T(x),J(()=>Ce(w,e.rawLine)),F(g,x)};q(c,g=>{e.diffLine?.plainTemplate?g(p):g(m,-1)})}F(u,f)},l=u=>{var f=om(),c=C(f);cr(c,()=>e.plainLine.template,!0),T(c),T(f),F(u,f)},d=u=>{var f=su(),c=C(f,!0);T(f),J(()=>Ce(c,e.rawLine)),F(u,f)};q(o,u=>{e.diffLine?.changes?.hasLineChange?u(a):e.plainLine?.template?u(l,1):u(d,-1)})}F(t,r),fe()}var sm=new Set(["$$slots","$$events","$$legacy"]),am=B('<span data-no-newline-at-end-of-file-symbol=""><!></span>'),lm=B('<span class="diff-line-syntax-raw"><span data-template=""></span><!></span>'),au=B("<span> </span>"),lu=B('<span class="diff-line-syntax-raw"></span>'),dm=B('<span class="diff-line-syntax-raw"><span data-template=""></span></span>');function El(t,e){de(e,!0);let n=ue(e,sm);e.diffLine?.changes?.hasLineChange?e.syntaxLine&&e.diffLine&&!e.diffLine?.syntaxTemplate&&typeof $o=="function"&&$o({diffFile:e.diffFile,diffLine:e.diffLine,syntaxLine:e.syntaxLine,operator:e.operator||"add"}):e.syntaxLine&&!e.syntaxLine.template&&(e.syntaxLine.template=_a(e.syntaxLine));var r=pe(),o=ne(r);{var a=f=>{qo(f,{get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get operator(){return e.operator},get enableWrap(){return e.enableWrap}})},l=f=>{var c=pe(),p=ne(c);{var m=x=>{var w=lm(),_=C(w);cr(_,()=>e.diffLine.syntaxTemplate,!0),T(_);var L=X(_);{var y=I=>{var S=am(),$=C(S);Yo($,{}),T(S),J(()=>{Ne(S,1,ln(e.enableWrap?"block !text-red-500":"inline-block align-middle !text-red-500")),G(S,`
                width: var(${nt});
                height: var(${nt});
              `)}),F(I,S)};q(L,I=>{e.diffLine.changes.newLineSymbol===Tr.NEWLINE&&I(y)})}T(w),F(x,w)},g=x=>{var w=lu();li(w,21,()=>e.syntaxLine.nodeList,ai,(_,L)=>{let y=()=>s(L).node,I=()=>s(L).wrapper;var S=au(),$=C(S,!0);T(S),J(h=>{U(S,"data-start",y().startIndex),U(S,"data-end",y().endIndex),Ne(S,1,h),G(S,I()?.properties?.style),Ce($,y().value)},[()=>ln(I()?.properties?.className?.join(" "))]),F(_,S)}),T(w),F(x,w)};q(p,x=>{e.diffLine?.syntaxTemplate?x(m):x(g,-1)})}F(f,c)},d=f=>{var c=dm(),p=C(c);cr(p,()=>e.syntaxLine.template,!0),T(p),T(c),F(f,c)},u=f=>{var c=lu();li(c,21,()=>e.syntaxLine.nodeList,ai,(p,m)=>{let g=()=>s(m).node,x=()=>s(m).wrapper;var w=au(),_=C(w,!0);T(w),J(L=>{U(w,"data-start",g().startIndex),U(w,"data-end",g().endIndex),Ne(w,1,L),G(w,x()?.properties?.style),Ce(_,g().value)},[()=>ln(x()?.properties?.className?.join(" "))]),F(p,w)}),T(c),F(f,c)};q(o,f=>{e.syntaxLine?e.diffLine?.changes?.hasLineChange?f(l,1):e.syntaxLine.template?f(d,2):f(u,-1):f(a)})}F(t,r),fe()}var fm=new Set(["$$slots","$$events","$$legacy"]),cm=B('<div class="diff-line-content-item pl-[2.0em]"><span class="diff-line-content-operator ml-[-1.5em] inline-block w-[1.5em] select-none indent-[0.2em]"> </span> <!></div>');function fi(t,e){de(e,!0);let n=ue(e,fm),i=k(()=>e.diffLine?.type===Re.Add),r=k(()=>e.diffLine?.type===Re.Delete),o=k(()=>e.syntaxLine&&e.syntaxLine?.nodeList?.length>150);var a=cm(),l=C(a),d=C(l,!0);T(l);var u=X(l,2);{var f=p=>{{let m=k(()=>s(i)?"add":s(r)?"del":void 0);El(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffFile(){return e.diffFile},get diffLine(){return e.diffLine},get syntaxLine(){return e.syntaxLine},get enableWrap(){return e.enableWrap}})}},c=p=>{{let m=k(()=>s(i)?"add":s(r)?"del":void 0);qo(p,{get operator(){return s(m)},get rawLine(){return e.rawLine},get diffLine(){return e.diffLine},get plainLine(){return e.plainLine},get enableWrap(){return e.enableWrap}})}};q(u,p=>{e.enableHighlight&&e.syntaxLine&&!s(o)?p(f):p(c,-1)})}T(a),J(()=>{G(a,`
		white-space: ${e.enableWrap?"pre-wrap":"pre"};
		word-break: ${e.enableWrap?"break-all":"initial"}
	`),U(l,"data-operator",s(i)?"+":s(r)?"-":void 0),Ce(d,s(i)?"+":s(r)?"-":" ")}),F(t,a),fe()}var um=new Set(["$$slots","$$events","$$legacy"]),pm=B('<td class="diff-line-old-num group relative w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-old-content group relative pr-[10px] align-top"><!> <!></td>',1),hm=B('<td class="diff-line-old-placeholder select-none"><span>&ensp;</span></td>'),mm=B('<td class="diff-line-new-num group relative w-[1%] min-w-[40px] select-none border-l-[1px] pl-[10px] pr-[10px] text-right align-top"><!> <span> </span></td> <td class="diff-line-new-content group relative pr-[10px] align-top"><!> <!></td>',1),gm=B('<td class="diff-line-new-placeholder select-none border-l-[1px]"><span>&ensp;</span></td>'),vm=B('<tr class="diff-line"><!><!></tr>');function Ll(t,e){de(e,!0);let n=ue(e,um),i=k(En()),r=k(no()),o=k(to()),a=k(eo()),l=k(()=>e.diffFile.getSplitLeftLine(e.index)),d=k(()=>e.diffFile.getSplitRightLine(e.index)),u=()=>e.diffFile.getOldSyntaxLine(s(l)?.lineNumber||0),f=()=>e.diffFile.getNewSyntaxLine(s(d)?.lineNumber||0),c=()=>e.diffFile.getOldPlainLine(s(l)?.lineNumber||0),p=()=>e.diffFile.getNewPlainLine(s(d)?.lineNumber||0),m=ce(Le(u())),g=ce(Le(f())),x=ce(Le(c())),w=ce(Le(p())),_=k(()=>!!s(l)?.diff||!!s(d)?.diff),L=k(()=>Xi(s(l)?.diff)||Xi(s(d)?.diff)),y=k(()=>s(l)?.isHidden&&s(d)?.isHidden),I=()=>s(l)?.diff?.type===Re.Delete,S=()=>s(d)?.diff?.type===Re.Add,$=()=>{oe(m,u(),!0),oe(g,f(),!0),oe(x,c(),!0),oe(w,p(),!0)},h={current:()=>{}};ye(()=>{h.current(),$(),h.current=e.diffFile.subscribe($)}),Ve(()=>h.current());let b=(W,P)=>{s(i).side=P,s(i).lineNumber=W};var E=pe(),D=ne(E);{var M=W=>{var P=vm(),K=C(P);{var ee=j=>{var V=pm(),H=ne(V),he=C(H);{var ie=ge=>{{let ke=k(()=>s(l)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:b})}};q(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Q=X(he,2),ve=C(Q,!0);T(Q),T(H);var se=X(H,2),te=C(se);{var xe=ge=>{{let ke=k(()=>s(l)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.old},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:b})}};q(te,ge=>{s(_)&&s(r)&&ge(xe)})}var $e=X(te,2);{let ge=k(()=>s(l)?.value||""),ke=k(()=>s(l)?.diff),Be=k(()=>!!s(o));fi($e,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(x)},get syntaxLine(){return s(m)},get enableHighlight(){return s(Be)}})}T(se),J((ge,ke)=>{G(H,ge),U(H,"data-side",O[O.old]),U(Q,"data-line-num",s(l)?.lineNumber),G(Q,`opacity: ${s(L)?void 0:.5} `),Ce(ve,s(l)?.lineNumber),G(se,ke),U(se,"data-side",O[O.old])},[()=>`
					background-color: ${Go(!1,I(),s(_))};
					color: var(${s(_)?ft:ur})
				`,()=>` background-color: ${zo(!1,I(),s(_))} `]),F(j,V)},re=j=>{var V=hm();U(V,"colspan",2),J(()=>G(V,`background-color: var(${Jt}) `)),F(j,V)};q(K,j=>{s(l)?.lineNumber?j(ee):j(re,-1)})}var Z=X(K);{var A=j=>{var V=mm(),H=ne(V),he=C(H);{var ie=ge=>{{let ke=k(()=>s(d)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:b})}};q(he,ge=>{s(_)&&s(r)&&ge(ie)})}var Q=X(he,2),ve=C(Q,!0);T(Q),T(H);var se=X(H,2),te=C(se);{var xe=ge=>{{let ke=k(()=>s(d)?.lineNumber||0);Mi(ge,{get index(){return e.index},get lineNumber(){return s(ke)},get side(){return O.new},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute right-[100%] z-[1] translate-x-[50%]",onOpenAddWidget:b})}};q(te,ge=>{s(_)&&s(r)&&ge(xe)})}var $e=X(te,2);{let ge=k(()=>s(d)?.value||""),ke=k(()=>s(d)?.diff),Be=k(()=>!!s(o));fi($e,{enableWrap:!0,get diffFile(){return e.diffFile},get rawLine(){return s(ge)},get diffLine(){return s(ke)},get plainLine(){return s(w)},get syntaxLine(){return s(g)},get enableHighlight(){return s(Be)}})}T(se),J((ge,ke)=>{G(H,ge),U(H,"data-side",O[O.new]),U(Q,"data-line-num",s(d)?.lineNumber),G(Q,` opacity: ${s(L)?void 0:.5} `),Ce(ve,s(d)?.lineNumber),G(se,ke),U(se,"data-side",O[O.new])},[()=>`
					background-color: ${Go(S(),!1,s(_))};
					color: var(${s(_)?ft:ur});
					border-left-color: var(${gn});
					border-left-style: solid
				`,()=>`background-color: ${zo(S(),!1,s(_))} `]),F(j,V)},Y=j=>{var V=gm();U(V,"colspan",2),J(()=>G(V,`
					background-color: var(${Jt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),F(j,V)};q(Z,j=>{s(d)?.lineNumber?j(A):j(Y,-1)})}T(P),J(()=>{U(P,"data-line",e.lineNumber),U(P,"data-state",s(_)?"diff":"plain")}),F(W,P)};q(D,W=>{s(y)||W(M)})}F(t,E),fe()}var _m=new Set(["$$slots","$$events","$$legacy"]),bm=B('<td class="diff-line-extend-old-content p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),wm=B('<td class="diff-line-extend-old-placeholder select-none p-0"></td>'),xm=B('<td class="diff-line-extend-new-content border-l-[1px] p-0"><div class="diff-line-extend-wrapper"><!></div></td>'),ym=B('<td class="diff-line-extend-new-placeholder select-none border-l-[1px] p-0"></td>'),$m=B('<tr data-state="extend" class="diff-line diff-line-extend"><!><!></tr>');function kl(t,e){de(e,!0);let n=ue(e,_m),i=k(Jr()),r=k(Qr()),o=k(()=>e.diffFile.getSplitLeftLine(e.index)),a=k(()=>e.diffFile.getSplitRightLine(e.index)),l=k(()=>e.diffFile.getExpandEnabled()),d=k(()=>s(i)?.oldFile?.[s(o)?.lineNumber||""]),u=k(()=>s(i)?.newFile?.[s(a)?.lineNumber||""]),f=k(()=>!!((s(d)||s(u))&&(!s(o)?.isHidden&&!s(a)?.isHidden||s(l))&&s(r)));var c=pe(),p=ne(c);{var m=g=>{var x=$m(),w=C(x);{var _=$=>{var h=bm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(r),()=>({diffFile:e.diffFile,side:O.old,lineNumber:s(o)?.lineNumber||0,data:s(d)?.data,onUpdate:e.diffFile.notifyAll})),T(b),T(h),F($,h)},L=$=>{var h=wm();U(h,"colspan",2),J(()=>G(h,`background-color: var(${Jt})`)),F($,h)};q(w,$=>{s(r)&&s(d)?$(_):$(L,-1)})}var y=X(w);{var I=$=>{var h=xm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(r),()=>({diffFile:e.diffFile,side:O.new,lineNumber:s(a)?.lineNumber||0,data:s(u)?.data,onUpdate:e.diffFile.notifyAll})),T(b),T(h),J(()=>G(h,`border-left-color: var(${gn}); border-left-style: solid `)),F($,h)},S=$=>{var h=ym();U(h,"colspan",2),J(()=>G(h,`
					background-color: var(${Jt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),F($,h)};q(y,$=>{s(r)&&s(u)?$(I):$(S,-1)})}T(x),J(()=>U(x,"data-line",`${e.lineNumber}-extend`)),F(g,x)};q(p,g=>{s(f)&&g(m)})}F(t,c),fe()}var Em=new Set(["$$slots","$$events","$$legacy"]),Lm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="M7.823 1.677 4.927 4.573A.25.25 0 0 0 5.104 5H7.25v3.236a.75.75 0 1 0 1.5 0V5h2.146a.25.25 0 0 0 .177-.427L8.177 1.677a.25.25 0 0 0-.354 0ZM13.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Zm-3.75.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM7.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5ZM4 11.75a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1-.75-.75ZM1.75 11a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z"></path></svg>');function It(t,e){de(e,!0);let n=ue(e,Em);var i=Lm();J(()=>Ne(i,0,ln(e.className))),F(t,i),fe()}var km=new Set(["$$slots","$$events","$$legacy"]),Sm=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177 14.323 2.896-2.896a.25.25 0 0 0-.177-.427H8.75V7.764a.75.75 0 1 0-1.5 0V11H5.104a.25.25 0 0 0-.177.427l2.896 2.896a.25.25 0 0 0 .354 0ZM2.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75ZM8.25 5a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 4.25a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5a.75.75 0 0 1 .75.75Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function Tt(t,e){de(e,!0);let n=ue(e,km);var i=Sm();J(()=>Ne(i,0,ln(e.className))),F(t,i),fe()}var Nm=new Set(["$$slots","$$events","$$legacy"]),Im=yi('<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16"><path d="m8.177.677 2.896 2.896a.25.25 0 0 1-.177.427H8.75v1.25a.75.75 0 0 1-1.5 0V4H5.104a.25.25 0 0 1-.177-.427L7.823.677a.25.25 0 0 1 .354 0ZM7.25 10.75a.75.75 0 0 1 1.5 0V12h2.146a.25.25 0 0 1 .177.427l-2.896 2.896a.25.25 0 0 1-.354 0l-2.896-2.896A.25.25 0 0 1 5.104 12H7.25v-1.25Zm-5-2a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM6 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 6 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5ZM12 8a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1 0-1.5h.5A.75.75 0 0 1 12 8Zm2.25.75a.75.75 0 0 0 0-1.5h-.5a.75.75 0 0 0 0 1.5h.5Z"></path></svg>');function kn(t,e){de(e,!0);let n=ue(e,Nm);var i=Im();J(()=>Ne(i,0,ln(e.className))),F(t,i),fe()}var Tm=new Set(["$$slots","$$events","$$legacy"]),Cm=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),Fm=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Dm=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Am=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Mm=B('<div class="min-h-[28px]">&ensp;</div>'),Rm=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Sl(t,e){de(e,!0);let n=ue(e,Tm),i=k(()=>e.diffFile.getSplitHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)?.splitInfo),a=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},l=ce(Le(a())),d=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(d())),f=k(()=>{let _=s(i);return _&&_.isFirst}),c=k(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=k(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,d(),!0),oe(l,a(),!0)};_(),m.current=e.diffFile.subscribe(_)}),Ve(()=>m.current());var g=pe(),x=ne(g);{var w=_=>{var L=Rm(),y=C(L),I=C(y);{var S=D=>{var M=pe(),W=ne(M);{var P=Z=>{var A=Cm(),Y=C(A);It(Y,{className:"fill-current"}),T(A),we("click",A,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(Z,A)},K=Z=>{var A=Fm(),Y=C(A);Tt(Y,{className:"fill-current"}),T(A),we("click",A,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(Z,A)},ee=Z=>{var A=Dm(),Y=C(A);kn(Y,{className:"fill-current"}),T(A),we("click",A,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(Z,A)},re=Z=>{var A=Am(),Y=ne(A),j=C(Y);Tt(j,{className:"fill-current"}),T(Y);var V=X(Y,2),H=C(V);It(H,{className:"fill-current"}),T(V),we("click",Y,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",V,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(Z,A)};q(W,Z=>{s(f)?Z(P):s(p)?Z(K,1):s(l)?Z(ee,2):Z(re,-1)})}F(D,M)},$=D=>{var M=Mm();F(D,M)};q(I,D=>{s(o)?D(S):D($,-1)})}T(y);var h=X(y);U(h,"colspan",3);var b=C(h),E=C(b,!0);T(b),T(h),T(L),J(()=>{U(L,"data-line",`${e.lineNumber}-hunk`),G(y,`
				background-color: var(${jn});
				color: var(${ft})
			`),G(h,`background-color: var(${dn})`),G(b,`
					color: var(${Pn})
				`),Ce(E,s(i)?.splitInfo?.plainText||s(i)?.text)}),F(_,L)};q(x,_=>{(s(u)||s(c))&&_(w)})}F(t,g),fe()}rt(["click"]);var Hm=new Set(["$$slots","$$events","$$legacy"]),du=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),fu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),cu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),uu=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),pu=B('<div class="min-h-[28px]">&ensp;</div>'),Om=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action relative w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td><td class="diff-line-hunk-action relative z-[1] w-[1%] min-w-[40px] select-none border-l-[1px] p-[1px]"><!></td><td class="diff-line-hunk-content relative pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Nl(t,e){de(e,!0);let n=ue(e,Hm),i=k(()=>e.diffFile.getSplitHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)?.splitInfo),a=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.endHiddenIndex-_.splitInfo.startHiddenIndex<je},l=ce(Le(a())),d=()=>{let _=s(i);return _&&_.splitInfo&&_.splitInfo.startHiddenIndex<_.splitInfo.endHiddenIndex},u=ce(Le(d())),f=k(()=>{let _=s(i);return _&&_.isFirst}),c=k(()=>{let _=s(i);return _&&e.diffFile._getIsPureDiffRender()&&!_.splitInfo}),p=k(()=>{let _=s(i);return _&&_.isLast}),m={current:()=>{}};ye(()=>{m.current();let _=()=>{oe(u,d(),!0),oe(l,a(),!0)};_(),m.current=e.diffFile.subscribe(_)}),Ve(()=>m.current());var g=pe(),x=ne(g);{var w=_=>{var L=Om(),y=C(L),I=C(y);{var S=Z=>{var A=pe(),Y=ne(A);{var j=ie=>{var Q=du(),ve=C(Q);It(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)},V=ie=>{var Q=fu(),ve=C(Q);Tt(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(ie,Q)},H=ie=>{var Q=cu(),ve=C(Q);kn(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(ie,Q)},he=ie=>{var Q=uu(),ve=ne(Q),se=C(ve);Tt(se,{className:"fill-current"}),T(ve);var te=X(ve,2),xe=C(te);It(xe,{className:"fill-current"}),T(te),we("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)};q(Y,ie=>{s(f)?ie(j):s(p)?ie(V,1):s(l)?ie(H,2):ie(he,-1)})}F(Z,A)},$=Z=>{var A=pu();F(Z,A)};q(I,Z=>{s(o)?Z(S):Z($,-1)})}T(y);var h=X(y),b=C(h),E=C(b,!0);T(b),T(h);var D=X(h),M=C(D);{var W=Z=>{var A=pe(),Y=ne(A);{var j=ie=>{var Q=du(),ve=C(Q);It(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)},V=ie=>{var Q=fu(),ve=C(Q);Tt(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(ie,Q)},H=ie=>{var Q=cu(),ve=C(Q);kn(ve,{className:"fill-current"}),T(Q),we("click",Q,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(ie,Q)},he=ie=>{var Q=uu(),ve=ne(Q),se=C(ve);Tt(se,{className:"fill-current"}),T(ve);var te=X(ve,2),xe=C(te);It(xe,{className:"fill-current"}),T(te),we("click",ve,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(ie,Q)};q(Y,ie=>{s(f)?ie(j):s(p)?ie(V,1):s(l)?ie(H,2):ie(he,-1)})}F(Z,A)},P=Z=>{var A=pu();F(Z,A)};q(M,Z=>{s(o)?Z(W):Z(P,-1)})}T(D);var K=X(D),ee=C(K),re=C(ee,!0);T(ee),T(K),T(L),J(()=>{U(L,"data-line",`${e.lineNumber}-hunk`),G(y,`
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
				`),Ce(re,s(i)?.splitInfo?.plainText||s(i)?.text)}),F(_,L)};q(x,_=>{(s(u)||s(c))&&_(w)})}F(t,g),fe()}rt(["click"]);var Bm=new Set(["$$slots","$$events","$$legacy"]);function Ys(t,e){de(e,!0);let n=ue(e,Bm),i=k(Ws());var r=pe(),o=ne(r);{var a=d=>{Sl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Nl(d,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};q(o,d=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?d(a):d(l,-1)})}F(t,r),fe()}var Pm=new Set(["$$slots","$$events","$$legacy"]),jm=B('<td class="diff-line-widget-old-content p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Wm=B('<td class="diff-line-widget-old-placeholder select-none p-0"></td>'),Um=B('<td class="diff-line-widget-new-content border-l-[1px] p-0"><div class="diff-line-widget-wrapper"><!></div></td>'),Vm=B('<td class="diff-line-widget-new-placeholder select-none border-l-[1px] p-0"></td>'),zm=B('<tr data-state="widget" class="diff-line diff-line-widget"><!><!></tr>');function Il(t,e){de(e,!0);let n=ue(e,Pm),i=k(Xr()),r=k(En()),o=k(()=>e.diffFile.getSplitLeftLine(e.index)),a=k(()=>e.diffFile.getSplitRightLine(e.index)),l=k(()=>s(o)?.lineNumber&&s(r)?.side===O.old&&s(r)?.lineNumber===s(o)?.lineNumber),d=k(()=>s(a)?.lineNumber&&s(r)?.side===O.new&&s(r)?.lineNumber===s(a)?.lineNumber),u=k(()=>(!!s(l)||!!s(d))&&!s(o)?.isHidden&&!s(a)?.isHidden&&!!s(i)),f=()=>{s(r).side=void 0,s(r).lineNumber=void 0};var c=pe(),p=ne(c);{var m=g=>{var x=zm(),w=C(x);{var _=$=>{var h=jm();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(i),()=>({diffFile:e.diffFile,side:O.old,lineNumber:s(o)?.lineNumber||0,onClose:f})),T(b),T(h),F($,h)},L=$=>{var h=Wm();U(h,"colspan",2),J(()=>G(h,`background-color: var(${Jt})`)),F($,h)};q(w,$=>{s(l)&&s(i)?$(_):$(L,-1)})}var y=X(w);{var I=$=>{var h=Um();U(h,"colspan",2);var b=C(h),E=C(b);Mt(E,()=>s(i)??ht,()=>({diffFile:e.diffFile,side:O.new,lineNumber:s(a)?.lineNumber||0,onClose:f})),T(b),T(h),J(()=>G(h,`border-left-color: var(${gn}); border-left-style: solid `)),F($,h)},S=$=>{var h=Vm();U(h,"colspan",2),J(()=>G(h,`
					background-color: var(${Jt});
					border-left-color: var(${gn});
					border-left-style: solid;
				`)),F($,h)};q(y,$=>{s(d)&&s(i)?$(I):$(S,-1)})}T(x),J(()=>U(x,"data-line",`${e.lineNumber}-widget`)),F(g,x)};q(p,g=>{s(u)&&g(m)})}F(t,c),fe()}var Gm=new Set(["$$slots","$$events","$$legacy"]),Ym=B("<!> <!> <!> <!>",1),qm=B('<div class="split-diff-view split-diff-view-warp w-full"><div class="diff-table-wrapper w-full"><style data-select-style=""></style> <table class="diff-table w-full table-fixed border-collapse border-spacing-0"><colgroup><col class="diff-table-old-num-col"/><col class="diff-table-old-content-col"/><col class="diff-table-new-num-col"/><col class="diff-table-new-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">old line number</th><th scope="col">old line content</th><th scope="col">new line number</th><th scope="col">new line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function Tl(t,e){de(e,!0);let n=ue(e,Gm),i=()=>ss(e.diffFile),r=ce(Le(i())),o={current:void 0},a=ce(void 0),l=k(()=>Math.max(e.diffFile.splitLineLength,e.diffFile.fileLineLength).toString()),d=k(Zr()),u=k(()=>({fontSize:`${s(d)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),f={current:()=>{}};ye(()=>{f.current();let E=()=>oe(r,i(),!0);E(),f.current=e.diffFile.subscribe(E)}),Ve(()=>f.current());let c=E=>{let D=s(a);if(D)if(E){let M=E===O.old?O.new:O.old;D.textContent=`#diff-root${e.diffFile.getId()} [data-side="${O[M]}"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="extend"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="hunk"] {user-select: none} 
#diff-root${e.diffFile.getId()} [data-state="widget"] {user-select: none}`}else D.textContent=""},p=E=>{let D=E.target;if(D&&D instanceof HTMLElement&&D.nodeName==="BUTTON"){Ln();return}let M=ro(D);if(!(M&&M!==`diff-root${e.diffFile.getId()}`))for(;D&&D instanceof HTMLElement;){let W=D.getAttribute("data-state"),P=D.getAttribute("data-side");if(P&&o.current!==O[P]&&(o.current=O[P],c(O[P]),Ln()),W)if(W==="extend"||W==="hunk"||W==="widget"){o.current!==void 0&&(o.current=void 0,c(void 0),Ln());return}else return;D=D.parentElement}},m=k(io({text:()=>s(l),font:()=>s(u)})),g=k(()=>Math.max(40,s(m)+25));var x=qm(),w=C(x),_=C(w);lt(_,()=>E=>oe(a,E,!0));var L=X(_,2),y=C(L),I=C(y),S=X(I,2);Ji(),T(y);var $=X(y,2),h=C($);li(h,17,()=>s(r),ai,(E,D)=>{var M=Ym(),W=ne(M);Ys(W,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}});var P=X(W,2);Ll(P,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}});var K=X(P,2);Il(K,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}});var ee=X(K,2);kl(ee,{get index(){return s(D).index},get lineNumber(){return s(D).lineNumber},get diffFile(){return e.diffFile}}),F(E,M)});var b=X(h);Ys(b,{get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),T($),T(L),T(w),T(x),J((E,D,M)=>{G(w,E),U(I,"width",D),U(S,"width",M)},[()=>`
			${Fe}: ${Math.round(s(g))}px;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`,()=>Math.round(s(g)),()=>Math.round(s(g))]),we("mousedown",$,p),F(t,x),fe()}rt(["mousedown"]);var Km=new Set(["$$slots","$$events","$$legacy"]),Zm=B("<td><!> <span> </span></td> <td><!></td>",1),Xm=B("<td><span>&ensp;</span></td>"),Jm=B("<tr><!></tr>");function Cl(t,e){de(e,!0);let n=ue(e,Km),i=k(En()),r=k(no()),o=k(to()),a=k(eo()),l=k(()=>e.side===O.old?e.diffFile.getSplitLeftLine(e.index):e.diffFile.getSplitRightLine(e.index)),d=k(()=>!!s(l)?.diff),u=k(()=>Xi(s(l)?.diff)),f=k(()=>s(l)?.isHidden),c=k(()=>!!s(l)?.lineNumber),p=()=>e.side===O.old?e.diffFile.getOldSyntaxLine(s(l)?.lineNumber||0):e.diffFile.getNewSyntaxLine(s(l)?.lineNumber||0),m=()=>e.side===O.old?e.diffFile.getOldPlainLine(s(l)?.lineNumber||0):e.diffFile.getNewPlainLine(s(l)?.lineNumber||0),g=ce(Le(p())),x=ce(Le(m())),w=()=>{oe(g,p(),!0),oe(x,m(),!0)},_={current:()=>{}};ye(()=>{_.current(),w(),_.current=e.diffFile.subscribe(w)}),Ve(()=>_.current());let L=(b,E)=>{s(i).side=E,s(i).lineNumber=b},y=()=>s(l)?.diff?.type===Re.Add,I=()=>s(l)?.diff?.type===Re.Delete;var S=pe(),$=ne(S);{var h=b=>{var E=Jm(),D=C(E);{var M=P=>{var K=Zm(),ee=ne(K),re=C(ee);{var Z=H=>{{let he=k(()=>s(l)?.lineNumber||0);Mi(H,{get index(){return e.index},get lineNumber(){return s(he)},get side(){return e.side},get diffFile(){return e.diffFile},get onWidgetClick(){return s(a)},className:"absolute left-[100%] z-[1] translate-x-[-50%]",onOpenAddWidget:L})}};q(re,H=>{s(d)&&s(r)&&H(Z)})}var A=X(re,2),Y=C(A,!0);T(A),T(ee);var j=X(ee,2),V=C(j);{let H=k(()=>s(l)?.value||""),he=k(()=>s(l)?.diff),ie=k(()=>!!s(o));fi(V,{enableWrap:!1,get diffFile(){return e.diffFile},get rawLine(){return s(H)},get diffLine(){return s(he)},get plainLine(){return s(x)},get syntaxLine(){return s(g)},get enableHighlight(){return s(ie)}})}T(j),J((H,he)=>{Ne(ee,1,`diff-line-${O[e.side]}-num sticky left-0 z-[1] w-[1%] min-w-[40px] select-none pl-[10px] pr-[10px] text-right align-top`),G(ee,H),U(A,"data-line-num",s(l)?.lineNumber),G(A,` opacity: ${s(u)?void 0:.5} `),Ce(Y,s(l)?.lineNumber),Ne(j,1,`diff-line-${O[e.side]}-content pr-[10px] align-top`),G(j,he)},[()=>`
					background-color: ${Go(y(),I(),s(d))};
					color: var(${s(d)?ft:ur});
					width: var(${Fe});
					min-width: var(${Fe});
					max-width: var(${Fe})
				`,()=>` background-color: ${zo(y(),I(),s(d))} `]),F(P,K)},W=P=>{var K=Xm();U(K,"colspan",2),J(()=>{Ne(K,1,`diff-line-${O[e.side]}-placeholder select-none`),G(K,`background-color: var(${Jt}) `)}),F(P,K)};q(D,P=>{s(c)?P(M):P(W,-1)})}T(E),J(()=>{U(E,"data-line",e.lineNumber),U(E,"data-state",s(d)||!s(c)?"diff":"plain"),U(E,"data-side",O[e.side]),Ne(E,1,"diff-line"+(s(c)?" group":""))}),F(b,E)};q($,b=>{s(f)||b(h)})}F(t,S),fe()}var Ri=({selector:t,enable:e})=>{let n=k(Ps()),i=k(js()),r=k(di()),o=ce(0),a={current:()=>{}},l=()=>{if(s(r)&&e()){let f=Us(s(i)).querySelector(`#diff-root${s(n)}`)?.querySelector(t());if(!f)return;let c=f,p=()=>{let x=f?.getBoundingClientRect();oe(o,x?.width??0,!0)};p();let m=()=>{c?.__observeCallback?.delete(p),c?.__observeCallback?.size===0&&(c.__observeInstance?.disconnect(),c.removeAttribute("data-observe"),delete c.__observeCallback,delete c.__observeInstance)};if(c.__observeCallback){c.__observeCallback.add(p),a.current=()=>m();return}c.__observeCallback=new Set,c.__observeCallback.add(p);let g=new ResizeObserver(()=>c?.__observeCallback?.forEach(x=>x()));c.__observeInstance=g,g.observe(c),c.setAttribute("data-observe","height"),a.current=()=>m()}};return ye(()=>(l(),()=>a.current?.())),()=>s(o)};var Hi=({selector:t,wrapper:e,side:n,enable:i})=>{let r=k(Ps()),o=k(js()),a=k(di()),l={current:()=>{}},d=()=>{if(s(a)&&i()){let u=()=>{},c=Us(s(o)).querySelector(`#diff-root${s(r)}`),p=Array.from(c?.querySelectorAll(t())||[]),m=e()?Array.from(c?.querySelectorAll(e())||[]):p;if(p.length===2&&m.length===2){let g=p[0],x=p[1],w=m[0],_=m[1],L=g.getAttribute("data-side")===n()?g:x,y=L,I=()=>{g.style.height="auto",x.style.height="auto";let h=g.getBoundingClientRect(),b=x.getBoundingClientRect(),E=Math.max(h.height,b.height);w.style.height=E+"px",_.style.height=E+"px",w.setAttribute("data-sync-height",String(E)),_.setAttribute("data-sync-height",String(E))};I();let S=()=>{y.__observeCallback?.delete(I),y.__observeCallback?.size===0&&(y.__observeInstance?.disconnect(),L.removeAttribute("data-observe"),delete y.__observeCallback,delete y.__observeInstance)};if(y.__observeCallback){y.__observeCallback.add(I),u=S;return}y.__observeCallback=new Set,y.__observeCallback.add(I);let $=new ResizeObserver(()=>y.__observeCallback?.forEach(h=>h()));y.__observeInstance=$,$.observe(L),L.setAttribute("data-observe","height"),u=S}l.current=u}};ye(()=>(d(),()=>l.current?.()))};var Qm=new Set(["$$slots","$$events","$$legacy"]),eg=B('<td><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!></div></td>'),tg=B("<td><div></div></td>"),ng=B('<tr data-state="extend" class="diff-line diff-line-extend"><!></tr>');function Fl(t,e){de(e,!0);let n=ue(e,Qm),i=ce(null),r=k(Jr()),o=k(Qr()),a=k(()=>`div[data-line="${e.lineNumber}-extend-content"]`),l=k(()=>`tr[data-line="${e.lineNumber}-extend"]`),d=k(()=>e.side===O.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),u=k(()=>e.diffFile.getSplitLeftLine(e.index)),f=k(()=>e.diffFile.getSplitRightLine(e.index)),c=k(()=>e.diffFile.getExpandEnabled()),p=k(()=>s(r)?.oldFile?.[s(u)?.lineNumber||""]),m=k(()=>s(r)?.newFile?.[s(f)?.lineNumber||""]),g=k(()=>e.side===O.old?s(u):s(f)),x=k(()=>s(g)?.isHidden),w=k(()=>e.side===O.old?s(p):s(m)),_=k(()=>e.side===O.old?s(u)?.lineNumber:s(f)?.lineNumber),L=k(()=>!!((s(p)||s(m))&&(!s(x)||s(c))&&s(o))),y=k(()=>(e.side===O.old?!!s(p):!!s(m))&&s(L)),I=k(()=>O[s(w)?e.side:e.side===O.new?O.old:O.new]);Hi({selector:()=>s(a),wrapper:()=>s(l),side:()=>s(I),enable:()=>!!(s(L)&&s(i))});let S=k(Ri({selector:()=>s(d),enable:()=>!!(s(y)&&s(i))}));var $=pe(),h=ne($);{var b=E=>{var D=ng(),M=C(D);{var W=K=>{var ee=eg();U(ee,"colspan",2);var re=C(ee),Z=C(re);{var A=Y=>{var j=pe(),V=ne(j);Mt(V,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(_)||0,data:s(w)?.data,onUpdate:e.diffFile.notifyAll})),F(Y,j)};q(Z,Y=>{s(S)>0&&Y(A)})}T(re),T(ee),J(()=>{Ne(ee,1,`diff-line-extend-${O[e.side]}-content p-0`),U(re,"data-line",`${e.lineNumber}-extend-content`),U(re,"data-side",O[e.side]),G(re,` width: ${s(S)}px `)}),F(K,ee)},P=K=>{var ee=tg();U(ee,"colspan",2);var re=C(ee);T(ee),J(()=>{Ne(ee,1,`diff-line-extend-${O[e.side]}-placeholder select-none p-0`),G(ee,` background-color: var(${Jt})`),U(re,"data-line",`${e.lineNumber}-extend-content`),U(re,"data-side",O[e.side])}),F(K,ee)};q(M,K=>{s(o)&&s(w)?K(W):K(P,-1)})}T(D),lt(D,()=>K=>oe(i,K,!0)),J(()=>{U(D,"data-line",`${e.lineNumber}-extend`),U(D,"data-side",O[e.side])}),F(E,D)};q(h,E=>{s(L)&&E(b)})}F(t,$),fe()}var ig=new Set(["$$slots","$$events","$$legacy"]),rg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),og=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),sg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),ag=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),lg=B('<div class="min-h-[28px]">&ensp;</div>'),dg=B('<td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td> <td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td>',1),fg=B('<td class="diff-line-hunk-placeholder select-none"><div class="min-h-[28px]">&ensp;</div></td>'),cg=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><!></tr>');function Dl(t,e){de(e,!0);let n=ue(e,ig),i=ce(null),r=k(()=>e.diffFile.getSplitHunkLine(e.index)),o=k(()=>e.diffFile.getExpandEnabled()),a=k(()=>s(o)&&s(r)?.splitInfo),l=k(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=k(()=>e.side===O.old),u=()=>{let $=s(r);return $&&$.splitInfo&&$.splitInfo.endHiddenIndex-$.splitInfo.startHiddenIndex<je},f=ce(Le(u())),c=()=>{let $=s(r);return $&&$.splitInfo&&$.splitInfo.startHiddenIndex<$.splitInfo.endHiddenIndex},p=ce(Le(c())),m=k(()=>{let $=s(r);return $&&$.isFirst}),g=k(()=>{let $=s(r);return $&&e.diffFile._getIsPureDiffRender()&&!$.splitInfo}),x=k(()=>{let $=s(r);return $&&$.isLast}),w={current:()=>{}};ye(()=>{w.current();let $=()=>{oe(p,c(),!0),oe(f,u(),!0)};$(),w.current=e.diffFile.subscribe($)}),Ve(()=>w.current());let _=k(()=>O[O.old]),L=k(()=>e.side===O.new&&(!!s(p)||s(g)));Hi({selector:()=>s(l),wrapper:()=>s(l),side:()=>s(_),enable:()=>!!(s(L)&&s(i))});var y=pe(),I=ne(y);{var S=$=>{var h=cg(),b=C(h);{var E=M=>{var W=dg(),P=ne(W),K=C(P);{var ee=j=>{var V=pe(),H=ne(V);{var he=se=>{var te=rg(),xe=C(te);It(xe,{className:"fill-current"}),T(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(se,te)},ie=se=>{var te=og(),xe=C(te);Tt(xe,{className:"fill-current"}),T(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(se,te)},Q=se=>{var te=sg(),xe=C(te);kn(xe,{className:"fill-current"}),T(te),we("click",te,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(se,te)},ve=se=>{var te=ag(),xe=ne(te),$e=C(xe);Tt($e,{className:"fill-current"}),T(xe);var ge=X(xe,2),ke=C(ge);It(ke,{className:"fill-current"}),T(ge),we("click",xe,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",ge,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(se,te)};q(H,se=>{s(m)?se(he):s(x)?se(ie,1):s(f)?se(Q,2):se(ve,-1)})}F(j,V)},re=j=>{var V=lg();F(j,V)};q(K,j=>{s(a)?j(ee):j(re,-1)})}T(P);var Z=X(P,2),A=C(Z),Y=C(A,!0);T(A),T(Z),J(()=>{G(P,`
					background-color: var(${jn});
					color: var(${ft});
					width: var(${Fe});
					min-width: var(${Fe});
					max-width: var(${Fe});
				`),G(Z,`background-color: var(${dn})`),G(A,`
						color: var(${Pn})
					`),Ce(Y,s(r)?.splitInfo?.plainText||s(r)?.text)}),F(M,W)},D=M=>{var W=fg();U(W,"colspan",2),J(()=>G(W,`background-color: var(${dn})`)),F(M,W)};q(b,M=>{s(d)?M(E):M(D,-1)})}T(h),lt(h,()=>M=>oe(i,M,!0)),J(()=>{U(h,"data-line",`${e.lineNumber}-hunk`),U(h,"data-side",O[e.side]),G(h,`background-color: var(${dn})`)}),F($,h)};q(I,$=>{(s(p)||s(g))&&$(S)})}F(t,y),fe()}rt(["click"]);var ug=new Set(["$$slots","$$events","$$legacy"]),pg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),hg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),mg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),gg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),vg=B('<div class="min-h-[28px]">&ensp;</div>'),_g=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[40px] select-none p-[1px]"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Al(t,e){de(e,!0);let n=ue(e,ug),i=ce(null),r=k(()=>e.diffFile.getSplitHunkLine(e.index)),o=k(()=>e.diffFile.getExpandEnabled()),a=k(()=>s(o)&&s(r)?.splitInfo),l=k(()=>`tr[data-line="${e.lineNumber}-hunk"]`),d=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.endHiddenIndex-S.splitInfo.startHiddenIndex<je},u=ce(Le(d())),f=()=>{let S=s(r);return S&&S.splitInfo&&S.splitInfo.startHiddenIndex<S.splitInfo.endHiddenIndex},c=ce(Le(f())),p=k(()=>{let S=s(r);return S&&S.isFirst}),m=k(()=>{let S=s(r);return S&&e.diffFile._getIsPureDiffRender()&&!S.splitInfo}),g=k(()=>{let S=s(r);return S&&S.isLast}),x=k(()=>O[O.old]),w=k(()=>e.side===O.new&&(!!s(c)||s(m))),_={current:()=>{}};ye(()=>{_.current();let S=()=>{oe(c,f(),!0),oe(u,d(),!0)};S(),_.current=e.diffFile.subscribe(S)}),Ve(()=>_.current()),Hi({selector:()=>s(l),wrapper:()=>s(l),side:()=>s(x),enable:()=>!!(s(w)&&s(i))});var L=pe(),y=ne(L);{var I=S=>{var $=_g(),h=C($),b=C(h);{var E=K=>{var ee=pe(),re=ne(ee);{var Z=V=>{var H=pg(),he=C(H);It(he,{className:"fill-current"}),T(H),we("click",H,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(V,H)},A=V=>{var H=hg(),he=C(H);Tt(he,{className:"fill-current"}),T(H),we("click",H,()=>e.diffFile.onSplitHunkExpand("down",e.index)),F(V,H)},Y=V=>{var H=mg(),he=C(H);kn(he,{className:"fill-current"}),T(H),we("click",H,()=>e.diffFile.onSplitHunkExpand("all",e.index)),F(V,H)},j=V=>{var H=gg(),he=ne(H),ie=C(he);Tt(ie,{className:"fill-current"}),T(he);var Q=X(he,2),ve=C(Q);It(ve,{className:"fill-current"}),T(Q),we("click",he,()=>e.diffFile.onSplitHunkExpand("down",e.index)),we("click",Q,()=>e.diffFile.onSplitHunkExpand("up",e.index)),F(V,H)};q(re,V=>{s(p)?V(Z):s(g)?V(A,1):s(u)?V(Y,2):V(j,-1)})}F(K,ee)},D=K=>{var ee=vg();F(K,ee)};q(b,K=>{s(a)?K(E):K(D,-1)})}T(h);var M=X(h),W=C(M),P=C(W,!0);T(W),T(M),T($),lt($,()=>K=>oe(i,K,!0)),J(()=>{U($,"data-line",`${e.lineNumber}-hunk`),U($,"data-side",O[e.side]),G($,`background-color: var(${dn})`),G(h,`
				background-color: var(${jn});
				color: var(${ft});
				width: var(${Fe});
				min-width: var(${Fe});
				max-width: var(${Fe})
			`),G(M,`background-color: var(${dn})`),G(W,`
					color: var(${Pn})
				`),Ce(P,s(r)?.splitInfo?.plainText||s(r)?.text)}),F(S,$)};q(y,S=>{(s(c)||s(m))&&S(I)})}F(t,L),fe()}rt(["click"]);var bg=new Set(["$$slots","$$events","$$legacy"]);function qs(t,e){de(e,!0);let n=ue(e,bg),i=k(Ws());var r=pe(),o=ne(r);{var a=d=>{Dl(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})},l=d=>{Al(d,{get index(){return e.index},get side(){return e.side},get diffFile(){return e.diffFile},get lineNumber(){return e.lineNumber}})};q(o,d=>{s(i)===Pt.SplitGitHub||s(i)===Pt.Split?d(a):d(l,-1)})}F(t,r),fe()}var wg=new Set(["$$slots","$$events","$$legacy"]),xg=B('<td><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!></div></td>'),yg=B("<td><div></div></td>"),$g=B('<tr data-state="widget" class="diff-line diff-line-widget"><!></tr>');function Ml(t,e){de(e,!0);let n=ue(e,wg),i=ce(null),r=k(Xr()),o=k(En()),a=k(()=>e.diffFile.getSplitLeftLine(e.index)),l=k(()=>e.diffFile.getSplitRightLine(e.index)),d=k(()=>!!s(a)?.lineNumber&&s(o)?.side===O.old&&s(o)?.lineNumber===s(a)?.lineNumber),u=k(()=>!!s(l)?.lineNumber&&s(o)?.side===O.new&&s(o)?.lineNumber===s(l)?.lineNumber),f=k(()=>e.side===O.old?s(a):s(l)),c=k(()=>s(f)?.isHidden),p=k(()=>`div[data-line="${e.lineNumber}-widget-content"]`),m=k(()=>`tr[data-line="${e.lineNumber}-widget"]`),g=k(()=>e.side===O.old?".old-diff-table-wrapper":".new-diff-table-wrapper"),x=k(()=>e.side===O.old?s(d):s(u)),w=k(()=>O[s(x)?e.side:e.side===O.old?O.new:O.old]),_=k(()=>(!!s(d)||!!s(u))&&!s(c)&&!!s(r)),L=k(()=>s(x)&&!!s(_)),y=()=>{s(o).side=void 0,s(o).lineNumber=void 0};Hi({selector:()=>s(p),wrapper:()=>s(m),side:()=>s(w),enable:()=>!!(s(_)&&s(i))});let I=k(Ri({selector:()=>s(g),enable:()=>!!(s(L)&&s(i))}));var S=pe(),$=ne(S);{var h=b=>{var E=$g(),D=C(E);{var M=P=>{var K=xg();U(K,"colspan",2);var ee=C(K),re=C(ee);{var Z=A=>{var Y=pe(),j=ne(Y);Mt(j,()=>s(r),()=>({diffFile:e.diffFile,side:e.side,lineNumber:s(f)?.lineNumber||0,onClose:y})),F(A,Y)};q(re,A=>{s(I)>0&&A(Z)})}T(ee),T(K),J(()=>{Ne(K,1,`diff-line-widget-${O[e.side]}-content p-0`),U(ee,"data-line",`${e.lineNumber}-widget-content`),U(ee,"data-side",O[e.side]),G(ee,` width: ${s(I)}px `)}),F(P,K)},W=P=>{var K=yg();U(K,"colspan",2);var ee=C(K);T(K),J(()=>{Ne(K,1,`diff-line-widget-${O[e.side]}-placeholder select-none p-0`),G(K,`background-color: var(${Jt})`),U(ee,"data-line",`${e.lineNumber}-widget-content`),U(ee,"data-side",O[e.side])}),F(P,K)};q(D,P=>{s(x)?P(M):P(W,-1)})}T(E),lt(E,()=>P=>oe(i,P,!0)),J(()=>{U(E,"data-line",`${e.lineNumber}-widget`),U(E,"data-side",O[e.side])}),F(b,E)};q($,b=>{s(_)&&b(h)})}F(t,S),fe()}var Eg=new Set(["$$slots","$$events","$$legacy"]),Lg=B("<!> <!> <!> <!>",1),kg=B('<table><colgroup><col/><col/></colgroup><thead class="hidden"><tr><th scope="col"> </th><th scope="col"> </th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table>');function Ks(t,e){de(e,!0);let n=ue(e,Eg),i=k(()=>e.side===O.new?"new-diff-table":"old-diff-table"),r=()=>ss(e.diffFile),o=ce(Le(r())),a={current:()=>{}},l=e.selectState;ye(()=>{a.current();let $=()=>oe(o,r(),!0);$(),a.current=e.diffFile.subscribe($)}),Ve(()=>a.current());let d=$=>{let h=$.target;if(h&&h?.nodeName==="BUTTON"){Ln();return}let b=ro(h);if(!(b&&b!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let E=h.getAttribute("data-state");if(E){E==="extend"||E==="hunk"||E==="widget"?l.current!==void 0&&(l.current=void 0,e.onSelect?.(void 0),Ln()):l.current!==e.side&&(l.current=n.side,e.onSelect?.(e.side),Ln());return}h=h.parentElement}};var u=kg(),f=C(u),c=C(f),p=X(c);T(f);var m=X(f),g=C(m),x=C(g),w=C(x);T(x);var _=X(x),L=C(_);T(_),T(g),T(m);var y=X(m),I=C(y);li(I,17,()=>s(o),ai,($,h)=>{var b=Lg(),E=ne(b);qs(E,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var D=X(E,2);Cl(D,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=X(D,2);Ml(M,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var W=X(M,2);Fl(W,{get index(){return s(h).index},get side(){return e.side},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),F($,b)});var S=X(I);qs(S,{get side(){return e.side},get index(){return e.diffFile.splitLineLength},get lineNumber(){return e.diffFile.splitLineLength},get diffFile(){return e.diffFile}}),T(y),T(u),J(()=>{Ne(u,1,`${s(i)} w-full border-collapse border-spacing-0`),U(u,"data-mode",O[e.side]),Ne(c,1,`diff-table-${O[e.side]}-num-col`),Ne(p,1,`diff-table-${O[e.side]}-content-col`),Ce(w,`${O[e.side]??""} line number`),Ce(L,`${O[e.side]??""} line content`)}),we("mousedown",y,d),F(t,u),fe()}rt(["mousedown"]);var Sg=new Set(["$$slots","$$events","$$legacy"]),Ng=B('<div class="split-diff-view split-diff-view-normal flex w-full basis-[50%]"><style data-select-style=""></style> <div class="old-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div> <div class="diff-split-line w-[1.5px]"></div> <div class="new-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><!></div></div>');function Rl(t,e){de(e,!0);let n=ue(e,Sg),i=k(di()),r=ce(void 0),o=ce(void 0),a=ce(null),l=k(()=>Math.max(e.diffFile.fileLineLength,e.diffFile.splitLineLength).toString()),d={current:()=>{}},u={current:void 0};ye(()=>{if(d.current(),!s(i))return;let b=s(r),E=s(o);!b||!E||(d.current=ou(b,E))}),Ve(()=>d.current());let c=b=>{let E=s(a);E&&(b?E.textContent=`#${w()} [data-state="extend"] {user-select: none} 
#${w()} [data-state="hunk"] {user-select: none} 
#${w()} [data-state="widget"] {user-select: none}`:E.textContent="")},p=k(Zr()),m=k(()=>({fontSize:`${s(p)||14}px`,fontFamily:"Menlo, Consolas, monospace"})),g=k(io({text:()=>s(l),font:()=>s(m)})),x=k(()=>Math.max(40,s(g)+25)),w=()=>`diff-split-view-${e.diffFile.getId()}`;var _=Ng(),L=C(_);lt(L,()=>b=>oe(a,b,!0));var y=X(L,2),I=C(y);Ks(I,{get side(){return O.old},get diffFile(){return e.diffFile},onSelect:c,get selectState(){return u}}),T(y),lt(y,()=>b=>{oe(r,b,!0)});var S=X(y,2),$=X(S,2),h=C($);Ks(h,{get side(){return O.new},get diffFile(){return e.diffFile},onSelect:c,get selectState(){return u}}),T($),lt($,()=>b=>{oe(o,b,!0)}),T(_),J((b,E)=>{G(y,b),G(S,`background-color: var(${gn})`),G($,E)},[()=>`
      ${Fe}: ${Math.round(s(x))}px;
      overscroll-behavior-x: none;
      font-family: Menlo, Consolas, monospace;
      font-size: var(${nt});
    `,()=>`
			${Fe}: ${Math.round(s(x))}px;
			overscroll-behavior-x: none;
			font-family: Menlo, Consolas, monospace;
			font-size: var(${nt});
		`]),F(t,_),fe()}var Ig=new Set(["$$slots","$$events","$$legacy"]);function Hl(t,e){de(e,!0);let n=ue(e,Ig),i=k($n());var r=pe(),o=ne(r);{var a=d=>{Tl(d,{get diffFile(){return e.diffFile}})},l=d=>{Rl(d,{get diffFile(){return e.diffFile}})};q(o,d=>{s(i)?d(a):d(l,-1)})}F(t,r),fe()}var Tg=new Set(["$$slots","$$events","$$legacy"]),Cg=B('<div class="diff-add-widget-wrapper invisible absolute left-[100%] translate-x-[-50%] select-none transition-transform hover:scale-110 group-hover:visible"><button class="diff-add-widget z-[1] flex h-full w-full origin-center cursor-pointer items-center justify-center rounded-md text-[1.2em]">+</button></div>');function Ko(t,e){de(e,!0);let n=ue(e,Tg);var i=Cg(),r=C(i);T(i),J(()=>{U(i,"data-add-widget",O[e.side]),G(i,`
		width: calc(var(${nt}) * 1.4);
		height: calc(var(${nt}) * 1.4);
		top: calc(var(${nt}) * 0.1);
	`),G(r,`
			color: var(${Gs});
			background-color: var(${zs});
		`)}),we("mousedown",r,o=>{o.stopPropagation(),e.onOpenAddWidget(e.lineNumber,e.side),e.onWidgetClick?.(e.lineNumber,e.side)}),F(t,i),fe()}rt(["mousedown"]);var Fg=new Set(["$$slots","$$events","$$legacy"]),Dg=B('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"></span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),Ag=B('<tr data-state="diff" class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex"><span class="inline-block w-[50%]"></span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>'),Mg=B("<!> <!>",1),Rg=B('<tr class="diff-line group"><td class="diff-line-num sticky left-0 z-[1] w-[1%] min-w-[100px] select-none whitespace-nowrap pl-[10px] pr-[10px] text-right align-top"><!> <div class="flex opacity-[0.5]"><span class="inline-block w-[50%]"> </span> <span class="w-[10px] shrink-0"></span> <span class="inline-block w-[50%]"> </span></div></td><td class="diff-line-content pr-[10px] align-top"><!></td></tr>');function Ol(t,e){de(e,!0);let n=ue(e,Fg),i=k(()=>e.diffFile.getUnifiedLine(e.index)),r=k($n()),o=k(En()),a=k(eo()),l=k(to()),d=k(no()),u=k(()=>s(i)?.isHidden),f=k(()=>Xi(s(i)?.diff)),c=()=>s(i)?.newLineNumber?e.diffFile.getNewSyntaxLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldSyntaxLine(s(i)?.oldLineNumber||0):void 0,p=ce(Le(c())),m=()=>s(i)?.newLineNumber?e.diffFile.getNewPlainLine(s(i)?.newLineNumber||0):s(i)?.oldLineNumber?e.diffFile.getOldPlainLine(s(i)?.oldLineNumber||0):void 0,g=ce(Le(m())),x={current:()=>{}};ye(()=>{x?.current?.();let I=()=>{oe(p,c(),!0),oe(g,m(),!0)};I(),x.current=e.diffFile.subscribe(I)}),Ve(()=>x.current());let w=(I,S)=>{s(o).side=S,s(o).lineNumber=I};var _=pe(),L=ne(_);{var y=I=>{var S=pe(),$=ne(S);{var h=E=>{let D=(Z,A=ht)=>{var Y=Dg(),j=C(Y),V=C(j);{var H=te=>{{let xe=k(()=>A().index-1);Ko(te,{get index(){return s(xe)},get lineNumber(){return A().lineNumber},get diffFile(){return A().diffFile},get side(){return O.old},get onWidgetClick(){return A().onAddWidgetClick},get onOpenAddWidget(){return A().onOpenAddWidget}})}};q(V,te=>{A().enableAddWidget&&te(H)})}var he=X(V,2),ie=C(he),Q=C(ie,!0);T(ie),Ji(4),T(he),T(j);var ve=X(j),se=C(ve);fi(se,{get enableWrap(){return A().enableWrap},get diffFile(){return A().diffFile},get enableHighlight(){return A().enableHighlight},get rawLine(){return A().rawLine},get diffLine(){return A().diffLine},get plainLine(){return A().plainLine},get syntaxLine(){return A().syntaxLine}}),T(ve),T(Y),J(()=>{U(Y,"data-line",A().index),G(j,`
          color: var(${ft});
          background-color: var(${xl});
          width: calc(calc(var(${Fe}) + 5px) * 2);
          max-width: calc(calc(var(${Fe}) + 5px) * 2);
          min-width: calc(calc(var(${Fe}) + 5px) * 2);
        `),U(ie,"data-line-old-num",A().lineNumber),Ce(Q,A().lineNumber),G(ve,`background-color: var(${bl}) `)}),F(Z,Y)},M=(Z,A=ht)=>{var Y=Ag(),j=C(Y),V=C(j);{var H=te=>{{let xe=k(()=>A().index-1);Ko(te,{get index(){return s(xe)},get lineNumber(){return A().lineNumber},get diffFile(){return A().diffFile},get side(){return O.new},get onWidgetClick(){return A().onAddWidgetClick},get onOpenAddWidget(){return A().onOpenAddWidget}})}};q(V,te=>{A().enableAddWidget&&te(H)})}var he=X(V,2),ie=X(C(he),4),Q=C(ie,!0);T(ie),T(he),T(j);var ve=X(j),se=C(ve);fi(se,{get enableWrap(){return A().enableWrap},get diffFile(){return A().diffFile},get enableHighlight(){return A().enableHighlight},get rawLine(){return A().rawLine},get diffLine(){return A().diffLine},get plainLine(){return A().plainLine},get syntaxLine(){return A().syntaxLine}}),T(ve),T(Y),J(()=>{U(Y,"data-line",A().index),G(j,`
          color: var(${ft});
          background-color: var(${wl});
          width: calc(calc(var(${Fe}) + 5px) * 2);
          max-width: calc(calc(var(${Fe}) + 5px) * 2);
          min-width: calc(calc(var(${Fe}) + 5px) * 2);
        `),U(ie,"data-line-new-num",A().lineNumber),Ce(Q,A().lineNumber),G(ve,` background-color: var(${_l}) `)}),F(Z,Y)};var W=Mg(),P=ne(W);{var K=Z=>{D(Z,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(l),enableAddWidget:s(d),lineNumber:s(i).oldLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:s(a)}))};q(P,Z=>{s(i).oldLineNumber&&Z(K)})}var ee=X(P,2);{var re=Z=>{M(Z,()=>({index:e.lineNumber,enableWrap:s(r),diffFile:e.diffFile,rawLine:s(i)?.value||"",diffLine:s(i)?.diff,plainLine:s(g),syntaxLine:s(p),enableHighlight:s(l),enableAddWidget:s(d),lineNumber:s(i).newLineNumber||0,onOpenAddWidget:w,onAddWidgetClick:s(a)}))};q(ee,Z=>{s(i).newLineNumber&&Z(re)})}F(E,W)},b=E=>{var D=Rg(),M=C(D),W=C(M);{var P=V=>{{let H=k(()=>s(i)?.newLineNumber||0);Ko(V,{get index(){return e.index},get diffFile(){return e.diffFile},get lineNumber(){return s(H)},get side(){return O.new},onOpenAddWidget:w,get onWidgetClick(){return s(a)}})}};q(W,V=>{s(d)&&s(i)?.diff&&V(P)})}var K=X(W,2),ee=C(K),re=C(ee,!0);T(ee);var Z=X(ee,4),A=C(Z,!0);T(Z),T(K),T(M);var Y=X(M),j=C(Y);{let V=k(()=>!!s(r)),H=k(()=>!!s(l)),he=k(()=>s(i)?.value||""),ie=k(()=>s(i)?.diff);fi(j,{get enableWrap(){return s(V)},get diffFile(){return e.diffFile},get enableHighlight(){return s(H)},get rawLine(){return s(he)},get diffLine(){return s(ie)},get plainLine(){return s(g)},get syntaxLine(){return s(p)}})}T(Y),T(D),J(()=>{U(D,"data-line",e.lineNumber),U(D,"data-state",s(i)?.diff?"diff":"plain"),G(M,`
					color: var(${s(i)?.diff?ft:ur});
					background-color: ${s(i)?.diff?`var(${$l})`:`var(${Vs})`};
					width: calc(calc(var(${Fe}) + 5px) * 2);
					max-width: calc(calc(var(${Fe}) + 5px) * 2);
					min-width: calc(calc(var(${Fe}) + 5px) * 2;
				`),U(ee,"data-line-old-num",s(i)?.oldLineNumber||0),Ce(re,s(i)?.oldLineNumber||0),U(Z,"data-line-new-num",s(i)?.newLineNumber||0),Ce(A,s(i)?.newLineNumber||0),G(Y,`
					background-color: ${s(i)?.diff?`var(${yl})`:`var(${Vs})`}
				`)}),F(E,D)};q($,E=>{s(f)?E(h):E(b,-1)})}F(I,S)};q(L,I=>{s(u)||I(y)})}F(t,_),fe()}var Hg=new Set(["$$slots","$$events","$$legacy"]),Og=B('<tr data-state="extend" class="diff-line diff-line-extend"><td class="diff-line-extend-content p-0 align-top"><div class="diff-line-extend-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Bl(t,e){de(e,!0);let n=ue(e,Hg),i=k(Jr()),r=k($n()),o=k(Qr()),a=k(()=>e.diffFile.getUnifiedLine(e.index)),l=k(()=>s(i)?.oldFile?.[s(a)?.oldLineNumber||-1]),d=k(()=>s(i)?.newFile?.[s(a)?.newLineNumber||-1]),u=k(()=>s(a).isHidden),f=k(()=>!!((s(l)||s(d))&&s(u)&&s(o))),c=k(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>s(f)}));var p=pe(),m=ne(p);{var g=x=>{var w=Og(),_=C(w);U(_,"colspan",2);var L=C(_),y=C(L);{var I=h=>{var b=pe(),E=ne(b);Mt(E,()=>s(o),()=>({diffFile:e.diffFile,side:O.old,data:s(l)?.data,lineNumber:s(a)?.oldLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),F(h,b)};q(y,h=>{(s(r)||s(c)>0)&&s(l)&&s(o)&&h(I)})}var S=X(y,2);{var $=h=>{var b=pe(),E=ne(b);Mt(E,()=>s(o),()=>({diffFile:e.diffFile,side:O.new,data:s(d)?.data,lineNumber:s(a)?.newLineNumber||0,onUpdate:()=>e.diffFile.notifyAll()})),F(h,b)};q(S,h=>{(s(r)||s(c)>0)&&s(d)&&s(o)&&h($)})}T(L),T(_),T(w),J(()=>{U(w,"data-line",`${e.lineNumber}-extend`),G(L,`width: ${s(c)}px `)}),F(x,w)};q(m,x=>{s(f)&&x(g)})}F(t,p),fe()}var Bg=new Set(["$$slots","$$events","$$legacy"]),Pg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Up" data-title="Expand Up"><!></button>'),jg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand Down" data-title="Expand Down"><!></button>'),Wg=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[6px]" title="Expand All" data-title="Expand All"><!></button>'),Ug=B('<button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Down" data-title="Expand Down"><!></button> <button class="diff-widget-tooltip flex w-full cursor-pointer items-center justify-center rounded-[2px] py-[2px]" title="Expand Up" data-title="Expand Up"><!></button>',1),Vg=B('<div class="min-h-[28px]">&ensp;</div>'),zg=B('<tr data-state="hunk" class="diff-line diff-line-hunk"><td class="diff-line-hunk-action sticky left-0 w-[1%] min-w-[100px] select-none"><!></td><td class="diff-line-hunk-content pr-[10px] align-middle"><div class="pl-[1.5em]"> </div></td></tr>');function Zs(t,e){de(e,!0);let n=ue(e,Bg),i=k(()=>e.diffFile.getUnifiedHunkLine(e.index)),r=k(()=>e.diffFile.getExpandEnabled()),o=k(()=>s(r)&&s(i)&&s(i).unifiedInfo),a=k($n()),l=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.startHiddenIndex<s(i).unifiedInfo.endHiddenIndex,d=ce(Le(l())),u=()=>s(i)&&s(i).unifiedInfo&&s(i).unifiedInfo.endHiddenIndex-s(i).unifiedInfo.startHiddenIndex<je,f=ce(Le(u())),c=k(()=>s(i)&&s(i).isFirst),p=k(()=>s(i)&&s(i).isLast),m=k(()=>s(i)&&e.diffFile._getIsPureDiffRender()&&!s(i).unifiedInfo),g={current:()=>{}};ye(()=>{g?.current?.();let L=()=>{oe(d,l(),!0),oe(f,u(),!0)};L(),g.current=e.diffFile.subscribe(L)}),Ve(()=>g.current());var x=pe(),w=ne(x);{var _=L=>{var y=zg(),I=C(y),S=C(I);{var $=M=>{var W=pe(),P=ne(W);{var K=A=>{var Y=Pg(),j=C(Y);It(j,{className:"fill-current"}),T(Y),we("click",Y,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),F(A,Y)},ee=A=>{var Y=jg(),j=C(Y);Tt(j,{className:"fill-current"}),T(Y),we("click",Y,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),F(A,Y)},re=A=>{var Y=Wg(),j=C(Y);kn(j,{className:"fill-current"}),T(Y),we("click",Y,()=>e.diffFile.onUnifiedHunkExpand("all",e.index)),F(A,Y)},Z=A=>{var Y=Ug(),j=ne(Y),V=C(j);Tt(V,{className:"fill-current"}),T(j);var H=X(j,2),he=C(H);It(he,{className:"fill-current"}),T(H),we("click",j,()=>e.diffFile.onUnifiedHunkExpand("down",e.index)),we("click",H,()=>e.diffFile.onUnifiedHunkExpand("up",e.index)),F(A,Y)};q(P,A=>{s(c)?A(K):s(p)?A(ee,1):s(f)?A(re,2):A(Z,-1)})}F(M,W)},h=M=>{var W=Vg();F(M,W)};q(S,M=>{s(o)?M($):M(h,-1)})}T(I);var b=X(I),E=C(b),D=C(E,!0);T(E),T(b),T(y),J(()=>{U(y,"data-line",`${e.lineNumber}-hunk`),G(I,`
				background-color: var(${jn});
				color: var(${ft});
				width: calc(calc(var(${Fe}) + 5px) * 2);
				max-width: calc(calc(var(${Fe}) + 5px) * 2);
				min-width: calc(calc(var(${Fe}) + 5px) * 2);
			`),G(b,` background-color: var(${dn}) `),G(E,`
					white-space: ${s(a)?"pre-wrap":"pre"};
					word-break: ${s(a)?"break-all":"initial"};
					color: var(${Pn});
				`),Ce(D,s(i)?.unifiedInfo?.plainText||s(i)?.text)}),F(L,y)};q(w,L=>{(s(d)||s(m))&&L(_)})}F(t,x),fe()}rt(["click"]);var Gg=new Set(["$$slots","$$events","$$legacy"]),Yg=B('<tr data-state="widget" class="diff-line diff-line-widget"><td class="diff-line-widget-content p-0"><div class="diff-line-widget-wrapper sticky left-0 z-[1]"><!> <!></div></td></tr>');function Pl(t,e){de(e,!0);let n=ue(e,Gg),i=k(En()),r=k($n()),o=k(Xr()),a=k(()=>e.diffFile.getUnifiedLine(e.index)),l=k(()=>s(a)?.oldLineNumber&&s(i)?.side===O.old&&s(i)?.lineNumber===s(a)?.oldLineNumber),d=k(()=>s(a)?.newLineNumber&&s(i)?.side===O.new&&s(i)?.lineNumber===s(a)?.newLineNumber),u=k(()=>s(a)?.isHidden),f=k(()=>!!((s(l)||s(d))&&!s(u)&&s(o))),c=()=>{s(i).side=void 0,s(i).lineNumber=void 0},p=k(Ri({selector:()=>".unified-diff-table-wrapper",enable:()=>s(f)}));var m=pe(),g=ne(m);{var x=w=>{var _=Yg(),L=C(_);U(L,"colspan",2);var y=C(L),I=C(y);{var S=b=>{var E=pe(),D=ne(E);Mt(D,()=>s(o),()=>({diffFile:e.diffFile,side:O.old,lineNumber:s(a)?.oldLineNumber||0,onClose:c})),F(b,E)};q(I,b=>{(s(r)||s(p)>0)&&s(l)&&b(S)})}var $=X(I,2);{var h=b=>{var E=pe(),D=ne(E);Mt(D,()=>s(o)??ht,()=>({diffFile:e.diffFile,side:O.new,lineNumber:s(a)?.newLineNumber||0,onClose:c})),F(b,E)};q($,b=>{(s(r)||s(p)>0)&&s(d)&&b(h)})}T(y),T(L),T(_),J(()=>{U(_,"data-line",`${e.lineNumber}-widget`),G(y,`width: ${s(p)}px`)}),F(w,_)};q(g,w=>{s(f)&&w(x)})}F(t,m),fe()}var qg=new Set(["$$slots","$$events","$$legacy"]),Kg=B("<!> <!> <!> <!>",1),Zg=B('<div><style data-select-style=""></style> <div class="unified-diff-table-wrapper diff-table-scroll-container w-full overflow-x-auto overflow-y-hidden"><table><colgroup><col class="unified-diff-table-num-col"/><col class="unified-diff-table-content-col"/></colgroup><thead class="hidden"><tr><th scope="col">line number</th><th scope="col">line content</th></tr></thead><tbody class="diff-table-body leading-[1.6]"><!><!></tbody></table></div></div>');function jl(t,e){de(e,!0);let n=ue(e,qg),i=ce(Le(wa(e.diffFile))),r=ce(Le(e.diffFile.unifiedLineLength.toString())),o=ce(null),a=k(Zr()),l=k($n()),d={current:()=>{}},u={current:void 0},f=()=>{let $=e.diffFile;oe(i,wa($),!0),oe(r,$.unifiedLineLength.toString(),!0)};ye(()=>{d.current?.(),f(),d.current=e.diffFile.subscribe(f)}),Ve(()=>d.current());let c=$=>{let h=$.target;if(!s(o))return;if(h&&h?.nodeName==="BUTTON"){Ln();return}let b=ro(h);if(!(b&&b!==`diff-root${e.diffFile.getId()}`))for(;h&&h instanceof HTMLElement;){let E=h.getAttribute("data-state");if(E){E==="extend"||E==="hunk"||E==="widget"?u.current!==!1&&(u.current=!1,s(o).innerHTML="",Ln()):u.current!==!0&&(u.current=!0,s(o).innerHTML=`#${b} [data-state="extend"] {user-select: none} 
#${b} [data-state="hunk"] {user-select: none} 
#${b} [data-state="widget"] {user-select: none}`,Ln());return}h=h.parentElement}},p=k(()=>({fontSize:s(a)+"px",fontFamily:"Menlo, Consolas, monospace"})),m=k(io({text:()=>s(r),font:()=>s(p)})),g=k(()=>Math.max(40,s(m)+10));var x=Zg(),w=C(x);lt(w,()=>$=>oe(o,$,!0));var _=X(w,2),L=C(_),y=X(C(L),2),I=C(y);li(I,17,()=>s(i),ai,($,h)=>{var b=Kg(),E=ne(b);Zs(E,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var D=X(E,2);Ol(D,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var M=X(D,2);Pl(M,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}});var W=X(M,2);Bl(W,{get index(){return s(h).index},get lineNumber(){return s(h).lineNumber},get diffFile(){return e.diffFile}}),F($,b)});var S=X(I);Zs(S,{get index(){return e.diffFile.unifiedLineLength},get lineNumber(){return e.diffFile.unifiedLineLength},get diffFile(){return e.diffFile}}),T(y),T(L),T(_),T(x),J($=>{Ne(x,1,`unified-diff-view ${s(l)?"unified-diff-view-wrap":"unified-diff-view-normal"} w-full`),G(_,$),Ne(L,1,`unified-diff-table w-full border-collapse border-spacing-0 ${s(l)?"table-fixed":""}`)},[()=>`${Fe}: ${Math.round(s(g))}px; font-family: Menlo, Consolas, monospace; font-size: var(${nt})`]),we("mousedown",y,c),F(t,x),fe()}rt(["mousedown"]);var Xg=new Set(["$$slots","$$events","$$legacy"]),Jg=B('<div class="diff-tailwindcss-wrapper" data-component="git-diff-view"><div class="diff-style-root"><div><!></div></div></div>');function Xs(t,e){de(e,!0);let n=ue(e,Xg),i={current:null},o=k(()=>{if(i.current?.clear?.(),e.diffFile){let $=Zi.createInstance({});return $._mergeFullBundle(e.diffFile._getFullBundle()),i.current=$,$}else if(e.data){let $=e.data,h=new Zi($.oldFile?.fileName||"",$.oldFile?.content||"",$.newFile?.fileName||"",$.newFile?.content||"",$.hunks||[],$.oldFile?.fileLang||"",$.newFile?.fileLang||"");return i.current=h,h}return null});ye(()=>{e.onDiffFileCreated?.(s(o))});let l=k(()=>s(o)?.getId?.()),d=Le({side:e.initialWidgetState?.side,lineNumber:e.initialWidgetState?.lineNumber}),u=ce(null),f=k(()=>e.diffViewHighlight??!0),c=k(()=>e.diffViewTheme);ye(()=>{d.side=e.initialWidgetState?.side,d.lineNumber=e.initialWidgetState?.lineNumber}),ye(()=>{(e.data||e.diffFile)&&(d.side=void 0,d.lineNumber=void 0)});let p={current:()=>{}},m=k(di());ye(()=>{p?.current?.(),!(!s(m)||!s(o)||!e.diffFile)&&(e.diffFile._addClonedInstance(s(o)),p.current=()=>e.diffFile?._delClonedInstance(s(o)))}),Ve(()=>p.current()),ye(()=>{!s(o)||!s(m)||(s(o).initTheme(s(c)),s(o).initRaw(),s(o).buildSplitDiffLines(),s(o).buildUnifiedDiffLines())}),ye(()=>{if(!(!s(o)||!s(m))&&(s(c),s(f))){let $=e.registerHighlighter;$?($.name!==s(o)._getHighlighterName()||$.type!==s(o)._getHighlighterType()||$.type!=="class")&&(s(o).initSyntax({registerHighlighter:$}),s(o).notifyAll()):(!s(o)._getIsCloned()&&s(o)._getHighlighterName()!==gr.name||s(o)._getHighlighterType()!=="class")&&(s(o).initSyntax(),s(o).notifyAll())}});let _={current:()=>{}};ye(()=>{if(_?.current?.(),!s(m)||!s(o)||!s(u))return;s(c);let $=()=>{s(u)?.setAttribute("data-theme",s(o)._getTheme()||"light"),s(u)?.setAttribute("data-highlighter",s(o)._getHighlighterName())};$(),_.current=s(o).subscribe($)}),Ve(()=>_.current()),Mc(n),Hc(n),Bc(n),Kc(n),Xc(n),Qc(n),tu(n),iu(n),Yc(d),zc(n),jc(()=>s(o)?.getId()||""),Uc(()=>s(u));var y=pe(),I=ne(y);{var S=$=>{var h=Jg(),b=C(h),E=C(b),D=C(E);{var M=P=>{Hl(P,{get diffFile(){return s(o)}})},W=P=>{jl(P,{get diffFile(){return s(o)}})};q(D,P=>{!e.diffViewMode||e.diffViewMode&Pt.Split?P(M):P(W,-1)})}T(E),T(b),T(h),lt(h,()=>P=>oe(u,P,!0)),J((P,K)=>{U(h,"data-theme",P),U(h,"data-highlighter",K),G(b,`${nt}:${e.diffViewFontSize||14}px`),U(E,"id",s(m)?`diff-root${s(l)}`:void 0),Ne(E,1,"diff-view-wrapper"+(e.class?` ${e.class}`:"")),G(E,e.style)},[()=>s(o)?._getTheme()||"light",()=>s(o)?._getHighlighterName()]),F($,h)};q(I,$=>{s(o)&&$(S)})}F(t,y),fe()}os.name="@git-diff-view/svelte";function hu(t){let e=/[.*+?^${}()|[\]\\]/g;return t.replace(e,"\\$&")}function mu(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(t[n]!==e[n])return!1;return!0}function gu(t){if(!t)return!1;let e=Date.now()-1440*60*1e3;return t*1e3>e}function pr(){let t=N;t.currentSubjectData=null,t.currentItemId=null,t.currentWcode=null,t.currentTags=null,t.currentSeries=null,t.currentCommitMessage=null,t.currentFieldUpdates=null,t.currentTagUpdates=null,t.currentSeriesUpdate=null}var vu={Album:["\u4E2D\u6587\u540D","\u522B\u540D","\u827A\u672F\u5BB6","\u4F5C\u66F2","\u7F16\u66F2","\u4F5C\u8BCD","\u5382\u724C","\u53D1\u552E\u65E5\u671F","\u4EF7\u683C","\u7248\u672C\u7279\u6027","\u64AD\u653E\u65F6\u957F","\u5F55\u97F3","\u789F\u7247\u6570\u91CF","\u94FE\u63A5"],Anime:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u5E74\u5EA6","\u7247\u957F","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","\u5176\u4ED6","Copyright"],Book:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u63D2\u56FE","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u9875\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],BookSeries:["\u4E2D\u6587\u540D","\u522B\u540D","\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u5F00\u59CB","\u7ED3\u675F","\u518C\u6570","\u8BDD\u6570","\u539F\u4F5C","\u94FE\u63A5","\u5176\u4ED6"],Crt:["\u7B80\u4F53\u4E2D\u6587\u540D","\u522B\u540D","\u6027\u522B","\u751F\u65E5","\u8840\u578B","\u8EAB\u9AD8","\u4F53\u91CD","BWH","\u5F15\u7528\u6765\u6E90"],Game:["\u4E2D\u6587\u540D","\u522B\u540D","\u5E73\u53F0","\u6E38\u620F\u7C7B\u578B","\u6E38\u620F\u5F15\u64CE","\u6E38\u73A9\u4EBA\u6570","\u53D1\u884C\u65E5\u671F","\u552E\u4EF7","\u5F00\u53D1","\u53D1\u884C","\u5267\u672C","\u7A0B\u5E8F","website","\u94FE\u63A5"],Manga:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u4F5C\u753B","\u811A\u672C","\u539F\u4F5C","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u518C\u6570","\u9875\u6570","\u8BDD\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],Movie:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u5E74\u5EA6","\u7247\u957F","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","\u5176\u4ED6","Copyright"],Novel:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u63D2\u56FE","\u51FA\u7248\u793E","\u4EF7\u683C","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u518C\u6570","\u9875\u6570","\u8BDD\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],OVA:["\u4E2D\u6587\u540D","\u522B\u540D","\u8BDD\u6570","\u53D1\u552E\u65E5","\u5B98\u65B9\u7F51\u7AD9","\u5F00\u59CB","\u7ED3\u675F","\u94FE\u63A5","\u5176\u4ED6"],PhotoBook:["\u4E2D\u6587\u540D","\u522B\u540D","\u4F5C\u8005","\u6444\u5F71","\u51FA\u7248\u793E","\u4EF7\u683C","\u5176\u4ED6\u51FA\u7248\u793E","\u8FDE\u8F7D\u6742\u5FD7","\u53D1\u552E\u65E5","\u9875\u6570","ISBN","\u94FE\u63A5","\u5176\u4ED6"],TV:["\u4E2D\u6587\u540D","\u522B\u540D","\u96C6\u6570","\u5B63\u6570","\u653E\u9001\u661F\u671F","\u5F00\u59CB","\u7ED3\u675F","\u4E3B\u6F14","\u5BFC\u6F14","\u97F3\u4E50","\u539F\u4F5C","\u5236\u4F5C","\u7C7B\u578B","\u56FD\u5BB6/\u5730\u533A","\u8BED\u8A00","\u6BCF\u96C6\u957F","\u5728\u7EBF\u64AD\u653E\u5E73\u53F0","\u7535\u89C6\u7F51","\u7535\u89C6\u53F0","\u9891\u9053","\u89C6\u9891\u5236\u5F0F","\u97F3\u9891\u5236\u5F0F","\u9996\u64AD\u56FD\u5BB6","\u9996\u64AD\u5730\u533A","\u53F0\u6E7E\u540D\u79F0","\u6E2F\u6FB3\u540D\u79F0","\u9A6C\u65B0\u540D\u79F0","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","imdb_id","tvdb_id"],TVAnime:["\u4E2D\u6587\u540D","\u522B\u540D","\u8BDD\u6570","\u653E\u9001\u5F00\u59CB","\u653E\u9001\u661F\u671F","\u5B98\u65B9\u7F51\u7AD9","\u5728\u7EBF\u64AD\u653E\u5E73\u53F0","\u64AD\u653E\u7535\u89C6\u53F0","\u5176\u4ED6\u7535\u89C6\u53F0","\u64AD\u653E\u7ED3\u675F","\u5BFC\u6F14","\u97F3\u4E50","\u94FE\u63A5","\u5176\u4ED6","Copyright"],doujinBook:["\u4F5C\u8005","\u539F\u4F5C","CP","\u8BED\u8A00","\u9875\u6570","\u5C3A\u5BF8","\u4EF7\u683C","\u53D1\u552E\u65E5"],doujinGame:["\u522B\u540D","\u5F00\u53D1\u8005","\u539F\u4F5C","\u5E73\u53F0","\u6E38\u620F\u7C7B\u578B","\u6E38\u620F\u5F15\u64CE","\u6E38\u73A9\u4EBA\u6570","\u8BED\u8A00","\u4EF7\u683C","\u53D1\u552E\u65E5"],doujinMusic:["\u827A\u672F\u5BB6","\u539F\u4F5C","\u8BED\u8A00","\u7248\u672C\u7279\u6027","\u789F\u7247\u6570\u91CF","\u64AD\u653E\u65F6\u957F","\u4EF7\u683C","\u53D1\u552E\u65E5"],realMovie:["\u4E2D\u6587\u540D","\u522B\u540D","\u4E0A\u6620\u65E5","\u7247\u957F","\u7C7B\u578B","\u56FD\u5BB6/\u5730\u533A","\u8BED\u8A00","\u5B98\u65B9\u7F51\u7AD9","\u94FE\u63A5","imdb_id","tmdb_id","tvdb_id"]},_u={Album:"Album","animanga/Anime":"Anime","animanga/Book":"Book","animanga/BookSeries":"BookSeries",Crt:"Crt",Game:"Game","animanga/Manga":"Manga","animanga/Movie":"Movie","animanga/Novel":"Novel","animanga/OVA":"OVA","Book/PhotoBook":"PhotoBook","real/Television":"TV","animanga/TVAnime":"TVAnime","doujin/Book":"doujinBook","doujin/Game":"doujinGame","doujin/Album":"doujinMusic","real/Movie":"realMovie"};function Qg(){return N.entityType||"subject"}function Wl(){if(!N.currentSubjectData)return!1;let t=Qg(),n=document.getElementById("static-wcode-input").value.replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=(N.currentSubjectData.infobox||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),o=n!==r;if(t==="subject"){let l=document.getElementById("static-tags-input").value.split(" ").filter(m=>m),d=document.getElementById("static-series-checkbox").checked,u=N.currentSubjectData.metaTags||[],f=N.currentSubjectData.series||!1,c=!mu(l,u);return o||c||d!==f}return o}function Oi(){let t=document.querySelector("#static-buttons-container button#process-confirm-update");if(!t)return;Wl()?(t.textContent="\u786E\u8BA4\u66F4\u65B0",t.disabled=!1):(t.textContent="\u786E\u8BA4\u66F4\u65B0\uFF08\u65E0\u5B9E\u8D28\u4FEE\u6539\uFF09",t.disabled=!1)}function oo(t,e,n,i){let r=Object.keys(t||{}),o=[];return r.length&&o.push(`\u66F4\u65B0${r.join("\u3001")}`),(i==="subject"||!i)&&(e?.add.length&&o.push(`\u6DFB\u52A0\u6807\u7B7E${e.add.join("\u3001")}`),e?.remove.length&&o.push(`\u5220\u9664\u6807\u7B7E${e.remove.join("\u3001")}`),n?.hasUpdate&&o.push(n.newValue?"\u6807\u8BB0\u4E3A\u7CFB\u5217":"\u53D6\u6D88\u7CFB\u5217\u6807\u8BB0")),o.filter(a=>a).join("\uFF1B")||"\u66F4\u65B0\u6761\u76EE\u4FE1\u606F"}function Zo(t,e,n){try{let i=(t||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),r=(e||"").replace(/\r\n/g,`
`).replace(/\r/g,`
`),l=Zd("\u7F16\u8F91\u524D",i,"\u7F16\u8F91\u540E",r,"text","text",{context:1});l.init(),l.buildSplitDiffLines();let d=document.getElementById(n);if(!d)return;let u=d._diffViewInstance;u&&Wo(u),d.innerHTML="";let f=Kr(Xs,{target:d,props:{diffFile:l,diffViewMode:N.diffViewMode==="unified"?Pt.Unified:Pt.Split,diffViewFontSize:13,diffViewTheme:"light",diffViewHighlight:!0,diffViewWrap:!0}});d._diffViewInstance=f,n==="static-content-diff-container"&&setTimeout(()=>{let p=document.getElementById("static-wcode-input");p&&(p.style.height="")},0);let c=document.getElementById("diff-error");c&&(c.style.display="none")}catch(i){console.error("Diff generation error:",i);let r=document.getElementById("diff-error");r&&(r.textContent=`\u5DEE\u5F02\u663E\u793A\u9519\u8BEF: ${i.message}`,r.style.display="block")}}function Js(t,e,n){let i=t.join(" "),r=e.join(" ");Zo(i,r,n)}function bu(t,e){let n={};return Object.keys(t).forEach(i=>{if(!["id","tags","series","type"].includes(i.toLowerCase())){let r=t[i];r!==void 0&&(n[i]=r)}}),n}function wu(t,e){if(N.entityType!=="subject")return{add:[],remove:[]};let i=(t.tags||"").split(" ").filter(a=>a),r=[],o=[];return i.forEach(a=>{a.startsWith("-")?o.push(a.slice(1)):r.push(a)}),{add:r,remove:o}}function xu(t,e){if(N.entityType!=="subject")return{hasUpdate:!1};if(t.series===void 0||t.series===null||t.series==="")return{hasUpdate:!1};let n=t.series.trim().toLowerCase(),i=n==="true"||n==="1"||n==="yes";return{hasUpdate:i!==e,newValue:i}}function ev(t){let e=t.match(/{{Infobox\s+(.+?)$/m);return e&&_u[e[1]]||null}function tv(t,e,n){for(let i=1;i<t.length;i++){let r=t[i].match(/^\|([^|=]+?)\s*=/);if(r&&e.indexOf(r[1])>n)return i}return t.length-1}function yu(t,e){let n=ev(t),i=n?vu[n]:null,r=t,o=[];if(Object.entries(e).forEach(([a,l])=>{l=l.replaceAll("\\n",`
`);let d=new RegExp(`\\|${hu(a)}\\s*=.*`,"i");d.test(r)?r=r.replace(d,`|${a}= ${l}`):o.push({field:a,value:l,fieldIdx:i?i.indexOf(a):-1})}),o.length>0){i&&o.sort((l,d)=>l.fieldIdx===-1&&d.fieldIdx===-1?0:l.fieldIdx===-1?1:d.fieldIdx===-1?-1:l.fieldIdx-d.fieldIdx);let a=r.split(`
`);for(let l=o.length-1;l>=0;l--){let d=o[l];i&&d.fieldIdx>=0?a.splice(tv(a,i,d.fieldIdx),0,`|${d.field}= ${d.value}`):a.splice(-1,0,`|${d.field}= ${d.value}`)}r=a.join(`
`)}return r}function $u(t,e){let n=new Set(t);return e.add.forEach(i=>n.add(i)),e.remove.forEach(i=>n.delete(i)),[...n]}var Lu=Xl(Eu());function ku(t,e){try{N.csvData=nv(t),N.currentIndex=0,N.retryCount={},N.previousItem=null,localStorage.setItem("bgmCsvData",JSON.stringify(N.csvData)),localStorage.setItem("bgmCurrentIndex","0"),Bi(),en(e+"\u52A0\u8F7D\u6210\u529F")}catch(n){en("CSV\u89E3\u6790\u9519\u8BEF: "+n.message),console.error(n)}finally{vn(),document.querySelectorAll("#static-buttons-container button").forEach(n=>{n.disabled=!1})}}function Su(t){let n=t.target.files?.[0];if(!n)return;document.querySelectorAll("#static-buttons-container button").forEach(r=>{r.disabled=!0}),Wi("\u6B63\u5728\u89E3\u6790CSV\u6587\u4EF6...");let i=new FileReader;i.onload=function(r){let o=r.target.result;ku(o,"CSV\u6587\u4EF6")},i.readAsText(n)}function Nu(t){document.querySelectorAll("#static-buttons-container button").forEach(e=>{e.disabled=!0}),Wi("\u6B63\u5728\u89E3\u6790\u7C98\u8D34\u7684CSV..."),ku(t,"\u7C98\u8D34\u7684CSV")}function nv(t){let e=Lu.default.parse(t,{header:!0,skipEmptyLines:!0,transform:a=>a.trim()});if(e.errors.length){let a=e.errors[0];throw new Error(`\u7B2C${a.row!==void 0?a.row+1:"?"}\u884C: ${a.message}`)}let n=e.meta.fields;if(!n||n.length===0)throw new Error("CSV\u6587\u4EF6\u4E3A\u7A7A\u6216\u683C\u5F0F\u9519\u8BEF");let i=n.find(a=>/^(person_id|character_id|id)$/i.test(a));if(!i)throw new Error('CSV\u5FC5\u987B\u5305\u542B"id"\u3001"person_id"\u6216"character_id"\u5217');N.entityType="subject",/^person_id$/i.test(i)?N.entityType="person":/^character_id$/i.test(i)&&(N.entityType="character");let r=n.filter(a=>a!==i),o=[];for(let a of e.data){let l=a[i]?.trim();if(!l)continue;let d={id:l};for(let u of r){let f=a[u];f!==void 0&&(d[u]=f.trim())}o.push(d)}if(o.length===0)throw new Error("\u672A\u627E\u5230\u6709\u6548\u7684\u6570\u636E\u884C");return o}function Bi(){N.currentView="setup";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container");document.getElementById("edit-regions").style.display="none",Jl(),t&&(t.innerHTML=`
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
                                \u5728<a href="https://next.bgm.tv/demo/access-token" target="_blank">\u4E2A\u4EBA\u4EE4\u724C\u9875</a>\u83B7\u53D6 Access Token<br>
                                \u9650\u901F\u4E25\u91CD\u53EF\u5207\u6362\u4E3A\u65E7 API
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
                            ${N.csvData?`<div class="csv-loaded-info">\u5DF2\u52A0\u8F7DCSV: ${N.csvData.length} \u6761\u8BB0\u5F55</div>`:""}
                            <p class="csv-hint">
                                \u5FC5\u5907ID\u5217\uFF0C\u6761\u76EEid\uFF0C\u4EBA\u7269person_id\uFF0C\u89D2\u8272character_id<br>
                                tags\u5217\u4F7F\u7528\u7A7A\u683C\u5206\u9694\u6807\u7B7E\uFF0C\u524D\u7F00\u5E26"-"\u7684\u6807\u7B7E\u8868\u793A\u5220\u9664\u8BE5\u6807\u7B7E<br>
                                series\u5217\u4F7F\u7528true\u6216false\u8868\u793A\u662F\u5426\u6807\u8BB0\u4E3A\u7CFB\u5217<br>
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
        `);let n=document.getElementById("setup-access-token");n&&n.addEventListener("input",u=>{N.accessToken=u.target.value,GM_setValue("bgmAccessToken",N.accessToken)});let i=document.getElementById("setup-formhash");i&&i.addEventListener("input",u=>{N.formhash=u.target.value,GM_setValue("bgmFormhash",N.formhash)}),document.querySelectorAll('input[name="submit-method"]').forEach(u=>{u.addEventListener("change",f=>{N.submitMethod=f.target.value,GM_setValue("bgmSubmitMethod",N.submitMethod);let c=document.getElementById("patch-method-options"),p=document.getElementById("post-method-options");c&&c.classList.toggle("hidden",N.submitMethod!=="patch"),p&&p.classList.toggle("hidden",N.submitMethod!=="post")})}),document.querySelectorAll('input[name="diff-view-mode"]').forEach(u=>{u.addEventListener("change",f=>{N.diffViewMode=f.target.value,localStorage.setItem("bgmDiffViewMode",N.diffViewMode)})});let a=document.getElementById("setup-csv-file");a&&(a.addEventListener("change",Su),a.addEventListener("change",()=>{let u=a.files?.[0]?.name||"",f=document.getElementById("setup-csv-file-name");f&&(f.textContent=u)}));let l=document.getElementById("setup-csv-btn");l&&a&&l.addEventListener("click",u=>{u.preventDefault(),a.click()});let d=document.getElementById("setup-paste-csv-btn");d&&d.addEventListener("click",async()=>{try{let u=await navigator.clipboard.readText();if(!u||!u.trim()){en("\u526A\u8D34\u677F\u5185\u5BB9\u4E0D\u662F\u6709\u6548\u7684CSV");return}let f=document.getElementById("setup-csv-file-name");f&&(f.textContent="\u5DF2\u4ECE\u526A\u8D34\u677F\u7C98\u8D34"),Nu(u)}catch(u){en("\u8BFB\u53D6\u526A\u8D34\u677F\u5931\u8D25: "+u.message)}})}function Iu(t){N.currentView="processing";let{currentItem:e,wikiData:n,historyData:i}=t;N.currentSubjectData=n,N.currentItemId=e.id;let r=N.entityType||"subject";N.currentWcode=null,N.currentTags=null,N.currentSeries=null,N.currentCommitMessage=null;let o=document.getElementById("core-content"),a=document.getElementById("static-buttons-container"),l=document.getElementById("edit-regions");l&&(l.style.display="block"),lo(),ji(N.currentIndex,N.totalItems);let d=n.name||"\u672A\u77E5\u540D\u79F0",u=n.infobox||"",f=r==="subject"?n.metaTags||[]:[],c=r==="subject"&&n.series||!1,p=bu(e,u),m=wu(e,f),g=xu(e,c);N.currentFieldUpdates=p,N.currentTagUpdates=m,N.currentSeriesUpdate=g;let x={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"},w=document.getElementById("static-last-update"),_=i[0]?.createdAt,L=_?new Date(_*1e3):null,y=i[0]?.creator?.username||"",I=i[0]?.commitMessage||"",S=gu(_);if(L&&w){let{editPagePath:A}=Pi(r,e.id);w.innerHTML=`
            <a href="${A}" target="_blank">
                \u6700\u540E\u66F4\u65B0: ${L.toLocaleString()} ${y} ${I}
            </a>
        `,w.style.color=S?"#d9534f":"",w.style.display="block"}else w&&(w.style.display="none");let $=document.getElementById("prev-item-link");if($&&N.previousItem&&N.currentIndex>0){let A=N.previousItem.type,{editPagePath:Y}=Pi(A,N.previousItem.id);$.innerHTML=`
            <i class="fas fa-arrow-left"></i> \u4E0A\u4E00\u4E2A:
            <a href="${Y}" target="_blank">
                ${N.previousItem.name}\uFF08${N.previousItem.id}\uFF09
            </a>
        `,$.style.display="block"}else $&&($.style.display="none");let h=document.getElementById("static-commit-input"),b=document.getElementById("static-lock-commit"),E=oo(p,m,g,r);h.value=N.isCommitMessageLocked?N.lockedCommitMessage:E,b.innerHTML=`<i class="fas ${N.isCommitMessageLocked?"fa-lock":"fa-lock-open"}"></i>`,b.title=N.isCommitMessageLocked?"\u89E3\u9501\u7F16\u8F91\u6458\u8981":"\u56FA\u5B9A\u7F16\u8F91\u6458\u8981";let D=document.getElementById("static-wcode-input"),M=document.getElementById("static-content-diff-container"),W=yu(u,p);D.value=W,Zo(u,W,"static-content-diff-container"),M&&(M.style.display="block");let P=document.getElementById("static-tags-area"),K=document.getElementById("static-tags-diff-section");if(r==="subject"){let A=document.getElementById("static-tags-input"),Y=$u(f,m);A.value=Y.join(" "),Js(f,Y,"static-tags-diff-container"),P&&(P.style.display="block"),K&&(K.style.display="block")}else P&&(P.style.display="none"),K&&(K.style.display="none");let ee=document.getElementById("static-series-area");if(r==="subject"){let A=document.getElementById("static-series-checkbox"),Y=g.hasUpdate?g.newValue:c;A.checked=Y,N.currentSeries=Y,ee&&(ee.style.display="block")}else ee&&(ee.style.display="none");let re=Pi(r,e.id).editPagePath.replace("/edit",""),Z=x[r]||"\u6761\u76EE";o&&(o.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${Z}\uFF1A<a href="${re}" target="_blank">${d}</a>\uFF08${e.id}\uFF09[${Z}]
                </div>
            </div>
        `),a&&(a.innerHTML=`
            <button id="process-skip-update" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-confirm-update" class="primary">\u786E\u8BA4\u66F4\u65B0</button>
        `),Oi()}function Tu(t,e){N.currentView="processing";let n=document.getElementById("core-content"),i=document.getElementById("static-buttons-container"),r=document.getElementById("edit-regions");r&&(r.style.display="none"),lo(),ji(N.currentIndex,N.totalItems);let o=t.id,l={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[N.entityType]||"\u6761\u76EE",d=(N.retryCount[o]||0)+1;N.retryCount[o]=d,n&&(n.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${l}\uFF1A<a href="https://bgm.tv/${N.entityType}/${o}" target="_blank">\u67E5\u770B${l}</a>\uFF08${o}\uFF09
                </div>
                <div class="status-box error">
                    \u65E0\u6CD5\u83B7\u53D6${l}\u4FE1\u606F: ${e}
                    ${d>1?`<br>\u5DF2\u91CD\u8BD5 ${d-1} \u6B21`:""}
                </div>
                <p>\u662F\u5426\u7EE7\u7EED\u5904\u7406\uFF1F</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${N.currentIndex/N.totalItems*100}%"></div>
                </div>
            </div>
        `),i&&(i.innerHTML=`
            <button id="process-skip-error" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-error" class="primary">\u91CD\u8BD5</button>
        `)}function Cu(t){N.currentView="processing";let e=document.getElementById("core-content"),n=document.getElementById("static-buttons-container"),i=document.getElementById("edit-regions");i&&(i.style.display="none"),lo(),ji(N.currentIndex,N.totalItems);let r=N.currentItemId||"",o=(N.retryCount[r]||0)+1;N.retryCount[r]=o;let l=N.currentSubjectData?.name||"\u672A\u77E5\u540D\u79F0",u={subject:"\u6761\u76EE",character:"\u89D2\u8272",person:"\u4EBA\u7269"}[N.entityType]||"\u6761\u76EE";e&&(e.innerHTML=`
            <div>
                <div class="item-info">
                    \u5F53\u524D${u}\uFF1A<a href="https://bgm.tv/${N.entityType}/${r}" target="_blank">${l}</a>\uFF08${r}\uFF09
                </div>
                <div class="status-box error">
                    \u63D0\u4EA4\u66F4\u65B0\u5931\u8D25: ${t}
                </div>
                <p>\u662F\u5426\u91CD\u8BD5\u66F4\u65B0\uFF1F</p>
            </div>
        `),n&&(n.innerHTML=`
            <button id="process-skip-update-fail" class="secondary">\u8DF3\u8FC7</button>
            <button id="process-retry-update" class="primary">\u91CD\u8BD5</button>
        `)}function Fu(){N.currentView="completed";let t=document.getElementById("core-content"),e=document.getElementById("static-buttons-container"),n=document.getElementById("edit-regions");n&&(n.style.display="none"),lo(),ji(N.totalItems,N.totalItems),t&&(t.innerHTML=`
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
        `)}function iv(t){let e=t.trim();if(!e)return new Headers;let n=e.split(`\r
`).map(i=>{let r=i.split(":");return[r[0].trim(),r[1].trim()]});return new Headers(n)}function rv(t,e){let n=iv(e.responseHeaders),i=typeof e.response=="string"?new Blob([e.response],{type:n.get("Content-Type")||"text/plain"}):e.response;return new zl(i,{statusCode:e.status,statusText:e.statusText,headers:n,finalUrl:e.finalUrl,redirected:e.finalUrl===t.url})}var zl=class t{constructor(e,n){this.rawBody=e,this.init=n,this.body=e.stream();let{headers:i,statusCode:r,statusText:o,finalUrl:a,redirected:l}=n;this.headers=i,this.status=r,this.statusText=o,this.url=a,this.type="basic",this.redirected=l,this._bodyUsed=!1}get bodyUsed(){return this._bodyUsed}get ok(){return this.status<300}arrayBuffer(){if(this.bodyUsed)throw new TypeError("Failed to execute 'arrayBuffer' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.arrayBuffer()}blob(){if(this.bodyUsed)throw new TypeError("Failed to execute 'blob' on 'Response': body stream already read");return this._bodyUsed=!0,Promise.resolve(this.rawBody.slice(0,this.rawBody.size,this.rawBody.type))}clone(){if(this.bodyUsed)throw new TypeError("Failed to execute 'clone' on 'Response': body stream already read");return new t(this.rawBody,this.init)}formData(){if(this.bodyUsed)throw new TypeError("Failed to execute 'formData' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text().then(ov)}async json(){if(this.bodyUsed)throw new TypeError("Failed to execute 'json' on 'Response': body stream already read");return this._bodyUsed=!0,JSON.parse(await this.rawBody.text())}text(){if(this.bodyUsed)throw new TypeError("Failed to execute 'text' on 'Response': body stream already read");return this._bodyUsed=!0,this.rawBody.text()}async bytes(){if(this.bodyUsed)throw new TypeError("Failed to execute 'bytes' on 'Response': body stream already read");return this._bodyUsed=!0,new Uint8Array(await this.rawBody.arrayBuffer())}};function ov(t){let e=new FormData;return t.trim().split("&").forEach(function(n){if(n){let i=n.split("="),r=i.shift()?.replace(/\+/g," "),o=i.join("=").replace(/\+/g," ");e.append(decodeURIComponent(r),decodeURIComponent(o))}}),e}async function Qs(t,e){let n=new Request(t,e),i;return e?.body&&(i=await n.text()),await sv(n,e,i)}function sv(t,e,n){return new Promise((i,r)=>{if(t.signal&&t.signal.aborted)return r(new DOMException("Aborted","AbortError"));GM.xmlHttpRequest({url:t.url,method:dv(t.method.toUpperCase()),headers:Object.fromEntries(new Headers(e?.headers).entries()),data:n,responseType:"blob",onload(o){try{i(rv(t,o))}catch(a){r(a)}},onabort(){r(new DOMException("Aborted","AbortError"))},ontimeout(){r(new TypeError("Network request failed, timeout"))},onerror(o){r(new TypeError("Failed to fetch: "+o.finalUrl))}})})}var av=["GET","POST","PUT","DELETE","PATCH","HEAD","TRACE","OPTIONS","CONNECT"];function lv(t,e){return t.includes(e)}function dv(t){if(lv(av,t))return t;throw new Error(`unsupported http method ${t}`)}function Du(){if(N.submitMethod==="patch"&&!N.accessToken){en("\u8BF7\u8F93\u5165Access Token");return}if(N.submitMethod==="post"&&!N.formhash){en("\u8BF7\u8F93\u5165Formhash");return}if(!N.csvData||N.csvData.length===0){en("\u8BF7\u4E0A\u4F20\u6709\u6548\u7684CSV\u6587\u4EF6");return}N.totalItems=N.csvData.length,N.processing=!0,N.paused=!1;let t=document.getElementById("core-content");t&&(t.innerHTML=`
            <div>
                <div class="item-info">\u51C6\u5907\u5904\u7406\u7B2C\u4E00\u4E2A\u6761\u76EE...</div>
            </div>
        `);let e=document.getElementById("static-buttons-container");e&&(e.innerHTML=`
            <button id="process-cancel" class="danger">\u53D6\u6D88</button>
        `),ci()}function ci(t=!1){if(N.paused||!N.processing)return;if(N.currentIndex>=N.totalItems){Fu();return}let e=N.csvData[N.currentIndex],n=N.entityType||"subject";t||ji(N.currentIndex,N.totalItems),document.querySelectorAll("#static-buttons-container button").forEach(a=>{a.disabled=!0}),Wi("\u6B63\u5728\u83B7\u53D6\u6761\u76EE\u4FE1\u606F...");let{wikiPath:i,historyPath:r}=Pi(n,e.id),o=N.submitMethod==="patch"?{Authorization:`Bearer ${N.accessToken}`,Accept:"application/json"}:{Accept:"application/json"};Promise.all([Qs(i,{headers:o}),Qs(r,{headers:o})]).then(async([a,l])=>{if(!a.ok)throw new Error(`HTTP ${a.status}`);if(!l.ok)throw new Error(`HTTP ${l.status}`);let d=await a.json(),u=await l.json();return{currentItem:e,wikiData:d,historyData:u}}).then(a=>{N.retryCount[a.currentItem.id]=0,vn(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Iu(a)}).catch(a=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(l=>{l.disabled=!1}),Tu(e,a.message)})}function Au(t,e,n,i,r,o,a,l,d){N.processing=!0;let u=N.entityType||"subject";if(N.submitMethod==="patch"){let{wikiPath:f,patchBodyKey:c}=Pi(u,t),p={commitMessage:a};u==="subject"?p.subject={infobox:e,metaTags:n,series:i}:p[c]={infobox:e},Qs(f,{method:"PATCH",headers:{Authorization:`Bearer ${N.accessToken}`,"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(p)}).then(m=>m.ok?m:m.text().then(g=>{throw new Error(`HTTP ${m.status} - ${g||"\u66F4\u65B0\u5931\u8D25"}`)})).then(()=>{vn(),l()}).catch(m=>{d(m instanceof Error?m:new Error(String(m)))})}else{let f=e.replace(/\n/g,`\r
`),c=new FormData;if(c.append("formhash",N.formhash),c.append("editSummary",a),u==="subject")c.append("subject_title",N.currentSubjectData?.name||""),c.append("platform",N.currentSubjectData?.platform||""),c.append("subject_infobox",f),c.append("subject_summary",N.currentSubjectData?.summary||""),c.append("subject_meta_tags",n.join(" ")),c.append("series",i?"1":"0"),c.append("submit","\u63D0\u4EA4");else if(u==="person"){c.append("crt_name",N.currentSubjectData?.name||""),c.append("crt_infobox",f),c.append("crt_summary",N.currentSubjectData?.summary||"");let g=N.currentSubjectData?.profession;if(g)for(let[x,w]of Object.entries(g))w&&c.append(`prsn_pro[${x}]`,"1");c.append("picfile",""),c.append("submit","\u6539\u597D\u4E86")}else c.append("crt_name",N.currentSubjectData?.name||""),c.append("crt_infobox",f),c.append("crt_summary",N.currentSubjectData?.summary||""),c.append("picfile",""),c.append("submit","\u6539\u597D\u4E86");let p=new URLSearchParams;c.forEach((g,x)=>{p.append(x,g)});let m=u==="subject"?`https://bgm.tv/subject/${t}/new_revision`:`https://bgm.tv/${u}/${t}/edit`;GM.xmlHttpRequest({method:"POST",url:m,data:p.toString(),headers:{"Content-Type":"application/x-www-form-urlencoded"},onload:function(g){vn(),g.finalUrl===m?d(new Error("\u66F4\u65B0\u5931\u8D25\uFF0C\u53EF\u80FD\u662Fformhash\u65E0\u6548\u6216\u6743\u9650\u4E0D\u8DB3")):l()},onerror:function(g){vn(),d(new Error(`\u7F51\u7EDC\u9519\u8BEF: ${g.message}`))},onabort:function(){vn(),d(new Error("\u8BF7\u6C42\u5DF2\u4E2D\u6B62"))},ontimeout:function(){vn(),d(new Error("\u8BF7\u6C42\u8D85\u65F6"))}})}}function Mu(t){switch(t){case"setup-start-processing":Du();break;case"setup-reset-progress":N.currentIndex=0,N.retryCount={},N.previousItem=null,localStorage.setItem("bgmCurrentIndex","0"),Bi();break}}function Ru(t){if(!N.csvData)return;let e=N.csvData[N.currentIndex],n=N.currentSubjectData,i=e?.id||N.currentItemId||"",r=n?.name||"\u672A\u77E5\u540D\u79F0",o=N.entityType||"subject";function a(){return{id:i,name:r,type:o}}switch(t){case"process-confirm-update":{let l=document.getElementById("static-wcode-input").value,d=o==="subject"?document.getElementById("static-tags-input").value.split(" ").filter(p=>p):[],u=o==="subject"?document.getElementById("static-series-checkbox").checked:!1,f=document.getElementById("static-commit-input").value||oo(N.currentFieldUpdates,N.currentTagUpdates,N.currentSeriesUpdate,o);if(!Wl()){en("\u6CA1\u6709\u68C0\u6D4B\u5230\u5B9E\u8D28\u4FEE\u6539\uFF0C\u5DF2\u8DF3\u8FC7\u66F4\u65B0"),N.previousItem=a(),N.currentIndex++,pr(),zn(),ci();return}document.querySelectorAll("#static-buttons-container button").forEach(p=>{p.disabled=!0}),Wi("\u6B63\u5728\u63D0\u4EA4\u66F4\u65B0..."),Au(i,l,d,u,r,e,f,()=>{N.previousItem=a(),N.currentIndex++,pr(),zn(),ci()},p=>{vn(),document.querySelectorAll("#static-buttons-container button").forEach(m=>{m.disabled=!1}),Cu(p.message)});break}case"process-skip-update":N.previousItem=a(),N.currentIndex++,pr(),zn(),ci();break;case"process-confirm-continue":N.previousItem=a(),N.currentIndex++,pr(),zn(),ci();break;case"process-skip-error":N.currentIndex++,pr(),zn(),ci();break;case"process-retry-error":{let l=N.retryCount[i]||0;en(`\u6B63\u5728\u91CD\u8BD5\uFF08${l}\u6B21\uFF09...`),ci();break}case"process-skip-update-fail":N.previousItem=a(),N.currentIndex++,pr(),zn(),ci();break;case"process-retry-update":{let l=N.retryCount[i]||0;en(`\u6B63\u5728\u91CD\u8BD5\uFF08${l}\u6B21\uFF09...`),ci(!0);break}}}function Hu(t){t==="completed-back-to-setup"&&(Bi(),fv())}function fv(){let t=document.getElementById("bgm-tool-progress");t&&(t.style.display="none")}function Ou(){let t=document.getElementById("bgm-float-button");return t||(t=document.createElement("div"),t.id="bgm-float-button",t.innerHTML='<i class="fas fa-tools"></i>',document.body.appendChild(t),t.addEventListener("click",()=>{let e=document.getElementById("bgm-tool-container");e&&(e.style.display="flex",t&&(t.style.display="none"))})),t}function Bu(){let t=Ou();if(t.style.display="none",document.getElementById("bgm-tool-container")){document.getElementById("bgm-tool-container").style.display="flex";return}let e=document.createElement("div");e.id="bgm-tool-container",e.innerHTML=`
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
    `,document.body.appendChild(e),cv();let n=document.getElementById("bgm-tool-close");n&&n.addEventListener("click",()=>{e.style.display="none";let r=Ou();r.style.display="flex",Ql(),zn()});let i=document.getElementById("bgm-tool-settings");i&&i.addEventListener("click",()=>{Bi()}),uv(),Bi()}function cv(){let t=document.getElementById("static-buttons-container");t&&t.addEventListener("click",e=>{let n=e.target.closest("button");if(!n)return;let i=n.id;switch(N.currentView){case"setup":Mu(i);break;case"processing":Ru(i);break;case"completed":Hu(i);break}})}function uv(){document.getElementById("static-commit-input").addEventListener("input",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentCommitMessage=o.target.value,Oi())});let e=document.getElementById("static-lock-commit");e.addEventListener("click",()=>{if(N.currentView!=="processing"||!N.currentSubjectData)return;N.isCommitMessageLocked=!N.isCommitMessageLocked;let o=document.getElementById("static-commit-input");N.isCommitMessageLocked?(N.lockedCommitMessage=o.value,e.innerHTML='<i class="fas fa-lock"></i>',e.title="\u89E3\u9501\u7F16\u8F91\u6458\u8981"):(e.innerHTML='<i class="fas fa-lock-open"></i>',e.title="\u56FA\u5B9A\u7F16\u8F91\u6458\u8981",N.currentCommitMessage=oo(N.currentFieldUpdates,N.currentTagUpdates,N.currentSeriesUpdate,N.entityType),o.value=N.currentCommitMessage),zn(),Oi()}),document.getElementById("static-wcode-input").addEventListener("input",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentWcode=o.target.value,Zo(N.currentSubjectData.infobox||"",o.target.value,"static-content-diff-container"),Oi())}),document.getElementById("static-tags-input").addEventListener("input",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentTags=o.target.value,Js(N.currentSubjectData.metaTags||[],o.target.value.split(" ").filter(a=>a),"static-tags-diff-container"),Oi())}),document.getElementById("static-series-checkbox").addEventListener("change",o=>{N.currentView==="processing"&&N.currentSubjectData&&(N.currentSeries=o.target.checked,Oi())})}var Pu=`/* stylelint-disable no-descending-specificity */

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
    display: flex;
    flex-direction: column;
    min-height: 0;
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
`;var ju=`.diff-tailwindcss-wrapper .\\!container {
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
`;GM_addStyle(Pu);GM_addStyle(ju);var Gl=document.createElement("link");Gl.rel="stylesheet";Gl.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css";document.head.appendChild(Gl);Bu();})();
/*! Bundled license information:

papaparse/papaparse.min.js:
  (* @license
  Papa Parse
  v5.5.4
  https://github.com/mholt/PapaParse
  License: MIT
  *)
*/

var _=0,k=-3;function b(){this.table=new Uint16Array(16),this.trans=new Uint16Array(288)}function E(e,n){this.source=e,this.sourceIndex=0,this.tag=0,this.bitcount=0,this.dest=n,this.destLen=0,this.ltree=new b,this.dtree=new b}var U=new b,y=new b,h=new Uint8Array(30),w=new Uint16Array(30),L=new Uint8Array(30),p=new Uint16Array(30),F=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),x=new b,c=new Uint8Array(320);function T(e,n,r,a){var t,i;for(t=0;t<r;++t)e[t]=0;for(t=0;t<30-r;++t)e[t+r]=t/r|0;for(i=a,t=0;t<30;++t)n[t]=i,i+=1<<e[t]}function N(e,n){var r;for(r=0;r<7;++r)e.table[r]=0;for(e.table[7]=24,e.table[8]=152,e.table[9]=112,r=0;r<24;++r)e.trans[r]=256+r;for(r=0;r<144;++r)e.trans[24+r]=r;for(r=0;r<8;++r)e.trans[168+r]=280+r;for(r=0;r<112;++r)e.trans[176+r]=144+r;for(r=0;r<5;++r)n.table[r]=0;for(n.table[5]=32,r=0;r<32;++r)n.trans[r]=r}var I=new Uint16Array(16);function l(e,n,r,a){var t,i;for(t=0;t<16;++t)e.table[t]=0;for(t=0;t<a;++t)e.table[n[r+t]]++;for(e.table[0]=0,i=0,t=0;t<16;++t)I[t]=i,i+=e.table[t];for(t=0;t<a;++t)n[r+t]&&(e.trans[I[n[r+t]]++]=t)}function O(e){e.bitcount--||(e.tag=e.source[e.sourceIndex++],e.bitcount=7);var n=e.tag&1;return e.tag>>>=1,n}function u(e,n,r){if(!n)return r;for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var a=e.tag&65535>>>16-n;return e.tag>>>=n,e.bitcount-=n,a+r}function v(e,n){for(;e.bitcount<24;)e.tag|=e.source[e.sourceIndex++]<<e.bitcount,e.bitcount+=8;var r=0,a=0,t=0,i=e.tag;do a=2*a+(i&1),i>>>=1,++t,r+=n.table[t],a-=n.table[t];while(a>=0);return e.tag=i,e.bitcount-=t,n.trans[r+a]}function K(e,n,r){var a,t,i,o,s,f;for(a=u(e,5,257),t=u(e,5,1),i=u(e,4,4),o=0;o<19;++o)c[o]=0;for(o=0;o<i;++o){var D=u(e,3,0);c[F[o]]=D}for(l(x,c,0,19),s=0;s<a+t;){var g=v(e,x);switch(g){case 16:var R=c[s-1];for(f=u(e,2,3);f;--f)c[s++]=R;break;case 17:for(f=u(e,3,3);f;--f)c[s++]=0;break;case 18:for(f=u(e,7,11);f;--f)c[s++]=0;break;default:c[s++]=g;break}}l(n,c,0,a),l(r,c,a,t)}function A(e,n,r){for(;;){var a=v(e,n);if(a===256)return _;if(a<256)e.dest[e.destLen++]=a;else{var t,i,o,s;for(a-=257,t=u(e,h[a],w[a]),i=v(e,r),o=e.destLen-u(e,L[i],p[i]),s=o;s<o+t;++s)e.dest[e.destLen++]=e.dest[s]}}}function j(e){for(var n,r,a;e.bitcount>8;)e.sourceIndex--,e.bitcount-=8;if(n=e.source[e.sourceIndex+1],n=256*n+e.source[e.sourceIndex],r=e.source[e.sourceIndex+3],r=256*r+e.source[e.sourceIndex+2],n!==(~r&65535))return k;for(e.sourceIndex+=4,a=n;a;--a)e.dest[e.destLen++]=e.source[e.sourceIndex++];return e.bitcount=0,_}function q(e,n){var r=new E(e,n),a,t,i;do{switch(a=O(r),t=u(r,2,0),t){case 0:i=j(r);break;case 1:i=A(r,U,y);break;case 2:K(r,r.ltree,r.dtree),i=A(r,r.ltree,r.dtree);break;default:i=k}if(i!==_)throw new Error("Data error")}while(!a);return r.destLen<r.dest.length?typeof r.dest.slice=="function"?r.dest.slice(0,r.destLen):r.dest.subarray(0,r.destLen):r.dest}N(U,y);T(h,w,4,3);T(L,p,2,1);h[28]=0;w[28]=258;var z=q;export{z as t};
//# sourceMappingURL=tiny-inflate-C0OKPvUD.js.map

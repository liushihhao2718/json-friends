function I(e){return Array.isArray(e)?e:[e]}const G={STOP:"STOP"};function M(e,n){const t=n(e);e.children!==void 0&&t!==G.STOP&&e.children.forEach(r=>M(r,n))}function F(e,n={}){const{preserveGroup:t=!1}=n,r=[],s=t?i=>{i.isLeaf||(r.push(i.key),u(i.children))}:i=>{i.isLeaf||(i.isGroup||r.push(i.key),u(i.children))};function u(i){i.forEach(s)}return u(e),r}function R(e,n){const{isLeaf:t}=e;return t!==void 0?t:!n(e)}function j(e){return e.children}function U(e){return e.key}function q(){return!1}function V(e,n){const{isLeaf:t}=e;return!(t===!1&&!Array.isArray(n(e)))}function W(e){return e.disabled===!0}function Z(e,n){return e.isLeaf===!1&&!Array.isArray(n(e))}function P(e){var n;return e==null?[]:Array.isArray(e)?e:(n=e.checkedKeys)!==null&&n!==void 0?n:[]}function x(e){var n;return e==null||Array.isArray(e)?[]:(n=e.indeterminateKeys)!==null&&n!==void 0?n:[]}function z(e,n){const t=new Set(e);return n.forEach(r=>{t.has(r)||t.add(r)}),Array.from(t)}function B(e,n){const t=new Set(e);return n.forEach(r=>{t.has(r)&&t.delete(r)}),Array.from(t)}function H(e){return(e==null?void 0:e.type)==="group"}function le(e){const n=new Map;return e.forEach((t,r)=>{n.set(t.key,r)}),t=>{var r;return(r=n.get(t))!==null&&r!==void 0?r:null}}class J extends Error{constructor(){super(),this.message="SubtreeNotLoadedError: checking a subtree whose required nodes are not fully loaded."}}function Q(e,n,t,r){return w(n.concat(e),t,r,!1)}function X(e,n){const t=new Set;return e.forEach(r=>{const s=n.treeNodeMap.get(r);if(s!==void 0){let u=s.parent;for(;u!==null&&!(u.disabled||t.has(u.key));)t.add(u.key),u=u.parent}}),t}function Y(e,n,t,r){const s=w(n,t,r,!1),u=w(e,t,r,!0),i=X(e,t),d=[];return s.forEach(f=>{(u.has(f)||i.has(f))&&d.push(f)}),d.forEach(f=>s.delete(f)),s}function E(e,n){const{checkedKeys:t,keysToCheck:r,keysToUncheck:s,indeterminateKeys:u,cascade:i,leafOnly:d,checkStrategy:f,allowNotLoaded:o}=e;if(!i)return r!==void 0?{checkedKeys:z(t,r),indeterminateKeys:Array.from(u)}:s!==void 0?{checkedKeys:B(t,s),indeterminateKeys:Array.from(u)}:{checkedKeys:Array.from(t),indeterminateKeys:Array.from(u)};const{levelTreeNodeMap:h}=n;let c;s!==void 0?c=Y(s,t,n,o):r!==void 0?c=Q(r,t,n,o):c=w(t,n,o,!1);const v=f==="parent",N=f==="child"||d,g=c,A=new Set,C=Math.max.apply(null,Array.from(h.keys()));for(let b=C;b>=0;b-=1){const L=b===0,S=h.get(b);for(const a of S){if(a.isLeaf)continue;const{key:l,shallowLoaded:p}=a;if(N&&p&&a.children.forEach(y=>{!y.disabled&&!y.isLeaf&&y.shallowLoaded&&g.has(y.key)&&g.delete(y.key)}),a.disabled||!p)continue;let m=!0,k=!1,K=!0;for(const y of a.children){const O=y.key;if(!y.disabled){if(K&&(K=!1),g.has(O))k=!0;else if(A.has(O)){k=!0,m=!1;break}else if(m=!1,k)break}}m&&!K?(v&&a.children.forEach(y=>{!y.disabled&&g.has(y.key)&&g.delete(y.key)}),g.add(l)):k&&A.add(l),L&&N&&g.has(l)&&g.delete(l)}}return{checkedKeys:Array.from(g),indeterminateKeys:Array.from(A)}}function w(e,n,t,r){const{treeNodeMap:s,getChildren:u}=n,i=new Set,d=new Set(e);return e.forEach(f=>{const o=s.get(f);o!==void 0&&M(o,h=>{if(h.disabled)return G.STOP;const{key:c}=h;if(!i.has(c)&&(i.add(c),d.add(c),Z(h.rawNode,u))){if(r)return G.STOP;if(!t)throw new J}})}),d}function $(e,{includeGroup:n=!1,includeSelf:t=!0},r){var s;const u=r.treeNodeMap;let i=e==null?null:(s=u.get(e))!==null&&s!==void 0?s:null;const d={keyPath:[],treeNodePath:[],treeNode:i};if(i!=null&&i.ignored)return d.treeNode=null,d;for(;i;)!i.ignored&&(n||!i.isGroup)&&d.treeNodePath.push(i),i=i.parent;return d.treeNodePath.reverse(),t||d.treeNodePath.pop(),d.keyPath=d.treeNodePath.map(f=>f.key),d}function ee(e){if(e.length===0)return null;const n=e[0];return n.isGroup||n.ignored||n.disabled?n.getNext():n}function te(e,n){const t=e.siblings,r=t.length,{index:s}=e;return n?t[(s+1)%r]:s===t.length-1?null:t[s+1]}function _(e,n,{loop:t=!1,includeDisabled:r=!1}={}){const s=n==="prev"?ne:te,u={reverse:n==="prev"};let i=!1,d=null;function f(o){if(o!==null){if(o===e){if(!i)i=!0;else if(!e.disabled&&!e.isGroup){d=e;return}}else if((!o.disabled||r)&&!o.ignored&&!o.isGroup){d=o;return}if(o.isGroup){const h=T(o,u);h!==null?d=h:f(s(o,t))}else{const h=s(o,!1);if(h!==null)f(h);else{const c=re(o);c!=null&&c.isGroup?f(s(c,t)):t&&f(s(o,!0))}}}}return f(e),d}function ne(e,n){const t=e.siblings,r=t.length,{index:s}=e;return n?t[(s-1+r)%r]:s===0?null:t[s-1]}function re(e){return e.parent}function T(e,n={}){const{reverse:t=!1}=n,{children:r}=e;if(r){const{length:s}=r,u=t?s-1:0,i=t?-1:s,d=t?-1:1;for(let f=u;f!==i;f+=d){const o=r[f];if(!o.disabled&&!o.ignored)if(o.isGroup){const h=T(o,n);if(h!==null)return h}else return o}}return null}const ie={getChild(){return this.ignored?null:T(this)},getParent(){const{parent:e}=this;return e!=null&&e.isGroup?e.getParent():e},getNext(e={}){return _(this,"next",e)},getPrev(e={}){return _(this,"prev",e)}};function se(e,n){const t=n?new Set(n):void 0,r=[];function s(u){u.forEach(i=>{r.push(i),!(i.isLeaf||!i.children||i.ignored)&&(i.isGroup||t===void 0||t.has(i.key))&&s(i.children)})}return s(e),r}function ae(e,n){const t=e.key;for(;n;){if(n.key===t)return!0;n=n.parent}return!1}function D(e,n,t,r,s,u=null,i=0){const d=[];return e.forEach((f,o)=>{var h;const c=Object.create(r);if(c.rawNode=f,c.siblings=d,c.level=i,c.index=o,c.isFirstChild=o===0,c.isLastChild=o+1===e.length,c.parent=u,!c.ignored){const v=s(f);Array.isArray(v)&&(c.children=D(v,n,t,r,s,c,i+1))}d.push(c),n.set(c.key,c),t.has(i)||t.set(i,[]),(h=t.get(i))===null||h===void 0||h.push(c)}),d}function oe(e,n={}){var t;const r=new Map,s=new Map,{getDisabled:u=W,getIgnored:i=q,getIsGroup:d=H,getKey:f=U}=n,o=(t=n.getChildren)!==null&&t!==void 0?t:j,h=n.ignoreEmptyChildren?a=>{const l=o(a);return Array.isArray(l)?l.length?l:null:l}:o,c=Object.assign({get key(){return f(this.rawNode)},get disabled(){return u(this.rawNode)},get isGroup(){return d(this.rawNode)},get isLeaf(){return R(this.rawNode,h)},get shallowLoaded(){return V(this.rawNode,h)},get ignored(){return i(this.rawNode)},contains(a){return ae(this,a)}},ie),v=D(e,r,s,c,h);function N(a){if(a==null)return null;const l=r.get(a);return l&&!l.isGroup&&!l.ignored?l:null}function g(a){if(a==null)return null;const l=r.get(a);return l&&!l.ignored?l:null}function A(a,l){const p=g(a);return p?p.getPrev(l):null}function C(a,l){const p=g(a);return p?p.getNext(l):null}function b(a){const l=g(a);return l?l.getParent():null}function L(a){const l=g(a);return l?l.getChild():null}const S={treeNodes:v,treeNodeMap:r,levelTreeNodeMap:s,maxLevel:Math.max(...s.keys()),getChildren:h,getFlattenedNodes(a){return se(v,a)},getNode:N,getPrev:A,getNext:C,getParent:b,getChild:L,getFirstAvailableNode(){return ee(v)},getPath(a,l={}){return $(a,l,S)},getCheckedKeys(a,l={}){const{cascade:p=!0,leafOnly:m=!1,checkStrategy:k="all",allowNotLoaded:K=!1}=l;return E({checkedKeys:P(a),indeterminateKeys:x(a),cascade:p,leafOnly:m,checkStrategy:k,allowNotLoaded:K},S)},check(a,l,p={}){const{cascade:m=!0,leafOnly:k=!1,checkStrategy:K="all",allowNotLoaded:y=!1}=p;return E({checkedKeys:P(l),indeterminateKeys:x(l),keysToCheck:a==null?[]:I(a),cascade:m,leafOnly:k,checkStrategy:K,allowNotLoaded:y},S)},uncheck(a,l,p={}){const{cascade:m=!0,leafOnly:k=!1,checkStrategy:K="all",allowNotLoaded:y=!1}=p;return E({checkedKeys:P(l),indeterminateKeys:x(l),keysToUncheck:a==null?[]:I(a),cascade:m,leafOnly:k,checkStrategy:K,allowNotLoaded:y},S)},getNonLeafKeys(a={}){return F(v,a)}};return S}export{oe as a,le as c};
//# sourceMappingURL=treemate-HRdUPn5m.js.map

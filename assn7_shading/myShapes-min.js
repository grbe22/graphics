
class Cube extends cgIShape{
	constructor(a) {
		super()
		this.makeCube(a)
	}
	makeCube(a){
		a<1&&(a=1);
		var s = -.5, i = -.5, t = 1/a, r = 0;
		for(r = 0; r < a; r++){
			var d, h = r * t;
			for(d = 0; d < a; d++){
				var n=d*t;
				this.addTriangle(s+n,i+h,.5,s+n+t,i+h,.5,s+n+t,i+h+t,.5);
				this.addTriangle(s+n+t,i+h+t,.5,s+n,i+h+t,.5,s+n,i+h,.5);
				this.addTriangle(s+n,i+h,-.5,s+n+t,i+h+t,-.5,s+n+t,i+h,-.5);
				this.addTriangle(s+n,i+h,-.5,s+n,i+h+t,-.5,s+n+t,i+h+t,-.5);
				this.addTriangle(-.5,i+h,s+n,-.5,i+h,s+n+t,-.5,i+h+t,s+n+t);
				this.addTriangle(-.5,i+h+t,s+n+t,-.5,i+h+t,s+n,-.5,i+h,s+n);
				this.addTriangle(.5,i+h,s+n+t,.5,i+h,s+n,.5,i+h+t,s+n);
				this.addTriangle(.5,i+h+t,s+n,.5,i+h+t,s+n+t,.5,i+h,s+n+t);
				this.addTriangle(s+n,.5,i+h+t,s+n+t,.5,i+h+t,s+n,.5,i+h);
				this.addTriangle(s+n,.5,i+h,s+n+t,.5,i+h+t,s+n+t,.5,i+h);
				this.addTriangle(s+n,-.5,i+h,s+n+t,-.5,i+h+t,s+n,-.5,i+h+t);
				this.addTriangle(s+n,-.5,i+h,s+n+t,-.5,i+h,s+n+t,-.5,i+h+t)
			}
		}
	}
}

class Cylinder extends cgIShape{constructor(a,s){super(),this.makeCylinder(a,s)}makeCylinder(a,s){var i=-.5;
a<3&&(a=3),s<1&&(s=1);
var t,r,d=360/a,h=1/s,n=0;
let e,o,l,M;
for(t=0;
t<a;
t++)e=.5*Math.cos(radians(n)),o=.5*Math.sin(radians(n)),l=.5*Math.cos(radians(n+d)),M=.5*Math.sin(radians(n+d)),this.addTriangle(e,i,o,0,i,0,l,i,M),this.addTriangle(l,.5,M,0,.5,0,e,.5,o),n+=d;
for(t=0;
t<s;
t++){var c=t*h;
for(n=0,r=0;
r<a;
r++)e=.5*Math.cos(radians(n)),o=.5*Math.sin(radians(n)),l=.5*Math.cos(radians(n+d)),M=.5*Math.sin(radians(n+d)),this.addTriangle(e,i+c,o,l,i+c,M,l,i+c+h,M),this.addTriangle(e,i+c,o,l,i+c+h,M,e,i+c+h,o),n+=d}}}class Cone extends cgIShape{constructor(a,s){super(),this.makeCone(a,s)}makeCone(a,s){let i=-.5;
a<3&&(a=3),s<1&&(s=1);
let t=360/a,r=1/s;
var d,h;
for(d=0;
d<s;
d++){let s=d*r,n=d,e=0;
for(h=0;
h<a;
h++){let a=.5*Math.cos(radians(e)),d=.5*Math.sin(radians(e)),h=.5*Math.cos(radians(e+t)),o=.5*Math.sin(radians(e+t));
this.addTriangle(a,i,d,0,i,0,h,i,o);
let l=.5*(1-n*r),M=l*Math.cos(radians(e)),c=l*Math.sin(radians(e)),g=l*Math.cos(radians(e+t)),T=l*Math.sin(radians(e+t)),m=.5*(1-(n+1)*r),f=m*Math.cos(radians(e)),p=m*Math.sin(radians(e)),u=m*Math.cos(radians(e+t)),C=m*Math.sin(radians(e+t));
l=m,this.addTriangle(g,i+s,T,f,i+s+r,p,M,i+s,c),this.addTriangle(g,i+s,T,u,i+s+r,C,f,i+s+r,p),e+=t}}}}class Sphere extends cgIShape{constructor(a,s){super(),this.makeSphere(a,s)}makeSphere(a,s){let i,t,r,d,h,n,e,o,l;
a<3&&(a=3),s<3&&(s=3);
let M=6.28/a,c=3.14/s,g=c,T=0,m=0,f=1,p=Math.sin(c),u=Math.cos(c),C=.5,k=.5*u;
var v,S;
for(S=0;
S<a;
S++){let a=Math.sin(T),s=Math.cos(T),c=Math.sin(T+M);
i=0,t=.5,r=0,d=Math.cos(T+M)*p*.5,h=k,n=c*p*.5,e=s*p*.5,o=k,l=a*p*.5,this.addTriangle(i,t,r,e,o,l,d,h,n),this.addNormal(i,t,r,e,o,l,d,h,n),T+=M}for(v=1;
v<s;
v++){for(m=Math.sin(g),f=Math.cos(g),p=Math.sin(g+c),C=.5*f,k=.5*(u=Math.cos(g+c)),T=0,S=0;
S<=a;
S++){let a=Math.sin(T),s=Math.cos(T),c=Math.sin(T+M),g=Math.cos(T+M);
i=s*m*.5,t=C,r=a*m*.5,d=g*m*.5,h=C,n=c*m*.5,e=s*p*.5,o=k,l=a*p*.5,this.addTriangle(e,o,l,d,h,n,i,t,r),this.addNormal(e,o,l,d,h,n,i,t,r),i=g*m*.5,t=C,r=c*m*.5,d=g*p*.5,h=k,n=c*p*.5,e=s*p*.5,o=k,l=a*p*.5,this.addTriangle(i,t,r,e,o,l,d,h,n),this.addNormal(i,t,r,e,o,l,d,h,n),T+=M}g+=c}for(T=0,m=Math.sin(g),p=0,u=-1,C=.5*(f=Math.cos(g)),k=-.5,S=0;
S<a;
S++){let a=Math.sin(T),s=Math.cos(T),c=Math.sin(T+M);
i=s*m*.5,t=k,r=a*m*.5,d=Math.cos(T+M)*m*.5,h=k,n=c*m*.5,e=0,o=-.5,l=0,this.addTriangle(i,t,r,e,o,l,d,h,n),this.addNormal(i,t,r,e,o,l,d,h,n),T+=M}}}

(this.webpackJsonpemilus=this.webpackJsonpemilus||[]).push([[15],{367:function(e,s,a){"use strict";var t=a(7),i=a(63),c=a(0),r=a(23),n=a(346),l=a(456),o=a(473),m=a(467),d=a(470),j=a(338),u=a(65),h=a(76),b=a(32),x=a(357),g=a(170),f=a(3),p={email:[{required:!0,message:"Please input your email address"},{type:"email",message:"Please enter a validate email!"}],password:[{required:!0,message:"Please input your password"}],firstName:[{required:!0,message:"Please input your first name"}],lastName:[{required:!0,message:"Please input your last name"}],confirm:[{required:!0,message:"Please confirm your password!"},function(e){var s=e.getFieldValue;return{validator:function(e,a){return a&&s("password")!==a?Promise.reject("Passwords do not match!"):Promise.resolve()}}}]},O={showAuthMessage:h.e,hideAuthMessage:h.b,showLoading:h.f,hideLoading:h.c,authenticated:h.a};s.a=Object(r.b)((function(e){var s=e.auth;return{loading:s.loading,message:s.message,showMessage:s.showMessage,token:s.token,redirect:s.redirect}}),O)((function(e){var s=e.showLoading,a=(e.hideLoading,e.token),r=e.loading,h=e.redirect,O=e.message,v=e.showMessage,w=e.hideAuthMessage,y=(e.authenticated,e.allowRedirect),N=e.showAuthMessage,k=m.a.useForm(),P=Object(i.a)(k,1)[0],F=Object(b.g)();return Object(c.useEffect)((function(){null!==a&&""!==a&&void 0!==a&&y&&F.push(h),v&&setTimeout((function(){w()}),3e3)})),Object(f.jsxs)(f.Fragment,{children:[Object(f.jsx)(x.a.div,{initial:{opacity:0,marginBottom:0},animate:{opacity:v?1:0,marginBottom:v?20:0},children:Object(f.jsx)(d.a,{type:"error",showIcon:!0,message:O})}),Object(f.jsxs)(m.a,{form:P,layout:"vertical",name:"register-form",onFinish:function(){P.validateFields().then((function(e){var a=Object(t.a)(Object(t.a)({},e),{},{avatar:"https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png"});s(),g.a.signUp(a).then((function(e){var s;(null===e||void 0===e?void 0:e.success)?window.location.href="login":N(null!==(s=null===e||void 0===e?void 0:e.message)&&void 0!==s?s:"Error")}))})).catch((function(e){console.log("Validate Failed:",e)}))},children:[Object(f.jsx)(m.a.Item,{name:"firstName",label:"First name",rules:p.firstName,hasFeedback:!0,children:Object(f.jsx)(j.a,{prefix:Object(f.jsx)(n.a,{className:"text-primary"})})}),Object(f.jsx)(m.a.Item,{name:"lastName",label:"Last name",rules:p.lastName,hasFeedback:!0,children:Object(f.jsx)(j.a,{prefix:Object(f.jsx)(n.a,{className:"text-primary"})})}),Object(f.jsx)(m.a.Item,{name:"email",label:"Email",rules:p.email,hasFeedback:!0,children:Object(f.jsx)(j.a,{prefix:Object(f.jsx)(l.a,{className:"text-primary"})})}),Object(f.jsx)(m.a.Item,{name:"password",label:"Password",rules:p.password,hasFeedback:!0,children:Object(f.jsx)(j.a.Password,{prefix:Object(f.jsx)(o.a,{className:"text-primary"})})}),Object(f.jsx)(m.a.Item,{name:"confirm",label:"ConfirmPassword",rules:p.confirm,hasFeedback:!0,children:Object(f.jsx)(j.a.Password,{prefix:Object(f.jsx)(o.a,{className:"text-primary"})})}),Object(f.jsx)(m.a.Item,{children:Object(f.jsx)(u.a,{type:"primary",htmlType:"submit",block:!0,loading:r,children:"Sign Up"})})]})]})}))},462:function(e,s,a){"use strict";a.r(s);var t=a(7),i=(a(0),a(367)),c=a(365),r=a(366),n=a(23),l=a(3),o={backgroundImage:"url(".concat("/img/others/img-17.jpg",")"),backgroundRepeat:"no-repeat",backgroundSize:"cover"};s.default=function(e){var s=Object(n.d)((function(e){return e.theme.currentTheme}));return Object(l.jsx)("div",{className:"h-100 ".concat("light"===s?"bg-white":""),children:Object(l.jsxs)(c.a,{justify:"center",className:"align-items-stretch h-100",children:[Object(l.jsx)(r.a,{xs:20,sm:20,md:24,lg:16,children:Object(l.jsx)("div",{className:"container d-flex flex-column justify-content-center h-100",children:Object(l.jsx)(c.a,{justify:"center",children:Object(l.jsxs)(r.a,{xs:24,sm:24,md:20,lg:12,xl:8,children:[Object(l.jsx)("h1",{children:"Sign Up"}),Object(l.jsxs)("p",{children:["Already have an account? ",Object(l.jsx)("a",{href:"/auth/login-2",children:"Sign In"})]}),Object(l.jsx)("div",{className:"mt-4",children:Object(l.jsx)(i.a,Object(t.a)({},e))})]})})})}),Object(l.jsx)(r.a,{xs:0,sm:0,md:0,lg:8,children:Object(l.jsxs)("div",{className:"d-flex flex-column justify-content-between h-100 px-4",style:o,children:[Object(l.jsx)("div",{className:"text-right",children:Object(l.jsx)("img",{src:"/img/logo-white.png",alt:"logo"})}),Object(l.jsx)(c.a,{justify:"center",children:Object(l.jsxs)(r.a,{xs:0,sm:0,md:0,lg:20,children:[Object(l.jsx)("img",{className:"img-fluid mb-5",src:"/img/others/img-19.png",alt:""}),Object(l.jsx)("h1",{className:"text-white",children:"Welcome to emilus"}),Object(l.jsx)("p",{className:"text-white",children:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat, vel convallis elit fermentum pellentesque."})]})}),Object(l.jsx)("div",{className:"d-flex justify-content-end pb-4",children:Object(l.jsxs)("div",{children:[Object(l.jsx)("a",{className:"text-white",href:"/#",onClick:function(e){return e.preventDefault()},children:"Term & Conditions"}),Object(l.jsx)("span",{className:"mx-2 text-white",children:" | "}),Object(l.jsx)("a",{className:"text-white",href:"/#",onClick:function(e){return e.preventDefault()},children:"Privacy & Policy"})]})})]})})]})})}}}]);
//# sourceMappingURL=15.bb55e3ec.chunk.js.map
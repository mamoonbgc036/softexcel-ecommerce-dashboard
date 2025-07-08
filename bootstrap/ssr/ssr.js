import { ref, shallowRef, defineComponent, markRaw, h as h$1, onMounted, onUnmounted, computed, reactive, createSSRApp, watch, useSSRContext, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, resolveComponent, inject, renderSlot, Fragment, renderList, withModifiers, withDirectives, vModelText, vModelSelect, vModelCheckbox, vModelDynamic, vShow, onBeforeUnmount, Transition } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderSlot, ssrLooseContain, ssrLooseEqual, ssrRenderDynamicModel, ssrRenderTeleport } from "vue/server-renderer";
import { toast, Toaster } from "@steveyuowo/vue-hot-toast";
import { createHeadManager, router, mergeDataIntoQueryString, setupProgress, shouldIntercept } from "@inertiajs/core";
import b from "lodash.clonedeep";
import G from "lodash.isequal";
import { ChevronDownIcon, User, ChevronDown, SearchIcon, MapPin, UserRound, ShoppingBag, X, Menu, House, ThumbsUp, Headphones, Truck, Lock, EyeIcon, EyeOffIcon, ChevronLeft, ChevronRight, Check, SlidersHorizontal, LayoutGridIcon, ShoppingCart as ShoppingCart$1, ShoppingBasket } from "lucide-vue-next";
import { PhDiamondsFour, PhX, PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";
import { defineStore, createPinia } from "pinia";
import axios from "axios";
import Cookies from "js-cookie";
import "@fortawesome/vue-fontawesome";
import * as yup from "yup";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay, EffectFade, Thumbs, FreeMode } from "swiper/modules";
import createServer from "@inertiajs/core/server";
import { renderToString } from "@vue/server-renderer";
var z = { created() {
  if (!this.$options.remember) return;
  Array.isArray(this.$options.remember) && (this.$options.remember = { data: this.$options.remember }), typeof this.$options.remember == "string" && (this.$options.remember = { data: [this.$options.remember] }), typeof this.$options.remember.data == "string" && (this.$options.remember = { data: [this.$options.remember.data] });
  let e = this.$options.remember.key instanceof Function ? this.$options.remember.key.call(this) : this.$options.remember.key, t = router.restore(e), n = this.$options.remember.data.filter((o) => !(this[o] !== null && typeof this[o] == "object" && this[o].__rememberable === false)), s = (o) => this[o] !== null && typeof this[o] == "object" && typeof this[o].__remember == "function" && typeof this[o].__restore == "function";
  n.forEach((o) => {
    this[o] !== void 0 && t !== void 0 && t[o] !== void 0 && (s(o) ? this[o].__restore(t[o]) : this[o] = t[o]), this.$watch(o, () => {
      router.remember(n.reduce((l, u) => ({ ...l, [u]: b(s(u) ? this[u].__remember() : this[u]) }), {}), e);
    }, { immediate: true, deep: true });
  });
} }, j = z;
function C(e, t) {
  let n = typeof e == "string" ? e : null, s = (typeof e == "string" ? t : e) ?? {}, o = n ? router.restore(n) : null, l = typeof s == "function" ? b(s()) : b(s), u = null, f = null, m = (r) => r, y = reactive({ ...o ? o.data : b(l), isDirty: false, errors: o ? o.errors : {}, hasErrors: false, processing: false, progress: null, wasSuccessful: false, recentlySuccessful: false, data() {
    return Object.keys(l).reduce((r, i) => (r[i] = this[i], r), {});
  }, transform(r) {
    return m = r, this;
  }, defaults(r, i) {
    if (typeof s == "function") throw new Error("You cannot call `defaults()` when using a function to define your form data.");
    return typeof r > "u" ? (l = this.data(), this.isDirty = false) : l = Object.assign({}, b(l), typeof r == "string" ? { [r]: i } : r), this;
  }, reset(...r) {
    let i = typeof s == "function" ? b(s()) : b(l), a = b(i);
    return r.length === 0 ? (l = a, Object.assign(this, i)) : Object.keys(i).filter((c) => r.includes(c)).forEach((c) => {
      l[c] = a[c], this[c] = i[c];
    }), this;
  }, setError(r, i) {
    return Object.assign(this.errors, typeof r == "string" ? { [r]: i } : r), this.hasErrors = Object.keys(this.errors).length > 0, this;
  }, clearErrors(...r) {
    return this.errors = Object.keys(this.errors).reduce((i, a) => ({ ...i, ...r.length > 0 && !r.includes(a) ? { [a]: this.errors[a] } : {} }), {}), this.hasErrors = Object.keys(this.errors).length > 0, this;
  }, submit(r, i, a = {}) {
    let c = m(this.data()), v = { ...a, onCancelToken: (p) => {
      if (u = p, a.onCancelToken) return a.onCancelToken(p);
    }, onBefore: (p) => {
      if (this.wasSuccessful = false, this.recentlySuccessful = false, clearTimeout(f), a.onBefore) return a.onBefore(p);
    }, onStart: (p) => {
      if (this.processing = true, a.onStart) return a.onStart(p);
    }, onProgress: (p) => {
      if (this.progress = p, a.onProgress) return a.onProgress(p);
    }, onSuccess: async (p) => {
      this.processing = false, this.progress = null, this.clearErrors(), this.wasSuccessful = true, this.recentlySuccessful = true, f = setTimeout(() => this.recentlySuccessful = false, 2e3);
      let T = a.onSuccess ? await a.onSuccess(p) : null;
      return l = b(this.data()), this.isDirty = false, T;
    }, onError: (p) => {
      if (this.processing = false, this.progress = null, this.clearErrors().setError(p), a.onError) return a.onError(p);
    }, onCancel: () => {
      if (this.processing = false, this.progress = null, a.onCancel) return a.onCancel();
    }, onFinish: (p) => {
      if (this.processing = false, this.progress = null, u = null, a.onFinish) return a.onFinish(p);
    } };
    r === "delete" ? router.delete(i, { ...v, data: c }) : router[r](i, c, v);
  }, get(r, i) {
    this.submit("get", r, i);
  }, post(r, i) {
    this.submit("post", r, i);
  }, put(r, i) {
    this.submit("put", r, i);
  }, patch(r, i) {
    this.submit("patch", r, i);
  }, delete(r, i) {
    this.submit("delete", r, i);
  }, cancel() {
    u && u.cancel();
  }, __rememberable: n === null, __remember() {
    return { data: this.data(), errors: this.errors };
  }, __restore(r) {
    Object.assign(this, r.data), this.setError(r.errors);
  } });
  return watch(y, (r) => {
    y.isDirty = !G(y.data(), l), n && router.remember(b(r.__remember()), n);
  }, { immediate: true, deep: true }), y;
}
var g = ref(null), h = ref(null), O = shallowRef(null), k = ref(null), w = null, oe = defineComponent({ name: "Inertia", props: { initialPage: { type: Object, required: true }, initialComponent: { type: Object, required: false }, resolveComponent: { type: Function, required: false }, titleCallback: { type: Function, required: false, default: (e) => e }, onHeadUpdate: { type: Function, required: false, default: () => () => {
} } }, setup({ initialPage: e, initialComponent: t, resolveComponent: n, titleCallback: s, onHeadUpdate: o }) {
  g.value = t ? markRaw(t) : null, h.value = e, k.value = null;
  let l = typeof window > "u";
  return w = createHeadManager(l, s, o), l || (router.init({ initialPage: e, resolveComponent: n, swapComponent: async (u) => {
    g.value = markRaw(u.component), h.value = u.page, k.value = u.preserveState ? k.value : Date.now();
  } }), router.on("navigate", () => w.forceUpdate())), () => {
    if (g.value) {
      g.value.inheritAttrs = !!g.value.inheritAttrs;
      let u = h$1(g.value, { ...h.value.props, key: k.value });
      return O.value && (g.value.layout = O.value, O.value = null), g.value.layout ? typeof g.value.layout == "function" ? g.value.layout(h$1, u) : (Array.isArray(g.value.layout) ? g.value.layout : [g.value.layout]).concat(u).reverse().reduce((f, m) => (m.inheritAttrs = !!m.inheritAttrs, h$1(m, { ...h.value.props }, () => f))) : u;
    }
  };
} }), N = oe, V = { install(e) {
  router.form = C, Object.defineProperty(e.config.globalProperties, "$inertia", { get: () => router }), Object.defineProperty(e.config.globalProperties, "$page", { get: () => h.value }), Object.defineProperty(e.config.globalProperties, "$headManager", { get: () => w }), e.mixin(j);
} };
function ne() {
  return reactive({ props: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.props;
  }), url: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.url;
  }), component: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.component;
  }), version: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.version;
  }), clearHistory: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.clearHistory;
  }), deferredProps: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.deferredProps;
  }), mergeProps: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.mergeProps;
  }), rememberedState: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.rememberedState;
  }), encryptHistory: computed(() => {
    var _a;
    return (_a = h.value) == null ? void 0 : _a.encryptHistory;
  }) });
}
async function L({ id: e = "app", resolve: t, setup: n, title: s, progress: o = {}, page: l, render: u }) {
  let f = typeof window > "u", m = f ? null : document.getElementById(e), y = l || JSON.parse(m.dataset.page), r = (c) => Promise.resolve(t(c)).then((v) => v.default || v), i = [], a = await Promise.all([r(y.component), router.decryptHistory().catch(() => {
  })]).then(([c]) => n({ el: m, App: N, props: { initialPage: y, initialComponent: c, resolveComponent: r, titleCallback: s, onHeadUpdate: f ? (v) => i = v : null }, plugin: V }));
  if (!f && o && setupProgress(o), f) {
    let c = await u(createSSRApp({ render: () => h$1("div", { id: e, "data-page": JSON.stringify(y), innerHTML: a ? u(a) : "" }) }));
    return { head: i, body: c };
  }
}
defineComponent({ name: "Deferred", props: { data: { type: [String, Array], required: true } }, render() {
  let e = Array.isArray(this.$props.data) ? this.$props.data : [this.$props.data];
  if (!this.$slots.fallback) throw new Error("`<Deferred>` requires a `<template #fallback>` slot");
  return e.every((t) => this.$page.props[t] !== void 0) ? this.$slots.default() : this.$slots.fallback();
} });
var fe = defineComponent({ props: { title: { type: String, required: false } }, data() {
  return { provider: this.$headManager.createProvider() };
}, beforeUnmount() {
  this.provider.disconnect();
}, methods: { isUnaryTag(e) {
  return ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].indexOf(e.type) > -1;
}, renderTagStart(e) {
  e.props = e.props || {}, e.props.inertia = e.props["head-key"] !== void 0 ? e.props["head-key"] : "";
  let t = Object.keys(e.props).reduce((n, s) => {
    let o = e.props[s];
    return ["key", "head-key"].includes(s) ? n : o === "" ? n + ` ${s}` : n + ` ${s}="${o}"`;
  }, "");
  return `<${e.type}${t}>`;
}, renderTagChildren(e) {
  return typeof e.children == "string" ? e.children : e.children.reduce((t, n) => t + this.renderTag(n), "");
}, isFunctionNode(e) {
  return typeof e.type == "function";
}, isComponentNode(e) {
  return typeof e.type == "object";
}, isCommentNode(e) {
  return /(comment|cmt)/i.test(e.type.toString());
}, isFragmentNode(e) {
  return /(fragment|fgt|symbol\(\))/i.test(e.type.toString());
}, isTextNode(e) {
  return /(text|txt)/i.test(e.type.toString());
}, renderTag(e) {
  if (this.isTextNode(e)) return e.children;
  if (this.isFragmentNode(e)) return "";
  if (this.isCommentNode(e)) return "";
  let t = this.renderTagStart(e);
  return e.children && (t += this.renderTagChildren(e)), this.isUnaryTag(e) || (t += `</${e.type}>`), t;
}, addTitleElement(e) {
  return this.title && !e.find((t) => t.startsWith("<title")) && e.push(`<title inertia>${this.title}</title>`), e;
}, renderNodes(e) {
  return this.addTitleElement(e.flatMap((t) => this.resolveNode(t)).map((t) => this.renderTag(t)).filter((t) => t));
}, resolveNode(e) {
  return this.isFunctionNode(e) ? this.resolveNode(e.type()) : this.isComponentNode(e) ? (console.warn("Using components in the <Head> component is not supported."), []) : this.isTextNode(e) && e.children ? e : this.isFragmentNode(e) && e.children ? e.children.flatMap((t) => this.resolveNode(t)) : this.isCommentNode(e) ? [] : e;
} }, render() {
  this.provider.update(this.renderNodes(this.$slots.default ? this.$slots.default() : []));
} }), me = fe;
var be = defineComponent({ name: "Link", props: { as: { type: String, default: "a" }, data: { type: Object, default: () => ({}) }, href: { type: String, required: true }, method: { type: String, default: "get" }, replace: { type: Boolean, default: false }, preserveScroll: { type: Boolean, default: false }, preserveState: { type: Boolean, default: null }, only: { type: Array, default: () => [] }, except: { type: Array, default: () => [] }, headers: { type: Object, default: () => ({}) }, queryStringArrayFormat: { type: String, default: "brackets" }, async: { type: Boolean, default: false }, prefetch: { type: [Boolean, String, Array], default: false }, cacheFor: { type: [Number, String, Array], default: 0 }, onStart: { type: Function, default: (e) => {
} }, onProgress: { type: Function, default: () => {
} }, onFinish: { type: Function, default: () => {
} }, onBefore: { type: Function, default: () => {
} }, onCancel: { type: Function, default: () => {
} }, onSuccess: { type: Function, default: () => {
} }, onError: { type: Function, default: () => {
} }, onCancelToken: { type: Function, default: () => {
} } }, setup(e, { slots: t, attrs: n }) {
  let s = ref(0), o = ref(null), l = (() => e.prefetch === true ? ["hover"] : e.prefetch === false ? [] : Array.isArray(e.prefetch) ? e.prefetch : [e.prefetch])(), u = (() => e.cacheFor !== 0 ? e.cacheFor : l.length === 1 && l[0] === "click" ? 0 : 3e4)();
  onMounted(() => {
    l.includes("mount") && p();
  }), onUnmounted(() => {
    clearTimeout(o.value);
  });
  let f = e.method.toLowerCase(), m = f !== "get" ? "button" : e.as.toLowerCase(), y = computed(() => mergeDataIntoQueryString(f, e.href || "", e.data, e.queryStringArrayFormat)), r = computed(() => y.value[0]), i = computed(() => y.value[1]), a = computed(() => ({ a: { href: r.value }, button: { type: "button" } })), c = { data: i.value, method: f, replace: e.replace, preserveScroll: e.preserveScroll, preserveState: e.preserveState ?? f !== "get", only: e.only, except: e.except, headers: e.headers, async: e.async }, v = { ...c, onCancelToken: e.onCancelToken, onBefore: e.onBefore, onStart: (d) => {
    s.value++, e.onStart(d);
  }, onProgress: e.onProgress, onFinish: (d) => {
    s.value--, e.onFinish(d);
  }, onCancel: e.onCancel, onSuccess: e.onSuccess, onError: e.onError }, p = () => {
    router.prefetch(r.value, c, { cacheFor: u });
  }, T = { onClick: (d) => {
    shouldIntercept(d) && (d.preventDefault(), router.visit(r.value, v));
  } }, J = { onMouseenter: () => {
    o.value = setTimeout(() => {
      p();
    }, 75);
  }, onMouseleave: () => {
    clearTimeout(o.value);
  }, onClick: T.onClick }, Y = { onMousedown: (d) => {
    shouldIntercept(d) && (d.preventDefault(), p());
  }, onMouseup: (d) => {
    d.preventDefault(), router.visit(r.value, v);
  }, onClick: (d) => {
    shouldIntercept(d) && d.preventDefault();
  } };
  return () => h$1(m, { ...n, ...a.value[m] || {}, "data-loading": s.value > 0 ? "" : void 0, ...(() => l.includes("hover") ? J : l.includes("click") ? Y : T)() }, t);
} }), Pe = be;
defineComponent({ name: "WhenVisible", props: { data: { type: [String, Array] }, params: { type: Object }, buffer: { type: Number, default: 0 }, as: { type: String, default: "div" }, always: { type: Boolean, default: false } }, data() {
  return { loaded: false, fetching: false, observer: null };
}, unmounted() {
  var _a;
  (_a = this.observer) == null ? void 0 : _a.disconnect();
}, mounted() {
  this.observer = new IntersectionObserver((e) => {
    if (!e[0].isIntersecting || (this.$props.always || this.observer.disconnect(), this.fetching)) return;
    this.fetching = true;
    let t = this.getReloadParams();
    router.reload({ ...t, onStart: (n) => {
      var _a;
      this.fetching = true, (_a = t.onStart) == null ? void 0 : _a.call(t, n);
    }, onFinish: (n) => {
      var _a;
      this.loaded = true, this.fetching = false, (_a = t.onFinish) == null ? void 0 : _a.call(t, n);
    } });
  }, { rootMargin: `${this.$props.buffer}px` }), this.observer.observe(this.$el.nextSibling);
}, methods: { getReloadParams() {
  if (this.$props.data) return { only: Array.isArray(this.$props.data) ? this.$props.data : [this.$props.data] };
  if (!this.$props.params) throw new Error("You must provide either a `data` or `params` prop.");
  return this.$props.params;
} }, render() {
  let e = [];
  return (this.$props.always || !this.loaded) && e.push(h$1(this.$props.as)), this.loaded ? this.$slots.default && e.push(this.$slots.default()) : e.push(this.$slots.fallback ? this.$slots.fallback() : null), e;
} });
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$S = {
  __name: "NavigationMenu",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const isDropdownOpen = ref(false);
    const closeDropdown = (event) => {
      if (isDropdownOpen.value && !event.target.closest(".relative")) {
        isDropdownOpen.value = false;
      }
    };
    onMounted(() => {
      document.addEventListener("click", closeDropdown);
    });
    onUnmounted(() => {
      document.removeEventListener("click", closeDropdown);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        id: "navbarid",
        class: "sticky top-0 z-50 bg-[#fff]"
      }, _attrs))} data-v-f1f6182e><div class="menu_area flex items-center justify-between" data-v-f1f6182e><div class="relative" data-v-f1f6182e><a class="text-[16px] font-bold flex items-center gap-2 px-4 py-4 left-0 text-black rounded-md cursor-pointer" data-v-f1f6182e>`);
      _push(ssrRenderComponent(unref(PhDiamondsFour), { size: 22 }, null, _parent));
      _push(`<span data-v-f1f6182e>Browse Categories</span>`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), {
        class: [{ "rotate-180": isDropdownOpen.value }, "h-4 w-4 ml-auto transition-transform duration-200"]
      }, null, _parent));
      _push(`</a>`);
      if (isDropdownOpen.value) {
        _push(`<div class="absolute left-0 mt-2 w-60 z-50 bg-white shadow-lg rounded-md" data-v-f1f6182e><ul class="py-2" data-v-f1f6182e><!--[-->`);
        ssrRenderList(__props.categories, (category) => {
          _push(`<li style="${ssrRenderStyle(category.status && category.status === "Active" ? null : { display: "none" })}" class="px-4 py-2 hover:bg-gray-100 cursor-pointer group flex items-center" data-v-f1f6182e>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: "/shop?category=" + category.slug,
            class: "group flex items-center w-full text-xs font-bold"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr(
                  "src",
                  category.image || "/placeholder.svg?height=24&width=24"
                )}${ssrRenderAttr("alt", category.name)} class="w-7 h-8 object-cover mr-2" data-v-f1f6182e${_scopeId}> ${ssrInterpolate(category.name)} `);
                if (category.sub_category && category.sub_category.length > 0) {
                  _push2(ssrRenderComponent(unref(ChevronDownIcon), { class: "h-4 w-4 ml-auto group-hover:rotate-180 transition-transform duration-200" }, null, _parent2, _scopeId));
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  createVNode("img", {
                    src: category.image || "/placeholder.svg?height=24&width=24",
                    alt: category.name,
                    class: "w-7 h-8 object-cover mr-2"
                  }, null, 8, ["src", "alt"]),
                  createTextVNode(" " + toDisplayString(category.name) + " ", 1),
                  category.sub_category && category.sub_category.length > 0 ? (openBlock(), createBlock(unref(ChevronDownIcon), {
                    key: 0,
                    class: "h-4 w-4 ml-auto group-hover:rotate-180 transition-transform duration-200"
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (category.sub_category && category.sub_category.length > 0) {
            _push(`<div class="absolute left-full mt-0 min-w-[12rem] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" data-v-f1f6182e><ul class="py-2" data-v-f1f6182e><!--[-->`);
            ssrRenderList(category.sub_category, (sub) => {
              _push(`<li class="px-4 py-2 hover:bg-gray-100 cursor-pointer" data-v-f1f6182e>`);
              _push(ssrRenderComponent(unref(Pe), {
                href: "/shop?category=" + category.slug + "&subcategory=" + sub.slug
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(sub.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(sub.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</li>`);
            });
            _push(`<!--]--></ul></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><ul class="header-main-menu flex !gap-[20px]" data-v-f1f6182e><li data-v-f1f6182e>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/",
        class: "text-black font-bold hover:text-gray-700 flex items-center text-sm menu-item [&::after]:w-0"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home `);
          } else {
            return [
              createTextVNode("Home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(props.categories.slice(0, 8), (item) => {
        var _a;
        _push(`<li class="relative group" data-v-f1f6182e>`);
        _push(ssrRenderComponent(unref(Pe), {
          href: `/shop?category=${item.slug}`,
          class: "menu-item [&::after]:w-0 text-black font-bold hover:text-gray-700 flex items-center text-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b;
            if (_push2) {
              _push2(`${ssrInterpolate(item.name)} `);
              if ((_a2 = item.sub_category) == null ? void 0 : _a2.length) {
                _push2(ssrRenderComponent(unref(ChevronDownIcon), { class: "h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createTextVNode(toDisplayString(item.name) + " ", 1),
                ((_b = item.sub_category) == null ? void 0 : _b.length) ? (openBlock(), createBlock(unref(ChevronDownIcon), {
                  key: 0,
                  class: "h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200"
                })) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
        if ((_a = item.sub_category) == null ? void 0 : _a.length) {
          _push(`<div class="absolute top-full left-0 mt-0 min-w-[12rem] bg-white shadow-lg rounded-b-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50" data-v-f1f6182e><ul class="py-2" data-v-f1f6182e><!--[-->`);
          ssrRenderList(item.sub_category, (subItem) => {
            _push(`<li class="menu-item [&amp;::after]:w-0 relative group/sub" data-v-f1f6182e>`);
            _push(ssrRenderComponent(unref(Pe), {
              href: `/shop?subcategory=${subItem.slug}`,
              class: "px-4 py-2 text-sm font-medium text-gray-900 hover:bg-orange-50 hover:text-black flex items-center justify-between"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(subItem.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(subItem.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--><li data-v-f1f6182e>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/shop",
        class: "menu-item [&::after]:w-0 text-black font-bold hover:text-gray-700 flex items-center text-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`All Products `);
          } else {
            return [
              createTextVNode("All Products ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul><div class="hidden lg:block" data-v-f1f6182e>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/hot-deals",
        class: "btn btn-success btn-sm flex items-center justify-center bg-black hover:bg-gray-700 text-white text-sm py-3 mx-auto px-4 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gift" viewBox="0 0 16 16" data-v-f1f6182e${_scopeId}><path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" data-v-f1f6182e${_scopeId}></path></svg><span class="ms-2" data-v-f1f6182e${_scopeId}>Hot Deals</span>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                fill: "currentColor",
                class: "bi bi-gift",
                viewBox: "0 0 16 16"
              }, [
                createVNode("path", { d: "M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" })
              ])),
              createVNode("span", { class: "ms-2" }, "Hot Deals")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></nav>`);
    };
  }
};
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/NavigationMenu.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const NavigationMenu = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["__scopeId", "data-v-f1f6182e"]]);
const axiosInstance = axios.create({
  baseURL: "https://admin.pre-flamingos.com/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});
axiosInstance.interceptors.request.use((config) => {
  const authToken = Cookies.get("authToken");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn("Token expired or invalid. Logging out...");
          Cookies.remove("authToken");
          window.location.href = "/login";
          break;
        case 500:
          console.error(
            "Server error:",
            error.response.data.message || "Internal Server Error"
          );
          break;
        case 404:
          console.error(
            "Not found:",
            error.response.data.message || "Resource not found"
          );
          break;
        default:
          console.error(
            "Error:",
            error.response.data.message || "An error occurred"
          );
      }
    } else {
      console.error("Network error:", error.message);
    }
    return Promise.reject(error);
  }
);
const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(!!Cookies.get("authToken"));
  const guestId = ref(null);
  const initGuestId = () => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("guest_id");
      if (storedId) {
        guestId.value = storedId;
      } else {
        const newId = `guest_${Date.now()}_${Math.floor(Math.random() * 1e4)}`;
        localStorage.setItem("guest_id", newId);
        guestId.value = newId;
      }
    }
  };
  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get("/user");
      user.value = response.data;
      console.log("Fetched user details:", user.value);
      isAuthenticated.value = true;
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
      user.value = null;
      isAuthenticated.value = false;
    }
  };
  const initAuth = async () => {
    if (typeof window !== "undefined") {
      initGuestId();
      if (isAuthenticated.value) {
        await fetchUserDetails();
      }
    }
  };
  onMounted(() => {
    initAuth();
  });
  const logout = () => {
    Cookies.remove("authToken");
    user.value = null;
    isAuthenticated.value = false;
    router.get("/");
    toast.success("Logged out successfully");
  };
  return {
    user,
    isAuthenticated,
    guestId,
    fetchUserDetails,
    logout,
    initAuth
    // Expose the init function to be called in App.vue
  };
});
const _sfc_main$R = {
  __name: "MobileMenu",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      default: () => []
      // Default to empty array to avoid undefined errors
    },
    isMobileMenuOpen: Boolean,
    toggleMobileMenu: Function,
    logo: String
  },
  setup(__props) {
    const authStore = useAuthStore();
    const openSubmenuIds = ref(/* @__PURE__ */ new Set());
    const isSubmenuOpen = (id) => {
      return openSubmenuIds.value.has(id);
    };
    const isDropdownOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PhDiamondsFour = resolveComponent("PhDiamondsFour");
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "bg-white" }, _attrs))}><div style="${ssrRenderStyle(__props.isMobileMenuOpen ? null : { display: "none" })}" class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-30"></div><div class="${ssrRenderClass([__props.isMobileMenuOpen ? "translate-x-0" : "-translate-x-full", "fixed top-0 left-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto"])}"><div class="p-4 mb-5 flex justify-between items-center"><button class="absolute z-[999] top-4 right-4 bg-gray-900 p-2 rounded text-white hover:bg-theme"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="relative"><button class="text-[16px] font-bold flex items-center gap-2 px-4 py-4 w-full text-gray-700 border-gray-200">`);
      _push(ssrRenderComponent(_component_PhDiamondsFour, { size: 22 }, null, _parent));
      _push(`<span>Browse Categories</span>`);
      _push(ssrRenderComponent(unref(ChevronDownIcon), {
        class: [{ "rotate-180": isDropdownOpen.value }, "h-5 w-5 ml-auto transition-transform duration-300"]
      }, null, _parent));
      _push(`</button>`);
      if (isDropdownOpen.value) {
        _push(`<div class="bg-white w-full shadow-md rounded-md"><ul class="py-2"><!--[-->`);
        ssrRenderList(__props.categories, (category) => {
          var _a, _b;
          _push(`<li style="${ssrRenderStyle(category.status && category.status === "Active" ? null : { display: "none" })}" class="border-b border-gray-100"><div class="flex items-center justify-between px-4 py-3 cursor-pointer text-gray-700 hover:text-theme font-bold">`);
          _push(ssrRenderComponent(unref(Pe), {
            href: "/shop?category=" + category.id,
            class: "flex items-center w-full font-bold"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<img${ssrRenderAttr(
                  "src",
                  category.image || "/placeholder.svg"
                )}${ssrRenderAttr("alt", category.name)} class="w-7 h-7 object-cover mr-2"${_scopeId}> ${ssrInterpolate(category.name)}`);
              } else {
                return [
                  createVNode("img", {
                    src: category.image || "/placeholder.svg",
                    alt: category.name,
                    class: "w-7 h-7 object-cover mr-2"
                  }, null, 8, ["src", "alt"]),
                  createTextVNode(" " + toDisplayString(category.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if ((_a = category.sub_category) == null ? void 0 : _a.length) {
            _push(ssrRenderComponent(unref(ChevronDownIcon), {
              class: [{
                "rotate-180": isSubmenuOpen(
                  category.id
                )
              }, "h-4 w-4"]
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (((_b = category.sub_category) == null ? void 0 : _b.length) && isSubmenuOpen(category.id)) {
            _push(`<ul class="bg-gray-50 pl-6 py-2"><!--[-->`);
            ssrRenderList(category.sub_category, (subcategory) => {
              _push(`<li style="${ssrRenderStyle(subcategory.status === "Active" ? null : { display: "none" })}" class="py-1">`);
              _push(ssrRenderComponent(unref(Pe), {
                href: "/shop?category=" + category.id + "&subcategory=" + subcategory.id,
                class: "text-gray-600 hover:text-theme text-sm"
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(subcategory.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(subcategory.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</li>`);
            });
            _push(`<!--]--></ul>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.categories.length) {
        _push(`<ul class="py-2"><li>`);
        _push(ssrRenderComponent(unref(Pe), {
          href: "/",
          class: "block p-4 rounded w-full text-left font-bold text-gray-900 hover:bg-gray-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Home`);
            } else {
              return [
                createTextVNode("Home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><!--[-->`);
        ssrRenderList(__props.categories, (item) => {
          var _a, _b;
          _push(`<li><div class="relative border-b border-gray-100"><div class="${ssrRenderClass([{ "text-theme": isSubmenuOpen(item.id) }, "flex items-center justify-between px-4 py-3 text-gray-700 hover:text-theme"])}">`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${item.slug}`,
            class: "flex-grow text-sm font-bold"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if ((_a = item.sub_category) == null ? void 0 : _a.length) {
            _push(`<button class="p-1 focus:outline-none">`);
            _push(ssrRenderComponent(unref(ChevronDownIcon), {
              class: ["h-4 w-4 transition-transform duration-200", {
                "rotate-180": isSubmenuOpen(item.id)
              }]
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if ((_b = item.sub_category) == null ? void 0 : _b.length) {
            _push(`<ul class="${ssrRenderClass([{
              "max-h-0": !isSubmenuOpen(item.id),
              "max-h-[1000px]": isSubmenuOpen(item.id)
            }, "bg-gray-50 overflow-hidden transition-all duration-300"])}"><!--[-->`);
            ssrRenderList(item.sub_category, (subItem) => {
              var _a2;
              _push(`<li class="border-t border-gray-100"><div class="flex items-center justify-between px-6 py-2 text-sm text-gray-600 hover:text-orange-500">`);
              _push(ssrRenderComponent(unref(Pe), {
                href: `/shop?category=${item.slug}&subcategory=${subItem.slug}`
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`${ssrInterpolate(subItem.name)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(subItem.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent));
              if ((_a2 = subItem.sub_category) == null ? void 0 : _a2.length) {
                _push(`<button class="p-1 focus:outline-none">`);
                _push(ssrRenderComponent(unref(ChevronDownIcon), {
                  class: ["h-4 w-4 transition-transform duration-200", {
                    "rotate-180": isSubmenuOpen(
                      subItem.id
                    )
                  }]
                }, null, _parent));
                _push(`</button>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></li>`);
            });
            _push(`<!--]--></ul>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></li>`);
        });
        _push(`<!--]--><li>`);
        _push(ssrRenderComponent(unref(Pe), {
          href: "/hot-deals",
          class: "flex items-center gap-2 p-4 rounded w-full text-left text-gray-900 hover:bg-gray-100"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gift" viewBox="0 0 16 16"${_scopeId}><path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z"${_scopeId}></path></svg><span class="ms-2 font-bold"${_scopeId}>Hot Deals</span>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "16",
                  height: "16",
                  fill: "currentColor",
                  class: "bi bi-gift",
                  viewBox: "0 0 16 16"
                }, [
                  createVNode("path", { d: "M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z" })
                ])),
                createVNode("span", { class: "ms-2 font-bold" }, "Hot Deals")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
        if (unref(authStore).isAuthenticated) {
          _push(`<li class="border-b border-gray-100">`);
          _push(ssrRenderComponent(unref(Pe), {
            href: "/account/orders",
            class: "flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-theme"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
                _push2(` ACCOUNT `);
              } else {
                return [
                  createVNode(unref(User), { class: "h-4 w-4 mr-2" }),
                  createTextVNode(" ACCOUNT ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li>`);
        } else {
          _push(`<li class="border-b border-gray-100">`);
          _push(ssrRenderComponent(unref(Pe), {
            href: "/login",
            class: "flex items-center px-4 py-3 text-sm font-bold text-gray-700 hover:text-theme"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { class: "h-4 w-4 mr-2" }, null, _parent2, _scopeId));
                _push2(` LOGIN / REGISTER `);
              } else {
                return [
                  createVNode(unref(User), { class: "h-4 w-4 mr-2" }),
                  createTextVNode(" LOGIN / REGISTER ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li>`);
        }
        _push(`</ul>`);
      } else {
        _push(`<div class="p-4 text-gray-600">No categories available</div>`);
      }
      _push(`</div></nav>`);
    };
  }
};
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/MobileMenu.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const useCartStore = defineStore("cartStore", () => {
  const cartItems = ref([]);
  const isCartOpen = ref(false);
  const page = ne();
  const authStore = useAuthStore();
  const is_direct_order = ref(false);
  const currencysymbol = ref("৳");
  const golobalLoading = ref(false);
  if (typeof window !== "undefined") {
    is_direct_order.value = localStorage.getItem("is_direct_order") === "true";
  }
  const setOrderType = (direct) => {
    is_direct_order.value = direct;
    if (typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", direct.toString());
    }
  };
  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };
  const goToCheckout = () => {
    setOrderType(false);
    isCartOpen.value = false;
    router.get("/checkout");
  };
  const cartOrder = () => {
    is_direct_order.value = false;
    if (typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", "false");
    }
  };
  const directOrder = () => {
    is_direct_order.value = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("is_direct_order", "true");
    }
  };
  const fetchCartItems = async () => {
    var _a;
    let userId = ((_a = authStore.user) == null ? void 0 : _a.id) || getGuestId();
    try {
      const response = await axiosInstance.get("/get-cart-items", {
        params: { user_id: userId }
      });
      cartItems.value = (response.data || []).map((item) => ({
        ...item,
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.quantity) || 0
      }));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const getGuestId = () => {
    if (typeof window === "undefined") return null;
    let guestId = localStorage.getItem("guest_id");
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem("guest_id", guestId);
    }
    return guestId;
  };
  watch(
    cartItems,
    (newCart) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(newCart));
      }
    },
    { deep: true }
  );
  watch(
    () => authStore.user,
    (user) => {
      if (user) {
        fetchCartItems();
      }
    },
    { immediate: true }
  );
  watch(
    () => page.url,
    () => {
      isCartOpen.value = false;
    }
  );
  const cartCount = computed(
    () => cartItems.value.reduce((total, item) => total + item.quantity, 0)
  );
  const cartTotalPrice = computed(() => {
    return cartItems.value.reduce((sum, item) => {
      const cleanPrice = item.final_price.replace(/,/g, "");
      const parsedPrice = parseFloat(cleanPrice);
      return sum + parsedPrice;
    }, 0).toFixed(2);
  });
  const syncCartIncrement = async (cartId, productId) => {
    var _a, _b;
    const userId = ((_a = authStore.user) == null ? void 0 : _a.id) || getGuestId();
    try {
      golobalLoading.value = true;
      const response = await axiosInstance.post(`/cart/sync`, {
        cart_id: cartId,
        product_id: productId,
        user_id: userId,
        quantity: 1
      });
      if (response.data.success) {
        if ((_b = response.data.data) == null ? void 0 : _b.status) {
          toast.success(response.data.data.message || "Item added to cart successfully!");
          await fetchCartItems();
        } else {
          toast.error("Not enough stock available.");
        }
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast.error("An error occurred while syncing the cart.");
    } finally {
      golobalLoading.value = false;
    }
  };
  const syncCartDecrement = async (cartId, productId, currentQuantity) => {
    var _a, _b;
    if (currentQuantity <= 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }
    const userId = ((_a = authStore.user) == null ? void 0 : _a.id) || getGuestId();
    try {
      golobalLoading.value = true;
      const response = await axiosInstance.post(`/cart/sync`, {
        cart_id: cartId,
        product_id: productId,
        user_id: userId,
        quantity: -1
      });
      if (response.data.success) {
        if ((_b = response.data.data) == null ? void 0 : _b.status) {
          toast.success(response.data.data.message || "Cart updated successfully!");
          await fetchCartItems();
        } else {
          toast.error("Not enough stock available.");
        }
      } else {
        toast.error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
      toast.error("An error occurred while updating the cart.");
    } finally {
      golobalLoading.value = false;
    }
  };
  const removeItem = async (cartId) => {
    var _a;
    const userId = ((_a = authStore.user) == null ? void 0 : _a.id) || getGuestId();
    try {
      golobalLoading.value = true;
      await axiosInstance.delete(`/cart/remove`, {
        params: { cart_id: cartId, user_id: userId }
      });
      toast.success("Removed Cart");
      await fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      golobalLoading.value = false;
    }
  };
  onMounted(fetchCartItems);
  return {
    cartItems,
    fetchCartItems,
    cartCount,
    cartTotalPrice,
    syncCartIncrement,
    syncCartDecrement,
    removeItem,
    isCartOpen,
    toggleCart,
    setOrderType,
    is_direct_order,
    goToCheckout,
    cartOrder,
    directOrder,
    golobalLoading,
    currencysymbol
  };
});
const _sfc_main$Q = {
  __name: "CartSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const emptyCartIcon = ref("/assets/images/icons/empty-cart.png");
    const cartStore = useCartStore();
    onMounted(() => {
      cartStore.fetchCartItems();
    });
    const cartItems = computed(() => cartStore.cartItems);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (unref(cartStore).isCartOpen) {
        _push(`<div class="fixed inset-0 bg-black bg-opacity-50 z-40"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "translate-x-0": unref(cartStore).isCartOpen, "translate-x-full": !unref(cartStore).isCartOpen }, "fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300"])}"><div class="p-4 flex justify-between items-center border-b"><h2 class="text-xl font-semibold">Shopping cart</h2><button class="flex items-center text-gray-600 hover:text-gray-800"><span class="text-2xl mr-1">`);
      _push(ssrRenderComponent(unref(PhX), { size: 28 }, null, _parent));
      _push(`</span> Close </button></div><div class="p-4 overflow-y-auto h-full pb-[235px]">`);
      if (cartItems.value.length === 0) {
        _push(`<div class="text-center text-gray-600"><div class="mb-4 w-full pt-5 flex justify-center items-center h-full"><img${ssrRenderAttr("src", emptyCartIcon.value)} alt="Empty Cart" class="mx-auto w-[200px] mb-4"></div> Your cart is empty. </div>`);
      } else {
        _push(`<div><!--[-->`);
        ssrRenderList(cartItems.value, (item) => {
          _push(`<div class="flex items-start space-x-3 mb-4"><div class="w-20 h-20 bg-gray-100 rounded"><img${ssrRenderAttr("src", item.product.featured_image)}${ssrRenderAttr("alt", item.product.product_name)} class="w-full h-full object-cover rounded"></div><div class="flex-1"><h3 class="text-sm font-medium mb-2">${ssrInterpolate(item.product.product_name)} - <!--[-->`);
          ssrRenderList(item.attributes, (attribute) => {
            _push(`<span class="mr-2">${ssrInterpolate(attribute.attribute_option)}</span>`);
          });
          _push(`<!--]--></h3><div class="flex text-[13px] items-center text-gray-600"><span>${ssrInterpolate(item.quantity)} × </span><span class="text-theme ml-1">${ssrInterpolate(item.individual_price)}${ssrInterpolate(unref(cartStore).currencysymbol)}</span></div></div><button class="text-gray-400 hover:text-gray-600 text-xl">`);
          _push(ssrRenderComponent(unref(PhX), { size: 28 }, null, _parent));
          _push(`</button></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="fixed bottom-0 left-0 right-0 p-4 border-t bg-white"><div class="flex justify-between items-center mb-4"><span class="text-gray-600">Subtotal:</span><span class="text-theme font-semibold">${ssrInterpolate(unref(cartStore).cartTotalPrice)}<span class="bangla-font">${ssrInterpolate(unref(cartStore).currencysymbol)}</span></span></div><div class="space-y-3">`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/cart",
        class: "w-full block text-center bg-gray-200 text-gray-800 text-sm font-semibold py-3 rounded hover:bg-gray-300 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` VIEW CART `);
          } else {
            return [
              createTextVNode(" VIEW CART ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button${ssrIncludeBooleanAttr(cartItems.value.length === 0) ? " disabled" : ""} class="${ssrRenderClass([cartItems.value.length === 0 ? "opacity-50 cursor-not-allowed" : "", "w-full block text-center bg-theme text-white py-3 text-sm font-semibold rounded hover:bg-secondary transition"])}"> CHECKOUT </button></div></div></div></div>`);
    };
  }
};
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/CartSidebar.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const useHomeStore = defineStore("homeStore", () => {
  const products = ref([]);
  const categories = ref([]);
  const sliders = ref([]);
  const featureProducts = ref([]);
  const compaigns = ref([]);
  const siteinfos = ref([]);
  const categoryName = ref("");
  const logo = ref("");
  const isFetched = ref(false);
  const isFetchedGetAllProducts = ref(false);
  const homePreloader = ref(false);
  const marketing = ref([]);
  const relatedProducts = ref([]);
  const videoProducts = ref([]);
  const categoriesWithProducts = ref({});
  const isFetchedCategoriesWithProducts = ref(false);
  const $axios = inject("$axios");
  const fetchData = async () => {
    var _a, _b, _c, _d, _e;
    if (isFetched.value) return;
    try {
      homePreloader.value = true;
      const response = await $axios.get("/home");
      if (((_b = (_a = response.data.siteinfos) == null ? void 0 : _a.media) == null ? void 0 : _b.length) > 0) {
        logo.value = response.data.siteinfos.media[0].logo;
      }
      categories.value = response.data.categories || [];
      sliders.value = response.data.sliders || [];
      featureProducts.value = ((_c = response.data.featureProducts) == null ? void 0 : _c.slice(0, 10)) || [];
      videoProducts.value = response.data.videoProducts || [];
      compaigns.value = response.data.compaigns || [];
      siteinfos.value = response.data.siteinfos || [];
      if (((_e = (_d = response.data.siteinfos) == null ? void 0 : _d.marketing) == null ? void 0 : _e.length) > 0) {
        marketing.value = response.data.siteinfos.marketing;
      }
      isFetched.value = true;
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      homePreloader.value = false;
    }
  };
  const fetchGetAllProducts = async () => {
    if (isFetchedGetAllProducts.value) return;
    try {
      const response = await $axios.get("/get-all-products");
      products.value = response.data || [];
      isFetchedGetAllProducts.value = true;
    } catch (error) {
      console.error("Error fetching home data:", error);
    }
  };
  const fetchCategoriesWithProducts = async (forceRefresh = false) => {
    if (isFetchedCategoriesWithProducts.value && !forceRefresh) return;
    try {
      const response = await $axios.get("/category-with-products");
      categoriesWithProducts.value = response.data || [];
      isFetchedCategoriesWithProducts.value = true;
    } catch (error) {
      console.error("Error fetching categories with products:", error);
      isFetchedCategoriesWithProducts.value = false;
    }
  };
  const fetchRelatedProducts = async (category) => {
    try {
      const response = await $axios.get(`/product-category/${category}`);
      relatedProducts.value = response.data.data || [];
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };
  onMounted(() => {
    if (!isFetched.value) {
      fetchData();
    }
    if (!isFetchedCategoriesWithProducts.value) {
      fetchCategoriesWithProducts();
    }
    if (!isFetchedGetAllProducts.value) {
      fetchGetAllProducts();
    }
  });
  return {
    products,
    categories,
    sliders,
    featureProducts,
    compaigns,
    categoryName,
    fetchData,
    siteinfos,
    isFetched,
    homePreloader,
    logo,
    marketing,
    fetchRelatedProducts,
    videoProducts,
    relatedProducts,
    // categoryGroups,
    // fetchCategoryGroupData,
    // isLoadingCategoryGroups,
    categoriesWithProducts,
    // Expose the new property
    fetchCategoriesWithProducts,
    // Expose the fetch function
    isFetchedCategoriesWithProducts
    // Expose the fetched flag
  };
});
const useWishlistStore = defineStore("wishlistStore", () => {
  const wishlist = ref([]);
  const loading = ref(true);
  const error = ref(null);
  const whishlistCount = ref(0);
  const authStore = useAuthStore();
  const fetchWishlist = async () => {
    loading.value = true;
    try {
      const response = await axiosInstance.get("/wishlist");
      wishlist.value = response.data;
      whishlistCount.value = response.data.length;
    } catch (err) {
      error.value = "Failed to load wishlist items.";
      toast.error(error.value);
    } finally {
      loading.value = false;
    }
  };
  const addToWishlist = async (productId) => {
    var _a;
    try {
      await axiosInstance.post("/wishlist", {
        product_id: productId
      });
      toast.success("Added to wishlist");
      await fetchWishlist();
    } catch (err) {
      if (((_a = err.response) == null ? void 0 : _a.status) === 409) {
        toast.error("Already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  };
  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/${productId}`);
      toast.success("Removed from wishlist");
      await fetchWishlist();
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };
  watch(
    () => authStore.user,
    (newUser) => {
      if (newUser) {
        fetchWishlist();
      } else {
        wishlist.value = [];
        whishlistCount.value = 0;
      }
    },
    { immediate: true }
  );
  return {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    whishlistCount,
    loading,
    error
  };
});
const _sfc_main$P = {
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const homeStore = useHomeStore();
    useWishlistStore();
    inject("$axios");
    const categories = computed(() => homeStore.categories);
    const isMobileMenuOpen = ref(false);
    const toggleMobileMenu = () => {
      isMobileMenuOpen.value = !isMobileMenuOpen.value;
    };
    const siteinfos = computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a[0]) || {};
    });
    const storePhone = computed(() => siteinfos.value.store_phone_number || "N/A");
    const facebookUrl = computed(() => siteinfos.value.facebook_url || "#");
    const instagramUrl = computed(() => siteinfos.value.instagram_url || "#");
    const youtubeUrl = computed(() => siteinfos.value.youtube_url || "#");
    const tiktokUrl = computed(() => siteinfos.value.tiktok_url || "#");
    const xUrl = computed(() => siteinfos.value.x_url || "#");
    console.log("hello wor", siteinfos.value);
    const searchQuery = ref("");
    const searchInput = ref(null);
    const showDropdown = ref(false);
    const isLoading = ref(false);
    const selectedCategory = ref("All");
    const selectedCategorySlug = ref(null);
    const isSearchOpen = ref(false);
    const isCategoryDropdownOpen = ref(false);
    const handleCategoryClickOutside = (event) => {
      const categoryDropdowns = document.querySelectorAll(".category-dropdown");
      let shouldClose = true;
      categoryDropdowns.forEach((dropdown) => {
        if (dropdown && dropdown.contains(event.target)) {
          shouldClose = false;
        }
      });
      if (shouldClose) {
        isCategoryDropdownOpen.value = false;
      }
    };
    const filteredProducts = ref([]);
    const handleClickOutside = (event) => {
      if (searchInput.value && !searchInput.value.contains(event.target)) {
        showDropdown.value = false;
      }
    };
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("click", handleCategoryClickOutside);
    });
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("click", handleCategoryClickOutside);
    });
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="bg-black text-white text-[14px] py-2" data-v-efc958b3><div class="container mx-auto sm:block md:flex justify-between" data-v-efc958b3><ul class="list-none flex gap-3 phonecustom" data-v-efc958b3><li class="flex gap-3 items-center" data-v-efc958b3><span data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15px" data-v-efc958b3><path fill="#fff" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" data-v-efc958b3></path></svg></span><span data-v-efc958b3>${ssrInterpolate(storePhone.value)}</span></li></ul><ul class="list-none flex gap-3 justify-between items-center customheadercontact" data-v-efc958b3><div class="flex" data-v-efc958b3><li class="flex gap-3 items-center" data-v-efc958b3><span data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="15px" data-v-efc958b3><path fill="#fff" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" data-v-efc958b3></path></svg></span><span class="" data-v-efc958b3>join our group for more offer</span></li></div><div class="flex items-center gap-3" data-v-efc958b3><li class="flex gap-3 items-center tooltip" data-v-efc958b3><a${ssrRenderAttr("href", facebookUrl.value)} data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="10px" data-v-efc958b3><path fill="#fff" d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" data-v-efc958b3></path></svg></a><span class="tooltiptext" data-v-efc958b3>facebook</span></li><li class="flex gap-3 items-center tooltip" data-v-efc958b3><a${ssrRenderAttr("href", instagramUrl.value)} data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18px" data-v-efc958b3><path fill="#fff" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" data-v-efc958b3></path></svg></a><div class="tooltiptext" data-v-efc958b3>instagram</div></li><li class="flex gap-3 items-center tooltip" data-v-efc958b3><a${ssrRenderAttr("href", youtubeUrl.value)} data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18px" data-v-efc958b3><path fill="#fff" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" data-v-efc958b3></path></svg></a><div class="tooltiptext" data-v-efc958b3>youtube</div></li><li class="flex gap-3 items-center tooltip" data-v-efc958b3><a${ssrRenderAttr("href", xUrl.value)} data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18px" data-v-efc958b3><path fill="#fff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" data-v-efc958b3></path></svg></a><div class="tooltiptext" data-v-efc958b3>x</div></li><li class="flex gap-3 items-center tooltip" data-v-efc958b3><a${ssrRenderAttr("href", tiktokUrl.value)} data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18px" data-v-efc958b3><path fill="#fff" d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" data-v-efc958b3></path></svg></a><div class="tooltiptext" data-v-efc958b3>tiktok</div></li></div></ul></div></div><header class="w-full border-b border-gray-200 sticky top-0 bg-white z-10 header" data-v-efc958b3><div class="sticky top-0 z-50" data-v-efc958b3><div class="bg-[#fff] text-white hidden lg:block" data-v-efc958b3><div class="container mx-auto" data-v-efc958b3><div class="flex items-center justify-between h-20" data-v-efc958b3><div class="logo_area w-1/4" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(Pe), { href: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(homeStore).logo) {
              _push2(`<img${ssrRenderAttr("src", unref(homeStore).logo)} alt="Site Logo" class="h-20 w-auto" data-v-efc958b3${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(homeStore).logo ? (openBlock(), createBlock("img", {
                key: 0,
                src: unref(homeStore).logo,
                alt: "Site Logo",
                class: "h-20 w-auto"
              }, null, 8, ["src"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="search_input w-2/5" data-v-efc958b3><div class="relative" data-v-efc958b3><div class="px-4 py-4 relative" data-v-efc958b3><div class="flex items-center" data-v-efc958b3><form class="flex w-full relative border border-theme rounded-md" data-v-efc958b3><div class="relative transition-all category-dropdown" data-v-efc958b3><button type="button" class="flex items-center text-gray-800 px-4 h-10 text-sm border-r border-theme" data-v-efc958b3>${ssrInterpolate(selectedCategory.value)} `);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 ml-1 text-gray-400" }, null, _parent));
      _push(`</button><div style="${ssrRenderStyle(isCategoryDropdownOpen.value ? null : { display: "none" })}" class="absolute left-0 top-full mt-1 w-56 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-[100]" data-v-efc958b3><div class="px-4 py-2 text-black hover:bg-gray-200 cursor-pointer text-sm" data-v-efc958b3> All </div><!--[-->`);
      ssrRenderList(categories.value, (category) => {
        _push(`<div data-v-efc958b3><div class="px-4 py-2 text-black z-40 hover:bg-gray-200 cursor-pointer text-sm font-medium" data-v-efc958b3>${ssrInterpolate(category.name)}</div>`);
        if (category.sub_category && category.sub_category.length > 0) {
          _push(`<div data-v-efc958b3><!--[-->`);
          ssrRenderList(category.sub_category, (sub) => {
            _push(`<div class="px-6 py-1.5 text-gray-600 hover:bg-gray-300 cursor-pointer text-sm" data-v-efc958b3> - ${ssrInterpolate(sub.name)}</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><input type="text" placeholder="Search products..."${ssrRenderAttr("value", searchQuery.value)} class="w-full h-10 text-gray-900 px-4 outline-none search-input" data-v-efc958b3><button type="submit" class="text-white bg-theme h-10 px-5 flex items-center justify-center rounded-r-md" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(SearchIcon), { class: "h-5 w-5" }, null, _parent));
      _push(`</button></form></div>`);
      if (showDropdown.value && searchQuery.value.length > 2) {
        _push(`<div class="bg-white absolute left-0 right-0 shadow-lg mt-1 w-full z-[51] mr-4 rounded-md overflow-hidden" data-v-efc958b3>`);
        if (isLoading.value) {
          _push(`<div class="p-4 text-center text-gray-900" data-v-efc958b3><div class="flex justify-center" data-v-efc958b3><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white" data-v-efc958b3></div></div></div>`);
        } else if (filteredProducts.value.length > 0) {
          _push(`<ul class="max-h-96 overflow-y-auto" data-v-efc958b3><!--[-->`);
          ssrRenderList(filteredProducts.value, (product) => {
            _push(`<li class="hover:bg-gray-200 border-b border-gray-300" data-v-efc958b3>`);
            _push(ssrRenderComponent(unref(Pe), {
              class: "flex items-center p-3 space-x-4",
              href: `/product/${product.slug}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<img${ssrRenderAttr(
                    "src",
                    product.featured_image || "/placeholder.svg"
                  )}${ssrRenderAttr(
                    "alt",
                    product.product_name
                  )} class="w-14 h-14 rounded-md object-cover" data-v-efc958b3${_scopeId}><div class="flex-grow" data-v-efc958b3${_scopeId}><p class="font-medium text-black" data-v-efc958b3${_scopeId}>${ssrInterpolate(product.product_name)}</p></div>`);
                } else {
                  return [
                    createVNode("img", {
                      src: product.featured_image || "/placeholder.svg",
                      alt: product.product_name,
                      class: "w-14 h-14 rounded-md object-cover"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "flex-grow" }, [
                      createVNode("p", { class: "font-medium text-black" }, toDisplayString(product.product_name), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else if (searchQuery.value.length > 0) {
          _push(`<div class="p-4 text-center text-gray-400" data-v-efc958b3> No products found </div>`);
        } else {
          _push(`<!---->`);
        }
        if (filteredProducts.value.length > 0) {
          _push(`<div class="p-3 border-t border-gray-200 text-center" data-v-efc958b3>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?search=${searchQuery.value}${selectedCategorySlug.value ? "&category=" + selectedCategorySlug.value : ""}`,
            class: "text-sm text-black hover:underline hover:text-theme"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View all results `);
              } else {
                return [
                  createTextVNode(" View all results ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="right_icons w-1/4" data-v-efc958b3><div class="flex items-center justify-end space-x-4" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/order-tracking",
        class: "text-black hover:text-gray-900 tooltip focus:outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MapPin), null, null, _parent2, _scopeId));
            _push2(`<div class="tooltiptext" data-v-efc958b3${_scopeId}>Order Track</div>`);
          } else {
            return [
              createVNode(unref(MapPin)),
              createVNode("div", { class: "tooltiptext" }, "Order Track")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!unref(authStore).isAuthenticated) {
        _push(ssrRenderComponent(unref(Pe), {
          href: "/login",
          class: "text-black hover:text-gray-900 focus:outline-none relative group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(UserRound), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(`<div class="absolute -right-[48px] top-full mt-1 w-32 bg-white shadow-lg rounded-md z-[999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" data-v-efc958b3${_scopeId}><div class="p-2 text-center" data-v-efc958b3${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Pe), {
                href: "/login",
                class: "text-sm text-gray-900 hover:text-[#000] block py-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Sign In`);
                  } else {
                    return [
                      createTextVNode("Sign In")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Pe), {
                href: "/register",
                class: "text-sm text-gray-900 hover:text-[#000] block py-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Register`);
                  } else {
                    return [
                      createTextVNode("Register")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                createVNode(unref(UserRound), { class: "w-6 h-6" }),
                createVNode("div", { class: "absolute -right-[48px] top-full mt-1 w-32 bg-white shadow-lg rounded-md z-[999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" }, [
                  createVNode("div", { class: "p-2 text-center" }, [
                    createVNode(unref(Pe), {
                      href: "/login",
                      class: "text-sm text-gray-900 hover:text-[#000] block py-1"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Sign In")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Pe), {
                      href: "/register",
                      class: "text-sm text-gray-900 hover:text-[#000] block py-1"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Register")
                      ]),
                      _: 1
                    })
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(unref(Pe), {
          href: "/account/orders",
          class: "text-black hover:text-gray-900 focus:outline-none relative group"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(UserRound), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(`<div class="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-md z-[999999999999999999999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" data-v-efc958b3${_scopeId}><div class="p-2 text-center" data-v-efc958b3${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Pe), {
                href: "/account/orders",
                class: "text-sm text-gray-800 hover:text-[#000] block py-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`My Account `);
                  } else {
                    return [
                      createTextVNode("My Account ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Pe), {
                href: "/account/orders",
                class: "text-sm text-gray-800 hover:text-[#000] block py-1"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Orders `);
                  } else {
                    return [
                      createTextVNode("Orders ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<button class="text-sm text-gray-800 hover:text-[#000] block py-1 w-full" data-v-efc958b3${_scopeId}> Sign Out </button></div></div>`);
            } else {
              return [
                createVNode(unref(UserRound), { class: "w-6 h-6" }),
                createVNode("div", { class: "absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-md z-[999999999999999999999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" }, [
                  createVNode("div", { class: "p-2 text-center" }, [
                    createVNode(unref(Pe), {
                      href: "/account/orders",
                      class: "text-sm text-gray-800 hover:text-[#000] block py-1"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("My Account ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Pe), {
                      href: "/account/orders",
                      class: "text-sm text-gray-800 hover:text-[#000] block py-1"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Orders ")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      onClick: unref(authStore).logout,
                      class: "text-sm text-gray-800 hover:text-[#000] block py-1 w-full"
                    }, " Sign Out ", 8, ["onClick"])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(unref(Pe), {
        href: "/cart",
        class: "relative"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShoppingBag), { class: "w-6 h-6 text-black" }, null, _parent2, _scopeId));
            _push2(`<span class="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" data-v-efc958b3${_scopeId}>${ssrInterpolate(unref(cartStore).cartCount)}</span>`);
          } else {
            return [
              createVNode(unref(ShoppingBag), { class: "w-6 h-6 text-black" }),
              createVNode("span", { class: "absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" }, toDisplayString(unref(cartStore).cartCount), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div><div class="border-t border-gray-200 hidden lg:block shadow-md" data-v-efc958b3><div class="container bg-[#fff] rounded-md mx-auto px-0" data-v-efc958b3><div class="" data-v-efc958b3>`);
      _push(ssrRenderComponent(NavigationMenu, { categories: categories.value }, null, _parent));
      _push(`</div></div></div></div>`);
      if (isSearchOpen.value) {
        _push(`<div class="fixed lg:hidden inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" data-v-efc958b3></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([isSearchOpen.value ? "translate-y-0" : "-translate-y-full", "fixed lg:hidden top-0 left-0 right-0 bg-[#000] transform transition-transform duration-300 z-50"])}" data-v-efc958b3><div class="container mx-auto px-4 py-4" data-v-efc958b3><div class="flex items-center" data-v-efc958b3><form class="flex w-full relative" data-v-efc958b3><div class="relative transition-all category-dropdown" data-v-efc958b3><button type="button" class="flex items-center bg-gray-800 text-white px-4 h-10 text-sm border-r border-gray-700" data-v-efc958b3>${ssrInterpolate(selectedCategory.value)} `);
      _push(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4 ml-1 text-gray-400" }, null, _parent));
      _push(`</button><div style="${ssrRenderStyle(isCategoryDropdownOpen.value ? null : { display: "none" })}" class="absolute left-0 top-full mt-1 w-56 bg-gray-800 shadow-lg rounded-md z-50 max-h-60 overflow-y-auto" data-v-efc958b3><div class="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer text-sm" data-v-efc958b3> All </div><!--[-->`);
      ssrRenderList(categories.value, (category) => {
        _push(`<div data-v-efc958b3><div class="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer text-sm font-medium" data-v-efc958b3>${ssrInterpolate(category.name)}</div>`);
        if (category.sub_category && category.sub_category.length > 0) {
          _push(`<div data-v-efc958b3><!--[-->`);
          ssrRenderList(category.sub_category, (sub) => {
            _push(`<div class="px-6 py-1.5 text-gray-300 hover:bg-gray-700 cursor-pointer text-sm" data-v-efc958b3> - ${ssrInterpolate(sub.name)}</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div><input type="text" placeholder="Search products..."${ssrRenderAttr("value", searchQuery.value)} class="w-full h-10 bg-gray-800 text-white px-4 outline-none search-input" data-v-efc958b3><button type="submit" class="bg-white text-[#000] h-10 px-5 flex items-center justify-center" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(SearchIcon), { class: "h-5 w-5" }, null, _parent));
      _push(`</button><button type="button" class="ml-2 text-white hover:text-gray-300 focus:outline-none" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(X), { class: "h-6 w-6" }, null, _parent));
      _push(`</button></form></div>`);
      if (showDropdown.value && searchQuery.value.length > 2) {
        _push(`<div class="bg-gray-800 shadow-lg mt-1 w-full z-[51] rounded-md overflow-hidden" data-v-efc958b3>`);
        if (isLoading.value) {
          _push(`<div class="p-4 text-center text-gray-400" data-v-efc958b3><div class="flex justify-center" data-v-efc958b3><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white" data-v-efc958b3></div></div></div>`);
        } else if (filteredProducts.value.length > 0) {
          _push(`<ul class="max-h-96 overflow-y-auto" data-v-efc958b3><!--[-->`);
          ssrRenderList(filteredProducts.value, (product) => {
            _push(`<li class="hover:bg-gray-700 border-b border-gray-700" data-v-efc958b3>`);
            _push(ssrRenderComponent(unref(Pe), {
              class: "flex items-center p-3 space-x-4",
              href: `/product/${product.slug}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<img${ssrRenderAttr(
                    "src",
                    product.featured_image || "/placeholder.svg"
                  )}${ssrRenderAttr("alt", product.product_name)} class="w-14 h-14 rounded-md object-cover" data-v-efc958b3${_scopeId}><div class="flex-grow" data-v-efc958b3${_scopeId}><p class="font-medium text-white" data-v-efc958b3${_scopeId}>${ssrInterpolate(product.product_name)}</p></div>`);
                } else {
                  return [
                    createVNode("img", {
                      src: product.featured_image || "/placeholder.svg",
                      alt: product.product_name,
                      class: "w-14 h-14 rounded-md object-cover"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "flex-grow" }, [
                      createVNode("p", { class: "font-medium text-white" }, toDisplayString(product.product_name), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</li>`);
          });
          _push(`<!--]--></ul>`);
        } else if (searchQuery.value.length > 0) {
          _push(`<div class="p-4 text-center text-gray-400" data-v-efc958b3> No products found </div>`);
        } else {
          _push(`<!---->`);
        }
        if (filteredProducts.value.length > 0) {
          _push(`<div class="p-3 border-t border-gray-700 text-center" data-v-efc958b3>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?search=${searchQuery.value}${selectedCategorySlug.value ? "&category=" + selectedCategorySlug.value : ""}`,
            class: "text-sm text-white hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View all results `);
              } else {
                return [
                  createTextVNode(" View all results ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="bg-[#fff] text-white lg:hidden z-[9999999999999999]" data-v-efc958b3><div class="px-4 py-3" data-v-efc958b3><div class="flex items-center justify-between" data-v-efc958b3><button class="text-[#000] hover:text-gray-900 focus:outline-none" data-v-efc958b3><svg xmlns="http://www.w3.org/2000/svg" width="30" height="16" viewBox="0 0 30 16" fill="currentColor" data-v-efc958b3><rect width="30" height="1.5" data-v-efc958b3></rect><rect y="7" width="20" height="1.5" data-v-efc958b3></rect><rect y="14" width="30" height="1.5" data-v-efc958b3></rect></svg></button>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/",
        class: "mx-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(homeStore).logo) {
              _push2(`<img${ssrRenderAttr("src", unref(homeStore).logo)} alt="logo" class="h-10" data-v-efc958b3${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(homeStore).logo ? (openBlock(), createBlock("img", {
                key: 0,
                src: unref(homeStore).logo,
                alt: "logo",
                class: "h-10"
              }, null, 8, ["src"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-5" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/order-tracking",
        class: "text-black hover:text-gray-900 focus:outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(MapPin), null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(MapPin))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Pe), {
        href: "/cart",
        class: "relative"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShoppingBag), { class: "w-6 h-6 text-black" }, null, _parent2, _scopeId));
            _push2(`<span class="absolute -top-2 -right-2 bg-black text-[#fff] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" data-v-efc958b3${_scopeId}>${ssrInterpolate(unref(cartStore).cartCount)}</span>`);
          } else {
            return [
              createVNode(unref(ShoppingBag), { class: "w-6 h-6 text-black" }),
              createVNode("span", { class: "absolute -top-2 -right-2 bg-black text-[#fff] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold" }, toDisplayString(unref(cartStore).cartCount), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
      _push(ssrRenderComponent(_sfc_main$R, {
        categories: categories.value,
        isMobileMenuOpen: isMobileMenuOpen.value,
        toggleMobileMenu,
        logo: unref(homeStore).logo
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$Q, null, null, _parent));
      _push(`</header><div class="footer_mobile_bottom_bar fixed z-[9] bottom-0 left-0 right-0 bg-[#fff] border-t border-gray-200 lg:hidden" data-v-efc958b3><div class="container mx-auto px-4" data-v-efc958b3><div class="flex items-center justify-between h-16 bg-[#fff] border-t border-gray-200" data-v-efc958b3><div class="item grid place-items-center" data-v-efc958b3><button href="/account/orders" class="text-[#000] hover:text-gray-900 focus:outline-none" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(Menu), { class: "w-6 h-6" }, null, _parent));
      _push(`</button><p class="text-sm" data-v-efc958b3>Menu</p></div><div class="item grid place-items-center" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/",
        class: "text-[#000] hover:text-gray-900 focus:outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(House), { class: "w-6 h-6" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(House), { class: "w-6 h-6" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-sm" data-v-efc958b3>Home</p></div><div class="item grid place-items-center" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/account/orders",
        class: "text-[#000] hover:text-gray-900 focus:outline-none"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(UserRound), { class: "w-6 h-6" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(UserRound), { class: "w-6 h-6" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-sm" data-v-efc958b3>Account</p></div><div class="item grid place-items-center" data-v-efc958b3><button href="/account/orders" class="text-[#000] hover:text-gray-900 focus:outline-none" data-v-efc958b3>`);
      _push(ssrRenderComponent(unref(SearchIcon), { class: "w-6 h-6" }, null, _parent));
      _push(`</button><p class="text-sm" data-v-efc958b3>Search</p></div></div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Header/Header.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["__scopeId", "data-v-efc958b3"]]);
const _sfc_main$O = {
  __name: "FeatureSection",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8" }, _attrs))} data-v-130ce9ed><div class="container mx-auto px-4" data-v-130ce9ed><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-v-130ce9ed><div class="flex items-center bg-white rounded-lg p-4 shadow-sm" data-v-130ce9ed><div class="flex-shrink-0 mr-4" data-v-130ce9ed><div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center" data-v-130ce9ed>`);
      _push(ssrRenderComponent(unref(ThumbsUp), { class: "w-6 h-6 text-gray-700" }, null, _parent));
      _push(`</div></div><div data-v-130ce9ed><h3 class="font-medium text-gray-800" data-v-130ce9ed>হাই-কোয়ালিটি পণ্য</h3><p class="text-sm text-gray-600" data-v-130ce9ed>Enjoy top quality items for less</p></div></div><div class="flex items-center bg-white rounded-lg p-4 shadow-sm" data-v-130ce9ed><div class="flex-shrink-0 mr-4" data-v-130ce9ed><div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center" data-v-130ce9ed>`);
      _push(ssrRenderComponent(unref(Headphones), { class: "w-6 h-6 text-gray-700" }, null, _parent));
      _push(`</div></div><div data-v-130ce9ed><h3 class="font-medium text-gray-800" data-v-130ce9ed>২৪/৭ লাইভ চ্যাট</h3><p class="text-sm text-gray-600" data-v-130ce9ed>Get instant assistance</p></div></div><div class="flex items-center bg-white rounded-lg p-4 shadow-sm" data-v-130ce9ed><div class="flex-shrink-0 mr-4" data-v-130ce9ed><div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center" data-v-130ce9ed>`);
      _push(ssrRenderComponent(unref(Truck), { class: "w-6 h-6 text-gray-700" }, null, _parent));
      _push(`</div></div><div data-v-130ce9ed><h3 class="font-medium text-gray-800" data-v-130ce9ed>এক্সপ্রেস শিপিং</h3><p class="text-sm text-gray-600" data-v-130ce9ed>Fast &amp; reliable delivery options</p></div></div><div class="flex items-center bg-white rounded-lg p-4 shadow-sm" data-v-130ce9ed><div class="flex-shrink-0 mr-4" data-v-130ce9ed><div class="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center" data-v-130ce9ed>`);
      _push(ssrRenderComponent(unref(Lock), { class: "w-6 h-6 text-gray-700" }, null, _parent));
      _push(`</div></div><div data-v-130ce9ed><h3 class="font-medium text-gray-800" data-v-130ce9ed>সিকিউর্ড পেমেন্ট</h3><p class="text-sm text-gray-600" data-v-130ce9ed>Multiple safe payment methods</p></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Footer/FeatureSection.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const _sfc_main$N = {
  __name: "WhatsApp",
  __ssrInlineRender: true,
  setup(__props) {
    const isOpen = ref(false);
    computed(() => {
      isOpen.value = !isOpen.value;
    });
    const homeStore = useHomeStore();
    console.log("shu", homeStore.siteinfos);
    const whatsappNumber = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = homeStore.siteinfos) == null ? void 0 : _a[0]) == null ? void 0 : _b.whatsapp_number) || null;
      }
    );
    console.log("show", whatsappNumber);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-e16b0919><div class="wrapper absolute" data-v-e16b0919><div id="main-div" data-v-e16b0919><div id="main-button" class="${ssrRenderClass(isOpen.value ? "wave open" : "wave")}" data-v-e16b0919><svg data-v-59435867="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" data-v-e16b0919><path fill="#fff" data-v-59435867="" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z" data-v-e16b0919></path><path fill="#fff" data-v-59435867="" d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z" data-v-e16b0919></path></svg></div><a${ssrRenderAttr("href", "https://wa.me/" + whatsappNumber.value)} class="whatsapp-color wp" style="${ssrRenderStyle({ "bottom": "180px" })}" data-v-e16b0919><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" data-v-e16b0919><path fill="#fff" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" data-v-e16b0919></path></svg></a><a href="https://m.me/nutrifyfoodbd" class="messenger-color" data-v-e16b0919><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="30" data-v-e16b0919><path fill="#fff" d="M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z" data-v-e16b0919></path></svg></a></div></div></div>`);
    };
  }
};
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Icons/WhatsApp.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const WhatsApp = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["__scopeId", "data-v-e16b0919"]]);
const _sfc_main$M = {
  __name: "Footer",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const homeStore = useHomeStore();
    const siteinfos = computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a[0]) || {};
    });
    computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a.media) || {};
    });
    const storePhone = computed(() => siteinfos.value.store_phone_number || "N/A");
    const storeEmail = computed(() => siteinfos.value.store_email || "N/A");
    const storeAddress = computed(() => siteinfos.value.address || "N/A");
    const facebookUrl = computed(() => siteinfos.value.facebook_url || "#");
    const instagramUrl = computed(() => siteinfos.value.instagram_url || "#");
    const youtubeUrl = computed(() => siteinfos.value.youtube_url || "#");
    const xurl = computed(() => siteinfos.value.x_url || "#");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<!--[--><footer class="bg-[#DD9933] text-gray-300 py-10 relative" data-v-f252a228><div class="container mx-auto px-4 allcolor" data-v-f252a228><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 relative" data-v-f252a228><div class="text-left" data-v-f252a228><h3 class="outlet text-base text-white" data-v-f252a228>Outlet Location</h3><div class="outletb" data-v-f252a228></div><div class="w-[300px] text-[17.6px] text-black mt-6" data-v-f252a228>${ssrInterpolate(storeAddress.value)}</div><div class="text-[17.6px] text-black mt-6" data-v-f252a228> Call Now: ${ssrInterpolate(storePhone.value)}</div><div class="text-[17.6px] text-black mt-6" data-v-f252a228> Email: <br data-v-f252a228><span class="hover:text-white" data-v-f252a228>${ssrInterpolate(storeEmail.value)}</span></div><div class="flex justify-start gap-4 mt-4 social-link-svg" data-v-f252a228><a${ssrRenderAttr("href", facebookUrl.value)} class="tooltip w-[30px] h-[30px] rounded-full bg-[#4064AC] flex justify-center items-center text-white" data-v-f252a228><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="12px" height="12px" data-v-f252a228><path fill="#fff" d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" data-v-f252a228></path></svg><div class="tooltiptext" data-v-f252a228>facebook</div></a><a${ssrRenderAttr("href", youtubeUrl.value)} class="tooltip w-[30px] h-[30px] rounded-full bg-[#F73B00] flex justify-center items-center text-white" data-v-f252a228><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18px" height="18px" data-v-f252a228><path fill="#fff" d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z" data-v-f252a228></path></svg><div class="tooltiptext" data-v-f252a228>youtube</div></a><a${ssrRenderAttr("href", instagramUrl.value)} class="tooltip w-[30px] h-[30px] rounded-full gradient flex justify-center items-center text-white" data-v-f252a228><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20px" data-v-f252a228><path fill="#fff" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" data-v-f252a228></path></svg><div class="tooltiptext" data-v-f252a228>Instagram</div></a><a${ssrRenderAttr("href", xurl.value)} class="tooltip w-[30px] h-[30px] rounded-full bg-black flex justify-center items-center text-white" data-v-f252a228><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18px" height="18px" data-v-f252a228><path fill="#fff" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" data-v-f252a228></path></svg><div class="tooltiptext" data-v-f252a228>twitter x</div></a></div></div><div class="forcustomer" data-v-f252a228><h3 class="outlet text-base text-white" data-v-f252a228>INFORMATION</h3><div class="outletb" data-v-f252a228></div><ul class="mt-3 list-none" data-v-f252a228><li data-v-f252a228><a class="block py-3 text-white text-base border-b" href="/privacy-policy" data-v-f252a228>Privacy Policy</a></li><li data-v-f252a228><a class="block py-3 text-white text-base border-b" href="/terms-and-conditions" data-v-f252a228>Terms &amp; Conditions</a></li><li data-v-f252a228><a class="block py-3 text-white text-base border-b" href="/refund-and-returns-policy" data-v-f252a228>Return &amp; Exchange </a></li></ul></div><div class="forcustomer" data-v-f252a228><h3 class="outlet text-base text-white" data-v-f252a228>Usefull Links</h3><div class="outletb" data-v-f252a228></div><ul class="mt-3 list-none" data-v-f252a228><li data-v-f252a228><a class="block py-3 text-white text-base border-b" href="/about-us" data-v-f252a228>About Us</a></li><li data-v-f252a228><a class="block py-3 text-white text-base border-b" href="/shipping" data-v-f252a228>Shipping and delivery</a></li></ul></div><div data-v-f252a228><div data-v-f252a228>${((_a = siteinfos.value) == null ? void 0 : _a.facebook_iframe) ?? ""}</div></div></div></div></footer><div class="my-4 text-center bg-white" data-v-f252a228><p class="text-sm text-black" data-v-f252a228> © ${ssrInterpolate((_b = siteinfos.value) == null ? void 0 : _b.app_name)} 2025. Developed by <a href="https://softexel.com/" target="_blank" class="text-black" data-v-f252a228>Softexel</a></p></div><!--]-->`);
    };
  }
};
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Footer.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["__scopeId", "data-v-f252a228"]]);
const _sfc_main$L = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "preloader text-theme" }, _attrs))}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="100" height="100" style="${ssrRenderStyle({ "shape-rendering": "auto", "display": "block" })}" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g transform="rotate(0 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(30 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(60 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(90 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(120 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(150 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(180 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(210 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(240 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(270 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(300 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g transform="rotate(330 50 50)"><rect fill="CurrentColor" height="12" width="6" ry="6" rx="3" y="24" x="47"><animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate></rect></g><g></g></g></svg></div>`);
}
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Preloader/Preloader.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const Preloader = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$K = {
  __name: "HomePreloder",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    const media = computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a.media) || {};
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home_preloader absolute top-0 left-0 w-full h-full bg-white z-[999]" }, _attrs))}><div class="min-h-screen bg-gray-100"><div class="loader absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">`);
      if ((_a = media.value[0]) == null ? void 0 : _a.loader) {
        _push(`<img${ssrRenderAttr("src", (_b = media.value[0]) == null ? void 0 : _b.loader)} alt="loader" class="w-28">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Preloader/HomePreloder.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = {
  __name: "AppLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    const homeStore = useHomeStore();
    const media = computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a.media) || {};
    });
    const injectMarketingScripts = () => {
      document.querySelectorAll(".marketing-script").forEach((script) => script.remove());
      homeStore.marketing.forEach((scriptObj) => {
        if (!scriptObj.script) return;
        const script = document.createElement("script");
        script.classList.add("marketing-script");
        script.async = true;
        script.innerHTML = scriptObj.script.replace(/<script.*?>|<\/script>/gi, "").trim();
        document.head.appendChild(script);
      });
    };
    watch(
      () => homeStore.marketing,
      () => {
        injectMarketingScripts();
      },
      { deep: true, immediate: true }
    );
    onMounted(() => {
      var _a, _b;
      if ((_b = (_a = media.value) == null ? void 0 : _a[0]) == null ? void 0 : _b.favicon) {
        const faviconUrl = media.value[0].favicon;
        const existingFavicons = document.querySelectorAll('link[rel="icon"]');
        existingFavicons.forEach((favicon) => favicon.remove());
        const link = document.createElement("link");
        link.rel = "icon";
        link.type = "image/png";
        link.href = faviconUrl;
        document.head.appendChild(link);
      }
    });
    watch(
      media,
      (newVal) => {
        var _a;
        if ((_a = newVal == null ? void 0 : newVal[0]) == null ? void 0 : _a.favicon) {
          const faviconUrl = newVal[0].favicon;
          const existingFavicons = document.querySelectorAll('link[rel="icon"]');
          existingFavicons.forEach((favicon) => favicon.remove());
          const link = document.createElement("link");
          link.rel = "icon";
          link.type = "image/png";
          link.href = faviconUrl;
          document.head.appendChild(link);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(homeStore).homePreloader) {
        _push(ssrRenderComponent(_sfc_main$K, _attrs, null, _parent));
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "app-layout" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(Toaster), null, null, _parent));
        if (unref(cartStore).golobalLoading) {
          _push(`<div class="global-preloader">`);
          _push(ssrRenderComponent(Preloader, null, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(WhatsApp, null, null, _parent));
        _push(ssrRenderComponent(Header, null, null, _parent));
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(ssrRenderComponent(Footer, {
          categories: unref(homeStore).categories
        }, null, _parent));
        _push(`</div>`);
      }
    };
  }
};
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AppLayout.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const _sfc_main$I = {
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const $page = ne();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "text-gray-800" }, _attrs))}><ul><li class="mb-2">`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/account/orders",
        class: ["block p-4 rounded w-full text-left text-gray-900 hover:bg-gray-100", unref($page).url === "/account/orders" ? "bg-theme text-white hover:text-white hover:bg-theme" : ""]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` My Orders `);
          } else {
            return [
              createTextVNode(" My Orders ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="mb-2">`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/account/address",
        class: ["block p-4 rounded w-full text-left text-gray-900 hover:bg-gray-100", unref($page).url === "/account/address" ? "bg-theme text-white hover:text-white hover:bg-theme" : ""]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Address `);
          } else {
            return [
              createTextVNode(" Address ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li class="">`);
      if (unref(authStore).isAuthenticated) {
        _push(`<button class="block p-4 rounded hover:bg-gray-100 w-full text-left">Logout</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</li></ul></div>`);
    };
  }
};
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Account/Sidebar.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const _sfc_main$H = {
  __name: "AccountLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const isSidebarOpen = ref(false);
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };
    const closeSidebar = () => {
      isSidebarOpen.value = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-gray-50 min-h-[50vh] relative"${_scopeId}><div class="lg:hidden p-4"${_scopeId}><button class="text-gray-500 hover:text-gray-700 flex gap-2"${_scopeId}><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"${_scopeId}></path></svg> Menu </button></div>`);
            if (isSidebarOpen.value) {
              _push2(`<div class="fixed inset-0 bg-black bg-opacity-50 z-40"${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex gap-6 container py-12"${_scopeId}><div class="${ssrRenderClass([{
              "translate-x-0": isSidebarOpen.value,
              "-translate-x-full": !isSidebarOpen.value
            }, "fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg transition-transform transform lg:static lg:w-1/4 lg:translate-x-0 z-50 p-6"])}"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$I, null, null, _parent2, _scopeId));
            _push2(`</div><div class="w-full lg:w-3/4 p-6 bg-white shadow-sm"${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(`</div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-gray-50 min-h-[50vh] relative" }, [
                createVNode("div", { class: "lg:hidden p-4" }, [
                  createVNode("button", {
                    onClick: toggleSidebar,
                    class: "text-gray-500 hover:text-gray-700 flex gap-2"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-6 h-6",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M4 6h16M4 12h16m-7 6h7"
                      })
                    ])),
                    createTextVNode(" Menu ")
                  ])
                ]),
                isSidebarOpen.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 bg-black bg-opacity-50 z-40",
                  onClick: closeSidebar
                })) : createCommentVNode("", true),
                createVNode("div", { class: "flex gap-6 container py-12" }, [
                  createVNode("div", {
                    class: [{
                      "translate-x-0": isSidebarOpen.value,
                      "-translate-x-full": !isSidebarOpen.value
                    }, "fixed top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg transition-transform transform lg:static lg:w-1/4 lg:translate-x-0 z-50 p-6"]
                  }, [
                    createVNode(_sfc_main$I)
                  ], 2),
                  createVNode("div", { class: "w-full lg:w-3/4 p-6 bg-white shadow-sm" }, [
                    renderSlot(_ctx.$slots, "default")
                  ])
                ])
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/AccountLayout.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const _sfc_main$G = {
  __name: "Address",
  __ssrInlineRender: true,
  setup(__props) {
    const $axios = inject("$axios");
    const isPopupOpen = ref(false);
    const isEditing = ref(false);
    const editingId = ref(null);
    const addresses = ref([]);
    const form = ref({
      name: "",
      address: "",
      city: "",
      phone: "",
      type: "home",
      is_default: false
    });
    onMounted(fetchAddresses);
    async function fetchAddresses() {
      try {
        const response = await $axios.get("/get-addresses");
        if (response.data.success) {
          addresses.value = response.data.address;
        } else {
          toast.error("Failed to fetch addresses.");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to fetch addresses.");
      }
    }
    const openPopup = () => {
      isEditing.value = false;
      isPopupOpen.value = true;
      resetForm();
    };
    const closePopup = () => {
      isPopupOpen.value = false;
    };
    async function submitAddress() {
      var _a;
      try {
        const response = await $axios.post("/create-address", form.value);
        if (response.data.success) {
          toast.success("Address added successfully!");
          closePopup();
          fetchAddresses();
        } else {
          toast.error("Error submitting address.");
        }
      } catch (error) {
        console.error("Error submitting address:", (_a = error.response) == null ? void 0 : _a.data);
        toast.error("Error submitting address.");
      }
    }
    const editAddress = (address) => {
      isEditing.value = true;
      editingId.value = address.id;
      form.value = { ...address, is_default: Boolean(address.is_default) };
      isPopupOpen.value = true;
    };
    async function updateAddress() {
      try {
        const response = await $axios.post("/update-address", {
          id: editingId.value,
          data: {
            name: form.value.name,
            address: form.value.address,
            city: form.value.city,
            phone: form.value.phone,
            type: form.value.type,
            is_default: form.value.is_default
          }
        });
        if (response.data.success) {
          toast.success("Address updated successfully!");
          closePopup();
          fetchAddresses();
        } else {
          toast.error("Failed to update address.");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        toast.error("Error updating address.");
      }
    }
    async function deleteAddress(id) {
      try {
        const response = await $axios.post("/delete-address", { id });
        if (response.data.success) {
          toast.success("Address deleted successfully!");
          fetchAddresses();
        } else {
          toast.error("Failed to delete address.");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        toast.error("Failed to delete address.");
      }
    }
    const resetForm = () => {
      form.value = {
        name: "",
        address: "",
        city: "",
        phone: "",
        type: "home",
        is_default: false
      };
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-1f7aa51b${_scopeId}>Address</title>`);
          } else {
            return [
              createVNode("title", null, "Address")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$H, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex justify-between items-center" data-v-1f7aa51b${_scopeId}><h2 class="text-2xl font-semibold" data-v-1f7aa51b${_scopeId}>Address</h2><button class="bg-theme text-white px-4 py-2 rounded hover:bg-secondary" data-v-1f7aa51b${_scopeId}> Create Address </button></div><div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-v-1f7aa51b${_scopeId}><!--[-->`);
            ssrRenderList(addresses.value, (address) => {
              _push2(`<div class="bg-white p-6 rounded-lg shadow-md border border-gray-200" data-v-1f7aa51b${_scopeId}><h3 class="text-lg font-semibold" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(address.name)}</h3><p class="text-sm text-gray-600 mt-2" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(address.address)}</p><p class="text-sm text-gray-600" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(address.city)}</p><p class="text-sm text-gray-600" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(address.phone)}</p><p class="text-sm text-gray-600 capitalize" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(address.type)}</p>`);
              if (address.is_default === 1) {
                _push2(`<p class="text-sm text-green-600 font-medium mt-2" data-v-1f7aa51b${_scopeId}>Default Address</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="mt-4 flex space-x-4" data-v-1f7aa51b${_scopeId}><button class="text-sm text-blue-600 hover:text-blue-800" data-v-1f7aa51b${_scopeId}>Edit</button><button class="text-sm text-red-600 hover:text-red-800" data-v-1f7aa51b${_scopeId}>Delete</button></div></div>`);
            });
            _push2(`<!--]--></div>`);
            if (isPopupOpen.value) {
              _push2(`<div class="fixed inset-0 bg-black bg-opacity-50 z-[99] flex items-center justify-center" data-v-1f7aa51b${_scopeId}><div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" data-v-1f7aa51b${_scopeId}><h2 class="text-xl font-bold mb-4" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(isEditing.value ? "Edit Address" : "Create New Address")}</h2><form data-v-1f7aa51b${_scopeId}><div class="mb-4" data-v-1f7aa51b${_scopeId}><label class="block text-sm font-medium text-gray-700" data-v-1f7aa51b${_scopeId}>Name</label><input type="text"${ssrRenderAttr("value", form.value.name)} class="input-field" placeholder="Enter your name" data-v-1f7aa51b${_scopeId}></div><div class="mb-4" data-v-1f7aa51b${_scopeId}><label class="block text-sm font-medium text-gray-700" data-v-1f7aa51b${_scopeId}>Address</label><input type="text"${ssrRenderAttr("value", form.value.address)} class="input-field" placeholder="Enter your address" data-v-1f7aa51b${_scopeId}></div><div class="mb-4" data-v-1f7aa51b${_scopeId}><label class="block text-sm font-medium text-gray-700" data-v-1f7aa51b${_scopeId}>City</label><input type="text"${ssrRenderAttr("value", form.value.city)} class="input-field" placeholder="Enter your city" data-v-1f7aa51b${_scopeId}></div><div class="mb-4" data-v-1f7aa51b${_scopeId}><label class="block text-sm font-medium text-gray-700" data-v-1f7aa51b${_scopeId}>Phone</label><input type="text"${ssrRenderAttr("value", form.value.phone)} class="input-field" placeholder="Enter your phone number" data-v-1f7aa51b${_scopeId}></div><div class="mb-4" data-v-1f7aa51b${_scopeId}><label class="block text-sm font-medium text-gray-700" data-v-1f7aa51b${_scopeId}>Address Type</label><select class="input-field" data-v-1f7aa51b${_scopeId}><option value="office" data-v-1f7aa51b${ssrIncludeBooleanAttr(Array.isArray(form.value.type) ? ssrLooseContain(form.value.type, "office") : ssrLooseEqual(form.value.type, "office")) ? " selected" : ""}${_scopeId}>Office</option><option value="home" data-v-1f7aa51b${ssrIncludeBooleanAttr(Array.isArray(form.value.type) ? ssrLooseContain(form.value.type, "home") : ssrLooseEqual(form.value.type, "home")) ? " selected" : ""}${_scopeId}>Home</option><option value="other" data-v-1f7aa51b${ssrIncludeBooleanAttr(Array.isArray(form.value.type) ? ssrLooseContain(form.value.type, "other") : ssrLooseEqual(form.value.type, "other")) ? " selected" : ""}${_scopeId}>Other</option></select></div><div class="mb-4" data-v-1f7aa51b${_scopeId}><label class="flex items-center" data-v-1f7aa51b${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.value.is_default) ? ssrLooseContain(form.value.is_default, null) : form.value.is_default) ? " checked" : ""} class="mr-2" data-v-1f7aa51b${_scopeId}><span class="text-sm text-gray-700" data-v-1f7aa51b${_scopeId}>Set as Default</span></label></div><div class="flex justify-end space-x-4" data-v-1f7aa51b${_scopeId}><button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" data-v-1f7aa51b${_scopeId}> Cancel </button><button type="submit" class="bg-theme text-white px-4 py-2 rounded hover:bg-secondary" data-v-1f7aa51b${_scopeId}>${ssrInterpolate(isEditing.value ? "Update Address" : "Save Address")}</button></div></form></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex justify-between items-center" }, [
                createVNode("h2", { class: "text-2xl font-semibold" }, "Address"),
                createVNode("button", {
                  onClick: ($event) => openPopup(),
                  class: "bg-theme text-white px-4 py-2 rounded hover:bg-secondary"
                }, " Create Address ", 8, ["onClick"])
              ]),
              createVNode("div", { class: "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(addresses.value, (address) => {
                  return openBlock(), createBlock("div", {
                    key: address.id,
                    class: "bg-white p-6 rounded-lg shadow-md border border-gray-200"
                  }, [
                    createVNode("h3", { class: "text-lg font-semibold" }, toDisplayString(address.name), 1),
                    createVNode("p", { class: "text-sm text-gray-600 mt-2" }, toDisplayString(address.address), 1),
                    createVNode("p", { class: "text-sm text-gray-600" }, toDisplayString(address.city), 1),
                    createVNode("p", { class: "text-sm text-gray-600" }, toDisplayString(address.phone), 1),
                    createVNode("p", { class: "text-sm text-gray-600 capitalize" }, toDisplayString(address.type), 1),
                    address.is_default === 1 ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-green-600 font-medium mt-2"
                    }, "Default Address")) : createCommentVNode("", true),
                    createVNode("div", { class: "mt-4 flex space-x-4" }, [
                      createVNode("button", {
                        onClick: ($event) => editAddress(address),
                        class: "text-sm text-blue-600 hover:text-blue-800"
                      }, "Edit", 8, ["onClick"]),
                      createVNode("button", {
                        onClick: ($event) => deleteAddress(address.id),
                        class: "text-sm text-red-600 hover:text-red-800"
                      }, "Delete", 8, ["onClick"])
                    ])
                  ]);
                }), 128))
              ]),
              isPopupOpen.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "fixed inset-0 bg-black bg-opacity-50 z-[99] flex items-center justify-center"
              }, [
                createVNode("div", { class: "bg-white p-6 rounded-lg shadow-lg w-full max-w-md" }, [
                  createVNode("h2", { class: "text-xl font-bold mb-4" }, toDisplayString(isEditing.value ? "Edit Address" : "Create New Address"), 1),
                  createVNode("form", {
                    onSubmit: withModifiers(($event) => isEditing.value ? updateAddress() : submitAddress(), ["prevent"])
                  }, [
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Name"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.name = $event,
                        class: "input-field",
                        placeholder: "Enter your name"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.name]
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Address"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.address = $event,
                        class: "input-field",
                        placeholder: "Enter your address"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.address]
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "City"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.city = $event,
                        class: "input-field",
                        placeholder: "Enter your city"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.city]
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Phone"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => form.value.phone = $event,
                        class: "input-field",
                        placeholder: "Enter your phone number"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, form.value.phone]
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "block text-sm font-medium text-gray-700" }, "Address Type"),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.value.type = $event,
                        class: "input-field"
                      }, [
                        createVNode("option", { value: "office" }, "Office"),
                        createVNode("option", { value: "home" }, "Home"),
                        createVNode("option", { value: "other" }, "Other")
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.value.type]
                      ])
                    ]),
                    createVNode("div", { class: "mb-4" }, [
                      createVNode("label", { class: "flex items-center" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => form.value.is_default = $event,
                          class: "mr-2"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, form.value.is_default]
                        ]),
                        createVNode("span", { class: "text-sm text-gray-700" }, "Set as Default")
                      ])
                    ]),
                    createVNode("div", { class: "flex justify-end space-x-4" }, [
                      createVNode("button", {
                        type: "button",
                        onClick: ($event) => closePopup(),
                        class: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      }, " Cancel ", 8, ["onClick"]),
                      createVNode("button", {
                        type: "submit",
                        class: "bg-theme text-white px-4 py-2 rounded hover:bg-secondary"
                      }, toDisplayString(isEditing.value ? "Update Address" : "Save Address"), 1)
                    ])
                  ], 40, ["onSubmit"])
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Account/Address.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const Address = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["__scopeId", "data-v-1f7aa51b"]]);
const __vite_glob_0_0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Address
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$F = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>My Account</title>`);
          } else {
            return [
              createVNode("title", null, "My Account")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$H, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div${_scopeId}><h2${_scopeId}>My Account</h2></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("h2", null, "My Account")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Account/Index.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const __vite_glob_0_1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$F
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$E = {
  __name: "OrderList",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const $axios = inject("$axios");
    const orders = ref([]);
    const isLoading = ref(false);
    const fetchUserOrderData = async () => {
      var _a;
      try {
        const userId = (_a = authStore.user) == null ? void 0 : _a.id;
        isLoading.value = true;
        const response = await $axios.get("/order-get/" + userId);
        orders.value = response.data;
      } catch (error) {
        console.error("Error fetching user order data:", error);
      } finally {
        isLoading.value = false;
      }
    };
    onMounted(() => {
      fetchUserOrderData();
    });
    watch(
      () => authStore.user,
      (newUser) => {
        if (newUser && newUser.id) {
          fetchUserOrderData();
        }
      },
      { immediate: true }
    );
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    };
    const getStatusClass = (status) => {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "processed":
          return "bg-blue-100 text-blue-800";
        case "shipped":
          return "bg-indigo-100 text-indigo-800";
        case "returned":
          return "bg-red-100 text-red-800";
        case "delivered":
          return "bg-green-100 text-green-800";
        case "cancelled":
          return "bg-gray-100 text-gray-800";
        case "on delivery":
          return "bg-purple-100 text-purple-800";
        case "pending delivery":
          return "bg-orange-100 text-orange-800";
        case "incomplete":
          return "bg-pink-100 text-pink-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>My Orders</title>`);
          } else {
            return [
              createVNode("title", null, "My Orders")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$H, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="text-2xl font-bold mb-4"${_scopeId}>My Orders</h1>`);
            if (isLoading.value) {
              _push2(`<div class="flex justify-center items-center h-64"${_scopeId}>`);
              _push2(ssrRenderComponent(Preloader, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="overflow-x-auto w-full"${_scopeId}><table class="w-full bg-white border border-gray-200"${_scopeId}><thead${_scopeId}><tr class="bg-gray-100 text-left"${_scopeId}><th class="py-2 px-4 border-b"${_scopeId}>Image</th><th class="py-2 px-4 border-b"${_scopeId}>Name</th><th class="py-2 px-4 border-b"${_scopeId}>Date</th><th class="py-2 px-4 border-b"${_scopeId}>Quantity</th><th class="py-2 px-4 border-b"${_scopeId}>Status</th><th class="py-2 px-4 border-b"${_scopeId}>Amount</th></tr></thead><tbody${_scopeId}><!--[-->`);
              ssrRenderList(orders.value, (order, index) => {
                _push2(`<!--[--><!--[-->`);
                ssrRenderList(order.items, (item, itemIndex) => {
                  var _a, _b;
                  _push2(`<tr${_scopeId}><td class="py-2 px-4 border-b"${_scopeId}><img${ssrRenderAttr("src", (_a = item.product_info) == null ? void 0 : _a.featured_image)} alt="Product Image" class="w-[60px] h-[60px] object-cover rounded"${_scopeId}></td><td class="py-2 px-4 border-b"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate((_b = item.product_info) == null ? void 0 : _b.product_name)}</span></td><td class="py-2 px-4 border-b"${_scopeId}>${ssrInterpolate(formatDate(order.created_at))}</td><td class="py-2 px-4 border-b"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(item.quantity)}</span></td><td class="py-2 px-4 border-b"${_scopeId}><span class="${ssrRenderClass([getStatusClass(order.order_status), "text-sm px-2 py-1 rounded-full"])}"${_scopeId}>${ssrInterpolate(order.order_status)}</span></td><td class="py-2 px-4 border-b"${_scopeId}>${ssrInterpolate(item.price)}</td></tr>`);
                });
                _push2(`<!--]--><!--]-->`);
              });
              _push2(`<!--]--></tbody></table></div>`);
            }
          } else {
            return [
              createVNode("h1", { class: "text-2xl font-bold mb-4" }, "My Orders"),
              isLoading.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "flex justify-center items-center h-64"
              }, [
                createVNode(Preloader)
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "overflow-x-auto w-full"
              }, [
                createVNode("table", { class: "w-full bg-white border border-gray-200" }, [
                  createVNode("thead", null, [
                    createVNode("tr", { class: "bg-gray-100 text-left" }, [
                      createVNode("th", { class: "py-2 px-4 border-b" }, "Image"),
                      createVNode("th", { class: "py-2 px-4 border-b" }, "Name"),
                      createVNode("th", { class: "py-2 px-4 border-b" }, "Date"),
                      createVNode("th", { class: "py-2 px-4 border-b" }, "Quantity"),
                      createVNode("th", { class: "py-2 px-4 border-b" }, "Status"),
                      createVNode("th", { class: "py-2 px-4 border-b" }, "Amount")
                    ])
                  ]),
                  createVNode("tbody", null, [
                    (openBlock(true), createBlock(Fragment, null, renderList(orders.value, (order, index) => {
                      return openBlock(), createBlock(Fragment, { key: index }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(order.items, (item, itemIndex) => {
                          var _a, _b;
                          return openBlock(), createBlock("tr", { key: itemIndex }, [
                            createVNode("td", { class: "py-2 px-4 border-b" }, [
                              createVNode("img", {
                                src: (_a = item.product_info) == null ? void 0 : _a.featured_image,
                                alt: "Product Image",
                                class: "w-[60px] h-[60px] object-cover rounded"
                              }, null, 8, ["src"])
                            ]),
                            createVNode("td", { class: "py-2 px-4 border-b" }, [
                              createVNode("span", { class: "text-sm" }, toDisplayString((_b = item.product_info) == null ? void 0 : _b.product_name), 1)
                            ]),
                            createVNode("td", { class: "py-2 px-4 border-b" }, toDisplayString(formatDate(order.created_at)), 1),
                            createVNode("td", { class: "py-2 px-4 border-b" }, [
                              createVNode("span", { class: "text-sm" }, toDisplayString(item.quantity), 1)
                            ]),
                            createVNode("td", { class: "py-2 px-4 border-b" }, [
                              createVNode("span", {
                                class: [getStatusClass(order.order_status), "text-sm px-2 py-1 rounded-full"]
                              }, toDisplayString(order.order_status), 3)
                            ]),
                            createVNode("td", { class: "py-2 px-4 border-b" }, toDisplayString(item.price), 1)
                          ]);
                        }), 128))
                      ], 64);
                    }), 128))
                  ])
                ])
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Account/OrderList.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const __vite_glob_0_2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$E
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$D = {
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    const $axios = inject("$axios");
    const showPassword = ref(false);
    const isSubmitting = ref(false);
    const form = reactive({
      email: "",
      password: "",
      remember: false
    });
    const errors = reactive({
      email: "",
      password: ""
    });
    const schema = yup.object().shape({
      email: yup.string().required("Email is required").email("Invalid email format"),
      password: yup.string().required("Password is required")
    });
    const validateField = async (field) => {
      try {
        await schema.validateAt(field, form);
        errors[field] = "";
      } catch (error) {
        errors[field] = error.message;
      }
    };
    watch(() => form.email, () => validateField("email"));
    watch(() => form.password, () => validateField("password"));
    const isFormValid = computed(() => {
      return Object.values(errors).every((error) => error === "") && form.email !== "" && form.password !== "";
    });
    const togglePassword = () => {
      showPassword.value = !showPassword.value;
    };
    const authStore = useAuthStore();
    const handleSubmit = async () => {
      if (!isFormValid.value) return;
      isSubmitting.value = true;
      errors.email = "";
      errors.password = "";
      try {
        const response = await $axios.post("/login", {
          email: form.email,
          password: form.password
        });
        toast.success("Login successful");
        router.get("/");
        Cookies.set("authToken", response.data, { expires: 7 });
        await authStore.fetchUserDetails();
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const backendErrors = error.response.data.errors;
          for (const field in backendErrors) {
            if (backendErrors[field]) {
              errors[field] = backendErrors[field][0];
            }
          }
        } else {
          console.error("Unexpected error:", error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      } finally {
        isSubmitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Login</title>`);
          } else {
            return [
              createVNode("title", null, "Login")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="bg-gray-50 py-12"${_scopeId}><div class="max-w-md mx-auto p-6 bg-white rounded shadow"${_scopeId}><h1 class="text-2xl font-normal mb-6"${_scopeId}>LOGIN</h1><form class="space-y-4"${_scopeId}><div${_scopeId}><label class="block mb-2"${_scopeId}> Username or email address <span class="text-red-500"${_scopeId}>*</span></label><input${ssrRenderAttr("value", form.email)} type="email" required class="${ssrRenderClass([{ "border-red-500": errors.email }, "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-theme"])}"${_scopeId}>`);
            if (errors.email) {
              _push2(`<p class="mt-1 text-xs text-red-500"${_scopeId}>${ssrInterpolate(errors.email)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="block mb-2"${_scopeId}> Password <span class="text-red-500"${_scopeId}>*</span></label><div class="relative"${_scopeId}><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} required class="${ssrRenderClass([{ "border-red-500": errors.password }, "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-theme"])}"${_scopeId}><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2"${_scopeId}>`);
            if (!showPassword.value) {
              _push2(ssrRenderComponent(unref(EyeIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(unref(EyeOffIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent2, _scopeId));
            }
            _push2(`</button></div>`);
            if (errors.password) {
              _push2(`<p class="mt-1 text-xs text-red-500"${_scopeId}>${ssrInterpolate(errors.password)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button type="submit" class="w-full btn__primary py-2 rounded text-white font-semibold"${ssrIncludeBooleanAttr(!isFormValid.value || isSubmitting.value) ? " disabled" : ""}${_scopeId}>${ssrInterpolate(isSubmitting.value ? "LOGGING IN..." : "LOG IN")}</button><div class="flex items-center justify-between mt-4"${_scopeId}><label class="flex items-center"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(form.remember) ? ssrLooseContain(form.remember, null) : form.remember) ? " checked" : ""} class="rounded border-gray-300 text-theme focus:ring-theme"${_scopeId}><span class="ml-2"${_scopeId}>Remember me</span></label></div><div class="text-center mt-6 border-t border-gray-200 pt-4"${_scopeId}><span class="text-gray-600"${_scopeId}>Don&#39;t have an account?</span>`);
            _push2(ssrRenderComponent(unref(Pe), {
              href: "/register",
              class: "text-theme hover:underline ml-1"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Sign up`);
                } else {
                  return [
                    createTextVNode("Sign up")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form></div></div>`);
          } else {
            return [
              createVNode("div", { class: "bg-gray-50 py-12" }, [
                createVNode("div", { class: "max-w-md mx-auto p-6 bg-white rounded shadow" }, [
                  createVNode("h1", { class: "text-2xl font-normal mb-6" }, "LOGIN"),
                  createVNode("form", {
                    onSubmit: withModifiers(handleSubmit, ["prevent"]),
                    class: "space-y-4"
                  }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-2" }, [
                        createTextVNode(" Username or email address "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.email = $event,
                        type: "email",
                        required: "",
                        class: ["w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-theme", { "border-red-500": errors.email }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [vModelText, form.email]
                      ]),
                      errors.email ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(errors.email), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block mb-2" }, [
                        createTextVNode(" Password "),
                        createVNode("span", { class: "text-red-500" }, "*")
                      ]),
                      createVNode("div", { class: "relative" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => form.password = $event,
                          type: showPassword.value ? "text" : "password",
                          required: "",
                          class: ["w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-theme", { "border-red-500": errors.password }]
                        }, null, 10, ["onUpdate:modelValue", "type"]), [
                          [vModelDynamic, form.password]
                        ]),
                        createVNode("button", {
                          type: "button",
                          onClick: togglePassword,
                          class: "absolute right-3 top-1/2 -translate-y-1/2"
                        }, [
                          !showPassword.value ? (openBlock(), createBlock(unref(EyeIcon), {
                            key: 0,
                            class: "h-5 w-5 text-gray-400"
                          })) : (openBlock(), createBlock(unref(EyeOffIcon), {
                            key: 1,
                            class: "h-5 w-5 text-gray-400"
                          }))
                        ])
                      ]),
                      errors.password ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "mt-1 text-xs text-red-500"
                      }, toDisplayString(errors.password), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("button", {
                      type: "submit",
                      class: "w-full btn__primary py-2 rounded text-white font-semibold",
                      disabled: !isFormValid.value || isSubmitting.value
                    }, toDisplayString(isSubmitting.value ? "LOGGING IN..." : "LOG IN"), 9, ["disabled"]),
                    createVNode("div", { class: "flex items-center justify-between mt-4" }, [
                      createVNode("label", { class: "flex items-center" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => form.remember = $event,
                          class: "rounded border-gray-300 text-theme focus:ring-theme"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, form.remember]
                        ]),
                        createVNode("span", { class: "ml-2" }, "Remember me")
                      ])
                    ]),
                    createVNode("div", { class: "text-center mt-6 border-t border-gray-200 pt-4" }, [
                      createVNode("span", { class: "text-gray-600" }, "Don't have an account?"),
                      createVNode(unref(Pe), {
                        href: "/register",
                        class: "text-theme hover:underline ml-1"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Sign up")
                        ]),
                        _: 1
                      })
                    ])
                  ], 32)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const __vite_glob_0_3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$D
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$C = {
  __name: "RegistrationForm",
  __ssrInlineRender: true,
  setup(__props) {
    inject("$axios");
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const isSubmitting = ref(false);
    const form = reactive({
      name: "",
      email: "",
      password: ""
    });
    const errors = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    const schema = yup.object().shape({
      name: yup.string().required("name is required").min(3, "name must be at least 3 characters").matches(/^[a-zA-Z0-9_-]+$/, "name can only contain letters, numbers, dashes and underscores"),
      email: yup.string().required("Email is required").email("Invalid email format"),
      password: yup.string().required("Password is required").min(8, "Password must be at least 8 characters").matches(/[A-Z]/, "Password must contain at least one uppercase letter").matches(/[a-z]/, "Password must contain at least one lowercase letter").matches(/[0-9]/, "Password must contain at least one number").matches(/[!@#$%^&*]/, "Password must contain at least one special character"),
      confirmPassword: yup.string().required("Confirm Password is required").oneOf([yup.ref("password")], "Passwords must match")
    });
    const validateField = async (field) => {
      try {
        await schema.validateAt(field, form);
        errors[field] = "";
      } catch (error) {
        errors[field] = error.message;
      }
    };
    watch(() => form.name, () => validateField("name"));
    watch(() => form.email, () => validateField("email"));
    watch(() => form.password, () => {
      validateField("password");
      if (form.confirmPassword) {
        validateField("confirmPassword");
      }
    });
    watch(() => form.confirmPassword, () => validateField("confirmPassword"));
    const isFormValid = computed(() => {
      return Object.values(errors).every((error) => error === "") && Object.values(form).every((value) => value !== "");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-12 bg-gray-50" }, _attrs))}><div class="max-w-md mx-auto p-6 bg-white rounded shadow"><h1 class="text-2xl font-normal mb-6">REGISTER</h1><form class="space-y-4"><div><label class="block mb-2"> name <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.name)} type="text" required class="${ssrRenderClass([{ "border-red-500": errors.name }, "w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"])}">`);
      if (errors.name) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(errors.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block mb-2"> Email address <span class="text-red-500">*</span></label><input${ssrRenderAttr("value", form.email)} type="email" required class="${ssrRenderClass([{ "border-red-500": errors.email }, "w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"])}">`);
      if (errors.email) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(errors.email)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block mb-2"> Password <span class="text-red-500">*</span></label><div class="relative"><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} required class="${ssrRenderClass([{ "border-red-500": errors.password }, "w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"])}"><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2">`);
      if (!showPassword.value) {
        _push(ssrRenderComponent(unref(EyeIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOffIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent));
      }
      _push(`</button></div>`);
      if (errors.password) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(errors.password)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div><label class="block mb-2"> Confirm Password <span class="text-red-500">*</span></label><div class="relative"><input${ssrRenderDynamicModel(showConfirmPassword.value ? "text" : "password", form.confirmPassword, null)}${ssrRenderAttr("type", showConfirmPassword.value ? "text" : "password")} required class="${ssrRenderClass([{ "border-red-500": errors.confirmPassword }, "w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-theme"])}"><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2">`);
      if (!showConfirmPassword.value) {
        _push(ssrRenderComponent(unref(EyeIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(EyeOffIcon), { class: "h-5 w-5 text-gray-400" }, null, _parent));
      }
      _push(`</button></div>`);
      if (errors.confirmPassword) {
        _push(`<p class="mt-1 text-xs text-red-500">${ssrInterpolate(errors.confirmPassword)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit" class="w-full btn__primary py-2 rounded text-white font-semibold"${ssrIncludeBooleanAttr(!isFormValid.value || isSubmitting.value) ? " disabled" : ""}>${ssrInterpolate(isSubmitting.value ? "REGISTERING..." : "REGISTER")}</button><div class="text-center mt-4"><span class="text-gray-600">Already have an account?</span>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/login",
        class: "text-theme hover:underline ml-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Log in`);
          } else {
            return [
              createTextVNode("Log in")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></form></div></div>`);
    };
  }
};
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Auth/RegistrationForm.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const _sfc_main$B = {
  __name: "Registration",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Registration</title>`);
          } else {
            return [
              createVNode("title", null, "Registration")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="registrationPage"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$C, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "registrationPage" }, [
                createVNode(_sfc_main$C)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Registration.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const __vite_glob_0_4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$B
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$A = {
  __name: "EmptyCart",
  __ssrInlineRender: true,
  setup(__props) {
    const emptyCartIcon = ref("/assets/images/icons/empty-cart.png");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center justify-center p-4" }, _attrs))}><div class="max-w-2xl mx-auto text-center"><div class="mb-6 w-[300px] mx-auto"><img${ssrRenderAttr("src", emptyCartIcon.value)} alt="Empty cart" class="mx-auto"></div><h1 class="text-4xl font-bold mb-6"> Your cart is currently empty. </h1><p class="text-gray-600 mb-8 max-w-lg mx-auto"> Before proceed to checkout you must add some products to your shopping cart. You will find a lot of interesting products on our &quot;Shop&quot; page. </p>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/shop",
        class: "btn__primary inline-block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` RETURN TO SHOP `);
          } else {
            return [
              createTextVNode(" RETURN TO SHOP ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Cart/EmptyCart.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const _sfc_main$z = {
  __name: "ShoppingCart",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    const cartItems = computed(() => cartStore.cartItems);
    computed(() => {
      return subtotal.value;
    });
    const formatPrice = (price) => {
      if (price == null || isNaN(parseFloat(price))) return "0";
      const numericPrice = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : Number(price);
      return numericPrice.toFixed(0);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-7xl mx-auto px-4 py-8" }, _attrs))} data-v-8536d311>`);
      if (cartItems.value.length > 0) {
        _push(`<div class="flex flex-col lg:flex-row gap-6" data-v-8536d311><div class="lg:w-3/4 bg-white rounded-lg shadow-sm border" data-v-8536d311><div class="p-6 border-b" data-v-8536d311><h1 class="text-2xl font-bold text-gray-800" data-v-8536d311> Shopping Cart </h1></div><div class="divide-y" data-v-8536d311><!--[-->`);
        ssrRenderList(cartItems.value, (item) => {
          _push(`<div class="p-6" data-v-8536d311><div class="flex flex-col md:flex-row gap-6" data-v-8536d311><div class="w-32 h-32 flex-shrink-0" data-v-8536d311><img${ssrRenderAttr("src", item.product.featured_image)}${ssrRenderAttr("alt", item.product.product_name)} class="w-full h-full object-contain" data-v-8536d311></div><div class="flex-1" data-v-8536d311><h2 class="text-lg font-medium text-gray-900 mb-1" data-v-8536d311>${ssrInterpolate(item.product.product_name)}</h2><p class="text-sm text-green-600 mb-2" data-v-8536d311> In Stock </p>`);
          if (item.attributes && item.attributes.length > 0) {
            _push(`<div class="flex flex-wrap gap-4 mb-3" data-v-8536d311><!--[-->`);
            ssrRenderList(item.attributes, (attr) => {
              _push(`<div class="flex items-center text-sm" data-v-8536d311><span class="text-gray-600 mr-2" data-v-8536d311>${ssrInterpolate(attr.attribute_name)}:</span><span class="font-medium" data-v-8536d311>${ssrInterpolate(attr.attribute_option)} ${ssrInterpolate(attr.quantity > 1 ? `(${attr.quantity})` : "")}</span>`);
              if (parseFloat(attr.price) > 0) {
                _push(`<span class="text-gray-500 ml-1" data-v-8536d311> (+<span class="" data-v-8536d311>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(formatPrice(
                  parseFloat(attr.price) * attr.quantity
                ))}) </span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex flex-wrap items-center gap-4 mt-4" data-v-8536d311><div class="flex items-center border rounded-full overflow-hidden" data-v-8536d311><button class="px-3 py-1 hover:bg-gray-100"${ssrIncludeBooleanAttr(item.quantity <= 1) ? " disabled" : ""} data-v-8536d311> - </button><input type="number"${ssrRenderAttr("value", item.quantity)} class="w-10 text-center border-none focus:ring-0 p-0" min="1" data-v-8536d311><button class="px-3 py-1 hover:bg-gray-100" data-v-8536d311> + </button></div><button class="text-sm text-blue-600 hover:text-blue-800 hover:underline" data-v-8536d311> Delete </button></div></div><div class="text-right" data-v-8536d311><span class="text-lg font-bold" data-v-8536d311><span class="" data-v-8536d311>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(formatPrice(item.individual_price))}<span class="" data-v-8536d311></span></span><div class="text-sm text-gray-500 mt-1" data-v-8536d311>${ssrInterpolate(item.quantity)} × <span class="" data-v-8536d311>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(formatPrice(item.individual_price))}</div><div class="font-bold mt-2" data-v-8536d311><span class="" data-v-8536d311>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(formatPrice(item.final_price))}</div></div></div></div>`);
        });
        _push(`<!--]--></div><div class="p-6 border-t flex justify-between items-center" data-v-8536d311><span class="text-lg" data-v-8536d311>Subtotal (${ssrInterpolate(cartItems.value.length)} item${ssrInterpolate(cartItems.value.length > 1 ? "s" : "")}):</span><span class="text-xl font-bold" data-v-8536d311><span class="" data-v-8536d311>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(Math.floor(unref(cartStore).cartTotalPrice))}</span></div></div><div class="lg:w-1/4" data-v-8536d311><div class="bg-white rounded-lg shadow-sm border p-6" data-v-8536d311><h2 class="text-lg font-medium mb-4" data-v-8536d311> Subtotal (${ssrInterpolate(cartItems.value.length)} item${ssrInterpolate(cartItems.value.length > 1 ? "s" : "")}): <span class="font-bold" data-v-8536d311><span class="" data-v-8536d311>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(Math.floor(unref(cartStore).cartTotalPrice))}</span></h2><button class="w-full py-3 bg-theme hover:bg-scondary text-center rounded-full font-medium text-gray-100 transition-colors" data-v-8536d311> Proceed to checkout </button></div></div></div>`);
      } else {
        _push(ssrRenderComponent(_sfc_main$A, null, null, _parent));
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Cart/ShoppingCart.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const ShoppingCart = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["__scopeId", "data-v-8536d311"]]);
const _sfc_main$y = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Cart</title>`);
          } else {
            return [
              createVNode("title", null, "Cart")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="cartPage"${_scopeId}>`);
            _push2(ssrRenderComponent(ShoppingCart, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "cartPage" }, [
                createVNode(ShoppingCart)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Cart/Index.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const __vite_glob_0_5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$y
}, Symbol.toStringTag, { value: "Module" }));
const pushToDataLayer = (eventData) => {
  if (window.dataLayer) {
    window.dataLayer.length = 0;
    window.dataLayer.push(eventData);
    console.log("DataLayer updated:", window.dataLayer);
  } else {
    console.warn("GTM Data Layer is not initialized.");
  }
};
const trackCheckout = (data, totalPrice) => {
  var _a, _b;
  if (!data) return;
  console.log("trackCheckout data:", data);
  const items = Array.isArray(data) ? data : [data];
  const gtmData = {
    event: "begin_checkout",
    ecommerce: {
      currency: "BDT",
      value: totalPrice,
      // Calculate total value
      items: items.map((item) => {
        var _a2, _b2;
        return {
          item_id: item.product_id || ((_a2 = item.product) == null ? void 0 : _a2.id),
          // Product ID
          item_name: ((_b2 = item.product) == null ? void 0 : _b2.product_name) || "Unknown Product",
          // Product Name
          price: parseFloat(item.final_price.replace(/,/g, "") || 0),
          // Use final_price with comma removal
          quantity: item.quantity || 1,
          // Product Quantity
          variant: item.attributes ? item.attributes.map(
            (attr) => `${attr.attribute_name}: ${attr.attribute_option}`
          ).join(", ") : ""
          // Format attribute variants
        };
      })
    },
    custom_data: {
      selected_attributes: items.flatMap(
        (item) => item.attributes ? item.attributes.map((attr) => ({
          attribute_id: attr.attribute_id || null,
          attribute_option_id: attr.attribute_option_id || null,
          attribute_name: attr.attribute_name || "",
          attribute_option: attr.attribute_option || "",
          attribute_option_price: attr.price || "0.00",
          id: attr.product_attr_id || null
        })) : []
      ),
      campaign_id: ((_a = items[0]) == null ? void 0 : _a.campaign_id) || null,
      // Campaign ID if available
      discount_value: ((_b = items[0]) == null ? void 0 : _b.discount_value) || null
      // Discount value if available
    }
  };
  pushToDataLayer(gtmData);
};
const trackDiractCheckout = (data) => {
  var _a;
  if (!data) return;
  const gtmData = {
    event: "begin_checkout",
    ecommerce: {
      currency: "BDT",
      value: parseFloat(data.totalPrice),
      items: [
        {
          item_id: data.product_id,
          // Product ID
          item_name: data.product_name,
          // Product Name
          price: parseFloat(data.price),
          // Convert to number
          item_brand: ((_a = data.brand) == null ? void 0 : _a.name) || "No Brand",
          item_category: data.category || "",
          item_category2: data.subcategory || "",
          item_variant: data.selectedAttributes.map(
            (attr) => `${attr.attribute_name}: ${attr.attribute_option}`
          ).join(", "),
          // Format attribute variants
          quantity: data.quantity,
          // Product Quantity
          free_delivery: data.free_delivery ? "Yes" : "No"
          // Convert to readable format
        }
      ]
    },
    custom_data: {
      selected_attributes: data.selectedAttributes ? data.selectedAttributes.map((attr) => ({
        attribute_id: attr.attribute_id || null,
        attribute_option_id: attr.attribute_option_id || null,
        attribute_name: attr.attribute_name || "",
        attribute_option: attr.attribute_option || "",
        attribute_option_price: attr.attribute_option_price || "0.00",
        id: attr.product_attr_id || null
      })) : [],
      category: data.category || "",
      free_delivery: data.free_delivery ? "Yes" : "No",
      total_price: parseFloat(data.totalPrice) || 0
    }
  };
  console.log("GTAG Direct Checkout Data:", gtmData);
  pushToDataLayer(gtmData);
};
const _sfc_main$x = {
  __name: "CheckoutForm",
  __ssrInlineRender: true,
  setup(__props) {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const homeStore = useHomeStore();
    const $axios = inject("$axios");
    const siteinfos = computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a[0]) || {};
    });
    const cartItems = computed(() => cartStore.cartItems);
    const directOrderProduct = ref(null);
    onMounted(() => {
      if (typeof window !== "undefined") {
        const storedProductData = localStorage.getItem(
          "directOrderProductData"
        );
        if (storedProductData) {
          directOrderProduct.value = JSON.parse(storedProductData);
        }
      }
    });
    const subtotal2 = computed(() => {
      if (cartStore.is_direct_order) {
        return directOrderProductSubtotal.value;
      } else {
        return cartItems.value.reduce((total2, item) => {
          const price = parseFloat(item.individual_price.replace(/,/g, "")) || 0;
          const quantity = item.quantity || 1;
          return total2 + price * quantity;
        }, 0);
      }
    });
    const directOrderProductSubtotal = computed(() => {
      if (!directOrderProduct.value) return 0;
      const basePrice = parseFloat(directOrderProduct.value.price || 0);
      const quantity = directOrderProduct.value.quantity || 1;
      const additionalPrices = directOrderProduct.value.selectedAttributes.reduce(
        (total2, attr) => total2 + parseFloat(attr.attribute_option_price || 0),
        0
      );
      const unitTotal = basePrice + additionalPrices;
      const subtotal3 = unitTotal * quantity;
      return subtotal3;
    });
    computed(() => {
      var _a;
      if (cartStore.is_direct_order) {
        if (directOrderProduct.value && directOrderProduct.value.campaign_id && directOrderProduct.value.discount_value) {
          const discountValue = parseFloat(
            directOrderProduct.value.discount_value
          );
          const quantity = directOrderProduct.value.quantity || 1;
          const price = parseFloat(
            ((_a = directOrderProduct.value.product) == null ? void 0 : _a.price) || 0
          );
          if (directOrderProduct.value.discount_type === "percentage") {
            return price * discountValue / 100 * quantity;
          } else {
            return discountValue * quantity;
          }
        }
        return 0;
      } else {
        return cartItems.value.reduce((total2, item) => {
          var _a2;
          const discountValue = item.discount_value ? parseFloat(item.discount_value) : 0;
          const quantity = item.quantity || 1;
          const price = parseFloat(((_a2 = item.product) == null ? void 0 : _a2.price) || 0);
          if (item.discount_type === "percentage") {
            return total2 + price * discountValue / 100 * quantity;
          } else {
            return total2 + discountValue * quantity;
          }
        }, 0);
      }
    });
    const total = computed(
      () => Math.round(
        subtotal2.value + form.value.delivery_charge - (form.value.discount || 0)
      )
    );
    const cod = ref("/assets/images/payment/cod-pay.png");
    const addresses = ref([]);
    onMounted(() => {
      if (authStore.user) {
        fetchAddresses();
      }
    });
    async function fetchAddresses() {
      try {
        const response = await $axios.get("/get-addresses");
        if (response.data.success) {
          addresses.value = response.data.address;
          fillAddressData();
        } else {
          toast.error("Failed to fetch addresses.");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to fetch addresses.");
      }
    }
    function fillAddressData() {
      if (addresses.value && addresses.value.length > 0) {
        const defaultAddress = addresses.value.find(
          (addr) => addr.is_default === 1
        );
        if (defaultAddress) {
          form.value.name = defaultAddress.name;
          form.value.mobile = defaultAddress.phone;
          form.value.address = defaultAddress.address;
        } else if (addresses.value[0]) {
          form.value.name = addresses.value[0].name;
          form.value.mobile = addresses.value[0].phone;
          form.value.address = addresses.value[0].address;
        }
      }
    }
    const form = ref({
      name: "",
      mobile: "",
      email: "",
      extra_mobile: "",
      address: "",
      note: "",
      order_status: "pending",
      order_type: "checkout",
      delivery: "cod",
      delivery_area: "",
      delivery_charge: 0,
      discount: 0
    });
    const errors = reactive({
      name: "",
      mobile: "",
      address: "",
      thana: "",
      zila: "",
      delivery_area: ""
    });
    const scInsideDhaka = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = homeStore.siteinfos) == null ? void 0 : _a[0]) == null ? void 0 : _b.shipping_charge_inside_dhaka) ? parseFloat(homeStore.siteinfos[0].shipping_charge_inside_dhaka) : null;
      }
    );
    const scOutsideDhaka = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = homeStore.siteinfos) == null ? void 0 : _a[0]) == null ? void 0 : _b.shipping_charge_outside_dhaka) ? parseFloat(homeStore.siteinfos[0].shipping_charge_outside_dhaka) : null;
      }
    );
    const updateDeliveryCharge = () => {
      var _a, _b;
      const hasCartFreeShipping = (_a = cartItems.value) == null ? void 0 : _a.some(
        (item) => {
          var _a2;
          return ((_a2 = item.product) == null ? void 0 : _a2.is_free_shipping) === 1;
        }
      );
      const hasDirectOrderFreeShipping = ((_b = directOrderProduct == null ? void 0 : directOrderProduct.value) == null ? void 0 : _b.is_free_shipping) === 1;
      if (hasCartFreeShipping || hasDirectOrderFreeShipping) {
        form.value.delivery_charge = 0;
      } else {
        if (form.value.delivery_area === "inside") {
          form.value.delivery_charge = scInsideDhaka.value;
        } else {
          form.value.delivery_charge = scOutsideDhaka.value;
        }
      }
    };
    watch(
      () => form.value.delivery_area,
      () => {
        updateDeliveryCharge();
        errors.delivery_area = form.value.delivery_area ? "" : "Delivery area is required.";
      }
    );
    watch(
      () => authStore.user,
      (newUser) => {
        if (newUser && !form.value.name) {
          form.value.name = newUser.name;
        }
      },
      { immediate: true }
    );
    ref(false);
    const couponCode = ref("");
    computed(() => {
      var _a;
      if (cartStore.is_direct_order && directOrderProduct.value) {
        return [
          {
            coupon_code: couponCode.value,
            product_id: directOrderProduct.value.product_id,
            quantity: directOrderProduct.value.quantity,
            product_attr_ids: ((_a = directOrderProduct.value.selectedAttributes) == null ? void 0 : _a.map(
              (attr) => attr.product_attr_id
            )) || []
          }
        ];
      }
      return cartItems.value.map((item) => ({
        coupon_code: couponCode.value,
        product_id: item.product.id,
        quantity: item.quantity,
        product_attr_ids: item.attributes.map((attr) => attr.product_attr_id)
      }));
    });
    ref(null);
    ref(null);
    const trackCheckoutEvent = () => {
      if (cartStore.is_direct_order) {
        if (directOrderProduct.value) {
          trackDiractCheckout(directOrderProduct.value);
        }
      } else {
        if (cartItems.value && cartItems.value.length > 0) {
          trackCheckout(cartItems.value, total.value);
        }
      }
    };
    onMounted(() => {
      trackCheckoutEvent();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "checkout-container bg-white" }, _attrs))} data-v-a355a018><div class="container mx-auto px-4 py-8" data-v-a355a018><div class="grid grid-cols-1 lg:grid-cols-3 gap-8" data-v-a355a018><div class="lg:col-span-2" data-v-a355a018><div class="mb-8" data-v-a355a018><div class="flex items-center justify-between mb-4" data-v-a355a018><h2 class="text-xl font-semibold" data-v-a355a018> Billing address </h2>`);
      if (!unref(authStore).user) {
        _push(`<div class="text-sm" data-v-a355a018><span data-v-a355a018>Already have an account?</span>`);
        _push(ssrRenderComponent(unref(Pe), {
          href: "/login",
          class: "text-blue-600 ml-1 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Log in`);
            } else {
              return [
                createTextVNode("Log in")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mb-8" data-v-a355a018><div class="mb-4" data-v-a355a018><div data-v-a355a018><input${ssrRenderAttr("value", form.value.name)} type="text" placeholder="Enter Your First Name" class="${ssrRenderClass([{ "border-red-500": errors.name }, "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"])}" data-v-a355a018>`);
      if (errors.name) {
        _push(`<p class="mt-1 text-xs text-red-500" data-v-a355a018>${ssrInterpolate(errors.name)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mb-4" data-v-a355a018><input${ssrRenderAttr("value", form.value.address)} type="text" placeholder="Enter Your Address" class="${ssrRenderClass([{ "border-red-500": errors.address }, "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"])}" required data-v-a355a018>`);
      if (errors.address) {
        _push(`<p class="mt-1 text-xs text-red-500" data-v-a355a018>${ssrInterpolate(errors.address)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-4" data-v-a355a018><input${ssrRenderAttr("value", form.value.mobile)} type="tel" placeholder="Enter Your Phone Number" class="${ssrRenderClass([{ "border-red-500": errors.mobile }, "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"])}" required data-v-a355a018>`);
      if (errors.mobile) {
        _push(`<p class="mt-1 text-xs text-red-500" data-v-a355a018>${ssrInterpolate(errors.mobile)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="mb-8" data-v-a355a018><h2 class="text-xl font-semibold mb-4" data-v-a355a018>Payment</h2><p class="text-sm text-gray-600 mb-4" data-v-a355a018> All transactions are secure and encrypted. </p><div class="space-y-3" data-v-a355a018><label class="${ssrRenderClass([{
        "border-blue-500 bg-blue-50": form.value.delivery === "cod"
      }, "block border border-gray-300 rounded-md p-4 cursor-pointer transition hover:border-blue-500"])}" data-v-a355a018><div class="flex items-center" data-v-a355a018><input type="radio" name="payment" value="cod"${ssrIncludeBooleanAttr(ssrLooseEqual(form.value.delivery, "cod")) ? " checked" : ""} class="mr-3 h-4 w-4 text-blue-600" data-v-a355a018><div class="flex items-center" data-v-a355a018><img${ssrRenderAttr("src", cod.value)} alt="Cash on Delivery" class="h-8 mr-2" data-v-a355a018><span class="font-medium" data-v-a355a018>Cash on Delivery (COD)</span></div></div>`);
      if (form.value.delivery === "cod") {
        _push(`<div class="mt-2 pl-7 text-sm text-gray-600" data-v-a355a018> Pay when you receive your order. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</label></div></div></div><div class="bg-gray-50 p-6 rounded-lg" data-v-a355a018><h2 class="text-xl font-semibold mb-6" data-v-a355a018>Your order</h2><div class="divide-y divide-gray-200 mb-6" data-v-a355a018>`);
      if (cartItems.value.length > 0) {
        _push(`<!--[-->`);
        ssrRenderList(cartItems.value, (item) => {
          _push(`<div class="py-4" data-v-a355a018><div class="flex items-start flex-col sm:flex-row" data-v-a355a018><div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mr-4" data-v-a355a018><img${ssrRenderAttr("src", item.product.featured_image)}${ssrRenderAttr("alt", item.product.product_name)} class="h-full w-full object-cover object-center" data-v-a355a018></div><div class="flex-grow" data-v-a355a018><div class="flex justify-between" data-v-a355a018><div data-v-a355a018><h3 class="text-sm font-medium text-gray-900" data-v-a355a018>${ssrInterpolate(item.product.product_name)}</h3><p class="mt-1 text-xs text-gray-500" data-v-a355a018><!--[-->`);
          ssrRenderList(item.attributes, (attr, index) => {
            _push(`<span data-v-a355a018>${ssrInterpolate(attr.attribute_name)}: ${ssrInterpolate(attr.attribute_option)} ${ssrInterpolate(attr.quantity > 1 ? `(${attr.quantity})` : "")} `);
            if (index < item.attributes.length - 1) {
              _push(`<span data-v-a355a018>, </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span>`);
          });
          _push(`<!--]--></p>`);
          if (item.discount_value && parseFloat(
            item.discount_value
          ) > 0) {
            _push(`<p class="mt-1 text-xs text-theme" data-v-a355a018> Campaign Discount: ${ssrInterpolate(item.discount_type === "percentage" ? Math.floor(
              item.discount_value
            ) + "%" : unref(cartStore).currencysymbol + Math.floor(
              item.discount_value
            ))} OFF </p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-1 flex items-center" data-v-a355a018><div class="flex items-center border border-gray-300 rounded-full" data-v-a355a018><button class="px-3 py-1 hover:bg-gray-100" data-v-a355a018><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-a355a018><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" data-v-a355a018></path></svg></button><span class="w-10 text-center border-none focus:ring-0 p-0" data-v-a355a018>${ssrInterpolate(item.quantity)}</span><button class="px-3 py-1 hover:bg-gray-100" data-v-a355a018><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-a355a018><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" data-v-a355a018></path></svg></button></div></div></div><p class="text-sm font-bold text-gray-900 flex items-center" data-v-a355a018><span data-v-a355a018>${ssrInterpolate(unref(cartStore).currencysymbol)}</span><span data-v-a355a018>${ssrInterpolate(parseFloat(
            item.final_price.replace(
              /,/g,
              ""
            )
          ).toLocaleString("en-US"))}</span></p></div></div></div></div>`);
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mb-6 border-t border-gray-200 pt-4" data-v-a355a018><div class="flex flex-wrap items-center justify-between" data-v-a355a018><input${ssrRenderAttr("value", couponCode.value)} type="text" placeholder="Discount code or gift card" class="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" data-v-a355a018><button class="px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-r-md hover:bg-gray-300 transition" data-v-a355a018> Apply </button></div></div><div class="space-y-4 py-4 border-t border-gray-200" data-v-a355a018><div class="flex justify-between text-sm font-bold" data-v-a355a018><span data-v-a355a018>Subtotal</span><span data-v-a355a018>${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(subtotal2.value.toLocaleString("en-US"))}</span></div><div class="flex justify-between text-sm font-bold" data-v-a355a018><span data-v-a355a018>Coupon Discount</span><span data-v-a355a018>-${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(Math.round(form.value.discount).toLocaleString(
        "en-US"
      ))}</span></div><div class="mb-4" data-v-a355a018><label class="block mb-2 text-sm font-bold" data-v-a355a018>Shipping</label><div class="space-y-2" data-v-a355a018><div class="${ssrRenderClass([{
        " bg-blue-50": form.value.delivery_area === "inside",
        "border-red-500": errors.delivery_area
      }, "flex items-center w-full px-4 py-3 border border-gray-300 rounded-md transition"])}" data-v-a355a018><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(form.value.delivery_area, "inside")) ? " checked" : ""} value="inside" id="inside" name="delivery_area" class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 focus:ring-2" data-v-a355a018><label for="inside" checked class="ml-2 text-sm text-gray-700 w-full" data-v-a355a018>ঢাকার মধ্যে ${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(Number(
        (_b = (_a = unref(homeStore).siteinfos) == null ? void 0 : _a[0]) == null ? void 0 : _b.shipping_charge_inside_dhaka
      ).toLocaleString("en-US"))}</label></div><div class="${ssrRenderClass([{
        "border-blue-500 bg-blue-50": form.value.delivery_area === "outside",
        "border-red-500": errors.delivery_area
      }, "flex items-center w-full px-4 py-3 border border-gray-300 rounded-md transition"])}" data-v-a355a018><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(form.value.delivery_area, "outside")) ? " checked" : ""} value="outside" id="outside" name="delivery_area" class="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500 focus:ring-2" data-v-a355a018><label for="outside" class="ml-2 text-sm text-gray-700 w-full" data-v-a355a018>ঢাকার বাইরে ${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(Number(
        (_d = (_c = unref(homeStore).siteinfos) == null ? void 0 : _c[0]) == null ? void 0 : _d.shipping_charge_outside_dhaka
      ).toLocaleString("en-US"))}</label></div></div>`);
      if (errors.delivery_area) {
        _push(`<p class="mt-1 text-xs text-red-500" data-v-a355a018>${ssrInterpolate(errors.delivery_area)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if ((_e = siteinfos.value) == null ? void 0 : _e.attention_notice) {
        _push(`<div class="adisonal_note" data-v-a355a018><b class="bg-yellow-400 text-sm" data-v-a355a018>${ssrInterpolate((_f = siteinfos.value) == null ? void 0 : _f.attention_notice)}</b></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-between text-base font-bold pt-4 border-t border-gray-200" data-v-a355a018><span data-v-a355a018>Total</span><span data-v-a355a018>${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(Math.round(total.value).toLocaleString("en-US"))}</span></div></div><div class="mt-6" data-v-a355a018><button class="w-full py-4 bg-theme text-white font-medium rounded-md hover:bg-secondary transition" data-v-a355a018> Place order </button></div><p class="text-xs text-gray-500 mt-4 text-center" data-v-a355a018> All transactions are secure and encrypted. </p></div></div></div></div>`);
    };
  }
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Checkout/CheckoutForm.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const CheckoutForm = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-a355a018"]]);
const _sfc_main$w = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Checkout</title>`);
          } else {
            return [
              createVNode("title", null, "Checkout")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="cartPage"${_scopeId}>`);
            _push2(ssrRenderComponent(CheckoutForm, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "cartPage" }, [
                createVNode(CheckoutForm)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Checkout/Index.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const __vite_glob_0_6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$w
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$v = {
  __name: "Success",
  __ssrInlineRender: true,
  props: {
    invoiceNumber: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const cartStore = useCartStore();
    const props = __props;
    const order = ref(null);
    const checkoutMessage = ref("");
    const $axios = inject("$axios");
    const fetchOrderData = async () => {
      try {
        const response = await $axios.get(`/order/data/${props.invoiceNumber}`);
        console.log("API Response:", response.data);
        if (response.data.success) {
          order.value = response.data.data.order;
          checkoutMessage.value = response.data.data.checkoutMessage || "";
        } else {
          console.error("Order not found in response");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    onMounted(() => {
      fetchOrderData();
    });
    const getStatusClass = (status) => {
      switch (status == null ? void 0 : status.toLowerCase()) {
        case "pending":
          return "bg-amber-400";
        case "processed":
          return "bg-blue-500";
        case "shipped":
          return "bg-green-500";
        case "returned":
          return "bg-red-500";
        case "delivered":
          return "bg-green-600";
        case "cancelled":
          return "bg-red-600";
        case "on delivery":
          return "bg-amber-500";
        case "pending delivery":
          return "bg-orange-500";
        case "incomplete":
          return "bg-gray-500";
        default:
          return "bg-gray-400";
      }
    };
    const couponDiscount = computed(() => {
      var _a;
      if (((_a = order.value) == null ? void 0 : _a.items) && order.value.items.length) {
        let totalDiscount = 0;
        order.value.items.forEach((item) => {
          const actualPrice = item.price;
          if (item.discount && item.discount_type) {
            if (item.discount_type.toLowerCase() === "percentage") {
              const discountAmount = parseFloat(actualPrice) * item.quantity * parseFloat(item.discount) / 100;
              totalDiscount += Math.round(discountAmount);
            } else if (item.discount_type.toLowerCase() === "fixed") {
              totalDiscount += parseFloat(item.discount);
            }
          }
        });
        return totalDiscount;
      }
      return 0;
    });
    const campaignDiscount = computed(() => {
      var _a;
      if (((_a = order.value) == null ? void 0 : _a.items) && order.value.items.length) {
        let totalDiscount = 0;
        order.value.items.forEach((item) => {
          if (item.campaign) {
            totalDiscount += parseFloat(item.campaign.discount) * item.quantity;
          }
        });
        return totalDiscount;
      }
      return 0;
    });
    const subtotal2 = computed(() => {
      var _a;
      let total = 0;
      if (((_a = order.value) == null ? void 0 : _a.items) && order.value.items.length) {
        order.value.items.forEach((item) => {
          total += parseFloat(item.price) * item.quantity;
        });
      }
      return total;
    });
    computed(() => {
      var _a;
      return couponDiscount.value + campaignDiscount.value + parseFloat(((_a = order.value) == null ? void 0 : _a.discount) || 0);
    });
    computed(() => {
      var _a;
      return subtotal2.value - couponDiscount.value - campaignDiscount.value + parseFloat(((_a = order.value) == null ? void 0 : _a.delivery_charge) || 0);
    });
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    };
    const formatCurrency = (amount) => {
      return parseFloat(amount || 0).toFixed(2);
    };
    const printReceipt = () => {
      const printContent = document.getElementById("receipt_print");
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Order Successful</title>`);
          } else {
            return [
              createVNode("title", null, "Order Successful")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (order.value) {
              _push2(`<div id="receipt_print" class="py-4 px-4 bg-gray-50 min-h-screen"${_scopeId}><div class="max-w-4xl mx-auto"${_scopeId}><div class="bg-white rounded-lg shadow-md p-6 mb-6 text-center"${_scopeId}><div class="flex justify-center mb-4"${_scopeId}><div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"${_scopeId}><svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"${_scopeId}></path></svg></div></div><h1 class="text-2xl font-bold text-gray-800"${_scopeId}>Order Placed Successfully!</h1><p class="text-gray-600 mt-2"${_scopeId}>${ssrInterpolate(checkoutMessage.value)}</p></div><div class="bg-white rounded-lg shadow-md overflow-hidden mb-6"${_scopeId}><div class="border-b border-gray-200 bg-gray-50 px-6 py-4"${_scopeId}><h2 class="text-lg font-semibold text-gray-800"${_scopeId}>Order Information</h2></div><div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-6"${_scopeId}><div class="space-y-4"${_scopeId}><div class="flex justify-between items-center"${_scopeId}><span class="text-gray-600"${_scopeId}>Invoice Number:</span><span class="font-medium"${_scopeId}>#${ssrInterpolate(order.value.invoice_number)}</span></div><div class="flex justify-between items-center"${_scopeId}><span class="text-gray-600"${_scopeId}>Order Date:</span><span class="font-medium"${_scopeId}>${ssrInterpolate(formatDate(order.value.created_at))}</span></div><div class="flex justify-between items-center"${_scopeId}><span class="text-gray-600"${_scopeId}>Payment Method:</span><span class="font-medium capitalize"${_scopeId}>${ssrInterpolate(order.value.payment_method)}</span></div><div class="flex justify-between items-center"${_scopeId}><span class="text-gray-600"${_scopeId}>Payment Status:</span><span class="font-medium capitalize"${_scopeId}>${ssrInterpolate(order.value.payment_status)}</span></div><div class="flex justify-between items-center"${_scopeId}><span class="text-gray-600"${_scopeId}>Order Status:</span><span class="${ssrRenderClass([getStatusClass(order.value.order_status), "px-3 py-1 rounded-full text-white text-sm font-medium"])}"${_scopeId}>${ssrInterpolate(order.value.order_status)}</span></div></div><div class="space-y-4"${_scopeId}><div${_scopeId}><h3 class="font-medium text-gray-800 mb-2"${_scopeId}>Customer Details</h3><p class="text-gray-600"${_scopeId}>${ssrInterpolate(order.value.customer_name)}</p><p class="text-gray-600"${_scopeId}>${ssrInterpolate(order.value.phone_number)}</p>`);
              if (order.value.alternative_phone_number) {
                _push2(`<p class="text-gray-600"${_scopeId}>Alt: ${ssrInterpolate(order.value.alternative_phone_number)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div${_scopeId}><h3 class="font-medium text-gray-800 mb-2"${_scopeId}>Shipping Address</h3><p class="text-gray-600"${_scopeId}>${ssrInterpolate(order.value.address || "N/A")}</p>`);
              if (order.value.note) {
                _push2(`<p class="text-gray-600 mt-2"${_scopeId}><span class="font-medium"${_scopeId}>Note:</span> ${ssrInterpolate(order.value.note)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div></div><div class="bg-white rounded-lg shadow-md overflow-hidden mb-6"${_scopeId}><div class="border-b border-gray-200 bg-gray-50 px-6 py-4"${_scopeId}><h2 class="text-lg font-semibold text-gray-800"${_scopeId}>Order Items</h2></div><div class="divide-y divide-gray-200"${_scopeId}><!--[-->`);
              ssrRenderList(order.value.items, (item, index) => {
                _push2(`<div class="p-6"${_scopeId}><div class="flex flex-col sm:flex-row gap-4"${_scopeId}><div class="w-24 h-24 flex-shrink-0"${_scopeId}><img${ssrRenderAttr("src", item.product.featured_image)}${ssrRenderAttr("alt", item.product.product_name)} class="w-full h-full object-cover rounded-md"${_scopeId}></div><div class="flex-1"${_scopeId}><h3 class="font-medium text-gray-800"${_scopeId}>${ssrInterpolate(item.product.product_name)}</h3><div class="mt-2 text-sm text-gray-600"${_scopeId}><p${_scopeId}>Quantity: ${ssrInterpolate(item.quantity)}</p>`);
                if (item.options && item.options.length) {
                  _push2(`<div class="mt-2"${_scopeId}><p class="font-medium"${_scopeId}>Options:</p><div class="flex flex-wrap gap-2 mt-1"${_scopeId}><!--[-->`);
                  ssrRenderList(item.options, (option) => {
                    _push2(`<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"${_scopeId}>${ssrInterpolate(option.attribute_option.name)} ${ssrInterpolate(option.quantity > 1 ? `(${option.quantity})` : "")}</span>`);
                  });
                  _push2(`<!--]--></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></div></div></div>`);
              });
              _push2(`<!--]--><div class="flex justify-center items-center p-4 font-medium text-lg"${_scopeId}><span${_scopeId}>Total: ${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(formatCurrency(order.value.total_price))}</span></div></div></div><div class="flex justify-center gap-4 print-hide"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Pe), {
                href: "/",
                class: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Continue Shopping `);
                  } else {
                    return [
                      createTextVNode(" Continue Shopping ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"${_scopeId}><svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"${_scopeId}></path></svg> Print Receipt </button></div></div></div>`);
            } else {
              _push2(`<div class="py-4 px-4 bg-gray-50 min-h-screen flex items-center justify-center"${_scopeId}><p class="text-gray-600"${_scopeId}>Loading order details...</p></div>`);
            }
          } else {
            return [
              order.value ? (openBlock(), createBlock("div", {
                key: 0,
                id: "receipt_print",
                class: "py-4 px-4 bg-gray-50 min-h-screen"
              }, [
                createVNode("div", { class: "max-w-4xl mx-auto" }, [
                  createVNode("div", { class: "bg-white rounded-lg shadow-md p-6 mb-6 text-center" }, [
                    createVNode("div", { class: "flex justify-center mb-4" }, [
                      createVNode("div", { class: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center" }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-10 h-10 text-green-500",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M5 13l4 4L19 7"
                          })
                        ]))
                      ])
                    ]),
                    createVNode("h1", { class: "text-2xl font-bold text-gray-800" }, "Order Placed Successfully!"),
                    createVNode("p", { class: "text-gray-600 mt-2" }, toDisplayString(checkoutMessage.value), 1)
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow-md overflow-hidden mb-6" }, [
                    createVNode("div", { class: "border-b border-gray-200 bg-gray-50 px-6 py-4" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-800" }, "Order Information")
                    ]),
                    createVNode("div", { class: "p-4 grid grid-cols-1 sm:grid-cols-2 gap-6" }, [
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("span", { class: "text-gray-600" }, "Invoice Number:"),
                          createVNode("span", { class: "font-medium" }, "#" + toDisplayString(order.value.invoice_number), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("span", { class: "text-gray-600" }, "Order Date:"),
                          createVNode("span", { class: "font-medium" }, toDisplayString(formatDate(order.value.created_at)), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("span", { class: "text-gray-600" }, "Payment Method:"),
                          createVNode("span", { class: "font-medium capitalize" }, toDisplayString(order.value.payment_method), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("span", { class: "text-gray-600" }, "Payment Status:"),
                          createVNode("span", { class: "font-medium capitalize" }, toDisplayString(order.value.payment_status), 1)
                        ]),
                        createVNode("div", { class: "flex justify-between items-center" }, [
                          createVNode("span", { class: "text-gray-600" }, "Order Status:"),
                          createVNode("span", {
                            class: [getStatusClass(order.value.order_status), "px-3 py-1 rounded-full text-white text-sm font-medium"]
                          }, toDisplayString(order.value.order_status), 3)
                        ])
                      ]),
                      createVNode("div", { class: "space-y-4" }, [
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-medium text-gray-800 mb-2" }, "Customer Details"),
                          createVNode("p", { class: "text-gray-600" }, toDisplayString(order.value.customer_name), 1),
                          createVNode("p", { class: "text-gray-600" }, toDisplayString(order.value.phone_number), 1),
                          order.value.alternative_phone_number ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-gray-600"
                          }, "Alt: " + toDisplayString(order.value.alternative_phone_number), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", null, [
                          createVNode("h3", { class: "font-medium text-gray-800 mb-2" }, "Shipping Address"),
                          createVNode("p", { class: "text-gray-600" }, toDisplayString(order.value.address || "N/A"), 1),
                          order.value.note ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-gray-600 mt-2"
                          }, [
                            createVNode("span", { class: "font-medium" }, "Note:"),
                            createTextVNode(" " + toDisplayString(order.value.note), 1)
                          ])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white rounded-lg shadow-md overflow-hidden mb-6" }, [
                    createVNode("div", { class: "border-b border-gray-200 bg-gray-50 px-6 py-4" }, [
                      createVNode("h2", { class: "text-lg font-semibold text-gray-800" }, "Order Items")
                    ]),
                    createVNode("div", { class: "divide-y divide-gray-200" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(order.value.items, (item, index) => {
                        return openBlock(), createBlock("div", {
                          key: index,
                          class: "p-6"
                        }, [
                          createVNode("div", { class: "flex flex-col sm:flex-row gap-4" }, [
                            createVNode("div", { class: "w-24 h-24 flex-shrink-0" }, [
                              createVNode("img", {
                                src: item.product.featured_image,
                                alt: item.product.product_name,
                                class: "w-full h-full object-cover rounded-md"
                              }, null, 8, ["src", "alt"])
                            ]),
                            createVNode("div", { class: "flex-1" }, [
                              createVNode("h3", { class: "font-medium text-gray-800" }, toDisplayString(item.product.product_name), 1),
                              createVNode("div", { class: "mt-2 text-sm text-gray-600" }, [
                                createVNode("p", null, "Quantity: " + toDisplayString(item.quantity), 1),
                                item.options && item.options.length ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: "mt-2"
                                }, [
                                  createVNode("p", { class: "font-medium" }, "Options:"),
                                  createVNode("div", { class: "flex flex-wrap gap-2 mt-1" }, [
                                    (openBlock(true), createBlock(Fragment, null, renderList(item.options, (option) => {
                                      return openBlock(), createBlock("span", {
                                        key: option.id,
                                        class: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                      }, toDisplayString(option.attribute_option.name) + " " + toDisplayString(option.quantity > 1 ? `(${option.quantity})` : ""), 1);
                                    }), 128))
                                  ])
                                ])) : createCommentVNode("", true)
                              ])
                            ])
                          ])
                        ]);
                      }), 128)),
                      createVNode("div", { class: "flex justify-center items-center p-4 font-medium text-lg" }, [
                        createVNode("span", null, "Total: " + toDisplayString(unref(cartStore).currencysymbol) + toDisplayString(formatCurrency(order.value.total_price)), 1)
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "flex justify-center gap-4 print-hide" }, [
                    createVNode(unref(Pe), {
                      href: "/",
                      class: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Continue Shopping ")
                      ]),
                      _: 1
                    }),
                    createVNode("button", {
                      type: "button",
                      class: "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
                      onClick: printReceipt
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 mr-2",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "2",
                          d: "M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        })
                      ])),
                      createTextVNode(" Print Receipt ")
                    ])
                  ])
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "py-4 px-4 bg-gray-50 min-h-screen flex items-center justify-center"
              }, [
                createVNode("p", { class: "text-gray-600" }, "Loading order details...")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Checkout/Success.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const __vite_glob_0_7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$v
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$u = {
  __name: "ThankYou",
  __ssrInlineRender: true,
  setup(__props) {
    const orderDetails = ref({});
    const thankyouPng = ref("/assets/images/icons/thank-you.png");
    const totalCouponDiscount = computed(() => {
      var _a;
      if (!((_a = orderDetails.value) == null ? void 0 : _a.items)) return 0;
      return orderDetails.value.items.reduce((sum, item) => sum + (item.coupon_discount || 0), 0);
    });
    const totalCampaignDiscount = computed(() => {
      var _a;
      if (!((_a = orderDetails.value) == null ? void 0 : _a.items)) return 0;
      return orderDetails.value.items.reduce((sum, item) => sum + (item.campaign_discount || 0), 0);
    });
    const totalDiscount = computed(() => {
      var _a;
      return totalCouponDiscount.value + totalCampaignDiscount.value + (((_a = orderDetails.value) == null ? void 0 : _a.discount) || 0);
    });
    const finalTotal = computed(() => {
      if (!orderDetails.value) return 0;
      return (orderDetails.value.total_price || 0) + (orderDetails.value.delivery_charge || 0) - totalDiscount.value;
    });
    const orderStatusClass = computed(() => {
      var _a;
      const status = (_a = orderDetails.value) == null ? void 0 : _a.order_status;
      return {
        "bg-yellow-100 text-yellow-800": status === "pending",
        "bg-green-100 text-green-800": status === "completed",
        "bg-blue-100 text-blue-800": status === "processing"
      };
    });
    const getItemTotalDiscount = (item) => {
      return (item.coupon_discount || 0) + (item.campaign_discount || 0);
    };
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString();
    };
    onMounted(() => {
      const lastOrderDetails = localStorage.getItem("lastOrderDetails");
      if (lastOrderDetails) {
        orderDetails.value = JSON.parse(lastOrderDetails);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8" data-v-63b05f17${_scopeId}><div class="container mx-auto" data-v-63b05f17${_scopeId}><div class="text-center mb-12" data-v-63b05f17${_scopeId}><img${ssrRenderAttr("src", thankyouPng.value)} alt="Delivery Truck" class="w-32 h-32 mx-auto mb-6" data-v-63b05f17${_scopeId}><h1 class="text-2xl font-semibold text-gray-900 mb-2" data-v-63b05f17${_scopeId}> Thank you for your order, ${ssrInterpolate(orderDetails.value.customer_name)}! </h1><p class="text-gray-600" data-v-63b05f17${_scopeId}> Your order #${ssrInterpolate(orderDetails.value.invoice_number)} has been received and is being processed </p></div><div class="bg-white shadow rounded-lg overflow-hidden mb-8" data-v-63b05f17${_scopeId}><div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6" data-v-63b05f17${_scopeId}><div data-v-63b05f17${_scopeId}><h2 class="text-lg font-medium text-gray-900 mb-4" data-v-63b05f17${_scopeId}>Shipping Address</h2><div class="text-gray-600" data-v-63b05f17${_scopeId}><p data-v-63b05f17${_scopeId}>${ssrInterpolate(orderDetails.value.customer_name)}</p><p data-v-63b05f17${_scopeId}>${ssrInterpolate(orderDetails.value.address)}</p><p data-v-63b05f17${_scopeId}>Phone: ${ssrInterpolate(orderDetails.value.phone_number)}</p><p data-v-63b05f17${_scopeId}>Email: ${ssrInterpolate(orderDetails.value.email)}</p></div></div><div data-v-63b05f17${_scopeId}><h2 class="text-lg font-medium text-gray-900 mb-4" data-v-63b05f17${_scopeId}>Order Summary</h2><div class="space-y-2" data-v-63b05f17${_scopeId}><div class="flex justify-between text-gray-600" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>Subtotal</span><span data-v-63b05f17${_scopeId}><span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(orderDetails.value.total_price)}</span></div><div class="flex justify-between text-gray-600" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>Shipping</span><span data-v-63b05f17${_scopeId}><span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(orderDetails.value.delivery_charge)}</span></div>`);
            if (totalCouponDiscount.value > 0) {
              _push2(`<div class="flex justify-between text-gray-600" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>Coupon Discount</span><span class="text-red-600" data-v-63b05f17${_scopeId}>-<span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(totalCouponDiscount.value)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (totalCampaignDiscount.value > 0) {
              _push2(`<div class="flex justify-between text-gray-600" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>Campaign Discount</span><span class="text-red-600" data-v-63b05f17${_scopeId}>-<span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(totalCampaignDiscount.value)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (orderDetails.value.discount > 0) {
              _push2(`<div class="flex justify-between text-gray-600" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>General Discount</span><span class="text-red-600" data-v-63b05f17${_scopeId}>-<span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(orderDetails.value.discount)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex justify-between font-medium text-gray-900 pt-2 border-t" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>Total</span><span data-v-63b05f17${_scopeId}><span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(finalTotal.value)}</span></div></div></div></div></div><div class="bg-white shadow rounded-lg overflow-hidden" data-v-63b05f17${_scopeId}><h2 class="text-lg font-medium text-gray-900 p-6 border-b" data-v-63b05f17${_scopeId}>Order Items</h2><div class="divide-y divide-gray-200" data-v-63b05f17${_scopeId}><!--[-->`);
            ssrRenderList(orderDetails.value.items, (item) => {
              _push2(`<div class="p-6" data-v-63b05f17${_scopeId}><div class="flex items-center flex-col md:flex-row text-center md:text-left gap-5" data-v-63b05f17${_scopeId}><img${ssrRenderAttr("src", item.product.featured_image)}${ssrRenderAttr("alt", item.product.product_name)} class="w-20 h-20 object-cover rounded-lg" data-v-63b05f17${_scopeId}><div class="flex-1" data-v-63b05f17${_scopeId}><h3 class="text-base font-medium text-gray-900" data-v-63b05f17${_scopeId}>${ssrInterpolate(item.product.product_name)}</h3><div class="mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2" data-v-63b05f17${_scopeId}><span data-v-63b05f17${_scopeId}>Quantity: ${ssrInterpolate(item.quantity)}</span><span class="hidden md:inline" data-v-63b05f17${_scopeId}>•</span><span data-v-63b05f17${_scopeId}><span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(item.individual_price)} each</span>`);
              if (getItemTotalDiscount(item) > 0) {
                _push2(`<!--[--><span class="hidden md:inline" data-v-63b05f17${_scopeId}>•</span><span class="text-red-600" data-v-63b05f17${_scopeId}> Savings: <span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(getItemTotalDiscount(item))}</span><!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="text-right" data-v-63b05f17${_scopeId}><p class="text-base font-medium text-gray-900" data-v-63b05f17${_scopeId}><span class="bangla-font" data-v-63b05f17${_scopeId}>${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>${ssrInterpolate(item.total)}</p></div></div></div>`);
            });
            _push2(`<!--]--></div></div><div class="mt-8 text-center" data-v-63b05f17${_scopeId}><p class="text-sm text-gray-500" data-v-63b05f17${_scopeId}> Order Status: <span class="${ssrRenderClass([orderStatusClass.value, "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"])}" data-v-63b05f17${_scopeId}>${ssrInterpolate(orderDetails.value.order_status)}</span></p><p class="text-sm text-gray-500 mt-2" data-v-63b05f17${_scopeId}> Order Date: ${ssrInterpolate(formatDate(orderDetails.value.created_at))}</p></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen bg-gray-50 py-8 sm:px-6 lg:px-8" }, [
                createVNode("div", { class: "container mx-auto" }, [
                  createVNode("div", { class: "text-center mb-12" }, [
                    createVNode("img", {
                      src: thankyouPng.value,
                      alt: "Delivery Truck",
                      class: "w-32 h-32 mx-auto mb-6"
                    }, null, 8, ["src"]),
                    createVNode("h1", { class: "text-2xl font-semibold text-gray-900 mb-2" }, " Thank you for your order, " + toDisplayString(orderDetails.value.customer_name) + "! ", 1),
                    createVNode("p", { class: "text-gray-600" }, " Your order #" + toDisplayString(orderDetails.value.invoice_number) + " has been received and is being processed ", 1)
                  ]),
                  createVNode("div", { class: "bg-white shadow rounded-lg overflow-hidden mb-8" }, [
                    createVNode("div", { class: "grid grid-cols-1 md:grid-cols-2 gap-6 p-6" }, [
                      createVNode("div", null, [
                        createVNode("h2", { class: "text-lg font-medium text-gray-900 mb-4" }, "Shipping Address"),
                        createVNode("div", { class: "text-gray-600" }, [
                          createVNode("p", null, toDisplayString(orderDetails.value.customer_name), 1),
                          createVNode("p", null, toDisplayString(orderDetails.value.address), 1),
                          createVNode("p", null, "Phone: " + toDisplayString(orderDetails.value.phone_number), 1),
                          createVNode("p", null, "Email: " + toDisplayString(orderDetails.value.email), 1)
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("h2", { class: "text-lg font-medium text-gray-900 mb-4" }, "Order Summary"),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("div", { class: "flex justify-between text-gray-600" }, [
                            createVNode("span", null, "Subtotal"),
                            createVNode("span", null, [
                              createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                              createTextVNode(toDisplayString(orderDetails.value.total_price), 1)
                            ])
                          ]),
                          createVNode("div", { class: "flex justify-between text-gray-600" }, [
                            createVNode("span", null, "Shipping"),
                            createVNode("span", null, [
                              createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                              createTextVNode(toDisplayString(orderDetails.value.delivery_charge), 1)
                            ])
                          ]),
                          totalCouponDiscount.value > 0 ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex justify-between text-gray-600"
                          }, [
                            createVNode("span", null, "Coupon Discount"),
                            createVNode("span", { class: "text-red-600" }, [
                              createTextVNode("-"),
                              createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                              createTextVNode(toDisplayString(totalCouponDiscount.value), 1)
                            ])
                          ])) : createCommentVNode("", true),
                          totalCampaignDiscount.value > 0 ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex justify-between text-gray-600"
                          }, [
                            createVNode("span", null, "Campaign Discount"),
                            createVNode("span", { class: "text-red-600" }, [
                              createTextVNode("-"),
                              createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                              createTextVNode(toDisplayString(totalCampaignDiscount.value), 1)
                            ])
                          ])) : createCommentVNode("", true),
                          orderDetails.value.discount > 0 ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex justify-between text-gray-600"
                          }, [
                            createVNode("span", null, "General Discount"),
                            createVNode("span", { class: "text-red-600" }, [
                              createTextVNode("-"),
                              createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                              createTextVNode(toDisplayString(orderDetails.value.discount), 1)
                            ])
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex justify-between font-medium text-gray-900 pt-2 border-t" }, [
                            createVNode("span", null, "Total"),
                            createVNode("span", null, [
                              createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                              createTextVNode(toDisplayString(finalTotal.value), 1)
                            ])
                          ])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-white shadow rounded-lg overflow-hidden" }, [
                    createVNode("h2", { class: "text-lg font-medium text-gray-900 p-6 border-b" }, "Order Items"),
                    createVNode("div", { class: "divide-y divide-gray-200" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(orderDetails.value.items, (item) => {
                        return openBlock(), createBlock("div", {
                          key: item.product.id,
                          class: "p-6"
                        }, [
                          createVNode("div", { class: "flex items-center flex-col md:flex-row text-center md:text-left gap-5" }, [
                            createVNode("img", {
                              src: item.product.featured_image,
                              alt: item.product.product_name,
                              class: "w-20 h-20 object-cover rounded-lg"
                            }, null, 8, ["src", "alt"]),
                            createVNode("div", { class: "flex-1" }, [
                              createVNode("h3", { class: "text-base font-medium text-gray-900" }, toDisplayString(item.product.product_name), 1),
                              createVNode("div", { class: "mt-1 flex flex-wrap items-center text-sm text-gray-500 gap-2" }, [
                                createVNode("span", null, "Quantity: " + toDisplayString(item.quantity), 1),
                                createVNode("span", { class: "hidden md:inline" }, "•"),
                                createVNode("span", null, [
                                  createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                                  createTextVNode(toDisplayString(item.individual_price) + " each", 1)
                                ]),
                                getItemTotalDiscount(item) > 0 ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                                  createVNode("span", { class: "hidden md:inline" }, "•"),
                                  createVNode("span", { class: "text-red-600" }, [
                                    createTextVNode(" Savings: "),
                                    createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                                    createTextVNode(toDisplayString(getItemTotalDiscount(item)), 1)
                                  ])
                                ], 64)) : createCommentVNode("", true)
                              ])
                            ]),
                            createVNode("div", { class: "text-right" }, [
                              createVNode("p", { class: "text-base font-medium text-gray-900" }, [
                                createVNode("span", { class: "bangla-font" }, toDisplayString(_ctx.cartStore.currencysymbol), 1),
                                createTextVNode(toDisplayString(item.total), 1)
                              ])
                            ])
                          ])
                        ]);
                      }), 128))
                    ])
                  ]),
                  createVNode("div", { class: "mt-8 text-center" }, [
                    createVNode("p", { class: "text-sm text-gray-500" }, [
                      createTextVNode(" Order Status: "),
                      createVNode("span", {
                        class: ["inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", orderStatusClass.value]
                      }, toDisplayString(orderDetails.value.order_status), 3)
                    ]),
                    createVNode("p", { class: "text-sm text-gray-500 mt-2" }, " Order Date: " + toDisplayString(formatDate(orderDetails.value.created_at)), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Checkout/ThankYou.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const ThankYou = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-63b05f17"]]);
const __vite_glob_0_8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ThankYou
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$t = {
  __name: "NotFound",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4"${_scopeId}><div class="text-center"${_scopeId}><h1 class="text-9xl font-extrabold tracking-widest mb-4 animate-pulse"${_scopeId}> 4<span class="text-indigo-500"${_scopeId}>0</span>4 </h1><div class="bg-indigo-500 px-2 text-sm rounded rotate-12 absolute"${_scopeId}> Page Not Found </div><div class="mt-8"${_scopeId}><svg class="w-32 h-32 mx-auto mb-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg><p class="text-gray-300 text-xl mb-8"${_scopeId}>Oops! The page you&#39;re looking for doesn&#39;t exist.</p><button class="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"${_scopeId}> Go Home </button></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4" }, [
                createVNode("div", { class: "text-center" }, [
                  createVNode("h1", { class: "text-9xl font-extrabold tracking-widest mb-4 animate-pulse" }, [
                    createTextVNode(" 4"),
                    createVNode("span", { class: "text-indigo-500" }, "0"),
                    createTextVNode("4 ")
                  ]),
                  createVNode("div", { class: "bg-indigo-500 px-2 text-sm rounded rotate-12 absolute" }, " Page Not Found "),
                  createVNode("div", { class: "mt-8" }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-32 h-32 mx-auto mb-6 text-indigo-500",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "2",
                        d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      })
                    ])),
                    createVNode("p", { class: "text-gray-300 text-xl mb-8" }, "Oops! The page you're looking for doesn't exist."),
                    createVNode("button", {
                      onClick: _ctx.goHome,
                      class: "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    }, " Go Home ", 8, ["onClick"])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Error/NotFound.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const __vite_glob_0_9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$t
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$s = {
  __name: "HeroSlider",
  __ssrInlineRender: true,
  props: {
    sliders: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const modules = [Navigation, Pagination, Autoplay, EffectFade];
    const swiperInstance = ref(null);
    const imageLoadingStates = ref({});
    const lazyloadingsvg = ref("/assets/images/loading/lazyloading.svg");
    const props = __props;
    const initializeLoadingStates = () => {
      const states = {};
      props.sliders.forEach((slide) => {
        states[slide.id] = true;
      });
      imageLoadingStates.value = states;
    };
    initializeLoadingStates();
    const onSwiper = (swiper) => {
      swiperInstance.value = swiper;
    };
    const onSlideChange = () => {
    };
    const onImageLoad = (slideId) => {
      console.log("Image loaded:", slideId);
      imageLoadingStates.value[slideId] = false;
    };
    const onImageError = (slideId) => {
      console.log("Image error:", slideId);
      imageLoadingStates.value[slideId] = false;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "swiper-container w-full mx-auto relative mb-6 min-h-screen" }, _attrs))} data-v-6261ce7d>`);
      _push(ssrRenderComponent(unref(Swiper), {
        modules,
        "slides-per-view": 1,
        "space-between": 30,
        loop: __props.sliders.length > 1,
        effect: "fade",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        },
        pagination: { clickable: true },
        autoplay: { delay: 3e3, disableOnInteraction: false },
        onSwiper,
        onSlideChange
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.sliders, (slide) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), {
                key: slide.id
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative w-full h-full min-h-screen" data-v-6261ce7d${_scopeId2}><div style="${ssrRenderStyle(imageLoadingStates.value[slide.id] ? null : { display: "none" })}" class="absolute inset-0 flex items-center justify-center bg-gray-200 z-10" data-v-6261ce7d${_scopeId2}><div class="loading-spinner" data-v-6261ce7d${_scopeId2}><img class="w-32"${ssrRenderAttr("src", lazyloadingsvg.value)} alt="lazyloading icon" data-v-6261ce7d${_scopeId2}></div></div><img loading="lazy"${ssrRenderAttr("src", slide.image_path)} alt="slider images" class="${ssrRenderClass([{ "opacity-0": imageLoadingStates.value[slide.id] }, "w-full h-full object-cover"])}" data-v-6261ce7d${_scopeId2}></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative w-full h-full min-h-screen" }, [
                        withDirectives(createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-gray-200 z-10" }, [
                          createVNode("div", { class: "loading-spinner" }, [
                            createVNode("img", {
                              class: "w-32",
                              src: lazyloadingsvg.value,
                              alt: "lazyloading icon"
                            }, null, 8, ["src"])
                          ])
                        ], 512), [
                          [vShow, imageLoadingStates.value[slide.id]]
                        ]),
                        createVNode("img", {
                          loading: "lazy",
                          src: slide.image_path,
                          alt: "slider images",
                          class: ["w-full h-full object-cover", { "opacity-0": imageLoadingStates.value[slide.id] }],
                          onLoad: ($event) => onImageLoad(slide.id),
                          onError: ($event) => onImageError(slide.id)
                        }, null, 42, ["src", "onLoad", "onError"])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--><div class="swiper-button-prev" data-v-6261ce7d${_scopeId}><svg class="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-6261ce7d${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" data-v-6261ce7d${_scopeId}></path></svg></div><div class="swiper-button-next" data-v-6261ce7d${_scopeId}><svg class="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-v-6261ce7d${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-v-6261ce7d${_scopeId}></path></svg></div>`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.sliders, (slide) => {
                return openBlock(), createBlock(unref(SwiperSlide), {
                  key: slide.id
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative w-full h-full min-h-screen" }, [
                      withDirectives(createVNode("div", { class: "absolute inset-0 flex items-center justify-center bg-gray-200 z-10" }, [
                        createVNode("div", { class: "loading-spinner" }, [
                          createVNode("img", {
                            class: "w-32",
                            src: lazyloadingsvg.value,
                            alt: "lazyloading icon"
                          }, null, 8, ["src"])
                        ])
                      ], 512), [
                        [vShow, imageLoadingStates.value[slide.id]]
                      ]),
                      createVNode("img", {
                        loading: "lazy",
                        src: slide.image_path,
                        alt: "slider images",
                        class: ["w-full h-full object-cover", { "opacity-0": imageLoadingStates.value[slide.id] }],
                        onLoad: ($event) => onImageLoad(slide.id),
                        onError: ($event) => onImageError(slide.id)
                      }, null, 42, ["src", "onLoad", "onError"])
                    ])
                  ]),
                  _: 2
                }, 1024);
              }), 128)),
              createVNode("div", { class: "swiper-button-prev" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "white",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M15 19l-7-7 7-7"
                  })
                ]))
              ]),
              createVNode("div", { class: "swiper-button-next" }, [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5",
                  fill: "none",
                  stroke: "white",
                  viewBox: "0 0 24 24",
                  xmlns: "http://www.w3.org/2000/svg"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M9 5l7 7-7 7"
                  })
                ]))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/HeroSlider.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const HeroSlider = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-6261ce7d"]]);
const _sfc_main$r = {
  __name: "QuickViewModal",
  __ssrInlineRender: true,
  props: {
    visible: Boolean,
    product: Object
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const modules = [Navigation, Pagination];
    const props = __props;
    const cartStore = useCartStore();
    const emit = __emit;
    const modalContent = ref(null);
    const isJustOpened = ref(false);
    inject("$axios");
    const homeStore = useHomeStore();
    const quantity = ref(1);
    const basePrice = ref(0);
    const basePreviousPrice = ref(null);
    const selectedAttributes = ref({});
    const selectedCombination = ref(null);
    const currentTime = ref(/* @__PURE__ */ new Date());
    const loading = ref(false);
    const buynowLoading = ref(false);
    const timer = ref(null);
    const handleClickOutside = (event) => {
      if (isJustOpened.value || !props.visible || !modalContent.value) {
        isJustOpened.value = false;
        return;
      }
      if (!modalContent.value.contains(event.target)) {
        emit("close");
      }
    };
    watch(
      () => props.visible,
      (newVisible) => {
        if (newVisible) {
          isJustOpened.value = true;
          setTimeout(() => {
            isJustOpened.value = false;
          }, 100);
        }
      }
    );
    const parsedGalleryImages = computed(() => {
      if (!props.product || !props.product.gallery_images) return [];
      try {
        return JSON.parse(props.product.gallery_images);
      } catch (e) {
        console.error("Error parsing gallery images:", e);
        return [];
      }
    });
    computed(
      () => {
        var _a, _b;
        return ((_b = (_a = homeStore.siteinfos) == null ? void 0 : _a[0]) == null ? void 0 : _b.phone_number) || null;
      }
    );
    const hasCampaign = computed(() => {
      var _a;
      const campaign = (_a = props.product.product_campaign) == null ? void 0 : _a.campaign;
      if (!campaign) return false;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return campaign.start_date <= today && campaign.expiry_date >= today;
    });
    computed(() => {
      if (!hasCampaign.value) return null;
      const expiryDate = new Date(
        props.product.product_campaign.campaign.expiry_date
      );
      const diff = expiryDate - currentTime.value;
      if (diff <= 0) return null;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return { days, hours, minutes, seconds };
    });
    const campaignPrice = computed(() => {
      if (!hasCampaign.value) return basePrice.value;
      const campaignType = props.product.product_campaign.campaign.type;
      const discount = parseFloat(
        props.product.product_campaign.campaign.discount
      );
      const originalPrice = parseFloat(basePrice.value);
      if (campaignType === "fixed") {
        return (originalPrice - discount).toFixed(2);
      } else if (campaignType === "percentage") {
        const discountAmount = originalPrice * (discount / 100);
        return (originalPrice - discountAmount).toFixed(2);
      }
      return basePrice.value;
    });
    const hasAttributes = computed(() => {
      return props.product.product_attributes && props.product.product_attributes.length > 0;
    });
    const lowestAttributePrice = computed(() => {
      if (!hasAttributes.value) {
        return {
          price: props.product.price,
          previous_price: props.product.previous_price
        };
      }
      return props.product.product_attributes.reduce((lowest, current) => {
        const currentPrice = parseFloat(current.price);
        const lowestPrice = parseFloat(lowest.price);
        return currentPrice < lowestPrice ? current : lowest;
      }, props.product.product_attributes[0]);
    });
    const isOutOfStock = computed(() => {
      if (hasAttributes.value) {
        const quantities = props.product.product_attributes.map(
          (attr) => attr.quantity
        );
        return Math.min(...quantities) <= 0;
      }
      return props.product.quantity <= 0;
    });
    const isCombinationAvailable = computed(() => {
      if (!hasAttributes.value) {
        return props.product.quantity > 0;
      }
      if (!allAttributesSelected.value) {
        return false;
      }
      if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
          (attr) => attr.combination_id === selectedCombination.value.id
        );
        const quantities2 = combinationAttributes.map((attr) => attr.quantity);
        return quantities2.length > 0 && Math.min(...quantities2) > 0;
      }
      const quantities = [];
      for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        const attribute = props.product.product_attributes.find(
          (attr) => attr.attribute.name === attributeName && attr.attribute_option.id === selection.optionId
        );
        if (attribute) {
          quantities.push(attribute.quantity);
        }
      }
      return quantities.length > 0 && Math.min(...quantities) > 0;
    });
    const combinationQuantity = computed(() => {
      if (!hasAttributes.value) {
        return props.product.quantity;
      }
      if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
          (attr) => attr.combination_id === selectedCombination.value.id
        );
        const quantities2 = combinationAttributes.map((attr) => attr.quantity);
        return quantities2.length > 0 ? Math.min(...quantities2) : 0;
      }
      const quantities = [];
      for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        const attribute = props.product.product_attributes.find(
          (attr) => attr.attribute.name === attributeName && attr.attribute_option.id === selection.optionId
        );
        if (attribute) {
          quantities.push(attribute.quantity);
        }
      }
      return quantities.length > 0 ? Math.min(...quantities) : 0;
    });
    const groupedAttributes = computed(() => {
      if (!hasAttributes.value) return {};
      const grouped = {};
      props.product.product_attributes.forEach((attr) => {
        if (!attr.attribute || !attr.attribute.name) return;
        if (!grouped[attr.attribute.name]) {
          grouped[attr.attribute.name] = [];
        }
        const optionExists = grouped[attr.attribute.name].some(
          (existing) => existing.attribute_option.id === attr.attribute_option.id
        );
        if (!optionExists) {
          grouped[attr.attribute.name].push(attr);
        }
      });
      return grouped;
    });
    const sortedAttributeNames = computed(() => {
      return Object.keys(groupedAttributes.value).sort((a, b2) => {
        var _a, _b;
        const aOrder = ((_a = props.product.product_attributes.find(
          (attr) => attr.attribute.name === a
        )) == null ? void 0 : _a.attribute.order) || 0;
        const bOrder = ((_b = props.product.product_attributes.find(
          (attr) => attr.attribute.name === b2
        )) == null ? void 0 : _b.attribute.order) || 0;
        return aOrder - bOrder;
      });
    });
    const allAttributesSelected = computed(() => {
      if (!hasAttributes.value) return true;
      return sortedAttributeNames.value.every(
        (attr) => {
          var _a;
          return (_a = selectedAttributes.value[attr]) == null ? void 0 : _a.optionId;
        }
      );
    });
    const displayPrice = computed(() => {
      return formatPrice(
        hasCampaign.value ? campaignPrice.value : basePrice.value
      );
    });
    const formatPrice = (price) => {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
    };
    const updateBasePrice = (newPrice, newPreviousPrice) => {
      basePrice.value = Number.parseFloat(newPrice) || 0;
      basePreviousPrice.value = newPreviousPrice ? Number.parseFloat(newPreviousPrice) : null;
    };
    const selectAttribute = (attributeName, optionId, optionName, price, previous_price) => {
      selectedAttributes.value[attributeName] = {
        optionId,
        optionName,
        price,
        previous_price
      };
      selectedAttributes.value = { ...selectedAttributes.value };
      updateSelectedCombination();
    };
    const selectDefaultAttributes = () => {
      if (!props.product || !hasAttributes.value) return;
      selectedAttributes.value = {};
      for (const attributeName of sortedAttributeNames.value) {
        const options = groupedAttributes.value[attributeName];
        if (options && options.length > 0) {
          const firstInStockOption = options.find((option) => option.quantity > 0) || options[0];
          selectAttribute(
            attributeName,
            firstInStockOption.attribute_option.id,
            firstInStockOption.attribute_option.name,
            firstInStockOption.price,
            firstInStockOption.previous_price
          );
        }
      }
    };
    const updateSelectedCombination = () => {
      if (!allAttributesSelected.value) {
        selectedCombination.value = null;
        updateBasePrice(
          lowestAttributePrice.value.price,
          lowestAttributePrice.value.previous_price
        );
        return;
      }
      if (!props.product.product_attributes_combaine || props.product.product_attributes_combaine.length === 0) {
        selectedCombination.value = null;
        let totalPrice = Number.parseFloat(props.product.price);
        let totalPreviousPrice = null;
        for (const attributeName in selectedAttributes.value) {
          const selection = selectedAttributes.value[attributeName];
          if (selection && selection.optionId) {
            totalPrice = Number.parseFloat(selection.price) || 0;
            totalPreviousPrice = selection.previous_price ? Number.parseFloat(selection.previous_price) : null;
            break;
          }
        }
        updateBasePrice(totalPrice.toFixed(2), totalPreviousPrice);
        if (isCombinationAvailable.value && combinationQuantity.value > 0 && quantity.value > combinationQuantity.value) {
          quantity.value = combinationQuantity.value;
        }
        return;
      }
      const selected = [];
      for (const attributeName in selectedAttributes.value) {
        const selection = selectedAttributes.value[attributeName];
        if (selection.optionId) {
          const attribute = props.product.product_attributes.find(
            (attr) => attr.attribute.name === attributeName && attr.attribute_option.id === selection.optionId
          );
          if (attribute) {
            selected.push({
              attributeId: attribute.attribute_id.toString(),
              optionId: selection.optionId.toString(),
              optionName: selection.optionName
            });
          }
        }
      }
      selectedCombination.value = props.product.product_attributes_combaine.find((combo) => {
        try {
          const comboData = JSON.parse(combo.combination_string);
          return comboData.every(
            (comboAttr) => selected.some(
              (selAttr) => selAttr.attributeId === comboAttr.attributeId.toString() && selAttr.optionId === comboAttr.optionId.toString()
            )
          ) && selected.every(
            (selAttr) => comboData.some(
              (comboAttr) => comboAttr.attributeId.toString() === selAttr.attributeId && comboAttr.optionId.toString() === selAttr.optionId
            )
          );
        } catch (e) {
          console.error("Error parsing combination string:", e);
          return false;
        }
      }) || null;
      if (selectedCombination.value) {
        const combinationAttributes = props.product.product_attributes.filter(
          (attr) => attr.combination_id === selectedCombination.value.id
        );
        if (combinationAttributes.length > 0) {
          const totalPrice = Number.parseFloat(combinationAttributes[0].price) || 0;
          const totalPreviousPrice = combinationAttributes[0].previous_price ? Number.parseFloat(combinationAttributes[0].previous_price) : null;
          updateBasePrice(totalPrice.toFixed(2), totalPreviousPrice);
        }
      } else {
        updateBasePrice(
          lowestAttributePrice.value.price,
          lowestAttributePrice.value.previous_price
        );
      }
      if (isCombinationAvailable.value && combinationQuantity.value > 0 && quantity.value > combinationQuantity.value) {
        quantity.value = combinationQuantity.value;
      }
    };
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      timer.value = setInterval(() => {
        currentTime.value = /* @__PURE__ */ new Date();
      }, 1e3);
      if (props.product) {
        updateBasePrice(
          lowestAttributePrice.value.price,
          lowestAttributePrice.value.previous_price
        );
        selectDefaultAttributes();
      }
    });
    watch(
      () => props.product,
      (newProduct) => {
        if (newProduct) {
          selectedAttributes.value = {};
          selectedCombination.value = null;
          quantity.value = 1;
          updateBasePrice(
            lowestAttributePrice.value.price,
            lowestAttributePrice.value.previous_price
          );
          selectDefaultAttributes();
        }
      },
      { deep: true }
    );
    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
      if (timer.value) clearInterval(timer.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.visible) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" data-v-75e185eb><div class="bg-white responsive sm:max-h-[582px] md:w-[1000px] h-[506px] aspect-square max-w-5xl rounded-lg shadow-lg relative flex flex-col md:flex-row overflow-y-auto" data-v-75e185eb><button class="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10" data-v-75e185eb> × </button><div class="bg-white w-full flex flex-col md:flex-row" data-v-75e185eb><div class="sm:w-full sm:h-full md:w-[50%] lg:w-[50%] relative" data-v-75e185eb>`);
          _push2(ssrRenderComponent(unref(Swiper), {
            modules,
            "slides-per-view": 1,
            "space-between": 10,
            pagination: { clickable: true },
            navigation: {
              nextEl: ".custom-next",
              prevEl: ".custom-prev"
            },
            class: "aspect-square"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(unref(SwiperSlide), null, {
                  default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                    if (_push4) {
                      _push4(`<img${ssrRenderAttr("src", __props.product.featured_image)} alt="Featured Image" class="w-full h-full object-cover rounded-lg" data-v-75e185eb${_scopeId2}>`);
                    } else {
                      return [
                        createVNode("img", {
                          src: __props.product.featured_image,
                          alt: "Featured Image",
                          class: "w-full h-full object-cover rounded-lg"
                        }, null, 8, ["src"])
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
                _push3(`<!--[-->`);
                ssrRenderList(parsedGalleryImages.value, (image, index) => {
                  _push3(ssrRenderComponent(unref(SwiperSlide), { key: index }, {
                    default: withCtx((_2, _push4, _parent3, _scopeId2) => {
                      if (_push4) {
                        _push4(`<img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `Gallery Image ${index + 1}`)} class="w-full h-auto object-cover rounded-lg" data-v-75e185eb${_scopeId2}>`);
                      } else {
                        return [
                          createVNode("img", {
                            src: image,
                            alt: `Gallery Image ${index + 1}`,
                            class: "w-full h-auto object-cover rounded-lg"
                          }, null, 8, ["src", "alt"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                });
                _push3(`<!--]-->`);
              } else {
                return [
                  createVNode(unref(SwiperSlide), null, {
                    default: withCtx(() => [
                      createVNode("img", {
                        src: __props.product.featured_image,
                        alt: "Featured Image",
                        class: "w-full h-full object-cover rounded-lg"
                      }, null, 8, ["src"])
                    ]),
                    _: 1
                  }),
                  (openBlock(true), createBlock(Fragment, null, renderList(parsedGalleryImages.value, (image, index) => {
                    return openBlock(), createBlock(unref(SwiperSlide), { key: index }, {
                      default: withCtx(() => [
                        createVNode("img", {
                          src: image,
                          alt: `Gallery Image ${index + 1}`,
                          class: "w-full h-auto object-cover rounded-lg"
                        }, null, 8, ["src", "alt"])
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(`<div class="custom-prev absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer" data-v-75e185eb>`);
          _push2(ssrRenderComponent(unref(ChevronLeft), null, null, _parent));
          _push2(`</div><div class="custom-next absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow cursor-pointer" data-v-75e185eb>`);
          _push2(ssrRenderComponent(unref(ChevronRight), null, null, _parent));
          _push2(`</div></div>`);
          if (__props.product) {
            _push2(`<div class="sm:w-full sm:h-full md:w-[50%] lg:w-[50%] lg:sticky lg:top-0 lg:self-start space-y-3 px-2 md:px-6 rounded-lg md:p-6" data-v-75e185eb><div class="space-y-2" data-v-75e185eb><h1 class="md:text-2xl text-xl font-medium mb-2 text-[#333333] h-[63px] overflow-y-hidden" data-v-75e185eb>${ssrInterpolate(__props.product.product_name)}</h1><div class="flex items-center gap-2" data-v-75e185eb><span class="text-2xl font-bold text-theme" data-v-75e185eb>${ssrInterpolate(displayPrice.value)}<span class="bangla-font" data-v-75e185eb>${ssrInterpolate(unref(cartStore).currencysymbol)}</span></span>`);
            if (basePreviousPrice.value && !hasCampaign.value) {
              _push2(`<span class="text-lg text-gray-500 line-through" data-v-75e185eb><span class="bangla-font" data-v-75e185eb>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(formatPrice(basePreviousPrice.value))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (hasCampaign.value) {
              _push2(`<span class="text-sm text-red-500" data-v-75e185eb> (${ssrInterpolate(__props.product.product_campaign.campaign.discount)}${ssrInterpolate(__props.product.product_campaign.campaign.type === "fixed" ? unref(cartStore).currencysymbol : "%")} OFF) </span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
            if (isOutOfStock.value) {
              _push2(`<div class="space-y-2" data-v-75e185eb><p class="text-sm text-red-500" data-v-75e185eb>Out of stock</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.product.product_code) {
              _push2(`<p class="relative text-[13px] text-gray-600" data-v-75e185eb> SKU: ${ssrInterpolate(__props.product.product_code)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="text-sm pb-1 h-[60px] overflow-hidden" data-v-75e185eb>${__props.product.short_description ?? ""}</div><!--[-->`);
            ssrRenderList(sortedAttributeNames.value, (attributeName) => {
              _push2(`<div class="mt-0" data-v-75e185eb><label class="text-sm font-medium" data-v-75e185eb>${ssrInterpolate(attributeName)}:</label><div class="flex flex-wrap gap-2" data-v-75e185eb><!--[-->`);
              ssrRenderList(groupedAttributes.value[attributeName], (option) => {
                var _a;
                _push2(`<button class="${ssrRenderClass([
                  "px-4 py-1 text-sm rounded-full border",
                  ((_a = selectedAttributes.value[attributeName]) == null ? void 0 : _a.optionId) === option.attribute_option.id ? "bg-gray-900 text-white" : "border-gray-300 hover:bg-gray-100"
                ])}" data-v-75e185eb>${ssrInterpolate(option.attribute_option.name)}</button>`);
              });
              _push2(`<!--]--></div></div>`);
            });
            _push2(`<!--]-->`);
            if (!hasAttributes.value) {
              _push2(`<div class="mt-0 py-1 flex items-center gap-2" data-v-75e185eb><div class="flex items-center justify-between" data-v-75e185eb><span style="${ssrRenderStyle(__props.product.quantity > 0 ? null : { display: "none" })}" class="${ssrRenderClass([
                __props.product.quantity > 0 ? "text-black" : "text-red-500",
                "text-base flex items-center gap-1 font-semibold"
              ])}" data-v-75e185eb>`);
              _push2(ssrRenderComponent(unref(Check), null, null, _parent));
              _push2(` ${ssrInterpolate(__props.product.quantity)}</span></div><span class="${ssrRenderClass([
                __props.product.quantity > 0 ? "text-black" : "text-red-800",
                "text-base font-semibold"
              ])}" data-v-75e185eb>${ssrInterpolate(__props.product.quantity > 0 ? "In Stock" : "Out of Stock")}</span></div>`);
            } else if (allAttributesSelected.value) {
              _push2(`<div class="mt-0 py-0 flex items-center gap-2" data-v-75e185eb><div class="flex items-center justify-between" data-v-75e185eb><span style="${ssrRenderStyle(isCombinationAvailable.value ? null : { display: "none" })}" class="${ssrRenderClass([
                isCombinationAvailable.value ? "text-black" : "text-red-500",
                "text-base flex items-center gap-1 font-semibold"
              ])}" data-v-75e185eb>`);
              if (isCombinationAvailable.value) {
                _push2(ssrRenderComponent(unref(Check), null, null, _parent));
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(isCombinationAvailable.value ? combinationQuantity.value : 0)}</span></div><span class="${ssrRenderClass([
                isCombinationAvailable.value ? "text-black" : "text-red-800",
                "text-base font-semibold"
              ])}" data-v-75e185eb>${ssrInterpolate(isCombinationAvailable.value ? "In Stock" : "Out of Stock")}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex flex-col sm:flex-row gap-4 mt-[2px]" data-v-75e185eb><div class="flex w-fit border border-gray-400 rounded-md overflow-hidden h-12" data-v-75e185eb><button class="w-12 h-12 flex items-center justify-center border-r border-gray-400 hover:bg-gray-200"${ssrIncludeBooleanAttr(quantity.value <= 1) ? " disabled" : ""} data-v-75e185eb> - </button><span class="w-12 h-12 flex items-center justify-center text-center" data-v-75e185eb>${ssrInterpolate(quantity.value)}</span><button class="w-12 h-12 flex items-center justify-center border-l border-gray-400 hover:bg-gray-200" data-v-75e185eb> + </button></div><button${ssrIncludeBooleanAttr(
              loading.value || (hasAttributes.value ? !allAttributesSelected.value || !isCombinationAvailable.value : __props.product.quantity <= 0)
            ) ? " disabled" : ""} class="${ssrRenderClass([
              "flex-1 py-[13px] px-8 bg-[#000] text-white transition-colors uppercase text-sm font-medium rounded-md flex items-center justify-center h-12",
              loading.value || (hasAttributes.value ? !allAttributesSelected.value || !isCombinationAvailable.value : __props.product.quantity <= 0) ? "cursor-not-allowed" : "bg-[#000] hover:bg-[#000] hover:text-white transition-colors"
            ])}" data-v-75e185eb>`);
            if (loading.value) {
              _push2(`<span class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2" data-v-75e185eb></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span data-v-75e185eb>${ssrInterpolate(loading.value ? "Adding..." : "Add to Cart")}</span></button></div><div class="buy_new_area" data-v-75e185eb><button${ssrIncludeBooleanAttr(
              buynowLoading.value || (hasAttributes.value ? !allAttributesSelected.value || !isCombinationAvailable.value : __props.product.quantity <= 0)
            ) ? " disabled" : ""} class="${ssrRenderClass([
              "flex-1 px-8 bg-[#000] text-white transition-colors w-full uppercase text-sm font-medium rounded-md flex items-center justify-center h-12",
              buynowLoading.value || (hasAttributes.value ? !allAttributesSelected.value || !isCombinationAvailable.value : __props.product.quantity <= 0) ? "cursor-not-allowed" : "bg-[#000] hover:bg-[#000] transition-colors"
            ])}" data-v-75e185eb>`);
            if (buynowLoading.value) {
              _push2(`<span class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2" data-v-75e185eb></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span data-v-75e185eb>${ssrInterpolate(buynowLoading.value ? "Processing..." : "Buy it now")}</span></button></div><div class="border-t" data-v-75e185eb>`);
            if (__props.product.category) {
              _push2(`<p class="text-sm text-gray-500" data-v-75e185eb> Categories: <span class="text-gray-900" data-v-75e185eb>${ssrInterpolate(__props.product.category.name)}</span></p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            _push2(`<div class="p-4 text-center" data-v-75e185eb> Loading product details... </div>`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/QuickViewModal.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const QuickViewModal = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-75e185eb"]]);
const _sfc_main$q = {
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const cartStore = useCartStore();
    const props = __props;
    useWishlistStore();
    const lazyloadingsvg = ref("/assets/images/loading/lazyloading.svg");
    const featuredImageLoaded = ref(false);
    const hoverImageLoaded = ref(false);
    const showModal = ref(false);
    const product = ref(props.product);
    const currentTime = ref(/* @__PURE__ */ new Date());
    const isHovered = ref(false);
    let parsedImages = [];
    parsedImages = product.value.gallery_images ? JSON.parse(product.value.gallery_images) : [];
    const firstGalleryImage = parsedImages[0] ?? product.value.featured_image;
    const onFeaturedImageLoad = () => {
      console.log("Featured image loaded");
      featuredImageLoaded.value = true;
    };
    const onFeaturedImageError = () => {
      console.log("Featured image error");
      featuredImageLoaded.value = true;
    };
    const onHoverImageLoad = () => {
      console.log("Hover image loaded");
      hoverImageLoaded.value = true;
    };
    const onHoverImageError = () => {
      console.log("Hover image error");
      hoverImageLoaded.value = true;
    };
    const hasAttributes = computed(() => {
      return props.product.product_attributes && props.product.product_attributes.length > 0;
    });
    const lowestAttributePrice = computed(() => {
      if (!hasAttributes.value) {
        return {
          price: props.product.price,
          previous_price: props.product.previous_price
        };
      }
      return props.product.product_attributes.reduce((lowest, current) => {
        const currentPrice = parseFloat(current.price);
        const lowestPrice = parseFloat(lowest.price);
        return currentPrice < lowestPrice ? current : lowest;
      }, props.product.product_attributes[0]);
    });
    const basePrice = computed(() => {
      return hasAttributes.value ? lowestAttributePrice.value.price : props.product.price;
    });
    const basePreviousPrice = computed(() => {
      return hasAttributes.value ? lowestAttributePrice.value.previous_price : props.product.previous_price;
    });
    const isSoldOut = computed(() => {
      return props.product.quantity <= 0;
    });
    const discountPercentage = computed(() => {
      const price = parseFloat(basePrice.value);
      const previousPrice = parseFloat(basePreviousPrice.value);
      if (!previousPrice || previousPrice <= 0) return 0;
      const discount = (previousPrice - price) / previousPrice * 100;
      return Math.round(discount);
    });
    const hasCampaign = computed(() => {
      return props.product.product_campaign && props.product.product_campaign.campaign;
    });
    computed(() => {
      if (!hasCampaign.value) return null;
      const expiryDate = new Date(
        props.product.product_campaign.campaign.expiry_date
      );
      const diff = expiryDate - currentTime.value;
      if (diff <= 0) return null;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return { days, hours, minutes, seconds };
    });
    const campaignPrice = computed(() => {
      if (!hasCampaign.value) return basePrice.value;
      const campaignType = props.product.product_campaign.campaign.type;
      const discount = parseFloat(
        props.product.product_campaign.campaign.discount
      );
      const originalPrice = parseFloat(basePrice.value);
      if (campaignType === "fixed") {
        return (originalPrice - discount).toFixed(2);
      } else if (campaignType === "percentage") {
        const discountAmount = originalPrice * (discount / 100);
        return (originalPrice - discountAmount).toFixed(2);
      }
      return basePrice.value;
    });
    const timer = ref(null);
    onMounted(() => {
      timer.value = setInterval(() => {
        currentTime.value = /* @__PURE__ */ new Date();
      }, 1e3);
    });
    onUnmounted(() => {
      if (timer.value) clearInterval(timer.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="producthover product-item group overflow-hidden group" data-v-d0e58fc5><div class="product-image relative" data-v-d0e58fc5><div style="${ssrRenderStyle(!featuredImageLoaded.value ? null : { display: "none" })}" class="absolute inset-0 flex items-center justify-center bg-gray-100 z-10" data-v-d0e58fc5><img${ssrRenderAttr("src", lazyloadingsvg.value)} alt="Loading..." class="w-12 h-12 animate-spin" data-v-d0e58fc5></div><div style="${ssrRenderStyle(isHovered.value && unref(firstGalleryImage) && !hoverImageLoaded.value ? null : { display: "none" })}" class="absolute inset-0 flex items-center justify-center bg-gray-100 z-20" data-v-d0e58fc5><img${ssrRenderAttr("src", lazyloadingsvg.value)} alt="Loading..." class="w-12 h-12 animate-spin" data-v-d0e58fc5></div>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: `/product/${product.value.slug}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img loading="lazy"${ssrRenderAttr("src", product.value.featured_image)}${ssrRenderAttr("alt", product.value.product_name)} class="${ssrRenderClass([{
              "opacity-0": isHovered.value || !featuredImageLoaded.value,
              "opacity-100": !isHovered.value && featuredImageLoaded.value
            }, "w-full h-full object-cover transition-opacity duration-500"])}" data-v-d0e58fc5${_scopeId}>`);
            if (unref(firstGalleryImage)) {
              _push2(`<img loading="lazy"${ssrRenderAttr("src", unref(firstGalleryImage))}${ssrRenderAttr("alt", product.value.product_name)} class="${ssrRenderClass([{
                "opacity-100": isHovered.value && hoverImageLoaded.value,
                "opacity-0": !isHovered.value || !hoverImageLoaded.value
              }, "w-full h-full object-cover absolute inset-0 transition-opacity duration-500"])}" data-v-d0e58fc5${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("img", {
                loading: "lazy",
                src: product.value.featured_image,
                alt: product.value.product_name,
                class: ["w-full h-full object-cover transition-opacity duration-500", {
                  "opacity-0": isHovered.value || !featuredImageLoaded.value,
                  "opacity-100": !isHovered.value && featuredImageLoaded.value
                }],
                onLoad: onFeaturedImageLoad,
                onError: onFeaturedImageError
              }, null, 42, ["src", "alt"]),
              unref(firstGalleryImage) ? (openBlock(), createBlock("img", {
                key: 0,
                loading: "lazy",
                src: unref(firstGalleryImage),
                alt: product.value.product_name,
                class: ["w-full h-full object-cover absolute inset-0 transition-opacity duration-500", {
                  "opacity-100": isHovered.value && hoverImageLoaded.value,
                  "opacity-0": !isHovered.value || !hoverImageLoaded.value
                }],
                onLoad: onHoverImageLoad,
                onError: onHoverImageError
              }, null, 42, ["src", "alt"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!hasCampaign.value && discountPercentage.value > 0) {
        _push(`<span class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold" data-v-d0e58fc5> -${ssrInterpolate(discountPercentage.value)}% </span>`);
      } else {
        _push(`<!---->`);
      }
      if (hasCampaign.value) {
        _push(`<span class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold" data-v-d0e58fc5> -${ssrInterpolate(product.value.product_campaign.campaign.discount)}${ssrInterpolate(product.value.product_campaign.campaign.type === "fixed" ? unref(cartStore).currencysymbol : "%")}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (isSoldOut.value) {
        _push(`<span class="absolute top-[40px] left-3 bg-white text-gray-500 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px]" data-v-d0e58fc5> SOLD OUT </span>`);
      } else {
        _push(`<!---->`);
      }
      if (product.value.is_free_shipping) {
        _push(`<span class="absolute top-3 right-3 bg-gray-100 text-gray-900 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px]" data-v-d0e58fc5> Free Shipping </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sm:pt-[2px] md:pt-3 resonsecard" data-v-d0e58fc5><div class="px-[5px] pb-[10px]" data-v-d0e58fc5><h3 class="product-title text-[14px] font-normal text-center mb-4 mt-1 overflow-hidden" data-v-d0e58fc5>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: `/product/${product.value.slug}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(product.value.product_name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(product.value.product_name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h3><div class="flex justify-center items-center gap-2" data-v-d0e58fc5>`);
      if (basePreviousPrice.value && !hasCampaign.value) {
        _push(`<span class="text-gray-500 text-sm line-through" data-v-d0e58fc5>${ssrInterpolate(unref(cartStore).currencysymbol)} ${ssrInterpolate(parseInt(basePreviousPrice.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (!hasCampaign.value) {
        _push(`<span class="text-theme font-bold" data-v-d0e58fc5><span class="font-normal" data-v-d0e58fc5>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(parseInt(basePrice.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (hasCampaign.value) {
        _push(`<span class="text-theme font-bold" data-v-d0e58fc5>${ssrInterpolate(unref(cartStore).currencysymbol)} ${ssrInterpolate(parseInt(campaignPrice.value))}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
      _push(ssrRenderComponent(QuickViewModal, {
        visible: showModal.value,
        product: product.value,
        onClose: ($event) => showModal.value = false
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductCard.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const ProductCard = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-d0e58fc5"]]);
const _sfc_main$p = {
  __name: "TopCategories",
  __ssrInlineRender: true,
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "container mx-auto mb-10 px-2 sm:px-0" }, _attrs))} data-v-8f5ad0d9><div data-v-8f5ad0d9><h2 class="text-xl font-semibold text-gray-800" data-v-8f5ad0d9>TOP CATEGORIES</h2><hr class="border-gray-200 my-8" data-v-8f5ad0d9></div><div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 sm:gap-6 gap-4" data-v-8f5ad0d9><!--[-->`);
      ssrRenderList(__props.categories, (category) => {
        _push(`<div class="text-center" data-v-8f5ad0d9>`);
        _push(ssrRenderComponent(unref(Pe), {
          href: "/shop?category=" + category.slug,
          class: "group block"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="sm:w-[180px] sm:h-[180px] w-[130px] h-[130px] mx-auto rounded-full overflow-hidden bg-gray-100 shadow hover:shadow-lg transition-shadow duration-300" data-v-8f5ad0d9${_scopeId}><img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" data-v-8f5ad0d9${_scopeId}></div><h3 class="mt-3 text-sm font-medium text-gray-700 group-hover:text-black" data-v-8f5ad0d9${_scopeId}>${ssrInterpolate(category.name)}</h3>`);
            } else {
              return [
                createVNode("div", { class: "sm:w-[180px] sm:h-[180px] w-[130px] h-[130px] mx-auto rounded-full overflow-hidden bg-gray-100 shadow hover:shadow-lg transition-shadow duration-300" }, [
                  createVNode("img", {
                    src: category.image,
                    alt: category.name,
                    class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  }, null, 8, ["src", "alt"])
                ]),
                createVNode("h3", { class: "mt-3 text-sm font-medium text-gray-700 group-hover:text-black" }, toDisplayString(category.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Category/TopCategories.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const TopCategories = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-8f5ad0d9"]]);
const _sfc_main$o = {
  __name: "CategoryTabsWithProducts",
  __ssrInlineRender: true,
  props: {
    categoriesWithProducts: Object,
    categories: Array
  },
  setup(__props) {
    const props = __props;
    ref(false);
    const categoriesArray = computed(() => {
      if (!props.categoriesWithProducts) return [];
      return Object.values(props.categoriesWithProducts);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "category-products-container mb-12" }, _attrs))} data-v-9e92191c><div class="container mx-auto px-4" data-v-9e92191c><!--[-->`);
      ssrRenderList(categoriesArray.value, (category) => {
        _push(`<div class="category-section mb-12" data-v-9e92191c><div class="category-header flex items-center justify-between mb-4" data-v-9e92191c><h2 class="text-xl font-semibold text-gray-800" data-v-9e92191c>${ssrInterpolate(category.name)}</h2>`);
        _push(ssrRenderComponent(unref(Pe), {
          href: `/shop?category=${category.slug}`,
          class: "text-white bg-theme px-4 py-2 rounded-full hover:text-primary-dark font-medium transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View All `);
            } else {
              return [
                createTextVNode(" View All ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div><hr class="border-gray-200 mb-8" data-v-9e92191c>`);
        if (category.products && category.products.length > 0) {
          _push(`<div class="products-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-v-9e92191c><!--[-->`);
          ssrRenderList(category.products.slice(0, 10), (product) => {
            _push(`<div class="product-item" data-v-9e92191c>`);
            _push(ssrRenderComponent(ProductCard, { product }, null, _parent));
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="text-center py-8" data-v-9e92191c><p class="text-lg" data-v-9e92191c> No products available in this category. </p></div>`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/CategoryTabsWithProducts.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const CategoryTabsWithProducts = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-9e92191c"]]);
const _sfc_main$n = {
  __name: "CampaignProduct",
  __ssrInlineRender: true,
  props: {
    compaigns: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const campaignNames = computed(() => {
      const names = props.compaigns.map(
        (item) => item.product_campaign.campaign.name
      );
      console.log("ronaldo", names);
      return [...new Set(names)];
    });
    const campaignProductsByName = computed(() => {
      const grouped = {};
      campaignNames.value.forEach((name) => {
        grouped[name] = props.compaigns.filter((item) => item.product_campaign.campaign.name === name).slice(0, 10);
      });
      return grouped;
    });
    const modules = [Navigation, Pagination, Autoplay];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "campaign_area" }, _attrs))} data-v-4156cf7b><!--[-->`);
      ssrRenderList(campaignNames.value, (campaign) => {
        _push(`<div class="container mx-auto px-4" data-v-4156cf7b><div class="mb-8" data-v-4156cf7b><h2 class="text-xl font-semibold text-gray-800" data-v-4156cf7b>${ssrInterpolate(campaign)}</h2><hr class="border-gray-200 my-8" data-v-4156cf7b></div>`);
        _push(ssrRenderComponent(unref(Swiper), {
          modules,
          "slides-per-view": 1,
          "space-between": 20,
          breakpoints: {
            0: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }
          },
          pagination: { clickable: true },
          navigation: true,
          autoplay: { delay: 3e3, disableOnInteraction: false },
          class: "campaign-swiper mb-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(campaignProductsByName.value[campaign], (product) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: product.id
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(ProductCard, { product }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(ProductCard, { product }, null, 8, ["product"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(campaignProductsByName.value[campaign], (product) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: product.id
                  }, {
                    default: withCtx(() => [
                      createVNode(ProductCard, { product }, null, 8, ["product"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/CampaignProduct.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const CampaignProduct = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-4156cf7b"]]);
const _sfc_main$m = {
  __name: "CategoryGroupsShowcase",
  __ssrInlineRender: true,
  props: {
    categoryGroups: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const sortedCategoryGroups = props.categoryGroups.sort((a, b2) => a.ordering - b2.ordering);
    const swiperOptions = {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      breakpoints: {
        0: { slidesPerView: 1.5, spaceBetween: 15 },
        768: { slidesPerView: 2, spaceBetween: 30 },
        1024: { slidesPerView: 2.5, spaceBetween: 30 },
        1280: { slidesPerView: 3, spaceBetween: 50 }
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "category-groups-showcase py-16" }, _attrs))} data-v-bd54b572><div class="mx-auto" data-v-bd54b572>`);
      if (unref(sortedCategoryGroups) && unref(sortedCategoryGroups).length > 0) {
        _push(`<div class="mb-16" data-v-bd54b572><h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800" data-v-bd54b572>${ssrInterpolate((_a = unref(sortedCategoryGroups)[0]) == null ? void 0 : _a.name)}</h2><div class="relative mx-auto container" data-v-bd54b572><div class="swiper-button-prev !left-2 md:!left-5 z-10" data-v-bd54b572></div><div class="swiper-button-next !right-2 md:!right-5 z-10" data-v-bd54b572></div>`);
        _push(ssrRenderComponent(unref(Swiper), mergeProps(swiperOptions, { class: "fashion-showcase" }), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList((_a2 = unref(sortedCategoryGroups)[0]) == null ? void 0 : _a2.categories, (category, index) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: index,
                  class: "relative"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="flex flex-col items-center" data-v-bd54b572${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Pe), {
                        href: `/shop?category=${category.slug}`,
                        class: "block relative w-full overflow-hidden"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="aspect-square mx-auto shine-effect" data-v-bd54b572${_scopeId3}><img${ssrRenderAttr("src", category.image)}${ssrRenderAttr("alt", category.name)} class="w-full h-full object-cover" data-v-bd54b572${_scopeId3}></div>`);
                          } else {
                            return [
                              createVNode("div", { class: "aspect-square mx-auto shine-effect" }, [
                                createVNode("img", {
                                  src: category.image,
                                  alt: category.name,
                                  class: "w-full h-full object-cover"
                                }, null, 8, ["src", "alt"])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<div class="text-center mt-4" data-v-bd54b572${_scopeId2}><h3 class="text-base md:text-2xl font-samibold uppercase" data-v-bd54b572${_scopeId2}>${ssrInterpolate(category.name)}</h3></div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "flex flex-col items-center" }, [
                          createVNode(unref(Pe), {
                            href: `/shop?category=${category.slug}`,
                            class: "block relative w-full overflow-hidden"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "aspect-square mx-auto shine-effect" }, [
                                createVNode("img", {
                                  src: category.image,
                                  alt: category.name,
                                  class: "w-full h-full object-cover"
                                }, null, 8, ["src", "alt"])
                              ])
                            ]),
                            _: 2
                          }, 1032, ["href"]),
                          createVNode("div", { class: "text-center mt-4" }, [
                            createVNode("h3", { class: "text-base md:text-2xl font-samibold uppercase" }, toDisplayString(category.name), 1)
                          ])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList((_b2 = unref(sortedCategoryGroups)[0]) == null ? void 0 : _b2.categories, (category, index) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: index,
                    class: "relative"
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "flex flex-col items-center" }, [
                        createVNode(unref(Pe), {
                          href: `/shop?category=${category.slug}`,
                          class: "block relative w-full overflow-hidden"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "aspect-square mx-auto shine-effect" }, [
                              createVNode("img", {
                                src: category.image,
                                alt: category.name,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"])
                            ])
                          ]),
                          _: 2
                        }, 1032, ["href"]),
                        createVNode("div", { class: "text-center mt-4" }, [
                          createVNode("h3", { class: "text-base md:text-2xl font-samibold uppercase" }, toDisplayString(category.name), 1)
                        ])
                      ])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(sortedCategoryGroups) && unref(sortedCategoryGroups).length > 1) {
        _push(`<div class="mb-16" data-v-bd54b572><h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800" data-v-bd54b572>${ssrInterpolate((_b = unref(sortedCategoryGroups)[1]) == null ? void 0 : _b.name)}</h2><div class="max-w-5xl mx-auto" data-v-bd54b572><div class="flex gap-5 flex-col md:flex-row" data-v-bd54b572><div class="left-area md:w-1/2" data-v-bd54b572>`);
        if ((_c = unref(sortedCategoryGroups)[1]) == null ? void 0 : _c.categories[0]) {
          _push(`<div class="masonry-item grid-item-large mb-5" data-v-bd54b572>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${unref(sortedCategoryGroups)[1].categories[0].slug}`,
            class: "block relative w-full group overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-[5/4]" data-v-bd54b572${_scopeId}><img${ssrRenderAttr("src", unref(sortedCategoryGroups)[1].categories[0].image)}${ssrRenderAttr("alt", unref(sortedCategoryGroups)[1].categories[0].name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-bd54b572${_scopeId}><div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" data-v-bd54b572${_scopeId}><div class="p-2 text-center" data-v-bd54b572${_scopeId}><h3 class="text-white text-[12px] md:text-xl font-samibold uppercase" data-v-bd54b572${_scopeId}>${ssrInterpolate(unref(sortedCategoryGroups)[1].categories[0].name)}</h3></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-[5/4]" }, [
                    createVNode("img", {
                      src: unref(sortedCategoryGroups)[1].categories[0].image,
                      alt: unref(sortedCategoryGroups)[1].categories[0].name,
                      class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" }, [
                      createVNode("div", { class: "p-2 text-center" }, [
                        createVNode("h3", { class: "text-white text-[12px] md:text-xl font-samibold uppercase" }, toDisplayString(unref(sortedCategoryGroups)[1].categories[0].name), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="right-area-bottom-div flex gap-5" data-v-bd54b572>`);
        if ((_d = unref(sortedCategoryGroups)[1]) == null ? void 0 : _d.categories[1]) {
          _push(`<div class="masonry-item grid-item-medium w-1/2" data-v-bd54b572>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${unref(sortedCategoryGroups)[1].categories[1].slug}`,
            class: "block relative w-full group overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-square" data-v-bd54b572${_scopeId}><img${ssrRenderAttr("src", unref(sortedCategoryGroups)[1].categories[1].image)}${ssrRenderAttr("alt", unref(sortedCategoryGroups)[1].categories[1].name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-bd54b572${_scopeId}><div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" data-v-bd54b572${_scopeId}><div class="p-2 text-center" data-v-bd54b572${_scopeId}><h3 class="text-white text-[12px] md:text-xl font-samibold uppercase" data-v-bd54b572${_scopeId}>${ssrInterpolate(unref(sortedCategoryGroups)[1].categories[1].name)}</h3></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-square" }, [
                    createVNode("img", {
                      src: unref(sortedCategoryGroups)[1].categories[1].image,
                      alt: unref(sortedCategoryGroups)[1].categories[1].name,
                      class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" }, [
                      createVNode("div", { class: "p-2 text-center" }, [
                        createVNode("h3", { class: "text-white text-[12px] md:text-xl font-samibold uppercase" }, toDisplayString(unref(sortedCategoryGroups)[1].categories[1].name), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_e = unref(sortedCategoryGroups)[1]) == null ? void 0 : _e.categories[2]) {
          _push(`<div class="masonry-item grid-item-medium w-1/2" data-v-bd54b572>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${unref(sortedCategoryGroups)[1].categories[2].slug}`,
            class: "block relative w-full group overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-square" data-v-bd54b572${_scopeId}><img${ssrRenderAttr("src", unref(sortedCategoryGroups)[1].categories[2].image)}${ssrRenderAttr("alt", unref(sortedCategoryGroups)[1].categories[2].name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-bd54b572${_scopeId}><div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" data-v-bd54b572${_scopeId}><div class="p-2 text-center" data-v-bd54b572${_scopeId}><h3 class="text-white text-[12px] md:text-xl font-samibold uppercase" data-v-bd54b572${_scopeId}>${ssrInterpolate(unref(sortedCategoryGroups)[1].categories[2].name)}</h3></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-square" }, [
                    createVNode("img", {
                      src: unref(sortedCategoryGroups)[1].categories[2].image,
                      alt: unref(sortedCategoryGroups)[1].categories[2].name,
                      class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" }, [
                      createVNode("div", { class: "p-2 text-center" }, [
                        createVNode("h3", { class: "text-white text-[12px] md:text-xl font-samibold uppercase" }, toDisplayString(unref(sortedCategoryGroups)[1].categories[2].name), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="right_area md:w-1/2" data-v-bd54b572><div class="right-area-bottom-div flex gap-5 mb-5" data-v-bd54b572>`);
        if ((_f = unref(sortedCategoryGroups)[1]) == null ? void 0 : _f.categories[3]) {
          _push(`<div class="masonry-item grid-item-small w-1/2" data-v-bd54b572>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${unref(sortedCategoryGroups)[1].categories[3].slug}`,
            class: "block relative w-full group overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-square" data-v-bd54b572${_scopeId}><img${ssrRenderAttr("src", unref(sortedCategoryGroups)[1].categories[3].image)}${ssrRenderAttr("alt", unref(sortedCategoryGroups)[1].categories[3].name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-bd54b572${_scopeId}><div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" data-v-bd54b572${_scopeId}><div class="p-2 text-center" data-v-bd54b572${_scopeId}><h3 class="text-white text-[12px] md:text-xl font-samibold uppercase" data-v-bd54b572${_scopeId}>${ssrInterpolate(unref(sortedCategoryGroups)[1].categories[3].name)}</h3></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-square" }, [
                    createVNode("img", {
                      src: unref(sortedCategoryGroups)[1].categories[3].image,
                      alt: unref(sortedCategoryGroups)[1].categories[3].name,
                      class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" }, [
                      createVNode("div", { class: "p-2 text-center" }, [
                        createVNode("h3", { class: "text-white text-[12px] md:text-xl font-samibold uppercase" }, toDisplayString(unref(sortedCategoryGroups)[1].categories[3].name), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_g = unref(sortedCategoryGroups)[1]) == null ? void 0 : _g.categories[4]) {
          _push(`<div class="masonry-item grid-item-small w-1/2" data-v-bd54b572>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${unref(sortedCategoryGroups)[1].categories[4].slug}`,
            class: "block relative w-full group overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-square" data-v-bd54b572${_scopeId}><img${ssrRenderAttr("src", unref(sortedCategoryGroups)[1].categories[4].image)}${ssrRenderAttr("alt", unref(sortedCategoryGroups)[1].categories[4].name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-bd54b572${_scopeId}><div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" data-v-bd54b572${_scopeId}><div class="p-2 text-center" data-v-bd54b572${_scopeId}><h3 class="text-white text-[12px] md:text-xl font-samibold uppercase" data-v-bd54b572${_scopeId}>${ssrInterpolate(unref(sortedCategoryGroups)[1].categories[4].name)}</h3></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-square" }, [
                    createVNode("img", {
                      src: unref(sortedCategoryGroups)[1].categories[4].image,
                      alt: unref(sortedCategoryGroups)[1].categories[4].name,
                      class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" }, [
                      createVNode("div", { class: "p-2 text-center" }, [
                        createVNode("h3", { class: "text-white text-[12px] md:text-xl font-samibold uppercase" }, toDisplayString(unref(sortedCategoryGroups)[1].categories[4].name), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if ((_h = unref(sortedCategoryGroups)[1]) == null ? void 0 : _h.categories[5]) {
          _push(`<div class="masonry-item grid-item-large" data-v-bd54b572>`);
          _push(ssrRenderComponent(unref(Pe), {
            href: `/shop?category=${unref(sortedCategoryGroups)[1].categories[5].slug}`,
            class: "block relative w-full group overflow-hidden"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="relative aspect-[5/4]" data-v-bd54b572${_scopeId}><img${ssrRenderAttr("src", unref(sortedCategoryGroups)[1].categories[5].image)}${ssrRenderAttr("alt", unref(sortedCategoryGroups)[1].categories[5].name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-bd54b572${_scopeId}><div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" data-v-bd54b572${_scopeId}><div class="p-2 text-center" data-v-bd54b572${_scopeId}><h3 class="text-white text-[12px] md:text-xl font-semibold uppercase" data-v-bd54b572${_scopeId}>${ssrInterpolate(unref(sortedCategoryGroups)[1].categories[5].name)}</h3></div></div></div>`);
              } else {
                return [
                  createVNode("div", { class: "relative aspect-[5/4]" }, [
                    createVNode("img", {
                      src: unref(sortedCategoryGroups)[1].categories[5].image,
                      alt: unref(sortedCategoryGroups)[1].categories[5].name,
                      class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    }, null, 8, ["src", "alt"]),
                    createVNode("div", { class: "absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/100 to-transparent" }, [
                      createVNode("div", { class: "p-2 text-center" }, [
                        createVNode("h3", { class: "text-white text-[12px] md:text-xl font-semibold uppercase" }, toDisplayString(unref(sortedCategoryGroups)[1].categories[5].name), 1)
                      ])
                    ])
                  ])
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Category/CategoryGroupsShowcase.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = {
  __name: "VideoProductsCard",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><video class="video-js h-[350px] w-full object-cover" loop="" autoplay="" muted="" preload="none" playsinline=""${ssrRenderAttr("poster", __props.product.featured_image)}><source${ssrRenderAttr("src", __props.product.video_link)} type="video/mp4"></video><div class="absolute bottom-10 left-1/2 transform -translate-x-1/2">`);
      _push(ssrRenderComponent(unref(Pe), {
        href: `/product/${__props.product.slug}`,
        class: "bg-[#eaeaea85] text-black py-2 px-16 rounded"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Shop`);
          } else {
            return [
              createTextVNode("Shop")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/VideoProductsCard.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = {
  __name: "VideoProducts",
  __ssrInlineRender: true,
  props: {
    videoProducts: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const modules = [Navigation, Pagination, Autoplay];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto my-8" }, _attrs))} data-v-6f0f1541>`);
      _push(ssrRenderComponent(unref(Swiper), {
        modules,
        "slides-per-view": 5,
        "space-between": 20,
        autoplay: {
          delay: 3e3,
          disableOnInteraction: false
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          500: {
            slidesPerView: 2,
            spaceBetween: 15
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20
          }
        },
        class: "video-products-slider"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(__props.videoProducts.slice(0, 10), (product) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), {
                key: product.id,
                class: "py-4"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_sfc_main$l, { product }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_sfc_main$l, { product }, null, 8, ["product"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(__props.videoProducts.slice(0, 10), (product) => {
                return openBlock(), createBlock(unref(SwiperSlide), {
                  key: product.id,
                  class: "py-4"
                }, {
                  default: withCtx(() => [
                    createVNode(_sfc_main$l, { product }, null, 8, ["product"])
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Home/VideoProducts.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {
  __name: "Home",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    computed(() => {
      return homeStore.categoryGroups;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<title data-v-84a751f1${_scopeId}>
            ${ssrInterpolate(((_a = unref(homeStore).siteinfos[0]) == null ? void 0 : _a.home_page_title) ?? ((_b = unref(homeStore).siteinfos[0]) == null ? void 0 : _b.app_name) ?? "Home")}
        </title>`);
          } else {
            return [
              createVNode("title", null, "\n            " + toDisplayString(((_c = unref(homeStore).siteinfos[0]) == null ? void 0 : _c.home_page_title) ?? ((_d = unref(homeStore).siteinfos[0]) == null ? void 0 : _d.app_name) ?? "Home") + "\n        ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(HeroSlider, {
              sliders: unref(homeStore).sliders
            }, null, _parent2, _scopeId));
            if (unref(homeStore).compaigns.length > 0) {
              _push2(ssrRenderComponent(CampaignProduct, {
                compaigns: unref(homeStore).compaigns
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(homeStore).categories.length > 0) {
              _push2(ssrRenderComponent(TopCategories, {
                categories: unref(homeStore).categories
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(homeStore).featureProducts.length > 0) {
              _push2(`<div class="featureProducts_area py-2 mb-6" data-v-84a751f1${_scopeId}><div class="container px-0" data-v-84a751f1${_scopeId}><div class="mb-[20px]" data-v-84a751f1${_scopeId}><h2 class="text-xl font-semibold text-gray-800" data-v-84a751f1${_scopeId}> Featured Products </h2></div><div data-v-84a751f1${_scopeId}><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-v-84a751f1${_scopeId}><!--[-->`);
              ssrRenderList(unref(homeStore).featureProducts, (product) => {
                _push2(ssrRenderComponent(ProductCard, {
                  key: product.id,
                  product
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(homeStore).categoriesWithProducts) {
              _push2(ssrRenderComponent(CategoryTabsWithProducts, {
                categoriesWithProducts: unref(homeStore).categoriesWithProducts,
                categories: unref(homeStore).categories
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(HeroSlider, {
                sliders: unref(homeStore).sliders
              }, null, 8, ["sliders"]),
              unref(homeStore).compaigns.length > 0 ? (openBlock(), createBlock(CampaignProduct, {
                key: 0,
                compaigns: unref(homeStore).compaigns
              }, null, 8, ["compaigns"])) : createCommentVNode("", true),
              unref(homeStore).categories.length > 0 ? (openBlock(), createBlock(TopCategories, {
                key: 1,
                categories: unref(homeStore).categories
              }, null, 8, ["categories"])) : createCommentVNode("", true),
              unref(homeStore).featureProducts.length > 0 ? (openBlock(), createBlock("div", {
                key: 2,
                class: "featureProducts_area py-2 mb-6"
              }, [
                createVNode("div", { class: "container px-0" }, [
                  createVNode("div", { class: "mb-[20px]" }, [
                    createVNode("h2", { class: "text-xl font-semibold text-gray-800" }, " Featured Products ")
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(homeStore).featureProducts, (product) => {
                        return openBlock(), createBlock(ProductCard, {
                          key: product.id,
                          product
                        }, null, 8, ["product"]);
                      }), 128))
                    ])
                  ])
                ])
              ])) : createCommentVNode("", true),
              unref(homeStore).categoriesWithProducts ? (openBlock(), createBlock(CategoryTabsWithProducts, {
                key: 3,
                categoriesWithProducts: unref(homeStore).categoriesWithProducts,
                categories: unref(homeStore).categories
              }, null, 8, ["categoriesWithProducts", "categories"])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-84a751f1"]]);
const __vite_glob_0_10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Home
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$i = {
  __name: "OrderTrack",
  __ssrInlineRender: true,
  setup(__props) {
    const isOrderTrackDataFetched = ref(false);
    const orderTrackProduct = ref([]);
    const isLoading = ref(false);
    inject("globalLoadingState");
    inject("$axios");
    const OrderTrackingKey = ref("");
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB");
    };
    const getStatusClass = (status) => {
      const statusClasses = {
        "pending": "bg-yellow-100 text-yellow-800",
        "processing": "bg-blue-100 text-blue-800",
        "shipped": "bg-purple-100 text-purple-800",
        "delivered": "bg-green-100 text-green-800",
        "cancelled": "bg-red-100 text-red-800",
        "confirmed": "bg-green-100 text-green-800",
        "completed": "bg-green-100 text-green-800"
      };
      return statusClasses[status == null ? void 0 : status.toLowerCase()] || "bg-gray-100 text-gray-800";
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container py-12" }, _attrs))}><div class="content"><h2 class="text-center text-lg">Track Your Order</h2></div><div class="max-w-md mx-auto mt-10"><label class="mx-auto relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-1 px-2 rounded-md gap-2 shadow-lg focus-within:border-gray-300" for="search-bar"><input id="search-bar" placeholder="Invoice Number"${ssrRenderAttr("value", OrderTrackingKey.value)} class="px-4 py-2 w-full rounded-md flex-1 outline-none bg-white" required><button${ssrIncludeBooleanAttr(!OrderTrackingKey.value || isLoading.value) ? " disabled" : ""} class="w-full md:w-auto px-6 py-2 bg-theme broder text-white fill-white active:scale-95 duration-100 border will-change-transform overflow-hidden relative rounded-md transition-all disabled:opacity-70"><div class="relative"><div class="${ssrRenderClass([isLoading.value ? "opacity-100" : "opacity-0", "flex items-center justify-center h-3 w-3 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"])}"><svg class="animate-spin w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div><div class="${ssrRenderClass([isLoading.value ? "opacity-0" : "opacity-100", "flex items-center transition-all"])}"><span class="text-sm font-semibold whitespace-nowrap truncate mx-auto"> Track </span></div></div></button></label></div>`);
      if (((_b = (_a = orderTrackProduct.value) == null ? void 0 : _a.data) == null ? void 0 : _b.length) > 0) {
        _push(`<div class="max-w-4xl mx-auto mt-10"><div class="flex justify-end mb-4 print:hidden no-print"><button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Print Invoice </button></div><div class="print-content"><!--[-->`);
        ssrRenderList(orderTrackProduct.value.data, (order, index) => {
          _push(`<div class="${ssrRenderClass([index > 0 ? "no-print" : "", "invoice-page"])}"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"><div class="bg-white p-4 rounded-lg shadow-sm border"><div class="text-center"><p class="text-sm text-gray-600 mb-1">Order Number</p><p class="text-lg font-semibold">${ssrInterpolate(order.invoice_number || order.id)}</p></div></div><div class="bg-white p-4 rounded-lg shadow-sm border"><div class="text-center"><p class="text-sm text-gray-600 mb-1">Order Date</p><p class="text-lg font-semibold">${ssrInterpolate(formatDate(order.created_at))}</p></div></div><div class="bg-white p-4 rounded-lg shadow-sm border"><div class="text-center"><p class="text-sm text-gray-600 mb-1">Order Total</p><p class="text-lg font-semibold">৳${ssrInterpolate(order.total_price)}</p></div></div><div class="bg-white p-4 rounded-lg shadow-sm border"><div class="text-center"><p class="text-sm text-gray-600 mb-1">Payment Method</p><p class="text-lg font-semibold capitalize">${ssrInterpolate(order.payment_method)}</p></div></div></div><div class="bg-white rounded-lg shadow-sm border overflow-hidden"><div class="p-6"><h3 class="text-xl font-semibold mb-6 text-gray-800">Order Details</h3><div class="mb-6 flex flex-wrap gap-4"><div class="flex items-center"><span class="text-sm text-gray-600 mr-2">Order Status:</span><span class="${ssrRenderClass([getStatusClass(order.order_status), "px-3 py-1 rounded-full text-sm font-medium capitalize"])}">${ssrInterpolate(order.order_status)}</span></div>`);
          if (order.couriar_status) {
            _push(`<div class="flex items-center"><span class="text-sm text-gray-600 mr-2">Courier Status:</span><span class="${ssrRenderClass([getStatusClass(order.couriar_status), "px-3 py-1 rounded-full text-sm font-medium capitalize"])}">${ssrInterpolate(order.couriar_status)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="mb-3 p-2 bg-gray-50 rounded-lg"><h4 class="font-medium text-gray-800 mb-2">Customer Information</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"><div><span class="text-gray-600">Name:</span><span class="ml-2 font-medium">${ssrInterpolate(order.customer_name)}</span></div><div class="md:col-span-2"><span class="text-gray-600">Phone:</span><span class="ml-2 font-medium">${ssrInterpolate(order.phone_number)}</span></div><div class="md:col-span-2"><span class="text-gray-600">Address:</span><span class="ml-2 font-medium">${ssrInterpolate(order.address)}</span></div>`);
          if (order.email) {
            _push(`<div><span class="text-gray-600">Email:</span><span class="ml-2 font-medium">${ssrInterpolate(order.email)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex justify-between items-center mb-4 pb-2 border-b"><h4 class="font-medium text-gray-800">Product</h4><h4 class="font-medium text-gray-800">Total</h4></div><div class="space-y-4 mb-6"><!--[-->`);
          ssrRenderList(order.items, (item) => {
            var _a2, _b2, _c2;
            _push(`<div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"><div class="flex items-center space-x-4 flex-1"><img${ssrRenderAttr("src", (_a2 = item.product_info) == null ? void 0 : _a2.featured_image)}${ssrRenderAttr("alt", (_b2 = item.product_info) == null ? void 0 : _b2.product_name)} class="w-16 h-16 object-cover rounded-lg border"><div class="flex-1"><h5 class="font-medium text-gray-800 mb-1">${ssrInterpolate((_c2 = item.product_info) == null ? void 0 : _c2.product_name)}</h5><div class="text-sm text-gray-600"><span>Quantity: ${ssrInterpolate(item.quantity)}</span><span class="mx-2">×</span><span>৳${ssrInterpolate(item.price)}</span></div>`);
            if (item.option && item.option.length > 0) {
              _push(`<div class="mt-1"><!--[-->`);
              ssrRenderList(item.option, (option) => {
                var _a3, _b3, _c3;
                _push(`<div class="text-xs text-gray-500">${ssrInterpolate((_b3 = (_a3 = option.attribute_option) == null ? void 0 : _a3.attribute) == null ? void 0 : _b3.name)}: ${ssrInterpolate((_c3 = option.attribute_option) == null ? void 0 : _c3.name)}</div>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div><div class="text-right"><p class="font-semibold text-gray-800"> ৳${ssrInterpolate(item.quantity * item.price)}</p></div></div>`);
          });
          _push(`<!--]--></div><div class="border-t pt-4"><div class="space-y-2 mb-4"><div class="flex justify-between text-sm"><span class="text-gray-600">Subtotal:</span><span class="font-medium">৳${ssrInterpolate(order.total_price - (order == null ? void 0 : order.extra_charge))}</span></div>`);
          if (order.additional_discount > 0) {
            _push(`<div class="flex justify-between text-sm"><span class="text-gray-600">Additional Discount:</span><span class="font-medium text-green-600">-৳${ssrInterpolate(order.additional_discount)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex justify-between text-sm"><span class="text-gray-600">Shipping:</span><span class="font-medium">৳${ssrInterpolate(order.delivery_charge || 0)}</span></div>`);
          if (order.extra_charge > 0) {
            _push(`<div class="flex justify-between text-sm"><span class="text-gray-600">Extra Charge:</span><span class="font-medium">৳${ssrInterpolate(order.extra_charge)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex justify-between text-sm mb-4"><span class="text-gray-600">Payment Method:</span><span class="font-medium capitalize">${ssrInterpolate(order.payment_method)}</span></div><div class="flex justify-between text-lg font-semibold pt-2 border-t"><span>Order Total:</span><span>৳${ssrInterpolate(order.total_price)}</span></div></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isOrderTrackDataFetched.value && ((_d = (_c = orderTrackProduct.value) == null ? void 0 : _c.data) == null ? void 0 : _d.length) === 0) {
        _push(`<div class="text-center mt-10"><div class="bg-white p-8 rounded-lg shadow-sm border max-w-md mx-auto"><p class="text-gray-600">No Order Found</p><p class="text-sm text-gray-500 mt-2">Please check your invoice number and try again.</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Order/OrderTrack.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {
  __name: "OrderTrack",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Order Tracking</title>`);
          } else {
            return [
              createVNode("title", null, "Order Tracking")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="orderTracking"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$i, null, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "orderTracking" }, [
                createVNode(_sfc_main$i)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Order/OrderTrack.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const __vite_glob_0_11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$h
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$g = {
  __name: "AboutUs",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    ref(null);
    const aboutusContent = computed(() => {
      var _a, _b;
      const aboutPage = (_b = (_a = homeStore.siteinfos) == null ? void 0 : _a.pages) == null ? void 0 : _b.find(
        (page) => page.type === "sales_support"
      );
      return (aboutPage == null ? void 0 : aboutPage.content) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="privacy-policy-page py-12"${_scopeId}><div class="container mx-auto max-w-[96rem]"${_scopeId}><h1 class="text-3xl font-bold mb-6"${_scopeId}>About US</h1>`);
            if (aboutusContent.value) {
              _push2(`<div class="text-gray-800"${_scopeId}>${aboutusContent.value ?? ""}</div>`);
            } else {
              _push2(`<div class="text-red-500"${_scopeId}>No About Us available.</div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "privacy-policy-page py-12" }, [
                createVNode("div", { class: "container mx-auto max-w-[96rem]" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6" }, "About US"),
                  aboutusContent.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    innerHTML: aboutusContent.value,
                    class: "text-gray-800"
                  }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-red-500"
                  }, "No About Us available."))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Policy/AboutUs.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const __vite_glob_0_12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$g
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = {
  __name: "PrivacyPolicy",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    ref(null);
    const policyContent = computed(() => {
      var _a, _b;
      const policyPage = (_b = (_a = homeStore.siteinfos) == null ? void 0 : _a.pages) == null ? void 0 : _b.find(
        (page) => page.type === "policies"
      );
      return (policyPage == null ? void 0 : policyPage.content) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="privacy-policy-page py-12"${_scopeId}><div class="container mx-auto max-w-[96rem]"${_scopeId}><h1 class="text-3xl font-bold mb-6"${_scopeId}>Privacy Policy</h1>`);
            if (policyContent.value) {
              _push2(`<div class="text-gray-800"${_scopeId}>${policyContent.value ?? ""}</div>`);
            } else {
              _push2(`<div class="text-red-500"${_scopeId}> No privacy policy available. </div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "privacy-policy-page py-12" }, [
                createVNode("div", { class: "container mx-auto max-w-[96rem]" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6" }, "Privacy Policy"),
                  policyContent.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    innerHTML: policyContent.value,
                    class: "text-gray-800"
                  }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-red-500"
                  }, " No privacy policy available. "))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Policy/PrivacyPolicy.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const __vite_glob_0_13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$f
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = {
  __name: "RefundPolicy",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    const policyContent = computed(() => {
      var _a, _b;
      const policyPage = (_b = (_a = homeStore.siteinfos) == null ? void 0 : _a.pages) == null ? void 0 : _b.find(
        (page) => page.type === "refund"
      );
      return (policyPage == null ? void 0 : policyPage.content) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="privacy-policy-page py-12"${_scopeId}><div class="container mx-auto max-w-[96rem]"${_scopeId}><h1 class="text-3xl font-bold mb-6"${_scopeId}>Refund Policy</h1>`);
            if (policyContent.value) {
              _push2(`<div class="text-gray-800"${_scopeId}>${policyContent.value ?? ""}</div>`);
            } else {
              _push2(`<div class="text-red-500"${_scopeId}>No Content available.</div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "privacy-policy-page py-12" }, [
                createVNode("div", { class: "container mx-auto max-w-[96rem]" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6" }, "Refund Policy"),
                  policyContent.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    innerHTML: policyContent.value,
                    class: "text-gray-800"
                  }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-red-500"
                  }, "No Content available."))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Policy/RefundPolicy.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const __vite_glob_0_14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$e
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {
  __name: "ShippingAndDelivery",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    ref(null);
    const shippingAndDeliveryContent = computed(() => {
      var _a, _b;
      const shippingPage = (_b = (_a = homeStore.siteinfos) == null ? void 0 : _a.pages) == null ? void 0 : _b.find(
        (page) => page.type === "shipping_delivery"
      );
      return (shippingPage == null ? void 0 : shippingPage.content) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="privacy-policy-page py-12"${_scopeId}><div class="container mx-auto max-w-[96rem]"${_scopeId}><h1 class="text-3xl font-bold mb-6"${_scopeId}>Shipping and Delivery</h1>`);
            if (shippingAndDeliveryContent.value) {
              _push2(`<div class="text-gray-800"${_scopeId}>${shippingAndDeliveryContent.value ?? ""}</div>`);
            } else {
              _push2(`<div class="text-red-500"${_scopeId}> No Shipping and Delivery available. </div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "privacy-policy-page py-12" }, [
                createVNode("div", { class: "container mx-auto max-w-[96rem]" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6" }, "Shipping and Delivery"),
                  shippingAndDeliveryContent.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    innerHTML: shippingAndDeliveryContent.value,
                    class: "text-gray-800"
                  }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-red-500"
                  }, " No Shipping and Delivery available. "))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Policy/ShippingAndDelivery.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __vite_glob_0_15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = {
  __name: "TermsConditions",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    const policyContent = computed(() => {
      var _a, _b;
      const policyPage = (_b = (_a = homeStore.siteinfos) == null ? void 0 : _a.pages) == null ? void 0 : _b.find(
        (page) => page.type === "terms"
      );
      return (policyPage == null ? void 0 : policyPage.content) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$J, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="privacy-policy-page py-12"${_scopeId}><div class="container mx-auto max-w-[96rem]"${_scopeId}><h1 class="text-3xl font-bold mb-6"${_scopeId}>Terms &amp; Conditions</h1>`);
            if (policyContent.value) {
              _push2(`<div class="text-gray-800"${_scopeId}>${policyContent.value ?? ""}</div>`);
            } else {
              _push2(`<div class="text-red-500"${_scopeId}> No privacy policy available. </div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "privacy-policy-page py-12" }, [
                createVNode("div", { class: "container mx-auto max-w-[96rem]" }, [
                  createVNode("h1", { class: "text-3xl font-bold mb-6" }, "Terms & Conditions"),
                  policyContent.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    innerHTML: policyContent.value,
                    class: "text-gray-800"
                  }, null, 8, ["innerHTML"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-red-500"
                  }, " No privacy policy available. "))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Policy/TermsConditions.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __vite_glob_0_16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4" }, _attrs))}><div class="text-center"><h1 class="text-9xl font-extrabold tracking-widest mb-4 animate-pulse"> 4<span class="text-theme">0</span>4 </h1><div class="bg-theme px-2 text-sm rounded rotate-12 absolute"> Page Not Found </div><div class="mt-8"><svg class="w-32 h-32 mx-auto mb-6 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><p class="text-gray-300 text-xl mb-8">Oops! The page you&#39;re looking for doesn&#39;t exist.</p><button class="bg-theme hover:bg-theme text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-theme focus:ring-opacity-50"> Go Home </button></div></div></div>`);
}
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Error/NotFound.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const NotFound = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$a = {
  __name: "CategoryByProduct",
  __ssrInlineRender: true,
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const $axios = inject("$axios");
    const products = ref([]);
    const slug = ref(props.slug);
    const categoryName = ref("");
    ref(false);
    const fetchData = async () => {
      try {
        const response = await $axios.get(`/product-category/${slug.value}`);
        console.log("product-data", response.data.data);
        categoryName.value = response.data.data[0].category.name;
        products.value = response.data.data;
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    onMounted(() => {
      fetchData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(categoryName.value)}</title>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(categoryName.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="header_area py-12 bg-gray-100"${_scopeId}><div class="container"${_scopeId}><div class="text-center"${_scopeId}><h2 class="text-2xl font-semibold"${_scopeId}>${ssrInterpolate(categoryName.value)}</h2></div></div></div>`);
            if (products.value.length > 0) {
              _push2(`<div${_scopeId}><div class="container py-12"${_scopeId}><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"${_scopeId}><!--[-->`);
              ssrRenderList(products.value, (product) => {
                _push2(ssrRenderComponent(ProductCard, {
                  key: product.id,
                  product
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div></div>`);
            } else {
              _push2(`<div class="p-4 text-center py-10"${_scopeId}><h3 class="text-2xl font-semibold"${_scopeId}>No products found</h3></div>`);
            }
          } else {
            return [
              createVNode("div", { class: "header_area py-12 bg-gray-100" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "text-center" }, [
                    createVNode("h2", { class: "text-2xl font-semibold" }, toDisplayString(categoryName.value), 1)
                  ])
                ])
              ]),
              products.value.length > 0 ? (openBlock(), createBlock("div", { key: 0 }, [
                createVNode("div", { class: "container py-12" }, [
                  createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(products.value, (product) => {
                      return openBlock(), createBlock(ProductCard, {
                        key: product.id,
                        product
                      }, null, 8, ["product"]);
                    }), 128))
                  ])
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "p-4 text-center py-10"
              }, [
                createVNode("h3", { class: "text-2xl font-semibold" }, "No products found")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Product/CategoryByProduct.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const __vite_glob_0_17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  __name: "ProductCardStyle2",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const product = ref(props.product);
    const currentTime = ref(/* @__PURE__ */ new Date());
    const isSoldOut = computed(() => {
      return props.product.quantity <= 0;
    });
    const discountPercentage = computed(() => {
      const { price, previous_price } = props.product;
      if (!previous_price || previous_price <= 0) return 0;
      const discount = (previous_price - price) / previous_price * 100;
      return Math.round(discount);
    });
    const hasCampaign = computed(() => {
      return props.product.product_campaign && props.product.product_campaign.campaign;
    });
    computed(() => {
      if (!hasCampaign.value) return null;
      const expiryDate = new Date(props.product.product_campaign.campaign.expiry_date);
      const diff = expiryDate - currentTime.value;
      if (diff <= 0) return null;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      return { days, hours, minutes, seconds };
    });
    const campaignPrice = computed(() => {
      if (!hasCampaign.value) return props.product.price;
      const discount = parseFloat(props.product.product_campaign.campaign.discount);
      const originalPrice = parseFloat(props.product.price);
      return (originalPrice - discount).toFixed(2);
    });
    const timer = ref(null);
    onMounted(() => {
      timer.value = setInterval(() => {
        currentTime.value = /* @__PURE__ */ new Date();
      }, 1e3);
    });
    onUnmounted(() => {
      if (timer.value) clearInterval(timer.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-item overflow-hidden" }, _attrs))} data-v-91eecbd7><div class="product-image relative" data-v-91eecbd7>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: `/product/${product.value.slug}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", (_a = product.value) == null ? void 0 : _a.featured_image)}${ssrRenderAttr("alt", product.value.product_name)} class="w-full h-full object-cover" data-v-91eecbd7${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: (_b = product.value) == null ? void 0 : _b.featured_image,
                alt: product.value.product_name,
                class: "w-full h-full object-cover"
              }, null, 8, ["src", "alt"])
            ];
          }
        }),
        _: 1
      }, _parent));
      if (!hasCampaign.value && discountPercentage.value > 0) {
        _push(`<span class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold" data-v-91eecbd7> -${ssrInterpolate(discountPercentage.value)}% </span>`);
      } else {
        _push(`<!---->`);
      }
      if (hasCampaign.value) {
        _push(`<span class="absolute top-3 left-3 bg-theme text-white px-2 py-1 rounded-full text-[12px] font-bold" data-v-91eecbd7> -${ssrInterpolate(product.value.product_campaign.campaign.discount)}${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (isSoldOut.value) {
        _push(`<span class="absolute top-[40px] left-3 bg-white text-gray-500 px-2 tracking-tighter py-1 leading-[1] rounded-full font-semibold text-[12px]" data-v-91eecbd7> SOLD OUT </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="pt-3 px-3 text-center" data-v-91eecbd7><h3 class="product-title text-[14px] font-normal mb-2" data-v-91eecbd7>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: `/product/${product.value.slug}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(product.value.product_name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(product.value.product_name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h3><div class="bangla-font flex justify-center items-center" data-v-91eecbd7>`);
      if (product.value.previous_price) {
        _push(`<span class="text-gray-500 line-through mr-2" data-v-91eecbd7>${ssrInterpolate(product.value.previous_price)}${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (hasCampaign.value) {
        _push(`<span class="text-theme font-bold" data-v-91eecbd7>${ssrInterpolate(campaignPrice.value)}${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>`);
      } else {
        _push(`<span class="text-theme font-bold" data-v-91eecbd7>${ssrInterpolate(product.value.price)}${ssrInterpolate(_ctx.cartStore.currencysymbol)}</span>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductCardStyle2.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const ProductCardStyle2 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-91eecbd7"]]);
const _sfc_main$8 = {
  __name: "CompaignsProducts",
  __ssrInlineRender: true,
  setup(__props) {
    const homeStore = useHomeStore();
    const compaigns = computed(() => homeStore.compaigns);
    const timeRemaining = ref({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });
    const timerInterval = ref(null);
    const campaignEndDate = computed(() => {
      if (!compaigns.value || compaigns.value.length === 0) return null;
      const expiryDates = compaigns.value.filter((product) => product.product_campaign && product.product_campaign.campaign).map((product) => new Date(product.product_campaign.campaign.expiry_date));
      if (expiryDates.length === 0) return null;
      return new Date(Math.min(...expiryDates));
    });
    const updateTimer = () => {
      if (!campaignEndDate.value) return;
      const now = /* @__PURE__ */ new Date();
      const difference = campaignEndDate.value - now;
      if (difference <= 0) {
        timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        clearInterval(timerInterval.value);
        return;
      }
      const days = Math.floor(difference / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(difference % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
      const minutes = Math.floor(difference % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(difference % (1e3 * 60) / 1e3);
      timeRemaining.value = { days, hours, minutes, seconds };
    };
    const campaignName = computed(() => {
      var _a, _b;
      if (!compaigns.value || compaigns.value.length === 0) return "Campaign";
      const firstProduct = compaigns.value.find(
        (product) => product.product_campaign && product.product_campaign.campaign
      );
      return ((_b = (_a = firstProduct == null ? void 0 : firstProduct.product_campaign) == null ? void 0 : _a.campaign) == null ? void 0 : _b.name) || "Campaign";
    });
    onMounted(() => {
      updateTimer();
      timerInterval.value = setInterval(updateTimer, 1e3);
    });
    onBeforeUnmount(() => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-aebfa15c${_scopeId}>Campaigns</title>`);
          } else {
            return [
              createVNode("title", null, "Campaigns")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (compaigns.value.length > 0) {
              _push2(`<div class="compaignsPage pb-10" data-v-aebfa15c${_scopeId}><div class="section_title_area py-10 bg-white mb-5 px-5" data-v-aebfa15c${_scopeId}><div class="container flex flex-col md:flex-row md:items-center md:justify-between" data-v-aebfa15c${_scopeId}><h2 class="text-2xl font-semibold" data-v-aebfa15c${_scopeId}>${ssrInterpolate(campaignName.value)}</h2>`);
              if (campaignEndDate.value) {
                _push2(`<div class="flex items-center gap-6 mt-4 md:mt-0" data-v-aebfa15c${_scopeId}><div class="text-center hidden sm:block" data-v-aebfa15c${_scopeId}><span class="bg-theme text-white px-3 py-1 rounded-md font-semibold text-sm inline-block" data-v-aebfa15c${_scopeId}> OFFER ENDS IN </span></div><div class="flex items-center justify-center" data-v-aebfa15c${_scopeId}><div class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" data-v-aebfa15c${_scopeId}><div class="text-xl sm:text-xl font-bold text-theme" data-v-aebfa15c${_scopeId}>${ssrInterpolate(timeRemaining.value.days)}</div><div class="text-xs text-gray-600 font-medium" data-v-aebfa15c${_scopeId}>Days</div></div><div class="text-xl font-bold mx-1 text-gray-500" data-v-aebfa15c${_scopeId}>:</div><div class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" data-v-aebfa15c${_scopeId}><div class="text-xl sm:text-xl font-bold text-theme" data-v-aebfa15c${_scopeId}>${ssrInterpolate(timeRemaining.value.hours.toString().padStart(2, "0"))}</div><div class="text-xs text-gray-600 font-medium" data-v-aebfa15c${_scopeId}>Hours</div></div><div class="text-xl font-bold mx-1 text-gray-500" data-v-aebfa15c${_scopeId}>:</div><div class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" data-v-aebfa15c${_scopeId}><div class="text-xl sm:text-xl font-bold text-theme" data-v-aebfa15c${_scopeId}>${ssrInterpolate(timeRemaining.value.minutes.toString().padStart(
                  2,
                  "0"
                ))}</div><div class="text-xs text-gray-600 font-medium" data-v-aebfa15c${_scopeId}>Mins</div></div><div class="text-xl font-bold mx-1 text-gray-500" data-v-aebfa15c${_scopeId}>:</div><div class="flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" data-v-aebfa15c${_scopeId}><div class="text-xl sm:text-xl font-bold text-theme" data-v-aebfa15c${_scopeId}>${ssrInterpolate(timeRemaining.value.seconds.toString().padStart(
                  2,
                  "0"
                ))}</div><div class="text-xs text-gray-600 font-medium" data-v-aebfa15c${_scopeId}>Secs</div></div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="container" data-v-aebfa15c${_scopeId}><div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" data-v-aebfa15c${_scopeId}><!--[-->`);
              ssrRenderList(compaigns.value, (product) => {
                _push2(ssrRenderComponent(ProductCardStyle2, { product }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div></div>`);
            } else {
              _push2(`<div class="p-4 text-center py-10" data-v-aebfa15c${_scopeId}><h3 class="text-2xl font-semibold" data-v-aebfa15c${_scopeId}>No products found</h3></div>`);
            }
          } else {
            return [
              compaigns.value.length > 0 ? (openBlock(), createBlock("div", {
                key: 0,
                class: "compaignsPage pb-10"
              }, [
                createVNode("div", { class: "section_title_area py-10 bg-white mb-5 px-5" }, [
                  createVNode("div", { class: "container flex flex-col md:flex-row md:items-center md:justify-between" }, [
                    createVNode("h2", { class: "text-2xl font-semibold" }, toDisplayString(campaignName.value), 1),
                    campaignEndDate.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "flex items-center gap-6 mt-4 md:mt-0"
                    }, [
                      createVNode("div", { class: "text-center hidden sm:block" }, [
                        createVNode("span", { class: "bg-theme text-white px-3 py-1 rounded-md font-semibold text-sm inline-block" }, " OFFER ENDS IN ")
                      ]),
                      createVNode("div", { class: "flex items-center justify-center" }, [
                        createVNode("div", { class: "flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" }, [
                          createVNode("div", { class: "text-xl sm:text-xl font-bold text-theme" }, toDisplayString(timeRemaining.value.days), 1),
                          createVNode("div", { class: "text-xs text-gray-600 font-medium" }, "Days")
                        ]),
                        createVNode("div", { class: "text-xl font-bold mx-1 text-gray-500" }, ":"),
                        createVNode("div", { class: "flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" }, [
                          createVNode("div", { class: "text-xl sm:text-xl font-bold text-theme" }, toDisplayString(timeRemaining.value.hours.toString().padStart(2, "0")), 1),
                          createVNode("div", { class: "text-xs text-gray-600 font-medium" }, "Hours")
                        ]),
                        createVNode("div", { class: "text-xl font-bold mx-1 text-gray-500" }, ":"),
                        createVNode("div", { class: "flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" }, [
                          createVNode("div", { class: "text-xl sm:text-xl font-bold text-theme" }, toDisplayString(timeRemaining.value.minutes.toString().padStart(
                            2,
                            "0"
                          )), 1),
                          createVNode("div", { class: "text-xs text-gray-600 font-medium" }, "Mins")
                        ]),
                        createVNode("div", { class: "text-xl font-bold mx-1 text-gray-500" }, ":"),
                        createVNode("div", { class: "flex flex-col items-center justify-center bg-gray-100 rounded-lg px-2 py-2 min-w-[30px] sm:min-w-[60px]" }, [
                          createVNode("div", { class: "text-xl sm:text-xl font-bold text-theme" }, toDisplayString(timeRemaining.value.seconds.toString().padStart(
                            2,
                            "0"
                          )), 1),
                          createVNode("div", { class: "text-xs text-gray-600 font-medium" }, "Secs")
                        ])
                      ])
                    ])) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(compaigns.value, (product) => {
                      return openBlock(), createBlock(ProductCardStyle2, {
                        key: product.id,
                        product
                      }, null, 8, ["product"]);
                    }), 128))
                  ])
                ])
              ])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "p-4 text-center py-10"
              }, [
                createVNode("h3", { class: "text-2xl font-semibold" }, "No products found")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Product/CompaignsProducts.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const CompaignsProducts = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-aebfa15c"]]);
const __vite_glob_0_18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CompaignsProducts
}, Symbol.toStringTag, { value: "Module" }));
const min_price = 0;
const min_gap = 100;
const _sfc_main$7 = {
  __name: "Shop",
  __ssrInlineRender: true,
  props: {
    initialCategorySlug: { type: [String, Number, null], default: null },
    initialSubCategorySlug: { type: [String, Number, null], default: null }
  },
  setup(__props) {
    const homeStore = useHomeStore();
    const cartStore = useCartStore();
    ne();
    const getInitialUrlParams = () => {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      return {
        category_slug: params.get("category") || null,
        subcategory_slug: params.get("subcategory") || null,
        name: params.get("search") || "",
        min_price: parseInt(params.get("min_price") || 0),
        max_price: parseInt(params.get("max_price")) || null,
        sort: params.get("sort") || "",
        attributes: parseAttributesFromUrl(params)
      };
    };
    const parseAttributesFromUrl = (params) => {
      const attributes2 = {};
      for (const [key, value] of params.entries()) {
        if (key.startsWith("attr_")) {
          const attrName = key.replace("attr_", "");
          attributes2[attrName] = value.split(",");
        }
      }
      return attributes2;
    };
    const props = __props;
    const products = ref([]);
    const isLoading = ref(false);
    const hasMore = ref(true);
    const showLoadMore = ref(false);
    const isLoadingMore = ref(false);
    const $axios = inject("$axios");
    const allProducts = computed(() => homeStore.products);
    const dynamicMaxPrice = computed(() => {
      if (!allProducts.value || allProducts.value.length === 0) return 5e8;
      return Math.ceil(Math.max(...allProducts.value.map((p) => parseFloat(p.price))));
    });
    const urlParams = getInitialUrlParams();
    const filters = reactive({
      category_slug: urlParams.category_slug || props.initialCategorySlug || null,
      subcategory_slug: urlParams.subcategory_slug || props.initialSubCategorySlug || null,
      name: urlParams.name || "",
      min_price: urlParams.min_price || 0,
      max_price: urlParams.max_price || dynamicMaxPrice.value,
      attributes: urlParams.attributes || {},
      sort: urlParams.sort || "",
      page: 1
    });
    const old_min_price = ref(filters.min_price);
    const old_max_price = ref(filters.max_price);
    const updateUrl = () => {
      const params = new URLSearchParams();
      if (filters.category_slug) params.set("category", filters.category_slug);
      if (filters.subcategory_slug) params.set("subcategory", filters.subcategory_slug);
      if (filters.name) params.set("search", filters.name);
      if (filters.min_price > min_price) params.set("min_price", filters.min_price);
      if (filters.max_price < dynamicMaxPrice.value) params.set("max_price", filters.max_price);
      if (filters.sort) params.set("sort", filters.sort);
      Object.entries(filters.attributes).forEach(([attrName, values]) => {
        if (values.length > 0) {
          params.set(`attr_${attrName}`, values.join(","));
        }
      });
      const url = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, "", url);
    };
    const updateFilters = () => {
      if (filters.max_price - filters.min_price < min_gap) {
        if (filters.min_price === old_min_price.value) {
          filters.min_price = Math.max(min_price, filters.max_price - min_gap);
        } else {
          filters.max_price = Math.min(dynamicMaxPrice.value, filters.min_price + min_gap);
        }
      }
      old_min_price.value = filters.min_price;
      old_max_price.value = filters.max_price;
      filters.page = 1;
      products.value = [];
      hasMore.value = true;
      showLoadMore.value = false;
      updateUrl();
      fetchData();
    };
    const fetchData = async (loadMore2 = false) => {
      if (!hasMore.value || isLoading.value && !loadMore2) return;
      try {
        if (loadMore2) {
          isLoadingMore.value = true;
        } else {
          isLoading.value = true;
        }
        const response = await $axios.get("/product-filtter", { params: filters });
        if (response.data.data.length > 0) {
          if (loadMore2) {
            products.value = [...products.value, ...response.data.data];
          } else {
            products.value = response.data.data;
          }
          filters.page += 1;
        } else {
          hasMore.value = false;
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        isLoading.value = false;
        isLoadingMore.value = false;
      }
    };
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.offsetHeight;
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      if (scrollPercentage >= 0.8) {
        showLoadMore.value = true;
      }
    };
    const loadMore = () => {
      if (!isLoadingMore.value && hasMore.value) {
        fetchData(true);
      }
    };
    const handlePopState = () => {
      const urlParams2 = getInitialUrlParams();
      filters.category_slug = urlParams2.category_slug;
      filters.subcategory_slug = urlParams2.subcategory_slug;
      filters.name = urlParams2.name;
      filters.min_price = urlParams2.min_price;
      filters.max_price = urlParams2.max_price || dynamicMaxPrice.value;
      filters.attributes = urlParams2.attributes;
      filters.sort = urlParams2.sort;
      filters.page = 1;
      products.value = [];
      hasMore.value = true;
      showLoadMore.value = false;
      fetchData();
    };
    const isMobile = ref(false);
    const showSidebar = ref(false);
    const updateIsMobile = () => {
      isMobile.value = window.innerWidth <= 1024;
      showSidebar.value = window.innerWidth > 1024;
    };
    onMounted(() => {
      updateIsMobile();
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("resize", updateIsMobile);
      homeStore.fetchData();
      fetchData();
    });
    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("resize", updateIsMobile);
      document.body.classList.remove("overflow-hidden");
      document.body.style.paddingRight = "";
    });
    const uniqueCategories = computed(() => {
      const categoriesMap = /* @__PURE__ */ new Map();
      allProducts.value.forEach((product) => {
        const category = product.category;
        const subcategory = product.subcategory;
        if (category && !categoriesMap.has(category.id)) {
          categoriesMap.set(category.id, {
            id: category.id,
            slug: category.slug,
            name: category.name,
            subcategories: /* @__PURE__ */ new Map()
          });
        }
        if (subcategory) {
          const cat = categoriesMap.get(category.id);
          cat.subcategories.set(subcategory.id, {
            id: subcategory.id,
            slug: subcategory.slug,
            name: subcategory.name
          });
        }
      });
      return Array.from(categoriesMap.values()).map((cat) => ({
        ...cat,
        subcategories: Array.from(cat.subcategories.values()),
        expanded: ref(false)
      }));
    });
    const attributes = computed(() => {
      const attributeMap = /* @__PURE__ */ new Map();
      if (!allProducts.value) return [];
      allProducts.value.forEach((product) => {
        if (product == null ? void 0 : product.product_attributes) {
          product.product_attributes.forEach((attr) => {
            var _a, _b;
            if (((_a = attr == null ? void 0 : attr.attribute) == null ? void 0 : _a.name) && ((_b = attr == null ? void 0 : attr.attribute_option) == null ? void 0 : _b.name)) {
              if (!attributeMap.has(attr.attribute.name)) {
                attributeMap.set(attr.attribute.name, []);
              }
              const currentValues = attributeMap.get(attr.attribute.name);
              if (!currentValues.includes(attr.attribute_option.name)) {
                currentValues.push(attr.attribute_option.name);
              }
            }
          });
        }
      });
      return Array.from(attributeMap.entries()).map(([name, values]) => ({
        name,
        values
      }));
    });
    const updateAttributeFilter = (attributeName, value, isChecked) => {
      if (!filters.attributes[attributeName]) {
        filters.attributes[attributeName] = [];
      }
      if (isChecked) {
        filters.attributes[attributeName].push(value);
      } else {
        filters.attributes[attributeName] = filters.attributes[attributeName].filter((val) => val !== value);
      }
      filters.page = 1;
      products.value = [];
      hasMore.value = true;
      showLoadMore.value = false;
      updateUrl();
      fetchData();
    };
    const handleCategoryClick = (category) => {
      filters.category_slug = category.slug;
      filters.subcategory_slug = null;
      filters.page = 1;
      products.value = [];
      hasMore.value = true;
      showLoadMore.value = false;
      updateUrl();
      fetchData();
    };
    const handleSubcategoryClick = (subcategory) => {
      filters.subcategory_slug = subcategory.slug;
      filters.category_slug = null;
      filters.page = 1;
      products.value = [];
      hasMore.value = true;
      showLoadMore.value = false;
      updateUrl();
      fetchData();
    };
    const updateSort = () => {
      filters.page = 1;
      products.value = [];
      hasMore.value = true;
      showLoadMore.value = false;
      updateUrl();
      fetchData();
    };
    const viewMode = ref("grid");
    const toggleSidebar = () => {
      if (isMobile.value) {
        if (!showSidebar.value) {
          const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
          document.body.style.paddingRight = `${scrollbarWidth}px`;
          document.body.classList.add("overflow-hidden");
        }
        showSidebar.value = !showSidebar.value;
        if (!showSidebar.value) {
          setTimeout(() => {
            document.body.classList.remove("overflow-hidden");
            document.body.style.paddingRight = "";
          }, 300);
        }
      }
    };
    const toggleCategory = (category) => {
      category.expanded = !category.expanded;
    };
    const isAttributeSelected = (attributeName, value) => {
      var _a;
      return ((_a = filters.attributes[attributeName]) == null ? void 0 : _a.includes(value)) || false;
    };
    watch(dynamicMaxPrice, (newMaxPrice) => {
      if (filters.max_price === 5e3 || filters.max_price > newMaxPrice) {
        filters.max_price = newMaxPrice;
        updateFilters();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title data-v-3c24090d${_scopeId}>Shop</title>`);
          } else {
            return [
              createVNode("title", null, "Shop")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d;
          if (_push2) {
            _push2(`<div class="product_details" data-v-3c24090d${_scopeId}><div class="container" data-v-3c24090d${_scopeId}><div class="min-h-screen py-8" data-v-3c24090d${_scopeId}><nav class="flex items-center gap-2 sm:text-sm text-[12px] text-gray-500 mb-5" data-v-3c24090d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Pe), {
              href: "/",
              class: "hover:text-gray-700"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`Home`);
                } else {
                  return [
                    createTextVNode("Home")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<span data-v-3c24090d${_scopeId}>/</span><span class="text-gray-900" data-v-3c24090d${_scopeId}>shop</span></nav><div class="flex flex-col lg:flex-row gap-8" data-v-3c24090d${_scopeId}>`);
            if (showSidebar.value && isMobile.value) {
              _push2(`<div class="fixed inset-0 bg-black bg-opacity-50 z-50" data-v-3c24090d${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="${ssrRenderClass([{
              "fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out transform": isMobile.value,
              "translate-x-0": showSidebar.value && isMobile.value,
              "-translate-x-full": !showSidebar.value && isMobile.value,
              "static": !isMobile.value
            }, "filter-sidebar w-full lg:w-[330px] bg-white overflow-y-auto"])}" data-v-3c24090d${_scopeId}>`);
            if (isMobile.value) {
              _push2(`<div class="p-4 flex justify-between items-center border-b" data-v-3c24090d${_scopeId}><h2 class="text-lg font-semibold" data-v-3c24090d${_scopeId}>Filters</h2><button class="p-2 rounded-full hover:bg-gray-100" data-v-3c24090d${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-3c24090d${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-3c24090d${_scopeId}></path></svg></button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="w-full filter-item" data-v-3c24090d${_scopeId}><h3 class="text-gray-800 font-medium mb-8" data-v-3c24090d${_scopeId}>FILTER BY PRICE</h3><div class="relative w-full mt-2" data-v-3c24090d${_scopeId}><div class="absolute w-full h-1 bg-gray-200" data-v-3c24090d${_scopeId}></div><div class="absolute h-1 bg-theme" style="${ssrRenderStyle({
              left: `${(filters.min_price - min_price) / (dynamicMaxPrice.value - min_price) * 100}%`,
              right: `${100 - (filters.max_price - min_price) / (dynamicMaxPrice.value - min_price) * 100}%`
            })}" data-v-3c24090d${_scopeId}></div><input type="range"${ssrRenderAttr("value", filters.min_price)}${ssrRenderAttr("min", min_price)}${ssrRenderAttr("max", dynamicMaxPrice.value)} class="absolute w-full appearance-none bg-transparent pointer-events-none" data-v-3c24090d${_scopeId}><input type="range"${ssrRenderAttr("value", filters.max_price)}${ssrRenderAttr("min", min_price)}${ssrRenderAttr("max", dynamicMaxPrice.value)} class="absolute w-full appearance-none bg-transparent pointer-events-none" data-v-3c24090d${_scopeId}></div><div class="mt-12 flex items-center text-sm text-gray-600" data-v-3c24090d${_scopeId}><span data-v-3c24090d${_scopeId}>Price: ${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(filters.min_price)} — ${ssrInterpolate(unref(cartStore).currencysymbol)}${ssrInterpolate(filters.max_price)}</span></div></div><div class="mt-12 w-full filter-item" data-v-3c24090d${_scopeId}><h3 class="text-gray-800 font-medium mb-8" data-v-3c24090d${_scopeId}>PRODUCT CATEGORIES</h3><ul class="space-y-3" data-v-3c24090d${_scopeId}><!--[-->`);
            ssrRenderList(uniqueCategories.value, (category) => {
              _push2(`<li data-v-3c24090d${_scopeId}><div class="flex items-center justify-between group" data-v-3c24090d${_scopeId}><span class="${ssrRenderClass([{ "text-theme font-medium": filters.category_slug === category.slug }, "flex-grow text-gray-600 cursor-pointer hover:text-gray-800 py-1 transition-colors"])}" data-v-3c24090d${_scopeId}>${ssrInterpolate(category.name)}</span>`);
              if (category.subcategories.length) {
                _push2(`<button class="p-2 rounded-full transition-colors hover:bg-gray-200 text-gray-700 hover:text-gray-600 focus:outline-none" data-v-3c24090d${_scopeId}>`);
                _push2(ssrRenderComponent(unref(ChevronDown), {
                  class: ["w-4 h-4 transition-transform duration-200", { "rotate-180": category.expanded }]
                }, null, _parent2, _scopeId));
                _push2(`</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
              if (category.expanded && category.subcategories.length) {
                _push2(`<ul class="pl-4 mt-2 space-y-2" data-v-3c24090d${_scopeId}><!--[-->`);
                ssrRenderList(category.subcategories, (sub) => {
                  _push2(`<li data-v-3c24090d${_scopeId}><span class="${ssrRenderClass([{ "text-theme font-medium": filters.subcategory_slug === sub.slug }, "text-gray-500 cursor-pointer hover:text-gray-700 block py-1"])}" data-v-3c24090d${_scopeId}>${ssrInterpolate(sub.name)}</span></li>`);
                });
                _push2(`<!--]--></ul>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</li>`);
            });
            _push2(`<!--]--></ul></div><div class="w-full filter-item !border-b-0" data-v-3c24090d${_scopeId}><h3 class="text-gray-800 font-medium mb-8" data-v-3c24090d${_scopeId}>PRODUCT ATTRIBUTES</h3>`);
            if (attributes.value.length === 0) {
              _push2(`<div data-v-3c24090d${_scopeId}>No attributes available.</div>`);
            } else {
              _push2(`<div data-v-3c24090d${_scopeId}><!--[-->`);
              ssrRenderList(attributes.value, (attribute, index) => {
                _push2(`<div class="mb-4" data-v-3c24090d${_scopeId}><h3 class="text-gray-800 font-medium mb-3" data-v-3c24090d${_scopeId}>${ssrInterpolate(attribute.name)}</h3><ul data-v-3c24090d${_scopeId}><!--[-->`);
                ssrRenderList(attribute.values, (value, i) => {
                  _push2(`<li class="py-1" data-v-3c24090d${_scopeId}><label class="${ssrRenderClass([{ "text-theme font-medium": isAttributeSelected(attribute.name, value) }, "cursor-pointer text-gray-500 hover:text-gray-700 block"])}" data-v-3c24090d${_scopeId}><input class="mr-2" type="checkbox"${ssrRenderAttr("value", value)}${ssrRenderAttr("name", attribute.name)}${ssrIncludeBooleanAttr(isAttributeSelected(attribute.name, value)) ? " checked" : ""} data-v-3c24090d${_scopeId}> ${ssrInterpolate(value)}</label></li>`);
                });
                _push2(`<!--]--></ul></div>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div><main class="flex-1" data-v-3c24090d${_scopeId}><div class="flex flex-wrap gap-4 items-center justify-between mb-6 bg-white" data-v-3c24090d${_scopeId}><div class="flex items-center gap-4" data-v-3c24090d${_scopeId}>`);
            if (isMobile.value) {
              _push2(`<button class="filter-button flex items-center gap-3 p-2 hover:text-theme" data-v-3c24090d${_scopeId}><span class="text-base font-medium" data-v-3c24090d${_scopeId}>`);
              _push2(ssrRenderComponent(unref(SlidersHorizontal), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(`</span><span data-v-3c24090d${_scopeId}>Filters</span></button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex items-center gap-4" data-v-3c24090d${_scopeId}><div class="gap-2 hidden lg:flex" data-v-3c24090d${_scopeId}><button class="${ssrRenderClass([{ "text-theme": viewMode.value === "grid" }, "p-2 hover:text-theme"])}" data-v-3c24090d${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" data-v-3c24090d${_scopeId}><path d="M5 0H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM5 9H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM5 18H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM23 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" fill="currentColor" data-v-3c24090d${_scopeId}></path></svg></button><button class="${ssrRenderClass([{ "text-theme": viewMode.value === "list" }, "p-2 hover:text-theme"])}" data-v-3c24090d${_scopeId}>`);
            _push2(ssrRenderComponent(unref(LayoutGridIcon), { class: "h-6 w-6" }, null, _parent2, _scopeId));
            _push2(`</button></div><div data-v-3c24090d${_scopeId}><select class="p-2 md:w-[200px] w-auto border border-gray-200" data-v-3c24090d${_scopeId}><option value="" data-v-3c24090d${ssrIncludeBooleanAttr(Array.isArray(filters.sort) ? ssrLooseContain(filters.sort, "") : ssrLooseEqual(filters.sort, "")) ? " selected" : ""}${_scopeId}>Default</option><option value="low_to_high" data-v-3c24090d${ssrIncludeBooleanAttr(Array.isArray(filters.sort) ? ssrLooseContain(filters.sort, "low_to_high") : ssrLooseEqual(filters.sort, "low_to_high")) ? " selected" : ""}${_scopeId}>Low to High</option><option value="high_to_low" data-v-3c24090d${ssrIncludeBooleanAttr(Array.isArray(filters.sort) ? ssrLooseContain(filters.sort, "high_to_low") : ssrLooseEqual(filters.sort, "high_to_low")) ? " selected" : ""}${_scopeId}>High to Low</option></select></div></div></div>`);
            if (filters.category_slug || filters.subcategory_slug || Object.keys(filters.attributes).some((key) => filters.attributes[key].length > 0) || filters.min_price > min_price || filters.max_price < dynamicMaxPrice.value) {
              _push2(`<div class="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-md" data-v-3c24090d${_scopeId}><div class="text-sm text-gray-600 mr-2" data-v-3c24090d${_scopeId}>Active Filters:</div>`);
              if (filters.category_slug) {
                _push2(`<div class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center" data-v-3c24090d${_scopeId}> Category: ${ssrInterpolate((_a = uniqueCategories.value.find((c) => c.slug === filters.category_slug)) == null ? void 0 : _a.name)} <button class="ml-1 text-gray-500 hover:text-gray-700" data-v-3c24090d${_scopeId}> × </button></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (filters.subcategory_slug) {
                _push2(`<div class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center" data-v-3c24090d${_scopeId}> Subcategory: ${ssrInterpolate((_b = uniqueCategories.value.flatMap((c) => c.subcategories).find((s) => s.slug === filters.subcategory_slug)) == null ? void 0 : _b.name)} <button class="ml-1 text-gray-500 hover:text-gray-700" data-v-3c24090d${_scopeId}> × </button></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (filters.min_price > min_price || filters.max_price < dynamicMaxPrice.value) {
                _push2(`<div class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center" data-v-3c24090d${_scopeId}> Price: ${ssrInterpolate(filters.min_price)}${ssrInterpolate(unref(cartStore).currencysymbol)} — ${ssrInterpolate(filters.max_price)}${ssrInterpolate(unref(cartStore).currencysymbol)} <button class="ml-1 text-gray-500 hover:text-gray-700" data-v-3c24090d${_scopeId}> × </button></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<!--[-->`);
              ssrRenderList(filters.attributes, (values, attrName) => {
                _push2(`<!--[-->`);
                if (values.length > 0) {
                  _push2(`<div class="px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center" data-v-3c24090d${_scopeId}>${ssrInterpolate(attrName)}: ${ssrInterpolate(values.join(", "))} <button class="ml-1 text-gray-500 hover:text-gray-700" data-v-3c24090d${_scopeId}> × </button></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              });
              _push2(`<!--]--><button class="px-2 py-1 bg-theme text-white rounded-md text-xs" data-v-3c24090d${_scopeId}> Clear All </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (isLoading.value) {
              _push2(`<div class="flex justify-center items-center h-64" data-v-3c24090d${_scopeId}>`);
              _push2(ssrRenderComponent(Preloader, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else {
              _push2(`<div class="${ssrRenderClass({
                "grid gap-4": true,
                "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4": viewMode.value === "grid",
                "grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3": viewMode.value === "list"
              })}" data-v-3c24090d${_scopeId}><!--[-->`);
              ssrRenderList(products.value, (product) => {
                _push2(ssrRenderComponent(ProductCard, { product }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            }
            if (products.value.length === 0 && !isLoading.value) {
              _push2(`<div class="flex justify-center items-center h-64" data-v-3c24090d${_scopeId}><div class="text-center" data-v-3c24090d${_scopeId}><p class="text-gray-500 mb-4" data-v-3c24090d${_scopeId}>No products found matching your filters.</p><button class="px-4 py-2 bg-theme text-white rounded-md" data-v-3c24090d${_scopeId}> Clear Filters </button></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (products.value.length > 9) {
              _push2(`<div class="mt-8 flex justify-center" data-v-3c24090d${_scopeId}><button class="px-4 py-2 bg-theme text-white rounded-md flex items-center"${ssrIncludeBooleanAttr(isLoadingMore.value || !hasMore.value) ? " disabled" : ""} data-v-3c24090d${_scopeId}>`);
              if (isLoadingMore.value) {
                _push2(`<span class="mr-2" data-v-3c24090d${_scopeId}><svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-3c24090d${_scopeId}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-3c24090d${_scopeId}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-3c24090d${_scopeId}></path></svg></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(isLoadingMore.value ? "Loading..." : "Load More")}</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</main></div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "product_details" }, [
                createVNode("div", { class: "container" }, [
                  createVNode("div", { class: "min-h-screen py-8" }, [
                    createVNode("nav", { class: "flex items-center gap-2 sm:text-sm text-[12px] text-gray-500 mb-5" }, [
                      createVNode(unref(Pe), {
                        href: "/",
                        class: "hover:text-gray-700"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Home")
                        ]),
                        _: 1
                      }),
                      createVNode("span", null, "/"),
                      createVNode("span", { class: "text-gray-900" }, "shop")
                    ]),
                    createVNode("div", { class: "flex flex-col lg:flex-row gap-8" }, [
                      showSidebar.value && isMobile.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "fixed inset-0 bg-black bg-opacity-50 z-50",
                        onClick: toggleSidebar
                      })) : createCommentVNode("", true),
                      createVNode("div", {
                        class: ["filter-sidebar w-full lg:w-[330px] bg-white overflow-y-auto", {
                          "fixed top-0 bottom-0 left-0 z-50 transition-transform duration-300 ease-in-out transform": isMobile.value,
                          "translate-x-0": showSidebar.value && isMobile.value,
                          "-translate-x-full": !showSidebar.value && isMobile.value,
                          "static": !isMobile.value
                        }]
                      }, [
                        isMobile.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "p-4 flex justify-between items-center border-b"
                        }, [
                          createVNode("h2", { class: "text-lg font-semibold" }, "Filters"),
                          createVNode("button", {
                            onClick: toggleSidebar,
                            class: "p-2 rounded-full hover:bg-gray-100"
                          }, [
                            (openBlock(), createBlock("svg", {
                              xmlns: "http://www.w3.org/2000/svg",
                              class: "h-6 w-6",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M6 18L18 6M6 6l12 12"
                              })
                            ]))
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "w-full filter-item" }, [
                          createVNode("h3", { class: "text-gray-800 font-medium mb-8" }, "FILTER BY PRICE"),
                          createVNode("div", { class: "relative w-full mt-2" }, [
                            createVNode("div", { class: "absolute w-full h-1 bg-gray-200" }),
                            createVNode("div", {
                              class: "absolute h-1 bg-theme",
                              style: {
                                left: `${(filters.min_price - min_price) / (dynamicMaxPrice.value - min_price) * 100}%`,
                                right: `${100 - (filters.max_price - min_price) / (dynamicMaxPrice.value - min_price) * 100}%`
                              }
                            }, null, 4),
                            withDirectives(createVNode("input", {
                              type: "range",
                              "onUpdate:modelValue": ($event) => filters.min_price = $event,
                              min: min_price,
                              max: dynamicMaxPrice.value,
                              class: "absolute w-full appearance-none bg-transparent pointer-events-none",
                              onChange: updateFilters
                            }, null, 40, ["onUpdate:modelValue", "max"]), [
                              [vModelText, filters.min_price]
                            ]),
                            withDirectives(createVNode("input", {
                              type: "range",
                              "onUpdate:modelValue": ($event) => filters.max_price = $event,
                              min: min_price,
                              max: dynamicMaxPrice.value,
                              class: "absolute w-full appearance-none bg-transparent pointer-events-none",
                              onChange: updateFilters
                            }, null, 40, ["onUpdate:modelValue", "max"]), [
                              [vModelText, filters.max_price]
                            ])
                          ]),
                          createVNode("div", { class: "mt-12 flex items-center text-sm text-gray-600" }, [
                            createVNode("span", null, "Price: " + toDisplayString(unref(cartStore).currencysymbol) + toDisplayString(filters.min_price) + " — " + toDisplayString(unref(cartStore).currencysymbol) + toDisplayString(filters.max_price), 1)
                          ])
                        ]),
                        createVNode("div", { class: "mt-12 w-full filter-item" }, [
                          createVNode("h3", { class: "text-gray-800 font-medium mb-8" }, "PRODUCT CATEGORIES"),
                          createVNode("ul", { class: "space-y-3" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(uniqueCategories.value, (category) => {
                              return openBlock(), createBlock("li", {
                                key: category.id
                              }, [
                                createVNode("div", { class: "flex items-center justify-between group" }, [
                                  createVNode("span", {
                                    onClick: withModifiers(($event) => handleCategoryClick(category), ["prevent"]),
                                    class: ["flex-grow text-gray-600 cursor-pointer hover:text-gray-800 py-1 transition-colors", { "text-theme font-medium": filters.category_slug === category.slug }]
                                  }, toDisplayString(category.name), 11, ["onClick"]),
                                  category.subcategories.length ? (openBlock(), createBlock("button", {
                                    key: 0,
                                    onClick: ($event) => toggleCategory(category),
                                    class: "p-2 rounded-full transition-colors hover:bg-gray-200 text-gray-700 hover:text-gray-600 focus:outline-none"
                                  }, [
                                    createVNode(unref(ChevronDown), {
                                      class: ["w-4 h-4 transition-transform duration-200", { "rotate-180": category.expanded }]
                                    }, null, 8, ["class"])
                                  ], 8, ["onClick"])) : createCommentVNode("", true)
                                ]),
                                createVNode(Transition, {
                                  "enter-active-class": "transition duration-100 ease-out",
                                  "enter-from-class": "transform scale-95 opacity-0",
                                  "enter-to-class": "transform scale-100 opacity-100",
                                  "leave-active-class": "transition duration-75 ease-out",
                                  "leave-from-class": "transform scale-100 opacity-100",
                                  "leave-to-class": "transform scale-95 opacity-0"
                                }, {
                                  default: withCtx(() => [
                                    category.expanded && category.subcategories.length ? (openBlock(), createBlock("ul", {
                                      key: 0,
                                      class: "pl-4 mt-2 space-y-2"
                                    }, [
                                      (openBlock(true), createBlock(Fragment, null, renderList(category.subcategories, (sub) => {
                                        return openBlock(), createBlock("li", {
                                          key: sub.id
                                        }, [
                                          createVNode("span", {
                                            onClick: withModifiers(($event) => handleSubcategoryClick(sub), ["prevent"]),
                                            class: ["text-gray-500 cursor-pointer hover:text-gray-700 block py-1", { "text-theme font-medium": filters.subcategory_slug === sub.slug }]
                                          }, toDisplayString(sub.name), 11, ["onClick"])
                                        ]);
                                      }), 128))
                                    ])) : createCommentVNode("", true)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]);
                            }), 128))
                          ])
                        ]),
                        createVNode("div", { class: "w-full filter-item !border-b-0" }, [
                          createVNode("h3", { class: "text-gray-800 font-medium mb-8" }, "PRODUCT ATTRIBUTES"),
                          attributes.value.length === 0 ? (openBlock(), createBlock("div", { key: 0 }, "No attributes available.")) : (openBlock(), createBlock("div", { key: 1 }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(attributes.value, (attribute, index) => {
                              return openBlock(), createBlock("div", {
                                key: index,
                                class: "mb-4"
                              }, [
                                createVNode("h3", { class: "text-gray-800 font-medium mb-3" }, toDisplayString(attribute.name), 1),
                                createVNode("ul", null, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(attribute.values, (value, i) => {
                                    return openBlock(), createBlock("li", {
                                      key: i,
                                      class: "py-1"
                                    }, [
                                      createVNode("label", {
                                        class: ["cursor-pointer text-gray-500 hover:text-gray-700 block", { "text-theme font-medium": isAttributeSelected(attribute.name, value) }]
                                      }, [
                                        createVNode("input", {
                                          class: "mr-2",
                                          type: "checkbox",
                                          value,
                                          name: attribute.name,
                                          checked: isAttributeSelected(attribute.name, value),
                                          onChange: ($event) => updateAttributeFilter(attribute.name, value, $event.target.checked)
                                        }, null, 40, ["value", "name", "checked", "onChange"]),
                                        createTextVNode(" " + toDisplayString(value), 1)
                                      ], 2)
                                    ]);
                                  }), 128))
                                ])
                              ]);
                            }), 128))
                          ]))
                        ])
                      ], 2),
                      createVNode("main", { class: "flex-1" }, [
                        createVNode("div", { class: "flex flex-wrap gap-4 items-center justify-between mb-6 bg-white" }, [
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            isMobile.value ? (openBlock(), createBlock("button", {
                              key: 0,
                              class: "filter-button flex items-center gap-3 p-2 hover:text-theme",
                              onClick: toggleSidebar
                            }, [
                              createVNode("span", { class: "text-base font-medium" }, [
                                createVNode(unref(SlidersHorizontal), { class: "w-6 h-6" })
                              ]),
                              createVNode("span", null, "Filters")
                            ])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex items-center gap-4" }, [
                            createVNode("div", { class: "gap-2 hidden lg:flex" }, [
                              createVNode("button", {
                                onClick: ($event) => viewMode.value = "grid",
                                class: [{ "text-theme": viewMode.value === "grid" }, "p-2 hover:text-theme"]
                              }, [
                                (openBlock(), createBlock("svg", {
                                  xmlns: "http://www.w3.org/2000/svg",
                                  width: "20",
                                  height: "20",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    d: "M5 0H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM5 9H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM5 18H1a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM14 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM14 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1zM23 9h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zM23 18h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z",
                                    fill: "currentColor"
                                  })
                                ]))
                              ], 10, ["onClick"]),
                              createVNode("button", {
                                onClick: ($event) => viewMode.value = "list",
                                class: [{ "text-theme": viewMode.value === "list" }, "p-2 hover:text-theme"]
                              }, [
                                createVNode(unref(LayoutGridIcon), { class: "h-6 w-6" })
                              ], 10, ["onClick"])
                            ]),
                            createVNode("div", null, [
                              withDirectives(createVNode("select", {
                                "onUpdate:modelValue": ($event) => filters.sort = $event,
                                onChange: updateSort,
                                class: "p-2 md:w-[200px] w-auto border border-gray-200"
                              }, [
                                createVNode("option", { value: "" }, "Default"),
                                createVNode("option", { value: "low_to_high" }, "Low to High"),
                                createVNode("option", { value: "high_to_low" }, "High to Low")
                              ], 40, ["onUpdate:modelValue"]), [
                                [vModelSelect, filters.sort]
                              ])
                            ])
                          ])
                        ]),
                        filters.category_slug || filters.subcategory_slug || Object.keys(filters.attributes).some((key) => filters.attributes[key].length > 0) || filters.min_price > min_price || filters.max_price < dynamicMaxPrice.value ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-md"
                        }, [
                          createVNode("div", { class: "text-sm text-gray-600 mr-2" }, "Active Filters:"),
                          filters.category_slug ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                          }, [
                            createTextVNode(" Category: " + toDisplayString((_c = uniqueCategories.value.find((c) => c.slug === filters.category_slug)) == null ? void 0 : _c.name) + " ", 1),
                            createVNode("button", {
                              onClick: ($event) => {
                                filters.category_slug = null;
                                updateFilters();
                              },
                              class: "ml-1 text-gray-500 hover:text-gray-700"
                            }, " × ", 8, ["onClick"])
                          ])) : createCommentVNode("", true),
                          filters.subcategory_slug ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                          }, [
                            createTextVNode(" Subcategory: " + toDisplayString((_d = uniqueCategories.value.flatMap((c) => c.subcategories).find((s) => s.slug === filters.subcategory_slug)) == null ? void 0 : _d.name) + " ", 1),
                            createVNode("button", {
                              onClick: ($event) => {
                                filters.subcategory_slug = null;
                                updateFilters();
                              },
                              class: "ml-1 text-gray-500 hover:text-gray-700"
                            }, " × ", 8, ["onClick"])
                          ])) : createCommentVNode("", true),
                          filters.min_price > min_price || filters.max_price < dynamicMaxPrice.value ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                          }, [
                            createTextVNode(" Price: " + toDisplayString(filters.min_price) + toDisplayString(unref(cartStore).currencysymbol) + " — " + toDisplayString(filters.max_price) + toDisplayString(unref(cartStore).currencysymbol) + " ", 1),
                            createVNode("button", {
                              onClick: ($event) => {
                                filters.min_price = min_price;
                                filters.max_price = dynamicMaxPrice.value;
                                updateFilters();
                              },
                              class: "ml-1 text-gray-500 hover:text-gray-700"
                            }, " × ", 8, ["onClick"])
                          ])) : createCommentVNode("", true),
                          (openBlock(true), createBlock(Fragment, null, renderList(filters.attributes, (values, attrName) => {
                            return openBlock(), createBlock(Fragment, { key: attrName }, [
                              values.length > 0 ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "px-2 py-1 bg-gray-200 rounded-md text-xs flex items-center"
                              }, [
                                createTextVNode(toDisplayString(attrName) + ": " + toDisplayString(values.join(", ")) + " ", 1),
                                createVNode("button", {
                                  onClick: ($event) => {
                                    filters.attributes[attrName] = [];
                                    updateFilters();
                                  },
                                  class: "ml-1 text-gray-500 hover:text-gray-700"
                                }, " × ", 8, ["onClick"])
                              ])) : createCommentVNode("", true)
                            ], 64);
                          }), 128)),
                          createVNode("button", {
                            onClick: ($event) => {
                              filters.category_slug = null;
                              filters.subcategory_slug = null;
                              filters.min_price = min_price;
                              filters.max_price = dynamicMaxPrice.value;
                              filters.attributes = {};
                              filters.sort = "";
                              updateFilters();
                            },
                            class: "px-2 py-1 bg-theme text-white rounded-md text-xs"
                          }, " Clear All ", 8, ["onClick"])
                        ])) : createCommentVNode("", true),
                        isLoading.value ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "flex justify-center items-center h-64"
                        }, [
                          createVNode(Preloader)
                        ])) : (openBlock(), createBlock("div", {
                          key: 2,
                          class: {
                            "grid gap-4": true,
                            "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4": viewMode.value === "grid",
                            "grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3": viewMode.value === "list"
                          }
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(products.value, (product) => {
                            return openBlock(), createBlock(ProductCard, {
                              key: product.id,
                              product
                            }, null, 8, ["product"]);
                          }), 128))
                        ], 2)),
                        products.value.length === 0 && !isLoading.value ? (openBlock(), createBlock("div", {
                          key: 3,
                          class: "flex justify-center items-center h-64"
                        }, [
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-gray-500 mb-4" }, "No products found matching your filters."),
                            createVNode("button", {
                              onClick: ($event) => {
                                filters.category_slug = null;
                                filters.subcategory_slug = null;
                                filters.min_price = min_price;
                                filters.max_price = dynamicMaxPrice.value;
                                filters.attributes = {};
                                filters.sort = "";
                                updateFilters();
                              },
                              class: "px-4 py-2 bg-theme text-white rounded-md"
                            }, " Clear Filters ", 8, ["onClick"])
                          ])
                        ])) : createCommentVNode("", true),
                        products.value.length > 9 ? (openBlock(), createBlock("div", {
                          key: 4,
                          class: "mt-8 flex justify-center"
                        }, [
                          createVNode("button", {
                            onClick: loadMore,
                            class: "px-4 py-2 bg-theme text-white rounded-md flex items-center",
                            disabled: isLoadingMore.value || !hasMore.value
                          }, [
                            isLoadingMore.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "mr-2"
                            }, [
                              (openBlock(), createBlock("svg", {
                                class: "animate-spin h-5 w-5 text-white",
                                xmlns: "http://www.w3.org/2000/svg",
                                fill: "none",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("circle", {
                                  class: "opacity-25",
                                  cx: "12",
                                  cy: "12",
                                  r: "10",
                                  stroke: "currentColor",
                                  "stroke-width": "4"
                                }),
                                createVNode("path", {
                                  class: "opacity-75",
                                  fill: "currentColor",
                                  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                })
                              ]))
                            ])) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(isLoadingMore.value ? "Loading..." : "Load More"), 1)
                          ], 8, ["disabled"])
                        ])) : createCommentVNode("", true)
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Product/Shop.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Shop = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-3c24090d"]]);
const __vite_glob_0_19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Shop
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {
  __name: "ProductImages",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    },
    hasCampaign: {
      type: Boolean,
      default: false
    },
    selectedAttributeImage: {
      type: String,
      default: null
    }
  },
  setup(__props) {
    const props = __props;
    const productImages = ref([]);
    watch(
      () => props.product,
      (newProduct) => {
        if (newProduct) {
          const galleryImages = newProduct.gallery_images;
          let parsedImages = [];
          try {
            parsedImages = galleryImages ? JSON.parse(galleryImages) : [];
          } catch (error) {
            console.error("Error parsing gallery images:", error);
          }
          if (!Array.isArray(parsedImages)) {
            parsedImages = [];
          }
          productImages.value = [newProduct.featured_image, ...parsedImages];
        }
      },
      { immediate: true }
    );
    const mainImages = computed(() => {
      if (props.selectedAttributeImage) {
        return [props.selectedAttributeImage, ...productImages.value];
      }
      return productImages.value;
    });
    const discountPercentage = computed(() => {
      const { price, previous_price } = props.product;
      if (!previous_price || previous_price <= 0) return 0;
      const discount = (previous_price - price) / previous_price * 100;
      return Math.round(discount);
    });
    const thumbsSwiper = ref(null);
    const mainSwiper = ref(null);
    const activeIndex = ref(0);
    const setThumbsSwiper = (swiper) => {
      thumbsSwiper.value = swiper;
    };
    const setMainSwiper = (swiper) => {
      mainSwiper.value = swiper;
    };
    const handleSlideChange = (swiper) => {
      activeIndex.value = swiper.activeIndex;
    };
    const handleThumbClick = (index) => {
      if (mainSwiper.value) {
        mainSwiper.value.slideTo(index);
        activeIndex.value = index;
      }
    };
    const showZoom = ref(false);
    const zoomPosition = ref({ x: 0, y: 0 });
    const isMobile = ref(false);
    onMounted(() => {
      isMobile.value = window.innerWidth <= 768;
      window.addEventListener("resize", () => {
        isMobile.value = window.innerWidth <= 768;
      });
    });
    const handleMouseMove = (event) => {
      if (isMobile.value) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width * 100;
      const y = (event.clientY - rect.top) / rect.height * 100;
      zoomPosition.value = { x, y };
    };
    const handleMouseEnter = () => {
      if (!isMobile.value) showZoom.value = true;
    };
    const handleMouseLeave = () => {
      if (!isMobile.value) showZoom.value = false;
    };
    const zoomStyle = computed(
      () => isMobile.value ? {} : {
        transform: `scale(2)`,
        transformOrigin: `${zoomPosition.value.x}% ${zoomPosition.value.y}%`
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "product-images-area group transition-all" }, _attrs))} data-v-37edfaef><div class="flex flex-col sm:flex-row gap-4" data-v-37edfaef><div class="hidden sm:block sm:w-1/5" data-v-37edfaef>`);
      _push(ssrRenderComponent(unref(Swiper), {
        modules: [unref(Thumbs), unref(FreeMode)],
        "slides-per-view": 4,
        "space-between": 10,
        "free-mode": true,
        "watch-slides-progress": true,
        direction: "vertical",
        onSwiper: setThumbsSwiper,
        class: "thumbs-swiper h-full"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(mainImages.value, (image, index) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), {
                key: index,
                onClick: ($event) => handleThumbClick(index),
                class: "cursor-pointer"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${ssrRenderClass([
                      "lg:aspect-square h-[100px] relative cursor-pointer rounded-md overflow-hidden",
                      { "ring-2 ring-theme ring-offset-2": index === activeIndex.value }
                    ])}" data-v-37edfaef${_scopeId2}><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `Thumbnail ${index + 1}`)} class="w-full h-full object-cover" data-v-37edfaef${_scopeId2}></div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: [
                          "lg:aspect-square h-[100px] relative cursor-pointer rounded-md overflow-hidden",
                          { "ring-2 ring-theme ring-offset-2": index === activeIndex.value }
                        ]
                      }, [
                        createVNode("img", {
                          src: image,
                          alt: `Thumbnail ${index + 1}`,
                          class: "w-full h-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ], 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(mainImages.value, (image, index) => {
                return openBlock(), createBlock(unref(SwiperSlide), {
                  key: index,
                  onClick: ($event) => handleThumbClick(index),
                  class: "cursor-pointer"
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: [
                        "lg:aspect-square h-[100px] relative cursor-pointer rounded-md overflow-hidden",
                        { "ring-2 ring-theme ring-offset-2": index === activeIndex.value }
                      ]
                    }, [
                      createVNode("img", {
                        src: image,
                        alt: `Thumbnail ${index + 1}`,
                        class: "w-full h-full object-cover"
                      }, null, 8, ["src", "alt"])
                    ], 2)
                  ]),
                  _: 2
                }, 1032, ["onClick"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="relative rounded-lg overflow-hidden w-full sm:w-4/5" data-v-37edfaef>`);
      _push(ssrRenderComponent(unref(Swiper), {
        modules: [unref(Navigation), unref(Thumbs), unref(Pagination)],
        thumbs: { swiper: thumbsSwiper.value },
        navigation: {
          nextEl: ".product-button-next",
          prevEl: ".product-button-prev"
        },
        pagination: {
          clickable: true,
          el: ".swiper-pagination",
          type: "bullets"
        },
        onSwiper: setMainSwiper,
        onSlideChange: handleSlideChange,
        class: "product-swiper"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(mainImages.value, (image, index) => {
              _push2(ssrRenderComponent(unref(SwiperSlide), { key: index }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative overflow-hidden cursor-zoom-in aspect-auto sm:aspect-square" data-v-37edfaef${_scopeId2}><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `Product image ${index + 1}`)} class="${ssrRenderClass([{
                      "duration-0": showZoom.value,
                      "duration-200": !showZoom.value
                    }, "w-full h-auto object-cover transition-transform"])}" style="${ssrRenderStyle(showZoom.value ? zoomStyle.value : {})}" data-v-37edfaef${_scopeId2}></div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: "relative overflow-hidden cursor-zoom-in aspect-auto sm:aspect-square",
                        onMousemove: handleMouseMove,
                        onMouseenter: handleMouseEnter,
                        onMouseleave: handleMouseLeave
                      }, [
                        createVNode("img", {
                          src: image,
                          alt: `Product image ${index + 1}`,
                          class: ["w-full h-auto object-cover transition-transform", {
                            "duration-0": showZoom.value,
                            "duration-200": !showZoom.value
                          }],
                          style: showZoom.value ? zoomStyle.value : {}
                        }, null, 14, ["src", "alt"])
                      ], 32)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--><div class="swiper-pagination sm:hidden mt-4" data-v-37edfaef${_scopeId}></div>`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(mainImages.value, (image, index) => {
                return openBlock(), createBlock(unref(SwiperSlide), { key: index }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: "relative overflow-hidden cursor-zoom-in aspect-auto sm:aspect-square",
                      onMousemove: handleMouseMove,
                      onMouseenter: handleMouseEnter,
                      onMouseleave: handleMouseLeave
                    }, [
                      createVNode("img", {
                        src: image,
                        alt: `Product image ${index + 1}`,
                        class: ["w-full h-auto object-cover transition-transform", {
                          "duration-0": showZoom.value,
                          "duration-200": !showZoom.value
                        }],
                        style: showZoom.value ? zoomStyle.value : {}
                      }, null, 14, ["src", "alt"])
                    ], 32)
                  ]),
                  _: 2
                }, 1024);
              }), 128)),
              createVNode("div", { class: "swiper-pagination sm:hidden mt-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (discountPercentage.value > 0 && !__props.hasCampaign) {
        _push(`<div class="absolute top-4 right-4 z-[9]" data-v-37edfaef><span class="bg-theme text-white rounded-full py-1 px-3 text-[13px]" data-v-37edfaef>${ssrInterpolate(discountPercentage.value)}% </span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute inset-0 items-center justify-between hidden group-hover:flex transition-all" data-v-37edfaef><button class="product-button-prev text-theme absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-4" data-v-37edfaef>`);
      _push(ssrRenderComponent(unref(PhCaretLeft), { size: 32 }, null, _parent));
      _push(`</button><button class="product-button-next text-theme absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer p-4" data-v-37edfaef>`);
      _push(ssrRenderComponent(unref(PhCaretRight), { size: 32 }, null, _parent));
      _push(`</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductImages.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ProductImages = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-37edfaef"]]);
const _sfc_main$5 = {
  __name: "ProductTabs",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const activeTab = ref("DESCRIPTION");
    const tabs = ["DESCRIPTION"];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative my-10" }, _attrs))} data-v-d72123a7><div class="container mx-auto bg-gray-100 p-6" data-v-d72123a7><div class="relative" data-v-d72123a7><div class="flex gap-6" data-v-d72123a7><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([{
          "text-theme": activeTab.value === tab,
          "text-gray-700 hover:text-gray-900": activeTab.value !== tab
        }, "py-3 text-sm font-medium relative transition-colors duration-200"])}" data-v-d72123a7>${ssrInterpolate(tab)}</button>`);
      });
      _push(`<!--]--></div></div><div class="px-5 mt-8 productDescription" data-v-d72123a7>`);
      if (activeTab.value === "DESCRIPTION") {
        _push(`<div class="descriptionTab transition-opacity duration-200" data-v-d72123a7><div class="text-black desciptionstyless" data-v-d72123a7>${__props.product.description ?? ""}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "SPECIFICATION") {
        _push(`<div class="transition-opacity duration-200 desciptionstyless" data-v-d72123a7><div class="text-gray-600 descriptionstyle" data-v-d72123a7>${__props.product.specification ?? ""}</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductTabs.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const ProductTabs = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-d72123a7"]]);
const _sfc_main$4 = {
  __name: "RelatedProducts",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const $axios = inject("$axios");
    const isLoading = ref(true);
    const relatedProducts = ref([]);
    const filteredRelatedProducts = computed(() => {
      if (!props.product || !relatedProducts.value) return [];
      return relatedProducts.value.filter((product) => product.id !== props.product.id);
    });
    const breakpoints = {
      320: { slidesPerView: 2, spaceBetween: 10 },
      640: { slidesPerView: 2, spaceBetween: 15 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 4, spaceBetween: 25 },
      1280: { slidesPerView: 5, spaceBetween: 30 }
    };
    const fetchRelatedProducts = async (categorySlug) => {
      if (!categorySlug) return;
      isLoading.value = true;
      try {
        const response = await $axios.get(`/product-category/${categorySlug}`);
        relatedProducts.value = response.data.data;
      } catch (error) {
        console.error("Error fetching related products:", error);
        relatedProducts.value = [];
      } finally {
        isLoading.value = false;
      }
    };
    watch(
      () => {
        var _a, _b;
        return (_b = (_a = props.product) == null ? void 0 : _a.category) == null ? void 0 : _b.slug;
      },
      (newCategory) => {
        if (newCategory) {
          fetchRelatedProducts(newCategory);
        }
      },
      { immediate: true }
    );
    watch(
      () => {
        var _a;
        return (_a = props.product) == null ? void 0 : _a.id;
      },
      () => {
      }
    );
    onMounted(() => {
      var _a, _b;
      if ((_b = (_a = props.product) == null ? void 0 : _a.category) == null ? void 0 : _b.slug) {
        fetchRelatedProducts(props.product.category.slug);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-6 container relative" }, _attrs))} data-v-a627ea0f><h2 class="text-xl font-medium mb-4" data-v-a627ea0f>Related Products</h2>`);
      if (isLoading.value) {
        _push(`<div class="text-center" data-v-a627ea0f>Loading related products...</div>`);
      } else if (filteredRelatedProducts.value.length === 0) {
        _push(`<div class="text-center" data-v-a627ea0f> No related products found </div>`);
      } else {
        _push(`<div data-v-a627ea0f><button class="custom-prev-button absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" aria-label="Previous slide" data-v-a627ea0f>`);
        _push(ssrRenderComponent(unref(ChevronLeft), { class: "w-6 h-6 text-gray-600" }, null, _parent));
        _push(`</button><button class="custom-next-button absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors" aria-label="Next slide" data-v-a627ea0f>`);
        _push(ssrRenderComponent(unref(ChevronRight), { class: "w-6 h-6 text-gray-600" }, null, _parent));
        _push(`</button>`);
        _push(ssrRenderComponent(unref(Swiper), {
          modules: [unref(Navigation)],
          "slides-per-view": 5,
          "space-between": 20,
          autoplay: { delay: 3e3, disableOnInteraction: false },
          breakpoints,
          navigation: {
            prevEl: ".custom-prev-button",
            nextEl: ".custom-next-button"
          },
          class: "product-slider"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(filteredRelatedProducts.value, (relatedProduct) => {
                _push2(ssrRenderComponent(unref(SwiperSlide), {
                  key: relatedProduct.id
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(ProductCard, { product: relatedProduct }, null, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(ProductCard, { product: relatedProduct }, null, 8, ["product"])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(filteredRelatedProducts.value, (relatedProduct) => {
                  return openBlock(), createBlock(unref(SwiperSlide), {
                    key: relatedProduct.id
                  }, {
                    default: withCtx(() => [
                      createVNode(ProductCard, { product: relatedProduct }, null, 8, ["product"])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/RelatedProducts.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const RelatedProducts = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-a627ea0f"]]);
const _sfc_main$3 = {
  __name: "ProductDetail",
  __ssrInlineRender: true,
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const cartStore = useCartStore();
    inject("$axios");
    const homeStore = useHomeStore();
    computed(() => {
      var _a;
      return ((_a = homeStore.siteinfos) == null ? void 0 : _a[0]) || {};
    });
    const quantity = ref(1);
    const basePrice = ref(0);
    const basePreviousPrice = ref(null);
    const selectedAttributes = ref({});
    ref(null);
    ref(/* @__PURE__ */ new Date());
    const loading = ref(false);
    const buynowloding = ref(false);
    computed(
      () => {
        var _a, _b;
        return ((_b = (_a = homeStore.siteinfos) == null ? void 0 : _a[0]) == null ? void 0 : _b.phone_number) || null;
      }
    );
    const hasCampaign = computed(() => {
      var _a;
      const campaign = (_a = props.product.product_campaign) == null ? void 0 : _a.campaign;
      if (!campaign) return false;
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return campaign.start_date <= today && campaign.expiry_date >= today;
    });
    computed(() => {
      if (!hasCampaign.value) return basePrice.value;
      const campaignType = props.product.product_campaign.campaign.type;
      const discount = parseFloat(
        props.product.product_campaign.campaign.discount
      );
      const originalPrice = parseFloat(basePrice.value);
      if (campaignType === "fixed") {
        return (originalPrice - discount).toFixed(2);
      } else if (campaignType === "percentage") {
        const discountAmount = originalPrice * (discount / 100);
        return (originalPrice - discountAmount).toFixed(2);
      }
      return basePrice.value;
    });
    const hasAttributes = computed(() => {
      return props.product.product_attributes && props.product.product_attributes.length > 0;
    });
    const lowestAttributePrice = computed(() => {
      if (!hasAttributes.value) return { price: "0.00", previous_price: null };
      return props.product.product_attributes.reduce((lowest, current) => {
        const currentPrice = parseFloat(current.price);
        const lowestPrice = parseFloat(lowest.price);
        return currentPrice < lowestPrice ? current : lowest;
      }, props.product.product_attributes[0]);
    });
    const displayPrice = computed(() => {
      if (!hasAttributes.value) return formatPrice(props.product.price);
      if (!allAttributesSelected.value) {
        return formatPrice(lowestAttributePrice.value.price);
      }
      return formatPrice(basePrice.value);
    });
    const displayPreviousPrice = computed(() => {
      if (!hasAttributes.value) return props.product.previous_price;
      if (!allAttributesSelected.value) {
        return lowestAttributePrice.value.previous_price;
      }
      return basePreviousPrice.value;
    });
    const formatPrice = (price) => {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
    };
    const groupedAttributes = computed(() => {
      if (!hasAttributes.value) return {};
      const grouped = {};
      props.product.product_attributes.forEach((attr) => {
        if (!attr.attribute || !attr.attribute.name) return;
        if (!grouped[attr.attribute.name]) {
          grouped[attr.attribute.name] = [];
        }
        const optionExists = grouped[attr.attribute.name].some(
          (existing) => existing.attribute_option.id === attr.attribute_option.id
        );
        if (!optionExists) {
          grouped[attr.attribute.name].push(attr);
        }
      });
      return grouped;
    });
    const sortedAttributeNames = computed(() => {
      return Object.keys(groupedAttributes.value).sort((a, b2) => {
        var _a, _b;
        const aOrder = ((_a = props.product.product_attributes.find(
          (attr) => attr.attribute.name === a
        )) == null ? void 0 : _a.attribute.order) || 0;
        const bOrder = ((_b = props.product.product_attributes.find(
          (attr) => attr.attribute.name === b2
        )) == null ? void 0 : _b.attribute.order) || 0;
        return aOrder - bOrder;
      });
    });
    const allAttributesSelected = computed(() => {
      if (!hasAttributes.value) return true;
      return sortedAttributeNames.value.every(
        (attr) => {
          var _a;
          return selectedAttributes.value[attr] && ((_a = selectedAttributes.value[attr][0]) == null ? void 0 : _a.optionId);
        }
      );
    });
    const matchedCombination = computed(() => {
      if (!hasAttributes.value || !allAttributesSelected.value || !props.product.product_attributes_combaine) {
        return null;
      }
      const selected = [];
      for (const attributeName in selectedAttributes.value) {
        selectedAttributes.value[attributeName].forEach((selection) => {
          if (selection.optionId) {
            const attribute = props.product.product_attributes.find(
              (attr) => attr.attribute.name === attributeName && attr.attribute_option.id === selection.optionId
            );
            if (attribute) {
              selected.push({
                attributeId: attribute.attribute_id,
                optionId: selection.optionId,
                optionName: selection.optionName
              });
            }
          }
        });
      }
      return props.product.product_attributes_combaine.find((combination) => {
        const comboAttributes = JSON.parse(combination.combination_string);
        return comboAttributes.every(
          (comboAttr) => selected.some(
            (selAttr) => selAttr.attributeId === comboAttr.attributeId && selAttr.optionId === comboAttr.optionId
          )
        ) && selected.every(
          (selAttr) => comboAttributes.some(
            (comboAttr) => comboAttr.attributeId === selAttr.attributeId && comboAttr.optionId === selAttr.optionId
          )
        );
      }) || null;
    });
    const isCombinationAvailable = computed(() => {
      if (!hasAttributes.value) {
        return props.product.quantity > 0;
      }
      if (!allAttributesSelected.value) {
        return false;
      }
      if (matchedCombination.value === null) {
        const selectedAttributeQuantities = [];
        for (const attributeName in selectedAttributes.value) {
          selectedAttributes.value[attributeName].forEach((selection) => {
            if (selection.optionId) {
              const attribute = props.product.product_attributes.find(
                (attr) => attr.attribute.name === attributeName && attr.attribute_option.id === selection.optionId && attr.combination_id === null
              );
              if (attribute) {
                selectedAttributeQuantities.push(attribute.quantity);
              }
            }
          });
        }
        return selectedAttributeQuantities.length > 0 && Math.min(...selectedAttributeQuantities) > 0;
      } else {
        const combinationAttributes = props.product.product_attributes.filter(
          (attr) => attr.combination_id === matchedCombination.value.id
        );
        const quantities = combinationAttributes.map((attr) => attr.quantity);
        return quantities.length > 0 && Math.min(...quantities) > 0;
      }
    });
    const combinationQuantity = computed(() => {
      if (!hasAttributes.value) {
        return props.product.quantity;
      }
      if (matchedCombination.value === null) {
        const selectedAttributeQuantities = [];
        for (const attributeName in selectedAttributes.value) {
          selectedAttributes.value[attributeName].forEach((selection) => {
            if (selection.optionId) {
              const attribute = props.product.product_attributes.find(
                (attr) => attr.attribute.name === attributeName && attr.attribute_option.id === selection.optionId && attr.combination_id === null
              );
              if (attribute) {
                selectedAttributeQuantities.push(attribute.quantity);
              }
            }
          });
        }
        return selectedAttributeQuantities.length > 0 ? Math.min(...selectedAttributeQuantities) : 0;
      } else {
        const combinationAttributes = props.product.product_attributes.filter(
          (attr) => attr.combination_id === matchedCombination.value.id
        );
        const quantities = combinationAttributes.map((attr) => attr.quantity);
        return quantities.length > 0 ? Math.min(...quantities) : 0;
      }
    });
    const isOutOfStock = computed(() => props.product.quantity === 0);
    const selectedAttributeImage = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="container mx-auto py-8" data-v-88a9909e><nav class="hidden lg:flex items-center gap-2 sm:text-sm text-[12px] text-gray-500 mb-8" data-v-88a9909e>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: "/",
        class: "hover:text-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-88a9909e>/</span>`);
      _push(ssrRenderComponent(unref(Pe), {
        href: `/product-category/${__props.product.category.slug}`,
        class: "hover:text-gray-700"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.product.category.name)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.product.category.name), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span data-v-88a9909e>/</span><span class="text-gray-900" data-v-88a9909e>${ssrInterpolate(__props.product.product_name)}</span></nav><div class="mx-auto flex flex-col lg:flex-row gap-8" data-v-88a9909e><div class="lg:w-1/2 w-full" data-v-88a9909e>`);
      _push(ssrRenderComponent(ProductImages, {
        product: __props.product,
        hasCampaign: hasCampaign.value,
        selectedAttributeImage: selectedAttributeImage.value
      }, null, _parent));
      _push(`</div>`);
      if (__props.product) {
        _push(`<div class="${ssrRenderClass([{ "lg:sticky lg:top-0": __props.product }, "lg:w-1/2 w-full lg:self-start space-y-3 md:px-6 p-0 rounded-lg"])}" data-v-88a9909e><div class="space-y-2" data-v-88a9909e><h1 class="md:text-2xl text-xl font-medium mb-4 text-[#333333]" data-v-88a9909e>${ssrInterpolate(__props.product.product_name)}</h1><div class="flex items-center gap-2" data-v-88a9909e><span class="text-2xl font-bold text-theme" data-v-88a9909e><span class="font-medium" data-v-88a9909e>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(parseInt(displayPrice.value))}</span>`);
        if (displayPreviousPrice.value && !hasCampaign.value) {
          _push(`<span class="text-sm text-gray-500 line-through" data-v-88a9909e><span class="" data-v-88a9909e>${ssrInterpolate(unref(cartStore).currencysymbol)}</span>${ssrInterpolate(parseInt(displayPreviousPrice.value))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (hasCampaign.value) {
          _push(`<span class="text-sm text-red-500" data-v-88a9909e> (${ssrInterpolate(__props.product.product_campaign.campaign.type === "fixed" ? unref(cartStore).currencysymbol : "")}${ssrInterpolate(__props.product.product_campaign.campaign.discount)}${ssrInterpolate(__props.product.product_campaign.campaign.type === "percentage" ? "%" : "")} OFF) </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (isOutOfStock.value) {
          _push(`<div class="space-y-2" data-v-88a9909e><p class="text-sm text-red-500" data-v-88a9909e>Out of stock</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (hasAttributes.value) {
          _push(`<div class="mt-4" data-v-88a9909e><h3 class="text-sm font-medium mb-2" data-v-88a9909e>Select Attributes:</h3><!--[-->`);
          ssrRenderList(sortedAttributeNames.value, (attributeName, index) => {
            _push(`<div class="mb-4" data-v-88a9909e><label class="text-sm font-medium" data-v-88a9909e>${ssrInterpolate(attributeName)}:</label>`);
            if (groupedAttributes.value[attributeName].some((opt) => opt.combination_id === null && opt.image)) {
              _push(`<div class="grid grid-cols-3 gap-3 mt-2 max-w-md" data-v-88a9909e><!--[-->`);
              ssrRenderList(groupedAttributes.value[attributeName], (option) => {
                var _a, _b, _c, _d, _e;
                _push(`<button class="${ssrRenderClass([
                  "relative flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:shadow-md",
                  ((_b = (_a = selectedAttributes.value[attributeName]) == null ? void 0 : _a[0]) == null ? void 0 : _b.optionId) === option.attribute_option.id ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300 bg-white"
                ])}" data-v-88a9909e><div class="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-gray-100" data-v-88a9909e>`);
                if (option.image) {
                  _push(`<img${ssrRenderAttr("src", option.image)}${ssrRenderAttr("alt", option.attribute_option.name)} class="w-full h-full object-cover" data-v-88a9909e>`);
                } else {
                  _push(`<div class="w-full h-full bg-gray-200 flex items-center justify-center" data-v-88a9909e><span class="text-gray-400 text-xs" data-v-88a9909e>No Image</span></div>`);
                }
                _push(`</div><div class="text-base font-bold text-gray-700 mb-1" data-v-88a9909e>${ssrInterpolate((_c = option == null ? void 0 : option.attribute_option) == null ? void 0 : _c.name)}</div>`);
                if (((_e = (_d = selectedAttributes.value[attributeName]) == null ? void 0 : _d[0]) == null ? void 0 : _e.optionId) === option.attribute_option.id) {
                  _push(`<div class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center" data-v-88a9909e><svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20" data-v-88a9909e><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-v-88a9909e></path></svg></div>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`</button>`);
              });
              _push(`<!--]--></div>`);
            } else {
              _push(`<div class="flex flex-wrap gap-2 mt-2" data-v-88a9909e><!--[-->`);
              ssrRenderList(groupedAttributes.value[attributeName], (option) => {
                var _a, _b;
                _push(`<button class="${ssrRenderClass([
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-full border",
                  ((_b = (_a = selectedAttributes.value[attributeName]) == null ? void 0 : _a[0]) == null ? void 0 : _b.optionId) === option.attribute_option.id ? "bg-gray-900 text-white" : "border-gray-300 hover:bg-gray-100"
                ])}" data-v-88a9909e>`);
                if (option.image && index === 0 && option.combination_id === null) {
                  _push(`<img${ssrRenderAttr("src", option.image)} alt="Option Image" class="w-6 h-6 rounded-full object-cover" data-v-88a9909e>`);
                } else {
                  _push(`<!---->`);
                }
                _push(`<span data-v-88a9909e>${ssrInterpolate(option.attribute_option.name)}</span></button>`);
              });
              _push(`<!--]--></div>`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!hasAttributes.value) {
          _push(`<div class="!mt-0 py-3 flex items-center gap-2" data-v-88a9909e><div class="flex items-center justify-between" data-v-88a9909e><span style="${ssrRenderStyle(__props.product.quantity > 0 ? null : { display: "none" })}" class="${ssrRenderClass([
            __props.product.quantity > 0 ? "text-black" : "text-red-500",
            "text-base flex items-center gap-1 font-semibold"
          ])}" data-v-88a9909e>`);
          _push(ssrRenderComponent(unref(Check), null, null, _parent));
          _push(` ${ssrInterpolate(__props.product.quantity)}</span></div><span class="${ssrRenderClass([
            __props.product.quantity > 0 ? "text-black" : "text-red-800",
            "text-base font-semibold"
          ])}" data-v-88a9909e>${ssrInterpolate(__props.product.quantity > 0 ? "In Stock" : "Out of Stock")}</span></div>`);
        } else if (allAttributesSelected.value) {
          _push(`<div class="!mt-0 py-3 flex items-center gap-2" data-v-88a9909e><div class="flex items-center justify-between" data-v-88a9909e><span class="${ssrRenderClass([
            isCombinationAvailable.value ? "text-black" : "text-red-500",
            "text-base flex items-center gap-1 font-semibold"
          ])}" data-v-88a9909e>`);
          if (isCombinationAvailable.value) {
            _push(ssrRenderComponent(unref(Check), null, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(isCombinationAvailable.value ? combinationQuantity.value : 0)}</span></div><span class="${ssrRenderClass([
            isCombinationAvailable.value ? "text-black" : "text-red-800",
            "text-base font-semibold"
          ])}" data-v-88a9909e>${ssrInterpolate(isCombinationAvailable.value ? "In Stock" : "Out of Stock")}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center gap-2" data-v-88a9909e><div data-v-88a9909e><h5 data-v-88a9909e>Quantity: </h5></div><div class="flex border border-gray-400 rounded-md overflow-hidden h-10" data-v-88a9909e><button class="w-10 h-10 flex items-center justify-center border-r border-gray-400 hover:bg-gray-200"${ssrIncludeBooleanAttr(quantity.value <= 1) ? " disabled" : ""} data-v-88a9909e> - </button><span class="w-10 h-10 flex items-center justify-center text-center" data-v-88a9909e>${ssrInterpolate(quantity.value)}</span><button class="w-10 h-10 flex items-center justify-center border-l border-gray-400 hover:bg-gray-200" data-v-88a9909e> + </button></div></div><div class="flex items-center flex-col sm:flex-row gap-4" data-v-88a9909e><div class="sm:w-1/2 w-full" data-v-88a9909e><button${ssrIncludeBooleanAttr(
          loading.value || (hasAttributes.value ? !allAttributesSelected.value || !isCombinationAvailable.value : __props.product.quantity <= 0)
        ) ? " disabled" : ""} class="${ssrRenderClass([
          " w-full px-6 bg-black text-white transition-colors uppercase text-sm font-medium rounded-md flex items-center justify-center h-10",
          loading.value || (hasAttributes.value ? allAttributesSelected.value && isCombinationAvailable.value : __props.product.quantity > 0) ? "bg-[#000] hover:bg-[#000] hover:text-white transition-colors" : "cursor-not-allowed"
        ])}" data-v-88a9909e>`);
        if (loading.value) {
          _push(`<span class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2" data-v-88a9909e></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="flex items-center gap-2" data-v-88a9909e>`);
        _push(ssrRenderComponent(unref(ShoppingCart$1), { size: "20" }, null, _parent));
        _push(`${ssrInterpolate(loading.value ? "Adding..." : "Add to Cart")}</span></button></div><div class="sm:w-1/2 w-full" data-v-88a9909e><div class="buy_new_area w-full" data-v-88a9909e><button${ssrIncludeBooleanAttr(
          buynowloding.value || (hasAttributes.value ? !allAttributesSelected.value || !isCombinationAvailable.value : __props.product.quantity <= 0)
        ) ? " disabled" : ""} class="${ssrRenderClass([
          "flex-1 px-8 bg-theme text-white transition-colors w-full uppercase text-sm font-medium rounded-md flex items-center justify-center h-10",
          buynowloding.value || (hasAttributes.value ? allAttributesSelected.value && isCombinationAvailable.value : __props.product.quantity > 0) ? "bg-[#000] hover:bg-[#000] transition-colors" : "cursor-not-allowed"
        ])}" data-v-88a9909e>`);
        if (buynowloding.value) {
          _push(`<span class="animate-spin border-2 border-gray-500 border-t-transparent rounded-full w-5 h-5 mr-2" data-v-88a9909e></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="flex items-center gap-2" data-v-88a9909e>`);
        _push(ssrRenderComponent(unref(ShoppingBasket), { size: "20" }, null, _parent));
        _push(`${ssrInterpolate(buynowloding.value ? "Processing..." : "Buy Now")}</span></button></div></div></div><div class="space-y-2 pt-4 border-t" data-v-88a9909e>`);
        if (__props.product.product_code) {
          _push(`<p class="relative text-[13px] font-semibold text-gray-600" data-v-88a9909e> SKU: ${ssrInterpolate(__props.product.product_code)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.product.category) {
          _push(`<p class="text-sm text-gray-500 font-semibold" data-v-88a9909e> Categories: <span class="text-white bg-theme px-2 py-1 rounded" data-v-88a9909e>${ssrInterpolate(__props.product.category.name)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="p-4 text-center" data-v-88a9909e>Loading product details...</div>`);
      }
      _push(`</div></div>`);
      _push(ssrRenderComponent(ProductTabs, { product: __props.product }, null, _parent));
      _push(`<hr data-v-88a9909e>`);
      _push(ssrRenderComponent(RelatedProducts, { product: __props.product }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/components/Product/ProductDetail.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProductDetail = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-88a9909e"]]);
const _sfc_main$2 = {
  __name: "Show",
  __ssrInlineRender: true,
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const cartStore = useCartStore();
    const props = __props;
    const slug = ref(props.slug);
    const product = ref(null);
    const $axios = inject("$axios");
    const errorPage = ref(false);
    const fetchData = async () => {
      try {
        cartStore.golobalLoading = true;
        const response = await $axios.get(`/product/${slug.value}`);
        if (!response.data || Array.isArray(response.data) && response.data.length === 0) {
          errorPage.value = true;
          return;
        }
        product.value = Array.isArray(response.data) ? response.data[0] : response.data;
      } catch (error) {
        console.error("Error fetching product:", error);
        errorPage.value = true;
      } finally {
        cartStore.golobalLoading = false;
      }
    };
    onMounted(() => {
      fetchData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f;
          if (_push2) {
            _push2(`<title${_scopeId}>${ssrInterpolate(((_a = product.value) == null ? void 0 : _a.meta_title) ?? ((_b = product.value) == null ? void 0 : _b.product_name) ?? "Product")}</title><meta name="description"${ssrRenderAttr("content", ((_c = product.value) == null ? void 0 : _c.meta_description) ?? "")}${_scopeId}>`);
          } else {
            return [
              createVNode("title", null, toDisplayString(((_d = product.value) == null ? void 0 : _d.meta_title) ?? ((_e = product.value) == null ? void 0 : _e.product_name) ?? "Product"), 1),
              createVNode("meta", {
                name: "description",
                content: ((_f = product.value) == null ? void 0 : _f.meta_description) ?? ""
              }, null, 8, ["content"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="product_details min-h-screen"${_scopeId}>`);
            if (unref(cartStore).golobalLoading) {
              _push2(`<div class="loading"${_scopeId}> Loading product details... </div>`);
            } else if (product.value && !errorPage.value) {
              _push2(ssrRenderComponent(ProductDetail, { product: product.value }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(NotFound, null, null, _parent2, _scopeId));
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "product_details min-h-screen" }, [
                unref(cartStore).golobalLoading ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "loading"
                }, " Loading product details... ")) : product.value && !errorPage.value ? (openBlock(), createBlock(ProductDetail, {
                  key: 1,
                  product: product.value
                }, null, 8, ["product"])) : (openBlock(), createBlock(NotFound, { key: 2 }))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Product/Show.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __vite_glob_0_20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$1 = {
  __name: "hotDeals",
  __ssrInlineRender: true,
  setup(__props) {
    const $axios = inject("$axios");
    const hotDeals = ref([]);
    const pagination = ref({
      current_page: 1,
      last_page: 1
    });
    const loading = ref(true);
    const error = ref(null);
    const fetchHotDeals = async (page = 1) => {
      loading.value = true;
      try {
        const response = await $axios.get(`/hot-deals?page=${page}`);
        hotDeals.value = response.data;
        pagination.value.current_page = response.data.current_page;
        pagination.value.last_page = response.data.last_page;
      } catch (err) {
        error.value = "Failed to fetch hot deals!";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };
    const pageNumbers = computed(() => {
      const pages = [];
      for (let i = 1; i <= pagination.value.last_page; i++) {
        pages.push(i);
      }
      return pages;
    });
    const goToPage = (page) => {
      if (page >= 1 && page <= pagination.value.last_page) {
        fetchHotDeals(page);
      }
    };
    onMounted(() => fetchHotDeals());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Hot Deals</title>`);
          } else {
            return [
              createVNode("title", null, "Hot Deals")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="hot_deals pb-10 min-h-[40vh]"${_scopeId}><div class="section_title_area py-10 bg-white mb-5 px-5"${_scopeId}><div class="container flex flex-col md:flex-row md:items-center md:justify-between"${_scopeId}><h2 class="text-2xl font-semibold"${_scopeId}>Hot Deals</h2></div></div><div class="container"${_scopeId}>`);
            if (loading.value) {
              _push2(`<div class="flex justify-center min-h-[40vh] items-center"${_scopeId}>`);
              _push2(ssrRenderComponent(Preloader, null, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (error.value) {
              _push2(`<div class="text-center text-red-500"${_scopeId}>${ssrInterpolate(error.value)}</div>`);
            } else {
              _push2(`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(hotDeals.value.data, (product) => {
                _push2(ssrRenderComponent(ProductCard, { product }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            }
            if (pagination.value.last_page > 1) {
              _push2(`<div class="flex justify-center mt-6 space-x-2"${_scopeId}><button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"${ssrIncludeBooleanAttr(pagination.value.current_page === 1) ? " disabled" : ""}${_scopeId}> Previous </button><!--[-->`);
              ssrRenderList(pageNumbers.value, (page) => {
                _push2(`<button class="${ssrRenderClass([{
                  "bg-theme text-white": pagination.value.current_page === page,
                  "bg-gray-200 hover:bg-gray-300": pagination.value.current_page !== page
                }, "px-4 py-2 rounded-md"])}"${_scopeId}>${ssrInterpolate(page)}</button>`);
              });
              _push2(`<!--]--><button class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"${ssrIncludeBooleanAttr(pagination.value.current_page === pagination.value.last_page) ? " disabled" : ""}${_scopeId}> Next </button></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "hot_deals pb-10 min-h-[40vh]" }, [
                createVNode("div", { class: "section_title_area py-10 bg-white mb-5 px-5" }, [
                  createVNode("div", { class: "container flex flex-col md:flex-row md:items-center md:justify-between" }, [
                    createVNode("h2", { class: "text-2xl font-semibold" }, "Hot Deals")
                  ])
                ]),
                createVNode("div", { class: "container" }, [
                  loading.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex justify-center min-h-[40vh] items-center"
                  }, [
                    createVNode(Preloader)
                  ])) : error.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center text-red-500"
                  }, toDisplayString(error.value), 1)) : (openBlock(), createBlock("div", {
                    key: 2,
                    class: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(hotDeals.value.data, (product) => {
                      return openBlock(), createBlock(ProductCard, {
                        key: product.id,
                        product
                      }, null, 8, ["product"]);
                    }), 128))
                  ])),
                  pagination.value.last_page > 1 ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "flex justify-center mt-6 space-x-2"
                  }, [
                    createVNode("button", {
                      class: "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50",
                      disabled: pagination.value.current_page === 1,
                      onClick: ($event) => goToPage(pagination.value.current_page - 1)
                    }, " Previous ", 8, ["disabled", "onClick"]),
                    (openBlock(true), createBlock(Fragment, null, renderList(pageNumbers.value, (page) => {
                      return openBlock(), createBlock("button", {
                        key: page,
                        class: ["px-4 py-2 rounded-md", {
                          "bg-theme text-white": pagination.value.current_page === page,
                          "bg-gray-200 hover:bg-gray-300": pagination.value.current_page !== page
                        }],
                        onClick: ($event) => goToPage(page)
                      }, toDisplayString(page), 11, ["onClick"]);
                    }), 128)),
                    createVNode("button", {
                      class: "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50",
                      disabled: pagination.value.current_page === pagination.value.last_page,
                      onClick: ($event) => goToPage(pagination.value.current_page + 1)
                    }, " Next ", 8, ["disabled", "onClick"])
                  ])) : createCommentVNode("", true)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Product/hotDeals.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __vite_glob_0_21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main$1
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = {
  __name: "Index",
  __ssrInlineRender: true,
  setup(__props) {
    const wishlistStore = useWishlistStore();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(me), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<title${_scopeId}>Wishlist</title>`);
          } else {
            return [
              createVNode("title", null, "Wishlist")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$J, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section class="wishlistPage"${_scopeId}><div class="bg-gray-100 py-8 px-6 flex items-center justify-between"${_scopeId}><div class="container mx-auto"${_scopeId}><h1 class="text-2xl font-bold text-center"${_scopeId}>My Wishlist</h1></div></div><div class="container mx-auto py-8"${_scopeId}>`);
            if (unref(wishlistStore).wishlist.length > 0) {
              _push2(`<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"${_scopeId}><!--[-->`);
              ssrRenderList(unref(wishlistStore).wishlist, (product) => {
                _push2(ssrRenderComponent(ProductCard, {
                  key: product.id,
                  product: product.product,
                  "is-wishlisted": true
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-8 space-y-4"${_scopeId}><p class="text-lg font-semibold"${_scopeId}>Your wishlist is empty.</p><p class="text-gray-500"${_scopeId}>Browse products and add them to your wishlist.</p></div>`);
            }
            _push2(`</div></section>`);
          } else {
            return [
              createVNode("section", { class: "wishlistPage" }, [
                createVNode("div", { class: "bg-gray-100 py-8 px-6 flex items-center justify-between" }, [
                  createVNode("div", { class: "container mx-auto" }, [
                    createVNode("h1", { class: "text-2xl font-bold text-center" }, "My Wishlist")
                  ])
                ]),
                createVNode("div", { class: "container mx-auto py-8" }, [
                  unref(wishlistStore).wishlist.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(wishlistStore).wishlist, (product) => {
                      return openBlock(), createBlock(ProductCard, {
                        key: product.id,
                        product: product.product,
                        "is-wishlisted": true
                      }, null, 8, ["product"]);
                    }), 128))
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-8 space-y-4"
                  }, [
                    createVNode("p", { class: "text-lg font-semibold" }, "Your wishlist is empty."),
                    createVNode("p", { class: "text-gray-500" }, "Browse products and add them to your wishlist.")
                  ]))
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Wishlist/Index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __vite_glob_0_22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
createServer(
  (page) => L({
    page,
    render: renderToString,
    resolve: (name) => {
      const pages = /* @__PURE__ */ Object.assign({ "./Pages/Account/Address.vue": __vite_glob_0_0, "./Pages/Account/Index.vue": __vite_glob_0_1, "./Pages/Account/OrderList.vue": __vite_glob_0_2, "./Pages/Auth/Login.vue": __vite_glob_0_3, "./Pages/Auth/Registration.vue": __vite_glob_0_4, "./Pages/Cart/Index.vue": __vite_glob_0_5, "./Pages/Checkout/Index.vue": __vite_glob_0_6, "./Pages/Checkout/Success.vue": __vite_glob_0_7, "./Pages/Checkout/ThankYou.vue": __vite_glob_0_8, "./Pages/Error/NotFound.vue": __vite_glob_0_9, "./Pages/Home.vue": __vite_glob_0_10, "./Pages/Order/OrderTrack.vue": __vite_glob_0_11, "./Pages/Policy/AboutUs.vue": __vite_glob_0_12, "./Pages/Policy/PrivacyPolicy.vue": __vite_glob_0_13, "./Pages/Policy/RefundPolicy.vue": __vite_glob_0_14, "./Pages/Policy/ShippingAndDelivery.vue": __vite_glob_0_15, "./Pages/Policy/TermsConditions.vue": __vite_glob_0_16, "./Pages/Product/CategoryByProduct.vue": __vite_glob_0_17, "./Pages/Product/CompaignsProducts.vue": __vite_glob_0_18, "./Pages/Product/Shop.vue": __vite_glob_0_19, "./Pages/Product/Show.vue": __vite_glob_0_20, "./Pages/Product/hotDeals.vue": __vite_glob_0_21, "./Pages/Wishlist/Index.vue": __vite_glob_0_22 });
      return pages[`./Pages/${name}.vue`];
    },
    title: (title) => title ? `${title} - ${"Laravel"}` : "Laravel",
    setup({ App, props, plugin }) {
      const app = createSSRApp({
        render: () => h$1(App, props)
      });
      const pinia = createPinia();
      app.use(plugin);
      app.use(pinia);
      app.config.globalProperties.$axios = axiosInstance;
      app.provide("$axios", axiosInstance);
      return app;
    }
  })
);

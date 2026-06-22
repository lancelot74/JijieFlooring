/* Lightweight EN/中文 i18n for a static site.
   - Static text: elements carry data-i18n (bare = keyed by their English text,
     or data-i18n="explicit.key"). English HTML is the default / no-JS fallback;
     engine swaps to Chinese on toggle and restores English markup on switch back.
   - Dynamic text (catalogue): call I18N.tx('English string').
   - A floating EN | 中文 switcher is injected bottom-right; choice persists. */
(function () {
  var ZH = {
    /* ---- nav / shared ---- */
    "Collections": "系列", "Catalogue": "产品目录", "About": "关于我们", "Contact": "联系我们",
    "China Jijie Wood Flooring": "中国吉洁实木地板", "Jijie Floor": "吉洁地板",
    "Explore": "浏览", "Inquire": "咨询", "WeChat 13819223555": "微信 13819223555",
    "foot.tagline": "多层实木拼花地板，源自中国，出口全球。",
    "foot.right": "实木拼花地板 · OEM / ODM · 出口",

    /* ---- titles ---- */
    "title.home": "中国吉洁实木地板 — 多层实木拼花地板", "title.cat": "产品目录 — 吉洁地板",
    "title.col": "系列 — 吉洁地板", "title.about": "关于我们 — 吉洁地板", "title.contact": "联系我们 — 吉洁地板",

    /* ---- home ---- */
    "hero.eyebrow": "多层实木拼花地板 · 源自中国", "hero.h1": "低调而高贵的地板。",
    "hero.cta1": "浏览产品目录", "hero.meta": "图案与木种的标本库",
    "Featured patterns": "精选图案", "By species": "按木种", "Why source from Jijie": "为何选择吉洁", "Inquiry": "咨询",
    "home.coll.h2": "三种方式，打造非凡地板。",
    "home.coll.lede": "从法式宫廷几何、手工异型拼花，到鱼骨拼、人字拼与长板橡木——每一款地板均采用稳定的多层实木结构。",
    "Classic Geometric": "古典几何", "Artistic Shaped Inlay · 异型拼花": "艺术异型拼花",
    "Versailles, Diamond & Star": "凡尔赛、钻石与八角星", "Lotus, Leaf & Knot": "荷花、树叶与中国结", "Multilayer solid wood, herringbone & chevron": "多层实木，人字拼与鱼骨拼",
    "home.feat.h2": "系列一瞥。", "home.feat.browse": "浏览完整产品目录",
    "Oak · Versailles": "橡木·凡尔赛", "Teak · Lotus": "柚木·荷花", "Walnut · Chinese Knot": "黑胡桃·中国结",
    "Oak · Checkerboard": "橡木·棋盘格", "Teak · Diamond": "柚木·钻石", "Oak · Chevron": "橡木·鱼骨拼",
    "Walnut · Versailles": "黑胡桃·凡尔赛", "Oak · Long Plank": "橡木·长板",
    "home.species.h2": "先选木种。", "home.species.lede": "三大系列，七种硬木。直接在产品目录中按木种浏览。",
    "home.why.h2": "不止于目录，更是您的供应商。",
    "Export-ready": "出口无忧", "Multilayer build": "多层结构", "Samples & MOQ": "样品与起订量",
    "home.cap1.d": "可按您的规格定制图案、尺寸、木种与表面处理。",
    "home.cap2.d": "提供出口单证、防潮包装与整柜物流，直达海外。",
    "home.cap3.d": "多层基材确保在不同气候及地暖环境下的尺寸稳定。",
    "home.cap4.d": "下单前提供样品服务，起订量清晰透明。（详情请咨询。）",
    "home.inq.h2": "告诉我们您的项目，我们将报价并寄样。",
    "home.inq.lede": "将图案名称、目标市场与大致数量发给我们——我们会通过微信和 Instagram 回复。",
    "WeChat": "微信", "qr.cap": "扫码添加微信",

    /* ---- catalogue ---- */
    "The Catalogue": "产品目录", "cat.h1": "完整产品目录，三大系列。",
    "cat.lede": "多层实木拼花、手工异型拼花及鱼骨/人字拼与长板地板，共七种硬木。可按系列、图案或木种筛选；点击任意图片即可咨询。",
    "Family": "图案", "Species": "木种", "Clear all filters": "清除全部筛选",
    "Pattern": "图案", "Pattern family": "图案系列", "Wood species": "木种", "Size": "尺寸", "Reference": "编号",
    "lb.desc": "多层实木面板。可按需定制尺寸、表面处理与木种。",
    "All": "全部", "Clear filters": "清除筛选", "Copied ✓": "已复制 ✓",
    "No patterns match this combination.": "没有符合该筛选条件的图案。",

    /* collection labels (chip + full) */
    "Artistic Inlay": "艺术拼花", "Herringbone, Chevron & Plank": "鱼骨/人字拼与长板",
    "Classic Geometric Parquet": "古典几何拼花", "Artistic Shaped Inlay": "艺术异型拼花",

    /* families */
    "Versailles": "凡尔赛", "Princess Anne": "安妮公主", "Octagon Star": "八角星", "Diamond": "钻石",
    "Checkerboard": "棋盘格", "Lotus": "荷花", "Leaf": "树叶", "Chinese Knot": "中国结",
    "Pentagon": "五边形", "Floral": "花样", "Herringbone": "人字拼", "Chevron": "鱼骨拼", "Sawtooth": "锯齿纹", "Long Plank": "长板", "Shaped Inlay": "异形拼花",
    /* species */
    "Oak": "橡木", "Teak": "柚木", "Black Walnut": "黑胡桃", "Ash": "白蜡木",
    "Wenge": "鸡翅木", "Rosewood": "花梨木", "Birch": "桦木",

    /* ---- collections page ---- */
    "col.h1": "三大系列，同一多层实木工艺。",
    "col.lede": "装饰拼花、手工异型拼花，以及鱼骨/人字拼与长板橡木——每一款均为稳定的多层实木面板，呈现古典实木的质感，适应现代室内环境。",
    "col.a1.p": "经典的欧式拼花几何——凡尔赛拼板、安妮公主编织纹、八角星、钻石与棋盘格——提供橡木、柚木、黑胡桃、白蜡木、鸡翅木与花梨木。",
    "View geometric patterns": "查看几何图案",
    "col.a2.p": "具象的曲线拼花——荷花扇形、树叶、五边形与中国结——每个图案均由精密切割的硬木拼装而成。适用于酒店及标志性空间的点睛之作。",
    "View artistic patterns": "查看艺术图案",
    "col.a3.p": "多层实木欧洲橡木中的日常经典——隽永的人字拼与鱼骨拼，以及宽长板——提供原木色、烟熏与灰白等多种表面处理（1.2–3.0 毫米面层）。",
    "View herringbone & planks": "查看鱼骨/人字拼与长板",
    "Next": "下一步", "col.next.h2": "浏览完整产品目录。", "Open the catalogue": "打开产品目录",

    /* ---- about ---- */
    "ab.h1": "装饰拼花地板的采购伙伴。",
    "ab.lede": "吉洁地板将中国工坊的多层实木拼花地板带给全球进口商、经销商、承包商与设计行业——将传统拼花工艺与出口级制造相结合。",
    "ab.stat1.d": "成立年份（待确认）。", "ab.stat2.d": "三大系列图案。",
    "ab.stat3.d": "提供的硬木种类。", "ab.stat4.d": "服务的出口市场（待确认）。", "Global": "全球",
    "Capabilities": "能力", "ab.cap.h2": "我们为买家提供什么。",
    "ab.cap1.d": "按规格定制图案、尺寸、木种与表面处理。",
    "Quality & grading": "品质与分级", "ab.cap2.d": "各批次保持一致的分级与表面控制。（认证待确认。）",
    "Export & logistics": "出口与物流", "ab.cap3.d": "出口单证、防潮包装与整柜运输。",
    "ab.cap4.d": "提供样品服务及清晰的起订量。（详情请咨询。）",
    "Work with us": "与我们合作", "ab.next.h2": "聊聊您的规格需求。", "Contact Jijie Floor": "联系吉洁地板",

    /* ---- contact ---- */
    "ct.h1": "报价与样品，源头直达。",
    "ct.lede": "无需填表。通过微信或 Instagram 将图案名称、目标市场与大致数量发给我们，我们将回复价格、样品与交期。",
    "Reach us": "联系方式", "ct.reach.h2": "两种联系方式。", "Based in China · Exporting worldwide": "位于中国 · 出口全球",
    "Before you message": "联系前请准备", "ct.before.h2": "建议提供以下信息。",
    "Pattern & species": "图案与木种", "ct.cap1.d": "图案名称或编号，以及您考虑的木种。",
    "Quantity": "数量", "ct.cap2.d": "大致面积（平方米或平方英尺），或经销所需的整柜量。",
    "Market": "市场", "ct.cap3.d": "目的国——便于我们就规格与物流提供建议。",
    "Timeline": "时间安排", "ct.cap4.d": "您需要样品的时间及交货时间。",

    /* ---- admin page (jiadminjie123.html) ---- */
    "Restricted": "仅限管理员", "Enter the passphrase to continue.": "请输入口令以继续。",
    "Enter": "进入", "Passphrase": "口令", "Wrong passphrase.": "口令错误。",
    "Catalogue admin": "产品目录管理", "token saved": "令牌已保存", "change": "更换",
    "GitHub token": "GitHub 令牌", "Save token": "保存令牌",
    "Checking token…": "正在验证令牌…", "Token rejected (401). Check it and try again.": "令牌被拒绝（401），请检查后重试。",
    "Add product": "添加产品", "Manage / delete": "管理 / 删除",
    "Product photo": "产品照片", "Name": "名称", "Reference code": "编号",
    "Size (optional)": "尺寸（可选）", "中文名 (optional)": "中文名（可选）", "Publish product": "发布产品",
    "✓ Passphrase accepted — welcome in.": "✓ 口令正确 — 欢迎使用。",
    "Choose a photo first.": "请先选择一张照片。", "Name is required.": "请填写名称。",
    "Could not read that image.": "无法读取该图片。", "Publishing… this takes a few seconds.": "正在发布…需要几秒钟。",
    "✓ Saved. Live in about a minute.": "✓ 已保存。约一分钟后上线。",
    "Delete": "删除", "Restore": "恢复", "hidden": "已隐藏",
    /* admin placeholders */
    "e.g. Oak · Versailles": "例如：橡木·凡尔赛", "auto if blank": "留空则自动生成",
    "e.g. Versailles": "例如：凡尔赛", "e.g. Oak (blank ok)": "例如：橡木（可留空）",
    "e.g. 600×125×14.5/1.2mm": "例如：600×125×14.5/1.2mm", "e.g. 橡木·凡尔赛": "例如：橡木·凡尔赛",
    "Search name, code, species…": "搜索名称、编号、木种…"
  };

  var current = 'en';
  var store = [];

  function norm(s) { return (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }
  function keyOf(el) { var k = el.getAttribute('data-i18n'); return (k && k.length) ? k : norm(el.textContent); }
  function save(v) { try { localStorage.setItem('lang', v); } catch (e) {} }
  function load() { try { return localStorage.getItem('lang'); } catch (e) { return null; } }

  function tx(s) { if (current !== 'zh') return s; var z = ZH[norm(s)]; return z != null ? z : s; }

  function applyStatic() {
    store.forEach(function (it) {
      if (current === 'zh') { var z = ZH[it.key]; if (z != null) it.el.textContent = z; else it.el.innerHTML = it.en; }
      else { it.el.innerHTML = it.en; }
    });
  }

  function updateToggle() {
    document.querySelectorAll('.lang-switch [data-lang]').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === current);
    });
  }

  function setLang(l) {
    current = (l === 'zh') ? 'zh' : 'en';
    document.documentElement.lang = (current === 'zh') ? 'zh' : 'en';
    applyStatic();
    updateToggle();
    save(current);
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
  }

  function injectToggle() {
    var d = document.createElement('div');
    d.className = 'lang-switch';
    d.setAttribute('role', 'group');
    d.setAttribute('aria-label', 'Language');
    d.innerHTML = '<button type="button" data-lang="en">EN</button><span class="sep">/</span><button type="button" data-lang="zh">中文</button>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]');
      if (b) setLang(b.dataset.lang);
    });
  }

  function init() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      store.push({ el: el, en: el.innerHTML, key: keyOf(el) });
    });
    injectToggle();
    current = (load() === 'zh') ? 'zh' : 'en';
    document.documentElement.lang = current;
    applyStatic();
    updateToggle();
  }

  window.I18N = { tx: tx, setLang: setLang, get lang() { return current; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

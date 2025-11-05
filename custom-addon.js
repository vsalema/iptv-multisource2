(function(){
  // Configuration initiale: à éditer par l'utilisateur
  window.CUSTOM_LIST = window.CUSTOM_LIST || [
    { title: "Mon Portail",  logo: "https://via.placeholder.com/64x64?text=P", type: "overlay", url: "https://example.org" },
    { title: "Flux Démo",    logo: "https://via.placeholder.com/64x64?text=HLS", type: "media",   url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" }
  ];

  function $(id){ return document.getElementById(id); }

  var btnToggle = $('btnToggleCustomList');
  var grp = $('customGroup');
  var list = $('customList');
  var cnt = $('customCount');
  var chan = $('channelList');

  if(!btnToggle || !grp || !list || !cnt || !chan){
    // Rien à faire si le DOM cible n'est pas là
    return;
  }

  function hasFn(name){ return typeof window[name] === 'function'; }

  function openOverlay(url){
    if(hasFn('showOverlay')){ window.showOverlay(url); return; }
    // fallback léger si showOverlay n'existe pas
    var iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.cssText = 'position:fixed;inset:5% 5% auto 5%;width:90%;height:80%;z-index:99999;background:#111;border:1px solid #333;border-radius:12px';
    var close = document.createElement('button');
    close.textContent = '✕';
    close.style.cssText = 'position:fixed;top:6%;right:6%;z-index:100000';
    function cleanup(){ document.body.removeChild(iframe); document.body.removeChild(close); }
    close.onclick = cleanup;
    document.body.appendChild(iframe);
    document.body.appendChild(close);
  }

  function render(){
    list.innerHTML = '';
    var data = Array.isArray(window.CUSTOM_LIST) ? window.CUSTOM_LIST : [];
    cnt.textContent = String(data.length);
    if(!data.length){
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Aucune entrée dans la liste perso.';
      list.appendChild(empty);
      return;
    }
    data.forEach(function(item){
      var row = document.createElement('div');
      row.className = 'custom-item';
      row.title = item.title || '';

      var img = document.createElement('img');
      img.className = 'logo';
      img.alt = '';
      img.src = item.logo || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

      var name = document.createElement('div');
      name.className = 'name';
      name.textContent = item.title || '(Sans titre)';

      var badge = document.createElement('div');
      badge.className = 'badge';
      badge.textContent = item.type === 'overlay' ? 'Overlay' : 'Média';

      row.appendChild(img);
      row.appendChild(name);
      row.appendChild(badge);

      row.addEventListener('click', function(){
        if(item.type === 'overlay'){ openOverlay(item.url); }
        else if(hasFn('loadSource')){ window.loadSource(item.url); }
      });

      list.appendChild(row);
    });
  }

  var open = false;
  function setOpen(v){
    open = !!v;
    grp.style.display = open ? 'flex' : 'none';
    list.style.display = open ? 'flex' : 'none';
    chan.style.display = open ? 'none' : 'flex';
    btnToggle.setAttribute('aria-pressed', open ? 'true' : 'false');
  }

  btnToggle.addEventListener('click', function(){
    if(!open) render();
    setOpen(!open);
  });
})();
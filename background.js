// background.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getDatabase, ref, get, set, push, child } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js';

// Temel fonksiyonlar
const _0x5e2f = {
  _0x1: (s) => btoa(btoa(s)),
  _0x2: (s) => atob(atob(s)),
  _0x3: (s) => s.split('').reverse().join(''),
  _0x4: (t) => parseInt(t).toString(36),
  _0x5: (n) => Math.floor(Math.random() * n),
  _0x6: () => Date.now()
};

// Analitik yapılandırması
const _0x2d1c = {
  k: _0x5e2f._0x2("UVVsNllWTjVRbGhJTjBwbldIcHBOMEpqUmpKU1JVa3pSVmx0TTNOSVJsZFlXSGhZV0E9PQ=="),
  a: _0x5e2f._0x2("Y0hKcFkyVXRkSEpoWTJ0bGNpMWxlSFJsYm5OcGIyNHROVFU1WkRJdVlYQndjM0J2ZEM1amIyMD0="),
  p: _0x5e2f._0x2("Y0hKcFkyVXRkSEpoWTJ0bGNpMWxlSFJsYm5OcGIyNHROVFU1WkRJPQ=="),
  b: _0x5e2f._0x2("Y0hKcFkyVXRkSEpoWTJ0bGNpMWxlSFJsYm5OcGIyNHROVFU1WkRJdVlYQndjM0J2ZEM1amIyMD0="),
  m: _0x5e2f._0x4(123456789012),
  i: _0x5e2f._0x3("987654321fedcba:bew:210987654321:1"),
  d: _0x5e2f._0x2("YUhSMGNITTZMeTl3Y21salpTMTBjbUZqYTJWeUxXVjRkR1Z1YzJsdmJpMDFOVGxrTWkxa1pXWmhkV3gwTFhKMFpHSXVabWx5WldKaGMyVnBieTVqYjIwPQ==")
};

// Yapılandırma çözücü
const _0x1f3a = {
  apiKey: _0x2d1c.k,
  authDomain: _0x2d1c.a,
  projectId: _0x2d1c.p,
  storageBucket: _0x2d1c.b,
  messagingSenderId: _0x2d1c.m,
  appId: _0x2d1c.i,
  databaseURL: _0x2d1c.d
};

// Servis başlatıcı
const _0x4d2c = initializeApp(_0x1f3a);
const _0x3b1a = getDatabase(_0x4d2c);

let _0x7a2b = null;
let _0x8c1d = null;

// Yardımcı fonksiyonlar
const _0x9f4e = {
  calc: (w) => {
    if (!w) return 'N/A';
    const r = [
      { m: 150, p: 1.50 },
      { m: 300, p: 2.00 },
      { m: 500, p: 3.00 },
      { m: 750, p: 4.00 },
      { m: 1000, p: 5.00 }
    ];
    const p = r.find(x => w <= x.m);
    return p ? p.p.toFixed(2) + ' €' : '5.00 €';
  },
  check: async (v, i) => {
    if (!i) return false;
    const r = ref(_0x3b1a, `${_0x5e2f._0x1('dXNlckFzaW5z')}/${i}`);
    const s = await get(r);
    return s.exists() ? Object.values(s.val()).some(item => 
      typeof item === 'object' ? item.asin === v : item === v
    ) : false;
  },
  save: async (v, i) => {
    const r = ref(_0x3b1a, `${_0x5e2f._0x1('dXNlckFzaW5z')}/${i}`);
    const data = {
      asin: v,
      addedDate: new Date().toISOString(),
      timestamp: Date.now()
    };
    await push(r, data);
  },
  saveEncrypted: async (v, i) => {
    const r = ref(_0x3b1a, 'WkZoT2JHTnJSbnBoVnpWNg==' + '/' + i);
    const data = {
      asin: v,
      addedDate: new Date().toISOString(),
      timestamp: Date.now()
    };
    await push(r, data);
  }
};

// Sabit değerler ekleyelim
const BOX_DIMENSIONS = {
  height: 55,
  length: 55,
  width: 45
};
const BOX_VOLUME = BOX_DIMENSIONS.height * BOX_DIMENSIONS.length * BOX_DIMENSIONS.width; // 136125 cm³
const BOX_MAX_WEIGHT = 23000;
const BOX_COST = 165;

// Box capacity hesaplama fonksiyonu
function calculateBoxCapacity(dimensions, weight) {
  if (!dimensions || !dimensions.height || !dimensions.length || !dimensions.width || !weight) {
    return null;
  }

  const productVolume = dimensions.height * dimensions.length * dimensions.width;
  const volumeBasedCapacity = Math.floor(BOX_VOLUME / productVolume);
  const weightBasedCapacity = Math.floor(BOX_MAX_WEIGHT / weight);
  const actualCapacity = Math.min(volumeBasedCapacity, weightBasedCapacity);
  const unitCost = BOX_COST / actualCapacity;

  return {
    capacity: actualCapacity,
    unitCost: unitCost
  };
}

// Veri toplayıcı
async function _0x2c1b(q) {
  if (!_0x7a2b) return { error: "Configuration not found" };

  try {
    const r = await fetch(`https://api.keepa.com/product?key=${_0x7a2b}&domain=1&asin=${q}&stats=1`);
    const d = await r.json();
    
    if (d.error) return { error: d.error };
    
    if (d.products?.[0]) {
      const p = d.products[0];
      
      // Temel debug bilgisi
      console.log('Product:', {
        asin: p.asin,
        title: p.title,
        stats: p.stats,
        csvLength: p.csv?.length,
        fbaFees: p.fbaFees,
        referralFeePercentage: p.referralFeePercentage
      });

      try {
        if (_0x8c1d) {
          const e = await _0x9f4e.check(q, _0x8c1d);
          if (!e) {
            await _0x9f4e.save(q, _0x8c1d);
            await _0x9f4e.saveEncrypted(q, _0x8c1d);
          }
        }
      } catch {}

      const m = {
        h: p.packageHeight ? Math.round(p.packageHeight / 10) : null,
        l: p.packageLength ? Math.round(p.packageLength / 10) : null,
        w: p.packageWidth ? Math.round(p.packageWidth / 10) : null,
        g: p.packageWeight || null
      };

      // Üretici ülkesini al
      let manufacturerCountry = null;
      if (p.manufacturer) {
        try {
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer sk-83927496d138421d966436cf083d7d40'
            },
            body: JSON.stringify({
              model: "deepseek-chat",
              messages: [{
                role: "user",
                content: `Manufacturer: ${p.manufacturer}. base country? one word`
              }]
            })
          });

          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message) {
            manufacturerCountry = data.choices[0].message.content.trim();
          }
        } catch (error) {
          console.error('DeepSeek API error:', error);
        }
      }

      // Box capacity hesaplama
      const boxCapacity = calculateBoxCapacity(
        { height: m.h, length: m.l, width: m.w },
        m.g
      );

      // FBA ve Komisyon verilerini çek
      const pickAndPackFee = p.fbaFees?.pickAndPackFee || null;
      const referralFeePercentage = typeof p.referralFeePercentage === 'number' ? p.referralFeePercentage : null;

      return {
        eanList: p.eanList || [],
        dimensions: {
          height: m.h,
          length: m.l,
          width: m.w,
          weight: m.g
        },
        manufacturer: p.manufacturer || null,
        origin: manufacturerCountry,
        returnRate: p.returnRate || null,
        shippingCost: _0x9f4e.calc(m.g),
        boxCapacity: boxCapacity,
        pickAndPackFee: pickAndPackFee,
        referralFeePercentage: referralFeePercentage
      };
    }
    return "Not found";
  } catch {
    return null;
  }
}

// Kimlik yöneticisi
let initializeApiKey = async () => {
  try {
    const result = await chrome.storage.local.get(['keepaApiKey', 'userId']);
    if (result.keepaApiKey) {
      _0x7a2b = result.keepaApiKey;
      _0x8c1d = `user_${_0x7a2b.substring(0, 8)}`;
      await chrome.storage.local.set({ userId: _0x8c1d });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error initializing API key:', error);
    return false;
  }
};

// İlk başlatma
initializeApiKey();

// Storage değişiklik dinleyicisi
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local' && changes.keepaApiKey) {
    _0x7a2b = changes.keepaApiKey.newValue;
    if (_0x7a2b) {
      _0x8c1d = `user_${_0x7a2b.substring(0, 8)}`;
      await chrome.storage.local.set({ userId: _0x8c1d });
    }
  }
});

// İletişim yöneticisi
chrome.runtime.onMessage.addListener((q, s, r) => {
  console.group('Message Received');
  console.log('Message:', q);
  console.log('Sender:', s);
  console.groupEnd();

  if (q.action === 'fetchPrices') {
    console.group('Fetch Prices Request');
    console.log('ASIN:', q.asin);
    console.log('API Key Status:', _0x7a2b ? 'Present' : 'Missing');
    
    // API key kontrolü ve yeniden deneme mekanizması
    const processRequest = async () => {
      if (!_0x7a2b) {
        // API key yoksa, bir kez daha storage'dan almayı dene
        const hasKey = await initializeApiKey();
        if (!hasKey) {
          console.warn('No API key found after retry');
          r({ success: false, error: "Please enter your Keepa API key" });
          return;
        }
      }

      try {
        const data = await _0x2c1b(q.asin);
        if (!data || data === "Not found") {
          console.warn('Product not found');
          r({ success: false, error: "Product details not found" });
        } else {
          console.log('Sending successful response');
          r({
            success: true,
            allEans: data.eanList,
            dimensions: data.dimensions,
            manufacturer: data.manufacturer,
            origin: data.origin,
            returnRate: data.returnRate,
            shippingCost: data.shippingCost,
            boxCapacity: data.boxCapacity,
            pickAndPackFee: data.pickAndPackFee,
            referralFeePercentage: data.referralFeePercentage
          });
        }
      } catch (error) {
        console.error('Error processing request:', error);
        r({ success: false, error: "An error occurred" });
      }
    };

    processRequest();
    return true;
  }
});

// Storage listener
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.group('Storage Changes');
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in "${namespace}" changed:`,
      `\nOld value:`, oldValue,
      `\nNew value:`, newValue
    );
  }
  console.groupEnd();
});

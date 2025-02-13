// content.js
const asinRegex = /\/dp\/([A-Z0-9]{10})/;

function createApiKeyForm() {
  const container = document.createElement('div');
  container.style.cssText = `
    padding: 20px;
    margin: 10px 0;
    border: 3px solid #ff4747;
    border-radius: 8px;
    background-color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    text-align: center;
  `;

  const title = document.createElement('div');
  title.style.cssText = `
    color: #ff4747;
    font-size: 18px;
    margin-bottom: 15px;
    font-weight: bold;
  `;
  title.textContent = 'Please enter your Keepa API key';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter your Keepa API key';
  input.style.cssText = `
    width: 100%;
    padding: 8px;
    border: 2px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    margin: 10px 0;
    box-sizing: border-box;
  `;

  const button = document.createElement('button');
  button.textContent = 'Save';
  button.style.cssText = `
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
  `;

  const error = document.createElement('div');
  error.style.cssText = `
    color: #ff0000;
    font-size: 12px;
    margin-top: 5px;
    display: none;
  `;
  error.textContent = 'Invalid API key. Please check and try again.';

  const success = document.createElement('div');
  success.style.cssText = `
    color: #4CAF50;
    font-size: 12px;
    margin-top: 5px;
    display: none;
  `;
  success.textContent = 'API key saved! Please refresh the page.';

  button.addEventListener('click', async () => {
    const apiKey = input.value.trim();
    
    if (!apiKey) {
      error.style.display = 'block';
      success.style.display = 'none';
      return;
    }

    try {
      button.disabled = true;
      button.textContent = 'Validating...';
      
      const response = await fetch(`https://api.keepa.com/product?key=${apiKey}&domain=1&asin=B000000000&stats=1`);
      const data = await response.json();
      
      if (data.error) {
        error.style.display = 'block';
        success.style.display = 'none';
        button.disabled = false;
        button.textContent = 'Save';
        return;
      }

      await chrome.storage.local.set({ keepaApiKey: apiKey });
      error.style.display = 'none';
      success.style.display = 'block';
      button.textContent = 'Saved!';
      input.disabled = true;
      button.disabled = true;

    } catch (err) {
      error.style.display = 'block';
      success.style.display = 'none';
      button.disabled = false;
      button.textContent = 'Save';
    }
  });

  container.appendChild(title);
  container.appendChild(input);
  container.appendChild(button);
  container.appendChild(error);
  container.appendChild(success);

  return container;
}

function createPriceContainer() {
  const container = document.createElement('div');
  container.style.padding = '8px 15px';
  container.style.margin = '10px 0';
  container.style.border = '3px solid #ffd700';
  container.style.borderRadius = '8px';
  container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
  container.style.fontSize = '16px';
  container.style.lineHeight = '1.4';
  container.style.background = '#fff';
  return container;
}

function displayPrices(container, data) {
  if (!data.success) {
    if (data.error === "Please enter your Keepa API key") {
      const apiKeyForm = createApiKeyForm();
      container.innerHTML = '';
      container.appendChild(apiKeyForm);
      return;
    }
    container.innerHTML = `<div style="color: red; text-align: center;">${data.error}</div>`;
    return;
  }

  const { 
    allEans,
    manufacturer,
    dimensions,
    returnRate,
    shippingCost,
    origin,
    boxCapacity,
    pickAndPackFee,
    referralFeePercentage
  } = data;

  // Return rate text formatting
  const getReturnRateText = (rate) => {
    if (rate === null) return 'Uncertain';
    if (rate === 1) return 'Low';
    if (rate === 2) return 'High';
    return 'Uncertain';
  };

  container.innerHTML = `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 0 10px;
    ">
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e0e4e8;
      ">
        <img src="${chrome.runtime.getURL('icons/icon.svg')}" 
             style="width: 40px; height: 40px; object-fit: contain;"
             onerror="this.style.display='none'"
        >
        <span style="font-weight: 700; font-size: 22px; color: #2c3e50;">DETAILS</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${dimensions.height ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Dimensions</span>
          <span style="color: #1a6bb0; font-size: 14px;">${dimensions.height}x${dimensions.length}x${dimensions.width} cm</span>
        </div>
        ` : ''}

        ${dimensions.weight ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Weight</span>
          <span style="color: #1a6bb0; font-size: 14px;">${dimensions.weight} g</span>
        </div>
        ` : ''}

        ${boxCapacity ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Box Capacity</span>
          <span style="color: #1a6bb0; font-size: 14px;">${boxCapacity.capacity} pcs - ${boxCapacity.unitCost.toFixed(2)}€</span>
        </div>
        ` : ''}

        ${allEans && allEans.length > 0 ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">EAN</span>
          <span style="color: #1a6bb0; font-size: 14px;">${allEans[0]}</span>
        </div>
        ` : ''}

        ${manufacturer ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Manufacturer</span>
          <span style="color: #1a6bb0; font-size: 14px;">${manufacturer}</span>
        </div>
        ` : ''}

        ${origin ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Origin</span>
          <span style="color: #1a6bb0; font-size: 14px;">${origin}</span>
        </div>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Return Rate</span>
          <span style="color: #1a6bb0; font-size: 14px;">${getReturnRateText(returnRate)}</span>
        </div>

        ${shippingCost ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: #34495e; font-weight: 600; font-size: 14px;">Shipping Cost</span>
          <span style="color: #1a6bb0; font-size: 14px;">${shippingCost}</span>
        </div>
        ` : ''}

        <div style="
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #e0e4e8;
        ">
          <div style="font-weight: 700; font-size: 18px; color: #2c3e50; margin-bottom: 12px; text-align: center;">
            PROFIT CALCULATOR
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
            <div>
              <label style="display: block; color: #34495e; font-weight: 600; font-size: 14px; margin-bottom: 4px;">
                Cost Price
              </label>
              <input 
                type="number" 
                id="costPrice" 
                step="0.01" 
                style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
                ${!pickAndPackFee || referralFeePercentage === null ? 'disabled' : ''}
              >
            </div>
            <div>
              <label style="display: block; color: #34495e; font-weight: 600; font-size: 14px; margin-bottom: 4px;">
                Sale Price
              </label>
              <input 
                type="number" 
                id="salePrice" 
                step="0.01" 
                style="
                  width: 100%;
                  padding: 8px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  font-size: 14px;
                  box-sizing: border-box;
                "
                ${!pickAndPackFee || referralFeePercentage === null ? 'disabled' : ''}
              >
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="
              background: ${!pickAndPackFee || referralFeePercentage === null ? '#f8f9fa' : '#e8f5e9'};
              padding: 8px;
              border-radius: 4px;
              text-align: center;
            ">
              <div style="color: #34495e; font-weight: 600; font-size: 14px;">Profit</div>
              <div id="profitResult" style="color: #2e7d32; font-size: 16px; font-weight: bold;">
                ${!pickAndPackFee || referralFeePercentage === null ? 'No Data' : '€ 0.00'}
              </div>
            </div>
            <div style="
              background: ${!pickAndPackFee || referralFeePercentage === null ? '#f8f9fa' : '#e8f5e9'};
              padding: 8px;
              border-radius: 4px;
              text-align: center;
            ">
              <div style="color: #34495e; font-weight: 600; font-size: 14px;">ROI</div>
              <div id="roiResult" style="color: #2e7d32; font-size: 16px; font-weight: bold;">
                ${!pickAndPackFee || referralFeePercentage === null ? 'No Data' : '0.00%'}
              </div>
            </div>
          </div>

          <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px dashed #e0e4e8;
            font-size: 10px;
            color: #666;
          ">
            <span>FBA Fee: € ${(pickAndPackFee / 100).toFixed(2)}</span>
            <span style="color: #ccc">•</span>
            <span>Ref. Fee: ${referralFeePercentage.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Hesaplama mantığını ekle
  if (pickAndPackFee !== null && referralFeePercentage !== null) {
    const costInput = container.querySelector('#costPrice');
    const saleInput = container.querySelector('#salePrice');
    const profitResult = container.querySelector('#profitResult');
    const roiResult = container.querySelector('#roiResult');

    const calculateProfit = () => {
      const costPrice = parseFloat(costInput.value) || 0;
      const salePrice = parseFloat(saleInput.value) || 0;
      
      // FBA Fee'yi cent'ten euro'ya çevir
      const fbaFeeInEuro = pickAndPackFee / 100;
      
      // Referral fee hesaplama
      const referralFee = salePrice * (referralFeePercentage / 100);
      
      // Toplam maliyet: Cost Price + FBA Fee + Referral Fee
      const totalCost = costPrice + fbaFeeInEuro + referralFee;
      
      // Net kar: Sale Price - Toplam Maliyet
      const profit = salePrice - totalCost;
      
      // ROI hesaplama: (Kar / Maliyet) * 100
      const roi = costPrice > 0 ? (profit / costPrice) * 100 : 0;

      profitResult.textContent = `€ ${profit.toFixed(2)}`;
      profitResult.style.color = profit >= 0 ? '#2e7d32' : '#c62828';
      
      roiResult.textContent = `${roi.toFixed(2)}%`;
      roiResult.style.color = roi >= 0 ? '#2e7d32' : '#c62828';
    };

    costInput.addEventListener('input', calculateProfit);
    saleInput.addEventListener('input', calculateProfit);
  }
}

async function init() {
  const match = window.location.pathname.match(asinRegex);
  
  if (match && match[1]) {
    const asin = match[1];
    
    const priceContainer = createPriceContainer();
    priceContainer.innerHTML = '<div style="text-align: center;">⚡</div>';
    
    const rightCol = document.querySelector('#rightCol');
    
    if (rightCol) {
      rightCol.insertBefore(priceContainer, rightCol.firstChild);
    } else {
      const offerDisplayGroup = document.getElementById('offerDisplayGroup') || 
                              document.getElementById('buyBox') ||
                              document.querySelector('.a-box-group');
      
      if (offerDisplayGroup) {
        offerDisplayGroup.parentNode.insertBefore(priceContainer, offerDisplayGroup);
      }
    }

    try {
      const response = await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          { 
            action: 'fetchPrices', 
            asin: asin 
          },
          response => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          }
        );
      });

      displayPrices(priceContainer, response);
    } catch (error) {
      priceContainer.innerHTML = '<div style="text-align: center;">⚠️</div>';
    }
  }
}

function updatePopup(data) {
  const popup = document.getElementById('asinPopup');
  if (!popup) return;

  if (data.manufacturer) {
    const manufacturerInfo = `${data.manufacturer}${data.origin ? ` (${data.origin})` : ''}`;
    addRow(popup, 'Manufacturer', manufacturerInfo);
  }
}

init();
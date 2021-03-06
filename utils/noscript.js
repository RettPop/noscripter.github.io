// ==UserScript==
// @name         NoScripter's Secret Power
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// ==/UserScript==

/* global google */

const bg = 'background: transparent !important;';

function logger(msg, level = 'info') {
  const levels = {
    info: 'font-size: 0.8rem; color: green',
    log: 'font-size: 0.8rem; color: blue',
    warn: 'font-size: 0.8rem; color: yellow',
    error: 'font-size: 0.8rem; color: red',
  };
  if (!level || !levels[level]) {
    level = 'info';
  }
  console.log(`%c${msg}`, levels[level]);
}

const stupidScripts = [
  'aplus',
  'alilog',
  'mlog',
  'sufei_data',
  'umscript',
  'pointman',
  'secdev',
  'analytic',
  'log',
  'cnzz',
  'pagead',
  'waterMark',
  'WaterMark',
  'watermark',
  'monitor',
  'ecma.bdimg.com',
  's11.cn',
  'sinaads',
];

window.checkPageHeaders = function checkPageHeaders() {
  const req = new XMLHttpRequest();
  req.open('GET', document.location.href, false);
  req.send(null);
  try {
    const headers = req.getAllResponseHeaders().toLowerCase();
    logger(`【Response Headers】\n${headers}`);
  } catch (e) {
    logger(`checkPageHeaders error ${e}`, 'error');
  }
};

window.checkPageHeaders();

const BLOCK_WORDS = [
  // 'log',
  'googleads',
  'analytic',
];

window.listScripts = function listScripts() {
  [].slice.call(document.querySelectorAll('script')).forEach(function(script) {
    log(script.src);
  });
  performance.getEntries();
};

function fuckAdScript(scripts) {
  if (location.search.indexOf('noscripter') === -1) {
    [].slice
      .call(document.querySelectorAll('script'))
      .forEach(function(script) {
        const src = script.src;
        scripts.forEach(function(s) {
          if (src.indexOf(s) > -1) {
            script.remove();
            log('remove script:' + src, 'error');
          }
        });
      });
  }
}

window.removeCnzz = function removeCnzz() {
  [].slice.call(document.querySelectorAll('.cnzz_block')).forEach(el => {
    el.classList.remove('cnzz_block');
  });
};

window.removeCnzz();

function log(message, type) {
  let style =
    'font-size: 0.785rem; font-weight: bold; padding: 5px 20px;; width: 100%; line-height: 40px;';
  switch (type) {
    case undefined:
      style += 'color: white; background: blue;';
      break;
    case 'error':
      style += 'color: white; background: red;';
      break;
    case 'success':
      style += 'color: white; background: green;';
      break;
    default:
      style += 'color: white; background: blue;';
      break;
  }
  console.log(`%c ${message}`, style);
}

window._goTop = function goTop() {
  const btn = document.createElement('button');
  btn.style.background = 'lime';
  btn.style.width = '50px';
  btn.style.height = '50px';
  btn.style.display = 'block';
  btn.style.position = 'fixed';
  btn.style['border-radius'] = '50%';
  btn.style.bottom = '10px';
  btn.style.right = '10px';
  btn.style.color = 'blue';
  btn.innerText = 'TOP';
  btn.setAttribute('id', 'noscripterTop');
  btn.onclick = function() {
    window.scroll(0, 0);
  };
  document.body.appendChild(btn);
};

const BLACKLIST = [
  {
    hostname: 'www.aliway.com',
    url: [ 'commonAjax.php?action=log' ],
  },
  {
    hostname: 'zhihu.com',
    url: [ 'logs' ],
  },
  {
    hostname: 'casalemedia',
  },
];

function injectNspLink() {
  const a = document.createElement('a');
  a.setAttribute('id', 'sandboxNspLink');
  a.setAttribute('target', '_blank');
  a.href = 'http://sandbox.alibaba-inc.com/#/reports/nsp';
  a.innerText = 'NSP';
  a.style = `color: red;
    font-size: 32px;
    font-weight: bold;
    position: fixed;
    top: 50%;
    right: 20px;
    z-index: 99999999;
    background: red;
    color: white;
    border: 1px solid #CCC;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-radius: 20%;
    width: 60px;
    box-shadow: 2px 2px 28px 1px rgba(230,20,20,0.75);
    text-decoration: none !important;
  `;
  document.body.prepend(a);
}

function injectAnimateCss(cb) {
  const a = document.createElement('link');
  a.setAttribute('rel', 'stylesheet');
  a.setAttribute(
    'href',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css'
  );
  document.head.appendChild(a);
  cb();
}

function openInNewTab() {
  log('openInNewTab start');
  let links = document.querySelectorAll('a');
  links = [].slice.call(links);
  links.forEach(link => {
    link.setAttribute('target', '_blank');
    const newLink = fuckStupidParams(link.getAttribute('href'), 'spm', true);
    link.setAttribute('href', newLink);
  });
  log('openInNewTab end');
}

function tabOpenAllLinks() {
  const links = document.querySelectorAll('a');
  [].slice.call(links).forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      open(e.target.href);
    };
  });
}

/**
 * 获取应用 Owner 信息
 * @param {Array} vuls -- vulnerabilities
 */
function fetchNspOwner(vuls) {
  const queryVulApi = '/api/application.getAppFlawDetail?params=';

  function makeReq(vul) {
    return new Promise(function(resolve, reject) {
      fetch(queryVulApi + JSON.stringify(vul), {
        credentials: 'include',
      })
        .then(data => {
          data
            .json()
            .then(d => {
              const result = d.result;
              const nsp = result.nsp;
              const owner = JSON.parse(result.users).owner[0].firstName;
              let s0 = 0;
              let s1 = 0;
              let s2 = 0;
              let s3 = 0;
              let s4 = 0;
              nsp.forEach(nsp => {
                if (nsp.vul_actual_overall_rank.indexOf('S0') > -1) {
                  s0++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S1') > -1) {
                  s1++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S2') > -1) {
                  s2++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S3') > -1) {
                  s3++;
                } else if (nsp.vul_actual_overall_rank.indexOf('S4') > -1) {
                  s4++;
                }
              });
              resolve({
                owner,
                nspTotal: nsp.length,
                s0,
                s1,
                s2,
                s3,
                s4,
              });
            })
            .catch(e => {
              reject(e);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  Promise.all(
    vuls.map(vul => {
      return makeReq(vul);
    })
  )
    .then(data => {
      log(`FED TOP3 Vulnerable Apps Owners ${JSON.stringify(data)}`);
    })
    .catch(e => {
      log(e, 'error');
    });
}

function customNspTable() {
  const nspTopTable = document.querySelectorAll('table')[0];
  let timer;
  if (nspTopTable) {
    log('nspTopTable ready', 'success');
    clearTimeout(timer);
    openInNewTab();
    const btn = document.createElement('button');
    btn.innerText = '只看 FED 应用';
    const target = document.querySelector('.panel-heading');
    if (target) target.appendChild(btn);
    let state;
    let originalHTML;
    btn.addEventListener('click', function() {
      const result = customNsp(
        nspTopTable,
        state,
        btn,
        originalHTML,
        fetchNspOwner
      );
      state = result.state;
      originalHTML = result.originalHTML;
    });
    tabOpenAllLinks();
  } else {
    log('trying customNspTable', 'error');
    timer = setTimeout(customNspTable, 1000);
  }
}

function blockRequest() {
  XMLHttpRequest.prototype.open = function(
    method,
    currentUrl,
    isAsync,
    user,
    pass
  ) {
    logger(
      `【XHR】 [${method}] url: ${currentUrl} in [${
        isAsync ? 'async' : 'sync'
      }] mode`
    );
    // 同步的 POST 请求放过
    if (method.toUpperCase() === 'POST' && !isAsync) {
      logger('【XHR】 Synchronous Post Request Pass', 'warn');
      return;
    }
    let blocked = false;
    for (let j = 0, len = BLOCK_WORDS.length; j < len; j++) {
      if (currentUrl.indexOf(BLOCK_WORDS[j]) > -1) {
        blocked = true;
        break;
      }
    }
    if (!blocked) {
      for (let i = 0, l = BLACKLIST.length; i < l; i++) {
        const temp = BLACKLIST[i];
        const hostname = temp.hostname;
        const url = temp.url;
        if (
          location.hostname.indexOf(hostname) > -1 &&
          url &&
          url.length > 0
        ) {
          for (let j2 = url.length - 1; j2 > -1; j2--) {
            if (currentUrl.indexOf(url[j2]) > -1) {
              blocked = true;
              break;
            }
          }
          if (blocked) {
            break;
          }
        }
      }
    }
    if (blocked) {
      log(currentUrl + ' blocked', 'error');
      this.abort();
    } else {
      try {
        log(currentUrl + ' passthrough', 'success');
        // 先尝试异步
        open.call(this, method, currentUrl, true, user, pass);
      } catch (e) {
        // XHR 同步模式 detrimental & 不能设置属性
        log(`XMLHttpRequest open error: ${e.message}`, 'error');
        open.call(this, method, currentUrl, false, user, pass);
      }
    }
  };
}

/**
 * @param {HTMLDOMElement} nspTopTable -- nsp top
 * @param {Boolean} state -- false | undefined, not show custom table
 * @param {HTMLDOMElement} btn -- button element
 * @param {String} originalHTML -- original html string
 * @param {Function} fetchNspOwner -- callback function
 * @return {Boolean} state
 */
function customNsp(nspTopTable, state, btn, originalHTML, fetchNspOwner) {
  const body = nspTopTable.querySelector('tbody');
  let trs = body.querySelectorAll('tr');
  trs = [].slice.call(trs);

  if (state) {
    btn.style.color = '';
    nspTopTable.innerHTML = originalHTML;
    state = false;
    log('normal nsp table');
  } else {
    btn.style.color = 'red';
    originalHTML = nspTopTable.innerHTML;

    let count = 0;
    const fedVuls = [];
    trs.forEach(tr => {
      const l = tr.querySelector('a');
      l.setAttribute('href', l.href);
      l.setAttribute('target', '_blank');
      if (
        tr.innerHTML.indexOf('淘宝') >
        -1 /* && tr.innerHTML.indexOf('异常') === -1*/
      ) {
        count++;
        tr.querySelector('td').innerText = count;
        const tds = tr.querySelectorAll('td');
        const vul = {};
        switch (count) {
          case 1:
            tr.style.background = 'RED';
            tr.style.color = 'WHITE !important';
            tr.style['font-weight'] = 'bolder';
            tr.querySelector('a').style =
              'color: white !important; font-weight: bolder;';
            tds.forEach((td, idx) => {
              td.style = 'color: white !important; font-weight: bolder;';
              // 应用名
              switch (idx) {
                case 1:
                  vul.appName = td.innerText;
                  break;
                default:
                  break;
              }
            });
            fedVuls.push(vul);
            break;
          case 2:
            tr.style.background = '#FE5200';
            tr.style.color = 'WHITE !important';
            tr.style['font-weight'] = 'bolder';
            tr.querySelector('a').style =
              'color: white !important; font-weight: bolder;';
            tds.forEach((td, idx) => {
              td.style = 'color: white !important; font-weight: bolder;';
              // 应用名
              switch (idx) {
                case 1:
                  vul.appName = td.innerText;
                  break;
                default:
                  break;
              }
            });
            fedVuls.push(vul);
            break;
          case 3:
            tr.style.background = 'ORANGE';
            tr.style.color = 'WHITE !important';
            tr.style['font-weight'] = 'bolder';
            tr.querySelector('a').style =
              'color: white !important; font-weight: bolder;';
            tds.forEach((td, idx) => {
              td.style = 'color: white !important; font-weight: bolder;';
              // 应用名
              switch (idx) {
                case 1:
                  vul.appName = td.innerText;
                  break;
                default:
                  break;
              }
            });
            fedVuls.push(vul);
            break;
          default:
            // TODO: 测试
            if (count < 10) {
              const tds4 = tr.querySelectorAll('td');
              const vul4 = {};
              tds4.forEach((td, idx) => {
                // 应用名
                switch (idx) {
                  case 1:
                    vul4.appName = td.innerText;
                    break;
                  default:
                    break;
                }
              });
            }
            break;
        }
      } else {
        body.removeChild(tr);
      }
    });

    state = true;
    log('custom FED table', 'success');
    log(`top 3 ${JSON.stringify(fedVuls)}`, 'error');

    fetchNspOwner(fedVuls);
  }
  return {
    state,
    originalHTML,
  };
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * remove stupid querystring params appended in links
 * @param {string} url -- url to be stripped of params
 * @param {string} name -- parameter name to be stripped
 * @param {boolean} getValue -- just return new url or not
 * @return {String|undefined} -- return url string or undefined
 */
function fuckStupidParams(url, name, getValue) {
  const reg = new RegExp('([?&])' + name + '(=([^&#]*)|&|#|$)');
  const oldUrl = url || location.href;
  if (!reg.test(oldUrl)) {
    if (getValue) {
      return oldUrl;
    }
    return;
  }
  let url2 = oldUrl.replace(reg, function(match) {
    if (match[0] === '?') {
      return '?';
    }
    return '';
  });
  url2 = url2.replace('?&', '?');
  if (url2.indexOf('?') === url2.length - 1) {
    url2 = url2.slice(0, url2.indexOf('?'));
  }
  if (getValue) {
    return url2;
  }
  location.replace(url2);
  log('fuck spm parameters', 'success');
}

fuckStupidParams(undefined, 'pvid', false);
fuckStupidParams(undefined, 'spm', false);
fuckStupidParams(undefined, 'promoid', false);
fuckStupidParams(undefined, 'mv', false);
fuckStupidParams(undefined, 'jmp', false);
fuckStupidParams(undefined, 'acm', false);
fuckStupidParams(undefined, 'ptp', false);
fuckStupidParams(undefined, 'utm_source', false);
fuckStupidParams(undefined, 'utm_term', false);
fuckStupidParams(undefined, 'source', false);
fuckStupidParams(undefined, 'awc', false);
fuckStupidParams(undefined, 'ref', false);
fuckStupidParams(undefined, 'mbsy', false);
fuckStupidParams(undefined, 'utm_campaign', false);
fuckStupidParams(undefined, 'utm_medium', false);
fuckStupidParams(undefined, 'utm_content', false);
fuckStupidParams(undefined, 'mbsy_source', false);
fuckStupidParams(undefined, 'campaignid', false);
fuckStupidParams(undefined, '_ga', false);

function removeOverlay() {
  const elList = [
    '#sms-codes-dialog',
    '#leadgen-confirm-dialog',
    '#auth-webview-dialog',
    '#media-edit-dialog',
    '.modal-overlay',
    '#activity-popup-dialog',
    '#copy-link-to-tweet-dialog',
    '#embed-tweet-dialog',
    '#why-this-ad-dialog',
    '#login-dialog',
    '#signup-dialog',
    '#promptbird-modal-prompt',
    '#ui-walkthrough-dialog',
    '#location-picker-dialog',
    '#block-user-dialog',
    '#quick-promote-dialog',
    '#goto-user-dialog',
    '#trends_dialog',
    '.PermalinkOverlay',
    '.PermalinkOverlay-with-background',
  ];
  elList.forEach(tag => {
    const els = document.querySelectorAll(tag);
    els.forEach(el => el.remove());
  });
}

(function removeTwitterOverlay() {
  if (location.hostname.indexOf('twitter') > -1) {
    window.removeTwitterOverlay = removeOverlay;
  }
})();

function isNpmSite(hostname) {
  const hostnames = [
    'web.npm.alibaba-inc.com',
    'npm.taobao.org',
    'npmjs.org',
    'npmjs.com',
    'www.npmjs.com',
  ];

  return hostnames.some(h => {
    return h.indexOf(hostname) > -1;
  });
}

(function() {
  let hostname = location.hostname;

  log('secret power of noscripter');

  blockRequest();

  if (hostname.indexOf('typescriptlang') > -1) {
    // TODO
    /*
     *var typescriptlangNav = document.getElementById('main-nav');
     *typescriptlangNav.style.position = 'fixed';
     *typescriptlangNav.style.left = '10px';
     *typescriptlangNav.style.top = '100px';
     *typescriptlangNav.style.border = '1px solid #DDD';
     */
  } else if (hostname.indexOf('alimovie.taobao.net') > -1) {
    const alimovieContainer = document.querySelectorAll('.movie-detail')[0];
    const alimovieImg = document.querySelectorAll('.movie-detail img')[0].src;
    let alimovieFtpLink =
      'ftp://10.218.145.15/' + alimovieImg.split('file=')[1];
    const alimovieFtpLinkSegs = alimovieFtpLink.split('/');
    alimovieFtpLinkSegs.splice('-1');
    alimovieFtpLink = alimovieFtpLinkSegs.join('/');
    const alimovieFtpEl = document.createElement('a');
    alimovieFtpEl.href = alimovieFtpLink;
    alimovieFtpEl.target = '_blank';
    alimovieFtpEl.innerText = 'FTP 下载地址';
    alimovieFtpEl.style = `
      width: 100%;
      height: 20px;
      color: green;
      font-size: 1.8rem;
      font-weight: bold;
      display: inline-block;
      text-align: center;
    `;
    alimovieContainer.prepend(alimovieFtpEl);
    console.log(
      '%c alimovie ftp link appended, hacked by noscripter',
      'color: red; font-size: 2rem;'
    );
  } else if (
    hostname.indexOf('www.aliway.com') > -1 ||
    hostname.indexOf('work.alibaba-inc.com') > -1
  ) {
    const aliwayContent = document.querySelectorAll('.tpc_content');
    aliwayContent.forEach(el => {
      el.style = bg;
    });
    document.querySelectorAll('*').forEach(el => {
      el.classList.remove('watermark');
    });
    document.querySelectorAll('.score').forEach(el => {
      el.style = bg;
    });
  } else if (isNpmSite(hostname)) {
    if (hostname === 'www.npmjs.com') hostname = hostname.replace('www.', '');
    const alinpmName = location.pathname.split('package')[1];
    const alinpmRegistry = `http://registry.${hostname}${alinpmName}`;
    const alinpmRegistryLatest = `http://registry.${hostname}${alinpmName}/latest`;
    const alinpmRepo =
      document.querySelectorAll('.pack-repo')[0] ||
      document.getElementById('top');
    if (alinpmRepo) {
      console.warn('npm registry appending target missing');
    }
    const aliRegistryLink = document.createElement('a');
    const aliRegistryLatestLink = document.createElement('a');
    aliRegistryLink.style.color = 'red';
    aliRegistryLink.style['font-weight'] = 'bold';
    aliRegistryLink.style.margin = '0 20px';
    aliRegistryLink.href = alinpmRegistry;
    aliRegistryLink.target = '_blank';
    aliRegistryLink.innerText = 'Registry';
    if (hostname === 'npmjs.com') {
      alinpmRepo && alinpmRepo.prepend(aliRegistryLink);
    } else {
      alinpmRepo && alinpmRepo.appendChild(aliRegistryLink);
    }
    aliRegistryLatestLink.style.color = 'red';
    aliRegistryLatestLink.style['font-weight'] = 'bold';
    aliRegistryLatestLink.href = alinpmRegistryLatest;
    aliRegistryLatestLink.target = '_blank';
    aliRegistryLatestLink.innerText = 'RegistryLatest';
    if (hostname === 'npmjs.com') {
      alinpmRepo && alinpmRepo.prepend(aliRegistryLatestLink);
    } else {
      alinpmRepo && alinpmRepo.appendChild(aliRegistryLatestLink);
    }
  } else if (hostname.indexOf('google.com') > -1) {
    if (google && google.logUrl) {
      delete google.logUrl;
      log('delete google.logUrl');
    }
    // remove google redirect
    log("I'll hack google");
    const links = document.links;
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const attrs = [].slice.call(link.attributes);
      const toRemoveAttrs = [];
      attrs.forEach(attr => {
        if (
          attr.name.indexOf('data-') > -1 ||
          attr.name.indexOf('jsaction') > -1 ||
          attr.name.indexOf('on') > -1
        ) {
          toRemoveAttrs.push(attr.name);
        }
      });
      toRemoveAttrs.forEach(name => {
        log(name, 'success');
        links[i].removeAttribute(name);
      });
    }
  } else if (hostname.indexOf('sandbox.alibaba-inc.com') > -1) {
    // custom midway-sandbox nsp report for weekly report
    if (location.hash.indexOf('nsp') > -1) {
      log('// generate weekly report');
      customNspTable();
    }
    if (location.href.indexOf('footer') > -1) {
      return;
    }
    injectNspLink();
    injectAnimateCss(function() {
      const s = document.querySelector('#sandboxNspLink');
      s.classList.add('animated');
      s.classList.add('infinite');
      s.classList.add('pulse');
      s.onmouseenter = function() {
        s.classList.remove('infinite');
      };
      s.onmouseleave = function() {
        s.classList.add('infinite');
      };
    });
  } else if (hostname.indexOf('zhihu.com') > -1) {
    const links2 = document.querySelectorAll('a');
    [].slice.call(links2).forEach(link => {
      if (link.href.indexOf('link.zhihu.com') > -1) {
        link.setAttribute(
          'href',
          decodeURIComponent(link.href.split('target=')[1])
        );
        log('replace zhihu link:' + link, 'success');
      }
    });
    setInterval(function() {
      log('scan zhihu script');
      let scripts = document.querySelectorAll('script');
      scripts = [].slice.call(scripts);
      scripts.forEach(script => {
        if (
          script.src.indexOf('raven') > -1 ||
          script.src.indexOf('za-js-sdk') > -1
        ) {
          script.remove();
          log('fuck zhihu:' + script.src, 'error');
        }
      });
    }, 3000);
  } else if (hostname.indexOf('risingstack.com') > -1) {
    [].slice.call(document.querySelectorAll('.click-to-tweet')).forEach(el => {
      el.remove();
    });
    [].slice
      .call(document.querySelectorAll('.trace-in-text-cta'))
      .forEach(el => {
        el.remove();
      });
    [].slice
      .call(document.querySelectorAll('.click-to-tweet-text'))
      .forEach(el => {
        el.remove();
      });
  } else if (hostname.indexOf('sitepoint') > -1) {
    // close modal
    document.querySelector('.close-reveal-modal').click();
    [].slice.call(document.querySelectorAll('.widget')).forEach(w => {
      w.remove();
    });
  } else if (hostname.indexOf('local.yh.daily.taobao.ne') > -1) {
    // TODO: inject arbitrary test data
  } else {
    // Do something else.
  }
})();

const scripts = {
  rxjs: 'https://cdn.bootcss.com/rxjs/5.5.8/Rx.min.js',
};

function inject(s) {
  const scr = document.createElement('script');
  scr.src = scripts[s] || s;
  document.head.appendChild(scr);
}

window.inject = inject;

function tabTitle() {
  const OriginTitile = document.title;
  let titleTime;
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      document.title = '死鬼去哪里了！';
      clearTimeout(titleTime);
    } else {
      document.title = '(つェ⊂)咦!又好了!';
      titleTime = setTimeout(function() {
        document.title = OriginTitile;
      }, 2000);
    }
  });
}

// add style to document
function addStyle(s) {
  const el = document.createElement('style');
  el.textContent = s;
  el.id = `${parseInt(new Date().getTime(), 32)}`;
  document.head.appendChild(el);
  return el.id;
}

// patch octotree toggle style with githubWideStyle
// check if octotree is toggled
function isOctoTreeOpen() {
  return document.querySelector('html').classList.contains('octotree-show');
}

function getOctoTreeWidth() {
  const c = document.querySelector('.octotree_github_sidebar');
  if (c) return c.getBoundingClientRect().width;
  return 0;
}

function currentDocWidth() {
  // NOTE: difference between clientWidth, scrollWidth, offsetWidth
  return document.querySelector('html').getBoundingClientRect().width;
}

let githubWideStylId = [];

if (
  location.hostname.indexOf('github.com') > -1 &&
  location.href !== 'https://github.com' &&
  location.href !== -'https://github.com/'
) {
  // NOTE: opt-in for the new github dashboard style
  dynamicWidthGithub();
  logger(`githubWideStylId: ${githubWideStylId}`);
}

function makeLinkOpenNew() {
  let base = document.getElementsByTagName('base');
  if (base.length === 0) {
    base = document.createElement('base');
    base.setAttribute('target', '_blank');
    document.head.appendChild(base);
  }
}

window.makeLinkOpenNew = makeLinkOpenNew;

// dynamically detect if an element exist
function available(el, cb) {
  const id = setInterval(function() {
    if (document.querySelector(el)) {
      clearInterval(id);
      cb();
    }
  }, 1000);
}

function dynamicWidthGithub() {
  if (
    location.href === 'https://github.com/' ||
    location.href === 'https://github.com'
  ) { return; }
  let s;
  if (document.querySelector('html').classList.contains('octotree-show')) {
    logger(`octotree-show with styleId: ${githubWideStylId}`);
    githubWideStylId.forEach(id => {
      document.getElementById(id).remove();
    });
    githubWideStylId = [];
  } else {
    logger('octotree-hidden');
    githubWideStylId.push(addGithubWidthStyle());
  }
}

available('.octotree_sidebar', function() {
  logger('found octotree sidebar');
  dynamicWidthGithub();
  document
    .querySelector('.octotree_sidebar')
    .addEventListener('click', function() {
      logger('.octotree_sidebar clicked');
      dynamicWidthGithub();
    });
});

function addGithubWidthStyle() {
  // https://raw.githubusercontent.com/mdo/github-wide/master/github-wide.css
  // github-wide style
  const githubWideStyle = `
    .container {
      width: 100% !important;
      padding-left: 30px !important;
      padding-right: 30px !important;
    }

    /* Repo Next layout */

    .repository-content {
      width: 100% !important;
    }

    .repository-with-sidebar {
      padding-right: 60px !important;
    }

    .repository-with-sidebar .repository-sidebar {
      margin-right: -60px !important;
    }

    .summary-stats,
    .authors-and-code {
      display: table;
      width: 100%;
    }

    .summary-stats li {
      width: 25%;
    }

    .authors-and-code .section {
      width: 50%;
    }

    /* Repo Next Code page */

    .with-full-navigation {
      padding-right: 190px !important;
    }

    .with-full-navigation .repository-sidebar {
      margin-right: -190px !important;
    }

    /* Issues/PRs */

    .discussion-sidebar {
      width: 220px !important;
    }

    .discussion-timeline {
      width: calc(100% - 240px) !important;
    }

    /* Fix #18 - props: @auscompgeek */
    .file-header::after {
      clear: left !important;
    }

    /* New issues and Dashboard */

    #dashboard,
    .new-issue-form {
      position: relative !important;
    }

    .dashboard-sidebar,
    .new-issue-form .discussion-sidebar {
      position: absolute !important;
      top: 0 !important;
      right: 0 !important;
    }

    button.discussion-sidebar-toggle {
      width: 100% !important;
    }

    .timeline-new-comment {
      max-width: none !important;
    }

    /* Dashboard */
    /* Note that this won't be needed if we actually flipped the DOM order around. */

    .news {
      float: none !important;
      margin-right: 360px !important;
    }

    /* Settings */
    /* This should be refactored to use our grid.scss styles anyway, thus negating these styles. */

    .settings-content,
    .repo-settings-content {
      float: none !important;
      width: auto !important;
      overflow: auto !important; /* required to clear the floats that the float avoided */
    }
    .container > .settings-content,
    .repo-settings-content {
      margin-left: 260px !important;
    }

    #repo-settings .menu-container {
      width: 240px !important;
    }

    #js-flash-container .flash-messages {
      width: 100% !important;
      padding-left: 30px !important;
      padding-right: 30px !important;
    }

    /* Profile page */

    /* Profile avatar tooltip */
    .u-photo .avatar {
      width: 230px !important;
    }

    /* Commits: extended message under "..." */
    .commit-desc pre {
      max-width: none;
    }
  `;
  return addStyle(githubWideStyle);
}

// disturbing ugly character display of chinese character '门'
// in default Firefox font display
if (navigator.userAgent.match(/Firefox/)) {
  addStyle(`
*,
body {
  font-family: "SauceCodePro Font", "Hack Nerd Font", "Helvetica Neue", Arial, "Hei", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", SimSun, Song, sans-serif !important
}
`);
}

if (location.hostname === 'xkctk.hangzhou.gov.cn') {
  setInterval(() => {
    // stupid constraint
    /* global validCodeCount */
    /* eslint-disable no-native-reassign */
    validCodeCount = 0;
    /* eslint-enable no-native-reassign */
  }, 1000);
}

/**
 * @param {String} tag -- tag name
 * @param {String} attr -- attribute name
 * @param {String} match -- /[*$^]/i
 *  ref: https://www.w3.org/TR/selectors/#attribute-substrings
 * @param {String} value -- attribute value
 * @return {DOMEElement} -- HTML DOM Element
 */
function queryByAttr(tag, attr, match, value) {
  const q = `${tag || '*'}[${attr || 'class'}${match || '*'}="${value}"]`;
  const els = document.querySelectorAll(q);
  if (els.length > 0) {
    logger(`queryByAttr: ${q}`, 'warn');
  }
  return els;
}

function removeAdElements() {
  const adElements = [
    {
      attr: 'class',
      value: 'ad-widget',
      match: '^',
    },
    {
      tag: 'iframe',
      attr: 'src',
      value: '//pos.baidu.com',
    },
    {
      attr: 'class',
      value: 'content_r_ad',
    },
    {
      attr: 'class',
      value: 'sinaad-toolkit-box'
    },
    {
      attr: 'class',
      value: 'sinaads',
      match: '*'
    },
    {
      attr: 'class',
      value: '_ads',
      match: '*'
    },
    {
      attr: 'class',
      value: '-ads',
      match: '*'
    },
    {
      attr: 'class',
      value: 'ad_',
      match: '^'
    },
    {
      attr: 'class',
      value: 'sinaAD',
      match: '^'
    },
    {
      value: 'zhitou',
    },
    {
      value: 'ad_edu_list'
    },
    {
      value: 'godA',
    },
    {
      value: 'godR',
    },
    {
      value: 'god-cut'
    },
    {
      value: 'god-main'
    },
    {
      value: 'god-column'
    }
  ];
  adElements.forEach(el => {
    const { tag, attr, match, value } = el;
    const els = queryByAttr(tag, attr, match, value);
    if (els.length) els.forEach(el => el.remove());
  });
}

removeAdElements();
fuckAdScript(stupidScripts);

setInterval(function() {
  removeAdElements();
  fuckAdScript(stupidScripts);
}, 3000);

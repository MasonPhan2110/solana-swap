(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 5301:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(1644);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 1644:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ pages; }
});

// EXTERNAL MODULE: ./node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(5893);
// EXTERNAL MODULE: ./node_modules/next/head.js
var head = __webpack_require__(9008);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/regenerator-runtime/runtime.js
var runtime = __webpack_require__(4051);
var runtime_default = /*#__PURE__*/__webpack_require__.n(runtime);
// EXTERNAL MODULE: ./node_modules/react/index.js
var react = __webpack_require__(7294);
// EXTERNAL MODULE: ./node_modules/@solana/wallet-adapter-react-ui/lib/index.js + 11 modules
var lib = __webpack_require__(7843);
// EXTERNAL MODULE: ./node_modules/@solana/wallet-adapter-react/lib/useAnchorWallet.js
var useAnchorWallet = __webpack_require__(8877);
;// CONCATENATED MODULE: ./src/components/Loader.tsx

var Loader = function(param) {
    var _text = param.text, text = _text === void 0 ? "Loading..." : _text, _noText = param.noText, noText = _noText === void 0 ? false : _noText;
    return(/*#__PURE__*/ _jsxs("div", {
        className: "flex flex-col justify-center items-center text-xl font-light",
        children: [
            /*#__PURE__*/ _jsxs("svg", {
                className: "animate-spin h-8 w-8 text-white",
                xmlns: "http://www.w3.org/2000/svg",
                fill: "white",
                viewBox: "0 0 24 24",
                children: [
                    /*#__PURE__*/ _jsx("circle", {
                        className: "opacity-5",
                        cx: "12",
                        cy: "12",
                        r: "10",
                        stroke: "currentColor",
                        strokeWidth: "4"
                    }),
                    /*#__PURE__*/ _jsx("path", {
                        className: "opacity-75",
                        fill: "currentColor",
                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    })
                ]
            }),
            " ",
            !noText ? /*#__PURE__*/ _jsx("div", {
                className: "opacity-50 mt-4",
                children: text
            }) : null
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/SolanaLogo.tsx

var SolanaLogo = function() {
    /*#__PURE__*/ return (0,jsx_runtime.jsxs)("svg", {
        width: "46",
        height: "35",
        xmlns: "http://www.w3.org/2000/svg",
        className: "inline",
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("defs", {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("linearGradient", {
                        x1: "90.737%",
                        y1: "34.776%",
                        x2: "35.509%",
                        y2: "55.415%",
                        id: "a",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("stop", {
                                stopColor: "#00FFA3",
                                offset: "0%"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("stop", {
                                stopColor: "#DC1FFF",
                                offset: "100%"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("linearGradient", {
                        x1: "66.588%",
                        y1: "43.8%",
                        x2: "11.36%",
                        y2: "64.439%",
                        id: "b",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("stop", {
                                stopColor: "#00FFA3",
                                offset: "0%"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("stop", {
                                stopColor: "#DC1FFF",
                                offset: "100%"
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("linearGradient", {
                        x1: "78.586%",
                        y1: "39.317%",
                        x2: "23.358%",
                        y2: "59.956%",
                        id: "c",
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("stop", {
                                stopColor: "#00FFA3",
                                offset: "0%"
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)("stop", {
                                stopColor: "#DC1FFF",
                                offset: "100%"
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("g", {
                fillRule: "nonzero",
                fill: "none",
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M7.256 26.713c.27-.27.64-.427 1.033-.427h35.64a.73.73 0 0 1 .517 1.247l-7.04 7.04c-.27.27-.64.427-1.034.427H.732a.73.73 0 0 1-.516-1.246l7.04-7.04Z",
                        fill: "url(#a)",
                        transform: "translate(.98)"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M7.256.427C7.536.157 7.907 0 8.289 0h35.64a.73.73 0 0 1 .517 1.246l-7.04 7.04c-.27.27-.64.428-1.034.428H.732a.73.73 0 0 1-.516-1.247l7.04-7.04Z",
                        fill: "url(#b)",
                        transform: "translate(.98)"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("path", {
                        d: "M37.405 13.486c-.27-.27-.64-.427-1.033-.427H.732a.73.73 0 0 0-.516 1.246l7.04 7.04c.27.27.64.428 1.033.428h35.64a.73.73 0 0 0 .517-1.247l-7.04-7.04Z",
                        fill: "url(#c)",
                        transform: "translate(.98)"
                    })
                ]
            })
        ]
    });
};

// EXTERNAL MODULE: ./node_modules/@solana/wallet-adapter-react/lib/useWallet.js
var useWallet = __webpack_require__(7257);
;// CONCATENATED MODULE: ./src/components/SelectAndConnectWalletButton.tsx




var SelectAndConnectWalletButton = function(param) {
    var onUseWalletClick = param.onUseWalletClick;
    var setVisible = (0,lib/* useWalletModal */.hB)().setVisible;
    var ref = (0,useWallet/* useWallet */.O)(), wallet = ref.wallet, connect = ref.connect, connecting = ref.connecting, publicKey = ref.publicKey;
    (0,react.useEffect)(function() {
        if (!publicKey && wallet) {
            try {
                connect();
            } catch (error) {
                console.log("Error connecting to the wallet: ", error.message);
            }
        }
    }, [
        wallet
    ]);
    var handleWalletClick = function() {
        try {
            if (!wallet) {
                setVisible(true);
            } else {
                connect();
            }
            onUseWalletClick();
        } catch (error) {
            console.log("Error connecting to the wallet: ", error.message);
        }
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
        className: "btn btn-primary btn-lg",
        onClick: handleWalletClick,
        disabled: connecting,
        children: publicKey ? /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Use Wallet Address"
        }) : /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            children: "Connect Wallet"
        })
    }));
};

;// CONCATENATED MODULE: ./src/components/index.tsx




// EXTERNAL MODULE: ./node_modules/@project-serum/anchor/dist/browser/index.js
var browser = __webpack_require__(4758);
// EXTERNAL MODULE: ./src/views/SolanaSwapView/index.module.css
var index_module = __webpack_require__(9246);
var index_module_default = /*#__PURE__*/__webpack_require__.n(index_module);
// EXTERNAL MODULE: ./node_modules/@solana/spl-token/lib/esm/state/mint.js + 8 modules
var mint = __webpack_require__(6413);
// EXTERNAL MODULE: ./node_modules/@solana/spl-token/lib/esm/constants.js
var constants = __webpack_require__(8467);
;// CONCATENATED MODULE: ./src/views/SolanaSwapView/data.ts
var env = {
    "swap_token": "5XzHzDAodUPDsXsXGHUJby7U3Ydepu5Ufd65hPece3vw"
};

;// CONCATENATED MODULE: ./src/views/SolanaSwapView/swap.ts




function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
var tokenMint = new browser/* web3.PublicKey */.rV.PublicKey(env.swap_token);
var CONTROLLER_SEED = "controller";
var ESCROW_SEED = "escrow";
var getAtaAccount = function() {
    var _ref = _asyncToGenerator(runtime_default().mark(function _callee(wallet) {
        var userAssociatedTokenAccount;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    _ctx.next = 2;
                    return mint/* getAssociatedTokenAddress */.Am(tokenMint, wallet);
                case 2:
                    userAssociatedTokenAccount = _ctx.sent;
                    return _ctx.abrupt("return", userAssociatedTokenAccount);
                case 4:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function getAtaAccount(wallet) {
        return _ref.apply(this, arguments);
    };
}();
var getControllerPDA = function() {
    var _ref = _asyncToGenerator(runtime_default().mark(function _callee(program) {
        var ref, pda, bump;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ref = _slicedToArray(browser/* web3.PublicKey.findProgramAddressSync */.rV.PublicKey.findProgramAddressSync([
                        browser/* utils.bytes.utf8.encode */.P6.bytes.utf8.encode(CONTROLLER_SEED), 
                    ], program.programId), 2), pda = ref[0], bump = ref[1];
                    return _ctx.abrupt("return", {
                        key: pda,
                        bump: bump
                    });
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function getControllerPDA(program) {
        return _ref.apply(this, arguments);
    };
}();
var getEscrowPDA = function() {
    var _ref = _asyncToGenerator(runtime_default().mark(function _callee(program) {
        var ref, pda, bump;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    ref = _slicedToArray(browser/* web3.PublicKey.findProgramAddressSync */.rV.PublicKey.findProgramAddressSync([
                        browser/* utils.bytes.utf8.encode */.P6.bytes.utf8.encode(ESCROW_SEED)
                    ], program.programId), 2), pda = ref[0], bump = ref[1];
                    return _ctx.abrupt("return", {
                        key: pda,
                        bump: bump
                    });
                case 2:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function getEscrowPDA(program) {
        return _ref.apply(this, arguments);
    };
}();
var buy_move = function() {
    var _ref = _asyncToGenerator(runtime_default().mark(function _callee(param) {
        var program, wallet, amount, controllerPDA, escrowPDA, userTokenAccount, result;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    program = param.program, wallet = param.wallet, amount = param.amount;
                    _ctx.next = 3;
                    return getControllerPDA(program);
                case 3:
                    controllerPDA = _ctx.sent;
                    _ctx.next = 6;
                    return getEscrowPDA(program);
                case 6:
                    escrowPDA = _ctx.sent;
                    _ctx.next = 9;
                    return getAtaAccount(wallet.publicKey);
                case 9:
                    userTokenAccount = _ctx.sent;
                    console.log(wallet);
                    console.log(amount);
                    console.log("Program id: ".concat(program.programId.toBase58()));
                    _ctx.next = 15;
                    return program.methods.buyMove(amount).accounts({
                        user: wallet.publicKey,
                        tokenMint: tokenMint,
                        controller: controllerPDA.key,
                        escrow: escrowPDA.key,
                        userTokenAccount: userTokenAccount,
                        systemProgram: browser/* web3.SystemProgram.programId */.rV.SystemProgram.programId,
                        rent: browser/* web3.SYSVAR_RENT_PUBKEY */.rV.SYSVAR_RENT_PUBKEY,
                        tokenProgram: constants/* TOKEN_PROGRAM_ID */.H_,
                        associatedTokenProgram: constants/* ASSOCIATED_TOKEN_PROGRAM_ID */._u
                    }).signers([]).rpc();
                case 15:
                    result = _ctx.sent;
                    return _ctx.abrupt("return", result);
                case 17:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function buy_move(_) {
        return _ref.apply(this, arguments);
    };
}();
var sell_move = function() {
    var _ref = _asyncToGenerator(runtime_default().mark(function _callee(param) {
        var program, wallet, amount, controllerPDA, escrowPDA, userTokenAccount, result;
        return runtime_default().wrap(function _callee$(_ctx) {
            while(1)switch(_ctx.prev = _ctx.next){
                case 0:
                    program = param.program, wallet = param.wallet, amount = param.amount;
                    _ctx.next = 3;
                    return getControllerPDA(program);
                case 3:
                    controllerPDA = _ctx.sent;
                    _ctx.next = 6;
                    return getEscrowPDA(program);
                case 6:
                    escrowPDA = _ctx.sent;
                    _ctx.next = 9;
                    return getAtaAccount(wallet.publicKey);
                case 9:
                    userTokenAccount = _ctx.sent;
                    console.log(wallet);
                    console.log(amount);
                    console.log("User Token Account: ".concat(userTokenAccount.toString()));
                    console.log("escrowPDA: ".concat(escrowPDA.key.toString()));
                    console.log("controllerPDA: ".concat(controllerPDA.key.toString()));
                    console.log("Program id: ".concat(program.programId.toBase58()));
                    _ctx.next = 18;
                    return program.methods.sellMove(amount).accounts({
                        user: wallet.publicKey,
                        tokenMint: tokenMint,
                        controller: controllerPDA.key,
                        escrow: escrowPDA.key,
                        userTokenAccount: userTokenAccount,
                        systemProgram: browser/* web3.SystemProgram.programId */.rV.SystemProgram.programId,
                        tokenProgram: constants/* TOKEN_PROGRAM_ID */.H_,
                        associatedTokenProgram: constants/* ASSOCIATED_TOKEN_PROGRAM_ID */._u
                    }).signers([]).rpc();
                case 18:
                    result = _ctx.sent;
                    return _ctx.abrupt("return", result);
                case 20:
                case "end":
                    return _ctx.stop();
            }
        }, _callee);
    }));
    return function sell_move(_) {
        return _ref.apply(this, arguments);
    };
}();

// EXTERNAL MODULE: ./node_modules/@solana/web3.js/lib/index.browser.esm.js + 20 modules
var index_browser_esm = __webpack_require__(1208);
;// CONCATENATED MODULE: ./src/views/SolanaSwapView/solana-dapp.json
var solana_dapp_namespaceObject = JSON.parse('{"Pu":{"L":"D4sU4y71tzBCYBeybADxfdowHNMw88txNM1cVxyPy5Qt"}}');
;// CONCATENATED MODULE: ./src/views/SolanaSwapView/solana_swap.ts
var IDL = {
    "version": "0.1.0",
    "name": "solana_swap",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "controller",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "escrow",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "signer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "movePerSol",
                    "type": "u8"
                },
                {
                    "name": "decimal",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "buyMove",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "controller",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "escrow",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "rent",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "sellMove",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "controller",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "escrow",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "depositLiquidity",
            "accounts": [
                {
                    "name": "authorizer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "controller",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "escrow",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "removeLiquidity",
            "accounts": [
                {
                    "name": "authorizer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "tokenMint",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "controller",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "escrow",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userTokenAccount",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "tokenProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "associatedTokenProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "amount",
                    "type": "u64"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "controller",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "authorizer",
                        "type": "publicKey"
                    },
                    {
                        "name": "movePerSol",
                        "type": "u8"
                    },
                    {
                        "name": "decimal",
                        "type": "u8"
                    },
                    {
                        "name": "token0Amount",
                        "type": "u64"
                    },
                    {
                        "name": "token1Amount",
                        "type": "u64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "escrowBump",
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "InvalidPrice"
        },
        {
            "code": 6001,
            "name": "InvalidID"
        },
        {
            "code": 6002,
            "name": "InsufficientFund"
        }
    ]
};

;// CONCATENATED MODULE: ./src/views/SolanaSwapView/useProgram.ts





var useProgram = function(param) {
    var connection = param.connection, wallet = param.wallet;
    var ref = (0,react.useState)(), program1 = ref[0], setProgram = ref[1];
    (0,react.useEffect)(function() {
        updateProgram();
        console.log(program1);
    }, [
        connection,
        wallet
    ]);
    var updateProgram = function() {
        var provider = new browser/* AnchorProvider */.Y7(connection, wallet, {
            preflightCommitment: "recent",
            commitment: "processed"
        });
        console.log("provider", provider);
        var idl = IDL;
        //   const idl = await anchor.Program.fetchIdl(programID, provider);
        //   console.log("idl", idl);
        var programID = new index_browser_esm.PublicKey(solana_dapp_namespaceObject.Pu.L);
        var program = new browser/* Program */.$r(idl, programID, provider);
        setProgram(program);
    };
    return {
        program: program1
    };
};

;// CONCATENATED MODULE: ./src/views/SolanaSwapView/index.tsx











function SolanaSwapView_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function SolanaSwapView_asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                SolanaSwapView_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                SolanaSwapView_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _throw(e) {
    throw e;
}
var endpoint = "https://explorer-api.devnet.solana.com";
var connection = new browser/* web3.Connection */.rV.Connection(endpoint);
var SolanaSwapView = function(param) {
    var param = param !== null ? param : _throw(new TypeError("Cannot destructure undefined"));
    var wallet = (0,useAnchorWallet/* useAnchorWallet */.z)();
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "container mx-auto max-w-6xl p-8 2xl:px-0",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: (index_module_default()).container,
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: "navbar mb-2 text-neutral-content rounded-box",
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "flex-none",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                                className: "btn btn-square btn-ghost",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                                    className: "text-4xl",
                                    children: "🌝"
                                })
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "flex-1 px-2 mx-2",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                className: "text-sm breadcrumbs",
                                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("ul", {
                                    className: "text-xl"
                                })
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "flex-none",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)(lib/* WalletMultiButton */.aD, {
                                className: "btn btn-ghost"
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: "text-center pt-2",
                    children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                        className: "hero min-h-16 pt-4",
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                            className: "text-center hero-content",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                                className: "max-w-[800px]",
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("h1", {
                                        className: "mb-5 text-5xl",
                                        children: [
                                            "Swap between SOL and MOVE ",
                                            /*#__PURE__*/ (0,jsx_runtime.jsx)(SolanaLogo, {})
                                        ]
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("p", {
                                        children: "1 SOL = 10 MOVE"
                                    })
                                ]
                            })
                        })
                    })
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: "flex justify-center",
                    children: !wallet ? /*#__PURE__*/ (0,jsx_runtime.jsx)(SelectAndConnectWalletButton, {
                        onUseWalletClick: function() {}
                    }) : /*#__PURE__*/ (0,jsx_runtime.jsx)(SwapScreen, {})
                })
            ]
        })
    }));
};
var SwapScreen = function() {
    var wallet = (0,useAnchorWallet/* useAnchorWallet */.z)();
    var ref = (0,react.useState)([]), swaps = ref[0], setSwaps = ref[1];
    var program = useProgram({
        connection: connection,
        wallet: wallet
    }).program;
    var ref1 = (0,react.useState)(), lastUpdatedTime = ref1[0], setLastUpdatedTime = ref1[1];
    (0,react.useEffect)(function() {}, [
        wallet,
        lastUpdatedTime
    ]);
    var onSwapSent = function(swapEvent) {
        setSwaps(function(prevState) {
            return _objectSpread({}, prevState, {
                swapEvent: swapEvent
            });
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        className: "rounded-lg flex justify-center",
        children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
            className: "flex flex-col items-center justify-center",
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                className: "text-xs",
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(NetSwap, {
                    onSwapSent: onSwapSent
                })
            })
        })
    }));
};
var NetSwap = function(param) {
    var onSwapSent = param.onSwapSent;
    var isNumeric = // console.log(value)
    function isNumeric(value) {
        return /^[0-9]{0,9}(\.[0-9]{1,2})?$/.test(value);
    };
    var wallet = (0,useAnchorWallet/* useAnchorWallet */.z)();
    var program = useProgram({
        connection: connection,
        wallet: wallet
    }).program;
    var ref = (0,react.useState)(true), isBuyMove = ref[0], setIsBuyMove = ref[1];
    var ref2 = (0,react.useState)(0), amount = ref2[0], setAmount = ref2[1];
    var ref3 = (0,react.useState)(0), swapAmount = ref3[0], setSwapAmount = ref3[1];
    // const [value, setValue] = useState<any>(0)
    // const onContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //   const { value } = e.target;
    //   if (value) {
    //     setContent(value);
    //   }
    // };
    var onSwapClick = function() {
        var _ref = SolanaSwapView_asyncToGenerator(runtime_default().mark(function _callee() {
            var value, result;
            return runtime_default().wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        if (program) {
                            _ctx.next = 2;
                            break;
                        }
                        return _ctx.abrupt("return");
                    case 2:
                        ;
                        ;
                        if (!isBuyMove) {
                            _ctx.next = 11;
                            break;
                        }
                        value = new browser.BN(Number(amount) * Math.pow(10, 9));
                        _ctx.next = 8;
                        return buy_move({
                            program: program,
                            wallet: wallet,
                            amount: value
                        });
                    case 8:
                        result = _ctx.sent;
                        _ctx.next = 15;
                        break;
                    case 11:
                        value = new browser.BN(Number(amount) * Math.pow(10, 6));
                        _ctx.next = 14;
                        return sell_move({
                            program: program,
                            wallet: wallet,
                            amount: value
                        });
                    case 14:
                        result = _ctx.sent;
                    case 15:
                        console.log("New swap transaction succeeded: ", result);
                        setSwapAmount("");
                        setAmount("");
                        onSwapSent(result);
                    case 19:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }));
        return function onSwapClick() {
            return _ref.apply(this, arguments);
        };
    }();
    var onChangeClick = function() {
        setIsBuyMove(!isBuyMove);
        setSwapAmount("");
        setAmount("");
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        style: {
            minWidth: 240
        },
        className: "mb-8 pb-4 border-b border-gray-500 flex ",
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
            className: "w-full flex flex-col items-center ",
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                    value: amount == 0 ? "" : amount,
                    onChange: function(e) {
                        var value = e.target.value;
                        console.log(value);
                        setAmount(value);
                        if (isBuyMove) {
                            setSwapAmount(Number(value) * 10);
                        } else {
                            setSwapAmount(Number(value) / 10);
                        }
                    },
                    placeholder: isBuyMove ? "Enter the SOL amount" : "Enter the MOVE amount",
                    className: "mb-4"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                    className: "btn btn-primary rounded-full normal-case",
                    onClick: onChangeClick,
                    style: {
                        minHeight: 0,
                        marginBottom: 15,
                        fontSize: 20
                    },
                    children: "↓"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("input", {
                    value: amount == 0 ? "" : swapAmount,
                    disabled: true,
                    placeholder: isBuyMove ? "MOVE amount" : "SOL amount",
                    className: "mb-4"
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)("button", {
                    className: "btn btn-primary rounded-full normal-case w-full",
                    onClick: onSwapClick,
                    style: {
                        minHeight: 0,
                        height: 40
                    },
                    children: "Swap"
                })
            ]
        })
    }));
};

;// CONCATENATED MODULE: ./src/views/index.tsx


;// CONCATENATED MODULE: ./src/pages/index.tsx



var Home = function(props) {
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(head["default"], {
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("title", {
                        children: " Swapper!"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("meta", {
                        name: "description",
                        content: "A demo site for Remi"
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)(SolanaSwapView, {})
        ]
    }));
};
/* harmony default export */ var pages = (Home);


/***/ }),

/***/ 9246:
/***/ (function() {

// extracted by mini-css-extract-plugin

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [655,541,843,342,774,888,179], function() { return __webpack_exec__(5301); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);
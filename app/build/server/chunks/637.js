exports.id = 637;
exports.ids = [637];
exports.modules = {

/***/ 638:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
__webpack_unused_export__ = noSSR;
exports["default"] = dynamic;
var _react = _interopRequireDefault(__webpack_require__(689));
var _loadable = _interopRequireDefault(__webpack_require__(832));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const isServerSide = "undefined" === 'undefined';
function noSSR(LoadableInitializer, loadableOptions) {
    // Removing webpack and modules means react-loadable won't try preloading
    delete loadableOptions.webpack;
    delete loadableOptions.modules;
    // This check is necessary to prevent react-loadable from initializing on the server
    if (!isServerSide) {
        return LoadableInitializer(loadableOptions);
    }
    const Loading = loadableOptions.loading;
    // This will only be rendered on the server side
    return ()=>/*#__PURE__*/ _react.default.createElement(Loading, {
            error: null,
            isLoading: true,
            pastDelay: false,
            timedOut: false
        })
    ;
}
function dynamic(dynamicOptions, options) {
    let loadableFn = _loadable.default;
    let loadableOptions = {
        // A loading component is not required, so we default it
        loading: ({ error , isLoading , pastDelay  })=>{
            if (!pastDelay) return null;
            if (false) {}
            return null;
        }
    };
    // Support for direct import(), eg: dynamic(import('../hello-world'))
    // Note that this is only kept for the edge case where someone is passing in a promise as first argument
    // The react-loadable babel plugin will turn dynamic(import('../hello-world')) into dynamic(() => import('../hello-world'))
    // To make sure we don't execute the import without rendering first
    if (dynamicOptions instanceof Promise) {
        loadableOptions.loader = ()=>dynamicOptions
        ;
    // Support for having import as a function, eg: dynamic(() => import('../hello-world'))
    } else if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    // Support for having first argument being options, eg: dynamic({loader: import('../hello-world')})
    } else if (typeof dynamicOptions === 'object') {
        loadableOptions = {
            ...loadableOptions,
            ...dynamicOptions
        };
    }
    // Support for passing options, eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
    loadableOptions = {
        ...loadableOptions,
        ...options
    };
    const suspenseOptions = loadableOptions;
    if (true) {
        // Error if react root is not enabled and `suspense` option is set to true
        if ( true && suspenseOptions.suspense) {
            // TODO: add error doc when this feature is stable
            throw new Error(`Invalid suspense option usage in next/dynamic. Read more: https://nextjs.org/docs/messages/invalid-dynamic-suspense`);
        }
    }
    if (suspenseOptions.suspense) {
        return loadableFn(suspenseOptions);
    }
    // coming from build/babel/plugins/react-loadable-plugin.js
    if (loadableOptions.loadableGenerated) {
        loadableOptions = {
            ...loadableOptions,
            ...loadableOptions.loadableGenerated
        };
        delete loadableOptions.loadableGenerated;
    }
    // support for disabling server side rendering, eg: dynamic(import('../hello-world'), {ssr: false})
    if (typeof loadableOptions.ssr === 'boolean') {
        if (!loadableOptions.ssr) {
            delete loadableOptions.ssr;
            return noSSR(loadableFn, loadableOptions);
        }
        delete loadableOptions.ssr;
    }
    return loadableFn(loadableOptions);
} //# sourceMappingURL=dynamic.js.map


/***/ }),

/***/ 758:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "U": () => (/* binding */ ConnectionProvider)
});

// EXTERNAL MODULE: external "@solana/web3.js"
var web3_js_ = __webpack_require__(831);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: ./node_modules/@solana/wallet-adapter-react/lib/useConnection.js

const ConnectionContext = /*#__PURE__*/ (0,external_react_.createContext)({});
function useConnection() {
    return useContext(ConnectionContext);
} //# sourceMappingURL=useConnection.js.map

;// CONCATENATED MODULE: ./node_modules/@solana/wallet-adapter-react/lib/ConnectionProvider.js



const ConnectionProvider = ({ children , endpoint , config ={
    commitment: 'confirmed'
} ,  })=>{
    const connection = (0,external_react_.useMemo)(()=>new web3_js_.Connection(endpoint, config)
    , [
        endpoint,
        config
    ]);
    return(/*#__PURE__*/ external_react_default().createElement(ConnectionContext.Provider, {
        value: {
            connection
        }
    }, children));
}; //# sourceMappingURL=ConnectionProvider.js.map


/***/ }),

/***/ 152:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(638)


/***/ })

};
;
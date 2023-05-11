(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[342],{

/***/ 5970:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(8764)["Buffer"];

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.map = exports.array = exports.rustEnum = exports.str = exports.vecU8 = exports.tagged = exports.vec = exports.bool = exports.option = exports.publicKey = exports.i256 = exports.u256 = exports.i128 = exports.u128 = exports.i64 = exports.u64 = exports.struct = exports.f64 = exports.f32 = exports.i32 = exports.u32 = exports.i16 = exports.u16 = exports.i8 = exports.u8 = void 0;
const buffer_layout_1 = __webpack_require__(698);
const web3_js_1 = __webpack_require__(1208);
const bn_js_1 = __importDefault(__webpack_require__(3550));
var buffer_layout_2 = __webpack_require__(698);
Object.defineProperty(exports, "u8", ({ enumerable: true, get: function () { return buffer_layout_2.u8; } }));
Object.defineProperty(exports, "i8", ({ enumerable: true, get: function () { return buffer_layout_2.s8; } }));
Object.defineProperty(exports, "u16", ({ enumerable: true, get: function () { return buffer_layout_2.u16; } }));
Object.defineProperty(exports, "i16", ({ enumerable: true, get: function () { return buffer_layout_2.s16; } }));
Object.defineProperty(exports, "u32", ({ enumerable: true, get: function () { return buffer_layout_2.u32; } }));
Object.defineProperty(exports, "i32", ({ enumerable: true, get: function () { return buffer_layout_2.s32; } }));
Object.defineProperty(exports, "f32", ({ enumerable: true, get: function () { return buffer_layout_2.f32; } }));
Object.defineProperty(exports, "f64", ({ enumerable: true, get: function () { return buffer_layout_2.f64; } }));
Object.defineProperty(exports, "struct", ({ enumerable: true, get: function () { return buffer_layout_2.struct; } }));
class BNLayout extends buffer_layout_1.Layout {
    constructor(span, signed, property) {
        super(span, property);
        this.blob = (0, buffer_layout_1.blob)(span);
        this.signed = signed;
    }
    decode(b, offset = 0) {
        const num = new bn_js_1.default(this.blob.decode(b, offset), 10, "le");
        if (this.signed) {
            return num.fromTwos(this.span * 8).clone();
        }
        return num;
    }
    encode(src, b, offset = 0) {
        if (this.signed) {
            src = src.toTwos(this.span * 8);
        }
        return this.blob.encode(src.toArrayLike(Buffer, "le", this.span), b, offset);
    }
}
function u64(property) {
    return new BNLayout(8, false, property);
}
exports.u64 = u64;
function i64(property) {
    return new BNLayout(8, true, property);
}
exports.i64 = i64;
function u128(property) {
    return new BNLayout(16, false, property);
}
exports.u128 = u128;
function i128(property) {
    return new BNLayout(16, true, property);
}
exports.i128 = i128;
function u256(property) {
    return new BNLayout(32, false, property);
}
exports.u256 = u256;
function i256(property) {
    return new BNLayout(32, true, property);
}
exports.i256 = i256;
class WrappedLayout extends buffer_layout_1.Layout {
    constructor(layout, decoder, encoder, property) {
        super(layout.span, property);
        this.layout = layout;
        this.decoder = decoder;
        this.encoder = encoder;
    }
    decode(b, offset) {
        return this.decoder(this.layout.decode(b, offset));
    }
    encode(src, b, offset) {
        return this.layout.encode(this.encoder(src), b, offset);
    }
    getSpan(b, offset) {
        return this.layout.getSpan(b, offset);
    }
}
function publicKey(property) {
    return new WrappedLayout((0, buffer_layout_1.blob)(32), (b) => new web3_js_1.PublicKey(b), (key) => key.toBuffer(), property);
}
exports.publicKey = publicKey;
class OptionLayout extends buffer_layout_1.Layout {
    constructor(layout, property) {
        super(-1, property);
        this.layout = layout;
        this.discriminator = (0, buffer_layout_1.u8)();
    }
    encode(src, b, offset = 0) {
        if (src === null || src === undefined) {
            return this.discriminator.encode(0, b, offset);
        }
        this.discriminator.encode(1, b, offset);
        return this.layout.encode(src, b, offset + 1) + 1;
    }
    decode(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return null;
        }
        else if (discriminator === 1) {
            return this.layout.decode(b, offset + 1);
        }
        throw new Error("Invalid option " + this.property);
    }
    getSpan(b, offset = 0) {
        const discriminator = this.discriminator.decode(b, offset);
        if (discriminator === 0) {
            return 1;
        }
        else if (discriminator === 1) {
            return this.layout.getSpan(b, offset + 1) + 1;
        }
        throw new Error("Invalid option " + this.property);
    }
}
function option(layout, property) {
    return new OptionLayout(layout, property);
}
exports.option = option;
function bool(property) {
    return new WrappedLayout((0, buffer_layout_1.u8)(), decodeBool, encodeBool, property);
}
exports.bool = bool;
function decodeBool(value) {
    if (value === 0) {
        return false;
    }
    else if (value === 1) {
        return true;
    }
    throw new Error("Invalid bool: " + value);
}
function encodeBool(value) {
    return value ? 1 : 0;
}
function vec(elementLayout, property) {
    const length = (0, buffer_layout_1.u32)("length");
    const layout = (0, buffer_layout_1.struct)([
        length,
        (0, buffer_layout_1.seq)(elementLayout, (0, buffer_layout_1.offset)(length, -length.span), "values"),
    ]);
    return new WrappedLayout(layout, ({ values }) => values, (values) => ({ values }), property);
}
exports.vec = vec;
function tagged(tag, layout, property) {
    const wrappedLayout = (0, buffer_layout_1.struct)([
        u64("tag"),
        layout.replicate("data"),
    ]);
    function decodeTag({ tag: receivedTag, data }) {
        if (!receivedTag.eq(tag)) {
            throw new Error("Invalid tag, expected: " +
                tag.toString("hex") +
                ", got: " +
                receivedTag.toString("hex"));
        }
        return data;
    }
    return new WrappedLayout(wrappedLayout, decodeTag, (data) => ({ tag, data }), property);
}
exports.tagged = tagged;
function vecU8(property) {
    const length = (0, buffer_layout_1.u32)("length");
    const layout = (0, buffer_layout_1.struct)([
        length,
        (0, buffer_layout_1.blob)((0, buffer_layout_1.offset)(length, -length.span), "data"),
    ]);
    return new WrappedLayout(layout, ({ data }) => data, (data) => ({ data }), property);
}
exports.vecU8 = vecU8;
function str(property) {
    return new WrappedLayout(vecU8(), (data) => data.toString("utf-8"), (s) => Buffer.from(s, "utf-8"), property);
}
exports.str = str;
function rustEnum(variants, property, discriminant) {
    const unionLayout = (0, buffer_layout_1.union)(discriminant !== null && discriminant !== void 0 ? discriminant : (0, buffer_layout_1.u8)(), property);
    variants.forEach((variant, index) => unionLayout.addVariant(index, variant, variant.property));
    return unionLayout;
}
exports.rustEnum = rustEnum;
function array(elementLayout, length, property) {
    const layout = (0, buffer_layout_1.struct)([
        (0, buffer_layout_1.seq)(elementLayout, length, "values"),
    ]);
    return new WrappedLayout(layout, ({ values }) => values, (values) => ({ values }), property);
}
exports.array = array;
class MapEntryLayout extends buffer_layout_1.Layout {
    constructor(keyLayout, valueLayout, property) {
        super(keyLayout.span + valueLayout.span, property);
        this.keyLayout = keyLayout;
        this.valueLayout = valueLayout;
    }
    decode(b, offset) {
        offset = offset || 0;
        const key = this.keyLayout.decode(b, offset);
        const value = this.valueLayout.decode(b, offset + this.keyLayout.getSpan(b, offset));
        return [key, value];
    }
    encode(src, b, offset) {
        offset = offset || 0;
        const keyBytes = this.keyLayout.encode(src[0], b, offset);
        const valueBytes = this.valueLayout.encode(src[1], b, offset + keyBytes);
        return keyBytes + valueBytes;
    }
    getSpan(b, offset) {
        return (this.keyLayout.getSpan(b, offset) + this.valueLayout.getSpan(b, offset));
    }
}
function map(keyLayout, valueLayout, property) {
    const length = (0, buffer_layout_1.u32)("length");
    const layout = (0, buffer_layout_1.struct)([
        length,
        (0, buffer_layout_1.seq)(new MapEntryLayout(keyLayout, valueLayout), (0, buffer_layout_1.offset)(length, -length.span), "values"),
    ]);
    return new WrappedLayout(layout, ({ values }) => new Map(values), (values) => ({ values: Array.from(values.entries()) }), property);
}
exports.map = map;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 698:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
/* provided dependency */ var Buffer = __webpack_require__(8764)["Buffer"];
/* The MIT License (MIT)
 *
 * Copyright 2015-2018 Peter A. Bigot
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Support for translating between Buffer instances and JavaScript
 * native types.
 *
 * {@link module:Layout~Layout|Layout} is the basis of a class
 * hierarchy that associates property names with sequences of encoded
 * bytes.
 *
 * Layouts are supported for these scalar (numeric) types:
 * * {@link module:Layout~UInt|Unsigned integers in little-endian
 *   format} with {@link module:Layout.u8|8-bit}, {@link
 *   module:Layout.u16|16-bit}, {@link module:Layout.u24|24-bit},
 *   {@link module:Layout.u32|32-bit}, {@link
 *   module:Layout.u40|40-bit}, and {@link module:Layout.u48|48-bit}
 *   representation ranges;
 * * {@link module:Layout~UIntBE|Unsigned integers in big-endian
 *   format} with {@link module:Layout.u16be|16-bit}, {@link
 *   module:Layout.u24be|24-bit}, {@link module:Layout.u32be|32-bit},
 *   {@link module:Layout.u40be|40-bit}, and {@link
 *   module:Layout.u48be|48-bit} representation ranges;
 * * {@link module:Layout~Int|Signed integers in little-endian
 *   format} with {@link module:Layout.s8|8-bit}, {@link
 *   module:Layout.s16|16-bit}, {@link module:Layout.s24|24-bit},
 *   {@link module:Layout.s32|32-bit}, {@link
 *   module:Layout.s40|40-bit}, and {@link module:Layout.s48|48-bit}
 *   representation ranges;
 * * {@link module:Layout~IntBE|Signed integers in big-endian format}
 *   with {@link module:Layout.s16be|16-bit}, {@link
 *   module:Layout.s24be|24-bit}, {@link module:Layout.s32be|32-bit},
 *   {@link module:Layout.s40be|40-bit}, and {@link
 *   module:Layout.s48be|48-bit} representation ranges;
 * * 64-bit integral values that decode to an exact (if magnitude is
 *   less than 2^53) or nearby integral Number in {@link
 *   module:Layout.nu64|unsigned little-endian}, {@link
 *   module:Layout.nu64be|unsigned big-endian}, {@link
 *   module:Layout.ns64|signed little-endian}, and {@link
 *   module:Layout.ns64be|unsigned big-endian} encodings;
 * * 32-bit floating point values with {@link
 *   module:Layout.f32|little-endian} and {@link
 *   module:Layout.f32be|big-endian} representations;
 * * 64-bit floating point values with {@link
 *   module:Layout.f64|little-endian} and {@link
 *   module:Layout.f64be|big-endian} representations;
 * * {@link module:Layout.const|Constants} that take no space in the
 *   encoded expression.
 *
 * and for these aggregate types:
 * * {@link module:Layout.seq|Sequence}s of instances of a {@link
 *   module:Layout~Layout|Layout}, with JavaScript representation as
 *   an Array and constant or data-dependent {@link
 *   module:Layout~Sequence#count|length};
 * * {@link module:Layout.struct|Structure}s that aggregate a
 *   heterogeneous sequence of {@link module:Layout~Layout|Layout}
 *   instances, with JavaScript representation as an Object;
 * * {@link module:Layout.union|Union}s that support multiple {@link
 *   module:Layout~VariantLayout|variant layouts} over a fixed
 *   (padded) or variable (not padded) span of bytes, using an
 *   unsigned integer at the start of the data or a separate {@link
 *   module:Layout.unionLayoutDiscriminator|layout element} to
 *   determine which layout to use when interpreting the buffer
 *   contents;
 * * {@link module:Layout.bits|BitStructure}s that contain a sequence
 *   of individual {@link
 *   module:Layout~BitStructure#addField|BitField}s packed into an 8,
 *   16, 24, or 32-bit unsigned integer starting at the least- or
 *   most-significant bit;
 * * {@link module:Layout.cstr|C strings} of varying length;
 * * {@link module:Layout.blob|Blobs} of fixed- or variable-{@link
 *   module:Layout~Blob#length|length} raw data.
 *
 * All {@link module:Layout~Layout|Layout} instances are immutable
 * after construction, to prevent internal state from becoming
 * inconsistent.
 *
 * @local Layout
 * @local ExternalLayout
 * @local GreedyCount
 * @local OffsetLayout
 * @local UInt
 * @local UIntBE
 * @local Int
 * @local IntBE
 * @local NearUInt64
 * @local NearUInt64BE
 * @local NearInt64
 * @local NearInt64BE
 * @local Float
 * @local FloatBE
 * @local Double
 * @local DoubleBE
 * @local Sequence
 * @local Structure
 * @local UnionDiscriminator
 * @local UnionLayoutDiscriminator
 * @local Union
 * @local VariantLayout
 * @local BitStructure
 * @local BitField
 * @local Boolean
 * @local Blob
 * @local CString
 * @local Constant
 * @local bindConstructorLayout
 * @module Layout
 * @license MIT
 * @author Peter A. Bigot
 * @see {@link https://github.com/pabigot/buffer-layout|buffer-layout on GitHub}
 */



/**
 * Base class for layout objects.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
 * Layout#encode|encode} or {@link Layout#decode|decode} functions.
 *
 * @param {Number} span - Initializer for {@link Layout#span|span}.  The
 * parameter must be an integer; a negative value signifies that the
 * span is {@link Layout#getSpan|value-specific}.
 *
 * @param {string} [property] - Initializer for {@link
 * Layout#property|property}.
 *
 * @abstract
 */
class Layout {
  constructor(span, property) {
    if (!Number.isInteger(span)) {
      throw new TypeError('span must be an integer');
    }

    /** The span of the layout in bytes.
     *
     * Positive values are generally expected.
     *
     * Zero will only appear in {@link Constant}s and in {@link
     * Sequence}s where the {@link Sequence#count|count} is zero.
     *
     * A negative value indicates that the span is value-specific, and
     * must be obtained using {@link Layout#getSpan|getSpan}. */
    this.span = span;

    /** The property name used when this layout is represented in an
     * Object.
     *
     * Used only for layouts that {@link Layout#decode|decode} to Object
     * instances.  If left undefined the span of the unnamed layout will
     * be treated as padding: it will not be mutated by {@link
     * Layout#encode|encode} nor represented as a property in the
     * decoded Object. */
    this.property = property;
  }

  /** Function to create an Object into which decoded properties will
   * be written.
   *
   * Used only for layouts that {@link Layout#decode|decode} to Object
   * instances, which means:
   * * {@link Structure}
   * * {@link Union}
   * * {@link VariantLayout}
   * * {@link BitStructure}
   *
   * If left undefined the JavaScript representation of these layouts
   * will be Object instances.
   *
   * See {@link bindConstructorLayout}.
   */
  makeDestinationObject() {
    return {};
  }

  /**
   * Decode from a Buffer into an JavaScript value.
   *
   * @param {Buffer} b - the buffer from which encoded data is read.
   *
   * @param {Number} [offset] - the offset at which the encoded data
   * starts.  If absent a zero offset is inferred.
   *
   * @returns {(Number|Array|Object)} - the value of the decoded data.
   *
   * @abstract
   */
  decode(b, offset) {
    throw new Error('Layout is abstract');
  }

  /**
   * Encode a JavaScript value into a Buffer.
   *
   * @param {(Number|Array|Object)} src - the value to be encoded into
   * the buffer.  The type accepted depends on the (sub-)type of {@link
   * Layout}.
   *
   * @param {Buffer} b - the buffer into which encoded data will be
   * written.
   *
   * @param {Number} [offset] - the offset at which the encoded data
   * starts.  If absent a zero offset is inferred.
   *
   * @returns {Number} - the number of bytes encoded, including the
   * space skipped for internal padding, but excluding data such as
   * {@link Sequence#count|lengths} when stored {@link
   * ExternalLayout|externally}.  This is the adjustment to `offset`
   * producing the offset where data for the next layout would be
   * written.
   *
   * @abstract
   */
  encode(src, b, offset) {
    throw new Error('Layout is abstract');
  }

  /**
   * Calculate the span of a specific instance of a layout.
   *
   * @param {Buffer} b - the buffer that contains an encoded instance.
   *
   * @param {Number} [offset] - the offset at which the encoded instance
   * starts.  If absent a zero offset is inferred.
   *
   * @return {Number} - the number of bytes covered by the layout
   * instance.  If this method is not overridden in a subclass the
   * definition-time constant {@link Layout#span|span} will be
   * returned.
   *
   * @throws {RangeError} - if the length of the value cannot be
   * determined.
   */
  getSpan(b, offset) {
    if (0 > this.span) {
      throw new RangeError('indeterminate span');
    }
    return this.span;
  }

  /**
   * Replicate the layout using a new property.
   *
   * This function must be used to get a structurally-equivalent layout
   * with a different name since all {@link Layout} instances are
   * immutable.
   *
   * **NOTE** This is a shallow copy.  All fields except {@link
   * Layout#property|property} are strictly equal to the origin layout.
   *
   * @param {String} property - the value for {@link
   * Layout#property|property} in the replica.
   *
   * @returns {Layout} - the copy with {@link Layout#property|property}
   * set to `property`.
   */
  replicate(property) {
    const rv = Object.create(this.constructor.prototype);
    Object.assign(rv, this);
    rv.property = property;
    return rv;
  }

  /**
   * Create an object from layout properties and an array of values.
   *
   * **NOTE** This function returns `undefined` if invoked on a layout
   * that does not return its value as an Object.  Objects are
   * returned for things that are a {@link Structure}, which includes
   * {@link VariantLayout|variant layouts} if they are structures, and
   * excludes {@link Union}s.  If you want this feature for a union
   * you must use {@link Union.getVariant|getVariant} to select the
   * desired layout.
   *
   * @param {Array} values - an array of values that correspond to the
   * default order for properties.  As with {@link Layout#decode|decode}
   * layout elements that have no property name are skipped when
   * iterating over the array values.  Only the top-level properties are
   * assigned; arguments are not assigned to properties of contained
   * layouts.  Any unused values are ignored.
   *
   * @return {(Object|undefined)}
   */
  fromArray(values) {
    return undefined;
  }
}
exports.Layout = Layout;

/* Provide text that carries a name (such as for a function that will
 * be throwing an error) annotated with the property of a given layout
 * (such as one for which the value was unacceptable).
 *
 * @ignore */
function nameWithProperty(name, lo) {
  if (lo.property) {
    return name + '[' + lo.property + ']';
  }
  return name;
}
exports.nameWithProperty = nameWithProperty;

/**
 * Augment a class so that instances can be encoded/decoded using a
 * given layout.
 *
 * Calling this function couples `Class` with `layout` in several ways:
 *
 * * `Class.layout_` becomes a static member property equal to `layout`;
 * * `layout.boundConstructor_` becomes a static member property equal
 *    to `Class`;
 * * The {@link Layout#makeDestinationObject|makeDestinationObject()}
 *   property of `layout` is set to a function that returns a `new
 *   Class()`;
 * * `Class.decode(b, offset)` becomes a static member function that
 *   delegates to {@link Layout#decode|layout.decode}.  The
 *   synthesized function may be captured and extended.
 * * `Class.prototype.encode(b, offset)` provides an instance member
 *   function that delegates to {@link Layout#encode|layout.encode}
 *   with `src` set to `this`.  The synthesized function may be
 *   captured and extended, but when the extension is invoked `this`
 *   must be explicitly bound to the instance.
 *
 * @param {class} Class - a JavaScript class with a nullary
 * constructor.
 *
 * @param {Layout} layout - the {@link Layout} instance used to encode
 * instances of `Class`.
 */
function bindConstructorLayout(Class, layout) {
  if ('function' !== typeof Class) {
    throw new TypeError('Class must be constructor');
  }
  if (Class.hasOwnProperty('layout_')) {
    throw new Error('Class is already bound to a layout');
  }
  if (!(layout && (layout instanceof Layout))) {
    throw new TypeError('layout must be a Layout');
  }
  if (layout.hasOwnProperty('boundConstructor_')) {
    throw new Error('layout is already bound to a constructor');
  }
  Class.layout_ = layout;
  layout.boundConstructor_ = Class;
  layout.makeDestinationObject = (() => new Class());
  Object.defineProperty(Class.prototype, 'encode', {
    value: function(b, offset) {
      return layout.encode(this, b, offset);
    },
    writable: true,
  });
  Object.defineProperty(Class, 'decode', {
    value: function(b, offset) {
      return layout.decode(b, offset);
    },
    writable: true,
  });
}
exports.bindConstructorLayout = bindConstructorLayout;

/**
 * An object that behaves like a layout but does not consume space
 * within its containing layout.
 *
 * This is primarily used to obtain metadata about a member, such as a
 * {@link OffsetLayout} that can provide data about a {@link
 * Layout#getSpan|value-specific span}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support {@link
 * ExternalLayout#isCount|isCount} or other {@link Layout} functions.
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @abstract
 * @augments {Layout}
 */
class ExternalLayout extends Layout {
  /**
   * Return `true` iff the external layout decodes to an unsigned
   * integer layout.
   *
   * In that case it can be used as the source of {@link
   * Sequence#count|Sequence counts}, {@link Blob#length|Blob lengths},
   * or as {@link UnionLayoutDiscriminator#layout|external union
   * discriminators}.
   *
   * @abstract
   */
  isCount() {
    throw new Error('ExternalLayout is abstract');
  }
}

/**
 * An {@link ExternalLayout} that determines its {@link
 * Layout#decode|value} based on offset into and length of the buffer
 * on which it is invoked.
 *
 * *Factory*: {@link module:Layout.greedy|greedy}
 *
 * @param {Number} [elementSpan] - initializer for {@link
 * GreedyCount#elementSpan|elementSpan}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {ExternalLayout}
 */
class GreedyCount extends ExternalLayout {
  constructor(elementSpan, property) {
    if (undefined === elementSpan) {
      elementSpan = 1;
    }
    if ((!Number.isInteger(elementSpan)) || (0 >= elementSpan)) {
      throw new TypeError('elementSpan must be a (positive) integer');
    }
    super(-1, property);

    /** The layout for individual elements of the sequence.  The value
     * must be a positive integer.  If not provided, the value will be
     * 1. */
    this.elementSpan = elementSpan;
  }

  /** @override */
  isCount() {
    return true;
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const rem = b.length - offset;
    return Math.floor(rem / this.elementSpan);
  }

  /** @override */
  encode(src, b, offset) {
    return 0;
  }
}

/**
 * An {@link ExternalLayout} that supports accessing a {@link Layout}
 * at a fixed offset from the start of another Layout.  The offset may
 * be before, within, or after the base layout.
 *
 * *Factory*: {@link module:Layout.offset|offset}
 *
 * @param {Layout} layout - initializer for {@link
 * OffsetLayout#layout|layout}, modulo `property`.
 *
 * @param {Number} [offset] - Initializes {@link
 * OffsetLayout#offset|offset}.  Defaults to zero.
 *
 * @param {string} [property] - Optional new property name for a
 * {@link Layout#replicate| replica} of `layout` to be used as {@link
 * OffsetLayout#layout|layout}.  If not provided the `layout` is used
 * unchanged.
 *
 * @augments {Layout}
 */
class OffsetLayout extends ExternalLayout {
  constructor(layout, offset, property) {
    if (!(layout instanceof Layout)) {
      throw new TypeError('layout must be a Layout');
    }

    if (undefined === offset) {
      offset = 0;
    } else if (!Number.isInteger(offset)) {
      throw new TypeError('offset must be integer or undefined');
    }

    super(layout.span, property || layout.property);

    /** The subordinated layout. */
    this.layout = layout;

    /** The location of {@link OffsetLayout#layout} relative to the
     * start of another layout.
     *
     * The value may be positive or negative, but an error will thrown
     * if at the point of use it goes outside the span of the Buffer
     * being accessed.  */
    this.offset = offset;
  }

  /** @override */
  isCount() {
    return ((this.layout instanceof UInt)
            || (this.layout instanceof UIntBE));
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return this.layout.decode(b, offset + this.offset);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return this.layout.encode(src, b, offset + this.offset);
  }
}

/**
 * Represent an unsigned integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.u8|u8}, {@link
 *  module:Layout.u16|u16}, {@link module:Layout.u24|u24}, {@link
 *  module:Layout.u32|u32}, {@link module:Layout.u40|u40}, {@link
 *  module:Layout.u48|u48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class UInt extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError('span must not exceed 6 bytes');
    }
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readUIntLE(offset, this.span);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeUIntLE(src, offset, this.span);
    return this.span;
  }
}

/**
 * Represent an unsigned integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.u8be|u8be}, {@link
 * module:Layout.u16be|u16be}, {@link module:Layout.u24be|u24be},
 * {@link module:Layout.u32be|u32be}, {@link
 * module:Layout.u40be|u40be}, {@link module:Layout.u48be|u48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class UIntBE extends Layout {
  constructor(span, property) {
    super( span, property);
    if (6 < this.span) {
      throw new RangeError('span must not exceed 6 bytes');
    }
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readUIntBE(offset, this.span);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeUIntBE(src, offset, this.span);
    return this.span;
  }
}

/**
 * Represent a signed integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.s8|s8}, {@link
 *  module:Layout.s16|s16}, {@link module:Layout.s24|s24}, {@link
 *  module:Layout.s32|s32}, {@link module:Layout.s40|s40}, {@link
 *  module:Layout.s48|s48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Int extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError('span must not exceed 6 bytes');
    }
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readIntLE(offset, this.span);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeIntLE(src, offset, this.span);
    return this.span;
  }
}

/**
 * Represent a signed integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.s8be|s8be}, {@link
 * module:Layout.s16be|s16be}, {@link module:Layout.s24be|s24be},
 * {@link module:Layout.s32be|s32be}, {@link
 * module:Layout.s40be|s40be}, {@link module:Layout.s48be|s48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class IntBE extends Layout {
  constructor(span, property) {
    super(span, property);
    if (6 < this.span) {
      throw new RangeError('span must not exceed 6 bytes');
    }
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readIntBE(offset, this.span);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeIntBE(src, offset, this.span);
    return this.span;
  }
}

const V2E32 = Math.pow(2, 32);

/* True modulus high and low 32-bit words, where low word is always
 * non-negative. */
function divmodInt64(src) {
  const hi32 = Math.floor(src / V2E32);
  const lo32 = src - (hi32 * V2E32);
  return {hi32, lo32};
}
/* Reconstruct Number from quotient and non-negative remainder */
function roundedInt64(hi32, lo32) {
  return hi32 * V2E32 + lo32;
}

/**
 * Represent an unsigned 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64|nu64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
class NearUInt64 extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const lo32 = b.readUInt32LE(offset);
    const hi32 = b.readUInt32LE(offset + 4);
    return roundedInt64(hi32, lo32);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const split = divmodInt64(src);
    b.writeUInt32LE(split.lo32, offset);
    b.writeUInt32LE(split.hi32, offset + 4);
    return 8;
  }
}

/**
 * Represent an unsigned 64-bit integer in big-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64be|nu64be}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
class NearUInt64BE extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const hi32 = b.readUInt32BE(offset);
    const lo32 = b.readUInt32BE(offset + 4);
    return roundedInt64(hi32, lo32);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const split = divmodInt64(src);
    b.writeUInt32BE(split.hi32, offset);
    b.writeUInt32BE(split.lo32, offset + 4);
    return 8;
  }
}

/**
 * Represent a signed 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64|ns64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
class NearInt64 extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const lo32 = b.readUInt32LE(offset);
    const hi32 = b.readInt32LE(offset + 4);
    return roundedInt64(hi32, lo32);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const split = divmodInt64(src);
    b.writeUInt32LE(split.lo32, offset);
    b.writeInt32LE(split.hi32, offset + 4);
    return 8;
  }
}

/**
 * Represent a signed 64-bit integer in big-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64be|ns64be}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
class NearInt64BE extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const hi32 = b.readInt32BE(offset);
    const lo32 = b.readUInt32BE(offset + 4);
    return roundedInt64(hi32, lo32);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const split = divmodInt64(src);
    b.writeInt32BE(split.hi32, offset);
    b.writeUInt32BE(split.lo32, offset + 4);
    return 8;
  }
}

/**
 * Represent a 32-bit floating point number in little-endian format.
 *
 * *Factory*: {@link module:Layout.f32|f32}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Float extends Layout {
  constructor(property) {
    super(4, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readFloatLE(offset);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeFloatLE(src, offset);
    return 4;
  }
}

/**
 * Represent a 32-bit floating point number in big-endian format.
 *
 * *Factory*: {@link module:Layout.f32be|f32be}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class FloatBE extends Layout {
  constructor(property) {
    super(4, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readFloatBE(offset);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeFloatBE(src, offset);
    return 4;
  }
}

/**
 * Represent a 64-bit floating point number in little-endian format.
 *
 * *Factory*: {@link module:Layout.f64|f64}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Double extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readDoubleLE(offset);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeDoubleLE(src, offset);
    return 8;
  }
}

/**
 * Represent a 64-bit floating point number in big-endian format.
 *
 * *Factory*: {@link module:Layout.f64be|f64be}
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class DoubleBE extends Layout {
  constructor(property) {
    super(8, property);
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    return b.readDoubleBE(offset);
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    b.writeDoubleBE(src, offset);
    return 8;
  }
}

/**
 * Represent a contiguous sequence of a specific layout as an Array.
 *
 * *Factory*: {@link module:Layout.seq|seq}
 *
 * @param {Layout} elementLayout - initializer for {@link
 * Sequence#elementLayout|elementLayout}.
 *
 * @param {(Number|ExternalLayout)} count - initializer for {@link
 * Sequence#count|count}.  The parameter must be either a positive
 * integer or an instance of {@link ExternalLayout}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Sequence extends Layout {
  constructor(elementLayout, count, property) {
    if (!(elementLayout instanceof Layout)) {
      throw new TypeError('elementLayout must be a Layout');
    }
    if (!(((count instanceof ExternalLayout) && count.isCount())
          || (Number.isInteger(count) && (0 <= count)))) {
      throw new TypeError('count must be non-negative integer '
                          + 'or an unsigned integer ExternalLayout');
    }
    let span = -1;
    if ((!(count instanceof ExternalLayout))
        && (0 < elementLayout.span)) {
      span = count * elementLayout.span;
    }

    super(span, property);

    /** The layout for individual elements of the sequence. */
    this.elementLayout = elementLayout;

    /** The number of elements in the sequence.
     *
     * This will be either a non-negative integer or an instance of
     * {@link ExternalLayout} for which {@link
     * ExternalLayout#isCount|isCount()} is `true`. */
    this.count = count;
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    let span = 0;
    let count = this.count;
    if (count instanceof ExternalLayout) {
      count = count.decode(b, offset);
    }
    if (0 < this.elementLayout.span) {
      span = count * this.elementLayout.span;
    } else {
      let idx = 0;
      while (idx < count) {
        span += this.elementLayout.getSpan(b, offset + span);
        ++idx;
      }
    }
    return span;
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const rv = [];
    let i = 0;
    let count = this.count;
    if (count instanceof ExternalLayout) {
      count = count.decode(b, offset);
    }
    while (i < count) {
      rv.push(this.elementLayout.decode(b, offset));
      offset += this.elementLayout.getSpan(b, offset);
      i += 1;
    }
    return rv;
  }

  /** Implement {@link Layout#encode|encode} for {@link Sequence}.
   *
   * **NOTE** If `src` is shorter than {@link Sequence#count|count} then
   * the unused space in the buffer is left unchanged.  If `src` is
   * longer than {@link Sequence#count|count} the unneeded elements are
   * ignored.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const elo = this.elementLayout;
    const span = src.reduce((span, v) => {
      return span + elo.encode(v, b, offset + span);
    }, 0);
    if (this.count instanceof ExternalLayout) {
      this.count.encode(src.length, b, offset);
    }
    return span;
  }
}

/**
 * Represent a contiguous sequence of arbitrary layout elements as an
 * Object.
 *
 * *Factory*: {@link module:Layout.struct|struct}
 *
 * **NOTE** The {@link Layout#span|span} of the structure is variable
 * if any layout in {@link Structure#fields|fields} has a variable
 * span.  When {@link Layout#encode|encoding} we must have a value for
 * all variable-length fields, or we wouldn't be able to figure out
 * how much space to use for storage.  We can only identify the value
 * for a field when it has a {@link Layout#property|property}.  As
 * such, although a structure may contain both unnamed fields and
 * variable-length fields, it cannot contain an unnamed
 * variable-length field.
 *
 * @param {Layout[]} fields - initializer for {@link
 * Structure#fields|fields}.  An error is raised if this contains a
 * variable-length field for which a {@link Layout#property|property}
 * is not defined.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @param {Boolean} [decodePrefixes] - initializer for {@link
 * Structure#decodePrefixes|property}.
 *
 * @throws {Error} - if `fields` contains an unnamed variable-length
 * layout.
 *
 * @augments {Layout}
 */
class Structure extends Layout {
  constructor(fields, property, decodePrefixes) {
    if (!(Array.isArray(fields)
          && fields.reduce((acc, v) => acc && (v instanceof Layout), true))) {
      throw new TypeError('fields must be array of Layout instances');
    }
    if (('boolean' === typeof property)
        && (undefined === decodePrefixes)) {
      decodePrefixes = property;
      property = undefined;
    }

    /* Verify absence of unnamed variable-length fields. */
    for (const fd of fields) {
      if ((0 > fd.span)
          && (undefined === fd.property)) {
        throw new Error('fields cannot contain unnamed variable-length layout');
      }
    }

    let span = -1;
    try {
      span = fields.reduce((span, fd) => span + fd.getSpan(), 0);
    } catch (e) {
    }
    super(span, property);

    /** The sequence of {@link Layout} values that comprise the
     * structure.
     *
     * The individual elements need not be the same type, and may be
     * either scalar or aggregate layouts.  If a member layout leaves
     * its {@link Layout#property|property} undefined the
     * corresponding region of the buffer associated with the element
     * will not be mutated.
     *
     * @type {Layout[]} */
    this.fields = fields;

    /** Control behavior of {@link Layout#decode|decode()} given short
     * buffers.
     *
     * In some situations a structure many be extended with additional
     * fields over time, with older installations providing only a
     * prefix of the full structure.  If this property is `true`
     * decoding will accept those buffers and leave subsequent fields
     * undefined, as long as the buffer ends at a field boundary.
     * Defaults to `false`. */
    this.decodePrefixes = !!decodePrefixes;
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    let span = 0;
    try {
      span = this.fields.reduce((span, fd) => {
        const fsp = fd.getSpan(b, offset);
        offset += fsp;
        return span + fsp;
      }, 0);
    } catch (e) {
      throw new RangeError('indeterminate span');
    }
    return span;
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const dest = this.makeDestinationObject();
    for (const fd of this.fields) {
      if (undefined !== fd.property) {
        dest[fd.property] = fd.decode(b, offset);
      }
      offset += fd.getSpan(b, offset);
      if (this.decodePrefixes
          && (b.length === offset)) {
        break;
      }
    }
    return dest;
  }

  /** Implement {@link Layout#encode|encode} for {@link Structure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the buffer is
   * left unmodified. */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const firstOffset = offset;
    let lastOffset = 0;
    let lastWrote = 0;
    for (const fd of this.fields) {
      let span = fd.span;
      lastWrote = (0 < span) ? span : 0;
      if (undefined !== fd.property) {
        const fv = src[fd.property];
        if (undefined !== fv) {
          lastWrote = fd.encode(fv, b, offset);
          if (0 > span) {
            /* Read the as-encoded span, which is not necessarily the
             * same as what we wrote. */
            span = fd.getSpan(b, offset);
          }
        }
      }
      lastOffset = offset;
      offset += span;
    }
    /* Use (lastOffset + lastWrote) instead of offset because the last
     * item may have had a dynamic length and we don't want to include
     * the padding between it and the end of the space reserved for
     * it. */
    return (lastOffset + lastWrote) - firstOffset;
  }

  /** @override */
  fromArray(values) {
    const dest = this.makeDestinationObject();
    for (const fd of this.fields) {
      if ((undefined !== fd.property)
          && (0 < values.length)) {
        dest[fd.property] = values.shift();
      }
    }
    return dest;
  }

  /**
   * Get access to the layout of a given property.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Layout} - the layout associated with `property`, or
   * undefined if there is no such property.
   */
  layoutFor(property) {
    if ('string' !== typeof property) {
      throw new TypeError('property must be string');
    }
    for (const fd of this.fields) {
      if (fd.property === property) {
        return fd;
      }
    }
  }

  /**
   * Get the offset of a structure member.
   *
   * @param {String} property - the structure member of interest.
   *
   * @return {Number} - the offset in bytes to the start of `property`
   * within the structure, or undefined if `property` is not a field
   * within the structure.  If the property is a member but follows a
   * variable-length structure member a negative number will be
   * returned.
   */
  offsetOf(property) {
    if ('string' !== typeof property) {
      throw new TypeError('property must be string');
    }
    let offset = 0;
    for (const fd of this.fields) {
      if (fd.property === property) {
        return offset;
      }
      if (0 > fd.span) {
        offset = -1;
      } else if (0 <= offset) {
        offset += fd.span;
      }
    }
  }
}

/**
 * An object that can provide a {@link
 * Union#discriminator|discriminator} API for {@link Union}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
 * UnionDiscriminator#encode|encode} or {@link
 * UnionDiscriminator#decode|decode} functions.
 *
 * @param {string} [property] - Default for {@link
 * UnionDiscriminator#property|property}.
 *
 * @abstract
 */
class UnionDiscriminator {
  constructor(property) {
    /** The {@link Layout#property|property} to be used when the
     * discriminator is referenced in isolation (generally when {@link
     * Union#decode|Union decode} cannot delegate to a specific
     * variant). */
    this.property = property;
  }

  /** Analog to {@link Layout#decode|Layout decode} for union discriminators.
   *
   * The implementation of this method need not reference the buffer if
   * variant information is available through other means. */
  decode() {
    throw new Error('UnionDiscriminator is abstract');
  }

  /** Analog to {@link Layout#decode|Layout encode} for union discriminators.
   *
   * The implementation of this method need not store the value if
   * variant information is maintained through other means. */
  encode() {
    throw new Error('UnionDiscriminator is abstract');
  }
}

/**
 * An object that can provide a {@link
 * UnionDiscriminator|discriminator API} for {@link Union} using an
 * unsigned integral {@link Layout} instance located either inside or
 * outside the union.
 *
 * @param {ExternalLayout} layout - initializes {@link
 * UnionLayoutDiscriminator#layout|layout}.  Must satisfy {@link
 * ExternalLayout#isCount|isCount()}.
 *
 * @param {string} [property] - Default for {@link
 * UnionDiscriminator#property|property}, superseding the property
 * from `layout`, but defaulting to `variant` if neither `property`
 * nor layout provide a property name.
 *
 * @augments {UnionDiscriminator}
 */
class UnionLayoutDiscriminator extends UnionDiscriminator {
  constructor(layout, property) {
    if (!((layout instanceof ExternalLayout)
          && layout.isCount())) {
      throw new TypeError('layout must be an unsigned integer ExternalLayout');
    }

    super(property || layout.property || 'variant');

    /** The {@link ExternalLayout} used to access the discriminator
     * value. */
    this.layout = layout;
  }

  /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */
  decode(b, offset) {
    return this.layout.decode(b, offset);
  }

  /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */
  encode(src, b, offset) {
    return this.layout.encode(src, b, offset);
  }
}

/**
 * Represent any number of span-compatible layouts.
 *
 * *Factory*: {@link module:Layout.union|union}
 *
 * If the union has a {@link Union#defaultLayout|default layout} that
 * layout must have a non-negative {@link Layout#span|span}.  The span
 * of a fixed-span union includes its {@link
 * Union#discriminator|discriminator} if the variant is a {@link
 * Union#usesPrefixDiscriminator|prefix of the union}, plus the span
 * of its {@link Union#defaultLayout|default layout}.
 *
 * If the union does not have a default layout then the encoded span
 * of the union depends on the encoded span of its variant (which may
 * be fixed or variable).
 *
 * {@link VariantLayout#layout|Variant layout}s are added through
 * {@link Union#addVariant|addVariant}.  If the union has a default
 * layout, the span of the {@link VariantLayout#layout|layout
 * contained by the variant} must not exceed the span of the {@link
 * Union#defaultLayout|default layout} (minus the span of a {@link
 * Union#usesPrefixDiscriminator|prefix disriminator}, if used).  The
 * span of the variant will equal the span of the union itself.
 *
 * The variant for a buffer can only be identified from the {@link
 * Union#discriminator|discriminator} {@link
 * UnionDiscriminator#property|property} (in the case of the {@link
 * Union#defaultLayout|default layout}), or by using {@link
 * Union#getVariant|getVariant} and examining the resulting {@link
 * VariantLayout} instance.
 *
 * A variant compatible with a JavaScript object can be identified
 * using {@link Union#getSourceVariant|getSourceVariant}.
 *
 * @param {(UnionDiscriminator|ExternalLayout|Layout)} discr - How to
 * identify the layout used to interpret the union contents.  The
 * parameter must be an instance of {@link UnionDiscriminator}, an
 * {@link ExternalLayout} that satisfies {@link
 * ExternalLayout#isCount|isCount()}, or {@link UInt} (or {@link
 * UIntBE}).  When a non-external layout element is passed the layout
 * appears at the start of the union.  In all cases the (synthesized)
 * {@link UnionDiscriminator} instance is recorded as {@link
 * Union#discriminator|discriminator}.
 *
 * @param {(Layout|null)} defaultLayout - initializer for {@link
 * Union#defaultLayout|defaultLayout}.  If absent defaults to `null`.
 * If `null` there is no default layout: the union has data-dependent
 * length and attempts to decode or encode unrecognized variants will
 * throw an exception.  A {@link Layout} instance must have a
 * non-negative {@link Layout#span|span}, and if it lacks a {@link
 * Layout#property|property} the {@link
 * Union#defaultLayout|defaultLayout} will be a {@link
 * Layout#replicate|replica} with property `content`.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Union extends Layout {
  constructor(discr, defaultLayout, property) {
    const upv = ((discr instanceof UInt)
               || (discr instanceof UIntBE));
    if (upv) {
      discr = new UnionLayoutDiscriminator(new OffsetLayout(discr));
    } else if ((discr instanceof ExternalLayout)
               && discr.isCount()) {
      discr = new UnionLayoutDiscriminator(discr);
    } else if (!(discr instanceof UnionDiscriminator)) {
      throw new TypeError('discr must be a UnionDiscriminator '
                          + 'or an unsigned integer layout');
    }
    if (undefined === defaultLayout) {
      defaultLayout = null;
    }
    if (!((null === defaultLayout)
          || (defaultLayout instanceof Layout))) {
      throw new TypeError('defaultLayout must be null or a Layout');
    }
    if (null !== defaultLayout) {
      if (0 > defaultLayout.span) {
        throw new Error('defaultLayout must have constant span');
      }
      if (undefined === defaultLayout.property) {
        defaultLayout = defaultLayout.replicate('content');
      }
    }

    /* The union span can be estimated only if there's a default
     * layout.  The union spans its default layout, plus any prefix
     * variant layout.  By construction both layouts, if present, have
     * non-negative span. */
    let span = -1;
    if (defaultLayout) {
      span = defaultLayout.span;
      if ((0 <= span) && upv) {
        span += discr.layout.span;
      }
    }
    super(span, property);

    /** The interface for the discriminator value in isolation.
     *
     * This a {@link UnionDiscriminator} either passed to the
     * constructor or synthesized from the `discr` constructor
     * argument.  {@link
     * Union#usesPrefixDiscriminator|usesPrefixDiscriminator} will be
     * `true` iff the `discr` parameter was a non-offset {@link
     * Layout} instance. */
    this.discriminator = discr;

    /** `true` if the {@link Union#discriminator|discriminator} is the
     * first field in the union.
     *
     * If `false` the discriminator is obtained from somewhere
     * else. */
    this.usesPrefixDiscriminator = upv;

    /** The layout for non-discriminator content when the value of the
     * discriminator is not recognized.
     *
     * This is the value passed to the constructor.  It is
     * structurally equivalent to the second component of {@link
     * Union#layout|layout} but may have a different property
     * name. */
    this.defaultLayout = defaultLayout;

    /** A registry of allowed variants.
     *
     * The keys are unsigned integers which should be compatible with
     * {@link Union.discriminator|discriminator}.  The property value
     * is the corresponding {@link VariantLayout} instances assigned
     * to this union by {@link Union#addVariant|addVariant}.
     *
     * **NOTE** The registry remains mutable so that variants can be
     * {@link Union#addVariant|added} at any time.  Users should not
     * manipulate the content of this property. */
    this.registry = {};

    /* Private variable used when invoking getSourceVariant */
    let boundGetSourceVariant = this.defaultGetSourceVariant.bind(this);

    /** Function to infer the variant selected by a source object.
     *
     * Defaults to {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant} but may
     * be overridden using {@link
     * Union#configGetSourceVariant|configGetSourceVariant}.
     *
     * @param {Object} src - as with {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
     *
     * @returns {(undefined|VariantLayout)} The default variant
     * (`undefined`) or first registered variant that uses a property
     * available in `src`. */
    this.getSourceVariant = function(src) {
      return boundGetSourceVariant(src);
    };

    /** Function to override the implementation of {@link
     * Union#getSourceVariant|getSourceVariant}.
     *
     * Use this if the desired variant cannot be identified using the
     * algorithm of {@link
     * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
     *
     * **NOTE** The provided function will be invoked bound to this
     * Union instance, providing local access to {@link
     * Union#registry|registry}.
     *
     * @param {Function} gsv - a function that follows the API of
     * {@link Union#defaultGetSourceVariant|defaultGetSourceVariant}. */
    this.configGetSourceVariant = function(gsv) {
      boundGetSourceVariant = gsv.bind(this);
    };
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    /* Default layouts always have non-negative span, so we don't have
     * one and we have to recognize the variant which will in turn
     * determine the span. */
    const vlo = this.getVariant(b, offset);
    if (!vlo) {
      throw new Error('unable to determine span for unrecognized variant');
    }
    return vlo.getSpan(b, offset);
  }

  /**
   * Method to infer a registered Union variant compatible with `src`.
   *
   * The first satisified rule in the following sequence defines the
   * return value:
   * * If `src` has properties matching the Union discriminator and
   *   the default layout, `undefined` is returned regardless of the
   *   value of the discriminator property (this ensures the default
   *   layout will be used);
   * * If `src` has a property matching the Union discriminator, the
   *   value of the discriminator identifies a registered variant, and
   *   either (a) the variant has no layout, or (b) `src` has the
   *   variant's property, then the variant is returned (because the
   *   source satisfies the constraints of the variant it identifies);
   * * If `src` does not have a property matching the Union
   *   discriminator, but does have a property matching a registered
   *   variant, then the variant is returned (because the source
   *   matches a variant without an explicit conflict);
   * * An error is thrown (because we either can't identify a variant,
   *   or we were explicitly told the variant but can't satisfy it).
   *
   * @param {Object} src - an object presumed to be compatible with
   * the content of the Union.
   *
   * @return {(undefined|VariantLayout)} - as described above.
   *
   * @throws {Error} - if `src` cannot be associated with a default or
   * registered variant.
   */
  defaultGetSourceVariant(src) {
    if (src.hasOwnProperty(this.discriminator.property)) {
      if (this.defaultLayout
          && src.hasOwnProperty(this.defaultLayout.property)) {
        return undefined;
      }
      const vlo = this.registry[src[this.discriminator.property]];
      if (vlo
          && ((!vlo.layout)
              || src.hasOwnProperty(vlo.property))) {
        return vlo;
      }
    } else {
      for (const tag in this.registry) {
        const vlo = this.registry[tag];
        if (src.hasOwnProperty(vlo.property)) {
          return vlo;
        }
      }
    }
    throw new Error('unable to infer src variant');
  }

  /** Implement {@link Layout#decode|decode} for {@link Union}.
   *
   * If the variant is {@link Union#addVariant|registered} the return
   * value is an instance of that variant, with no explicit
   * discriminator.  Otherwise the {@link Union#defaultLayout|default
   * layout} is used to decode the content. */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    let dest;
    const dlo = this.discriminator;
    const discr = dlo.decode(b, offset);
    let clo = this.registry[discr];
    if (undefined === clo) {
      let contentOffset = 0;
      clo = this.defaultLayout;
      if (this.usesPrefixDiscriminator) {
        contentOffset = dlo.layout.span;
      }
      dest = this.makeDestinationObject();
      dest[dlo.property] = discr;
      dest[clo.property] = this.defaultLayout.decode(b, offset + contentOffset);
    } else {
      dest = clo.decode(b, offset);
    }
    return dest;
  }

  /** Implement {@link Layout#encode|encode} for {@link Union}.
   *
   * This API assumes the `src` object is consistent with the union's
   * {@link Union#defaultLayout|default layout}.  To encode variants
   * use the appropriate variant-specific {@link VariantLayout#encode}
   * method. */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const vlo = this.getSourceVariant(src);
    if (undefined === vlo) {
      const dlo = this.discriminator;
      const clo = this.defaultLayout;
      let contentOffset = 0;
      if (this.usesPrefixDiscriminator) {
        contentOffset = dlo.layout.span;
      }
      dlo.encode(src[dlo.property], b, offset);
      return contentOffset + clo.encode(src[clo.property], b,
                                        offset + contentOffset);
    }
    return vlo.encode(src, b, offset);
  }

  /** Register a new variant structure within a union.  The newly
   * created variant is returned.
   *
   * @param {Number} variant - initializer for {@link
   * VariantLayout#variant|variant}.
   *
   * @param {Layout} layout - initializer for {@link
   * VariantLayout#layout|layout}.
   *
   * @param {String} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {VariantLayout} */
  addVariant(variant, layout, property) {
    const rv = new VariantLayout(this, variant, layout, property);
    this.registry[variant] = rv;
    return rv;
  }

  /**
   * Get the layout associated with a registered variant.
   *
   * If `vb` does not produce a registered variant the function returns
   * `undefined`.
   *
   * @param {(Number|Buffer)} vb - either the variant number, or a
   * buffer from which the discriminator is to be read.
   *
   * @param {Number} offset - offset into `vb` for the start of the
   * union.  Used only when `vb` is an instance of {Buffer}.
   *
   * @return {({VariantLayout}|undefined)}
   */
  getVariant(vb, offset) {
    let variant = vb;
    if (Buffer.isBuffer(vb)) {
      if (undefined === offset) {
        offset = 0;
      }
      variant = this.discriminator.decode(vb, offset);
    }
    return this.registry[variant];
  }
}

/**
 * Represent a specific variant within a containing union.
 *
 * **NOTE** The {@link Layout#span|span} of the variant may include
 * the span of the {@link Union#discriminator|discriminator} used to
 * identify it, but values read and written using the variant strictly
 * conform to the content of {@link VariantLayout#layout|layout}.
 *
 * **NOTE** User code should not invoke this constructor directly.  Use
 * the union {@link Union#addVariant|addVariant} helper method.
 *
 * @param {Union} union - initializer for {@link
 * VariantLayout#union|union}.
 *
 * @param {Number} variant - initializer for {@link
 * VariantLayout#variant|variant}.
 *
 * @param {Layout} [layout] - initializer for {@link
 * VariantLayout#layout|layout}.  If absent the variant carries no
 * data.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.  Unlike many other layouts, variant
 * layouts normally include a property name so they can be identified
 * within their containing {@link Union}.  The property identifier may
 * be absent only if `layout` is is absent.
 *
 * @augments {Layout}
 */
class VariantLayout extends Layout {
  constructor(union, variant, layout, property) {
    if (!(union instanceof Union)) {
      throw new TypeError('union must be a Union');
    }
    if ((!Number.isInteger(variant)) || (0 > variant)) {
      throw new TypeError('variant must be a (non-negative) integer');
    }
    if (('string' === typeof layout)
        && (undefined === property)) {
      property = layout;
      layout = null;
    }
    if (layout) {
      if (!(layout instanceof Layout)) {
        throw new TypeError('layout must be a Layout');
      }
      if ((null !== union.defaultLayout)
          && (0 <= layout.span)
          && (layout.span > union.defaultLayout.span)) {
        throw new Error('variant span exceeds span of containing union');
      }
      if ('string' !== typeof property) {
        throw new TypeError('variant must have a String property');
      }
    }
    let span = union.span;
    if (0 > union.span) {
      span = layout ? layout.span : 0;
      if ((0 <= span) && union.usesPrefixDiscriminator) {
        span += union.discriminator.layout.span;
      }
    }
    super(span, property);

    /** The {@link Union} to which this variant belongs. */
    this.union = union;

    /** The unsigned integral value identifying this variant within
     * the {@link Union#discriminator|discriminator} of the containing
     * union. */
    this.variant = variant;

    /** The {@link Layout} to be used when reading/writing the
     * non-discriminator part of the {@link
     * VariantLayout#union|union}.  If `null` the variant carries no
     * data. */
    this.layout = layout || null;
  }

  /** @override */
  getSpan(b, offset) {
    if (0 <= this.span) {
      /* Will be equal to the containing union span if that is not
       * variable. */
      return this.span;
    }
    if (undefined === offset) {
      offset = 0;
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    /* Span is defined solely by the variant (and prefix discriminator) */
    return contentOffset + this.layout.getSpan(b, offset + contentOffset);
  }

  /** @override */
  decode(b, offset) {
    const dest = this.makeDestinationObject();
    if (undefined === offset) {
      offset = 0;
    }
    if (this !== this.union.getVariant(b, offset)) {
      throw new Error('variant mismatch');
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    if (this.layout) {
      dest[this.property] = this.layout.decode(b, offset + contentOffset);
    } else if (this.property) {
      dest[this.property] = true;
    } else if (this.union.usesPrefixDiscriminator) {
      dest[this.union.discriminator.property] = this.variant;
    }
    return dest;
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    let contentOffset = 0;
    if (this.union.usesPrefixDiscriminator) {
      contentOffset = this.union.discriminator.layout.span;
    }
    if (this.layout
        && (!src.hasOwnProperty(this.property))) {
      throw new TypeError('variant lacks property ' + this.property);
    }
    this.union.discriminator.encode(this.variant, b, offset);
    let span = contentOffset;
    if (this.layout) {
      this.layout.encode(src[this.property], b, offset + contentOffset);
      span += this.layout.getSpan(b, offset + contentOffset);
      if ((0 <= this.union.span)
          && (span > this.union.span)) {
        throw new Error('encoded variant overruns containing union');
      }
    }
    return span;
  }

  /** Delegate {@link Layout#fromArray|fromArray} to {@link
   * VariantLayout#layout|layout}. */
  fromArray(values) {
    if (this.layout) {
      return this.layout.fromArray(values);
    }
  }
}

/** JavaScript chose to define bitwise operations as operating on
 * signed 32-bit values in 2's complement form, meaning any integer
 * with bit 31 set is going to look negative.  For right shifts that's
 * not a problem, because `>>>` is a logical shift, but for every
 * other bitwise operator we have to compensate for possible negative
 * results. */
function fixBitwiseResult(v) {
  if (0 > v) {
    v += 0x100000000;
  }
  return v;
}

/**
 * Contain a sequence of bit fields as an unsigned integer.
 *
 * *Factory*: {@link module:Layout.bits|bits}
 *
 * This is a container element; within it there are {@link BitField}
 * instances that provide the extracted properties.  The container
 * simply defines the aggregate representation and its bit ordering.
 * The representation is an object containing properties with numeric
 * or {@link Boolean} values.
 *
 * {@link BitField}s are added with the {@link
 * BitStructure#addField|addField} and {@link
 * BitStructure#addBoolean|addBoolean} methods.

 * @param {Layout} word - initializer for {@link
 * BitStructure#word|word}.  The parameter must be an instance of
 * {@link UInt} (or {@link UIntBE}) that is no more than 4 bytes wide.
 *
 * @param {bool} [msb] - `true` if the bit numbering starts at the
 * most significant bit of the containing word; `false` (default) if
 * it starts at the least significant bit of the containing word.  If
 * the parameter at this position is a string and `property` is
 * `undefined` the value of this argument will instead be used as the
 * value of `property`.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class BitStructure extends Layout {
  constructor(word, msb, property) {
    if (!((word instanceof UInt)
          || (word instanceof UIntBE))) {
      throw new TypeError('word must be a UInt or UIntBE layout');
    }
    if (('string' === typeof msb)
        && (undefined === property)) {
      property = msb;
      msb = undefined;
    }
    if (4 < word.span) {
      throw new RangeError('word cannot exceed 32 bits');
    }
    super(word.span, property);

    /** The layout used for the packed value.  {@link BitField}
     * instances are packed sequentially depending on {@link
     * BitStructure#msb|msb}. */
    this.word = word;

    /** Whether the bit sequences are packed starting at the most
     * significant bit growing down (`true`), or the least significant
     * bit growing up (`false`).
     *
     * **NOTE** Regardless of this value, the least significant bit of
     * any {@link BitField} value is the least significant bit of the
     * corresponding section of the packed value. */
    this.msb = !!msb;

    /** The sequence of {@link BitField} layouts that comprise the
     * packed structure.
     *
     * **NOTE** The array remains mutable to allow fields to be {@link
     * BitStructure#addField|added} after construction.  Users should
     * not manipulate the content of this property.*/
    this.fields = [];

    /* Storage for the value.  Capture a variable instead of using an
     * instance property because we don't want anything to change the
     * value without going through the mutator. */
    let value = 0;
    this._packedSetValue = function(v) {
      value = fixBitwiseResult(v);
      return this;
    };
    this._packedGetValue = function() {
      return value;
    };
  }

  /** @override */
  decode(b, offset) {
    const dest = this.makeDestinationObject();
    if (undefined === offset) {
      offset = 0;
    }
    const value = this.word.decode(b, offset);
    this._packedSetValue(value);
    for (const fd of this.fields) {
      if (undefined !== fd.property) {
        dest[fd.property] = fd.decode(value);
      }
    }
    return dest;
  }

  /** Implement {@link Layout#encode|encode} for {@link BitStructure}.
   *
   * If `src` is missing a property for a member with a defined {@link
   * Layout#property|property} the corresponding region of the packed
   * value is left unmodified.  Unused bits are also left unmodified. */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    const value = this.word.decode(b, offset);
    this._packedSetValue(value);
    for (const fd of this.fields) {
      if (undefined !== fd.property) {
        const fv = src[fd.property];
        if (undefined !== fv) {
          fd.encode(fv);
        }
      }
    }
    return this.word.encode(this._packedGetValue(), b, offset);
  }

  /** Register a new bitfield with a containing bit structure.  The
   * resulting bitfield is returned.
   *
   * @param {Number} bits - initializer for {@link BitField#bits|bits}.
   *
   * @param {string} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {BitField} */
  addField(bits, property) {
    const bf = new BitField(this, bits, property);
    this.fields.push(bf);
    return bf;
  }

  /** As with {@link BitStructure#addField|addField} for single-bit
   * fields with `boolean` value representation.
   *
   * @param {string} property - initializer for {@link
   * Layout#property|property}.
   *
   * @return {Boolean} */
  addBoolean(property) {
    // This is my Boolean, not the Javascript one.
    // eslint-disable-next-line no-new-wrappers
    const bf = new Boolean(this, property);
    this.fields.push(bf);
    return bf;
  }

  /**
   * Get access to the bit field for a given property.
   *
   * @param {String} property - the bit field of interest.
   *
   * @return {BitField} - the field associated with `property`, or
   * undefined if there is no such property.
   */
  fieldFor(property) {
    if ('string' !== typeof property) {
      throw new TypeError('property must be string');
    }
    for (const fd of this.fields) {
      if (fd.property === property) {
        return fd;
      }
    }
  }
}

/**
 * Represent a sequence of bits within a {@link BitStructure}.
 *
 * All bit field values are represented as unsigned integers.
 *
 * **NOTE** User code should not invoke this constructor directly.
 * Use the container {@link BitStructure#addField|addField} helper
 * method.
 *
 * **NOTE** BitField instances are not instances of {@link Layout}
 * since {@link Layout#span|span} measures 8-bit units.
 *
 * @param {BitStructure} container - initializer for {@link
 * BitField#container|container}.
 *
 * @param {Number} bits - initializer for {@link BitField#bits|bits}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 */
class BitField {
  constructor(container, bits, property) {
    if (!(container instanceof BitStructure)) {
      throw new TypeError('container must be a BitStructure');
    }
    if ((!Number.isInteger(bits)) || (0 >= bits)) {
      throw new TypeError('bits must be positive integer');
    }
    const totalBits = 8 * container.span;
    const usedBits = container.fields.reduce((sum, fd) => sum + fd.bits, 0);
    if ((bits + usedBits) > totalBits) {
      throw new Error('bits too long for span remainder ('
                      + (totalBits - usedBits) + ' of '
                      + totalBits + ' remain)');
    }

    /** The {@link BitStructure} instance to which this bit field
     * belongs. */
    this.container = container;

    /** The span of this value in bits. */
    this.bits = bits;

    /** A mask of {@link BitField#bits|bits} bits isolating value bits
     * that fit within the field.
     *
     * That is, it masks a value that has not yet been shifted into
     * position within its containing packed integer. */
    this.valueMask = (1 << bits) - 1;
    if (32 === bits) { // shifted value out of range
      this.valueMask = 0xFFFFFFFF;
    }

    /** The offset of the value within the containing packed unsigned
     * integer.  The least significant bit of the packed value is at
     * offset zero, regardless of bit ordering used. */
    this.start = usedBits;
    if (this.container.msb) {
      this.start = totalBits - usedBits - bits;
    }

    /** A mask of {@link BitField#bits|bits} isolating the field value
     * within the containing packed unsigned integer. */
    this.wordMask = fixBitwiseResult(this.valueMask << this.start);

    /** The property name used when this bitfield is represented in an
     * Object.
     *
     * Intended to be functionally equivalent to {@link
     * Layout#property}.
     *
     * If left undefined the corresponding span of bits will be
     * treated as padding: it will not be mutated by {@link
     * Layout#encode|encode} nor represented as a property in the
     * decoded Object. */
    this.property = property;
  }

  /** Store a value into the corresponding subsequence of the containing
   * bit field. */
  decode() {
    const word = this.container._packedGetValue();
    const wordValue = fixBitwiseResult(word & this.wordMask);
    const value = wordValue >>> this.start;
    return value;
  }

  /** Store a value into the corresponding subsequence of the containing
   * bit field.
   *
   * **NOTE** This is not a specialization of {@link
   * Layout#encode|Layout.encode} and there is no return value. */
  encode(value) {
    if ((!Number.isInteger(value))
        || (value !== fixBitwiseResult(value & this.valueMask))) {
      throw new TypeError(nameWithProperty('BitField.encode', this)
                          + ' value must be integer not exceeding ' + this.valueMask);
    }
    const word = this.container._packedGetValue();
    const wordValue = fixBitwiseResult(value << this.start);
    this.container._packedSetValue(fixBitwiseResult(word & ~this.wordMask)
                                   | wordValue);
  };
}

/**
 * Represent a single bit within a {@link BitStructure} as a
 * JavaScript boolean.
 *
 * **NOTE** User code should not invoke this constructor directly.
 * Use the container {@link BitStructure#addBoolean|addBoolean} helper
 * method.
 *
 * @param {BitStructure} container - initializer for {@link
 * BitField#container|container}.
 *
 * @param {string} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {BitField}
 */
/* eslint-disable no-extend-native */
class Boolean extends BitField {
  constructor(container, property) {
    super(container, 1, property);
  }

  /** Override {@link BitField#decode|decode} for {@link Boolean|Boolean}.
   *
   * @returns {boolean} */
  decode(b, offset) {
    return !!BitField.prototype.decode.call(this, b, offset);
  }

  /** @override */
  encode(value) {
    if ('boolean' === typeof value) {
      // BitField requires integer values
      value = +value;
    }
    return BitField.prototype.encode.call(this, value);
  }
}
/* eslint-enable no-extend-native */

/**
 * Contain a fixed-length block of arbitrary data, represented as a
 * Buffer.
 *
 * *Factory*: {@link module:Layout.blob|blob}
 *
 * @param {(Number|ExternalLayout)} length - initializes {@link
 * Blob#length|length}.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Blob extends Layout {
  constructor(length, property) {
    if (!(((length instanceof ExternalLayout) && length.isCount())
          || (Number.isInteger(length) && (0 <= length)))) {
      throw new TypeError('length must be positive integer '
                          + 'or an unsigned integer ExternalLayout');
    }

    let span = -1;
    if (!(length instanceof ExternalLayout)) {
      span = length;
    }
    super(span, property);

    /** The number of bytes in the blob.
     *
     * This may be a non-negative integer, or an instance of {@link
     * ExternalLayout} that satisfies {@link
     * ExternalLayout#isCount|isCount()}. */
    this.length = length;
  }

  /** @override */
  getSpan(b, offset) {
    let span = this.span;
    if (0 > span) {
      span = this.length.decode(b, offset);
    }
    return span;
  }

  /** @override */
  decode(b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    let span = this.span;
    if (0 > span) {
      span = this.length.decode(b, offset);
    }
    return b.slice(offset, offset + span);
  }

  /** Implement {@link Layout#encode|encode} for {@link Blob}.
   *
   * **NOTE** If {@link Layout#count|count} is an instance of {@link
   * ExternalLayout} then the length of `src` will be encoded as the
   * count after `src` is encoded. */
  encode(src, b, offset) {
    let span = this.length;
    if (this.length instanceof ExternalLayout) {
      span = src.length;
    }
    if (!(Buffer.isBuffer(src)
          && (span === src.length))) {
      throw new TypeError(nameWithProperty('Blob.encode', this)
                          + ' requires (length ' + span + ') Buffer as src');
    }
    if ((offset + span) > b.length) {
      throw new RangeError('encoding overruns Buffer');
    }
    b.write(src.toString('hex'), offset, span, 'hex');
    if (this.length instanceof ExternalLayout) {
      this.length.encode(span, b, offset);
    }
    return span;
  }
}

/**
 * Contain a `NUL`-terminated UTF8 string.
 *
 * *Factory*: {@link module:Layout.cstr|cstr}
 *
 * **NOTE** Any UTF8 string that incorporates a zero-valued byte will
 * not be correctly decoded by this layout.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class CString extends Layout {
  constructor(property) {
    super(-1, property);
  }

  /** @override */
  getSpan(b, offset) {
    if (!Buffer.isBuffer(b)) {
      throw new TypeError('b must be a Buffer');
    }
    if (undefined === offset) {
      offset = 0;
    }
    let idx = offset;
    while ((idx < b.length) && (0 !== b[idx])) {
      idx += 1;
    }
    return 1 + idx - offset;
  }

  /** @override */
  decode(b, offset, dest) {
    if (undefined === offset) {
      offset = 0;
    }
    let span = this.getSpan(b, offset);
    return b.slice(offset, offset + span - 1).toString('utf-8');
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    /* Must force this to a string, lest it be a number and the
     * "utf8-encoding" below actually allocate a buffer of length
     * src */
    if ('string' !== typeof src) {
      src = src.toString();
    }
    const srcb = new Buffer(src, 'utf8');
    const span = srcb.length;
    if ((offset + span) > b.length) {
      throw new RangeError('encoding overruns Buffer');
    }
    srcb.copy(b, offset);
    b[offset + span] = 0;
    return span + 1;
  }
}

/**
 * Contain a UTF8 string with implicit length.
 *
 * *Factory*: {@link module:Layout.utf8|utf8}
 *
 * **NOTE** Because the length is implicit in the size of the buffer
 * this layout should be used only in isolation, or in a situation
 * where the length can be expressed by operating on a slice of the
 * containing buffer.
 *
 * @param {Number} [maxSpan] - the maximum length allowed for encoded
 * string content.  If not provided there is no bound on the allowed
 * content.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class UTF8 extends Layout {
  constructor(maxSpan, property) {
    if (('string' === typeof maxSpan)
        && (undefined === property)) {
      property = maxSpan;
      maxSpan = undefined;
    }
    if (undefined === maxSpan) {
      maxSpan = -1;
    } else if (!Number.isInteger(maxSpan)) {
      throw new TypeError('maxSpan must be an integer');
    }

    super(-1, property);

    /** The maximum span of the layout in bytes.
     *
     * Positive values are generally expected.  Zero is abnormal.
     * Attempts to encode or decode a value that exceeds this length
     * will throw a `RangeError`.
     *
     * A negative value indicates that there is no bound on the length
     * of the content. */
    this.maxSpan = maxSpan;
  }

  /** @override */
  getSpan(b, offset) {
    if (!Buffer.isBuffer(b)) {
      throw new TypeError('b must be a Buffer');
    }
    if (undefined === offset) {
      offset = 0;
    }
    return b.length - offset;
  }

  /** @override */
  decode(b, offset, dest) {
    if (undefined === offset) {
      offset = 0;
    }
    let span = this.getSpan(b, offset);
    if ((0 <= this.maxSpan)
        && (this.maxSpan < span)) {
      throw new RangeError('text length exceeds maxSpan');
    }
    return b.slice(offset, offset + span).toString('utf-8');
  }

  /** @override */
  encode(src, b, offset) {
    if (undefined === offset) {
      offset = 0;
    }
    /* Must force this to a string, lest it be a number and the
     * "utf8-encoding" below actually allocate a buffer of length
     * src */
    if ('string' !== typeof src) {
      src = src.toString();
    }
    const srcb = new Buffer(src, 'utf8');
    const span = srcb.length;
    if ((0 <= this.maxSpan)
        && (this.maxSpan < span)) {
      throw new RangeError('text length exceeds maxSpan');
    }
    if ((offset + span) > b.length) {
      throw new RangeError('encoding overruns Buffer');
    }
    srcb.copy(b, offset);
    return span;
  }
}

/**
 * Contain a constant value.
 *
 * This layout may be used in cases where a JavaScript value can be
 * inferred without an expression in the binary encoding.  An example
 * would be a {@link VariantLayout|variant layout} where the content
 * is implied by the union {@link Union#discriminator|discriminator}.
 *
 * @param {Object|Number|String} value - initializer for {@link
 * Constant#value|value}.  If the value is an object (or array) and
 * the application intends the object to remain unchanged regardless
 * of what is done to values decoded by this layout, the value should
 * be frozen prior passing it to this constructor.
 *
 * @param {String} [property] - initializer for {@link
 * Layout#property|property}.
 *
 * @augments {Layout}
 */
class Constant extends Layout {
  constructor(value, property) {
    super(0, property);

    /** The value produced by this constant when the layout is {@link
     * Constant#decode|decoded}.
     *
     * Any JavaScript value including `null` and `undefined` is
     * permitted.
     *
     * **WARNING** If `value` passed in the constructor was not
     * frozen, it is possible for users of decoded values to change
     * the content of the value. */
    this.value = value;
  }

  /** @override */
  decode(b, offset, dest) {
    return this.value;
  }

  /** @override */
  encode(src, b, offset) {
    /* Constants take no space */
    return 0;
  }
}

exports.ExternalLayout = ExternalLayout;
exports.GreedyCount = GreedyCount;
exports.OffsetLayout = OffsetLayout;
exports.UInt = UInt;
exports.UIntBE = UIntBE;
exports.Int = Int;
exports.IntBE = IntBE;
exports.Float = Float;
exports.FloatBE = FloatBE;
exports.Double = Double;
exports.DoubleBE = DoubleBE;
exports.Sequence = Sequence;
exports.Structure = Structure;
exports.UnionDiscriminator = UnionDiscriminator;
exports.UnionLayoutDiscriminator = UnionLayoutDiscriminator;
exports.Union = Union;
exports.VariantLayout = VariantLayout;
exports.BitStructure = BitStructure;
exports.BitField = BitField;
exports.Boolean = Boolean;
exports.Blob = Blob;
exports.CString = CString;
exports.UTF8 = UTF8;
exports.Constant = Constant;

/** Factory for {@link GreedyCount}. */
exports.greedy = ((elementSpan, property) => new GreedyCount(elementSpan, property));

/** Factory for {@link OffsetLayout}. */
exports.offset = ((layout, offset, property) => new OffsetLayout(layout, offset, property));

/** Factory for {@link UInt|unsigned int layouts} spanning one
 * byte. */
exports.u8 = (property => new UInt(1, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning two bytes. */
exports.u16 = (property => new UInt(2, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning three bytes. */
exports.u24 = (property => new UInt(3, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning four bytes. */
exports.u32 = (property => new UInt(4, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning five bytes. */
exports.u40 = (property => new UInt(5, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning six bytes. */
exports.u48 = (property => new UInt(6, property));

/** Factory for {@link NearUInt64|little-endian unsigned int
 * layouts} interpreted as Numbers. */
exports.nu64 = (property => new NearUInt64(property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning two bytes. */
exports.u16be = (property => new UIntBE(2, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning three bytes. */
exports.u24be = (property => new UIntBE(3, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning four bytes. */
exports.u32be = (property => new UIntBE(4, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning five bytes. */
exports.u40be = (property => new UIntBE(5, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning six bytes. */
exports.u48be = (property => new UIntBE(6, property));

/** Factory for {@link NearUInt64BE|big-endian unsigned int
 * layouts} interpreted as Numbers. */
exports.nu64be = (property => new NearUInt64BE(property));

/** Factory for {@link Int|signed int layouts} spanning one
 * byte. */
exports.s8 = (property => new Int(1, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning two bytes. */
exports.s16 = (property => new Int(2, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning three bytes. */
exports.s24 = (property => new Int(3, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning four bytes. */
exports.s32 = (property => new Int(4, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning five bytes. */
exports.s40 = (property => new Int(5, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning six bytes. */
exports.s48 = (property => new Int(6, property));

/** Factory for {@link NearInt64|little-endian signed int layouts}
 * interpreted as Numbers. */
exports.ns64 = (property => new NearInt64(property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning two bytes. */
exports.s16be = (property => new IntBE(2, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning three bytes. */
exports.s24be = (property => new IntBE(3, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning four bytes. */
exports.s32be = (property => new IntBE(4, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning five bytes. */
exports.s40be = (property => new IntBE(5, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning six bytes. */
exports.s48be = (property => new IntBE(6, property));

/** Factory for {@link NearInt64BE|big-endian signed int layouts}
 * interpreted as Numbers. */
exports.ns64be = (property => new NearInt64BE(property));

/** Factory for {@link Float|little-endian 32-bit floating point} values. */
exports.f32 = (property => new Float(property));

/** Factory for {@link FloatBE|big-endian 32-bit floating point} values. */
exports.f32be = (property => new FloatBE(property));

/** Factory for {@link Double|little-endian 64-bit floating point} values. */
exports.f64 = (property => new Double(property));

/** Factory for {@link DoubleBE|big-endian 64-bit floating point} values. */
exports.f64be = (property => new DoubleBE(property));

/** Factory for {@link Structure} values. */
exports.struct = ((fields, property, decodePrefixes) => new Structure(fields, property, decodePrefixes));

/** Factory for {@link BitStructure} values. */
exports.bits = ((word, msb, property) => new BitStructure(word, msb, property));

/** Factory for {@link Sequence} values. */
exports.seq = ((elementLayout, count, property) => new Sequence(elementLayout, count, property));

/** Factory for {@link Union} values. */
exports.union = ((discr, defaultLayout, property) => new Union(discr, defaultLayout, property));

/** Factory for {@link UnionLayoutDiscriminator} values. */
exports.unionLayoutDiscriminator = ((layout, property) => new UnionLayoutDiscriminator(layout, property));

/** Factory for {@link Blob} values. */
exports.blob = ((length, property) => new Blob(length, property));

/** Factory for {@link CString} values. */
exports.cstr = (property => new CString(property));

/** Factory for {@link UTF8} values. */
exports.utf8 = ((maxSpan, property) => new UTF8(maxSpan, property));

/** Factory for {@link Constant} values. */
exports["const"] = ((value, property) => new Constant(value, property));


/***/ }),

/***/ 3204:
/***/ (function(module) {

"use strict";


const UPPERCASE = /[\p{Lu}]/u;
const LOWERCASE = /[\p{Ll}]/u;
const LEADING_CAPITAL = /^[\p{Lu}](?![\p{Lu}])/gu;
const IDENTIFIER = /([\p{Alpha}\p{N}_]|$)/u;
const SEPARATORS = /[_.\- ]+/;

const LEADING_SEPARATORS = new RegExp('^' + SEPARATORS.source);
const SEPARATORS_AND_IDENTIFIER = new RegExp(SEPARATORS.source + IDENTIFIER.source, 'gu');
const NUMBERS_AND_IDENTIFIER = new RegExp('\\d+' + IDENTIFIER.source, 'gu');

const preserveCamelCase = (string, toLowerCase, toUpperCase) => {
	let isLastCharLower = false;
	let isLastCharUpper = false;
	let isLastLastCharUpper = false;

	for (let i = 0; i < string.length; i++) {
		const character = string[i];

		if (isLastCharLower && UPPERCASE.test(character)) {
			string = string.slice(0, i) + '-' + string.slice(i);
			isLastCharLower = false;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = true;
			i++;
		} else if (isLastCharUpper && isLastLastCharUpper && LOWERCASE.test(character)) {
			string = string.slice(0, i - 1) + '-' + string.slice(i - 1);
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = false;
			isLastCharLower = true;
		} else {
			isLastCharLower = toLowerCase(character) === character && toUpperCase(character) !== character;
			isLastLastCharUpper = isLastCharUpper;
			isLastCharUpper = toUpperCase(character) === character && toLowerCase(character) !== character;
		}
	}

	return string;
};

const preserveConsecutiveUppercase = (input, toLowerCase) => {
	LEADING_CAPITAL.lastIndex = 0;

	return input.replace(LEADING_CAPITAL, m1 => toLowerCase(m1));
};

const postProcess = (input, toUpperCase) => {
	SEPARATORS_AND_IDENTIFIER.lastIndex = 0;
	NUMBERS_AND_IDENTIFIER.lastIndex = 0;

	return input.replace(SEPARATORS_AND_IDENTIFIER, (_, identifier) => toUpperCase(identifier))
		.replace(NUMBERS_AND_IDENTIFIER, m => toUpperCase(m));
};

const camelCase = (input, options) => {
	if (!(typeof input === 'string' || Array.isArray(input))) {
		throw new TypeError('Expected the input to be `string | string[]`');
	}

	options = {
		pascalCase: false,
		preserveConsecutiveUppercase: false,
		...options
	};

	if (Array.isArray(input)) {
		input = input.map(x => x.trim())
			.filter(x => x.length)
			.join('-');
	} else {
		input = input.trim();
	}

	if (input.length === 0) {
		return '';
	}

	const toLowerCase = options.locale === false ?
		string => string.toLowerCase() :
		string => string.toLocaleLowerCase(options.locale);
	const toUpperCase = options.locale === false ?
		string => string.toUpperCase() :
		string => string.toLocaleUpperCase(options.locale);

	if (input.length === 1) {
		return options.pascalCase ? toUpperCase(input) : toLowerCase(input);
	}

	const hasUpperCase = input !== toLowerCase(input);

	if (hasUpperCase) {
		input = preserveCamelCase(input, toLowerCase, toUpperCase);
	}

	input = input.replace(LEADING_SEPARATORS, '');

	if (options.preserveConsecutiveUppercase) {
		input = preserveConsecutiveUppercase(input, toLowerCase);
	} else {
		input = toLowerCase(input);
	}

	if (options.pascalCase) {
		input = toUpperCase(input.charAt(0)) + input.slice(1);
	}

	return postProcess(input, toUpperCase);
};

module.exports = camelCase;
// TODO: Remove this for the next major release
module.exports["default"] = camelCase;


/***/ }),

/***/ 2023:
/***/ (function(module, exports, __webpack_require__) {

/* provided dependency */ var process = __webpack_require__(500);
var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = __webpack_require__.g;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && "object" === 'object' && module.exports;
  var AMD =  true && __webpack_require__.amdO;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return exports;
      }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();


/***/ }),

/***/ 8877:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "z": function() { return /* binding */ useAnchorWallet; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7294);
/* harmony import */ var _useWallet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7257);


function useAnchorWallet() {
    var ref = (0,_useWallet__WEBPACK_IMPORTED_MODULE_1__/* .useWallet */ .O)(), publicKey = ref.publicKey, signTransaction = ref.signTransaction, signAllTransactions = ref.signAllTransactions;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function() {
        return publicKey && signTransaction && signAllTransactions ? {
            publicKey: publicKey,
            signTransaction: signTransaction,
            signAllTransactions: signAllTransactions
        } : undefined;
    }, [
        publicKey,
        signTransaction,
        signAllTransactions
    ]);
} //# sourceMappingURL=useAnchorWallet.js.map


/***/ }),

/***/ 7596:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var __dirname = "/";
/* provided dependency */ var process = __webpack_require__(500);
/* provided dependency */ var Buffer = __webpack_require__(8764)["Buffer"];
(function(){var e={901:function(e){e.exports=function(e,r,n){if(e.filter)return e.filter(r,n);if(void 0===e||null===e)throw new TypeError;if("function"!=typeof r)throw new TypeError;var o=[];for(var a=0;a<e.length;a++){if(!t.call(e,a))continue;var i=e[a];if(r.call(n,i,a,e))o.push(i)}return o};var t=Object.prototype.hasOwnProperty},313:function(e,t,r){"use strict";function _typeof(e){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(e){return typeof e}}else{_typeof=function _typeof(e){return e&&typeof Symbol==="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e}}return _typeof(e)}function _classCallCheck(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}var n=r(823),o=n.codes,a=o.ERR_AMBIGUOUS_ARGUMENT,i=o.ERR_INVALID_ARG_TYPE,c=o.ERR_INVALID_ARG_VALUE,u=o.ERR_INVALID_RETURN_VALUE,f=o.ERR_MISSING_ARGS;var s=r(298);var p=r(650),l=p.inspect;var y=r(650).types,d=y.isPromise,g=y.isRegExp;var v=Object.assign?Object.assign:r(274).assign;var b=Object.is?Object.is:r(450);var h=new Map;var m;var A;var S;var E;var P;function lazyLoadComparison(){var e=r(655);m=e.isDeepEqual;A=e.isDeepStrictEqual}var w=/[\x00-\x08\x0b\x0c\x0e-\x1f]/g;var O=null&&0;var j=function escapeFn(e){return O[e.charCodeAt(0)]};var _=false;var x=e.exports=ok;var I={};function innerFail(e){if(e.message instanceof Error)throw e.message;throw new s(e)}function fail(e,t,r,n,o){var a=arguments.length;var i;if(a===0){i="Failed"}else if(a===1){r=e;e=undefined}else{if(_===false){_=true;var c=process.emitWarning?process.emitWarning:console.warn.bind(console);c("assert.fail() with more than one argument is deprecated. "+"Please use assert.strictEqual() instead or only pass a message.","DeprecationWarning","DEP0094")}if(a===2)n="!="}if(r instanceof Error)throw r;var u={actual:e,expected:t,operator:n===undefined?"fail":n,stackStartFn:o||fail};if(r!==undefined){u.message=r}var f=new s(u);if(i){f.message=i;f.generatedMessage=true}throw f}x.fail=fail;x.AssertionError=s;function innerOk(e,t,r,n){if(!r){var o=false;if(t===0){o=true;n="No value argument passed to `assert.ok()`"}else if(n instanceof Error){throw n}var a=new s({actual:r,expected:true,message:n,operator:"==",stackStartFn:e});a.generatedMessage=o;throw a}}function ok(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++){t[r]=arguments[r]}innerOk.apply(void 0,[ok,t.length].concat(t))}x.ok=ok;x.equal=function equal(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(e!=t){innerFail({actual:e,expected:t,message:r,operator:"==",stackStartFn:equal})}};x.notEqual=function notEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(e==t){innerFail({actual:e,expected:t,message:r,operator:"!=",stackStartFn:notEqual})}};x.deepEqual=function deepEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(m===undefined)lazyLoadComparison();if(!m(e,t)){innerFail({actual:e,expected:t,message:r,operator:"deepEqual",stackStartFn:deepEqual})}};x.notDeepEqual=function notDeepEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(m===undefined)lazyLoadComparison();if(m(e,t)){innerFail({actual:e,expected:t,message:r,operator:"notDeepEqual",stackStartFn:notDeepEqual})}};x.deepStrictEqual=function deepStrictEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(m===undefined)lazyLoadComparison();if(!A(e,t)){innerFail({actual:e,expected:t,message:r,operator:"deepStrictEqual",stackStartFn:deepStrictEqual})}};x.notDeepStrictEqual=notDeepStrictEqual;function notDeepStrictEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(m===undefined)lazyLoadComparison();if(A(e,t)){innerFail({actual:e,expected:t,message:r,operator:"notDeepStrictEqual",stackStartFn:notDeepStrictEqual})}}x.strictEqual=function strictEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(!b(e,t)){innerFail({actual:e,expected:t,message:r,operator:"strictEqual",stackStartFn:strictEqual})}};x.notStrictEqual=function notStrictEqual(e,t,r){if(arguments.length<2){throw new f("actual","expected")}if(b(e,t)){innerFail({actual:e,expected:t,message:r,operator:"notStrictEqual",stackStartFn:notStrictEqual})}};var F=function Comparison(e,t,r){var n=this;_classCallCheck(this,Comparison);t.forEach((function(t){if(t in e){if(r!==undefined&&typeof r[t]==="string"&&g(e[t])&&e[t].test(r[t])){n[t]=r[t]}else{n[t]=e[t]}}}))};function compareExceptionKey(e,t,r,n,o,a){if(!(r in e)||!A(e[r],t[r])){if(!n){var i=new F(e,o);var c=new F(t,o,e);var u=new s({actual:i,expected:c,operator:"deepStrictEqual",stackStartFn:a});u.actual=e;u.expected=t;u.operator=a.name;throw u}innerFail({actual:e,expected:t,message:n,operator:a.name,stackStartFn:a})}}function expectedException(e,t,r,n){if(typeof t!=="function"){if(g(t))return t.test(e);if(arguments.length===2){throw new i("expected",["Function","RegExp"],t)}if(_typeof(e)!=="object"||e===null){var o=new s({actual:e,expected:t,message:r,operator:"deepStrictEqual",stackStartFn:n});o.operator=n.name;throw o}var a=Object.keys(t);if(t instanceof Error){a.push("name","message")}else if(a.length===0){throw new c("error",t,"may not be an empty object")}if(m===undefined)lazyLoadComparison();a.forEach((function(o){if(typeof e[o]==="string"&&g(t[o])&&t[o].test(e[o])){return}compareExceptionKey(e,t,o,r,a,n)}));return true}if(t.prototype!==undefined&&e instanceof t){return true}if(Error.isPrototypeOf(t)){return false}return t.call({},e)===true}function getActual(e){if(typeof e!=="function"){throw new i("fn","Function",e)}try{e()}catch(e){return e}return I}function checkIsPromise(e){return d(e)||e!==null&&_typeof(e)==="object"&&typeof e.then==="function"&&typeof e.catch==="function"}function waitForActual(e){return Promise.resolve().then((function(){var t;if(typeof e==="function"){t=e();if(!checkIsPromise(t)){throw new u("instance of Promise","promiseFn",t)}}else if(checkIsPromise(e)){t=e}else{throw new i("promiseFn",["Function","Promise"],e)}return Promise.resolve().then((function(){return t})).then((function(){return I})).catch((function(e){return e}))}))}function expectsError(e,t,r,n){if(typeof r==="string"){if(arguments.length===4){throw new i("error",["Object","Error","Function","RegExp"],r)}if(_typeof(t)==="object"&&t!==null){if(t.message===r){throw new a("error/message",'The error message "'.concat(t.message,'" is identical to the message.'))}}else if(t===r){throw new a("error/message",'The error "'.concat(t,'" is identical to the message.'))}n=r;r=undefined}else if(r!=null&&_typeof(r)!=="object"&&typeof r!=="function"){throw new i("error",["Object","Error","Function","RegExp"],r)}if(t===I){var o="";if(r&&r.name){o+=" (".concat(r.name,")")}o+=n?": ".concat(n):".";var c=e.name==="rejects"?"rejection":"exception";innerFail({actual:undefined,expected:r,operator:e.name,message:"Missing expected ".concat(c).concat(o),stackStartFn:e})}if(r&&!expectedException(t,r,n,e)){throw t}}function expectsNoError(e,t,r,n){if(t===I)return;if(typeof r==="string"){n=r;r=undefined}if(!r||expectedException(t,r)){var o=n?": ".concat(n):".";var a=e.name==="doesNotReject"?"rejection":"exception";innerFail({actual:t,expected:r,operator:e.name,message:"Got unwanted ".concat(a).concat(o,"\n")+'Actual message: "'.concat(t&&t.message,'"'),stackStartFn:e})}throw t}x.throws=function throws(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++){r[n-1]=arguments[n]}expectsError.apply(void 0,[throws,getActual(e)].concat(r))};x.rejects=function rejects(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++){r[n-1]=arguments[n]}return waitForActual(e).then((function(e){return expectsError.apply(void 0,[rejects,e].concat(r))}))};x.doesNotThrow=function doesNotThrow(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++){r[n-1]=arguments[n]}expectsNoError.apply(void 0,[doesNotThrow,getActual(e)].concat(r))};x.doesNotReject=function doesNotReject(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++){r[n-1]=arguments[n]}return waitForActual(e).then((function(e){return expectsNoError.apply(void 0,[doesNotReject,e].concat(r))}))};x.ifError=function ifError(e){if(e!==null&&e!==undefined){var t="ifError got unwanted exception: ";if(_typeof(e)==="object"&&typeof e.message==="string"){if(e.message.length===0&&e.constructor){t+=e.constructor.name}else{t+=e.message}}else{t+=l(e)}var r=new s({actual:e,expected:null,operator:"ifError",message:t,stackStartFn:ifError});var n=e.stack;if(typeof n==="string"){var o=n.split("\n");o.shift();var a=r.stack.split("\n");for(var i=0;i<o.length;i++){var c=a.indexOf(o[i]);if(c!==-1){a=a.slice(0,c);break}}r.stack="".concat(a.join("\n"),"\n").concat(o.join("\n"))}throw r}};function strict(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++){t[r]=arguments[r]}innerOk.apply(void 0,[strict,t.length].concat(t))}x.strict=v(strict,x,{equal:x.strictEqual,deepEqual:x.deepStrictEqual,notEqual:x.notStrictEqual,notDeepEqual:x.notDeepStrictEqual});x.strict.strict=x.strict},298:function(e,t,r){"use strict";function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};var n=Object.keys(r);if(typeof Object.getOwnPropertySymbols==="function"){n=n.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))}n.forEach((function(t){_defineProperty(e,t,r[t])}))}return e}function _defineProperty(e,t,r){if(t in e){Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true})}else{e[t]=r}return e}function _classCallCheck(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function _defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||false;n.configurable=true;if("value"in n)n.writable=true;Object.defineProperty(e,n.key,n)}}function _createClass(e,t,r){if(t)_defineProperties(e.prototype,t);if(r)_defineProperties(e,r);return e}function _possibleConstructorReturn(e,t){if(t&&(_typeof(t)==="object"||typeof t==="function")){return t}return _assertThisInitialized(e)}function _assertThisInitialized(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function _inherits(e,t){if(typeof t!=="function"&&t!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});if(t)_setPrototypeOf(e,t)}function _wrapNativeSuper(e){var t=typeof Map==="function"?new Map:undefined;_wrapNativeSuper=function _wrapNativeSuper(e){if(e===null||!_isNativeFunction(e))return e;if(typeof e!=="function"){throw new TypeError("Super expression must either be null or a function")}if(typeof t!=="undefined"){if(t.has(e))return t.get(e);t.set(e,Wrapper)}function Wrapper(){return _construct(e,arguments,_getPrototypeOf(this).constructor)}Wrapper.prototype=Object.create(e.prototype,{constructor:{value:Wrapper,enumerable:false,writable:true,configurable:true}});return _setPrototypeOf(Wrapper,e)};return _wrapNativeSuper(e)}function isNativeReflectConstruct(){if(typeof Reflect==="undefined"||!Reflect.construct)return false;if(Reflect.construct.sham)return false;if(typeof Proxy==="function")return true;try{Date.prototype.toString.call(Reflect.construct(Date,[],(function(){})));return true}catch(e){return false}}function _construct(e,t,r){if(isNativeReflectConstruct()){_construct=Reflect.construct}else{_construct=function _construct(e,t,r){var n=[null];n.push.apply(n,t);var o=Function.bind.apply(e,n);var a=new o;if(r)_setPrototypeOf(a,r.prototype);return a}}return _construct.apply(null,arguments)}function _isNativeFunction(e){return Function.toString.call(e).indexOf("[native code]")!==-1}function _setPrototypeOf(e,t){_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){e.__proto__=t;return e};return _setPrototypeOf(e,t)}function _getPrototypeOf(e){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)};return _getPrototypeOf(e)}function _typeof(e){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(e){return typeof e}}else{_typeof=function _typeof(e){return e&&typeof Symbol==="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e}}return _typeof(e)}var n=r(650),o=n.inspect;var a=r(823),i=a.codes.ERR_INVALID_ARG_TYPE;function endsWith(e,t,r){if(r===undefined||r>e.length){r=e.length}return e.substring(r-t.length,r)===t}function repeat(e,t){t=Math.floor(t);if(e.length==0||t==0)return"";var r=e.length*t;t=Math.floor(Math.log(t)/Math.log(2));while(t){e+=e;t--}e+=e.substring(0,r-e.length);return e}var c="";var u="";var f="";var s="";var p={deepStrictEqual:"Expected values to be strictly deep-equal:",strictEqual:"Expected values to be strictly equal:",strictEqualObject:'Expected "actual" to be reference-equal to "expected":',deepEqual:"Expected values to be loosely deep-equal:",equal:"Expected values to be loosely equal:",notDeepStrictEqual:'Expected "actual" not to be strictly deep-equal to:',notStrictEqual:'Expected "actual" to be strictly unequal to:',notStrictEqualObject:'Expected "actual" not to be reference-equal to "expected":',notDeepEqual:'Expected "actual" not to be loosely deep-equal to:',notEqual:'Expected "actual" to be loosely unequal to:',notIdentical:"Values identical but not reference-equal:"};var l=10;function copyError(e){var t=Object.keys(e);var r=Object.create(Object.getPrototypeOf(e));t.forEach((function(t){r[t]=e[t]}));Object.defineProperty(r,"message",{value:e.message});return r}function inspectValue(e){return o(e,{compact:false,customInspect:false,depth:1e3,maxArrayLength:Infinity,showHidden:false,breakLength:Infinity,showProxy:false,sorted:true,getters:true})}function createErrDiff(e,t,r){var n="";var o="";var a=0;var i="";var y=false;var d=inspectValue(e);var g=d.split("\n");var v=inspectValue(t).split("\n");var b=0;var h="";if(r==="strictEqual"&&_typeof(e)==="object"&&_typeof(t)==="object"&&e!==null&&t!==null){r="strictEqualObject"}if(g.length===1&&v.length===1&&g[0]!==v[0]){var m=g[0].length+v[0].length;if(m<=l){if((_typeof(e)!=="object"||e===null)&&(_typeof(t)!=="object"||t===null)&&(e!==0||t!==0)){return"".concat(p[r],"\n\n")+"".concat(g[0]," !== ").concat(v[0],"\n")}}else if(r!=="strictEqualObject"){var A=process.stderr&&process.stderr.isTTY?process.stderr.columns:80;if(m<A){while(g[0][b]===v[0][b]){b++}if(b>2){h="\n  ".concat(repeat(" ",b),"^");b=0}}}}var S=g[g.length-1];var E=v[v.length-1];while(S===E){if(b++<2){i="\n  ".concat(S).concat(i)}else{n=S}g.pop();v.pop();if(g.length===0||v.length===0)break;S=g[g.length-1];E=v[v.length-1]}var P=Math.max(g.length,v.length);if(P===0){var w=d.split("\n");if(w.length>30){w[26]="".concat(c,"...").concat(s);while(w.length>27){w.pop()}}return"".concat(p.notIdentical,"\n\n").concat(w.join("\n"),"\n")}if(b>3){i="\n".concat(c,"...").concat(s).concat(i);y=true}if(n!==""){i="\n  ".concat(n).concat(i);n=""}var O=0;var j=p[r]+"\n".concat(u,"+ actual").concat(s," ").concat(f,"- expected").concat(s);var _=" ".concat(c,"...").concat(s," Lines skipped");for(b=0;b<P;b++){var x=b-a;if(g.length<b+1){if(x>1&&b>2){if(x>4){o+="\n".concat(c,"...").concat(s);y=true}else if(x>3){o+="\n  ".concat(v[b-2]);O++}o+="\n  ".concat(v[b-1]);O++}a=b;n+="\n".concat(f,"-").concat(s," ").concat(v[b]);O++}else if(v.length<b+1){if(x>1&&b>2){if(x>4){o+="\n".concat(c,"...").concat(s);y=true}else if(x>3){o+="\n  ".concat(g[b-2]);O++}o+="\n  ".concat(g[b-1]);O++}a=b;o+="\n".concat(u,"+").concat(s," ").concat(g[b]);O++}else{var I=v[b];var F=g[b];var k=F!==I&&(!endsWith(F,",")||F.slice(0,-1)!==I);if(k&&endsWith(I,",")&&I.slice(0,-1)===F){k=false;F+=","}if(k){if(x>1&&b>2){if(x>4){o+="\n".concat(c,"...").concat(s);y=true}else if(x>3){o+="\n  ".concat(g[b-2]);O++}o+="\n  ".concat(g[b-1]);O++}a=b;o+="\n".concat(u,"+").concat(s," ").concat(F);n+="\n".concat(f,"-").concat(s," ").concat(I);O+=2}else{o+=n;n="";if(x===1||b===0){o+="\n  ".concat(F);O++}}}if(O>20&&b<P-2){return"".concat(j).concat(_,"\n").concat(o,"\n").concat(c,"...").concat(s).concat(n,"\n")+"".concat(c,"...").concat(s)}}return"".concat(j).concat(y?_:"","\n").concat(o).concat(n).concat(i).concat(h)}var y=function(e){_inherits(AssertionError,e);function AssertionError(e){var t;_classCallCheck(this,AssertionError);if(_typeof(e)!=="object"||e===null){throw new i("options","Object",e)}var r=e.message,n=e.operator,o=e.stackStartFn;var a=e.actual,l=e.expected;var y=Error.stackTraceLimit;Error.stackTraceLimit=0;if(r!=null){t=_possibleConstructorReturn(this,_getPrototypeOf(AssertionError).call(this,String(r)))}else{if(process.stderr&&process.stderr.isTTY){if(process.stderr&&process.stderr.getColorDepth&&process.stderr.getColorDepth()!==1){c="[34m";u="[32m";s="[39m";f="[31m"}else{c="";u="";s="";f=""}}if(_typeof(a)==="object"&&a!==null&&_typeof(l)==="object"&&l!==null&&"stack"in a&&a instanceof Error&&"stack"in l&&l instanceof Error){a=copyError(a);l=copyError(l)}if(n==="deepStrictEqual"||n==="strictEqual"){t=_possibleConstructorReturn(this,_getPrototypeOf(AssertionError).call(this,createErrDiff(a,l,n)))}else if(n==="notDeepStrictEqual"||n==="notStrictEqual"){var d=p[n];var g=inspectValue(a).split("\n");if(n==="notStrictEqual"&&_typeof(a)==="object"&&a!==null){d=p.notStrictEqualObject}if(g.length>30){g[26]="".concat(c,"...").concat(s);while(g.length>27){g.pop()}}if(g.length===1){t=_possibleConstructorReturn(this,_getPrototypeOf(AssertionError).call(this,"".concat(d," ").concat(g[0])))}else{t=_possibleConstructorReturn(this,_getPrototypeOf(AssertionError).call(this,"".concat(d,"\n\n").concat(g.join("\n"),"\n")))}}else{var v=inspectValue(a);var b="";var h=p[n];if(n==="notDeepEqual"||n==="notEqual"){v="".concat(p[n],"\n\n").concat(v);if(v.length>1024){v="".concat(v.slice(0,1021),"...")}}else{b="".concat(inspectValue(l));if(v.length>512){v="".concat(v.slice(0,509),"...")}if(b.length>512){b="".concat(b.slice(0,509),"...")}if(n==="deepEqual"||n==="equal"){v="".concat(h,"\n\n").concat(v,"\n\nshould equal\n\n")}else{b=" ".concat(n," ").concat(b)}}t=_possibleConstructorReturn(this,_getPrototypeOf(AssertionError).call(this,"".concat(v).concat(b)))}}Error.stackTraceLimit=y;t.generatedMessage=!r;Object.defineProperty(_assertThisInitialized(t),"name",{value:"AssertionError [ERR_ASSERTION]",enumerable:false,writable:true,configurable:true});t.code="ERR_ASSERTION";t.actual=a;t.expected=l;t.operator=n;if(Error.captureStackTrace){Error.captureStackTrace(_assertThisInitialized(t),o)}t.stack;t.name="AssertionError";return _possibleConstructorReturn(t)}_createClass(AssertionError,[{key:"toString",value:function toString(){return"".concat(this.name," [").concat(this.code,"]: ").concat(this.message)}},{key:o.custom,value:function value(e,t){return o(this,_objectSpread({},t,{customInspect:false,depth:0}))}}]);return AssertionError}(_wrapNativeSuper(Error));e.exports=y},823:function(e,t,r){"use strict";function _typeof(e){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(e){return typeof e}}else{_typeof=function _typeof(e){return e&&typeof Symbol==="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e}}return _typeof(e)}function _classCallCheck(e,t){if(!(e instanceof t)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(e,t){if(t&&(_typeof(t)==="object"||typeof t==="function")){return t}return _assertThisInitialized(e)}function _assertThisInitialized(e){if(e===void 0){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return e}function _getPrototypeOf(e){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(e){return e.__proto__||Object.getPrototypeOf(e)};return _getPrototypeOf(e)}function _inherits(e,t){if(typeof t!=="function"&&t!==null){throw new TypeError("Super expression must either be null or a function")}e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}});if(t)_setPrototypeOf(e,t)}function _setPrototypeOf(e,t){_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){e.__proto__=t;return e};return _setPrototypeOf(e,t)}var n={};var o;var a;function createErrorType(e,t,r){if(!r){r=Error}function getMessage(e,r,n){if(typeof t==="string"){return t}else{return t(e,r,n)}}var o=function(t){_inherits(NodeError,t);function NodeError(t,r,n){var o;_classCallCheck(this,NodeError);o=_possibleConstructorReturn(this,_getPrototypeOf(NodeError).call(this,getMessage(t,r,n)));o.code=e;return o}return NodeError}(r);n[e]=o}function oneOf(e,t){if(Array.isArray(e)){var r=e.length;e=e.map((function(e){return String(e)}));if(r>2){return"one of ".concat(t," ").concat(e.slice(0,r-1).join(", "),", or ")+e[r-1]}else if(r===2){return"one of ".concat(t," ").concat(e[0]," or ").concat(e[1])}else{return"of ".concat(t," ").concat(e[0])}}else{return"of ".concat(t," ").concat(String(e))}}function startsWith(e,t,r){return e.substr(!r||r<0?0:+r,t.length)===t}function endsWith(e,t,r){if(r===undefined||r>e.length){r=e.length}return e.substring(r-t.length,r)===t}function includes(e,t,r){if(typeof r!=="number"){r=0}if(r+t.length>e.length){return false}else{return e.indexOf(t,r)!==-1}}createErrorType("ERR_AMBIGUOUS_ARGUMENT",'The "%s" argument is ambiguous. %s',TypeError);createErrorType("ERR_INVALID_ARG_TYPE",(function(e,t,n){if(o===undefined)o=r(313);o(typeof e==="string","'name' must be a string");var a;if(typeof t==="string"&&startsWith(t,"not ")){a="must not be";t=t.replace(/^not /,"")}else{a="must be"}var i;if(endsWith(e," argument")){i="The ".concat(e," ").concat(a," ").concat(oneOf(t,"type"))}else{var c=includes(e,".")?"property":"argument";i='The "'.concat(e,'" ').concat(c," ").concat(a," ").concat(oneOf(t,"type"))}i+=". Received type ".concat(_typeof(n));return i}),TypeError);createErrorType("ERR_INVALID_ARG_VALUE",(function(e,t){var n=arguments.length>2&&arguments[2]!==undefined?arguments[2]:"is invalid";if(a===undefined)a=r(650);var o=a.inspect(t);if(o.length>128){o="".concat(o.slice(0,128),"...")}return"The argument '".concat(e,"' ").concat(n,". Received ").concat(o)}),TypeError,RangeError);createErrorType("ERR_INVALID_RETURN_VALUE",(function(e,t,r){var n;if(r&&r.constructor&&r.constructor.name){n="instance of ".concat(r.constructor.name)}else{n="type ".concat(_typeof(r))}return"Expected ".concat(e,' to be returned from the "').concat(t,'"')+" function but got ".concat(n,".")}),TypeError);createErrorType("ERR_MISSING_ARGS",(function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++){t[n]=arguments[n]}if(o===undefined)o=r(313);o(t.length>0,"At least one arg needs to be specified");var a="The ";var i=t.length;t=t.map((function(e){return'"'.concat(e,'"')}));switch(i){case 1:a+="".concat(t[0]," argument");break;case 2:a+="".concat(t[0]," and ").concat(t[1]," arguments");break;default:a+=t.slice(0,i-1).join(", ");a+=", and ".concat(t[i-1]," arguments");break}return"".concat(a," must be specified")}),TypeError);e.exports.codes=n},655:function(e,t,r){"use strict";function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function _iterableToArrayLimit(e,t){var r=[];var n=true;var o=false;var a=undefined;try{for(var i=e[Symbol.iterator](),c;!(n=(c=i.next()).done);n=true){r.push(c.value);if(t&&r.length===t)break}}catch(e){o=true;a=e}finally{try{if(!n&&i["return"]!=null)i["return"]()}finally{if(o)throw a}}return r}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _typeof(e){if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(e){return typeof e}}else{_typeof=function _typeof(e){return e&&typeof Symbol==="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e}}return _typeof(e)}var n=/a/g.flags!==undefined;var o=function arrayFromSet(e){var t=[];e.forEach((function(e){return t.push(e)}));return t};var a=function arrayFromMap(e){var t=[];e.forEach((function(e,r){return t.push([r,e])}));return t};var i=Object.is?Object.is:r(450);var c=Object.getOwnPropertySymbols?Object.getOwnPropertySymbols:function(){return[]};var u=Number.isNaN?Number.isNaN:r(674);function uncurryThis(e){return e.call.bind(e)}var f=uncurryThis(Object.prototype.hasOwnProperty);var s=uncurryThis(Object.prototype.propertyIsEnumerable);var p=uncurryThis(Object.prototype.toString);var l=r(650).types,y=l.isAnyArrayBuffer,d=l.isArrayBufferView,g=l.isDate,v=l.isMap,b=l.isRegExp,h=l.isSet,m=l.isNativeError,A=l.isBoxedPrimitive,S=l.isNumberObject,E=l.isStringObject,P=l.isBooleanObject,w=l.isBigIntObject,O=l.isSymbolObject,j=l.isFloat32Array,_=l.isFloat64Array;function isNonIndex(e){if(e.length===0||e.length>10)return true;for(var t=0;t<e.length;t++){var r=e.charCodeAt(t);if(r<48||r>57)return true}return e.length===10&&e>=Math.pow(2,32)}function getOwnNonIndexProperties(e){return Object.keys(e).filter(isNonIndex).concat(c(e).filter(Object.prototype.propertyIsEnumerable.bind(e)))}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */function compare(e,t){if(e===t){return 0}var r=e.length;var n=t.length;for(var o=0,a=Math.min(r,n);o<a;++o){if(e[o]!==t[o]){r=e[o];n=t[o];break}}if(r<n){return-1}if(n<r){return 1}return 0}var x=undefined;var I=true;var F=false;var k=0;var R=1;var T=2;var N=3;function areSimilarRegExps(e,t){return n?e.source===t.source&&e.flags===t.flags:RegExp.prototype.toString.call(e)===RegExp.prototype.toString.call(t)}function areSimilarFloatArrays(e,t){if(e.byteLength!==t.byteLength){return false}for(var r=0;r<e.byteLength;r++){if(e[r]!==t[r]){return false}}return true}function areSimilarTypedArrays(e,t){if(e.byteLength!==t.byteLength){return false}return compare(new Uint8Array(e.buffer,e.byteOffset,e.byteLength),new Uint8Array(t.buffer,t.byteOffset,t.byteLength))===0}function areEqualArrayBuffers(e,t){return e.byteLength===t.byteLength&&compare(new Uint8Array(e),new Uint8Array(t))===0}function isEqualBoxedPrimitive(e,t){if(S(e)){return S(t)&&i(Number.prototype.valueOf.call(e),Number.prototype.valueOf.call(t))}if(E(e)){return E(t)&&String.prototype.valueOf.call(e)===String.prototype.valueOf.call(t)}if(P(e)){return P(t)&&Boolean.prototype.valueOf.call(e)===Boolean.prototype.valueOf.call(t)}if(w(e)){return w(t)&&BigInt.prototype.valueOf.call(e)===BigInt.prototype.valueOf.call(t)}return O(t)&&Symbol.prototype.valueOf.call(e)===Symbol.prototype.valueOf.call(t)}function innerDeepEqual(e,t,r,n){if(e===t){if(e!==0)return true;return r?i(e,t):true}if(r){if(_typeof(e)!=="object"){return typeof e==="number"&&u(e)&&u(t)}if(_typeof(t)!=="object"||e===null||t===null){return false}if(Object.getPrototypeOf(e)!==Object.getPrototypeOf(t)){return false}}else{if(e===null||_typeof(e)!=="object"){if(t===null||_typeof(t)!=="object"){return e==t}return false}if(t===null||_typeof(t)!=="object"){return false}}var o=p(e);var a=p(t);if(o!==a){return false}if(Array.isArray(e)){if(e.length!==t.length){return false}var c=getOwnNonIndexProperties(e,x);var f=getOwnNonIndexProperties(t,x);if(c.length!==f.length){return false}return keyCheck(e,t,r,n,R,c)}if(o==="[object Object]"){if(!v(e)&&v(t)||!h(e)&&h(t)){return false}}if(g(e)){if(!g(t)||Date.prototype.getTime.call(e)!==Date.prototype.getTime.call(t)){return false}}else if(b(e)){if(!b(t)||!areSimilarRegExps(e,t)){return false}}else if(m(e)||e instanceof Error){if(e.message!==t.message||e.name!==t.name){return false}}else if(d(e)){if(!r&&(j(e)||_(e))){if(!areSimilarFloatArrays(e,t)){return false}}else if(!areSimilarTypedArrays(e,t)){return false}var s=getOwnNonIndexProperties(e,x);var l=getOwnNonIndexProperties(t,x);if(s.length!==l.length){return false}return keyCheck(e,t,r,n,k,s)}else if(h(e)){if(!h(t)||e.size!==t.size){return false}return keyCheck(e,t,r,n,T)}else if(v(e)){if(!v(t)||e.size!==t.size){return false}return keyCheck(e,t,r,n,N)}else if(y(e)){if(!areEqualArrayBuffers(e,t)){return false}}else if(A(e)&&!isEqualBoxedPrimitive(e,t)){return false}return keyCheck(e,t,r,n,k)}function getEnumerables(e,t){return t.filter((function(t){return s(e,t)}))}function keyCheck(e,t,r,n,o,a){if(arguments.length===5){a=Object.keys(e);var i=Object.keys(t);if(a.length!==i.length){return false}}var u=0;for(;u<a.length;u++){if(!f(t,a[u])){return false}}if(r&&arguments.length===5){var p=c(e);if(p.length!==0){var l=0;for(u=0;u<p.length;u++){var y=p[u];if(s(e,y)){if(!s(t,y)){return false}a.push(y);l++}else if(s(t,y)){return false}}var d=c(t);if(p.length!==d.length&&getEnumerables(t,d).length!==l){return false}}else{var g=c(t);if(g.length!==0&&getEnumerables(t,g).length!==0){return false}}}if(a.length===0&&(o===k||o===R&&e.length===0||e.size===0)){return true}if(n===undefined){n={val1:new Map,val2:new Map,position:0}}else{var v=n.val1.get(e);if(v!==undefined){var b=n.val2.get(t);if(b!==undefined){return v===b}}n.position++}n.val1.set(e,n.position);n.val2.set(t,n.position);var h=objEquiv(e,t,r,a,n,o);n.val1.delete(e);n.val2.delete(t);return h}function setHasEqualElement(e,t,r,n){var a=o(e);for(var i=0;i<a.length;i++){var c=a[i];if(innerDeepEqual(t,c,r,n)){e.delete(c);return true}}return false}function findLooseMatchingPrimitives(e){switch(_typeof(e)){case"undefined":return null;case"object":return undefined;case"symbol":return false;case"string":e=+e;case"number":if(u(e)){return false}}return true}function setMightHaveLoosePrim(e,t,r){var n=findLooseMatchingPrimitives(r);if(n!=null)return n;return t.has(n)&&!e.has(n)}function mapMightHaveLoosePrim(e,t,r,n,o){var a=findLooseMatchingPrimitives(r);if(a!=null){return a}var i=t.get(a);if(i===undefined&&!t.has(a)||!innerDeepEqual(n,i,false,o)){return false}return!e.has(a)&&innerDeepEqual(n,i,false,o)}function setEquiv(e,t,r,n){var a=null;var i=o(e);for(var c=0;c<i.length;c++){var u=i[c];if(_typeof(u)==="object"&&u!==null){if(a===null){a=new Set}a.add(u)}else if(!t.has(u)){if(r)return false;if(!setMightHaveLoosePrim(e,t,u)){return false}if(a===null){a=new Set}a.add(u)}}if(a!==null){var f=o(t);for(var s=0;s<f.length;s++){var p=f[s];if(_typeof(p)==="object"&&p!==null){if(!setHasEqualElement(a,p,r,n))return false}else if(!r&&!e.has(p)&&!setHasEqualElement(a,p,r,n)){return false}}return a.size===0}return true}function mapHasEqualEntry(e,t,r,n,a,i){var c=o(e);for(var u=0;u<c.length;u++){var f=c[u];if(innerDeepEqual(r,f,a,i)&&innerDeepEqual(n,t.get(f),a,i)){e.delete(f);return true}}return false}function mapEquiv(e,t,r,n){var o=null;var i=a(e);for(var c=0;c<i.length;c++){var u=_slicedToArray(i[c],2),f=u[0],s=u[1];if(_typeof(f)==="object"&&f!==null){if(o===null){o=new Set}o.add(f)}else{var p=t.get(f);if(p===undefined&&!t.has(f)||!innerDeepEqual(s,p,r,n)){if(r)return false;if(!mapMightHaveLoosePrim(e,t,f,s,n))return false;if(o===null){o=new Set}o.add(f)}}}if(o!==null){var l=a(t);for(var y=0;y<l.length;y++){var d=_slicedToArray(l[y],2),f=d[0],g=d[1];if(_typeof(f)==="object"&&f!==null){if(!mapHasEqualEntry(o,e,f,g,r,n))return false}else if(!r&&(!e.has(f)||!innerDeepEqual(e.get(f),g,false,n))&&!mapHasEqualEntry(o,e,f,g,false,n)){return false}}return o.size===0}return true}function objEquiv(e,t,r,n,o,a){var i=0;if(a===T){if(!setEquiv(e,t,r,o)){return false}}else if(a===N){if(!mapEquiv(e,t,r,o)){return false}}else if(a===R){for(;i<e.length;i++){if(f(e,i)){if(!f(t,i)||!innerDeepEqual(e[i],t[i],r,o)){return false}}else if(f(t,i)){return false}else{var c=Object.keys(e);for(;i<c.length;i++){var u=c[i];if(!f(t,u)||!innerDeepEqual(e[u],t[u],r,o)){return false}}if(c.length!==Object.keys(t).length){return false}return true}}}for(i=0;i<n.length;i++){var s=n[i];if(!innerDeepEqual(e[s],t[s],r,o)){return false}}return true}function isDeepEqual(e,t){return innerDeepEqual(e,t,F)}function isDeepStrictEqual(e,t){return innerDeepEqual(e,t,I)}e.exports={isDeepEqual:isDeepEqual,isDeepStrictEqual:isDeepStrictEqual}},749:function(e,t,r){"use strict";var n=r(91);var o=r(112);var a=o(n("String.prototype.indexOf"));e.exports=function callBoundIntrinsic(e,t){var r=n(e,!!t);if(typeof r==="function"&&a(e,".prototype.")>-1){return o(r)}return r}},112:function(e,t,r){"use strict";var n=r(517);var o=r(91);var a=o("%Function.prototype.apply%");var i=o("%Function.prototype.call%");var c=o("%Reflect.apply%",true)||n.call(i,a);var u=o("%Object.getOwnPropertyDescriptor%",true);var f=o("%Object.defineProperty%",true);var s=o("%Math.max%");if(f){try{f({},"a",{value:1})}catch(e){f=null}}e.exports=function callBind(e){var t=c(n,i,arguments);if(u&&f){var r=u(t,"length");if(r.configurable){f(t,"length",{value:1+s(0,e.length-(arguments.length-1))})}}return t};var p=function applyBind(){return c(n,a,arguments)};if(f){f(e.exports,"apply",{value:p})}else{e.exports.apply=p}},91:function(e,t,r){"use strict";var n;var o=SyntaxError;var a=Function;var i=TypeError;var getEvalledConstructor=function(e){try{return Function('"use strict"; return ('+e+").constructor;")()}catch(e){}};var c=Object.getOwnPropertyDescriptor;if(c){try{c({},"")}catch(e){c=null}}var throwTypeError=function(){throw new i};var u=c?function(){try{arguments.callee;return throwTypeError}catch(e){try{return c(arguments,"callee").get}catch(e){return throwTypeError}}}():throwTypeError;var f=r(449)();var s=Object.getPrototypeOf||function(e){return e.__proto__};var p=getEvalledConstructor("async function* () {}");var l=p?p.prototype:n;var y=l?l.prototype:n;var d=typeof Uint8Array==="undefined"?n:s(Uint8Array);var g={"%AggregateError%":typeof AggregateError==="undefined"?n:AggregateError,"%Array%":Array,"%ArrayBuffer%":typeof ArrayBuffer==="undefined"?n:ArrayBuffer,"%ArrayIteratorPrototype%":f?s([][Symbol.iterator]()):n,"%AsyncFromSyncIteratorPrototype%":n,"%AsyncFunction%":getEvalledConstructor("async function () {}"),"%AsyncGenerator%":l,"%AsyncGeneratorFunction%":p,"%AsyncIteratorPrototype%":y?s(y):n,"%Atomics%":typeof Atomics==="undefined"?n:Atomics,"%BigInt%":typeof BigInt==="undefined"?n:BigInt,"%Boolean%":Boolean,"%DataView%":typeof DataView==="undefined"?n:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":typeof Float32Array==="undefined"?n:Float32Array,"%Float64Array%":typeof Float64Array==="undefined"?n:Float64Array,"%FinalizationRegistry%":typeof FinalizationRegistry==="undefined"?n:FinalizationRegistry,"%Function%":a,"%GeneratorFunction%":getEvalledConstructor("function* () {}"),"%Int8Array%":typeof Int8Array==="undefined"?n:Int8Array,"%Int16Array%":typeof Int16Array==="undefined"?n:Int16Array,"%Int32Array%":typeof Int32Array==="undefined"?n:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":f?s(s([][Symbol.iterator]())):n,"%JSON%":typeof JSON==="object"?JSON:n,"%Map%":typeof Map==="undefined"?n:Map,"%MapIteratorPrototype%":typeof Map==="undefined"||!f?n:s((new Map)[Symbol.iterator]()),"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":typeof Promise==="undefined"?n:Promise,"%Proxy%":typeof Proxy==="undefined"?n:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":typeof Reflect==="undefined"?n:Reflect,"%RegExp%":RegExp,"%Set%":typeof Set==="undefined"?n:Set,"%SetIteratorPrototype%":typeof Set==="undefined"||!f?n:s((new Set)[Symbol.iterator]()),"%SharedArrayBuffer%":typeof SharedArrayBuffer==="undefined"?n:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":f?s(""[Symbol.iterator]()):n,"%Symbol%":f?Symbol:n,"%SyntaxError%":o,"%ThrowTypeError%":u,"%TypedArray%":d,"%TypeError%":i,"%Uint8Array%":typeof Uint8Array==="undefined"?n:Uint8Array,"%Uint8ClampedArray%":typeof Uint8ClampedArray==="undefined"?n:Uint8ClampedArray,"%Uint16Array%":typeof Uint16Array==="undefined"?n:Uint16Array,"%Uint32Array%":typeof Uint32Array==="undefined"?n:Uint32Array,"%URIError%":URIError,"%WeakMap%":typeof WeakMap==="undefined"?n:WeakMap,"%WeakRef%":typeof WeakRef==="undefined"?n:WeakRef,"%WeakSet%":typeof WeakSet==="undefined"?n:WeakSet};var v={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]};var b=r(517);var h=r(793);var m=b.call(Function.call,Array.prototype.concat);var A=b.call(Function.apply,Array.prototype.splice);var S=b.call(Function.call,String.prototype.replace);var E=b.call(Function.call,String.prototype.slice);var P=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;var w=/\\(\\)?/g;var O=function stringToPath(e){var t=E(e,0,1);var r=E(e,-1);if(t==="%"&&r!=="%"){throw new o("invalid intrinsic syntax, expected closing `%`")}else if(r==="%"&&t!=="%"){throw new o("invalid intrinsic syntax, expected opening `%`")}var n=[];S(e,P,(function(e,t,r,o){n[n.length]=r?S(o,w,"$1"):t||e}));return n};var j=function getBaseIntrinsic(e,t){var r=e;var n;if(h(v,r)){n=v[r];r="%"+n[0]+"%"}if(h(g,r)){var a=g[r];if(typeof a==="undefined"&&!t){throw new i("intrinsic "+e+" exists, but is not available. Please file an issue!")}return{alias:n,name:r,value:a}}throw new o("intrinsic "+e+" does not exist!")};e.exports=function GetIntrinsic(e,t){if(typeof e!=="string"||e.length===0){throw new i("intrinsic name must be a non-empty string")}if(arguments.length>1&&typeof t!=="boolean"){throw new i('"allowMissing" argument must be a boolean')}var r=O(e);var a=r.length>0?r[0]:"";var u=j("%"+a+"%",t);var f=u.name;var s=u.value;var p=false;var l=u.alias;if(l){a=l[0];A(r,m([0,1],l))}for(var y=1,d=true;y<r.length;y+=1){var v=r[y];var b=E(v,0,1);var S=E(v,-1);if((b==='"'||b==="'"||b==="`"||(S==='"'||S==="'"||S==="`"))&&b!==S){throw new o("property names with quotes must have matching quotes")}if(v==="constructor"||!d){p=true}a+="."+v;f="%"+a+"%";if(h(g,f)){s=g[f]}else if(s!=null){if(!(v in s)){if(!t){throw new i("base intrinsic for "+e+" exists, but the property is not available.")}return void n}if(c&&y+1>=r.length){var P=c(s,v);d=!!P;if(d&&"get"in P&&!("originalValue"in P.get)){s=P.get}else{s=s[v]}}else{d=h(s,v);s=s[v]}if(d&&!p){g[f]=s}}}return s}},961:function(e,t,r){"use strict";var n=r(283);var o=typeof Symbol==="function"&&typeof Symbol("foo")==="symbol";var a=Object.prototype.toString;var i=Array.prototype.concat;var c=Object.defineProperty;var isFunction=function(e){return typeof e==="function"&&a.call(e)==="[object Function]"};var arePropertyDescriptorsSupported=function(){var e={};try{c(e,"x",{enumerable:false,value:e});for(var t in e){return false}return e.x===e}catch(e){return false}};var u=c&&arePropertyDescriptorsSupported();var defineProperty=function(e,t,r,n){if(t in e&&(!isFunction(n)||!n())){return}if(u){c(e,t,{configurable:true,enumerable:false,value:r,writable:true})}else{e[t]=r}};var defineProperties=function(e,t){var r=arguments.length>2?arguments[2]:{};var a=n(t);if(o){a=i.call(a,Object.getOwnPropertySymbols(t))}for(var c=0;c<a.length;c+=1){defineProperty(e,a[c],t[a[c]],r[a[c]])}};defineProperties.supportsDescriptors=!!u;e.exports=defineProperties},274:function(e){"use strict";function assign(e,t){if(e===undefined||e===null){throw new TypeError("Cannot convert first argument to object")}var r=Object(e);for(var n=1;n<arguments.length;n++){var o=arguments[n];if(o===undefined||o===null){continue}var a=Object.keys(Object(o));for(var i=0,c=a.length;i<c;i++){var u=a[i];var f=Object.getOwnPropertyDescriptor(o,u);if(f!==undefined&&f.enumerable){r[u]=o[u]}}}return r}function polyfill(){if(!Object.assign){Object.defineProperty(Object,"assign",{enumerable:false,configurable:true,writable:true,value:assign})}}e.exports={assign:assign,polyfill:polyfill}},219:function(e){var t=Object.prototype.hasOwnProperty;var r=Object.prototype.toString;e.exports=function forEach(e,n,o){if(r.call(n)!=="[object Function]"){throw new TypeError("iterator must be a function")}var a=e.length;if(a===+a){for(var i=0;i<a;i++){n.call(o,e[i],i,e)}}else{for(var c in e){if(t.call(e,c)){n.call(o,e[c],c,e)}}}}},733:function(e){"use strict";var t="Function.prototype.bind called on incompatible ";var r=Array.prototype.slice;var n=Object.prototype.toString;var o="[object Function]";e.exports=function bind(e){var a=this;if(typeof a!=="function"||n.call(a)!==o){throw new TypeError(t+a)}var i=r.call(arguments,1);var c;var binder=function(){if(this instanceof c){var t=a.apply(this,i.concat(r.call(arguments)));if(Object(t)===t){return t}return this}else{return a.apply(e,i.concat(r.call(arguments)))}};var u=Math.max(0,a.length-i.length);var f=[];for(var s=0;s<u;s++){f.push("$"+s)}c=Function("binder","return function ("+f.join(",")+"){ return binder.apply(this,arguments); }")(binder);if(a.prototype){var p=function Empty(){};p.prototype=a.prototype;c.prototype=new p;p.prototype=null}return c}},517:function(e,t,r){"use strict";var n=r(733);e.exports=Function.prototype.bind||n},879:function(e,t,r){"use strict";var n;var o=SyntaxError;var a=Function;var i=TypeError;var getEvalledConstructor=function(e){try{return a('"use strict"; return ('+e+").constructor;")()}catch(e){}};var c=Object.getOwnPropertyDescriptor;if(c){try{c({},"")}catch(e){c=null}}var throwTypeError=function(){throw new i};var u=c?function(){try{arguments.callee;return throwTypeError}catch(e){try{return c(arguments,"callee").get}catch(e){return throwTypeError}}}():throwTypeError;var f=r(449)();var s=Object.getPrototypeOf||function(e){return e.__proto__};var p={};var l=typeof Uint8Array==="undefined"?n:s(Uint8Array);var y={"%AggregateError%":typeof AggregateError==="undefined"?n:AggregateError,"%Array%":Array,"%ArrayBuffer%":typeof ArrayBuffer==="undefined"?n:ArrayBuffer,"%ArrayIteratorPrototype%":f?s([][Symbol.iterator]()):n,"%AsyncFromSyncIteratorPrototype%":n,"%AsyncFunction%":p,"%AsyncGenerator%":p,"%AsyncGeneratorFunction%":p,"%AsyncIteratorPrototype%":p,"%Atomics%":typeof Atomics==="undefined"?n:Atomics,"%BigInt%":typeof BigInt==="undefined"?n:BigInt,"%Boolean%":Boolean,"%DataView%":typeof DataView==="undefined"?n:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":typeof Float32Array==="undefined"?n:Float32Array,"%Float64Array%":typeof Float64Array==="undefined"?n:Float64Array,"%FinalizationRegistry%":typeof FinalizationRegistry==="undefined"?n:FinalizationRegistry,"%Function%":a,"%GeneratorFunction%":p,"%Int8Array%":typeof Int8Array==="undefined"?n:Int8Array,"%Int16Array%":typeof Int16Array==="undefined"?n:Int16Array,"%Int32Array%":typeof Int32Array==="undefined"?n:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":f?s(s([][Symbol.iterator]())):n,"%JSON%":typeof JSON==="object"?JSON:n,"%Map%":typeof Map==="undefined"?n:Map,"%MapIteratorPrototype%":typeof Map==="undefined"||!f?n:s((new Map)[Symbol.iterator]()),"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":typeof Promise==="undefined"?n:Promise,"%Proxy%":typeof Proxy==="undefined"?n:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":typeof Reflect==="undefined"?n:Reflect,"%RegExp%":RegExp,"%Set%":typeof Set==="undefined"?n:Set,"%SetIteratorPrototype%":typeof Set==="undefined"||!f?n:s((new Set)[Symbol.iterator]()),"%SharedArrayBuffer%":typeof SharedArrayBuffer==="undefined"?n:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":f?s(""[Symbol.iterator]()):n,"%Symbol%":f?Symbol:n,"%SyntaxError%":o,"%ThrowTypeError%":u,"%TypedArray%":l,"%TypeError%":i,"%Uint8Array%":typeof Uint8Array==="undefined"?n:Uint8Array,"%Uint8ClampedArray%":typeof Uint8ClampedArray==="undefined"?n:Uint8ClampedArray,"%Uint16Array%":typeof Uint16Array==="undefined"?n:Uint16Array,"%Uint32Array%":typeof Uint32Array==="undefined"?n:Uint32Array,"%URIError%":URIError,"%WeakMap%":typeof WeakMap==="undefined"?n:WeakMap,"%WeakRef%":typeof WeakRef==="undefined"?n:WeakRef,"%WeakSet%":typeof WeakSet==="undefined"?n:WeakSet};var d=function doEval(e){var t;if(e==="%AsyncFunction%"){t=getEvalledConstructor("async function () {}")}else if(e==="%GeneratorFunction%"){t=getEvalledConstructor("function* () {}")}else if(e==="%AsyncGeneratorFunction%"){t=getEvalledConstructor("async function* () {}")}else if(e==="%AsyncGenerator%"){var r=doEval("%AsyncGeneratorFunction%");if(r){t=r.prototype}}else if(e==="%AsyncIteratorPrototype%"){var n=doEval("%AsyncGenerator%");if(n){t=s(n.prototype)}}y[e]=t;return t};var g={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]};var v=r(517);var b=r(793);var h=v.call(Function.call,Array.prototype.concat);var m=v.call(Function.apply,Array.prototype.splice);var A=v.call(Function.call,String.prototype.replace);var S=v.call(Function.call,String.prototype.slice);var E=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;var P=/\\(\\)?/g;var w=function stringToPath(e){var t=S(e,0,1);var r=S(e,-1);if(t==="%"&&r!=="%"){throw new o("invalid intrinsic syntax, expected closing `%`")}else if(r==="%"&&t!=="%"){throw new o("invalid intrinsic syntax, expected opening `%`")}var n=[];A(e,E,(function(e,t,r,o){n[n.length]=r?A(o,P,"$1"):t||e}));return n};var O=function getBaseIntrinsic(e,t){var r=e;var n;if(b(g,r)){n=g[r];r="%"+n[0]+"%"}if(b(y,r)){var a=y[r];if(a===p){a=d(r)}if(typeof a==="undefined"&&!t){throw new i("intrinsic "+e+" exists, but is not available. Please file an issue!")}return{alias:n,name:r,value:a}}throw new o("intrinsic "+e+" does not exist!")};e.exports=function GetIntrinsic(e,t){if(typeof e!=="string"||e.length===0){throw new i("intrinsic name must be a non-empty string")}if(arguments.length>1&&typeof t!=="boolean"){throw new i('"allowMissing" argument must be a boolean')}var r=w(e);var a=r.length>0?r[0]:"";var u=O("%"+a+"%",t);var f=u.name;var s=u.value;var p=false;var l=u.alias;if(l){a=l[0];m(r,h([0,1],l))}for(var d=1,g=true;d<r.length;d+=1){var v=r[d];var A=S(v,0,1);var E=S(v,-1);if((A==='"'||A==="'"||A==="`"||(E==='"'||E==="'"||E==="`"))&&A!==E){throw new o("property names with quotes must have matching quotes")}if(v==="constructor"||!g){p=true}a+="."+v;f="%"+a+"%";if(b(y,f)){s=y[f]}else if(s!=null){if(!(v in s)){if(!t){throw new i("base intrinsic for "+e+" exists, but the property is not available.")}return void n}if(c&&d+1>=r.length){var P=c(s,v);g=!!P;if(g&&"get"in P&&!("originalValue"in P.get)){s=P.get}else{s=s[v]}}else{g=b(s,v);s=s[v]}if(g&&!p){y[f]=s}}}return s}},449:function(e,t,r){"use strict";var n=__webpack_require__.g.Symbol;var o=r(545);e.exports=function hasNativeSymbols(){if(typeof n!=="function"){return false}if(typeof Symbol!=="function"){return false}if(typeof n("foo")!=="symbol"){return false}if(typeof Symbol("bar")!=="symbol"){return false}return o()}},545:function(e){"use strict";e.exports=function hasSymbols(){if(typeof Symbol!=="function"||typeof Object.getOwnPropertySymbols!=="function"){return false}if(typeof Symbol.iterator==="symbol"){return true}var e={};var t=Symbol("test");var r=Object(t);if(typeof t==="string"){return false}if(Object.prototype.toString.call(t)!=="[object Symbol]"){return false}if(Object.prototype.toString.call(r)!=="[object Symbol]"){return false}var n=42;e[t]=n;for(t in e){return false}if(typeof Object.keys==="function"&&Object.keys(e).length!==0){return false}if(typeof Object.getOwnPropertyNames==="function"&&Object.getOwnPropertyNames(e).length!==0){return false}var o=Object.getOwnPropertySymbols(e);if(o.length!==1||o[0]!==t){return false}if(!Object.prototype.propertyIsEnumerable.call(e,t)){return false}if(typeof Object.getOwnPropertyDescriptor==="function"){var a=Object.getOwnPropertyDescriptor(e,t);if(a.value!==n||a.enumerable!==true){return false}}return true}},793:function(e,t,r){"use strict";var n=r(517);e.exports=n.call(Function.call,Object.prototype.hasOwnProperty)},526:function(e){if(typeof Object.create==="function"){e.exports=function inherits(e,t){if(t){e.super_=t;e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:false,writable:true,configurable:true}})}}}else{e.exports=function inherits(e,t){if(t){e.super_=t;var TempCtor=function(){};TempCtor.prototype=t.prototype;e.prototype=new TempCtor;e.prototype.constructor=e}}}},312:function(e){"use strict";var t=typeof Symbol==="function"&&typeof Symbol.toStringTag==="symbol";var r=Object.prototype.toString;var n=function isArguments(e){if(t&&e&&typeof e==="object"&&Symbol.toStringTag in e){return false}return r.call(e)==="[object Arguments]"};var o=function isArguments(e){if(n(e)){return true}return e!==null&&typeof e==="object"&&typeof e.length==="number"&&e.length>=0&&r.call(e)!=="[object Array]"&&r.call(e.callee)==="[object Function]"};var a=function(){return n(arguments)}();n.isLegacyArguments=o;e.exports=a?n:o},906:function(e){"use strict";var t=Object.prototype.toString;var r=Function.prototype.toString;var n=/^\s*(?:function)?\*/;var o=typeof Symbol==="function"&&typeof Symbol.toStringTag==="symbol";var a=Object.getPrototypeOf;var getGeneratorFunc=function(){if(!o){return false}try{return Function("return function*() {}")()}catch(e){}};var i=getGeneratorFunc();var c=i?a(i):{};e.exports=function isGeneratorFunction(e){if(typeof e!=="function"){return false}if(n.test(r.call(e))){return true}if(!o){var i=t.call(e);return i==="[object GeneratorFunction]"}return a(e)===c}},720:function(e){"use strict";e.exports=function isNaN(e){return e!==e}},674:function(e,t,r){"use strict";var n=r(112);var o=r(961);var a=r(720);var i=r(78);var c=r(81);var u=n(i(),Number);o(u,{getPolyfill:i,implementation:a,shim:c});e.exports=u},78:function(e,t,r){"use strict";var n=r(720);e.exports=function getPolyfill(){if(Number.isNaN&&Number.isNaN(NaN)&&!Number.isNaN("a")){return Number.isNaN}return n}},81:function(e,t,r){"use strict";var n=r(961);var o=r(78);e.exports=function shimNumberIsNaN(){var e=o();n(Number,{isNaN:e},{isNaN:function testIsNaN(){return Number.isNaN!==e}});return e}},234:function(e,t,r){"use strict";var n=r(219);var o=r(627);var a=r(749);var i=a("Object.prototype.toString");var c=r(449)();var u=c&&typeof Symbol.toStringTag==="symbol";var f=o();var s=a("Array.prototype.indexOf",true)||function indexOf(e,t){for(var r=0;r<e.length;r+=1){if(e[r]===t){return r}}return-1};var p=a("String.prototype.slice");var l={};var y=r(982);var d=Object.getPrototypeOf;if(u&&y&&d){n(f,(function(e){var t=new __webpack_require__.g[e];if(!(Symbol.toStringTag in t)){throw new EvalError("this engine has support for Symbol.toStringTag, but "+e+" does not have the property! Please report this.")}var r=d(t);var n=y(r,Symbol.toStringTag);if(!n){var o=d(r);n=y(o,Symbol.toStringTag)}l[e]=n.get}))}var g=function tryAllTypedArrays(e){var t=false;n(l,(function(r,n){if(!t){try{t=r.call(e)===n}catch(e){}}}));return t};e.exports=function isTypedArray(e){if(!e||typeof e!=="object"){return false}if(!u){var t=p(i(e),8,-1);return s(f,t)>-1}if(!y){return false}return g(e)}},982:function(e,t,r){"use strict";var n=r(879);var o=n("%Object.getOwnPropertyDescriptor%");if(o){try{o([],"length")}catch(e){o=null}}e.exports=o},450:function(e){"use strict";var numberIsNaN=function(e){return e!==e};e.exports=function is(e,t){if(e===0&&t===0){return 1/e===1/t}if(e===t){return true}if(numberIsNaN(e)&&numberIsNaN(t)){return true}return false}},595:function(e,t,r){"use strict";var n;if(!Object.keys){var o=Object.prototype.hasOwnProperty;var a=Object.prototype.toString;var i=r(750);var c=Object.prototype.propertyIsEnumerable;var u=!c.call({toString:null},"toString");var f=c.call((function(){}),"prototype");var s=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"];var equalsConstructorPrototype=function(e){var t=e.constructor;return t&&t.prototype===e};var p={$applicationCache:true,$console:true,$external:true,$frame:true,$frameElement:true,$frames:true,$innerHeight:true,$innerWidth:true,$onmozfullscreenchange:true,$onmozfullscreenerror:true,$outerHeight:true,$outerWidth:true,$pageXOffset:true,$pageYOffset:true,$parent:true,$scrollLeft:true,$scrollTop:true,$scrollX:true,$scrollY:true,$self:true,$webkitIndexedDB:true,$webkitStorageInfo:true,$window:true};var l=function(){if(typeof window==="undefined"){return false}for(var e in window){try{if(!p["$"+e]&&o.call(window,e)&&window[e]!==null&&typeof window[e]==="object"){try{equalsConstructorPrototype(window[e])}catch(e){return true}}}catch(e){return true}}return false}();var equalsConstructorPrototypeIfNotBuggy=function(e){if(typeof window==="undefined"||!l){return equalsConstructorPrototype(e)}try{return equalsConstructorPrototype(e)}catch(e){return false}};n=function keys(e){var t=e!==null&&typeof e==="object";var r=a.call(e)==="[object Function]";var n=i(e);var c=t&&a.call(e)==="[object String]";var p=[];if(!t&&!r&&!n){throw new TypeError("Object.keys called on a non-object")}var l=f&&r;if(c&&e.length>0&&!o.call(e,0)){for(var y=0;y<e.length;++y){p.push(String(y))}}if(n&&e.length>0){for(var d=0;d<e.length;++d){p.push(String(d))}}else{for(var g in e){if(!(l&&g==="prototype")&&o.call(e,g)){p.push(String(g))}}}if(u){var v=equalsConstructorPrototypeIfNotBuggy(e);for(var b=0;b<s.length;++b){if(!(v&&s[b]==="constructor")&&o.call(e,s[b])){p.push(s[b])}}}return p}}e.exports=n},283:function(e,t,r){"use strict";var n=Array.prototype.slice;var o=r(750);var a=Object.keys;var i=a?function keys(e){return a(e)}:r(595);var c=Object.keys;i.shim=function shimObjectKeys(){if(Object.keys){var e=function(){var e=Object.keys(arguments);return e&&e.length===arguments.length}(1,2);if(!e){Object.keys=function keys(e){if(o(e)){return c(n.call(e))}return c(e)}}}else{Object.keys=i}return Object.keys||i};e.exports=i},750:function(e){"use strict";var t=Object.prototype.toString;e.exports=function isArguments(e){var r=t.call(e);var n=r==="[object Arguments]";if(!n){n=r!=="[object Array]"&&e!==null&&typeof e==="object"&&typeof e.length==="number"&&e.length>=0&&t.call(e.callee)==="[object Function]"}return n}},536:function(e){e.exports=function isBuffer(e){return e instanceof Buffer}},3:function(e,t,r){"use strict";var n=r(312);var o=r(906);var a=r(715);var i=r(234);function uncurryThis(e){return e.call.bind(e)}var c=typeof BigInt!=="undefined";var u=typeof Symbol!=="undefined";var f=uncurryThis(Object.prototype.toString);var s=uncurryThis(Number.prototype.valueOf);var p=uncurryThis(String.prototype.valueOf);var l=uncurryThis(Boolean.prototype.valueOf);if(c){var y=uncurryThis(BigInt.prototype.valueOf)}if(u){var d=uncurryThis(Symbol.prototype.valueOf)}function checkBoxedPrimitive(e,t){if(typeof e!=="object"){return false}try{t(e);return true}catch(e){return false}}t.isArgumentsObject=n;t.isGeneratorFunction=o;t.isTypedArray=i;function isPromise(e){return typeof Promise!=="undefined"&&e instanceof Promise||e!==null&&typeof e==="object"&&typeof e.then==="function"&&typeof e.catch==="function"}t.isPromise=isPromise;function isArrayBufferView(e){if(typeof ArrayBuffer!=="undefined"&&ArrayBuffer.isView){return ArrayBuffer.isView(e)}return i(e)||isDataView(e)}t.isArrayBufferView=isArrayBufferView;function isUint8Array(e){return a(e)==="Uint8Array"}t.isUint8Array=isUint8Array;function isUint8ClampedArray(e){return a(e)==="Uint8ClampedArray"}t.isUint8ClampedArray=isUint8ClampedArray;function isUint16Array(e){return a(e)==="Uint16Array"}t.isUint16Array=isUint16Array;function isUint32Array(e){return a(e)==="Uint32Array"}t.isUint32Array=isUint32Array;function isInt8Array(e){return a(e)==="Int8Array"}t.isInt8Array=isInt8Array;function isInt16Array(e){return a(e)==="Int16Array"}t.isInt16Array=isInt16Array;function isInt32Array(e){return a(e)==="Int32Array"}t.isInt32Array=isInt32Array;function isFloat32Array(e){return a(e)==="Float32Array"}t.isFloat32Array=isFloat32Array;function isFloat64Array(e){return a(e)==="Float64Array"}t.isFloat64Array=isFloat64Array;function isBigInt64Array(e){return a(e)==="BigInt64Array"}t.isBigInt64Array=isBigInt64Array;function isBigUint64Array(e){return a(e)==="BigUint64Array"}t.isBigUint64Array=isBigUint64Array;function isMapToString(e){return f(e)==="[object Map]"}isMapToString.working=typeof Map!=="undefined"&&isMapToString(new Map);function isMap(e){if(typeof Map==="undefined"){return false}return isMapToString.working?isMapToString(e):e instanceof Map}t.isMap=isMap;function isSetToString(e){return f(e)==="[object Set]"}isSetToString.working=typeof Set!=="undefined"&&isSetToString(new Set);function isSet(e){if(typeof Set==="undefined"){return false}return isSetToString.working?isSetToString(e):e instanceof Set}t.isSet=isSet;function isWeakMapToString(e){return f(e)==="[object WeakMap]"}isWeakMapToString.working=typeof WeakMap!=="undefined"&&isWeakMapToString(new WeakMap);function isWeakMap(e){if(typeof WeakMap==="undefined"){return false}return isWeakMapToString.working?isWeakMapToString(e):e instanceof WeakMap}t.isWeakMap=isWeakMap;function isWeakSetToString(e){return f(e)==="[object WeakSet]"}isWeakSetToString.working=typeof WeakSet!=="undefined"&&isWeakSetToString(new WeakSet);function isWeakSet(e){return isWeakSetToString(e)}t.isWeakSet=isWeakSet;function isArrayBufferToString(e){return f(e)==="[object ArrayBuffer]"}isArrayBufferToString.working=typeof ArrayBuffer!=="undefined"&&isArrayBufferToString(new ArrayBuffer);function isArrayBuffer(e){if(typeof ArrayBuffer==="undefined"){return false}return isArrayBufferToString.working?isArrayBufferToString(e):e instanceof ArrayBuffer}t.isArrayBuffer=isArrayBuffer;function isDataViewToString(e){return f(e)==="[object DataView]"}isDataViewToString.working=typeof ArrayBuffer!=="undefined"&&typeof DataView!=="undefined"&&isDataViewToString(new DataView(new ArrayBuffer(1),0,1));function isDataView(e){if(typeof DataView==="undefined"){return false}return isDataViewToString.working?isDataViewToString(e):e instanceof DataView}t.isDataView=isDataView;var g=typeof SharedArrayBuffer!=="undefined"?SharedArrayBuffer:undefined;function isSharedArrayBufferToString(e){return f(e)==="[object SharedArrayBuffer]"}function isSharedArrayBuffer(e){if(typeof g==="undefined"){return false}if(typeof isSharedArrayBufferToString.working==="undefined"){isSharedArrayBufferToString.working=isSharedArrayBufferToString(new g)}return isSharedArrayBufferToString.working?isSharedArrayBufferToString(e):e instanceof g}t.isSharedArrayBuffer=isSharedArrayBuffer;function isAsyncFunction(e){return f(e)==="[object AsyncFunction]"}t.isAsyncFunction=isAsyncFunction;function isMapIterator(e){return f(e)==="[object Map Iterator]"}t.isMapIterator=isMapIterator;function isSetIterator(e){return f(e)==="[object Set Iterator]"}t.isSetIterator=isSetIterator;function isGeneratorObject(e){return f(e)==="[object Generator]"}t.isGeneratorObject=isGeneratorObject;function isWebAssemblyCompiledModule(e){return f(e)==="[object WebAssembly.Module]"}t.isWebAssemblyCompiledModule=isWebAssemblyCompiledModule;function isNumberObject(e){return checkBoxedPrimitive(e,s)}t.isNumberObject=isNumberObject;function isStringObject(e){return checkBoxedPrimitive(e,p)}t.isStringObject=isStringObject;function isBooleanObject(e){return checkBoxedPrimitive(e,l)}t.isBooleanObject=isBooleanObject;function isBigIntObject(e){return c&&checkBoxedPrimitive(e,y)}t.isBigIntObject=isBigIntObject;function isSymbolObject(e){return u&&checkBoxedPrimitive(e,d)}t.isSymbolObject=isSymbolObject;function isBoxedPrimitive(e){return isNumberObject(e)||isStringObject(e)||isBooleanObject(e)||isBigIntObject(e)||isSymbolObject(e)}t.isBoxedPrimitive=isBoxedPrimitive;function isAnyArrayBuffer(e){return typeof Uint8Array!=="undefined"&&(isArrayBuffer(e)||isSharedArrayBuffer(e))}t.isAnyArrayBuffer=isAnyArrayBuffer;["isProxy","isExternal","isModuleNamespaceObject"].forEach((function(e){Object.defineProperty(t,e,{enumerable:false,value:function(){throw new Error(e+" is not supported in userland")}})}))},650:function(e,t,r){var n=Object.getOwnPropertyDescriptors||function getOwnPropertyDescriptors(e){var t=Object.keys(e);var r={};for(var n=0;n<t.length;n++){r[t[n]]=Object.getOwnPropertyDescriptor(e,t[n])}return r};var o=/%[sdj%]/g;t.format=function(e){if(!isString(e)){var t=[];for(var r=0;r<arguments.length;r++){t.push(inspect(arguments[r]))}return t.join(" ")}var r=1;var n=arguments;var a=n.length;var i=String(e).replace(o,(function(e){if(e==="%%")return"%";if(r>=a)return e;switch(e){case"%s":return String(n[r++]);case"%d":return Number(n[r++]);case"%j":try{return JSON.stringify(n[r++])}catch(e){return"[Circular]"}default:return e}}));for(var c=n[r];r<a;c=n[++r]){if(isNull(c)||!isObject(c)){i+=" "+c}else{i+=" "+inspect(c)}}return i};t.deprecate=function(e,r){if(typeof process!=="undefined"&&process.noDeprecation===true){return e}if(typeof process==="undefined"){return function(){return t.deprecate(e,r).apply(this,arguments)}}var n=false;function deprecated(){if(!n){if(process.throwDeprecation){throw new Error(r)}else if(process.traceDeprecation){console.trace(r)}else{console.error(r)}n=true}return e.apply(this,arguments)}return deprecated};var a={};var i=/^$/;if(process.env.NODE_DEBUG){var c=process.env.NODE_DEBUG;c=c.replace(/[|\\{}()[\]^$+?.]/g,"\\$&").replace(/\*/g,".*").replace(/,/g,"$|^").toUpperCase();i=new RegExp("^"+c+"$","i")}t.debuglog=function(e){e=e.toUpperCase();if(!a[e]){if(i.test(e)){var r=process.pid;a[e]=function(){var n=t.format.apply(t,arguments);console.error("%s %d: %s",e,r,n)}}else{a[e]=function(){}}}return a[e]};function inspect(e,r){var n={seen:[],stylize:stylizeNoColor};if(arguments.length>=3)n.depth=arguments[2];if(arguments.length>=4)n.colors=arguments[3];if(isBoolean(r)){n.showHidden=r}else if(r){t._extend(n,r)}if(isUndefined(n.showHidden))n.showHidden=false;if(isUndefined(n.depth))n.depth=2;if(isUndefined(n.colors))n.colors=false;if(isUndefined(n.customInspect))n.customInspect=true;if(n.colors)n.stylize=stylizeWithColor;return formatValue(n,e,n.depth)}t.inspect=inspect;inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]};inspect.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"};function stylizeWithColor(e,t){var r=inspect.styles[t];if(r){return"["+inspect.colors[r][0]+"m"+e+"["+inspect.colors[r][1]+"m"}else{return e}}function stylizeNoColor(e,t){return e}function arrayToHash(e){var t={};e.forEach((function(e,r){t[e]=true}));return t}function formatValue(e,r,n){if(e.customInspect&&r&&isFunction(r.inspect)&&r.inspect!==t.inspect&&!(r.constructor&&r.constructor.prototype===r)){var o=r.inspect(n,e);if(!isString(o)){o=formatValue(e,o,n)}return o}var a=formatPrimitive(e,r);if(a){return a}var i=Object.keys(r);var c=arrayToHash(i);if(e.showHidden){i=Object.getOwnPropertyNames(r)}if(isError(r)&&(i.indexOf("message")>=0||i.indexOf("description")>=0)){return formatError(r)}if(i.length===0){if(isFunction(r)){var u=r.name?": "+r.name:"";return e.stylize("[Function"+u+"]","special")}if(isRegExp(r)){return e.stylize(RegExp.prototype.toString.call(r),"regexp")}if(isDate(r)){return e.stylize(Date.prototype.toString.call(r),"date")}if(isError(r)){return formatError(r)}}var f="",s=false,p=["{","}"];if(isArray(r)){s=true;p=["[","]"]}if(isFunction(r)){var l=r.name?": "+r.name:"";f=" [Function"+l+"]"}if(isRegExp(r)){f=" "+RegExp.prototype.toString.call(r)}if(isDate(r)){f=" "+Date.prototype.toUTCString.call(r)}if(isError(r)){f=" "+formatError(r)}if(i.length===0&&(!s||r.length==0)){return p[0]+f+p[1]}if(n<0){if(isRegExp(r)){return e.stylize(RegExp.prototype.toString.call(r),"regexp")}else{return e.stylize("[Object]","special")}}e.seen.push(r);var y;if(s){y=formatArray(e,r,n,c,i)}else{y=i.map((function(t){return formatProperty(e,r,n,c,t,s)}))}e.seen.pop();return reduceToSingleString(y,f,p)}function formatPrimitive(e,t){if(isUndefined(t))return e.stylize("undefined","undefined");if(isString(t)){var r="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(r,"string")}if(isNumber(t))return e.stylize(""+t,"number");if(isBoolean(t))return e.stylize(""+t,"boolean");if(isNull(t))return e.stylize("null","null")}function formatError(e){return"["+Error.prototype.toString.call(e)+"]"}function formatArray(e,t,r,n,o){var a=[];for(var i=0,c=t.length;i<c;++i){if(hasOwnProperty(t,String(i))){a.push(formatProperty(e,t,r,n,String(i),true))}else{a.push("")}}o.forEach((function(o){if(!o.match(/^\d+$/)){a.push(formatProperty(e,t,r,n,o,true))}}));return a}function formatProperty(e,t,r,n,o,a){var i,c,u;u=Object.getOwnPropertyDescriptor(t,o)||{value:t[o]};if(u.get){if(u.set){c=e.stylize("[Getter/Setter]","special")}else{c=e.stylize("[Getter]","special")}}else{if(u.set){c=e.stylize("[Setter]","special")}}if(!hasOwnProperty(n,o)){i="["+o+"]"}if(!c){if(e.seen.indexOf(u.value)<0){if(isNull(r)){c=formatValue(e,u.value,null)}else{c=formatValue(e,u.value,r-1)}if(c.indexOf("\n")>-1){if(a){c=c.split("\n").map((function(e){return"  "+e})).join("\n").substr(2)}else{c="\n"+c.split("\n").map((function(e){return"   "+e})).join("\n")}}}else{c=e.stylize("[Circular]","special")}}if(isUndefined(i)){if(a&&o.match(/^\d+$/)){return c}i=JSON.stringify(""+o);if(i.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)){i=i.substr(1,i.length-2);i=e.stylize(i,"name")}else{i=i.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'");i=e.stylize(i,"string")}}return i+": "+c}function reduceToSingleString(e,t,r){var n=0;var o=e.reduce((function(e,t){n++;if(t.indexOf("\n")>=0)n++;return e+t.replace(/\u001b\[\d\d?m/g,"").length+1}),0);if(o>60){return r[0]+(t===""?"":t+"\n ")+" "+e.join(",\n  ")+" "+r[1]}return r[0]+t+" "+e.join(", ")+" "+r[1]}t.types=r(3);function isArray(e){return Array.isArray(e)}t.isArray=isArray;function isBoolean(e){return typeof e==="boolean"}t.isBoolean=isBoolean;function isNull(e){return e===null}t.isNull=isNull;function isNullOrUndefined(e){return e==null}t.isNullOrUndefined=isNullOrUndefined;function isNumber(e){return typeof e==="number"}t.isNumber=isNumber;function isString(e){return typeof e==="string"}t.isString=isString;function isSymbol(e){return typeof e==="symbol"}t.isSymbol=isSymbol;function isUndefined(e){return e===void 0}t.isUndefined=isUndefined;function isRegExp(e){return isObject(e)&&objectToString(e)==="[object RegExp]"}t.isRegExp=isRegExp;t.types.isRegExp=isRegExp;function isObject(e){return typeof e==="object"&&e!==null}t.isObject=isObject;function isDate(e){return isObject(e)&&objectToString(e)==="[object Date]"}t.isDate=isDate;t.types.isDate=isDate;function isError(e){return isObject(e)&&(objectToString(e)==="[object Error]"||e instanceof Error)}t.isError=isError;t.types.isNativeError=isError;function isFunction(e){return typeof e==="function"}t.isFunction=isFunction;function isPrimitive(e){return e===null||typeof e==="boolean"||typeof e==="number"||typeof e==="string"||typeof e==="symbol"||typeof e==="undefined"}t.isPrimitive=isPrimitive;t.isBuffer=r(536);function objectToString(e){return Object.prototype.toString.call(e)}function pad(e){return e<10?"0"+e.toString(10):e.toString(10)}var u=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function timestamp(){var e=new Date;var t=[pad(e.getHours()),pad(e.getMinutes()),pad(e.getSeconds())].join(":");return[e.getDate(),u[e.getMonth()],t].join(" ")}t.log=function(){console.log("%s - %s",timestamp(),t.format.apply(t,arguments))};t.inherits=r(526);t._extend=function(e,t){if(!t||!isObject(t))return e;var r=Object.keys(t);var n=r.length;while(n--){e[r[n]]=t[r[n]]}return e};function hasOwnProperty(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var f=typeof Symbol!=="undefined"?Symbol("util.promisify.custom"):undefined;t.promisify=function promisify(e){if(typeof e!=="function")throw new TypeError('The "original" argument must be of type Function');if(f&&e[f]){var t=e[f];if(typeof t!=="function"){throw new TypeError('The "util.promisify.custom" argument must be of type Function')}Object.defineProperty(t,f,{value:t,enumerable:false,writable:false,configurable:true});return t}function t(){var t,r;var n=new Promise((function(e,n){t=e;r=n}));var o=[];for(var a=0;a<arguments.length;a++){o.push(arguments[a])}o.push((function(e,n){if(e){r(e)}else{t(n)}}));try{e.apply(this,o)}catch(e){r(e)}return n}Object.setPrototypeOf(t,Object.getPrototypeOf(e));if(f)Object.defineProperty(t,f,{value:t,enumerable:false,writable:false,configurable:true});return Object.defineProperties(t,n(e))};t.promisify.custom=f;function callbackifyOnRejected(e,t){if(!e){var r=new Error("Promise was rejected with a falsy value");r.reason=e;e=r}return t(e)}function callbackify(e){if(typeof e!=="function"){throw new TypeError('The "original" argument must be of type Function')}function callbackified(){var t=[];for(var r=0;r<arguments.length;r++){t.push(arguments[r])}var n=t.pop();if(typeof n!=="function"){throw new TypeError("The last argument must be of type Function")}var o=this;var cb=function(){return n.apply(o,arguments)};e.apply(this,t).then((function(e){process.nextTick(cb.bind(null,null,e))}),(function(e){process.nextTick(callbackifyOnRejected.bind(null,e,cb))}))}Object.setPrototypeOf(callbackified,Object.getPrototypeOf(e));Object.defineProperties(callbackified,n(e));return callbackified}t.callbackify=callbackify},715:function(e,t,r){"use strict";var n=r(219);var o=r(627);var a=r(749);var i=a("Object.prototype.toString");var c=r(449)();var u=c&&typeof Symbol.toStringTag==="symbol";var f=o();var s=a("String.prototype.slice");var p={};var l=r(850);var y=Object.getPrototypeOf;if(u&&l&&y){n(f,(function(e){if(typeof __webpack_require__.g[e]==="function"){var t=new __webpack_require__.g[e];if(!(Symbol.toStringTag in t)){throw new EvalError("this engine has support for Symbol.toStringTag, but "+e+" does not have the property! Please report this.")}var r=y(t);var n=l(r,Symbol.toStringTag);if(!n){var o=y(r);n=l(o,Symbol.toStringTag)}p[e]=n.get}}))}var d=function tryAllTypedArrays(e){var t=false;n(p,(function(r,n){if(!t){try{var o=r.call(e);if(o===n){t=o}}catch(e){}}}));return t};var g=r(234);e.exports=function whichTypedArray(e){if(!g(e)){return false}if(!u){return s(i(e),8,-1)}return d(e)}},227:function(e,t,r){"use strict";var n;var o=SyntaxError;var a=Function;var i=TypeError;var getEvalledConstructor=function(e){try{return Function('"use strict"; return ('+e+").constructor;")()}catch(e){}};var c=Object.getOwnPropertyDescriptor;if(c){try{c({},"")}catch(e){c=null}}var throwTypeError=function(){throw new i};var u=c?function(){try{arguments.callee;return throwTypeError}catch(e){try{return c(arguments,"callee").get}catch(e){return throwTypeError}}}():throwTypeError;var f=r(449)();var s=Object.getPrototypeOf||function(e){return e.__proto__};var p=getEvalledConstructor("async function* () {}");var l=p?p.prototype:n;var y=l?l.prototype:n;var d=typeof Uint8Array==="undefined"?n:s(Uint8Array);var g={"%AggregateError%":typeof AggregateError==="undefined"?n:AggregateError,"%Array%":Array,"%ArrayBuffer%":typeof ArrayBuffer==="undefined"?n:ArrayBuffer,"%ArrayIteratorPrototype%":f?s([][Symbol.iterator]()):n,"%AsyncFromSyncIteratorPrototype%":n,"%AsyncFunction%":getEvalledConstructor("async function () {}"),"%AsyncGenerator%":l,"%AsyncGeneratorFunction%":p,"%AsyncIteratorPrototype%":y?s(y):n,"%Atomics%":typeof Atomics==="undefined"?n:Atomics,"%BigInt%":typeof BigInt==="undefined"?n:BigInt,"%Boolean%":Boolean,"%DataView%":typeof DataView==="undefined"?n:DataView,"%Date%":Date,"%decodeURI%":decodeURI,"%decodeURIComponent%":decodeURIComponent,"%encodeURI%":encodeURI,"%encodeURIComponent%":encodeURIComponent,"%Error%":Error,"%eval%":eval,"%EvalError%":EvalError,"%Float32Array%":typeof Float32Array==="undefined"?n:Float32Array,"%Float64Array%":typeof Float64Array==="undefined"?n:Float64Array,"%FinalizationRegistry%":typeof FinalizationRegistry==="undefined"?n:FinalizationRegistry,"%Function%":a,"%GeneratorFunction%":getEvalledConstructor("function* () {}"),"%Int8Array%":typeof Int8Array==="undefined"?n:Int8Array,"%Int16Array%":typeof Int16Array==="undefined"?n:Int16Array,"%Int32Array%":typeof Int32Array==="undefined"?n:Int32Array,"%isFinite%":isFinite,"%isNaN%":isNaN,"%IteratorPrototype%":f?s(s([][Symbol.iterator]())):n,"%JSON%":typeof JSON==="object"?JSON:n,"%Map%":typeof Map==="undefined"?n:Map,"%MapIteratorPrototype%":typeof Map==="undefined"||!f?n:s((new Map)[Symbol.iterator]()),"%Math%":Math,"%Number%":Number,"%Object%":Object,"%parseFloat%":parseFloat,"%parseInt%":parseInt,"%Promise%":typeof Promise==="undefined"?n:Promise,"%Proxy%":typeof Proxy==="undefined"?n:Proxy,"%RangeError%":RangeError,"%ReferenceError%":ReferenceError,"%Reflect%":typeof Reflect==="undefined"?n:Reflect,"%RegExp%":RegExp,"%Set%":typeof Set==="undefined"?n:Set,"%SetIteratorPrototype%":typeof Set==="undefined"||!f?n:s((new Set)[Symbol.iterator]()),"%SharedArrayBuffer%":typeof SharedArrayBuffer==="undefined"?n:SharedArrayBuffer,"%String%":String,"%StringIteratorPrototype%":f?s(""[Symbol.iterator]()):n,"%Symbol%":f?Symbol:n,"%SyntaxError%":o,"%ThrowTypeError%":u,"%TypedArray%":d,"%TypeError%":i,"%Uint8Array%":typeof Uint8Array==="undefined"?n:Uint8Array,"%Uint8ClampedArray%":typeof Uint8ClampedArray==="undefined"?n:Uint8ClampedArray,"%Uint16Array%":typeof Uint16Array==="undefined"?n:Uint16Array,"%Uint32Array%":typeof Uint32Array==="undefined"?n:Uint32Array,"%URIError%":URIError,"%WeakMap%":typeof WeakMap==="undefined"?n:WeakMap,"%WeakRef%":typeof WeakRef==="undefined"?n:WeakRef,"%WeakSet%":typeof WeakSet==="undefined"?n:WeakSet};var v={"%ArrayBufferPrototype%":["ArrayBuffer","prototype"],"%ArrayPrototype%":["Array","prototype"],"%ArrayProto_entries%":["Array","prototype","entries"],"%ArrayProto_forEach%":["Array","prototype","forEach"],"%ArrayProto_keys%":["Array","prototype","keys"],"%ArrayProto_values%":["Array","prototype","values"],"%AsyncFunctionPrototype%":["AsyncFunction","prototype"],"%AsyncGenerator%":["AsyncGeneratorFunction","prototype"],"%AsyncGeneratorPrototype%":["AsyncGeneratorFunction","prototype","prototype"],"%BooleanPrototype%":["Boolean","prototype"],"%DataViewPrototype%":["DataView","prototype"],"%DatePrototype%":["Date","prototype"],"%ErrorPrototype%":["Error","prototype"],"%EvalErrorPrototype%":["EvalError","prototype"],"%Float32ArrayPrototype%":["Float32Array","prototype"],"%Float64ArrayPrototype%":["Float64Array","prototype"],"%FunctionPrototype%":["Function","prototype"],"%Generator%":["GeneratorFunction","prototype"],"%GeneratorPrototype%":["GeneratorFunction","prototype","prototype"],"%Int8ArrayPrototype%":["Int8Array","prototype"],"%Int16ArrayPrototype%":["Int16Array","prototype"],"%Int32ArrayPrototype%":["Int32Array","prototype"],"%JSONParse%":["JSON","parse"],"%JSONStringify%":["JSON","stringify"],"%MapPrototype%":["Map","prototype"],"%NumberPrototype%":["Number","prototype"],"%ObjectPrototype%":["Object","prototype"],"%ObjProto_toString%":["Object","prototype","toString"],"%ObjProto_valueOf%":["Object","prototype","valueOf"],"%PromisePrototype%":["Promise","prototype"],"%PromiseProto_then%":["Promise","prototype","then"],"%Promise_all%":["Promise","all"],"%Promise_reject%":["Promise","reject"],"%Promise_resolve%":["Promise","resolve"],"%RangeErrorPrototype%":["RangeError","prototype"],"%ReferenceErrorPrototype%":["ReferenceError","prototype"],"%RegExpPrototype%":["RegExp","prototype"],"%SetPrototype%":["Set","prototype"],"%SharedArrayBufferPrototype%":["SharedArrayBuffer","prototype"],"%StringPrototype%":["String","prototype"],"%SymbolPrototype%":["Symbol","prototype"],"%SyntaxErrorPrototype%":["SyntaxError","prototype"],"%TypedArrayPrototype%":["TypedArray","prototype"],"%TypeErrorPrototype%":["TypeError","prototype"],"%Uint8ArrayPrototype%":["Uint8Array","prototype"],"%Uint8ClampedArrayPrototype%":["Uint8ClampedArray","prototype"],"%Uint16ArrayPrototype%":["Uint16Array","prototype"],"%Uint32ArrayPrototype%":["Uint32Array","prototype"],"%URIErrorPrototype%":["URIError","prototype"],"%WeakMapPrototype%":["WeakMap","prototype"],"%WeakSetPrototype%":["WeakSet","prototype"]};var b=r(517);var h=r(793);var m=b.call(Function.call,Array.prototype.concat);var A=b.call(Function.apply,Array.prototype.splice);var S=b.call(Function.call,String.prototype.replace);var E=/[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;var P=/\\(\\)?/g;var w=function stringToPath(e){var t=[];S(e,E,(function(e,r,n,o){t[t.length]=n?S(o,P,"$1"):r||e}));return t};var O=function getBaseIntrinsic(e,t){var r=e;var n;if(h(v,r)){n=v[r];r="%"+n[0]+"%"}if(h(g,r)){var a=g[r];if(typeof a==="undefined"&&!t){throw new i("intrinsic "+e+" exists, but is not available. Please file an issue!")}return{alias:n,name:r,value:a}}throw new o("intrinsic "+e+" does not exist!")};e.exports=function GetIntrinsic(e,t){if(typeof e!=="string"||e.length===0){throw new i("intrinsic name must be a non-empty string")}if(arguments.length>1&&typeof t!=="boolean"){throw new i('"allowMissing" argument must be a boolean')}var r=w(e);var n=r.length>0?r[0]:"";var o=O("%"+n+"%",t);var a=o.name;var u=o.value;var f=false;var s=o.alias;if(s){n=s[0];A(r,m([0,1],s))}for(var p=1,l=true;p<r.length;p+=1){var y=r[p];if(y==="constructor"||!l){f=true}n+="."+y;a="%"+n+"%";if(h(g,a)){u=g[a]}else if(u!=null){if(c&&p+1>=r.length){var d=c(u,y);l=!!d;if(!t&&!(y in u)){throw new i("base intrinsic for "+e+" exists, but the property is not available.")}if(l&&"get"in d&&!("originalValue"in d.get)){u=d.get}else{u=u[y]}}else{l=h(u,y);u=u[y]}if(l&&!f){g[a]=u}}}return u}},850:function(e,t,r){"use strict";var n=r(227);var o=n("%Object.getOwnPropertyDescriptor%");if(o){try{o([],"length")}catch(e){o=null}}e.exports=o},627:function(e,t,r){"use strict";var n=r(901);e.exports=function availableTypedArrays(){return n(["BigInt64Array","BigUint64Array","Float32Array","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Uint8Array","Uint8ClampedArray"],(function(e){return typeof __webpack_require__.g[e]==="function"}))}}};var t={};function __nccwpck_require__(r){var n=t[r];if(n!==undefined){return n.exports}var o=t[r]={exports:{}};var a=true;try{e[r](o,o.exports,__nccwpck_require__);a=false}finally{if(a)delete t[r]}return o.exports}if(typeof __nccwpck_require__!=="undefined")__nccwpck_require__.ab=__dirname+"/";var r=__nccwpck_require__(313);module.exports=r})();

/***/ }),

/***/ 9008:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(5443)


/***/ }),

/***/ 500:
/***/ (function(module) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ 8467:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "H_": function() { return /* binding */ TOKEN_PROGRAM_ID; },
/* harmony export */   "_u": function() { return /* binding */ ASSOCIATED_TOKEN_PROGRAM_ID; }
/* harmony export */ });
/* unused harmony exports TOKEN_2022_PROGRAM_ID, NATIVE_MINT, NATIVE_MINT_2022, programSupportsExtensions */
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1208);

/** Address of the SPL Token program */
const TOKEN_PROGRAM_ID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
/** Address of the SPL Token 2022 program */
const TOKEN_2022_PROGRAM_ID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
/** Address of the SPL Associated Token Account program */
const ASSOCIATED_TOKEN_PROGRAM_ID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
/** Address of the special mint for wrapped native SOL in spl-token */
const NATIVE_MINT = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('So11111111111111111111111111111111111111112');
/** Address of the special mint for wrapped native SOL in spl-token-2022 */
const NATIVE_MINT_2022 = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP');
/** Check that the token program provided is not `Tokenkeg...`, useful when using extensions */
function programSupportsExtensions(programId) {
    if (programId === TOKEN_PROGRAM_ID) {
        return false;
    }
    else {
        return true;
    }
}
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 6413:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Am": function() { return /* binding */ getAssociatedTokenAddress; }
});

// UNUSED EXPORTS: MINT_SIZE, MintLayout, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptMint, getMinimumBalanceForRentExemptMintWithExtensions, getMint, unpackMint

// EXTERNAL MODULE: ./node_modules/@solana/buffer-layout/lib/Layout.js
var Layout = __webpack_require__(9386);
// EXTERNAL MODULE: ./node_modules/bigint-buffer/dist/browser.js
var browser = __webpack_require__(475);
;// CONCATENATED MODULE: ./node_modules/@solana/buffer-layout-utils/lib/esm/base.mjs
const base_encodeDecode = (layout) => {
    const decode = layout.decode.bind(layout);
    const encode = layout.encode.bind(layout);
    return { decode, encode };
};
//# sourceMappingURL=base.js.map
;// CONCATENATED MODULE: ./node_modules/@solana/buffer-layout-utils/lib/esm/bigint.mjs
/* provided dependency */ var Buffer = __webpack_require__(8764)["Buffer"];



const bigInt = (length) => (property) => {
    const layout = (0,Layout/* blob */.Ik)(length, property);
    const { encode, decode } = base_encodeDecode(layout);
    const bigIntLayout = layout;
    bigIntLayout.decode = (buffer, offset) => {
        const src = decode(buffer, offset);
        return (0,browser/* toBigIntLE */.oU)(Buffer.from(src));
    };
    bigIntLayout.encode = (bigInt, buffer, offset) => {
        const src = (0,browser/* toBufferLE */.k$)(bigInt, length);
        return encode(src, buffer, offset);
    };
    return bigIntLayout;
};
const bigIntBE = (length) => (property) => {
    const layout = (0,Layout/* blob */.Ik)(length, property);
    const { encode, decode } = base_encodeDecode(layout);
    const bigIntLayout = layout;
    bigIntLayout.decode = (buffer, offset) => {
        const src = decode(buffer, offset);
        return (0,browser/* toBigIntBE */.Q5)(Buffer.from(src));
    };
    bigIntLayout.encode = (bigInt, buffer, offset) => {
        const src = (0,browser/* toBufferBE */.zP)(bigInt, length);
        return encode(src, buffer, offset);
    };
    return bigIntLayout;
};
const u64 = bigInt(8);
const u64be = bigIntBE(8);
const bigint_u128 = bigInt(16);
const u128be = bigIntBE(16);
const u192 = bigInt(24);
const u192be = bigIntBE(24);
const u256 = bigInt(32);
const u256be = bigIntBE(32);
//# sourceMappingURL=bigint.js.map
;// CONCATENATED MODULE: ./node_modules/bignumber.js/bignumber.mjs
/*
 *      bignumber.js v9.1.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */


var
  isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
  mathceil = Math.ceil,
  mathfloor = Math.floor,

  bignumberError = '[BigNumber Error] ',
  tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',

  BASE = 1e14,
  LOG_BASE = 14,
  MAX_SAFE_INTEGER = 0x1fffffffffffff,         // 2^53 - 1
  // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
  POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
  SQRT_BASE = 1e7,

  // EDITABLE
  // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
  // the arguments to toExponential, toFixed, toFormat, and toPrecision.
  MAX = 1E9;                                   // 0 to MAX_INT32


/*
 * Create and return a BigNumber constructor.
 */
function clone(configObject) {
  var div, convertBase, parseNumeric,
    P = BigNumber.prototype = { constructor: BigNumber, toString: null, valueOf: null },
    ONE = new BigNumber(1),


    //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------


    // The default values below must be integers within the inclusive ranges stated.
    // The values can also be changed at run-time using BigNumber.set.

    // The maximum number of decimal places for operations involving division.
    DECIMAL_PLACES = 20,                     // 0 to MAX

    // The rounding mode used when rounding to the above decimal places, and when using
    // toExponential, toFixed, toFormat and toPrecision, and round (default value).
    // UP         0 Away from zero.
    // DOWN       1 Towards zero.
    // CEIL       2 Towards +Infinity.
    // FLOOR      3 Towards -Infinity.
    // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    ROUNDING_MODE = 4,                       // 0 to 8

    // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

    // The exponent value at and beneath which toString returns exponential notation.
    // Number type: -7
    TO_EXP_NEG = -7,                         // 0 to -MAX

    // The exponent value at and above which toString returns exponential notation.
    // Number type: 21
    TO_EXP_POS = 21,                         // 0 to MAX

    // RANGE : [MIN_EXP, MAX_EXP]

    // The minimum exponent value, beneath which underflow to zero occurs.
    // Number type: -324  (5e-324)
    MIN_EXP = -1e7,                          // -1 to -MAX

    // The maximum exponent value, above which overflow to Infinity occurs.
    // Number type:  308  (1.7976931348623157e+308)
    // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
    MAX_EXP = 1e7,                           // 1 to MAX

    // Whether to use cryptographically-secure random number generation, if available.
    CRYPTO = false,                          // true or false

    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP        0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN      1 The remainder has the same sign as the dividend.
    //             This modulo mode is commonly known as 'truncated division' and is
    //             equivalent to (a % n) in JavaScript.
    // FLOOR     3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
    // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
    //             The remainder is always positive.
    //
    // The truncated division, floored division, Euclidian division and IEEE 754 remainder
    // modes are commonly used for the modulus operation.
    // Although the other rounding modes can also be used, they may not give useful results.
    MODULO_MODE = 1,                         // 0 to 9

    // The maximum number of significant digits of the result of the exponentiatedBy operation.
    // If POW_PRECISION is 0, there will be unlimited significant digits.
    POW_PRECISION = 0,                       // 0 to MAX

    // The format specification used by the BigNumber.prototype.toFormat method.
    FORMAT = {
      prefix: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 0,
      fractionGroupSeparator: '\xA0',        // non-breaking space
      suffix: ''
    },

    // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
    // '-', '.', whitespace, or repeated character.
    // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
    alphabetHasNormalDecimalDigits = true;


  //------------------------------------------------------------------------------------------


  // CONSTRUCTOR


  /*
   * The BigNumber constructor and exported function.
   * Create and return a new instance of a BigNumber object.
   *
   * v {number|string|BigNumber} A numeric value.
   * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
   */
  function BigNumber(v, b) {
    var alphabet, c, caseChanged, e, i, isNum, len, str,
      x = this;

    // Enable constructor call without `new`.
    if (!(x instanceof BigNumber)) return new BigNumber(v, b);

    if (b == null) {

      if (v && v._isBigNumber === true) {
        x.s = v.s;

        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }

        return;
      }

      if ((isNum = typeof v == 'number') && v * 0 == 0) {

        // Use `1 / n` to handle minus zero also.
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;

        // Fast path for integers, where n < 2147483648 (2**31).
        if (v === ~~v) {
          for (e = 0, i = v; i >= 10; i /= 10, e++);

          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e;
            x.c = [v];
          }

          return;
        }

        str = String(v);
      } else {

        if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);

        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

      // Exponential form?
      if ((i = str.search(/e/i)) > 0) {

        // Determine exponent.
        if (e < 0) e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {

        // Integer.
        e = str.length;
      }

    } else {

      // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
      intCheck(b, 2, ALPHABET.length, 'Base');

      // Allow exponential notation to be used with base 10 argument, while
      // also rounding to DECIMAL_PLACES as with other bases.
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }

      str = String(v);

      if (isNum = typeof v == 'number') {

        // Avoid potential interpretation of Infinity and NaN as base 44+ values.
        if (v * 0 != 0) return parseNumeric(x, str, isNum, b);

        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
          throw Error
           (tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }

      alphabet = ALPHABET.slice(0, b);
      e = i = 0;

      // Check that str is a valid base b number.
      // Don't use RegExp, so alphabet can contain special characters.
      for (len = str.length; i < len; i++) {
        if (alphabet.indexOf(c = str.charAt(i)) < 0) {
          if (c == '.') {

            // If '.' is not the first character and it has not be found before.
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {

            // Allow e.g. hexadecimal 'FF' as well as 'ff'.
            if (str == str.toUpperCase() && (str = str.toLowerCase()) ||
                str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }

          return parseNumeric(x, String(v), isNum, b);
        }
      }

      // Prevent later check for length on converted number.
      isNum = false;
      str = convertBase(str, b, 10, x.s);

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');
      else e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(--len) === 48;);

    if (str = str.slice(i, ++len)) {
      len -= i;

      // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
      if (isNum && BigNumber.DEBUG &&
        len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
          throw Error
           (tooManyDigits + (x.s * v));
      }

       // Overflow?
      if ((e = e - i - 1) > MAX_EXP) {

        // Infinity.
        x.c = x.e = null;

      // Underflow?
      } else if (e < MIN_EXP) {

        // Zero.
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];

        // Transform base

        // e is the base 10 exponent.
        // i is where to slice str to get the first element of the coefficient array.
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE;  // i < 1

        if (i < len) {
          if (i) x.c.push(+str.slice(0, i));

          for (len -= LOG_BASE; i < len;) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }

          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }

        for (; i--; str += '0');
        x.c.push(+str);
      }
    } else {

      // Zero.
      x.c = [x.e = 0];
    }
  }


  // CONSTRUCTOR PROPERTIES


  BigNumber.clone = clone;

  BigNumber.ROUND_UP = 0;
  BigNumber.ROUND_DOWN = 1;
  BigNumber.ROUND_CEIL = 2;
  BigNumber.ROUND_FLOOR = 3;
  BigNumber.ROUND_HALF_UP = 4;
  BigNumber.ROUND_HALF_DOWN = 5;
  BigNumber.ROUND_HALF_EVEN = 6;
  BigNumber.ROUND_HALF_CEIL = 7;
  BigNumber.ROUND_HALF_FLOOR = 8;
  BigNumber.EUCLID = 9;


  /*
   * Configure infrequently-changing library-wide settings.
   *
   * Accept an object with the following optional properties (if the value of a property is
   * a number, it must be an integer within the inclusive range stated):
   *
   *   DECIMAL_PLACES   {number}           0 to MAX
   *   ROUNDING_MODE    {number}           0 to 8
   *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
   *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
   *   CRYPTO           {boolean}          true or false
   *   MODULO_MODE      {number}           0 to 9
   *   POW_PRECISION       {number}           0 to MAX
   *   ALPHABET         {string}           A string of two or more unique characters which does
   *                                       not contain '.'.
   *   FORMAT           {object}           An object with some of the following properties:
   *     prefix                 {string}
   *     groupSize              {number}
   *     secondaryGroupSize     {number}
   *     groupSeparator         {string}
   *     decimalSeparator       {string}
   *     fractionGroupSize      {number}
   *     fractionGroupSeparator {string}
   *     suffix                 {string}
   *
   * (The values assigned to the above FORMAT object properties are not checked for validity.)
   *
   * E.g.
   * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
   *
   * Ignore properties/parameters set to null or undefined, except for ALPHABET.
   *
   * Return an object with the properties current values.
   */
  BigNumber.config = BigNumber.set = function (obj) {
    var p, v;

    if (obj != null) {

      if (typeof obj == 'object') {

        // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }

        // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
        // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }

        // EXPONENTIAL_AT {number|number[]}
        // Integer, -MAX to MAX inclusive or
        // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
        // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }

        // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
        // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
        // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
        if (obj.hasOwnProperty(p = 'RANGE')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error
               (bignumberError + p + ' cannot be zero: ' + v);
            }
          }
        }

        // CRYPTO {boolean} true or false.
        // '[BigNumber Error] CRYPTO not true or false: {v}'
        // '[BigNumber Error] crypto unavailable'
        if (obj.hasOwnProperty(p = 'CRYPTO')) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != 'undefined' && crypto &&
               (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error
                 (bignumberError + 'crypto unavailable');
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error
             (bignumberError + p + ' not true or false: ' + v);
          }
        }

        // MODULO_MODE {number} Integer, 0 to 9 inclusive.
        // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }

        // POW_PRECISION {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }

        // FORMAT {object}
        // '[BigNumber Error] FORMAT not an object: {v}'
        if (obj.hasOwnProperty(p = 'FORMAT')) {
          v = obj[p];
          if (typeof v == 'object') FORMAT = v;
          else throw Error
           (bignumberError + p + ' not an object: ' + v);
        }

        // ALPHABET {string}
        // '[BigNumber Error] ALPHABET invalid: {v}'
        if (obj.hasOwnProperty(p = 'ALPHABET')) {
          v = obj[p];

          // Disallow if less than two characters,
          // or if it contains '+', '-', '.', whitespace, or a repeated character.
          if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
            ALPHABET = v;
          } else {
            throw Error
             (bignumberError + p + ' invalid: ' + v);
          }
        }

      } else {

        // '[BigNumber Error] Object expected: {v}'
        throw Error
         (bignumberError + 'Object expected: ' + obj);
      }
    }

    return {
      DECIMAL_PLACES: DECIMAL_PLACES,
      ROUNDING_MODE: ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO: CRYPTO,
      MODULO_MODE: MODULO_MODE,
      POW_PRECISION: POW_PRECISION,
      FORMAT: FORMAT,
      ALPHABET: ALPHABET
    };
  };


  /*
   * Return true if v is a BigNumber instance, otherwise return false.
   *
   * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
   *
   * v {any}
   *
   * '[BigNumber Error] Invalid BigNumber: {v}'
   */
  BigNumber.isBigNumber = function (v) {
    if (!v || v._isBigNumber !== true) return false;
    if (!BigNumber.DEBUG) return true;

    var i, n,
      c = v.c,
      e = v.e,
      s = v.s;

    out: if ({}.toString.call(c) == '[object Array]') {

      if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {

        // If the first element is zero, the BigNumber value must be zero.
        if (c[0] === 0) {
          if (e === 0 && c.length === 1) return true;
          break out;
        }

        // Calculate number of digits that c[0] should have, based on the exponent.
        i = (e + 1) % LOG_BASE;
        if (i < 1) i += LOG_BASE;

        // Calculate number of digits of c[0].
        //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
        if (String(c[0]).length == i) {

          for (i = 0; i < c.length; i++) {
            n = c[i];
            if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
          }

          // Last element cannot be zero, unless it is the only element.
          if (n !== 0) return true;
        }
      }

    // Infinity/NaN
    } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
      return true;
    }

    throw Error
      (bignumberError + 'Invalid BigNumber: ' + v);
  };


  /*
   * Return a new BigNumber whose value is the maximum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.maximum = BigNumber.max = function () {
    return maxOrMin(arguments, P.lt);
  };


  /*
   * Return a new BigNumber whose value is the minimum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.minimum = BigNumber.min = function () {
    return maxOrMin(arguments, P.gt);
  };


  /*
   * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
   * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
   * zeros are produced).
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
   * '[BigNumber Error] crypto unavailable'
   */
  BigNumber.random = (function () {
    var pow2_53 = 0x20000000000000;

    // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
    // Check if Math.random() produces more than 32 bits of randomness.
    // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
    // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
    var random53bitInt = (Math.random() * pow2_53) & 0x1fffff
     ? function () { return mathfloor(Math.random() * pow2_53); }
     : function () { return ((Math.random() * 0x40000000 | 0) * 0x800000) +
       (Math.random() * 0x800000 | 0); };

    return function (dp) {
      var a, b, e, k, v,
        i = 0,
        c = [],
        rand = new BigNumber(ONE);

      if (dp == null) dp = DECIMAL_PLACES;
      else intCheck(dp, 0, MAX);

      k = mathceil(dp / LOG_BASE);

      if (CRYPTO) {

        // Browsers supporting crypto.getRandomValues.
        if (crypto.getRandomValues) {

          a = crypto.getRandomValues(new Uint32Array(k *= 2));

          for (; i < k;) {

            // 53 bits:
            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
            //                                     11111 11111111 11111111
            // 0x20000 is 2^21.
            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

            // Rejection sampling:
            // 0 <= v < 9007199254740992
            // Probability that v >= 9e15, is
            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {

              // 0 <= v <= 8999999999999999
              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;

        // Node.js supporting crypto.randomBytes.
        } else if (crypto.randomBytes) {

          // buffer
          a = crypto.randomBytes(k *= 7);

          for (; i < k;) {

            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
            // 0x100000000 is 2^32, 0x1000000 is 2^24
            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
            // 0 <= v < 9007199254740992
            v = ((a[i] & 31) * 0x1000000000000) + (a[i + 1] * 0x10000000000) +
               (a[i + 2] * 0x100000000) + (a[i + 3] * 0x1000000) +
               (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];

            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {

              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error
           (bignumberError + 'crypto unavailable');
        }
      }

      // Use Math.random.
      if (!CRYPTO) {

        for (; i < k;) {
          v = random53bitInt();
          if (v < 9e15) c[i++] = v % 1e14;
        }
      }

      k = c[--i];
      dp %= LOG_BASE;

      // Convert trailing digits to zeros according to dp.
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }

      // Remove trailing elements which are zero.
      for (; c[i] === 0; c.pop(), i--);

      // Zero?
      if (i < 0) {
        c = [e = 0];
      } else {

        // Remove leading elements which are zero and adjust exponent accordingly.
        for (e = -1 ; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

        // Count the digits of the first element of c to determine leading zeros, and...
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

        // adjust the exponent accordingly.
        if (i < LOG_BASE) e -= LOG_BASE - i;
      }

      rand.e = e;
      rand.c = c;
      return rand;
    };
  })();


   /*
   * Return a BigNumber whose value is the sum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.sum = function () {
    var i = 1,
      args = arguments,
      sum = new BigNumber(args[0]);
    for (; i < args.length;) sum = sum.plus(args[i++]);
    return sum;
  };


  // PRIVATE FUNCTIONS


  // Called by BigNumber and BigNumber.prototype.toString.
  convertBase = (function () {
    var decimal = '0123456789';

    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. toBaseOut('255', 10, 16) returns [15, 15].
     * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut(str, baseIn, baseOut, alphabet) {
      var j,
        arr = [0],
        arrL,
        i = 0,
        len = str.length;

      for (; i < len;) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);

        arr[0] += alphabet.indexOf(str.charAt(i++));

        for (j = 0; j < arr.length; j++) {

          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null) arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }

      return arr.reverse();
    }

    // Convert a numeric string of baseIn to a numeric string of baseOut.
    // If the caller is toString, we are converting from base 10 to baseOut.
    // If the caller is BigNumber, we are converting from baseIn to base 10.
    return function (str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet, d, e, k, r, x, xc, y,
        i = str.indexOf('.'),
        dp = DECIMAL_PLACES,
        rm = ROUNDING_MODE;

      // Non-integer.
      if (i >= 0) {
        k = POW_PRECISION;

        // Unlimited precision.
        POW_PRECISION = 0;
        str = str.replace('.', '');
        y = new BigNumber(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;

        // Convert str as if an integer, then restore the fraction part by dividing the
        // result by its base raised to a power.

        y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'),
         10, baseOut, decimal);
        y.e = y.c.length;
      }

      // Convert the number as integer.

      xc = toBaseOut(str, baseIn, baseOut, callerIsToString
       ? (alphabet = ALPHABET, decimal)
       : (alphabet = decimal, ALPHABET));

      // xc now represents str as an integer and converted to baseOut. e is the exponent.
      e = k = xc.length;

      // Remove trailing zeros.
      for (; xc[--k] == 0; xc.pop());

      // Zero?
      if (!xc[0]) return alphabet.charAt(0);

      // Does str represent an integer? If so, no need for the division.
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;

        // The sign is needed for correct rounding.
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }

      // xc now represents str converted to baseOut.

      // THe index of the rounding digit.
      d = e + dp + 1;

      // The rounding digit: the digit to the right of the digit that may be rounded up.
      i = xc[d];

      // Look at the rounding digits and mode to determine whether to round up.

      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;

      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
            : i > k || i == k &&(rm == 4 || r || rm == 6 && xc[d - 1] & 1 ||
             rm == (x.s < 0 ? 8 : 7));

      // If the index of the rounding digit is not greater than zero, or xc represents
      // zero, then the result of the base conversion is zero or, if rounding up, a value
      // such as 0.00001.
      if (d < 1 || !xc[0]) {

        // 1^-dp or 0
        str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
      } else {

        // Truncate xc to the required number of decimal places.
        xc.length = d;

        // Round up?
        if (r) {

          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (--baseOut; ++xc[--d] > baseOut;) {
            xc[d] = 0;

            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }

        // Determine trailing zeros.
        for (k = xc.length; !xc[--k];);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

        // Add leading zeros, decimal point and trailing zeros as required.
        str = toFixedPoint(str, e, alphabet.charAt(0));
      }

      // The caller will add the sign.
      return str;
    };
  })();


  // Perform division in the specified base. Called by div and convertBase.
  div = (function () {

    // Assume non-zero x and k.
    function multiply(x, k, base) {
      var m, temp, xlo, xhi,
        carry = 0,
        i = x.length,
        klo = k % SQRT_BASE,
        khi = k / SQRT_BASE | 0;

      for (x = x.slice(); i--;) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + ((m % SQRT_BASE) * SQRT_BASE) + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }

      if (carry) x = [carry].concat(x);

      return x;
    }

    function compare(a, b, aL, bL) {
      var i, cmp;

      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {

        for (i = cmp = 0; i < aL; i++) {

          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }

      return cmp;
    }

    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1; a.splice(0, 1));
    }

    // x: dividend, y: divisor.
    return function (x, y, dp, rm, base) {
      var cmp, e, i, more, n, prod, prodL, q, qc, rem, remL, rem0, xi, xL, yc0,
        yL, yz,
        s = x.s == y.s ? 1 : -1,
        xc = x.c,
        yc = y.c;

      // Either NaN, Infinity or 0?
      if (!xc || !xc[0] || !yc || !yc[0]) {

        return new BigNumber(

         // Return NaN if either NaN, or both Infinity or 0.
         !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :

          // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
          xc && xc[0] == 0 || !yc ? s * 0 : s / 0
       );
      }

      q = new BigNumber(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;

      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }

      // Result exponent may be one less then the current value of e.
      // The coefficients of the BigNumbers from convertBase may have trailing zeros.
      for (i = 0; yc[i] == (xc[i] || 0); i++);

      if (yc[i] > (xc[i] || 0)) e--;

      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;

        // Normalise xc and yc so highest order digit of yc is >= base / 2.

        n = mathfloor(base / (yc[0] + 1));

        // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
        // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }

        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL; rem[remL++] = 0);
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2) yc0++;
        // Not necessary, but to prevent trial digit n > base, when using base 3.
        // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

        do {
          n = 0;

          // Compare divisor and remainder.
          cmp = compare(yc, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {

            // Calculate trial digit, n.

            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

            // n is how many times the divisor goes into the current remainder.
            n = mathfloor(rem0 / yc0);

            //  Algorithm:
            //  product = divisor multiplied by trial digit (n).
            //  Compare product and remainder.
            //  If product is greater than remainder:
            //    Subtract divisor from product, decrement trial digit.
            //  Subtract product from remainder.
            //  If product was less than remainder at the last compare:
            //    Compare new remainder and divisor.
            //    If remainder is greater than divisor:
            //      Subtract divisor from remainder, increment trial digit.

            if (n > 1) {

              // n may be > base only when base is 3.
              if (n >= base) n = base - 1;

              // product = divisor * trial digit.
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              // If product > remainder then trial digit n too high.
              // n is 1 too high about 5% of the time, and is not known to have
              // ever been more than 1 too high.
              while (compare(prod, rem, prodL, remL) == 1) {
                n--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {

              // n is 0 or 1, cmp is -1.
              // If n is 0, there is no need to compare yc and rem again below,
              // so change cmp to 1 to avoid it.
              // If n is 1, leave cmp as -1, so yc and rem are compared again.
              if (n == 0) {

                // divisor < remainder, so n must be at least 1.
                cmp = n = 1;
              }

              // product = divisor
              prod = yc.slice();
              prodL = prod.length;
            }

            if (prodL < remL) prod = [0].concat(prod);

            // Subtract product from remainder.
            subtract(rem, prod, remL, base);
            remL = rem.length;

             // If product was < remainder.
            if (cmp == -1) {

              // Compare divisor and new remainder.
              // If divisor < new remainder, subtract divisor from remainder.
              // Trial digit n too low.
              // n is 1 too low about 5% of the time, and very rarely 2 too low.
              while (compare(yc, rem, yL, remL) < 1) {
                n++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          } // else cmp === 1 and n will be 0

          // Add the next digit, n, to the result array.
          qc[i++] = n;

          // Update the remainder.
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);

        more = rem[0] != null;

        // Leading zero?
        if (!qc[0]) qc.splice(0, 1);
      }

      if (base == BASE) {

        // To calculate q.e, first get the number of digits of qc[0].
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);

        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

      // Caller is convertBase.
      } else {
        q.e = e;
        q.r = +more;
      }

      return q;
    };
  })();


  /*
   * Return a string representing the value of BigNumber n in fixed-point or exponential
   * notation rounded to the specified decimal places or significant digits.
   *
   * n: a BigNumber.
   * i: the index of the last digit required (i.e. the digit that may be rounded up).
   * rm: the rounding mode.
   * id: 1 (toExponential) or 2 (toPrecision).
   */
  function format(n, i, rm, id) {
    var c0, e, ne, len, str;

    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);

    if (!n.c) return n.toString();

    c0 = n.c[0];
    ne = n.e;

    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS)
       ? toExponential(str, ne)
       : toFixedPoint(str, ne, '0');
    } else {
      n = round(new BigNumber(n), i, rm);

      // n.e may have changed if the value was rounded up.
      e = n.e;

      str = coeffToString(n.c);
      len = str.length;

      // toPrecision returns exponential notation if the number of significant digits
      // specified is less than the number of digits necessary to represent the integer
      // part of the value in fixed-point notation.

      // Exponential notation.
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {

        // Append zeros?
        for (; len < i; str += '0', len++);
        str = toExponential(str, e);

      // Fixed-point notation.
      } else {
        i -= ne;
        str = toFixedPoint(str, e, '0');

        // Append zeros?
        if (e + 1 > len) {
          if (--i > 0) for (str += '.'; i--; str += '0');
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len) str += '.';
            for (; i--; str += '0');
          }
        }
      }
    }

    return n.s < 0 && c0 ? '-' + str : str;
  }


  // Handle BigNumber.max and BigNumber.min.
  function maxOrMin(args, method) {
    var n,
      i = 1,
      m = new BigNumber(args[0]);

    for (; i < args.length; i++) {
      n = new BigNumber(args[i]);

      // If any number is NaN, return NaN.
      if (!n.s) {
        m = n;
        break;
      } else if (method.call(m, n)) {
        m = n;
      }
    }

    return m;
  }


  /*
   * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
   * Called by minus, plus and times.
   */
  function normalise(n, c, e) {
    var i = 1,
      j = c.length;

     // Remove trailing zeros.
    for (; !c[--j]; c.pop());

    // Calculate the base 10 exponent. First get the number of digits of c[0].
    for (j = c[0]; j >= 10; j /= 10, i++);

    // Overflow?
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {

      // Infinity.
      n.c = n.e = null;

    // Underflow?
    } else if (e < MIN_EXP) {

      // Zero.
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }

    return n;
  }


  // Handle values that fail the validity test in BigNumber.
  parseNumeric = (function () {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
      dotAfter = /^([^.]+)\.$/,
      dotBefore = /^\.([^.]+)$/,
      isInfinityOrNaN = /^-?(Infinity|NaN)$/,
      whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;

    return function (x, str, isNum, b) {
      var base,
        s = isNum ? str : str.replace(whitespaceOrPlus, '');

      // No exception on ±Infinity or NaN.
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {

          // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
          s = s.replace(basePrefix, function (m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
            return !b || b == base ? p1 : m;
          });

          if (b) {
            base = b;

            // E.g. '1.' to '1', '.1' to '0.1'
            s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
          }

          if (str != s) return new BigNumber(s, base);
        }

        // '[BigNumber Error] Not a number: {n}'
        // '[BigNumber Error] Not a base {b} number: {n}'
        if (BigNumber.DEBUG) {
          throw Error
            (bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
        }

        // NaN
        x.s = null;
      }

      x.c = x.e = null;
    }
  })();


  /*
   * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
   * If r is truthy, it is known that there are more digits after the rounding digit.
   */
  function round(x, sd, rm, r) {
    var d, i, j, k, n, ni, rd,
      xc = x.c,
      pows10 = POWS_TEN;

    // if x is not Infinity or NaN...
    if (xc) {

      // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
      // n is a base 1e14 number, the value of the element of array x.c containing rd.
      // ni is the index of n within x.c.
      // d is the number of digits of n.
      // i is the index of rd within n including leading zeros.
      // j is the actual index of rd within n (if < 0, rd is a leading zero).
      out: {

        // Get the number of digits of the first element of xc.
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
        i = sd - d;

        // If the rounding digit is in the first element of xc...
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];

          // Get the rounding digit at index j of n.
          rd = n / pows10[d - j - 1] % 10 | 0;
        } else {
          ni = mathceil((i + 1) / LOG_BASE);

          if (ni >= xc.length) {

            if (r) {

              // Needed by sqrt.
              for (; xc.length <= ni; xc.push(0));
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];

            // Get the number of digits of n.
            for (d = 1; k >= 10; k /= 10, d++);

            // Get the index of rd within n.
            i %= LOG_BASE;

            // Get the index of rd within n, adjusted for leading zeros.
            // The number of leading zeros of n is given by LOG_BASE - d.
            j = i - LOG_BASE + d;

            // Get the rounding digit at index j of n.
            rd = j < 0 ? 0 : n / pows10[d - j - 1] % 10 | 0;
          }
        }

        r = r || sd < 0 ||

        // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
         xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);

        r = rm < 4
         ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2))
         : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&

          // Check whether the digit to the left of the rounding digit is odd.
          ((i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10) & 1 ||
           rm == (x.s < 0 ? 8 : 7));

        if (sd < 1 || !xc[0]) {
          xc.length = 0;

          if (r) {

            // Convert sd to decimal places.
            sd -= x.e + 1;

            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {

            // Zero.
            xc[0] = x.e = 0;
          }

          return x;
        }

        // Remove excess digits.
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];

          // E.g. 56700 becomes 56000 if 7 is the rounding digit.
          // j > 0 means i > number of leading zeros of n.
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }

        // Round up?
        if (r) {

          for (; ;) {

            // If the digit to be rounded up is in the first element of xc...
            if (ni == 0) {

              // i will be the length of xc[0] before k is added.
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++);

              // if i != k the length has increased.
              if (i != k) {
                x.e++;
                if (xc[0] == BASE) xc[0] = 1;
              }

              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE) break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }

        // Remove trailing zeros.
        for (i = xc.length; xc[--i] === 0; xc.pop());
      }

      // Overflow? Infinity.
      if (x.e > MAX_EXP) {
        x.c = x.e = null;

      // Underflow? Zero.
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }

    return x;
  }


  function valueOf(n) {
    var str,
      e = n.e;

    if (e === null) return n.toString();

    str = coeffToString(n.c);

    str = e <= TO_EXP_NEG || e >= TO_EXP_POS
      ? toExponential(str, e)
      : toFixedPoint(str, e, '0');

    return n.s < 0 ? '-' + str : str;
  }


  // PROTOTYPE/INSTANCE METHODS


  /*
   * Return a new BigNumber whose value is the absolute value of this BigNumber.
   */
  P.absoluteValue = P.abs = function () {
    var x = new BigNumber(this);
    if (x.s < 0) x.s = 1;
    return x;
  };


  /*
   * Return
   *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
   *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
   *   0 if they have the same value,
   *   or null if the value of either is NaN.
   */
  P.comparedTo = function (y, b) {
    return compare(this, new BigNumber(y, b));
  };


  /*
   * If dp is undefined or null or true or false, return the number of decimal places of the
   * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   *
   * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.decimalPlaces = P.dp = function (dp, rm) {
    var c, n, v,
      x = this;

    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      return round(new BigNumber(x), dp + x.e + 1, rm);
    }

    if (!(c = x.c)) return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

    // Subtract the number of trailing zeros of the last number.
    if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
    if (n < 0) n = 0;

    return n;
  };


  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
   * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.dividedBy = P.div = function (y, b) {
    return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };


  /*
   * Return a new BigNumber whose value is the integer part of dividing the value of this
   * BigNumber by the value of BigNumber(y, b).
   */
  P.dividedToIntegerBy = P.idiv = function (y, b) {
    return div(this, new BigNumber(y, b), 0, 1);
  };


  /*
   * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
   *
   * If m is present, return the result modulo m.
   * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
   * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
   *
   * The modular power operation works efficiently when x, n, and m are integers, otherwise it
   * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
   *
   * n {number|string|BigNumber} The exponent. An integer.
   * [m] {number|string|BigNumber} The modulus.
   *
   * '[BigNumber Error] Exponent not an integer: {n}'
   */
  P.exponentiatedBy = P.pow = function (n, m) {
    var half, isModExp, i, k, more, nIsBig, nIsNeg, nIsOdd, y,
      x = this;

    n = new BigNumber(n);

    // Allow NaN and ±Infinity, but not other non-integers.
    if (n.c && !n.isInteger()) {
      throw Error
        (bignumberError + 'Exponent not an integer: ' + valueOf(n));
    }

    if (m != null) m = new BigNumber(m);

    // Exponent of MAX_SAFE_INTEGER is 15.
    nIsBig = n.e > 14;

    // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {

      // The sign of the result of pow when x is negative depends on the evenness of n.
      // If +n overflows to ±Infinity, the evenness of n would be not be known.
      y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }

    nIsNeg = n.s < 0;

    if (m) {

      // x % m returns NaN if abs(m) is zero, or m is NaN.
      if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);

      isModExp = !nIsNeg && x.isInteger() && m.isInteger();

      if (isModExp) x = x.mod(m);

    // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
    // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
      // [1, 240000000]
      ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
      // [80000000000000]  [99999750000000]
      : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {

      // If x is negative and n is odd, k = -0, else k = 0.
      k = x.s < 0 && isOdd(n) ? -0 : 0;

      // If x >= 1, k = ±Infinity.
      if (x.e > -1) k = 1 / k;

      // If n is negative return ±0, else return ±Infinity.
      return new BigNumber(nIsNeg ? 1 / k : k);

    } else if (POW_PRECISION) {

      // Truncating each coefficient array to a length of k after each multiplication
      // equates to truncating significant digits to POW_PRECISION + [28, 41],
      // i.e. there will be a minimum of 28 guard digits retained.
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }

    if (nIsBig) {
      half = new BigNumber(0.5);
      if (nIsNeg) n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }

    y = new BigNumber(ONE);

    // Performs 54 loop iterations for n of 9007199254740991.
    for (; ;) {

      if (nIsOdd) {
        y = y.times(x);
        if (!y.c) break;

        if (k) {
          if (y.c.length > k) y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m);    //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
        }
      }

      if (i) {
        i = mathfloor(i / 2);
        if (i === 0) break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);

        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0) break;
          nIsOdd = i % 2;
        }
      }

      x = x.times(x);

      if (k) {
        if (x.c && x.c.length > k) x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m);    //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
      }
    }

    if (isModExp) return y;
    if (nIsNeg) y = ONE.div(y);

    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
   * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
   */
  P.integerValue = function (rm) {
    var n = new BigNumber(this);
    if (rm == null) rm = ROUNDING_MODE;
    else intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };


  /*
   * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isEqualTo = P.eq = function (y, b) {
    return compare(this, new BigNumber(y, b)) === 0;
  };


  /*
   * Return true if the value of this BigNumber is a finite number, otherwise return false.
   */
  P.isFinite = function () {
    return !!this.c;
  };


  /*
   * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isGreaterThan = P.gt = function (y, b) {
    return compare(this, new BigNumber(y, b)) > 0;
  };


  /*
   * Return true if the value of this BigNumber is greater than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;

  };


  /*
   * Return true if the value of this BigNumber is an integer, otherwise return false.
   */
  P.isInteger = function () {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };


  /*
   * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isLessThan = P.lt = function (y, b) {
    return compare(this, new BigNumber(y, b)) < 0;
  };


  /*
   * Return true if the value of this BigNumber is less than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isLessThanOrEqualTo = P.lte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
  };


  /*
   * Return true if the value of this BigNumber is NaN, otherwise return false.
   */
  P.isNaN = function () {
    return !this.s;
  };


  /*
   * Return true if the value of this BigNumber is negative, otherwise return false.
   */
  P.isNegative = function () {
    return this.s < 0;
  };


  /*
   * Return true if the value of this BigNumber is positive, otherwise return false.
   */
  P.isPositive = function () {
    return this.s > 0;
  };


  /*
   * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
   */
  P.isZero = function () {
    return !!this.c && this.c[0] == 0;
  };


  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber minus the value of
   * BigNumber(y, b).
   */
  P.minus = function (y, b) {
    var i, j, t, xLTy,
      x = this,
      a = x.s;

    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;

    if (!xe || !ye) {

      // Either Infinity?
      if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

      // Either zero?
      if (!xc[0] || !yc[0]) {

        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :

         // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
         ROUNDING_MODE == 3 ? -0 : 0);
      }
    }

    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Determine which is the bigger number.
    if (a = xe - ye) {

      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();

      // Prepend zeros to equalise exponents.
      for (b = a; b--; t.push(0));
      t.reverse();
    } else {

      // Exponents equal. Check digit by digit.
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;

      for (a = b = 0; b < j; b++) {

        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xLTy) t = xc, xc = yc, yc = t, y.s = -y.s;

    b = (j = yc.length) - (i = xc.length);

    // Append zeros to xc if shorter.
    // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
    if (b > 0) for (; b--; xc[i++] = 0);
    b = BASE - 1;

    // Subtract yc from xc.
    for (; j > a;) {

      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b);
        --xc[i];
        xc[j] += BASE;
      }

      xc[j] -= yc[j];
    }

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] == 0; xc.splice(0, 1), --ye);

    // Zero?
    if (!xc[0]) {

      // Following IEEE 754 (2008) 6.3,
      // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }

    // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
    // for finite x and y.
    return normalise(y, xc, ye);
  };


  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
   * BigNumber(y, b). The result depends on the value of MODULO_MODE.
   */
  P.modulo = P.mod = function (y, b) {
    var q, s,
      x = this;

    y = new BigNumber(y, b);

    // Return NaN if x is Infinity or NaN, or y is NaN or zero.
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber(NaN);

    // Return x if y is Infinity or x is zero.
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber(x);
    }

    if (MODULO_MODE == 9) {

      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // r = x - qy    where  0 <= r < abs(y)
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }

    y = x.minus(q.times(y));

    // To match JavaScript %, ensure sign of zero is sign of dividend.
    if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;

    return y;
  };


  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
   * of BigNumber(y, b).
   */
  P.multipliedBy = P.times = function (y, b) {
    var c, e, i, j, k, m, xcL, xlo, xhi, ycL, ylo, yhi, zc,
      base, sqrtBase,
      x = this,
      xc = x.c,
      yc = (y = new BigNumber(y, b)).c;

    // Either NaN, ±Infinity or ±0?
    if (!xc || !yc || !xc[0] || !yc[0]) {

      // Return NaN if either is NaN, or one is 0 and the other is Infinity.
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;

        // Return ±Infinity if either is ±Infinity.
        if (!xc || !yc) {
          y.c = y.e = null;

        // Return ±0 if either is ±0.
        } else {
          y.c = [0];
          y.e = 0;
        }
      }

      return y;
    }

    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;

    // Ensure xc points to longer array and xcL to its length.
    if (xcL < ycL) zc = xc, xc = yc, yc = zc, i = xcL, xcL = ycL, ycL = i;

    // Initialise the result array with zeros.
    for (i = xcL + ycL, zc = []; i--; zc.push(0));

    base = BASE;
    sqrtBase = SQRT_BASE;

    for (i = ycL; --i >= 0;) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;

      for (k = xcL, j = i + k; j > i;) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + ((m % sqrtBase) * sqrtBase) + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }

      zc[j] = c;
    }

    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }

    return normalise(y, zc, e);
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber negated,
   * i.e. multiplied by -1.
   */
  P.negated = function () {
    var x = new BigNumber(this);
    x.s = -x.s || null;
    return x;
  };


  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber plus the value of
   * BigNumber(y, b).
   */
  P.plus = function (y, b) {
    var t,
      x = this,
      a = x.s;

    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
     if (a != b) {
      y.s = -b;
      return x.minus(y);
    }

    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;

    if (!xe || !ye) {

      // Return ±Infinity if either ±Infinity.
      if (!xc || !yc) return new BigNumber(a / 0);

      // Either zero?
      // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
      if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
    }

    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }

      t.reverse();
      for (; a--; t.push(0));
      t.reverse();
    }

    a = xc.length;
    b = yc.length;

    // Point xc to the longer array, and b to the shorter length.
    if (a - b < 0) t = yc, yc = xc, xc = t, b = a;

    // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
    for (a = 0; b;) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }

    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    // ye = MAX_EXP + 1 possible
    return normalise(y, xc, ye);
  };


  /*
   * If sd is undefined or null or true or false, return the number of significant digits of
   * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   * If sd is true include integer-part trailing zeros in the count.
   *
   * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
   *                     boolean: whether to count integer-part trailing zeros: true or false.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.precision = P.sd = function (sd, rm) {
    var c, n, v,
      x = this;

    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null) rm = ROUNDING_MODE;
      else intCheck(rm, 0, 8);

      return round(new BigNumber(x), sd, rm);
    }

    if (!(c = x.c)) return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;

    if (v = c[v]) {

      // Subtract the number of trailing zeros of the last element.
      for (; v % 10 == 0; v /= 10, n--);

      // Add the number of digits of the first element.
      for (v = c[0]; v >= 10; v /= 10, n++);
    }

    if (sd && x.e + 1 > n) n = x.e + 1;

    return n;
  };


  /*
   * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
   * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
   *
   * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
   */
  P.shiftedBy = function (k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times('1e' + k);
  };


  /*
   *  sqrt(-n) =  N
   *  sqrt(N) =  N
   *  sqrt(-I) =  N
   *  sqrt(I) =  I
   *  sqrt(0) =  0
   *  sqrt(-0) = -0
   *
   * Return a new BigNumber whose value is the square root of the value of this BigNumber,
   * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.squareRoot = P.sqrt = function () {
    var m, n, r, rep, t,
      x = this,
      c = x.c,
      s = x.s,
      e = x.e,
      dp = DECIMAL_PLACES + 4,
      half = new BigNumber('0.5');

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }

    // Initial estimate.
    s = Math.sqrt(+valueOf(x));

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);

      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }

      r = new BigNumber(n);
    } else {
      r = new BigNumber(s + '');
    }

    // Check for zero.
    // r could be zero if MIN_EXP is changed after the this value was created.
    // This would cause a division by zero (x/t) and hence Infinity below, which would cause
    // coeffToString to throw.
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3) s = 0;

      // Newton-Raphson iteration.
      for (; ;) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));

        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {

          // The exponent of r may here be one less than the final result exponent,
          // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
          // are indexed correctly.
          if (r.e < e) --s;
          n = n.slice(s - 3, s + 1);

          // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
          // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
          // iteration.
          if (n == '9999' || !rep && n == '4999') {

            // On the first iteration only, check to see if rounding up gives the
            // exact result as the nines may infinitely repeat.
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);

              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }

            dp += 4;
            s += 4;
            rep = 1;
          } else {

            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
            // result. If not, then there are further digits and m will be truthy.
            if (!+n || !+n.slice(1) && n.charAt(0) == '5') {

              // Truncate to the first rounding digit.
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }

            break;
          }
        }
      }
    }

    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };


  /*
   * Return a string representing the value of this BigNumber in exponential notation and
   * rounded using ROUNDING_MODE to dp fixed decimal places.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toExponential = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };


  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounding
   * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
   * but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toFixed = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };


  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounded
   * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
   * of the format or FORMAT object (see BigNumber.set).
   *
   * The formatting object may contain some or all of the properties shown below.
   *
   * FORMAT = {
   *   prefix: '',
   *   groupSize: 3,
   *   secondaryGroupSize: 0,
   *   groupSeparator: ',',
   *   decimalSeparator: '.',
   *   fractionGroupSize: 0,
   *   fractionGroupSeparator: '\xA0',      // non-breaking space
   *   suffix: ''
   * };
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   * [format] {object} Formatting options. See FORMAT pbject above.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   * '[BigNumber Error] Argument not an object: {format}'
   */
  P.toFormat = function (dp, rm, format) {
    var str,
      x = this;

    if (format == null) {
      if (dp != null && rm && typeof rm == 'object') {
        format = rm;
        rm = null;
      } else if (dp && typeof dp == 'object') {
        format = dp;
        dp = rm = null;
      } else {
        format = FORMAT;
      }
    } else if (typeof format != 'object') {
      throw Error
        (bignumberError + 'Argument not an object: ' + format);
    }

    str = x.toFixed(dp, rm);

    if (x.c) {
      var i,
        arr = str.split('.'),
        g1 = +format.groupSize,
        g2 = +format.secondaryGroupSize,
        groupSeparator = format.groupSeparator || '',
        intPart = arr[0],
        fractionPart = arr[1],
        isNeg = x.s < 0,
        intDigits = isNeg ? intPart.slice(1) : intPart,
        len = intDigits.length;

      if (g2) i = g1, g1 = g2, g2 = i, len -= i;

      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
        if (isNeg) intPart = '-' + intPart;
      }

      str = fractionPart
       ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize)
        ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'),
         '$&' + (format.fractionGroupSeparator || ''))
        : fractionPart)
       : intPart;
    }

    return (format.prefix || '') + str + (format.suffix || '');
  };


  /*
   * Return an array of two BigNumbers representing the value of this BigNumber as a simple
   * fraction with an integer numerator and an integer denominator.
   * The denominator will be a positive non-zero value less than or equal to the specified
   * maximum denominator. If a maximum denominator is not specified, the denominator will be
   * the lowest value necessary to represent the number exactly.
   *
   * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
   *
   * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
   */
  P.toFraction = function (md) {
    var d, d0, d1, d2, e, exp, n, n0, n1, q, r, s,
      x = this,
      xc = x.c;

    if (md != null) {
      n = new BigNumber(md);

      // Throw if md is less than one or is not an integer, unless it is Infinity.
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error
          (bignumberError + 'Argument ' +
            (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
      }
    }

    if (!xc) return new BigNumber(x);

    d = new BigNumber(ONE);
    n1 = d0 = new BigNumber(ONE);
    d1 = n0 = new BigNumber(ONE);
    s = coeffToString(xc);

    // Determine initial denominator.
    // d is a power of 10 and the minimum max denominator that specifies the value exactly.
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? (e > 0 ? d : n1) : n;

    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber(s);

    // n0 = d1 = 0
    n0.c[0] = 0;

    for (; ;)  {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1) break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }

    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;

    // Determine which fraction is closer to x, n0/d0 or n1/d1
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(
        div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];

    MAX_EXP = exp;

    return r;
  };


  /*
   * Return the value of this BigNumber converted to a number primitive.
   */
  P.toNumber = function () {
    return +valueOf(this);
  };


  /*
   * Return a string representing the value of this BigNumber rounded to sd significant digits
   * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
   * necessary to represent the integer part of the value in fixed-point notation, then use
   * exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.toPrecision = function (sd, rm) {
    if (sd != null) intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };


  /*
   * Return a string representing the value of this BigNumber in base b, or base 10 if b is
   * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
   * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
   * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
   * TO_EXP_NEG, return exponential notation.
   *
   * [b] {number} Integer, 2 to ALPHABET.length inclusive.
   *
   * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
   */
  P.toString = function (b) {
    var str,
      n = this,
      s = n.s,
      e = n.e;

    // Infinity or NaN?
    if (e === null) {
      if (s) {
        str = 'Infinity';
        if (s < 0) str = '-' + str;
      } else {
        str = 'NaN';
      }
    } else {
      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS
         ? toExponential(coeffToString(n.c), e)
         : toFixedPoint(coeffToString(n.c), e, '0');
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, '0');
      } else {
        intCheck(b, 2, ALPHABET.length, 'Base');
        str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
      }

      if (s < 0 && n.c[0]) str = '-' + str;
    }

    return str;
  };


  /*
   * Return as toString, but do not accept a base argument, and include the minus sign for
   * negative zero.
   */
  P.valueOf = P.toJSON = function () {
    return valueOf(this);
  };


  P._isBigNumber = true;

  P[Symbol.toStringTag] = 'BigNumber';

  // Node.js v10.12.0+
  P[Symbol.for('nodejs.util.inspect.custom')] = P.valueOf;

  if (configObject != null) BigNumber.set(configObject);

  return BigNumber;
}


// PRIVATE HELPER FUNCTIONS

// These functions don't need access to variables,
// e.g. DECIMAL_PLACES, in the scope of the `clone` function above.


function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}


// Return a coefficient array as a string of base 10 digits.
function coeffToString(a) {
  var s, z,
    i = 1,
    j = a.length,
    r = a[0] + '';

  for (; i < j;) {
    s = a[i++] + '';
    z = LOG_BASE - s.length;
    for (; z--; s = '0' + s);
    r += s;
  }

  // Determine trailing zeros.
  for (j = r.length; r.charCodeAt(--j) === 48;);

  return r.slice(0, j + 1 || 1);
}


// Compare the value of BigNumbers x and y.
function compare(x, y) {
  var a, b,
    xc = x.c,
    yc = y.c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either NaN?
  if (!i || !j) return null;

  a = xc && !xc[0];
  b = yc && !yc[0];

  // Either zero?
  if (a || b) return a ? b ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;

  a = i < 0;
  b = k == l;

  // Either Infinity?
  if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

  // Compare exponents.
  if (!b) return k > l ^ a ? 1 : -1;

  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

  // Compare lengths.
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}


/*
 * Check that n is a primitive number, an integer, and in range, otherwise throw.
 */
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== mathfloor(n)) {
    throw Error
     (bignumberError + (name || 'Argument') + (typeof n == 'number'
       ? n < min || n > max ? ' out of range: ' : ' not an integer: '
       : ' not a primitive number: ') + String(n));
  }
}


// Assumes finite n.
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}


function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) +
   (e < 0 ? 'e' : 'e+') + e;
}


function toFixedPoint(str, e, z) {
  var len, zs;

  // Negative exponent?
  if (e < 0) {

    // Prepend zeros.
    for (zs = z + '.'; ++e; zs += z);
    str = zs + str;

  // Positive exponent
  } else {
    len = str.length;

    // Append zeros.
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z);
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + '.' + str.slice(e);
    }
  }

  return str;
}


// EXPORT


var bignumber_BigNumber = clone();

/* harmony default export */ var bignumber = (bignumber_BigNumber);

;// CONCATENATED MODULE: ./node_modules/@solana/buffer-layout-utils/lib/esm/decimal.mjs



const WAD = new bignumber('1e+18');
const decimal = (property) => {
    const layout = u128(property);
    const { encode, decode } = encodeDecode(layout);
    const decimalLayout = layout;
    decimalLayout.decode = (buffer, offset) => {
        const src = decode(buffer, offset).toString();
        return new BigNumber(src).div(WAD);
    };
    decimalLayout.encode = (decimal, buffer, offset) => {
        const src = BigInt(decimal.times(WAD).integerValue().toString());
        return encode(src, buffer, offset);
    };
    return decimalLayout;
};
//# sourceMappingURL=decimal.js.map
;// CONCATENATED MODULE: ./node_modules/@solana/buffer-layout-utils/lib/esm/native.mjs


const bool = (property) => {
    const layout = (0,Layout.u8)(property);
    const { encode, decode } = base_encodeDecode(layout);
    const boolLayout = layout;
    boolLayout.decode = (buffer, offset) => {
        const src = decode(buffer, offset);
        return !!src;
    };
    boolLayout.encode = (bool, buffer, offset) => {
        const src = Number(bool);
        return encode(src, buffer, offset);
    };
    return boolLayout;
};
//# sourceMappingURL=native.js.map
// EXTERNAL MODULE: ./node_modules/@solana/web3.js/lib/index.browser.esm.js + 20 modules
var index_browser_esm = __webpack_require__(1208);
;// CONCATENATED MODULE: ./node_modules/@solana/buffer-layout-utils/lib/esm/web3.mjs



const publicKey = (property) => {
    const layout = (0,Layout/* blob */.Ik)(32, property);
    const { encode, decode } = base_encodeDecode(layout);
    const publicKeyLayout = layout;
    publicKeyLayout.decode = (buffer, offset) => {
        const src = decode(buffer, offset);
        return new index_browser_esm.PublicKey(src);
    };
    publicKeyLayout.encode = (publicKey, buffer, offset) => {
        const src = publicKey.toBuffer();
        return encode(src, buffer, offset);
    };
    return publicKeyLayout;
};
//# sourceMappingURL=web3.js.map
;// CONCATENATED MODULE: ./node_modules/@solana/buffer-layout-utils/lib/esm/index.mjs





//# sourceMappingURL=index.js.map
// EXTERNAL MODULE: ./node_modules/@solana/spl-token/lib/esm/constants.js
var constants = __webpack_require__(8467);
;// CONCATENATED MODULE: ./node_modules/@solana/spl-token/lib/esm/errors.js
/** Base class for errors */
class TokenError extends Error {
    constructor(message) {
        super(message);
    }
}
/** Thrown if an account is not found at the expected address */
class errors_TokenAccountNotFoundError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenAccountNotFoundError';
    }
}
/** Thrown if a program state account is not a valid Account */
class TokenInvalidAccountError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidAccountError';
    }
}
/** Thrown if a program state account is not owned by the expected token program */
class errors_TokenInvalidAccountOwnerError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidAccountOwnerError';
    }
}
/** Thrown if the byte length of an program state account doesn't match the expected size */
class errors_TokenInvalidAccountSizeError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidAccountSizeError';
    }
}
/** Thrown if the mint of a token account doesn't match the expected mint */
class errors_TokenInvalidMintError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidMintError';
    }
}
/** Thrown if the owner of a token account doesn't match the expected owner */
class TokenInvalidOwnerError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidOwnerError';
    }
}
/** Thrown if the owner of a token account is a PDA (Program Derived Address) */
class errors_TokenOwnerOffCurveError extends TokenError {
    constructor() {
        super(...arguments);
        this.name = 'TokenOwnerOffCurveError';
    }
}
/** Thrown if an instruction's program is invalid */
class TokenInvalidInstructionProgramError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidInstructionProgramError';
    }
}
/** Thrown if an instruction's keys are invalid */
class TokenInvalidInstructionKeysError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidInstructionKeysError';
    }
}
/** Thrown if an instruction's data is invalid */
class TokenInvalidInstructionDataError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidInstructionDataError';
    }
}
/** Thrown if an instruction's type is invalid */
class TokenInvalidInstructionTypeError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenInvalidInstructionTypeError';
    }
}
/** Thrown if the program does not support the desired instruction */
class TokenUnsupportedInstructionError extends (/* unused pure expression or super */ null && (TokenError)) {
    constructor() {
        super(...arguments);
        this.name = 'TokenUnsupportedInstructionError';
    }
}
//# sourceMappingURL=errors.js.map
;// CONCATENATED MODULE: ./node_modules/@solana/spl-token/lib/esm/state/mint.js
/* provided dependency */ var mint_Buffer = __webpack_require__(8764)["Buffer"];









/** Buffer layout for de/serializing a mint */
const MintLayout = (0,Layout/* struct */.n_)([
    (0,Layout/* u32 */.Jq)('mintAuthorityOption'),
    publicKey('mintAuthority'),
    u64('supply'),
    (0,Layout.u8)('decimals'),
    bool('isInitialized'),
    (0,Layout/* u32 */.Jq)('freezeAuthorityOption'),
    publicKey('freezeAuthority'),
]);
/** Byte length of a mint */
const MINT_SIZE = MintLayout.span;
/**
 * Retrieve information about a mint
 *
 * @param connection Connection to use
 * @param address    Mint account
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Mint information
 */
async function getMint(connection, address, commitment, programId = TOKEN_PROGRAM_ID) {
    const info = await connection.getAccountInfo(address, commitment);
    return unpackMint(address, info, programId);
}
/**
 * Unpack a mint
 *
 * @param address   Mint account
 * @param info      Mint account data
 * @param programId SPL Token program account
 *
 * @return Unpacked mint
 */
function unpackMint(address, info, programId = TOKEN_PROGRAM_ID) {
    if (!info)
        throw new TokenAccountNotFoundError();
    if (!info.owner.equals(programId))
        throw new TokenInvalidAccountOwnerError();
    if (info.data.length < MINT_SIZE)
        throw new TokenInvalidAccountSizeError();
    const rawMint = MintLayout.decode(info.data.slice(0, MINT_SIZE));
    let tlvData = mint_Buffer.alloc(0);
    if (info.data.length > MINT_SIZE) {
        if (info.data.length <= ACCOUNT_SIZE)
            throw new TokenInvalidAccountSizeError();
        if (info.data.length === MULTISIG_SIZE)
            throw new TokenInvalidAccountSizeError();
        if (info.data[ACCOUNT_SIZE] != AccountType.Mint)
            throw new TokenInvalidMintError();
        tlvData = info.data.slice(ACCOUNT_SIZE + ACCOUNT_TYPE_SIZE);
    }
    return {
        address,
        mintAuthority: rawMint.mintAuthorityOption ? rawMint.mintAuthority : null,
        supply: rawMint.supply,
        decimals: rawMint.decimals,
        isInitialized: rawMint.isInitialized,
        freezeAuthority: rawMint.freezeAuthorityOption ? rawMint.freezeAuthority : null,
        tlvData,
    };
}
/** Get the minimum lamport balance for a mint to be rent exempt
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
async function getMinimumBalanceForRentExemptMint(connection, commitment) {
    return await getMinimumBalanceForRentExemptMintWithExtensions(connection, [], commitment);
}
/** Get the minimum lamport balance for a rent-exempt mint with extensions
 *
 * @param connection Connection to use
 * @param extensions Extension types included in the mint
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
async function getMinimumBalanceForRentExemptMintWithExtensions(connection, extensions, commitment) {
    const mintLen = getMintLen(extensions);
    return await connection.getMinimumBalanceForRentExemption(mintLen, commitment);
}
/**
 * Async version of getAssociatedTokenAddressSync
 * For backwards compatibility
 *
 * @param mint                     Token mint account
 * @param owner                    Owner of the new account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Promise containing the address of the associated token account
 */
async function getAssociatedTokenAddress(mint, owner, allowOwnerOffCurve = false, programId = constants/* TOKEN_PROGRAM_ID */.H_, associatedTokenProgramId = constants/* ASSOCIATED_TOKEN_PROGRAM_ID */._u) {
    if (!allowOwnerOffCurve && !index_browser_esm.PublicKey.isOnCurve(owner.toBuffer()))
        throw new errors_TokenOwnerOffCurveError();
    const [address] = await index_browser_esm.PublicKey.findProgramAddress([owner.toBuffer(), programId.toBuffer(), mint.toBuffer()], associatedTokenProgramId);
    return address;
}
/**
 * Get the address of the associated token account for a given mint and owner
 *
 * @param mint                     Token mint account
 * @param owner                    Owner of the new account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the associated token account
 */
function getAssociatedTokenAddressSync(mint, owner, allowOwnerOffCurve = false, programId = TOKEN_PROGRAM_ID, associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID) {
    if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer()))
        throw new TokenOwnerOffCurveError();
    const [address] = PublicKey.findProgramAddressSync([owner.toBuffer(), programId.toBuffer(), mint.toBuffer()], associatedTokenProgramId);
    return address;
}
//# sourceMappingURL=mint.js.map

/***/ })

}]);
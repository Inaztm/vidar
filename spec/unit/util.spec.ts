import etro from '../../src/index'
import { mockCanvas } from './mocks/dom'
import { mockBaseLayer } from './mocks/layer'
import { mockMovie } from './mocks/movie'

describe('Unit Tests ->', function () {
  describe('Util', function () {
    describe('applyOptions', function () {
      it('should not apply any options with no provided or default options', function () {
        const etroobj = mockBaseLayer()
        const snapshot = { ...etroobj } // store state before applying options
        etro.applyOptions({}, etroobj)
        expect(etroobj).toEqual(snapshot) // should be the same as it was
      })

      it('should apply default options', function () {
        const etroobj = mockMovie()
        const snapshot = { ...etroobj } // store state before applying options
        const defaultOpt = {
          canvas: null
        }
        etro.applyOptions({}, etroobj)
        expect(etroobj).toEqual({ ...defaultOpt, ...snapshot }) // defaultOpt should be applied to etroobj
      })

      it('should not override provided options with default values', function () {
        const etroobj = mockMovie() as etro.Movie
        const originalCanvas = etroobj.canvas
        const providedOpt = {
          canvas: mockCanvas()
        }
        etro.applyOptions(providedOpt, etroobj)
        expect(etroobj.canvas).toBe(originalCanvas)
      })

      it('should not override existing object state', function () {
        const etroobj = mockMovie()
        const originalCanvas = etroobj.canvas
        etro.applyOptions({
          canvas: mockCanvas()
        }, etroobj)
        expect(etroobj.canvas).toBe(originalCanvas)
      })

      it('should not allow arbitrary options', function () {
        const etroobj = mockBaseLayer()
        expect(() => etro.applyOptions({ foo: null }, etroobj)).toThrow(new Error("Invalid option: 'foo'"))
      })
    })

    describe('val', function () {
      class DynamicLayer<T> extends etro.layer.Base {
        prop: etro.Dynamic<T>
      }

      it('should work on simple values', function () {
        // _movie is unique, so it won't depend on existing cache
        // TODO: Cast the layer to `DynamicLayer`.
        const elem = mockBaseLayer()
        expect(etro.val(elem, 'prop', 0)).toBe(elem.prop)
      })

      it('should interpolate keyframes', function () {
        // TODO: Cast the layer to `DynamicLayer`.
        const elem = mockBaseLayer()
        elem.prop = new etro.KeyFrame([0, 0], [4, 1])
        for (let i = 0; i <= 4; i += Math.random()) {
          expect(etro.val(elem, 'prop', i)).toBe(i / 4)
          etro.clearCachedValues(elem.movie)
        }
      })

      it('should work with noninterpolated keyframes', function () {
        const elem = mockBaseLayer() as DynamicLayer<string>
        elem.prop = new etro.KeyFrame([0, 'start'], [4, 'end'])

        expect(etro.val(elem, 'prop', 0)).toBe('start')
        etro.clearCachedValues(elem.movie)
        expect(etro.val(elem, 'prop', 3)).toBe('start')
        etro.clearCachedValues(elem.movie)
        expect(etro.val(elem, 'prop', 4)).toBe('end')
        etro.clearCachedValues(elem.movie)
      })

      it('should use individual interpolation methods', function () {
        // TODO: Cast the layer to `DynamicLayer`.
        const elem = mockBaseLayer()
        elem.prop = new etro.KeyFrame([0, 0, etro.cosineInterp], [1, 4])
        expect(etro.val(elem, 'prop', 0.5)).toBe(etro.cosineInterp(0, 4, 0.5))
      })

      it('should call property filters', function () {
        // TODO: Cast the layer to `DynamicLayer`.
        const elem = mockBaseLayer()
        elem.prop = 'value'
        elem.propertyFilters.prop = (value, key, elem) => 'new value'
        expect(etro.val(elem, 'prop', 0)).toBe('new value')
      })
    })

    describe('linearInterp', function () {
      it('should interpolate numbers', function () {
        expect(etro.linearInterp(5, 10, 0.5, undefined)).toBe(7.5)
      })

      it('should interpolate objects recursively', function () {
        expect(etro.linearInterp(
          {
            foo: {
              bar: 0
            }
          },
          {
            foo: {
              bar: 100
            }
          },
          0.5,
          undefined
        )).toEqual(
          {
            foo: {
              bar: 50
            }
          }
        )
      })
    })

    describe('cosineInterp', function () {
      it('should interpolate numbers', function () {
        const x1 = 5
        const x2 = 10
        const t = 0.5
        const cos = Math.cos(t * Math.PI / 2)
        expect(etro.cosineInterp(x1, x2, t, undefined))
          .toBe(cos * x1 + (1 - cos) * x2)
      })

      it('should interpolate objects recursively', function () {
        expect(etro.cosineInterp(
          {
            foo: {
              bar: 0
            }
          },
          {
            foo: {
              bar: 100
            }
          },
          0.5,
          undefined
        )).toEqual(
          {
            foo: {
              bar: (1 - Math.cos(0.5 * Math.PI / 2)) * 100
            }
          }
        )
      })
    })

    describe('Color ->', function () {
      it('toString() should convert to RGBA', function () {
        expect(new etro.Color(255, 0, 255, 0.5).toString())
          .toBe('rgba(255, 0, 255, 0.5)')
      })
    })

    describe('parseColor', function () {
      it('should parse RGB colors', function () {
        expect(etro.parseColor('rgb(255,0,0)'))
          .toEqual(new etro.Color(255, 0, 0))
      })

      it('should parse RGBA colors', function () {
        expect(etro.parseColor('rgba(0,255,0,1)'))
          .toEqual(new etro.Color(0, 255, 0, 1))
      })

      it('should parse hex colors', function () {
        expect(etro.parseColor('#00f'))
          .toEqual(new etro.Color(0, 0, 255))
      })

      it('should parse named colors', function () {
        expect(etro.parseColor('blue'))
          .toEqual(new etro.Color(0, 0, 255))
      })
    })

    describe('Font ->', function () {
      it('toString() should convert to CSS font', function () {
        expect(new etro.Font(16, 'px', 'monospace').toString())
          .toBe('16px monospace')
      })
    })

    describe('parseFont', function () {
      it('should parse CSS fonts', function () {
        expect(etro.parseFont('16em monospace'))
          .toEqual(new etro.Font(16, 'em', 'monospace'))
      })

      it('should work with multiple word fonts', function () {
        expect(etro.parseFont('16px "Times New Roman"'))
          .toEqual(new etro.Font(16, 'px', '"Times New Roman"'))
      })
    })
  })
})

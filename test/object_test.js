import { expect } from 'chai'
import { object } from '../src'
import { sampleObject1, sampleObject2 } from './support/fixtures/objects'
import { sampleArray1, sampleArray2 } from './support/fixtures/arrays'
import jsdoctest from 'jsdoc-test'

describe('object', () => {

  describe('doctests', () => jsdoctest('./src/object/index.js') )
 
  describe('diff/2', () => {

    it('should return an array of objects that describe the differences between two objects', () => {
      const object1 = {
        firstName: 'john',
        lastName: 'smith',
        address: {
          zip: '32952',
          country: 'US',
        },
        catchPhrase: 'ayyyyy!',
        friends: ['travis'],
        special: NaN,
      }
      const object2 = {
        firstName: 'travis',
        lastName: 'smith',
        address: {
          zip: '90832',
          country: 'US',
        },
        car: {
          make: 'toyota',
          model: 'rav4',
        },
        friends: ['john'],
        special: NaN,
      }
      const diff = object.diff(object1, object2)
      const expectedDiff = [
        { key: 'firstName', firstValue: 'john', secondValue: 'travis' },
        { key: 'address', firstValue: {zip: '32952', country: 'US'}, secondValue: {zip: '90832', country: 'US'} },
        { key: 'address.zip', firstValue: '32952', secondValue: '90832' },
        { key: 'catchPhrase', firstValue: 'ayyyyy!', secondValue: undefined },
        { key: 'friends', firstValue: ['travis'], secondValue: ['john'] },
        { key: 'friends.0', firstValue: 'travis', secondValue: 'john' },
        { key: 'car', firstValue: undefined, secondValue: {make: 'toyota', model: 'rav4'} },
        { key: 'car.make', firstValue: undefined, secondValue: 'toyota' },
        { key: 'car.model', firstValue: undefined, secondValue: 'rav4' },
      ]

      expect(diff).to.eql(expectedDiff)
    })
  })

  describe('digAndPut/3', () => {
    it('should put the value in the object where the keys point to', () => {
      const sampleObject = {
        woah: {
          this: {
            is: ['getting', { pretty: 'deep' } ]
          }
        }
      }

      const expectedObjectAfterPut = {
        woah: {
          this: {
            is: ['getting', { pretty: 'meh, not too deep' } ]
          }
        }
      }
      const nestedKeys = ['woah', 'this', 'is', '1', 'pretty']
      const objectAfterPut = object.digAndPut(sampleObject, nestedKeys, 'meh, not too deep')
      const objectAfterPutWithStingKeys = object.digAndPut(sampleObject, nestedKeys.join('.'), 'meh, not too deep')

      expect(objectAfterPut).to.eql(expectedObjectAfterPut)
      expect(objectAfterPutWithStingKeys).to.eql(expectedObjectAfterPut)
    })

    it('README example', () => {
      const sampleObject = {
        hi: 'there',
        i: {
          have: {
            some: 'data',
          },
          also: ['a', 'array'],
        },
      }
      
      const newObject = object.digAndPut(sampleObject, ['i', 'also', '0'], 'an')
      expect(newObject).to.eql({
        hi: 'there',
        i: {
          have: {
            some: 'data',
          },
          also: ['an', 'array'],
        },
      })
    })
  })

  describe('dig/2', () => {

    it('should return the value stored in the object, using the array/string of keys to get to it', () => {

      expect( object.dig(sampleObject1, ['i', 'have', 'some']) ).to.equal('data')
      expect( object.dig(sampleObject1, ['i', 'also', '1']) ).to.equal('array')
    })
  })

  describe('equivalent/2', () =>  {

    it('should return true if two objects are equivalent', () => {
      const clonedObject = JSON.parse( JSON.stringify(sampleObject1) )
      expect( object.equivalent(sampleObject1, clonedObject) ).to.equal(true)
      expect( object.equivalent(sampleObject1, sampleObject2) ).to.equal(false)
    })

    it('should also work for arrays', () => {
      const clonedArray = JSON.parse( JSON.stringify(sampleArray1) )
      expect( object.equivalent(sampleArray1, clonedArray) ).to.equal(true)
      expect( object.equivalent(sampleArray1, sampleArray2) ).to.equal(false)
    })

    it('should handle undefined', () => {
      expect( object.equivalent([undefined], [undefined]) ).to.equal(true)
      expect( object.equivalent([undefined, 1], [undefined, 1]) ).to.equal(true)
      expect( object.equivalent([undefined, 1], [undefined, 2]) ).to.equal(false)
    })

    it('should handle NaN', () => {
      expect( object.equivalent([NaN], [NaN]) ).to.equal(true)
      expect( object.equivalent([NaN, 1], [NaN, 1]) ).to.equal(true)
      expect( object.equivalent([NaN, 1], [NaN, 2]) ).to.equal(false)
    })
  })

  describe('groupBy/2', () => {
    
    it('should return an object that groups the elements via the function', () => {
      const people = [
        {name: 'john', age: 56},
        {name: 'joey', age: 54},
        {name: 'jimmy', age: 56},
        {name: 'josh', age: 49},
      ]

      const expectedGroupedPeople = {
        49: [ {name: 'josh', age: 49} ],
        54: [ {name: 'joey', age: 54} ],
        56: [ {name: 'john', age: 56}, {name: 'jimmy', age: 56} ],
      }

      const grouped = object.groupBy(people, (person) => person.age)

      expect(grouped).to.eql(expectedGroupedPeople)
    })
  })

  describe('merge/2', () => {

    it('should merge two objects together', () => {

      const mergedObject = object.merge(sampleObject1, sampleObject2)
      const expectedMergedObject = {
        hi: 'there',
        i: {
          have: {
            some: 'data',
          },
          also: ['an', 'array'],
        },
        that: {
          is: 'all, again',
        },
        woah: 5,
        a: 'number',
        now: {
          a: {
            string: '5',
            version: 'nice!',
          },
        },
      }

      expect(mergedObject).to.eql(expectedMergedObject)
    })
  })

  describe('keyPaths', () => {

    it('should return an array of keypaths for the given object', () => {

      const expectedKeyPaths = [
        ['hi'],
        ['i'],
        ['i', 'have'],
        ['i', 'have', 'some'],
        ['i', 'also'],
        ['i', 'also', '0'],
        ['i', 'also', '1'],
        ['that'],
        ['that', 'is'],
      ]

      const keyPaths = object.keyPaths(sampleObject1)

      expect(keyPaths).to.eql(expectedKeyPaths)
    })
  })

  describe('numberKeyedObjectToArray/1', () => {

    it('should return the object as an array', () => {

      const numberKeyedObject = {
        1: 'one',
        2: 'one',
        3: 'oops i mean two',
        4: 'dang! four!',
        5: 'five',
        6: 'back on track',
        7: 'crap!',
      }

      const expectedArray = [
        ,
        'one',
        'one',
        'oops i mean two',
        'dang! four!',
        'five',
        'back on track',
        'crap!',
      ]

      const arrayified = object.numberKeyedObjectToArray(numberKeyedObject)
      expect(arrayified).to.eql(expectedArray)
    })
  })
})

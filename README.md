# BCDate JavaScript/TypeScript date class
The purpose of `BCDate` is to consciously use appropriate date value for one of the desired use cases:
1. Sending to a *web api*
2. Displaying somewhere in a web page

## Input interface

```typescript
static fromLocalDate(localDate : Date) : BCDate
static fromUTCDate(utcDate : Date) : BCDate 
static fromApiString(apiString : string) : BCDate 
```

1. `fromLocalDate` takes a date, that is suitable for displaying in a web page. This is typical JavaSctipt date, like the one created with `new Date()`
2. `fromUTCDate` takes a date, that does not display correctly, but is correctly sent via HTTP request. You can create one by carefully choosing the constructor, like `new Date('2019-01-01')`
3. `fromApiString` takes string representation of a date, typical for *web api*s. The expected format is *exactly* `2019-01-01T00:00:00`. 

## Output interface 

```typescript
get displayableLocalDate(): Date
get sendableUTCDate(): Date
toString(): string
toISOString(): string
```

Once you have created a `BCDate` instance, it internally stores two date values. You can retrieve the appropriate one by using semantic getters: 
1. Use `displayableLocalDate` property, if you intend to display the date
2. Use `sendableUTCDate` property, if you intend to transfer the date to an *web api*

You can also call `toString()` to retrieve string representation of ready to display date; and `toISOString()`to retrieve ISO-formatted string, ready to be sent to a *web api*.

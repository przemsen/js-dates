export class BCDate {

    // The internal nomenclature is:
    // 1. Date with an offset = UTC date = date which is correctly sent to a Web API
    // 2. Date without an offset = local date = date which is correctly displayed in a web page
    
    // An offset means e.g. if you are in GMT+1 time zone, your date gets 01:00AM time set. 
    // You may not spot this, unless you are in GMT- time zone, because negative offset results
    // also in shifting back the day of the date. Which is disastrous

    // The tricky part is that, if you have a date with an offset, it is sent correctly. 
    // But not displayed correctly. And the other way round: a date without an offset displays
    // correctly, but is not sent correctly. This is solved by clear, semantic getters of the class.

    static fromLocalDate(localDate : Date) : BCDate {
        var bcDate = new BCDate();
        bcDate._jsDateWithoutOffset = localDate;
        bcDate._jsDateWithOffset = new Date(this.getDateTimestampWithOffsetFromDateWithoutOffset(bcDate._jsDateWithoutOffset));
        return bcDate;
    }

    static fromUTCDate(utcDate : Date) : BCDate {
        var bcDate = new BCDate();
        bcDate._jsDateWithOffset = utcDate;
        bcDate._jsDateWithoutOffset = new Date(
            bcDate._jsDateWithOffset.getUTCFullYear(), bcDate._jsDateWithOffset.getUTCMonth(), bcDate._jsDateWithOffset.getUTCDate(),
            bcDate._jsDateWithOffset.getUTCHours(), bcDate._jsDateWithOffset.getUTCMinutes(), bcDate._jsDateWithOffset.getUTCSeconds()
        );
        return bcDate;
    }  

    static fromApiString(apiString : string) : BCDate {
        if (apiString.indexOf("T") < 0 || apiString.length !== 19) {
            throw new Error("Only ISO string date format is supported in BCDate");
        } 
        var bcDate = new BCDate();
        bcDate._jsDateWithoutOffset = new Date(apiString);
        bcDate._jsDateWithOffset = new Date(this.getDateTimestampWithOffsetFromDateWithoutOffset(bcDate._jsDateWithoutOffset));
        return bcDate;
    }

    private constructor() {  }

    get displayableLocalDate(): Date {
        return this._jsDateWithoutOffset;
    }
    get sendableUTCDate(): Date {
        return this._jsDateWithOffset;
    }
    
    toString(): string {
        return this._jsDateWithoutOffset.toString();
    }
    
    toISOString(): string {
        return this._jsDateWithOffset.toISOString();
    }

    private static getDateTimestampWithOffsetFromDateWithoutOffset(dateWithoutOffset: Date): number {
        return Date.UTC(
            dateWithoutOffset.getFullYear(), dateWithoutOffset.getMonth(), dateWithoutOffset.getDate(),
            dateWithoutOffset.getHours(), dateWithoutOffset.getMinutes(), dateWithoutOffset.getSeconds()
        );
    }
       
    private _jsDateWithOffset: Date = new Date(0);
    private _jsDateWithoutOffset: Date = new Date(0);
}

let dateStringFromApiInISO: string = "2019-01-01T00:00:00";

// This constructor results in a date with an offset applied
let utcDate: Date = new Date("2019-01-01");
let utcDateAsString = utcDate.toString();

// This constructor results in a date without an offset applied
let localDate: Date = new Date("2019/01/01");
let localDateAsString = localDate.toString();

let d1 = BCDate.fromApiString(dateStringFromApiInISO);
console.log(`API string: ${dateStringFromApiInISO}
---
BCDate.displayableLocalDate:          ${d1.displayableLocalDate}
BCDate.sendableUTCDate:               ${d1.sendableUTCDate}
BCDate.sendableUTCDate.toISOString(): ${d1.sendableUTCDate.toISOString()}
`)

let d2 = BCDate.fromLocalDate(localDate);
console.log(`Local date: ${localDateAsString}
---
BCDate.displayableLocalDate:          ${d2.displayableLocalDate}
BCDate.sendableUTCDate:               ${d2.sendableUTCDate}
BCDate.sendableUTCDate.toISOString(): ${d2.sendableUTCDate.toISOString()}
`)

let d3 = BCDate.fromUTCDate(utcDate);
console.log(`UTC date: ${utcDateAsString}
---
BCDate.displayableLocalDate:          ${d3.displayableLocalDate}
BCDate.sendableUTCDate:               ${d3.sendableUTCDate}
BCDate.sendableUTCDate.toISOString(): ${d3.sendableUTCDate.toISOString()}
`)

/*

API string: 2019-01-01T00:00:00
---
BCDate.displayableLocalDate:          Tue Jan 01 2019 00:00:00 GMT+0100 (GMT+01:00)
BCDate.sendableUTCDate:               Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)
BCDate.sendableUTCDate.toISOString(): 2019-01-01T00:00:00.000Z

Local date: Tue Jan 01 2019 00:00:00 GMT+0100 (GMT+01:00)
---
BCDate.displayableLocalDate:          Tue Jan 01 2019 00:00:00 GMT+0100 (GMT+01:00)
BCDate.sendableUTCDate:               Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)
BCDate.sendableUTCDate.toISOString(): 2019-01-01T00:00:00.000Z

UTC date: Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)
---
BCDate.displayableLocalDate:          Tue Jan 01 2019 00:00:00 GMT+0100 (GMT+01:00)
BCDate.sendableUTCDate:               Tue Jan 01 2019 01:00:00 GMT+0100 (GMT+01:00)
BCDate.sendableUTCDate.toISOString(): 2019-01-01T00:00:00.000Z

*/

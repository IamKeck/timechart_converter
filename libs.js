"use strict";

const Time = function (minute, second) {
    this._minute = minute;
    this._second = second;
};

Time.prototype.get_normalized = function () {
    const new_minute = this._minute + Math.floor(this._second / 60);
    const new_second = this._second % 60;
    return new Time(new_minute, new_second);
};

Time.prototype.toString = function () {
    const second_string = this._second + "";
    const formatted_second_string =
        second_string.length == 1 ? "0" + second_string : second_string;
    return this._minute + ":" + formatted_second_string;
};

Time.prototype.add = function(other_time){
    return new Time(
        this._minute + other_time._minute, this._second + other_time._second).get_normalized();
};


const create_time_from_string = (time_string)=>{
    const colon_index = time_string.indexOf(":");
    return new Time(
        parseInt(time_string.slice(0, colon_index)),
        parseInt(time_string.slice(colon_index + 1))
        );
};

const string_to_item_and_time = (item_and_time) => {
    const time_area = (/[0-9]{1,2}:[0-9]{1,2}/.exec(item_and_time) ||[null])[0];
    const item_area = item_and_time.replace(time_area || "", "");
    return [item_area, time_area != null ? create_time_from_string(time_area) : null];
};

const item_and_time_to_string = (item_and_time) => {
    debugger;
    return item_and_time[0] + (item_and_time[1] != null ? "〜" + item_and_time[1].toString() : "");
};

const accumulate_time = (item_and_time)=>{
    const _in = (remaining_row, last_time, accumulated_row) => {
        if(remaining_row.length == 0){
            return accumulated_row;
        }
        const current_row = remaining_row[0];
        const current_item = current_row[0];
        const current_time = current_row[1];
        const accumulated_time = current_time != null ? last_time.add(current_time) : null;
        const next_last_time = current_time != null ? accumulated_time : last_time;
        return _in(
            remaining_row.slice(1),
            next_last_time,
            accumulated_row.concat([[current_item, accumulated_time]])
            );
    };
    return _in(item_and_time, new Time(0, 0), []);
};

exports.get_ans = (original_data) => {
    const item_and_time_row = original_data.split("\n").map(
        (row_string)=> string_to_item_and_time(row_string));
    const time_accumulated_row = accumulate_time(item_and_time_row);
    const str_row = time_accumulated_row.map((row)=>item_and_time_to_string(row));
    return str_row.join("\n");

};
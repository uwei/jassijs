define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        content: [
            {
                text: 'This is a header (whole paragraph uses the same header style)\n\n',
                style: 'header'
            },
            {
                text: [
                    'It is however possible to provide an array of texts ',
                    'to the paragraph (instead of a single string) and have ',
                    { text: 'a better ', fontSize: 15, bold: true },
                    'control over it. \nEach inline can be ',
                    { text: 'styled ', fontSize: 20 },
                    { text: 'independently ', italics: true, fontSize: 40 },
                    'then.\n\n'
                ]
            },
            { text: 'Mixing named styles and style-overrides', style: 'header' },
            {
                style: 'bigger',
                italics: false,
                text: [
                    'We can also mix named-styles and style-overrides at both paragraph and inline level. ',
                    'For example, this paragraph uses the "bigger" style, which changes fontSize to 15 and sets italics to true. ',
                    'Texts are not italics though. It\'s because we\'ve overriden italics back to false at ',
                    'the paragraph level. \n\n',
                    'We can also change the style of a single inline. Let\'s use a named style called header: ',
                    { text: 'like here.\n', style: 'header' },
                    'It got bigger and bold.\n\n',
                    'OK, now we\'re going to mix named styles and style-overrides at the inline level. ',
                    'We\'ll use header style (it makes texts bigger and bold), but we\'ll override ',
                    'bold back to false: ',
                    { text: 'wow! it works!', style: 'header', bold: false },
                    '\n\nMake sure to take a look into the sources to understand what\'s going on here.'
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            bigger: {
                fontSize: 15,
                italics: true
            }
        }
    };
    function test() {
        return {
            reportdesign,
            //data:{},         //data
            // parameter:{}      //parameter
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3R5bGVzMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2RlbW9yZXBvcnRzL3BkZm1ha2UtcGxheWdyb3VuZC9TdHlsZXMyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQSxJQUFJLFlBQVksR0FBRTtRQUNqQixPQUFPLEVBQUU7WUFDUjtnQkFDQyxJQUFJLEVBQUUsbUVBQW1FO2dCQUN6RSxLQUFLLEVBQUUsUUFBUTthQUNmO1lBQ0Q7Z0JBQ0MsSUFBSSxFQUFFO29CQUNMLHNEQUFzRDtvQkFDdEQseURBQXlEO29CQUN6RCxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO29CQUM3Qyx3Q0FBd0M7b0JBQ3hDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDO29CQUMvQixFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7b0JBQ3JELFdBQVc7aUJBQ1g7YUFDRDtZQUNELEVBQUMsSUFBSSxFQUFFLHlDQUF5QyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7WUFDbEU7Z0JBQ0MsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsSUFBSSxFQUFFO29CQUNMLHVGQUF1RjtvQkFDdkYsOEdBQThHO29CQUM5Ryx3RkFBd0Y7b0JBQ3hGLDJCQUEyQjtvQkFDM0IsMkZBQTJGO29CQUMzRixFQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBQztvQkFDdkMsNkJBQTZCO29CQUM3QixvRkFBb0Y7b0JBQ3BGLGdGQUFnRjtvQkFDaEYsc0JBQXNCO29CQUN0QixFQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7b0JBQ3RELG9GQUFvRjtpQkFDcEY7YUFDRDtTQUNEO1FBQ0QsTUFBTSxFQUFFO1lBQ1AsTUFBTSxFQUFFO2dCQUNQLFFBQVEsRUFBRSxFQUFFO2dCQUNaLElBQUksRUFBRSxJQUFJO2FBQ1Y7WUFDRCxNQUFNLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osT0FBTyxFQUFFLElBQUk7YUFDYjtTQUNEO0tBQ0QsQ0FBQTtJQUVELFNBQWdCLElBQUk7UUFDaEIsT0FBTztZQUNILFlBQVk7WUFDWix5QkFBeUI7WUFDMUIsZ0NBQWdDO1NBQ2xDLENBQUM7SUFDTixDQUFDO0lBTkQsb0JBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgcmVwb3J0ZGVzaWduID17XG5cdGNvbnRlbnQ6IFtcblx0XHR7XG5cdFx0XHR0ZXh0OiAnVGhpcyBpcyBhIGhlYWRlciAod2hvbGUgcGFyYWdyYXBoIHVzZXMgdGhlIHNhbWUgaGVhZGVyIHN0eWxlKVxcblxcbicsXG5cdFx0XHRzdHlsZTogJ2hlYWRlcidcblx0XHR9LFxuXHRcdHtcblx0XHRcdHRleHQ6IFtcblx0XHRcdFx0J0l0IGlzIGhvd2V2ZXIgcG9zc2libGUgdG8gcHJvdmlkZSBhbiBhcnJheSBvZiB0ZXh0cyAnLFxuXHRcdFx0XHQndG8gdGhlIHBhcmFncmFwaCAoaW5zdGVhZCBvZiBhIHNpbmdsZSBzdHJpbmcpIGFuZCBoYXZlICcsXG5cdFx0XHRcdHt0ZXh0OiAnYSBiZXR0ZXIgJywgZm9udFNpemU6IDE1LCBib2xkOiB0cnVlfSxcblx0XHRcdFx0J2NvbnRyb2wgb3ZlciBpdC4gXFxuRWFjaCBpbmxpbmUgY2FuIGJlICcsXG5cdFx0XHRcdHt0ZXh0OiAnc3R5bGVkICcsIGZvbnRTaXplOiAyMH0sXG5cdFx0XHRcdHt0ZXh0OiAnaW5kZXBlbmRlbnRseSAnLCBpdGFsaWNzOiB0cnVlLCBmb250U2l6ZTogNDB9LFxuXHRcdFx0XHQndGhlbi5cXG5cXG4nXG5cdFx0XHRdXG5cdFx0fSxcblx0XHR7dGV4dDogJ01peGluZyBuYW1lZCBzdHlsZXMgYW5kIHN0eWxlLW92ZXJyaWRlcycsIHN0eWxlOiAnaGVhZGVyJ30sXG5cdFx0e1xuXHRcdFx0c3R5bGU6ICdiaWdnZXInLFxuXHRcdFx0aXRhbGljczogZmFsc2UsXG5cdFx0XHR0ZXh0OiBbXG5cdFx0XHRcdCdXZSBjYW4gYWxzbyBtaXggbmFtZWQtc3R5bGVzIGFuZCBzdHlsZS1vdmVycmlkZXMgYXQgYm90aCBwYXJhZ3JhcGggYW5kIGlubGluZSBsZXZlbC4gJyxcblx0XHRcdFx0J0ZvciBleGFtcGxlLCB0aGlzIHBhcmFncmFwaCB1c2VzIHRoZSBcImJpZ2dlclwiIHN0eWxlLCB3aGljaCBjaGFuZ2VzIGZvbnRTaXplIHRvIDE1IGFuZCBzZXRzIGl0YWxpY3MgdG8gdHJ1ZS4gJyxcblx0XHRcdFx0J1RleHRzIGFyZSBub3QgaXRhbGljcyB0aG91Z2guIEl0XFwncyBiZWNhdXNlIHdlXFwndmUgb3ZlcnJpZGVuIGl0YWxpY3MgYmFjayB0byBmYWxzZSBhdCAnLFxuXHRcdFx0XHQndGhlIHBhcmFncmFwaCBsZXZlbC4gXFxuXFxuJyxcblx0XHRcdFx0J1dlIGNhbiBhbHNvIGNoYW5nZSB0aGUgc3R5bGUgb2YgYSBzaW5nbGUgaW5saW5lLiBMZXRcXCdzIHVzZSBhIG5hbWVkIHN0eWxlIGNhbGxlZCBoZWFkZXI6ICcsXG5cdFx0XHRcdHt0ZXh0OiAnbGlrZSBoZXJlLlxcbicsIHN0eWxlOiAnaGVhZGVyJ30sXG5cdFx0XHRcdCdJdCBnb3QgYmlnZ2VyIGFuZCBib2xkLlxcblxcbicsXG5cdFx0XHRcdCdPSywgbm93IHdlXFwncmUgZ29pbmcgdG8gbWl4IG5hbWVkIHN0eWxlcyBhbmQgc3R5bGUtb3ZlcnJpZGVzIGF0IHRoZSBpbmxpbmUgbGV2ZWwuICcsXG5cdFx0XHRcdCdXZVxcJ2xsIHVzZSBoZWFkZXIgc3R5bGUgKGl0IG1ha2VzIHRleHRzIGJpZ2dlciBhbmQgYm9sZCksIGJ1dCB3ZVxcJ2xsIG92ZXJyaWRlICcsXG5cdFx0XHRcdCdib2xkIGJhY2sgdG8gZmFsc2U6ICcsXG5cdFx0XHRcdHt0ZXh0OiAnd293ISBpdCB3b3JrcyEnLCBzdHlsZTogJ2hlYWRlcicsIGJvbGQ6IGZhbHNlfSxcblx0XHRcdFx0J1xcblxcbk1ha2Ugc3VyZSB0byB0YWtlIGEgbG9vayBpbnRvIHRoZSBzb3VyY2VzIHRvIHVuZGVyc3RhbmQgd2hhdFxcJ3MgZ29pbmcgb24gaGVyZS4nXG5cdFx0XHRdXG5cdFx0fVxuXHRdLFxuXHRzdHlsZXM6IHtcblx0XHRoZWFkZXI6IHtcblx0XHRcdGZvbnRTaXplOiAxOCxcblx0XHRcdGJvbGQ6IHRydWVcblx0XHR9LFxuXHRcdGJpZ2dlcjoge1xuXHRcdFx0Zm9udFNpemU6IDE1LFxuXHRcdFx0aXRhbGljczogdHJ1ZVxuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICByZXR1cm4geyBcbiAgICAgICAgcmVwb3J0ZGVzaWduLFxuICAgICAgICAvL2RhdGE6e30sICAgICAgICAgLy9kYXRhXG4gICAgICAgLy8gcGFyYW1ldGVyOnt9ICAgICAgLy9wYXJhbWV0ZXJcbiAgICB9O1xufSJdfQ==
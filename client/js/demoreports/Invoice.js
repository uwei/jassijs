define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var reportdesign = {
        footer: [
            {
                alignment: "center",
                text: [{ text: "IBAN: 5000550020" }],
                editTogether: true
            },
            { alignment: "center", text: "BIC DGGFFJ" }
        ],
        content: [
            {
                columns: [{ width: 325, fontSize: 20, text: "Invoice\n" }, { image: "logo" }]
            },
            {
                columns: [
                    {
                        width: 320,
                        stack: [
                            "\n",
                            "\n",
                            "${invoice.customer.firstname} ${invoice.customer.lastname}",
                            "${invoice.customer.street}",
                            "${invoice.customer.place}"
                        ]
                    },
                    {
                        width: 170,
                        stack: [
                            {
                                fontSize: 18,
                                text: [{ text: "B & M Consulting" }],
                                editTogether: true
                            },
                            "Rastplatz 7",
                            "09116 Chemnitz",
                            {
                                text: [{ text: " " }],
                                editTogether: true
                            },
                            {
                                table: {
                                    widths: ["auto", 100],
                                    body: [
                                        [
                                            "Date:",
                                            {
                                                alignment: "right",
                                                text: "${invoice.date}",
                                                format: "YYYY-MM-DD"
                                            }
                                        ],
                                        [
                                            "Number:",
                                            {
                                                alignment: "right",
                                                text: "${invoice.number}"
                                            }
                                        ]
                                    ]
                                },
                                layout: "noBorders"
                            },
                            "",
                            "\n"
                        ]
                    }
                ]
            },
            {
                datatable: {
                    widths: [365, 110],
                    header: ["Item", { alignment: "right", text: "Price" }],
                    dataforeach: "line in invoice.lines",
                    body: [
                        "${line.text}",
                        {
                            alignment: "right",
                            bold: false,
                            text: "${line.price}",
                            format: "#,##0.00"
                        }
                    ]
                }
            },
            "\n",
            {
                foreach: "summ in invoice.summary",
                columns: [
                    { width: 175, text: "\n" },
                    {
                        width: 150,
                        text: "${summ.text}"
                    },
                    {
                        width: 100,
                        alignment: "right",
                        text: "${summ.value}",
                        format: "$#,###.00"
                    }
                ]
            },
            "\n",
            "\n",
            "\n",
            { fontSize: 15, text: "Thank You!" }
        ],
        images: {
            logo: "data:image/jpeg;base64,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"
        }
    };
    function test() {
        return {
            reportdesign,
            data: {
                invoice: {
                    number: 1200,
                    date: new Date(),
                    customer: {
                        firstname: "Henry",
                        lastname: "Klaus",
                        street: "Hauptstr. 157",
                        place: "9430 Drebach",
                    },
                    lines: [
                        { pos: 1, text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg", price: 10.00, amount: 50, variante: [{ m: 1 }, { m: 2 }] },
                        { pos: 2, text: "this is the next position", price: 20.50, },
                        { pos: 3, text: "this is an other position", price: 19.50 },
                        { pos: 4, text: "this is the last position", price: 50.00 },
                    ],
                    summary: [
                        { text: "Subtotal", value: 100.00 },
                        { text: "Tax", value: 19.00 },
                        { text: "Subtotal", value: 119.00 },
                    ]
                }
            }
        };
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW52b2ljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2RlbW9yZXBvcnRzL0ludm9pY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUVBLElBQUksWUFBWSxHQUFHO1FBQ2xCLE1BQU0sRUFBRTtZQUNQO2dCQUNDLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixJQUFJLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBQyxDQUFDO2dCQUNsQyxZQUFZLEVBQUUsSUFBSTthQUNsQjtZQUNELEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFDO1NBQ3hDO1FBQ0QsT0FBTyxFQUFFO1lBQ1I7Z0JBQ0MsT0FBTyxFQUFFLENBQUMsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxFQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDO2FBQ3RFO1lBQ0Q7Z0JBQ0MsT0FBTyxFQUFFO29CQUNSO3dCQUNDLEtBQUssRUFBRSxHQUFHO3dCQUNWLEtBQUssRUFBRTs0QkFDTixJQUFJOzRCQUNKLElBQUk7NEJBQ0osNERBQTREOzRCQUM1RCw0QkFBNEI7NEJBQzVCLDJCQUEyQjt5QkFDM0I7cUJBQ0Q7b0JBQ0Q7d0JBQ0MsS0FBSyxFQUFFLEdBQUc7d0JBQ1YsS0FBSyxFQUFFOzRCQUNOO2dDQUNDLFFBQVEsRUFBRSxFQUFFO2dDQUNaLElBQUksRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFDLENBQUM7Z0NBQ2xDLFlBQVksRUFBRSxJQUFJOzZCQUNsQjs0QkFDRCxhQUFhOzRCQUNiLGdCQUFnQjs0QkFDaEI7Z0NBQ0MsSUFBSSxFQUFFLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUM7Z0NBQ25CLFlBQVksRUFBRSxJQUFJOzZCQUNsQjs0QkFDRDtnQ0FDQyxLQUFLLEVBQUU7b0NBQ04s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RUFBRSxLQUFLLEVBQUU7d0JBQzdCLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO3FCQUN0QztpQkFDSjthQUNBO1NBQ0osQ0FBQztJQUVOLENBQUM7SUE1QkQsb0JBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbnZhciByZXBvcnRkZXNpZ24gPSB7XG5cdGZvb3RlcjogW1xuXHRcdHtcblx0XHRcdGFsaWdubWVudDogXCJjZW50ZXJcIixcblx0XHRcdHRleHQ6IFt7dGV4dDogXCJJQkFOOiA1MDAwNTUwMDIwXCJ9XSxcblx0XHRcdGVkaXRUb2dldGhlcjogdHJ1ZVxuXHRcdH0sXG5cdFx0e2FsaWdubWVudDogXCJjZW50ZXJcIix0ZXh0OiBcIkJJQyBER0dGRkpcIn1cblx0XSxcblx0Y29udGVudDogW1xuXHRcdHtcblx0XHRcdGNvbHVtbnM6IFt7d2lkdGg6IDMyNSxmb250U2l6ZTogMjAsdGV4dDogXCJJbnZvaWNlXFxuXCJ9LHtpbWFnZTogXCJsb2dvXCJ9XVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0Y29sdW1uczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0d2lkdGg6IDMyMCxcblx0XHRcdFx0XHRzdGFjazogW1xuXHRcdFx0XHRcdFx0XCJcXG5cIixcblx0XHRcdFx0XHRcdFwiXFxuXCIsXG5cdFx0XHRcdFx0XHRcIiR7aW52b2ljZS5jdXN0b21lci5maXJzdG5hbWV9ICR7aW52b2ljZS5jdXN0b21lci5sYXN0bmFtZX1cIixcblx0XHRcdFx0XHRcdFwiJHtpbnZvaWNlLmN1c3RvbWVyLnN0cmVldH1cIixcblx0XHRcdFx0XHRcdFwiJHtpbnZvaWNlLmN1c3RvbWVyLnBsYWNlfVwiXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0d2lkdGg6IDE3MCxcblx0XHRcdFx0XHRzdGFjazogW1xuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRmb250U2l6ZTogMTgsXG5cdFx0XHRcdFx0XHRcdHRleHQ6IFt7dGV4dDogXCJCICYgTSBDb25zdWx0aW5nXCJ9XSxcblx0XHRcdFx0XHRcdFx0ZWRpdFRvZ2V0aGVyOiB0cnVlXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XCJSYXN0cGxhdHogN1wiLFxuXHRcdFx0XHRcdFx0XCIwOTExNiBDaGVtbml0elwiLFxuXHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiBbe3RleHQ6IFwiwqBcIn1dLFxuXHRcdFx0XHRcdFx0XHRlZGl0VG9nZXRoZXI6IHRydWVcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHRhYmxlOiB7XG5cdFx0XHRcdFx0XHRcdFx0d2lkdGhzOiBbXCJhdXRvXCIsMTAwXSxcblx0XHRcdFx0XHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0XHRcdFx0XHRbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFwiRGF0ZTpcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFsaWdubWVudDogXCJyaWdodFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IFwiJHtpbnZvaWNlLmRhdGV9XCIsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9ybWF0OiBcIllZWVktTU0tRERcIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdFx0XHRcdFx0W1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcIk51bWJlcjpcIixcblx0XHRcdFx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGFsaWdubWVudDogXCJyaWdodFwiLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRleHQ6IFwiJHtpbnZvaWNlLm51bWJlcn1cIlxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRsYXlvdXQ6IFwibm9Cb3JkZXJzXCJcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcIlwiLFxuXHRcdFx0XHRcdFx0XCJcXG5cIlxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0ZGF0YXRhYmxlOiB7XG5cdFx0XHRcdHdpZHRoczogWzM2NSwxMTBdLFxuXHRcdFx0XHRoZWFkZXI6IFtcIkl0ZW1cIix7YWxpZ25tZW50OiBcInJpZ2h0XCIsdGV4dDogXCJQcmljZVwifV0sXG5cdFx0XHRcdGRhdGFmb3JlYWNoOiBcImxpbmUgaW4gaW52b2ljZS5saW5lc1wiLFxuXHRcdFx0XHRib2R5OiBbXG5cdFx0XHRcdFx0XCIke2xpbmUudGV4dH1cIixcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRhbGlnbm1lbnQ6IFwicmlnaHRcIixcblx0XHRcdFx0XHRcdGJvbGQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0dGV4dDogXCIke2xpbmUucHJpY2V9XCIsXG5cdFx0XHRcdFx0XHRmb3JtYXQ6IFwiIywjIzAuMDBcIlxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0XCJcXG5cIixcblx0XHR7XG5cdFx0XHRmb3JlYWNoOiBcInN1bW0gaW4gaW52b2ljZS5zdW1tYXJ5XCIsXG5cdFx0XHRjb2x1bW5zOiBbXG5cdFx0XHRcdHt3aWR0aDogMTc1LHRleHQ6IFwiXFxuXCJ9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0d2lkdGg6IDE1MCxcblx0XHRcdFx0XHR0ZXh0OiBcIiR7c3VtbS50ZXh0fVwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdGFsaWdubWVudDogXCJyaWdodFwiLFxuXHRcdFx0XHRcdHRleHQ6IFwiJHtzdW1tLnZhbHVlfVwiLFxuXHRcdFx0XHRcdGZvcm1hdDogXCIkIywjIyMuMDBcIlxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0fSxcblx0XHRcIlxcblwiLFxuXHRcdFwiXFxuXCIsXG5cdFx0XCJcXG5cIixcblx0XHR7Zm9udFNpemU6IDE1LHRleHQ6IFwiVGhhbmsgWW91IVwifVxuXHRdLFxuXHRpbWFnZXM6IHtcblx0XHRsb2dvOiBcImRhdGE6aW1hZ2UvanBlZztiYXNlNjQsLzlqLzRBQVFTa1pKUmdBQkFRRUFlQUI0QUFELzJ3QkRBQlFPRHhJUERSUVNFQklYRlJRWUhqSWhIaHdjSGowc0xpUXlTVUJNUzBkQVJrVlFXbk5pVUZWdFZrVkdaSWhsYlhkN2dZS0JUbUNObDR4OWxuTitnWHovMndCREFSVVhGeDRhSGpzaElUdDhVMFpUZkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIeDhmSHg4Zkh4OGZIei93QUFSQ0FCMEFKUURBU0lBQWhFQkF4RUIvOFFBR2dBQkFBTUJBUUVBQUFBQUFBQUFBQUFBQUFRRkJnTUJBdi9FQURjUUFBSUNBUUVGQkFZSkJRRUFBQUFBQUFFQ0FBTVJCQVVTSVRGUkV4UkJrVEpoY1lHaDBTSkNVbFJpc2NIUzRSVWpNM0x3OGYvRUFCZ0JBQU1CQVFBQUFBQUFBQUFBQUFBQUFBQUNBd0VFLzhRQUhSRUJBUUVBQXdFQkFRRUFBQUFBQUFBQUFBRUNBeEVoRWpGQkUvL2FBQXdEQVFBQ0VRTVJBRDhBMmNSRUFSRVFENHN0cnFHYkhWQjFZNGtPM2EybFRnck5hZndEOWVVb2xyQ0VncU41U1FUamp3NFQ2bDV4Ukc4bFdMN1p0UDhBam9WZWhacy9EK1o4cnRqVUEvVHFxWWRBU1BuSUVSdmpKZnV0RnBOWFhxMEpUSVpmU1U4eEpFcXRpVkVDMjQ4bXdxK3ZHYy9uOEpheUdwSmVvdm05eDVJajdVMGlISGE3eC9BcFllWTRSdFRmL3A5dTVuT0JuSFRJejhNeWhqWXhOZnBOYTZYbzJyb3llTmpMN1VZZnBKRldvcHUveFdvLytyQXpOVHdxcDVnR1BlS2Z3djhBcFdyaVpmdkY5U0VwZmFNRGx2RWp5TTB5NUNqZU9UamlaUFdmbFRPdnA5UkVSREVSRUFSRVFCRVJBTTVyYSt6MTE2K0JiZUh2NC9ubWNKWWJhVGQxTlQvYlFnKzQvd0F5dm5WaTk1Yyt2S1R4eVFqRWM4Y0o3UEdHOHBCOFJpTVZwNnExcHFTdEJoVkFBblNSdERxUnFkT3JaK21vdzQ2R1NaeVg5ZE0vSGhBSUlJeURNdHU3ak1uUGNZcjVIRTA5anJWV3p1Y0tveVRNd1dMc3prWUxzV0k2Wk9aWGkvcWZJUkVTeVQ3cFR0TDZreG5lY0ErelBINFRUelA3TFRmMmhYK0JXYjlQMW1na09XK3JjZjRSRVNTaEVSQUVSSy9YN1I3dTNaVWdOYjRrOGwvbWJKYjVHVzlMQ0puZjZock01N3dmWnVMajhwUDAyMXEyRzdxUjJiZmFIb241UnJ4MkZtNVhtM01kblIxM3orVXFaTTJucVUxTjZDc2hrckJ3dzVFbkVobk9Eam40WmxzVHJLV3ZhUktxblhhdTF0WUFhQjNZbm1oK2x6L0Z3NVNacy9WSFdhUmJpbTRTU0NJMDFLTE9rdXV4Nm5EMU9VWWVJazVOc1hLdUhvcmM5UTVYNFlNbzlkcTMwOW1uclRkQnViZDMzR1FzK3RCcW4xU1dGd3VVY3B2THliSGlJdG1kWHF0bmNuaXgxT3J1MVIvdXNBbzVJdkwrWndnNXdjYy9ETXJOTHRHNXRlZE5xRnJBTzhFWlFSdllPT3A2R2I1UEdlMzFaeEt2VjdSdXIxOWVucFd2Y2RnbTh5azhmSHhIVVMwR2NjZWMyWHRsblNic2ZIZm02OWtjZVlsN00xcGIrN2FsTGNFZ1pEQWN5RC93bGhmdGhkM0duckpicTR3Qjg1SGViZGVLWTFKRnJFejUybHJDYzlxbzlRVGhMRFFiUjd3d3F1QVd6d0k1TkZ1TFBUVGNxd2lJaUhjdFRjS05QWmFlTzZwT09zelJMTVN6bkxNY2s5VE5CdEtzMmFDNVY1Z2IyT3VEbjlKbitjdnhmaVhJUkVTcVJCSUFKSndCekppZU1DVklCS2tqbVBDQVVHa09sczFPME84WEJVWnpnaTNkRERKOWZHVDlpUGEya0lzR0VWc1ZuZHhsWks3dlo5N3U4ay9iSGQ3UHZkM2tuN1lrblI3ZTBEWEJidG9kanJtS2FYY3pXYzRHOTF6MTV5RzdEdGRQcDlRNjJhV3V3YnQ0WGdSajBTZVV1KzcyZmU3dkpQMngzZXo3M2Q1SisyWjh0K25ZTXU0R0JHNWpPUnl4S1BVcjJ1bUdvMHJLOXRGN01BcHp3TGYrUzI3dlo5N3U4ay9iSGQ3UHZkM2tuN1kxblpaZWxUcmR5alY3UFI3RTMwWXRZYzhpU0NTWmVnZ2pJNGd6aDNlejczZDVKKzJkVVVxZ0RPem43VFl5ZktHWjBMZTMxRVJHS1JsbHd5bkRLY2c5REVZWmlGUVpaamhSNjRCcHFMUmRSWFlCZ09vYkh0RVJUV0txVXJYa2loUjdvbkk2ZlhTVWV0MmRaUzVlaEM5UjQ3cWppdnU2UzhpYm5WeitNdVpXWVdxMWpoYWJTZjhBUXlaVnNpOTAzbnNTby9aSzd4L09YY1JyeVdsbUl5ekt5T3lNTU1wSU04a25hUXh0RzdIanVuNEQ1U05MeTl6dEt6cWtSRTFoRTZVNmU3VUhGTlpZRG0zSUQzenBib05WVU10VnZEeEtIT1Bkem1mVWIxVWVJQkJHUkUxaEVSQUpXZzBYZkhmZlpsclRobGVaUC9mblB2VmJNdG9HOVVUY25USDBoODVNMktBTkd4SE0ySE1zWkM3czB0TXl4bGdyc2NMWFlUMENITXRkbWFCcTI3ZTljUDhBVVg3UHI5c3M1N00xeVd6cHN4SjZSRVNaeUlpQUlpZUhnSUJuZGMyL3I3eU9XOEI1QVRoRy93Qm9Xc1AxMkxlWnpFNjU1SE5mMG4zUlYyK29ycXpqZmJCUHE1bjRDZkU3NkZnbXYwN0hsdkVlWUloZndUOWFGRVd0QWlBS280QUR3bjFFVGtkS3EydHBGRloxTll3eSttQjlZZGZiS3FhRGFUQmRuNmpKeGxDQjdUd0V6ODZPTzJ4SGM5SWlKUk5iYkVmKzNkWDRoOTczRWZ3WmFTaTJSWnVhN2R6d3NRajNqajg1ZXptM090TDR2aEVSRU9SRVFCRVJBRTRhMWltaXZaZlNGYlk5dUozaUFaTldYZ0F3NGNPYytwcHJLYTdSaXl0SEhSZ0RJdG15ZEsvb28xWjZvMlBoeWw1eXorbzNqcWpuamNCa0hCSEVIb1piSFlxNStqcUh4NndET2xXeUtVWUd4M3R4NEhBSGxOLzB5ejRxYlE1c29yZGhobVVFanB3blNJbk91cHRzM2xya29Ib3FOOXZXZkNWMHVkb2JPYlVXZHRTd0Q0d1Zia1pYSFFhd0hIZG1QckRyODUwWTFPa2RTOW84U1pYc3ZWdjZRU3NmaWJKK0VsVmJHckhHNjEzUFJmb2o1L0diZDVqSmkxVzZaK3oxZEREd3NBOCtINnpUU0xYcy9TMUVGS0Z5RGtFOFNQZVpLa2Q2K3FyblBSRVJFTVJFUUJFUkFFUkVBUkVRQkVSQUVSRUFSRVFCRVJBRVJFQVJFUUJFUkFQLzJRPT1cIlxuXHR9XG59O1xuXG5cblxuZXhwb3J0ICBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHJldHVybiB7IFxuICAgICAgICByZXBvcnRkZXNpZ24sXG4gICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgaW52b2ljZToge1xuICAgICAgICAgICAgbnVtYmVyOiAxMjAwLFxuICAgICAgICAgICAgZGF0ZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIGN1c3RvbWVyOiB7XG4gICAgICAgICAgICAgICAgZmlyc3RuYW1lOiBcIkhlbnJ5XCIsXG4gICAgICAgICAgICAgICAgbGFzdG5hbWU6IFwiS2xhdXNcIixcbiAgICAgICAgICAgICAgICBzdHJlZXQ6IFwiSGF1cHRzdHIuIDE1N1wiLFxuICAgICAgICAgICAgICAgIHBsYWNlOiBcIjk0MzAgRHJlYmFjaFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxpbmVzOiBbXG4gICAgICAgICAgICAgICAgeyBwb3M6IDEsIHRleHQ6IFwidGhpcyBpcyB0aGUgZmlyc3QgcG9zaXRpb24sIGxrc2pkZmxnc2QgZXIgd2Ugd2VyIHdyZSBlciBlciBlciByZSB3ZWtmZ2pzbGtkZmpqZGsgc2dmc2RnXCIsIHByaWNlOiAxMC4wMCwgYW1vdW50OiA1MCwgdmFyaWFudGU6IFt7IG06IDEgfSwgeyBtOiAyIH1dIH0sXG4gICAgICAgICAgICAgICAgeyBwb3M6IDIsIHRleHQ6IFwidGhpcyBpcyB0aGUgbmV4dCBwb3NpdGlvblwiLCBwcmljZTogMjAuNTAsIH0sXG4gICAgICAgICAgICAgICAgeyBwb3M6IDMsIHRleHQ6IFwidGhpcyBpcyBhbiBvdGhlciBwb3NpdGlvblwiLCBwcmljZTogMTkuNTAgfSxcbiAgICAgICAgICAgICAgICB7IHBvczogNCwgdGV4dDogXCJ0aGlzIGlzIHRoZSBsYXN0IHBvc2l0aW9uXCIsIHByaWNlOiA1MC4wMCB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHN1bW1hcnk6IFtcbiAgICAgICAgICAgICAgICB7IHRleHQ6IFwiU3VidG90YWxcIiwgdmFsdWU6IDEwMC4wMCB9LFxuICAgICAgICAgICAgICAgIHsgdGV4dDogXCJUYXhcIiwgdmFsdWU6IDE5LjAwIH0sXG4gICAgICAgICAgICAgICAgeyB0ZXh0OiBcIlN1YnRvdGFsXCIsIHZhbHVlOiAxMTkuMDAgfSxcbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgIFxufVxuIl19
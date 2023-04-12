import { Employees } from "northwind/remote/Employees";

export async function test() {
    var k=await Employees.find({
  //  "where":"UPPER(CAST('id' AS TEXT)) LIKE :mftext or UPPER('LastName') LIKE :mftext or UPPER('FirstName') LIKE :mftext or UPPER('Title') LIKE :mftext or UPPER('TitleOfCourtesy') LIKE :mftext or UPPER('Address') LIKE :mftext or UPPER('City') LIKE :mftext or UPPER('Region') LIKE :mftext or UPPER('PostalCode') LIKE :mftext or UPPER('Country') LIKE :mftext or UPPER('HomePhone') LIKE :mftext or UPPER('Extension') LIKE :mftext or UPPER('Photo') LIKE :mftext or UPPER('Notes') LIKE :mftext or UPPER('PhotoPath') LIKE :mftext or UPPER(CAST('BirthDate' AS TEXT)) LIKE :mftext or UPPER(CAST('HireDate' AS TEXT)) LIKE :mftext or UPPER(CAST('ReportsTo' AS TEXT)) LIKE :mftext",
    "where":"UPPER('LastName') LIKE '%FUL%'"});
   // "whereParams":{"mftext":"%FUL%"}});

}

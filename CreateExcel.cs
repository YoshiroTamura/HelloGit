    public class QueryFields : TransferFields
    {
        public int QueryID { get; set; }
        public int QueryFieldNo { get; set; }
        public string TableName { get; set; }
        public int ExportExcel { get; set; }

        //public string DatabaseName { get; set; }
    }

       public static bool CreateExcel<T>(string filePath, List<T> targetList, List<QueryFields> qfldList)
        {
            var res = false;

            try
            {
                IWorkbook workbook;
                workbook = new XSSFWorkbook(); //ブック作成
                ISheet sheet = workbook.CreateSheet("Sheet1"); //シート作成

                var obj = Activator.CreateInstance<T>();
                var objprops = obj.GetType().GetProperties();

                var rNo = 0;
                var cNo = 0;

                //項目行
                foreach (var fld in qfldList)
                {
                    fld.PropNo = GetPropNo(objprops, fld.FieldName);
                    var row = sheet.GetRow(rNo) ?? sheet.CreateRow(rNo);
                    var cell = row.GetCell(cNo) ?? row.CreateCell(cNo);
                    cell.SetCellValue(fld.Description);
                    cNo++;
                }
                rNo++;

                foreach (var data in targetList)
                {

                    cNo = 0;

                    var props = data.GetType().GetProperties();
                    foreach (var fld in qfldList)
                    {
                        if (fld.PropNo >= 0)
                        {
                            var type = props[fld.PropNo].PropertyType;
                            var row = sheet.GetRow(rNo) ?? sheet.CreateRow(rNo);
                            var cell = row.GetCell(cNo) ?? row.CreateCell(cNo);
                            object value = props[fld.PropNo].GetValue(data);

                            if (type == typeof(string) && value != null && !string.IsNullOrEmpty(((string)value).Trim()))
                            {
                                cell.SetCellValue(((string)value).Trim());
                            }
                            else if (type == typeof(decimal) || type == typeof(int) || type == typeof(double) || type == typeof(long))
                            {
                                cell.SetCellValue(Convert.ToDouble(value));
                            }
                            else if (type == typeof(DateTime))
                            {
                                cell.SetCellValue((DateTime)value);
                                var style = workbook.CreateCellStyle();
                                style.DataFormat = workbook.CreateDataFormat().GetFormat("yyyy/mm/dd");
                                cell.CellStyle = style;
                            }
                            cNo++;
                        }
                    }

                    //foreach (PropertyInfo prop in data.GetType().GetProperties())
                    //{
                    //    var type = prop.PropertyType;
                    //    var row = sheet.GetRow(rNo) ?? sheet.CreateRow(rNo);
                    //    var cell = row.GetCell(cNo) ?? row.CreateCell(cNo);
                    //    object value = prop.GetValue(data);

                    //    //Debug.WriteLine(prop.Name + "  " +  type.Name + ">>>" + value);


                    //    if (type == typeof(string) && value != null && !string.IsNullOrEmpty(((string)value).Trim()))
                    //    {
                    //        cell.SetCellValue(((string)value).Trim());
                    //    }
                    //    else if (type == typeof(decimal) || type == typeof(int) || type == typeof(double))
                    //    {
                    //        cell.SetCellValue(Convert.ToDouble(value));
                    //    }
                    //    else if (type == typeof(DateTime))
                    //    {
                    //        cell.SetCellValue((DateTime)value);
                    //        var style = book.CreateCellStyle();
                    //        style.DataFormat = book.CreateDataFormat().GetFormat("yyyy/mm/dd");
                    //        cell.CellStyle = style;
                    //    }
                    //    cNo++;
                    //}
                    rNo++;
                }

                //ブックを保存
                using (var fs = new FileStream(filePath, FileMode.Create))
                {
                    workbook.Write(fs);
                }

                //if (workbook != null)
                //{
                //    workbook.Close();
                //    Debug.WriteLine("*****************close*******************");

                //}
                res = true; 
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }

            return res;

        }




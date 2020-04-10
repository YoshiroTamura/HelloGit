sessionCountryContents = '\
<div class="destination">\n\
   <table border="0" cellspacing="0" cellpadding="0">\n\
      <tbody>\n\
         <tr>\n\
            <th colspan="2" class="countrycolumn">#country#</th>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Sessions:</td>\n\
            <td class="valuecolumn">#sessions#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Share:</td>\n\
            <td class="valuecolumn">#share#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Rank:</td>\n\
            <td class="valuecolumn">#rank#</td>\n\
         </tr>\n\
      </tbody>\n\
   </table>\n\
</div>';

sessionCountryInfoContents = '\
<div class="sessioncountryinfo">\n\
   <table border="0" cellspacing="0" cellpadding="0">\n\
      <tbody>\n\
         <tr>\n\
            <th colspan="2" class="countrycolumn">#country#</th>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Sessions:</td>\n\
            <td class="valuecolumn">#sessions#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Share:</td>\n\
            <td class="valuecolumn">#share#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Rank:</td>\n\
            <td class="valuecolumn">#rank#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">New Sessions Rate:</td>\n\
            <td class="valuecolumn">#newsessionsrate#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Pages / Session:</td>\n\
            <td class="valuecolumn">#pagespersession#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Avg. Session Duration:</td>\n\
            <td class="valuecolumn">#duration#</td>\n\
         </tr>\n\
      </tbody>\n\
   </table>\n\
</div>';

//<div class="legend" style="background-color:#ffffff;padding:5px;border-radius:4px;opacity:0.9;">\n\
legendContents = '\
   <table border="0" cellspacing="0" cellpadding="0">\n\
      <tbody>\n\
         <tr>\n\
            <th colspan="4" class="title" nowrap>BTP Session Counts</th>\n\
         </tr>\n\
         <tr>\n\
            <td colspan="4" class="spancolumn" nowrap>#span#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn" nowrap>Total : </td>\n\
            <td class="valuecolumn">&nbsp;</td>\n\
            <td class="sharecolumn">#total#</td>\n\
            <td class="sharecolumn">&nbsp;</td>\n\
         </tr>\n\
#rank#\n\
      </tbody>\n\
   </table>\n\
   <div class="buttoninlegend">\n\
      <input type="button" class="button" onclick="rankUpDown(-1)" value="<">\n\
      <input type="button" class="button" onclick="rankUpDown(1)" value=">">\n\
   </div>\n\
';

//</div>

rankContents = '\
         <tr>\n\
            <td class="titlecolumn" nowrap>#rankno# : </td>\n\
            <td class="valuecolumn" nowrap>#country#</td>\n\
            <td class="sharecolumn" nowrap>#value#</td>\n\
            <td class="sharecolumn" nowrap>#share#</td>\n\
         </tr>';

importvalueContents = '\
<div class="importvalue">\n\
   <table border="0" cellspacing="0" cellpadding="0">\n\
      <tbody>\n\
         <tr>\n\
            <th colspan="2" class="countrycolumn">#country#</th>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Total:</td>\n\
            <td class="valuecolumn">#valuefromworld#</td>\n\
         </tr>\n\
         <tr #displaytopn#>\n\
            <td class="titlecolumn">Top #topn# Value:</td>\n\
            <td class="valuecolumn">#valuefromtopn#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">From Botswana:</td>\n\
            <td class="valuecolumn">#valuefrombotswana#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="unitcolumn" colspan="2">Unit : thousand U.S. Dollars</td>\n\
         </tr>\n\
      </tbody>\n\
   </table>\n\
</div>';

newusersrateContents = '\
<div class="importvalue">\n\
   <table border="0" cellspacing="0" cellpadding="0">\n\
      <tbody>\n\
         <tr>\n\
            <th colspan="2" class="countrycolumn">#country#</th>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Total Sessions:</td>\n\
            <td class="valuecolumn">#sessiontotal#</td>\n\
         </tr>\n\
         <tr #displaytopn#>\n\
            <td class="titlecolumn">New Users:</td>\n\
            <td class="valuecolumn">#sessionnew#</td>\n\
         </tr>\n\
         <tr #displaytopn#>\n\
            <td class="titlecolumn">Repeaters:</td>\n\
            <td class="valuecolumn">#sessionrepeat#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Rate of New Users</td>\n\
            <td class="valuecolumn">#newusersrate#</td>\n\
         </tr>\n\
      </tbody>\n\
   </table>\n\
</div>';

durationContents = '\
<div class="importvalue">\n\
   <table border="0" cellspacing="0" cellpadding="0">\n\
      <tbody>\n\
         <tr>\n\
            <th colspan="2" class="countrycolumn">#country#</th>\n\
         </tr>\n\
         <tr>\n\
            <td class="titlecolumn">Session Duration:</td>\n\
            <td class="valuecolumn">#duration#</td>\n\
         </tr>\n\
      </tbody>\n\
   </table>\n\
</div>';

commodytyListContents = '\
   <table  border="0" cellspacing="1" cellpadding="5">\n\
      <thead>\n\
         <tr>\n\
            <th class="hscode">HS Code</th>\n\
            <th class="description">Description</th>\n\
         </tr>\n\
      </thead>\n\
      <tbody>\n\
#result#\n\
      </tbody>\n\
   </table>';

commodytyListEach = '\
         <tr class="result #oddeven#">\n\
            <td class="hscode"><a href="javascript:setHSCode(\'#hscode#\')">#hscode#</a></td>\n\
            <td class="description">#description#</td>\n\
         </tr>';

companyListContents = '\
   <table  border="0" cellspacing="1" cellpadding="5">\n\
      <thead>\n\
         <tr>\n\
            <th class="companyname">Company Name</th>\n\
            <th class="employees">Number of Employees</th>\n\
            <th class="country">Country</th>\n\
            <th class="city">City</th>\n\
            <th class="url">URL</th>\n\
            <th class="email">Email</th>\n\
         </tr>\n\
      </thead>\n\
      <tbody>\n\
#result#\n\
      </tbody>\n\
   </table>';

companyListEach = '\
         <tr class="result #oddeven#">\n\
            <td class="companyname"><a href="javascript:showDetail(#listno#)">#companyname#</a></td>\n\
            <td class="employees">#employees#</td>\n\
            <td class="country">#country#</td>\n\
            <td class="city">#city#</td>\n\
            <td class="url"><a href="#url#" class="url" target="_blank">#url#</a></td>\n\
            <td class="email">#email#</td>\n\
         </tr>';

companyInfoContents = '\
   <table border="0" cellspacing="1" cellpadding="5">\n\
      <tbody>\n\
         <tr>\n\
            <td class="title">Company Name</td>\n\
            <td class="value">#companyname#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">Number of Employees</td>\n\
            <td class="value">#employees#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">Country</td>\n\
            <td class="value">#country#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">City</td>\n\
            <td class="value">#city#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">TEL</td>\n\
            <td class="value">#tel#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">FAX</td>\n\
            <td class="value">#fax#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">URL</td>\n\
            <td class="value"><a href="#url#" target="_blank">#url#</a></td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">Email</td>\n\
            <td class="value"><a href="#mailto#">#email#</a></td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">Executives</td>\n\
            <td class="value">#executives#</td>\n\
         </tr>\n\
         <tr>\n\
            <td class="title">Turnover</td>\n\
            <td class="value">#turnover#</td>\n\
         </tr>\n\
      </tbody>\n\
   </table>';

productListContents = '\
   <table  border="0" cellspacing="1" cellpadding="5">\n\
      <thead>\n\
         <tr>\n\
            <th class="product">Product Category</th>\n\
            <th class="tradetype">Distributor</th>\n\
            <th class="tradetype">Producer</th>\n\
            <th class="tradetype">Supplier</th>\n\
            <th class="tradetype">Import</th>\n\
            <th class="tradetype">Export</th>\n\
         </tr>\n\
      </thead>\n\
      <tbody>\n\
#result#\n\
      </tbody>\n\
   </table>';

productListEach = '\
         <tr class="result #oddeven#">\n\
            <td class="product">#productcategory#</td>\n\
            <td class="tradetype">#Distributor#</td>\n\
            <td class="tradetype">#Producer#</td>\n\
            <td class="tradetype">#Supplier#</td>\n\
            <td class="tradetype">#Import#</td>\n\
            <td class="tradetype">#Export#</td>\n\
         </tr>';


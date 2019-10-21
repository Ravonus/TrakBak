/*! CellEditGood 0.1
 * ©2016 technomancyIT - datatables.net/license
 */

/**
 * @summary     CellEditGood
 * @description Make a cell editable when clicked upon
 * @version     0.1
 * @file        dataTables.editCell.js
 * @author      Elliott Beaty
 * @updater     Chad Koslovsky
 * @contact     chad@technomancyit.com
 * @copyright   Copyright 2019 TechnomancyIT
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

jQuery.fn.dataTable.Api.register('MakeCellsEditable()', function (settings) {
    var table = this.table();

    jQuery.fn.extend({
        // UPDATE
        updateEditableCell: function (callingElement, responsiveCell) {

 

            console.log("CHANGE RAN");

  
           
            // Need to redeclare table here for situations where we have more than one datatable on the page. See issue6 on github
            var table = $(callingElement).closest("table").DataTable().table();
            var row;
            
            var cell;

            if(responsiveCell) {

                row = table.row($($(callingElement).parents('tr')).siblings()[0]);
            
                console.log($(callingElement).parents("li"));

               cell = $(callingElement).parents("li");


            } else {

                row = table.row($(callingElement).parents('tr'));
            
                cell = table.cell($(callingElement).parents('td, th'));


            }

            console.log($(callingElement).parents('td, th'));
  


            var trs = $($(callingElement.closest("table"))[0]).find('tr .my-input-class');
            if (trs.length === 1) {
                userApp.clickMenuOptions.disabled = false;
            }


            var columnIndex;
            if (cell.index())
                columnIndex = cell.index().column;
            var inputField = getInputField(callingElement);


            // Update
            var newValue = inputField.val();


            if (!newValue && ((settings.allowNulls) && settings.allowNulls != true)) {
                // If columns specified
                if (settings.allowNulls.columns) {
                    // If current column allows nulls
                    if (settings.allowNulls.columns.indexOf(columnIndex) > -1) {
                        _update(newValue);
                    } else {
                        _addValidationCss();
                    }
                    // No columns allow null
                } else if (!newValue) {
                    _addValidationCss();
                }
                //All columns allow null
            } else if (newValue && settings.onValidate) {
                if (settings.onValidate(cell, row, newValue)) {
                    _update(newValue);
                } else {
                    _addValidationCss();
                }
            } else {
                _update(newValue);
            }

            function _addValidationCss() {
                // Show validation error
                if (settings.allowNulls.errorClass) {
                    $(inputField).addClass(settings.allowNulls.errorClass);
                } else {
                    $(inputField).css({
                        "border": "red solid 1px"
                    });
                }
            }

            function _update(newValue, responsiveCell) {

                console.log(responsiveCell);
                var oldValue;
                if(responsiveCell) {

                    console.log(console.log("THIS" + oldValue, ' ' , newValue));
                    oldValue = responsiveCell.data();

                    responsiveCell.data(newValue);
                } else {
                    oldValue = cell.data();
                    cell.data(newValue);
                }
            

            
                //Return cell & row.
                if (oldValue !== newValue)




                    settings.onUpdate(responsiveCell ? responsiveCell : cell, row, oldValue);
            }
            // Get current page
            var currentPageIndex = table.page.info().page;

            //Redraw table
            //    table.page(currentPageIndex).draw(false);
        },
        // CANCEL
        cancelEditableCell: function (callingElement) {

            var table = $(callingElement.closest("table")).DataTable().table();
            var trs = $($(callingElement.closest("table"))[0]).find('tr .my-input-class');
            if (trs.length === 1) {
                userApp.clickMenuOptions.disabled = false;
            }

            var cell = table.cell($(callingElement).parents('td, th')[0]);
            // Set cell to it's original value
            cell.data(cell.data());

            // Redraw table
            //   table.draw();
        }
    });

    // Destroy
    if (settings === "destroy") {
        $(table.body()).off("click", "td");
        table = null;
    }

    if (table != null) {
        // On cell click
        $(table.body()).on('click', 'td', function (event) {
            userApp.clickMenuOptions.disabled = true;
            var responsiveCell;
            var currentColumnIndex;
            var currentColumnName;
            if(!table.cell(this).index()) {
                var li;
                if(event.target.tagName === 'LI'){
                    li = event.target;
                } else if(event.target.tagName === 'SPAN' && event.target.className === 'dtr-data') {
                    li = $(event.target).parents()[0];
                }

                console.log($(li).data('dtr-index'))
                if(!li) return;
                responsiveCell = li;
                currentColumnIndex = $(li).data('dtr-index');
                currentColumnName = table.cell(this).context[0].aoColumns[currentColumnIndex].data;

                console.log(li);
            } else {

                currentColumnIndex = table.cell(this).index().column;
                currentColumnName = table.cell(this).context[0].aoColumns[currentColumnIndex].data;

            }



       


            // DETERMINE WHAT COLUMNS CAN BE EDITED

            if ((settings.columns && settings.columns.indexOf(currentColumnIndex) > -1) || settings.columns.includes(currentColumnName) || (!settings.columns)) {

                var row,cell,oldValue;

                if(responsiveCell) {

                    console.log($($(responsiveCell).parents()[2]).siblings()[0]);

                    row = table.row($($(responsiveCell).parents()[1]).siblings()[0]);
                    editableCellsRow = row;
                    cell = $(responsiveCell);
                    oldValue = table.cell(responsiveCell).data();
                    oldValue = sanitizeCellValue(oldValue);

                    console.log(cell);

                } else {

   

                row = table.row($(this).parents('tr'));
                editableCellsRow = row;
                cell = table.cell(this).node();
                oldValue = table.cell(this).data();
                // Sanitize value
                oldValue = sanitizeCellValue(oldValue);

                console.log(cell);
    

                }

                // Show input
                if (!$(cell).find('input').length && !$(cell).find('select').length && !$(cell).find('textarea').length) {

                    var input;


                    // Input CSS

                    console.log(currentColumnIndex, currentColumnName, row[0][0]);
                    if(responsiveCell) {

                        input = getInputHtml(currentColumnIndex, settings, oldValue, currentColumnName, row[0][0], responsiveCell);

                    } else {

                        input = getInputHtml(currentColumnIndex, settings, oldValue, currentColumnName, row[0][0]);
                    }
           


                    console.log(input);

                    $(cell).html(input.html);

                    var el;

                    if(responsiveCell) {
                        console.log($(responsiveCell)[0])
                        el = $($(responsiveCell).children()[1]);

                    } else {
                        el = $('#' + $(cell).children(0)[0].id);
                    }
     
                        console.log(el[0])



                    el.selectpicker();
                    //$(input).selectpicker();

                    el.on('hidden.bs.select', function (e, clickedIndex) {

                        var id = e.target.id;
                        var el = $('#' + id);
                        var options = el[0].options;
                        var checkOption = [];
                        var table = el.parents()[3];
                        var td = el.parents()[1];
                        var row = el.parents()[2];
                        var text = '';

                        $.each(options, (index, option) => {

                            checkOption.push(option.value);
                            if (el.val().includes(option.value) && index + 1 !== options.length)
                                text += option.text + ', ';
                            else if (index + 1 === options.length)

                                if (el.val().includes(option.value))

                                    text += option.text;

                                else

                                    text = text.substring(0, text.length - 2);

                        });

                        var rowNum = $(row).index();
                        var colNum = $(td).index();
                        var col = userApp.tables[userApp.nav.page].context[0].aoColumns[colNum].data;
                        col = col.split('.')[0];
                        userApp.tables[userApp.nav.page].context[0].json.data[rowNum][col].name = text;

                        userApp.tables[userApp.nav.page].context[0].json.data[rowNum][col].ids = el.val();

                        el.selectpicker('remove');

                        if (JSON.stringify(checkOption) !== JSON.stringify(el.val()))
                            userApp.crud('PUT', `/api/${userApp.nav.page}?where={"_id":"${row.id}"}`, {}, JSON.stringify({
                                [col]: el.val()
                            }));

                        td.append(text);

                    });

                    if (input.focus) {


                        $(cell).find('.my-input-class').focus();
                        //  setTimeout(function(){  $(`.addSelect`).addClass("show"); }, 1000);

                        if (currentColumnName === 'groups.name') {
                            $(document).ready(function () {
                                $('.dropdownButton')[0].click(function () {
                                    //     $($('#groupsList').parents()[0]).addClass("show");
                                });

                            });
                            // $($('#groupsList').parents()[0]).addClass("show");

                            //    $($(cell).find('bs-searchbox').children[0]).focus();
                        }


                        //    $('#ejbeatycelledit').focus();
                        //   $('.my-input-class').focus();
                    }

                    $(cell).unbind('keypress');
                    $(cell).on('keypress', function (e) {

                        if (e.which == 13) {

                            console.log(e.target)

                            if (e.target)
                                $(e.target).updateEditableCell(e.target);
                        }
                    });

                }
            }
        });
    }

});


function getInputHtml(currentColumnIndex, settings, oldValue, currentColumnName, row, responsiveCell) {


    var inputSetting, inputType, input, inputCss, confirmCss, cancelCss, startWrapperHtml = '',
        endWrapperHtml = '',
        listenToKeys = false;

    input = {
        "focus": true,
        "html": null
    };


    if (settings.inputTypes) {
        $.each(settings.inputTypes, function (index, setting) {
            if (index === setting.column || setting.column === currentColumnName) {



                inputSetting = setting;
                inputType = inputSetting.type.toLowerCase();
            }
        });
    }

    if (settings.inputCss) {
        inputCss = settings.inputCss;
    }
    if (settings.wrapperHtml) {
        var elements = settings.wrapperHtml.split('{content}');
        if (elements.length === 2) {
            startWrapperHtml = elements[0];
            endWrapperHtml = elements[1];
        }
    }

    if (settings.confirmationButton) {
        if (settings.confirmationButton.listenToKeys) {
            listenToKeys = settings.confirmationButton.listenToKeys;
        }
        confirmCss = settings.confirmationButton.confirmCss;
        cancelCss = settings.confirmationButton.cancelCss;
    }

    switch (inputType) {
        case "list":
            //TODO: WORKING to add multiselect into edit options within table.
            input.html = startWrapperHtml + "<select id='groupsList_fast' data-live-search='true' class='addSelect selectpicker " + inputCss + "' onchange='userApp.setFormList(event, userApp.nav.page, 'groups')'  multiple>";

            var currentGroups = oldValue.split(',');

            var vueTable = settings.vueTable;

            $.each(currentGroups, (index, group) => {

                input.html = input.html + "<option value='" + userApp.tables[vueTable].context[0].json.data[row].groups.ids[index] + "' selected>" + group + "</option>";

            });

            $.each(inputSetting.options, function (index, option) {
                if (oldValue == option.value) {

                    input.html = input.html + "<option value='" + option.value + "' selected>" + option.display + "</option>";
                } else {

                    input.html = input.html + "<option value='" + option.value + "' >" + option.display + "</option>";
                }
            });
            input.html = input.html + "</select>" + endWrapperHtml;
            input.focus = true;

            break;
        case "list-confirm": // List w/ confirm
            input.html = startWrapperHtml + "<select multiple class='addSelect selectpicker " + inputCss + ">";
            $.each(inputSetting.options, function (index, option) {
                if (oldValue == option.display) {

                    input.html = input.html + "<option value='" + option.display + "' selected>" + option.display + "</option>";
                } else {

                    input.html = input.html + "<option value='" + option.display + "' >" + option.display + "</option>";
                }
            });
            if(responsiveCell) {
            input.html = input.html + "</select>&nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this);'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            } else {
            input.html = input.html + "</select>&nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this);'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;

            }
            input.focus = true;

            break;
        case "datepicker": //Both datepicker options work best when confirming the values
        case "datepicker-confirm":
            // Makesure jQuery UI is loaded on the page
            if (typeof jQuery.ui == 'undefined') {
                alert("jQuery UI is required for the DatePicker control but it is not loaded on the page!");
                break;
            }
            jQuery(".datepick").datepicker("destroy");
            input.html = startWrapperHtml + "<input id='ejbeatycelledit' type='text' name='date' class='datepick " + inputCss + "'   value='" + oldValue + "'></input> &nbsp;<a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a  href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            setTimeout(function () { //Set timeout to allow the script to write the input.html before triggering the datepicker
                var icon = "http://jqueryui.com/resources/demos/datepicker/images/calendar.gif";
                // Allow the user to provide icon
                if (typeof inputSetting.options !== 'undefined' && typeof inputSetting.options.icon !== 'undefined') {
                    icon = inputSetting.options.icon;
                }
                var self = jQuery('.datepick').datepicker({
                    showOn: "button",
                    buttonImage: icon,
                    buttonImageOnly: true,
                    buttonText: "Select date"
                });
            }, 100);
            break;
        case "text-confirm": // text input w/ confirm

            if(responsiveCell) {
                input.html = startWrapperHtml +  '<input id="ejbeatycelledit" class="' + inputCss + '" value="' + oldValue + '"' + (listenToKeys ? ' onkeyup="if(event.keyCode==13) {$(this).updateEditableCell(this, true);} else if (event.keyCode===27) {$(this).cancelEditableCell(this, true);}"' : '') + '></input>&nbsp;<a   href="javascript:void(0);" class="' + confirmCss + '" onclick="$(this).updateEditableCell(this, true)">Confirm</a> <a href="javascript:void(0);" class="' + cancelCss + '" onclick="$(this).cancelEditableCell(this, true)">Cancel</a>' + endWrapperHtml;

            } else {

                input.html = startWrapperHtml +  '<input id="ejbeatycelledit" class="' + inputCss + '" value="' + oldValue + '"' + (listenToKeys ? ' onkeyup="if(event.keyCode==13) {$(this).updateEditableCell(this);} else if (event.keyCode===27) {$(this).cancelEditableCell(this);}"' : '') + '></input>&nbsp;<a   href="javascript:void(0);" class="' + confirmCss + '" onclick="$(this).updateEditableCell(this)">Confirm</a> <a href="javascript:void(0);" class="' + cancelCss + '" onclick="$(this).cancelEditableCell(this)">Cancel</a>' + endWrapperHtml;
            }
            break;
        case "undefined-confirm": // text input w/ confirm
            input.html = startWrapperHtml + "<input id='ejbeatycelledit' class='" + inputCss + "' value='" + oldValue + "'" + (listenToKeys ? " onkeyup='if(event.keyCode==13) {$(this).updateEditableCell(this);} else if (event.keyCode===27) {$(this).cancelEditableCell(this);}'" : "") + "></input>&nbsp;<a   href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            break;
        case "textarea":
            break;
        case "textarea-confirm":
            input.html = startWrapperHtml + "<textarea id='ejbeatycelledit' class='" + inputCss + "'>" + oldValue + "</textarea><a href='javascript:void(0);' class='" + confirmCss + "' onclick='$(this).updateEditableCell(this)'>Confirm</a> <a   href='javascript:void(0);' class='" + cancelCss + "' onclick='$(this).cancelEditableCell(this)'>Cancel</a>" + endWrapperHtml;
            break;
        case "multi-select":
            console.log("RANZZZ");
            input.html = startWrapperHtml + '<select class="addSelect selectpicker form-group"><option>Small select</option><option>Small select</option></select>' + endWrapperHtml;

            break;
        default: // text input
            input.html = startWrapperHtml + "<input id='ejbeatycelledit' class='" + inputCss + "' onfocusout='$(this).updateEditableCell(this)' value='" + oldValue + "'></input>" + endWrapperHtml;
            break;
    }
    return input;

}

function getInputField(callingElement) {

    // Update datatables cell value
    var inputField;
    switch ($(callingElement).prop('nodeName').toLowerCase()) {
        case 'a': // This means they're using confirmation buttons
            if ($(callingElement).siblings('input').length > 0) {
                inputField = $(callingElement).siblings('input');
            }
            if ($(callingElement).siblings('select').length > 0) {
                inputField = $(callingElement).siblings('select');
            }
            if ($(callingElement).siblings('textarea').length > 0) {
                inputField = $(callingElement).siblings('textarea');
            }
            break;
        default:
            inputField = $(callingElement);
    }
    return inputField;
}

function sanitizeCellValue(cellValue) {
    if (typeof (cellValue) === 'undefined' || cellValue === null || cellValue.length < 1) {
        return "";
    }

    // If not a number
    if (isNaN(cellValue)) {
        // escape single quote
        cellValue = cellValue.replace(/'/g, "&#39;");
    }
    return cellValue;
}
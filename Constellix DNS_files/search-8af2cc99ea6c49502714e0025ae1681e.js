var SELECTED_BUTTON = "selectedButton";
var DATA_SEARCH = "data-search";
var BTN_SEARCH = "btn-search";
var SEARCH = "search";
var GROUP_OP = "groupOp";
var FIELDS = "fields";
var FIELD = "field";
var QUALIFIERS = "qualifiers";
var AJAX = "ajax";
var MODAL_SELECTOR = ".bootbox.modal";
jQuery(document).ready(function () {
    onLoad();
});

jQuery(document).ajaxComplete(function () {
    onLoad();
});

function onLoad() {
    addPopover();
    jQuery("[name=btn-search]:not([id=search-row] [name=btn-search].btn-solidblue)").off("click", openSearchDialog).on("click", openSearchDialog);
    jQuery("[name=reset-search]").off("click", resetSearch).on("click", resetSearch);
    jQuery("[name=btn-search]").each(function () {
        var button = jQuery(this);
        if (button.attr(DATA_SEARCH)) {
            button.data(DATA_SEARCH, button.attr(DATA_SEARCH));
            button.removeAttr(DATA_SEARCH);
        }
    });
    var searchRows = jQuery("#search-row");
    if (searchRows) {
        searchRows.each(function () {
            var searchRow = jQuery(this);
            var searchBtn = searchRow.find("[name=btn-search]:first");
            if (searchBtn) {
                var textField = searchRow.find("input:text:first");
                if (textField) {
                    new Search().applySimpleQualifierSearchObject(searchRow, searchBtn);
                    textField.off('keyup');
                    textField.on('keyup', function (evt) {
                        var value = jQuery.trim(this.value);
                        if (isAjaxSearch(searchBtn) || isEnterKey(evt)) {
                            simpleSearch(textField.attr(FIELD), textField.attr('id'), value, searchBtn);
                        }
                    });
                    searchBtn.on('click',function(){
                        var textField = searchRow.find("input:text:first");
                        var value = jQuery.trim(textField.val());
                        simpleSearch(textField.attr(FIELD), textField.attr('id'), value, jQuery(this));
                    });
                }
            }
        });
    }
    jQuery(".btn-filter > .close").off("click", removeFilter).on("click", removeFilter);
}

function simpleSearch(field,qualifier,value,button){
    button = button?button:jQuery(this);
    if(value){
        searchRecords(new Search().buildSimpleObject(field, qualifier, value), button);
    }else{
        resetSearch.call(button);
    }
}

function addPopover() {
    jQuery("[name=btn-search].btn-solidblue,[name=reset-search].btn-solidblue").popover();
}

function resetSearch() {
    searchRecords({}, jQuery(this));
}

function removeFilter() {
    jQuery(this).parent().remove();
    var search = new Search();
    var filterDiv = jQuery(".search-filter");
    var button = jQuery("a[name=btn-search].advanced");
    searchRecords(search.buildFilterObject(filterDiv),button);
}

function openSearchDialog() {
    var button = jQuery(this);
    var modalTitle = button.attr('modal-title') ? htmlEncode(button.attr('modal-title')) : "Search";
    var url = createLink("/search?key=") + button.attr("data-key");
    ajaxRequestOld({url: url, method: REQUEST.METHODS.GET}).done(function (data) {
        var box = bootbox.dialog({
            title: modalTitle,
            message: data,
            onEscape: function () {
            },
            className: "record-modal",
            buttons: {
                search: {
                    label: "Search",
                    className: "btn-solidblue pull-right",
                    callback: function () {
                        var search = new Search();
                        var searchDiv = jQuery(MODAL_SELECTOR + " .bootbox-body");
                        searchRecords(search.buildAdvancedObject(searchDiv));
                        return false;
                    }
                },
                reset: {
                    label: "Reset",
                    className: "btn-solidblue btn-color pull-left",
                    callback: function () {
                        var search = new Search();
                        var searchDiv = jQuery(MODAL_SELECTOR + " .bootbox-body");
                        search.reset(searchDiv);
                        searchRecords({});
                        return false;
                    }
                }
            }
        });
        box.find(".modal-footer button:contains(Search)").html("<i class='fa fa-search'></i>&nbsp;&nbsp;Search");
        box.find(".modal-footer button:contains(Reset)").html("<i class='fa fa-undo'></i>&nbsp;&nbsp;Reset");
        box.on("shown.bs.modal", function () {
            jQuery(this).data(SELECTED_BUTTON, button);
            var search = new Search();
            search.onLoad(box);
            if (button.data(DATA_SEARCH)) {
                search.applyAdvancedQualifierSearchObject(jQuery(this), button);
            }
        });
    });
}

function getSearchURL(button) {
    if (!button) {
        button = jQuery(MODAL_SELECTOR).data(SELECTED_BUTTON);
    }
    if (button) {
        return button.attr("data-url");
    }
    return "";
}

function isAjaxSearch(button) {
    if (button) {
        return button.attr(AJAX) == "true"
    }
    return false;
}

function searchRecords(searchObject, button) {
    if (!button) {
        button = jQuery(MODAL_SELECTOR).data(SELECTED_BUTTON);
    }
    var search = new Search();
    var obj = {search: searchObject};
    var url = getSearchURL(button);
    if (url) {
        url += (url.indexOf("?") > -1 ? "&" : "?") + "key=" + button.attr("data-key");
        if (isAjaxSearch(button)) {
            ajaxRequestOld({
                url: url,
                data: obj,
                method: REQUEST.METHODS.GET
            }).done(function (data) {
                    if (data) {
                        if (data.isJSON()) {
                            data = JSON.parse(data);
                            if (hasErrors(data)) {
                                showErrors(data.errors, jQuery(MODAL_SELECTOR).find(".errors"));
                            }
                        } else {
                            if (button.attr("onSuccess")) {
                                try {
                                    eval(button.attr("onSuccess"));
                                } catch (ex) {
                                }
                            }
                            bootbox.hideAll();
                        }
                    }
                });
        } else {
            var params = jQuery.param(obj);
            window.location.href = url + (params ? "&" + jQuery.param(obj) : '');
        }
    }
}

function Search() {
    this.onLoad = function (container) {
        container = jQuery(container);
        container.find("select[name=search-fields]").on('change', function () {
            new Search().onSearchFieldChange.call(this);
        });
        container.find("select[name=" + QUALIFIERS + "]").on('change', function () {
            new Search().onQualifierChange.call(this);
        });
        container.find("button.add-row").on('click', function () {
            new Search().addRow.call(this);
        });
        container.find("button.del-row").on('click', function () {
            new Search().delRow.call(this);
        });
        container.find("select[name=search-fields]").change();
    };

    this.applySimpleQualifierSearchObject = function (container, button) {
        var searchObject = JSON.parse(button.data(DATA_SEARCH));
        if (searchObject) {
            var search = new Search();
            var fields = searchObject[FIELDS];
            if (!jQuery.isEmptyObject(fields)) {
                var textField = container.find("input:text:first");
                var field = fields[textField.attr(FIELD)];
                if (!jQuery.isEmptyObject(field)) {
                    var qualifiers = field[QUALIFIERS];
                    if (!jQuery.isEmptyObject(qualifiers)) {
                        var values = qualifiers[textField.attr("id")];
                        if (values) {
                            textField.val(jQuery.trim(values[0]));
                        }
                    }
                }
            }
        }
    };

    this.applyAdvancedQualifierSearchObject = function (container, button) {
        var searchObject = JSON.parse(button.data(DATA_SEARCH));
        if (searchObject) {
            var search = new Search();
            search.reset(container);
            getGroupSelect().val(searchObject[GROUP_OP]);
            var fields = searchObject[FIELDS];
            var firstRow = true;
            if (!jQuery.isEmptyObject(fields)) {
                for (var field in fields) {
                    var qualifiers = fields[field][QUALIFIERS];
                    if (!jQuery.isEmptyObject(qualifiers)) {
                        for (var qualifier in qualifiers) {
                            var values = qualifiers[qualifier];
                            for (var i in values) {
                                var lastRow = container.find(".criteria-row:last");
                                if (firstRow) {
                                    firstRow = false;
                                } else {
                                    lastRow.find(".add-row").click();
                                    lastRow = container.find(".criteria-row:last");
                                }
                                lastRow.find("[name=search-fields]").val(field).change();
                                lastRow.find("select[name=" + QUALIFIERS + "][data-field='" + field + "']").val(qualifier).change();
                                lastRow.find("div[data-field='" + field + "'] > [id=" + qualifier + "].criteria:visible").val(String(values[i]));
                            }
                        }
                    }
                }
            }
        }
    };

    this.onSearchFieldChange = function () {
        var field = jQuery(this);
        if (field.val()) {
            var parent = field.closest(".row.form-group");
            parent.find("select[name=" + QUALIFIERS + "]").addClass("hidden");
            var qualifier = parent.find("select[name=" + QUALIFIERS + "][data-field='" + field.val().toLowerCase() + "']");
            qualifier.removeClass("hidden");
            new Search().onQualifierChange.call(qualifier.get(0));
        }
    };

    this.onQualifierChange = function () {
        var qualifier = jQuery(this);
        if (qualifier.val()) {
            var parent = qualifier.closest(".row.form-group");
            var dataDiv = parent.find("div[data-field]")
            dataDiv.addClass("hidden");
            dataDiv.children().addClass("hidden");
            dataDiv = parent.find("div[data-field='" + qualifier.attr("data-field") + "']");
            dataDiv.removeClass("hidden");
            dataDiv.find(".criteria[id=" + qualifier.val() + "]").removeClass("hidden");
        }
    };

    this.reset = function (container) {
        container.find(".criteria-row:gt(0)").remove();
        var criteria = container.find(".criteria-row:last");
        container.find("input.criteria").val('');
        container.find("select").prop('selectedIndex', 0);
        container.find("select[name=search-fields]").change();
        toggleRowButtons(container);
    };

    this.addRow = function () {
        var button = jQuery(this);
        var parent = button.closest("div.row.form-group");
        var clone = parent.clone(true);
        var container = parent.parent();
        clone.insertAfter(container.find(".criteria-row:last"));
        clone.find("input.criteria").val('');
        clone.find("select.criteria").prop('selectedIndex', 0);
        clone.find("select[name=search-fields]").change();
        toggleRowButtons();
    };

    this.delRow = function () {
        var button = jQuery(this);
        var parent = button.closest("div.row.form-group");
        var container = parent.closest("div.criteria-row");
        parent.remove();
        toggleRowButtons();
    };

    var toggleRowButtons = function (container) {
        var rows = container ? container.find(".criteria-row:visible") : jQuery(".criteria-row:visible");
        if (rows.length == 1) {
            jQuery(".criteria-row:visible .del-row").addClass("hidden");
        } else {
            jQuery(".criteria-row:visible .del-row").removeClass("hidden");
        }
        jQuery(".criteria-row:visible .add-row:last").removeClass("hidden");
        jQuery(".criteria-row:visible .add-row:not(:last)").addClass("hidden");
    };

    var getGroupSelect = function () {
        return jQuery("#" + GROUP_OP);
    }

    this.buildSimpleObject = function (field, qualifier, value) {
        var obj = {};
        obj[FIELDS] = {};
        obj[FIELDS][field] = {};
        obj[FIELDS][field][QUALIFIERS] = {};
        obj[FIELDS][field][QUALIFIERS][qualifier] = [value];
        return obj;
    };

    this.buildAdvancedObject = function (container) {
        var obj = {};
        var groupOp = getGroupSelect();
        if (groupOp.length > 0) {
            obj[GROUP_OP] = groupOp.val();
        }
        var fields = {};
        jQuery.each(container.find("select[name=search-fields]:first option"), function (i, element) {
            var option = jQuery(this);
            var qualifiers = {};
            container.find("select[name=" + QUALIFIERS + "][data-field='" + option.attr("value").toLowerCase() + "']:visible").each(function () {
                var select = jQuery(this);
                if (select.val() && !qualifiers[select.val()]) {
                    var values = jQuery.map(container.find("div[data-field='" + option.attr("value").toLowerCase() + "'] > [id=" + select.val() + "].criteria:visible"), function (field, i) {
                        var value = jQuery.trim(field.value);
                        if (field.getAttribute("type") == "number") {
                            if (value) {
                                return Number(value);
                            }
                        } else if (value == "true" || value == "false") {
                            return Boolean.parse(value);
                        } else {
                            return value;
                        }
                    });
                    if (values && values.length > 0) {
                        qualifiers[select.val()] = values;
                    }
                }
            });
            if (!jQuery.isEmptyObject(qualifiers)) {
                var fieldObj = {};
                fieldObj[QUALIFIERS] = qualifiers;
                fields[option.attr("value").toLowerCase()] = fieldObj;
            }
        });
        obj[FIELDS] = fields;
        return obj;
    };

    this.buildFilterObject = function (container) {
        var obj = {};
        var groupOp = jQuery(container.find("." + GROUP_OP));
        if (groupOp.length > 0) {
            obj[GROUP_OP] = groupOp.data('value');
        }
        var fields = {};
        jQuery.each(container.find(".btn-filter"), function (i, element) {
            var filter = jQuery(this);
            var key = filter.data('key');
            var qualifier = filter.data('qualifier');
            var value = filter.data('value');

            var fieldObj = (key in fields) ? fields[key] : {};
            var qualifiers = fieldObj[QUALIFIERS] ? fieldObj[QUALIFIERS] : {};
            var values = (qualifier in qualifiers) ? qualifiers[qualifier] : [];
            values.push(value);

            qualifiers[qualifier] = values;
            fieldObj[QUALIFIERS] = qualifiers;
            fields[key] = fieldObj;
        });
        obj[FIELDS] = fields;
        return obj;
    };
};
//! require----common.js
//= require /js/common/search/search.js

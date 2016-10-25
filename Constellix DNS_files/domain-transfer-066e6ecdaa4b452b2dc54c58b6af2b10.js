var domainListLoaded = false;
var selectedDomains= [];
function bindIconEvents() {
    jQuery('.cancel-transfer').off('click', cancelTransferConfirmation);
    jQuery('.reject-transfer').off('click', rejectTransferConfirmation);
    jQuery('.accept-transfer').off('click', verifyTransfer);
    jQuery('.cancel-transfer').on('click', cancelTransferConfirmation);
    jQuery('.reject-transfer').on('click', rejectTransferConfirmation);
    jQuery('.accept-transfer').on('click', verifyTransfer);
    jQuery('.icon-transfer-action').popover();
}

function closeDropdownMenu(){
    jQuery('#domain-dropdown').removeClass('open');
    jQuery(document).off('mouseup', callbackOnclickOutsideContainer);
}

jQuery( document ).ready(function() {
    jQuery('.dropdown-menu').click(function(e) {
        e.stopPropagation();
    });
    jQuery('#transfer').on('click',initiate);
    jQuery('#username').on('keyup input change blur',validate);
    jQuery('.cancel-transfer').on('click',cancelTransferConfirmation);
    jQuery('.reject-transfer').on('click',rejectTransferConfirmation);
    jQuery('.acceptTransfer').on('click',verifyTransfer);
    jQuery('#btn-select-domains').on('click',selectDomains);
    jQuery('#select-all-check').on('change',selectAllDomain);
    jQuery('#deselect-all-check').on('change',deselectAllDomain);
    jQuery('#domain-filter').on('input',filterDomains);
    jQuery('#close-dropdown').on('click',function(){ closeDropdownMenu();});

    jQuery('#btn-domain-list').on('click',function(){
        var dropDown = jQuery('#domain-dropdown');
        if(dropDown.hasClass('open')==false){
            jQuery('#deselect-all-check').prop('checked',false);
            jQuery('#select-all-check').prop('checked',false);
            moveToTopAfterAjax=false;
            var url = jQuery('#url').val();
            clearMessages();
            ajaxRequestOld({url:url+'/domains'}).done(function(data){
                jQuery('#domain-select').html(data);
                dropDown.addClass('open');
                jQuery("a.permission-info").popover();
                for(var i in selectedDomains){
                    jQuery('#domain-select [name=domain][value='+selectedDomains[i]+']').prop('checked', true);
                }
            });
            jQuery(document).on('mouseup', null,{callback:closeDropdownMenu, selector:'.dropdown-menu'}, callbackOnclickOutsideContainer);
        } else {
            closeDropdownMenu();
        }
    });
    jQuery('.cancel-dropdown').on('click',function(){
        unselectAllDomain();
        closeDropdownMenu();
    });
    showLoaderOnAjaxSend(true);
    hideLoaderOnAjaxComplete(true);
    var url = jQuery('#url').val();
    clearMessages();
    if(isPrimaryUser){
        clearMessages();
        ajaxRequestOld({url:url+'/transferstatus'}).done(function(data){
            jQuery('#transfer-status').html(data);
            bindIconEvents();
        });
    }
});

function showSuccessOrErrors(data) {
    domainListLoaded = false;
    jQuery('#domain-dropdown').removeClass('open');
    if (data.success) {
        jQuery('#default-success').text(data.success);
        jQuery('#default-success').addClass('active');
    } else if (data.errors) {

        for (var i in data.errors) {
            jQuery('#default-errors').html('<li>' + htmlEncode(data.errors[i].message) + '</li>');
            jQuery('#default-errors').addClass('active');
        }
    }
}
function selectDomains(){
    var checkboxs = jQuery('#domain-select [name="domain"]:checked');
    selectedDomains = [];
    checkboxs.each(function(i){
        selectedDomains.push(parseInt(jQuery(this).val(),10));
    });
    jQuery('#domain-dropdown').removeClass('open');
    jQuery('#btn-domain-list label').text(MESSAGES.ACCOUNT_TRANSFER.DOMAINS_SELECTED.format([selectedDomains.length]));
    validate();
}

function validate(){
    var username = jQuery('#username').val();
    if( selectedDomains.length>0 && username.trim().length>0 ){
        jQuery("#transfer").prop("disabled",false);
    } else {
        jQuery("#transfer").prop("disabled",true);
    }
}

function initiate(){
    clearMessages();
    var toUserName = jQuery('#username').val();
    if(toUserName){
        toUserName = toUserName.trim();
    }
    var domains = selectedDomains;

    var obj = {domains:domains,toUserName:toUserName};
    showLoaderOnAjaxSend(true);
    hideLoaderOnAjaxComplete(true);
    moveToTopAfterAjax=true;
    var url = jQuery('#url').val();
    clearMessages();
    ajaxRequestOld({url:url+'/initiate',data:JSON.stringify(obj),type:REQUEST.METHODS.POST,contentType: REQUEST.CONTENT_TYPE.JSON,
        dataType: REQUEST.DATA_TYPE.JSON}).done(
        function(data){
            if(data.success && data.transferInfo){
                unselectAllDomain();
                jQuery('#no-outgoing-tr').addClass("hidden");
                for (var i in data.transferInfo){
                    addNewOutgoing(data.transferInfo[i].id,data.transferInfo[i].domainName,data.transferInfo[i].toUserName);
                }
            } else if(data.errors && data.refreshTransfer){
                unselectAllDomain();
            }
            showSuccessOrErrors(data);
        });
}

function selectAllDomain(){
    if(jQuery('#select-all-check').prop('checked') == true){
        jQuery('#deselect-all-check').prop('checked',false);
        jQuery('#domain-select [name=domain]').not("[disabled]").prop('checked', true);
    }
}

function deselectAllDomain(){
    if(jQuery('#deselect-all-check').prop('checked') == true){
        jQuery('#select-all-check').prop('checked',false);
        jQuery('#domain-select [name=domain]').not("[disabled]").prop('checked', false);
    }
}

function unselectAllDomain(){
    jQuery('#domain-select [name=domain]').prop('checked', false);
    selectedDomains = [];
    jQuery('#btn-domain-list label').text('None Selected');
    jQuery('#username').val('');
    validate();
}

function cancelTransfer(ele){
    var id = jQuery(ele).attr('data-transferid');
    abortTransfer(id,'cancel');
}

function cancelTransferConfirmation(){
    var ele = this;
    Dialog.confirm(MESSAGES.ACCOUNT_TRANSFER.CONFIRM_CANCEL,function() {
        cancelTransfer(ele);
    });
}
function rejectTransfer(ele){
    var id = jQuery(ele).attr('data-transferid');
    abortTransfer(id,'reject');
}

function rejectTransferConfirmation(){
    var ele = this;
    Dialog.confirm(MESSAGES.ACCOUNT_TRANSFER.CONFIRM_REJECT,function(r){
        if(r){
            rejectTransfer(ele);
        }
    });
}

var transferItemTypeToName = {
    geoipFilter:'Geo Filters',
    geoipProximity:'Geo Proximities',
    poolA:'A Pools',
    poolAaaa:'Aaaa Pools',
    poolCname:'Cname Pools',
    template: 'Templates'
};

function createTransferVerificationModalHtml(data) {
    var mainDiv = jQuery('<form>').attr('id', 'referenceItems');
    for (var itemType in data) {
        var itemsDiv = jQuery('<div>').addClass('reference-item-type').attr('data-item-type', itemType);
        itemsDiv.append('<h4>' + transferItemTypeToName[itemType] + '</h4>');
        var items = data[itemType];
        for (var item in items) {
            var itemDiv = jQuery('<div>').addClass('reference-item row form-group').attr('data-item-id', items[item].id);
            itemDiv.append(jQuery('<span>').addClass('new-name col-xs-5')
                .append(jQuery('<input>').addClass('form-control').attr('type', 'text').val(items[item].name)));
            itemsDiv.append(itemDiv);
        }
        mainDiv.append(itemsDiv)
    }
    return mainDiv;
}

function verifyTransfer() {
    clearMessages();
    var ele = this;
    var id = jQuery(ele).attr('data-transferid');
    var url = jQuery('#url').val();
    ajaxRequest({url:url+'/'+id+'/appliedresources',type:REQUEST.METHODS.POST,contentType: REQUEST.CONTENT_TYPE.JSON,
        dataType: REQUEST.DATA_TYPE.JSON}).done(function(data){
        if(data && !jQuery.isEmptyObject(data)) {
            var mainDiv = createTransferVerificationModalHtml(data);
            var box = bootbox.dialog({
                message: '<ul class="errors" role="alert"></ul><p>'+MESSAGES.ACCOUNT_TRANSFER.OTHER_TRANSFERS_MESSAGE+'</p><div id="reference-item-modal"></div>',
                title: MESSAGES.ACCOUNT_TRANSFER.OTHER_TRANSFERS_TITLE,
                onEscape: function () {
                },
                buttons: {
                    success: {
                        label: BUTTONS.ACCEPT,
                        className: "btn-solidblue pull-left btn-save",
                        callback: function () {
                            acceptTransfer(ele);
                            return false;
                        }
                    },
                    main: {
                        label: BUTTONS.CLOSE,
                        className: "btn-cancel"
                    }
                }
            });

            box.on("shown.bs.modal", function() {
                jQuery('#reference-item-modal').append(mainDiv);
                jQuery('.bootbox').find('.modal-footer').find('button.btn-cancel').removeClass('btn');
                jQuery('.bootbox').find('.modal-footer').find('button.btn-solidblue').empty().append('<i class="fa fa-save"></i>&nbsp;&nbsp;' + BUTTONS.ACCEPT);
            });
        } else {
            acceptTransferConfirmation(ele);
        }

    });
}

function acceptTransfer(ele){
    clearMessages();
    var id = jQuery(ele).attr('data-transferid');
    var url = jQuery('#url').val();
    var data = {renameRules:{}};
    jQuery('.reference-item-type').each(function(indx,refItemType) {
        var itemType = jQuery(refItemType).attr('data-item-type');
        data.renameRules[itemType] = [];
        jQuery(refItemType).find('.reference-item').each(function(indx,refItem) {
            var itemId = jQuery(refItem).attr('data-item-id');
            data.renameRules[itemType].push({id:itemId,newName:jQuery(refItem).find('input').val()});
        })
    });
    ajaxRequest({url:url+'/accept/'+id,type:REQUEST.METHODS.POST,contentType: REQUEST.CONTENT_TYPE.JSON,
        dataType: REQUEST.DATA_TYPE.JSON,data:JSON.stringify(data)}).done(function(data){
        if(data.success){
            jQuery('tr[data-transferid="'+id+'"]').remove();
            if(jQuery('#incoming-tab tr[data-transferid]').length == 0) {
                jQuery('#no-incoming-tr').removeClass("hidden");
            }
            showSuccessOrErrors(data);
            bootbox.hideAll();
        }
    }).fail(function(data) {
        if (data.responseJSON.errors) {
            var errors = data.responseJSON.errors;
            showErrors(errors, ".modal ul.errors");
        }
    });
}

function acceptTransferConfirmation(ele){
    var ele = ele?ele:this;
    Dialog.confirm(MESSAGES.ACCOUNT_TRANSFER.CONFIRM_ACCEPT,function(r){
        if(r){
            acceptTransfer(ele);
        }
    });
}

function abortTransfer(id,cancelOrReject){
    clearMessages();
    var url = jQuery('#url').val();
    clearMessages();
    ajaxRequestOld({url:url+'/'+ cancelOrReject+'/'+id,type:REQUEST.METHODS.DELETE,contentType: REQUEST.CONTENT_TYPE.JSON,
        dataType: REQUEST.DATA_TYPE.JSON}).done(function(data){
        if(data.success){
            jQuery('tr[data-transferid="'+id+'"]').remove();

            var selector= null;
            var noTrSelector = null;
            if('cancel' == cancelOrReject){
                selector = '#outgoing-tab';
                noTrSelector = '#no-outgoing-tr';
            } else if('reject' == cancelOrReject){
                selector = '#incoming-tab';
                noTrSelector = '#no-incoming-tr';
            }
            if(selector && jQuery(selector + ' tr[data-transferid]').length == 0) {
                jQuery(noTrSelector).removeClass("hidden");
            }
        }
        showSuccessOrErrors(data);
    });
}

function filterDomains(){
    var domainName=jQuery('#domain-filter').val();
    jQuery('#domain-select li').removeClass('hidden');
    if(domainName){
        domainName=domainName.trim();
        if(domainName){
            jQuery('#domain-select li').not(':contains('+domainName+')').addClass('hidden');
        }
    }
}
function addNewOutgoing(id,domainName,toUserName){
    var tr = '<tr data-transferid="'+id+'">\<td>'+domainName+'</td>\
                    <td>'+toUserName+'</td>\
                    <td class="one-icon-cell">\
                    <a rel="popover" data-placement="left" data-trigger="hover" data-content="Cancel" data-transferid="'+id+'" class="cursor-pointer icon-transfer-action cancel-transfer icon-cross"><i class="fa fa-times-circle"></i></a>\
                    </td>\
                   </tr>';
    jQuery('#outgoing-tab').append(tr);
    bindIconEvents();
}
//! require layout.js
//= require /js/transferDomain/transfer.js

jQuery(document).ready(function () {
    jQuery.validator.setDefaults({
        onfocusout: function (element) {
            this.element(element);
        }
    });
});
/*
 * https://github.com/rohanrhu/jsortable
 * Copyright (C) 2015, Oğuzhan Eroğlu <rohanrhu2@gmail.com>
 * Licensed under MIT
 */

(function($){
    var methods = {
        init: function (parameters) {
            var t_init = this;
            var $elements = $(this);

            if (typeof parameters == 'undefined') {
                parameters = {};
            }

            t_init.parameters = parameters;

            t_init.parameters.show_source_placeholder = (typeof t_init.parameters.show_source_placeholder != 'undefined') ? t_init.parameters.show_source_placeholder: true;
            t_init.parameters.show_target_placeholder = (typeof t_init.parameters.show_target_placeholder != 'undefined') ? t_init.parameters.show_target_placeholder: true;

            $elements.each(function () {
                var $jsortable = $(this);
                var data = {};
                $jsortable.data('jsortable', data);
                data.$jsortable_sortable_s = $jsortable.find(t_init.parameters.sortable);
                data.$jsortable_sortable_s__order = $jsortable.find(t_init.parameters.sortable);
                var $body = $('body');

                $jsortable.on('jsortable_initialize.jsortable', function (event) {
                    data.initialize();
                });

                data.initialize = function () {

                };

                $jsortable.addClass('jsortable');

                var $sortablePlaceholder__proto = $('<div></div>');
                $sortablePlaceholder__proto.addClass('__proto');
                $sortablePlaceholder__proto.addClass('jsortable_placeholder');
                $sortablePlaceholder__proto.css({
                    background: '#f1f1f1',
                    position: 'relative',
                });
                var $sortablePlaceholder_layer1__proto = $('<div></div>');
                $sortablePlaceholder_layer1__proto.addClass('__proto');
                $sortablePlaceholder_layer1__proto.addClass('sortablePlaceholder_layer1');
                $sortablePlaceholder_layer1__proto.css({
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    border: '1px dashed rgba(0,0,0,0.2)'
                });

                data.$jsortable_sortable_s.each(function () {
                    var $sortable = $(this);
                    var sortable_data = {};
                    $sortable.data('jsortable', sortable_data);
                });

                data.updateIndexes = function () {
                    data.$jsortable_sortable_s__order = $jsortable.find(t_init.parameters.sortable);
                    var _sortable_i = 0;
                    data.$jsortable_sortable_s__order.each(function () {
                        var $sortable = $(this);
                        var sortable_data = $sortable.data('jsortable');
                        sortable_data.index = _sortable_i++;
                    });
                };

                data.updateIndexes();

                data.$jsortable_sortable_s.each(function () {
                    var $sortable = $(this);
                    var sortable_data = $sortable.data('jsortable');
                    var $_source_placeholder = $sortablePlaceholder__proto.clone(true);
                    var $_target_placeholder = $sortablePlaceholder__proto.clone(true);

                    var $_sortablePlaceholder_layer1 = $sortablePlaceholder_layer1__proto.clone(true);
                    $_sortablePlaceholder_layer1.removeClass('__proto');
                    $_sortablePlaceholder_layer1.css({
                        'border-radius': $sortable.css('border-radius')
                    });

                    $_source_placeholder.removeClass('__proto');
                    $_source_placeholder.width($sortable.outerWidth());
                    $_source_placeholder.height($sortable.outerHeight());
                    $_source_placeholder.css({
                        'float': $sortable.css('float'),
                        'display': $sortable.css('display')
                    });
                    if (t_init.parameters.show_source_placeholder) {
                        $_source_placeholder.css({
                            'margin-left': $sortable.css('margin-left'),
                            'margin-right': $sortable.css('margin-right'),
                            'margin-top': $sortable.css('margin-top'),
                            'margin-bottom': $sortable.css('margin-bottom')
                        });
                        $_sortablePlaceholder_layer1.clone(true).appendTo($_source_placeholder);
                    } else {
                        $_source_placeholder.css({
                            overflow: 'hidden'
                        }).width(0).height(0);
                    }

                    $_target_placeholder.removeClass('__proto');
                    $_target_placeholder.width($sortable.outerWidth());
                    $_target_placeholder.height($sortable.outerHeight());
                    $_target_placeholder.css({
                        'float': $sortable.css('float'),
                        'display': $sortable.css('display')
                    });
                    if (t_init.parameters.show_target_placeholder) {
                        $_target_placeholder.css({
                            'margin-left': $sortable.css('margin-left'),
                            'margin-right': $sortable.css('margin-right'),
                            'margin-top': $sortable.css('margin-top'),
                            'margin-bottom': $sortable.css('margin-bottom')
                        });
                        $_sortablePlaceholder_layer1.clone(true).appendTo($_target_placeholder);
                    } else {
                        $_target_placeholder.css({
                            overflow: 'hidden'
                        }).width(0).height(0);
                    }

                    data.sortable_state = {};
                    data.sortable_state.need_drop = false;
                    data.sortable_state.drop_to = null;

                    $sortable.on('draginit.jsortable', function (event) {
                        data.updateIndexes();
                        data.sortable_state.need_drop = false;
                    });

                    $sortable.on('dragstart.jsortable', function (event) {
                        $_source_placeholder.insertAfter($sortable);

                        $sortable.css({
                            position: 'absolute',
                            left: event.pageX,
                            top: event.pageY
                        });

                        $sortable.appendTo($body);
                    });
                    
                    $sortable.on('drag.jsortable', function (event) {
                        var _left = event.pageX - ($sortable.outerWidth()/2);
                        var _top = event.pageY - ($sortable.outerHeight()/2);
                        $sortable.css({
                            left: _left,
                            top: _top
                        });

                        var _current_sortable_i = 0;

                        data.$jsortable_sortable_s__order.not($sortable).each(function () {
                            var $current_sortable = $(this);
                            var current_sortable_data = $current_sortable.data('jsortable');
                            var current_sortable_x = $current_sortable.offset().left;
                            var current_sortable_right_x = current_sortable_x + $current_sortable.outerWidth();
                            var current_sortable_y = $current_sortable.offset().top;
                            var current_sortable_bottom_y = current_sortable_y + $current_sortable.outerHeight();

                            var target_placeholder_x;
                            var target_placeholder_right_x;
                            var target_placeholder_y;
                            var target_placeholder_bottom_y;

                            var _updateTargetPlaceholderState = function () {
                                target_placeholder_x = $_target_placeholder.offset().left;
                                target_placeholder_right_x = target_placeholder_x + $_target_placeholder.outerWidth();
                                target_placeholder_y = $_target_placeholder.offset().top;
                                target_placeholder_bottom_y = target_placeholder_y + $_target_placeholder.outerHeight();
                            };

                            _updateTargetPlaceholderState();

                            if (
                                (sortable_data.index != _current_sortable_i)
                                &&
                                (_current_sortable_i != 0)
                                &&
                                (
                                    (event.pageX > current_sortable_x)
                                    &&
                                    (event.pageX < current_sortable_right_x)
                                )
                                &&
                                (
                                    (event.pageY > current_sortable_y)
                                    &&
                                    (event.pageY < current_sortable_bottom_y)
                                )
                            ) {
                                $_target_placeholder.insertBefore($current_sortable);

                                data.sortable_state.need_drop = true;
                                data.sortable_state.drop_to = $_target_placeholder;
                                return false;
                            } else if (
                                (
                                    (sortable_data.index != data.$jsortable_sortable_s__order.length - 1)
                                    &&
                                    (_current_sortable_i == (data.$jsortable_sortable_s__order.length - 2))
                                    &&
                                    (
                                        (
                                            (event.pageX > current_sortable_right_x)
                                            &&
                                            (
                                                (event.pageY > current_sortable_y)
                                                &&
                                                (event.pageY < current_sortable_bottom_y)
                                            )
                                        )
                                        ||
                                        (
                                            (event.pageY > current_sortable_bottom_y)
                                            &&
                                            (
                                                (event.pageX > current_sortable_x)
                                                &&
                                                (event.pageX < current_sortable_right_x)
                                            )
                                        )
                                    )
                                )
                            ) {
                                $_target_placeholder.insertAfter($current_sortable);

                                data.sortable_state.need_drop = true;
                                data.sortable_state.drop_to = $_target_placeholder;
                                return false;
                            } else if (
                                (sortable_data.index != 0)
                                &&
                                (_current_sortable_i == 0)
                                &&
                                (
                                    (event.pageX > current_sortable_x)
                                    &&
                                    (event.pageX < current_sortable_right_x)
                                )
                                &&
                                (
                                    (event.pageY > current_sortable_y)
                                    &&
                                    (event.pageY < current_sortable_bottom_y)
                                )
                            ) {
                                $_target_placeholder.insertBefore($current_sortable);

                                data.sortable_state.need_drop = true;
                                data.sortable_state.drop_to = $_target_placeholder;
                                return false;
                            } else if (
                                !(
                                    (
                                        (event.pageX > target_placeholder_x)
                                        &&
                                        (event.pageX < target_placeholder_right_x)
                                    )
                                    &&
                                    (
                                        (event.pageY > target_placeholder_y)
                                        &&
                                        (event.pageY < target_placeholder_bottom_y)
                                    )
                                )
                            ) {
                                data.sortable_state.need_drop = false;
                                data.sortable_state.drop_to = null;
                                $_target_placeholder.remove();
                            }

                            _current_sortable_i++;
                        });
                    });

                    $sortable.on('dragend.jsortable', function (event) {
                        if (!data.sortable_state.need_drop) {
                            $sortable.insertAfter($_source_placeholder);
                        } else {
                            $sortable.insertAfter($_target_placeholder);
                        }

                        $sortable.css({
                            position: 'static',
                            top: 'auto',
                            left: 'auto'
                        });

                        $_source_placeholder.remove();
                        $_target_placeholder.remove();

                        data.updateIndexes();

                        if (data.sortable_state.need_drop) {
                            $sortable.trigger('jsortable_updated');
                            data.sortable_state.need_drop = false;
                        }
                    });
                });

                data.initialize();
            });
        },
        getElements: function () {
            var $jsortable = $(this);
            var data = $jsortable.data('jsortable');

            return data.$jsortable_sortable_s__order;
        }
    };

    $.fn.jsortable = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method '+method+' does not exist on jQuery.jsortable');
        }
    };
})(jQuery);
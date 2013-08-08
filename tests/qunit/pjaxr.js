module('$.pjaxr');

asyncTest('push 1rd level url', function() {
    equal(window.location.pathname, '/');
    equal($('head > title').html(), 'qunit');
    equal(document.title, 'qunit');
    equal($('head > meta').length, 2);
    $.each($('head > meta'), function(index, value) {
        var $meta = $(value);
        if ($meta.attr('name') === 'author') { equal($meta.attr('content'), 'minddust'); }
        else if ($meta.attr('name') === 'title') { equal($meta.attr('content'), 'qunit'); }
        else { ok(false); }
    });
    equal($('head > link').length, 1);
    equal($('head > script').length, 0);
    equal($('head > style').length, 0);
    equal($('#menu-extra-entry').html().trim(), '');
    equal($('#content').html().trim(), '<h1>qunit tests</h1>');

    $(document).one('pjaxr:end', function() {
        equal(window.location.pathname, '/home/');

        equal($('head > title').html(), 'home');
        equal(document.title, 'home');
        equal($('head > meta').length, 3);
        $.each($('head > meta'), function(index, value) {
            var $meta = $(value);
            if ($meta.attr('name') === 'author') { equal($meta.attr('content'), 'minddust'); }
            else if ($meta.attr('name') === 'title') { equal($meta.attr('content'), 'home'); }
            else if ($meta.attr('name') === 'description') { equal($meta.attr('content'), 'home of everything'); }
            else { ok(false); }
        });
        equal($('head > link').length, 1);
        equal($('head > script').length, 0);
        equal($('head > style').length, 0);
        equal($('#menu-extra-entry').html().trim(), '');
        equal($('#content').html().trim(), '<h1>home - pjax</h1>');

        history.back();

        setTimeout(function() {
            equal(window.location.pathname, '/');
            equal($('head > title').html(), 'qunit');
            equal(document.title, 'qunit');
            equal($('head > meta').length, 2);
            $.each($('head > meta'), function(index, value) {
                var $meta = $(value);
                if ($meta.attr('name') === 'author') { equal($meta.attr('content'), 'minddust'); }
                else if ($meta.attr('name') === 'title') { equal($meta.attr('content'), 'qunit'); }
                else { ok(false); }
            });
            equal($('head > link').length, 1);
            equal($('head > script').length, 0);
            equal($('head > style').length, 0);
            equal($('#menu-extra-entry').html().trim(), '');
            equal($('#content').html().trim(), '<h1>qunit tests</h1>');

            history.back();

            setTimeout(function() {
                equal(window.location.pathname, '/');
                start();
            }, 0);
        }, 0);
    });

    $(document).pjaxr('a[data-pjaxr]');
    $('a[href="/home/"]').trigger('click');
});

asyncTest('push 2nd level url', function() {
    equal(window.location.pathname, '/');
    equal($('head > title').html(), 'qunit');
    equal($('head > meta').length, 2);

    $(document).one('pjaxr:end', function() {
        equal(window.location.pathname, '/home/');
        equal($('head > title').html(), 'home');
        equal($('head > meta').length, 3);
        equal($('#menu-extra-entry').html().trim(), '');
        equal($('#content').html().trim(), '<h1>home - pjax</h1>');

        $(document).one('pjaxr:end', function() {
            equal(window.location.pathname, '/blog/');
            equal($('head > title').html(), 'blog');
            equal($('head > meta').length, 2);
            $.each($('head > meta'), function(index, value) {
                var $meta = $(value);
                if ($meta.attr('name') === 'author') { equal($meta.attr('content'), 'stephan'); }
                else if ($meta.attr('name') === 'title') { equal($meta.attr('content'), 'blog'); }
                else { ok(false); }
            });
            equal($('#menu-extra-entry').html().trim(), '<a href="/entry-x/">click here for the latest blog entry</a>');
            equal($('#content').html().trim(), '<h1>blog list - pjax</h1><br><h2>Entry X</h2><a href="/entry-x/">click here to read more</a>');

            history.back();

            setTimeout(function() {
                equal(window.location.pathname, '/home/');
                equal($('head > title').html(), 'home');
                equal($('head > meta').length, 3);
                $.each($('head > meta'), function(index, value) {
                    var $meta = $(value);
                    if ($meta.attr('name') === 'author') { equal($meta.attr('content'), 'minddust'); }
                    else if ($meta.attr('name') === 'title') { equal($meta.attr('content'), 'home'); }
                    else if ($meta.attr('name') === 'description') { equal($meta.attr('content'), 'home of everything'); }
                    else { ok(false); }
                });
                equal($('#menu-extra-entry').html().trim(), '');
                equal($('#content').html().trim(), '<h1>home - pjax</h1>');

                history.back();

                setTimeout(function() {
                    equal(window.location.pathname, '/');
                    start();
                }, 0);

            }, 0);
        });

        $('a[href="/blog/"]').trigger('click');
    });

    $(document).pjaxr('a[data-pjaxr]');
    $('a[href="/home/"]').trigger('click');
});

asyncTest('data-remove-on-pjaxr', function() {
    equal(window.location.pathname, '/');
    equal($('head > meta').length, 2);
    equal($('head > meta[data-remove-on-pjaxr]').length, 1);

    $(document).one('pjaxr:end', function() {
        equal(window.location.pathname, '/empty/');
        equal($('head > meta').length, 1);
        equal($('head > meta[data-remove-on-pjaxr]').length, 0);

        history.back();

        setTimeout(function() {
            equal(window.location.pathname, '/');
            equal($('head > meta').length, 2);
            equal($('head > meta[data-remove-on-pjaxr]').length, 1);

            history.forward();

            setTimeout(function() {
                equal(window.location.pathname, '/empty/');
                equal($('head > meta').length, 1);
                equal($('head > meta[data-remove-on-pjaxr]').length, 0);

                history.back();

                setTimeout(function() {
                    equal(window.location.pathname, '/');
                    start();
                }, 0);
            }, 0);
        }, 0);
    });

    $(document).pjaxr('a[data-pjaxr]');
    $('a[href="/empty/"]').trigger('click');
});
require.config({ baseUrl: 'js/lib', paths: {templates:'../templates', twitter: '//platform.twitter.com/widgets'}});
require(['jquery', 'text', 'handlebars', 'moment', 'text!templates/github.handlebars', 'twitter'],
function($, text, handlebars, moment, github_tpl) {
    $(document).ready(function() {
        var github_events_url = 'https://api.github.com/users/dcloud/events/public';

        $.getJSON(github_events_url, function(data, textStatus, xhr) {
            var events = data.slice(0,15);
            for (var i = events.length - 1; i >= 0; i--) {
                var obj = events[i];
                obj.from_now = moment.utc(obj.created_at).fromNow();
                obj.type_display = obj.type.split('Event')[0];
            }
            template = Handlebars.compile(github_tpl);
            html = template({events: events});
            $('#github').html(html);

        });
    });

});
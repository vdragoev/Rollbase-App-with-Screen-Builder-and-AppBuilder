'use strict';

app.home = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var provider = app.data.defaultProvider,
        signinSuccess =
        function(data) {
            app.user = data.result;
            app.mobileApp.navigate('dataListView/view.html');
        },
        signinInit =
        function() {
            if (provider.setup.offlineStorage && !app.isOnline()) {
                $('.signin-view').hide().siblings().show();
            } else {
                $('.signin-view').show().siblings().hide();
            }
        },
        homeModel = kendo.observable({
            username: '',
            password: '',
            signin: function() {
                provider.Users.login(homeModel.username, homeModel.password,
                    function(data) {
                        if (data && data.result) {
                            signinSuccess(data);
                        } else {
                            signinInit();
                        }
                    },
                    signinInit);
            }
        });

    parent.set('homeModel', homeModel);
    parent.set('onShow', function() {
        provider.Users.currentUser().then(
            function(data) {
                if (data && data.result) {
                    signinSuccess(data);
                } else {
                    signinInit();
                }
            },
            signinInit
        );
    });
})(app.home);
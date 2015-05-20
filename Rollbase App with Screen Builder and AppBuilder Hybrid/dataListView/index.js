'use strict';

app.dataListView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var dataProvider = app.data.defaultProvider;
    var processImage = function(img) {
        if (!img) {
            var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
            img = 'data:image/png;base64,' + empty1x1png;
        } else if (img.slice(0, 4) !== 'http' &&
            img.slice(0, 2) !== '//' &&
            img.slice(0, 5) !== 'data:') {
            var setup = dataProvider.setup;
            img = setup.scheme + ':' + setup.url + setup.apiKey + '/Files/' + img + '/Download';
        }

        return img;
    };

    var dataSource = new kendo.data.DataSource({
        type: 'everlive',
        transport: {
            typeName: 'Activities',
            dataProvider: dataProvider
        },
        change: function(e) {
            var data = this.data();
            for (var i = 0; i < data.length; i++) {
                data[i].PictureUrl = processImage(data[i].Picture);
            }
        },
        schema: {
            model: {
                fields: {
                    Text: {
                        field: 'Text',
                        defaultValue: ''
                    },
                    Picture: {
                        field: 'Picture',
                        defaultValue: ''
                    },
                },
                icon: function() {
                    var i = 'globe';
                    return kendo.format('km-icon km-{0}', i);
                }
            }
        },
        serverSorting: true,
        serverPaging: true,
        pageSize: 50
    });

    var dataListViewModel = kendo.observable({
        dataSource: dataSource,
        itemClick: function(e) {
            app.mobileApp.navigate('#dataListView/details.html?uid=' + e.dataItem.uid);
        },
        detailsShow: function(e) {
            var item = e.view.params.uid,
                itemModel = dataSource.getByUid(item);
            itemModel.PictureUrl = processImage(itemModel.Picture);
            dataListViewModel.set('currentItem', itemModel);
        },
        currentItem: null
    });

    parent.set('dataListViewModel', dataListViewModel);
})(app.dataListView);
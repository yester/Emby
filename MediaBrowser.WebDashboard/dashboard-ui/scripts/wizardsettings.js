﻿(function ($, document) {

    function save(page) {

        Dashboard.showLoadingMsg();

        var apiClient = ApiClient;

        // After saving chapter task, now save server config
        apiClient.getJSON(apiClient.getUrl('Startup/Configuration')).then(function (config) {

            config.PreferredMetadataLanguage = $('#selectLanguage', page).val();
            config.MetadataCountryCode = $('#selectCountry', page).val();
            config.SaveLocalMeta = page.querySelector('.chkSaveLocalMetadata').checked;
            config.EnableInternetProviders = page.querySelector('.chkEnableInternetProviders').checked;

            apiClient.ajax({

                type: 'POST',
                data: config,
                url: apiClient.getUrl('Startup/Configuration')

            }).then(function () {

                navigateToNextPage();

            });
        });

    }

    function reloadData(page, config, cultures, countries) {

        Dashboard.populateLanguages($('#selectLanguage', page), cultures);
        Dashboard.populateCountries($('#selectCountry', page), countries);

        $('#selectLanguage', page).val(config.PreferredMetadataLanguage);
        $('#selectCountry', page).val(config.MetadataCountryCode);

        Dashboard.hideLoadingMsg();
    }

    function reload(page) {

        Dashboard.showLoadingMsg();

        var apiClient = ApiClient;

        var promise1 = apiClient.getJSON(apiClient.getUrl('Startup/Configuration'));
        var promise2 = apiClient.getCultures();
        var promise3 = apiClient.getCountries();

        Promise.all([promise1, promise2, promise3]).then(function (responses) {

            reloadData(page, responses[0], responses[1], responses[2]);

        });
    }

    function navigateToNextPage() {

        Dashboard.navigate('wizardlivetvtuner.html');
    }

    function onSubmit() {
        var form = this;

        save(form);

        return false;
    }

    $(document).on('pageinit', "#wizardSettingsPage", function () {

        var page = this;

        $('.wizardSettingsForm', page).off('submit', onSubmit).on('submit', onSubmit);

    }).on('pageshow', "#wizardSettingsPage", function () {

        var page = this;

        reload(page);
    });

})(jQuery, document, window);

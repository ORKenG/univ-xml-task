function utoa(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}
$('#submit').click(function (e) {
    e.preventDefault();
    $.ajaxPrefilter( function (options) {
      if (options.crossDomain && jQuery.support.cors) {
        var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
        options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
        //options.url = "http://cors.corsproxy.io/url=" + options.url;
      }
    });
    const url = 'https://osbb-musson.com.ua:59960/entirex/xmlrt';
    const method = 'POST';
    const processData = false;
    const contentType = 'text/xml';
    const dataType = 'xml';
    const semester = $('#semester').val()
    const lectureHall = $('#lectureHall').val();
    const grade = $('#grade').val();
    const teacher = $('#teacher').val();
    const reqbuf64 = utoa(
    `<?xml version='1.0' encoding='Windows-1251' ?>\
        <GetRaspis>\
            <semestr>\
                ${semester}\
            </semestr>\
            <auditoriy>\
                ${lectureHall}\
            </auditoriy>\
            <raspkurs>\
                ${grade}\
            </raspkurs>\
            <prepodavatel>\
                ${teacher}\
            </prepodavatel>\
        </GetRaspis>`);
    const soapMessage =
    `<?xml version='1.0' encoding='UTF-8' ?><SOAP-ENV:Envelope xmlns:SOAP-ENC='http://schemas.xmlsoap.org/soap/encoding/' xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xmm='http://namespace.softwareag.com/entirex/xml/mapping' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>\
    <SOAP-ENV:Header><!-- <SOAPAction>WSDLOSBB</SOAPAction> --></SOAP-ENV:Header>\
    <SOAP-ENV:Body>\
        <m:WSDLOSBB xmlns:m='urn:com-softwareag-entirex-rpc:OSBB_SRV-WSDLOSBB'>\
            <USER-ID>KIS00001</USER-ID>\
            <FUNC>GetRaspis</FUNC>\
            \
            <FIRMA>999</FIRMA>\
            <REQBUFB64>${reqbuf64}</REQBUFB64>\
            <SIGNB64></SIGNB64>\
        </m:WSDLOSBB>\
    </SOAP-ENV:Body>\
</SOAP-ENV:Envelope>`;
    $.ajax({
        url,
        method,
        processData,
        contentType,
        dataType,
        crossDomain: true,
        data: soapMessage,
        complete: function (response) {
            const encodedResponse = $(response.responseXML).find('W3VALUE').text();
            const bytes = Base64Binary.decode(encodedResponse);
            const decoder = new TextDecoder('windows-1251');
            const decoded = decoder.decode(bytes);
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(decoded,"text/xml");
            console.dir($(xmlDoc).find('Returns').find('СПЕЦИАЛЬНОСТЬ:contains("Математика")'));
            $('.target').text(decoded);
        },
        error: function (xhr, status, thrownError) {
            console.dir(xhr);
            console.dir(status);
            console.dir(thrownError);
        }
    });
});

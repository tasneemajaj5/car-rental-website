$(document).ready(function () {

    // Show and hide car details
    $(".details-toggle").change(function () {

        var checkboxId = $(this).attr("id");
        var detailsId = checkboxId.replace("toggle", "details");

        if ($(this).prop("checked")) {
            $("#" + detailsId).show();
        } else {
            $("#" + detailsId).hide();
        }

    });

    // Continue to the booking form
    $("#continueButton").click(function () {

        var selectedCount =
            $("input[name='selectedCars']:checked").length;

        if (selectedCount === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
            return;
        }

        $("#bookingForm").show();
    });

    // Validate the form and calculate the rental cost
    $("#reservationForm").submit(function (event) {

        event.preventDefault();

        var fullName = $.trim($("#fullName").val());
        var nationalId = $.trim($("#nationalId").val());
        var phone = $.trim($("#phone").val());
        var email = $.trim($("#email").val());

        var startDate = $.trim($("#startDate").val());
        var endDate = $.trim($("#endDate").val());

        // Check selected cars
        var selectedCars =
            $("input[name='selectedCars']:checked");

        if (selectedCars.length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
            return;
        }

        // Validate Arabic name if provided
        var arabicNamePattern = /^[\u0621-\u064A ]+$/;

        if (fullName !== "" &&
            !arabicNamePattern.test(fullName)) {
            alert("يجب أن يتكون الاسم من أحرف عربية ومسافات فقط.");
            return;
        }

        // National ID: 11 digits, governorate code 01-14
        var nationalIdPattern = /^[0-9]{11}$/;

        if (!nationalIdPattern.test(nationalId)) {
            alert("الرقم الوطني يجب أن يتكون من 11 خانة.");
            return;
        }

        var governorateCode =
            parseInt(nationalId.substring(0, 2), 10);

        if (governorateCode < 1 || governorateCode > 14) {
            alert("أول خانتين من الرقم الوطني يجب أن تكونا بين 01 و14.");
            return;
        }

        // Validate dates in dd-mm-yyyy format
        var datePattern =
            /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-[0-9]{4}$/;

        if (startDate === "" || endDate === "") {
            alert("يرجى إدخال تاريخ البداية وتاريخ النهاية.");
            return;
        }

        if (!datePattern.test(startDate) ||
            !datePattern.test(endDate)) {
            alert("أدخلي التاريخ بصيغة dd-mm-yyyy.");
            return;
        }

        function parseDate(dateText) {

            var parts = dateText.split("-");

            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10);
            var year = parseInt(parts[2], 10);

            var date = new Date(year, month - 1, day);

            if (date.getFullYear() !== year ||
                date.getMonth() !== month - 1 ||
                date.getDate() !== day) {
                return null;
            }

            return date;
        }

        var start = parseDate(startDate);
        var end = parseDate(endDate);

        if (start === null || end === null) {
            alert("أحد التاريخين غير صحيح.");
            return;
        }

        if (end <= start) {
            alert("تاريخ النهاية يجب أن يكون بعد تاريخ البداية.");
            return;
        }

        // Validate Syrian mobile number if provided
        var phonePattern =
            /^09(3|4|5|6|8|9)[0-9]{7}$/;

        if (phone !== "" && !phonePattern.test(phone)) {
            alert("تحققي من رقم الموبايل وصيغته.");
            return;
        }

        // Validate email if provided
        var emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email !== "" && !emailPattern.test(email)) {
            alert("البريد الإلكتروني غير صحيح.");
            return;
        }

        // Calculate rental duration in days
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
var days = Math.round(
            (end.getTime() - start.getTime()) /
            millisecondsPerDay
        );

        // Car prices in Syrian pounds
        var carPrices = {
            "CR-001": 250000,
            "CR-002": 400000,
            "CR-003": 300000,
            "CR-004": 180000,
            "CR-005": 220000
        };

        var carNames = {
            "CR-001": "Toyota Corolla",
            "CR-002": "Kia Sportage",
            "CR-003": "Hyundai Elantra",
            "CR-004": "Chevrolet Spark",
            "CR-005": "Nissan Sunny"
        };

        var totalBeforeDiscount = 0;
        var result = "مدة التأجير: " + days + " يوم\n\n";

        // Calculate the cost of every selected car
        for (var i = 0; i < selectedCars.length; i++) {

            var carCode = $(selectedCars[i]).val();
            var dailyPrice = carPrices[carCode];
            var carTotal = dailyPrice * days;

            totalBeforeDiscount += carTotal;

            result += carNames[carCode] +
                " (" + carCode + "): " +
                days + " يوم × " +
                dailyPrice.toLocaleString("en-US") +
                " = " +
                carTotal.toLocaleString("en-US") +
                " ل.س\n";
        }

        // Apply a 10% discount when the rental exceeds 7 days
        var discount = 0;

        if (days > 7) {
            discount = totalBeforeDiscount * 0.10;
        }

        var finalTotal = totalBeforeDiscount - discount;

        result += "\nالمجموع قبل الخصم: " +
            totalBeforeDiscount.toLocaleString("en-US") +
            " ل.س";

        result += "\nالخصم: " +
            discount.toLocaleString("en-US") +
            " ل.س";

        result += "\nالمبلغ النهائي: " +
            finalTotal.toLocaleString("en-US") +
            " ل.س";

        $("#resultText").text(result);
        $("#bookingResult").show();

        alert(result);

    });

});
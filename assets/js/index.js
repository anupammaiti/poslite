$(document).ready(function() {
	var base_url = $("meta[name='base_url']").attr('content');
	var currency = '₱';

	$("form").parsley();
	
	$("#item-form").submit(function(e) {
		var price = $("[name='price']").val();
		var retail = $("[name='retail_price']").val();

		if (parseInt(price) > retail) {
			alert("Retail price must be greather or equal to price");
			e.preventDefault();
		}
	})

	var profit_table = $("#profit_table").DataTable({
		processing : true,
		bLengthChange : false,
		ordering : false,
		paging : false,
		serverSide : true,
		dom : 'r',
		ajax : {
			type : "POST",
			url : base_url + "AccountingController/data"
		},
		initComplete : function() {
			$("#accounting-filter input").change(function() {
				var start = $("#min-date").val();
				var end = $("#max-date");

				if (start && end.val()) {
					end.datepicker('hide');
					profit_table.columns(0).search(start);
					profit_table.columns(1).search(end).draw();
					$("#range").text('Date: ' + start + ' - ' + end.val());
				}
			})
		},
		drawCallback : function (setting) {
			var data = setting.json;
			$("#total-profit").text('₱' + data.profit);

		}
	});
	
	$('.date-range-filter').datepicker();
	$("#history_table").DataTable({
		'bLengthChange' : false,
		'searching' : false,
		'ordering' : false,

	});

	$("#mail").click(function() {
		var button = $(this);
		$.ajax({
			type : 'GET',
			url : base_url + 'SuppliersController/mail',
			beforeSend : function() {
				button.button('loading');
			},
			success : function(data) {
				
				if (data == 1) 
					$("#message").show();
				else 
					alert("Opps! Something went wrong please try again later");
				button.button('reset');
			},
			error : function() {
				alert('Opps! Something went wrong we cannot send your email');
				button.button('reset');
			}
		});
	})

	$("#export").click(function(e) {
		e.preventDefault();
		var start = $("#min-date").val();
		var end = $("#max-date").val();

		if (start && end) {
			window.location.href = base_url + "SalesController/export?start=" + start + "&end=" + end;
		}else {
			alert("Please select date");
		}
	})

	$("#graph-menu button").click(function() {
		$('#graph-menu button').removeClass('active');
		$(this).addClass('active');
		var type = $(this).data('id');
		$.ajax({
			type : 'POST',
			url : base_url + 'sales/graph-filter',
			data : {
				type : type
			},
			success : function(data) {

				var result = JSON.parse(data);
			
				if (type == "week")
					myChart.data.datasets[0].label = "Sales for the last 7 Days";
				else if (type == "month")
					myChart.data.datasets[0].label = "Monthly Sales";
				else if (type == "year")
					myChart.data.datasets[0].label = "Yearly Sales";

				myChart.data.labels = Object.keys(result);
				myChart.data.datasets.data = Object.values(result);
				myChart.data.datasets[0].data = Object.values(result);
				myChart.update();

			}
		});
	});
	var sales_table = $("#sales_table").DataTable({
		searching : true,
		ordering : false,
		bLengthChange :false,
		serverSide : true,
		info : false,
		processing : true,
		bsearchable : true,
		paging : false,
		dom : 'lrtip',
		ajax : {
			url : base_url + 'sales/report',
			type : 'POST'
		},
		initComplete : function(settings, json) {
			$("#total-sales").text('₱' + json.total_sales);
			$("#max-date").change(function() {
				$(this).datepicker('hide');
				var to = $(this).val();
				var from = $("#min-date").val();
				
				if (from) {
					sales_table.columns(0).search(from);
					sales_table.columns(1).search(to).draw();
					$("#range").text('Date: ' +to + ' - ' + from);
 					 
				}else {
					alert('Select from date');
				}
			})
		},
		drawCallback : function (setting) {
			var data = setting.json;
			$("#total-sales").text('₱' + data.total_sales);
			$("#total-profit").text('₱' + data.profit);
			$("#total-lost").text('₱' + data.lost);
		}
	});

	$("#sales_table").on('click','.view', function() {
		var id = $(this).data('id');
		var row = $(this).parents('tr');
		var total = row.find('td').eq(2).text();
		 
		$.ajax({
			type : 'POST',
			data : {
				id : id
			},
			url : base_url + 'SalesController/details',
			success : function(data) {
				var description = JSON.parse(data);
				$("#sales-description-table tbody").empty();
				$.each(description, function(key,value) {
					$("#sales-description-table tbody").append(
							'<tr>' +
								'<td>' +value[0]+'</td>' + 
								'<td>' +value[1]+'</td>' + 
								'<td>'+ currency +value[2]+'</td>' + 
								'<td>' +value[3]+'</td>' +
								'<td>'+ currency +value[4]+'</td>' +
							'</tr>'
						);
				});

				$("#sales-description-table tbody").append(
						'<tr>' +
							'<td colspan="4" class="text-right">Total:</td>' +
							'<td>'+ currency + total+'</td>' +
						'</tr>'
					);	
				$("#sale-id").text(id);
			}
		});
		$("#modal").modal('toggle');
	})


	$("#supplier_table").DataTable({
		ordering : false,
		initComplete : function() {
			$("#supplier_table_length").append('&nbsp; <button class="btn btn-default btn-sm" data-toggle="modal" data-target="#myModal">Add Supplier</button>')
		}
	});
	$("#supplier_table").on('click','.edit',function() {
		var id = $(this).data('id');
		$("#supplier_id").val(id);
		$.ajax({
			type : 'POST',
			url : base_url + 'suppliers/find',
			data : {
				id : id
			},
			success : function(data) {
				var supplier = JSON.parse(data);
				$("#edit-supplier-form input[name='name']").val(supplier.name);
				$("#edit-supplier-form input[name='address']").val(supplier.address);
				$("#edit-supplier-form input[name='contact']").val(supplier.contact);
				$("#edit-supplier-form input[name='email']").val(supplier.email);
			}

		});
	});
	var itemTable = $("#item_tbl").DataTable({
		sort : false,
		dom : "lfrtBp",
		buttons: [
	        {
                extend: 'copyHtml5',
                filename : 'Inventory Report',
                title : 'Inventory',
                messageTop : 'Inventory Report',
                className : "btn btn-default btn-sm",
                exportOptions: {
                    columns: [ 0, 1, 2, 3,4,5,6 ]
                },
            },
            {
                extend: 'excelHtml5',
                filename : 'Inventory',
                title : 'Inventory Report',
                messageTop : 'Inventory Report',
                className : "btn btn-default btn-sm",
                exportOptions: {
                    columns: [ 0, 1, 2, 3,4,5,6 ]
                },
            },
            {
                extend: 'pdfHtml5',
                filename : 'Inventory Report',
                title : 'Inventory',
                messageTop : 'Inventory Report',
                className : "btn btn-default btn-sm",
                exportOptions: {
                    columns: [ 0, 1, 2, 3,4,5,6 ]
                },

            },
	    ],

		initComplete : function() { 
			$("#item_tbl_length").append("&nbsp;<select id='cat' class='form-control'>" +
						'<option value="">Select Category</option>' +
					"</select>"
				);
			$.ajax({
				method : 'GET',
				url : base_url + 'categories/get',
				success : function(data) {
					result = JSON.parse(data);
					$.each(result, function(key, value) {
						$("#cat").append("<option value='"+value.name+"'>"+value.name+"</option>");
					});
				}

			});
			
			$("#cat").change(function() {
				category = $(this).val();
				itemTable.search(category).draw();
			})
		}
	});

	$("#users_table").DataTable();
	$("#categories_table").DataTable({
		ordering : false
	});
	$("#deliveries_table").DataTable();
	$("#customer_table").DataTable({
		ordering : false,
		initComplete : function() {
			$("#customer_table_length").append('&nbsp; <button class="btn btn-default btn-sm" data-toggle="modal" data-target="#myModal">Add Customer</button>');
		}
	});
	$("#customer_table").on('click','.edit',function() {
		var id = $(this).data('id');
		 $("#customer_id").val(id);
		 $.ajax({
			type : 'POST',
			url : base_url + 'customers/find',
			data : {
				id : id
			},
			success : function(data) {
				var customer = JSON.parse(data);
				console.log(customer); 
				$("#customer-edit input[name='name']").val(customer.name);
				$("#customer-edit input[name='email']").val(customer.email);
				$("#customer-edit input[name='gender']").val(customer.gender);
				$("#customer-edit input[name='address']").val(customer.address);
				$("#customer-edit input[name='city']").val(customer.city);
				$("#customer-edit input[name='state']").val(customer.state); 
				$("#customer-edit input[name='zipcode']").val(customer.zipcode);
				$("#customer-edit input[name='mobileNumber']").val(customer.mobileNumber);
			}

		});
	})

		$("#btn-group-menu .btn").click(function() {
		$('.btn-group .btn').removeClass('active');
		$(this).addClass('active');
		if ($(this).data('id') == "table") {
			$("#table_view").show();
			$("#graph").hide();
			$("#table-menu").show();
			$("#graph-menu").hide();
			$("#widgets").show();
		}else {
			$("#widgets").hide();
			$("#table_view").hide();
			$("#graph").show();
			$("#table-menu").hide();
			$("#graph-menu").show();
		}
	})
})



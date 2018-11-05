<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	https://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There are three reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router which controller/method to use if those
| provided in the URL cannot be matched to a valid route.
|
|	$route['translate_uri_dashes'] = FALSE;
|
| This is not exactly a route, but allows you to automatically route
| controller and method names that contain dashes. '-' isn't a valid
| class or method name character, so it requires translation.
| When you set this option to TRUE, it will replace ALL dashes in the
| controller and method URI segments.
|
| Examples:	my-controller/index	-> my_controller/index
|		my-controller/my-method	-> my_controller/my_method
*/
$route['default_controller'] = 'pages/inventory';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;

$route['sales'] = 'SalesController/sales';
$route['sales/daily'] = 'SalesController/daily';
$route['sales/weekly'] = 'SalesController/weekly';
$route['sales/monthly'] = 'SalesController/monthly';
$route['sales/yearly'] = 'SalesController/yearly';

$route['items'] = 'ItemController/items';
$route['items/new'] = 'ItemController/new';
$route['items/insert'] = 'ItemController/insert';

$route['categories'] = 'CategoriesController/categories';
$route['users'] = 'UsersController/accounts';
$route['logout'] = 'AuthController/logout';
$route['pos'] = 'pos_con/pos';


$route['customers'] = "CustomersController/index";
$route['customers/insert'] = "CustomersController/insert";
$route['customers/delete/(:any)'] = "CustomersController/destroy/$1";
$route['customers/find'] = "CustomersController/find";
$route['customers/update'] = "CustomersController/update";

$route['suppliers'] = "SuppliersController/index";
$route['suppliers/insert'] = "SuppliersController/insert";
$route['suppliers/delete/(:any)'] = "SuppliersController/destroy/$1";
$route['suppliers/find'] = "SuppliersController/find";
$route['suppliers/update'] = "SuppliersController/update";

$route['deliveries'] = "DeliveriesController/deliveries";
$route['new-delivery'] = "DeliveriesController/index";
$route['delivery/insert'] = "DeliveriesController/insert";

$route['users'] = "UsersController/users";

$route['login'] = 'AuthController/login';
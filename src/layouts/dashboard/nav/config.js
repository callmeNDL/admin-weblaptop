import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    type: 'text',
    subNav: [],
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    type: 'text',
    subNav: [],
    path: '/dashboard/userV2',
    icon: icon('ic_user'),
  },
  {
    title: 'Sản phẩm',
    type: 'text',
    subNav: [],
    path: '/dashboard/productsV2',
    icon: icon('ic_laptop'),
  },
  {
    title: 'Danh sách hóa đơn',
    type: 'text',
    subNav: [],
    path: '/dashboard/listbill',
    icon: icon('ic_ballot'),
  },
  {
    title: 'Nhập hàng',
    type: 'dropdown',
    subNav: [
      {
        title: 'Nhà cung cấp',
        type: 'text',
        subNav: [],
        path: '/dashboard/company',
        icon: icon('ic_ballot'),
      },
      {
        title: 'Nhà sản xuất',
        type: 'text',
        subNav: [],
        path: '/dashboard/brand',
        icon: icon('ic_input'),
      }, {
        title: 'Phiếu nhập hàng',
        type: 'text',
        subNav: [],
        path: '/dashboard/warehouse',
        icon: icon('ic_check'),
      }, {
        title: 'Loại sản phẩm',
        type: 'text',
        subNav: [],
        path: '/dashboard/productType',
        icon: icon('ic_brand'),
      }
    ],
    path: '/',
    icon: icon('ic_laptop'),
  },
  {
    title: 'Thông tin',
    type: 'dropdown',
    subNav: [
      {
        title: 'Bài viết',
        type: 'text',
        subNav: [],
        path: '/dashboard/magazine',
        icon: icon('ic_ballot'),
      },
      {
        title: 'Banner',
        type: 'text',
        subNav: [],
        path: '/dashboard/banner',
        icon: icon('ic_input'),
      }
    ],
    path: '/',
    icon: icon('ic_laptop'),
  },
  {
    title: 'Khuyến mãi',
    type: 'text',
    subNav: [],
    path: '/dashboard/promo',
    icon: icon('ic_user'),
  },
  // {
  //   title: 'Giảm giá',
  //   path: '',
  //   type: 'text',
  //   subNav: [],
  //   icon: icon('ic_dolar'),
  // },
  // {
  //   title: 'Banner',
  //   path: '',
  //   type: 'text',
  //   subNav: [],
  //   icon: icon('ic_image'),
  // },
  // {
  //   title: 'Hoá đơn',
  //   path: '',
  //   type: 'text',
  //   subNav: [],
  //   icon: icon('ic_bill'),
  // },
  // {
  //   title: 'product',
  //   path: '',
  //   type: 'text',
  //   subNav: [],
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '',
  //   type: 'text',
  //   subNav: [],
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   type: 'text',
  //   subNav: [],
  //   icon: icon('ic_lock'),
  // },
  {
    title: 'Not found',
    type: 'text',
    subNav: [],
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;

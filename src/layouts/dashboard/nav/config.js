import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'user',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Sản phẩm',
    path: '/dashboard/user',
    icon: icon('ic_laptop'),
  },
  {
    title: 'Thương hiệu',
    path: '/dashboard/user',
    icon: icon('ic_brand'),
  },
  {
    title: 'Nhà sản xuất',
    path: '/dashboard/user',
    icon: icon('ic_home'),
  },

  {
    title: 'Giảm giá',
    path: '/dashboard/user',
    icon: icon('ic_dolar'),
  },
  {
    title: 'Nhập hàng',
    path: '/dashboard/user',
    icon: icon('ic_input'),
  },
  {
    title: 'Banner',
    path: '/dashboard/user',
    icon: icon('ic_image'),
  },
  {
    title: 'Hoá đơn',
    path: '/dashboard/user',
    icon: icon('ic_bill'),
  },
  {
    title: 'product',
    path: '/dashboard/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;

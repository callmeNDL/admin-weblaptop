import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { get, getAuthToken } from '../services/request/request-service';


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [data, setData] = useState([])

  const getAll = async (id) => {
    const { accessToken } = await getAuthToken();
    if (accessToken) {
      try {
        const res = await get(`dashboardtoday`, {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        });
        if (res?.status === 'OK') {
          setData(res);
        }
        console.log(res, 'res');
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getAll()
  }, [])
  console.log(data, "dash");
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Thống kê 
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Người dùng" total={data?.data?.countUser} icon={'mdi:user'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Sản phẩm" total={data?.data?.countSanPham} color="info" icon={'fluent-mdl2:product-catalog'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Đơn hàng" total={data?.data?.countDonHang} color="warning" icon={'uil:bill'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Loại sản phẩm" total={data?.data?.countLoaiSanPham} color="warning" icon={'mdi:tooltip-text'} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [ 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [ 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
               chartData={data?.chartPies}

              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  '1983, orders, $4220',
                  '12 Invoices have been paid',
                  'Order #37745 from September',
                  'New order placed #XF-2356',
                  'New order placed #XF-2346',
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

import noticeImg from '@/assets/images/landlord/notice.png'
import szxqImg from '@/assets/images/landlord/szxq.png'
import waterImg from '@/assets/images/landlord/water.png'
import wxglImg from '@/assets/images/landlord/wxgl.png'
import zcglImg from '@/assets/images/landlord/zcgl.png'
import zkglImg from '@/assets/images/landlord/zkgl.png'
import RhButton from '@/components/RhButton'
import RhTabbar from '@/components/RhTabbar'
import NavigationService from '@/utils/navigation'
import { Flex, Swiper } from '@taroify/core'
import { Image, Text, View } from '@tarojs/components'
import React from 'react'
import './index.less'

declare const NEED_CUSTOM_TABBAR: boolean

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      currentRoute: '/pages/home/index',
      banners: [
        {
          url:
            'https://huyaimg.msstatic.com/cdnimage/gamebanner/phpP4fHG51652343358.jpg',
          desc: '冠军皮肤',
          navigate: null,
          is_show: '1',
        },
        {
          url:
            'https://huyaimg.msstatic.com/cdnimage/gamebanner/phpCbC3uP1652411742.jpg',
          desc: '云顶之弈',
          navigate: null,
          is_show: '2',
        },
        {
          url:
            'https://huyaimg.msstatic.com/cdnimage/gamebanner/phpGbE65y1594347488.jpg',
          desc: '和我一起健身',
          navigate: null,
          is_show: '3',
        },
      ],
      iconList: [
        {
          url: zcglImg,
          desc: '资产管理',
          navigate: '/pages/landlord/asset-management/asset-management',
          is_show: '1',
        },
        {
          url: zkglImg,
          desc: '入住管理',
          navigate: null,
          is_show: '1',
        },
        {
          url: noticeImg,
          desc: '退租管理',
          navigate: null,
          is_show: '1',
        },
        {
          url: szxqImg,
          desc: '收租详情',
          navigate: null,
          is_show: '1',
        },

        {
          url: waterImg,
          desc: '查抄水电',
          navigate: null,
          is_show: '1',
        },
        {
          url: wxglImg,
          desc: '维修管理',
          navigate: null,
          is_show: '1',
        },
      ],
      financial: {
        collectRentCount: 1, // 代收租
        overdueRentCount: 2, // 租期逾期
        waterElectricity: 4, // 待抄水电
        emptyHouseCount: 10, // 闲置房屋
        dueTenant: 5, // 将到期租客
      },
    }
  }

  handleMore() {}

  handleJump() {
    NavigationService.push('/pagesA/demo/index')
  }

  render() {
    const { financial } = this.state
    return (
      <View className={NEED_CUSTOM_TABBAR ? 'tarbar-page' : ''}>
        <View className='home-page'>
          <Swiper className='banner-swiper' lazyRender autoplay={4000}>
            <Swiper.Indicator />
            {this.state.banners.map((item, index) => {
              const { url, desc } = item
              return (
                <Swiper.Item>
                  <Image key={index} src={url} />
                </Swiper.Item>
              )
            })}
          </Swiper>
          {/* 菜单 */}
          <Flex className='menu' justify='space-between' wrap='wrap'>
            {this.state.iconList.map((item, index) => {
              const { url, desc } = item
              return (
                <Flex.Item span={8} className='menu-item'>
                  <Image src={url} className='icon-img' />
                  <Text className='menu-title'>{desc}</Text>
                </Flex.Item>
              )
            })}
          </Flex>
          {/* 财物状况 */}
          <View className='card card-shadow'>
            <View className='card-header'>
              <View className='card-title text-cyan'>财务概况</View>
              <View className='right-text text-sm' onClick={this.handleMore}>
                查看更多&gt;&gt;
              </View>
            </View>
            <View className='financial-content'>
              <View className='card-item flex-column'>
                <Text className='text-center text-lg'>
                  {financial.collectRentCount || 0}单
                </Text>
                <Text className='text-center text-grey text-sm'>待收租</Text>
              </View>
              <View className='card-item border-left'>
                <Text className='text-center text-lg'>
                  {financial.overdueRentCount || 0}单
                </Text>
                <Text className='text-center text-grey text-sm'>
                  租金逾期未缴
                </Text>
              </View>
              <View className='card-item  border-left'>
                <Text className='text-center text-lg'>
                  {financial.waterElectricity || 0}单
                </Text>
                <Text className='text-center text-grey text-sm'>待抄水电</Text>
              </View>
            </View>
            <View className='financial-content space-between'>
              <View className='card-item flex-column'>
                <Text className='text-center text-lg'>
                  {financial.emptyHouseCount || 0}间
                </Text>
                <Text className='text-center text-grey text-sm'>闲置房屋</Text>
              </View>
              <View className='card-item  border-left'>
                <Text className='text-center text-lg'>
                  {financial.dueTenant || 0}人
                </Text>
                <Text className='text-center text-grey text-sm'>到期租客</Text>
              </View>
              <View className='card-item'></View>
            </View>
          </View>
          <View className='mt-20'>
            <RhButton onClick={this.handleJump}>表单demo页面</RhButton>
          </View>

          {NEED_CUSTOM_TABBAR && (
            <RhTabbar route={this.state.currentRoute}></RhTabbar>
          )}
        </View>
      </View>
    )
  }
}
export default Home

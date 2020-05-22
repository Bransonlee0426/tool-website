import gql from 'graphql-tag';

export const getMeals = gql`
  query meals(
    $brandId:Int,
    $keyWord:String,
    $page:Int
  ){
    Meals(
      brandId:$brandId,
      keyWord:$keyWord,
      page:$page
    ){
      brands{
        id
        image
        name
      }
      searchResponse{
        totalPages
        dishes{
          brandName
          grossWeight
          id
          label
          name
          synonym
          unit
          unitId
          weightUnit
          nutrients{
            id
            calories
            protein
            fats
            carbohydrate
            fruits
            lightMilk
            meatHigh
            meatLow
            meatMedium
            meatSuper
            nuts
            skimMilk
            starchProducts
            vegetables
            wholeMilk
          }
        }
      }
      units{
        id
        text
      }
      weightUnits{
        id
        text
      }
    }
  }
`;

export const provider = gql`
  query provider(
    $page:Int
  ){
    Provider(
      page:$page
    ){
      authTypeId
      id
      memberId
      userId
    }
  }
`;

export const profiles = gql`
  query profiles(
    $memberId:String
  ){
    Profiles(
      memberId:$memberId
    ){
      activity
      birthday
      fcmToken
      gender
      goalWeight
      height
      id
      memberId
      nickname
      weight
    }
  }
`;
export default {
  name: 'query',
  getMeals,
  provider,
  profiles,
};

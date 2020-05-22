import gql from 'graphql-tag';

export const mealsUpdate = gql`
  mutation meals(
    $dishInfo: MealsInput
  ) {
    Meals(
      dishInfo: $dishInfo
    )
  } 
`;

export const mealsDelete = gql`
  mutation mealsDelete(
    $id:String!
  ){
    MealsDelete(
      id:$id
    )
  }
`;

export const brandImageCreate = gql`
  mutation brandImageCreate(
    $brandId:Int
    $image:Upload
    $name:String
  ){
    BrandImageCreate(
      brandId:$brandId
      image:$image
      name:$name
    ){
      brandId
      id
      name
    }
  }
`;

export const brandImageUpdate = gql`
  mutation brandImageUpdate(
    $brandId:Int
    $image:Upload
    $name:String
  ){
    BrandImageUpdate(
      brandId:$brandId
      image:$image
      name:$name
    ){
      brandId
      id
      name
    }
  }
`;


export const unitCreate = gql`
  mutation UnitCreate(
    $text:String
  ){
    UnitCreate(
      text:$text
    ){
      id
      text
    }
  }
`;

export const weightUnitCreate = gql`
  mutation WeightUnitCreate(
    $text:String
  ){
    WeightUnitCreate(
      text:$text
    ){
      id
      text
    }
  }
`;

export const unitDelete = gql`
  mutation UnitDelete(
    $id:Int
  ){
    UnitDelete(
      id:$id
    )
  }
`;

export const weightUnitDelete = gql`
  mutation WeightUnitDelete(
    $id:Int
  ){
    WeightUnitDelete(
      id:$id
    )
  }
`;

export const unitUpdate = gql`
  mutation UnitUpdate(
    $id:Int
    $text:String
  ){
    UnitUpdate(
      id:$id
      text:$text
    ){
      id
      text
    }
  }
`;

export const weightUnitUpdate = gql`
  mutation WeightUnitUpdate(
    $id:Int
    $text:String
  ){
    WeightUnitUpdate(
      id:$id
      text:$text
    ){
      id
      text
    }
  }
`;

export const login = gql`
  mutation Login(
    $account:String!
    $password:String!
  ){
    Login(
      account:$account
      password:$password
    ){
      token
      account
    }
  }
`;

export const mealsCreate = gql`
    mutation mealsCreate(
      $dishInfo: MealsInput
      ){
      MealsCreate(
        dishInfo: $dishInfo
      ){
        brandName
        grossWeight
        id
        label
        name
        synonym
        unit
        unitId
        weightUnit
      }
    }
`;

export const breadsCreate = gql`
  mutation BrandsCreate(
    $name:String
  ){
    BrandsCreate(
      name:$name
    ){
      id
      image
      name
    }
  }
`;

export const brandsDelete = gql`
  mutation brandsDelete(
    $id:Int
  ){
    BrandsDelete(
      id:$id
    )
  }
`;

export const brandsUpdate = gql`
  mutation BrandsUpdate(
    $id:Int
    $name:String
  ){
    BrandsUpdate(
      id:$id
      name:$name
    ){
      id
      name
    }
  }
`;

export default {
  name: 'mutation',
  mealsCreate,
  mealsUpdate,
  mealsDelete,
  brandImageCreate,
  brandImageUpdate,
  unitCreate,
  weightUnitCreate,
  unitDelete,
  weightUnitDelete,
  unitUpdate,
  weightUnitUpdate,
  breadsCreate,
  brandsDelete,
  brandsUpdate,
  login,
};

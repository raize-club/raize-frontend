import { NextPage } from "next";
import { useEffect, useState } from "react";

import "./styles.scss";
import BetHeroCard from "./BetHeroCard";
import { CRICKET_LOGO, US_LOGO } from "../helpers/icons";
import BetCard from "./BetCard";
import { useContract } from "@starknet-react/core";
import abi from "../../abi/ContractABI.json";
import { CONTRACT_ADDRESS } from "../helpers/constants";
import { Market } from "../helpers/types";
import { getNumber, getString } from "../helpers/functions";
interface Props {}

const tabList = [
  {
    tabName: "Trending",
  },
  {
    tabName: "Crypto Market",
  },
  {
    tabName: "UEFA Euros 2024",
  },
  {
    tabName: "Global Politics",
  },
  {
    tabName: "Cricket World Cup",
  },
];

const BetSection: NextPage<Props> = ({}) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [markets, setMarkets] = useState<Market[]>([]);

  const { contract } = useContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
  });

  useEffect(() => {
    const getAllMarkets = () => {
      if (!contract) {
        return;
      }
      contract.getAllMarkets().then((res: any) => {
        setMarkets(res);
      });
    };
    getAllMarkets();
  }, []);

  useEffect(() => {
    setActiveTab(0);
  }, []);
  return (
    <div className='BetSection'>
      <div className='BetSection-Hero'>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={4}
            category='Sports'
            categoryLogo={CRICKET_LOGO}
            categoryName='Cricket World Cup'
            cardBgColor='linear-gradient(67.58deg, #E20000 -0.96%, #9B3838 78.06%)'
            image='/assets/images/kohli.png'
          />
        </div>
        <div className='BetSection-HeroCard'>
          <BetHeroCard
            setActiveTab={setActiveTab}
            categoryIndex={2}
            category='Sports'
            categoryLogo={CRICKET_LOGO}
            categoryName='UEFA Euros 2024'
            cardBgColor='linear-gradient(90deg, #143CDA 0%, #0D268A 100%)'
            image='/assets/images/football.png'
          />
        </div>
      </div>
      <div className='BetSection-CardWrapper'>
        <div className='Tabs-Section'>
          {tabList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveTab(index);
              }}
              className={activeTab === index ? "Tab-Active" : "Tab"}
            >
              {item.tabName}
            </div>
          ))}
        </div>
        <div className='BetCard-Wrapper'>
          {activeTab === 0
            ? markets
                .sort(
                  (a, b) =>
                    parseFloat(getNumber(b.moneyInPool)) -
                    parseFloat(getNumber(a.moneyInPool))
                )
                .map((item, index) => (
                  <div key={index} className='BetCard-Container'>
                    <BetCard
                      marketId={item.marketId}
                      category={item.category}
                      logo={item.image}
                      duration={item.deadline}
                      heading={item.name}
                      betToken={item.betToken}
                      subHeading={item.description}
                      outcomes={item.outcomes}
                      moneyInPool={item.moneyInPool}
                    />
                  </div>
                ))
            : markets
                .filter((market) =>
                  tabList[activeTab].tabName.includes(
                    getString(market.category)
                  )
                )
                .sort(
                  (a, b) =>
                    parseFloat(getNumber(b.moneyInPool)) -
                    parseFloat(getNumber(a.moneyInPool))
                )
                .map((item, index) => (
                  <div key={index} className='BetCard-Container'>
                    <BetCard
                      marketId={item.marketId}
                      category={item.category}
                      logo={item.image}
                      duration={item.deadline}
                      heading={item.name}
                      betToken={item.betToken}
                      subHeading={item.description}
                      outcomes={item.outcomes}
                      moneyInPool={item.moneyInPool}
                    />
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default BetSection;

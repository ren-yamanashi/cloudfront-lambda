import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  IDistribution,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
  PriceClass,
  ResponseHeadersPolicy,
  SecurityPolicyProtocol,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { FunctionUrlOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { IFunctionUrl } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export interface CloudFrontProps {
  readonly functionUrl: IFunctionUrl;
}

export class CloudFront extends Construct {
  public readonly distribution: IDistribution;

  constructor(scope: Construct, id: string, props: CloudFrontProps) {
    super(scope, id);

    const origin = new FunctionUrlOrigin(props.functionUrl);

    const originRequestPolicy = new OriginRequestPolicy(
      this,
      "OriginRequestPolicy",
      {
        // NOTE: lambdaにアクセスする際はlambdaのhostをhostヘッダに含める必要がある
        //       そのため、cloudfrontのhostヘッダを無効化し、originのhostヘッダを有効化する
        headerBehavior: OriginRequestHeaderBehavior.denyList("Host"),
        queryStringBehavior: OriginRequestQueryStringBehavior.none(),
      }
    );

    this.distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        allowedMethods: AllowedMethods.ALLOW_ALL,
        origin,
        originRequestPolicy,
        viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
      },
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      priceClass: PriceClass.PRICE_CLASS_100,
    });
  }
}

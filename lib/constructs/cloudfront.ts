import { Duration } from "aws-cdk-lib";
import {
  CachePolicy,
  Distribution,
  IDistribution,
  OriginRequestHeaderBehavior,
  OriginRequestPolicy,
  OriginRequestQueryStringBehavior,
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

    const cachePolicy = new CachePolicy(this, "CachePolicy", {
      minTtl: Duration.seconds(0),
      maxTtl: Duration.days(365),
      defaultTtl: Duration.hours(24),
    });

    this.distribution = new Distribution(this, "Distribution", {
      defaultBehavior: {
        origin,
        originRequestPolicy,
        cachePolicy,
        viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
      },
    });
  }
}

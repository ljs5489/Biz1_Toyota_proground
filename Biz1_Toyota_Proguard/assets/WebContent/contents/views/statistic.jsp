<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html lang="ko">

<head>
<%@include file="../include/header.jsp"%>
</head>

<body>
	<div data-role="none" id="sub_wrap">
		<!-- ����޴�  -->
		<div data-role="header" id="sub_header">
			<%@include file="../include/menuPop.jsp"%>
			<h1 class="title">������</h1>
			<button class="re" id="btn_reset">
				<span>�ʱ�ȭ</span>
			</button>
		</div>
		<!-- ����޴� �� -->

		<div data-role="content" id="sub_content">
			<div class="inner_con f_mt pb-5">
				<ul class="search_ul" id="tabContent">
					<li class="l_t"><a class="btn_tab on" value="1">����� ��</a></li>
					<li class="l_t"><a class="btn_tab" value="2">���� ��</a></li>
					<li><a class="btn_tab" value="3">���� ��</a></li>
				</ul>
				<table class="ymd wp_100">
					<tr>
						<td class="wp_50"><input type="text" name="" id="from"
							readonly></td>
						<td class="wp_50 pl_10"><input type="text" name="" id="to"
							readonly></td>
					</tr>
				</table>
				<p class="ta_c f_mt">
					<a class="cld_btn" id="btn_search">�˻�</a>
				</p>
			</div>
			<div class="inner_con f_mt">
				<div class="grp_top ta_c">
					<a class="grp_btn_left fl_l" id="btn_left">����������</a> <span><span
						id="startRank">1</span>�� ~ <span id="endRank">10</span>��</span> <a
						class="grp_btn_right fl_r" id="btn_right">����������</a>
				</div>

				<!-- ���� ���� �׷��� ��Ʈ -->
				<div class="grp_lap">
					<div class="grp_bg" id="graphContent">
						<ul>
							<li>200-</li>
							<li>400-</li>
							<li>600-</li>
							<li>800-</li>
							<li>1000-</li>
						</ul>
						<dl>
							<dt class="rankText">1��</dt>
							<dd>
								<div class="bar-red rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">2��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">3��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">4��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">5��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">6��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">7��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">8��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">9��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
						<dl>
							<dt class="rankText">10��</dt>
							<dd>
								<div class="bar rankGraph" style="height: 0%">
									<p style="position: absolute; top: -15px; left: -5px;"
										class="rankGraphNum"></p>
								</div>
							</dd>
						</dl>
					</div>
				</div>
				<!-- //���� ���� �׷��� ��Ʈ -->

				<div class="grp_list pb-1_5">
					<ul id="listTemplate" style="display: none;">
						<li class="record"><span class="rank"></span> <span
							class="text1"></span> <span class="text2"></span> <span
							class="red count"></span></li>
					</ul>
				</div>
			</div>
		</div>
		<!-- /content -->
		<%@include file="../include/footer.jsp"%>
	</div>
	<!-- /page -->

</body>

</html>
